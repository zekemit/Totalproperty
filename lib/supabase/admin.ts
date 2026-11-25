import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type AdminClient = SupabaseClient<Database>;

let cached: AdminClient | null | undefined;

/**
 * Service-role Supabase client. BYPASSES ROW-LEVEL SECURITY — it must only be used
 * from server code (this module imports `server-only`, so bundling it into a client
 * component fails the build). Returns null when Supabase is not configured so
 * callers can degrade honestly instead of crashing.
 */
export function createAdminClient(env: Record<string, string | undefined> = process.env): AdminClient | null {
  const url = env.SUPABASE_URL?.trim();
  const key = env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/** Process-wide singleton for the default environment. */
export function getAdminClient(): AdminClient | null {
  if (cached === undefined) cached = createAdminClient();
  return cached;
}
