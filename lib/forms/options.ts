/** Human labels for the option sets in schemas.ts. Client-safe (no Zod import). */

export const stateOptions = [
  { value: "VA", label: "Virginia" },
  { value: "MD", label: "Maryland" },
  { value: "PA", label: "Pennsylvania" },
  { value: "DC", label: "Washington, DC" },
] as const;

export const propertyTypeOptions = [
  { value: "single_family", label: "Single-family home" },
  { value: "townhome", label: "Townhome" },
  { value: "condo", label: "Condo" },
  { value: "small_multifamily", label: "Small multifamily (2–4 units)" },
  { value: "other", label: "Something else" },
] as const;

export const occupancyOptions = [
  { value: "tenant_in_place", label: "A tenant lives there now" },
  { value: "vacant", label: "It's vacant" },
  { value: "owner_occupied", label: "I live there and may rent it out" },
  { value: "new_purchase", label: "I'm buying or just bought it" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "one_to_three_months", label: "In the next 1–3 months" },
  { value: "exploring", label: "Just exploring options" },
] as const;

export const contactTopicOptions = [
  { value: "general", label: "A general question" },
  { value: "owner", label: "Managing my rental property" },
  { value: "commercial", label: "Commercial property or CAM" },
  { value: "construction", label: "Construction management" },
  { value: "lender", label: "Lender or REO services" },
  { value: "tenant", label: "I'm a tenant" },
  { value: "vendor", label: "I'm a vendor or contractor" },
] as const;

export const maintenanceCategoryOptions = [
  { value: "plumbing", label: "Plumbing or leaks" },
  { value: "heating_cooling", label: "Heating or cooling" },
  { value: "electrical", label: "Electrical" },
  { value: "appliance", label: "Appliance" },
  { value: "pest", label: "Pests" },
  { value: "exterior", label: "Exterior, roof, or yard" },
  { value: "other", label: "Something else" },
] as const;

export const vendorTradeOptions = [
  { value: "general_contractor", label: "General contractor" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "roofing", label: "Roofing" },
  { value: "landscaping_snow", label: "Landscaping or snow removal" },
  { value: "cleaning_turnover", label: "Cleaning or turnover" },
  { value: "painting", label: "Painting" },
  { value: "pest", label: "Pest control" },
  { value: "other", label: "Something else" },
] as const;
