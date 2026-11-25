import { describe, expect, it, vi } from "vitest";
import { createMailerFromEnv, createResendMailer, escapeHtml, renderNotification } from "@/lib/forms/mailer";

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe("&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;");
  });
});

describe("renderNotification", () => {
  const base = {
    kind: "rental_analysis" as const,
    fields: [["Name", "Jane <b>Owner</b>"], ["Email", "jane@example.com"]] as [string, string][],
    message: "Line one\n<script>alert(1)</script>",
    subjectDetail: "Purcellville, VA",
  };
  it("escapes every user-controlled value in the HTML body", () => {
    const { html } = renderNotification(base);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>Owner</b>");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).toContain("Jane &lt;b&gt;Owner&lt;/b&gt;");
  });
  it("keeps the plain-text body readable and unescaped", () => {
    const { text } = renderNotification(base);
    expect(text).toContain("Name: Jane <b>Owner</b>");
    expect(text).toContain("<script>alert(1)</script>");
  });
  it("builds a single-line subject (no header injection) with a length cap", () => {
    const { subject } = renderNotification({ ...base, subjectDetail: "Evil\r\nBcc: x@y.com " + "z".repeat(300) });
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject.length).toBeLessThanOrEqual(160);
  });
  it("flags emergencies in the subject", () => {
    expect(renderNotification({ ...base, kind: "maintenance", emergency: true }).subject).toMatch(/^URGENT/);
    expect(renderNotification({ ...base, kind: "maintenance" }).subject).not.toMatch(/URGENT/);
  });
});

describe("createResendMailer", () => {
  const msg = { to: ["ops@example.com"], subject: "S", text: "t", html: "<p>h</p>", replyTo: "jane@example.com", idempotencyKey: "lead-1" };
  it("POSTs JSON to the Resend API with bearer auth, reply_to and an idempotency key", async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ id: "e1" }), { status: 200 }));
    await createResendMailer({ apiKey: "re_test", from: "Total Property <n@totalproperty.us>", fetchImpl: f }).send(msg);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer re_test");
    expect(headers["Idempotency-Key"]).toBe("lead-1");
    expect(JSON.parse(String(init.body))).toMatchObject({
      from: "Total Property <n@totalproperty.us>", to: ["ops@example.com"], subject: "S", reply_to: "jane@example.com",
    });
  });
  it("throws a non-sensitive error on a non-2xx response", async () => {
    const f = vi.fn(async () => new Response(JSON.stringify({ message: "bad key re_test" }), { status: 401 }));
    const err = await createResendMailer({ apiKey: "re_test", from: "a@b.com", fetchImpl: f }).send(msg).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(Error);
    expect(String((err as Error).message)).toContain("401");
    expect(String((err as Error).message)).not.toContain("re_test");
  });
});

describe("createMailerFromEnv", () => {
  it("returns null unless key, from and at least one valid recipient are configured", () => {
    expect(createMailerFromEnv({})).toBeNull();
    expect(createMailerFromEnv({ RESEND_API_KEY: "k", EMAIL_FROM: "a@b.com" })).toBeNull();
    expect(createMailerFromEnv({ RESEND_API_KEY: "k", EMAIL_FROM: "a@b.com", LEAD_NOTIFY_TO: "not-an-email" })).toBeNull();
  });
  it("parses and validates a comma-separated recipient list", () => {
    const r = createMailerFromEnv({ RESEND_API_KEY: "k", EMAIL_FROM: "a@b.com", LEAD_NOTIFY_TO: "x@y.com, bad, z@y.com" });
    expect(r?.to).toEqual(["x@y.com", "z@y.com"]);
  });
});
