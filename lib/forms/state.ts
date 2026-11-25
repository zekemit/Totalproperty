/** Client-safe form state shared by Server Actions and form components. */
export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialFormState: FormState = { status: "idle" };

export type FormKind = "rental_analysis" | "contact" | "maintenance" | "vendor";
