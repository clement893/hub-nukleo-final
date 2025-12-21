import { prisma } from "@nukleo/db";

export async function getOpportunitiesStats() {
  // Optimize: Use a single groupBy query to get all stats at once
  const opportunitiesByStage = await prisma.opportunity.groupBy({
    by: ["stage"],
    _sum: { value: true },
    _count: { id: true },
  });

  // Calculate stats from groupBy result
  const totalOpportunities = opportunitiesByStage.reduce(
    (sum, stage) => sum + stage._count.id,
    0
  );
  const wonStage = opportunitiesByStage.find((stage) => stage.stage === "CLOSED_WON");
  const wonOpportunities = wonStage?._count.id || 0;
  const totalRevenue = wonStage?._sum.value || 0;

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
    totalRevenue: totalRevenue,
    pipelineByStage,
  };
}

export async function getRecentOpportunities(limit = 5) {
  return prisma.opportunity.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      value: true,
      stage: true,
      probability: true,
      expectedCloseDate: true,
      createdAt: true,
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
  // Use raw query approach to ensure all opportunities are returned
  // even if ownerId points to a non-existent user (which can happen with Manus imports)
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
    // Prisma's include uses LEFT JOIN by default, so opportunities with invalid ownerId
    // will still be returned with owner: null
    // This ensures opportunities imported by Manus are visible even if ownerId is invalid
  });
}

export async function getOpportunityById(id: string) {
  return prisma.opportunity.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      owner: {
        select: { id: true, name: true, email: true },
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

