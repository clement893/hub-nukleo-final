"use server";

import { prisma } from "@nukleo/db";
import { requireAuth } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";

// Get all settings
export async function getSettingsAction(filters?: {
  category?: string;
  isPublic?: boolean;
}) {
  await requireAuth();
  
  try {
    const where: any = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.isPublic !== undefined) where.isPublic = filters.isPublic;

    const settings = await prisma.appSetting.findMany({
      where,
      include: {
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { category: "asc" },
        { key: "asc" },
      ],
    });

    return { success: true, data: settings };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return {
      success: false,
      error: "Impossible de charger les paramètres",
    };
  }
}

// Get single setting
export async function getSettingAction(key: string) {
  await requireAuth();
  
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key },
      include: {
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!setting) {
      return { success: false, error: "Paramètre introuvable" };
    }

    return { success: true, data: setting };
  } catch (error) {
    console.error("Error fetching setting:", error);
    return {
      success: false,
      error: "Impossible de charger le paramètre",
    };
  }
}

// Create or update setting (upsert)
export async function upsertSettingAction(data: {
  key: string;
  value: any;
  category?: string;
  description?: string;
  isPublic?: boolean;
}) {
  const auth = await requireAuth();
  
  try {
    const setting = await prisma.appSetting.upsert({
      where: { key: data.key },
      update: {
        value: data.value,
        category: data.category,
        description: data.description,
        isPublic: data.isPublic,
        updatedById: auth.user.id,
      },
      create: {
        key: data.key,
        value: data.value,
        category: data.category || "general",
        description: data.description,
        isPublic: data.isPublic || false,
        updatedById: auth.user.id,
      },
    });

    revalidatePath("/settings");
    return { success: true, data: setting };
  } catch (error) {
    console.error("Error upserting setting:", error);
    return {
      success: false,
      error: "Impossible de sauvegarder le paramètre",
    };
  }
}

// Delete setting
export async function deleteSettingAction(key: string) {
  await requireAuth();
  
  try {
    await prisma.appSetting.delete({
      where: { key },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting setting:", error);
    return {
      success: false,
      error: "Impossible de supprimer le paramètre",
    };
  }
}

// Get settings by category
export async function getSettingsByCategoryAction() {
  await requireAuth();
  
  try {
    const settings = await prisma.appSetting.findMany({
      orderBy: [
        { category: "asc" },
        { key: "asc" },
      ],
    });

    // Grouper par catégorie
    const grouped = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      const categoryArray = acc[setting.category]!;
      categoryArray.push(setting);
      return acc;
    }, {} as Record<string, typeof settings>);

    return { success: true, data: grouped };
  } catch (error) {
    console.error("Error fetching settings by category:", error);
    return {
      success: false,
      error: "Impossible de charger les paramètres",
    };
  }
}

