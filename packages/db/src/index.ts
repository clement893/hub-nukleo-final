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
    // Only set datasource URL if it exists (not available during build)
    ...(process.env.DATABASE_URL && {
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Export commonly used types (re-exported from types.ts for convenience)
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
} from "./types";

