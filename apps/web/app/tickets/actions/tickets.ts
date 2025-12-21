"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@nukleo/db";
import { auth } from "@/auth";
import type { TicketPriority, TicketStatus, TicketCategory } from "@nukleo/db";

export async function getTickets() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const tickets = await prisma.ticket.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });

  return tickets;
}

export async function getTicket(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return ticket;
}

export async function createTicket(data: {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  assignedToId?: string;
  contactId?: string;
  companyId?: string;
  dueDate?: Date;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const ticket = await prisma.ticket.create({
    data: {
      ...data,
      createdById: session.user.id,
    },
  });

  revalidatePath("/tickets");
  return ticket;
}

export async function updateTicket(
  id: string,
  data: {
    title?: string;
    description?: string;
    priority?: TicketPriority;
    status?: TicketStatus;
    category?: TicketCategory;
    assignedToId?: string | null;
    contactId?: string | null;
    companyId?: string | null;
    dueDate?: Date | null;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  // Si le statut change vers RESOLVED ou CLOSED, mettre à jour les timestamps
  const updateData: any = { ...data };
  
  if (data.status === "RESOLVED" && !updateData.resolvedAt) {
    updateData.resolvedAt = new Date();
  }
  
  if (data.status === "CLOSED" && !updateData.closedAt) {
    updateData.closedAt = new Date();
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
  return ticket;
}

export async function deleteTicket(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  await prisma.ticket.delete({
    where: { id },
  });

  revalidatePath("/tickets");
}

export async function addTicketComment(data: {
  ticketId: string;
  content: string;
  isInternal?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const comment = await prisma.ticketComment.create({
    data: {
      ...data,
      authorId: session.user.id,
      isInternal: data.isInternal ?? false,
    },
  });

  revalidatePath(`/tickets/${data.ticketId}`);
  return comment;
}

export async function deleteTicketComment(id: string, ticketId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  await prisma.ticketComment.delete({
    where: { id },
  });

  revalidatePath(`/tickets/${ticketId}`);
}

export async function getUsers() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
}

export async function getContacts() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      lastName: "asc",
    },
  });

  return contacts;
}

export async function getCompanies() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Non autorisé");
  }

  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return companies;
}
