# Total Property: Design Overhaul Notes

Written before any redesign code. Evidence labels: **[SEEN]** I loaded the page in a browser and looked at the screenshot. **[SEARCH]** third-party search summary, not independently verified. **[MEASURED]** I measured it (contrast, glyph widths). **[DECISION]** my call.

---

## 1. Self-diagnosis of the live site (`totalproperty.vercel.app`)

Captured at 1440 px and 390 px on home, owners, commercial, tenants and about. **[SEEN]**

| Tell | Where it shows | Why it reads as template |
|---|---|---|
| **One width, one rhythm.** Every section is `container → h2 → content` at the same 72 rem measure and the same 4–5 rem padding | all pages | No asymmetry, no spatial tension. The eye never has a place to start |
| **Left-aligned heading above a bullet list** | commercial, services, owners | Pages are lists with dashes. Nothing has a hierarchy beyond "heading, then list" |
| **Cards everywhere** | "Who are you?" box, four-pillar grid, how-it-works steps, tenants "portal / pay rent" pair, form containers | Identical `rounded border bg-white` boxes with identical padding. The exact component an AI reaches for |
| **Flat color blocks** | alternating alabaster / panel / navy bands | Solid fills with no grain, no line work, no material. It feels like a Figma frame, not a building |
| **Weak type scale** | h1 tops out near 60 px; heavy 800-weight sans headings | Heavy weight at moderate size is generic SaaS. There is no dramatic contrast between display and text |
| **Symmetric hero** | text left, box right, both vertically centered | Predictable. The "Who are you?" panel is a form-shaped box, not a concierge |
| **Static** | no motion beyond hover | Nothing choreographs attention |
| **Decoration that says nothing** | a gold button and a navy band | Color is the only "brand" device. No architectural vocabulary despite being a property company |
| **Mobile = desktop stacked** | 390 px home | Same blocks in a single column, no mobile-specific composition |

What is worth keeping: the content (it is accurate and verified), the information architecture, the diagram's idea, the accessibility and test discipline, and the data layer.

## 2. Research on leading designs

### 2.1 What I could and could not observe

- **Loaded and inspected [SEEN]:** 111 West 57th (111w57.com), SOM, Snøhetta, BIG, Related Companies, Baselane. Screenshots at 1440 px, first fold plus one scroll.
- **Blocked or broken, so excluded:** Hines and Tishman Speyer returned HTTP 403 to automated browsers; the CBRE capture rendered without CSS; Awwwards and Washington Fine Properties returned 502. I do not describe any of those from memory.
- **Search results [SEARCH]:** Awwwards' real-estate and typography collections exist and list recent winners (including the residential tower site **111 West 57th**, reported as Site of the Day in May 2025, and several 2026 entries). Everything else in the results was agency blog opinion with a commercial interest. The tool itself flagged that dates and scores were not verified, and I have not relied on them. **No architecture-specific Awwwards winner was identified, so the architecture conclusions below come from SOM, Snøhetta and BIG directly, not from an awards list.**
- **Not observed:** the sites' motion. Static screenshots show composition, type and surface, but not scroll choreography. The motion decisions below are my own design, informed by what the compositions imply, not a transcription of those sites.

### 2.2 Mechanics that make these sites feel expensive **[SEEN]**

