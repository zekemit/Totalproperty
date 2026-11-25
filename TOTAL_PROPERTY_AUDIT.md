# TOTAL PROPERTY — External Intelligence & Company Audit

**Subject:** Total Property Management — `totalproperty.us`
**Audit date:** 2026-11-25
**Phase:** 1 of 2 (research only — no application code written)
**Companion document:** [`MASTER_TRANSFORMATION_PLAN.md`](./MASTER_TRANSFORMATION_PLAN.md)

### Evidence labels used throughout

| Label | Meaning |
|---|---|
| **[LIVE]** | Observed directly by me on 2026-11-25 (HTTP fetch, DNS lookup, image inspection). Highest confidence. |
| **[3P]** | Reported by a third-party source in search results; I did not verify it at the primary source. |
| **[INFERRED]** | My reasoning from verified facts. May be wrong. |
| **[UNVERIFIED]** | Could not be confirmed. Treat as an open question for the client. |

---

## 0. Findings That Change the Brief

1. **The site is not offline.** `totalproperty.us` returns HTTP 200 on apex and `www` **[LIVE]**. It is a four-page, 2009-era PHP/XHTML brochure site. The brief's premise ("offline or unreachable") is wrong, which is good news: we have primary-source brand, service and positioning data instead of having to reconstruct it from archives.
2. **The company is nearly invisible on the open web.** Seven independent searches (name, domain, phone, PO box, tagline, city + category) surfaced only a Yellow Pages category listing and the site's own contact page. No reviews, no Google Business Profile discovered in search, no social footprint, no press, no directory profile with detail **[3P]**. Inbound demand from search is effectively zero today **[INFERRED]**.
3. **"Total Property" is a collision-prone name.** At least six unrelated U.S. firms trade as "Total Property (Management)" (Tulare CA, Las Vegas NV, Bakersfield CA, Lake Forest CA, Milton WA, Kalispell MT) plus UK/Australian firms **[3P]**. **None of their reviews or ratings belong to this company** and must not be used as evidence about it.
4. **"Family-backed" is unverified.** Nothing on the live site or in search results mentions family ownership, founders, leadership, headcount or portfolio size **[UNVERIFIED]**. The brand claim in the brief cannot be used on the new site until the client confirms it.
5. **The business is broader than "property management."** It is four-sided — **Owner, Landlord (commercial), Tenant, Lender** — and includes **commercial construction management** and **foreclosure/REO property preparation** **[LIVE]**. That is unusual and is the company's real differentiator. Almost every competitor I observed is residential-only.
6. **The brand already has a strong, ownable asset:** a pit-bull mascot and the line *"We are pitbulls about our client's assets."* **[LIVE]** It is a tenacity/protection promise. It also carries a tone and policy risk with tenants (see §4.4).

---

## 1. Methodology and Source Limits

| Step | Result |
|---|---|
| Fetch live site (`/`, `aboutus.php`, `services.php`, `contactus.php`, `styles.css`, `robots.txt`, `sitemap.xml`) | **Success.** Pages 1–4 and CSS retrieved; robots.txt and sitemap.xml return 404. |
| Download and visually read page images (`services.gif`, `flowchart.gif`, `top.jpg`) | **Success.** The services list and process diagram exist *only* as images, so I read them directly. |
| DNS / mail records via public DNS-over-HTTPS | **Success** (MX, NS). |
| Wayback Machine availability API | Reports a snapshot dated **2025-03-13**. |
| Wayback page/CDX fetches | **Blocked by the sandbox's egress policy.** I did not attempt to bypass it. Snapshot *contents* were not retrieved, so the historic-branding review below relies on the live site's own artifacts (copyright range, image styles). |
| Semrush traffic/keyword data | **Unavailable** — the connected Semrush account has no API units left. No traffic or backlink numbers are claimed anywhere in this report. |
| RDAP/WHOIS | No RDAP service for `.us`; registrant data not obtained. |
| Web searches (18 queries) | Company footprint, competitors, software benchmarks, licensing, market data, payments, lead-gen patterns. Search summaries are secondary and are labelled **[3P]**. |
| Competitor site fetches | Intempus, Bay Property Management Group and Buildium succeeded; the AppFolio URL I guessed returned 404 (not used). |

