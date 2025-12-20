"use server";

import { prisma } from "@nukleo/db";
import { logger } from "@/lib/logger";

export async function setupAdminAction() {
  try {
    // 1. Mettre à jour clement@nukleo.com en ADMIN
    const clementUser = await prisma.user.upsert({
      where: { email: "clement@nukleo.com" },
      update: {
        role: "ADMIN",
        isActive: true,
      },
      create: {
        email: "clement@nukleo.com",
        name: "Clement Nukleo",
        role: "ADMIN",
        isActive: true,
      },
    });

    // 2. Créer/mettre à jour le compte test Manus
    const testUser = await prisma.user.upsert({
      where: { email: "test@manus.ai" },
      update: {
        role: "ADMIN",
        isActive: true,
      },
      create: {
        email: "test@manus.ai",
        name: "Manus Test",
        role: "ADMIN",
        isActive: true,
      },
    });

    // 3. Récupérer tous les admins
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: "ADMIN" },
          { email: { in: ["clement@nukleo.com", "test@manus.ai"] } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    logger.info("Admin setup completed", { 
      clementId: clementUser.id, 
      testId: testUser.id 
    });

    return {
      success: true,
      data: admins,
    };
  } catch (error) {
    logger.error("Error in setupAdminAction", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur lors de la configuration",
    };
  }
}
