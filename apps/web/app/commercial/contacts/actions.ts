"use server";

import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
  getAllCompanies,
} from "@nukleo/commercial";

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
    console.error("Error fetching contacts:", error);
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
    console.error("Error fetching companies:", error);
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
    // TODO: Get current user ID from auth context
    const ownerId = "temp-user-id";
    const contact = await createContact({ ...data, ownerId });
    return { success: true, data: contact };
  } catch (error) {
    console.error("Error creating contact:", error);
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
    console.error("Error updating contact:", error);
    return { success: false, error: "Failed to update contact" };
  }
}

export async function deleteContactAction(id: string) {
  try {
    await deleteContact(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { success: false, error: "Failed to delete contact" };
  }
}


