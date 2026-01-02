CREATE TABLE `musicUploads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`uploadedBy` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`artist` varchar(255) NOT NULL,
	`album` varchar(255),
	`genre` varchar(100),
	`description` text,
	`duration` int,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(500) NOT NULL,
	`mimeType` varchar(100) NOT NULL,
	`fileSize` int,
	`status` enum('draft','processing','published','archived') NOT NULL DEFAULT 'draft',
	`releaseDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `musicUploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trackReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackId` int NOT NULL,
	`rating` int NOT NULL,
	`title` varchar(255),
	`content` text,
	`helpful` int NOT NULL DEFAULT 0,
	`unhelpful` int NOT NULL DEFAULT 0,
	`isVerifiedPurchase` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `trackReviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `userTrackUnique` UNIQUE(`userId`,`trackId`)
);
--> statement-breakpoint
ALTER TABLE `musicUploads` ADD CONSTRAINT `musicUploads_uploadedBy_users_id_fk` FOREIGN KEY (`uploadedBy`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trackReviews` ADD CONSTRAINT `trackReviews_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `trackReviews` ADD CONSTRAINT `trackReviews_trackId_tracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `tracks`(`id`) ON DELETE cascade ON UPDATE no action;