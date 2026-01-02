CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`paypalTransactionId` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`status` enum('pending','completed','failed','refunded') NOT NULL,
	`tierId` int,
	`paymentMethod` varchar(64) DEFAULT 'paypal',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`),
	CONSTRAINT `payments_paypalTransactionId_unique` UNIQUE(`paypalTransactionId`)
);
--> statement-breakpoint
CREATE TABLE `paypalSubscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`paypalSubscriptionId` varchar(255) NOT NULL,
	`planId` varchar(255) NOT NULL,
	`tierId` int NOT NULL,
	`status` enum('active','suspended','cancelled','expired') NOT NULL,
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `paypalSubscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `paypalSubscriptions_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `paypalSubscriptions_paypalSubscriptionId_unique` UNIQUE(`paypalSubscriptionId`)
);
--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_tierId_subscriptionTiers_id_fk` FOREIGN KEY (`tierId`) REFERENCES `subscriptionTiers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paypalSubscriptions` ADD CONSTRAINT `paypalSubscriptions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paypalSubscriptions` ADD CONSTRAINT `paypalSubscriptions_tierId_subscriptionTiers_id_fk` FOREIGN KEY (`tierId`) REFERENCES `subscriptionTiers`(`id`) ON DELETE no action ON UPDATE no action;