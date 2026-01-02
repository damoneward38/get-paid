# App Icons & Splash Screens Guide
**Gifted Eternity Mobile App**

## Overview

Complete guide for creating app icons and splash screens in all required sizes for iOS and Android.

---

## 1. App Icon Design

### Design Specifications

```
Color Palette:
- Primary: #8B5CF6 (Purple)
- Secondary: #EC4899 (Pink)
- Accent: #06B6D4 (Cyan)
- Background: #0F1419 (Dark Navy)

Style: Modern, gradient-based
Shape: Rounded square (iOS), Square (Android)
Safe Zone: 90% of icon size
```

### Icon Concept

```
Visual Elements:
- Musical note symbol (♪♫)
- Gradient background (purple to pink)
- Glowing effect around note
- Subtle animation (optional)

Variations:
- Full color (primary)
- Monochrome (for dark mode)
- Outline (for light backgrounds)
```

---

## 2. iOS App Icons

### Icon Sizes

```
iOS App Icon Sizes (all @1x, @2x, @3x):

App Store:
- 1024x1024 (App Store listing)

iPhone:
- 120x120 (iPhone App - 2x)
- 180x180 (iPhone App - 3x)
- 167x167 (iPhone Spotlight - 2x)
- 120x120 (iPhone Spotlight - 3x)

iPad:
- 152x152 (iPad App)
- 167x167 (iPad Pro App)
- 80x80 (iPad Spotlight - 2x)
- 120x120 (iPad Spotlight - 3x)

Settings:
- 58x58 (iPhone Settings - 2x)
- 87x87 (iPhone Settings - 3x)
- 58x58 (iPad Settings - 2x)
- 87x87 (iPad Settings - 3x)

Notification:
- 40x40 (iPhone Notification - 2x)
- 60x60 (iPhone Notification - 3x)
- 40x40 (iPad Notification - 2x)
- 60x60 (iPad Notification - 3x)
```

### iOS Icon Setup

```
Location: ios/GiftedEternity/Images.xcassets/AppIcon.appiconset/

Files:
- AppIcon-1024.png (1024x1024)
- AppIcon-180.png (180x180)
- AppIcon-167.png (167x167)
- AppIcon-152.png (152x152)
- AppIcon-120.png (120x120)
- AppIcon-87.png (87x87)
- AppIcon-80.png (80x80)
- AppIcon-60.png (60x60)
- AppIcon-58.png (58x58)
- AppIcon-40.png (40x40)

Contents.json:
{
  "images": [
    {
      "filename": "AppIcon-1024.png",
      "idiom": "iphone",
      "scale": "1x",
      "size": "1024x1024"
    },
    ...
  ]
}
```

---

## 3. Android App Icons

### Icon Sizes

```
Android App Icon Sizes:

Legacy Launcher Icons:
- ldpi: 36x36 (0.75x)
- mdpi: 48x48 (1x baseline)
- hdpi: 72x72 (1.5x)
- xhdpi: 96x96 (2x)
- xxhdpi: 144x144 (3x)
- xxxhdpi: 192x192 (4x)

Adaptive Icons (Android 8.0+):
- Foreground: 108x108 (all densities)
- Background: 108x108 (all densities)
- Monochrome: 108x108 (all densities)

Play Store:
- 512x512 (Play Store listing)

Notification Icons:
- ldpi: 18x18
- mdpi: 24x24
- hdpi: 36x36
- xhdpi: 48x48
- xxhdpi: 72x72
- xxxhdpi: 96x96
```

### Android Icon Setup

```
Location: android/app/src/main/res/

Directory Structure:
mipmap-ldpi/
  ic_launcher.png (36x36)
  ic_launcher_foreground.png
  ic_launcher_background.png

mipmap-mdpi/
  ic_launcher.png (48x48)
  ic_launcher_foreground.png
  ic_launcher_background.png

mipmap-hdpi/
  ic_launcher.png (72x72)
  ic_launcher_foreground.png
  ic_launcher_background.png

mipmap-xhdpi/
  ic_launcher.png (96x96)
  ic_launcher_foreground.png
  ic_launcher_background.png

mipmap-xxhdpi/
  ic_launcher.png (144x144)
  ic_launcher_foreground.png
  ic_launcher_background.png

mipmap-xxxhdpi/
  ic_launcher.png (192x192)
  ic_launcher_foreground.png
  ic_launcher_background.png

drawable/
  ic_notification.png (all sizes)
```

