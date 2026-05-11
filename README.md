# TaskPilot

Local-first web system for multi-AI software delivery orchestration.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Landing shell (home page)
│   ├── overview/     # Project overview dashboard
│   ├── modules/      # Modules & Tasks page (database-driven)
│   ├── handoffs/     # Handoffs & Acceptance page
│   ├── workspaces/   # Git Workspaces page
│   └── api/          # API routes
│       ├── context-memory/  # Context memory CRUD
│       ├── requirements/    # Requirements CRUD
│       ├── modules/         # Modules query
│       ├── tasks/           # Tasks CRUD
│       ├── handoffs/        # Handoffs CRUD
│       ├── acceptances/     # Acceptances CRUD
│       └── workspaces/      # Workspaces CRUD
├── components/       # Shared UI components (Layout, Navigation, ContextMemoryCard)
├── lib/              # Utility modules
│   └── db.ts         # Drizzle database instance
└── db/               # Database schema and seed
    ├── schema.ts     # SQLite table definitions
    └── seed.ts       # Sample data seeder
```

## Database

### Quick Start

```bash
# Initialize database: create tables + seed sample data
npm run db:init
```

### Individual Commands

```bash
# Push schema to SQLite (creates/updates tables, non-interactive)
npm run db:push

# Generate migrations for version control
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data (requires tables to exist first)
npm run db:seed

# Open Drizzle Studio (database browser)
npm run db:studio
```

### Initialization Flow

1. `npm run db:push` — Creates tables based on `src/db/schema.ts`
2. `npm run db:seed` — Inserts sample project, modules, and tasks
3. Or run both at once: `npm run db:init`

### Schema

- **projects** — Project identity, root path, git repo, status, phase
- **requirements** — Requirements tied to a project (title, description, status, priority)
- **modules** — Modules grouped under projects and requirements, priority, status, sequence
- **tasks** — Tasks grouped under modules, status, stage, assigned role/tool
- **context_memories** — Durable project context memory (summary, currentStatus, blockers, nextStep), tied to a project
- **handoffs** — Task handoffs between roles (taskId, fromRole, toRole, summary, status)
- **acceptances** — Acceptance decisions for handoffs (handoffId, taskId, decision, notes, reviewerRole)
- **workspaces** — Git workspace tracking (taskId, branchName, worktreePath, baseBranch, status)

### Context Memory

The context memory feature stores a compact operational snapshot for each project:

- **summary** — Current project summary
- **currentStatus** — What the project is doing now
- **blockers** — Any blockers or risks
- **nextStep** — What to do next

Each project has exactly one context memory record (unique constraint on `project_id`).
The API uses upsert behavior — `POST` creates or updates the existing record.

View and edit the latest context memory on the **Overview** page, or via the API:
- `GET /api/context-memory?projectId=1` — Get memory for a project
- `POST /api/context-memory` — Upsert (body: projectId, summary, currentStatus, blockers, nextStep)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS
- **Database:** SQLite + Drizzle ORM
- **Language:** TypeScript

## Current Status

**Version:** 0.1.0 — Git Workspaces

The application foundation is ready with:
- ✅ Next.js + React + Tailwind CSS setup
- ✅ Shared layout with navigation
- ✅ Landing page with Overview, Modules & Tasks, Handoffs, and Workspaces links
- ✅ Overview dashboard with real database-driven data
- ✅ SQLite and Drizzle ORM dependencies installed
- ✅ First-pass schema: projects, requirements, modules, tasks, handoffs, acceptances, workspaces
- ✅ Migration generation path (`npm run db:generate`)
- ✅ Lightweight seed script (`npm run db:seed`)
- ✅ Context memory table with summary, currentStatus, blockers, nextStep
- ✅ Overview page shows latest context memory per project
- ✅ API routes for requirements, modules, tasks, context memory, handoffs, acceptances, workspaces
- ✅ Modules & Tasks page displays real database-driven data
- ✅ Requirement data model tied to projects
- ✅ Overview dashboard: real counts, progress summaries, pending actions, recent activity
- ✅ Handoffs & Acceptance page with minimal UI for viewing records
- ✅ Git Workspaces page with branch and worktree tracking
- ✅ Lightweight create paths for all entities via API

## Upcoming Tasks

- Requirement change and replanning
