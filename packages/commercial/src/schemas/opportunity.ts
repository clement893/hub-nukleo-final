import { z } from "zod";

export const opportunityStageSchema = z.enum([
  "IDEAS_CONTACT_PROJECT",
  "FOLLOW_UP_EMAILS",
  "MEETING_BOOKED",
  "IN_DISCUSSION",
  "PROPOSAL_TO_DO",
  "PROPOSAL_SENT",
  "CONTRACT_TO_DO",
  "CLOSED_WON",
  "CLOSED_LOST",
  "RENEWALS_POTENTIAL_UPCOMING",
  "WAITING_OR_SILENT",
]);

export const opportunitySchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(255, "Le titre est trop long"),
  description: z.string().optional(),
  value: z
    .number()
    .positive("La valeur doit être positive")
    .optional()
    .nullable()
    .transform((val) => (val === null ? undefined : val)),
  stage: opportunityStageSchema,
  probability: z
    .number()
    .int("La probabilité doit être un entier")
    .min(0, "La probabilité doit être entre 0 et 100")
    .max(100, "La probabilité doit être entre 0 et 100")
    .optional()
    .nullable()
    .transform((val) => (val === null ? undefined : val)),
  expectedCloseDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === null || val === "" ? undefined : val)),
  companyId: z.string().optional().nullable().transform((val) => (val === null || val === "" ? undefined : val)),
  contactId: z.string().optional().nullable().transform((val) => (val === null || val === "" ? undefined : val)),
});

export type OpportunityFormData = z.infer<typeof opportunitySchema>;

