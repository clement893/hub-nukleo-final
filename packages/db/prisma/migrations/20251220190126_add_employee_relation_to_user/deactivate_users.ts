/**
 * Script de migration pour désactiver tous les utilisateurs sauf Manus et Clément
 * 
 * Ce script doit être exécuté après la migration SQL principale.
 * Il désactive tous les utilisateurs sauf ceux dont le nom ou l'email contient "manus" ou "clément"/"clement"
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Désactivation des utilisateurs (sauf Manus et Clément)...");

  // Trouver les utilisateurs à garder actifs
  const activeUsers = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: "Manus", mode: "insensitive" } },
        { name: { contains: "Clément", mode: "insensitive" } },
        { name: { contains: "Clement", mode: "insensitive" } },
        { email: { contains: "manus", mode: "insensitive" } },
        { email: { contains: "clement", mode: "insensitive" } },
        { email: { contains: "clément", mode: "insensitive" } },
      ],
    },
  });

  console.log(`✅ Utilisateurs actifs trouvés: ${activeUsers.length}`);
  activeUsers.forEach((user) => {
    console.log(`  - ${user.name || user.email} (${user.email})`);
  });

  // Désactiver tous les autres utilisateurs
  const result = await prisma.user.updateMany({
    where: {
      AND: [
        {
          NOT: {
            OR: [
              { name: { contains: "Manus", mode: "insensitive" } },
              { name: { contains: "Clément", mode: "insensitive" } },
              { name: { contains: "Clement", mode: "insensitive" } },
              { email: { contains: "manus", mode: "insensitive" } },
              { email: { contains: "clement", mode: "insensitive" } },
              { email: { contains: "clément", mode: "insensitive" } },
            ],
          },
        },
        { isActive: true },
      ],
    },
    data: {
      isActive: false,
    },
  });

  console.log(`✅ ${result.count} utilisateur(s) désactivé(s)`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de la migration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

