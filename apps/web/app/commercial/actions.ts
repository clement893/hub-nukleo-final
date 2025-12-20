"use server";

import { revalidatePath } from "next/cache";
import { getAllOpportunities, createProposal } from "@nukleo/commercial";
import type { ProposalFormData } from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function getAllOpportunitiesAction() {
  try {
    const opportunities = await getAllOpportunities();
    return {
      success: true,
      data: opportunities.map((opp: { id: string; title: string; company: { id: string; name: string } | null }) => ({
        id: opp.id,
        title: opp.title,
        company: opp.company
          ? { id: opp.company.id, name: opp.company.name }
          : null,
      })),
    };
  } catch (error) {
    logger.error("Error fetching opportunities", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Impossible de charger les opportunités",
      data: [],
    };
  }
}

export async function createProposalAction(data: ProposalFormData) {
  try {
    const userId = await getCurrentUserId();
    const proposal = await createProposal(data, userId);

    revalidatePath("/commercial/proposals");
    
    return {
      success: true,
      data: proposal,
    };
  } catch (error) {
    logger.error("Error creating proposal", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Impossible de créer la soumission",
    };
  }
}
