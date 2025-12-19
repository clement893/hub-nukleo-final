import { prisma } from "@nukleo/db";

export async function getOpportunitiesStats() {
  const [
    totalOpportunities,
    wonOpportunities,
    totalRevenue,
    opportunitiesByStage,
  ] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({
      where: { stage: "WON" },
    }),
    prisma.opportunity.aggregate({
      where: { stage: "WON" },
      _sum: { value: true },
    }),
    prisma.opportunity.groupBy({
      by: ["stage"],
      _sum: { value: true },
      _count: { id: true },
    }),
  ]);

  const conversionRate =
    totalOpportunities > 0
      ? (wonOpportunities / totalOpportunities) * 100
      : 0;

  const pipelineByStage = opportunitiesByStage.map((stage) => ({
    stage: stage.stage,
    value: stage._sum.value || 0,
    count: stage._count.id,
  }));

  return {
    totalOpportunities,
    wonOpportunities,
    conversionRate: Math.round(conversionRate * 100) / 100,
    totalRevenue: totalRevenue._sum.value || 0,
    pipelineByStage,
  };
}

export async function getRecentOpportunities(limit = 5) {
  return prisma.opportunity.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: { name: true },
      },
      contact: {
        select: { firstName: true, lastName: true },
      },
      owner: {
        select: { name: true },
      },
    },
  });
}

