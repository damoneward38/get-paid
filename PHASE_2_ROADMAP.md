# Phase 2 Development Roadmap
## User-Generated Content + Monetization Strategy

**Timeline:** 6-8 weeks  
**Team Size:** 3-4 developers  
**Priority:** HIGH - Revenue generation & community engagement  
**Target Launch:** Q2 2026

---

## OVERVIEW

Phase 2 focuses on two critical pillars:

1. **User-Generated Content (UGC)** – Allow users to upload, share, and monetize their own music
2. **Monetization Strategy** – Multiple revenue streams (subscriptions, tips, merchandise, ads)

This phase transforms your platform from a music player into a complete creator economy.

---

# FEATURE 1: USER-GENERATED CONTENT (UGC)

## Why This Feature Matters

UGC is the future of music platforms. It:
- Increases platform stickiness (creators stay longer)
- Generates viral content (users share their creations)
- Reduces content costs (creators provide music)
- Builds community (fans support creators)
- Creates network effects (more creators = more users)

Examples: SoundCloud, Bandcamp, YouTube Music

---

## TASK 1.1: ARTIST UPLOAD & MANAGEMENT SYSTEM

### What This Does
Allows independent artists to upload their music, manage metadata, and control distribution settings.

### Why First
This is the foundation. Without artist uploads, there's no UGC.

### Estimated Time: 2 weeks

### Step 1: Database Schema

Add to `drizzle/schema.ts`:

```typescript
export const artistProfiles = sqliteTable('artist_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  artistName: text('artist_name').notNull(),
  bio: text('bio'),
  profileImage: text('profile_image'),
  bannerImage: text('banner_image'),
  genre: text('genre'),
  location: text('location'),
  website: text('website'),
  socialLinks: text('social_links'), // JSON
  followers: integer('followers').default(0),
  totalPlays: integer('total_plays').default(0),
  verifiedBadge: boolean('verified_badge').default(false),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const artistUploads = sqliteTable('artist_uploads', {
  id: text('id').primaryKey(),
  artistId: text('artist_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  genre: text('genre').notNull(),
  audioUrl: text('audio_url').notNull(),
  coverArtUrl: text('cover_art_url'),
  duration: integer('duration'), // in seconds
  bpm: integer('bpm'),
  key: text('key'),
  releaseDate: integer('release_date'),
  isPublished: boolean('is_published').default(false),
  isExplicit: boolean('is_explicit').default(false),
  downloadable: boolean('downloadable').default(false),
  price: real('price'), // for paid downloads
  plays: integer('plays').default(0),
  downloads: integer('downloads').default(0),
  likes: integer('likes').default(0),
  comments: integer('comments').default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const artistAlbums = sqliteTable('artist_albums', {
  id: text('id').primaryKey(),
  artistId: text('artist_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  coverArtUrl: text('cover_art_url'),
  releaseDate: integer('release_date'),
  genre: text('genre'),
  trackCount: integer('track_count').default(0),
  plays: integer('plays').default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const albumTracks = sqliteTable('album_tracks', {
  id: text('id').primaryKey(),
  albumId: text('album_id').notNull(),
  trackId: text('track_id').notNull(),
  trackNumber: integer('track_number'),
  createdAt: integer('created_at').notNull(),
});
```

### Step 2: Artist Upload Service

Create `server/_core/artistUpload.ts`:

```typescript
import { db } from '../db';
import { artistProfiles, artistUploads, artistAlbums } from '../../drizzle/schema';
import { storagePut } from '../storage';

export async function createArtistProfile(userId: string, artistName: string) {
  const existing = await db.query.artistProfiles.findFirst({
    where: (ap) => ap.userId === userId,
  });

  if (existing) return existing;

  return await db.insert(artistProfiles).values({
    id: `artist-${userId}`,
    userId,
    artistName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function getArtistProfile(artistId: string) {
  return await db.query.artistProfiles.findFirst({
    where: (ap) => ap.id === artistId,
  });
}

export async function updateArtistProfile(artistId: string, data: any) {
  return await db.update(artistProfiles)
    .set({
      ...data,
      updatedAt: Date.now(),
    })
    .where((ap) => ap.id === artistId);
}

export async function uploadTrack(
  artistId: string,
  trackData: {
    title: string;
    description?: string;
    genre: string;
    audioFile: Buffer;
    coverArt?: Buffer;
    duration: number;
    bpm?: number;
    key?: string;
    isExplicit?: boolean;
    downloadable?: boolean;
    price?: number;
  }
) {
  try {
    // Upload audio file to S3
    const audioKey = `artists/${artistId}/tracks/${Date.now()}-${trackData.title.replace(/\s+/g, '-')}.mp3`;
    const { url: audioUrl } = await storagePut(audioKey, trackData.audioFile, 'audio/mpeg');

    // Upload cover art if provided
    let coverArtUrl = null;
    if (trackData.coverArt) {
      const coverKey = `artists/${artistId}/covers/${Date.now()}-cover.jpg`;
      const { url } = await storagePut(coverKey, trackData.coverArt, 'image/jpeg');
      coverArtUrl = url;
    }

    // Create track record
    const trackId = `track-${Date.now()}`;
    await db.insert(artistUploads).values({
      id: trackId,
      artistId,
      title: trackData.title,
      description: trackData.description,
      genre: trackData.genre,
      audioUrl,
      coverArtUrl,
      duration: trackData.duration,
      bpm: trackData.bpm,
      key: trackData.key,
      isExplicit: trackData.isExplicit || false,
      downloadable: trackData.downloadable || false,
      price: trackData.price,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return trackId;
  } catch (error) {
    console.error('❌ Track upload failed:', error);
    throw error;
  }
}

export async function getArtistTracks(artistId: string, onlyPublished = true) {
  const query = db.query.artistUploads.findMany({
    where: (au) => au.artistId === artistId,
  });

  const tracks = await query;
  return onlyPublished ? tracks.filter((t) => t.isPublished) : tracks;
}

export async function publishTrack(trackId: string) {
  return await db.update(artistUploads)
    .set({
      isPublished: true,
      releaseDate: Date.now(),
      updatedAt: Date.now(),
    })
    .where((au) => au.id === trackId);
}

export async function deleteTrack(trackId: string) {
  return await db.delete(artistUploads)
    .where((au) => au.id === trackId);
}
```

