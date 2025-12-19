import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export all Prisma types
export * from "@prisma/client";

// Export commonly used types
export type {
  User,
  Opportunity,
  Contact,
  Company,
  Project,
  Task,
  Role,
  OpportunityStage,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
} from "@prisma/client";

