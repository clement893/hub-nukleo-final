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

export async function getAllProjects(_userId?: string) {
  // Return all projects, even if managerId is invalid or points to non-existent user
  // This ensures projects imported by Manus are visible
  // The manager relation will be null if managerId is invalid, but the project will still be returned
  // Note: userId parameter is kept for API compatibility but not used for filtering
  return prisma.project.findMany({
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
      lead: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
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
          milestones: true,
          notes: true,
        },
      },
    },
    // Note: Removed userId filter to show all projects including those imported by Manus
    // Projects with invalid managerId will have manager: null but will still be visible
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
      lead: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
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
      milestones: {
        orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
      },
      notes: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10, // Dernières 10 notes
      },
      activityLogs: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 20, // Derniers 20 logs
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
      type: data.type || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      budget: data.budget || null,
      department: data.department || null,
      links: data.links || null,
      companyId: data.companyId || null,
      leadId: data.leadId || null,
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
      lead: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function updateProject(id: string, data: UpdateProjectData) {
  const updateData: any = {
    name: data.name,
    description: data.description !== undefined ? (data.description || null) : undefined,
    status: data.status,
    startDate: data.startDate !== undefined ? (data.startDate || null) : undefined,
    endDate: data.endDate !== undefined ? (data.endDate || null) : undefined,
    budget: data.budget !== undefined ? (data.budget || null) : undefined,
    companyId: data.companyId !== undefined ? (data.companyId || null) : undefined,
  };

  if (data.type !== undefined) updateData.type = data.type || null;
  if (data.department !== undefined) updateData.department = data.department || null;
  if (data.links !== undefined) updateData.links = data.links || null;
  if (data.leadId !== undefined) updateData.leadId = data.leadId || null;

  return prisma.project.update({
    where: { id },
    data: updateData,
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
      lead: {
        select: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
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

