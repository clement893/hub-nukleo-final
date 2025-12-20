"use server";

import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getAllTimeEntries,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  getAllUsers,
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getAllProjectNotes,
  getProjectNoteById,
  createProjectNote,
  deleteProjectNote,
  getAllActivityLogs,
  logProjectActivity,
  projectSchema,
  updateProjectSchema,
  taskSchema,
  updateTaskSchema,
  timeEntrySchema,
  updateTimeEntrySchema,
  milestoneSchema,
  updateMilestoneSchema,
  projectNoteSchema,
  getTasksByDepartment,
  moveTaskToZone,
  getEmployeesByDepartment,
  assignTaskToDepartment,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { ActivityType } from "@prisma/client";
import type { Department, TaskZone } from "@prisma/client";

// ==================== PROJECT ACTIONS ====================

export async function getProjectsAction() {
  try {
    const projects = await getAllProjects();
    return {
      success: true,
      data: projects,
    };
  } catch (error) {
    logger.error("Error fetching projects", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getProjectAction(id: string) {
  try {
    const project = await getProjectById(id);
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    logger.error("Error fetching project", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function createProjectAction(data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = projectSchema.parse(data);
    const project = await createProject(validatedData, userId);
    
    await logProjectActivity(project.id, userId, ActivityType.CREATED, `Project "${project.name}" created`);
    
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    logger.error("Error creating project", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProjectAction(id: string, data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = updateProjectSchema.parse({ ...data, id });
    const project = await updateProject(id, validatedData);
    
    await logProjectActivity(project.id, userId, ActivityType.UPDATED, `Project "${project.name}" updated`);
    
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    logger.error("Error updating project", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const project = await getProjectById(id);
    if (project) {
      await logProjectActivity(id, userId, ActivityType.DELETED, `Project "${project.name}" deleted`);
    }
    
    await deleteProject(id);
    
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting project", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete project" };
  }
}

// ==================== TASK ACTIONS ====================

export async function getTasksAction(projectId: string) {
  try {
    const tasks = await getAllTasks(projectId);
    return {
      success: true,
      data: tasks,
    };
  } catch (error) {
    logger.error("Error fetching tasks", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch tasks" };
  }
}

export async function getTaskAction(id: string) {
  try {
    const task = await getTaskById(id);
    if (!task) {
      return { success: false, error: "Task not found" };
    }
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error fetching task", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch task" };
  }
}

export async function createTaskAction(data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = taskSchema.parse(data);
    const task = await createTask(validatedData);
    
    const project = await getProjectById(task.projectId);
    if (project) {
      await logProjectActivity(project.id, userId, ActivityType.TASK_ADDED, `Task "${task.title}" added`);
    }
    
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error creating task", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(id: string, data: any) {
  try {
    const validatedData = updateTaskSchema.parse({ ...data, id });
    const task = await updateTask(id, validatedData);
    
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    logger.error("Error updating task", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTaskAction(id: string) {
  try {
    const task = await getTaskById(id);
    if (!task) {
      return { success: false, error: "Task not found" };
    }
    
    await deleteTask(id);
    
    const project = await getProjectById(task.projectId);
    const userId = await getCurrentUserId();
    if (project && userId) {
      await logProjectActivity(project.id, userId, ActivityType.DELETED, `Task "${task.title}" deleted`);
    }
    
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting task", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete task" };
  }
}

// ==================== TIME ENTRY ACTIONS ====================

export async function getTimeEntriesAction(taskId: string) {
  try {
    const timeEntries = await getAllTimeEntries(taskId);
    return {
      success: true,
      data: timeEntries,
    };
  } catch (error) {
    logger.error("Error fetching time entries", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch time entries" };
  }
}

export async function createTimeEntryAction(data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = timeEntrySchema.parse(data);
    const timeEntry = await createTimeEntry(validatedData, userId);
    
    return {
      success: true,
      data: timeEntry,
    };
  } catch (error) {
    logger.error("Error creating time entry", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create time entry" };
  }
}

export async function updateTimeEntryAction(id: string, data: any) {
  try {
    const validatedData = updateTimeEntrySchema.parse({ ...data, id });
    const timeEntry = await updateTimeEntry(id, validatedData);
    
    return {
      success: true,
      data: timeEntry,
    };
  } catch (error) {
    logger.error("Error updating time entry", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update time entry" };
  }
}

export async function deleteTimeEntryAction(id: string) {
  try {
    await deleteTimeEntry(id);
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting time entry", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete time entry" };
  }
}

// ==================== USER ACTIONS ====================

export async function getUsersAction() {
  try {
    const users = await getAllUsers();
    return {
      success: true,
      data: users,
    };
  } catch (error) {
    logger.error("Error fetching users", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch users" };
  }
}

// ==================== MILESTONE ACTIONS ====================

export async function getMilestonesAction(projectId: string) {
  try {
    const milestones = await getAllMilestones(projectId);
    return {
      success: true,
      data: milestones,
    };
  } catch (error) {
    logger.error("Error fetching milestones", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch milestones" };
  }
}

export async function createMilestoneAction(data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = milestoneSchema.parse(data);
    const milestone = await createMilestone(validatedData);
    
    await logProjectActivity(milestone.projectId, userId, ActivityType.MILESTONE_ADDED, `Milestone "${milestone.title}" added`);
    
    return {
      success: true,
      data: milestone,
    };
  } catch (error) {
    logger.error("Error creating milestone", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create milestone" };
  }
}

export async function updateMilestoneAction(id: string, data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = updateMilestoneSchema.parse({ ...data, id });
    const milestone = await updateMilestone(id, validatedData);
    
    if (milestone.status === "COMPLETED") {
      await logProjectActivity(milestone.projectId, userId, ActivityType.MILESTONE_COMPLETED, `Milestone "${milestone.title}" completed`);
    }
    
    return {
      success: true,
      data: milestone,
    };
  } catch (error) {
    logger.error("Error updating milestone", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update milestone" };
  }
}

export async function deleteMilestoneAction(id: string) {
  try {
    const milestone = await getMilestoneById(id);
    if (!milestone) {
      return { success: false, error: "Milestone not found" };
    }
    
    await deleteMilestone(id);
    
    const userId = await getCurrentUserId();
    if (userId) {
      await logProjectActivity(milestone.projectId, userId, ActivityType.DELETED, `Milestone "${milestone.title}" deleted`);
    }
    
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting milestone", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete milestone" };
  }
}

// ==================== PROJECT NOTE ACTIONS ====================

export async function getProjectNotesAction(projectId: string) {
  try {
    const notes = await getAllProjectNotes(projectId);
    return {
      success: true,
      data: notes,
    };
  } catch (error) {
    logger.error("Error fetching project notes", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch project notes" };
  }
}

export async function createProjectNoteAction(data: any) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const validatedData = projectNoteSchema.parse(data);
    const note = await createProjectNote(validatedData, userId);
    
    await logProjectActivity(note.projectId, userId, ActivityType.NOTE_ADDED, `Note added to project`);
    
    return {
      success: true,
      data: note,
    };
  } catch (error) {
    logger.error("Error creating project note", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create project note" };
  }
}

export async function deleteProjectNoteAction(id: string) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const note = await getProjectNoteById(id);
    if (!note) {
      return { success: false, error: "Note not found" };
    }
    
    await deleteProjectNote(id);
    
    await logProjectActivity(note.projectId, userId, ActivityType.DELETED, `Note deleted from project`);
    
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting project note", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete project note" };
  }
}

// ==================== ACTIVITY LOG ACTIONS ====================

export async function getActivityLogsAction(projectId: string) {
  try {
    const logs = await getAllActivityLogs(projectId);
    return {
      success: true,
      data: logs,
    };
  } catch (error) {
    logger.error("Error fetching activity logs", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch activity logs" };
  }
}

// ==================== OPERATIONS KANBAN ACTIONS ====================

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
