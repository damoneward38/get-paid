/**
 * Live Listening Parties Schema
 * Real-time synchronized playback with chat and user presence
 */

import { sqliteTable, text, integer, real, primaryKey, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Listening Parties
export const listeningParties = sqliteTable(
  'listening_parties',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull().unique(),
    hostUserId: integer('host_user_id').notNull(),
    partyName: text('party_name').notNull(),
    description: text('description'),
    status: text('status').default('active').notNull(), // 'active', 'paused', 'ended'
    currentTrackId: integer('current_track_id'),
    currentTrackPosition: integer('current_track_position').default(0).notNull(),
    playlistId: integer('playlist_id'),
    isPublic: integer('is_public').default(1).notNull(),
    maxParticipants: integer('max_participants').default(50).notNull(),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
    endedAt: integer('ended_at'),
  },
  (table) => ({
    hostIdIdx: index('listening_parties_host_id_idx').on(table.hostUserId),
    partyIdIdx: index('listening_parties_party_id_idx').on(table.partyId),
    statusIdx: index('listening_parties_status_idx').on(table.status),
    isPublicIdx: index('listening_parties_is_public_idx').on(table.isPublic),
  })
);

// Party Participants
export const partyParticipants = sqliteTable(
  'party_participants',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull(),
    userId: integer('user_id').notNull(),
    role: text('role').default('participant').notNull(), // 'host', 'participant', 'moderator'
    joinedAt: integer('joined_at').notNull(),
    leftAt: integer('left_at'),
    isActive: integer('is_active').default(1).notNull(),
    lastHeartbeat: integer('last_heartbeat').notNull(),
  },
  (table) => ({
    partyIdIdx: index('party_participants_party_id_idx').on(table.partyId),
    userIdIdx: index('party_participants_user_id_idx').on(table.userId),
    roleIdx: index('party_participants_role_idx').on(table.role),
  })
);

// Party Chat Messages
export const partyChatMessages = sqliteTable(
  'party_chat_messages',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull(),
    userId: integer('user_id').notNull(),
    message: text('message').notNull(),
    messageType: text('message_type').default('text').notNull(), // 'text', 'reaction', 'system'
    reaction: text('reaction'), // emoji for reactions
    isEdited: integer('is_edited').default(0).notNull(),
    editedAt: integer('edited_at'),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    partyIdIdx: index('party_chat_messages_party_id_idx').on(table.partyId),
    userIdIdx: index('party_chat_messages_user_id_idx').on(table.userId),
    createdAtIdx: index('party_chat_messages_created_at_idx').on(table.createdAt),
  })
);

// Party Playlist Queue
export const partyPlaylistQueue = sqliteTable(
  'party_playlist_queue',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull(),
    trackId: integer('track_id').notNull(),
    addedByUserId: integer('added_by_user_id').notNull(),
    position: integer('position').notNull(),
    status: text('status').default('queued').notNull(), // 'queued', 'playing', 'played', 'skipped'
    upvotes: integer('upvotes').default(0).notNull(),
    downvotes: integer('downvotes').default(0).notNull(),
    addedAt: integer('added_at').notNull(),
    playedAt: integer('played_at'),
  },
  (table) => ({
    partyIdIdx: index('party_playlist_queue_party_id_idx').on(table.partyId),
    trackIdIdx: index('party_playlist_queue_track_id_idx').on(table.trackId),
    statusIdx: index('party_playlist_queue_status_idx').on(table.status),
  })
);

// Party Voting (for track skips, etc)
export const partyVoting = sqliteTable(
  'party_voting',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull(),
    voteType: text('vote_type').notNull(), // 'skip', 'pause', 'resume'
    targetTrackId: integer('target_track_id'),
    initiatedByUserId: integer('initiated_by_user_id').notNull(),
    votesFor: integer('votes_for').default(1).notNull(),
    votesAgainst: integer('votes_against').default(0).notNull(),
    status: text('status').default('active').notNull(), // 'active', 'passed', 'failed'
    requiredVotes: integer('required_votes').notNull(),
    createdAt: integer('created_at').notNull(),
    resolvedAt: integer('resolved_at'),
  },
  (table) => ({
    partyIdIdx: index('party_voting_party_id_idx').on(table.partyId),
    voteTypeIdx: index('party_voting_vote_type_idx').on(table.voteType),
    statusIdx: index('party_voting_status_idx').on(table.status),
  })
);

// Party User Votes
export const partyUserVotes = sqliteTable(
  'party_user_votes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    voteId: integer('vote_id').notNull(),
    userId: integer('user_id').notNull(),
    vote: text('vote').notNull(), // 'for', 'against'
    votedAt: integer('voted_at').notNull(),
  },
  (table) => ({
    voteIdIdx: index('party_user_votes_vote_id_idx').on(table.voteId),
    userIdIdx: index('party_user_votes_user_id_idx').on(table.userId),
  })
);

// Party Reactions (emoji reactions to tracks)
export const partyReactions = sqliteTable(
  'party_reactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull(),
    trackId: integer('track_id').notNull(),
    userId: integer('user_id').notNull(),
    emoji: text('emoji').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    partyIdIdx: index('party_reactions_party_id_idx').on(table.partyId),
    trackIdIdx: index('party_reactions_track_id_idx').on(table.trackId),
    userIdIdx: index('party_reactions_user_id_idx').on(table.userId),
  })
);

// Party Sync Events (for real-time synchronization)
export const partySyncEvents = sqliteTable(
  'party_sync_events',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    partyId: text('party_id').notNull(),
    eventType: text('event_type').notNull(), // 'play', 'pause', 'skip', 'seek', 'track_change'
    trackId: integer('track_id'),
    position: integer('position'),
    userId: integer('user_id'),
    timestamp: integer('timestamp').notNull(),
    createdAt: integer('created_at').notNull(),
  },
  (table) => ({
    partyIdIdx: index('party_sync_events_party_id_idx').on(table.partyId),
    eventTypeIdx: index('party_sync_events_event_type_idx').on(table.eventType),
  })
);

// Relations
export const listeningPartiesRelations = relations(listeningParties, ({ many }) => ({
  participants: many(partyParticipants),
  chatMessages: many(partyChatMessages),
  playlistQueue: many(partyPlaylistQueue),
  voting: many(partyVoting),
  reactions: many(partyReactions),
  syncEvents: many(partySyncEvents),
}));

export const partyParticipantsRelations = relations(partyParticipants, ({ one }) => ({
  party: one(listeningParties, {
    fields: [partyParticipants.partyId],
    references: [listeningParties.partyId],
  }),
}));

export const partyChatMessagesRelations = relations(partyChatMessages, ({ one }) => ({
  party: one(listeningParties, {
    fields: [partyChatMessages.partyId],
    references: [listeningParties.partyId],
  }),
}));
