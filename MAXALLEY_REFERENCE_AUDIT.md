# Maxalley reference audit: `maxalley.net/tpm/`

Inspected 2026-11-25. This is Uncle Rafi's working draft of the new site. Everything below was read from the
live HTML, CSS, JavaScript and image files, not inferred. "Ours" means this Next.js codebase.

## 1. What the reference actually is

| Fact | Detail |
|---|---|
| Pages that exist | `index.php`, `services.php`, `team.php`, `about.php` (4 of 8 nav items). |
| Nav items with no page | **Looking For a Space**, **Newsletter**, **Vendors**, **Contact** all point to `#`. `contact.php`, `vendors.php`, `newsletter.php`, `space.php` return 404. |
| Stack | PHP includes + Bootstrap 5 template ("Starter"), Swiper (fade carousel), anime.js (preloader), swup (page transitions), Rellax (parallax), Font Awesome. ~7 JS files, no analytics. |
| SEO state | `<title>Starter</title>` on every page. Open Graph tags are literal placeholders (`content="content"`, `image="image"`). No meta description, no canonical, no `<h1>` anywhere (page titles are `<h2>`), no `robots.txt`, no `sitemap.xml`. |
| Performance | A 2.2 s branded preloader hides the page on every load before anything is readable. Hero is a 319 KB background photo plus a four-image carousel. |
| Brand | Red pit bull head mark and a horizontal lock-up with a skyline. Tagline "We are pitbulls about our client's assets." Dark nav bar, white body. |
| Business facts shown | Phone **202-528-0140**, email **info@totalproperty.us**, **Purcellville, VA 20132**, "Our geographic focus includes Virginia, Maryland, Pennsylvania and the DC area." Copyright reads "© 2026 / All rights reserved" (no entity name). |

## 2. Section-by-section inventory and where each lands in ours

### `index.php` (Home)

| # | Reference section | Copy / content | Ours |
|---|---|---|---|
| 1 | Preloader | Dog mark and progress bar for ~2.6 s | **Dropped.** It delays first paint and content for no benefit. The dog mark moves into the header and the statement band. |
| 2 | Dark nav bar | Logo, then Home, Services, Join Our Team, About, Looking For a Space, Newsletter, Vendors, Contact | Same eight items, same order, as the primary nav (`components/site/header.tsx`). The audience routes (Owners, Tenants, Commercial, Lenders) move to a slim utility strip and the menu drawer. |
| 3 | Hero | Construction photo background. H2 "Total Property / Management". Paragraph: "Total property management provides a "one stop" property management solution for owners, landlords, tenants, and lenders. We have designed a customer driven process which provides total "end to end" management of commercial property." Right column: fading carousel of office, retail, condos, industrial. | Home hero: same headline, same paragraph (see decision D1), same four slides, as a framed plate with a **pause control** (WCAG 2.2.2). Headline is the page `<h1>`. Editable in admin: Homepage tab. |
| 4 | Statement band | Dog mark + "We are pitbulls about our client's assets" | `StatementBand`, repeated under every page hero, as in the reference. Editable: Homepage tab. |
| 5 | Property Types We Manage | 5 image cards in a 3 + 2 (offset) grid: Retail, Industrial, Marinas, Hospitality, Office | Staggered photo plates. Same five, same copy (see D2), plus Residential (D3). Editable list: Services tab. |
| 6 | Footer, column 1 | Dog mark + "Our geographic focus includes Virginia, Maryland, Pennsylvania and the DC area. Our goal is to provide exceptional customer service along with a complete customer package designed to meet your needs and enhance asset values." | Footer keeps this paragraph verbatim. |
| 7 | Footer, column 2 | Call / Email / Where, plus a "Get In Touch" button | Same three facts. The button pointed at **a third-party theme demo URL** (`webredox.net/demo/...`); ours goes to `/contact`. |
| 8 | Footer, column 3 | Newsletter: email field and Send button, **no form action** | Real signup (`/newsletter`, footer form) through the same Zod, honeypot, rate-limit and UTM pipeline as every other form. |
| 9 | Hidden (HTML comments) | Three accordions per property type: Landlord Services, Tenant Services, Commercial Construction Services | Same text as the services page. Already transcribed in `lib/catalog.ts` and now shown on `/services`. |

