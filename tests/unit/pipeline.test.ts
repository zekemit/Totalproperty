import { beforeEach, describe, expect, it, vi } from "vitest";
import { processSubmission, type PipelineDeps } from "@/lib/forms/pipeline";
import { createRateLimiter } from "@/lib/forms/security";
import type { LeadStore } from "@/lib/forms/store";
import type { Mailer } from "@/lib/forms/mailer";

const NOW = 1_800_000_000_000;
const ctx = { ip: "203.0.113.9", userAgent: "vitest" };

const person = { name: "Jane Owner", email: "jane@example.com", phone: "202-528-0140", consent: "on" };
const rental = {
  ...person, street: "123 Main St", city: "Purcellville", state: "VA", zip: "20132",
  propertyType: "single_family", occupancy: "tenant_in_place", timeline: "asap", currentRent: "2,450",
  sourcePath: "/owners", fillMs: "10000",
};

function form(values: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

type Mocks = { store: LeadStore & { saveRentalAnalysis: ReturnType<typeof vi.fn>; saveContact: ReturnType<typeof vi.fn> }; mailer: Mailer & { send: ReturnType<typeof vi.fn> } };

function makeDeps(over: Partial<PipelineDeps> = {}): { deps: PipelineDeps } & Mocks {
  const store = {
    saveRentalAnalysis: vi.fn(async () => ({ leadId: "lead-1", detailId: "d-1" })),
    saveContact: vi.fn(async () => ({ leadId: "lead-2", detailId: "d-2" })),
  };
  const mailer = { send: vi.fn(async () => undefined) };
  const deps: PipelineDeps = {
    store, mailer, notifyTo: ["ops@example.com"],
    limiter: createRateLimiter({ limit: 100, windowMs: 60_000, now: () => NOW }),
    ipHashSecret: "unit-test-secret-unit-test-secret",
    now: () => NOW, isProduction: true,
    ...over,
  };
  return { deps, store, mailer };
}

beforeEach(() => vi.restoreAllMocks());

describe("success path", () => {
  it("stores an owner lead + rental analysis, emails staff, and returns success", async () => {
    const { deps, store, mailer } = makeDeps();
    const res = await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect(res.status).toBe("success");
    const [lead, detail] = store.saveRentalAnalysis.mock.calls[0] as unknown as [Record<string, unknown>, Record<string, unknown>];
    expect(lead).toMatchObject({ audience: "owner", source_path: "/owners", email: "jane@example.com", phone: "+12025280140", consent_contact: true });
    expect(detail).toMatchObject({ state: "VA", zip: "20132", current_rent_cents: 245000, property_type: "single_family" });
    expect(mailer.send).toHaveBeenCalledOnce();
    expect(mailer.send.mock.calls[0]?.[0]).toMatchObject({ to: ["ops@example.com"], replyTo: "jane@example.com" });
  });

  it("[review focus 1] stores markup as inert text and escapes it in the email", async () => {
    const { deps, store, mailer } = makeDeps();
    await processSubmission(deps, "rental_analysis", form({ ...rental, notes: "<script>alert(1)</script>\u0000" }), ctx);
    const detail = store.saveRentalAnalysis.mock.calls[0]?.[1] as { notes: string };
    expect(detail.notes).toBe("<script>alert(1)</script>");
    const sent = mailer.send.mock.calls[0]?.[0] as { html: string };
    expect(sent.html).not.toContain("<script>");
    expect(sent.html).toContain("&lt;script&gt;");
  });

  it("never stores the raw IP; stores a 64-hex HMAC instead", async () => {
    const { deps, store } = makeDeps();
    await processSubmission(deps, "rental_analysis", form(rental), ctx);
    const lead = store.saveRentalAnalysis.mock.calls[0]?.[0] as { ip_hash: string };
    expect(lead.ip_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(store.saveRentalAnalysis.mock.calls)).not.toContain(ctx.ip);
  });

  it("omits ip_hash when no secret is configured", async () => {
    const { deps, store } = makeDeps({ ipHashSecret: undefined });
    await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect((store.saveRentalAnalysis.mock.calls[0]?.[0] as { ip_hash?: string }).ip_hash).toBeUndefined();
  });

  it("rejects a hostile sourcePath and truncates UTM values", async () => {
    const { deps, store } = makeDeps();
    await processSubmission(deps, "rental_analysis", form({ ...rental, sourcePath: "javascript:alert(1)", utm_source: "x".repeat(300) }), ctx);
    const lead = store.saveRentalAnalysis.mock.calls[0]?.[0] as { source_path: string; utm_source: string };
    expect(lead.source_path).toBe("/");
    expect(lead.utm_source).toHaveLength(100);
  });
});

describe("contact, maintenance and vendor mapping", () => {
  const contact = { ...person, topic: "construction", message: "We need a build-out managed.", sourcePath: "/contact", fillMs: "9000" };
  it("maps contact topics to lead audiences", async () => {
    const { deps, store } = makeDeps();
    await processSubmission(deps, "contact", form(contact), ctx);
    expect(store.saveContact.mock.calls[0]?.[0]).toMatchObject({ audience: "commercial" });
    expect(store.saveContact.mock.calls[0]?.[1]).toMatchObject({ kind: "contact", topic: "construction" });
  });
  it("flags emergency maintenance in the email and tells the tenant to call", async () => {
    const { deps, store, mailer } = makeDeps();
    const res = await processSubmission(deps, "maintenance", form({
      ...person, address: "45 Elm St", category: "plumbing", description: "Pipe burst in the basement now.",
      emergency: "on", permissionToEnter: "yes", sourcePath: "/tenants", fillMs: "9000",
    }), ctx);
    expect(res.status).toBe("success");
    expect(res.message).toContain("202-528-0140");
    expect(store.saveContact.mock.calls[0]?.[1]).toMatchObject({ kind: "maintenance", is_emergency: true, maintenance_category: "plumbing" });
    expect((mailer.send.mock.calls[0]?.[0] as { subject: string }).subject).toMatch(/^URGENT/);
  });
  it("stores vendor inquiries", async () => {
    const { deps, store } = makeDeps();
    const res = await processSubmission(deps, "vendor", form({
      ...person, company: "Blue Ridge HVAC", trade: "hvac", serviceArea: "Loudoun", sourcePath: "/vendors", fillMs: "9000",
    }), ctx);
    expect(res.status).toBe("success");
    expect(store.saveContact.mock.calls[0]?.[0]).toMatchObject({ audience: "vendor" });
    expect(store.saveContact.mock.calls[0]?.[1]).toMatchObject({ kind: "vendor", vendor_trade: "hvac", company: "Blue Ridge HVAC" });
  });
});

describe("[review focus 2] bots", () => {
  it("silently succeeds without storing or emailing when the honeypot is filled", async () => {
    const { deps, store, mailer } = makeDeps();
    const res = await processSubmission(deps, "rental_analysis", form({ ...rental, reference_code: "spam" }), ctx);
    expect(res.status).toBe("success");
    expect(store.saveRentalAnalysis).not.toHaveBeenCalled();
    expect(mailer.send).not.toHaveBeenCalled();
  });
  it("silently succeeds when the client reports a sub-second fill time (bot)", async () => {
    const { deps, store } = makeDeps();
    const res = await processSubmission(deps, "rental_analysis", form({ ...rental, fillMs: "300" }), ctx);
    expect(res.status).toBe("success");
    expect(store.saveRentalAnalysis).not.toHaveBeenCalled();
  });
  it("lets a fast human through (autofill + click ≈ 1.5 s) and ignores a garbage or negative fillMs", async () => {
    for (const fillMs of ["1500", "abc", "-5", ""]) {
      const { deps, store } = makeDeps();
      await processSubmission(deps, "rental_analysis", form({ ...rental, fillMs }), ctx);
      expect(store.saveRentalAnalysis).toHaveBeenCalledOnce();
    }
  });
  it("does not penalise a missing fill time (JavaScript disabled)", async () => {
    const { deps, store } = makeDeps();
    const { fillMs: _f, ...noTs } = rental;
    expect((await processSubmission(deps, "rental_analysis", form(noTs), ctx)).status).toBe("success");
    expect(store.saveRentalAnalysis).toHaveBeenCalledOnce();
  });
});

describe("[review focus 3] rate limiting", () => {
  it("blocks an IP after the limit with a helpful message, and does not store the blocked request", async () => {
    const { deps, store } = makeDeps({ limiter: createRateLimiter({ limit: 2, windowMs: 60_000, now: () => NOW }) });
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
    const third = await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect(third.status).toBe("error");
    expect(third.message).toMatch(/too many/i);
    expect(third.message).toContain("202-528-0140");
    expect(store.saveRentalAnalysis).toHaveBeenCalledTimes(2);
  });
  it("limits per IP, not globally", async () => {
    const { deps } = makeDeps({ limiter: createRateLimiter({ limit: 1, windowMs: 60_000, now: () => NOW }) });
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
    expect((await processSubmission(deps, "rental_analysis", form(rental), { ...ctx, ip: "198.51.100.7" })).status).toBe("success");
  });
});

describe("Turnstile", () => {
  it("requires a valid token when a secret is configured", async () => {
    const verifyHuman = vi.fn(async (token: string) => token === "good");
    const { deps, store } = makeDeps({ turnstileSecret: "s", verifyHuman });
    const bad = await processSubmission(deps, "rental_analysis", form({ ...rental, "cf-turnstile-response": "bad" }), ctx);
    expect(bad.status).toBe("error");
    const missing = await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect(missing.status).toBe("error");
    expect(store.saveRentalAnalysis).not.toHaveBeenCalled();
    const good = await processSubmission(deps, "rental_analysis", form({ ...rental, "cf-turnstile-response": "good" }), ctx);
    expect(good.status).toBe("success");
  });
  it("is skipped when no secret is configured", async () => {
    const verifyHuman = vi.fn(async () => false);
    const { deps } = makeDeps({ verifyHuman });
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
    expect(verifyHuman).not.toHaveBeenCalled();
  });
});

describe("validation", () => {
  it("returns field errors and persists nothing", async () => {
    const { deps, store, mailer } = makeDeps();
    const res = await processSubmission(deps, "rental_analysis", form({ ...rental, email: "nope", zip: "1" }), ctx);
    expect(res.status).toBe("error");
    expect(res.fieldErrors?.email?.length).toBeGreaterThan(0);
    expect(res.fieldErrors?.zip?.length).toBeGreaterThan(0);
    expect(store.saveRentalAnalysis).not.toHaveBeenCalled();
    expect(mailer.send).not.toHaveBeenCalled();
  });
});

describe("echoing values on error", () => {
  it("returns what the user typed so the form isn't wiped, minus internal and token fields", async () => {
    const { deps } = makeDeps();
    const res = await processSubmission(
      deps,
      "rental_analysis",
      form({ ...rental, email: "nope", "cf-turnstile-response": "tok", reference_code: "", utm_source: "ad" }),
      ctx,
    );
    expect(res.values).toMatchObject({ name: "Jane Owner", email: "nope", street: "123 Main St", state: "VA" });
    expect(res.values).not.toHaveProperty("cf-turnstile-response");
    expect(res.values).not.toHaveProperty("fillMs");
    expect(res.values).not.toHaveProperty("sourcePath");
    expect(res.values).not.toHaveProperty("utm_source");
  });
  it("does not echo anything on success", async () => {
    const { deps } = makeDeps();
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).values).toBeUndefined();
  });
});

