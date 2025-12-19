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
  projectSchema,
  updateProjectSchema,
  taskSchema,
  updateTaskSchema,
  timeEntrySchema,
  updateTimeEntrySchema,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth";

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
    console.error("Error fetching projects:", error);
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
    console.error("Error fetching project:", error);
    return { success: false, error: "Failed to fetch project" };
  }
}

export async function createProjectAction(data: unknown) {
  try {
    const userId = await getCurrentUserId();
    const validatedData = projectSchema.parse(data);
    const project = await createProject(validatedData, userId);
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("Error creating project:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProjectAction(id: string, data: unknown) {
  try {
    const validatedData = updateProjectSchema.parse({ ...data, id });
    const project = await updateProject(id, validatedData);
    return {
      success: true,
      data: project,
    };
  } catch (error) {
    console.error("Error updating project:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    await deleteProject(id);
    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting project:", error);
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
    console.error("Error fetching tasks:", error);
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
    console.error("Error fetching task:", error);
    return { success: false, error: "Failed to fetch task" };
  }
}

export async function createTaskAction(data: unknown) {
  try {
    const validatedData = taskSchema.parse(data);
    const task = await createTask(validatedData);
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(id: string, data: unknown) {
  try {
    const validatedData = updateTaskSchema.parse({ ...data, id });
    const task = await updateTask(id, validatedData);
    return {
      success: true,
      data: task,
    };
  } catch (error) {
    console.error("Error updating task:", error);
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
    console.error("Error deleting task:", error);
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
    console.error("Error fetching time entries:", error);
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
    console.error("Error fetching time entry:", error);
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
    console.error("Error creating time entry:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create time entry" };
  }
}

export async function updateTimeEntryAction(id: string, data: unknown) {
  try {
    const validatedData = updateTimeEntrySchema.parse({ ...data, id });
    const timeEntry = await updateTimeEntry(id, validatedData);
    return {
      success: true,
      data: timeEntry,
    };
  } catch (error) {
    console.error("Error updating time entry:", error);
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
    console.error("Error deleting time entry:", error);
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
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

