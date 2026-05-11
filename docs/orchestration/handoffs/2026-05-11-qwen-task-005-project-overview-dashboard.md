# Qwen Handoff: TaskPilot Project Overview Dashboard

## Handoff Package

```text
From Role: analyst
To Role: developer
Project: TaskPilot
Project Path: /Users/test/taskpilot
Module: Project Overview Dashboard
Task: project-overview-dashboard
Task Goal: Turn the Overview page into a real database-backed dashboard for the demo project using the planning and context-memory data already in the system.
Out of Scope:
- Advanced analytics
- Charts or heavy visualization libraries
- Multi-project selection
- Full audit log system
- Full activity event sourcing
- Complex filtering
Acceptance Criteria:
- Overview page loads real project summary data from the database
- Requirement, module, and task counts are real
- At least one progress summary is shown for modules or tasks
- Pending actions are derived from actual task/module states
- Recent activity is shown using a lightweight MVP approach
- Existing durable context memory remains visible and working
- npm run lint passes
- npm run build passes
- npm run db:init works from a clean database
Suggested File Scope:
- src/app/overview/page.tsx
- src/components/*
- src/db/seed.ts
- README.md
- src/lib/*
- src/db/schema.ts (only if absolutely needed)
Worktree Path: /Users/test/taskpilot
Branch Name: main
Required Return:
- Changed files
- Implementation summary
- Risks
- Automated validation results
- Open questions
```

## Developer Instructions

Use the current demo project data to replace the placeholder cards on the Overview page with real summaries.

Implement a narrow MVP:

- load the first project from the database
- load its requirements, modules, and tasks
- show real counts
- show a simple progress summary such as:
  - approved vs non-approved tasks
  - done vs not-done modules
  - grouped task statuses
- show pending actions using a simple interpretation of current states
- show recent activity using a lightweight approach

Reasonable lightweight options for recent activity:

- recent created entities ordered by created_at
- recently seeded or recently updated records
- latest tasks/modules/context memory entries

Do not build a full event log or audit trail in this task.

The existing context-memory card should remain part of the page and continue working.

## Validation Expectations

Please run and report:

- lint
- build
- db:init
- dashboard-flow

For `dashboard-flow`, explain what data is loaded and how the Overview page now reflects real project state.

## Return Format

```text
Developer Return
Task: project-overview-dashboard
Changed Files:
Implementation Summary:
Risks:
Automated Validation:
- lint:
- build:
- db-init:
- dashboard-flow:
Ready For Testing:
Open Questions:
```

## Paste-To-Qwen Prompt

```text
You are the developer role for TaskPilot.

Read these files first:
- /Users/test/taskpilot/docs/orchestration/project-initiation.md
- /Users/test/taskpilot/docs/orchestration/module-task-board.md
- /Users/test/taskpilot/docs/orchestration/handoffs/2026-05-11-qwen-task-005-project-overview-dashboard.md

Implement only the project-overview-dashboard task.

Constraints:
- Work only inside /Users/test/taskpilot
- Keep scope narrow
- Turn the Overview page into a real database-backed dashboard
- Use the existing demo project data
- Keep the context memory section working
- Do not build advanced analytics or a full event log
- Keep the project buildable

When done, return:
- changed files
- implementation summary
- risks
- automated validation results
- open questions
```
