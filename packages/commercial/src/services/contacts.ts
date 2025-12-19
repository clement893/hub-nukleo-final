import { prisma } from "@nukleo/db";

export async function getContactsStats() {
  return prisma.contact.count();
}

export async function getRecentContacts(limit = 5) {
  return prisma.contact.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        select: { name: true },
      },
    },
  });
}

export async function getAllContacts() {
  return prisma.contact.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });
}