1. **Scale contrast, not weight contrast.** 111 West 57th sets "111 / W / 57" stacked in a light, high-contrast serif at roughly 150 px over full-bleed photography. Snøhetta's hero is a two-line statement in a *light* sans at about 56 px. SOM overlays a light-weight headline bottom-left. None of them shout with bold. They get authority from size, restraint and thin strokes.
2. **A label column and a content column.** Snøhetta puts a small grey label ("disciplines") in a narrow left column and starts the real content about 35 % across. BIG right-aligns project captions in a narrow left column against an offset image. This is the single most reusable asymmetric grid.
3. **Ragged alignment on a shared edge.** Snøhetta's image strip: tops aligned, bottoms ragged (different heights). 111 West 57th: one large image (about two thirds width) beside one small image (about a quarter), tops aligned, wide gutter. Variation in size on a common edge produces rhythm without randomness.
4. **Hairline index rows.** Snøhetta's "Architecture" sits above a single thin rule that begins an index of items. Rules, not boxes, organize content.
5. **Minimal, structural header.** 111 West 57th: menu control left, wordmark centered in the same serif, one outlined "Inquire" button right. SOM: a thin black bar. Snøhetta: wordmark, "Menu", one icon. Navigation is quiet; the work is loud.
6. **One metallic accent on a neutral.** 111 West 57th uses a muted taupe-bronze for header and buttons. Related pairs deep navy with a bronze "I understand" button and a light serif headline. Metal against stone or navy reads as material, where saturated brand colors read as software.
7. **Numbers as typography.** Baselane's stat row sets giant numerals ("100,000", "$4.5B") baseline-aligned to tiny labels. Numerals are a display device, not a table.
8. **Imagery carries the premium feel, and we have none.** Every reference leans on full-bleed photography. Total Property has no photographs yet. **[DECISION]** Replace photographic atmosphere with architectural line drawing, material surface (limestone grain, brass hairlines) and typographic scale, and design every image slot (gallery, leadership) to accept real photography the moment `src/config/site.ts` gains it. Do not use stock imagery.

### 2.3 Fonts **[MEASURED]**

Browser measurement of tabular numerals (width of "8888" minus "1111", with and without `font-variant-numeric: tabular-nums`):

| Font | Proportional | With `tnum` | Verdict |
|---|---|---|---|
| Instrument Sans | 34.9 | **0** | True tabular figures |
| Archivo | 8.5 | **0** | True tabular figures |
| Schibsted Grotesk | 41.2 | **0** | True tabular figures |
| Instrument Serif | 29.4 | 29.4 | No tabular figures; display only |
| Fraunces | 21.9 | 21.9 | No tabular figures |

Specimen sheet compared Instrument Serif, Fraunces, Newsreader and Archivo Expanded for the headline. **[DECISION]** **Instrument Serif** (display; condensed, high-contrast, so very large sizes fit and its tall forms echo building elevations) with **Instrument Sans** (text and UI; designed as its companion, true tabular figures, humanist). Two families, clearly distinct, both self-hosted through `next/font/local`. Financial figures use Instrument Sans with `tabular-nums`, never the serif.

---

## 3. Design system **[DECISION]**

### 3.1 Concept

**One foundation under four buildings.** Total Property's real differentiator is that owners, commercial landlords, lenders and tenants all stand on the same operations. The whole visual language is *architectural drawing meets engraved brass plaque*: limestone paper, charcoal-navy ink, brass hairlines, elevation line drawings, dimension-line rules, and a lobby-directory metaphor for choosing where to go. The memorable devices are (a) the hero's type scale and drawn facade, and (b) the interactive four-buildings-one-foundation schematic. Everything else stays quiet.

### 3.2 Palette (all pairs contrast-checked **[MEASURED]**)

| Token | Hex | Role |
|---|---|---|
| `stone-50` | `#F4F0E7` | Lightest paper: form sheets |
| `stone-100` | `#ECE6DA` | **Limestone**: page |
| `stone-200` | `#DFD6C4` | **Travertine**: alternate band |
| `stone-300` | `#C9BEA6` | Rules; muted text on dark |
| `ink-950` / `ink-900` / `ink-800` / `ink-700` | `#0B111A` / `#101927` / `#182437` / `#243449` | Architectural charcoal-navy |
| `text` / `muted` | `#151B25` / `#4D5560` | Body on stone (13.9:1 / 6.1:1 on limestone) |
| `brass-700` | `#7A5200` | **Brass text on limestone/travertine** (5.57:1 / 4.80:1) |
| `brass-600` | `#8F5F00` | Brass on the lightest paper only (4.85:1 on `stone-50`); display and decoration elsewhere |
| `brass-500` / `400` / `300` / `200` | `#B08334` / `#C99A45` / `#DDB56A` / `#EBD3A0` | Fills, hairlines, and text on dark (9.15:1 for `brass-300` on `ink-900`) |

