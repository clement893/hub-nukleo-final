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

// Event types (temporary until Event model is added to schema)
export type EventType = "MEETING" | "TASK" | "REMINDER" | "OTHER";
export type EventStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";


