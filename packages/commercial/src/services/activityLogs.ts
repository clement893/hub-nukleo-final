import { prisma } from "@nukleo/db";
import type { ActivityType } from "@prisma/client";

export interface CreateActivityLogData {
  type: ActivityType;
  description?: string;
  metadata?: Record<string, any>;
  projectId: string;
  userId: string;
}

export async function getAllActivityLogs(projectId: string) {
  return prisma.activityLog.findMany({
    where: { projectId },
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
  });
}

export async function createActivityLog(data: CreateActivityLogData) {
  return prisma.activityLog.create({
    data: {
      type: data.type,
      description: data.description || null,
      metadata: data.metadata || null,
      projectId: data.projectId,
      userId: data.userId,
    },
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
  });
}

export async function logProjectActivity(
  projectId: string,
  userId: string,
  type: ActivityType,
  description?: string,
  metadata?: Record<string, any>
) {
  return createActivityLog({
    type,
    description,
    metadata,
    projectId,
    userId,
  });
}

