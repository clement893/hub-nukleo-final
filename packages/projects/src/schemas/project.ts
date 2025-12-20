import { z } from "zod";

export const projectCreateSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  status: z.enum(["PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED", "CANCELLED"]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  budget: z.number().positive().optional(),
  companyId: z.string().optional(),
  managerId: z.string().min(1, "Le manager est requis"),
  // Additional fields
  team: z.string().optional(),
  stage: z.string().optional(),
  billingStatus: z.string().optional(),
  lead: z.string().optional(),
  contactMethod: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  proposalUrl: z.string().url().optional().or(z.literal("")),
  driveUrl: z.string().url().optional().or(z.literal("")),
  asanaUrl: z.string().url().optional().or(z.literal("")),
  slackUrl: z.string().url().optional().or(z.literal("")),
  projectType: z.string().optional(),
  year: z.string().optional(),
  brief: z.string().optional(),
  testimony: z.string().optional(),
  portfolio: z.string().optional(),
  report: z.string().optional(),
  communication: z.string().optional(),
  departments: z.string().optional(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
