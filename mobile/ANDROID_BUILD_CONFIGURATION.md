# Android Build Configuration Guide
**Gifted Eternity Mobile App**

## Overview

Complete guide for configuring Android build settings, keystore generation, and signing for production deployment.

---

## 1. Prerequisites

### Required Software
- Android Studio 2021.1 or later
- Java Development Kit (JDK) 11 or later
- Android SDK 30 or later
- Google Play Developer Account ($25 one-time)

### Installation

```bash
# Install Android Studio
# Download from https://developer.android.com/studio

# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Verify installation
adb version
```

---

## 2. Google Play Developer Account Setup

### Create Developer Account

1. Visit [play.google.com/console](https://play.google.com/console)
2. Sign in with Google Account
3. Pay $25 one-time registration fee
4. Complete developer profile
5. Accept Google Play Developer Program Policies

### Developer Profile

```
Organization: Gifted Eternity Studio
Email: developer@giftedeternitystudio.com
Website: giftedeternitystudio.com
Privacy Policy: https://giftedeternitystudio.com/privacy
```

---

## 3. Keystore Generation

### Create Signing Keystore

```bash
# Generate keystore file
keytool -genkey -v -keystore gifted_eternity.keystore \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10950 \
  -alias gifted_eternity_key

# When prompted, enter:
Keystore password: [SECURE_PASSWORD]
Key password: [SECURE_PASSWORD]
First and last name: Damone Ward Sr.
Organization: Gifted Eternity Studio
Organizational unit: Mobile Development
City: [Your City]
State: [Your State]
Country code: US
```

### Keystore Details

```
Keystore File: gifted_eternity.keystore
Alias: gifted_eternity_key
Key Algorithm: RSA
Key Size: 2048 bits
Validity: 10950 days (30 years)
Signature Algorithm: SHA256withRSA
```

### Secure Keystore

```bash
# Store keystore in secure location
mkdir -p ~/.android/keystores
cp gifted_eternity.keystore ~/.android/keystores/

# Set permissions
chmod 600 ~/.android/keystores/gifted_eternity.keystore

# Never commit to version control
echo "gifted_eternity.keystore" >> .gitignore
```

---

## 4. Android Project Configuration

### build.gradle Configuration

```gradle
android {
    compileSdkVersion 33
    
    defaultConfig {
        applicationId "com.giftedeternitystudio.app"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
        
        // Push notifications
        manifestPlaceholders = [
            fcmDefaultChannelId: "gifted_eternity_notifications"
        ]
    }
    
    signingConfigs {
        release {
            storeFile file("~/.android/keystores/gifted_eternity.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Environment Variables

```bash
# Set in ~/.bashrc or ~/.zshrc
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="gifted_eternity_key"
export KEY_PASSWORD="your_key_password"

# Or create local.properties
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=gifted_eternity_key
KEY_PASSWORD=your_key_password
```

---

## 5. App Signing

### Generate Signed APK

```bash
# Navigate to project
cd gifted_eternity_stream_web/mobile

# Build signed APK
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Generate Signed Bundle (AAB)

```bash
# Build Android App Bundle (recommended for Play Store)
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Verify Signature

```bash
# Check APK signature
jarsigner -verify -verbose gifted_eternity_stream_web/mobile/android/app/build/outputs/apk/release/app-release.apk

# Check certificate details
keytool -printcert -jarfile gifted_eternity_stream_web/mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## 6. Firebase Setup (Push Notifications)

### Create Firebase Project

1. Visit [console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create Project"
3. Project name: Gifted Eternity
4. Enable Google Analytics
5. Create project

### Add Android App

```
1. Click "Add app"
2. Select Android
3. Package name: com.giftedeternitystudio.app
4. App nickname: Gifted Eternity
5. Download google-services.json
6. Place in: android/app/google-services.json
```

### Configure build.gradle

```gradle
buildscript {
    dependencies {
        classpath 'com.google.gms:google-services:4.3.15'
    }
}

apply plugin: 'com.google.gms.google-services'

dependencies {
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

---

## 7. App Icons & Splash Screens

### App Icon Sizes

```
Android App Icon Sizes:
- ldpi: 36x36
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192

Location: android/app/src/main/res/mipmap-*/ic_launcher.png
```

### Splash Screen

```
Location: android/app/src/main/res/drawable/splash_screen.xml

Configuration:
- Background: Dark navy (#0F1419)
- Logo: Gifted Eternity logo (centered)
- App Name: Below logo
- Animation: Fade in over 1 second
```

---

## 8. Build Configuration

### Debug Build

```bash
# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug

# Run on emulator
./gradlew installDebug
adb shell am start -n com.giftedeternitystudio.app/.MainActivity
```

### Release Build

```bash
# Build release bundle
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## 9. Testing on Physical Devices

### Enable Developer Mode

```
1. Settings > About Phone
2. Tap "Build Number" 7 times
3. Back to Settings > Developer Options
4. Enable "USB Debugging"
```

### Connect Device

```bash
# List connected devices
adb devices

# Install app
adb install -r app-release.apk

# Run app
adb shell am start -n com.giftedeternitystudio.app/.MainActivity

# View logs
adb logcat
```

---

## 10. ProGuard Configuration

### proguard-rules.pro

```
# Keep Firebase classes
-keep class com.google.firebase.** { *; }

# Keep Google Play Services
-keep class com.google.android.gms.** { *; }

# Keep app classes
-keep class com.giftedeternitystudio.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep view constructors for inflation
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}
```

---

## 11. Troubleshooting

### Common Issues

**Issue: "Keystore not found"**
- Solution: Verify keystore path in build.gradle, check file permissions

**Issue: "Invalid keystore format"**
- Solution: Regenerate keystore with correct keytool command

**Issue: "Signature mismatch"**
- Solution: Ensure same keystore used for all builds

**Issue: "APK not installing"**
- Solution: Check app ID matches, uninstall previous version

---

## 12. Deployment Checklist

- [ ] Android Studio installed
- [ ] Google Play Developer Account created
- [ ] Keystore generated and secured
- [ ] build.gradle configured
- [ ] Firebase project created
- [ ] google-services.json added
- [ ] App icons created (all sizes)
- [ ] Splash screen configured
- [ ] ProGuard rules configured
- [ ] Debug build tested
- [ ] Release build tested
- [ ] Tested on physical device
- [ ] Bundle (AAB) created successfully
- [ ] Ready for Play Store submission

---

## 13. Next Steps

1. **Google Play Console Setup** - Create app listing, set metadata, screenshots
2. **Internal Testing** - Distribute to internal testers via Play Console
3. **Beta Testing** - Distribute to beta testers (optional)
4. **Play Store Submission** - Submit for review (typically 24-48 hours)
5. **Play Store Release** - Monitor for approval, then release to public

---

## Conclusion

Android build configuration is complete and ready for Play Store submission.

**Status: READY FOR PLAY STORE SUBMISSION** ✅

---

**Last Updated:** December 29, 2024
**Version:** 1.0
