# Music Upload & File Management System

## Overview

Complete system for uploading music files, artwork, and managing metadata with a beautiful UI featuring:
- **Plus Button** - File picker to upload music from documents
- **Pencil Button** - Edit metadata and track details
- **Drag & Drop** - Upload files by dragging
- **Progress Tracking** - Real-time upload progress
- **Metadata Editor** - Comprehensive track information

## Database Schema

### musicUploads Table
Stores uploaded music files and basic information.

```sql
CREATE TABLE musicUploads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uploadedBy INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255),
  genre VARCHAR(100),
  description TEXT,
  duration INT,
  fileKey VARCHAR(500) NOT NULL,
  fileUrl VARCHAR(500) NOT NULL,
  mimeType VARCHAR(100) NOT NULL,
  fileSize INT,
  status ENUM('draft', 'processing', 'published', 'archived') DEFAULT 'draft',
  releaseDate TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**
- `uploadedBy` - User who uploaded the file
- `fileKey` - S3 storage key for the file
- `fileUrl` - Public URL to access the file
- `status` - Current state (draft, processing, published, archived)
- `mimeType` - Audio format (audio/mpeg, audio/wav, etc.)

### albumArtwork Table
Stores album cover art and artwork.

```sql
CREATE TABLE albumArtwork (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uploadedBy INT NOT NULL,
  albumName VARCHAR(255) NOT NULL,
  artworkKey VARCHAR(500) NOT NULL,
  artworkUrl VARCHAR(500) NOT NULL,
  mimeType VARCHAR(100) NOT NULL,
  fileSize INT,
  width INT,
  height INT,
  status ENUM('draft', 'approved', 'published') DEFAULT 'draft',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE
);
```

### musicMetadata Table
Detailed metadata for tracks (composer, lyricist, lyrics, etc.).

```sql
CREATE TABLE musicMetadata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  musicUploadId INT NOT NULL UNIQUE,
  composer VARCHAR(255),
  lyricist VARCHAR(255),
  producer VARCHAR(255),
  recordLabel VARCHAR(255),
  isrc VARCHAR(20),
  iswc VARCHAR(20),
  bpm INT,
  key VARCHAR(10),
  language VARCHAR(10),
  lyrics TEXT,
  tags VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (musicUploadId) REFERENCES musicUploads(id) ON DELETE CASCADE
);
```

### uploadSessions Table
Tracks ongoing upload sessions.

```sql
CREATE TABLE uploadSessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uploadedBy INT NOT NULL,
  sessionId VARCHAR(255) NOT NULL UNIQUE,
  fileName VARCHAR(255) NOT NULL,
  fileType VARCHAR(100) NOT NULL,
  totalSize INT NOT NULL,
  uploadedSize INT DEFAULT 0,
  status ENUM('pending', 'uploading', 'completed', 'failed') DEFAULT 'pending',
  errorMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiresAt TIMESTAMP,
  FOREIGN KEY (uploadedBy) REFERENCES users(id) ON DELETE CASCADE
);
```

## Backend Implementation

### File Upload Service (`server/_core/fileUpload.ts`)

**Key Methods:**

#### createUploadSession
```typescript
const sessionId = await fileUploadService.createUploadSession(
  userId,
  fileName,
  fileType,
  totalSize
);
```

#### uploadMusic
```typescript
const result = await fileUploadService.uploadMusic(userId, {
  title: "Amazing Gospel Song",
  artist: "Damone Ward Sr.",
  album: "Gifted Eternity",
  genre: "Gospel",
  description: "A beautiful gospel track",
  fileBuffer: audioBuffer,
  fileName: "song.mp3",
  mimeType: "audio/mpeg",
  duration: 240,
  releaseDate: new Date()
});
```

#### uploadArtwork
```typescript
const result = await fileUploadService.uploadArtwork(userId, {
  albumName: "Gifted Eternity",
  fileBuffer: imageBuffer,
  fileName: "cover.jpg",
  mimeType: "image/jpeg",
  width: 3000,
  height: 3000
});
```

#### updateMusicMetadata
```typescript
await fileUploadService.updateMusicMetadata(userId, {
  musicUploadId: 1,
  composer: "Damone Ward Sr.",
  lyricist: "Damone Ward Sr.",
  producer: "Producer Name",
  recordLabel: "Label Name",
  isrc: "US-XXX-XX-XXXXX",
  bpm: 120,
  key: "C Major",
  language: "en",
  lyrics: "Full lyrics text...",
  tags: "gospel,worship,spiritual"
});
```

#### updateMusicInfo
```typescript
await fileUploadService.updateMusicInfo(userId, musicUploadId, {
  title: "Updated Title",
  artist: "Updated Artist",
  album: "Updated Album",
  genre: "Gospel",
  description: "Updated description"
});
```

#### publishMusic
```typescript
await fileUploadService.publishMusic(userId, musicUploadId);
```

#### deleteMusic
```typescript
await fileUploadService.deleteMusic(userId, musicUploadId);
```

#### getUserUploads
```typescript
const uploads = await fileUploadService.getUserUploads(userId, 'published');
```

#### getMusicDetails
```typescript
const details = await fileUploadService.getMusicDetails(musicUploadId);
// Returns: { ...musicData, metadata: {...} }
```

## tRPC Router (`server/routers/uploads.ts`)

### Procedures

#### uploadMusic (Protected)
```typescript
trpc.uploads.uploadMusic.mutate({
  title: "Song Title",
  artist: "Artist Name",
  album: "Album Name",
  genre: "Gospel",
  description: "Description",
  fileBuffer: buffer,
  fileName: "song.mp3",
  mimeType: "audio/mpeg"
})
```

#### uploadArtwork (Protected)
```typescript
trpc.uploads.uploadArtwork.mutate({
  albumName: "Album Name",
  fileBuffer: buffer,
  fileName: "cover.jpg",
  mimeType: "image/jpeg"
})
```

#### updateMusicMetadata (Protected)
```typescript
trpc.uploads.updateMusicMetadata.mutate({
  musicUploadId: 1,
  composer: "Name",
  lyricist: "Name",
  producer: "Name",
  // ... other fields
})
```

#### updateMusicInfo (Protected)
```typescript
trpc.uploads.updateMusicInfo.mutate({
  musicUploadId: 1,
  title: "New Title",
  artist: "New Artist"
})
```

#### publishMusic (Protected)
```typescript
trpc.uploads.publishMusic.mutate({ musicUploadId: 1 })
```

#### deleteMusic (Protected)
```typescript
trpc.uploads.deleteMusic.mutate({ musicUploadId: 1 })
```

#### getUserUploads (Protected)
```typescript
const { data } = trpc.uploads.getUserUploads.useQuery({ status: 'draft' })
```

#### getMusicDetails (Public)
```typescript
const { data } = trpc.uploads.getMusicDetails.useQuery({ musicUploadId: 1 })
```

## Frontend Components

### MusicUploadForm Component

**Features:**
- Plus button to select files
- Drag & drop support
- File validation (type and size)
- Progress tracking
- Form fields for metadata
- Error handling

**Usage:**
```tsx
import { MusicUploadForm } from '@/components/MusicUploadForm';

