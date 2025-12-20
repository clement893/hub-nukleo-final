import { z } from "zod";

export const teamMemberCreateSchema = z.object({
  userId: z.string().min(1, "L'utilisateur est requis"),
  projectId: z.string().min(1, "Le projet est requis"),
  role: z.enum(["manager", "member", "viewer"]),
});

export const teamMemberUpdateSchema = z.object({
  role: z.enum(["manager", "member", "viewer"]),
});

export type TeamMemberCreateInput = z.infer<typeof teamMemberCreateSchema>;
export type TeamMemberUpdateInput = z.infer<typeof teamMemberUpdateSchema>;
