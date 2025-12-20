import { z } from "zod";

export const employeeSchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().optional(), // Nom complet (pour compatibilité)
  firstName: z.string().optional(), // Prénom
  lastName: z.string().optional(), // Nom de famille
  linkedin: z.string().url().optional().or(z.literal("")), // LinkedIn URL
  department: z.string().optional(), // Département
  birthday: z.string().optional(), // Anniversaire (format ISO date)
  hireDate: z.string().optional(), // Anniversaire embauche (format ISO date)
  role: z.enum(["ADMIN", "MANAGER", "USER"], {
    errorMap: () => ({ message: "Rôle invalide" }),
  }),
  image: z.string().url().optional().or(z.literal("")), // Photo URL
});

export const updateEmployeeSchema = employeeSchema.partial().extend({
  id: z.string().min(1, "ID requis"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
export type UpdateEmployeeData = z.infer<typeof updateEmployeeSchema>;

