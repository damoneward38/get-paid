# iOS Build Configuration - Complete Guide

## Prerequisites
- Xcode 14+ installed
- Apple Developer Account ($99/year)
- iOS 13.0+ deployment target
- CocoaPods installed

## Step 1: Create Apple Developer Certificates

### Generate Certificate Signing Request (CSR)
1. Open Keychain Access on Mac
2. Go to Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority
3. Enter your email and name
4. Save to disk

### Create Development Certificate
1. Go to [Apple Developer](https://developer.apple.com/account)
2. Navigate to Certificates, Identifiers & Profiles
3. Click "Certificates" > "+"
4. Select "iOS App Development"
5. Upload your CSR file
6. Download the certificate and double-click to install

### Create Production Certificate
1. Repeat above steps but select "Apple Distribution"

## Step 2: Create App ID

1. Go to Identifiers in Apple Developer
2. Click "+" to create new identifier
3. Select "App IDs"
4. Enter Bundle ID: `com.giftedeternitystudio.app`
5. Select capabilities needed:
   - Push Notifications
   - In-App Purchase
   - HealthKit
   - HomeKit
   - etc.
6. Register the App ID

## Step 3: Create Provisioning Profiles

### Development Profile
1. Go to Provisioning Profiles > Development
2. Click "+" to create new
3. Select "iOS App Development"
4. Select your App ID
5. Select your development certificate
6. Select test devices
7. Download and install

### Distribution Profile
1. Go to Provisioning Profiles > Distribution
2. Click "+" to create new
3. Select "App Store"
4. Select your App ID
5. Select your distribution certificate
6. Download and install

## Step 4: Configure Xcode Project

### Update Build Settings
1. Open project in Xcode
2. Select target
3. Go to Build Settings
4. Search for "Code Signing"
5. Set:
   - Code Signing Identity: iOS Developer
   - Provisioning Profile: Your development profile
   - Code Signing Style: Automatic

### Update Info.plist
```xml
<key>CFBundleIdentifier</key>
<string>com.giftedeternitystudio.app</string>
<key>CFBundleVersion</key>
<string>1</string>
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
```

## Step 5: Build for Development

```bash
cd mobile
eas build --platform ios --profile preview
```

## Step 6: Build for Production

```bash
eas build --platform ios --profile production
```

## Step 7: Archive and Export

1. In Xcode: Product > Archive
2. Click "Distribute App"
3. Select "App Store Connect"
4. Follow the wizard to upload

## Troubleshooting

### Certificate Errors
- Ensure certificate is installed in Keychain
- Check expiration date
- Regenerate if necessary

### Provisioning Profile Issues
- Verify device UDID is included
- Check profile hasn't expired
- Reinstall profile if needed

### Build Failures
- Clean build folder (Cmd + Shift + K)
- Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData/*`
- Update Xcode to latest version

## Resources
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Xcode Help](https://help.apple.com/xcode/)
- [TestFlight Guide](https://developer.apple.com/testflight/)
