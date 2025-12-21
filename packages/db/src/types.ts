// Types-only exports (no Prisma client, safe for Client Components)
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

// Event types - matching Prisma schema
export type EventType = "MEETING" | "CALL" | "DEADLINE" | "REMINDER" | "TASK_DUE" | "PERSONAL" | "OTHER";
export type EventStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";


