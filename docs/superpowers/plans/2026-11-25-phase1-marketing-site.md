# Phase 1 Marketing Site & Conversion Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a production-grade Next.js marketing site for Total Property Management with a validated, rate-limited lead-capture pipeline (Supabase + email) and the four-pillar positioning from the approved plan.

**Architecture:** Next.js App Router, server components for pages, Server Actions for forms. Every submission passes one pipeline (`lib/forms/pipeline.ts`): honeypot → timing → rate limit → Turnstile (if configured) → Zod → persist → notify. The pipeline takes its store, mailer and verifier as injected dependencies so it is unit-testable without network. Supabase tables are RLS-locked; only the server (service role) writes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4 (CSS-first config), hand-written shadcn/ui-style primitives (Radix Slot/Label, cva), Zod 4, `@supabase/supabase-js`, Resend REST (fetch), Vitest, Playwright + axe-core.

**Spec:** `MASTER_TRANSFORMATION_PLAN.md` (§2–§6) + `TOTAL_PROPERTY_AUDIT.md`, and the Phase 1 build brief in the conversation (reconciliations recorded in README "Decisions & deviations").

## Global Constraints

- Exactly one `<h1>` per page; WCAG 2.2 AA; contrast ≥ 4.5:1 for text (computed, not eyeballed).
- No unverified claims: no "family-backed", founding year, unit counts, licence numbers, SLAs, fees, ratings, testimonials. Facts allowed only from the live site: Purcellville VA PO Box 95 20132; 202-528-0140; info@totalproperty.us; VA/MD/PA/DC; service list in audit §2.2.
- Optional facts (licences, leadership, founded year) live in `lib/site.ts` and render only when present.
- Secrets are server-only (`import "server-only"`); only `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_TURNSTILE_SITE_KEY` are public.
- No custom rent collection, ledgers, or owner accounting. Payment/portal URLs are env-configured outbound links.
- No `TODO`/placeholder comments. If a service is unconfigured the UI says so honestly; production never fakes success.
- Never touch Microsoft 365 MX/TXT during cutover (README table).

## Review Focus

1. Submitter pastes HTML/`<script>`/control characters in free text → stored as plain text, escaped in email, no markup injected.
2. Bot fills honeypot or submits in <2 s → silent success, nothing stored or emailed.
3. Same IP floods a form → 429-style error after the limit, not an outage.
4. Supabase configured but email isn't (or vice-versa) → submission still succeeds if at least one channel durably received it; neither configured in production → honest 503 error.
5. Rent/vacancy calculator receives empty, zero, negative, or absurd numbers → no `NaN`/`Infinity` displayed.

---

## File Structure

| Path | Responsibility |
|---|---|
| `app/layout.tsx`, `app/globals.css` | Fonts, tokens (`@theme`), shell |
| `app/(pages)…` | One folder per route (page.tsx only + route-local components) |
| `app/actions.ts` | Server Actions: thin wrappers around the pipeline |
| `lib/site.ts` | Verified company facts, nav, pillars, portal URLs |
| `lib/forms/schemas.ts` | Zod schemas + `FormState` type |
| `lib/forms/security.ts` | `createRateLimiter`, `cleanText`, `hashIp`, `verifyTurnstile` |
| `lib/forms/pipeline.ts` | `processSubmission(deps, input)` |
| `lib/forms/mailer.ts` | `renderNotification`, `sendViaResend` |
| `lib/forms/store.ts` | `createSupabaseStore` implementing `LeadStore` |
| `lib/supabase/admin.ts`, `database.types.ts` | Admin client + hand-maintained types |
| `lib/calc/vacancy.ts` | Vacancy-cost arithmetic (user inputs only) |
| `components/ui/*`, `components/forms/*`, `components/site/*` | Primitives, forms, header/footer |
| `supabase/migrations/*.sql` | Schema + RLS |
| `tests/unit`, `tests/e2e` | Vitest, Playwright+axe |

---

### Task 1: Scaffold, config, tokens
**Files:** Create `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `.env.example`, `app/globals.css`, `app/layout.tsx`, `lib/utils.ts`.
**Interfaces:** Produces `cn(...classes): string`; CSS tokens `--color-alabaster`, `--color-navy`, `--color-ink`, `--color-copper` (`#8F5F00`), `--color-gold`, etc.; security headers incl. CSP.
- [ ] Install deps; configure aliases `@/*`; strict TS.
- [ ] Define tokens in `@theme`; fonts via fontsource (self-hosted).
- [ ] Verify: `npx tsc --noEmit` and `npm run lint` pass on the skeleton.
- [ ] Commit.

### Task 2: Site config
**Files:** `lib/site.ts`, test `tests/unit/site.test.ts`
**Interfaces:** Produces `siteConfig`, `navLinks`, `pillars` (4), `portalUrls()` returning `{owner?, tenant?, payment?}` from env.
- [ ] Test: `siteConfig.phone` is `202-528-0140`; `pillars.length === 4`; `portalUrls()` omits unset/invalid URLs and rejects non-https.
- [ ] Implement; commit.

