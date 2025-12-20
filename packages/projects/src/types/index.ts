import type { Project, Task, TimeEntry, User } from "@nukleo/db";

// Project types
export type ProjectWithRelations = Project & {
  company: {
    id: string;
    name: string;
    logoKey: string | null;
  } | null;
  manager: {
    id: string;
    name: string | null;
    email: string | null;
  };
  _count: {
    tasks: number;
  };
};

export type ProjectCreateInput = {
  name: string;
  description?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  companyId?: string;
  managerId: string;
  // Additional fields from Airtable
  team?: string;
  stage?: string;
  billingStatus?: string;
  lead?: string;
  contactMethod?: string;
  hourlyRate?: number;
  proposalUrl?: string;
  driveUrl?: string;
  asanaUrl?: string;
  slackUrl?: string;
  projectType?: string;
  year?: string;
  brief?: string;
  testimony?: string;
  portfolio?: string;
  report?: string;
  communication?: string;
  departments?: string;
};

export type ProjectUpdateInput = Partial<ProjectCreateInput>;

// Task types
export type TaskWithRelations = Task & {
  project: {
    id: string;
    name: string;
  };
  assignee: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export type TaskCreateInput = {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
  projectId: string;
  assigneeId?: string;
};

export type TaskUpdateInput = Partial<TaskCreateInput>;

// Milestone types
export type Milestone = {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  progress: number;
  deliverables?: string[];
  order: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MilestoneCreateInput = {
  title: string;
  description?: string;
  startDate?: Date;
  dueDate?: Date;
  deliverables?: string[];
  projectId: string;
  order: number;
};

export type MilestoneUpdateInput = Partial<MilestoneCreateInput> & {
  status?: "pending" | "in_progress" | "completed";
  progress?: number;
};

// Team types
export type TeamMember = {
  id: string;
  userId: string;
  projectId: string;
  role: "manager" | "member" | "viewer";
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  createdAt: Date;
};

export type TeamMemberCreateInput = {
  userId: string;
  projectId: string;
  role: "manager" | "member" | "viewer";
};

// Time Entry types
export type TimeEntryWithRelations = TimeEntry & {
  task: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
};

export type TimeEntryCreateInput = {
  hours: number;
  description?: string;
  date: Date;
  taskId: string;
  userId: string;
};
