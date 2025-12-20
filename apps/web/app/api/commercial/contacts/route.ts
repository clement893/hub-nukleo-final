import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@nukleo/commercial/schemas";
import {
  getAllContacts,
  createContact,
} from "@nukleo/commercial/services/contacts";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const contacts = await getAllContacts();
    return NextResponse.json({
      success: true,
      data: contacts.map((contact: { id: string; firstName: string | null; lastName: string | null; email: string | null; phone: string | null; position: string | null; company: unknown; createdAt: Date; updatedAt: Date }) => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        position: contact.position,
        company: contact.company,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      })),
    });
  } catch (error) {
    logger.error("Error fetching contacts", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { success: false, error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    const ownerId = await getCurrentUserId();

    const contact = await createContact({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      position: data.position,
      companyId: data.companyId,
      ownerId,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          position: contact.position,
          companyId: contact.companyId,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating contact", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { success: false, error: "Failed to create contact" },
      { status: 500 }
    );
  }
}


