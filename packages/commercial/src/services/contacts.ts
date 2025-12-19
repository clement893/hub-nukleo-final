import { prisma } from "@nukleo/db";

export async function getContactsStats() {
  return prisma.contact.count();
}

export async function getRecentContacts(limit = 5) {
  return prisma.contact.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      company: {
        select: { name: true },
      },
    },
  });
}

export async function getAllContacts() {
  // Optimize: Only select needed fields and use indexes
  return prisma.contact.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      position: true,
      createdAt: true,
      updatedAt: true,
      company: {
        select: { id: true, name: true },
      },
    },
    // Use take to limit results if needed (can be made configurable)
    // take: 1000, // Uncomment if you want to limit results
  });
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({
    where: { id },
    include: {
      company: true,
      opportunities: {
        include: {
          company: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createContact(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: string;
  ownerId: string;
}) {
  return prisma.contact.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      position: data.position,
      companyId: data.companyId,
      ownerId: data.ownerId,
    },
  });
}

export async function updateContact(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    position?: string;
    companyId?: string;
  }
) {
  return prisma.contact.update({
    where: { id },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.position !== undefined && { position: data.position }),
      ...(data.companyId !== undefined && { companyId: data.companyId }),
    },
  });
}

export async function deleteContact(id: string) {
  return prisma.contact.delete({
    where: { id },
  });
}

