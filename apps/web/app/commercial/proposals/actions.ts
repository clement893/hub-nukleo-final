"use server";

import {
  getAllProposals,
  getProposalById,
  getProposalsByOpportunity,
  createProposal,
  updateProposal,
  updateProposalStatus,
  deleteProposal,
} from "@nukleo/commercial/services/proposals";
import {
  proposalSchema,
  updateProposalSchema,
  updateProposalStatusSchema,
} from "@nukleo/commercial/schemas";

export async function getProposalsAction() {
  try {
    const proposals = await getAllProposals();
    return {
      success: true,
      data: proposals,
    };
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return { success: false, error: "Failed to fetch proposals" };
  }
}

export async function getProposalAction(id: string) {
  try {
    const proposal = await getProposalById(id);
    if (!proposal) {
      return { success: false, error: "Proposal not found" };
    }
    return {
      success: true,
      data: proposal,
    };
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return { success: false, error: "Failed to fetch proposal" };
  }
}

export async function getProposalsByOpportunityAction(opportunityId: string) {
  try {
    const proposals = await getProposalsByOpportunity(opportunityId);
    return {
      success: true,
      data: proposals,
    };
  } catch (error) {
    console.error("Error fetching proposals by opportunity:", error);
    return { success: false, error: "Failed to fetch proposals" };
  }
}

export async function createProposalAction(data: unknown) {
  try {
    // Validate with Zod
    const validationResult = proposalSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      };
    }

    // TODO: Get current user ID from auth context
    const createdById = "temp-user-id";

    const proposal = await createProposal(validationResult.data, createdById);
    return { success: true, data: proposal };
  } catch (error) {
    console.error("Error creating proposal:", error);
    return { success: false, error: "Failed to create proposal" };
  }
}

export async function updateProposalAction(id: string, data: unknown) {
  try {
    // Validate with Zod
    const validationResult = updateProposalSchema.safeParse({ id, ...data });
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      };
    }

    // TODO: Get current user ID from auth context
    const createdById = "temp-user-id";

    const proposal = await updateProposal(id, validationResult.data, createdById);
    return { success: true, data: proposal };
  } catch (error) {
    console.error("Error updating proposal:", error);
    return { success: false, error: "Failed to update proposal" };
  }
}

export async function updateProposalStatusAction(id: string, data: unknown) {
  try {
    // Validate with Zod
    const validationResult = updateProposalStatusSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        details: validationResult.error.errors,
      };
    }

    const proposal = await updateProposalStatus(id, validationResult.data);
    return { success: true, data: proposal };
  } catch (error) {
    console.error("Error updating proposal status:", error);
    return { success: false, error: "Failed to update proposal status" };
  }
}

export async function deleteProposalAction(id: string) {
  try {
    await deleteProposal(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting proposal:", error);
    return { success: false, error: "Failed to delete proposal" };
  }
}

