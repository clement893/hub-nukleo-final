import { prisma } from "@nukleo/db";
import type {
  ProjectFormData,
  UpdateProjectData,
  TaskFormData,
  UpdateTaskData,
  TimeEntryFormData,
  UpdateTimeEntryData,
} from "../schemas/project";

// ==================== USERS ====================

export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

// ==================== PROJECTS ====================

export async function getAllProjects(userId?: string) {
  return prisma.project.findMany({
    where: userId
      ? {
          managerId: userId,
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      company: true,
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tasks: {
        orderBy: [
          { status: "asc" },
          { priority: "desc" },
          { dueDate: "asc" },
        ],
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          timeEntries: {
            select: {
              hours: true,
            },
          },
        },
      },
    },
  });
}

export async function createProject(data: ProjectFormData, managerId: string) {
  return prisma.project.create({
    data: {
      name: data.name,
      description: data.description || null,
      status: data.status,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      budget: data.budget || null,
      companyId: data.companyId || null,
      managerId,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updateProject(id: string, data: UpdateProjectData) {
  return prisma.project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || null,
      status: data.status,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      budget: data.budget || null,
      companyId: data.companyId || null,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      manager: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteProject(id: string) {
  return prisma.project.delete({
    where: { id },
  });
}

// ==================== TASKS ====================

export async function getAllTasks(projectId: string) {
  return prisma.task.findMany({
    where: { projectId },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { dueDate: "asc" },
    ],
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      timeEntries: {
        select: {
          hours: true,
        },
      },
    },
  });
}

export async function getTaskById(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      timeEntries: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });
}

export async function createTask(data: TaskFormData) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || null,
      projectId: data.projectId,
      assigneeId: data.assigneeId || null,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updateTask(id: string, data: UpdateTaskData) {
  return prisma.task.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || null,
      assigneeId: data.assigneeId || null,
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
  });
}

// ==================== TIME ENTRIES ====================

export async function getAllTimeEntries(taskId: string) {
  return prisma.timeEntry.findMany({
    where: { taskId },
    orderBy: { date: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function getTimeEntryById(id: string) {
  return prisma.timeEntry.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      task: {
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}

export async function createTimeEntry(data: TimeEntryFormData, userId: string) {
  return prisma.timeEntry.create({
    data: {
      date: data.date,
      hours: data.hours,
      description: data.description || null,
      taskId: data.taskId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function updateTimeEntry(id: string, data: UpdateTimeEntryData) {
  return prisma.timeEntry.update({
    where: { id },
    data: {
      date: data.date,
      hours: data.hours,
      description: data.description || null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

export async function deleteTimeEntry(id: string) {
  return prisma.timeEntry.delete({
    where: { id },
  });
}

