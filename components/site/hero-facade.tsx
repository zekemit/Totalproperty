/**
 * A masonry facade, drawn in hairlines, that draws itself in on load. Purely decorative.
 * Every shape has pathLength="1" so a single stroke-dashoffset animation draws it
 * (see `.draw` in globals.css); with reduced motion it simply appears.
 */
const BAYS = [86, 200, 314, 428] as const;
const FLOORS = [92, 196, 300, 404] as const;

export function HeroFacade({ className }: { className?: string }) {
  // Draw top-left to bottom-right: delay follows position, so the whole facade is finished in about 2.5 s.
  const d = (x: number, y: number) => ({ "--d": Math.round(y * 1.5 + x * 0.6) }) as React.CSSProperties;
  return (
    <svg viewBox="0 0 520 640" aria-hidden="true" focusable="false" className={`draw ${className ?? ""}`} fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="14" y="14" width="492" height="22" pathLength={1} style={d(14, 14)} />
      <rect x="22" y="36" width="476" height="590" pathLength={1} style={d(22, 36)} />
      {[22, 140, 258, 376, 498].map((x) => (
        <line key={x} x1={x} y1="36" x2={x} y2="626" pathLength={1} style={d(x, 36)} />
      ))}
      {FLOORS.map((y) => (
        <line key={y} x1="22" y1={y + 92} x2="498" y2={y + 92} pathLength={1} style={d(22, y + 92)} />
      ))}
      {FLOORS.map((y) =>
        BAYS.map((x) => (
          <g key={`${y}-${x}`}>
            <rect x={x - 28} y={y} width="56" height="72" pathLength={1} style={d(x, y)} />
            <line x1={x} y1={y} x2={x} y2={y + 72} pathLength={1} style={d(x, y)} />
            <line x1={x - 28} y1={y + 30} x2={x + 28} y2={y + 30} pathLength={1} style={d(x, y)} />
            <line x1={x - 34} y1={y + 78} x2={x + 34} y2={y + 78} pathLength={1} style={d(x, y)} />
          </g>
        )),
      )}
      {[81, 199, 317, 437].map((x) => (
        <path key={x} d={`M ${x - 40} 626 V 560 A 40 40 0 0 1 ${x + 40} 560 V 626`} pathLength={1} style={d(x, 560)} />
      ))}
    </svg>
  );
}