**Finding:** the brief's `#8F5F00` fails AA on limestone (4.44:1) and travertine (3.82:1). It is therefore not used for small text on those grounds.

### 3.3 Typography

- **Display:** Instrument Serif 400 (and italic for pull-quotes only). `clamp(3.5rem, 2rem + 8vw, 10.5rem)` hero; `clamp(2.5rem, 1.5rem + 4vw, 5.5rem)` section; leading 0.92–1.0; tracking −0.02 em. No bold, no single-word italic or color accent in headlines.
- **Text and UI:** Instrument Sans 400–700, 17–18 px, 1.6 leading, measure under 70 characters.
- **Numerals:** Instrument Sans with `font-variant-numeric: tabular-nums`.
- **Labels:** sentence-case text in the sans, not tracked all-caps, not monospace.

### 3.4 Surface and line

- Limestone grain: a static SVG noise layer at low opacity with multiply blending (paper bands only).
- **Drawing grid:** 1 px vertical hairlines on a 12-column rhythm in hero and dark bands (about 8–10 % opacity).
- **Dimension rules:** a hairline with end ticks and an optional centered label as section dividers, borrowed from architectural drawings.
- **Sheets, not cards:** forms sit in square-cornered paper sheets with small corner crop marks. Radius 0–2 px everywhere. No `rounded-xl`.
- Brass appears as 1 px lines, a slim gradient edge on primary actions, and the lobby-directory plaque. Never as a large flat fill except the primary call to action.

### 3.5 Layout grammar

- 12-column grid with a **label column (cols 1–3) and content column (cols 4–12)** as the default editorial row.
- Headline spans 9–11 columns and **steps in** on later lines (a deliberate indent), so type has shape.
- Alternating bands: limestone, travertine, charcoal. Dark bands carry the drawing grid.
- Ragged edges on a shared top line for any grouped elements.

### 3.6 Motion (one choreographed moment, plus responses to touch)

- **Hero load:** headline lines rise out of a mask in sequence (about 90 ms stagger, 650 ms each, transform only so the headline is painted immediately and LCP is not delayed), then the facade drawing's lines draw in (stroke-dashoffset, about 1.4 s).
- **Responses to action:** drawer open (staggered link reveal), schematic selection (building fills, foundation courses light up, caption swaps), directory-row hover (brass rule extends, row shifts), vacancy bars animate to new values and the cost numeral tweens.
- **Services showcase:** the sticky drawing swaps as the active index row changes (IntersectionObserver).
- **No** per-section fade-ups, no parallax.
- Everything is wrapped in `@media (prefers-reduced-motion: no-preference)`; reduced motion shows the final state immediately.

---

## 4. Page blueprint

| Page | Composition |
|---|---|
| **Header / shell** | Slim limestone bar: wordmark left, four text links and a brass-edged "Free rental analysis" action right, "Portals" as two quiet links. Mobile: native `<dialog>` full-screen drawer (focus trapped, Esc closes) with large serif links that reveal in sequence. Footer: one large serif statement, contact, areas in one line, small legal row. No multi-column link dump |
| **Home** | (1) Asymmetric hero: giant stepped headline, drawn facade, lede offset right, **lobby directory** plaque (Owners / Commercial / Lenders / Tenants) overlapping the fold. (2) Dark **schematic**: four building elevations on one foundation; selecting one lights its services. (3) **Sticky split services**: left panel pinned and changes with the active index row, right column four tall rows. (4) Where we work: the four jurisdictions set as huge stacked serif with hairlines. (5) Testimonials if supplied. (6) Dark closing band |
| **Owners** | Hero; dark **vacancy instrument** panel beside the paper request sheet; the tagline as a giant pull-quote; how-it-works as a vertical numbered sequence (a true sequence); FAQ as hairline index rows |
| **Tenants** | Three "doors" (portal, rent, repair) as large serif index rows; repair workflow as a vertical numbered sequence; form sheet |
| **Commercial** | Landlord and tenant services as two index lists; construction as a dark band, numbered because it is a real project sequence; proposal sheet |
| **Lenders** | Dark hero to change the temperature; services index; talk sheet |
| **Services** | Five stepped sections, each a label column plus an index list |
| **About, Contact, Vendors, Portal, legal, 404** | Same hero, rule and sheet vocabulary; prose pages get a proper editorial measure |

