import { prisma } from "@nukleo/db";
import type {
  ProposalFormData,
  UpdateProposalStatusData,
  UpdateProposalData,
} from "../schemas/proposal";

export async function getAllProposals() {
  return prisma.proposal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      opportunity: {
        select: {
          id: true,
          title: true,
          company: {
            select: { id: true, name: true },
          },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      },
      processes: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getProposalById(id: string) {
  return prisma.proposal.findUnique({
    where: { id },
    include: {
      opportunity: {
        include: {
          company: true,
          contact: true,
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      },
      processes: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function getProposalsByOpportunity(opportunityId: string) {
  return prisma.proposal.findMany({
    where: { opportunityId },
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      },
      processes: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function createProposal(data: ProposalFormData, createdById: string) {
  // Calculate total amount from items
  let totalAmount = data.totalAmount || null;
  if (!totalAmount) {
    const calculatedTotal = data.sections.reduce((sum, section) => {
      return (
        sum +
        section.items.reduce((sectionSum, item) => {
          if (item.totalPrice) {
            return sectionSum + Number(item.totalPrice);
          }
          if (item.unitPrice && item.quantity) {
            return sectionSum + Number(item.unitPrice) * Number(item.quantity);
          }
          return sectionSum;
        }, 0)
      );
    }, 0);
    totalAmount = calculatedTotal > 0 ? calculatedTotal : null;
  }

  return prisma.proposal.create({
    data: {
      title: data.title,
      description: data.description || null,
      status: data.status,
      totalAmount: totalAmount,
      validUntil: data.validUntil || null,
      opportunityId: data.opportunityId,
      createdById,
      sections: {
        create: data.sections.map((section, sectionIndex) => ({
          title: section.title,
          description: section.description || null,
          order: section.order !== undefined ? section.order : sectionIndex,
          items: {
            create: section.items.map((item, itemIndex) => ({
              title: item.title,
              description: item.description || null,
              type: item.type,
              quantity: item.quantity || null,
              unitPrice: item.unitPrice || null,
              totalPrice: item.totalPrice || (item.unitPrice && item.quantity ? Number(item.unitPrice) * Number(item.quantity) : null),
              order: item.order !== undefined ? item.order : itemIndex,
            })),
          },
        })),
      },
      processes: {
        create: data.processes.map((process, processIndex) => ({
          title: process.title,
          description: process.description || null,
          order: process.order !== undefined ? process.order : processIndex,
          estimatedDuration: process.estimatedDuration || null,
        })),
      },
    },
    include: {
      opportunity: {
        select: {
          id: true,
          title: true,
          company: {
            select: { id: true, name: true },
          },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      },
      processes: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function updateProposal(id: string, data: UpdateProposalData, createdById: string) {
  // Calculate total amount if sections are provided
  let totalAmount = data.totalAmount;
  if (data.sections && data.sections.length > 0) {
    const calculatedTotal = data.sections.reduce((sum, section) => {
      return (
        sum +
        section.items.reduce((sectionSum, item) => {
          if (item.totalPrice) {
            return sectionSum + Number(item.totalPrice);
          }
          if (item.unitPrice && item.quantity) {
            return sectionSum + Number(item.unitPrice) * Number(item.quantity);
          }
          return sectionSum;
        }, 0)
      );
    }, 0);
    totalAmount = calculatedTotal > 0 ? calculatedTotal : null;
  }

  // Delete existing sections and recreate them
  await prisma.proposalSection.deleteMany({
    where: { proposalId: id },
  });

  return prisma.proposal.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(totalAmount !== undefined && { totalAmount }),
      ...(data.validUntil !== undefined && { validUntil: data.validUntil }),
      sections: {
        create: data.sections?.map((section, sectionIndex) => ({
          title: section.title,
          description: section.description || null,
          order: section.order !== undefined ? section.order : sectionIndex,
          items: {
            create: section.items.map((item, itemIndex) => ({
              title: item.title,
              description: item.description || null,
              type: item.type,
              quantity: item.quantity || null,
              unitPrice: item.unitPrice || null,
              totalPrice: item.totalPrice || (item.unitPrice && item.quantity ? Number(item.unitPrice) * Number(item.quantity) : null),
              order: item.order !== undefined ? item.order : itemIndex,
            })),
          },
        })) || [],
      },
      processes: {
        deleteMany: {},
        create: data.processes?.map((process, processIndex) => ({
          title: process.title,
          description: process.description || null,
          order: process.order !== undefined ? process.order : processIndex,
          estimatedDuration: process.estimatedDuration || null,
        })) || [],
      },
    },
    include: {
      opportunity: {
        select: {
          id: true,
          title: true,
          company: {
            select: { id: true, name: true },
          },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      sections: {
        orderBy: { order: "asc" },
        include: {
          items: {
            orderBy: { order: "asc" },
          },
        },
      },
      processes: {
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function updateProposalStatus(id: string, data: UpdateProposalStatusData) {
  const updateData: any = {
    status: data.status,
  };

  if (data.status === "SUBMITTED") {
    updateData.submittedAt = new Date();
  } else if (data.status === "ACCEPTED") {
    updateData.acceptedAt = new Date();
  } else if (data.status === "REJECTED") {
    updateData.rejectedAt = new Date();
    updateData.rejectionReason = data.rejectionReason || null;
  }

  return prisma.proposal.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteProposal(id: string) {
  return prisma.proposal.delete({
    where: { id },
  });
}

