import { z } from "zod";

// Schema for ProposalItem
export const proposalItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().optional().nullable(),
  type: z.enum(["DELIVERABLE", "SERVICE", "PRODUCT", "OTHER"]).default("DELIVERABLE"),
  quantity: z.number().int().positive().optional().nullable(),
  unitPrice: z.number().nonnegative().optional().nullable(),
  totalPrice: z.number().nonnegative().optional().nullable(),
  order: z.number().int().nonnegative().default(0),
});

// Schema for ProposalSection
export const proposalSectionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().optional().nullable(),
  order: z.number().int().nonnegative().default(0),
  items: z.array(proposalItemSchema).default([]),
});

// Schema for ProposalProcess
export const proposalProcessSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().optional().nullable(),
  order: z.number().int().nonnegative().default(0),
  estimatedDuration: z.number().int().positive().optional().nullable(),
});

// Schema for Proposal
export const proposalSchema = z.object({
  title: z.string().min(1, "Le titre est requis").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "SUBMITTED", "ACCEPTED", "REJECTED", "REVISED"]).default("DRAFT"),
  totalAmount: z.number().nonnegative().optional().nullable(),
  validUntil: z.date().optional().nullable(),
  opportunityId: z.string().min(1, "L'opportunité est requise"),
  sections: z.array(proposalSectionSchema).default([]),
  processes: z.array(proposalProcessSchema).default([]),
});

// Schema for updating proposal status
export const updateProposalStatusSchema = z.object({
  status: z.enum(["DRAFT", "SUBMITTED", "ACCEPTED", "REJECTED", "REVISED"]),
  rejectionReason: z.string().optional().nullable(),
});

// Schema for updating proposal
export const updateProposalSchema = proposalSchema.partial().extend({
  id: z.string().min(1),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;
export type ProposalItemFormData = z.infer<typeof proposalItemSchema>;
export type ProposalSectionFormData = z.infer<typeof proposalSectionSchema>;
export type ProposalProcessFormData = z.infer<typeof proposalProcessSchema>;
export type UpdateProposalStatusData = z.infer<typeof updateProposalStatusSchema>;
export type UpdateProposalData = z.infer<typeof updateProposalSchema>;

