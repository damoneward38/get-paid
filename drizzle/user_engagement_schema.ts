/**
 * User Engagement Schema
 * Gamification, achievements, leaderboards, challenges, milestones, and recommendations
 */

import { sqliteTable, text, integer, real, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// User Gamification Profile
export const userGamificationProfile = sqliteTable(
  'user_gamification_profile',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().unique(),
    totalPoints: integer('total_points').default(0).notNull(),
    currentLevel: integer('current_level').default(1).notNull(),
    currentLevelProgress: integer('current_level_progress').default(0).notNull(),
    totalAchievements: integer('total_achievements').default(0).notNull(),
    currentStreak: integer('current_streak').default(0).notNull(), // Days in a row
    longestStreak: integer('longest_streak').default(0).notNull(),
    lastActivityDate: integer('last_activity_date'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_gamification_user_id_idx').on(table.userId),
  })
);

// Achievements/Badges
export const achievements = sqliteTable(
  'achievements',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'), // URL or emoji
    category: text('category').notNull(), // 'listening', 'social', 'discovery', 'engagement'
    pointsReward: integer('points_reward').default(10).notNull(),
    condition: text('condition').notNull(), // JSON describing unlock condition
    isHidden: integer('is_hidden').default(0).notNull(), // Secret achievement
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    categoryIdx: index('achievements_category_idx').on(table.category),
  })
);

// User Achievements (earned)
export const userAchievements = sqliteTable(
  'user_achievements',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    achievementId: integer('achievement_id').notNull(),
    unlockedAt: integer('unlocked_at').notNull(),
    progress: integer('progress').default(0), // For multi-step achievements
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_achievements_user_id_idx').on(table.userId),
    achievementIdIdx: index('user_achievements_achievement_id_idx').on(table.achievementId),
    uniqueUserAchievement: index('user_achievements_unique_idx').on(table.userId, table.achievementId),
  })
);

// Leaderboards
export const leaderboards = sqliteTable(
  'leaderboards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    rank: integer('rank').notNull(),
    score: integer('score').notNull(),
    leaderboardType: text('leaderboard_type').notNull(), // 'all_time', 'monthly', 'weekly'
    period: text('period').notNull(), // 'YYYY-MM' for monthly, 'YYYY-WXX' for weekly
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('leaderboards_user_id_idx').on(table.userId),
    typeIdx: index('leaderboards_type_idx').on(table.leaderboardType),
    periodIdx: index('leaderboards_period_idx').on(table.period),
  })
);

// User Milestones
export const userMilestones = sqliteTable(
  'user_milestones',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    milestoneType: text('milestone_type').notNull(), // 'first_listen', 'plays_100', 'plays_1000', 'anniversary', 'follower_milestone'
    milestoneValue: integer('milestone_value'), // e.g., 100 for 100 plays
    title: text('title').notNull(),
    description: text('description'),
    reachedAt: integer('reached_at').notNull(),
    celebrationSent: integer('celebration_sent').default(0).notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_milestones_user_id_idx').on(table.userId),
    typeIdx: index('user_milestones_type_idx').on(table.milestoneType),
  })
);

// Social Challenges
export const socialChallenges = sqliteTable(
  'social_challenges',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    challengeType: text('challenge_type').notNull(), // 'listen', 'share', 'invite', 'create_playlist'
    target: integer('target').notNull(), // e.g., 10 for "listen to 10 songs"
    reward: integer('reward').default(50).notNull(), // Points reward
    startDate: integer('start_date').notNull(),
    endDate: integer('end_date').notNull(),
    isActive: integer('is_active').default(1).notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    typeIdx: index('social_challenges_type_idx').on(table.challengeType),
    activeIdx: index('social_challenges_active_idx').on(table.isActive),
  })
);

// User Challenge Progress
export const userChallengeProgress = sqliteTable(
  'user_challenge_progress',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    challengeId: integer('challenge_id').notNull(),
    progress: integer('progress').default(0).notNull(),
    completed: integer('completed').default(0).notNull(),
    completedAt: integer('completed_at'),
    rewardClaimed: integer('reward_claimed').default(0).notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_challenge_progress_user_id_idx').on(table.userId),
    challengeIdIdx: index('user_challenge_progress_challenge_id_idx').on(table.challengeId),
    uniqueUserChallenge: index('user_challenge_progress_unique_idx').on(table.userId, table.challengeId),
  })
);

// User Listening Stats (for Wrapped)
export const userListeningStats = sqliteTable(
  'user_listening_stats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    year: integer('year').notNull(),
    totalListeningMinutes: integer('total_listening_minutes').default(0).notNull(),
    totalTracksPlayed: integer('total_tracks_played').default(0).notNull(),
    uniqueTracksPlayed: integer('unique_tracks_played').default(0).notNull(),
    uniqueArtistsPlayed: integer('unique_artists_played').default(0).notNull(),
    topGenre: text('top_genre'),
    topArtist: text('top_artist'),
    topTrack: text('top_track'),
    averageListeningTime: text('average_listening_time'), // Time of day
    mostActiveDay: text('most_active_day'), // Day of week
    wrappedGenerated: integer('wrapped_generated').default(0).notNull(),
    wrappedGeneratedAt: integer('wrapped_generated_at'),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_listening_stats_user_id_idx').on(table.userId),
    yearIdx: index('user_listening_stats_year_idx').on(table.year),
  })
);

// User Listening History (for recommendations)
export const userListeningHistory = sqliteTable(
  'user_listening_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull(),
    trackId: integer('track_id').notNull(),
    artistId: integer('artist_id'),
    genre: text('genre'),
    mood: text('mood'),
    playedAt: integer('played_at').notNull(),
    listenDuration: integer('listen_duration'), // Seconds
    completed: integer('completed').default(0).notNull(), // Did they listen to the end?
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_listening_history_user_id_idx').on(table.userId),
    trackIdIdx: index('user_listening_history_track_id_idx').on(table.trackId),
    playedAtIdx: index('user_listening_history_played_at_idx').on(table.playedAt),
  })
);

// User Preferences (for smart recommendations)
export const userPreferences = sqliteTable(
  'user_preferences',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').notNull().unique(),
    preferredGenres: text('preferred_genres'), // JSON array
    preferredMoods: text('preferred_moods'), // JSON array
    preferredArtists: text('preferred_artists'), // JSON array
    dislikedGenres: text('disliked_genres'), // JSON array
    notificationFrequency: text('notification_frequency').default('daily'), // 'daily', 'weekly', 'never'
    recommendationStyle: text('recommendation_style').default('balanced'), // 'discovery', 'familiar', 'balanced'
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => ({
    userIdIdx: index('user_preferences_user_id_idx').on(table.userId),
  })
);

// Relations
export const userGamificationProfileRelations = relations(userGamificationProfile, ({ one, many }) => ({
  userAchievements: many(userAchievements),
  leaderboardEntries: many(leaderboards),
  milestones: many(userMilestones),
  challengeProgress: many(userChallengeProgress),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const socialChallengesRelations = relations(socialChallenges, ({ many }) => ({
  userProgress: many(userChallengeProgress),
}));

export const userChallengeProgressRelations = relations(userChallengeProgress, ({ one }) => ({
  challenge: one(socialChallenges, {
    fields: [userChallengeProgress.challengeId],
    references: [socialChallenges.id],
  }),
}));

export const userListeningStatsRelations = relations(userListeningStats, ({ many }) => ({
  listeningHistory: many(userListeningHistory),
}));

export const userListeningHistoryRelations = relations(userListeningHistory, ({ one }) => ({
  stats: one(userListeningStats),
}));
