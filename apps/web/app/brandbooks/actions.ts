"use server";

import { prisma } from "@nukleo/db";
import { requireAuth } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

// Get all brand books
export async function getBrandBooksAction(filters?: {
  companyId?: string;
  isActive?: boolean;
}) {
  await requireAuth();
  
  try {
    const where: any = {};
    if (filters?.companyId) where.companyId = filters.companyId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    const brandBooks = await prisma.brandBook.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoKey: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: brandBooks };
  } catch (error) {
    console.error("Error fetching brand books:", error);
    return {
      success: false,
      error: "Impossible de charger les brand books",
    };
  }
}

// Get single brand book
export async function getBrandBookAction(id: string) {
  await requireAuth();
  
  try {
    const brandBook = await prisma.brandBook.findUnique({
      where: { id },
      include: {
        company: true,
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!brandBook) {
      return { success: false, error: "Brand book introuvable" };
    }

    return { success: true, data: brandBook };
  } catch (error) {
    console.error("Error fetching brand book:", error);
    return {
      success: false,
      error: "Impossible de charger le brand book",
    };
  }
}

// Create brand book
export async function createBrandBookAction(data: {
  name: string;
  description?: string;
  companyId?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  typography?: any;
  colors?: any;
  spacing?: any;
  components?: any;
  documentUrl?: string;
  assets?: any;
}) {
  const auth = await requireAuth();
  
  try {
    const brandBook = await prisma.brandBook.create({
      data: {
        name: data.name,
        description: data.description,
        companyId: data.companyId,
        logoUrl: data.logoUrl,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        typography: data.typography,
        colors: data.colors,
        spacing: data.spacing,
        components: data.components,
        documentUrl: data.documentUrl,
        assets: data.assets,
        createdById: auth.user.id,
      },
    });

    revalidatePath("/brandbooks");
    return { success: true, data: brandBook };
  } catch (error) {
    console.error("Error creating brand book:", error);
    return {
      success: false,
      error: "Impossible de créer le brand book",
    };
  }
}

// Update brand book
export async function updateBrandBookAction(
  id: string,
  data: {
    name?: string;
    description?: string;
    companyId?: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    typography?: any;
    colors?: any;
    spacing?: any;
    components?: any;
    documentUrl?: string;
    assets?: any;
    isActive?: boolean;
  }
) {
  await requireAuth();
  
  try {
    const brandBook = await prisma.brandBook.update({
      where: { id },
      data,
    });

    revalidatePath("/brandbooks");
    revalidatePath(`/brandbooks/${id}`);
    return { success: true, data: brandBook };
  } catch (error) {
    console.error("Error updating brand book:", error);
    return {
      success: false,
      error: "Impossible de mettre à jour le brand book",
    };
  }
}

// Delete brand book
export async function deleteBrandBookAction(id: string) {
  await requireAuth();
  
  try {
    await prisma.brandBook.delete({
      where: { id },
    });

    revalidatePath("/brandbooks");
    return { success: true };
  } catch (error) {
    console.error("Error deleting brand book:", error);
    return {
      success: false,
      error: "Impossible de supprimer le brand book",
    };
  }
}

// Get brand books stats
export async function getBrandBooksStatsAction() {
  await requireAuth();
  
  try {
    const [total, active, withCompany] = await Promise.all([
      prisma.brandBook.count(),
      prisma.brandBook.count({ where: { isActive: true } }),
      prisma.brandBook.count({ where: { companyId: { not: null } } }),
    ]);

    return {
      success: true,
      data: {
        total,
        active,
        withCompany,
      },
    };
  } catch (error) {
    console.error("Error fetching brand books stats:", error);
    return {
      success: false,
      error: "Impossible de charger les statistiques",
    };
  }
}

