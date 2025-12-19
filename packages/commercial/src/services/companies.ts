import { prisma } from "@nukleo/db";

export async function getCompaniesStats() {
  return prisma.company.count();
}

export async function getRecentCompanies(limit = 5) {
  return prisma.company.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
  });
}

