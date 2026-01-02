# Device Testing Guide - iOS & Android

## iOS Device Testing

### Prerequisites
- Mac with Xcode installed
- Physical iPhone/iPad
- Apple Developer Account
- USB cable

### Setup Device for Testing

#### 1. Enable Developer Mode
1. Connect iPhone to Mac
2. Open Xcode
3. Go to Window > Devices and Simulators
4. Select your device
5. Click "Trust" when prompted

#### 2. Register Device UDID
1. Get UDID: `system_profiler SPUSBDataType | grep "Serial Number"`
2. Go to [Apple Developer](https://developer.apple.com/account/resources/devices/list)
3. Click "+" to add device
4. Enter UDID and device name
5. Click Continue

#### 3. Update Provisioning Profile
1. Go to Provisioning Profiles
2. Edit your development profile
3. Add the new device
4. Download and install updated profile

### Install Test Build

#### Via Xcode
```bash
xcode-build -scheme YourApp -configuration Debug -derivedDataPath build -arch arm64 -sdk iphoneos
```

#### Via TestFlight
1. Upload build to App Store Connect
2. Add testers in TestFlight
3. Send invite link
4. Testers install via TestFlight app

#### Via Direct Installation
```bash
# Using ios-deploy
npm install -g ios-deploy

# Deploy to device
ios-deploy --bundle <path-to-app>
```

### Testing Checklist

- [ ] App launches without crashes
- [ ] All screens render correctly
- [ ] Navigation works smoothly
- [ ] Audio playback works
- [ ] Offline mode functions
- [ ] Push notifications work
- [ ] In-app purchases complete
- [ ] Login/authentication works
- [ ] Permissions requests appear
- [ ] Performance is acceptable
- [ ] Battery usage is reasonable
- [ ] Network connectivity handled
- [ ] Background playback works
- [ ] Lock screen controls work
- [ ] Siri integration works (if applicable)

---

## Android Device Testing

### Prerequisites
- Android device (API 31+)
- USB cable
- Android Studio installed
- USB debugging enabled

### Setup Device for Testing

#### 1. Enable USB Debugging
1. Go to Settings > About Phone
2. Tap Build Number 7 times
3. Go to Settings > Developer Options
4. Enable USB Debugging
5. Enable Install from Unknown Sources

#### 2. Connect Device
```bash
adb devices
```

Expected output:
```
List of attached devices
emulator-5554          device
```

### Install Test Build

#### Via ADB
```bash
adb install app-release.apk
```

#### Via Android Studio
1. Open project in Android Studio
2. Select your device
3. Click Run button (or Shift+F10)

#### Via Google Play Console
1. Go to Internal Testing
2. Add testers
3. Send invite link
4. Testers install from Play Store

### Testing Checklist

- [ ] App launches without crashes
- [ ] All screens render correctly
- [ ] Navigation works smoothly
- [ ] Audio playback works
- [ ] Offline mode functions
- [ ] Push notifications work
- [ ] In-app purchases complete
- [ ] Login/authentication works
- [ ] Permissions requests appear
- [ ] Performance is acceptable
- [ ] Battery usage is reasonable
- [ ] Network connectivity handled
- [ ] Background playback works
- [ ] Lock screen controls work
- [ ] Notification center works
- [ ] Share functionality works

---

## Performance Testing

### iOS Performance

#### Memory Usage
```bash
# Via Xcode Instruments
Xcode > Product > Profile

# Select Memory
# Run app and monitor
```

#### CPU Usage
```bash
# Via Xcode Instruments
Xcode > Product > Profile

# Select System Trace
# Monitor CPU usage
```

#### Battery Impact
```bash
# Via Xcode Instruments
Xcode > Product > Profile

# Select Energy Impact
# Monitor battery drain
```

### Android Performance

#### Memory Usage
```bash
adb shell dumpsys meminfo com.giftedeternitystudio.app
```

#### CPU Usage
```bash
adb shell top -n 1 | grep com.giftedeternitystudio.app
```

#### Battery Impact
```bash
adb shell dumpsys batterystats --reset
# Use app for 30 minutes
adb shell dumpsys batterystats | grep com.giftedeternitystudio.app
```

---

## Network Testing

### Slow Network Simulation

#### iOS
1. Xcode > Product > Scheme > Edit Scheme
2. Run > Options
3. Network Link Conditioner: Slow 3G

#### Android
1. Android Studio > Device Manager
2. Select device > Settings
3. Network Throttling: Slow 3G

### Offline Testing

#### iOS
1. Airplane Mode: ON
2. Test offline features
3. Verify error handling

#### Android
1. Airplane Mode: ON
2. Test offline features
3. Verify error handling

---

## Crash & Error Testing

### Simulate Crashes
```bash
# iOS
Thread.abort() // Force crash

# Android
throw new RuntimeException("Test crash")
```

### Monitor Crashes
- **iOS:** Xcode Console, Crash Reporter
- **Android:** Logcat, Firebase Crashlytics

### Error Logging
```bash
# iOS
NSLog(@"Error: %@", error)

# Android
Log.e("TAG", "Error: " + error)
```

---

## Device Compatibility Testing

### iOS Devices to Test
- iPhone 13 mini (5.4")
- iPhone 13 (6.1")
- iPhone 13 Pro Max (6.7")
- iPad Air (10.9")
- iPad Pro (12.9")

### Android Devices to Test
- Pixel 6 (6.0")
- Samsung Galaxy S21 (6.2")
- OnePlus 9 (6.55")
- Samsung Galaxy Tab S7 (11.0")

### iOS Versions to Test
- iOS 13.0
- iOS 14.0
- iOS 15.0
- iOS 16.0 (latest)

### Android Versions to Test
- Android 11 (API 30)
- Android 12 (API 31)
- Android 13 (API 32)
- Android 14 (API 33)

---

## Beta Testing Program

### TestFlight (iOS)
1. Upload build to App Store Connect
2. Go to TestFlight
3. Add internal testers (up to 25)
4. Add external testers (up to 10,000)
5. Send invitations
6. Monitor feedback

### Google Play Internal Testing (Android)
1. Upload AAB to Play Console
2. Go to Internal Testing
3. Add testers
4. Send invite link
5. Monitor feedback

---

## Bug Reporting Template

```
**Device:** [iPhone 13 Pro / Pixel 6]
**OS Version:** [iOS 16.0 / Android 13]
**App Version:** [1.0.0]
**Build Number:** [123]

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Behavior:**
...

**Actual Behavior:**
...

**Screenshots/Videos:**
[Attach if applicable]

**Logs:**
[Paste relevant logs]

**Additional Notes:**
...
```

---

## Performance Benchmarks

### Target Metrics
- **App Launch:** < 3 seconds
- **Screen Load:** < 1 second
- **Memory Usage:** < 200 MB
- **CPU Usage:** < 30%
- **Battery Drain:** < 5% per hour

### Acceptable Ranges
- **Launch:** 2-4 seconds
- **Screen Load:** 0.5-1.5 seconds
- **Memory:** 150-250 MB
- **CPU:** 20-40%
- **Battery:** 3-7% per hour
