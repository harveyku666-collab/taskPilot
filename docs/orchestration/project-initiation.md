# TaskPilot Project Initiation

## Project Initiation Card

```text
Project Initiation Card
Project: TaskPilot
Root Path: /Users/work/taskPilot
Git Repo Path: /Users/work/taskPilot
Default Branch: main
Current Requirement: Build a local-first web system for multi-AI software delivery orchestration with project overview, requirement decomposition, task tracking, Git worktree management, structured handoffs, validation tracking, and human acceptance gates.
Role Mapping:
- analyst: Codex
- developer: Qwen
- tester: Qwen
Current Goal: Create the MVP foundation so the system can store projects, modules, and tasks, and show them in a local web dashboard.
Out of Scope: Deep Cursor/Qwen automation, production deployment, multi-user auth, cloud sync, advanced analytics, CI/CD integration.
Approval Needed From Human Owner: Approved in chat on 2026-05-10.
```

## Working Assumptions

- The project starts as a standalone local web application.
- The first implementation target is the MVP architecture from the design spec.
- Git worktree and branch support will be added as a first-class capability, but the first development task is bootstrap and data foundation.
- The developer role is currently mapped to Qwen, but workflow artifacts must stay tool-agnostic where possible.

## Initial Technical Direction

- Frontend: Next.js + React
- UI: Tailwind CSS + shadcn/ui
- Database: SQLite
- ORM: Drizzle ORM
- Local orchestration: Node.js + Git CLI

## Next Action

Dispatch order:

- Module: Project Foundation
- Task 1: foundation-bootstrap
- Task 2: foundation-schema
- Task 3: context-memory-foundation
