"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/controls";
import { DEFAULT_SERVICES, PAGE_LABELS } from "@/lib/cms/defaults";
import { DAYS, PAGE_KEYS } from "@/lib/cms/schema";
import { getIn, newId, useDoc } from "./doc";
import { FieldShell, ImageField, LinesField, SelectField, TextField, ToggleField } from "./fields";
import { ListEditor } from "./list";

const FULL_DAY: Record<(typeof DAYS)[number], string> = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

function Group({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 border-t border-[var(--hairline)] pt-8 first:border-t-0 first:pt-0">
      <div>
        <h3 className="font-display text-3xl leading-none">{title}</h3>
        {intro ? <p className="mt-2 max-w-2xl text-muted">{intro}</p> : null}
      </div>
      {children}
    </section>
  );
}

const LINK_HINT = "A page on this site (like /contact), a full link (https://…), a phone link (tel:+12025280140) or an email link (mailto:name@example.com).";

/* ───────────── 1. Announcement ───────────── */

export function AnnouncementTab() {
  const { doc } = useDoc();
  const a = doc.announcement;
  return (
    <div className="space-y-10">
      <Group title="Announcement" intro="Tell every visitor about a special, a closure or news. Switch it off at any time; your wording is kept for next time.">
        <ToggleField path="announcement.enabled" label="Show the announcement" hint="Nothing appears on the site while this is off." />
        <SelectField
          path="announcement.mode"
          label="How should it appear?"
          options={[
            { value: "bar", label: "A banner across the top of every page" },
            { value: "popup", label: "A pop-up window, shown once per visit" },
          ]}
        />
        <TextField path="announcement.headline" label="Headline" maxLength={120} hint="Short and clear. Example: “Now accepting new commercial clients.”" />
        <TextField path="announcement.body" label="Message (optional)" multiline rows={3} maxLength={400} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField path="announcement.ctaLabel" label="Button words (optional)" maxLength={40} hint="Example: Get in touch" />
          <TextField path="announcement.ctaHref" label="Where the button goes" maxLength={500} hint={LINK_HINT} />
        </div>
      </Group>

      <Group title="Preview">
        <div className="border border-[var(--hairline)] bg-limestone p-4">
          {a.headline ? (
            a.mode === "bar" ? (
              <p className="bg-ink-800 px-4 py-3 text-[0.9375rem] text-limestone">
                <strong>{a.headline}</strong> {a.body ? <span className="text-sand">{a.body} </span> : null}
                {a.ctaLabel ? <span className="font-semibold text-brass-200 underline">{a.ctaLabel}</span> : null}
              </p>
            ) : (
              <div className="mx-auto max-w-sm border border-brass-600 bg-paper p-6">
                <h4 className="font-display text-3xl leading-none">{a.headline}</h4>
                {a.body ? <p className="mt-3 text-muted">{a.body}</p> : null}
                {a.ctaLabel ? <p className="mt-5"><span className="inline-block bg-ink-900 px-5 py-3 font-semibold text-paper">{a.ctaLabel}</span></p> : null}
              </div>
            )
          ) : (
            <p className="text-muted">Add a headline to see a preview.</p>
          )}
          <p className="mt-3 text-sm text-muted">{a.enabled ? "This is live on the site once you save." : "Not showing on the site: the announcement is switched off."}</p>
        </div>
      </Group>
    </div>
  );
}

/* ───────────── 2. Homepage ───────────── */

export function HomeTab() {
  return (
    <div className="space-y-10">
      <Group title="Headline" intro="The big words at the top of the home page. The line about Purcellville and your service areas is added automatically.">
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField path="home.heroLines.0" label="Line 1" maxLength={40} />
          <TextField path="home.heroLines.1" label="Line 2" maxLength={40} />
          <TextField path="home.heroLines.2" label="Line 3 (optional)" maxLength={40} placeholder="Leave blank for two lines" />
        </div>
        <TextField path="home.heroLede" label="Subheadline" multiline rows={5} maxLength={500} hint="The paragraph under the headline." />
      </Group>

      <Group title="Buttons" intro="Two buttons under the paragraph. Clear the words and the link to go back to the standard ones.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField path="home.primaryCta.label" label="Main button words" maxLength={40} />
          <TextField path="home.primaryCta.href" label="Main button goes to" maxLength={500} hint={LINK_HINT} />
          <TextField path="home.secondaryCta.label" label="Second button words" maxLength={40} />
          <TextField path="home.secondaryCta.href" label="Second button goes to" maxLength={500} hint={LINK_HINT} />
        </div>
      </Group>

      <Group title="Statement" intro="The line under the opening of every page (the pit bull line).">
        <TextField path="home.statement" label="Statement" maxLength={120} />
      </Group>

      <Group title="Key points" intro="Up to four short reasons to choose you. They appear beside the “Find your way in” menu on the home page.">
        <ListEditor path="home.valueProps" noun="point" addLabel="Add a key point" make={() => ({ title: "", text: "" })} titleOf={(v: { title: string }) => v.title} max={4} empty="No key points. The section shows only the menu.">
          {(p) => (
            <>
              <TextField path={`${p}.title`} label="Title" maxLength={40} />
              <TextField path={`${p}.text`} label="Sentence" multiline rows={2} maxLength={220} />
            </>
          )}
        </ListEditor>
      </Group>
    </div>
  );
}

