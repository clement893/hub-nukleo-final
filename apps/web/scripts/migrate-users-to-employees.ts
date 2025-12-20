/**
 * Script de migration pour déplacer les utilisateurs (role: USER) de la table User vers Employee
 * 
 * Usage:
 *   pnpm tsx scripts/migrate-users-to-employees.ts
 */

import { prisma } from "@nukleo/db";

async function migrateUsersToEmployees() {
  console.log("🔄 Début de la migration des utilisateurs vers les employés...");

  try {
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

    console.log(`📊 ${users.length} utilisateur(s) trouvé(s) à migrer`);

    if (users.length === 0) {
      console.log("✅ Aucun utilisateur à migrer");
      return;
    }

    let migrated = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      try {
        // Vérifier si l'employé existe déjà (par email)
        const existingEmployee = await prisma.employee.findUnique({
          where: { email: user.email },
        });

        if (existingEmployee) {
          console.log(`⏭️  Employé déjà existant pour ${user.email}, ignoré`);
          skipped++;
          continue;
        }

        // Parser le nom complet en firstName/lastName si possible
        let firstName: string | null = null;
        let lastName: string | null = null;
        const name = user.name || "";

        if (name) {
          const nameParts = name.trim().split(/\s+/);
          if (nameParts.length >= 2) {
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ");
          } else if (nameParts.length === 1) {
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
        console.log(`✅ Migré: ${user.email} (${name || "Sans nom"})`);
      } catch (error) {
        errors++;
        console.error(`❌ Erreur lors de la migration de ${user.email}:`, error);
      }
    }

    console.log("\n📊 Résumé de la migration:");
    console.log(`   ✅ Migrés: ${migrated}`);
    console.log(`   ⏭️  Ignorés: ${skipped}`);
    console.log(`   ❌ Erreurs: ${errors}`);
    console.log("\n✅ Migration terminée!");
  } catch (error) {
    console.error("❌ Erreur fatale lors de la migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateUsersToEmployees()
  .then(() => {
    console.log("✅ Script terminé avec succès");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Erreur lors de l'exécution du script:", error);
    process.exit(1);
  });

