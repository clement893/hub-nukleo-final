import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis").max(255, "Le nom est trop long"),
  industry: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  website: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (val === null || val === "" || val === undefined) return undefined;
      // Validate URL only if provided
      try {
        if (val) new URL(val);
      } catch {
        return val; // Return as-is, validation will happen on submit
      }
      return val;
    })
    .refine(
      (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
      { message: "URL invalide" }
    ),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  address: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  city: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  country: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
});

export type CompanyFormData = z.infer<typeof companySchema>;

