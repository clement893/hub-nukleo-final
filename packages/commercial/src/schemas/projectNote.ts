import { z } from "zod";

export const projectNoteSchema = z.object({
  content: z.string().min(1, "Le contenu est requis"),
  projectId: z.string().min(1, "L'ID du projet est requis"),
});

export const updateProjectNoteSchema = projectNoteSchema.partial().extend({
  id: z.string().min(1, "L'ID est requis"),
});

export type ProjectNoteFormData = z.infer<typeof projectNoteSchema>;
export type UpdateProjectNoteData = z.infer<typeof updateProjectNoteSchema>;

