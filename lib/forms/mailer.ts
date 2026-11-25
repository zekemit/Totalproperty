import "server-only";
import type { FetchLike } from "./security";
import type { FormKind } from "./state";

export type OutgoingEmail = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  idempotencyKey?: string;
};

/** Delivery port. The pipeline depends on this interface, not on Resend. */
export interface Mailer {
  send(message: OutgoingEmail): Promise<void>;
}

export type NotificationInput = {
  kind: FormKind;
  /** Ordered label/value pairs shown to staff. Values are user-controlled. */
  fields: [label: string, value: string][];
  /** Free-text body (message, notes, description). User-controlled. */
  message?: string;
  emergency?: boolean;
  /** Short context for the subject line, e.g. "Purcellville, VA". User-controlled. */
  subjectDetail?: string;
};

const TITLES: Record<FormKind, string> = {
  rental_analysis: "New rental analysis request",
  contact: "New website inquiry",
  maintenance: "Maintenance request",
  vendor: "New vendor inquiry",
};

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function subjectLine(input: NotificationInput): string {
  const prefix = input.emergency ? "URGENT: Emergency " + TITLES[input.kind].toLowerCase() : TITLES[input.kind];
  const detail = input.subjectDetail ? ` — ${input.subjectDetail}` : "";
  return `${prefix}${detail}`.replace(/\s+/g, " ").trim().slice(0, 150);
}

/**
 * Staff notification content. The HTML body escapes every user-controlled value;
 * the text body is plain text and therefore needs no escaping.
 */
export function renderNotification(input: NotificationInput): { subject: string; text: string; html: string } {
  const subject = subjectLine(input);

  const textLines = [TITLES[input.kind], "", ...input.fields.map(([l, v]) => `${l}: ${v}`)];
  if (input.message) textLines.push("", "Message:", input.message);
  const text = textLines.join("\n");

  const rows = input.fields
    .map(
      ([l, v]) =>
        `<tr><th align="left" style="padding:4px 12px 4px 0;color:#4f5762;font-weight:600;vertical-align:top">${escapeHtml(l)}</th><td style="padding:4px 0;color:#23272e">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const message = input.message
    ? `<h3 style="margin:20px 0 6px;font-size:14px;color:#12263f">Message</h3><pre style="white-space:pre-wrap;font:inherit;margin:0;color:#23272e">${escapeHtml(input.message)}</pre>`
    : "";
  const banner = input.emergency
    ? `<p style="background:#a3281f;color:#fff;padding:8px 12px;font-weight:700;margin:0 0 12px">Marked as an emergency by the tenant</p>`
    : "";
  const html =
    `<div style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">${banner}` +
    `<h2 style="margin:0 0 12px;font-size:18px;color:#12263f">${escapeHtml(TITLES[input.kind])}</h2>` +
    `<table role="presentation" cellspacing="0" cellpadding="0">${rows}</table>${message}</div>`;

  return { subject, text, html };
}

type ResendOptions = { apiKey: string; from: string; fetchImpl?: FetchLike };

/** Resend over plain `fetch` — one POST, no SDK dependency. */
export function createResendMailer({ apiKey, from, fetchImpl = fetch }: ResendOptions): Mailer {
  return {
    async send(message) {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      if (message.idempotencyKey) headers["Idempotency-Key"] = message.idempotencyKey;
      const res = await fetchImpl("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
          from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html,
          ...(message.replyTo ? { reply_to: message.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(8_000),
      });
      // Do not include the response body: it can echo credentials or recipient data.
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    },
  };
}

const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/;

/** Build the real mailer from env, or null when email is not fully configured. */
export function createMailerFromEnv(
  env: Record<string, string | undefined> = process.env,
  fetchImpl?: FetchLike,
): { mailer: Mailer; to: string[] } | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.EMAIL_FROM?.trim();
  const to = (env.LEAD_NOTIFY_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => EMAIL_RE.test(s));
  if (!apiKey || !from || to.length === 0) return null;
  return { mailer: createResendMailer({ apiKey, from, fetchImpl }), to };
}
