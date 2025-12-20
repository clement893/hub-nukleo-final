"use server";

import {
  getTasksByDepartment,
  moveTaskToZone,
  assignTaskToUser,
  getEmployeeActiveTasks,
  getEmployeesByDepartment,
  assignTaskToDepartment,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import type { Department, TaskZone } from "@prisma/client";

// ==================== OPERATIONS ACTIONS ====================

export async function getTasksByDepartmentAction(department: Department) {
  try {
    const tasks = await getTasksByDepartment(department);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    logger.error("Error fetching tasks by department", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function moveTaskToZoneAction(
  taskId: string,
  zone: TaskZone,
  userId?: string
) {
  try {
    const currentUserId = userId || await getCurrentUserId();
    const task = await moveTaskToZone(taskId, zone, currentUserId);
    
    // Log activity si nécessaire
    // TODO: Ajouter log d'activité
    
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error moving task to zone", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to move task" };
  }
}

export async function assignTaskToUserAction(taskId: string, userId: string) {
  try {
    const task = await assignTaskToUser(taskId, userId);
    
    // Log activity
    // TODO: Ajouter log d'activité
    
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error assigning task to user", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to assign task" };
  }
}

export async function getEmployeeActiveTasksAction(userId?: string) {
  try {
    const currentUserId = userId || await getCurrentUserId();
    const tasks = await getEmployeeActiveTasks(currentUserId);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    logger.error("Error fetching employee active tasks", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch active tasks" };
  }
}

export async function getEmployeesByDepartmentAction(department: Department) {
  try {
    const employees = await getEmployeesByDepartment(department);
    return {
      success: true,
      data: employees,
    };
  } catch (error) {
    logger.error("Error fetching employees by department", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch employees" };
  }
}

export async function assignTaskToDepartmentAction(taskId: string, department: Department) {
  try {
    const task = await assignTaskToDepartment(taskId, department);
    
    // Log activity
    // TODO: Ajouter log d'activité
    
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error assigning task to department", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to assign task to department" };
  }
}

