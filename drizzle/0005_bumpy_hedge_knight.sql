CREATE TABLE `adMetrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adId` varchar(255) NOT NULL,
	`impressions` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`lastInteraction` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `adMetrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `artistProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`artistName` varchar(255) NOT NULL,
	`bio` text,
	`profileImage` varchar(512),
	`bannerImage` varchar(512),
	`genre` varchar(64),
	`location` varchar(255),
	`website` varchar(512),
	`socialLinks` text,
	`followers` int NOT NULL DEFAULT 0,
	`totalPlays` int NOT NULL DEFAULT 0,
	`verifiedBadge` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artistProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `artistProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `artistUploads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`genre` varchar(64) NOT NULL,
	`audioUrl` varchar(512) NOT NULL,
	`audioKey` varchar(512) NOT NULL,
	`coverArtUrl` varchar(512),
	`duration` int,
	`bpm` int,
	`key` varchar(10),
	`releaseDate` timestamp,
	`isPublished` int NOT NULL DEFAULT 0,
	`isExplicit` int NOT NULL DEFAULT 0,
	`downloadable` int NOT NULL DEFAULT 0,
	`downloadPrice` int,
	`plays` int NOT NULL DEFAULT 0,
	`downloads` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`comments` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `artistUploads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creatorEarnings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`trackId` int,
	`playlistId` int,
	`earningType` enum('streams','downloads','tips','merchandise') NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`period` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `creatorEarnings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `creatorPayouts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`artistId` int NOT NULL,
	`amount` int NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`paymentMethod` varchar(64),
	`transactionId` varchar(255),
	`requestedAt` timestamp NOT NULL DEFAULT (now()),
	`processedAt` timestamp,
	CONSTRAINT `creatorPayouts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlistFollowers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playlistId` int NOT NULL,
	`userId` int NOT NULL,
	`followedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playlistFollowers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlistShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playlistId` int NOT NULL,
	`sharedBy` int NOT NULL,
	`platform` varchar(64),
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playlistShares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`recipientId` int NOT NULL,
	`amount` int NOT NULL,
	`message` text,
	`trackId` int,
	`paymentStatus` enum('pending','completed','failed') NOT NULL DEFAULT 'completed',
	`stripePaymentId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPlaylists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`coverImageUrl` varchar(512),
	`isPublic` int NOT NULL DEFAULT 0,
	`plays` int NOT NULL DEFAULT 0,
	`shares` int NOT NULL DEFAULT 0,
	`followers` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPlaylists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `adMetrics` ADD CONSTRAINT `adMetrics_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artistProfiles` ADD CONSTRAINT `artistProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `artistUploads` ADD CONSTRAINT `artistUploads_artistId_artistProfiles_id_fk` FOREIGN KEY (`artistId`) REFERENCES `artistProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creatorEarnings` ADD CONSTRAINT `creatorEarnings_artistId_artistProfiles_id_fk` FOREIGN KEY (`artistId`) REFERENCES `artistProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creatorEarnings` ADD CONSTRAINT `creatorEarnings_trackId_artistUploads_id_fk` FOREIGN KEY (`trackId`) REFERENCES `artistUploads`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creatorEarnings` ADD CONSTRAINT `creatorEarnings_playlistId_userPlaylists_id_fk` FOREIGN KEY (`playlistId`) REFERENCES `userPlaylists`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `creatorPayouts` ADD CONSTRAINT `creatorPayouts_artistId_artistProfiles_id_fk` FOREIGN KEY (`artistId`) REFERENCES `artistProfiles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlistFollowers` ADD CONSTRAINT `playlistFollowers_playlistId_userPlaylists_id_fk` FOREIGN KEY (`playlistId`) REFERENCES `userPlaylists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlistFollowers` ADD CONSTRAINT `playlistFollowers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlistShares` ADD CONSTRAINT `playlistShares_playlistId_userPlaylists_id_fk` FOREIGN KEY (`playlistId`) REFERENCES `userPlaylists`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `playlistShares` ADD CONSTRAINT `playlistShares_sharedBy_users_id_fk` FOREIGN KEY (`sharedBy`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips` ADD CONSTRAINT `tips_senderId_users_id_fk` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips` ADD CONSTRAINT `tips_recipientId_users_id_fk` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tips` ADD CONSTRAINT `tips_trackId_artistUploads_id_fk` FOREIGN KEY (`trackId`) REFERENCES `artistUploads`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userPlaylists` ADD CONSTRAINT `userPlaylists_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;