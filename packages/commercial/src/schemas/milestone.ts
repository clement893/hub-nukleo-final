import { z } from "zod";

export const milestoneStatusSchema = z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

export const milestoneSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  status: milestoneStatusSchema.optional(),
  dueDate: z.string().optional(), // ISO date string
  projectId: z.string().min(1, "L'ID du projet est requis"),
});

export const updateMilestoneSchema = milestoneSchema.partial().extend({
  id: z.string().min(1, "L'ID est requis"),
});

export type MilestoneFormData = z.infer<typeof milestoneSchema>;
export type UpdateMilestoneData = z.infer<typeof updateMilestoneSchema>;