**Net effect:** company facts are strong because they come from the company's own site. Reputation, portfolio and history are *unknowns*, not negatives.

---

## 2. Company Profile

### 2.1 Verified facts [LIVE]

| Attribute | Value |
|---|---|
| Trade name | Total Property Management |
| Name variants on the site | "Total Property" (meta copyright), "Total Properties" (mailing address) — three spellings, one company **[INFERRED]** |
| Self-description | "One stop" property management solution for **owners, landlords, tenants and lenders**; "total end to end management of both commercial and residential property" |
| Differentiator (their words) | Most firms serve either the landlord or the tenant; Total serves both and "assists with lease maintenance obligations" for tenants |
| Geography | "Virginia, Maryland, Pennsylvania and the DC area." Meta keywords add Purcellville, Northern VA, DC, MD |
| Address | PO Box 95, Purcellville, VA 20132 (Loudoun County). **PO box only — no street address.** |
| Phone | 202-528-0140 (Washington, DC area code) |
| Email | info@totalproperty.us (mailboxes run on Microsoft 365 — see §3.4) |
| Copyright | "2009–2021" → operating since ~2009 **[INFERRED]** |
| Tagline | "WE ARE PITBULLS ABOUT OUR CLIENT'S ASSETS" |
| Logos | (a) Original: house-and-two-bars icon, olive green + burnt orange, wordmark "total property management". (b) Newer: pit-bull face with arched gold script "Total Property Management". Both in use on-site. |

### 2.2 Service catalogue (transcribed from `services.gif`) [LIVE]

**Commercial**

*Landlord Services* — first point of contact for tenant liaison · manage all maintenance/service contracts (landscaping, litter control, lot sweeping, snow removal) · lease management · financial reporting and accounting · rent coordination incl. a rent-delinquency process · annual budgets and expenditure tracking "to minimize CAM and other associated costs" · tenant relations · security coordination · property emergencies · marketing, leasing and advertising assistance.

*Tenant Services* — first point of contact for all issues · landlord/tenant communication · maintenance to help tenants meet lease obligations (HVAC, painting, decorating) · coordinate tenant improvements.

*Commercial Construction Services* — coordinate architectural/engineering services, contracts and permits · bid solicitation from licensed, insured GCs "adopting LEED criteria where feasible" · negotiate construction contracts · day-to-day project management · ensure work matches permit plans and code · site records and progress reports · change-order negotiation · punch list · close-out.

**Residential**

*Lender Services (REO/foreclosure)* — first contact for lenders during foreclosure; properties renovated, landscaped and cleaned to "the highest standards" before marketing; **sliding scale of costs**; traditional construction management (architects, engineers, permits).

*Owner Services* — "step in the shoes" of owners to handle everything "from roof repair to landscaping"; residential management package removing day-to-day stress.

**Process diagram (`flowchart.gif`):** four client types (Owner, Landlord, Tenant, Lender) → *total property management* → seven delivery functions (Maintenance, Renovation, Repair, CAM, Security, Landscaping, Accounting).

### 2.3 Unknowns that block high-confidence messaging [UNVERIFIED]

Ownership/family story · founders and staff · licence numbers (see §9) · portfolio size (doors, sq ft) · client mix · current software (any PM platform, accounting, trust-account handling) · fee schedule · whether Maryland/Pennsylvania work is active or aspirational · who the "lender" clients are · testimonials/references · whether a Google Business Profile exists under a different name · who owns the domain registration.

---

## 3. Technical & Web Audit of `totalproperty.us`

### 3.1 Stack and structure [LIVE]

