import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint, unique } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  emailVerified: tinyint("emailVerified").default(0).notNull(),
  twoFactorEnabled: tinyint("twoFactorEnabled").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription tiers for the platform
 */
export const subscriptionTiers = mysqlTable("subscriptionTiers", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  description: text("description"),
  monthlyPrice: int("monthlyPrice").notNull(), // in cents
  yearlyPrice: int("yearlyPrice"), // in cents, optional
  features: text("features"), // JSON array of features
  stripePriceId: varchar("stripePriceId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SubscriptionTier = typeof subscriptionTiers.$inferSelect;
export type InsertSubscriptionTier = typeof subscriptionTiers.$inferInsert;

/**
 * User subscriptions
 */
export const userSubscriptions = mysqlTable("userSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tierId: int("tierId").notNull().references(() => subscriptionTiers.id),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  status: mysqlEnum("status", ["active", "canceled", "past_due", "trialing"]).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  canceledAt: timestamp("canceledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;

/**
 * Albums
 */
export const albums = mysqlTable("albums", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
  description: text("description"),
  coverArtUrl: varchar("coverArtUrl", { length: 512 }),
  releaseDate: timestamp("releaseDate"),
  genre: varchar("genre", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Album = typeof albums.$inferSelect;
export type InsertAlbum = typeof albums.$inferInsert;

/**
 * Music tracks
 */
export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artistId: int("artistId").notNull().references(() => users.id, { onDelete: "cascade" }),
  albumId: int("albumId").references(() => albums.id, { onDelete: "set null" }),
  duration: int("duration").notNull(), // in seconds
  genre: varchar("genre", { length: 64 }),
  isrc: varchar("isrc", { length: 12 }), // International Standard Recording Code
  audioUrl: varchar("audioUrl", { length: 512 }).notNull(), // S3 URL
  audioKey: varchar("audioKey", { length: 512 }).default("default-key").notNull(), // S3 key for reference
  coverArtUrl: varchar("coverArtUrl", { length: 512 }),
  lyrics: text("lyrics"),
  isPublished: int("isPublished").default(0).notNull(), // 0 = false, 1 = true
  playCount: int("playCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = typeof tracks.$inferInsert;

/**
 * Playlists
 */
export const playlists = mysqlTable("playlists", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  description: text("description"),
  isPublic: int("isPublic").default(0).notNull(),
  coverArtUrl: varchar("coverArtUrl", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = typeof playlists.$inferInsert;

/**
 * Playlist tracks (many-to-many relationship)
 */
export const playlistTracks = mysqlTable("playlistTracks", {
  id: int("id").autoincrement().primaryKey(),
  playlistId: int("playlistId").notNull().references(() => playlists.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  position: int("position").notNull(), // order in playlist
  addedAt: timestamp("addedAt").defaultNow().notNull(),
});

export type PlaylistTrack = typeof playlistTracks.$inferSelect;
export type InsertPlaylistTrack = typeof playlistTracks.$inferInsert;

/**
 * User favorites
 */
export const favorites = mysqlTable("favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Stream history for analytics
 */
export const streamHistory = mysqlTable("streamHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  secondsPlayed: int("secondsPlayed").notNull(),
  completed: int("completed").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StreamHistory = typeof streamHistory.$inferSelect;
export type InsertStreamHistory = typeof streamHistory.$inferInsert;

/**
 * PayPal subscriptions tracking for live payments
 */
export const paypalSubscriptions = mysqlTable("paypalSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  paypalSubscriptionId: varchar("paypalSubscriptionId", { length: 255 }).notNull().unique(),
  planId: varchar("planId", { length: 255 }).notNull(),
  tierId: int("tierId").notNull().references(() => subscriptionTiers.id),
  status: mysqlEnum("status", ["active", "suspended", "cancelled", "expired"]).notNull(),
  currentPeriodStart: timestamp("currentPeriodStart"),
  currentPeriodEnd: timestamp("currentPeriodEnd"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaypalSubscription = typeof paypalSubscriptions.$inferSelect;
export type InsertPaypalSubscription = typeof paypalSubscriptions.$inferInsert;

/**
 * Payment transactions tracking for live payments
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  paypalTransactionId: varchar("paypalTransactionId", { length: 255 }).unique(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).notNull(),
  tierId: int("tierId").references(() => subscriptionTiers.id),
  paymentMethod: varchar("paymentMethod", { length: 64 }).default("paypal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Genre access control for subscription tiers
 */
export const genreAccess = mysqlTable("genreAccess", {
  id: int("id").autoincrement().primaryKey(),
  tierId: int("tierId").notNull().references(() => subscriptionTiers.id),
  genre: varchar("genre", { length: 64 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GenreAccess = typeof genreAccess.$inferSelect;
export type InsertGenreAccess = typeof genreAccess.$inferInsert;

/**
 * Per-song and per-album purchases
 */
export const songPurchases = mysqlTable("songPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  price: int("price").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type SongPurchase = typeof songPurchases.$inferSelect;
export type InsertSongPurchase = typeof songPurchases.$inferInsert;

/**
 * Album purchases
 */
export const albumPurchases = mysqlTable("albumPurchases", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  albumId: int("albumId").notNull().references(() => albums.id, { onDelete: "cascade" }),
  price: int("price").notNull(),
  purchasedAt: timestamp("purchasedAt").defaultNow().notNull(),
});

export type AlbumPurchase = typeof albumPurchases.$inferSelect;
export type InsertAlbumPurchase = typeof albumPurchases.$inferInsert;

/**
 * Posts and testimonials for homepage
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }),
  type: mysqlEnum("type", ["post", "testimonial", "artwork"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Uploaded files (audio and images) for S3 storage tracking
 */
export const uploadedFiles = mysqlTable("uploadedFiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull().unique(),
  fileUrl: varchar("fileUrl", { length: 512 }).notNull(),
  fileType: mysqlEnum("fileType", ["audio", "image", "video"]).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  fileSize: int("fileSize").notNull(), // in bytes
  metadata: text("metadata"), // JSON metadata
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type InsertUploadedFile = typeof uploadedFiles.$inferInsert;

/**
 * Artist profiles for UGC
 */
export const artistProfiles = mysqlTable("artistProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  artistName: varchar("artistName", { length: 255 }).notNull(),
  bio: text("bio"),
  profileImage: varchar("profileImage", { length: 512 }),
  bannerImage: varchar("bannerImage", { length: 512 }),
  genre: varchar("genre", { length: 64 }),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 512 }),
  socialLinks: text("socialLinks"), // JSON
  followers: int("followers").default(0).notNull(),
  totalPlays: int("totalPlays").default(0).notNull(),
  verifiedBadge: int("verifiedBadge").default(0).notNull(), // 0 = false, 1 = true
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArtistProfile = typeof artistProfiles.$inferSelect;
export type InsertArtistProfile = typeof artistProfiles.$inferInsert;

/**
 * Artist uploads (UGC tracks)
 */
export const artistUploads = mysqlTable("artistUploads", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull().references(() => artistProfiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  genre: varchar("genre", { length: 64 }).notNull(),
  audioUrl: varchar("audioUrl", { length: 512 }).notNull(),
  audioKey: varchar("audioKey", { length: 512 }).notNull(),
  coverArtUrl: varchar("coverArtUrl", { length: 512 }),
  duration: int("duration"), // in seconds
  bpm: int("bpm"),
  key: varchar("key", { length: 10 }),
  releaseDate: timestamp("releaseDate"),
  isPublished: int("isPublished").default(0).notNull(), // 0 = false, 1 = true
  isExplicit: int("isExplicit").default(0).notNull(),
  downloadable: int("downloadable").default(0).notNull(),
  downloadPrice: int("downloadPrice"), // in cents
  plays: int("plays").default(0).notNull(),
  downloads: int("downloads").default(0).notNull(),
  likes: int("likes").default(0).notNull(),
  comments: int("comments").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ArtistUpload = typeof artistUploads.$inferSelect;
export type InsertArtistUpload = typeof artistUploads.$inferInsert;

/**
 * User playlists (extended)
 */
export const userPlaylists = mysqlTable("userPlaylists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  isPublic: int("isPublic").default(0).notNull(),
  plays: int("plays").default(0).notNull(),
  shares: int("shares").default(0).notNull(),
  followers: int("followers").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPlaylist = typeof userPlaylists.$inferSelect;
export type InsertUserPlaylist = typeof userPlaylists.$inferInsert;

/**
 * Playlist followers
 */
export const playlistFollowers = mysqlTable("playlistFollowers", {
  id: int("id").autoincrement().primaryKey(),
  playlistId: int("playlistId").notNull().references(() => userPlaylists.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  followedAt: timestamp("followedAt").defaultNow().notNull(),
});

export type PlaylistFollower = typeof playlistFollowers.$inferSelect;
export type InsertPlaylistFollower = typeof playlistFollowers.$inferInsert;

/**
 * Playlist shares tracking
 */
export const playlistShares = mysqlTable("playlistShares", {
  id: int("id").autoincrement().primaryKey(),
  playlistId: int("playlistId").notNull().references(() => userPlaylists.id, { onDelete: "cascade" }),
  sharedBy: int("sharedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: varchar("platform", { length: 64 }), // 'twitter', 'facebook', 'whatsapp', 'copy'
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
});

export type PlaylistShare = typeof playlistShares.$inferSelect;
export type InsertPlaylistShare = typeof playlistShares.$inferInsert;

/**
 * Creator earnings tracking
 */
export const creatorEarnings = mysqlTable("creatorEarnings", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull().references(() => artistProfiles.id, { onDelete: "cascade" }),
  trackId: int("trackId").references(() => artistUploads.id, { onDelete: "set null" }),
  playlistId: int("playlistId").references(() => userPlaylists.id, { onDelete: "set null" }),
  earningType: mysqlEnum("earningType", ["streams", "downloads", "tips", "merchandise"]).notNull(),
  amount: int("amount").notNull(), // in cents
  currency: varchar("currency", { length: 3 }).default("USD").notNull(),
  period: varchar("period", { length: 64 }), // 'daily', 'weekly', 'monthly'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreatorEarning = typeof creatorEarnings.$inferSelect;
export type InsertCreatorEarning = typeof creatorEarnings.$inferInsert;

/**
 * Creator payouts
 */
export const creatorPayouts = mysqlTable("creatorPayouts", {
  id: int("id").autoincrement().primaryKey(),
  artistId: int("artistId").notNull().references(() => artistProfiles.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(), // in cents
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 64 }), // 'paypal', 'stripe', 'bank'
  transactionId: varchar("transactionId", { length: 255 }),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  processedAt: timestamp("processedAt"),
});

export type CreatorPayout = typeof creatorPayouts.$inferSelect;
export type InsertCreatorPayout = typeof creatorPayouts.$inferInsert;

/**
 * Tips and donations
 */
export const tips = mysqlTable("tips", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull().references(() => users.id, { onDelete: "cascade" }),
  recipientId: int("recipientId").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: int("amount").notNull(), // in cents
  message: text("message"),
  trackId: int("trackId").references(() => artistUploads.id, { onDelete: "set null" }),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed"]).default("completed").notNull(),
  stripePaymentId: varchar("stripePaymentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tip = typeof tips.$inferSelect;
export type InsertTip = typeof tips.$inferInsert;

/**
 * Ad impressions and clicks tracking
 */
export const adMetrics = mysqlTable("adMetrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  adId: varchar("adId", { length: 255 }).notNull(),
  impressions: int("impressions").default(0).notNull(),
  clicks: int("clicks").default(0).notNull(),
  lastInteraction: timestamp("lastInteraction").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AdMetric = typeof adMetrics.$inferSelect;
export type InsertAdMetric = typeof adMetrics.$inferInsert;
/**
 * Social shares tracking
 */
export const shares = mysqlTable("shares", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").references(() => tracks.id, { onDelete: "set null" }),
  playlistId: int("playlistId").references(() => userPlaylists.id, { onDelete: "set null" }),
  platform: varchar("platform", { length: 64 }).notNull(), // 'twitter', 'facebook', 'whatsapp', 'instagram', 'tiktok'
  sharedUrl: varchar("sharedUrl", { length: 512 }),
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Share = typeof shares.$inferSelect;
export type InsertShare = typeof shares.$inferInsert;

/**
 * Share analytics and metrics
 */
export const shareAnalytics = mysqlTable("shareAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  shareId: int("shareId").notNull().references(() => shares.id, { onDelete: "cascade" }),
  clicks: int("clicks").default(0).notNull(),
  impressions: int("impressions").default(0).notNull(),
  conversions: int("conversions").default(0).notNull(),
  engagementRate: int("engagementRate").default(0).notNull(), // percentage * 100
  platform: varchar("platform", { length: 64 }).notNull(),
  trackingCode: varchar("trackingCode", { length: 255 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ShareAnalytic = typeof shareAnalytics.$inferSelect;
export type InsertShareAnalytic = typeof shareAnalytics.$inferInsert;


/**
 * Track Reviews - User reviews for gospel tracks
 */
export const trackReviews = mysqlTable(
  "trackReviews",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
    rating: int("rating").notNull(), // 1-5 stars
    title: varchar("title", { length: 255 }),
    content: text("content"), // Review text
    helpful: int("helpful").default(0).notNull(), // Count of helpful votes
    unhelpful: int("unhelpful").default(0).notNull(), // Count of unhelpful votes
    isVerifiedPurchase: int("isVerifiedPurchase").default(0).notNull(), // 0 = false, 1 = true
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userTrackUnique: unique("userTrackUnique").on(table.userId, table.trackId),
  })
);

export type TrackReview = typeof trackReviews.$inferSelect;
export type InsertTrackReview = typeof trackReviews.$inferInsert;

/**
 * Uploaded Music Files
 */
export const musicUploads = mysqlTable(
  "musicUploads",
  {
    id: int("id").autoincrement().primaryKey(),
    uploadedBy: int("uploadedBy").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    artist: varchar("artist", { length: 255 }).notNull(),
    album: varchar("album", { length: 255 }),
    genre: varchar("genre", { length: 100 }),
    description: text("description"),
    duration: int("duration"), // Duration in seconds
    fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 file key
    fileUrl: varchar("fileUrl", { length: 500 }).notNull(), // S3 file URL
    mimeType: varchar("mimeType", { length: 100 }).notNull(), // e.g., "audio/mpeg"
    fileSize: int("fileSize"), // File size in bytes
    status: mysqlEnum("status", ["draft", "processing", "published", "archived"]).default("draft").notNull(),
    releaseDate: timestamp("releaseDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type MusicUpload = typeof musicUploads.$inferSelect;
export type InsertMusicUpload = typeof musicUploads.$inferInsert;


/**
 * Email Notifications
 */
export const emailNotifications = mysqlTable("emailNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["new_track", "artist_update", "playlist_shared", "comment_reply", "new_follower"]).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  relatedId: int("relatedId"),
  sent: int("sent").default(0).notNull(),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;

/**
 * Push Tokens for mobile notifications
 */
export const pushTokens = mysqlTable("pushTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 512 }).notNull().unique(),
  platform: mysqlEnum("platform", ["ios", "android", "web"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
});

export type PushToken = typeof pushTokens.$inferSelect;
export type InsertPushToken = typeof pushTokens.$inferInsert;

/**
 * User Listening History
 */
export const userListeningHistory = mysqlTable("userListeningHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  listenedAt: timestamp("listenedAt").defaultNow().notNull(),
  duration: int("duration"), // seconds listened
  completed: int("completed").default(0).notNull(), // 0 = false, 1 = true
});

export type UserListeningHistory = typeof userListeningHistory.$inferSelect;
export type InsertUserListeningHistory = typeof userListeningHistory.$inferInsert;

/**
 * User Favorites
 */
export const userFavorites = mysqlTable("userFavorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  favoritedAt: timestamp("favoritedAt").defaultNow().notNull(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;



/**
 * Share Events
 */
export const shareEvents = mysqlTable("shareEvents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackId: int("trackId").notNull().references(() => tracks.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["twitter", "facebook", "instagram", "whatsapp", "email", "link"]).notNull(),
  sharedAt: timestamp("sharedAt").defaultNow().notNull(),
});

export type ShareEvent = typeof shareEvents.$inferSelect;
export type InsertShareEvent = typeof shareEvents.$inferInsert;

/**
 * User Follows
 */
export const userFollows = mysqlTable("userFollows", {
  id: int("id").autoincrement().primaryKey(),
  followerId: int("followerId").notNull().references(() => users.id, { onDelete: "cascade" }),
  followingId: int("followingId").notNull().references(() => users.id, { onDelete: "cascade" }),
  followedAt: timestamp("followedAt").defaultNow().notNull(),
});

export type UserFollow = typeof userFollows.$inferSelect;
export type InsertUserFollow = typeof userFollows.$inferInsert;

/**
 * Activity Feed
 */
export const activityFeed = mysqlTable("activityFeed", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: mysqlEnum("type", ["follow", "like", "comment", "share", "upload"]).notNull(),
  relatedUserId: int("relatedUserId").references(() => users.id, { onDelete: "set null" }),
  relatedTrackId: int("relatedTrackId").references(() => tracks.id, { onDelete: "set null" }),
  message: varchar("message", { length: 512 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityFeedItem = typeof activityFeed.$inferSelect;
export type InsertActivityFeedItem = typeof activityFeed.$inferInsert;
