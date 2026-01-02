import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Gifted Eternity',
  slug: 'gifted-eternity-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#0f172a',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTabletMode: true,
    bundleIdentifier: 'com.giftedeternitystudio.mobile',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'We need camera access to record audio',
      NSMicrophoneUsageDescription: 'We need microphone access to record music',
      NSPhotoLibraryUsageDescription: 'We need photo library access to upload cover art',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0f172a',
    },
    package: 'com.giftedeternitystudio.mobile',
    versionCode: 1,
    permissions: [
      'android.permission.CAMERA',
      'android.permission.MICROPHONE',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
    ],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
        cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera.',
      },
    ],
    [
      'expo-av',
      {
        microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
      },
    ],
  ],
  extra: {
    apiUrl: process.env.API_URL || 'https://api.giftedeternitystudio.com',
    oauthUrl: process.env.OAUTH_URL || 'https://oauth.giftedeternitystudio.com',
  },
  scheme: 'giftedeternitymobile',
  notification: {
    icon: './assets/notification-icon.png',
    color: '#a855f7',
    sounds: ['./assets/notification-sound.wav'],
  },
  updates: {
    enabled: true,
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
});