function UploadPage() {
  return (
    <MusicUploadForm 
      onUploadComplete={(musicId) => {
        console.log('Uploaded:', musicId);
      }}
    />
  );
}
```

### MusicMetadataEditor Component

**Features:**
- Pencil button to enter edit mode
- Edit basic info (title, artist, album, genre)
- Edit advanced metadata (composer, lyricist, producer, BPM, key, lyrics)
- Save and cancel buttons
- Real-time form updates

**Usage:**
```tsx
import { MusicMetadataEditor } from '@/components/MusicMetadataEditor';

function TrackDetail({ musicId }) {
  return (
    <MusicMetadataEditor
      musicId={musicId}
      initialData={{
        title: "Song Title",
        artist: "Artist Name",
        album: "Album Name"
      }}
      onSave={() => {
        console.log('Metadata saved');
      }}
    />
  );
}
```

## File Upload Flow

### Step 1: Select File
User clicks **Plus button** → File picker opens → Select audio file

### Step 2: Enter Metadata
User fills in:
- Title (required)
- Artist (required)
- Album (optional)
- Genre (optional)
- Description (optional)

### Step 3: Upload
User clicks **Upload Music** → Progress bar shows upload status

### Step 4: Edit Metadata
User clicks **Pencil button** → Edit form opens → User updates:
- Basic info (title, artist, album, genre, description)
- Advanced metadata (composer, lyricist, producer, BPM, key, lyrics, tags)

### Step 5: Publish
User publishes track → Status changes to "published" → Track becomes available

## Supported Audio Formats

- **MP3** (audio/mpeg)
- **WAV** (audio/wav)
- **OGG** (audio/ogg)
- **M4A** (audio/mp4)
- **FLAC** (audio/flac)

**Maximum file size:** 500MB

## File Storage

All files are stored in S3 with:
- **Unique file keys** - Prevents enumeration
- **Public URLs** - Direct access to files
- **MIME type tracking** - Proper content serving
- **File size tracking** - Bandwidth management

## Integration Steps

### Step 1: Add Database Tables
```bash
pnpm db:push
```

### Step 2: Import Upload Router
Update `server/routers.ts`:
```typescript
import { uploadsRouter } from './routers/uploads';

export const appRouter = router({
  // ... existing routers
  uploads: uploadsRouter,
});
```

### Step 3: Add Upload Form to Artist Dashboard
```tsx
import { MusicUploadForm } from '@/components/MusicUploadForm';

function ArtistDashboard() {
  return (
    <div>
      <h1>Upload Music</h1>
      <MusicUploadForm />
    </div>
  );
}
```

### Step 4: Add Metadata Editor to Track Detail
```tsx
import { MusicMetadataEditor } from '@/components/MusicMetadataEditor';

function TrackDetail({ musicId }) {
  return (
    <MusicMetadataEditor musicId={musicId} />
  );
}
```

## API Examples

### Upload Music
```typescript
const file = document.querySelector('input[type="file"]').files[0];
const buffer = await file.arrayBuffer();

const result = await trpc.uploads.uploadMusic.mutate({
  title: "My Gospel Song",
  artist: "My Name",
  fileBuffer: Buffer.from(buffer),
  fileName: file.name,
  mimeType: file.type
});

console.log('Uploaded:', result.id);
```

### Update Metadata
```typescript
await trpc.uploads.updateMusicMetadata.mutate({
  musicUploadId: 1,
  composer: "Composer Name",
  lyrics: "Full lyrics...",
  tags: "gospel,worship"
});
```

### Get User's Uploads
```typescript
const { data: uploads } = trpc.uploads.getUserUploads.useQuery({
  status: 'draft'
});
```

### Publish Track
```typescript
await trpc.uploads.publishMusic.mutate({
  musicUploadId: 1
});
```

## Files Created

- `drizzle/upload_schema.ts` - Database schema
- `server/_core/fileUpload.ts` - Upload service
- `server/routers/uploads.ts` - tRPC router
- `client/src/components/MusicUploadForm.tsx` - Upload UI
- `client/src/components/MusicMetadataEditor.tsx` - Metadata editor
- `MUSIC_UPLOAD_GUIDE.md` - This guide
