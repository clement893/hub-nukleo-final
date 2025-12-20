"use server";
import { prisma } from "@nukleo/db";
import type { Department } from "@prisma/client";

// Récupère tous les employés
export async function getEmployeesAction() {
  try {
    const employees = await prisma.user.findMany({
      where: {
        firstName: { not: null },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        department: true,
        operationsDepartment: true,
        linkedin: true,
        photoKey: true,
        photoUrl: true,
        birthday: true,
        hireDate: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });
    return { success: true, data: employees };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return {
      success: false,
      error: "Impossible de charger les employés",
    };
  }
}

// Met à jour le département d'un employé
export async function updateEmployeeDepartmentAction(
  employeeId: string,
  department: Department
) {
  try {
    await prisma.user.update({
      where: { id: employeeId },
      data: {
        operationsDepartment: department,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating employee department:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le département",
    };
  }
}