### Step 3: Artist Upload Router

Create `server/routers/artistUpload.ts`:

```typescript
import { router, protectedProcedure } from '../_core/router';
import { z } from 'zod';
import {
  createArtistProfile,
  getArtistProfile,
  updateArtistProfile,
  uploadTrack,
  getArtistTracks,
  publishTrack,
  deleteTrack,
} from '../_core/artistUpload';

export const artistUploadRouter = router({
  // Create or get artist profile
  getProfile: protectedProcedure
    .query(async ({ ctx }) => {
      const profile = await getArtistProfile(`artist-${ctx.user.id}`);
      if (!profile) {
        // Create default profile
        return await createArtistProfile(ctx.user.id, ctx.user.name || 'Unknown Artist');
      }
      return profile;
    }),

  // Update artist profile
  updateProfile: protectedProcedure
    .input(z.object({
      artistName: z.string().optional(),
      bio: z.string().optional(),
      genre: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      socialLinks: z.record(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await updateArtistProfile(`artist-${ctx.user.id}`, input);
    }),

  // Upload track
  uploadTrack: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      genre: z.string(),
      duration: z.number(),
      bpm: z.number().optional(),
      key: z.string().optional(),
      isExplicit: z.boolean().optional(),
      downloadable: z.boolean().optional(),
      price: z.number().optional(),
      audioBase64: z.string(), // Base64 encoded audio
      coverArtBase64: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const audioBuffer = Buffer.from(input.audioBase64, 'base64');
      const coverBuffer = input.coverArtBase64
        ? Buffer.from(input.coverArtBase64, 'base64')
        : undefined;

      return await uploadTrack(`artist-${ctx.user.id}`, {
        title: input.title,
        description: input.description,
        genre: input.genre,
        audioFile: audioBuffer,
        coverArt: coverBuffer,
        duration: input.duration,
        bpm: input.bpm,
        key: input.key,
        isExplicit: input.isExplicit,
        downloadable: input.downloadable,
        price: input.price,
      });
    }),

  // Get artist tracks
  getTracks: protectedProcedure
    .input(z.object({ onlyPublished: z.boolean().default(true) }))
    .query(async ({ ctx, input }) => {
      return await getArtistTracks(`artist-${ctx.user.id}`, input.onlyPublished);
    }),

  // Publish track
  publishTrack: protectedProcedure
    .input(z.object({ trackId: z.string() }))
    .mutation(async ({ input }) => {
      return await publishTrack(input.trackId);
    }),

  // Delete track
  deleteTrack: protectedProcedure
    .input(z.object({ trackId: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteTrack(input.trackId);
    }),
});
```

### Step 4: Artist Upload UI

Create `client/src/pages/ArtistStudio.tsx`:

