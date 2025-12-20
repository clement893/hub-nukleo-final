"use server";

import { prisma } from "@nukleo/db";
import { requireAuth } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";

// Helper pour vérifier les permissions
async function checkPermission(userId: string, permission: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { customRole: true },
  });

  if (!user) return false;

  // Vérifier le rôle enum (ADMIN et MANAGER ont tous les droits)
  if (user.role === "ADMIN" || user.role === "MANAGER") {
    return true;
  }

  // Si l'utilisateur a un rôle personnalisé avec permissions
  if (user.customRole?.permissions) {
    const permissions = user.customRole.permissions as string[];
    if (permissions.includes(permission) || permissions.includes("admin:access")) {
      return true;
    }
  }

  return false;
}

// Users
export async function getUsersAction() {
  try {
    const auth = await requireAuth();
    
    // Vérifier permission "users:read"
    const hasPermission = await checkPermission(auth.user.id, "users:read");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const users = await prisma.user.findMany({
      include: {
        customRole: true,
        _count: {
          select: {
            auditLogs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: users };
  } catch (error) {
    logger.error("Error fetching users", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des utilisateurs" };
  }
}

export async function updateUserAction(
  userId: string,
  data: {
    isActive?: boolean;
    roleId?: string | null;
  }
) {
  try {
    const auth = await requireAuth();
    
    // Vérifier permission "users:write"
    const hasPermission = await checkPermission(auth.user.id, "users:write");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        customRole: true,
      },
    });

    // Créer audit log
    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "UPDATE",
        entity: "User",
        entityId: userId,
        changes: data,
      },
    });

    revalidatePath("/admin/users");
    return { success: true, data: user };
  } catch (error) {
    logger.error("Error updating user", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la mise à jour de l'utilisateur" };
  }
}

// Roles
export async function getRolesAction() {
  try {
    const auth = await requireAuth();
    
    const hasPermission = await checkPermission(auth.user.id, "admin:roles");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const roles = await prisma.roleModel.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: roles };
  } catch (error) {
    logger.error("Error fetching roles", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des rôles" };
  }
}

export async function createRoleAction(data: {
  name: string;
  description?: string;
  permissions: string[];
}) {
  try {
    const auth = await requireAuth();
    
    const hasPermission = await checkPermission(auth.user.id, "admin:roles");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const role = await prisma.roleModel.create({
      data: {
        name: data.name,
        description: data.description || null,
        permissions: data.permissions,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "CREATE",
        entity: "Role",
        entityId: role.id,
      },
    });

    revalidatePath("/admin/roles");
    return { success: true, data: role };
  } catch (error) {
    logger.error("Error creating role", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la création du rôle" };
  }
}

export async function updateRoleAction(
  roleId: string,
  data: {
    name?: string;
    description?: string;
    permissions?: string[];
  }
) {
  try {
    const auth = await requireAuth();
    
    const hasPermission = await checkPermission(auth.user.id, "admin:roles");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const role = await prisma.roleModel.update({
      where: { id: roleId },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "UPDATE",
        entity: "Role",
        entityId: roleId,
        changes: data,
      },
    });

    revalidatePath("/admin/roles");
    return { success: true, data: role };
  } catch (error) {
    logger.error("Error updating role", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la mise à jour du rôle" };
  }
}

export async function deleteRoleAction(roleId: string) {
  try {
    const auth = await requireAuth();
    
    const hasPermission = await checkPermission(auth.user.id, "admin:roles");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    await prisma.roleModel.delete({
      where: { id: roleId },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        action: "DELETE",
        entity: "Role",
        entityId: roleId,
      },
    });

    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) {
    logger.error("Error deleting role", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la suppression du rôle" };
  }
}

// Audit Logs
export async function getAuditLogsAction(filters?: {
  userId?: string;
  entity?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
}) {
  try {
    const auth = await requireAuth();
    
    const hasPermission = await checkPermission(auth.user.id, "admin:audit");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const where: any = {};
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.entity) where.entity = filters.entity;
    if (filters?.action) where.action = filters.action;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return { success: true, data: logs };
  } catch (error) {
    logger.error("Error fetching audit logs", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des logs" };
  }
}

// System Stats
export async function getSystemStatsAction() {
  try {
    const auth = await requireAuth();
    
    const hasPermission = await checkPermission(auth.user.id, "admin:access");
    if (!hasPermission) {
      return { success: false, error: "Permission refusée" };
    }

    const [totalUsers, activeUsers, totalRoles, recentLogins] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.roleModel.count(),
      prisma.auditLog.count({
        where: {
          action: "LOGIN",
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24h
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalRoles,
        recentLogins,
      },
    };
  } catch (error) {
    logger.error("Error fetching system stats", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

