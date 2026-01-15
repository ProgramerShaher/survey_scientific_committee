CREATE TABLE `allowed_dashboard_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('admin','viewer') NOT NULL DEFAULT 'viewer',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `allowed_dashboard_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `allowed_dashboard_users_email_unique` UNIQUE(`email`)
);
