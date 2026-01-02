/**
 * Seed Gospel Tracks - Direct SQL Version
 */

import mysql from 'mysql2/promise';

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
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'gifted_eternity',
    });

    console.log('🎵 Starting to seed gospel tracks...');
    const now = Math.floor(Date.now() / 1000);

    for (const track of gospelTracks) {
      const sql = `
        INSERT INTO tracks (title, artistId, albumId, genre, duration, audioUrl, coverImageUrl, isPublished, releaseDate, createdAt)
        VALUES (?, 1, 1, ?, ?, ?, ?, 1, ?, ?)
      `;

      await connection.execute(sql, [
        track.title,
        track.genre,
        track.duration,
        `https://example.com/audio/${track.title.replace(/\s+/g, '-').toLowerCase()}.mp3`,
        'https://example.com/cover.jpg',
        now,
        now,
      ]);

      console.log(`✅ Added: ${track.title}`);
    }

    console.log('🎉 Successfully seeded 50 gospel tracks!');
  } catch (error) {
    console.error('❌ Error seeding tracks:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

seedTracks();
