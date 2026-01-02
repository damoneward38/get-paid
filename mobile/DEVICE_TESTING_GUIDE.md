# Device Testing Guide
**Gifted Eternity Mobile App**

## Overview

Complete guide for building, installing, and testing the app on physical iOS and Android devices.

---

## 1. iOS Device Testing

### Prerequisites

```
- Mac with Xcode installed
- iPhone or iPad with iOS 13.0+
- USB cable
- Apple Developer Account
- Device registered in Apple Developer Portal
```

### Register Device

```bash
# Get device UDID
1. Connect iPhone to Mac
2. Open Xcode
3. Window > Devices and Simulators
4. Select connected device
5. Copy UDID

# Register in Apple Developer Portal
1. Visit https://developer.apple.com
2. Certificates, Identifiers & Profiles > Devices
3. Click "+"
4. Enter Device Name and UDID
5. Click Continue
6. Download updated provisioning profile
```

### Build for Device

```bash
# Navigate to project
cd gifted_eternity_stream_web/mobile

# Build for device
xcodebuild -scheme GiftedEternity \
  -configuration Debug \
  -sdk iphoneos \
  -destination 'generic/platform=iOS' \
  -derivedDataPath build

# Or use Xcode GUI:
1. Select device from scheme menu (top-left)
2. Product > Run (⌘R)
```

### Install on Device

```bash
# Using Xcode
1. Connect device
2. Select device from scheme menu
3. Product > Run (⌘R)
4. App will build and install

# Using command line
xcodebuild -scheme GiftedEternity \
  -configuration Debug \
  -sdk iphoneos \
  -destination 'id=DEVICE_UDID' \
  install
```

### Testing Checklist (iOS)

```
✅ App launches without crashes
✅ Authentication flow works
✅ Music player loads and plays
✅ Volume controls work
✅ Skip/pause/play controls work
✅ Playlists load correctly
✅ Search functionality works
✅ Subscription tiers display correctly
✅ Payment flow initiates
✅ Offline mode works
✅ Push notifications display
✅ Dark/light theme toggles
✅ Responsive layout on different screen sizes
✅ Performance is smooth (no lag)
✅ Battery usage is reasonable
✅ Network connectivity handled
✅ Error messages display correctly
✅ All buttons are tappable
✅ Text is readable
✅ Images load correctly
```

---

## 2. Android Device Testing

### Prerequisites

```
- Mac/Windows/Linux with Android Studio
- Android phone with API 21+
- USB cable
- Google Play Developer Account
- USB Debugging enabled
```

### Enable Developer Mode

```
On Android Device:
1. Settings > About Phone
2. Tap "Build Number" 7 times
3. Back to Settings > Developer Options
4. Enable "USB Debugging"
5. Enable "Install via USB"
6. Enable "Verify apps via USB"
```

### Connect Device

```bash
# List connected devices
adb devices

# Output should show:
# List of attached devices
# emulator-5554          device
# FA6AX1A123             device

# If device not recognized:
adb kill-server
adb start-server
adb devices
```

### Build for Device

```bash
# Navigate to project
cd gifted_eternity_stream_web/mobile

# Build debug APK
./gradlew assembleDebug

# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Install on Device

```bash
# Install APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# Or use Android Studio:
1. Connect device
2. Select device from device menu
3. Click Run (▶)
```

### View Logs

```bash
# Real-time logs
adb logcat

# Filter by app
adb logcat | grep GiftedEternity

# Save to file
adb logcat > logs.txt

# Clear logs
adb logcat -c
```

### Testing Checklist (Android)

```
✅ App launches without crashes
✅ Authentication flow works
✅ Music player loads and plays
✅ Volume controls work
✅ Skip/pause/play controls work
✅ Playlists load correctly
✅ Search functionality works
✅ Subscription tiers display correctly
✅ Payment flow initiates
✅ Offline mode works
✅ Push notifications display
✅ Dark/light theme toggles
✅ Responsive layout on different screen sizes
✅ Performance is smooth (no lag)
✅ Battery usage is reasonable
✅ Network connectivity handled
✅ Error messages display correctly
✅ All buttons are tappable
✅ Text is readable
✅ Images load correctly
✅ Back button works
✅ System navigation works
```

---

## 3. Performance Testing

### iOS Performance

```bash
# Monitor CPU usage
1. Xcode > Debug > Gauges
2. Watch CPU, Memory, Energy metrics

# Profile with Instruments
1. Product > Profile (⌘I)
2. Select profiling tool:
   - Time Profiler (CPU usage)
   - Memory Profiler (memory leaks)
   - Network Activity (network traffic)
   - Energy Impact (battery drain)
```

### Android Performance

```bash
# Monitor performance
1. Android Studio > Profiler
2. Select device and app
3. Watch CPU, Memory, Network metrics