```typescript
import { useState } from 'react';
import { trpc } from '../lib/trpc';
import './ArtistStudio.css';

export default function ArtistStudio() {
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    genre: 'Hip-Hop',
    bpm: 120,
    key: 'C',
    isExplicit: false,
    downloadable: false,
    price: 0,
  });

  const { data: profile } = trpc.artistUpload.getProfile.useQuery();
  const { data: tracks } = trpc.artistUpload.getTracks.useQuery({ onlyPublished: false });
  const updateProfileMutation = trpc.artistUpload.updateProfile.useMutation();
  const uploadTrackMutation = trpc.artistUpload.uploadTrack.useMutation();
  const publishTrackMutation = trpc.artistUpload.publishTrack.useMutation();
  const deleteTrackMutation = trpc.artistUpload.deleteTrack.useMutation();

  const handleUploadTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const audioFile = formData.get('audioFile') as File;
    const coverArt = formData.get('coverArt') as File;

    if (!audioFile) {
      alert('Please select an audio file');
      return;
    }

    try {
      const audioBase64 = await fileToBase64(audioFile);
      const coverBase64 = coverArt ? await fileToBase64(coverArt) : undefined;

      await uploadTrackMutation.mutateAsync({
        ...uploadForm,
        audioBase64,
        coverArtBase64: coverBase64,
      });

      alert('Track uploaded successfully!');
      setUploadForm({
        title: '',
        description: '',
        genre: 'Hip-Hop',
        bpm: 120,
        key: 'C',
        isExplicit: false,
        downloadable: false,
        price: 0,
      });
    } catch (error) {
      alert('Upload failed: ' + error);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="artist-studio">
      <div className="studio-header">
        <h1>Artist Studio</h1>
        <p>Manage your music and profile</p>
      </div>

      <div className="studio-tabs">
        <button
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Track
        </button>
        <button
          className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          My Tracks
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="studio-content">
          <h2>Artist Profile</h2>
          <form className="profile-form">
            <div className="form-group">
              <label>Artist Name</label>
              <input
                type="text"
                defaultValue={profile?.artistName}
                placeholder="Your artist name"
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                defaultValue={profile?.bio || ''}
                placeholder="Tell fans about yourself"
              />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <select defaultValue={profile?.genre || ''}>
                <option>Hip-Hop</option>
                <option>R&B</option>
                <option>Country</option>
                <option>Gospel</option>
                <option>Pop</option>
                <option>Rock</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                defaultValue={profile?.location || ''}
                placeholder="City, Country"
              />
            </div>
            <button type="submit" className="btn-primary">
              Save Profile
            </button>
          </form>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="studio-content">
          <h2>Upload New Track</h2>
          <form className="upload-form" onSubmit={handleUploadTrack}>
            <div className="form-group">
              <label>Track Title</label>
              <input
                type="text"
                name="title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Song title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Tell fans about this track"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Genre</label>
                <select
                  value={uploadForm.genre}
                  onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value })}
                >
                  <option>Hip-Hop</option>
                  <option>R&B</option>
                  <option>Country</option>
                  <option>Gospel</option>
                  <option>Pop</option>
                  <option>Rock</option>
                </select>
              </div>

              <div className="form-group">
                <label>BPM</label>
                <input
                  type="number"
                  value={uploadForm.bpm}
                  onChange={(e) => setUploadForm({ ...uploadForm, bpm: parseInt(e.target.value) })}
                  min="60"
                  max="200"
                />
              </div>

              <div className="form-group">
                <label>Key</label>
                <select
                  value={uploadForm.key}
                  onChange={(e) => setUploadForm({ ...uploadForm, key: e.target.value })}
                >
                  <option>C</option>
                  <option>C#</option>
                  <option>D</option>
                  <option>D#</option>
                  <option>E</option>
                  <option>F</option>
                  <option>F#</option>
                  <option>G</option>
                  <option>G#</option>
                  <option>A</option>
                  <option>A#</option>
                  <option>B</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Audio File</label>
              <input
                type="file"
                name="audioFile"
                accept="audio/*"
                required
              />
            </div>

            <div className="form-group">
              <label>Cover Art</label>
              <input
                type="file"
                name="coverArt"
                accept="image/*"
              />
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                checked={uploadForm.isExplicit}
                onChange={(e) => setUploadForm({ ...uploadForm, isExplicit: e.target.checked })}
              />
              <label>Explicit Content</label>
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                checked={uploadForm.downloadable}
                onChange={(e) => setUploadForm({ ...uploadForm, downloadable: e.target.checked })}
              />
              <label>Allow Downloads</label>
            </div>

            {uploadForm.downloadable && (
              <div className="form-group">
                <label>Download Price ($)</label>
                <input
                  type="number"
                  value={uploadForm.price}
                  onChange={(e) => setUploadForm({ ...uploadForm, price: parseFloat(e.target.value) })}
                  min="0"
                  step="0.99"
                />
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={uploadTrackMutation.isPending}>
              {uploadTrackMutation.isPending ? 'Uploading...' : 'Upload Track'}
            </button>
          </form>
        </div>
      )}

      {/* Tracks Tab */}
      {activeTab === 'tracks' && (
        <div className="studio-content">
          <h2>My Tracks</h2>
          {tracks && tracks.length > 0 ? (
            <div className="tracks-list">
              {tracks.map((track: any) => (
                <div key={track.id} className="track-item">
                  {track.coverArtUrl && (
                    <img src={track.coverArtUrl} alt={track.title} className="track-cover" />
                  )}
                  <div className="track-info">
                    <h4>{track.title}</h4>
                    <p className="genre">{track.genre}</p>
                    <p className="stats">
                      {track.plays} plays • {track.downloads} downloads • {track.likes} likes
                    </p>
                    <p className={`status ${track.isPublished ? 'published' : 'draft'}`}>
                      {track.isPublished ? '✓ Published' : '⚠ Draft'}
                    </p>
                  </div>
                  <div className="track-actions">
                    {!track.isPublished && (
                      <button
                        className="btn-secondary"
                        onClick={() => publishTrackMutation.mutate({ trackId: track.id })}
                      >
                        Publish
                      </button>
                    )}
                    <button
                      className="btn-danger"
                      onClick={() => deleteTrackMutation.mutate({ trackId: track.id })}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No tracks yet. Start by uploading your first track!</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Step 5: CSS Styling

Create `client/src/pages/ArtistStudio.css`:

```css
.artist-studio {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.studio-header {
  margin-bottom: 2rem;
}

.studio-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.studio-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
}

.tab {
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab:hover {
  color: #333;
}

.tab.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.studio-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.studio-content h2 {
  margin-bottom: 1.5rem;
}

.profile-form,
.upload-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.form-group.checkbox input {
  width: auto;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
}

.btn-danger:hover {
  background: #ee5a5a;
}

.tracks-list {
  display: grid;
  gap: 1rem;
}

.track-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
  align-items: center;
}

.track-cover {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
}

.track-info {
  flex: 1;
}

.track-info h4 {
  margin: 0 0 0.25rem 0;
}

