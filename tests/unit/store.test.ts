import { describe, expect, it, vi } from "vitest";
import { createSupabaseStore, StoreError, type ContactInsert, type LeadInsert, type RentalAnalysisInsert } from "@/lib/forms/store";
import type { AdminClient } from "@/lib/supabase/admin";

type Result = { data: { id: string } | null; error: { code: string; message: string; details?: string } | null };

/** Minimal chainable fake of the supabase-js calls the store makes. */
function fakeClient(results: Record<string, Result>) {
  const calls: { table: string; op: string; payload?: unknown; eq?: [string, unknown] }[] = [];
  const client = {
    from(table: string) {
      return {
        insert(payload: unknown) {
          calls.push({ table, op: "insert", payload });
          return { select: () => ({ single: async () => results[table] ?? { data: null, error: { code: "x", message: "no result" } } }) };
        },
        delete() {
          return {
            eq: async (col: string, val: unknown) => {
              calls.push({ table, op: "delete", eq: [col, val] });
              return { error: null };
            },
          };
        },
      };
    },
  } as unknown as AdminClient;
  return { client, calls };
}

const lead: LeadInsert = { audience: "owner", source_path: "/owners", name: "Jane Owner", email: "jane@example.com", consent_contact: true };
const analysis: RentalAnalysisInsert = {
  street: "123 Main St", city: "Purcellville", state: "VA", zip: "20132",
  property_type: "single_family", occupancy: "tenant_in_place", timeline: "asap",
};
const contact: ContactInsert = { kind: "contact", topic: "general", message: "Hello there, I have a question." };

describe("createSupabaseStore", () => {
  it("inserts the lead, then the detail row linked by lead_id, and returns both ids", async () => {
    const { client, calls } = fakeClient({
      leads: { data: { id: "lead-1" }, error: null },
      rental_analysis: { data: { id: "ra-1" }, error: null },
    });
    const ids = await createSupabaseStore(client).saveRentalAnalysis(lead, analysis);
    expect(ids).toEqual({ leadId: "lead-1", detailId: "ra-1" });
    expect(calls.map((c) => `${c.op}:${c.table}`)).toEqual(["insert:leads", "insert:rental_analysis"]);
    expect(calls[1]?.payload).toMatchObject({ lead_id: "lead-1", zip: "20132" });
  });

  it("rolls the lead back when the detail insert fails, and surfaces only the code", async () => {
    const { client, calls } = fakeClient({
      leads: { data: { id: "lead-2" }, error: null },
      contact_submissions: { data: null, error: { code: "23514", message: "violates check", details: "Failing row contains (jane@example.com)" } },
    });
    const err = await createSupabaseStore(client).saveContact(lead, contact).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(StoreError);
    expect((err as StoreError).code).toBe("23514");
    expect((err as StoreError).message).not.toContain("jane@example.com");
    expect(calls.at(-1)).toMatchObject({ table: "leads", op: "delete", eq: ["id", "lead-2"] });
  });

  it("does not attempt the detail insert when the lead insert fails", async () => {
    const { client, calls } = fakeClient({ leads: { data: null, error: { code: "42501", message: "denied" } } });
    await expect(createSupabaseStore(client).saveContact(lead, contact)).rejects.toBeInstanceOf(StoreError);
    expect(calls.map((c) => c.table)).toEqual(["leads"]);
  });

  it("logs a rollback failure without PII", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { client } = fakeClient({
      leads: { data: { id: "lead-3" }, error: null },
      rental_analysis: { data: null, error: { code: "23505", message: "dup" } },
    });
    await expect(createSupabaseStore(client).saveRentalAnalysis(lead, analysis)).rejects.toBeInstanceOf(StoreError);
    spy.mockRestore();
  });
});