| Item | Finding |
|---|---|
| Pages | 4: `index.php`, `aboutus.php`, `services.php`, `contactus.php`. **About Us body reads only "Update Coming Soon."** |
| Server | Apache; `X-Powered-By: PHP/8.1.34` (version disclosed). PHP 8.1's published security-support window ended 31 Dec 2025 **[INFERRED from PHP release calendar — confirm at php.net]**. |
| Markup | XHTML 1.0 Transitional, 2009-era Dreamweaver-style JS image swaps, fixed 849 px layout. |
| Navigation | Four **GIF image buttons** with hover-swap images. Not text, not accessible, not crawlable as nav labels. |
| Services content | A single **822×1045 GIF (≈188 KB)**. The entire service catalogue is invisible to search engines and screen readers. |
| Homepage HTML | 4.9 KB, but no `<h1>`, no `<h2>`, headings are `<h3>` only. |
| Mobile | **No viewport meta tag**; fixed-width design → not mobile-usable. |
| Forms / lead capture | **None.** Only a `mailto:` link and a phone number. |
| Analytics | None detected (no GA/GTM/pixel). |
| Structured data | None (no JSON-LD). No canonical tags. |
| `robots.txt` / `sitemap.xml` | Both 404. |
| Images | Empty `alt=""` on content images. |
| Security headers | Only `Strict-Transport-Security`. No CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. |
| Portals / payments | None. No tenant login, no owner login, no pay-rent link, no maintenance request. |

### 3.2 Indexation

Search surfaces `http://www.totalproperty.us/contactus.php` **[3P]**, so at least one legacy URL is indexed. **All four legacy URLs need 301 redirects** on cutover so inbound links and directory listings survive.

### 3.3 Brand assets recovered from the live site [LIVE]

Pixel-sampled from the shipped images:

| Role | Hex | Where |
|---|---|---|
| Heritage olive | `#737B39` | Services panel, logo bar |
| Heritage copper/burnt orange | `#9C631A` (flat) / `#BB813B` (logo) | Residential arrow, logo bar |
| Pit-bull logo gold | `#DFAC60` | Arched wordmark |
| Slate green-gray | `#707974` | Tagline text |
| Link blue (CSS) | `#206CDF` | Stylesheet only |

Typography in CSS: Arial/Verdana/Times New Roman — no brand typeface.

### 3.4 DNS and mail [LIVE]

| Record | Value | Implication |
|---|---|---|
| A (apex + www) | `209.142.64.131` | Single managed-VPS host |
| NS | `ns1/ns2.cloud-6d7e86.managed-vps.net` | **DNS and web hosting are at the same provider** |
| MX | `totalproperty-us.mail.protection.outlook.com` | **Email is on Microsoft 365** |

**Migration hazard:** changing nameservers to Vercel without first copying the MX, SPF/DKIM/DMARC and any Autodiscover records would **silently break company email**. The cutover plan must be A/CNAME-only, or a full record-for-record DNS export first. (Asymmetric downside — see Plan §5.6.)

### 3.5 Scorecard

| Dimension | Score | Note |
|---|---|---|
| Discoverability (SEO) | 1/10 | No indexable service text, no schema, no sitemap |
| Conversion | 1/10 | No form, no CTA, no quote flow |
| Mobile | 0/10 | No viewport, fixed width |
| Accessibility | 1/10 | Image nav, no headings, empty alts |
| Security posture | 3/10 | HSTS only; EOL PHP **[INFERRED]** |
| Trust signals | 1/10 | No licence #, testimonials, team, address, reviews |
| Brand | 5/10 | Distinctive assets, inconsistent execution |
| Content depth | 2/10 | Strong *substance* trapped in an image |

*(Scores are my judgement, not measured benchmarks.)*

---

## 4. Brand, Messaging and Positioning Audit

### 4.1 What the brand says today
- "One stop" / "end to end" / "Total" — completeness is the promise.
- Customer-driven process; "enhance asset values."
- The newer lockup adds a **protective, tenacious** voice ("pitbulls about our client's assets").

### 4.2 Strengths
- A true **multi-sided model** (owner + commercial landlord + tenant + lender) with **construction management** attached — a rare combination **[INFERRED from competitor sample]**.
- A complete, concrete service list, including CAM cost control and rent-delinquency process, which sophisticated commercial landlords look for.
- A memorable, protective mascot and a clear one-line promise.
- A coherent two-colour identity (olive + copper) that reads "grounded, land, trades" and is distinctive in a field of blue/teal SaaS palettes.

### 4.3 Weaknesses
- Three different company names on one site; two logos with unrelated styles.
- "Total" is the name *and* the pitch → weak differentiation until the multi-sided model is explained.
- Zero proof: no numbers, names, faces, licences, testimonials or case studies.
- Services are described by activity, not outcome (no NOI, occupancy, days-vacant, response-time claims).
- No audience segmentation: an owner, a tenant and a lender all land on one page.

