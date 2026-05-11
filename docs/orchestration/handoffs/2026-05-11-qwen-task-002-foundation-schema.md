# Qwen Handoff: TaskPilot Foundation Schema

## Handoff Package

```text
From Role: analyst
To Role: developer
Project: TaskPilot
Project Path: /Users/test/taskpilot
Module: Project Foundation
Task: foundation-schema
Task Goal: Replace the placeholder SQLite and Drizzle schema with a concrete first-pass schema for projects, modules, and tasks, and leave the project in a buildable state.
Out of Scope:
- Full CRUD implementation
- UI wiring to real database data
- Requirement versioning tables
- Handoff tables
- Acceptance log tables
- Context-memory feature implementation
Acceptance Criteria:
- projects table has concrete first-pass columns for project identity and status
- modules table has concrete first-pass columns and a foreign key to projects
- tasks table has concrete first-pass columns and a foreign key to modules
- Field names are sensible for the current TaskPilot design
- The Drizzle schema remains compatible with the existing drizzle.config.ts
- A migration generation path is documented and works with the current setup
- A lightweight seed or sample-data path exists
- npm run lint passes
- npm run build passes
Suggested File Scope:
- src/db/schema.ts
- src/lib/db.ts
- drizzle.config.ts
- drizzle/*
- README.md
- package.json (only if a script must be added)
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

This task is about establishing the first real data foundation for TaskPilot, not building full app features.

Please implement:

- concrete columns for `projects`
- concrete columns for `modules`
- concrete columns for `tasks`
- sensible statuses and basic sequencing fields where needed
- foreign keys that match the current design direction

Keep the design modest and practical. Do not over-model the system yet.

Recommended first-pass direction:

- `projects`: name, root path, git repo path, default branch, status, current phase, timestamps
- `modules`: project id, name, description, priority, status, sequence, timestamps
- `tasks`: module id, title, description, status, stage, assigned role, assigned tool, acceptance criteria, risk notes, timestamps

For migration and seed support:

- keep Drizzle configuration compatible
- add the smallest useful script or documented command path for generating migrations
- add a lightweight seed or sample-data path if practical

Do not implement:

- extra tables outside this task unless absolutely required
- UI data fetching
- complex relation helpers that are not yet needed
- requirement-versioning tables

## Validation Expectations

Please run and report:

- lint
- build
- migration generation command or equivalent schema validation command

If any part is documented rather than fully automated, state that clearly.

## Return Format

```text
Developer Return
Task: foundation-schema
Changed Files:
Implementation Summary:
Risks:
Automated Validation:
- lint:
- build:
- migration:
- seed:
Ready For Testing:
Open Questions:
```

## Paste-To-Qwen Prompt

```text
You are the developer role for TaskPilot.

Read these files first:
- /Users/test/taskpilot/docs/orchestration/project-initiation.md
- /Users/test/taskpilot/docs/orchestration/module-task-board.md
- /Users/test/taskpilot/docs/orchestration/handoffs/2026-05-11-qwen-task-002-foundation-schema.md

Implement only the foundation-schema task.

Constraints:
- Work only inside /Users/test/taskpilot
- Keep scope narrow
- Replace the placeholder Drizzle schema with a concrete first-pass schema for projects, modules, and tasks
- Keep the schema aligned with the current TaskPilot design direction
- Do not implement full CRUD or full orchestration features
- Keep the project buildable
- Update README or scripts only where needed to support migration or seed workflow

When done, return:
- changed files
- implementation summary
- risks
- automated validation results
- open questions
```
