CREATE TABLE `shareAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shareId` int NOT NULL,
	`clicks` int NOT NULL DEFAULT 0,
	`impressions` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`engagementRate` int NOT NULL DEFAULT 0,
	`platform` varchar(64) NOT NULL,
	`trackingCode` varchar(255),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shareAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackId` int,
	`playlistId` int,
	`platform` varchar(64) NOT NULL,
	`sharedUrl` varchar(512),
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `shareAnalytics` ADD CONSTRAINT `shareAnalytics_shareId_shares_id_fk` FOREIGN KEY (`shareId`) REFERENCES `shares`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shares` ADD CONSTRAINT `shares_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shares` ADD CONSTRAINT `shares_trackId_tracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `tracks`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shares` ADD CONSTRAINT `shares_playlistId_userPlaylists_id_fk` FOREIGN KEY (`playlistId`) REFERENCES `userPlaylists`(`id`) ON DELETE set null ON UPDATE no action;