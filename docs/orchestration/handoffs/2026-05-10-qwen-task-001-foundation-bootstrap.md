# Qwen Handoff: TaskPilot Foundation Bootstrap

## Handoff Package

```text
From Role: analyst
To Role: developer
Project: TaskPilot
Project Path: /Users/test/taskpilot
Module: Project Foundation
Task: foundation-bootstrap
Task Goal: Bootstrap the first working local TaskPilot application with a runnable web shell and the core dependencies needed for the MVP and upcoming context-memory feature.
Out of Scope:
- Full workflow automation
- Multi-user auth
- Production deployment
- Deep adapter integration
- Complete dashboard implementation
Acceptance Criteria:
- A local app skeleton exists in /Users/test/taskpilot
- The app can run locally
- The project uses Next.js + React
- Tailwind CSS is configured
- SQLite and Drizzle dependencies are added
- A basic app shell exists with placeholder pages or sections for Overview and Modules & Tasks
- A short setup note exists describing how to run the project locally
Suggested File Scope:
- package.json
- next.config.*
- app/*
- components/*
- lib/*
- drizzle/*
- README.md
Worktree Path: /Users/test/taskpilot
Branch Name: main (bootstrap stage; task branching can start after repo initialization)
Required Return:
- Changed files
- Implementation summary
- Risks
- Automated validation results
- Open questions
```

## Developer Instructions

Build only the bootstrap slice needed to start the project. Prefer simple, readable structure over premature abstractions.

Target stack:

- Next.js
- React
- Tailwind CSS
- SQLite
- Drizzle ORM

Expected initial app structure:

- a landing shell for TaskPilot
- a placeholder `Overview` section or route
- a placeholder `Modules & Tasks` section or route
- a small shared layout
- a base database config location

Do not attempt to implement the full orchestration workflow in this task.

## Validation Expectations

Please run and report:

- dependency install result
- local build result
- lint result if configured

If something is intentionally deferred, state it explicitly.

## Return Format

```text
Developer Return
Task: foundation-bootstrap
Changed Files:
Implementation Summary:
Risks:
Automated Validation:
- install:
- lint:
- build:
Ready For Testing:
Open Questions:
```

## Paste-To-Qwen Prompt

```text
You are the developer role for TaskPilot.

Read these files first:
- /Users/test/taskpilot/docs/orchestration/project-initiation.md
- /Users/test/taskpilot/docs/orchestration/module-task-board.md
- /Users/test/taskpilot/docs/orchestration/handoffs/2026-05-10-qwen-task-001-foundation-bootstrap.md

Implement only the `foundation-bootstrap` task.

Constraints:
- Work only inside /Users/test/taskpilot
- Keep scope narrow
- Use Next.js + React + Tailwind CSS
- Add SQLite and Drizzle dependencies for upcoming schema work
- Create a basic runnable shell with placeholder Overview and Modules & Tasks areas
- Add a short README section explaining how to run locally

When done, return:
- changed files
- implementation summary
- risks
- automated validation results
- open questions
```
