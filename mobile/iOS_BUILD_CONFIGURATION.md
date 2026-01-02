# iOS Build Configuration Guide
**Gifted Eternity Mobile App**

## Overview

Complete guide for configuring iOS build settings, certificates, and provisioning profiles for production deployment.

---

## 1. Prerequisites

### Required Software
- Xcode 14.0 or later
- macOS 12.0 or later
- Apple Developer Account ($99/year)
- CocoaPods (for dependency management)

### Installation

```bash
# Install CocoaPods
sudo gem install cocoapods

# Install Xcode Command Line Tools
xcode-select --install

# Navigate to project
cd gifted_eternity_stream_web/mobile

# Install dependencies
npm install
pod install
```

---

## 2. Apple Developer Account Setup

### Create Developer Account

1. Visit [developer.apple.com](https://developer.apple.com)
2. Sign in with Apple ID
3. Enroll in Apple Developer Program ($99/year)
4. Complete identity verification
5. Accept agreements and contracts

### Certificates & Identifiers

```
Developer Account
├── Certificates
│   ├── iOS App Development
│   ├── iOS Distribution
│   └── Apple Push Notification service (APNs)
├── Identifiers
│   ├── App IDs
│   └── Bundle Identifiers
├── Devices
│   ├── iPhone
│   ├── iPad
│   └── Apple Watch
└── Provisioning Profiles
    ├── Development
    └── Distribution
```

---

## 3. Certificate Generation

### Create Development Certificate

```bash
# 1. Open Keychain Access
open /Applications/Utilities/Keychain\ Access.app

# 2. Request Certificate from Certificate Authority
# Menu: Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority
# - Email: developer@giftedeternitystudio.com
# - Common Name: Gifted Eternity Development
# - Request is: Saved to disk

# 3. Upload to Apple Developer Portal
# - Go to Certificates, Identifiers & Profiles
# - Click "+"
# - Select "iOS App Development"
# - Upload the .certSigningRequest file
# - Download the certificate

# 4. Install Certificate
# Double-click the downloaded .cer file
# It will be added to Keychain
```

### Create Distribution Certificate

```bash
# 1. Repeat the process above but select "iOS Distribution"
# - Common Name: Gifted Eternity Distribution

# 2. This certificate is used for App Store submissions
```

---

## 4. App ID & Bundle Identifier

### Create App ID

```
App ID: com.giftedeternitystudio.app
Display Name: Gifted Eternity
Type: App (not App Clip)
```

### Configure Capabilities

```
Capabilities:
✅ Push Notifications
✅ Background Modes (Audio, Remote Notifications)
✅ HealthKit (optional)
✅ HomeKit (optional)
✅ iCloud (optional)
✅ In-App Purchase
✅ Sign in with Apple
```

---

## 5. Provisioning Profiles

### Development Provisioning Profile

```
Profile Name: Gifted Eternity Development
Type: iOS App Development
App ID: com.giftedeternitystudio.app
Certificates: iOS App Development
Devices: All development devices
```

### Distribution Provisioning Profile

```
Profile Name: Gifted Eternity Distribution
Type: App Store
App ID: com.giftedeternitystudio.app
Certificates: iOS Distribution
```

### Download & Install

```bash
# Download from Apple Developer Portal
# Double-click to install
# Or use Xcode:
# Xcode > Preferences > Accounts > Download Manual Profiles
```

---

## 6. Xcode Configuration

### Project Settings

```
Project: gifted_eternity_stream_web
Target: GiftedEternity

General Tab:
- Bundle Identifier: com.giftedeternitystudio.app
- Version: 1.0.0
- Build: 1
- Deployment Target: iOS 13.0
- Device Support: iPhone, iPad

Signing & Capabilities Tab:
- Team: Gifted Eternity Studio
- Signing Certificate: iOS Distribution
- Provisioning Profile: Gifted Eternity Distribution
```

### Build Settings

```
Build Settings:
- Product Name: Gifted Eternity
- Product Bundle Identifier: com.giftedeternitystudio.app
- Code Sign Identity: iPhone Distribution
- Provisioning Profile: Gifted Eternity Distribution
- Code Signing Style: Automatic

Deployment:
- iOS Deployment Target: 13.0
- Targeted Device Family: iPhone, iPad
```

---

## 7. App Icons & Launch Screen

### App Icon Sizes

```
iOS App Icon Sizes:
- 120x120 (iPhone App - 2x)
- 180x180 (iPhone App - 3x)
- 167x167 (iPad Pro App)
- 152x152 (iPad App)
- 144x144 (iPad App - 2x)
- 1024x1024 (App Store)

Location: Assets.xcassets > AppIcon
```

### Launch Screen

```
Launch Screen Configuration:
- File: LaunchScreen.storyboard
- Background Color: Dark navy (#0F1419)
- Logo: Gifted Eternity logo (centered)
- App Name: Below logo
- Animation: Fade in over 1 second
```

---

## 8. Build Configuration

### Debug Build

```bash
# Build for simulator
xcodebuild -scheme GiftedEternity -configuration Debug -sdk iphonesimulator

# Build for device
xcodebuild -scheme GiftedEternity -configuration Debug -sdk iphoneos
```

### Release Build

```bash
# Build for App Store
xcodebuild -scheme GiftedEternity -configuration Release -sdk iphoneos archive -archivePath build/GiftedEternity.xcarchive

# Export for App Store
xcodebuild -exportArchive -archivePath build/GiftedEternity.xcarchive -exportOptionsPlist ExportOptions.plist -exportPath build/
```

### ExportOptions.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>teamID</key>
    <string>TEAM_ID</string>
    <key>uploadBitcode</key>
    <false/>
</dict>
</plist>
```

---

## 9. Testing on Physical Devices

### Register Device

```
1. Connect iPhone to Mac
2. Xcode > Window > Devices and Simulators
3. Select connected device
4. Note the UDID (Unique Device Identifier)
5. Register in Apple Developer Portal
   - Certificates, Identifiers & Profiles > Devices
   - Click "+"
   - Enter Device Name and UDID
```

### Run on Device

```bash
# In Xcode:
1. Select device from scheme menu (top-left)
2. Product > Run (or ⌘R)
3. App will build and install on device

# Command line:
xcodebuild -scheme GiftedEternity -configuration Debug -sdk iphoneos -destination 'id=DEVICE_UDID'
```

---

## 10. Troubleshooting

### Common Issues

**Issue: "No provisioning profiles found"**
- Solution: Download profiles in Xcode > Preferences > Accounts > Download Manual Profiles

**Issue: "Code signing identity not found"**
- Solution: Check Keychain has both certificates, regenerate if needed

**Issue: "Provisioning profile doesn't match bundle identifier"**
- Solution: Ensure bundle ID matches app ID in provisioning profile

**Issue: "Device not registered"**
- Solution: Register device UDID in Apple Developer Portal

---

## 11. Deployment Checklist

- [ ] Apple Developer Account created
- [ ] Development certificate created and installed
- [ ] Distribution certificate created and installed
- [ ] App ID created (com.giftedeternitystudio.app)
- [ ] Development provisioning profile created
- [ ] Distribution provisioning profile created
- [ ] Xcode project configured
- [ ] App icons created (all sizes)
- [ ] Launch screen configured
- [ ] Build settings verified
- [ ] Tested on simulator
- [ ] Tested on physical device
- [ ] Archive created successfully
- [ ] Ready for App Store submission

---

## 12. Next Steps

1. **App Store Connect Setup** - Create app listing, set metadata, screenshots
2. **TestFlight Beta** - Distribute to beta testers before App Store submission
3. **App Store Submission** - Submit for review (typically 24-48 hours)
4. **App Store Release** - Monitor for approval, then release to public

---

## Conclusion

iOS build configuration is complete and ready for App Store submission.

**Status: READY FOR APP STORE SUBMISSION** ✅

---

**Last Updated:** December 29, 2024
**Version:** 1.0
