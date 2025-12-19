import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { companySchema } from "@nukleo/commercial/schemas";
import { prisma } from "@nukleo/db";
import {
  updateCompany,
  deleteCompany,
} from "@nukleo/commercial/services/companies";

export async function GET(
  _request: NextRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: {
          orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
        },
        opportunities: {
          include: {
            contact: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        owner: {
          select: { id: true, name: true },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        address: company.address,
        city: company.city,
        country: company.country,
        contacts: company.contacts.map((contact) => ({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          position: contact.position,
        })),
        opportunities: company.opportunities.map((opp) => ({
          id: opp.id,
          title: opp.title,
          value: opp.value ? Number(opp.value) : null,
          stage: opp.stage,
          contact: opp.contact
            ? `${opp.contact.firstName} ${opp.contact.lastName}`
            : null,
        })),
        owner: company.owner,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate with Zod (make fields optional for update)
    const validationResult = companySchema.partial().safeParse(body);
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

    const company = await updateCompany(id, {
      name: data.name,
      industry: data.industry,
      website: data.website,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        address: company.address,
        city: company.city,
        country: company.country,
        updatedAt: company.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update company" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteCompany(id);

    return NextResponse.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete company" },
      { status: 500 }
    );
  }
}

