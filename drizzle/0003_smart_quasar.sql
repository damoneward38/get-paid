CREATE TABLE `albumPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`albumId` int NOT NULL,
	`price` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `albumPurchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `genreAccess` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tierId` int NOT NULL,
	`genre` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `genreAccess_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`imageUrl` varchar(512),
	`type` enum('post','testimonial','artwork') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `songPurchases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackId` int NOT NULL,
	`price` int NOT NULL,
	`purchasedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `songPurchases_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `albumPurchases` ADD CONSTRAINT `albumPurchases_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `albumPurchases` ADD CONSTRAINT `albumPurchases_albumId_albums_id_fk` FOREIGN KEY (`albumId`) REFERENCES `albums`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `genreAccess` ADD CONSTRAINT `genreAccess_tierId_subscriptionTiers_id_fk` FOREIGN KEY (`tierId`) REFERENCES `subscriptionTiers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `songPurchases` ADD CONSTRAINT `songPurchases_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `songPurchases` ADD CONSTRAINT `songPurchases_trackId_tracks_id_fk` FOREIGN KEY (`trackId`) REFERENCES `tracks`(`id`) ON DELETE cascade ON UPDATE no action;