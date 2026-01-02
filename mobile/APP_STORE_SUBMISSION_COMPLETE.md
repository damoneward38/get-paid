# App Store Submission Guide - iOS & Android

## Apple App Store Submission

### Pre-Submission Checklist

- [ ] App is built and tested on physical devices
- [ ] All bugs are fixed
- [ ] Performance meets benchmarks
- [ ] Privacy policy is published
- [ ] Terms of service are published
- [ ] App icons are 1024x1024 PNG
- [ ] Screenshots are correct size and quality
- [ ] App description is complete
- [ ] Keywords are relevant
- [ ] Support URL is valid
- [ ] No placeholder text in app
- [ ] No temporary test accounts
- [ ] No debug logs visible
- [ ] All links work correctly

### Step 1: Prepare Build

```bash
cd mobile
eas build --platform ios --profile production
```

### Step 2: Upload to App Store Connect

#### Via Xcode
1. Open project in Xcode
2. Select Generic iOS Device
3. Product > Archive
4. Click Distribute App
5. Select App Store Connect
6. Follow wizard to upload

#### Via Transporter
```bash
# Download build from EAS
# Use Transporter app to upload
xcrun altool --upload-app -f app.ipa -t ios -u apple_id@example.com -p app_password
```

### Step 3: Fill App Store Information

#### App Information
- **App Name:** Gifted Eternity
- **Subtitle:** Stream Gospel Music & More
- **Category:** Music
- **Content Rating:** 4+

#### Description
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

#### Keywords
```
gospel, music, streaming, soul, R&B, christian, audio, playlist, artist
```

#### Support & Privacy
- **Support URL:** https://giftedeternitystudio.com/support
- **Privacy Policy:** https://giftedeternitystudio.com/privacy
- **Terms of Service:** https://giftedeternitystudio.com/terms

### Step 4: Add Screenshots

#### iPhone Screenshots (5.5")
1. Home screen with music
2. Player interface
3. Subscription tiers

#### iPhone Screenshots (6.5")
1. Home screen with music
2. Player interface
3. Subscription tiers

#### iPad Screenshots (12.9")
1. Home screen with music
2. Player interface
3. Subscription tiers

### Step 5: Configure In-App Purchases

#### Subscription Products
1. **Fan Plan**
   - Price: $4.99/month
   - Product ID: `com.giftedeternitystudio.fan.monthly`
   - Duration: 1 month
   - Renewal: Auto

2. **Premium Plan**
   - Price: $9.99/month
   - Product ID: `com.giftedeternitystudio.premium.monthly`
   - Duration: 1 month
   - Renewal: Auto

3. **Supporter Plan**
   - Price: $99/year
   - Product ID: `com.giftedeternitystudio.supporter.yearly`
   - Duration: 1 year
   - Renewal: Auto

### Step 6: Submit for Review

1. Go to App Store Connect
2. Select your app
3. Click "Prepare for Submission"
4. Review all information
5. Click "Submit for Review"
6. Add review notes:
   ```
   This is a music streaming application. Users can stream gospel, 
   soul, R&B, and other genres. The app includes subscription features 
   and offline download capabilities.
   
   Test Account:
   Email: test@giftedeternitystudio.com
   Password: TestPassword123!
   
   Features to test:
   - Music streaming
   - Offline downloads
   - Subscription purchase
   - Playlist creation
   ```

### Step 7: Monitor Review Status

- **Typical Review Time:** 24-48 hours
- **Check Status:** App Store Connect > Your App > Activity
- **Possible Outcomes:**
  - Approved ✅
  - Rejected ❌ (review notes explain why)
  - Metadata Rejected (fix and resubmit)

### Step 8: Release to App Store

1. Review approval notification
2. Go to App Store Connect
3. Click "Release This Version"
4. Choose release date (immediate or scheduled)
5. Confirm release

---

## Google Play Store Submission

### Pre-Submission Checklist

- [ ] App is built and tested on physical devices
- [ ] All bugs are fixed
- [ ] Performance meets benchmarks
- [ ] Privacy policy is published
- [ ] Terms of service are published
- [ ] App icons are 512x512 PNG
- [ ] Feature graphic is 1024x500
- [ ] Screenshots are correct size
- [ ] App description is complete
- [ ] Content rating submitted
- [ ] No placeholder text in app
- [ ] No test accounts visible
- [ ] No debug logs visible
- [ ] All links work correctly

