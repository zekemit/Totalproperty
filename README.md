# Total Property Management — totalproperty.us

Marketing site and lead-conversion engine for Total Property Management (Purcellville, VA; serving Virginia, Maryland, Pennsylvania and DC).

- **Strategy and research:** [`TOTAL_PROPERTY_AUDIT.md`](./TOTAL_PROPERTY_AUDIT.md), [`MASTER_TRANSFORMATION_PLAN.md`](./MASTER_TRANSFORMATION_PLAN.md)
- **Reference-site merge (maxalley.net/tpm) and what changed:** [`MAXALLEY_REFERENCE_AUDIT.md`](./MAXALLEY_REFERENCE_AUDIT.md)
- **Editing the site without code:** [Section 15, the site editor](#15-the-site-editor-admin) and [Section 16, connect Upstash](#16-connect-upstash-so-saving-works-in-production)
- **Ranking and ads:** [Section 17, the first-page search and Google Ads launch checklist](#17-first-page-search-and-google-ads-launch-checklist)
- **Implementation plan for this build:** [`docs/superpowers/plans/2026-11-25-phase1-marketing-site.md`](./docs/superpowers/plans/2026-11-25-phase1-marketing-site.md)

**Scope (hybrid architecture).** This repository contains the public site, the lead pipeline and the database for inbound requests. It deliberately does **not** collect rent, hold tenant ledgers or do owner accounting; those run on a property-management platform, and the site links out to it (see [Portal and payment links](#8-portal-and-payment-links)). The lender/REO tracking module is a later phase.

---

## 1. Quick start

Prerequisites: Node.js 20.9+ (developed on 22), npm 10+.

```bash
npm install
cp .env.example .env.local     # every value is optional for local development
npm run dev                    # http://localhost:3000
```

With no environment variables set, the site runs and the forms validate. In development a valid submission succeeds with an explicit "Development mode" notice and nothing is stored or sent. **In production with nothing configured, forms return an honest error that gives the phone number and email; they never pretend to succeed.**

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | `tsc --noEmit` (strict) |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm test` | Vitest unit tests (199) |
| `npm run check` | typecheck + lint + unit tests |
| `npm run test:e2e` | Playwright end-to-end + axe accessibility audit (builds and serves a fresh copy) |

### End-to-end tests

Playwright launches Chromium. If your machine already has one (for example a CI image), point to it instead of downloading another:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chromium npm run test:e2e
```

The suite covers 16 public pages at desktop and phone widths, plus the editor (`tests/e2e/admin.spec.ts`, which runs last and alone against a throwaway content file and a test password, both set in `playwright.config.ts`): exactly one `<h1>`, no console errors, no horizontal scroll, **zero axe violations for WCAG 2.0/2.1/2.2 A and AA** (measured on the settled, reduced-motion state), skip link, legacy redirects, security headers, noindex safeguards, blank-state behavior, the 404, the vacancy instrument (slider, keyboard, bad input), the schematic (which functions light for each client), the pinned services panel, the mobile menu drawer (modal, Escape, focus return), form validation, and the honest-failure path.

---

## 2. Business information: the standard values

> **Two ways to change content.** `src/config/site.ts` holds the *standard* values and needs a code change and a deploy. The **site editor at `/admin`** (section 15) saves changes that are layered on top of these values, live within seconds, with no code. A value set in the editor wins; clear it there and the standard value returns.

Everything the business still needs to confirm lives in **[`src/config/site.ts`](./src/config/site.ts)**, clearly commented, with every blank item marked `PENDING` and every confirmed item marked `VERIFIED`. Edit it, commit, push to `main`, and Vercel redeploys.

| Section | What it controls | While blank |
|---|---|---|
| `company` | Name, legal name, tagline, founding year | Legal name falls back to the trade name; founding year hidden |
| `contact` | Phone, **emergency phone**, email, hours | Emergency number falls back to the main number; hours hidden |
| `address` | PO box, optional **street address** | Site says "We're based in Purcellville, Virginia" and shows only the mailing address. It never claims an office until a street address is entered |
| `serviceAreas` | `featured: true/false` per jurisdiction, optional county detail | All four shown; turning one off updates every page's wording, badges and structured data |
| `licenses` | One entry per state (number, type, holder, verify link) | Entries with a blank number are not shown |
| `leadership` | People, titles, bios, photos | The "Leadership" section is not rendered |
| `testimonials` | Quotes with name and detail | The "What clients say" section is not rendered |
| `propertyPhotos` | Gallery on the About page | The "Properties we manage" section is not rendered |
| `portals` | Owner portal, tenant portal and rent payment links | Buttons are replaced by "call or email us" instructions |

Photos go in `/public/photos/` and are referenced as `/photos/name.jpg`, with the image's real pixel width and height.

**Mistakes fail loudly and early.** The build validates this file and stops with a plain-English message that names the field (for example "portals.ownerUrl must start with https://" or "propertyPhotos[0]: alt text is required"), so a typo can't publish a broken site. Blank optional fields are always fine.

Do not add "family-owned" or "family-backed" wording anywhere until the leadership details confirm it.

---

## 3. Preview deployment (before DNS cutover)

The site is designed to be shown to the client on its `*.vercel.app` address **without** touching the old site:

- **Search engines are blocked by default.** Until `ALLOW_INDEXING=true` is set, the site sends `X-Robots-Tag: noindex, nofollow`, a `noindex` meta tag and a `robots.txt` that disallows everything, and publishes an empty sitemap. The preview can't compete with the live site in search.
- **Canonical URLs follow the preview address.** With `NEXT_PUBLIC_SITE_URL` unset, links and share cards use the project's Vercel address instead of totalproperty.us.
- **Forms work for the demo.** With `FORMS_PREVIEW_MODE=true` and no database or email configured, a valid submission shows a success message labelled "Preview mode: nothing was stored or sent". Once real delivery is configured this switch does nothing.
- **DNS is untouched.** The custom domain is not attached to the Vercel project.

**Current preview:** https://totalproperty.vercel.app (Vercel project `totalproperty`, linked to `zekemit/Totalproperty`, production branch `main`). Pushing to `main` redeploys it. The custom domain `totalproperty.us` is **not** attached, and DNS is unchanged.

Vercel settings applied to the project: framework Next.js, Node 22, system environment variables exposed (so the canonical URL follows the Vercel address), `FORMS_PREVIEW_MODE=true`, and **Vercel Authentication turned off** so the link opens without a Vercel login. The site holds no private data and is blocked from search, but anyone with the link can view it; re-enable protection under Project Settings, Deployment Protection if you want it private. The account is on Vercel's Hobby plan, which is limited to personal, non-commercial use, so move the project to a paid plan before it serves the live business site.

**GitHub default branch:** `main` exists and matches the working branch, but GitHub still lists the branch pushed first (`claude/ecstatic-mccarthy-wzjy4n`) as the repository default. Switch it to `main` in GitHub: Settings, Branches, Default branch.

**At launch**, set `NEXT_PUBLIC_SITE_URL=https://totalproperty.us`, `ALLOW_INDEXING=true`, remove `FORMS_PREVIEW_MODE`, configure the delivery variables, then follow section 12.

---

## 4. Project layout

```
src/config/             site.ts: the standard business information (edit this, or use /admin); types.ts: its shapes
app/
  layout.tsx            Root: fonts, <html>, metadata from the live content
  (site)/               Every public page, wrapped by the header, footer, announcement and structured data
    page.tsx            Home, in the reference site's order (hero, statement, property types ...)
    services, owners, tenants, commercial, lenders, about, contact, vendors, portal,
    careers, spaces, newsletter, privacy, accessibility, fair-housing
  admin/                The site editor: login page, and (panel)/ with the editor and its save action
  api/admin/            login and logout routes (rate-limited, same-origin checked)
  actions.ts            Server Actions for the public forms: thin wrappers around the pipeline
  sitemap.ts, robots.ts Built from the live content; /admin is never listed
components/
  ui/                   Button, inputs (shadcn-style primitives)
  forms/                FormShell + the five forms (contact, rental analysis, maintenance, vendor, newsletter) + vacancy instrument
  site/                 Header, drawer, footer, hero slides, property types, service splits, listings, announcement, schematic ...
  admin/                The editor UI: tabs, field primitives, reorderable lists, the sticky save bar
lib/
  site.ts               Derives everything from a SiteConfig (+ validation); navigation
  cms-storage.ts        Where edits are kept: Upstash Redis, a local file, or read-only
  cms/                  schema (Zod, safe links), defaults, merge (standard + edits), hours, content loader
  admin/                Password check, signed session cookie, login rate limit
  seo-schema.ts         LocalBusiness / RealEstateAgent JSON-LD built from the live content
  page-metadata.ts      Per-page title, description, canonical and Open Graph from the SEO tab
  env.ts, seo.ts        Deployment switches (indexing, canonical URL, preview forms); robots/sitemap builders
  catalog.ts            Long-form service copy used on the commercial, lender and owner pages
  portals.ts            Portal/payment outbound links (https only)
  photos.ts             The bundled photo library (public/photos) with alt text
  calc/vacancy.ts       Vacancy arithmetic (no market data)
  forms/                schemas, security, pipeline, mailer, store, runtime
  supabase/             Admin client (server-only) and database types
public/photos/          Logo mark and the optimised photo library
supabase/migrations/    SQL schema + RLS
data/                   Local-only editor content (cms-overrides.json), git-ignored
tests/unit, tests/e2e   Vitest; Playwright + axe (including the editor's sign-in and save flows)
```

---

## 5. Environment variables

Copy `.env.example`. **Everything is server-only unless it starts with `NEXT_PUBLIC_`.** A build check confirms no secret name appears in any client-delivered file.

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | public | Canonical origin (sitemap, canonical URLs, OG, JSON-LD). **Leave unset until launch** (the site then uses its own Vercel address); set to `https://totalproperty.us` at cutover |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | Cloudflare Turnstile site key (public by design) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | server | Lead storage. The service role bypasses RLS; it is only read in `lib/supabase/admin.ts` (`server-only`) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_TO` | server | Staff notification email (comma-separated recipients; default `info@totalproperty.us`) |
| `TURNSTILE_SECRET_KEY` | server | If set, every form requires a valid Turnstile token. **Set the site key too, or no one can submit.** |
| `IP_HASH_SECRET` | server | HMAC key for hashing IPs before storage (`openssl rand -hex 32`). Unset = no IP data stored |
| `ALLOW_INDEXING` | server | `true` lets search engines in. **Default: blocked.** Set only at DNS cutover |
| `ADMIN_PASSWORD` | server | The editor's password (at least 12 characters). Unset = the editor is locked and says how to set it up |
| `ADMIN_SESSION_SECRET` | server | Optional (16+ characters). Key that signs editor sessions. Unset = derived from the password, so changing the password signs everyone out |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | server | Upstash Redis (Vercel Marketplace names). Where editor changes are saved in production |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | server | The same thing under Upstash's own names; either pair works |
| `CMS_FILE_PATH` | server | Optional. Where the local editor file lives (default `data/cms-overrides.json`); development and tests only |
| `FORMS_PREVIEW_MODE` | server | `true` makes forms show a labelled preview success when no database or email is configured. Remove at launch |

Business details (licenses, leadership, testimonials, photos, portal and payment links, address, hours) are **not** environment variables; see section 2, or change them in the site editor (section 15).

Delivery rules (tested): a submission succeeds if **at least one** of storage or email received it; if both are configured and both fail, or neither is configured in production, the visitor sees a clear error with the phone and email.

---

## 6. Database and migrations

Schema: `leads` (person, consent, attribution, status), `rental_analysis` (owner requests), `contact_submissions` (contact, maintenance, vendor). Row-level security is **enabled with no policies** and all privileges are revoked from `anon`/`authenticated`: the browser can never read or write these tables; only server code using the service-role key can. CHECK constraints mirror the Zod rules.

The migration was tested against Postgres 16: browser roles are denied (6 checks), 12 constraint cases reject bad data, 6 valid rows are accepted, and deleting a lead cascades to its detail rows.

**Apply (Supabase CLI):**

```bash
npm i -D supabase               # or: brew install supabase/tap/supabase
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push            # applies supabase/migrations/*.sql
```

**Or** paste `supabase/migrations/20261125000000_lead_capture.sql` into the Supabase dashboard SQL editor.

**Verify after applying** (SQL editor):

```sql
select relname, relrowsecurity from pg_class
 where relname in ('leads','rental_analysis','contact_submissions');   -- all true
select count(*) from pg_policies where schemaname = 'public';          -- 0 (deny by default)
```

**Types:** `lib/supabase/database.types.ts` is hand-maintained. Once the project is linked, regenerate with
`npx supabase gen types typescript --project-id <ref> --schema public > lib/supabase/database.types.ts` and keep the exported union aliases at the top.

**Data retention.** These tables hold personal data. Agree a retention period with the client and purge `spam`/`lost` leads on that schedule (the privacy policy currently says "as long as we need them… then delete").

---

## 7. How a form submission is handled

`app/actions.ts` → `lib/forms/pipeline.ts`, in this order:

1. **Honeypot** (`reference_code`) filled → silent success, nothing stored.
2. **Client-measured fill time** < 800 ms → silent success. (Measured in the browser, not compared to the server clock, and the threshold tolerates browser autofill.)
3. **Rate limit** (5 / 10 min / IP, in memory).
4. **Cloudflare Turnstile**, if configured (fails closed).
5. **Zod validation** server-side; errors return per-field messages **and the values typed**, so a mistake never wipes the form.
6. **Persist** (lead + detail, rolled back together on failure) and **email** staff. User text is stored as inert plain text and **HTML-escaped in the email**; control and bidi-override characters are stripped.

Notes:
- The in-memory rate limiter is best-effort on serverless (each instance has its own memory). Add a Vercel Firewall custom rule with a `rate_limit` action for `POST` requests as the authoritative control (Vercel dashboard → Firewall, or `vercel firewall rules add`).
- Forms need JavaScript; a `<noscript>` notice gives the phone and email.
- Only a hash of the IP is stored, never the address.

---

## 8. Portal and payment links

Rent collection and tenant/owner accounting are **not** built here. Put the platform's login and rent-payment URLs in the `portals` section of `src/config/site.ts` when it is live. `/tenants`, `/portal` and the header link to them (new tab, announced to screen readers). Until set, those pages show a "call or email us" instruction instead of a button.

---

## 9. Design system and contrast

**Concept: one foundation under four buildings.** Architectural drawing meets engraved brass: limestone paper, charcoal-navy ink, brass hairlines, building elevations drawn in line, and a lobby-directory metaphor for choosing where to go. The research and reasoning behind every choice are in [`DESIGN_OVERHAUL_NOTES.md`](./DESIGN_OVERHAUL_NOTES.md).

Tokens live in `app/globals.css` (`@theme`). Tailwind v4 is CSS-first, so there is no `tailwind.config.ts`. Computed WCAG ratios:

| Pair | Ratio |
|---|---|
| Text `#151B25` on limestone `#ECE6DA` / paper `#F4F0E7` / travertine `#DFD6C4` | 13.90 / 15.19 / 11.97 |
| Muted `#4D5560` on limestone / travertine | 6.07 / 5.23 |
| **Brass text on limestone: `brass-700 #7A5200`** | **5.57** (travertine: 4.80) |
| Brass `#8F5F00` on limestone / travertine | **4.44 / 3.82: fails AA**, so it is used only on the lightest paper (4.85) or at display size |
| `brass-300 #DDB56A` on charcoal `#101927` | 9.15 |
| Limestone on charcoal / sand `#C9BEA6` on charcoal | 14.20 / 9.58 |
| Charcoal on `brass-400 #C99A45` (primary buttons) | 6.88 |
| Field border `#7B7568` on paper (non-text, needs 3:1) | 4.03 |
| Danger `#A3281F` / Success `#1F6B3F` on paper | 6.41 / 5.71 |

**Type:** Instrument Serif (display, 400 only; italic reserved for pull-quotes and loaded lazily) and Instrument Sans (text and UI). Instrument Sans has true tabular figures, so every financial number uses `tabular-nums`; Instrument Serif does not, so it never sets money. Both are self-hosted via `next/font/local`.

**Surface and line:** limestone flecks and a soft light wash drawn with CSS gradients (no image: a full-width background image is an LCP candidate, and an SVG noise filter delayed LCP by over a second), 1 px drawing-grid hairlines on dark bands, dimension rules, and paper "sheets" with brass corner crop marks in place of rounded cards.

**Motion:** one choreographed moment (hero headline lines rise out of a mask, the facade draws itself) plus responses to touch: menu drawer, schematic selection, directory-row hover, the vacancy bars and figure, and the pinned services drawing. Everything sits inside `prefers-reduced-motion: no-preference`; with reduced motion the final state appears immediately. No per-section fade-ins.

**Signature components:** `Directory` (the audience selector as a lobby plaque), `Schematic` (four buildings on one foundation; which functions light up is mapped only from services the company already publishes, in `lib/schematic.ts`), `ServicesShowcase` (pinned drawing beside four index rows), `VacancyInstrument` (brass slider, hatched year bar, tweened figure; arithmetic on the visitor's own numbers only), `Building` (stroke-only elevations), and `NavDrawer` (native `<dialog>`, so the browser provides the focus trap and Escape handling).

---

## 10. Quality and security results (this build)

| Check | Result |
|---|---|
| Unit tests | 199 passing (adds the editor's safe-link rules, schema, merge/defaults, storage modes, session and login-limit logic, newsletter pipeline, and the sitemap/robots switch) |
| Playwright e2e | 150 passing, 12 skipped by design (each is specific to the phone or desktop layout, or limited to desktop to stay inside the form rate limit). Includes the editor: sign-in, tampered cookie, cross-site login, saving every kind of content, rejecting unsafe links and pictures, and seeing each change on the public site |
| axe, WCAG 2.0-2.2 A/AA | 0 violations on all 16 public routes at desktop and phone widths, on the login page, and on all 7 editor sections. Measured on the settled state (`prefers-reduced-motion: reduce`), because axe can otherwise sample text mid-fade |
| LCP and CLS (this build) | Measured unthrottled in Chrome on `/`, `/owners`, `/services` at 1440 px and 390 px, three runs each: **LCP 96-192 ms** (the headline text, not the hero photo), **CLS at most 0.004**. The hero photo is a preloaded, optimised WebP and does not become the LCP element |
| Lighthouse | Not re-run for this build. The previous design build scored Performance 95-100, Accessibility 100, Best Practices 100. Re-run before launch (the lab "simulated slow 4G" LCP of about 2.5 s is Lighthouse's throttling model, not what visitors measure) |
| Lighthouse SEO | The only failing audit on a preview is `is-crawlable`, the deliberate `noindex`; it passes once `ALLOW_INDEXING=true` is set at launch |
| `npm audit` | 0 vulnerabilities |
| Secrets in client bundle | None |
| Images | Photos in `public/photos` (about 1.1 MB in total, each at most 1280 px wide WebP) go through `next/image` (AVIF/WebP, responsive sizes). **Provenance is unconfirmed**: they came from the reference site and look like stock or rendered imagery; see `MAXALLEY_REFERENCE_AUDIT.md` |

Security headers (every route): CSP (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`; Turnstile is the only third-party origin), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Strict-Transport-Security` (no `preload`; joining the browser preload list is a one-way door to decide on later). `X-Powered-By` is removed. The CSP allows `'unsafe-inline'` for scripts because Next.js emits inline bootstrap scripts and a per-request nonce would force every page to render dynamically; the rest of the policy is tight to compensate.

---

## 11. Deployment checklist (Vercel + GitHub)

1. **Import** the GitHub repository in Vercel (framework: Next.js; defaults are correct).
2. **Set environment variables** (Production and Preview) per section 5. At minimum: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_NOTIFY_TO`, `IP_HASH_SECRET`, and both Turnstile keys.
3. **Supabase:** create the project, apply the migration, run the verification SQL (section 6).
4. **Resend:** verify the sending domain. Resend gives you DNS records to add. Add them as **new records only**; do not edit or replace the existing Microsoft 365 SPF record. If Resend asks for an SPF change on the root domain, merge it into the single existing SPF record instead of adding a second one.
5. **Turnstile:** create a widget for `totalproperty.us` and set both keys.
6. **Firewall:** add the `POST` rate-limit rule (section 7).
7. **Deploy to the preview URL** and run: a test submission of each form (confirm the database row and the email), a keyboard-only pass, a phone check.
8. **Cut over DNS** only after sign-off (section 12).
9. **After launch:** add and verify the domain in Google Search Console, submit `/sitemap.xml`, enable Vercel Web Analytics and Speed Insights, and claim the Google Business Profile.

---

## 12. DNS cutover (A and CNAME only)

> **The legacy site is not on Wix.** `totalproperty.us` currently resolves to a managed VPS (`209.142.64.131`, Apache + PHP), and the nameservers are that provider's (`ns1/ns2.cloud-6d7e86.managed-vps.net`). **Email runs on Microsoft 365**, and DNS and web hosting are at the same provider. Changing nameservers, or deleting records wholesale, would break company email.

**Rule: change only the two web records. Leave the nameservers and every mail-related record exactly as they are.**

Before touching anything: export a full copy of the current zone (every record) and keep it.

| Name | Type | Current value (verified) | Action |
|---|---|---|---|
| `@` (apex) | **A** | `209.142.64.131` | **Replace** with the A value Vercel shows for the domain |
| `www` | **A** (currently) | `209.142.64.131` | **Replace** with a **CNAME** to the target Vercel shows for the domain (remove the old A record first; a name cannot be both) |
| `@` | **MX** | `0 totalproperty-us.mail.protection.outlook.com` | **DO NOT TOUCH** |
| `@` | TXT (SPF, e.g. `v=spf1 include:spf.protection.outlook.com …`, and any verification TXT) | exists | **DO NOT TOUCH** |
| `_dmarc` | TXT | if present | **DO NOT TOUCH** |
| `selector1._domainkey`, `selector2._domainkey` | CNAME (Microsoft DKIM) | if present | **DO NOT TOUCH** |
| `autodiscover`, `enterpriseregistration`, `enterpriseenrollment`, `lyncdiscover`, `sip` | CNAME / SRV (Microsoft 365) | if present | **DO NOT TOUCH** |
| `@` | **NS** | `ns1/ns2.cloud-6d7e86.managed-vps.net` | **DO NOT TOUCH** (keep DNS at the current provider) |

**Which values?** Vercel shows the exact A and CNAME targets for your project in **Settings → Domains** after you add `totalproperty.us` and `www.totalproperty.us`; use those. Historically they have been `76.76.21.21` and `cname.vercel-dns.com`, but Vercel now issues per-project values, so copy what the dashboard shows rather than this README. Because DNS stays at the current provider, you add these records in that provider's DNS panel, not with `vercel dns`.

**Procedure**

1. Add both domains to the Vercel project; note the values shown. Set one as primary and let the other redirect.
2. Lower the TTL on the apex and `www` records to the minimum a day in advance.
3. Edit the two web records as in the table. Touch nothing else.
4. Verify: `dig A totalproperty.us +short` and `dig CNAME www.totalproperty.us +short` return Vercel's values; `curl -IL https://totalproperty.us` ends at the primary domain over HTTPS.
5. **Verify mail immediately:** send mail to and from `info@totalproperty.us`; confirm `dig MX totalproperty.us +short` still returns the Outlook host.
6. Confirm the legacy URLs redirect (`/index.php`, `/aboutus.php`, `/services.php`, `/contactus.php` → permanent redirects are built in).
7. Keep the old VPS site available for 30 days before decommissioning.

**Rollback:** restore the two original records (`A 209.142.64.131` for `@` and `www`) from your exported zone.

---

## 13. Launch blockers (need client input)

The site is built so **nothing unverified is claimed**. These fields are blank until the client confirms them, and the pages render those sections only when they are filled. **All of them are in `src/config/site.ts`** (section 2):

| Item | Where | Why it matters |
|---|---|---|
| License numbers and verification links | `licenses` | Virginia and DC generally require licensing for managing others' property; Maryland and Pennsylvania should be confirmed with the regulators |
| Leadership names, titles, photos | `leadership` | About page; the "family-backed" claim stays out until confirmed |
| Founding year, legal entity name | `company.foundedYear`, `company.legalName` | Footer copyright suggests 2009 but that is unconfirmed |
| Counsel review | `/privacy`, `/accessibility`, `/fair-housing` | Drafted from standard practice, not legal advice |
| Official Equal Housing Opportunity logo | footer | Text statement used until the asset is supplied |
| Vector logo | `components/site/logo.tsx`, `app/icon.svg` | Interim mark redrawn from the legacy glyph; commission the final artwork |
| Property photos, testimonials | `propertyPhotos`, `testimonials` | No stock imagery is used |
| Street address (or confirmation there is none), hours, emergency line | `address.street`, `contact.hours`, `contact.emergencyPhone` | A PO box is not eligible for a Google Business Profile map listing; decide street address or service-area business |
| PM platform URLs | `portals` | Enables the portal and rent-payment buttons |

---

## 14. Decisions and deviations from the brief

| Brief said | What I did | Why |
|---|---|---|
| Phase 1 palette (Alabaster, Harbor Navy, copper `#8F5F00`) | Replaced in the design overhaul by limestone / charcoal-navy / brass, as briefed | `#8F5F00` fails AA on limestone (4.44:1), so body-size brass text uses `#7A5200` and `#8F5F00` is limited to the lightest paper and display sizes. See section 9 |
| `tailwind.config.ts` | Not created | Tailwind v4 is CSS-first (`@theme` in `app/globals.css`); a config file would be a second source of truth |
| `next.config.js` | `next.config.ts` | Same behavior with type checking |
| `app/page.php` converted to `page.tsx` | `app/page.tsx` (no such PHP file existed; the legacy pages are `index.php`, `aboutus.php`, `services.php`, `contactus.php`) | Legacy URLs 301 to the new routes |
| Wix/DNS cutover table | Table is for the real legacy host (managed VPS) | Verified by DNS lookup; the site is not on Wix |
| "Free Rental Analysis interactive calculator" | An intake form plus a **vacancy calculator** that only does arithmetic on the visitor's own numbers | Public rent data for Loudoun conflicted by about 40% across sources, so a market-rent estimate would be a made-up number. A real estimator needs a licensed data source (a later phase) |
| "Professional company history" on About | About uses the company's own published copy; no history is invented | Nothing verifiable beyond the live site; founding year and leadership appear once supplied |
| "Online payment gateway placeholders" | Outbound links set in `src/config/site.ts`; call-or-email fallback text when blank | The plan excludes custom rent collection |
| Centralize pending info in `src/config/site.ts` | Done. `src/` holds only `config/`; the rest stays at the repo root, reached through the `@config/*` import alias | Moving the whole project under `src/` would churn every import for no benefit. Portal links moved from env vars into this file so there is one place to edit |
| (My own earlier copy) "Our office is in Purcellville" | Removed. The site says "We're based in Purcellville" until a street address is entered | Only a PO box is verified; the site must not imply a walk-in office |
| Pages listed | Also built `/services`, `/commercial`, `/lenders`, `/portal`, `/privacy`, `/accessibility`, `/fair-housing` | The homepage's four pillars and the forms' consent text need real destinations; housing sites need a fair-housing statement |
| `leads`, `rental_analysis`, contact submissions tables | Done, plus attribution columns and kind-specific constraints | Maintenance and vendor requests share `contact_submissions` |

Known limits: forms need JavaScript; the in-memory rate limiter is per-instance (use the Firewall rule); home-page mobile LCP is 2.6 s in the slow-4G lab (verify with field data); the lender/REO tracking module and the owner/tenant dashboards are later phases by design.

---

## 15. The site editor (/admin)

*For Uncle Rafi.* You can change the wording, services, properties, contact details and search-result text yourself. No code, nothing to install.

**Sign in.** Go to `https://totalproperty.vercel.app/admin` (later `https://totalproperty.us/admin`) and enter the password. The page is private and never appears in Google. Sessions last a week; use **Sign out** on a shared computer.

**Save.** The bar at the bottom of the screen says **You have unsaved changes** until you press **Save changes**. Your edits go live within a few seconds; press **View the site** to see them. **Discard changes** goes back to the last saved version. If something is wrong (for example a link that does not start with `https://`), the editor tells you which field and does not save anything.

| Tab | What you can do |
|---|---|
| **Announcement** | Turn a banner (across the top of every page) or a pop-up (once per visit) on or off. Headline, message, a button and where it goes. Your wording is kept when you switch it off. |
| **Homepage & hero** | The big headline (up to three lines), the paragraph under it, the two buttons, the pit bull line, and up to four key points. |
| **Services** | Add, edit, reorder or hide each service (Landlord, Tenant, Construction, Residential, Lender/REO, and two ready-made ones you can switch on: Maintenance and Leasing). The same tab edits the photo cards under "Property types we manage". |
| **Featured properties** | Add rentals or spaces: title, picture (with a live preview), rent, details, location and a status badge (Available now, Coming soon, Application pending, Recently leased). They appear on **Looking For a Space**; the first three also appear on the home page. With none, the page invites people to get in touch. |
| **Company, reviews & portals** | Phone, after-hours phone, email, office hours (a day-by-day grid that also feeds Google), license numbers for VA, MD, PA and DC (blank rows are never shown), client reviews, and the Owner, Tenant and Pay-rent login links (must start with `https://`). |
| **SEO & page titles** | The title and description Google shows for every page, with a live preview and a character guide, plus your local keywords. |
| **Careers** | Openings for the Join Our Team page and the "Why work here?" list. With none, the page asks people to send a résumé to your email. |

**Pictures.** Paste a picture link that starts with `https://`, or press **Choose from the photo library** to pick one of the bundled photos. You cannot upload files in the editor. To use your own photos, put the files in `public/photos/` (or host them anywhere with an `https://` address) and paste the link. Always fill in "Describe the picture": it helps people who cannot see it and helps search.

**Ordering and hiding.** Use the up and down arrows to reorder. A **Showing / Hidden** switch hides something without deleting it. **Remove** asks a second time before deleting.

**Two windows at once.** If you save from one window and then try to save an older copy from another, the editor stops you and asks you to reload, so you never overwrite newer work.

**Forgot or want to change the password.** In Vercel, open the project, Settings, Environment Variables, change `ADMIN_PASSWORD` (at least 12 characters) and redeploy. Everyone is signed out.

**What the editor does not do.** It changes content, not layout or design, and it does not publish the site to a new address.

### How it is protected

- One password (`ADMIN_PASSWORD`, at least 12 characters), compared in constant time. A wrong password gets a short delay; more than 8 attempts in 15 minutes from one address are refused (shared across servers when Upstash is connected).
- A signed session cookie: `HttpOnly`, `SameSite=Lax`, `Secure` in production, 7 days. Tampered or expired cookies are rejected. Login and logout also refuse requests that do not come from this site.
- Every save re-checks the session on the server and validates everything with Zod. Links may be `https://`, `http://`, `mailto:`, `tel:` or a page on this site; pictures may be `https://` or a file on this site. `javascript:`, `data:` and look-alike tricks such as `//evil.com` are rejected, and the same checks run again when a page renders.
- `/admin` and `/api/admin` always send `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: no-store`, are disallowed in `robots.txt` and are never in the sitemap, even after `ALLOW_INDEXING=true`.
- A broken or unreachable store can never take the public site down: it falls back to the standard content.

---

## 16. Connect Upstash (so saving works in production)

Until a database is connected the editor on Vercel opens but shows a red notice and **will not save** (a serverless disk would silently forget your changes). Locally, with no setup, edits are saved to `data/cms-overrides.json`.

**Set up (about five minutes, free tier is enough):**

1. In Vercel, open the **totalproperty** project, then **Storage**, then **Create Database**, then choose **Upstash** (Redis). Pick the region nearest to Virginia (for example `iad1`/N. Virginia) and the free plan.
2. When asked, **connect it to this project** for Production, Preview and Development.
3. Open **Settings, Environment Variables**. You should now see `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`). Either pair works; nothing else to copy.
4. Add `ADMIN_PASSWORD` (at least 12 characters) if you have not already. Optionally add `ADMIN_SESSION_SECRET` (any random 16+ characters, for example the output of `openssl rand -hex 24`).
5. **Redeploy** (Deployments, the latest one, Redeploy) so the new variables take effect.
6. Open `/admin`, sign in, change something small and press **Save changes**. The red notice is gone, and the change appears on the site.

Not using the Marketplace? Create a Redis database at upstash.com, copy the **REST URL** and **REST token** (not the `redis://` address), and add them as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

**Good to know.** The content is one small JSON value stored under `tpm:cms:overrides:v1`; the version before each save is kept at `tpm:cms:overrides:v1:previous`, so an emergency restore is possible from the Upstash console. Public pages stay statically generated and fast: saving triggers an immediate revalidation, and as a safety net they also refresh within 5 minutes.

---

## 17. First-page search and Google Ads launch checklist

**Be realistic.** No one can promise a first-page ranking. This build removes the technical obstacles and gives you the signals Google uses for local results; the rest is your Google Business Profile, reviews and time. Everything below assumes the preview site is signed off.

### A. Switch the site on for search (once, at DNS cutover)

- [ ] Finish the DNS steps in section 12 (A and CNAME records only; leave the Microsoft 365 MX and TXT records alone).
- [ ] In Vercel set `NEXT_PUBLIC_SITE_URL=https://totalproperty.us` and `ALLOW_INDEXING=true`, then redeploy. Remove `FORMS_PREVIEW_MODE`.
- [ ] Check `https://totalproperty.us/robots.txt` allows crawling and lists `/sitemap.xml`; check `/sitemap.xml` lists every page; check a page's source no longer says `noindex`.
- [ ] Check `https://totalproperty.us/admin` still answers with `noindex`.
- [ ] In the editor, open **SEO & page titles** and read each page's title and description; they already include Purcellville and your service areas.
- [ ] In the editor, fill in **office hours** and confirm the phone number. They feed Google's business data.
- [ ] Add the **license numbers** you have confirmed, and real **client reviews** (with permission). Both are hidden until filled in.

### B. Google Business Profile (the biggest local-ranking lever)

- [ ] Create or claim the profile at business.google.com. Category: **Property management company**; add secondary categories that truly apply (for example **Commercial real estate agency** only if licensed as such).
- [ ] **Address.** Google does not accept a PO box as a business location. Either add a real street address, or set the profile up as a **service-area business** (hide the address, list Purcellville, Loudoun County, Virginia, Maryland, Pennsylvania and DC). If you add a street address, also put it in `src/config/site.ts` (`address.street`) so the site and Google match.
- [ ] Use the **exact** business name, phone `202-528-0140` and website `https://totalproperty.us`, matching the site's footer (consistency matters).
- [ ] Add the same hours as the editor, your services, and real photos of your team and properties (the bundled stock images are for the website only).
- [ ] Complete verification (video, phone or postcard, as offered).
- [ ] Ask satisfied clients for reviews with your profile's review link; reply to every review. Never buy or incentivise reviews.

### C. Google Search Console and Bing

- [ ] At search.google.com/search-console add the **Domain** property `totalproperty.us`. Verification adds one DNS **TXT** record: add it alongside the existing Microsoft 365 records and remove nothing.
- [ ] Open **Sitemaps** and submit `https://totalproperty.us/sitemap.xml`.
- [ ] Use **URL Inspection** on `/`, `/owners`, `/tenants`, `/commercial` and `/spaces`, then **Request indexing**.
- [ ] After a week, check **Pages** (indexed or not, and why) and **Core Web Vitals**.
- [ ] Optional: import the site into Bing Webmaster Tools from Search Console.

### D. Local citations (name, address, phone must match everywhere)

Add or claim the business, with identical details, on: Apple Business Connect, Bing Places, Yelp, Facebook, LinkedIn, the Better Business Bureau, Nextdoor Business, your chamber of commerce or business association (for example Loudoun County and Purcellville), and any industry or licensing directory you genuinely belong to. Skip anything you do not qualify for. Link each listing to `https://totalproperty.us`.

### E. Google Ads

- [ ] Landing pages: **`/owners`** (landlords: keyword headline, free rental analysis, vacancy calculator, tap-to-call and a sticky call/analysis bar on phones) and **`/commercial`**. **`/tenants`** serves people who already rent from you (pay rent, report a repair, portal), so use it for branded searches rather than prospecting. `/spaces` suits "space for lease" searches once properties are listed.
- [ ] Tag every ad's final URL with first-touch attribution, which the site records on every form: `?utm_source=google&utm_medium=cpc&utm_campaign=owners-purcellville` (change the last part per campaign). Each submission stores these in the `leads` table.
- [ ] Start small: a Search campaign, location-targeted to your real area, phrase and exact-match keywords such as "property management Purcellville", "rental property management Loudoun County", "commercial property management Northern Virginia"; add negatives such as "jobs", "salary", "software", "for sale".
- [ ] Add call and sitelink assets pointing at `/owners#analysis`, `/commercial`, `/contact`.
- [ ] Measure: the site has no analytics tag yet (a deliberate choice: nothing third-party loads, and the Content-Security-Policy would block it). To count form conversions in Google Ads, ask for the Google tag to be added with a consent banner and a matching CSP change; until then use the `leads` table and phone-call reporting.
- [ ] **Local Services Ads** use a separate Google screening and are available only in certain categories and areas: check eligibility in your Google Ads account before planning for them.
- [ ] Housing advertising has special fair-housing rules at Google and in law: keep ad copy neutral and never target by protected characteristics.

### F. Keep earning the ranking

- Keep wording specific: name the town, county and service in the editor's text fields. Rewrite titles and descriptions if a page is not getting clicks.
- Publish real, updated spaces under **Featured properties**; fresh, accurate listings are useful to visitors and to Google.
- Keep your hours, phone and services identical on the site, your Google profile and every citation.
