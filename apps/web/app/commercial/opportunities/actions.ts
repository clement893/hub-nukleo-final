"use server";

import {
  getAllOpportunities,
  updateOpportunityStage,
  createOpportunity,
  updateOpportunity,
  getAllCompanies,
  getAllContacts,
} from "@nukleo/commercial";

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
    console.error("Error fetching opportunities:", error);
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
    console.error("Error fetching companies:", error);
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
    console.error("Error fetching contacts:", error);
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
    console.error("Error updating opportunity stage:", error);
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
    // TODO: Get current user ID from auth context
    const ownerId = "temp-user-id";
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
    return { success: true, data: opportunity };
  } catch (error) {
    console.error("Error creating opportunity:", error);
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
    return { success: true };
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return { success: false, error: "Failed to update opportunity" };
  }
}

