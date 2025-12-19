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
    .refine(
      (val) => {
        if (!val || val === "" || val === null) return true;
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: "URL invalide" }
    )
    .transform((val) => (val === null || val === "" ? undefined : val)),
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