### 4.4 The pit-bull question (decision for the client)
The mascot is a strong **owner/lender/commercial** signal (protection, tenacity). Risks to manage rather than ignore:
- **Tenant-facing tone.** A growling dog on the tenant page can read as hostile to renters.
- **Pet-policy adjacency.** If the company enforces breed restrictions, a pit-bull mascot invites an obvious "hypocrisy" critique. Insurers are generally free in most states to restrict breeds **[3P]**, and HUD replaced its assistance-animal guidance in Sept 2025 and again on 22 May 2026, leaving breed-restriction treatment for assistance animals unsettled **[3P]**. **Counsel should review any pet policy text before launch.**
- **Execution.** The current logo is a raster JPG; it needs a clean vector redraw.

Recommendation is in Plan §2.4.

---

## 5. External Footprint

Queries run: brand + domain; domain alone; brand + "family owned" + reviews; brand + Purcellville + Loudoun; the tagline; the phone and PO-box strings.

| Source | What exists | Takeaway |
|---|---|---|
| Company site | 4 pages, contact info | The only authoritative source |
| Yellow Pages (Purcellville "real estate management" category) | A listing exists; no address, phone or services shown **[3P]** | Thin, likely auto-generated |
| Google / Bing results | `contactus.php` indexed **[3P]** | Legacy URL has equity |
| Reviews (Yelp, BBB, Birdeye, Verified Managers, Angi, Zillow) | **Only for other companies with the same name** | **No evidence of any review profile for this company** |
| Social, press, LinkedIn | Not found in search | Absent or unindexed |
| Paid directories (Thumbtack, AllPropertyManagement, etc.) | Listings exist for *namesakes* in CA/WA/MI/NV | Collision risk, not benefit |

**Local-SEO blocker:** Google Business Profile guidelines do not allow a PO box as a business address; a Purcellville *service-area business* profile or a real street address is required **[from my knowledge of GBP policy — confirm]**. The client's physical-presence situation determines what map-pack visibility is achievable.

**What this means:** the opportunity is a *greenfield* reputation build — claim the namespace, collect first reviews, and seed credible profiles. There is no negative reputation to repair, but there is also no equity to inherit.

---

## 6. Market Context

### 6.1 Home market [3P]
- Purcellville is in Loudoun County, VA (western Northern Virginia). Rent estimates vary widely by source: single-family **$3,500/mo** (Zumper, June 2026), countywide all-types **$3,300** (Zumper) vs **$2,338** (RentCafe, May 2026); Zumper reports +3% YoY. **Sources conflict by ~40%; treat any rental-analysis calculator output as an estimate and cite its data source.**
- Local residential competitors surfaced: Intempus (residential + commercial, Leesburg), PMI Loudoun, Lord's Property Management, Sentry Management (association), Everly Real Estate (lists commercial management), Bay Property Management Group (MD/PA/VA/DC), Hemlane (software + service).

### 6.2 Lender/REO demand signal [3P — ATTOM]
- U.S. foreclosure filings: **227,548 in H1 2026, +21% YoY**, still below pre-pandemic levels.
- Virginia: 3,741 filings in June 2026 (1 in 985 housing units; +18.5% YoY); 263 REOs in July 2026.
- Maryland: among the ten worst state foreclosure rates in H1 2026; 4,184 filings in Q1; 272 REOs in July.
- Pennsylvania: 1,893 REOs in H1 2026 (4th nationally).
- **Implication:** all three of Total's states show rising REO inventory. The "Lender Services" line is a **timely, under-marketed revenue stream** — and the one most competitors don't offer.

*Caveat: no preservation-vendor pricing or servicer-volume data was found; revenue sizing is not possible from public data.*

---

## 7. Competitive & Technology Benchmark

### 7.1 Property-management software platforms (vendor-reported features) [3P]

