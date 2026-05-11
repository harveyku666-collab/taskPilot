# Qwen Handoff: TaskPilot Context Memory Foundation

## Handoff Package

```text
From Role: analyst
To Role: developer
Project: TaskPilot
Project Path: /Users/test/taskpilot
Module: Context Memory Management
Task: context-memory-foundation
Task Goal: Implement the first durable context-memory feature so TaskPilot can store and display compact project memory outside the chat thread.
Out of Scope:
- Full task CRUD
- Full handoff system
- Multi-project dashboard polish
- Rich editing workflows
- Authentication or multi-user support
- Git worktree integration
Acceptance Criteria:
- A data model exists for project-scoped context memory
- The memory stores at least summary, current status, blockers, and next step
- A minimal UI exists to view the latest context memory for the demo project
- A basic create or update path exists for the context memory entry
- The feature is framed as durable context memory, not generic notes
- npm run lint passes
- npm run build passes
- npm run db:init still works from a clean database
Suggested File Scope:
- src/db/schema.ts
- src/db/seed.ts
- src/lib/db.ts
- src/app/overview/page.tsx
- src/app/modules/page.tsx (only if needed for navigation or context links)
- src/components/*
- README.md
- drizzle/*
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

This task should create the first durable memory primitive for TaskPilot.

Implement a narrow first version:

- Add a project-scoped context-memory data model
- Store a compact operational summary for a project
- Include fields for:
  - summary
  - current status
  - blockers
  - next step
- Ensure at least one project can show its latest context memory in the UI
- Provide a lightweight create or update path suitable for local development

Recommended direction:

- Add a new table such as `project_context_memories` or similarly clear naming
- Tie it to `projects`
- Keep only one current record per project for now, or define a simple latest-record convention
- Show the latest memory entry on the Overview page

Keep this task small. Do not build a full note-taking system.

## Validation Expectations

Please run and report:

- lint
- build
- db:init

If your create or update path is manual or dev-oriented, state exactly how it works.

## Return Format

```text
Developer Return
Task: context-memory-foundation
Changed Files:
Implementation Summary:
Risks:
Automated Validation:
- lint:
- build:
- db-init:
- memory-flow:
Ready For Testing:
Open Questions:
```

## Paste-To-Qwen Prompt

```text
You are the developer role for TaskPilot.

Read these files first:
- /Users/test/taskpilot/docs/orchestration/project-initiation.md
- /Users/test/taskpilot/docs/orchestration/module-task-board.md
- /Users/test/taskpilot/docs/orchestration/handoffs/2026-05-11-qwen-task-003-context-memory-foundation.md

Implement only the context-memory-foundation task.

Constraints:
- Work only inside /Users/test/taskpilot
- Keep scope narrow
- Build the first durable context-memory feature for TaskPilot
- Store at least summary, current status, blockers, and next step
- Make it project-scoped
- Show the latest context memory in the UI
- Provide a simple create or update path
- Do not build a full notes app or full orchestration engine
- Keep the project buildable

When done, return:
- changed files
- implementation summary
- risks
- automated validation results
- open questions
```
