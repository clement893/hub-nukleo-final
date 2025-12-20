"use server";
import { prisma } from "@nukleo/db";
import type { Department } from "@prisma/client";

// Récupère tous les employés
export async function getEmployeesAction() {
  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        name: true,
        email: true,
        department: true,
        linkedin: true,
        image: true,
        birthday: true,
        hireDate: true,
      },
      orderBy: [
        { firstName: "asc" },
        { lastName: "asc" },
        { name: "asc" },
        { email: "asc" },
      ],
    });
    
    // Mapper les employés pour inclure operationsDepartment (convertir department String en Department enum)
    const departmentValues: Department[] = ["BUREAU", "LAB", "STUDIO"];
    const mappedEmployees = employees.map((emp) => ({
      ...emp,
      // Utiliser firstName/lastName si disponibles, sinon name
      firstName: emp.firstName || (emp.name ? emp.name.split(" ")[0] || null : null),
      lastName: emp.lastName || (emp.name ? emp.name.split(" ").slice(1).join(" ") || null : null),
      operationsDepartment: (emp.department && departmentValues.indexOf(emp.department as Department) !== -1) 
        ? (emp.department as Department) 
        : null,
      photoKey: null, // Employee n'a pas photoKey, utiliser image à la place
      photoUrl: emp.image || null,
    }));
    
    return { success: true, data: mappedEmployees };
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
    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        department: department, // Stocker comme String dans Employee
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

