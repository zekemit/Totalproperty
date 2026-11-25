"use server";

import { revalidatePath, updateTag } from "next/cache";
import { isAdmin } from "@/lib/admin/auth";
import { StorageConflictError, StorageReadonlyError, resolveStorage } from "@/lib/cms-storage";
import { compactDoc, effectiveDoc } from "@/lib/cms/content";
import { normalizeDoc } from "@/lib/cms/normalize";
import { cmsDocSchema, type FullCmsDoc } from "@/lib/cms/schema";

export type SaveResult =
  | { ok: true; rev: number; savedAt: string; doc: FullCmsDoc }
  | { ok: false; code: "auth" | "invalid" | "conflict" | "readonly" | "error"; message: string; issues?: { path: string; message: string }[] };

/**
 * Save everything on the admin form. Every step that matters happens here, on the server:
 * session check, Zod validation (safe links and pictures only), optimistic-concurrency write, and
 * an immediate revalidation so visitors see the change within seconds.
 * Server Actions are public endpoints, so the session is verified on every call.
 */
export async function saveContent(input: { rev: number; doc: unknown }): Promise<SaveResult> {
  if (!(await isAdmin())) return { ok: false, code: "auth", message: "Your session ended. Sign in again, then save." };

  const full = cmsDocSchema.required().safeParse(input.doc && typeof input.doc === "object" ? normalizeDoc(input.doc as FullCmsDoc) : input.doc);
  if (!full.success) {
    return {
      ok: false,
      code: "invalid",
      message: "Some entries need attention before this can be saved.",
      issues: full.error.issues.slice(0, 40).map((i) => ({ path: i.path.join("."), message: i.message })),
    };
  }

  const stored = compactDoc(full.data as FullCmsDoc);
  // Belt and braces: the compacted document must itself be valid, or we would store something unreadable.
  const check = cmsDocSchema.safeParse(stored);
  if (!check.success) return { ok: false, code: "error", message: "We couldn't prepare your changes for saving. Nothing was changed." };

  try {
    const saved = await resolveStorage().write(check.data, Number.isInteger(input.rev) ? input.rev : 0);
    // Pages are statically generated; this makes every one regenerate with the new content on its next visit.
    revalidatePath("/", "layout");
    updateTag("cms");
    return { ok: true, rev: saved.rev, savedAt: saved.updatedAt, doc: effectiveDoc(check.data) };
  } catch (error) {
    if (error instanceof StorageConflictError) {
      return { ok: false, code: "conflict", message: "The site was saved from another window or device since you opened this page. Reload to see the latest, then make your change again." };
    }
    if (error instanceof StorageReadonlyError) {
      return { ok: false, code: "readonly", message: "No database is connected yet, so changes can't be saved. See the notice at the top of this page." };
    }
    console.error("[admin] save failed", error instanceof Error ? error.message : "");
    return { ok: false, code: "error", message: "We couldn't save just now. Nothing was changed. Please try again in a moment." };
  }
}