### `services.php`

| Section | Content | Ours |
|---|---|---|
| Statement | "Dedicated to providing the highest quality service" | `StatementBand` |
| Landlord Services (image right) | "We are the first point of contact for all tenants and offer the following services:" + 18 chips (All Maintenance, Service Contracts, Landscaping, Litter Control, Lot Sweeping, Snow Removal, Lease Management, Financial Reporting, Accounting, Rent Coordination, Rent Delinquency, Annual Budgets, Expense Tracking, Budget Management, Tenant Relations, Security Coordination, Property Emergency, Lease Advertising) | Alternating image/text split, chips as a ruled two-column list. |
| Tenant Services (image left) | "Our added value approach ensures all aspects of the property management are handled for the landlord as well as providing peace of mind for tenants as we assist with lease maintenance obligations:" + 4 chips | Same. |
| Commercial Construction Services (image right) | "Our team oversees and coordinates all construction needs for our clients:" + 14 chips | Same. |
| Ours, added | Residential owner services and Lender / REO services (both verified on the company's previous live site) | Rows 4 and 5 of the same list. Maintenance and Leasing exist as ready-to-switch-on entries (hidden by default, see D4). All editable: Services tab. |

### `team.php` ("Join Our Team")

| Section | Content | Ours |
|---|---|---|
| Statement | "The highest quality service to our clients" | `StatementBand` |
| Left column | "Property Types We Manage": 4 photo tiles (Office, Retail, Hospitality, Industrial) | Same four tiles, linked to the home page property list. |
| Right column | "Careers": "We are hiring experienced and motivated professionals who are passionate about providing a high-quality client experience." Then **5 placeholder rows: "Job Title - Brief Description" with Apply buttons to `#`** | `/careers`. Intro copy verbatim. Rows come from the admin Careers tab. **No openings are invented**: with none entered the page says so and shows an email link. |
| Why Work Here? | Parallax photo and **four placeholder buttons "Benefit #1" to "Benefit #4"** | Rendered from admin-entered benefits only; the section is hidden while empty. |

### `about.php`

| Section | Content | Ours |
|---|---|---|
| Statement | "Designed to meet your needs and enhance asset values" | `StatementBand` |
| Who are we? | "...total "end to end" management of both commercial and residential property. Our geographic focus includes Virginia, Maryland, Pennsylvania and the DC area..." | Verbatim, as an image/text split. |
| Why are we different? | "Typically, a property management company would provide a service for either a landlord or tenant. We go one step further by providing a Total Property Management service. Our added value approach ensures all aspects of property management are handled for the landlord as well as providing peace of mind for tenants as we assist with lease maintenance obligations." | Verbatim. |

### Nav items with no page in the reference (built new)

| Nav item | What we built |
|---|---|
| Looking For a Space | `/spaces`. Cards from the admin **Featured Properties** tab (photo, title, rent/specs, location, status badge). Empty state tells people to call or write instead of showing fake listings. |
| Newsletter | `/newsletter`, plus the footer form. |
| Vendors | `/vendors` (already built, now in the primary nav). |
| Contact | `/contact` (already built). |

## 3. Defects in the reference, and what we did

| Defect | Resolution |
|---|---|
| `<title>Starter</title>`, placeholder Open Graph, no meta description | Per-page title and description, editable in the admin SEO tab; dynamic Open Graph. |
| No `<h1>`; page titles are `<h2>` | One keyword-rich `<h1>` per route. |
| Retail copy says "all **Excuse**, Multi-Tenant, and single tenants type properties" | "Excuse" is a typo for a word we cannot confirm. Published as "all multi-tenant and single-tenant retail properties". **Ask Rafi which word he meant.** |
| Hero says "management of commercial property"; About says "both commercial and residential" | See D1. |
| Contact button links to `webredox.net/demo/...` | Replaced with `/contact`. |
| Newsletter form is inert (no action, `type="button"`) | Real, working signup. |
| `alt="..."` on most images, none on the carousel | Descriptive alt text on every image. |
| `aria-current="page""` (stray quote), nav `href="#"` | Valid markup, real routes. |
| Favicons referenced but 404 | Existing site icon kept. |
| Preloader delays every page load by ~2.6 s | Removed. |
| Text baked into nothing (copy is HTML already) | Nothing to transcribe from images; all copy was real text. |

## 4. Assets

| Asset | Status |
|---|---|
| `TPM_Logo_red_dog.webp`, `TPM_Logo_red_horizontal.webp` | Brand assets. Copied and resized to `public/photos/tpm-mark.webp` and `tpm-logo-horizontal.webp`. |
| 16 photographs (office, retail, condos, industrial, marina, hospitality, construction, blueprint, handshake, team) | Copied, converted to ≤1280 px WebP (`public/photos/`). **Provenance is unverified.** They read as AI-generated renderings and stock photos, not Total Property's own managed buildings. Captions describe the *type* of property, never imply it is a client's. **Rafi should confirm the right to use them**, and replace them from the admin (image fields accept any https image URL) or by swapping files in `public/photos/`. |
| `6.jpg`, `12-1.jpg`, `14.jpg`, `4.jpg`, `1-7.jpg` | Template leftovers (a house render, a stool, an office). Not used. |
| `home-construction-2.webp` (hero background) | Not used; the hero is the framed slide plate instead. |

## 5. Decisions where the reference was ambiguous

- **D1. Hero and About disagree** on commercial-only versus commercial and residential. We use "both commercial and residential" everywhere, because that is what the company's previous live site and the About page say, and the Owners funnel depends on it.
- **D2. Property card copy** is the reference's own, corrected only for the "Excuse" typo.
- **D3. Residential** is added as a sixth property type (reference has five), linked to `/owners`, so the residential audience has an entry point on the home page. Hide it from admin if unwanted.
- **D4. Maintenance and Leasing** services are pre-written from the reference's own landlord chips and hidden by default so nothing is duplicated on the page. Switch them on from admin.
- **D5. Route names.** `team.php` became `/careers`, `space` became `/spaces`. Legacy `.php` URLs redirect permanently.
- **D7. Construction chips.** The reference's Commercial Construction list repeats five Landlord chips (All Maintenance, Service Contracts, Landscaping, Litter Control, Lot Sweeping), which reads as a copy-and-paste slip. We keep the nine construction chips and drop the five repeats. Put them back from the Services tab if intended.
- **D6. Nothing unverified is added.** No licenses, founding year, leadership, testimonials, openings or listings were invented; each stays hidden until Rafi enters it.

## 6. Mapping: reference to routes and editable content

| Reference | Route | Editable in admin |
|---|---|---|
| `index.php` | `/` | Homepage tab (headline, lede, CTAs, statement, value props); Services tab (property types); Featured Properties (home strip) |
| `services.php` | `/services` | Services tab |
| `team.php` | `/careers` | Careers tab |
| `about.php` | `/about` | Company tab (testimonials, licenses) |
| Looking For a Space | `/spaces` | Featured Properties tab |
| Newsletter | `/newsletter` + footer | n/a (form) |
| Vendors | `/vendors` | n/a (form) |
| Contact | `/contact` | Company tab (phone, email, hours) |
| Footer facts | every page | Company tab |
| `<title>` / description | every page | SEO tab |

## 7. What was built from this audit

- Pages: `/` (reference order), `/services`, `/careers` (was `team.php`), `/about`, `/spaces`, `/newsletter`, plus the existing `/vendors`, `/contact`, `/owners`, `/tenants`, `/commercial`, `/lenders`, `/portal`.
- Legacy and draft URLs redirect permanently: `/index.php`, `/aboutus.php`, `/services.php`, `/contactus.php`, `/about.php`, `/team`, `/team.php`, `/space`.
- Every reference placeholder was resolved rather than copied: "Starter" titles, `content`/`image` Open Graph values, "Job Title - Brief Description", "Benefit #1-4", the theme-demo contact link and the inert newsletter form.
- Everything editable from `/admin` is listed in the table above (section 6) and in README section 15.
