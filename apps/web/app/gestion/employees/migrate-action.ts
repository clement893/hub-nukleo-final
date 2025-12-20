"use server";

import { prisma } from "@nukleo/db";
import { logger } from "@/lib/logger";

/**
 * Migre les utilisateurs (role: USER) de la table User vers Employee
 */
export async function migrateUsersToEmployeesAction() {
  try {
    logger.info("🔄 Début de la migration des utilisateurs vers les employés...");

    // Récupérer tous les utilisateurs avec role USER qui n'ont pas encore été migrés
    const users = await prisma.user.findMany({
      where: {
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        operationsDepartment: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    logger.info(`📊 ${users.length} utilisateur(s) trouvé(s) à migrer`);

    if (users.length === 0) {
      return {
        success: true,
        message: "Aucun utilisateur à migrer",
        migrated: 0,
        skipped: 0,
        errors: 0,
      };
    }

    let migrated = 0;
    let skipped = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    for (const user of users) {
      try {
        // Vérifier si l'employé existe déjà (par email)
        const existingEmployee = await prisma.employee.findUnique({
          where: { email: user.email },
        });

        if (existingEmployee) {
          logger.info(`⏭️  Employé déjà existant pour ${user.email}, ignoré`);
          skipped++;
          continue;
        }

        // Parser le nom complet en firstName/lastName si possible
        let firstName: string | null = null;
        let lastName: string | null = null;
        const name = user.name || "";

        if (name) {
          const nameParts = name.trim().split(/\s+/);
          if (nameParts.length >= 2 && nameParts[0]) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ") || null;
          } else if (nameParts.length === 1 && nameParts[0]) {
            firstName = nameParts[0];
          }
        }

        // Convertir operationsDepartment (enum) en department (string)
        const department = user.operationsDepartment
          ? user.operationsDepartment.toString()
          : null;

        // Créer l'employé
        await prisma.employee.create({
          data: {
            email: user.email,
            name: user.name,
            firstName,
            lastName,
            image: user.image,
            department,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });

        migrated++;
        logger.info(`✅ Migré: ${user.email} (${name || "Sans nom"})`);
      } catch (error) {
        errors++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        errorMessages.push(`${user.email}: ${errorMessage}`);
        logger.error(
          `❌ Erreur lors de la migration de ${user.email}:`,
          error instanceof Error ? error : new Error(String(error))
        );
      }
    }

    const message = `Migration terminée: ${migrated} migré(s), ${skipped} ignoré(s), ${errors} erreur(s)`;

    logger.info(`📊 Résumé: ${message}`);

    return {
      success: errors === 0,
      message,
      migrated,
      skipped,
      errors,
      errorMessages: errorMessages.length > 0 ? errorMessages : undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      "❌ Erreur fatale lors de la migration:",
      error instanceof Error ? error : new Error(String(error))
    );
    return {
      success: false,
      message: `Erreur lors de la migration: ${errorMessage}`,
      migrated: 0,
      skipped: 0,
      errors: 1,
      errorMessages: [errorMessage],
    };
  }
}

