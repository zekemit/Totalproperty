import { describe, expect, it } from "vitest";
import { vacancyCost } from "@/lib/calc/vacancy";

describe("vacancyCost", () => {
  it("computes annual potential, the cost of one vacant month, and the cost of N vacant days", () => {
    const r = vacancyCost({ monthlyRent: 3000, vacantDays: 30 });
    expect(r).toEqual({ annualPotential: 36000, perVacantMonth: 3000, lostIncome: 2958.9, perVacantDay: 98.63 });
  });
  it("returns zero lost income for zero vacant days", () => {
    expect(vacancyCost({ monthlyRent: 2500, vacantDays: 0 })?.lostIncome).toBe(0);
  });
  it("accepts a full year of vacancy", () => {
    expect(vacancyCost({ monthlyRent: 1000, vacantDays: 365 })?.lostIncome).toBe(12000);
  });
  it.each([
    ["zero rent", { monthlyRent: 0, vacantDays: 10 }],
    ["negative rent", { monthlyRent: -1, vacantDays: 10 }],
    ["NaN rent", { monthlyRent: Number.NaN, vacantDays: 10 }],
    ["Infinity rent", { monthlyRent: Number.POSITIVE_INFINITY, vacantDays: 10 }],
    ["absurd rent", { monthlyRent: 1e12, vacantDays: 10 }],
    ["negative days", { monthlyRent: 2000, vacantDays: -1 }],
    ["NaN days", { monthlyRent: 2000, vacantDays: Number.NaN }],
    ["more than a year", { monthlyRent: 2000, vacantDays: 366 }],
  ])("returns null for %s (never NaN/Infinity on screen)", (_label, input) => {
    expect(vacancyCost(input)).toBeNull();
  });
});
