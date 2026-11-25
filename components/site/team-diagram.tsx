import { LogoGlyph } from "./logo";

const clients = ["Owner", "Landlord", "Tenant", "Lender"] as const;
const functions = ["Maintenance", "Renovation", "Repair", "CAM", "Security", "Landscaping", "Accounting"] as const;

/** Evenly spaced row centres (percent) so the connector lines land on each label. */
const centre = (i: number, n: number) => ((i + 0.5) / n) * 100;

function Connectors({ count, side }: { count: number; side: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      {Array.from({ length: count }, (_, i) => {
        const y = centre(i, count);
        return (
          <line
            key={i}
            x1={side === "left" ? 0 : 100}
            y1={y}
            x2={side === "left" ? 100 : 0}
            y2={50}
            stroke="#e2b35a"
            strokeOpacity={0.7}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/**
 * The company's own "who we serve → what we handle" diagram (originally a flat GIF),
 * rebuilt as live, accessible text. On phones it collapses to two plain lists.
 */
export function TeamDiagram() {
  return (
    <div>
      {/* Small screens: two labelled lists. */}
      <div className="grid gap-8 md:hidden">
        <div>
          <h3 className="text-lg">We work for</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {clients.map((c) => (
              <li key={c} className="rounded-md border border-white/40 px-4 py-2 font-bold text-white">{c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg">We take care of</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {functions.map((f) => (
              <li key={f} className="rounded-md bg-navy-900 px-4 py-2 text-white">{f}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* md and up: the converging diagram. */}
      <div className="hidden h-[26rem] grid-cols-[auto_1fr_auto_1fr_auto] items-stretch md:grid" role="group" aria-label="Who we work for and what we take care of">
        <ul className="grid grid-rows-4 items-center" aria-label="We work for">
          {clients.map((c) => (
            <li key={c} className="text-2xl font-extrabold text-white">{c}</li>
          ))}
        </ul>
        <div className="mx-4"><Connectors count={clients.length} side="left" /></div>
        <div className="flex flex-col items-center justify-center self-center rounded-full border-2 border-gold bg-navy-900 p-7 text-center">
          <LogoGlyph tone="dark" className="size-14" />
          <span className="mt-3 text-lg font-extrabold leading-tight text-white">Total Property<br />Management</span>
        </div>
        <div className="mx-4"><Connectors count={functions.length} side="right" /></div>
        <ul className="grid grid-rows-7 items-center" aria-label="We take care of">
          {functions.map((f) => (
            <li key={f} className="text-lg font-bold text-white">{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
