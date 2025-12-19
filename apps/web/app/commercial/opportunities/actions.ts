"use server";

import {
  getAllOpportunities,
  updateOpportunityStage,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getAllCompanies,
  getAllContacts,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";

export async function getOpportunitiesAction() {
  try {
    const opportunities = await getAllOpportunities();
    return {
      success: true,
      data: opportunities.map((opp) => ({
        id: opp.id,
        title: opp.title,
        description: opp.description,
        value: opp.value ? Number(opp.value) : null,
        stage: opp.stage,
        probability: opp.probability,
        expectedCloseDate: opp.expectedCloseDate,
        company: opp.company,
        contact: opp.contact,
      })),
    };
  } catch (error) {
    logger.error("Error fetching opportunities", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch opportunities" };
  }
}

export async function getCompaniesForOpportunitiesAction() {
  try {
    const companies = await getAllCompanies();
    return {
      success: true,
      data: companies.map((c) => ({ id: c.id, name: c.name })),
    };
  } catch (error) {
    logger.error("Error fetching companies", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch companies" };
  }
}

export async function getContactsForOpportunitiesAction() {
  try {
    const contacts = await getAllContacts();
    return {
      success: true,
      data: contacts.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
      })),
    };
  } catch (error) {
    logger.error("Error fetching contacts", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function updateOpportunityStageAction(
  id: string,
  stage: string
) {
  try {
    await updateOpportunityStage(id, stage);
    return { success: true };
  } catch (error) {
    logger.error("Error updating opportunity stage", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to update opportunity stage" };
  }
}

export async function createOpportunityAction(data: {
  title: string;
  description?: string;
  value?: number;
  stage: string;
  probability?: number;
  expectedCloseDate?: string;
  companyId?: string;
  contactId?: string;
}) {
  try {
    const ownerId = await getCurrentUserId();
    const opportunity = await createOpportunity({
      title: data.title,
      description: data.description,
      value: data.value,
      stage: data.stage,
      probability: data.probability,
      expectedCloseDate: data.expectedCloseDate
        ? new Date(data.expectedCloseDate)
        : undefined,
      companyId: data.companyId,
      contactId: data.contactId,
      ownerId,
    });
    revalidatePath("/commercial/opportunities");
    return { success: true, data: opportunity };
  } catch (error) {
    logger.error("Error creating opportunity", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to create opportunity" };
  }
}

export async function updateOpportunityAction(
  id: string,
  data: {
    title?: string;
    description?: string;
    value?: number;
    stage?: string;
    probability?: number;
    expectedCloseDate?: string;
    companyId?: string;
    contactId?: string;
  }
) {
  try {
    await updateOpportunity(id, {
      ...data,
      expectedCloseDate: data.expectedCloseDate
        ? new Date(data.expectedCloseDate)
        : undefined,
    });
    revalidatePath("/commercial/opportunities");
    return { success: true };
  } catch (error) {
    logger.error("Error updating opportunity", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to update opportunity" };
  }
}

export async function deleteOpportunityAction(id: string) {
  try {
    await deleteOpportunity(id);
    revalidatePath("/commercial/opportunities");
    return { success: true };
  } catch (error) {
    logger.error("Error deleting opportunity", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to delete opportunity" };
  }
}

