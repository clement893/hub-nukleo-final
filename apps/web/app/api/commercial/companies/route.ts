import { NextRequest, NextResponse } from "next/server";
import { companySchema } from "@nukleo/commercial/schemas";
import {
  getAllCompanies,
  createCompany,
} from "@nukleo/commercial/services/companies";

export async function GET() {
  try {
    const companies = await getAllCompanies();
    return NextResponse.json({
      success: true,
      data: companies.map((company) => ({
        id: company.id,
        name: company.name,
        industry: company.industry,
        website: company.website,
        phone: company.phone,
        address: company.address,
        city: company.city,
        country: company.country,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = companySchema.safeParse(body);
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

    // TODO: Get current user ID from auth context
    const ownerId = "temp-user-id"; // Replace with actual user ID

    const company = await createCompany({
      name: data.name,
      industry: data.industry,
      website: data.website,
      phone: data.phone,
      address: data.address,
      city: data.city,
      country: data.country,
      ownerId,
    });

    return NextResponse.json(
      {
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
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create company" },
      { status: 500 }
    );
  }
}


