"use server";

import { prisma } from "@nukleo/db";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Get all tenants
export async function getTenantsAction(filters?: {
  isActive?: boolean;
}) {
  await requireAuth();
  
  try {
    const where: any = {};
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        _count: {
          select: {
            users: true,
            companies: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: tenants };
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return {
      success: false,
      error: "Impossible de charger les tenants",
    };
  }
}

// Get single tenant
export async function getTenantAction(id: string) {
  await requireAuth();
  
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            companies: true,
            projects: true,
          },
        },
      },
    });

    if (!tenant) {
      return { success: false, error: "Tenant introuvable" };
    }

    return { success: true, data: tenant };
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return {
      success: false,
      error: "Impossible de charger le tenant",
    };
  }
}

// Create tenant
export async function createTenantAction(data: {
  name: string;
  slug: string;
  domain?: string;
  description?: string;
  logoUrl?: string;
  website?: string;
  email?: string;
  phone?: string;
  settings?: any;
}) {
  await requireAuth();
  
  try {
    // Vérifier que le slug est unique
    const existing = await prisma.tenant.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return {
        success: false,
        error: "Un tenant avec ce slug existe déjà",
      };
    }

    // Vérifier que le domaine est unique si fourni
    if (data.domain) {
      const existingDomain = await prisma.tenant.findUnique({
        where: { domain: data.domain },
      });

      if (existingDomain) {
        return {
          success: false,
          error: "Un tenant avec ce domaine existe déjà",
        };
      }
    }

    const tenant = await prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        description: data.description,
        logoUrl: data.logoUrl,
        website: data.website,
        email: data.email,
        phone: data.phone,
        settings: data.settings,
      },
    });

    revalidatePath("/tenants");
    return { success: true, data: tenant };
  } catch (error) {
    console.error("Error creating tenant:", error);
    return {
      success: false,
      error: "Impossible de créer le tenant",
    };
  }
}

// Update tenant
export async function updateTenantAction(
  id: string,
  data: {
    name?: string;
    slug?: string;
    domain?: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    email?: string;
    phone?: string;
    settings?: any;
    isActive?: boolean;
  }
) {
  await requireAuth();
  
  try {
    // Vérifier l'unicité du slug si modifié
    if (data.slug) {
      const existing = await prisma.tenant.findFirst({
        where: {
          slug: data.slug,
          id: { not: id },
        },
      });

      if (existing) {
        return {
          success: false,
          error: "Un tenant avec ce slug existe déjà",
        };
      }
    }

    // Vérifier l'unicité du domaine si modifié
    if (data.domain) {
      const existingDomain = await prisma.tenant.findFirst({
        where: {
          domain: data.domain,
          id: { not: id },
        },
      });

      if (existingDomain) {
        return {
          success: false,
          error: "Un tenant avec ce domaine existe déjà",
        };
      }
    }

    const tenant = await prisma.tenant.update({
      where: { id },
      data,
    });

    revalidatePath("/tenants");
    revalidatePath(`/tenants/${id}`);
    return { success: true, data: tenant };
  } catch (error) {
    console.error("Error updating tenant:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le tenant",
    };
  }
}

// Delete tenant
export async function deleteTenantAction(id: string) {
  await requireAuth();
  
  try {
    await prisma.tenant.delete({
      where: { id },
    });

    revalidatePath("/tenants");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tenant:", error);
    return {
      success: false,
      error: "Impossible de supprimer le tenant",
    };
  }
}

// Get tenants stats
export async function getTenantsStatsAction() {
  await requireAuth();
  
  try {
    const [total, active] = await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { isActive: true } }),
    ]);

    return {
      success: true,
      data: {
        total,
        active,
      },
    };
  } catch (error) {
    console.error("Error fetching tenants stats:", error);
    return {
      success: false,
      error: "Impossible de charger les statistiques",
    };
  }
}

