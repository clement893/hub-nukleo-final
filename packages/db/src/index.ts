import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma reads DATABASE_URL from process.env automatically
// During build, DATABASE_URL may not be available, so we provide a dummy value
// This won't be used during build as pages using Prisma are marked as dynamic
const getPrismaClient = () => {
  // If DATABASE_URL is not set (e.g., during build), provide a dummy value
  // Prisma will still validate the connection string format, but won't connect
  const databaseUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@dummy:5432/dummy";
  
  // Parse DATABASE_URL to add connection pool parameters if not already present
  // This helps prevent connection exhaustion on Railway PostgreSQL
  let finalDatabaseUrl = databaseUrl;
  
  // Only modify if it's a real URL (not the dummy one) and doesn't already have params
  if (databaseUrl !== "postgresql://dummy:dummy@dummy:5432/dummy" && !databaseUrl.includes("?")) {
    try {
      const url = new URL(databaseUrl);
      url.searchParams.set("connection_limit", "10");
      url.searchParams.set("pool_timeout", "10");
      url.searchParams.set("connect_timeout", "10");
      finalDatabaseUrl = url.toString();
    } catch (e) {
      // If URL parsing fails, use original URL
      finalDatabaseUrl = databaseUrl;
    }
  }
  
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: finalDatabaseUrl,
      },
    },
  });
};

export const prisma =
  globalForPrisma.prisma ?? getPrismaClient();

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

