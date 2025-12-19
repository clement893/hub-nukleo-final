import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(100, "Le prénom est trop long"),
  lastName: z.string().min(1, "Le nom est requis").max(100, "Le nom est trop long"),
  email: z
    .string()
    .email("Email invalide")
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  phone: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  position: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  companyId: z.string().optional().nullable().transform((val) => (val === null || val === "" ? undefined : val)),
});

export type ContactFormData = z.infer<typeof contactSchema>;


