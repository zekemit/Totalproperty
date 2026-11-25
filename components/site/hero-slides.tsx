"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Slide = { src: string; alt: string; label: string };

const REDUCED = "(prefers-reduced-motion: reduce)";

/** True when the visitor asked for less motion. The server snapshot assumes yes, so nothing moves before hydration. */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(REDUCED).matches,
    () => true,
  );
}

/**
 * The reference site's four-picture fading carousel, made accessible: a visible pause/play control
 * (WCAG 2.2.2), dot buttons, and no automatic movement at all under prefers-reduced-motion.
 * Only the first picture is preloaded; the rest are lazy and sit stacked, fading with opacity.
 */
export function HeroSlides({ slides, intervalMs = 5200 }: { slides: readonly Slide[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!playing || reduced || slides.length < 2) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => window.clearInterval(t);
  }, [playing, reduced, slides.length, intervalMs]);

  const current = slides[index] ?? slides[0];
  if (!current) return null;

  return (
    <figure className="m-0" aria-label="Property types we manage">
      <div className="relative aspect-[4/3] overflow-hidden border border-brass-500/60 bg-ink-950 p-0">
        {slides.map((s, i) => (
          <div key={s.src} aria-hidden={i !== index} className={cn("absolute inset-0 transition-opacity duration-1000 motion-reduce:transition-none", i === index ? "opacity-100" : "opacity-0")}>
            <Image src={s.src} alt={i === index ? s.alt : ""} fill sizes="(min-width: 1024px) 44vw, 100vw" priority={i === 0} className="object-cover" />
          </div>
        ))}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
      </div>
      <figcaption className="on-dark mt-4 flex items-center justify-between gap-4 text-[0.9375rem]">
        <span aria-live={playing && !reduced ? "off" : "polite"} className="font-semibold text-limestone">
          {current.label}
        </span>
        <span className="flex items-center gap-1">
          <ul className="flex">
            {slides.map((s, i) => (
              <li key={s.src}>
                <button
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setPlaying(false);
                  }}
                  aria-label={`Show ${s.label}`}
                  aria-current={i === index ? "true" : undefined}
                  className="group inline-flex size-11 items-center justify-center"
                >
                  <span className={cn("block h-[3px] w-6 transition-colors", i === index ? "bg-brass-300" : "bg-limestone/35 group-hover:bg-limestone/70")} />
                </button>
              </li>
            ))}
          </ul>
          {slides.length > 1 && !reduced ? (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-pressed={!playing}
              aria-label={playing ? "Pause slideshow" : "Play slideshow"}
              className="inline-flex size-11 items-center justify-center border border-limestone/30 text-limestone hover:border-limestone"
            >
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
            </button>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
