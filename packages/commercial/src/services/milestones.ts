import { prisma } from "@nukleo/db";
import type { MilestoneFormData, UpdateMilestoneData } from "../schemas/milestone";

export async function getAllMilestones(projectId: string) {
  return prisma.milestone.findMany({
    where: { projectId },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });
}

export async function getMilestoneById(id: string) {
  return prisma.milestone.findUnique({
    where: { id },
  });
}

export async function createMilestone(data: MilestoneFormData) {
  return prisma.milestone.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status || "PLANNED",
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      projectId: data.projectId,
    },
  });
}

export async function updateMilestone(id: string, data: UpdateMilestoneData) {
  const updateData: any = {};
  
  if (data.title) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.status) updateData.status = data.status;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  
  // Si le statut passe à COMPLETED, définir completedAt
  if (data.status === "COMPLETED") {
    updateData.completedAt = new Date();
  } else if (data.status && data.status !== "COMPLETED") {
    updateData.completedAt = null;
  }

  return prisma.milestone.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteMilestone(id: string) {
  return prisma.milestone.delete({
    where: { id },
  });
}

