# Android Build Configuration - Complete Guide

## Prerequisites
- Android Studio installed
- Java Development Kit (JDK) 11+
- Android SDK 31+
- Google Play Developer Account ($25 one-time)

## Step 1: Generate Keystore

```bash
keytool -genkey -v -keystore ~/gifted_eternity.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias gifted_eternity_key
```

Enter the following information:
- Password: (secure password)
- First and Last Name: Your Name
- Organizational Unit: Your Company
- Organization: Your Company
- City: Your City
- State: Your State
- Country Code: US (or your country)

## Step 2: Create Google Play Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Create developer account ($25 one-time fee)
3. Accept agreements
4. Set up store listing

## Step 3: Configure Build Settings

### Update app.json
```json
{
  "expo": {
    "android": {
      "package": "com.giftedeternitystudio.app",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "RECORD_AUDIO",
        "MODIFY_AUDIO_SETTINGS",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ],
      "useNextNotificationApi": true
    }
  }
}
```

### Create eas.json
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview2": {
      "android": {
        "buildType": "apk"
      }
    },
    "preview3": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

## Step 4: Build APK for Testing

```bash
cd mobile
eas build --platform android --profile preview
```

## Step 5: Build AAB for Production

```bash
eas build --platform android --profile production
```

## Step 6: Upload to Google Play

### Via Google Play Console
1. Go to Google Play Console
2. Select your app
3. Go to Release > Production
4. Click "Create new release"
5. Upload AAB file
6. Add release notes
7. Review and publish

### Via Command Line
```bash
bundletool build-apks \
  --bundle=app-release.aab \
  --output=app-release.apks \
  --ks=gifted_eternity.keystore \
  --ks-pass=pass:your_password \
  --ks-key-alias=gifted_eternity_key \
  --key-pass=pass:your_password
```

## Step 7: Testing

### Install on Device
```bash
adb install app-release.apk
```

### Run Tests
```bash
npm run test:android
```

## Troubleshooting

### Build Failures
- Clear cache: `gradle clean`
- Update dependencies: `gradle dependencies`
- Check Java version: `java -version`

### Signing Issues
- Verify keystore exists
- Check password is correct
- Ensure key alias matches

### Upload Errors
- Verify AAB format is correct
- Check version code is higher than previous
- Ensure all required fields are filled

### Runtime Issues
- Check permissions in AndroidManifest.xml
- Verify API level compatibility
- Test on multiple devices

## Resources
- [Android Developer Documentation](https://developer.android.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android Studio Guide](https://developer.android.com/studio/intro)

## App Signing Certificate Fingerprints

### Debug Keystore
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### Release Keystore
```bash
keytool -list -v -keystore ~/gifted_eternity.keystore -alias gifted_eternity_key
```

Store these fingerprints for:
- Google Play Services
- Firebase Configuration
- OAuth providers