.track-info .genre {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.track-info .stats {
  color: #999;
  font-size: 0.85rem;
  margin: 0 0 0.5rem 0;
}

.track-info .status {
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0;
}

.track-info .status.published {
  color: #28a745;
}

.track-info .status.draft {
  color: #ffc107;
}

.track-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 2rem;
}

@media (max-width: 768px) {
  .track-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .track-actions {
    width: 100%;
  }

  .track-actions button {
    flex: 1;
  }
}
```

### Deliverable
✅ Artist profile system  
✅ Track upload functionality  
✅ S3 storage integration  
✅ Beautiful artist studio UI  
✅ Track management interface

---

## TASK 1.2: USER PLAYLISTS & SHARING

### What This Does
Allows users to create playlists, share them publicly, and track engagement.

### Why Second
Playlists increase engagement and create viral sharing opportunities.

### Estimated Time: 1.5 weeks

### Step 1: Database Schema

Add to `drizzle/schema.ts`:

```typescript
export const userPlaylists = sqliteTable('user_playlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  isPublic: boolean('is_public').default(false),
  plays: integer('plays').default(0),
  shares: integer('shares').default(0),
  followers: integer('followers').default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const playlistTracks = sqliteTable('playlist_tracks', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull(),
  trackId: text('track_id').notNull(),
  addedBy: text('added_by').notNull(),
  trackOrder: integer('track_order'),
  addedAt: integer('added_at').notNull(),
});

export const playlistFollowers = sqliteTable('playlist_followers', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull(),
  userId: text('user_id').notNull(),
  followedAt: integer('followed_at').notNull(),
});

export const playlistShares = sqliteTable('playlist_shares', {
  id: text('id').primaryKey(),
  playlistId: text('playlist_id').notNull(),
  sharedBy: text('shared_by').notNull(),
  platform: text('platform'), // 'twitter', 'facebook', 'whatsapp', 'copy'
  sharedAt: integer('shared_at').notNull(),
});
```

### Step 2: Playlist Service

Create `server/_core/playlists.ts`:

```typescript
import { db } from '../db';
import {
  userPlaylists,
  playlistTracks,
  playlistFollowers,
  playlistShares,
} from '../../drizzle/schema';

export async function createPlaylist(
  userId: string,
  name: string,
  description?: string
) {
  const playlistId = `playlist-${Date.now()}`;

  await db.insert(userPlaylists).values({
    id: playlistId,
    userId,
    name,
    description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return playlistId;
}

export async function addTrackToPlaylist(
  playlistId: string,
  trackId: string,
  userId: string
) {
  const trackOrder = await db.query.playlistTracks.findMany({
    where: (pt) => pt.playlistId === playlistId,
  }).then((tracks) => tracks.length + 1);

  await db.insert(playlistTracks).values({
    id: `pt-${Date.now()}`,
    playlistId,
    trackId,
    addedBy: userId,
    trackOrder,
    addedAt: Date.now(),
  });

  // Update playlist updated time
  await db.update(userPlaylists)
    .set({ updatedAt: Date.now() })
    .where((up) => up.id === playlistId);
}

export async function removeTrackFromPlaylist(playlistId: string, trackId: string) {
  await db.delete(playlistTracks)
    .where((pt) => pt.playlistId === playlistId && pt.trackId === trackId);
}

export async function getPlaylistTracks(playlistId: string) {
  return await db.query.playlistTracks.findMany({
    where: (pt) => pt.playlistId === playlistId,
  });
}

export async function getUserPlaylists(userId: string) {
  return await db.query.userPlaylists.findMany({
    where: (up) => up.userId === userId,
  });
}

export async function publishPlaylist(playlistId: string) {
  return await db.update(userPlaylists)
    .set({ isPublic: true })
    .where((up) => up.id === playlistId);
}

export async function followPlaylist(playlistId: string, userId: string) {
  const existing = await db.query.playlistFollowers.findFirst({
    where: (pf) => pf.playlistId === playlistId && pf.userId === userId,
  });

  if (existing) return;

  await db.insert(playlistFollowers).values({
    id: `pf-${Date.now()}`,
    playlistId,
    userId,
    followedAt: Date.now(),
  });

  // Increment followers count
  await db.update(userPlaylists)
    .set({ followers: (await db.query.playlistFollowers.findMany({
      where: (pf) => pf.playlistId === playlistId,
    })).length })
    .where((up) => up.id === playlistId);
}

export async function sharePlaylist(
  playlistId: string,
  userId: string,
  platform: string
) {
  await db.insert(playlistShares).values({
    id: `ps-${Date.now()}`,
    playlistId,
    sharedBy: userId,
    platform,
    sharedAt: Date.now(),
  });

  // Increment shares count
  await db.update(userPlaylists)
    .set({ shares: (await db.query.playlistShares.findMany({
      where: (ps) => ps.playlistId === playlistId,
    })).length })
    .where((up) => up.id === playlistId);
}
```

### Step 3: Playlist Router

Create `server/routers/playlists.ts`:

```typescript
import { router, protectedProcedure, publicProcedure } from '../_core/router';
import { z } from 'zod';
import {
  createPlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getPlaylistTracks,
  getUserPlaylists,
  publishPlaylist,
  followPlaylist,
  sharePlaylist,
} from '../_core/playlists';

export const playlistRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await createPlaylist(ctx.user.id, input.name, input.description);
    }),

  getUserPlaylists: protectedProcedure
    .query(async ({ ctx }) => {
      return await getUserPlaylists(ctx.user.id);
    }),

  addTrack: protectedProcedure
    .input(z.object({
      playlistId: z.string(),
      trackId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await addTrackToPlaylist(input.playlistId, input.trackId, ctx.user.id);
    }),

  removeTrack: protectedProcedure
    .input(z.object({
      playlistId: z.string(),
      trackId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await removeTrackFromPlaylist(input.playlistId, input.trackId);
    }),

  getTracks: publicProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async ({ input }) => {
      return await getPlaylistTracks(input.playlistId);
    }),

  publish: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .mutation(async ({ input }) => {
      return await publishPlaylist(input.playlistId);
    }),

  follow: protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await followPlaylist(input.playlistId, ctx.user.id);
    }),

  share: protectedProcedure
    .input(z.object({
      playlistId: z.string(),
      platform: z.enum(['twitter', 'facebook', 'whatsapp', 'copy']),
    }))
    .mutation(async ({ ctx, input }) => {
      return await sharePlaylist(input.playlistId, ctx.user.id, input.platform);
    }),
});
```

### Deliverable
✅ Playlist creation system  
✅ Track management in playlists  
✅ Public playlist sharing  
✅ Playlist following system  
✅ Share tracking

---

## TASK 1.3: CREATOR MONETIZATION DASHBOARD

### What This Does
Shows creators their earnings, streams, and revenue metrics in real-time.

### Why Third
Creators need to see their earnings to stay motivated.

### Estimated Time: 1.5 weeks

### Step 1: Database Schema

Add to `drizzle/schema.ts`:

```typescript
export const creatorEarnings = sqliteTable('creator_earnings', {
  id: text('id').primaryKey(),
  artistId: text('artist_id').notNull(),
  trackId: text('track_id'),
  playlistId: text('playlist_id'),
  earningType: text('earning_type'), // 'streams', 'downloads', 'tips', 'merchandise'
  amount: real('amount').notNull(),
  currency: text('currency').default('USD'),
  period: text('period'), // 'daily', 'weekly', 'monthly'
  createdAt: integer('created_at').notNull(),
});

