/**
 * Seed Gospel Tracks
 * Populate database with 50 gospel music tracks
 */

import { drizzle } from 'drizzle-orm/mysql2/promise';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const gospelTracks = [
  { title: "Amazing Grace", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 240 },
  { title: "How Great Thou Art", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 260 },
  { title: "Jesus Loves Me", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 180 },
  { title: "I'll Fly Away", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 220 },
  { title: "Oh Happy Day", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 200 },
  { title: "Swing Low Sweet Chariot", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 240 },
  { title: "Wade in the Water", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 210 },
  { title: "Go Down Moses", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 230 },
  { title: "Blessed Assurance", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 250 },
  { title: "Jesus Christ is Risen Today", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 270 },
  { title: "The Old Rugged Cross", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 240 },
  { title: "Just As I Am", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 220 },
  { title: "Nearer My God to Thee", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 260 },
  { title: "Rock of Ages", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 230 },
  { title: "What a Friend We Have in Jesus", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 250 },
  { title: "Jesus Paid It All", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 240 },
  { title: "At the Cross", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 220 },
  { title: "It Is Well", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 210 },
  { title: "Great Is Thy Faithfulness", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 260 },
  { title: "Jesus Loves the Little Children", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 180 },
  { title: "Precious Jesus", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 240 },
  { title: "Hallelujah", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 200 },
  { title: "Glory to God", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 230 },
  { title: "Holy Holy Holy", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 250 },
  { title: "Praise God from Whom All Blessings Flow", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 220 },
  { title: "Crown Him with Many Crowns", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 240 },
  { title: "O Come All Ye Faithful", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 260 },
  { title: "Joy to the World", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 230 },
  { title: "Silent Night", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 210 },
  { title: "O Little Town of Bethlehem", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 240 },
  { title: "Hark the Herald Angels Sing", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 250 },
  { title: "O Come O Come Emmanuel", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 220 },
  { title: "Angels We Have Heard on High", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 240 },
  { title: "It Came Upon a Midnight Clear", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 230 },
  { title: "Deck the Halls", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 210 },
  { title: "God Rest Ye Merry Gentlemen", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 240 },
  { title: "We Three Kings", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 260 },
  { title: "O Sanctissima", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 220 },
  { title: "Gaudete", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 200 },
  { title: "Carol of the Bells", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 230 },
  { title: "The First Noel", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 250 },
  { title: "What Child Is This", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 240 },
  { title: "Good Christian Men Rejoice", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 220 },
  { title: "Ding Dong Merrily on High", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 210 },
  { title: "O Come All Ye Faithful (Reprise)", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 240 },
  { title: "Adeste Fideles", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 260 },
  { title: "Veni Veni Emmanuel", artist: "Gospel Singers", album: "Heavenly Voices", genre: "Gospel", duration: 230 },
  { title: "Christus Natus Est", artist: "Gospel Ensemble", album: "Joyful Praise", genre: "Gospel", duration: 250 },
  { title: "Gloria in Excelsis Deo", artist: "Damone Ward Sr.", album: "Hymns of Faith", genre: "Gospel", duration: 220 },
  { title: "Magnificat", artist: "Gospel Choir", album: "Spiritual Songs", genre: "Gospel", duration: 240 },
];

async function seedTracks() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gifted_eternity',
    });

    const db = drizzle(connection, { schema });

    console.log('🎵 Starting to seed gospel tracks...');

    // First, get or create Damone Ward Sr. as artist
    let damoneId = 1;
    let gospelChoirId = 2;
    let gospelSingersId = 3;
    let gospelEnsembleId = 4;

    // Insert tracks
    for (const track of gospelTracks) {
      let artistId = damoneId;
      if (track.artist === 'Gospel Choir') artistId = gospelChoirId;
      else if (track.artist === 'Gospel Singers') artistId = gospelSingersId;
      else if (track.artist === 'Gospel Ensemble') artistId = gospelEnsembleId;

      await db.insert(schema.tracks).values({
        title: track.title,
        artistId,
        albumId: 1,
        genre: track.genre,
        duration: track.duration,
        audioUrl: `https://example.com/audio/${track.title.replace(/\s+/g, '-').toLowerCase()}.mp3`,
        coverImageUrl: 'https://example.com/cover.jpg',
        isPublished: 1,
        releaseDate: Math.floor(Date.now() / 1000),
        createdAt: Math.floor(Date.now() / 1000),
      });

      console.log(`✅ Added: ${track.title} by ${track.artist}`);
    }

    console.log('🎉 Successfully seeded 50 gospel tracks!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error seeding tracks:', error);
    process.exit(1);
  }
}

seedTracks();
