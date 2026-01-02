# App Store Setup & Credentials - Complete Guide

## Apple App Store Setup

### 1. Create App Store Connect Account
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Sign in with Apple ID
3. Go to "My Apps"
4. Click "+" to create new app

### 2. Fill App Information
- **App Name:** Gifted Eternity
- **Primary Language:** English
- **Bundle ID:** com.giftedeternitystudio.app
- **SKU:** GIFTED_ETERNITY_001
- **User Access:** Full Access

### 3. App Store Connect API Key
1. Go to Users and Access > Keys
2. Click "+" to generate new key
3. Select "App Manager" role
4. Download private key (save securely)
5. Note the Key ID and Issuer ID

### 4. Create App Listing
- **App Name:** Gifted Eternity
- **Subtitle:** Stream Gospel Music & More
- **Description:**
  ```
  Gifted Eternity is your ultimate music streaming platform featuring 
  curated gospel, soul, R&B, and more. Stream unlimited music, create 
  playlists, and discover new artists.
  
  Features:
  - Unlimited streaming of premium music
  - Offline downloads
  - High-quality audio
  - Personalized recommendations
  - Create and share playlists
  - Support your favorite artists directly
  ```
- **Keywords:** gospel, music, streaming, soul, R&B
- **Support URL:** https://giftedeternitystudio.com/support
- **Privacy Policy URL:** https://giftedeternitystudio.com/privacy
- **License Agreement:** https://giftedeternitystudio.com/terms

### 5. App Icons & Screenshots
Required sizes:
- **App Icon:** 1024x1024 (required)
- **Screenshots (iPhone):**
  - 5.5" (2208x1242) - 3 required
  - 6.5" (2688x1242) - 3 required
- **Preview Video:** Optional (up to 30 seconds)

### 6. Pricing & Availability
- **Price Tier:** Free (with in-app purchases)
- **Availability:** Worldwide
- **Age Rating:** 4+
- **Content Rights:** Confirm you own rights

### 7. In-App Purchases Setup
Create subscription products:
- **Fan Plan:** $4.99/month
  - Product ID: `com.giftedeternitystudio.fan.monthly`
- **Premium Plan:** $9.99/month
  - Product ID: `com.giftedeternitystudio.premium.monthly`
- **Supporter Plan:** $99/year
  - Product ID: `com.giftedeternitystudio.supporter.yearly`

---

## Google Play Store Setup

### 1. Create Google Play Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Create account ($25 one-time fee)
3. Accept agreements
4. Complete merchant setup

### 2. Create Application
1. Click "Create app"
2. Enter app name: "Gifted Eternity"
3. Select category: Music & Audio
4. Select content rating: Mature Audiences

### 3. Fill Store Listing
- **App Name:** Gifted Eternity
- **Short Description:** Stream Gospel Music & More
- **Full Description:**
  ```
  Gifted Eternity is your ultimate music streaming platform featuring 
  curated gospel, soul, R&B, and more. Stream unlimited music, create 
  playlists, and discover new artists.
  
  Features:
  - Unlimited streaming of premium music
  - Offline downloads
  - High-quality audio
  - Personalized recommendations
  - Create and share playlists
  - Support your favorite artists directly
  ```
- **Developer Contact:** support@giftedeternitystudio.com
- **Privacy Policy:** https://giftedeternitystudio.com/privacy
- **Terms of Service:** https://giftedeternitystudio.com/terms

### 4. App Icons & Graphics
Required assets:
- **App Icon:** 512x512 (PNG)
- **Feature Graphic:** 1024x500 (PNG/JPG)
- **Screenshots (Phone):**
  - 1080x1920 - 5 required
- **Screenshots (Tablet):**
  - 1280x720 - 2 required
- **Video Preview:** Optional (up to 30 seconds)

### 5. Content Rating Questionnaire
Complete Google Play's content rating questionnaire:
- Violence: None
- Sexual Content: None
- Profanity: None
- Alcohol/Tobacco: None
- Gambling: None

### 6. In-App Products Setup
Create subscription products:
- **Fan Plan:** $4.99/month
  - Product ID: `fan_monthly`
- **Premium Plan:** $9.99/month
  - Product ID: `premium_monthly`
- **Supporter Plan:** $99/year
  - Product ID: `supporter_yearly`

### 7. Release Management
1. Go to Release > Production
2. Upload AAB file
3. Add release notes
4. Set rollout percentage (start at 5%, increase gradually)
5. Review and publish

---

## App Assets Creation

### Design Guidelines
- **Color Scheme:** Purple/Pink gradient
- **Typography:** Modern, clean fonts
- **Style:** Minimalist with music elements

### Required Assets

#### App Icon
```
- 1024x1024 (Master)
- 512x512 (Google Play)
- 180x180 (iOS)
- 120x120 (iOS)
- 152x152 (iPad)
```

#### Screenshots
**iPhone (5.5"):**
1. Home screen with featured music
2. Music player interface
3. Subscription tiers

**iPhone (6.5"):**
1. Home screen with featured music
2. Music player interface
3. Subscription tiers

**Android:**
1. Home screen with featured music
2. Music player interface
3. Subscription tiers
4. Playlist creation
5. Search interface

#### Feature Graphics
- **Apple:** 1200x628
- **Google:** 1024x500

---

## Credentials Storage

### Secure Storage
```
~/.gifted_eternity_credentials/
├── apple_api_key.p8 (KEEP SECURE)
├── apple_credentials.json
├── google_play_key.json (KEEP SECURE)
└── keystore.jks (KEEP SECURE)
```

### Environment Variables
```bash
# Apple
export APPLE_KEY_ID="your_key_id"
export APPLE_ISSUER_ID="your_issuer_id"
export APPLE_API_KEY_PATH="~/.gifted_eternity_credentials/apple_api_key.p8"

# Google
export GOOGLE_PLAY_KEY_PATH="~/.gifted_eternity_credentials/google_play_key.json"

# Android
export KEYSTORE_PATH="~/.gifted_eternity_credentials/keystore.jks"
export KEYSTORE_PASSWORD="your_password"
export KEY_ALIAS="gifted_eternity_key"
export KEY_PASSWORD="your_password"
```

---

## Verification Checklist

- [ ] Apple Developer Account created
- [ ] Google Play Developer Account created
- [ ] App Store Connect API Key generated
- [ ] Google Play Service Account created
- [ ] App icons created (all sizes)
- [ ] Screenshots created (all devices)
- [ ] Feature graphics created
- [ ] App description written
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] In-app products configured
- [ ] Content rating submitted
- [ ] Credentials securely stored
- [ ] Build files ready for upload

---

## Next Steps
1. Upload builds to app stores
2. Submit for review
3. Monitor review status
4. Prepare marketing materials
5. Plan launch date
