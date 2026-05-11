# TaskPilot Module And Task Board

## Requirement Version

- `v1`

## Project Goal

Build TaskPilot as a local control tower for multi-AI software delivery, with project initiation, requirement decomposition, task orchestration, Git worktree tracking, structured handoffs, validation evidence, and human acceptance.

## Module Tree

### Module 1: Project Foundation

- Description: Bootstrap the local web app, base database setup, and shared app structure.
- Priority: P0
- Status: done

Tasks:

1. `foundation-bootstrap`
- Goal: Initialize the app shell, core dependencies, and base layout.
- Depends On: none
- Priority: P0
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - App runs locally
  - Base layout loads
  - Core dependencies are installed and configured

2. `foundation-schema`
- Goal: Add the first SQLite and Drizzle schema for projects, modules, and tasks.
- Depends On: foundation-bootstrap
- Priority: P0
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - `projects`, `modules`, and `tasks` tables have concrete first-pass columns
  - Table relations and foreign keys are defined where appropriate
  - A migration generation path is documented and works with the current Drizzle config
  - A simple seed or sample-data path exists, even if it is lightweight
  - Existing app still builds after schema changes

### Module 2: Context Memory Management

- Description: Move long-lived project memory out of chat context and into durable app state, structured summaries, and handoff records.
- Priority: P0
- Status: done

Tasks:

1. `context-memory-foundation`
- Goal: Implement the first durable context layer so TaskPilot can store and display compact project memory outside the chat thread.
- Depends On: foundation-bootstrap, foundation-schema
- Priority: P0
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - A data model exists for durable project context memory tied to a project
  - The stored memory captures at least summary, current status, blockers, and next step
  - A minimal UI exists to view the latest project context memory
  - A basic create or update path exists for the memory entry
  - The feature is explicitly positioned as durable context memory, not generic notes
  - Existing app still passes lint and build

### Module 3: Requirement And Task Management

- Description: Store requirements, modules, and tasks and expose them through basic CRUD flows.
- Priority: P0
- Status: done

Tasks:

1. `requirement-and-task-management`
- Goal: Build the first real requirement, module, and task management flow so TaskPilot can display and edit core project planning data from the database.
- Depends On: foundation-bootstrap, foundation-schema, context-memory-foundation
- Priority: P0
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - Requirements can be stored and read from the database
  - Modules and tasks can be loaded from the database instead of hardcoded placeholders
  - The Modules & Tasks page shows real module and task data for the demo project
  - A minimal create path exists for at least one planning entity
  - The implementation stays within MVP scope and does not attempt full orchestration yet
  - npm run lint passes
  - npm run build passes
  - npm run db:init still works from a clean database

### Module 4: Project Overview Dashboard

- Description: Show project summary, module progress, task progress, pending actions, and recent activity.
- Priority: P0
- Status: done

Tasks:

1. `project-overview-dashboard`
- Goal: Turn the Overview page into a real database-backed project dashboard that summarizes the demo project's requirements, modules, tasks, progress, pending actions, and recent activity.
- Depends On: foundation-bootstrap, foundation-schema, context-memory-foundation, requirement-and-task-management
- Priority: P0
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - Overview page loads real project summary data from the database
  - Counts for requirements, modules, and tasks are real rather than placeholders
  - At least one simple progress summary is shown for modules or tasks
  - Pending actions are derived from real task or module states
  - Recent activity is shown through a lightweight, reasonable MVP approach
  - Existing context memory section continues to work
  - npm run lint passes
  - npm run build passes
  - npm run db:init works from a clean database

### Module 5: Handoffs And Acceptance

- Description: Track developer and tester handoffs, returns, validation summaries, and acceptance decisions.
- Priority: P1
- Status: done

Tasks:

1. `handoffs-and-acceptance`
- Goal: Build the first database-backed handoff and acceptance tracking flow so TaskPilot can store task handoffs, validation summaries, and human acceptance decisions.
- Depends On: foundation-bootstrap, foundation-schema, context-memory-foundation, requirement-and-task-management, project-overview-dashboard
- Priority: P1
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - A data model exists for handoffs between roles
  - A data model exists for acceptance decisions or logs
  - Demo data includes at least one representative handoff and one acceptance entry
  - A minimal UI surface exists to view handoff and acceptance data
  - A lightweight create path exists for at least one of these records
  - The implementation stays MVP-sized and does not attempt full workflow automation
  - npm run lint passes
  - npm run build passes
  - npm run db:init works from a clean database

### Module 6: Git Workspaces

- Description: Create and track task branches and worktrees inside the system.
- Priority: P1
- Status: done

Tasks:

1. `git-workspaces`
- Goal: Build the first database-backed Git workspace tracking flow so TaskPilot can record which task maps to which branch and worktree path.
- Depends On: foundation-bootstrap, foundation-schema, requirement-and-task-management, handoffs-and-acceptance
- Priority: P1
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: approved
- Acceptance Criteria:
  - A workspace data model exists and is tied to a task
  - The model stores at least task id, branch name, worktree path, base branch, and status
  - Demo data includes at least one representative workspace record
  - A minimal UI exists to view workspace records
  - A lightweight create path exists for workspace records
  - The implementation remains MVP-sized and does not attempt full Git automation
  - npm run lint passes
  - npm run build passes
  - npm run db:init works from a clean database

### Module 7: Requirement Change And Replanning

- Description: Version requirements and re-scope affected modules and tasks after changes.
- Priority: P2
- Status: not_started

Tasks:

1. `requirement-change-and-replanning`
- Goal: Build the first requirement versioning and replanning flow so TaskPilot can record a changed requirement, preserve earlier intent, and mark affected modules or tasks for re-scoping.
- Depends On: foundation-schema, requirement-and-task-management, project-overview-dashboard, git-workspaces
- Priority: P2
- Assigned Role: developer
- Suggested Tool: Qwen
- Status: ready
- Acceptance Criteria:
  - A requirement change can be recorded without overwriting the original requirement intent
  - At least one lightweight versioning or change-log path exists for requirements
  - A minimal way exists to mark impacted modules or tasks for replanning
  - The UI shows the current requirement state plus at least one prior or changed state
  - A lightweight create path exists for requirement changes or new versions
  - The implementation remains MVP-sized and does not attempt full scheduling automation
  - npm run lint passes
  - npm run build passes
  - npm run db:init works from a clean database

## Current Dispatch Recommendation

- `foundation-bootstrap` is complete and accepted.
- `foundation-schema` is complete and accepted.
- `context-memory-foundation` is complete and accepted.
- `requirement-and-task-management` is complete and accepted.
- `project-overview-dashboard` is complete and accepted.
- `handoffs-and-acceptance` is complete and accepted.
- `git-workspaces` is complete and accepted.
- Dispatch `requirement-change-and-replanning` next.
