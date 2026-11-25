/**
 * Pure text sanitizer shared by server validation. No Node APIs, so it is safe to
 * import anywhere.
 *
 * It does NOT try to "strip HTML": user text is stored verbatim as inert plain
 * text and escaped at every output boundary (see mailer.ts; React escapes on
 * render). Stripping tags is a lossy, bypass-prone defense; escaping at output is
 * the correct control. What we do remove is content that is never legitimate in a
 * contact form: control characters and invisible/bidirectional-override
 * characters used for spoofing.
 */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
const INVISIBLE_AND_BIDI = /[​-‏‪-‮⁠-⁤⁦-⁩﻿]/g;

export function cleanText(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(INVISIBLE_AND_BIDI, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ ?\n ?/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
