import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// ============================================================
// Projects
// ============================================================

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  rootPath: text("root_path").notNull(),
  gitRepoPath: text("git_repo_path"),
  defaultBranch: text("default_branch").default("main"),
  status: text("status", {
    enum: ["draft", "planning", "active", "blocked", "completed", "archived"],
  }).default("draft"),
  currentPhase: text("current_phase"),
  description: text("description"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const projectsRelations = relations(projects, ({ many }) => ({
  modules: many(modules),
  requirements: many(requirements),
}));

// ============================================================
// Requirements
// ============================================================

export const requirements = sqliteTable("requirements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["draft", "active", "deprecated", "approved"],
  }).default("draft"),
  priority: text("priority", {
    enum: ["P0", "P1", "P2", "P3"],
  }).default("P1"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const requirementsRelations = relations(requirements, ({ one, many }) => ({
  project: one(projects, {
    fields: [requirements.projectId],
    references: [projects.id],
  }),
  modules: many(modules),
}));

// ============================================================
// Modules
// ============================================================

export const modules = sqliteTable("modules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id),
  requirementId: integer("requirement_id").references(() => requirements.id),
  name: text("name").notNull(),
  description: text("description"),
  priority: text("priority", {
    enum: ["P0", "P1", "P2", "P3"],
  }).default("P1"),
  status: text("status", {
    enum: [
      "not_started",
      "analyzing",
      "ready_for_dev",
      "in_development",
      "in_testing",
      "pending_acceptance",
      "done",
      "blocked",
    ],
  }).default("not_started"),
  sequence: integer("sequence").default(0),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const modulesRelations = relations(modules, ({ one, many }) => ({
  project: one(projects, {
    fields: [modules.projectId],
    references: [projects.id],
  }),
  requirement: one(requirements, {
    fields: [modules.requirementId],
    references: [requirements.id],
  }),
  tasks: many(tasks),
}));

// ============================================================
// Tasks
// ============================================================

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: integer("module_id")
    .notNull()
    .references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", {
    enum: [
      "draft",
      "ready",
      "assigned",
      "in_progress",
      "dev_done",
      "testing",
      "pending_acceptance",
      "approved",
      "rejected",
      "blocked",
      "closed",
    ],
  }).default("draft"),
  stage: text("stage", {
    enum: [
      "requirement_review",
      "task_split",
      "dev_handoff",
      "development",
      "auto_validation",
      "acceptance_review",
      "test_handoff",
      "testing",
      "final_acceptance",
      "done",
    ],
  }),
  assignedRole: text("assigned_role"),
  assignedTool: text("assigned_tool"),
  acceptanceCriteria: text("acceptance_criteria"),
  riskNotes: text("risk_notes"),
  priority: text("priority", {
    enum: ["P0", "P1", "P2", "P3"],
  }).default("P1"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  module: one(modules, {
    fields: [tasks.moduleId],
    references: [modules.id],
  }),
}));

// ============================================================
// Context Memories
// ============================================================

export const contextMemories = sqliteTable("context_memories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  projectId: integer("project_id")
    .notNull()
    .unique()
    .references(() => projects.id),
  summary: text("summary").notNull(),
  currentStatus: text("current_status").notNull(),
  blockers: text("blockers"),
  nextStep: text("next_step").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const contextMemoriesRelations = relations(contextMemories, ({ one }) => ({
  project: one(projects, {
    fields: [contextMemories.projectId],
    references: [projects.id],
  }),
}));

// ============================================================
// Handoffs
// ============================================================

export const handoffs = sqliteTable("handoffs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  fromRole: text("from_role").notNull(),
  toRole: text("to_role").notNull(),
  summary: text("summary").notNull(),
  status: text("status", {
    enum: ["pending", "in_review", "accepted", "rejected", "returned"],
  }).default("pending"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const handoffsRelations = relations(handoffs, ({ one, many }) => ({
  task: one(tasks, {
    fields: [handoffs.taskId],
    references: [tasks.id],
  }),
  acceptances: many(acceptances),
}));

// ============================================================
// Acceptances
// ============================================================

export const acceptances = sqliteTable("acceptances", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  handoffId: integer("handoff_id")
    .notNull()
    .references(() => handoffs.id),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  decision: text("decision", {
    enum: ["pending", "approved", "rejected"],
  }).default("pending"),
  notes: text("notes"),
  reviewerRole: text("reviewer_role"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const acceptancesRelations = relations(acceptances, ({ one }) => ({
  handoff: one(handoffs, {
    fields: [acceptances.handoffId],
    references: [handoffs.id],
  }),
  task: one(tasks, {
    fields: [acceptances.taskId],
    references: [tasks.id],
  }),
}));

// ============================================================
// Workspaces
// ============================================================

export const workspaces = sqliteTable("workspaces", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id),
  branchName: text("branch_name").notNull(),
  worktreePath: text("worktree_path").notNull(),
  baseBranch: text("base_branch").default("main"),
  status: text("status", {
    enum: ["created", "in_use", "under_test", "merged", "archived"],
  }).default("created"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const workspacesRelations = relations(workspaces, ({ one }) => ({
  task: one(tasks, {
    fields: [workspaces.taskId],
    references: [tasks.id],
  }),
}));
