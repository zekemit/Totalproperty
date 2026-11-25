import { Band, display, PullQuote, SectionTitle } from "./sections";
import { siteConfig } from "@/lib/site";

/**
 * Client quotes from `testimonials` in src/config/site.ts. The first is set as a large
 * pull-quote, the rest as ruled columns. Renders nothing until one is supplied.
 */
export function Testimonials({ tone = "travertine" }: { tone?: "limestone" | "travertine" }) {
  const [first, ...rest] = siteConfig.testimonials;
  if (!first) return null;
  return (
    <Band tone={tone} labelledBy="testimonials-h">
      <SectionTitle id="testimonials-h" className="mb-14">What clients say</SectionTitle>
      <PullQuote cite={`${first.name}${first.detail ? `, ${first.detail}` : ""}`}>&ldquo;{first.quote}&rdquo;</PullQuote>
      {rest.length > 0 ? (
        <ul className="mt-16 grid gap-x-12 gap-y-10 border-t border-[var(--hairline)] pt-10 md:grid-cols-2">
          {rest.map((t) => (
            <li key={`${t.name}-${t.quote.slice(0, 24)}`}>
              <blockquote className={`${display.sub} font-display-italic`}>&ldquo;{t.quote}&rdquo;</blockquote>
              <p className="mt-4 text-[0.9375rem] text-muted">
                {t.name}
                {t.detail ? `, ${t.detail}` : ""}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
    </Band>
  );
}
