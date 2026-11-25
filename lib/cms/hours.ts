import { DAYS, type Day, type HoursRow } from "./schema";

const FULL_DAY: Record<Day, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const blankHours = (): HoursRow[] => DAYS.map((day) => ({ day, open: "", close: "" }));

/** "08:30" to "8:30 a.m.", "17:00" to "5 p.m.", "12:00" to "noon". */
export function formatTime(t: string): string {
  const [hh, mm] = t.split(":").map(Number) as [number, number];
  if (hh === 12 && mm === 0) return "noon";
  const suffix = hh >= 12 ? "p.m." : "a.m.";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return mm === 0 ? `${h12} ${suffix}` : `${h12}:${String(mm).padStart(2, "0")} ${suffix}`;
}

type Group = { days: Day[]; open: string; close: string };

/** Consecutive days with identical hours collapse into one group. */
function group(rows: readonly HoursRow[]): Group[] {
  const byDay = new Map(rows.map((r) => [r.day, r] as const));
  const groups: Group[] = [];
  for (const day of DAYS) {
    const r = byDay.get(day);
    if (!r || !r.open || !r.close) continue;
    const last = groups[groups.length - 1];
    const prevDay = DAYS[DAYS.indexOf(day) - 1];
    if (last && last.open === r.open && last.close === r.close && prevDay && last.days[last.days.length - 1] === prevDay) last.days.push(day);
    else groups.push({ days: [day], open: r.open, close: r.close });
  }
  return groups;
}

/** "Monday to Friday, 8:30 a.m. to 5 p.m.; Saturday, 9 a.m. to noon". Empty when nothing is set. */
export function formatHours(rows: readonly HoursRow[]): string {
  return group(rows)
    .map((g) => {
      const first = g.days[0] as Day;
      const last = g.days[g.days.length - 1] as Day;
      const days = g.days.length === 1 ? FULL_DAY[first] : g.days.length === 2 ? `${FULL_DAY[first]} and ${FULL_DAY[last]}` : `${FULL_DAY[first]} to ${FULL_DAY[last]}`;
      return `${days}, ${formatTime(g.open)} to ${formatTime(g.close)}`;
    })
    .join("; ");
}

/** schema.org OpeningHoursSpecification entries (one per group of identical days). */
export function hoursSpecs(rows: readonly HoursRow[]) {
  return group(rows).map((g) => ({
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: g.days.map((d) => FULL_DAY[d]),
    opens: g.open,
    closes: g.close,
  }));
}
