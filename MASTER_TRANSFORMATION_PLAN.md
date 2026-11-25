# TOTAL PROPERTY — Master Transformation Plan

**Client:** Total Property Management — `totalproperty.us`
**Date:** 2026-11-25
**Status:** PHASE 1 DELIVERABLE — **awaiting approval. No application code has been written.**
**Evidence base:** [`TOTAL_PROPERTY_AUDIT.md`](./TOTAL_PROPERTY_AUDIT.md) (labels **[LIVE] / [3P] / [INFERRED] / [UNVERIFIED]** carry over; **[ESTIMATE]** = my planning estimate, not a measured figure)

---

## 0. Bottom Line

| | |
|---|---|
| **Current state** | A live 4-page 2009-era brochure site with no lead capture, no mobile layout, no indexable service text, no portals, and no discoverable reputation. [LIVE] |
| **Rate-limiting bottleneck** | **Inbound opportunity flow.** No credible, discoverable, convertible front door exists, so portals and apps would optimize a system with no volume. |
| **Recommended plan** | **Buy the ledger, build the wedge.** Ship a high-converting marketing + intake site first. Run owner/tenant money and accounting on a proven PM platform. Spend custom engineering only where competitors are weak: **commercial CAM/tenant ops, construction tracking, and lender/REO reporting.** |
| **Where I deviate from the brief** | The brief asks for custom Owner and Tenant portals with Postgres. I recommend building those *only if* the client refuses to run a PM platform. Reasoning and mechanism math in §1. |
| **Time to first lead capture** | ≈3–4 weeks to a launched MVP site [ESTIMATE]; portal-first would be ≥4–6 months to anything customer-visible [ESTIMATE]. |
| **Biggest risks** | (1) Unverified licences and trust-account compliance; (2) DNS cutover breaking Microsoft 365 email; (3) unverified "family-backed" claim; (4) pit-bull mascot vs. tenant/pet-policy tone. |

---

## 1. Bottleneck, Triage and the Override

### 1.1 The override (leading with the superior alternative)

**Claim:** A custom owner/tenant portal that handles rent, deposits and owner distributions is the *highest-risk, lowest-differentiation* thing we could build. A purchased platform is faster, safer and cheaper for that layer; custom work should target what the platforms don't cover.

**Mechanism math**

| Subsystem a custom money-touching portal must own | Needed if we build | Needed if we buy |
|---|---|---|
| General ledger + per-owner trust accounting | ✔ | ✘ (platform) |
| Security-deposit liability tracking | ✔ | ✘ |
| ACH/card collection, returns, disputes, NACHA/PCI scope | ✔ | ✘ |
| Late-fee/proration rules per jurisdiction (VA/MD/PA/DC) | ✔ | ✘ (configured) |
| Owner statements, distributions, bank reconciliation | ✔ | ✘ |
| 1099 owner/vendor tax documents | ✔ | ✘ |
| FCRA-compliant tenant screening flow | ✔ | ✘ (vendor) |
| Lease e-sign with legal validity | ✔ | ✘ (vendor) |
| Vendor payables, work orders, vendor portal | ✔ | ✘ |
| Native iOS/Android apps + store review | ✔ | ✘ (platform apps exist) |
| **Regulated/money-touching subsystems in our codebase** | **10** | **0** |

- **Failure surface removed:** every row marked ✘ is a class of defect that, in Virginia, can become a Real Estate Board trust-account violation (18VAC135-20-181; Va. Code § 54.1-2135 requires timely accounting of owner funds) [3P]. Buying removes that exposure from our code.
- **Cost delta:** entry-tier PM software lists around **$50–62/month** per two third-party comparisons (sources conflict; AppFolio and Yardi are quote-based) [3P]. Rebuilding ledger-grade parity is, in my estimate, **6–12 engineer-months before feature parity** [ESTIMATE — not a benchmark], plus permanent compliance upkeep.
- **Latency delta:** MVP site ≈3–4 weeks vs. portals ≈4–6+ months [ESTIMATE].
- **Competitive logic:** every competitor I observed already offers owner/tenant portals; they are **table stakes, not differentiators** [LIVE]. The white space is commercial + construction + lender [LIVE, audit §7.2].

**Where the override does *not* apply:** if the client already runs a PM platform, we integrate with it; if the client cannot or will not buy one, §4.6 gives the custom-build path with the added compliance conditions.

### 1.2 Five-step order applied

