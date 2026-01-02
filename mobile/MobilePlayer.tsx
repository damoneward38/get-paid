import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  isDownloaded?: boolean;
}

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentSongIndex: number;
  playlist: Song[];
  volume: number;
  isOfflineMode: boolean;
}

export default function MobilePlayer() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentSongIndex: 0,
    playlist: [],
    volume: 1,
    isOfflineMode: false,
  });

  const soundRef = useRef<Audio.Sound | null>(null);
  const downloadedSongsRef = useRef<Set<string>>(new Set());

  // Initialize audio and notifications
  useEffect(() => {
    initializeAudio();
    initializeNotifications();
    loadDownloadedSongs();
  }, []);

  const initializeAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  };

  const initializeNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }

      // Set notification handler
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const loadDownloadedSongs = async () => {
    try {
      const downloadsDir = `${FileSystem.documentDirectory}downloads`;
      const files = await FileSystem.readDirectoryAsync(downloadsDir).catch(() => []);
      downloadedSongsRef.current = new Set(files.map((f) => f.replace('.mp3', '')));
    } catch (error) {
      console.error('Failed to load downloaded songs:', error);
    }
  };

  const downloadSong = async (song: Song) => {
    try {
      const downloadsDir = `${FileSystem.documentDirectory}downloads`;
      await FileSystem.makeDirectoryAsync(downloadsDir, { intermediates: true }).catch(() => {});

      const filePath = `${downloadsDir}/${song.id}.mp3`;

      Alert.alert('Downloading', `Downloading ${song.title}...`);

      await FileSystem.downloadAsync(song.url, filePath);

      downloadedSongsRef.current.add(song.id);

      // Send notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Download Complete',
          body: `${song.title} is ready to play offline`,
          sound: 'default',
        },
        trigger: null,
      });

      Alert.alert('Success', `${song.title} downloaded successfully`);
    } catch (error) {
      console.error('Download failed:', error);
      Alert.alert('Error', 'Failed to download song');
    }
  };

  const playSong = async (song: Song) => {
    try {
      // Stop current song if playing
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      }

      // Determine song URL (offline or online)
      let songUrl = song.url;
      if (downloadedSongsRef.current.has(song.id)) {
        songUrl = `${FileSystem.documentDirectory}downloads/${song.id}.mp3`;
      }

      // Create and load sound
      const { sound } = await Audio.Sound.createAsync({ uri: songUrl });
      soundRef.current = sound;

      // Set up playback status update
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          setPlayerState((prev) => ({
            ...prev,
            currentTime: status.positionMillis || 0,
            duration: status.durationMillis || 0,
            isPlaying: status.isPlaying,
          }));

          // Auto-play next song when finished
          if (status.didJustFinish) {
            playNextSong();
          }
        }
      });

      // Play sound
      await sound.playAsync();

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: true,
      }));

      // Send now playing notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Now Playing',
          body: `${song.title} by ${song.artist}`,
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Failed to play song:', error);
      Alert.alert('Error', 'Failed to play song');
    }
  };

  const pausePlayback = async () => {
    try {
      if (soundRef.current && playerState.isPlaying) {
        await soundRef.current.pauseAsync();
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      }
    } catch (error) {
      console.error('Failed to pause:', error);
    }
  };

  const resumePlayback = async () => {
    try {
      if (soundRef.current && !playerState.isPlaying) {
        await soundRef.current.playAsync();
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Failed to resume:', error);
    }
  };

  const playNextSong = async () => {
    const nextIndex = (playerState.currentSongIndex + 1) % playerState.playlist.length;
    setPlayerState((prev) => ({ ...prev, currentSongIndex: nextIndex }));
    if (playerState.playlist[nextIndex]) {
      await playSong(playerState.playlist[nextIndex]);
    }
  };

  const playPreviousSong = async () => {
    const prevIndex =
      (playerState.currentSongIndex - 1 + playerState.playlist.length) %
      playerState.playlist.length;
    setPlayerState((prev) => ({ ...prev, currentSongIndex: prevIndex }));
    if (playerState.playlist[prevIndex]) {
      await playSong(playerState.playlist[prevIndex]);
    }
  };

  const setVolume = (newVolume: number) => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(newVolume);
    }
    setPlayerState((prev) => ({ ...prev, volume: newVolume }));
  };

  const seek = async (position: number) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(position);
      }
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentSong = playerState.playlist[playerState.currentSongIndex];

  return (
    <View style={styles.container}>
      {/* Now Playing */}
      {currentSong && (
        <View style={styles.nowPlayingSection}>
          <View style={styles.albumArt}>
            <MaterialCommunityIcons name="music" size={60} color="#a855f7" />
          </View>
          <Text style={styles.songTitle}>{currentSong.title}</Text>
          <Text style={styles.artistName}>{currentSong.artist}</Text>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.timeText}>{formatTime(playerState.currentTime)}</Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${
                      (playerState.currentTime / playerState.duration) * 100 || 0
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.timeText}>{formatTime(playerState.duration)}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={playPreviousSong}>
              <MaterialCommunityIcons name="skip-previous" size={32} color="#a855f7" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={playerState.isPlaying ? pausePlayback : resumePlayback}
              style={styles.playButton}
            >
              <MaterialCommunityIcons
                name={playerState.isPlaying ? 'pause' : 'play'}
                size={40}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNextSong}>
              <MaterialCommunityIcons name="skip-next" size={32} color="#a855f7" />
            </TouchableOpacity>
          </View>

          {/* Volume Control */}
          <View style={styles.volumeSection}>
            <MaterialCommunityIcons name="volume-low" size={20} color="#a855f7" />
            <View style={styles.volumeSlider}>
              <View
                style={[
                  styles.volumeFill,
                  { width: `${playerState.volume * 100}%` },
                ]}
              />
            </View>
            <MaterialCommunityIcons name="volume-high" size={20} color="#a855f7" />
          </View>

          {/* Download Button */}
          {!downloadedSongsRef.current.has(currentSong.id) && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => downloadSong(currentSong)}
            >
              <MaterialCommunityIcons name="download" size={20} color="white" />
              <Text style={styles.downloadButtonText}>Download for Offline</Text>
            </TouchableOpacity>
          )}

          {downloadedSongsRef.current.has(currentSong.id) && (
            <View style={styles.downloadedBadge}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#10b981" />
              <Text style={styles.downloadedText}>Downloaded</Text>
            </View>
          )}
        </View>
      )}

      {/* Playlist */}
      <ScrollView style={styles.playlistSection}>
        {playerState.playlist.map((song, index) => (
          <TouchableOpacity
            key={song.id}
            style={[
              styles.playlistItem,
              index === playerState.currentSongIndex && styles.playlistItemActive,
            ]}
            onPress={() => playSong(song)}
          >
            <View style={styles.playlistItemContent}>
              <Text style={styles.playlistItemTitle}>{song.title}</Text>
              <Text style={styles.playlistItemArtist}>{song.artist}</Text>
            </View>
            <View style={styles.playlistItemRight}>
              {downloadedSongsRef.current.has(song.id) && (
                <MaterialCommunityIcons name="check" size={20} color="#10b981" />
              )}
              <Text style={styles.playlistItemDuration}>
                {formatTime(song.duration)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  nowPlayingSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.2)',
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  artistName: {
    fontSize: 16,
    color: '#a78bfa',
    marginBottom: 20,
  },
  progressSection: {
    width: '100%',
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 2,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a855f7',
  },
  timeText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    gap: 10,
  },
  volumeSlider: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#a855f7',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a855f7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  downloadedText: {
    color: '#10b981',
    fontWeight: '600',
  },
  playlistSection: {
    flex: 1,
    padding: 10,
  },
  playlistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  playlistItemActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  playlistItemContent: {
    flex: 1,
  },
  playlistItemTitle: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 4,
  },
  playlistItemArtist: {
    color: '#a78bfa',
    fontSize: 12,
  },
  playlistItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playlistItemDuration: {
    color: '#cbd5e1',
    fontSize: 12,
  },
});
