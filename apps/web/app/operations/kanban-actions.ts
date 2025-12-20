"use server";

import {
  getTasksByDepartment,
  moveTaskToZone,
  assignTaskToUser,
  getEmployeesByDepartment,
  assignTaskToDepartment,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import type { Department, TaskZone } from "@prisma/client";

// Récupère toutes les tâches d'un département, groupées par zone
export async function getTasksByDepartmentAction(department: Department) {
  try {
    const tasks = await getTasksByDepartment(department);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    logger.error("Error fetching tasks by department", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les tâches",
    };
  }
}

// Déplace une tâche vers une nouvelle zone
export async function moveTaskToZoneAction(
  taskId: string,
  zone: TaskZone,
  userId?: string
) {
  try {
    const currentUserId = userId || await getCurrentUserId();
    if (!currentUserId) {
      return {
        success: false,
        error: "Utilisateur non authentifié",
      };
    }

    const task = await moveTaskToZone(taskId, zone, currentUserId);
    
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error moving task to zone", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Impossible de déplacer la tâche",
    };
  }
}

// Assigne une tâche à un département
export async function assignTaskToDepartmentAction(
  taskId: string,
  department: Department
) {
  try {
    const task = await assignTaskToDepartment(taskId, department);
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error assigning task to department", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Impossible d'assigner la tâche",
    };
  }
}

// Récupère les employés d'un département
export async function getEmployeesByDepartmentAction(department: Department) {
  try {
    const employees = await getEmployeesByDepartment(department);
    return {
      success: true,
      data: employees,
    };
  } catch (error) {
    logger.error("Error fetching employees by department", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les employés",
    };
  }
}

// Récupère les statistiques d'un département
export async function getDepartmentStatsAction(department: Department) {
  try {
    const tasks = await getTasksByDepartment(department);
    
    const statsMap = {
      SHELF: tasks.SHELF.length,
      STORAGE: tasks.STORAGE.length,
      DOCK: tasks.DOCK.length,
      ACTIVE: tasks.ACTIVE.length,
    };

    return { success: true, data: statsMap };
  } catch (error) {
    logger.error("Error fetching department stats", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les statistiques",
    };
  }
}

