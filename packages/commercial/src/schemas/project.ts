import { z } from "zod";
import { ProjectStatus, ProjectType, TaskStatus, TaskPriority } from "@prisma/client";

export const projectSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).default("PLANNING"),
  type: z.nativeEnum(ProjectType).optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  budget: z.number().positive().optional().nullable(),
  department: z.string().optional().nullable(),
  links: z.record(z.string()).optional().nullable(), // JSON object with string keys and values
  companyId: z.string().optional().nullable(),
  leadId: z.string().optional().nullable(),
});

export const updateProjectSchema = projectSchema.extend({
  id: z.string(),
});

import { Department, TaskZone } from "@prisma/client";

export const taskSchema = z.object({
  title: z.string().min(1, "Le titre de la tâche est requis"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).default("TODO"),
  priority: z.nativeEnum(TaskPriority).default("MEDIUM"),
  dueDate: z.date().optional().nullable(),
  projectId: z.string(),
  assigneeId: z.string().optional().nullable(),
  department: z.nativeEnum(Department).optional().nullable(),
  zone: z.nativeEnum(TaskZone).optional().nullable(),
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

