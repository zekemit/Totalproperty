-- Lead capture schema for totalproperty.us (Phase 1).
--
-- Model
--   leads                one row per person/inquiry (the CRM record + consent)
--   rental_analysis      detail for "Free Rental Analysis" requests (owners)
--   contact_submissions  detail for contact, maintenance and vendor requests
--
-- Security
--   * RLS is ENABLED on every table with NO policies, and all privileges are
--     revoked from the `anon` and `authenticated` roles. The browser can never
--     read or write these tables. Only server code using the service-role key
--     (lib/supabase/admin.ts, `server-only`) writes; the service role bypasses RLS.
--   * Staff read access arrives with authentication in a later phase, as explicit
--     policies keyed to a staff role. Until then there is deliberately no read path.
--   * CHECK constraints mirror the Zod schemas so bad data cannot enter even if an
--     application bug bypasses validation.
--   * IP addresses are never stored raw; `ip_hash` is an HMAC (see lib/forms/security.ts).
--
-- Data handling: these tables hold personal data. Define a retention period with the
-- client (README → "Data retention") and purge `spam`/`lost` leads on that schedule.

create table public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  audience         text not null
                     check (audience in ('owner', 'commercial', 'lender', 'tenant', 'vendor', 'other')),
  source_path      text not null check (char_length(source_path) between 1 and 200),
  name             text not null check (char_length(name) between 2 and 100),
  email            text not null check (char_length(email) <= 254 and email = lower(email) and position('@' in email) > 1),
  phone            text check (phone is null or phone ~ '^\+[0-9]{8,15}$'),
  consent_contact  boolean not null check (consent_contact),
  consent_at       timestamptz not null default now(),
  utm_source       text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium       text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign     text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  ip_hash          text check (ip_hash is null or ip_hash ~ '^[0-9a-f]{64}$'),
  user_agent       text check (user_agent is null or char_length(user_agent) <= 300),
  status           text not null default 'new'
                     check (status in ('new', 'contacted', 'qualified', 'won', 'lost', 'spam'))
);

comment on table public.leads is
  'Inbound people/inquiries from the public site. Contains PII. Server-only access (RLS on, no policies).';

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status) where status = 'new';
create index leads_email_idx on public.leads (email);

create table public.rental_analysis (
  id                  uuid primary key default gen_random_uuid(),
  lead_id             uuid not null references public.leads (id) on delete cascade,
  created_at          timestamptz not null default now(),
  street              text not null check (char_length(street) between 5 and 120),
  city                text not null check (char_length(city) between 2 and 80),
  state               text not null check (state in ('VA', 'MD', 'PA', 'DC')),
  zip                 text not null check (zip ~ '^\d{5}(-\d{4})?$'),
  property_type       text not null
                        check (property_type in ('single_family', 'townhome', 'condo', 'small_multifamily', 'other')),
  occupancy           text not null
                        check (occupancy in ('vacant', 'tenant_in_place', 'owner_occupied', 'new_purchase')),
  bedrooms            smallint check (bedrooms is null or bedrooms between 0 and 20),
  current_rent_cents  integer check (current_rent_cents is null or current_rent_cents between 0 and 10000000),
  timeline            text not null check (timeline in ('asap', 'one_to_three_months', 'exploring')),
  notes               text check (notes is null or char_length(notes) <= 1500),
  status              text not null default 'new'
                        check (status in ('new', 'in_progress', 'delivered', 'closed'))
);

comment on table public.rental_analysis is
  'Free Rental Analysis requests (owner lead magnet). Contains property addresses. Server-only access.';

create index rental_analysis_lead_id_idx on public.rental_analysis (lead_id);
create index rental_analysis_created_at_idx on public.rental_analysis (created_at desc);

create table public.contact_submissions (
  id                   uuid primary key default gen_random_uuid(),
  lead_id              uuid not null references public.leads (id) on delete cascade,
  created_at           timestamptz not null default now(),
  kind                 text not null check (kind in ('contact', 'maintenance', 'vendor')),
  topic                text check (topic is null or topic in
                         ('general', 'owner', 'commercial', 'construction', 'lender', 'tenant', 'vendor')),
  company              text check (company is null or char_length(company) <= 120),
  message              text not null check (char_length(message) between 1 and 2000),
  property_address     text check (property_address is null or char_length(property_address) <= 160),
  unit                 text check (unit is null or char_length(unit) <= 20),
  maintenance_category text check (maintenance_category is null or maintenance_category in
                         ('plumbing', 'heating_cooling', 'electrical', 'appliance', 'pest', 'exterior', 'other')),
  is_emergency         boolean not null default false,
  permission_to_enter  text check (permission_to_enter is null or permission_to_enter in ('yes', 'no')),
  vendor_trade         text check (vendor_trade is null or vendor_trade in
                         ('general_contractor', 'hvac', 'plumbing', 'electrical', 'roofing',
                          'landscaping_snow', 'cleaning_turnover', 'painting', 'pest', 'other')),
  service_area         text check (service_area is null or char_length(service_area) <= 200),
  status               text not null default 'new'
                         check (status in ('new', 'in_progress', 'resolved', 'closed')),
  -- Each kind must carry the fields that make it actionable.
  constraint contact_kind_contact_needs_topic
    check (kind <> 'contact' or topic is not null),
  constraint contact_kind_maintenance_needs_location
    check (kind <> 'maintenance' or (property_address is not null and maintenance_category is not null)),
  constraint contact_kind_vendor_needs_trade
    check (kind <> 'vendor' or (vendor_trade is not null and service_area is not null and company is not null))
);

comment on table public.contact_submissions is
  'Contact, maintenance and vendor submissions. Contains PII. Server-only access.';

create index contact_submissions_lead_id_idx on public.contact_submissions (lead_id);
create index contact_submissions_created_at_idx on public.contact_submissions (created_at desc);
create index contact_submissions_open_emergency_idx
  on public.contact_submissions (created_at desc) where is_emergency and status = 'new';

-- Deny-by-default: RLS on, no policies, no grants to browser-facing roles.
alter table public.leads               enable row level security;
alter table public.rental_analysis     enable row level security;
alter table public.contact_submissions enable row level security;

revoke all on table public.leads               from anon, authenticated;
revoke all on table public.rental_analysis     from anon, authenticated;
revoke all on table public.contact_submissions from anon, authenticated;

grant select, insert, update, delete on table public.leads               to service_role;
grant select, insert, update, delete on table public.rental_analysis     to service_role;
grant select, insert, update, delete on table public.contact_submissions to service_role;
