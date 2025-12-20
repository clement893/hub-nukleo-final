import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@nukleo/db";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

/**
 * POST /api/contacts/import
 * Import multiple contacts into the database
 * 
 * Body format:
 * {
 *   contacts: [
 *     {
 *       firstName: string (required)
 *       lastName: string (required)
 *       email?: string
 *       phone?: string
 *       position?: string
 *       companyName?: string (will create company if doesn't exist)
 *       companyId?: string (if company already exists)
 *     }
 *   ],
 *   skipDuplicates?: boolean (default: true) - Skip contacts with same email
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const ownerId = await getCurrentUserId();

    const body = await request.json();
    const { contacts, skipDuplicates = true } = body;

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: "contacts must be a non-empty array" },
        { status: 400 }
      );
    }

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      errors: [] as Array<{ index: number; error: string }>,
      created: [] as Array<{ id: string; firstName: string; lastName: string }>,
    };

    // Process contacts in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (contact: any, index: number) => {
          const globalIndex = i + index;

          try {
            // Validate required fields
            if (!contact.firstName || !contact.lastName) {
              results.failed++;
              results.errors.push({
                index: globalIndex,
                error: "firstName and lastName are required",
              });
              return;
            }

            // Check for duplicate email if skipDuplicates is true
            if (skipDuplicates && contact.email) {
              const existing = await prisma.contact.findFirst({
                where: {
                  email: contact.email,
                  ownerId,
                },
              });

              if (existing) {
                results.skipped++;
                logger.info("Skipped duplicate contact", { email: contact.email });
                return;
              }
            }

            // Handle company
            let companyId: string | undefined = contact.companyId;

            if (!companyId && contact.companyName) {
              // Try to find existing company by name
              const existingCompany = await prisma.company.findFirst({
                where: {
                  name: contact.companyName,
                  ownerId,
                },
              });

              if (existingCompany) {
                companyId = existingCompany.id;
              } else {
                // Create new company
                const newCompany = await prisma.company.create({
                  data: {
                    name: contact.companyName,
                    ownerId,
                  },
                });
                companyId = newCompany.id;
                logger.info("Created new company during import", {
                  companyId: newCompany.id,
                  name: contact.companyName,
                });
              }
            }

            // Create contact
            const created = await prisma.contact.create({
              data: {
                firstName: contact.firstName.trim(),
                lastName: contact.lastName.trim(),
                email: contact.email?.trim() || null,
                phone: contact.phone?.trim() || null,
                position: contact.position?.trim() || null,
                companyId: companyId || null,
                ownerId,
              },
            });

            results.success++;
            results.created.push({
              id: created.id,
              firstName: created.firstName,
              lastName: created.lastName,
            });

            logger.info("Contact imported successfully", {
              contactId: created.id,
              email: created.email,
            });
          } catch (error) {
            results.failed++;
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            results.errors.push({
              index: globalIndex,
              error: errorMessage,
            });
            logger.error("Error importing contact", error instanceof Error ? error : new Error(String(error)), {
              index: globalIndex,
              contact: contact.firstName + " " + contact.lastName,
            });
          }
        })
      );
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: contacts.length,
        success: results.success,
        failed: results.failed,
        skipped: results.skipped,
      },
      created: results.created,
      errors: results.errors.length > 0 ? results.errors : undefined,
    });
  } catch (error) {
    logger.error("Error in contacts import", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to import contacts",
      },
      { status: 500 }
    );
  }
}


