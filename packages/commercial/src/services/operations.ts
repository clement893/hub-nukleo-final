import { prisma } from "@nukleo/db";
import type { Department, TaskZone } from "@prisma/client";

/**
 * Récupère toutes les tâches d'un département, groupées par zone
 */
export async function getTasksByDepartment(department: Department) {
  const tasks = await prisma.task.findMany({
    where: {
      department,
    },
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
          image: true,
        },
      },
    },
    orderBy: [
      { priority: "desc" }, // Urgent en premier
      { dueDate: "asc" }, // Puis par date d'échéance
      { createdAt: "asc" }, // Puis par date de création
    ],
  });

  // Grouper par zone
  const groupedByZone: Record<TaskZone, typeof tasks> = {
    SHELF: [],
    STORAGE: [],
    DOCK: [],
    ACTIVE: [],
  };

  tasks.forEach((task) => {
    const zone = task.zone || "SHELF";
    if (zone in groupedByZone) {
      groupedByZone[zone as TaskZone].push(task);
    }
  });

  return groupedByZone;
}

/**
 * Déplace une tâche vers une nouvelle zone
 * Si zone = ACTIVE, assigne la tâche à userId
 */
export async function moveTaskToZone(
  taskId: string,
  zone: TaskZone,
  userId?: string
) {
  const updateData: any = {
    zone,
  };

  // Si la tâche passe en ACTIVE, elle doit être assignée
  if (zone === "ACTIVE") {
    if (!userId) {
      throw new Error("Une tâche ne peut être en ACTIVE que si elle est assignée à un employé");
    }

    // Vérifier que l'employé n'a pas déjà une tâche en ACTIVE
    const activeTasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        zone: "ACTIVE",
        id: { not: taskId },
      },
    });

    if (activeTasks.length > 0) {
      throw new Error("Un employé ne peut avoir qu'une seule tâche en ACTIVE à la fois");
    }

    updateData.assigneeId = userId;
  }

  // Si la tâche quitte ACTIVE, on peut garder l'assignation mais ce n'est pas obligatoire
  // (on garde l'assignation pour l'historique)

  return prisma.task.update({
    where: { id: taskId },
    data: updateData,
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
          image: true,
        },
      },
    },
  });
}

/**
 * Assigne une tâche à un employé
 */
export async function assignTaskToUser(taskId: string, userId: string) {
  // Vérifier que l'employé appartient au même département que la tâche
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { department: true },
  });

  if (!task) {
    throw new Error("Tâche non trouvée");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { operationsDepartment: true },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  if (task.department && user.operationsDepartment !== task.department) {
    throw new Error("L'employé doit appartenir au même département que la tâche");
  }

  // Si la tâche passe en ACTIVE, vérifier qu'il n'a pas déjà une tâche active
  const currentTask = await prisma.task.findUnique({
    where: { id: taskId },
    select: { zone: true },
  });

  if (currentTask?.zone === "ACTIVE") {
    const activeTasks = await prisma.task.findMany({
      where: {
        assigneeId: userId,
        zone: "ACTIVE",
        id: { not: taskId },
      },
    });

    if (activeTasks.length > 0) {
      throw new Error("Un employé ne peut avoir qu'une seule tâche en ACTIVE à la fois");
    }
  }

  return prisma.task.update({
    where: { id: taskId },
    data: { assigneeId: userId },
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
          image: true,
        },
      },
    },
  });
}

/**
 * Récupère les tâches actives d'un employé
 */
export async function getEmployeeActiveTasks(userId: string) {
  return prisma.task.findMany({
    where: {
      assigneeId: userId,
      zone: "ACTIVE",
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
}

/**
 * Récupère tous les employés d'un département
 */
export async function getEmployeesByDepartment(department: Department) {
  return prisma.user.findMany({
    where: {
      operationsDepartment: department,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      operationsDepartment: true,
    },
    orderBy: [
      { lastName: "asc" },
      { firstName: "asc" },
      { name: "asc" },
    ],
  });
}

/**
 * Assigne une tâche à un département (et la place dans SHELF)
 */
export async function assignTaskToDepartment(taskId: string, department: Department) {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      department,
      zone: "SHELF", // Nouvelle tâche → Shelf
      assigneeId: null, // Pas encore assignée
    },
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
          image: true,
        },
      },
    },
  });
}

