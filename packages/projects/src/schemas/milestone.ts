import { z } from "zod";

export const milestoneCreateSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  startDate: z.date().optional(),
  dueDate: z.date().optional(),
  deliverables: z.array(z.string()).optional(),
  projectId: z.string().min(1, "Le projet est requis"),
  order: z.number().int().min(0),
});

export const milestoneUpdateSchema = milestoneCreateSchema.partial().extend({
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  progress: z.number().min(0).max(100).optional(),
  completedAt: z.date().optional(),
});

export type MilestoneCreateInput = z.infer<typeof milestoneCreateSchema>;
export type MilestoneUpdateInput = z.infer<typeof milestoneUpdateSchema>;
