/**
 * Database types for the public schema.
 *
 * Hand-maintained to match `supabase/migrations/*.sql` (the repo has no linked
 * Supabase project yet). Once a project is linked, regenerate with:
 *   npx supabase gen types typescript --project-id <ref> --schema public > lib/supabase/database.types.ts
 * and keep the union aliases below, which the app imports.
 */

export type LeadAudience = "owner" | "commercial" | "lender" | "tenant" | "vendor" | "other";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost" | "spam";
export type RentalAnalysisStatus = "new" | "in_progress" | "delivered" | "closed";
export type ContactKind = "contact" | "maintenance" | "vendor";
export type ContactStatus = "new" | "in_progress" | "resolved" | "closed";

type LeadRow = {
  id: string;
  created_at: string;
  audience: LeadAudience;
  source_path: string;
  name: string;
  email: string;
  phone: string | null;
  consent_contact: boolean;
  consent_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  status: LeadStatus;
};

type RentalAnalysisRow = {
  id: string;
  lead_id: string;
  created_at: string;
  street: string;
  city: string;
  state: "VA" | "MD" | "PA" | "DC";
  zip: string;
  property_type: "single_family" | "townhome" | "condo" | "small_multifamily" | "other";
  occupancy: "vacant" | "tenant_in_place" | "owner_occupied" | "new_purchase";
  bedrooms: number | null;
  current_rent_cents: number | null;
  timeline: "asap" | "one_to_three_months" | "exploring";
  notes: string | null;
  status: RentalAnalysisStatus;
};

type ContactSubmissionRow = {
  id: string;
  lead_id: string;
  created_at: string;
  kind: ContactKind;
  topic: "general" | "owner" | "commercial" | "construction" | "lender" | "tenant" | "vendor" | null;
  company: string | null;
  message: string;
  property_address: string | null;
  unit: string | null;
  maintenance_category: "plumbing" | "heating_cooling" | "electrical" | "appliance" | "pest" | "exterior" | "other" | null;
  is_emergency: boolean;
  permission_to_enter: "yes" | "no" | null;
  vendor_trade:
    | "general_contractor"
    | "hvac"
    | "plumbing"
    | "electrical"
    | "roofing"
    | "landscaping_snow"
    | "cleaning_turnover"
    | "painting"
    | "pest"
    | "other"
    | null;
  service_area: string | null;
  status: ContactStatus;
};

/** Columns with a database default become optional on insert. */
type WithDefaults<Row, Keys extends keyof Row> = Omit<Row, Keys> & Partial<Pick<Row, Keys>>;

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: LeadRow;
        Insert: WithDefaults<
          LeadRow,
          | "id"
          | "created_at"
          | "consent_at"
          | "status"
          | "phone"
          | "utm_source"
          | "utm_medium"
          | "utm_campaign"
          | "ip_hash"
          | "user_agent"
        >;
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      rental_analysis: {
        Row: RentalAnalysisRow;
        Insert: WithDefaults<
          RentalAnalysisRow,
          "id" | "created_at" | "status" | "bedrooms" | "current_rent_cents" | "notes"
        >;
        Update: Partial<RentalAnalysisRow>;
        Relationships: [
          {
            foreignKeyName: "rental_analysis_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_submissions: {
        Row: ContactSubmissionRow;
        Insert: WithDefaults<
          ContactSubmissionRow,
          | "id"
          | "created_at"
          | "status"
          | "topic"
          | "company"
          | "property_address"
          | "unit"
          | "maintenance_category"
          | "is_emergency"
          | "permission_to_enter"
          | "vendor_trade"
          | "service_area"
        >;
        Update: Partial<ContactSubmissionRow>;
        Relationships: [
          {
            foreignKeyName: "contact_submissions_lead_id_fkey";
            columns: ["lead_id"];
            isOneToOne: false;
            referencedRelation: "leads";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