| Capability | AppFolio | Buildium | Rentec Direct | Yardi Breeze / MRI / Entrata (commercial) |
|---|---|---|---|---|
| Tenant portal + mobile app | Yes (iOS/Android) | Resident Center app: pay, maintenance w/ photos, docs | "Resident Connect" app | Resident/tenant portals, work orders |
| Owner portal | Financials, performance reports, tax docs, **maintenance-estimate approval** | Owner portal, real-time financials | "Owner Connect" app | Owner portals offered |
| Online payments | Yes; renters-insurance in portal | Yes | Yes | Yes |
| Maintenance workflow | Work orders, AI scheduling, mobile inspections, vendor portal | Online requests, work orders | Basic | Work orders, PM scheduling, vendor mgmt |
| CAM reconciliation | Reported (reports suite) | Not confirmed | Not confirmed | **Core in Yardi Voyager / Entrata**; Breeze depth unconfirmed |
| Pricing (sources conflict) | Quote-based | ≈$62/mo entry tier | ≈$25–50/mo entry; rises per unit >20 | Quote-based |

*All vendor-authored comparisons are marketing; the one hard satisfaction number I saw (AppFolio "94% tenant-portal rating") is self-reported.*

### 7.2 What top regional sites do (primary observation, 2026-11-25) [LIVE]

| Pattern | Bay Property Mgmt Group (MD/PA/VA/DC) | Intempus (10 states, incl. Loudoun) | Buildium (vendor) |
|---|---|---|---|
| **Portal entry points in primary nav** | "Owner Portal", "Tenant Portal" | Owner application, renter links | Sign-in split: Property Manager / Resident |
| **Lead magnet** | "Free Property Analysis" | "Get a Free Rental Analysis" (hero CTA) | Free trial / demo |
| **Phone in header** | Yes | Yes (toll-free) | — |
| **Fees page** | "Fees and Rates" in nav | Transparent-fees claim | Pricing page |
| **Location pages** | County-level (Baltimore, Howard, Montgomery, PG, Philadelphia…) | State/market pages | — |
| **Trust section** | Testimonials, leadership team | "Trusted affiliations", FAQ | Ratings |
| **Structured data / viewport** | JSON-LD + viewport | 3× JSON-LD + viewport | JSON-LD + viewport |
| **Commercial / lender / construction** | Not a primary offering | Not a primary offering (HOA + sales) | n/a |

**Takeaways**
1. Every benchmark site puts **portal login in the header** and a **free-analysis form as the hero CTA**. Total Property has neither.
2. Bay operates in **exactly Total's four jurisdictions** (MD, PA, VA, DC), so it is the most direct comparison on geography — and it is residential-only.
3. **No benchmark competes on commercial + construction + lender.** That is Total's white space.
4. Lead-gen specialists consistently recommend a one-field "rental analysis" form and owner-specific CTA wording ("What could my rental earn?") over "Contact us" — but the supporting numbers are vendor-authored and I found **no independent conversion benchmarks** **[3P]**. We should *measure*, not assume.

### 7.3 UX patterns worth adopting

**Owners:** monthly statement + tax docs, maintenance-estimate approval with threshold auto-approve, occupancy/delinquency at a glance, distribution history, document vault.
**Residential tenants:** autopay (ACH-first), photo-based maintenance requests, lease/document access, renters-insurance verification, two-way messaging.
**Commercial tenants:** work-order intake, CAM statement access, COI/document upkeep, tenant-improvement tracking.
**Lenders/servicers:** per-property status, before/after photo evidence, bid/cost approvals against a rate card, close-out packet.

*Commercial CAM depth is the area where generic residential platforms are weakest; this is where a custom build could add value (Plan §4).*

---

## 8. Regulatory and Compliance Landscape

*Secondary sources only — **not legal advice.** A Virginia broker/attorney must confirm before launch.*

| Jurisdiction | Licence requirement for managing others' property for pay | Confidence |
|---|---|---|
| **Virginia** | No standalone "property manager" licence; licensable activities require a **real estate licence**, and a business operating as a brokerage needs a **firm licence** from the Real Estate Board (DPOR). | Medium **[3P]** |
| **Virginia trust accounts** | Escrow/trust handling governed by **18VAC135-20-181**; funds stay in escrow until disbursed per lease/management agreement. | Medium **[3P]** |
| **Virginia agreements** | Management agreements must be **in writing** (Va. Code § 54.1-2135); licensee must account for owner funds timely. | Medium **[3P]** |
| **DC** | Licence required for managing property for others for compensation. | Medium **[3P]** |
| **Maryland** | **Sources conflict.** Most defensible reading: no standalone PM licence, but anyone acting as a real-estate agent/broker must be licensed. | **Low** |
| **Pennsylvania** | Paid management of others' property generally requires a real estate licence (broker for a company); short-term vacation management carved out by a 2022 court decision. | Low–Medium **[3P]** |