## 5. Constraints carried over

Preserved: `src/config/site.ts` and `lib/site.ts` as the data source (blank fields hide), all server actions, Zod schemas, rate limiting, Supabase and Resend, preview `noindex`, one `<h1>` per page, WCAG AA (all new pairs above), keyboard focus, reduced motion, `<noscript>` fallback.

## 6. How I will judge the result

1. Screenshots at 1440 and 390 px of every route, read by eye for overlap, clipping and alignment.
2. Zero axe WCAG 2.0–2.2 A/AA violations across all pages at both widths.
3. Lighthouse mobile: Accessibility, Best Practices and SEO stay at 100; Performance stays at or above 90 with LCP no worse than the current build.
4. No identical card grids, no tracked all-caps labels, no arrows glued to link text, no per-section entrance animation.
5. Existing unit tests unchanged and passing; e2e selectors updated and extended for the new interactions (drawer, schematic, instrument).

## 7. What the build taught us

Findings made while building and verifying, kept so the next change does not repeat them.

1. **The facade drew as broken brackets** because `vector-effect: non-scaling-stroke` measures dashes in screen space while `pathLength` normalises in user space. Fix: use non-scaling strokes only on the static building drawings, never on the draw-in animation.
2. **A background image is an LCP candidate, even on a pseudo-element** (Chrome attributes it to the element). The SVG-noise grain made the whole hero section the LCP element and cost over a second in the lab. Fix: texture drawn entirely from CSS gradients. A first attempt with a dense 3 px gradient mesh looked like graph paper, so it became sparse flecks on coprime tile sizes.
3. **Real LCP was never the problem.** Unthrottled it is 96-160 ms on every page; the 2.5-2.8 s figure is Lighthouse's simulated slow-4G model. Both are reported.
4. **axe can sample text mid-fade** and report false contrast failures at partial opacity. The accessibility test now emulates reduced motion so it measures the settled state (and exercises that path).
5. **The brief's `#8F5F00` fails AA on limestone and travertine.** Body-size brass text uses `#7A5200` there.
6. **A content bug found by a test:** the schematic's Commercial panel omitted the "minimise CAM" line because bullets were sliced by position. Bullets are now picked so every lit function has a visible service behind it.
7. **A layout bug found by looking:** hero art anchored to the top of the band ran behind the Lenders lede. It is now bound to the headline block's own height.
8. **The preview is still noindex** (see the main README). That is why Lighthouse SEO reads 66.

## 8. Sources

Inspected directly: [111 West 57th](https://www.111w57.com), [SOM](https://www.som.com), [Snøhetta](https://www.snohetta.com), [BIG](https://big.dk), [Related](https://www.related.com), [Baselane](https://www.baselane.com). Search (unverified): [Awwwards real estate](https://www.awwwards.com/websites/real-estate/), [Awwwards typography](https://www.awwwards.com/websites/winner_category_typography/), [Awwwards editorial layout](https://www.awwwards.com/inspiration/editorial-layout), [Awwwards parallax](https://www.awwwards.com/websites/parallax/), [Cyberoptik: commercial real estate sites](https://cyberoptik.net/blog/best-commercial-real-estate-websites), [Mediaboom: CRE design](https://mediaboom.com/news/commercial-real-estate-website-design/).
