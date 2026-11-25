import "server-only";
import type { AdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/database.types";

type Tables = Database["public"]["Tables"];

export type LeadInsert = Tables["leads"]["Insert"];
export type RentalAnalysisInsert = Omit<Tables["rental_analysis"]["Insert"], "lead_id">;
export type ContactInsert = Omit<Tables["contact_submissions"]["Insert"], "lead_id">;

export type SavedIds = { leadId: string; detailId: string };

/** Persistence port. The pipeline depends on this interface, not on Supabase. */
export interface LeadStore {
  saveRentalAnalysis(lead: LeadInsert, detail: RentalAnalysisInsert): Promise<SavedIds>;
  saveContact(lead: LeadInsert, detail: ContactInsert): Promise<SavedIds>;
}

export class StoreError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
    this.name = "StoreError";
  }
}

/**
 * Supabase-backed store. Two inserts (lead, then detail) with compensation: if the
 * detail insert fails the lead is deleted, so we never keep a half-written
 * submission. Errors expose only the Postgres `code`; Supabase's `details` field can
 * echo the failing row (PII), so it is never logged or surfaced.
 */
export function createSupabaseStore(client: AdminClient): LeadStore {
  async function insertLead(lead: LeadInsert): Promise<string> {
    const { data, error } = await client.from("leads").insert(lead).select("id").single();
    if (error || !data) throw new StoreError("Could not save lead.", error?.code);
    return data.id;
  }

  async function discardLead(leadId: string): Promise<void> {
    const { error } = await client.from("leads").delete().eq("id", leadId);
    if (error) console.error("[store] could not roll back lead", { code: error.code });
  }

  return {
    async saveRentalAnalysis(lead, detail) {
      const leadId = await insertLead(lead);
      const { data, error } = await client
        .from("rental_analysis")
        .insert({ ...detail, lead_id: leadId })
        .select("id")
        .single();
      if (error || !data) {
        await discardLead(leadId);
        throw new StoreError("Could not save rental analysis request.", error?.code);
      }
      return { leadId, detailId: data.id };
    },

    async saveContact(lead, detail) {
      const leadId = await insertLead(lead);
      const { data, error } = await client
        .from("contact_submissions")
        .insert({ ...detail, lead_id: leadId })
        .select("id")
        .single();
      if (error || !data) {
        await discardLead(leadId);
        throw new StoreError("Could not save submission.", error?.code);
      }
      return { leadId, detailId: data.id };
    },
  };
}
