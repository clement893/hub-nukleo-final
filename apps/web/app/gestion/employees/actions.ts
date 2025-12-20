"use server";

import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  employeeSchema,
  updateEmployeeSchema,
} from "@nukleo/gestion";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function getEmployeesAction() {
  try {
    const employees = await getAllEmployees();
    logger.info(`Fetched ${employees.length} employees`);
    return {
      success: true,
      data: employees,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error("Error fetching employees", error instanceof Error ? error : new Error(String(error)));
    return { 
      success: false, 
      error: `Failed to fetch employees: ${errorMessage}` 
    };
  }
}

export async function getEmployeeAction(id: string) {
  try {
    const employee = await getEmployeeById(id);
    if (!employee) {
      return { success: false, error: "Employee not found" };
    }
    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    logger.error("Error fetching employee", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch employee" };
  }
}

export async function createEmployeeAction(data: unknown) {
  try {
    const validatedData = employeeSchema.parse(data);
    const employee = await createEmployee(validatedData);
    revalidatePath("/gestion/employees");
    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    logger.error("Error creating employee", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create employee" };
  }
}

export async function updateEmployeeAction(id: string, data: unknown) {
  try {
    const validatedData = updateEmployeeSchema.parse({ ...(data as Record<string, unknown>), id });
    const employee = await updateEmployee(id, validatedData);
    revalidatePath("/gestion/employees");
    return {
      success: true,
      data: employee,
    };
  } catch (error) {
    logger.error("Error updating employee", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update employee" };
  }
}

export async function deleteEmployeeAction(id: string) {
  try {
    await deleteEmployee(id);
    revalidatePath("/gestion/employees");
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting employee", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to delete employee" };
  }
}

