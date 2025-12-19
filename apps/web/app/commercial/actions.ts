"use server";

import { revalidatePath } from "next/cache";
import { getAllOpportunities, createProposal } from "@nukleo/commercial";
import type { ProposalFormData } from "@nukleo/commercial";
import { auth } from "@/auth";

export async function getAllOpportunitiesAction() {
  try {
    const opportunities = await getAllOpportunities();
    return {
      success: true,
      data: opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        company: opp.company
          ? { id: opp.company.id, name: opp.company.name }
          : null,
      })),
    };
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return {
      success: false,
      error: "Impossible de charger les opportunitÃ©s",
      data: [],
    };
  }
}

export async function createProposalAction(data: ProposalFormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Vous devez Ãªtre connectÃ© pour crÃ©er une soumission",
      };
    }

    const proposal = await createProposal(data, session.user.id);

    revalidatePath("/commercial/proposals");
    
    return {
      success: true,
      data: proposal,
    };
  } catch (error) {
    console.error("Error creating proposal:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Impossible de crÃ©er la soumission",
    };
  }
}