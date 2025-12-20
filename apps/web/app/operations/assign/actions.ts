"use server";

import { prisma } from "@nukleo/db";
import type { Department } from "@prisma/client";
import { logger } from "@/lib/logger";

// Récupère toutes les tâches non assignées
export async function getUnassignedTasksAction() {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        department: null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { priority: "desc" },
        { dueDate: "asc" },
      ],
    });
    return { success: true, data: tasks };
  } catch (error) {
    logger.error("Error fetching unassigned tasks", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les tâches non assignées",
    };
  }
}

// Assigne plusieurs tâches à un département
export async function assignMultipleTasksAction(
  taskIds: string[],
  department: Department
) {
  try {
    await prisma.task.updateMany({
      where: {
        id: {
          in: taskIds,
        },
      },
      data: {
        department,
        zone: "SHELF", // Placer dans SHELF par défaut
      },
    });
    return { success: true };
  } catch (error) {
    logger.error("Error assigning multiple tasks", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible d'assigner les tâches",
    };
  }
}

