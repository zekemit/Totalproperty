export type VacancyInput = { monthlyRent: number; vacantDays: number };

export type VacancyResult = {
  /** Rent for a full, fully occupied year. */
  annualPotential: number;
  /** What one vacant month costs (equal to monthly rent). */
  perVacantMonth: number;
  /** What one vacant day costs (annual potential ÷ 365). */
  perVacantDay: number;
  /** Income lost over `vacantDays`. */
  lostIncome: number;
};

const MAX_RENT = 100_000;

const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * Pure arithmetic on numbers the visitor typed. It estimates nothing about the
 * market — no comps, no rent guidance — so it can never mislead about what a
 * property would rent for. Returns null for any input that isn't a sensible,
 * finite number so the UI never renders NaN or Infinity.
 */
export function vacancyCost({ monthlyRent, vacantDays }: VacancyInput): VacancyResult | null {
  if (!Number.isFinite(monthlyRent) || !Number.isFinite(vacantDays)) return null;
  if (monthlyRent <= 0 || monthlyRent > MAX_RENT) return null;
  if (vacantDays < 0 || vacantDays > 365) return null;
  const annualPotential = monthlyRent * 12;
  const perDay = annualPotential / 365;
  return {
    annualPotential: cents(annualPotential),
    perVacantMonth: cents(monthlyRent),
    perVacantDay: cents(perDay),
    lostIncome: cents(perDay * vacantDays),
  };
}
