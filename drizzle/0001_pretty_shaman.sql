CREATE TABLE `survey_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`response_id` int NOT NULL,
	`question_id` int NOT NULL,
	`rating` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `survey_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `survey_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`college` varchar(255) NOT NULL,
	`specialization` varchar(255) NOT NULL,
	`academic_level` varchar(50) NOT NULL,
	`suggestions` text,
	`submitted_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `survey_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `survey_answers` ADD CONSTRAINT `survey_answers_response_id_survey_responses_id_fk` FOREIGN KEY (`response_id`) REFERENCES `survey_responses`(`id`) ON DELETE cascade ON UPDATE no action;