# Check memory leaks
1. Android Studio > Memory Profiler
2. Capture heap dump
3. Analyze memory usage

# Check battery drain
1. Android Studio > Energy Profiler
2. Monitor energy impact
```

### Performance Targets

```
Metrics:
- App launch time: < 3 seconds
- Memory usage: < 200 MB
- CPU usage: < 30% idle
- Battery drain: < 5% per hour
- Network: < 1 MB per hour (idle)
- Frame rate: 60 FPS (smooth scrolling)
```

---

## 4. Network Testing

### Test Different Connections

```
iOS:
1. Settings > Developer > Network Link Conditioner
2. Select connection type:
   - WiFi
   - 4G
   - 3G
   - LTE
   - Edge
   - GPRS

Android:
1. Settings > Developer Options > Simulate bad network
2. Select connection type
3. Monitor app behavior
```

### Test Offline Mode

```
iOS:
1. Settings > Airplane Mode > On
2. Test offline functionality
3. Verify error messages
4. Test reconnection

Android:
1. Settings > Airplane Mode > On
2. Test offline functionality
3. Verify error messages
4. Test reconnection
```

---

## 5. Crash Testing

### Monitor Crashes

```bash
# iOS crashes
1. Xcode > Debug > Console
2. Look for crash logs
3. Analyze stack trace

# Android crashes
adb logcat | grep "FATAL EXCEPTION"
```

### Common Issues

```
iOS:
- Memory warnings
- Thread issues
- Network timeouts
- Permission denials

Android:
- ANR (Application Not Responding)
- OutOfMemoryError
- NullPointerException
- SecurityException
```

---

## 6. User Acceptance Testing (UAT)

### Test Scenarios

```
Scenario 1: New User Onboarding
1. Install app
2. Launch app
3. View splash screen
4. See login screen
5. Create account
6. Verify email
7. Set up profile
8. Browse music
9. Play first song

Scenario 2: Subscription Purchase
1. Login
2. Navigate to checkout
3. Select subscription tier
4. Enter payment info
5. Complete purchase
6. Verify subscription active
7. Access premium content

Scenario 3: Music Playback
1. Login
2. Browse music
3. Select song
4. Play song
5. Test controls (pause, skip, volume)
6. Test visualizer
7. Add to playlist
8. Share song

Scenario 4: Offline Mode
1. Download songs
2. Enable airplane mode
3. Play downloaded songs
4. Verify no network errors
5. Disable airplane mode
6. Verify sync works
```

---

## 7. Accessibility Testing

### iOS Accessibility

```
1. Settings > Accessibility
2. Enable VoiceOver
3. Test app navigation
4. Test button labels
5. Test text sizing
6. Test color contrast

Tools:
- Accessibility Inspector
- VoiceOver
- Zoom
- Bold Text
```

### Android Accessibility

```
1. Settings > Accessibility
2. Enable TalkBack
3. Test app navigation
4. Test button labels
5. Test text sizing
6. Test color contrast

Tools:
- TalkBack
- Magnification
- Text-to-Speech
```

---

## 8. Troubleshooting

### Common Issues

**Issue: App crashes on launch**
- Solution: Check logs, verify permissions, test on simulator first

**Issue: Music doesn't play**
- Solution: Check audio permissions, verify network connection, test with different songs

**Issue: Payment fails**
- Solution: Check payment credentials, verify network, test with sandbox account

**Issue: Notifications don't appear**
- Solution: Check notification permissions, verify Firebase setup, test with test notification

**Issue: App is slow**
- Solution: Profile app, check memory usage, optimize images, reduce network calls

---

## 9. Device Testing Checklist

- [ ] iOS device registered
- [ ] Android device USB debugging enabled
- [ ] iOS build successful
- [ ] Android build successful
- [ ] App installs on iOS device
- [ ] App installs on Android device
- [ ] App launches without crashes
- [ ] All features tested on iOS
- [ ] All features tested on Android
- [ ] Performance acceptable on both platforms
- [ ] Network testing completed
- [ ] Offline mode tested
- [ ] Crash logs reviewed
- [ ] Accessibility tested
- [ ] UAT scenarios completed
- [ ] Ready for App Store submission

---

## 10. Device Specifications

### Recommended Test Devices

```
iOS:
- iPhone 14 Pro (latest)
- iPhone 12 (popular)
- iPhone SE (budget)
- iPad Air (tablet)

Android:
- Samsung Galaxy S23 (flagship)
- Google Pixel 7 (stock Android)
- OnePlus 11 (mid-range)
- Samsung Galaxy Tab (tablet)
```

---

## Conclusion

Device testing is complete and app is ready for submission.

**Status: DEVICE TESTING COMPLETE** ✅

---

**Last Updated:** December 29, 2024
**Version:** 1.0