1. **Question requirements** — *Do we need a native app?* No (PWA + platform apps). *Do we need a CMS?* No (MDX in repo). *Must the site claim "family-backed"?* Only if true. *Is the PO box a hard constraint?* It blocks Google map-pack eligibility; ask. *Are all four states real?* Only feature licensed/operational ones.
2. **Delete** — custom ledger; native apps; custom CMS; chatbot v1; custom e-sign; custom screening; multi-region infra; animation-heavy design.
3. **Simplify/standardize** — one design system, one DB (Postgres), one auth provider, one deploy path (GitHub → Vercel), MDX content.
4. **Accelerate** — preview deploy per PR; ship Phase 1 pages as soon as copy and licences are in; 24-hour human-reviewed rental analysis *before* building a calculator.
5. **Automate last** — lead routing, review requests, owner monthly summaries — only after the manual version has run for a few cycles.

### 1.3 Leverage triage

*Leverage Ratio = Systemic Impact ÷ (Time × Complexity × Maintenance Cost).*

| Class | Item | Why |
|---|---|---|
| **EXECUTE NOW** | **Phase 0 unblock (client facts, licences, DNS export, GBP claim) → MVP marketing site with Free Rental Analysis + Request-a-Quote + portal links** | Breaks the bottleneck; everything else depends on it |
| **AUTOMATE / TEMPLATIZE** | Lead-routing + speed-to-lead alerts · post-service review request · monthly owner performance email · owner onboarding checklist · property-onboarding SOP | Deterministic and repeatable once Phase 1 has run (templates in §6.5) |
| **DEFER** | Rental-analysis *calculator* with live comps · tenant PWA shell · owner dashboards via platform API · SMS · custom commercial/lender modules (Phase 3–4, gated on §4 decisions) | Valid but blocked by volume and the software decision |
| **DROP** | Custom trust-accounting ledger · native iOS/Android v1 · custom CMS · chatbot v1 · custom tenant screening · custom e-sign · 3D/animation showpieces · state pages for states without a licence | Zero or negative leverage right now |

---

## 2. Brand Modernization & Positioning

### 2.1 Positioning statement (proposal)

> **Total Property Management is the single accountable team for owners, commercial landlords, tenants and lenders across Northern Virginia, Maryland, Pennsylvania and DC — fiercely protective of every asset we manage.**

*(Draft. "Family-backed", years in business, units managed and any numbers go in only after the client confirms them — audit §10 Q2–Q3.)*

**The one idea to own:** *"Both sides of the lease, plus the build-out and the bank."* Competitors serve landlords or tenants and rarely both; none observed combine **commercial + construction + lender** [LIVE]. "Total" is currently a name; the site must make it a **proof**.

### 2.2 Message pillars

| Pillar | Proof the site must show (client-supplied) | Primary audience |
|---|---|---|
| **Protective** ("pitbulls about our client's assets") | Delinquency process, response-time SLA, vendor-cost control, CAM audits | Owners, commercial landlords, lenders |
| **Complete** (end-to-end) | One-page service map; "one team, one call" | All |
| **Accountable** | Licence numbers, named leadership, fee page, monthly reporting sample | Owners, lenders |
| **Responsive** | Maintenance SLA, portal, 24/7 emergency line (if real) | Tenants, owners |
| **Local** | Loudoun-rooted; named towns served | All |

**Voice:** direct, plain, a little tough, never aggressive. *Owner/lender/commercial voice* = confident and numerical. *Tenant voice* = calm, fast, friendly.

### 2.3 Visual system (proposal)

Heritage colours were pixel-sampled from the live assets (audit §3.3), deepened for contrast, and validated against **WCAG 2.2 AA**.

| Token | Hex | Use | Contrast (computed) |
|---|---|---|---|
| **Ridge 900** | `#2B3418` | Primary dark, headers, footer | 13.07:1 on white · 11.88:1 vs Bone-text on it |
| **Ridge 700** | `#4A5524` | Primary buttons, links | 8.03:1 on white |
| **Heritage Olive** | `#737B39` | Decorative bars, icons only | 4.54:1 on white — *borderline; never for small text* |
| **Copper 700** | `#8A5414` | Secondary text accents | 6.25:1 on white · 5.68:1 on Bone |
| **Heritage Copper** | `#9C631A` | Decorative, large display | 4.98:1 on white |
| **Gold** | `#DFAC60` | Accent on dark; CTA fill | 6.35:1 text on Ridge 900 · 8.13:1 Ink on Gold |
| **Bone** | `#F6F4EE` | Page background (warm) | Ink on Bone 15.21:1 |
| **Ink** | `#1B1F17` | Body text | 15.21:1 on Bone |
| **Slate** | `#5A625C` | Secondary text | 6.29:1 white · 5.72:1 Bone |
| Success / Warning / Danger | `#2F7D4F` / `#8F5F00` / `#B3382C` | Status | 5.04:1 / 5.52:1 / 5.97:1 on white (warning also 5.02:1 on Bone) |