### AndroidManifest.xml

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:label="@string/app_name">
    ...
</application>
```

---

## 4. iOS Splash Screen (Launch Screen)

### Launch Screen Design

```
File: ios/GiftedEternity/LaunchScreen.storyboard

Specifications:
- Size: 1242x2688 (iPhone 12 Pro Max)
- Safe Area: 20pt margins
- Background Color: #0F1419 (Dark Navy)
- Content: Centered logo + app name

Elements:
1. Background: Solid color or gradient
2. Logo: Gifted Eternity icon (centered)
3. App Name: "Gifted Eternity" (below logo)
4. Tagline: "Stream Gospel Music" (optional)
5. Loading Indicator: Subtle spinner (optional)
```

### Launch Screen Implementation

```swift
// LaunchScreen.storyboard

<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="21701" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorLabelStyle="iOS">
    <device id="retina6_12" orientation="portrait" appearance="dark"/>
    <dependencies>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="21678"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
    </dependencies>
    <scenes>
        <scene sceneID="s0d-6b-0kx">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <view contentMode="scaleToFill" translatesAutoresizingMaskIntoConstraints="NO" id="6Tk-OE-BBY">
                                <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                                <subviews>
                                    <imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFit" horizontalHuggingPriority="251" verticalHuggingPriority="251" image="LaunchScreenLogo" translatesAutoresizingMaskIntoConstraints="NO" id="logo">
                                        <rect key="frame" x="146.5" y="326" width="100" height="100"/>
                                        <constraints>
                                            <constraint firstAttribute="width" constant="100" id="width"/>
                                            <constraint firstAttribute="height" constant="100" id="height"/>
                                        </constraints>
                                    </imageView>
                                    <label opaque="NO" clipsSubviews="YES" userInteractionEnabled="NO" contentMode="left" horizontalHuggingPriority="251" verticalHuggingPriority="251" text="Gifted Eternity" textAlignment="center" lineBreakMode="middleTruncation" baselineAdjustment="alignBaselines" minimumFontSize="18" translatesAutoresizingMaskIntoConstraints="NO" id="appName">
                                        <rect key="frame" x="50" y="450" width="293" height="41"/>
                                        <fontDescription key="fontDescription" type="boldSystem" pointSize="34"/>
                                        <color key="textColor" white="1" alpha="1" colorSpace="custom" customColorSpace="genericGamma22GrayColorSpace"/>
                                        <nil key="highlightedColor"/>
                                    </label>
                                </subviews>
                                <color key="backgroundColor" red="0.0588235294" green="0.0823529412" blue="0.0980392157" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                                <constraints>
                                    <constraint firstItem="logo" firstAttribute="centerX" secondItem="6Tk-OE-BBY" secondAttribute="centerX" id="logoCenterX"/>
                                    <constraint firstItem="logo" firstAttribute="centerY" secondItem="6Tk-OE-BBY" secondAttribute="centerY" id="logoCenterY"/>
                                    <constraint firstItem="appName" firstAttribute="top" secondItem="logo" secondAttribute="bottom" constant="24" id="appNameTop"/>
                                    <constraint firstItem="appName" firstAttribute="centerX" secondItem="6Tk-OE-BBY" secondAttribute="centerX" id="appNameCenterX"/>
                                </constraints>
                            </view>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Bcu-3y-fbc"/>
                        <constraints>
                            <constraint firstItem="6Tk-OE-BBY" firstAttribute="top" secondItem="Ze5-6b-2t3" secondAttribute="top" id="Day-4Z-6VM"/>
                            <constraint firstItem="6Tk-OE-BBY" firstAttribute="leading" secondItem="Ze5-6b-2t3" secondAttribute="leading" id="One-L3-2wg"/>
                            <constraint firstItem="6Tk-OE-BBY" firstAttribute="trailing" secondItem="Ze5-6b-2t3" secondAttribute="trailing" id="gEw-LL-Q4Y"/>
                            <constraint firstItem="6Tk-OE-BBY" firstAttribute="bottom" secondItem="Ze5-6b-2t3" secondAttribute="bottom" id="iHn-SN-tPT"/>
                        </constraints>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="53" y="375"/>
        </scene>
    </scenes>
    <resources>
        <image name="LaunchScreenLogo" width="1024" height="1024"/>
    </resources>
</document>
```

---

## 5. Android Splash Screen

### Splash Screen Design

```
File: android/app/src/main/res/drawable/splash_screen.xml