/* ───────────── 3. Services ───────────── */

type Service = { id: string; title: string };
type Prop = { id: string; title: string };

export function ServicesTab() {
  const { set } = useDoc();
  return (
    <div className="space-y-12">
      <Group title="Services" intro="What you offer. Each visible service gets its own section on the Services page and a row on the home page. Hide one with its switch, or move it with the arrows.">
        <ListEditor
          path="services"
          noun="service"
          addLabel="Add a service"
          max={20}
          make={() => ({ id: newId("s"), visible: true, title: "", audience: "", summary: "", items: [], image: "", imageAlt: "", href: "/contact", cta: "Get in touch" })}
          titleOf={(s: Service) => s.title}
        >
          {(p) => (
            <>
              <ToggleField path={`${p}.visible`} label="Show this service on the site" onText="Showing" offText="Hidden" />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField path={`${p}.title`} label="Name" maxLength={80} />
                <TextField path={`${p}.audience`} label="Who it is for" maxLength={60} hint="Example: Commercial landlords" />
              </div>
              <TextField path={`${p}.summary`} label="Introduction" multiline rows={3} maxLength={400} />
              <LinesField path={`${p}.items`} label="What's included" rows={7} hint="One item per line, kept short. Example: Snow Removal" />
              <ImageField path={`${p}.image`} altPath={`${p}.imageAlt`} />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField path={`${p}.cta`} label="Link words" maxLength={40} hint="Example: Explore commercial services" />
                <TextField path={`${p}.href`} label="Link goes to" maxLength={500} hint={LINK_HINT} />
              </div>
            </>
          )}
        </ListEditor>
        <Button type="button" variant="outline" onClick={() => window.confirm("Replace your services with the standard list? Your edits to services will be lost (you can still change them again afterwards).") && set("services", JSON.parse(JSON.stringify(DEFAULT_SERVICES)))}>
          Reset services to the standard list
        </Button>
      </Group>

      <Group title="Property types" intro="The photo cards under “Property types we manage” on the home page.">
        <ListEditor
          path="propertyTypes"
          noun="property type"
          addLabel="Add a property type"
          max={20}
          make={() => ({ id: newId("p"), visible: true, title: "", text: "", image: "", imageAlt: "", href: "/commercial" })}
          titleOf={(s: Prop) => s.title}
        >
          {(p) => (
            <>
              <ToggleField path={`${p}.visible`} label="Show this card" onText="Showing" offText="Hidden" />
              <TextField path={`${p}.title`} label="Name" maxLength={60} hint="Example: Retail" />
              <TextField path={`${p}.text`} label="One or two sentences" multiline rows={2} maxLength={300} />
              <ImageField path={`${p}.image`} altPath={`${p}.imageAlt`} />
              <TextField path={`${p}.href`} label="Card links to (optional)" maxLength={500} hint={LINK_HINT} />
            </>
          )}
        </ListEditor>
      </Group>
    </div>
  );
}

/* ───────────── 4. Featured properties ───────────── */

export function ListingsTab() {
  return (
    <div className="space-y-8">
      <Group title="Featured properties" intro="Rentals and spaces to show on the “Looking For a Space” page. The first three also appear on the home page. When there are none, the page invites visitors to get in touch.">
        <ListEditor
          path="listings"
          noun="property"
          addLabel="Add a property"
          max={40}
          empty="No properties are listed. Add one and it appears on the Looking For a Space page."
          make={() => ({ id: newId("l"), visible: true, title: "", image: "", imageAlt: "", rent: "", specs: "", location: "", status: "available" as const, href: "" })}
          titleOf={(l: { title: string }) => l.title}
        >
          {(p) => (
            <>
              <ToggleField path={`${p}.visible`} label="Show this property on the site" onText="Showing" offText="Hidden" />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField path={`${p}.title`} label="Title" maxLength={100} hint="Example: 2,400 sq ft retail suite" />
                <SelectField
                  path={`${p}.status`}
                  label="Status badge"
                  options={[
                    { value: "available", label: "Available now" },
                    { value: "coming_soon", label: "Coming soon" },
                    { value: "application_pending", label: "Application pending" },
                    { value: "leased", label: "Recently leased" },
                  ]}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <TextField path={`${p}.location`} label="Location" maxLength={100} hint="Example: Purcellville, VA" />
                <TextField path={`${p}.rent`} label="Rent" maxLength={60} hint="Example: $4,200/mo" />
                <TextField path={`${p}.specs`} label="Details" maxLength={140} hint="Example: 2,400 sq ft · 2 baths" />
              </div>
              <ImageField path={`${p}.image`} altPath={`${p}.imageAlt`} />
              <TextField path={`${p}.href`} label="Card links to (optional)" maxLength={500} hint={`Where “learn more” or “apply” goes. ${LINK_HINT}`} />
            </>
          )}
        </ListEditor>
      </Group>
    </div>
  );
}