### Step 1: Prepare Build

```bash
cd mobile
eas build --platform android --profile production
```

### Step 2: Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to Release > Production
4. Click "Create new release"
5. Upload AAB file

### Step 3: Fill Store Listing

#### App Details
- **App Name:** Gifted Eternity
- **Short Description:** Stream Gospel Music & More
- **Category:** Music & Audio
- **Content Rating:** Mature Audiences

#### Full Description
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

Download Gifted Eternity today and start your musical journey!
```

#### Contact Information
- **Developer Email:** support@giftedeternitystudio.com
- **Privacy Policy:** https://giftedeternitystudio.com/privacy
- **Terms of Service:** https://giftedeternitystudio.com/terms

### Step 4: Add Graphics

#### App Icon
- 512x512 PNG

#### Feature Graphic
- 1024x500 PNG/JPG

#### Screenshots (Phone)
1. Home screen with music
2. Player interface
3. Subscription tiers
4. Playlist creation
5. Search interface

#### Screenshots (Tablet)
1. Home screen with music
2. Player interface

### Step 5: Content Rating

Complete Google Play's content rating questionnaire:
1. Go to Content Rating
2. Answer questions about:
   - Violence
   - Sexual Content
   - Profanity
   - Alcohol/Tobacco
   - Gambling
3. Submit questionnaire
4. Receive rating

### Step 6: Configure In-App Products

#### Subscription Products
1. **Fan Plan**
   - Price: $4.99/month
   - Product ID: `fan_monthly`

2. **Premium Plan**
   - Price: $9.99/month
   - Product ID: `premium_monthly`

3. **Supporter Plan**
   - Price: $99/year
   - Product ID: `supporter_yearly`

### Step 7: Add Release Notes

```
Version 1.0.0

Welcome to Gifted Eternity! 

This is the initial release of our music streaming platform.

Features:
- Stream gospel, soul, R&B, and more
- Create and manage playlists
- Offline downloads
- High-quality audio
- Personalized recommendations
- Support your favorite artists

Thank you for downloading!
```

### Step 8: Submit for Review

1. Review all information
2. Click "Save"
3. Click "Review"
4. Confirm submission
5. Click "Start rollout to Production"
6. Set rollout percentage (start at 5%)

### Step 9: Monitor Review Status

- **Typical Review Time:** 2-4 hours (usually faster than iOS)
- **Check Status:** Play Console > Your App > Release
- **Possible Outcomes:**
  - Approved ✅
  - Rejected ❌ (review notes explain why)

### Step 10: Gradual Rollout

1. Start at 5% rollout
2. Monitor crash reports and reviews
3. Increase to 25% after 24 hours
4. Increase to 50% after 48 hours
5. Increase to 100% after 72 hours

---

## Post-Launch Monitoring

### iOS Monitoring
- App Store Connect > Analytics
- Monitor:
  - Downloads
  - Crashes
  - Performance
  - Reviews

### Android Monitoring
- Play Console > Analytics
- Monitor:
  - Installs
  - Crashes
  - Performance
  - Reviews

### Common Issues & Solutions

#### High Crash Rate
- Check crash reports
- Fix critical bugs
- Release hotfix update

#### Poor Reviews
- Respond to reviews
- Address common complaints
- Release improvements

#### Low Downloads
- Improve app store listing
- Add more screenshots
- Improve description
- Run marketing campaign

---

## Update Process

### For iOS
1. Build new version
2. Upload to App Store Connect
3. Submit for review
4. Wait for approval
5. Release to App Store

### For Android
1. Build new version
2. Upload to Play Console
3. Add release notes
4. Start gradual rollout
5. Monitor for issues

---

## Troubleshooting

### iOS Issues
- **Rejected for Policy:** Review Apple's guidelines
- **Build Upload Failed:** Check certificate validity
- **App Crashes on Review:** Test thoroughly before submission

### Android Issues
- **Rejected for Policy:** Review Google's policies
- **Build Upload Failed:** Check AAB format
- **Crashes on Review:** Test on multiple devices

---

## Success Metrics

- **Target Downloads:** 10,000+ in first month
- **Target Rating:** 4.5+ stars
- **Target Retention:** 30% after 30 days
- **Target Conversion:** 5% to paid subscription
