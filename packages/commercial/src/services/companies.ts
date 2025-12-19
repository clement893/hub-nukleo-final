import { prisma } from "@nukleo/db";

export async function getCompaniesStats() {
  return prisma.company.count();
}

export async function getRecentCompanies(limit = 5) {
  return prisma.company.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      industry: true,
      createdAt: true,
    },
  });
}

export async function getAllCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCompanyById(id: string) {
  return prisma.company.findUnique({
    where: { id },
    include: {
      contacts: {
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      },
      opportunities: {
        include: {
          contact: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createCompany(data: {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  ownerId: string;
}) {
  return prisma.company.create({
    data: {
      name: data.name,
      industry: data.industry,
      website: data.website,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      ownerId: data.ownerId,
    },
  });
}

export async function updateCompany(
  id: string,
  data: {
    name?: string;
    industry?: string;
    website?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  }
) {
  return prisma.company.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.industry !== undefined && { industry: data.industry }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.city !== undefined && { city: data.city }),
      ...(data.country !== undefined && { country: data.country }),
    },
  });
}

export async function deleteCompany(id: string) {
  return prisma.company.delete({
    where: { id },
  });
}

