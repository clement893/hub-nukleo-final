"use server";

import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  getAllCompanies,
} from "@nukleo/commercial";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function getContactsAction() {
  try {
    const contacts = await getAllContacts();
    return {
      success: true,
      data: contacts.map((contact) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        position: contact.position,
        company: contact.company,
      })),
    };
  } catch (error) {
    logger.error("Error fetching contacts", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to fetch contacts" };
  }
}

export async function getCompaniesAction() {
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

export async function createContactAction(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: string;
}) {
  try {
    const ownerId = await getCurrentUserId();
    const contact = await createContact({ ...data, ownerId });
    return { success: true, data: contact };
  } catch (error) {
    logger.error("Error creating contact", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to create contact" };
  }
}

export async function updateContactAction(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    position?: string;
    companyId?: string;
  }
) {
  try {
    const contact = await updateContact(id, data);
    return { success: true, data: contact };
  } catch (error) {
    logger.error("Error updating contact", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to update contact" };
  }
}

export async function deleteContactAction(id: string) {
  try {
    await deleteContact(id);
    return { success: true };
  } catch (error) {
    logger.error("Error deleting contact", error instanceof Error ? error : new Error(String(error)));
    return { success: false, error: "Failed to delete contact" };
  }
}


