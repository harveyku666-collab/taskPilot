# Qwen Handoff: TaskPilot Git Workspaces

## Handoff Package

```text
From Role: analyst
To Role: developer
Project: TaskPilot
Project Path: /Users/work/taskPilot
Module: Git Workspaces
Task: git-workspaces
Task Goal: Build the first database-backed Git workspace tracking flow so TaskPilot can record which task maps to which branch and worktree path.
Out of Scope:
- Real git worktree creation or deletion
- Merge orchestration
- Conflict handling
- Shell-driven Git automation
- Multi-repo support
- Full branch lifecycle management
Acceptance Criteria:
- A workspace data model exists and is tied to a task
- The model stores at least task id, branch name, worktree path, base branch, and status
- Demo data includes at least one representative workspace record
- A minimal UI exists to view workspace records
- A lightweight create path exists for workspace records
- The implementation remains MVP-sized and focused on tracking, not automation
- npm run lint passes
- npm run build passes
- npm run db:init works from a clean database
Suggested File Scope:
- src/db/schema.ts
- src/db/seed.ts
- src/app/*
- src/app/api/*
- src/components/*
- README.md
- drizzle/*
Worktree Path: /Users/work/taskPilot
Branch Name: main
Required Return:
- Changed files
- Implementation summary
- Risks
- Automated validation results
- Open questions
```

## Developer Instructions

This task should give TaskPilot its first durable record of Git workspace state without attempting to automate Git itself.

Implement a narrow MVP:

- add workspace storage tied to a task
- seed at least one representative workspace record
- expose a minimal UI to inspect workspace records
- add one small create path

Good MVP scope:

- workspace fields could include task id, branch name, worktree path, base branch, status, createdAt
- status can represent lifecycle like created, in_use, under_test, merged, archived
- UI can be a dedicated page or a simple section added to an existing planning page

Do not build:

- real worktree shell commands
- branch switching workflows
- merge or cleanup automation
- edit/delete flows for every entity

## Validation Expectations

Please run and report:

- lint
- build
- db:init
- workspace-flow

For `workspace-flow`, explain what records can now be created, how they are stored, and where they are shown in the UI.

## Return Format

```text
Developer Return
Task: git-workspaces
Changed Files:
Implementation Summary:
Risks:
Automated Validation:
- lint:
- build:
- db-init:
- workspace-flow:
Ready For Testing:
Open Questions:
```

## Paste-To-Qwen Prompt

```text
You are the developer role for TaskPilot.

Read these files first:
- /Users/work/taskPilot/docs/orchestration/project-initiation.md
- /Users/work/taskPilot/docs/orchestration/module-task-board.md
- /Users/work/taskPilot/docs/orchestration/handoffs/2026-05-11-qwen-task-007-git-workspaces.md

Implement only the git-workspaces task.

Constraints:
- Work only inside /Users/work/taskPilot
- Keep scope narrow
- Build the first durable Git workspace tracking flow
- Seed representative workspace data
- Add a minimal UI surface to inspect the data
- Add one lightweight create path
- Do not automate real Git worktree commands
- Keep the project buildable

When done, return:
- changed files
- implementation summary
- risks
- automated validation results
- open questions
```
