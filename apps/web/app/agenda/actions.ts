"use server";

import { prisma } from "@nukleo/db";
import { revalidatePath } from "next/cache";
import type { EventType, EventStatus } from "@nukleo/db/types";

export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  allDay?: boolean;
  type?: EventType;
  location?: string;
  notes?: string;
  color?: string;
  opportunityId?: string;
  projectId?: string;
  contactId?: string;
  companyId?: string;
  taskId?: string;
  participantIds?: string[];
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: EventStatus;
}

export async function getEventsAction(params?: {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  type?: EventType;
  status?: EventStatus;
}) {
  try {
    const where: any = {};

    if (params?.startDate || params?.endDate) {
      where.AND = [];
      if (params.startDate) {
        where.AND.push({
          endDate: {
            gte: params.startDate,
          },
        });
      }
      if (params.endDate) {
        where.AND.push({
          startDate: {
            lte: params.endDate,
          },
        });
      }
    }

    if (params?.userId) {
      where.OR = [
        { createdById: params.userId },
        { participants: { some: { id: params.userId } } },
      ];
    }

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.status) {
      where.status = params.status;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return { success: true, data: events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return { success: false, error: "Failed to fetch events" };
  }
}

export async function getEventByIdAction(id: string) {
  try {
    const event = await prisma.event.findUnique({
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
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        opportunity: {
          select: {
            id: true,
            title: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Event not found" };
    }

    return { success: true, data: event };
  } catch (error) {
    console.error("Error fetching event:", error);
    return { success: false, error: "Failed to fetch event" };
  }
}

export async function createEventAction(
  data: CreateEventInput,
  userId: string
) {
  try {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        allDay: data.allDay ?? false,
        type: (data.type ?? "MEETING") as EventType,
        location: data.location,
        notes: data.notes,
        color: data.color,
        createdById: userId,
        opportunityId: data.opportunityId,
        projectId: data.projectId,
        contactId: data.contactId,
        companyId: data.companyId,
        taskId: data.taskId,
        participants: data.participantIds
          ? {
              connect: data.participantIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/agenda");
    return { success: true, data: event };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEventAction(
  id: string,
  data: UpdateEventInput,
  userId: string
) {
  try {
    // Verify ownership or participation
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: {
        createdById: true,
        participants: {
          select: { id: true },
        },
      },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    const isOwner = existingEvent.createdById === userId;
    const isParticipant = existingEvent.participants.some(
      (p) => p.id === userId
    );

    if (!isOwner && !isParticipant) {
      return { success: false, error: "Unauthorized" };
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.startDate !== undefined)
      updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.allDay !== undefined) updateData.allDay = data.allDay;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.opportunityId !== undefined)
      updateData.opportunityId = data.opportunityId;
    if (data.projectId !== undefined) updateData.projectId = data.projectId;
    if (data.contactId !== undefined) updateData.contactId = data.contactId;
    if (data.companyId !== undefined) updateData.companyId = data.companyId;
    if (data.taskId !== undefined) updateData.taskId = data.taskId;

    if (data.participantIds !== undefined) {
      updateData.participants = {
        set: data.participantIds.map((id) => ({ id })),
      };
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/agenda");
    return { success: true, data: event };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEventAction(id: string, userId: string) {
  try {
    // Verify ownership
    const existingEvent = await prisma.event.findUnique({
      where: { id },
      select: {
        createdById: true,
      },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    if (existingEvent.createdById !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/agenda");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}

export async function getUsersForEventsAction() {
  try {
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

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function getOpportunitiesForEventsAction() {
  try {
    const opportunities = await prisma.opportunity.findMany({
      where: {
        stage: {
          notIn: ["CLOSED_WON", "CLOSED_LOST"],
        },
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: "asc",
      },
    });

    return { success: true, data: opportunities };
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return { success: false, error: "Failed to fetch opportunities" };
  }
}

export async function getProjectsForEventsAction() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: {
          notIn: ["COMPLETED", "CANCELLED"],
        },
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function getContactsForEventsAction() {
  try {
    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        firstName: "asc",
      },
    });

    return { success: true, data: contacts };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function getCompaniesForEventsAction() {
  try {
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, data: companies };
  } catch (error) {
    console.error("Error fetching companies:", error);
    return { success: false, error: "Failed to fetch companies" };
  }
}
