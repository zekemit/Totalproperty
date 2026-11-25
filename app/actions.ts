"use server";

import { headers } from "next/headers";
import { processSubmission } from "@/lib/forms/pipeline";
import { clientIp, getPipelineDeps } from "@/lib/forms/runtime";
import type { FormKind, FormState } from "@/lib/forms/state";

/**
 * Server Actions are public HTTP endpoints. Next.js verifies the Origin header
 * against Host (CSRF); everything else — bot checks, rate limiting, validation —
 * happens inside `processSubmission`.
 */
async function handle(kind: FormKind, formData: FormData): Promise<FormState> {
  const h = await headers();
  return processSubmission(getPipelineDeps(), kind, formData, {
    ip: clientIp(h),
    userAgent: h.get("user-agent") ?? "",
  });
}

export async function submitRentalAnalysis(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle("rental_analysis", formData);
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle("contact", formData);
}

export async function submitMaintenance(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle("maintenance", formData);
}

export async function submitVendor(_prev: FormState, formData: FormData): Promise<FormState> {
  return handle("vendor", formData);
}
