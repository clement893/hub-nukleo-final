"use server";

import { prisma } from "@nukleo/db";
import { requireAuth } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger";
import type { InvoiceStatus } from "@prisma/client";

// List Invoices
export async function getInvoicesAction(filters?: {
  status?: string;
  companyId?: string;
  projectId?: string;
}) {
  try {
    await requireAuth();

    const where: any = {};
    if (filters?.status) where.status = filters.status as InvoiceStatus;
    if (filters?.companyId) where.companyId = filters.companyId;
    if (filters?.projectId) where.projectId = filters.projectId;

    const invoices = await prisma.invoice.findMany({
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
        items: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { issueDate: "desc" },
    });

    return { success: true, data: invoices };
  } catch (error) {
    logger.error("Error fetching invoices", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des factures" };
  }
}

// Get Invoice
export async function getInvoiceAction(id: string) {
  try {
    await requireAuth();

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        company: true,
        project: true,
        contact: true,
        items: {
          orderBy: { order: "asc" },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return { success: false, error: "Facture introuvable" };
    }

    return { success: true, data: invoice };
  } catch (error) {
    logger.error("Error fetching invoice", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération de la facture" };
  }
}

// Create Invoice
export async function createInvoiceAction(data: {
  companyId: string;
  projectId?: string;
  contactId?: string;
  issueDate: Date;
  dueDate: Date;
  paymentTerms?: string;
  notes?: string;
  terms?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  try {
    const auth = await requireAuth();

    // Générer le numéro de facture
    const year = new Date().getFullYear();
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        number: {
          startsWith: `INV-${year}-`,
        },
      },
      orderBy: { number: "desc" },
    });

    let nextNumber = 1;
    if (lastInvoice) {
      const parts = lastInvoice.number.split("-");
      if (parts.length >= 3) {
        const lastNumber = parseInt(parts[2]);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }
    }

    const number = `INV-${year}-${nextNumber.toString().padStart(3, "0")}`;

    // Calculer les montants
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const taxRate = 0.15; // 15%
    const taxAmount = subtotal * taxRate;
    const total = subtotal + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        number,
        companyId: data.companyId,
        projectId: data.projectId || null,
        contactId: data.contactId || null,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        paymentTerms: data.paymentTerms || null,
        notes: data.notes || null,
        terms: data.terms || null,
        subtotal,
        taxRate,
        taxAmount,
        total,
        createdById: auth.user.id,
        items: {
          create: data.items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
            order: index,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/billing");
    return { success: true, data: invoice };
  } catch (error) {
    logger.error("Error creating invoice", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la création de la facture" };
  }
}

// Update Invoice
export async function updateInvoiceAction(
  id: string,
  data: {
    status?: InvoiceStatus;
    paidDate?: Date;
    paidAmount?: number;
    notes?: string;
  }
) {
  try {
    await requireAuth();

    const invoice = await prisma.invoice.update({
      where: { id },
      data,
    });

    revalidatePath("/billing");
    revalidatePath(`/billing/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    logger.error("Error updating invoice", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la mise à jour de la facture" };
  }
}

// Mark as Sent
export async function markInvoiceAsSentAction(id: string) {
  try {
    await requireAuth();

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "SENT",
        sentDate: new Date(),
      },
    });

    revalidatePath("/billing");
    revalidatePath(`/billing/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    logger.error("Error marking invoice as sent", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la mise à jour de la facture" };
  }
}

// Mark as Paid
export async function markInvoiceAsPaidAction(id: string, paidAmount: number) {
  try {
    await requireAuth();

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "PAID",
        paidDate: new Date(),
        paidAmount,
      },
    });

    revalidatePath("/billing");
    revalidatePath(`/billing/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    logger.error("Error marking invoice as paid", error instanceof Error ? error : new Error(String(error)));
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Erreur lors de la mise à jour de la facture" };
  }
}

// Get Companies (for invoice creation)
export async function getCompaniesAction() {
  try {
    await requireAuth();
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

// Get Projects (for invoice creation)
export async function getProjectsAction() {
  try {
    await requireAuth();
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

// Get Stats
export async function getBillingStatsAction() {
  try {
    await requireAuth();

    const [
      totalInvoices,
      draftInvoices,
      sentInvoices,
      paidInvoices,
      overdueInvoices,
      totalRevenue,
      pendingRevenue,
    ] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.count({ where: { status: "DRAFT" } }),
      prisma.invoice.count({ where: { status: "SENT" } }),
      prisma.invoice.count({ where: { status: "PAID" } }),
      prisma.invoice.count({ where: { status: "OVERDUE" } }),
      prisma.invoice.aggregate({
        where: { status: "PAID" },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: { status: { in: ["SENT", "VIEWED"] } },
        _sum: { total: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalInvoices,
        draftInvoices,
        sentInvoices,
        paidInvoices,
        overdueInvoices,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingRevenue: pendingRevenue._sum.total || 0,
      },
    };
  } catch (error) {
    logger.error("Error fetching billing stats", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Erreur lors de la récupération des statistiques" };
  }
}

