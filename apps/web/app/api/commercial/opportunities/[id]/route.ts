import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { opportunitySchema } from "@nukleo/commercial/schemas";
import { prisma } from "@nukleo/db";
import {
  updateOpportunity,
  deleteOpportunity,
} from "@nukleo/commercial/services/opportunities";

export async function GET(
  _request: NextRequest, // eslint-disable-line @typescript-eslint/no-unused-vars
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        company: {
          select: { id: true, name: true },
        },
        contact: {
          select: { id: true, firstName: true, lastName: true },
        },
        owner: {
          select: { id: true, name: true },
        },
      },
    });

    if (!opportunity) {
      return NextResponse.json(
        { success: false, error: "Opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: opportunity.id,
        title: opportunity.title,
        description: opportunity.description,
        value: opportunity.value ? Number(opportunity.value) : null,
        stage: opportunity.stage,
        probability: opportunity.probability,
        expectedCloseDate: opportunity.expectedCloseDate,
        actualCloseDate: opportunity.actualCloseDate,
        company: opportunity.company,
        contact: opportunity.contact,
        owner: opportunity.owner,
        createdAt: opportunity.createdAt,
        updatedAt: opportunity.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch opportunity" },
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
    const validationResult = opportunitySchema.partial().safeParse(body);
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

    const opportunity = await updateOpportunity(id, {
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
    });

    return NextResponse.json({
      success: true,
      data: {
        id: opportunity.id,
        title: opportunity.title,
        description: opportunity.description,
        value: opportunity.value ? Number(opportunity.value) : null,
        stage: opportunity.stage,
        probability: opportunity.probability,
        expectedCloseDate: opportunity.expectedCloseDate,
        companyId: opportunity.companyId,
        contactId: opportunity.contactId,
        updatedAt: opportunity.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update opportunity" },
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
    await deleteOpportunity(id);

    return NextResponse.json({
      success: true,
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete opportunity" },
      { status: 500 }
    );
  }
}