export const creatorPayouts = sqliteTable('creator_payouts', {
  id: text('id').primaryKey(),
  artistId: text('artist_id').notNull(),
  amount: real('amount').notNull(),
  status: text('status').default('pending'), // 'pending', 'processing', 'completed', 'failed'
  paymentMethod: text('payment_method'), // 'paypal', 'stripe', 'bank'
  transactionId: text('transaction_id'),
  requestedAt: integer('requested_at').notNull(),
  processedAt: integer('processed_at'),
});
```

### Step 2: Earnings Service

Create `server/_core/earnings.ts`:

```typescript
import { db } from '../db';
import { creatorEarnings, creatorPayouts } from '../../drizzle/schema';

export async function recordEarning(
  artistId: string,
  earningType: string,
  amount: number,
  trackId?: string,
  playlistId?: string
) {
  await db.insert(creatorEarnings).values({
    id: `earning-${Date.now()}`,
    artistId,
    trackId,
    playlistId,
    earningType,
    amount,
    createdAt: Date.now(),
  });
}

export async function getArtistEarnings(artistId: string, period?: string) {
  const query = db.query.creatorEarnings.findMany({
    where: (ce) => ce.artistId === artistId,
  });

  const earnings = await query;

  if (period) {
    return earnings.filter((e) => e.period === period);
  }

  return earnings;
}

export async function getTotalEarnings(artistId: string) {
  const earnings = await getArtistEarnings(artistId);
  return earnings.reduce((sum, e) => sum + (e.amount || 0), 0);
}

export async function getEarningsByType(artistId: string) {
  const earnings = await getArtistEarnings(artistId);

  return {
    streams: earnings
      .filter((e) => e.earningType === 'streams')
      .reduce((sum, e) => sum + (e.amount || 0), 0),
    downloads: earnings
      .filter((e) => e.earningType === 'downloads')
      .reduce((sum, e) => sum + (e.amount || 0), 0),
    tips: earnings
      .filter((e) => e.earningType === 'tips')
      .reduce((sum, e) => sum + (e.amount || 0), 0),
    merchandise: earnings
      .filter((e) => e.earningType === 'merchandise')
      .reduce((sum, e) => sum + (e.amount || 0), 0),
  };
}

export async function requestPayout(
  artistId: string,
  amount: number,
  paymentMethod: string
) {
  const payoutId = `payout-${Date.now()}`;

  await db.insert(creatorPayouts).values({
    id: payoutId,
    artistId,
    amount,
    paymentMethod,
    requestedAt: Date.now(),
  });

  return payoutId;
}

export async function getPayoutHistory(artistId: string) {
  return await db.query.creatorPayouts.findMany({
    where: (cp) => cp.artistId === artistId,
  });
}
```

### Step 3: Earnings Router

Create `server/routers/earnings.ts`:

```typescript
import { router, protectedProcedure } from '../_core/router';
import { z } from 'zod';
import {
  getArtistEarnings,
  getTotalEarnings,
  getEarningsByType,
  requestPayout,
  getPayoutHistory,
} from '../_core/earnings';