**Typography (both free, self-hosted via `next/font`):** *Manrope* for headings and UI (sturdy, modern); *Source Serif 4* for testimonials/pull-quotes only. Fixed type scale, 16–18 px body, 1.6 line height.

**Layout language:** generous whitespace, 12-column grid, large photographic hero of *real managed properties*, flat colour panels echoing the original olive/copper "arrow" shapes, no stock-photo clichés. Dark Ridge sections alternate with Bone sections.

### 2.4 Mascot decision (D2)

| Option | Pros | Cons |
|---|---|---|
| **A (recommended): Pit-bull mark is the primary brand for marketing/owner/commercial/lender; the legacy house-and-bars glyph becomes the favicon and portal/app icon** | Keeps the memorable promise; the glyph is small-size legible and has 15 years of equity; tenant UI stays neutral | Two marks, with defined roles |
| B: Pit bull everywhere | Single identity | Tone risk on tenant pages; pet-policy adjacency |
| C: Retire the mascot, keep the tagline text | Lowest tenant-tone risk | Loses the most distinctive asset |

Either way: **commission a clean vector redraw** (current art is a raster JPG), and have counsel review the pet-policy copy given HUD's 2025–26 assistance-animal guidance changes [3P].

### 2.5 Trust-badge rules

**No badge without proof.** Each is a client-supplied fact:
- Licence number(s) + link to the DPOR (and DC/MD/PA equivalents) lookup — *placeholder until supplied.*
- Equal Housing Opportunity (required housing-industry statement).
- Review count/rating from Google — *once earned.*
- NARPM / BBB / insurance / bonding — *only if true today.*
- "Secure payments" — only when the payments provider is chosen.
- Named leadership with photos.

---

## 3. Website Architecture & Feature Scope

### 3.1 Sitemap

```
/                              Home (segmented entry: Owners · Commercial · Lenders · Tenants)
/owners                        Residential owner landing  → Free Rental Analysis
/commercial                    Commercial landlord landing → Request a Proposal
/commercial/construction       Construction management
/lenders                       Lender & REO services       → Request a Lender Call
/tenants                       Tenant hub: pay rent · maintenance request · FAQ · portal login
/services                      Full service catalogue (real text, not an image)
/fees                          Fees & how we're paid (if the client agrees)
/about  /team                  Story, leadership, licences
/areas/[town]                  Purcellville · Leesburg · Round Hill · Hamilton · Middleburg · Lovettsville …
/resources/[slug]              MDX guides (owner, tenant, commercial) — start with ≈10
/free-rental-analysis          Dedicated landing + form
/request-quote                 Multi-audience intake
/contact                       Phone, email, hours, map/service area
/portal                        Smart redirect to the right platform login (owner / tenant)
/legal/privacy  /legal/terms  /legal/fair-housing  /legal/accessibility
```

- **Global header:** logo · Owners · Commercial · Lenders · Tenants · Resources · **[Owner Portal] [Tenant Portal]** · **phone** · **[Free Rental Analysis]** — matching the pattern every benchmark site uses [LIVE].
- **Legacy redirects (301):** `/index.php`→`/`, `/aboutus.php`→`/about`, `/services.php`→`/services`, `/contactus.php`→`/contact`.
- **Town pages** must carry real, unique local content (no doorway pages). State pages only for jurisdictions confirmed licensed/active.

### 3.2 Page specs and draft copy

*Copy is proposed; every number and claim needs client confirmation.*

| Page | Headline (draft) | Sub-head / proof | Primary CTA | Secondary |
|---|---|---|---|---|
| **Home** | *Property management that fights for your asset.* | Residential, commercial and lender-side management across NoVA, MD, PA and DC — one accountable team. | Get a free rental analysis | Talk to us about commercial |
| **Owners** | *See what your property should be earning.* | Process in 4 steps, owner-portal preview, fee clarity, delinquency process, licence badge | Get my free analysis | See how reporting works |
| **Commercial** | *Cut CAM leakage. Keep tenants. Build without chaos.* | Landlord + tenant + construction services in one team (from live service list) | Request a proposal | Download CAM-review checklist |
| **Lenders** | *Foreclosure properties, market-ready.* | Renovated, landscaped, cleaned to standard before marketing; sliding-scale rate card; photo reporting | Request a lender call | View service scope |
| **Tenants** | *Pay rent. Report a repair. Get an answer.* | Portal login, maintenance form with photo upload, FAQ, emergency instructions | Open tenant portal | Report a maintenance issue |

