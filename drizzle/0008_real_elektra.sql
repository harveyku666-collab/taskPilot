CREATE TABLE `requirement_changes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requirement_id` integer NOT NULL,
	`version_label` text NOT NULL,
	`change_summary` text NOT NULL,
	`rationale` text,
	`status` text DEFAULT 'draft',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`requirement_id`) REFERENCES `requirements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `modules` ADD `requirement_change_id` integer REFERENCES requirement_changes(id);--> statement-breakpoint
ALTER TABLE `modules` ADD `needs_replanning` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `tasks` ADD `requirement_change_id` integer REFERENCES requirement_changes(id);--> statement-breakpoint
ALTER TABLE `tasks` ADD `needs_replanning` integer DEFAULT false;