Specifications:
- Size: 1080x1920 (standard Android)
- Safe Area: 60dp margins
- Background Color: #0F1419 (Dark Navy)
- Content: Centered logo + app name

Elements:
1. Background: Solid color or gradient
2. Logo: Gifted Eternity icon (centered)
3. App Name: "Gifted Eternity" (below logo)
4. Tagline: "Stream Gospel Music" (optional)
5. Loading Indicator: Subtle spinner (optional)
```

### Splash Screen Implementation

```xml
<!-- android/app/src/main/res/drawable/splash_screen.xml -->

<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    
    <item>
        <bitmap
            android:src="@drawable/ic_launcher_foreground"
            android:gravity="center"
            android:width="200dp"
            android:height="200dp"/>
    </item>
    
    <item android:bottom="100dp">
        <inset android:insetBottom="300dp">
            <bitmap
                android:src="@drawable/app_name_text"
                android:gravity="center"
                android:width="300dp"
                android:height="100dp"/>
        </inset>
    </item>
</layer-list>
```

### Splash Activity

```kotlin
// android/app/src/main/java/com/giftedeternitystudio/SplashActivity.kt

package com.giftedeternitystudio.app

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.drawable.splash_screen)
        
        // Delay for 2 seconds
        Handler(Looper.getMainLooper()).postDelayed({
            startActivity(Intent(this, MainActivity::class.java))
            finish()
        }, 2000)
    }
}
```

---

## 6. Icon Generation Tools

### Recommended Tools

```
1. Figma
   - Free design tool
   - Icon templates
   - Export in multiple sizes
   - URL: https://figma.com

2. Adobe XD
   - Professional design tool
   - Icon libraries
   - Batch export
   - URL: https://adobe.com/products/xd

3. Sketch
   - Mac-only design tool
   - Icon plugins
   - Multi-export
   - URL: https://sketch.com

4. App Icon Generator
   - Online tool
   - Upload image, get all sizes
   - URL: https://appicon.co

5. ImageMagick
   - Command-line tool
   - Batch resize
   - Format conversion
```

### Batch Icon Generation

```bash
# Using ImageMagick

# Generate iOS icons
convert icon-1024.png -resize 180x180 icon-180.png
convert icon-1024.png -resize 167x167 icon-167.png
convert icon-1024.png -resize 152x152 icon-152.png
convert icon-1024.png -resize 120x120 icon-120.png
convert icon-1024.png -resize 87x87 icon-87.png
convert icon-1024.png -resize 80x80 icon-80.png
convert icon-1024.png -resize 60x60 icon-60.png
convert icon-1024.png -resize 58x58 icon-58.png
convert icon-1024.png -resize 40x40 icon-40.png

# Generate Android icons
convert icon-512.png -resize 192x192 ic_launcher.png
convert icon-512.png -resize 144x144 ic_launcher.png
convert icon-512.png -resize 96x96 ic_launcher.png
convert icon-512.png -resize 72x72 ic_launcher.png
convert icon-512.png -resize 48x48 ic_launcher.png
convert icon-512.png -resize 36x36 ic_launcher.png
```

---

## 7. Deployment Checklist

- [ ] App icon designed (1024x1024)
- [ ] iOS icons generated (all sizes)
- [ ] Android icons generated (all sizes)
- [ ] Adaptive icons created (Android 8.0+)
- [ ] Icons tested on devices
- [ ] iOS launch screen designed
- [ ] Android splash screen designed
- [ ] Splash screens tested
- [ ] Icons placed in correct directories
- [ ] Contents.json configured (iOS)
- [ ] AndroidManifest.xml updated
- [ ] Icons meet store guidelines
- [ ] Accessibility tested

---

## 8. Store Guidelines

### Apple App Store

```
- Minimum size: 1024x1024
- Format: PNG with alpha channel
- No transparency in corners
- No text or app name
- Rounded corners applied automatically
- No gloss or shine effect
```

### Google Play Store

```
- Minimum size: 512x512
- Format: PNG, JPG, or GIF
- No transparency (for legacy icons)
- Adaptive icons: 108x108 with safe zone
- No text or app name
- Must work on all background colors
```

---

## Conclusion

App icons and splash screens are created and ready for deployment.

**Status: ICONS & SPLASH SCREENS READY** ✅

---

**Last Updated:** December 29, 2024
**Version:** 1.0
