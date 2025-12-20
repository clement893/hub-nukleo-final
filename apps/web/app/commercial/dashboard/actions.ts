"use server";

import {
  getAllOpportunities,
  getAllContacts,
  getAllCompanies,
  getAllProposals,
} from "@nukleo/commercial";
import { logger } from "@/lib/logger";
import type { OpportunityStage } from "@prisma/client";

export interface DashboardStats {
  opportunities: {
    total: number;
    byStage: Record<OpportunityStage, number>;
    totalValue: number;
    wonValue: number;
    conversionRate: number;
  };
  contacts: {
    total: number;
    withEmail: number;
    withPhone: number;
  };
  companies: {
    total: number;
  };
  proposals: {
    total: number;
    draft: number;
    submitted: number;
    accepted: number;
    rejected: number;
    totalAmount: number;
  };
}

export async function getDashboardStatsAction() {
  try {
    const [opportunities, contacts, companies, proposals] = await Promise.all([
      getAllOpportunities(),
      getAllContacts(),
      getAllCompanies(),
      getAllProposals(),
    ]);

    // Calculate opportunities stats
    const opportunitiesByStage: Record<OpportunityStage, number> = {
      IDEAS_CONTACT_PROJECT: 0,
      FOLLOW_UP_EMAILS: 0,
      MEETING_BOOKED: 0,
      IN_DISCUSSION: 0,
      PROPOSAL_TO_DO: 0,
      PROPOSAL_SENT: 0,
      CONTRACT_TO_DO: 0,
      CLOSED_WON: 0,
      CLOSED_LOST: 0,
      RENEWALS_POTENTIAL_UPCOMING: 0,
      WAITING_OR_SILENT: 0,
    };

    let totalValue = 0;
    let wonValue = 0;

    opportunities.forEach((opp) => {
      const stage = opp.stage as OpportunityStage;
      if (stage in opportunitiesByStage) {
        opportunitiesByStage[stage]++;
      }
      if (opp.value) {
        totalValue += Number(opp.value);
        if (stage === "CLOSED_WON") {
          wonValue += Number(opp.value);
        }
      }
    });

    const conversionRate =
      opportunitiesByStage.CLOSED_WON + opportunitiesByStage.CLOSED_LOST > 0
        ? (opportunitiesByStage.CLOSED_WON /
            (opportunitiesByStage.CLOSED_WON + opportunitiesByStage.CLOSED_LOST)) *
          100
        : 0;

    // Calculate contacts stats
    const contactsWithEmail = contacts.filter((c) => c.email).length;
    const contactsWithPhone = contacts.filter((c) => c.phone).length;

    // Calculate proposals stats
    const proposalsByStatus = {
      draft: 0,
      submitted: 0,
      accepted: 0,
      rejected: 0,
    };

    let proposalsTotalAmount = 0;

    proposals.forEach((proposal) => {
      const status = proposal.status;
      if (status === "DRAFT") proposalsByStatus.draft++;
      else if (status === "SUBMITTED") proposalsByStatus.submitted++;
      else if (status === "ACCEPTED") proposalsByStatus.accepted++;
      else if (status === "REJECTED") proposalsByStatus.rejected++;

      if (proposal.totalAmount) {
        proposalsTotalAmount += Number(proposal.totalAmount);
      }
    });

    const stats: DashboardStats = {
      opportunities: {
        total: opportunities.length,
        byStage: opportunitiesByStage,
        totalValue,
        wonValue,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
      contacts: {
        total: contacts.length,
        withEmail: contactsWithEmail,
        withPhone: contactsWithPhone,
      },
      companies: {
        total: companies.length,
      },
      proposals: {
        total: proposals.length,
        draft: proposalsByStatus.draft,
        submitted: proposalsByStatus.submitted,
        accepted: proposalsByStatus.accepted,
        rejected: proposalsByStatus.rejected,
        totalAmount: proposalsTotalAmount,
      },
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    logger.error("Error fetching dashboard stats", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les statistiques du tableau de bord",
    };
  }
}

export async function getRecentOpportunitiesAction(limit = 5) {
  try {
    const opportunities = await getAllOpportunities();
    const recent = opportunities
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit)
      .map((opp) => ({
        id: opp.id,
        title: opp.title,
        stage: opp.stage,
        value: opp.value ? Number(opp.value) : null,
        company: opp.company ? { id: opp.company.id, name: opp.company.name } : null,
        createdAt: opp.createdAt,
      }));

    return {
      success: true,
      data: recent,
    };
  } catch (error) {
    logger.error("Error fetching recent opportunities", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les opportunités récentes",
    };
  }
}

export async function getRecentProposalsAction(limit = 5) {
  try {
    const proposals = await getAllProposals();
    const recent = proposals
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit)
      .map((proposal) => ({
        id: proposal.id,
        title: proposal.title,
        status: proposal.status,
        totalAmount: proposal.totalAmount ? Number(proposal.totalAmount) : null,
        createdAt: proposal.createdAt,
      }));

    return {
      success: true,
      data: recent,
    };
  } catch (error) {
    logger.error("Error fetching recent proposals", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les soumissions récentes",
    };
  }
}

