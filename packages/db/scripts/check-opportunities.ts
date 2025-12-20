/**
 * Script de diagnostic pour vérifier les opportunités importées par Manus
 * Usage: npx tsx packages/db/scripts/check-opportunities.ts
 */

import { prisma } from "../src/index";

async function checkOpportunities() {
  try {
    console.log("🔍 Vérification des opportunités dans la base de données...\n");

    // Compter toutes les opportunités
    const totalCount = await prisma.opportunity.count();
    console.log(`📊 Total d'opportunités: ${totalCount}`);

    // Vérifier les opportunités sans owner valide
    const allOpportunities = await prisma.opportunity.findMany({
      select: {
        id: true,
        title: true,
        ownerId: true,
        createdAt: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`\n📋 Détails des opportunités:`);
    console.log(`Total récupéré: ${allOpportunities.length}`);

    // Vérifier les opportunités avec ownerId invalide
    const opportunitiesWithoutOwner = allOpportunities.filter(
      (opp) => !opp.owner
    );

    if (opportunitiesWithoutOwner.length > 0) {
      console.log(
        `\n⚠️  Opportunités avec ownerId invalide: ${opportunitiesWithoutOwner.length}`
      );
      opportunitiesWithoutOwner.forEach((opp) => {
        console.log(
          `  - ID: ${opp.id}, Title: ${opp.title}, ownerId: ${opp.ownerId}`
        );
      });
    } else {
      console.log(`\n✅ Toutes les opportunités ont un owner valide`);
    }

    // Vérifier les opportunités récentes
    const recentOpportunities = await prisma.opportunity.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        stage: true,
        ownerId: true,
        createdAt: true,
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`\n📅 10 dernières opportunités créées:`);
    recentOpportunities.forEach((opp, index) => {
      console.log(
        `  ${index + 1}. ${opp.title} (${opp.stage}) - Owner: ${
          opp.owner?.name || "INVALIDE"
        } - Créé: ${opp.createdAt.toISOString()}`
      );
    });

    // Vérifier les utilisateurs disponibles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    console.log(`\n👥 Utilisateurs disponibles: ${users.length}`);
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    // Statistiques par stage
    const opportunitiesByStage = await prisma.opportunity.groupBy({
      by: ["stage"],
      _count: {
        id: true,
      },
    });

    console.log(`\n📊 Opportunités par stage:`);
    opportunitiesByStage.forEach((stage) => {
      console.log(`  - ${stage.stage}: ${stage._count.id}`);
    });
  } catch (error) {
    console.error("❌ Erreur lors de la vérification:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkOpportunities()
  .then(() => {
    console.log("\n✅ Vérification terminée");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Erreur:", error);
    process.exit(1);
  });

