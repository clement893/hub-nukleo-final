"use server";

import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function getCompaniesListAction() {
  try {
    const companies = await getAllCompanies();
    return {
      success: true,
      data: companies.map((company: { id: string; name: string; industry: string | null; website: string | null; phone: string | null; city: string | null; country: string | null; logoKey: string | null }) => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        city: company.city,
        country: company.country,
        logoKey: company.logoKey,
      })),
    };
  } catch (error) {
    logger.error("Error fetching companies", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch companies" };
  }
}

export async function createCompanyAction(data: {
  name: string;
  industry?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}) {
  try {
    const ownerId = await getCurrentUserId();
    const company = await createCompany({ ...data, ownerId });
    return { success: true, data: company };
  } catch (error) {
    logger.error("Error creating company", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to create company" };
  }
}

export async function updateCompanyAction(
  id: string,
  data: {
    name?: string;
    industry?: string;
    website?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  }
) {
  try {
    const company = await updateCompany(id, data);
    return { success: true, data: company };
  } catch (error) {
    logger.error("Error updating company", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to update company" };
  }
}

export async function deleteCompanyAction(id: string) {
  try {
    await deleteCompany(id);
    return { success: true };
  } catch (error) {
    logger.error("Error deleting company", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to delete company" };
  }
}