**Website/product implications**
- Display licence numbers and the licensing entity (a trust badge **and** a likely legal expectation). *We need the client's actual numbers.*
- Equal Housing Opportunity statement/logo; WCAG 2.2 AA; privacy policy; SMS/TCPA consent language for text notifications.
- Handling of **owner funds, security deposits and rent** is the highest-liability part of any portal. This drives the build-vs-buy recommendation (Plan §4).
- Tenant screening is regulated by the FCRA: use a licensed screening vendor; never build it.
- Payments: Stripe ACH is reported at **0.8% capped at $5**, with $4 failed-debit and $15 dispute fees **[3P — verify on stripe.com before pricing a tenant-fee model]**. ACH confirmation can take up to 4 business days.

---

## 9. Strategic Synthesis

### 9.1 SWOT (condensed)

| Strengths | Weaknesses |
|---|---|
| Multi-sided model + construction + lender services | Zero digital footprint, zero proof |
| Concrete service list; CAM and delinquency process | One-page-per-topic brochure site; no lead capture |
| Distinctive mascot + palette | Naming inconsistency; PO box only |
| Existing domain (~15 yrs, **[INFERRED]**) and M365 mailboxes | EOL PHP host; no portals |

| Opportunities | Threats |
|---|---|
| Lender/REO demand rising in VA/MD/PA | Namesake collisions dilute search |
| Commercial + construction white space vs. residential-only rivals | Large, well-funded residential competitors with portals and SEO |
| Greenfield local SEO + review build | Licensing/trust-account non-compliance risk if portals mishandle funds |
| Owner-facing "free analysis" funnel | Pit-bull mascot misread by tenants/insurers |

### 9.2 The rate-limiting bottleneck (today)
**Inbound opportunity flow.** There is no discoverable, credible, convertible front door, so every other investment (portals, apps, automation) optimizes a system with no volume to serve. Portals matter for *retention and margin* only after owners and tenants exist.

---

## 10. Information Needed From the Client

| # | Question | Why it matters |
|---|---|---|
| 1 | Exact legal entity name(s), licence numbers (VA/DC/MD/PA), qualifying broker | Trust badge, legal footer, which states are real |
| 2 | Ownership story — is "family-backed" true? Who are the principals? | Brand claim, About page, E-E-A-T |
| 3 | Portfolio: doors, sq ft, residential/commercial split, states | Credibility numbers, software sizing |
| 4 | Current systems: PM software, accounting, bank/trust setup, e-sign | Build-vs-buy decision |
| 5 | Who actually pays: owners, commercial landlords, lenders — and the % of revenue each | Messaging priority |
| 6 | Pet policy and insurer constraints | Mascot decision |
| 7 | Street address or service-area-only? Existing Google Business Profile? | Local SEO |
| 8 | Domain registrar/DNS access; who administers M365 | Cutover safety |
| 9 | 3–5 testimonials / references, photos of managed properties, team headshots | Proof assets |
| 10 | Fee schedule and willingness to publish it | Benchmarks publish fees |
| 11 | Lender clients/servicers served, volume, preservation vs. management | Lender landing page scope |
| 12 | Budget and launch-date pressure | Phasing |

---

## 11. Sources

**Primary [LIVE]:** `https://totalproperty.us/` and `/aboutus.php`, `/services.php`, `/contactus.php`, `/styles.css`, `/images/*` (fetched 2026-11-25); public DNS-over-HTTPS (MX/NS); competitor pages `intempuspropertymanagement.com`, `baymgmtgroup.com`, `buildium.com/features/resident-center/` (fetched 2026-11-25).

