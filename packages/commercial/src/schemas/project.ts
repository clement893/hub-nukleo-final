import { z } from "zod";
import { ProjectStatus, TaskStatus, TaskPriority } from "@prisma/client";

export const projectSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).default("PLANNING"),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  budget: z.number().positive().optional().nullable(),
  companyId: z.string().optional().nullable(),
});

export const updateProjectSchema = projectSchema.extend({
  id: z.string(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre de la tâche est requis"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.nativeEnum(TaskPriority).default("MEDIUM"),
  dueDate: z.date().optional().nullable(),
  projectId: z.string(),
  assigneeId: z.string().optional().nullable(),
});

export const updateTaskSchema = taskSchema.extend({
  id: z.string(),
});

export const timeEntrySchema = z.object({
  date: z.date(),
  hours: z.number().positive("Le nombre d'heures doit être positif"),
  description: z.string().optional(),
  taskId: z.string(),
});

export const updateTimeEntrySchema = timeEntrySchema.extend({
  id: z.string(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
export type UpdateProjectData = z.infer<typeof updateProjectSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;
export type TimeEntryFormData = z.infer<typeof timeEntrySchema>;
export type UpdateTimeEntryData = z.infer<typeof updateTimeEntrySchema>;

