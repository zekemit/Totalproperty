import { Section, SectionHeading } from "./sections";
import { siteConfig } from "@/lib/site";

/**
 * Client quotes from `testimonials` in src/config/site.ts. Renders nothing until at least
 * one is supplied, so an empty list never leaves a heading with no content.
 */
export function Testimonials({ tone = "panel" }: { tone?: "default" | "panel" }) {
  const items = siteConfig.testimonials;
  if (items.length === 0) return null;
  return (
    <Section tone={tone} labelledBy="testimonials-h">
      <SectionHeading id="testimonials-h" title="What clients say" />
      <ul className={`grid gap-6 ${items.length > 1 ? "md:grid-cols-2" : "max-w-3xl"} ${items.length > 2 ? "lg:grid-cols-3" : ""}`}>
        {items.map((t) => (
          <li key={`${t.name}-${t.quote.slice(0, 24)}`}>
            <figure className="flex h-full flex-col rounded-xl border border-line bg-white p-6">
              <blockquote className="flex-1 font-serif text-xl leading-relaxed text-navy-800">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4">
                <span className="font-bold text-navy-800">{t.name}</span>
                {t.detail ? <span className="block text-muted">{t.detail}</span> : null}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
