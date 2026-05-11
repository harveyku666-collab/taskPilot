CREATE TABLE `acceptances` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`handoff_id` integer NOT NULL,
	`task_id` integer NOT NULL,
	`decision` text DEFAULT 'pending',
	`notes` text,
	`reviewer_role` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`handoff_id`) REFERENCES `handoffs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `handoffs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` integer NOT NULL,
	`from_role` text NOT NULL,
	`to_role` text NOT NULL,
	`summary` text NOT NULL,
	`status` text DEFAULT 'pending',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE no action
);
