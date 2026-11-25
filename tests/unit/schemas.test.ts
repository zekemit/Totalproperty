import { describe, expect, it } from "vitest";
import { contactSchema, maintenanceSchema, rentalAnalysisSchema, vendorSchema } from "@/lib/forms/schemas";

const person = { name: "Jane Owner", email: "Jane@Example.com ", phone: "(202) 528-0140", consent: "on" };

const rental = {
  ...person,
  street: "123 Main St",
  city: "Purcellville",
  state: "VA",
  zip: "20132",
  propertyType: "single_family",
  occupancy: "tenant_in_place",
  timeline: "asap",
};

describe("rentalAnalysisSchema", () => {
  it("accepts a valid payload and normalizes email and phone", () => {
    const r = rentalAnalysisSchema.safeParse(rental);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.email).toBe("jane@example.com");
      expect(r.data.phone).toBe("+12025280140");
      expect(r.data.consent).toBe(true);
    }
  });
  it("treats blank optional fields (as sent by browsers) as absent", () => {
    const r = rentalAnalysisSchema.safeParse({ ...rental, phone: "", bedrooms: "", currentRent: "", notes: "" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.phone).toBeUndefined();
      expect(r.data.bedrooms).toBeUndefined();
      expect(r.data.currentRent).toBeUndefined();
    }
  });
  it("coerces numeric strings for bedrooms and rent", () => {
    const r = rentalAnalysisSchema.safeParse({ ...rental, bedrooms: "3", currentRent: "2,450" });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.bedrooms).toBe(3);
      expect(r.data.currentRent).toBe(2450);
    }
  });
  it.each([
    ["email", { email: "not-an-email" }],
    ["zip", { zip: "2013" }],
    ["state", { state: "TX" }],
    ["phone", { phone: "12345" }],
    ["street", { street: "x" }],
    ["propertyType", { propertyType: "castle" }],
    ["bedrooms", { bedrooms: "-1" }],
    ["currentRent", { currentRent: "-5" }],
    ["consent", { consent: undefined }],
  ])("rejects bad %s with a field error", (field, patch) => {
    const r = rentalAnalysisSchema.safeParse({ ...rental, ...patch });
    expect(r.success).toBe(false);
    if (!r.success) expect(Object.keys(r.error.flatten().fieldErrors)).toContain(field);
  });
  it("rejects a name that is only whitespace/zero-width characters", () => {
    expect(rentalAnalysisSchema.safeParse({ ...rental, name: " ​ " }).success).toBe(false);
  });
  it("keeps markup as inert text (no HTML interpretation here)", () => {
    const r = rentalAnalysisSchema.safeParse({ ...rental, notes: "<script>alert(1)</script>" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.notes).toBe("<script>alert(1)</script>");
  });
});

describe("contactSchema", () => {
  const base = { ...person, topic: "commercial", message: "We manage a small retail center." };
  it("accepts valid input", () => expect(contactSchema.safeParse(base).success).toBe(true));
  it("requires a message of at least 10 characters and at most 2000", () => {
    expect(contactSchema.safeParse({ ...base, message: "short" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: "x".repeat(2001) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: "x".repeat(2000) }).success).toBe(true);
  });
  it("rejects unknown topics", () => expect(contactSchema.safeParse({ ...base, topic: "spam" }).success).toBe(false));
  it("makes phone optional", () => expect(contactSchema.safeParse({ ...base, phone: "" }).success).toBe(true));
});

describe("maintenanceSchema", () => {
  const base = {
    ...person,
    address: "45 Elm St, Purcellville, VA 20132",
    unit: "",
    category: "plumbing",
    description: "Kitchen sink is leaking under the cabinet.",
    emergency: "on",
    permissionToEnter: "yes",
  };
  it("requires a phone number for maintenance follow-up", () => {
    expect(maintenanceSchema.safeParse(base).success).toBe(true);
    expect(maintenanceSchema.safeParse({ ...base, phone: "" }).success).toBe(false);
  });
  it("parses the emergency checkbox as a boolean (absent → false)", () => {
    const a = maintenanceSchema.parse(base);
    expect(a.emergency).toBe(true);
    const { emergency: _e, ...rest } = base;
    expect(maintenanceSchema.parse(rest).emergency).toBe(false);
  });
  it("rejects unknown categories", () => {
    expect(maintenanceSchema.safeParse({ ...base, category: "ghosts" }).success).toBe(false);
  });
});

describe("vendorSchema", () => {
  const base = { ...person, company: "Blue Ridge HVAC", trade: "hvac", serviceArea: "Loudoun and Fauquier counties, VA" };
  it("accepts valid input and requires company, trade and service area", () => {
    expect(vendorSchema.safeParse(base).success).toBe(true);
    expect(vendorSchema.safeParse({ ...base, company: "" }).success).toBe(false);
    expect(vendorSchema.safeParse({ ...base, trade: "unknown" }).success).toBe(false);
    expect(vendorSchema.safeParse({ ...base, serviceArea: "" }).success).toBe(false);
  });
});