describe("[review focus 4] partial infrastructure", () => {
  it("succeeds when the store works but email fails, logging no PII", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const { deps, mailer } = makeDeps();
    mailer.send.mockRejectedValueOnce(new Error("Resend 500"));
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
    expect(JSON.stringify(err.mock.calls)).not.toContain("jane@example.com");
  });
  it("succeeds when email works but the store fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { deps, store } = makeDeps();
    store.saveRentalAnalysis.mockRejectedValueOnce(new Error("db down"));
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
  });
  it("errors honestly when the store fails and email is not configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { deps, store } = makeDeps({ mailer: null });
    store.saveRentalAnalysis.mockRejectedValueOnce(new Error("db down"));
    const res = await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect(res.status).toBe("error");
    expect(res.message).toContain("202-528-0140");
  });
  it("accepts email-only operation (no database configured)", async () => {
    const { deps, mailer } = makeDeps({ store: null });
    expect((await processSubmission(deps, "rental_analysis", form(rental), ctx)).status).toBe("success");
    expect(mailer.send).toHaveBeenCalledOnce();
  });
  it("in production, with nothing configured, never pretends success", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { deps } = makeDeps({ store: null, mailer: null, isProduction: true });
    const res = await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect(res.status).toBe("error");
    expect(res.message).toContain("info@totalproperty.us");
  });
  it("in preview/development, with nothing configured, succeeds but says so", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { deps } = makeDeps({ store: null, mailer: null, isProduction: false });
    const res = await processSubmission(deps, "rental_analysis", form(rental), ctx);
    expect(res.status).toBe("success");
    expect(res.message).toMatch(/preview/i);
  });
});
