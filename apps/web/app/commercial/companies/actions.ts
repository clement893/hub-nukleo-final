"use server";

import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@nukleo/commercial";

export async function getCompaniesListAction() {
  try {
    const companies = await getAllCompanies();
    return {
      success: true,
      data: companies.map((company) => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        city: company.city,
        country: company.country,
      })),
    };
  } catch (error) {
    console.error("Error fetching companies:", error);
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
    // TODO: Get current user ID from auth context
    const ownerId = "temp-user-id";
    const company = await createCompany({ ...data, ownerId });
    return { success: true, data: company };
  } catch (error) {
    console.error("Error creating company:", error);
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
    console.error("Error updating company:", error);
    return { success: false, error: "Failed to update company" };
  }
}

export async function deleteCompanyAction(id: string) {
  try {
    await deleteCompany(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { success: false, error: "Failed to delete company" };
  }
}