**Secondary [3P]:**
- Namesake firms/reviews: [Yellow Pages Purcellville](https://www.yellowpages.com/purcellville-va/real-estate-management) · [BBB Total Property Inc (Tulare)](https://www.bbb.org/us/ca/tulare/profile/property-management/total-property-inc-1126-89060237) · [Yelp Las Vegas](https://www.yelp.com/biz/total-property-management-las-vegas) · [Yelp Tulare](https://www.yelp.com/biz/total-property-management-tulare) · [Verified Managers Bakersfield](https://www.verifiedmanagers.com/property-management-companies/CA/bakersfield/total-property-management-services-inc/) · [Birdeye Lake Forest](https://reviews.birdeye.com/total-property-management-inc-164512703133144) · [Birdeye Milton WA](https://reviews.birdeye.com/total-property-management-services-inc-156320898867355) · [Total Property Flathead](https://totalpropertyflathead.com/reviews)
- Licensing: [18VAC135-20-181](https://law.lis.virginia.gov/admincode/title18/agency135/chapter20/section181/) · [Va. Code § 54.1-2135](https://law.justia.com/codes/virginia/title-54-1/chapter-21/section-54-1-2135/) · [Buildium: start a PM company in Virginia](https://www.buildium.com/blog/how-to-start-a-property-management-company-in-virginia/) · [NVAR property-management primer](https://nvar.com/re-view-magazine/article/sep-oct-2015/2015-09-10-ask-nvar-property-management-primer) · [FirstService DC licence](https://www.fsresidential.com/washington-dc/news-events/articles/dc-property-management-license/) · [TenantCloud Maryland](https://www.tenantcloud.com/property-management/become-property-manager-maryland/) · [Buildium Maryland](https://www.buildium.com/blog/how-to-start-a-property-management-company-in-maryland/) · [PAR: when PM doesn't need a licence](https://parealtors.org/?p=14878) · [PA Real Estate Commission](https://pa.gov/en/agencies/dos/department-and-offices/bpoa/boards-commissions/real-estate-commission.html)
- Software: [AppFolio owner experience](https://www.appfolio.com/articles/owner-experience) · [AppFolio 2026 comparison](https://appfolio.com/blog/best-property-management-softwares-compared-2026) · [Capterra AppFolio](https://www.capterra.com/p/92228/appfolio-property-manager/) · [Capterra Buildium vs Rentec](https://www.capterra.com/compare/47428-120753/Buildium-Property-Management-Software-vs-Rentec-Direct) · [Rentec vs Buildium](https://www.rentecdirect.com/learn/software-buying-guide/buildium-vs-rentec) · [Buildium commercial software roundup](https://www.buildium.com/blog/best-commercial-property-management-software/) · [Yardi Breeze features (G2)](https://g2.com/products/yardi-breeze/features)
- Market: [ATTOM Q1 2026](https://www.attomdata.com/news/market-trends/foreclosures/q1-and-march-2026-foreclosure-market-report/) · [ATTOM mid-year 2026](https://www.attomdata.com/news/market-trends/foreclosures/2026-mid-year-foreclosure-market-report/) · [ATTOM July 2026 by state](https://www.attomdata.com/wp-content/uploads/2026/09/Foreclosure-by-State-July-2026.pdf) · [Zumper Loudoun](https://www.zumper.com/rent-research/loudoun-valley-estates-va) · [RentCafe Loudoun](https://www.rentcafe.com/apartments-for-rent/loudoun-county-va/?page=2)
- Lead-gen: [PropertyManagerWebsites: rental-analysis leads](https://www.propertymanagerwebsites.com/blog/property-management-leads-rental-analysis) · [Propertyware: landing-page rules](https://www.propertyware.com/blog/6-rules-grow-your-property-management-business-landing-pages/)
- Payments / policy: [Stripe ACH docs](https://docs.stripe.com/payments/ach-debit) · [NerdWallet Stripe fees](https://www.nerdwallet.com/business/software/learn/stripe-fees) · [Holland & Knight: HUD rescinds ESA guidance](https://www.hklaw.com/en/insights/publications/2026/06/hud-rescinds-emotional-support-animal-guidance) · [Duane Morris: HUD 2026 guidance](https://blogs.duanemorris.com/animallawdevelopments/?p=704) · [Texas REALTORS: breed limits & insurance](https://texasrealestate.com/members/posts/assistance-animals-and-landlords-insurance)
