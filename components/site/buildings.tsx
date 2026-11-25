import { cn } from "@/lib/utils";

export type BuildingKind = "owners" | "commercial" | "lenders" | "tenants" | "construction";

type Props = { kind: BuildingKind; active?: boolean; className?: string };

const W = 1.5;
const GROUND = <line x1="4" y1="290" x2="236" y2="290" />;

/* Elevations are deliberately simple line drawings on a shared ground line (y = 290).
   `.vol` shapes take a brass tint when the building is active (see globals.css). */

function Owners() {
  return (
    <>
      <rect className="vol" x="38" y="152" width="164" height="138" />
      <polygon className="vol" points="22,154 120,68 218,154" />
      <rect x="164" y="80" width="18" height="46" />
      <circle cx="120" cy="120" r="12" />
      <line x1="108" y1="120" x2="132" y2="120" />
      <line x1="120" y1="108" x2="120" y2="132" />
      {[60, 158].map((x) => (
        <g key={x}>
          <rect x={x} y="180" width="22" height="36" />
          <line x1={x + 11} y1="180" x2={x + 11} y2="216" />
          <line x1={x} y1="198" x2={x + 22} y2="198" />
        </g>
      ))}
      <rect x="104" y="224" width="32" height="66" />
      <circle cx="130" cy="260" r="1.6" />
      <line x1="96" y1="290" x2="144" y2="290" />
      <line x1="98" y1="284" x2="142" y2="284" />
      {GROUND}
    </>
  );
}

function Commercial() {
  return (
    <>
      <rect className="vol" x="30" y="98" width="180" height="192" />
      <rect x="24" y="88" width="192" height="10" />
      <rect x="150" y="68" width="36" height="20" />
      {[118, 160].map((y) =>
        [0, 1, 2, 3, 4].map((i) => (
          <g key={`${y}-${i}`}>
            <rect x={46 + i * 34} y={y} width="20" height="28" />
            <line x1={46 + i * 34} y1={y + 14} x2={66 + i * 34} y2={y + 14} />
          </g>
        )),
      )}
      <rect x="46" y="204" width="148" height="10" />
      <polygon points="38,222 202,222 208,238 32,238" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={44 + i * 21} y1="222" x2={40 + i * 21} y2="238" />
      ))}
      <rect x="42" y="240" width="156" height="50" />
      <line x1="94" y1="240" x2="94" y2="290" />
      <line x1="146" y1="240" x2="146" y2="290" />
      <line x1="42" y1="254" x2="198" y2="254" />
      {GROUND}
    </>
  );
}

function Lenders() {
  return (
    <>
      <rect className="vol" x="54" y="192" width="126" height="98" />
      <polygon className="vol" points="42,194 117,138 192,194" />
      <rect x="180" y="216" width="42" height="74" />
      <line x1="176" y1="216" x2="226" y2="216" />
      {[236, 256, 274].map((y) => (
        <line key={y} x1="180" y1={y} x2="222" y2={y} />
      ))}
      <rect x="98" y="236" width="26" height="54" />
      <rect x="126" y="258" width="8" height="11" />
      <rect x="66" y="214" width="22" height="26" />
      <rect x="146" y="214" width="22" height="26" />
      <line x1="22" y1="214" x2="22" y2="290" />
      <rect x="6" y="220" width="34" height="26" />
      <circle cx="16" cy="233" r="4" />
      <line x1="20" y1="233" x2="34" y2="233" />
      <line x1="30" y1="233" x2="30" y2="238" />
      <line x1="34" y1="233" x2="34" y2="238" />
      {GROUND}
    </>
  );
}

function Tenants() {
  return (
    <>
      <rect className="vol" x="62" y="54" width="116" height="236" />
      <rect x="58" y="48" width="124" height="6" />
      <rect x="100" y="28" width="40" height="20" />
      {[0, 1, 2, 3, 4, 5].map((j) =>
        [0, 1, 2, 3].map((i) => (
          <rect key={`${j}-${i}`} x={74 + i * 26} y={70 + j * 30} width="14" height="18" />
        )),
      )}
      <rect x="96" y="254" width="48" height="5" />
      <rect x="104" y="260" width="32" height="30" />
      <line x1="120" y1="260" x2="120" y2="290" />
      {GROUND}
    </>
  );
}

function Construction() {
  return (
    <>
      <rect className="vol" x="56" y="170" width="132" height="120" />
      {[56, 100, 144, 188].map((x, i) => (
        <line key={x} x1={x} y1="290" x2={x} y2={i % 2 === 0 ? 120 : 150} />
      ))}
      {[250, 210, 170].map((y) => (
        <line key={y} x1="56" y1={y} x2="188" y2={y} />
      ))}
      <line x1="56" y1="290" x2="100" y2="250" />
      <line x1="100" y1="290" x2="56" y2="250" />
      <line x1="144" y1="250" x2="188" y2="210" />
      <line x1="188" y1="250" x2="144" y2="210" />
      <line x1="216" y1="290" x2="216" y2="40" />
      <line x1="226" y1="290" x2="226" y2="40" />
      <line x1="30" y1="40" x2="236" y2="40" />
      <line x1="216" y1="40" x2="216" y2="24" />
      <line x1="226" y1="40" x2="226" y2="24" />
      <line x1="216" y1="24" x2="226" y2="24" />
      <line x1="62" y1="40" x2="62" y2="92" />
      <rect x="54" y="92" width="16" height="12" />
      {GROUND}
    </>
  );
}

const drawings: Record<BuildingKind, () => React.JSX.Element> = { owners: Owners, commercial: Commercial, lenders: Lenders, tenants: Tenants, construction: Construction };

/** A stroke-only building elevation. Colour comes from `currentColor` (see `.bldg`). */
export function Building({ kind, active = false, className }: Props) {
  const Drawing = drawings[kind];
  return (
    <svg viewBox="0 0 240 300" aria-hidden="true" data-active={active} className={cn("bldg h-auto w-full", className)} fill="none" stroke="currentColor" strokeWidth={W} strokeLinejoin="miter">
      <Drawing />
    </svg>
  );
}
