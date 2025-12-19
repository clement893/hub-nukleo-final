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

export async function getAllOpportunities() {
  return prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: { id: true, name: true },
      },
      contact: {
        select: { id: true, firstName: true, lastName: true },
      },
      owner: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function updateOpportunityStage(
  id: string,
  stage: string
) {
  return prisma.opportunity.update({
    where: { id },
    data: { stage: stage as any },
  });
}

export async function createOpportunity(data: {
  title: string;
  description?: string;
  value?: number;
  stage: string;
  probability?: number;
  expectedCloseDate?: Date;
  companyId?: string;
  contactId?: string;
  ownerId: string;
}) {
  return prisma.opportunity.create({
    data: {
      title: data.title,
      description: data.description,
      value: data.value,
      stage: data.stage as any,
      probability: data.probability,
      expectedCloseDate: data.expectedCloseDate,
      companyId: data.companyId,
      contactId: data.contactId,
      ownerId: data.ownerId,
    },
  });
}

export async function updateOpportunity(
  id: string,
  data: {
    title?: string;
    description?: string;
    value?: number;
    stage?: string;
    probability?: number;
    expectedCloseDate?: Date;
    companyId?: string;
    contactId?: string;
  }
) {
  return prisma.opportunity.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.value !== undefined && { value: data.value }),
      ...(data.stage && { stage: data.stage as any }),
      ...(data.probability !== undefined && { probability: data.probability }),
      ...(data.expectedCloseDate && { expectedCloseDate: data.expectedCloseDate }),
      ...(data.companyId !== undefined && { companyId: data.companyId }),
      ...(data.contactId !== undefined && { contactId: data.contactId }),
    },
  });
}

export async function deleteOpportunity(id: string) {
  return prisma.opportunity.delete({
    where: { id },
  });
}

