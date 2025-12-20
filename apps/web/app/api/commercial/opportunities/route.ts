import { NextRequest, NextResponse } from "next/server";
import { opportunitySchema } from "@nukleo/commercial/schemas";
import {
  getAllOpportunities,
  createOpportunity,
} from "@nukleo/commercial/services/opportunities";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const opportunities = await getAllOpportunities();
    return NextResponse.json({
      success: true,
      data: opportunities.map((opp: { id: string; title: string; description: string | null; value: unknown; stage: string; probability: number | null; expectedCloseDate: Date | null; company: unknown; contact: unknown; createdAt: Date; updatedAt: Date }) => ({
        id: opp.id,
        title: opp.title,
        description: opp.description,
        value: opp.value ? Number(opp.value) : null,
        stage: opp.stage,
        probability: opp.probability,
        expectedCloseDate: opp.expectedCloseDate,
        company: opp.company,
        contact: opp.contact,
        createdAt: opp.createdAt,
        updatedAt: opp.updatedAt,
      })),
    });
  } catch (error) {
    logger.error("Error fetching opportunities", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { success: false, error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validationResult = opportunitySchema.safeParse(body);
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

    return NextResponse.json(
      {
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
          createdAt: opportunity.createdAt,
          updatedAt: opportunity.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Error creating opportunity", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { success: false, error: "Failed to create opportunity" },
      { status: 500 }
    );
  }
}


