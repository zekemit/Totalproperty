/**
 * Link and image validation for anything an editor can type into /admin.
 * Pure functions: used by the Zod schema (on save) and by renderers (defence in depth).
 *
 * Links may be https://, http://, mailto:, tel:, or a site path starting with a single "/".
 * Images may be https:// or a site path (http images would be blocked as mixed content).
 * Everything else (javascript:, data:, vbscript:, //evil.com, backslash tricks, embedded
 * whitespace or control characters, URLs with credentials) is rejected.
 */

const BAD_CHARS = /[\s\u0000-\u001f\u007f\\]/;

function isWebUrl(value: string, protocols: readonly string[]): boolean {
  try {
    const u = new URL(value);
    return protocols.includes(u.protocol) && u.hostname.length > 0 && !u.username && !u.password;
  } catch {
    return false;
  }
}

function isSitePath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

export function isSafeHref(raw: string): boolean {
  const v = raw.trim();
  if (v === "" || v.length > 500 || BAD_CHARS.test(v)) return false;
  if (isSitePath(v)) return true;
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@?]+(\?.*)?$/i.test(v)) return true;
  if (/^tel:\+?[\d().-]{7,20}$/i.test(v)) return true;
  return isWebUrl(v, ["https:", "http:"]);
}

export function isSafeImageSrc(raw: string): boolean {
  const v = raw.trim();
  if (v === "" || v.length > 500 || BAD_CHARS.test(v)) return false;
  if (isSitePath(v)) return true;
  return isWebUrl(v, ["https:"]);
}

export function isHttpsUrl(raw: string): boolean {
  const v = raw.trim();
  return v.length <= 500 && !BAD_CHARS.test(v) && isWebUrl(v, ["https:"]);
}

/** Render-time guard: returns the link only if it is safe, else undefined. */
export function safeHref(raw: string | undefined): string | undefined {
  const v = raw?.trim();
  return v && isSafeHref(v) ? v : undefined;
}

export function safeImage(raw: string | undefined): string | undefined {
  const v = raw?.trim();
  return v && isSafeImageSrc(v) ? v : undefined;
}

/** True for links that leave the site (open in a new tab with rel=noopener). */
export function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
