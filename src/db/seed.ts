/**
 * TaskPilot Seed Script
 * 
 * Usage: npm run db:seed
 * 
 * This script populates the database with sample data for development.
 * Run `npm run db:push` first to ensure tables exist.
 */

import { db } from "@/lib/db";
import { projects, requirements, modules, tasks, contextMemories, handoffs, acceptances, workspaces } from "@/db/schema";

async function seed() {
  console.log("🌱 Seeding TaskPilot database...");

  // Seed a sample project
  const [sampleProject] = await db
    .insert(projects)
    .values({
      name: "TaskPilot Demo",
      rootPath: "/Users/work/taskPilot",
      gitRepoPath: "/Users/work/taskPilot",
      defaultBranch: "main",
      status: "active",
      currentPhase: "foundation",
      description: "Demo project for TaskPilot development",
    })
    .returning();

  console.log(`✅ Created project: ${sampleProject.name} (id: ${sampleProject.id})`);

  // Seed a requirement for the demo project
  const [requirement1] = await db
    .insert(requirements)
    .values({
      projectId: sampleProject.id,
      title: "Multi-AI Orchestration Foundation",
      description: "Build a local control tower for multi-AI software delivery with project initiation, requirement decomposition, task orchestration, and structured handoffs.",
      status: "active",
      priority: "P0",
    })
    .returning();

  console.log(`✅ Created requirement: ${requirement1.title} (id: ${requirement1.id})`);

  // Seed sample modules linked to the requirement
  const [module1] = await db
    .insert(modules)
    .values({
      projectId: sampleProject.id,
      requirementId: requirement1.id,
      name: "Project Foundation",
      description: "Bootstrap the local web app, base database setup, and shared app structure.",
      priority: "P0",
      status: "in_development",
      sequence: 1,
    })
    .returning();

  const [module2] = await db
    .insert(modules)
    .values({
      projectId: sampleProject.id,
      requirementId: requirement1.id,
      name: "Context Memory Management",
      description: "Move long-lived project memory out of chat context and into durable app state.",
      priority: "P0",
      status: "ready_for_dev",
      sequence: 2,
    })
    .returning();

  console.log(`✅ Created module: ${module1.name} (id: ${module1.id})`);
  console.log(`✅ Created module: ${module2.name} (id: ${module2.id})`);

  // Seed sample tasks
  const taskData: (typeof tasks.$inferInsert)[] = [
    {
      moduleId: module1.id,
      title: "foundation-bootstrap",
      description: "Initialize the app shell, core dependencies, and base layout.",
      status: "approved",
      stage: "final_acceptance",
      assignedRole: "developer",
      assignedTool: "Qwen",
      acceptanceCriteria: "App runs locally, base layout loads, core dependencies installed",
      priority: "P0",
    },
    {
      moduleId: module1.id,
      title: "foundation-schema",
      description: "Add the first SQLite and Drizzle schema for projects, modules, and tasks.",
      status: "in_progress",
      stage: "development",
      assignedRole: "developer",
      assignedTool: "Qwen",
      acceptanceCriteria: "Schema exists, migration path defined, seed data path exists",
      priority: "P0",
    },
    {
      moduleId: module2.id,
      title: "context-memory-foundation",
      description: "Implement the first durable context layer for compact project memory.",
      status: "draft",
      stage: "requirement_review",
      assignedRole: "developer",
      assignedTool: "Qwen",
      acceptanceCriteria: "Data model exists, minimal UI exists, basic CRUD path exists",
      priority: "P0",
    },
  ];

  for (const task of taskData) {
    const [inserted] = await db.insert(tasks).values(task).returning();
    console.log(`✅ Created task: ${inserted.title} (id: ${inserted.id})`);
  }

  // Seed context memory for the demo project
  const [contextMemory] = await db
    .insert(contextMemories)
    .values({
      projectId: sampleProject.id,
      summary: "TaskPilot foundation phase complete. Bootstrap and schema tasks approved. Context memory feature in development.",
      currentStatus: "active",
      blockers: "None at this time.",
      nextStep: "Implement context memory UI and API routes for create/update.",
    })
    .returning();

  console.log(`✅ Created context memory for project (id: ${contextMemory.id})`);

  // Seed a representative handoff for the first task
  const firstTask = taskData.length > 0 ? await db.select().from(tasks).limit(1) : [];
  if (firstTask.length > 0) {
    const [handoff1] = await db
      .insert(handoffs)
      .values({
        taskId: firstTask[0].id,
        fromRole: "developer",
        toRole: "tester",
        summary: "Handing off foundation-bootstrap task for validation. Schema and UI shell are ready.",
        status: "in_review",
      })
      .returning();

    console.log(`✅ Created handoff for task ${firstTask[0].title} (id: ${handoff1.id})`);

    // Seed an acceptance record for this handoff
    const [acceptance1] = await db
      .insert(acceptances)
      .values({
        handoffId: handoff1.id,
        taskId: firstTask[0].id,
        decision: "approved",
        notes: "Build passes, lint passes, db-init works. Ready for merge.",
        reviewerRole: "tester",
      })
      .returning();

    console.log(`✅ Created acceptance record (id: ${acceptance1.id})`);

    // Seed a representative workspace for the first task
    const [workspace1] = await db
      .insert(workspaces)
      .values({
        taskId: firstTask[0].id,
        branchName: "feat/foundation-bootstrap",
        worktreePath: "/Users/work/taskPilot/.worktrees/foundation-bootstrap",
        baseBranch: "main",
        status: "merged",
      })
      .returning();

    console.log(`✅ Created workspace for task ${firstTask[0].title} (id: ${workspace1.id})`);
  }

  console.log("\n✨ Seeding complete!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