### Task 3: Validation schemas (TDD)
**Files:** `lib/forms/schemas.ts`, test `tests/unit/schemas.test.ts`
**Interfaces:** `rentalAnalysisSchema`, `contactSchema`, `maintenanceSchema`, `vendorSchema`, `type FormState = {status:"idle"|"success"|"error"; message?:string; fieldErrors?:Record<string,string[]>}`; shared `baseFields` (honeypot `website`, `startedAt`, `consent`).
- [ ] Tests: valid payload passes; bad email/ZIP/state fail with field errors; `consent` must be `"on"`/true; fields trimmed; message >2000 chars fails; phone normalized to digits ≥10.
- [ ] Implement; verify pass; commit.

### Task 4: Security utilities (TDD)
**Files:** `lib/forms/security.ts`, test `tests/unit/security.test.ts`
**Interfaces:** `createRateLimiter({limit,windowMs,now?}) => {check(key): {ok:boolean; retryAfterMs:number}}`; `cleanText(s: string): string` (strip control chars, normalize whitespace, keep newlines); `hashIp(ip: string, secret: string): string`; `verifyTurnstile(token, secret, ip?, fetchImpl?): Promise<boolean>`.
- [ ] Tests: limiter allows `limit` then blocks, resets after window; `cleanText("<b>a</b>\u0000")` keeps text, drops NUL; `hashIp` stable, not equal to input; turnstile false on non-success / network error.
- [ ] Implement; commit.

### Task 5: Database
**Files:** `supabase/migrations/20261125000000_lead_capture.sql`, `lib/supabase/database.types.ts`, `lib/supabase/admin.ts`, `lib/forms/store.ts`
**Interfaces:** Tables `leads`, `rental_analysis`, `contact_submissions` (RLS on, no anon/authenticated grants). `interface LeadStore { insertRentalAnalysis(...): Promise<{id:string}>; insertContact(...): Promise<{id:string}> }`; `createSupabaseStore(): LeadStore | null` (null when env missing).
- [ ] Apply migration to a local Postgres 16; assert anon/authenticated roles cannot select/insert; service role can; check constraints reject bad enums.
- [ ] Implement store with compensation (delete lead if detail insert fails).
- [ ] Commit.

### Task 6: Pipeline, mailer, actions (TDD)
**Files:** `lib/forms/mailer.ts`, `lib/forms/pipeline.ts`, `app/actions.ts`, tests `tests/unit/pipeline.test.ts`, `tests/unit/mailer.test.ts`
**Interfaces:** `processSubmission(deps: {store: LeadStore|null; mailer: Mailer|null; limiter; verifyHuman; now; isProduction}, kind, formData, ctx:{ip:string;userAgent:string}): Promise<FormState>`; `renderNotification(kind, data) => {subject; text; html}` (escapes HTML).
- [ ] Tests (one per Review Focus 1–4) plus: success path stores + emails; email failure after store success → success; store failure → error; neither configured & production → error; dev → success with console notice.
- [ ] Implement; commit.

### Task 7: UI kit, shell, forms
**Files:** `components/ui/{button,input,textarea,label,select,checkbox-field,card,section}.tsx`, `components/site/{header,mobile-nav,footer,logo,skip-link}.tsx`, `components/forms/*`
**Interfaces:** `<Field>` renders label+error with `aria-describedby`/`aria-invalid`; `<FormShell action>` uses `useActionState`; honeypot rendered off-screen with `tabIndex=-1`, `aria-hidden`.
- [ ] Build; manual axe in Task 9; commit.

### Task 8: Pages & SEO
**Files:** pages for `/`, `/owners`, `/tenants`, `/vendors`, `/about`, `/contact`, `/services`, `/commercial`, `/lenders`, `/portal`, `/privacy`, `/accessibility`, `/fair-housing`; `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`, `app/opengraph-image.tsx`, `lib/calc/vacancy.ts` + test.
**Interfaces:** `vacancyCost({monthlyRent, vacantDays}): {annualPotential:number; lostIncome:number; perVacantMonth:number} | null` — `null` for invalid input.
- [ ] Test calc: `{monthlyRent:3000, vacantDays:30}` → `annualPotential` 36000, `perVacantMonth` 3000, `lostIncome` ≈ 2958.90 (annual ÷ 365 × days); negatives/NaN/Infinity/`vacantDays>365` → `null`.
- [ ] Build pages; JSON-LD on layout; metadata per page; commit.

### Task 9: QA & docs
**Files:** `tests/e2e/*.spec.ts`, `README.md`
- [ ] `npm run lint`, `typecheck`, `test`, `build` all green.
- [ ] Playwright: every route has one `<h1>`, axe (wcag2a/2aa/21aa/22aa) has zero violations at 375px and 1280px; invalid form submit shows errors.
- [ ] Headers check; `git grep` for secrets; README with setup, migrations, Vercel checklist, DNS table (managed VPS, not Wix; leave MX/TXT).
- [ ] Commit; push.
