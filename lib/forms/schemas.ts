import { z } from "zod";
import { cleanText } from "./text";

/* ───────────────────────────── Primitives ───────────────────────────── */

/** Required, sanitized text with a length range. */
const text = (min: number, max: number, minMsg: string, maxMsg = `Keep this under ${max} characters.`) =>
  z
    .string({ error: minMsg })
    .transform(cleanText)
    .pipe(z.string().min(min, minMsg).max(max, maxMsg));

/** Browsers submit blank optional inputs as "" — treat that as "not provided". */
const blankToUndefined = (v: unknown) => (typeof v === "string" && cleanText(v) === "" ? undefined : v);

const optionalText = (max: number) => z.preprocess(blankToUndefined, text(1, max, "Invalid value.").optional());

const email = z
  .string({ error: "Enter your email address." })
  .transform((s) => cleanText(s).toLowerCase())
  .pipe(z.string().max(254, "That email address is too long.").pipe(z.email("Enter a valid email address.")));

const PHONE_CHARS = /^[\d\s()+.\-]+$/;

/** Returns E.164-style text, or null when the input is not a plausible phone number. */
function normalizePhone(raw: string): string | null {
  if (!PHONE_CHARS.test(raw)) return null;
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+")) return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

const phone = z
  .string({ error: "Enter a phone number we can reach you at." })
  .transform(cleanText)
  .refine((v) => normalizePhone(v) !== null, "Enter a valid phone number, e.g. 202-555-0100.")
  .transform((v) => normalizePhone(v) as string);

const optionalPhone = z.preprocess(blankToUndefined, phone.optional());

const toBool = (v: unknown) => v === true || v === "on" || v === "true" || v === "1";

/** A checkbox the user must tick. */
const requiredConsent = z.preprocess(
  toBool,
  z.boolean().refine((v) => v, "Please confirm so we can contact you about this request."),
);

/** A checkbox that is false when absent. */
const checkbox = z.preprocess(toBool, z.boolean());

const optionalNumber = (min: number, max: number, integer: boolean, msg: string) =>
  z.preprocess(
    (v) => {
      if (v === null || v === undefined) return undefined;
      if (typeof v === "string") {
        const s = v.replace(/[,$\s]/g, "");
        return s === "" ? undefined : Number(s);
      }
      return v;
    },
    (integer ? z.number({ error: msg }).int(msg) : z.number({ error: msg })).min(min, msg).max(max, msg).optional(),
  );

const choice = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values, { error: "Please choose an option." });

/* ───────────────────────────── Option sets ───────────────────────────── */

export const STATES = ["VA", "MD", "PA", "DC"] as const;
export const PROPERTY_TYPES = ["single_family", "townhome", "condo", "small_multifamily", "other"] as const;
export const OCCUPANCY = ["vacant", "tenant_in_place", "owner_occupied", "new_purchase"] as const;
export const TIMELINES = ["asap", "one_to_three_months", "exploring"] as const;
export const CONTACT_TOPICS = ["general", "owner", "commercial", "construction", "lender", "tenant", "vendor"] as const;
export const MAINTENANCE_CATEGORIES = ["plumbing", "heating_cooling", "electrical", "appliance", "pest", "exterior", "other"] as const;
export const VENDOR_TRADES = [
  "general_contractor",
  "hvac",
  "plumbing",
  "electrical",
  "roofing",
  "landscaping_snow",
  "cleaning_turnover",
  "painting",
  "pest",
  "other",
] as const;

/* ───────────────────────────── Schemas ───────────────────────────── */

const person = {
  name: text(2, 100, "Enter your full name."),
  email,
  consent: requiredConsent,
};

export const rentalAnalysisSchema = z.object({
  ...person,
  phone: optionalPhone,
  street: text(5, 120, "Enter the property's street address."),
  city: text(2, 80, "Enter the city."),
  state: z.enum(STATES, { error: "Choose a state." }),
  zip: text(5, 10, "Enter a 5-digit ZIP code.").pipe(z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a 5-digit ZIP code.")),
  propertyType: choice(PROPERTY_TYPES),
  occupancy: choice(OCCUPANCY),
  bedrooms: optionalNumber(0, 20, true, "Enter a whole number from 0 to 20."),
  currentRent: optionalNumber(0, 100_000, false, "Enter a monthly rent between $0 and $100,000."),
  timeline: choice(TIMELINES),
  notes: optionalText(1500),
});

export const contactSchema = z.object({
  ...person,
  phone: optionalPhone,
  company: optionalText(120),
  topic: choice(CONTACT_TOPICS),
  message: text(10, 2000, "Tell us a little more (at least 10 characters).", "Please keep your message under 2,000 characters."),
});

export const maintenanceSchema = z.object({
  ...person,
  phone,
  address: text(5, 160, "Enter the property address."),
  unit: optionalText(20),
  category: choice(MAINTENANCE_CATEGORIES),
  description: text(10, 2000, "Describe the problem (at least 10 characters).", "Please keep this under 2,000 characters."),
  emergency: checkbox,
  permissionToEnter: z.enum(["yes", "no"], { error: "Please choose an option." }).default("no"),
});

export const vendorSchema = z.object({
  ...person,
  phone,
  company: text(2, 120, "Enter your company name."),
  trade: choice(VENDOR_TRADES),
  serviceArea: text(2, 200, "Tell us where you work."),
  message: optionalText(1500),
});

/** Email is all we need; a name is welcome but optional. */
export const newsletterSchema = z.object({
  email,
  name: optionalText(100),
  consent: z.preprocess(toBool, z.boolean().refine((v) => v, "Please tick the box so we know you want the newsletter.")),
});

export type RentalAnalysisInput = z.infer<typeof rentalAnalysisSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
export type VendorInput = z.infer<typeof vendorSchema>;

/** Flatten Zod issues into `{ field: [messages] }` for the UI. */
export function toFieldErrors(error: z.ZodError): Record<string, string[] | undefined> {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
