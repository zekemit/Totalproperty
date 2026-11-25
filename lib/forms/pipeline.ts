import "server-only";
import { siteConfig } from "@/lib/site";
import { hashIp, verifyTurnstile, type RateLimiter } from "./security";
import {
  contactSchema,
  maintenanceSchema,
  rentalAnalysisSchema,
  toFieldErrors,
  vendorSchema,
} from "./schemas";
import type { Mailer } from "./mailer";
import { renderNotification } from "./mailer";
import { cleanText } from "./text";
import type { FormKind, FormState } from "./state";
import {
  StoreError,
  type ContactInsert,
  type LeadInsert,
  type LeadStore,
  type RentalAnalysisInsert,
  type SavedIds,
} from "./store";
import type { LeadAudience } from "@/lib/supabase/database.types";


export type PipelineDeps = {
  store: LeadStore | null;
  mailer: Mailer | null;
  notifyTo: string[];
  limiter: RateLimiter;
  turnstileSecret?: string;
  /** Injected in tests; defaults to a real Cloudflare siteverify call. */
  verifyHuman?: (token: string, ip: string) => Promise<boolean>;
  ipHashSecret?: string;
  now: () => number;
  isProduction: boolean;
};

export type SubmissionContext = { ip: string; userAgent: string };

/** Hidden field real users never see or fill. Named to avoid browser autofill heuristics. */
export const HONEYPOT_FIELD = "reference_code";
/** Client-measured milliseconds from page load to submit. Below this, treat as a bot. */
const MIN_HUMAN_FILL_MS = 800;

const MESSAGES = {
  rental_analysis:
    "Thank you. We received your request, and a member of our team will review your property and follow up with your rental analysis.",
  contact: "Thank you for reaching out. A member of our team will get back to you.",
  maintenance: "We received your maintenance request and our team will follow up.",
  vendor: "Thank you. We received your information and will follow up with next steps.",
} satisfies Record<FormKind, string>;

const EMERGENCY_NOTE = ` Because you marked this an emergency, please also call us right now at ${siteConfig.emergencyPhone}.`;
const CONTACT_FALLBACK = `Please call ${siteConfig.phone} or email ${siteConfig.email} and we'll take care of it.`;

function success(kind: FormKind, emergency = false): FormState {
  return { status: "success", message: MESSAGES[kind] + (emergency ? EMERGENCY_NOTE : "") };
}

/** Fields that are never echoed back to the browser. */
const NOT_ECHOED = new Set([HONEYPOT_FIELD, "fillMs", "sourcePath", "cf-turnstile-response", "startedAt"]);

function echoValues(raw: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!NOT_ECHOED.has(key) && !key.startsWith("utm_")) out[key] = value.slice(0, 2000);
  }
  return out;
}

function failure(message: string, raw?: Record<string, string>, fieldErrors?: FormState["fieldErrors"]): FormState {
  return {
    status: "error",
    message,
    ...(fieldErrors ? { fieldErrors } : {}),
    ...(raw ? { values: echoValues(raw) } : {}),
  };
}

function toRecord(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) out[key] = value;
  }
  return out;
}

const SAFE_PATH = /^\/[A-Za-z0-9\-._~/%]*$/;
function safePath(value: string | undefined): string {
  const v = (value ?? "").trim();
  return v.length <= 200 && SAFE_PATH.test(v) ? v : "/";
}

function capped(value: string | undefined, max: number): string | undefined {
  const v = cleanText(value ?? "").slice(0, max);
  return v === "" ? undefined : v;
}

const humanize = (v: string) => v.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

type Prepared = {
  audience: LeadAudience;
  save: (store: LeadStore, lead: LeadInsert) => Promise<SavedIds>;
  fields: [string, string][];
  message?: string;
  emergency?: boolean;
  subjectDetail?: string;
  person: { name: string; email: string; phone?: string; consent: boolean };
};

const TOPIC_AUDIENCE: Record<string, LeadAudience> = {
  general: "other",
  owner: "owner",
  commercial: "commercial",
  construction: "commercial",
  lender: "lender",
  tenant: "tenant",
  vendor: "vendor",
};

type Parsed = { ok: true; prepared: Prepared } | { ok: false; errors: FormState["fieldErrors"] };

