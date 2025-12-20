"use server";

import {
  getAllContacts,
  getAllCompanies,
} from "@nukleo/commercial";
import { logger } from "@/lib/logger";

export interface UnifiedSearchResult {
  contacts: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    phone?: string | null;
    position?: string | null;
    photoKey?: string | null;
    company?: { id: string; name: string } | null;
  }>;
  companies: Array<{
    id: string;
    name: string;
    industry?: string | null;
    website?: string | null;
    phone?: string | null;
    city?: string | null;
    country?: string | null;
    logoKey?: string | null;
  }>;
}

export async function unifiedSearchAction(searchTerm: string): Promise<{
  success: boolean;
  data?: UnifiedSearchResult;
  error?: string;
}> {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return {
        success: true,
        data: {
          contacts: [],
          companies: [],
        },
      };
    }

    const term = searchTerm.toLowerCase().trim();

    // Fetch all contacts and companies
    const [allContacts, allCompanies] = await Promise.all([
      getAllContacts(),
      getAllCompanies(),
    ]);

    // Filter contacts - search in all fields
    const filteredContacts = allContacts
      .filter((contact) => {
        const firstName = contact.firstName?.toLowerCase() || "";
        const lastName = contact.lastName?.toLowerCase() || "";
        const email = contact.email?.toLowerCase() || "";
        const phone = contact.phone?.toLowerCase() || "";
        const position = contact.position?.toLowerCase() || "";
        const companyName = contact.company?.name?.toLowerCase() || "";

        return (
          firstName.includes(term) ||
          lastName.includes(term) ||
          `${firstName} ${lastName}`.includes(term) ||
          email.includes(term) ||
          phone.includes(term) ||
          position.includes(term) ||
          companyName.includes(term)
        );
      })
      .map((contact) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        position: contact.position,
        photoKey: contact.photoKey,
        company: contact.company,
      }));

    // Filter companies - search in all fields
    const filteredCompanies = allCompanies
      .filter((company) => {
        const name = company.name?.toLowerCase() || "";
        const industry = company.industry?.toLowerCase() || "";
        const website = company.website?.toLowerCase() || "";
        const phone = company.phone?.toLowerCase() || "";
        const city = company.city?.toLowerCase() || "";
        const country = company.country?.toLowerCase() || "";

        return (
          name.includes(term) ||
          industry.includes(term) ||
          website.includes(term) ||
          phone.includes(term) ||
          city.includes(term) ||
          country.includes(term) ||
          `${city} ${country}`.includes(term)
        );
      })
      .map((company) => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        city: company.city,
        country: company.country,
        logoKey: company.logoKey,
      }));

    return {
      success: true,
      data: {
        contacts: filteredContacts,
        companies: filteredCompanies,
      },
    };
  } catch (error) {
    logger.error("Error in unified search", error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: "Failed to perform search",
    };
  }
}