/* ───────────── 5. Company, reviews and portals ───────────── */

function HoursEditor() {
  const { doc, errors, set } = useDoc();
  const rows = doc.company.hours;
  return (
    <fieldset>
      <legend className="mb-3 text-[0.9375rem] font-semibold text-ink-900">Office hours</legend>
      <ul className="border-b border-[var(--hairline)]">
        {DAYS.map((day, i) => {
          const row = rows[i];
          const base = `company.hours.${i}`;
          return (
            <li key={day} className="grid items-center gap-x-4 gap-y-2 border-t border-[var(--hairline)] py-3 sm:grid-cols-[8rem_1fr_1fr_auto]">
              <span className="font-semibold">{FULL_DAY[day]}</span>
              <FieldShell id={`${base}-open`} label="Opens" error={errors[`${base}.open`]}>
                {(a11y) => <Input {...a11y} type="time" value={row?.open ?? ""} onChange={(e) => set(`${base}.open`, e.target.value)} />}
              </FieldShell>
              <FieldShell id={`${base}-close`} label="Closes" error={errors[`${base}.close`]}>
                {(a11y) => <Input {...a11y} type="time" value={row?.close ?? ""} onChange={(e) => set(`${base}.close`, e.target.value)} />}
              </FieldShell>
              <button
                type="button"
                className="min-h-11 self-end px-3 text-sm font-semibold underline disabled:no-underline disabled:opacity-40"
                disabled={!row?.open && !row?.close}
                onClick={() => {
                  set(`${base}.open`, "");
                  set(`${base}.close`, "");
                }}
              >
                Closed<span className="sr-only"> on {FULL_DAY[day]}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-sm text-muted">Leave a day empty if the office is closed. Search engines show these hours.</p>
    </fieldset>
  );
}

const STATE_NAME: Record<string, string> = { VA: "Virginia", MD: "Maryland", PA: "Pennsylvania", DC: "Washington, DC" };

export function CompanyTab() {
  const { doc } = useDoc();
  return (
    <div className="space-y-12">
      <Group title="Contact details" intro="Shown in the header, footer, Contact page and in search results.">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField path="company.phone" label="Main phone" type="tel" maxLength={30} hint="10 digits, like 202-528-0140." />
          <TextField path="company.emergencyPhone" label="After-hours / emergency phone (optional)" type="tel" maxLength={30} hint="Leave blank to use the main number." />
          <TextField path="company.email" label="Email" type="email" maxLength={254} />
          <TextField path="company.serviceAreaDetail" label="More detail on where you work (optional)" maxLength={160} hint="Example: Loudoun, Fauquier and Frederick counties" />
        </div>
        <HoursEditor />
        <TextField path="company.hoursNote" label="Note about hours (optional)" maxLength={160} hint="Example: Emergency maintenance is answered 24/7." />
      </Group>

      <Group title="Portals and payments" intro="Sign-in and rent-payment pages. Links must start with https://. A blank one shows the phone number and email instead.">
        <TextField path="company.portals.ownerUrl" label="Owner portal sign-in" maxLength={500} />
        <TextField path="company.portals.tenantUrl" label="Tenant portal sign-in" maxLength={500} />
        <TextField path="company.portals.paymentUrl" label="Pay rent online" maxLength={500} />
      </Group>

      <Group title="License numbers" intro="Only enter a number you have confirmed. Rows left blank are never shown on the site.">
        <ul className="space-y-5">
          {doc.company.licenses.map((l, i) => (
            <li key={l.state} className="border border-[var(--hairline)] bg-paper p-4 sm:p-6">
              <h4 className="mb-4 font-semibold text-ink-900">{STATE_NAME[l.state] ?? l.state}</h4>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField path={`company.licenses.${i}.number`} label="License number" maxLength={40} />
                <TextField path={`company.licenses.${i}.licenseType`} label="Type (optional)" maxLength={60} hint="Example: Principal broker license" />
                <TextField path={`company.licenses.${i}.holderName`} label="Held by (optional)" maxLength={100} />
                <TextField path={`company.licenses.${i}.verifyUrl`} label="Lookup page (optional)" maxLength={500} hint="The state's public license lookup. Must start with https://" />
              </div>
            </li>
          ))}
        </ul>
      </Group>

      <Group title="Client reviews" intro="Real quotes, used with the client's permission. The first one is shown large. With none, the section is hidden.">
        <ListEditor
          path="company.testimonials"
          noun="review"
          addLabel="Add a review"
          max={12}
          empty="No reviews yet. The reviews section stays hidden until you add one."
          make={() => ({ id: newId("t"), quote: "", name: "", detail: "" })}
          titleOf={(t: { name: string }) => t.name}
        >
          {(p) => (
            <>
              <TextField path={`${p}.quote`} label="What they said" multiline rows={4} maxLength={600} />
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField path={`${p}.name`} label="Name" maxLength={80} hint="Example: J. Doe" />
                <TextField path={`${p}.detail`} label="Who they are (optional)" maxLength={100} hint="Example: Property owner, Leesburg" />
              </div>
            </>
          )}
        </ListEditor>
      </Group>
    </div>
  );
}

/* ───────────── 6. SEO ───────────── */

function SnippetPreview({ path }: { path: string }) {
  const { doc } = useDoc();
  const title = (getIn(doc, `${path}.title`) as string) || "";
  const description = (getIn(doc, `${path}.description`) as string) || "";
  return (
    <div className="border border-[var(--hairline)] bg-white p-4" aria-label="How this page may look in Google">
      <p className="text-sm text-muted">How it may look in Google</p>
      <p className="mt-2 truncate text-xl leading-snug text-[#1a0dab]">{title || "Page title"}</p>
      <p className="mt-1 text-[0.9375rem] leading-snug text-[#4d5156]">{description || "Page description"}</p>
    </div>
  );
}

export function SeoTab() {
  return (
    <div className="space-y-10">
      <Group title="Search results" intro="What Google shows for each page. Put what the page is and where you work near the front. Titles about 60 characters and descriptions about 155 characters fit best.">
        <div className="space-y-4">
          {PAGE_KEYS.map((k) => (
            <details key={k} open={k === "home"} className="border border-[var(--hairline)] bg-paper">
              <summary className="min-h-12 cursor-pointer px-4 py-3 font-semibold text-ink-900">
                {PAGE_LABELS[k].label} <span className="font-normal text-muted">({PAGE_LABELS[k].path})</span>
              </summary>
              <div className="space-y-5 border-t border-[var(--hairline)] p-4 sm:p-6">
                <TextField path={`seo.pages.${k}.title`} label="Page title" maxLength={90} counter={60} />
                <TextField path={`seo.pages.${k}.description`} label="Page description" multiline rows={3} maxLength={220} counter={155} />
                <SnippetPreview path={`seo.pages.${k}`} />
              </div>
            </details>
          ))}
        </div>
      </Group>
      <Group title="Local keywords" intro="The phrases people search for. They are added to your business listing data for search engines. Google ignores the old “keywords” tag, so also use these words naturally in your page text above.">
        <LinesField path="seo.keywords" label="Keywords" rows={8} hint="One per line. Example: property management Purcellville VA" />
      </Group>
    </div>
  );
}

/* ───────────── 7. Careers ───────────── */

export function CareersTab() {
  return (
    <div className="space-y-10">
      <Group title="Join Our Team page" intro="Open roles and reasons to work with you. With no openings, the page asks people to send a résumé to your email.">
        <TextField path="careers.intro" label="Introduction" multiline rows={3} maxLength={400} />
      </Group>
      <Group title="Openings">
        <ListEditor
          path="careers.jobs"
          noun="opening"
          addLabel="Add an opening"
          max={20}
          empty="No openings are posted."
          make={() => ({ id: newId("j"), visible: true, title: "", summary: "", href: "" })}
          titleOf={(j: { title: string }) => j.title}
        >
          {(p) => (
            <>
              <ToggleField path={`${p}.visible`} label="Show this opening" onText="Showing" offText="Hidden" />
              <TextField path={`${p}.title`} label="Job title" maxLength={100} />
              <TextField path={`${p}.summary`} label="Short description" multiline rows={2} maxLength={240} />
              <TextField path={`${p}.href`} label="Apply link (optional)" maxLength={500} hint="Leave blank and the Apply button sends an email to your address." />
            </>
          )}
        </ListEditor>
      </Group>
      <Group title="Why work here?" intro="Short benefits, one per line. With none, the section is hidden.">
        <LinesField path="careers.benefits" label="Benefits" rows={5} placeholder="Example: Paid time off" />
      </Group>
    </div>
  );
}
