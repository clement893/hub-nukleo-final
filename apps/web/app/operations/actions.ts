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
  getTimeEntryById,
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
  createProjectNote,
  updateProjectNote,
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
  updateProjectNoteSchema,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { ActivityType } from "@prisma/client";

// ==================== PROJECT ACTIONS ====================

export async function getProjectsAction() {
  try {
    const userId = await getCurrentUserId();
    const projects = await getAllProjects(userId);
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

export async function createProjectAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();
    // Transform date strings to Date objects if needed
    const transformedData = data as Record<string, any>;
    if (transformedData.startDate && typeof transformedData.startDate === "string") {
      transformedData.startDate = new Date(transformedData.startDate);
    }
    if (transformedData.endDate && typeof transformedData.endDate === "string") {
      transformedData.endDate = new Date(transformedData.endDate);
    }
    const validatedData = projectSchema.parse(transformedData);
    const project = await createProject(validatedData, userId);
    
    // Log activity
    await logProjectActivity(
      project.id,
      userId,
      ActivityType.CREATED,
      `Projet "${project.name}" créé`
    );
    
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

export async function updateProjectAction(id: string, data: unknown) {
  try {
    const userId = await getCurrentUserId();
    const projectBefore = await getProjectById(id);
    // Transform date strings to Date objects if needed
    const transformedData = data as Record<string, any>;
    if (transformedData.startDate && typeof transformedData.startDate === "string") {
      transformedData.startDate = new Date(transformedData.startDate);
    }
    if (transformedData.endDate && typeof transformedData.endDate === "string") {
      transformedData.endDate = new Date(transformedData.endDate);
    }
    const validatedData = updateProjectSchema.parse({ ...transformedData, id });
    const project = await updateProject(id, validatedData);
    
    // Log activity
    if (projectBefore && projectBefore.status !== project.status) {
      await logProjectActivity(
        id,
        userId,
        ActivityType.STATUS_CHANGED,
        `Statut changé de "${projectBefore.status}" à "${project.status}"`,
        { oldStatus: projectBefore.status, newStatus: project.status }
      );
    } else {
      await logProjectActivity(
        id,
        userId,
        ActivityType.UPDATED,
        `Projet "${project.name}" modifié`
      );
    }
    
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
    const project = await getProjectById(id);
    if (!project) {
      return { success: false, error: "Project not found" };
    }
    
    await deleteProject(id);
    
    // Note: Activity log will be deleted with cascade, so we don't log deletion
    
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting project", error instanceof Error ? error : new Error(String(error)));
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

export async function createTaskAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();
    const validatedData = taskSchema.parse(data);
    const task = await createTask(validatedData);
    
    // Log activity
    await logProjectActivity(
      validatedData.projectId,
      userId,
      ActivityType.TASK_ADDED,
      `Tâche "${task.title}" ajoutée`,
      { taskId: task.id }
    );
    
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

export async function updateTaskAction(id: string, data: unknown) {
  try {
    const validatedData = updateTaskSchema.parse({ ...(data as Record<string, unknown>), id });
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
    await deleteTask(id);
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting task", error instanceof Error ? error : new Error(String(error)));
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

export async function getTimeEntryAction(id: string) {
  try {
    const timeEntry = await getTimeEntryById(id);
    if (!timeEntry) {
      return { success: false, error: "Time entry not found" };
    }
    return {
      success: true,
      data: timeEntry,
    };
  } catch (error) {
    logger.error("Error fetching time entry", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch time entry" };
  }
}

export async function createTimeEntryAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();
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

export async function updateTimeEntryAction(id: string, data: unknown) {
  try {
    const validatedData = updateTimeEntrySchema.parse({ ...(data as Record<string, unknown>), id });
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

export async function createMilestoneAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();
    const validatedData = milestoneSchema.parse(data);
    const milestone = await createMilestone(validatedData);
    
    // Log activity
    await logProjectActivity(
      validatedData.projectId,
      userId,
      ActivityType.MILESTONE_ADDED,
      `Milestone "${validatedData.title}" ajouté`,
      { milestoneId: milestone.id }
    );
    
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

export async function updateMilestoneAction(id: string, data: unknown) {
  try {
    const userId = await getCurrentUserId();
    const validatedData = updateMilestoneSchema.parse({ ...(data as Record<string, unknown>), id });
    const milestone = await getMilestoneById(id);
    if (!milestone) {
      return { success: false, error: "Milestone not found" };
    }
    
    const updatedMilestone = await updateMilestone(id, validatedData);
    
    // Log activity
    if (validatedData.status === "COMPLETED" && milestone.status !== "COMPLETED") {
      await logProjectActivity(
        milestone.projectId,
        userId,
        ActivityType.MILESTONE_COMPLETED,
        `Milestone "${milestone.title}" complété`,
        { milestoneId: milestone.id }
      );
    }
    
    return {
      success: true,
      data: updatedMilestone,
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
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting milestone", error instanceof Error ? error : new Error(String(error)));
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

export async function createProjectNoteAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();
    const validatedData = projectNoteSchema.parse(data);
    const note = await createProjectNote(validatedData, userId);
    
    // Log activity
    await logProjectActivity(
      validatedData.projectId,
      userId,
      ActivityType.NOTE_ADDED,
      "Note ajoutée",
      { noteId: note.id }
    );
    
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

export async function updateProjectNoteAction(id: string, data: unknown) {
  try {
    const validatedData = updateProjectNoteSchema.parse({ ...(data as Record<string, unknown>), id });
    const note = await updateProjectNote(id, validatedData);
    return {
      success: true,
      data: note,
    };
  } catch (error) {
    logger.error("Error updating project note", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update project note" };
  }
}

export async function deleteProjectNoteAction(id: string) {
  try {
    await deleteProjectNote(id);
    return {
      success: true,
    };
  } catch (error) {
    logger.error("Error deleting project note", error instanceof Error ? error : new Error(String(error)));
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