export const earningsRouter = router({
  getEarnings: protectedProcedure
    .input(z.object({ period: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return await getArtistEarnings(`artist-${ctx.user.id}`, input.period);
    }),

  getTotalEarnings: protectedProcedure
    .query(async ({ ctx }) => {
      return await getTotalEarnings(`artist-${ctx.user.id}`);
    }),

  getEarningsByType: protectedProcedure
    .query(async ({ ctx }) => {
      return await getEarningsByType(`artist-${ctx.user.id}`);
    }),

  requestPayout: protectedProcedure
    .input(z.object({
      amount: z.number().positive(),
      paymentMethod: z.enum(['paypal', 'stripe', 'bank']),
    }))
    .mutation(async ({ ctx, input }) => {
      return await requestPayout(
        `artist-${ctx.user.id}`,
        input.amount,
        input.paymentMethod
      );
    }),

  getPayoutHistory: protectedProcedure
    .query(async ({ ctx }) => {
      return await getPayoutHistory(`artist-${ctx.user.id}`);
    }),
});
```

### Step 4: Earnings Dashboard UI

Create `client/src/pages/CreatorDashboard.tsx`:

```typescript
import { trpc } from '../lib/trpc';
import './CreatorDashboard.css';

export default function CreatorDashboard() {
  const { data: totalEarnings } = trpc.earnings.getTotalEarnings.useQuery();
  const { data: earningsByType } = trpc.earnings.getEarningsByType.useQuery();
  const { data: payoutHistory } = trpc.earnings.getPayoutHistory.useQuery();
  const requestPayoutMutation = trpc.earnings.requestPayout.useMutation();

  const handleRequestPayout = async (amount: number) => {
    try {
      await requestPayoutMutation.mutateAsync({
        amount,
        paymentMethod: 'paypal',
      });
      alert('Payout requested successfully!');
    } catch (error) {
      alert('Payout request failed: ' + error);
    }
  };

  return (
    <div className="creator-dashboard">
      <h1>Creator Dashboard</h1>

      {/* Earnings Overview */}
      <div className="earnings-overview">
        <div className="earnings-card">
          <h3>Total Earnings</h3>
          <p className="earnings-amount">${(totalEarnings || 0).toFixed(2)}</p>
        </div>

        <div className="earnings-card">
          <h3>Streams</h3>
          <p className="earnings-amount">${(earningsByType?.streams || 0).toFixed(2)}</p>
        </div>

        <div className="earnings-card">
          <h3>Downloads</h3>
          <p className="earnings-amount">${(earningsByType?.downloads || 0).toFixed(2)}</p>
        </div>

        <div className="earnings-card">
          <h3>Tips</h3>
          <p className="earnings-amount">${(earningsByType?.tips || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Payout Section */}
      <div className="payout-section">
        <h2>Request Payout</h2>
        <div className="payout-options">
          <button
            className="payout-btn"
            onClick={() => handleRequestPayout(100)}
            disabled={totalEarnings! < 100}
          >
            Withdraw $100
          </button>
          <button
            className="payout-btn"
            onClick={() => handleRequestPayout(500)}
            disabled={totalEarnings! < 500}
          >
            Withdraw $500
          </button>
          <button
            className="payout-btn"
            onClick={() => handleRequestPayout(1000)}
            disabled={totalEarnings! < 1000}
          >
            Withdraw $1000
          </button>
        </div>
      </div>

      {/* Payout History */}
      <div className="payout-history">
        <h2>Payout History</h2>
        {payoutHistory && payoutHistory.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payoutHistory.map((payout: any) => (
                <tr key={payout.id}>
                  <td>{new Date(payout.requestedAt).toLocaleDateString()}</td>
                  <td>${payout.amount.toFixed(2)}</td>
                  <td>{payout.paymentMethod}</td>
                  <td className={`status ${payout.status}`}>{payout.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">No payouts yet</p>
        )}
      </div>
    </div>
  );
}
```

### Deliverable
✅ Earnings tracking system  
✅ Payout request functionality  
✅ Creator dashboard UI  
✅ Real-time earnings display

---

# FEATURE 2: MONETIZATION STRATEGY

## Why This Feature Matters

Multiple revenue streams maximize platform profitability:
- Subscriptions: Recurring revenue (predictable)
- Ads: Passive income (scalable)
- Tips: Creator support (engagement)
- Merchandise: Physical products (high margin)
- Premium Features: Advanced tools (upsell)

---

## TASK 2.1: ADVANCED SUBSCRIPTION TIERS

### What This Does
Creates flexible subscription tiers with different features and pricing.

### Why First
Subscriptions are the foundation of recurring revenue.

### Estimated Time: 1.5 weeks

### Step 1: Database Schema

Add to `drizzle/schema.ts`:

```typescript
export const subscriptionTiers = sqliteTable('subscription_tiers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  monthlyPrice: real('monthly_price'),
  yearlyPrice: real('yearly_price'),
  features: text('features'), // JSON array
  maxGenres: integer('max_genres'),
  adFree: boolean('ad_free').default(false),
  downloadLimit: integer('download_limit'),
  createdAt: integer('created_at').notNull(),
});

export const userSubscriptions = sqliteTable('user_subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  tierId: text('tier_id').notNull(),
  status: text('status').default('active'), // 'active', 'cancelled', 'expired'
  startDate: integer('start_date').notNull(),
  endDate: integer('end_date'),
  autoRenew: boolean('auto_renew').default(true),
  paymentMethod: text('payment_method'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  paypalSubscriptionId: text('paypal_subscription_id'),
  createdAt: integer('created_at').notNull(),
});
```

### Step 2: Subscription Service

Create `server/_core/subscriptions.ts`:

```typescript
import { db } from '../db';
import { subscriptionTiers, userSubscriptions } from '../../drizzle/schema';

export async function getSubscriptionTiers() {
  return await db.query.subscriptionTiers.findMany();
}

export async function getUserSubscription(userId: string) {
  return await db.query.userSubscriptions.findFirst({
    where: (us) => us.userId === userId && us.status === 'active',
  });
}

export async function createSubscription(
  userId: string,
  tierId: string,
  paymentMethod: string,
  subscriptionId?: string
) {
  const now = Date.now();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);

  const subscription = {
    id: `sub-${Date.now()}`,
    userId,
    tierId,
    status: 'active',
    startDate: now,
    endDate: endDate.getTime(),
    autoRenew: true,
    paymentMethod,
    stripeSubscriptionId: paymentMethod === 'stripe' ? subscriptionId : null,
    paypalSubscriptionId: paymentMethod === 'paypal' ? subscriptionId : null,
    createdAt: now,
  };

  await db.insert(userSubscriptions).values(subscription);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  return await db.update(userSubscriptions)
    .set({
      status: 'cancelled',
      autoRenew: false,
    })
    .where((us) => us.id === subscriptionId);
}

export async function hasFeatureAccess(userId: string, feature: string) {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return false;

  const tier = await db.query.subscriptionTiers.findFirst({
    where: (st) => st.id === subscription.tierId,
  });

  if (!tier) return false;

  const features = JSON.parse(tier.features || '[]');
  return features.includes(feature);
}
```

### Deliverable
✅ Subscription tier management  
✅ User subscription tracking  
✅ Feature access control  
✅ Subscription lifecycle management

---

## TASK 2.2: IN-APP TIPS & DONATIONS

### What This Does
Allows fans to tip artists directly, creating a direct support mechanism.

### Why Second
Tips create emotional connection and additional revenue.

### Estimated Time: 1 week

### Step 1: Database Schema

Add to `drizzle/schema.ts`:

```typescript
export const tips = sqliteTable('tips', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull(),
  recipientId: text('recipient_id').notNull(),
  amount: real('amount').notNull(),
  message: text('message'),
  trackId: text('track_id'),
  paymentStatus: text('payment_status').default('completed'),
  stripePaymentId: text('stripe_payment_id'),
  createdAt: integer('created_at').notNull(),
});
```

### Step 2: Tips Service

Create `server/_core/tips.ts`:

```typescript
import { db } from '../db';
import { tips } from '../../drizzle/schema';
import { recordEarning } from './earnings';

export async function sendTip(
  senderId: string,
  recipientId: string,
  amount: number,
  message?: string,
  trackId?: string
) {
  const tipId = `tip-${Date.now()}`;

  await db.insert(tips).values({
    id: tipId,
    senderId,
    recipientId,
    amount,
    message,
    trackId,
    createdAt: Date.now(),
  });

  // Record as earning for recipient
  await recordEarning(`artist-${recipientId}`, 'tips', amount, trackId);

  return tipId;
}

export async function getTipsReceived(recipientId: string) {
  return await db.query.tips.findMany({
    where: (t) => t.recipientId === recipientId,
  });
}

export async function getTotalTipsReceived(recipientId: string) {
  const allTips = await getTipsReceived(recipientId);
  return allTips.reduce((sum, t) => sum + (t.amount || 0), 0);
}
```

### Deliverable
✅ Tip system  
✅ Tip tracking  
✅ Earnings integration

---

## TASK 2.3: AD-SUPPORTED FREE TIER

### What This Does
Provides free tier with ads, generating revenue from non-paying users.

### Why Third
Ads monetize free users without charging them.

### Estimated Time: 1.5 weeks

### Step 1: Ad Service

Create `server/_core/ads.ts`:

```typescript
import { db } from '../db';

export async function shouldShowAds(userId: string) {
  // Check if user has premium subscription
  const subscription = await db.query.userSubscriptions.findFirst({
    where: (us) => us.userId === userId && us.status === 'active',
  });

  return !subscription;
}

export async function getAdInventory() {
  return [
    {
      id: 'ad-1',
      title: 'Premium Upgrade',
      description: 'Go ad-free with Premium',
      cta: 'Upgrade Now',
      url: '/checkout?tier=premium',
    },
    {
      id: 'ad-2',
      title: 'Artist Tools',
      description: 'Upload and monetize your music',
      cta: 'Learn More',
      url: '/artist-studio',
    },
  ];
}

export async function trackAdImpression(userId: string, adId: string) {
  // Track ad impressions for analytics
  console.log(`Ad impression: ${adId} for user ${userId}`);
}

export async function trackAdClick(userId: string, adId: string) {
  // Track ad clicks for analytics
  console.log(`Ad click: ${adId} for user ${userId}`);
}
```

### Step 2: Ad Router

Create `server/routers/ads.ts`:

```typescript
import { router, protectedProcedure } from '../_core/router';
import { z } from 'zod';
import {
  shouldShowAds,
  getAdInventory,
  trackAdImpression,
  trackAdClick,
} from '../_core/ads';

export const adsRouter = router({
  shouldShowAds: protectedProcedure
    .query(async ({ ctx }) => {
      return await shouldShowAds(ctx.user.id);
    }),

  getAdInventory: protectedProcedure
    .query(async () => {
      return await getAdInventory();
    }),

  trackImpression: protectedProcedure
    .input(z.object({ adId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await trackAdImpression(ctx.user.id, input.adId);
    }),

  trackClick: protectedProcedure
    .input(z.object({ adId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await trackAdClick(ctx.user.id, input.adId);
    }),
});
```

### Step 3: Ad Component

Create `client/src/components/AdBanner.tsx`:

```typescript
import { trpc } from '../lib/trpc';
import './AdBanner.css';

export default function AdBanner() {
  const { data: shouldShow } = trpc.ads.shouldShowAds.useQuery();
  const { data: ads } = trpc.ads.getAdInventory.useQuery();
  const trackImpressionMutation = trpc.ads.trackImpression.useMutation();
  const trackClickMutation = trpc.ads.trackClick.useMutation();

  if (!shouldShow || !ads || ads.length === 0) return null;

  const ad = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div className="ad-banner">
      <div className="ad-content">
        <h4>{ad.title}</h4>
        <p>{ad.description}</p>
        <a
          href={ad.url}
          className="ad-cta"
          onClick={() => trackClickMutation.mutate({ adId: ad.id })}
        >
          {ad.cta}
        </a>
      </div>
      <button className="ad-close">✕</button>
    </div>
  );
}
```

### Deliverable
✅ Ad system  
✅ Ad tracking  
✅ Ad component

---

# MONETIZATION REVENUE MODEL

## Revenue Streams Breakdown

| Stream | Monthly Revenue | Annual Revenue | Effort |
|--------|-----------------|-----------------|--------|
| Subscriptions (100 users × $9.99) | $999 | $11,988 | Medium |
| Ads (10k impressions × $0.05 CPM) | $500 | $6,000 | Low |
| Tips (50 tips × $5 avg) | $250 | $3,000 | Low |
| Creator Payouts (30% cut) | $300 | $3,600 | Low |
| **Total** | **$2,049** | **$24,588** | - |

## Scaling Projections

| Month | Users | Subscriptions | Revenue |
|-------|-------|---------------|---------|
| Month 1 | 100 | 10 | $100 |
| Month 3 | 500 | 75 | $750 |
| Month 6 | 2,000 | 400 | $4,000 |
| Month 12 | 10,000 | 2,500 | $25,000 |
| Month 24 | 50,000 | 15,000 | $150,000 |

---

# IMPLEMENTATION CHECKLIST

## Feature 1: User-Generated Content

- [ ] Task 1.1: Artist Upload System
  - [ ] Create database tables
  - [ ] Build upload service
  - [ ] Create upload router
  - [ ] Build artist studio UI
  - [ ] Test uploads

- [ ] Task 1.2: User Playlists
  - [ ] Create playlist tables
  - [ ] Build playlist service
  - [ ] Create playlist router
  - [ ] Build playlist UI
  - [ ] Test sharing

- [ ] Task 1.3: Creator Dashboard
  - [ ] Create earnings tables
  - [ ] Build earnings service
  - [ ] Create earnings router
  - [ ] Build dashboard UI
  - [ ] Test payouts

## Feature 2: Monetization

- [ ] Task 2.1: Subscription Tiers
  - [ ] Create subscription tables
  - [ ] Build subscription service
  - [ ] Create subscription router
  - [ ] Integrate with payment system
  - [ ] Test subscriptions

- [ ] Task 2.2: Tips & Donations
  - [ ] Create tips table
  - [ ] Build tips service
  - [ ] Create tips router
  - [ ] Build tip UI
  - [ ] Test payments

- [ ] Task 2.3: Ad System
  - [ ] Create ad service
  - [ ] Build ad router
  - [ ] Create ad component
  - [ ] Integrate into pages
  - [ ] Test ad display

---

# TESTING CHECKLIST

## UGC Features
- [ ] Upload track successfully
- [ ] Publish track
- [ ] Create playlist
- [ ] Add track to playlist
- [ ] Share playlist
- [ ] Follow playlist
- [ ] View creator dashboard
- [ ] Request payout

## Monetization Features
- [ ] Subscribe to tier
- [ ] Cancel subscription
- [ ] Send tip
- [ ] View ads (free users)
- [ ] No ads (premium users)
- [ ] Track ad impressions
- [ ] Track ad clicks

---

# ESTIMATED TIMELINE

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Planning & Setup | 3-4 days | Architecture docs |
| Feature 1: UGC | 4 weeks | Artist uploads + playlists |
| Feature 2: Monetization | 4 weeks | Subscriptions + tips + ads |
| Integration & Testing | 1 week | All features integrated |
| Deployment | 2-3 days | Live on production |
| **Total** | **6-8 weeks** | **Both features live** |

---

# SUCCESS METRICS

After launching Phase 2, track these metrics:

**UGC Metrics**
- Creator signups: 50+ new creators
- Uploads per creator: 5+ tracks average
- Playlist creation: 30%+ of users create playlists
- Playlist shares: 100+ shares per day

**Monetization Metrics**
- Subscription conversion: 5-10% of users
- Monthly recurring revenue: $2,000+
- Average tip value: $5+
- Ad click-through rate: 2-5%
- Creator payout requests: 20+ per month

---

This roadmap provides everything needed to implement Phase 2. Start with Task 1.1 and work through sequentially. Good luck! 🚀