function prepare(kind: FormKind, raw: Record<string, string>): Parsed {
  if (kind === "rental_analysis") {
    const r = rentalAnalysisSchema.safeParse(raw);
    if (!r.success) return { ok: false, errors: toFieldErrors(r.error) };
    const d = r.data;
    const detail: RentalAnalysisInsert = {
      street: d.street,
      city: d.city,
      state: d.state,
      zip: d.zip,
      property_type: d.propertyType,
      occupancy: d.occupancy,
      bedrooms: d.bedrooms ?? null,
      current_rent_cents: d.currentRent === undefined ? null : Math.round(d.currentRent * 100),
      timeline: d.timeline,
      notes: d.notes ?? null,
    };
    return {
      ok: true,
      prepared: {
        audience: "owner",
        save: (store, lead) => store.saveRentalAnalysis(lead, detail),
        fields: [
          ["Name", d.name],
          ["Email", d.email],
          ["Phone", d.phone ?? "—"],
          ["Property", `${d.street}, ${d.city}, ${d.state} ${d.zip}`],
          ["Type", humanize(d.propertyType)],
          ["Occupancy", humanize(d.occupancy)],
          ["Bedrooms", d.bedrooms === undefined ? "—" : String(d.bedrooms)],
          ["Current rent", d.currentRent === undefined ? "—" : `$${d.currentRent.toLocaleString("en-US")}/mo`],
          ["Timeline", humanize(d.timeline)],
        ],
        message: d.notes,
        subjectDetail: `${d.city}, ${d.state}`,
        person: { name: d.name, email: d.email, phone: d.phone, consent: d.consent },
      },
    };
  }

  if (kind === "contact") {
    const r = contactSchema.safeParse(raw);
    if (!r.success) return { ok: false, errors: toFieldErrors(r.error) };
    const d = r.data;
    const detail: ContactInsert = { kind: "contact", topic: d.topic, company: d.company ?? null, message: d.message };
    return {
      ok: true,
      prepared: {
        audience: TOPIC_AUDIENCE[d.topic] ?? "other",
        save: (store, lead) => store.saveContact(lead, detail),
        fields: [
          ["Name", d.name],
          ["Email", d.email],
          ["Phone", d.phone ?? "—"],
          ["Company", d.company ?? "—"],
          ["Topic", humanize(d.topic)],
        ],
        message: d.message,
        subjectDetail: humanize(d.topic),
        person: { name: d.name, email: d.email, phone: d.phone, consent: d.consent },
      },
    };
  }

  if (kind === "maintenance") {
    const r = maintenanceSchema.safeParse(raw);
    if (!r.success) return { ok: false, errors: toFieldErrors(r.error) };
    const d = r.data;
    const detail: ContactInsert = {
      kind: "maintenance",
      message: d.description,
      property_address: d.address,
      unit: d.unit ?? null,
      maintenance_category: d.category,
      is_emergency: d.emergency,
      permission_to_enter: d.permissionToEnter,
    };
    return {
      ok: true,
      prepared: {
        audience: "tenant",
        save: (store, lead) => store.saveContact(lead, detail),
        fields: [
          ["Name", d.name],
          ["Email", d.email],
          ["Phone", d.phone],
          ["Address", d.address],
          ["Unit", d.unit ?? "—"],
          ["Category", humanize(d.category)],
          ["Emergency", d.emergency ? "YES" : "No"],
          ["OK to enter if not home", d.permissionToEnter === "yes" ? "Yes" : "No"],
        ],
        message: d.description,
        emergency: d.emergency,
        subjectDetail: d.address,
        person: { name: d.name, email: d.email, phone: d.phone, consent: d.consent },
      },
    };
  }

  const r = vendorSchema.safeParse(raw);
  if (!r.success) return { ok: false, errors: toFieldErrors(r.error) };
  const d = r.data;
  const detail: ContactInsert = {
    kind: "vendor",
    company: d.company,
    vendor_trade: d.trade,
    service_area: d.serviceArea,
    message: d.message ?? "Vendor inquiry.",
  };
  return {
    ok: true,
    prepared: {
      audience: "vendor",
      save: (store, lead) => store.saveContact(lead, detail),
      fields: [
        ["Name", d.name],
        ["Company", d.company],
        ["Email", d.email],
        ["Phone", d.phone],
        ["Trade", humanize(d.trade)],
        ["Service area", d.serviceArea],
      ],
      message: d.message,
      subjectDetail: `${humanize(d.trade)} — ${d.company}`,
      person: { name: d.name, email: d.email, phone: d.phone, consent: d.consent },
    },
  };
}

