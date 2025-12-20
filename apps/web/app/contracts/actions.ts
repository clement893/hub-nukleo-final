"use server";

import { prisma } from "@nukleo/db";
import { requireAuth } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import type { ContractStatus, ContractType } from "@prisma/client";

// List Contracts
export async function getContractsAction(filters?: {
  status?: string;
  type?: string;
  companyId?: string;
}) {
  try {
    await requireAuth();

    const where: any = {};
    if (filters?.status) where.status = filters.status as ContractStatus;
    if (filters?.type) where.type = filters.type as ContractType;
    if (filters?.companyId) where.companyId = filters.companyId;

    const contracts = await prisma.contract.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logoKey: true,
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
        signatures: {
          orderBy: { signedAt: "desc" },
        },
        _count: {
          select: {
            signatures: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: contracts };
  } catch (error) {
    logger.error("Error fetching contracts", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des contrats" };
  }
}

// Get Contract
export async function getContractAction(id: string) {
  try {
    const auth = await requireAuth();

    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        company: true,
        project: true,
        contact: true,
        signatures: {
          orderBy: { signedAt: "desc" },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!contract) {
      return { success: false, error: "Contrat introuvable" };
    }

    return { success: true, data: contract };
  } catch (error) {
    logger.error("Error fetching contract", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération du contrat" };
  }
}

// Create Contract
export async function createContractAction(data: {
  title: string;
  type: string;
  companyId: string;
  projectId?: string;
  contactId?: string;
  startDate: Date;
  endDate: Date;
  value: number;
  currency?: string;
  terms?: string;
  notes?: string;
  autoRenew?: boolean;
  renewalPeriod?: number;
  signers: Array<{
    name: string;
    email: string;
    role?: string;
  }>;
}) {
  try {
    const auth = await requireAuth();

    // Générer le numéro de contrat
    const year = new Date().getFullYear();
    const lastContract = await prisma.contract.findFirst({
      where: {
        number: {
          startsWith: `CTR-${year}-`,
        },
      },
      orderBy: { number: "desc" },
    });

    let nextNumber = 1;
    if (lastContract) {
      const parts = lastContract.number.split("-");
      if (parts.length >= 3) {
        const lastNumber = parseInt(parts[2]);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    const number = `CTR-${year}-${nextNumber.toString().padStart(3, "0")}`;

    const contract = await prisma.contract.create({
      data: {
        number,
        title: data.title,
        type: data.type as ContractType,
        companyId: data.companyId,
        projectId: data.projectId || null,
        contactId: data.contactId || null,
        startDate: data.startDate,
        endDate: data.endDate,
        value: data.value,
        currency: data.currency || "CAD",
        terms: data.terms || null,
        notes: data.notes || null,
        autoRenew: data.autoRenew || false,
        renewalPeriod: data.renewalPeriod || null,
        createdById: auth.user.id,
        signatures: {
          create: data.signers.map((signer) => ({
            signerName: signer.name,
            signerEmail: signer.email,
            signerRole: signer.role || null,
          })),
        },
      },
      include: {
        signatures: true,
      },
    });

    revalidatePath("/contracts");
    return { success: true, data: contract };
  } catch (error) {
    logger.error("Error creating contract", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la création du contrat" };
  }
}

// Update Contract
export async function updateContractAction(
  id: string,
  data: {
    status?: ContractStatus;
    signedDate?: Date;
    signedDocumentUrl?: string;
    notes?: string;
  }
) {
  try {
    const auth = await requireAuth();

    const contract = await prisma.contract.update({
      where: { id },
      data,
    });

    revalidatePath("/contracts");
    revalidatePath(`/contracts/${id}`);
    return { success: true, data: contract };
  } catch (error) {
    logger.error("Error updating contract", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la mise à jour du contrat" };
  }
}

// Sign Contract
export async function signContractAction(
  contractId: string,
  signatureId: string,
  data: {
    signatureUrl?: string;
    ipAddress?: string;
    userAgent?: string;
  }
) {
  try {
    const auth = await requireAuth();

    const signature = await prisma.signature.update({
      where: { id: signatureId },
      data: {
        signedAt: new Date(),
        signatureUrl: data.signatureUrl || null,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });

    // Vérifier si toutes les signatures sont complètes
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        signatures: true,
      },
    });

    const allSigned = contract?.signatures.every((s) => s.signedAt !== null);

    if (allSigned && contract) {
      await prisma.contract.update({
        where: { id: contractId },
        data: {
          status: "SIGNED",
          signedDate: new Date(),
        },
      });
    }

    revalidatePath("/contracts");
    revalidatePath(`/contracts/${contractId}`);
    return { success: true, data: signature };
  } catch (error) {
    logger.error("Error signing contract", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la signature du contrat" };
  }
}

// Get Expiring Contracts
export async function getExpiringContractsAction(days: number = 30) {
  try {
    const auth = await requireAuth();

    const expiringDate = new Date();
    expiringDate.setDate(expiringDate.getDate() + days);

    const contracts = await prisma.contract.findMany({
      where: {
        status: "ACTIVE",
        endDate: {
          lte: expiringDate,
          gte: new Date(),
        },
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { endDate: "asc" },
    });

    return { success: true, data: contracts };
  } catch (error) {
    logger.error("Error fetching expiring contracts", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des contrats expirants" };
  }
}

// Get Stats
export async function getContractsStatsAction() {
  try {
    const auth = await requireAuth();

    const [
      totalContracts,
      activeContracts,
      pendingSignature,
      expiringSoon,
      totalValue,
    ] = await Promise.all([
      prisma.contract.count(),
      prisma.contract.count({ where: { status: "ACTIVE" } }),
      prisma.contract.count({ where: { status: "PENDING_SIGNATURE" } }),
      prisma.contract.count({
        where: {
          status: "ACTIVE",
          endDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
            gte: new Date(),
          },
        },
      }),
      prisma.contract.aggregate({
        where: { status: "ACTIVE" },
        _sum: { value: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalContracts,
        activeContracts,
        pendingSignature,
        expiringSoon,
        totalValue: totalValue._sum.value || 0,
      },
    };
  } catch (error) {
    logger.error("Error fetching contracts stats", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

// Get Companies (for contract creation)
export async function getCompaniesAction() {
  try {
    const auth = await requireAuth();
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: companies };
  } catch (error) {
    logger.error("Error fetching companies", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des entreprises" };
  }
}

// Get Projects (for contract creation)
export async function getProjectsAction() {
  try {
    const auth = await requireAuth();
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });
    return { success: true, data: projects };
  } catch (error) {
    logger.error("Error fetching projects", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des projets" };
  }
}

