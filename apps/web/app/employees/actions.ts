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

// Récupère un employé par ID
export async function getEmployeeByIdAction(employeeId: string) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
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
        title: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!employee) {
      return {
        success: false,
        error: "Employé non trouvé",
      };
    }

    // Mapper l'employé pour inclure operationsDepartment
    const departmentValues: Department[] = ["BUREAU", "LAB", "STUDIO"];
    const mappedEmployee = {
      ...employee,
      firstName: employee.firstName || (employee.name ? employee.name.split(" ")[0] || null : null),
      lastName: employee.lastName || (employee.name ? employee.name.split(" ").slice(1).join(" ") || null : null),
      operationsDepartment: (employee.department && departmentValues.indexOf(employee.department as Department) !== -1) 
        ? (employee.department as Department) 
        : null,
      photoKey: null,
      photoUrl: employee.image || null,
    };

    return { success: true, data: mappedEmployee };
  } catch (error) {
    console.error("Error fetching employee:", error);
    return {
      success: false,
      error: "Impossible de charger l'employé",
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