/**
 * The single path every public form submission takes.
 *
 * Order matters: cheap, silent bot checks first; then rate limit; then Turnstile;
 * then validation; then persistence and notification. Bots get an identical
 * success response so they learn nothing. Real users always get either success or
 * an honest, actionable error, and never a false success in production.
 */
export async function processSubmission(
  deps: PipelineDeps,
  kind: FormKind,
  form: FormData,
  ctx: SubmissionContext,
): Promise<FormState> {
  const raw = toRecord(form);

  if (cleanText(raw[HONEYPOT_FIELD] ?? "") !== "") return success(kind);

  // Absent, blank or non-numeric fill time (JavaScript disabled, tampering) is not penalised.
  const fillMs = raw.fillMs?.trim() ? Number(raw.fillMs) : Number.NaN;
  if (Number.isFinite(fillMs) && fillMs >= 0 && fillMs < MIN_HUMAN_FILL_MS) return success(kind);

  const limit = deps.limiter.check(ctx.ip);
  if (!limit.ok) {
    return failure(
      `Too many requests from your connection. Please wait a few minutes and try again, or call us at ${siteConfig.phone}.`,
      raw,
    );
  }

  if (deps.turnstileSecret) {
    const secret = deps.turnstileSecret;
    const verify = deps.verifyHuman ?? ((token: string, ip: string) => verifyTurnstile(token, secret, ip));
    const human = await verify(raw["cf-turnstile-response"] ?? "", ctx.ip);
    if (!human) return failure("We couldn't verify that you're human. Please try again.", raw);
  }

  const parsed = prepare(kind, raw);
  if (!parsed.ok) return failure("Please fix the highlighted fields and try again.", raw, parsed.errors);
  const p = parsed.prepared;

  const lead: LeadInsert = {
    audience: p.audience,
    source_path: safePath(raw.sourcePath),
    name: p.person.name,
    email: p.person.email,
    phone: p.person.phone,
    consent_contact: true,
    utm_source: capped(raw.utm_source, 100),
    utm_medium: capped(raw.utm_medium, 100),
    utm_campaign: capped(raw.utm_campaign, 100),
    ip_hash: deps.ipHashSecret && ctx.ip !== "unknown" ? hashIp(ctx.ip, deps.ipHashSecret) : undefined,
    user_agent: capped(ctx.userAgent, 300),
  };

  let leadId: string | undefined;
  let stored = false;
  let emailed = false;

  if (deps.store) {
    try {
      leadId = (await p.save(deps.store, lead)).leadId;
      stored = true;
    } catch (error) {
      console.error("[lead] storage failed", { kind, code: error instanceof StoreError ? error.code : undefined });
    }
  }

  if (deps.mailer && deps.notifyTo.length > 0) {
    try {
      const fields: [string, string][] = [...p.fields, ["Submitted from", lead.source_path]];
      if (leadId) fields.push(["Lead ID", leadId]);
      const content = renderNotification({
        kind,
        fields,
        message: p.message,
        emergency: p.emergency,
        subjectDetail: p.subjectDetail,
      });
      await deps.mailer.send({ to: deps.notifyTo, ...content, replyTo: p.person.email, idempotencyKey: leadId });
      emailed = true;
    } catch (error) {
      console.error("[lead] email failed", { kind, error: error instanceof Error ? error.message : "unknown" });
    }
  }

  if (stored || emailed) return success(kind, p.emergency);

  if (!deps.store && !deps.mailer && !deps.isProduction) {
    console.warn("[lead] no database or email configured; submission validated but not delivered", { kind });
    return {
      status: "success",
      message: `${MESSAGES[kind]} (Preview mode: this site isn't connected to a database or email yet, so nothing was stored or sent.)`,
    };
  }

  console.error("[lead] submission could not be delivered", { kind, configured: { store: !!deps.store, mailer: !!deps.mailer } });
  return failure(`We couldn't send your request right now. ${CONTACT_FALLBACK}`, raw);
}