**Home page blocks (top→bottom):** hero with audience switcher → "Four clients, one team" diagram (the original flowchart, rebuilt as live text) → services-by-audience → proof strip (licence #s, years, units, reviews) → how-it-works (3 steps) → leadership/team → regional coverage → testimonials → FAQ → final CTA.

### 3.3 Lead capture & onboarding flows

**A. Free Rental Analysis (owners)**

| Version | Mechanism | Status |
|---|---|---|
| **v1 (Phase 1)** | One-screen form: **address + email** (name/phone optional) → confirmation → human-prepared one-page analysis within **1 business day** | Fastest path; proves demand; avoids unvetted automated valuation |
| **v2 (Phase 2)** | Property details → instant range from a licensed rent-data source → "book a review" | Requires a data licence; sources I saw disagree by ~40% for Loudoun [3P], so **every output is labelled an estimate with its source** |

**B. Request a Quote (multi-audience)** — first question routes: *Owner / Commercial landlord / Tenant improvement or construction / Lender or servicer.* Each branch asks only 4–6 fields.

**C. Owner onboarding (Phase 2)** — signed agreement upload, W-9, insurance, property details, lock/utility info, vendor preferences → creates the account in the PM platform (via API or ops checklist).

**D. Tenant quick-request (Phase 1)** — public maintenance form (address/unit, category, description, photo/video up to a size cap, emergency toggle that shows the emergency phone number) → emails ops *and* writes a record; later merges into the platform's work-order flow.

**Controls on every form:** Turnstile bot challenge, server-side validation, rate limiting, consent text (SMS only with express opt-in), spam-safe email via transactional service, response-time alert to staff.

### 3.4 SEO & local plan

- **Technical:** semantic HTML, one `<h1>`/page, sitemap + robots, canonical tags, Open Graph, Core Web Vitals within Google's "good" thresholds (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1), JSON-LD (`Organization`/`LocalBusiness` subtype, `Service`, `FAQPage`, `BreadcrumbList`).
- **Local:** claim/create a Google Business Profile; **PO box ineligible** — choose service-area-business or a real address [audit §5, confirm]. Keep Name/Address/Phone consistent everywhere. Generate first reviews via the post-service request (§6.5).
- **Keyword themes** (volumes **not yet measured** — Semrush credits were exhausted; re-run with OpenSEO/Semrush before finalizing): *property management Purcellville VA* · *Loudoun County property management* · *commercial property management Northern Virginia* · *REO property preservation Virginia/Maryland* · *free rental analysis Loudoun*.
- **Content engine:** ≈10 MDX guides at launch, one per quarter-theme after (owner ROI, CAM explained, REO process, tenant rights/responsibilities by state — counsel-reviewed).
- **Namesake collision defence:** consistent "Total Property Management — Purcellville, VA" in every title tag, schema, and listing; never reference other "Total Property" companies' reviews.

### 3.5 Accessibility, performance, quality budgets

| Budget | Target |
|---|---|
| Accessibility | WCAG 2.2 AA; axe-core in CI + manual keyboard/screen-reader pass per release |
| Mobile Lighthouse (marketing pages) | Performance ≥ 90, Accessibility 100, SEO 100 |
| JS on marketing pages | ≤ ~170 KB gzipped [ESTIMATE target] |
| Images | AVIF/WebP, responsive sizes, explicit dimensions |
| Browser support | Last 2 versions of evergreen browsers + iOS Safari 16+ |

---

## 4. Portal & Companion-App Strategy

### 4.1 Architecture of the experience

```
 totalproperty.us (Next.js)  ── marketing, intake, tenant quick-request, resources
        │
        ├── portal.totalproperty.us ─► branded entry → PM platform owner/tenant login   (system of record)
        │         (owners: statements, approvals, tax docs · tenants: pay, requests, docs)
        │
        └── hub (Supabase-backed) ─► WEDGE MODULES that platforms do poorly:
                  · Commercial tenant & CAM module
                  · Construction project tracker
                  · Lender / REO status & photo-evidence portal
```

**Companion app = installable PWA first** (home-screen icon, push, camera capture via file input). Platform-provided iOS/Android resident/owner apps are used where they exist [3P: AppFolio, Buildium, Rentec]. **Native app only if** measured demand and a gap justify it (Phase 5).

### 4.2 Build vs buy matrix (the user-requested features)

| Feature requested in brief | Residential via PM platform | Custom (hub) | Phase |
|---|---|---|---|
| Owner: real-time financial statements | ✔ platform | — | 3 |
| Owner: maintenance approvals (estimate threshold) | ✔ platform [3P AppFolio] | Status mirror only | 3 |
| Owner: occupancy tracking, distribution summaries | ✔ platform | Optional read-through dashboard via API *if available* | 3 |
| Tenant: rent autopay | ✔ platform | — | 3 |
| Tenant: maintenance ticketing with photo/video | ✔ platform (+ our pre-portal form in Phase 1) | Own form until platform is live | 1→3 |
| Tenant: lease/document storage | ✔ platform | — | 3 |
| Tenant: community announcements | ✔ platform messaging | Simple announcements page | 3 |
| **Commercial tenant requests + CAM statement access** | Partial (platform dependent) | ✔ **build** | 4 |
| **Commercial CAM budget/recon tracking** | Partial; **depth unconfirmed** [3P] | ✔ **build if bake-off shows a gap** | 4 |
| **Construction project tracking (milestones, change orders, punch list)** | ✘ | ✔ **build** (mirrors the live service list) | 4 |
| **Lender/REO per-property status, rate card, before/after photos, close-out packet** | ✘ | ✔ **build** | 4 |

### 4.3 PM platform bake-off (D4 — a 2-week task in Phase 0/1)

Do **not** pick on brochures. Run one demo script per vendor using the client's *own* hardest cases.

| Criterion | Weight | Pass test |
|---|---|---|
| Trust-accounting for VA/DC (and MD/PA if active) | Must-have | Vendor shows owner-ledger separation and deposit accounting |
| Commercial: CAM reconciliation, percentage-rent/escalations | Must-have if commercial is large | Run a real CAM pool through the demo |
| Owner portal: statements, tax docs, approvals | High | Approve a work-order estimate end-to-end |
| Tenant portal/app: autopay, photo requests | High | Submit a request with photo on a phone |
| API/webhook access at our tier | High | Document which endpoints exist **[unverified for every vendor; check]** |
| Total cost of ownership + payment fees | High | Per-unit fees, ACH fee split, onboarding fee |
| Data export / exit rights | High | Test an export |
| SSO / white-label domain | Medium | `portal.totalproperty.us` possible? |

Candidates: **AppFolio, Buildium, Yardi Breeze** (strongest commercial signals in third-party roundups, depth to be tested), plus the client's current tool if any. Do not assume any vendor does CAM at commercial depth until tested — the sources I found don't settle it [3P].

### 4.4 Owner portal — feature scope (delivered by platform; our hub adds the layer below)

*Must-have:* monthly statements, YTD, tax docs, work-order approval with auto-approve threshold, document vault, distribution history, occupancy/delinquency view.
*Hub layer (Phase 3):* unified login entry point, onboarding wizard, owner-facing "what we did this month" summary (automated from platform data), referral program.

### 4.5 Tenant portal — feature scope

*Platform:* autopay (ACH-first), one-time pay, ledger, lease/doc access, maintenance tracking, renters-insurance verification, messaging.
*Hub layer:* public quick-request form with photo/video upload and emergency routing (Phase 1), announcements page, move-in/move-out guides, accessible help center.

### 4.6 Plan B — custom owner/tenant portal (only if the client declines a PM platform)

Everything in §5 applies, **plus** these non-negotiables before any money moves:
1. A **licensed Virginia broker/principal signs off** on the trust-account workflow and ledger design.
2. Payments via a **hosted** payment provider (no card/bank data touches our servers). Stripe ACH is reported at **0.8% capped at $5** with $4 failed-debit and $15 dispute fees [3P — verify on stripe.com]; ACH can take up to 4 business days to confirm.
3. Immutable double-entry ledger, daily reconciliation job, append-only audit log.
4. Penetration test and legal review before launch.
5. Realistic schedule: **6–12 months** [ESTIMATE].

I do **not** recommend Plan B; it's documented so the client can see what they'd be buying.

### 4.7 Commercial, construction and lender modules (Phase 4 — the differentiators)

| Module | Core objects | Key screens |
|---|---|---|
| **Commercial** | properties, suites, leases (read-only mirror), CAM pools, budgets, charges, recon runs, work orders | Tenant request inbox · CAM statement view · budget-vs-actual for owner · delinquency pipeline |
| **Construction** | projects, scope, bids, contracts, milestones, change orders, punch items, permit/inspection log, documents | Project dashboard · bid comparison · change-order approval · punch list with photos · close-out checklist |
| **Lender/REO** | assignments, properties, rate card, tasks (secure/clean/landscape/repair), before/after photos, cost approvals, status, close-out packet | Assignment queue · per-property timeline · photo evidence · invoice/approval · servicer export |

---

## 5. Recommended Modern Tech Stack

### 5.1 Stack

| Layer | Choice | Why / what it deletes |
|---|---|---|
| Framework | **Next.js (App Router), React Server Components, TypeScript strict** | SSR/ISR for SEO; one codebase for site + hub |
| Styling / UI | **Tailwind CSS v4 + shadcn/ui (Radix primitives)** | Accessible components by default; no custom design system to maintain |
| Forms / validation | React Hook Form + **Zod** (same schema client & server) | One validation source of truth |
| Database | **Supabase Postgres** | See §5.2 |
| Auth | **Supabase Auth** (email + magic link; TOTP MFA required for staff and owners) | Auth + RLS + storage in one provider; deletes a separate auth vendor |
| Storage | Supabase Storage, **private buckets + signed URLs**, server-validated types/sizes | Photo/video/doc uploads without running file infra |
| Content | **MDX in the repo** | Deletes a CMS (cost, login, security surface) |
| Email | **Resend** (or equivalent) for transactional mail; **Microsoft 365 stays the company mailbox** | Don't touch the working mail system |
| Spam | Cloudflare **Turnstile** + rate limiting | Accessible CAPTCHA alternative |
| Payments | **None in Phase 1–3** (platform handles); Stripe hosted only for Plan B or small one-off fees | Zero PCI scope in our code |
| Hosting / CI | **Vercel** + **GitHub** (preview deploy per PR) + **GitHub Actions** (lint, typecheck, unit, Playwright + axe) | Matches the stated deploy target; Vercel connection is available in this environment |
| Observability | Vercel Analytics + Speed Insights, Sentry, Google Search Console | Measure CWV and errors; no cookie-banner-heavy trackers |
| Testing | Vitest, Playwright, axe-core | Regression + a11y gates in CI |

### 5.2 Supabase vs. Prisma (the brief offered both)

**Recommendation: Supabase (Postgres + Auth + RLS + Storage), SQL migrations via the Supabase CLI, generated TypeScript types, no ORM.**
- Row-Level Security is the core of a multi-role portal; Prisma doesn't give RLS, so we'd still write policies *and* maintain a second schema layer.
- One vendor covers DB + auth + storage → fewer moving parts (Step 3).
- Prisma remains a drop-in later if the team prefers it; it isn't required.

### 5.3 Authorization model (hub)

| Role | Sees |
|---|---|
| `admin`, `staff` | Everything in the org (server-side service role only; never from the browser) |
| `owner` | Only their properties via `owner_property` |
| `tenant` / `commercial_tenant` | Only their lease/unit records |
| `lender` | Only assigned properties |
| `vendor` (Phase 4) | Only assigned work orders |

**Rules:** deny-by-default RLS on every table · every row carries `org_id` and ownership keys · signed URLs expire in minutes · append-only `audit_log` · MFA for staff/owners · least-privilege service-role access in server code only.

### 5.4 Data model sketch (custom hub only — excludes the platform's ledger)

`orgs · profiles · roles · properties · units · owner_property · lease_mirrors · leads · analysis_requests · quote_requests · service_requests · attachments · announcements · lender_assignments · preservation_tasks · cam_pools · cam_charges · cam_recons · construction_projects · milestones · change_orders · punch_items · documents · audit_log`

### 5.5 Security baseline

OWASP ASVS Level 2 as the target [ESTIMATE of effort: moderate] · CSP + HSTS + `X-Content-Type-Options` + `Referrer-Policy` + `frame-ancestors` · secrets only in Vercel/Supabase env · no PII in logs · dependency scanning (Dependabot) · backups with point-in-time recovery (confirm plan tier) · breach-response checklist · vendor due diligence (SOC 2 reports for hosting/DB — **verify**) · privacy policy + state-privacy-law applicability reviewed by counsel.

### 5.6 DNS & email cutover (asymmetric-downside control)

Live DNS (audit §3.4): A → `209.142.64.131`; NS → `managed-vps.net`; MX → **Microsoft 365**.

1. Export every DNS record (A/CNAME/MX/TXT/SPF/DKIM/DMARC/Autodiscover) **before touching anything**.
2. Lower TTLs 48 h ahead.
3. Deploy to Vercel on a preview domain; QA.
4. Change **only** the apex/`www` A/CNAME. **Leave nameservers and MX where they are.**
5. Send/receive test mail; confirm SPF/DKIM/DMARC still pass.
6. Verify 301 map; submit sitemap; confirm indexation.
7. Keep the old host live 30 days, then decommission.
8. *Optional later:* move DNS to Vercel/Cloudflare **only with a record-for-record copy and tested mail flow**.

---

## 6. Phased Execution Roadmap

*Durations are planning estimates [ESTIMATE] and assume client inputs arrive on time.*

### Phase 0 — Unblock (Week 0–1)
**Goal:** remove every dependency that could stall launch.
- Client answers audit §10 (licences, entity names, portfolio, systems, pet policy, address/GBP, DNS access).
- DNS export; M365 admin access confirmed.
- Claim/create Google Business Profile.
- Book PM-platform demos with the client's own scenarios (§4.3).
- Counsel review: licence display, fair-housing language, pet-policy copy.
- Decide D1–D9 (§8).
**Exit:** licence numbers in hand, copy facts confirmed, DNS exported.

### Phase 1 — MVP Marketing Site (Week 1–4)
**Goal:** a credible, mobile-first, indexable front door that captures leads.
- Repo bootstrap, CI, design tokens, component kit.
- Pages: Home, Owners, Commercial (+Construction), Lenders, Tenants, Services, About/Team, Contact, Free Rental Analysis, Request-a-Quote, Legal ×4, 3–5 launch towns, 3–5 guides.
- Forms v1 (analysis, quote, tenant quick-request) → staff alerts + DB record.
- Header portal links; `/portal` smart redirect.
- Schema, sitemap, redirects, analytics, error monitoring.
- DNS cutover per §5.6.
**Exit criteria:** Lighthouse mobile ≥ 90 / A11y 100 / SEO 100 · axe clean · all forms tested end-to-end · mail unaffected · legacy URLs 301 · licence badges live · GBP verified.

### Phase 2 — Conversion Engine (Week 4–10)
- Free Rental Analysis v2 (licensed data source, labelled estimates).
- Owner onboarding wizard (documents + e-sign via a vendor).
- Lender and commercial-RFP intake pipelines with SLAs.
- Speed-to-lead routing and alerts; review-request automation; CRM sync (if HubSpot is the CRM — a HubSpot connection exists in this environment, so confirm before assuming).
- Content cadence: 1–2 guides/month; town pages expanded.
**Exit:** speed-to-lead ≤ 15 min in business hours · first 10 reviews requested · measured form conversion baseline.

### Phase 3 — Portal Layer (Week 8–16, **gated on D1/D4**)
- Platform live and configured (trust accounts, fee schedules, owner/tenant onboarding).
- `portal.totalproperty.us` branded entry / SSO where supported.
- Owner monthly "what we did" summary; optional read-through dashboard via platform API (only if the API exists at our tier).
- Tenant announcements page; PWA shell with deep links.
**Exit:** pilot with 5–10 owners and 20–30 tenants; autopay adoption and ticket-via-portal rates measured.

### Phase 4 — Differentiator Modules (Week 14–28)
Order by revenue evidence: **Lender/REO → Commercial tenant/CAM → Construction tracker.** One module at a time, each with a pilot customer and a written acceptance checklist.

### Phase 5 — Optimize & Automate (ongoing)
AI-assisted maintenance triage (human-in-loop), SMS (TCPA-compliant), native app only if justified, owner referral program, annual accessibility/security review.

### Dependency map

```
Phase 0 ─► Phase 1 ─► Phase 2 ─┐
   │                           ├─► Phase 3 (needs D1/D4) ─► Phase 4 ─► Phase 5
   └── PM bake-off ────────────┘
```

---

## 6.5 Templates Ready to Use (Automate / Templatize)

**Speed-to-lead alert (staff, instant):**
> `NEW {audience} LEAD — {name} · {phone/email} · {property/city} · source: {page}. Reply within 15 min. [Open in dashboard]`

**Owner auto-reply (immediate):**
> Thanks, {first_name}. We'll send your rental analysis for {address} within one business day. If it's urgent, call {phone}. — Total Property Management

**Post-service review request (24 h after closed work order / move-in):**
> Hi {first_name}, did we get {issue} fixed to your standard? If so, a quick Google review helps neighbours find us: {link}. If not, reply here and a manager will call you today.

**Owner monthly summary (auto-generated):**
> {Property}: occupancy {x}%, rent collected {$}, open work orders {n}, completed {n}, next lease event {date}. Statement attached. Questions? {contact}

**Owner onboarding checklist:** signed management agreement · W-9 · insurance certificate · utility/lock details · vendor preferences · approval threshold · bank/deposit instructions · portal invite sent.

---

## 7. Success Metrics

| Layer | KPI | Target (to be baselined) |
|---|---|---|
| Acquisition | Organic sessions, Google Business Profile views/calls, review count/rating | Baseline at Month 1; 10 reviews by Month 3 |
| Conversion | Form conversion by audience; rental-analysis submissions | Baseline in Phase 1; improve by test, not assumption |
| Speed | Lead response time | ≤ 15 min in business hours |
| Quality | Core Web Vitals, Lighthouse, axe violations | LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 · 0 critical a11y issues |
| Portal | % tenants on autopay; % requests via portal; owner login rate | Baseline at pilot |
| Business | Owner leads → signed agreements; lender assignments; commercial RFPs | Baseline Phase 2 |

*No industry conversion benchmarks are asserted: the ones I found were vendor-authored and unverified [3P].*

---

## 8. Decisions Needed From You

Each has my recommended default; **"Approve all defaults" is a valid answer.**

| # | Decision | Recommended default |
|---|---|---|
| **D1** | Portal approach | **Hybrid**: buy PM platform for money/ledger, build wedge modules (§4) |
| **D2** | Mascot/logo system | **Option A** (§2.4) + vector redraw |
| **D3** | Messaging priority order | Owners → Commercial → Lenders → Tenants (tenants served mainly via portal) |
| **D4** | PM platform shortlist | AppFolio · Buildium · Yardi Breeze · current tool if any; scripted demos |
| **D5** | DNS approach | A/CNAME-only; keep NS/MX unchanged (§5.6) |
| **D6** | Lead store / CRM | Supabase table + email alerts; sync to HubSpot only if it's the CRM |
| **D7** | Launch pages | Phase 1 list in §6 |
| **D8** | Jurisdictions featured at launch | Only those with confirmed licences and active operations |
| **D9** | "Family-backed" claim | Use only if you confirm it and can name the family/leadership |

**Inputs I need to proceed** (full list in audit §10): licence numbers and entity names; ownership/leadership; portfolio size and client mix; current software; pet policy; address/GBP situation; DNS/M365 access; 3–5 testimonials and real property photos; fee schedule willingness.

---

## 9. Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| **Unlicensed or non-compliant operation surfaced by a public site** | High | Collect licences first; display only verified numbers; counsel review |
| **DNS cutover breaks M365 email** | High | §5.6: leave NS/MX untouched; test mail before/after |
| **Mishandling owner/tenant funds in custom code** | High | Don't build it (D1); Plan B conditions if forced |
| **Unverified brand claims ("family-backed", stats)** | Medium | Claim only what the client documents |
| **Namesake confusion in search** | Medium | Consistent NAP + schema + "Purcellville, VA" in titles |
| **PO box blocks local-pack ranking** | Medium | Service-area profile or street address (confirm) |
| **Pit-bull mascot misread / pet-policy conflict** | Medium | D2 + counsel review of pet-policy copy |
| **PM platform lacks commercial CAM depth** | Medium | Scripted bake-off; Phase 4 custom CAM module |
| **Lead volume stays low after launch** | Medium | Local SEO + GBP + reviews + owner referral program; measure weekly |
| **Rent-analysis estimates mislead owners** | Medium | v1 human-reviewed; v2 labelled estimate with data source |
| **Data conflicts (rent sources differ ~40%)** | Low | Show ranges, cite source |

---

## 10. What Happens After You Approve

1. I log your decisions D1–D9 into a short design record, then invoke the **writing-plans** workflow to turn Phase 1 into an ordered, testable task list.
2. Phase 1 build starts: scaffold the Next.js/TypeScript/Tailwind project in this repository (currently empty — no commits), set up CI and the Vercel preview pipeline, implement the design tokens, and ship the pages in §6 behind a preview URL.
3. You review the preview and supply the Phase 0 facts; DNS cutover happens only after your explicit go-ahead.

**Nothing has been scaffolded, installed or deployed. Awaiting your approval and feedback.**
