PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_modules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`priority` text DEFAULT 'P1',
	`status` text DEFAULT 'not_started',
	`sequence` integer DEFAULT 0,
	`created_at` text DEFAULT '2026-05-11T06:38:53.359Z',
	`updated_at` text DEFAULT '2026-05-11T06:38:53.359Z',
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_modules`("id", "project_id", "name", "description", "priority", "status", "sequence", "created_at", "updated_at") SELECT "id", "project_id", "name", "description", "priority", "status", "sequence", "created_at", "updated_at" FROM `modules`;--> statement-breakpoint
DROP TABLE `modules`;--> statement-breakpoint
ALTER TABLE `__new_modules` RENAME TO `modules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`root_path` text NOT NULL,
	`git_repo_path` text,
	`default_branch` text DEFAULT 'main',
	`status` text DEFAULT 'draft',
	`current_phase` text,
	`description` text,
	`created_at` text DEFAULT '2026-05-11T06:38:53.357Z',
	`updated_at` text DEFAULT '2026-05-11T06:38:53.359Z'
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "name", "root_path", "git_repo_path", "default_branch", "status", "current_phase", "description", "created_at", "updated_at") SELECT "id", "name", "root_path", "git_repo_path", "default_branch", "status", "current_phase", "description", "created_at", "updated_at" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'todo',
	`stage` text,
	`assigned_role` text,
	`assigned_tool` text,
	`acceptance_criteria` text,
	`risk_notes` text,
	`priority` text DEFAULT 'P1',
	`created_at` text DEFAULT '2026-05-11T06:38:53.360Z',
	`updated_at` text DEFAULT '2026-05-11T06:38:53.360Z',
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "module_id", "title", "description", "status", "stage", "assigned_role", "assigned_tool", "acceptance_criteria", "risk_notes", "priority", "created_at", "updated_at") SELECT "id", "module_id", "title", "description", "status", "stage", "assigned_role", "assigned_tool", "acceptance_criteria", "risk_notes", "priority", "created_at", "updated_at" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;