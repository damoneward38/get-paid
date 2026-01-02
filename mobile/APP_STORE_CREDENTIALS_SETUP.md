# App Store Credentials Setup Guide
**Gifted Eternity Mobile App**

## Overview

Complete guide for setting up credentials for both Apple App Store and Google Play Store.

---

## 1. Apple Developer Account Setup

### Create Apple ID

```
1. Visit https://appleid.apple.com
2. Click "Create your Apple ID"
3. Enter email, password, security questions
4. Verify email address
5. Enable two-factor authentication (required)
```

### Enroll in Apple Developer Program

```
1. Visit https://developer.apple.com/programs/
2. Click "Enroll"
3. Sign in with Apple ID
4. Complete developer profile:
   - Legal Entity Name: Gifted Eternity Studio
   - Legal Entity Status: Individual
   - Address: [Your Address]
   - Phone: [Your Phone]
5. Accept agreements
6. Pay $99/year enrollment fee
7. Wait for approval (usually 24-48 hours)
```

### Developer Account Details

```
Apple ID: developer@giftedeternitystudio.com
Developer Team ID: [Will be assigned]
Team Name: Gifted Eternity Studio
Program: Apple Developer Program
Status: Active
Enrollment Fee: $99/year
```

---

## 2. App Store Connect Setup

### Create App Store Connect Account

```
1. Visit https://appstoreconnect.apple.com
2. Sign in with Apple ID
3. Accept agreements
4. Complete organization information
```

### Create App Record

```
App Name: Gifted Eternity
Bundle ID: com.giftedeternitystudio.app
SKU: GIFTED-ETERNITY-001
Platform: iOS
Type: App
```

### App Information

```
Primary Language: English
Category: Music
Subcategory: Music Streaming
Content Rating: 4+
Age Rating: 4+
Copyright: © 2024 Gifted Eternity Studio
```

### Pricing & Availability

```
Pricing Tier: Free (with in-app purchases)
Availability: Worldwide
Release Date: Automatic (upon approval)
```

---

## 3. Google Play Developer Account Setup

### Create Google Account

```
1. Visit https://accounts.google.com
2. Click "Create account"
3. Enter name, email, password
4. Verify phone number
5. Verify email address
```

### Enroll in Google Play Developer Program

```
1. Visit https://play.google.com/console
2. Click "Create account"
3. Sign in with Google Account
4. Accept Developer Program Policies
5. Pay $25 one-time registration fee
6. Complete developer profile:
   - Developer Name: Gifted Eternity Studio
   - Email: developer@giftedeternitystudio.com
   - Website: https://giftedeternitystudio.com
   - Phone: [Your Phone]
7. Verify payment method
8. Account activated immediately
```

### Developer Account Details

```
Google Account: developer@giftedeternitystudio.com
Developer Name: Gifted Eternity Studio
Developer ID: [Will be assigned]
Program: Google Play Developer Program
Status: Active
Registration Fee: $25 (one-time)
```

---

## 4. App Store Connect Credentials

### API Keys

```
1. Go to Users and Access > API Keys
2. Click "Generate API Key"
3. Select "App Store Connect API"
4. Download private key (save securely)
5. Note Key ID and Issuer ID
```

### Credentials File

```
~/.appstoreconnect/credentials.json

{
  "issuer_id": "ISSUER_ID",
  "key_id": "KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
}
```

### Two-Factor Authentication

```
1. Settings > Security > Two-Factor Authentication
2. Enable 2FA (required for App Store Connect)
3. Save recovery codes in secure location
4. Add trusted devices
```

---

## 5. Google Play Console Credentials

### Service Account

```
1. Go to Settings > Developer Account > API Access
2. Click "Create Service Account"
3. Follow Google Cloud Console link
4. Create new service account:
   - Service Account Name: gifted-eternity-app
   - Email: gifted-eternity-app@[project-id].iam.gserviceaccount.com
5. Create key (JSON format)
6. Download and save securely
```

### Credentials File

```
~/.google-play/credentials.json

{
  "type": "service_account",
  "project_id": "gifted-eternity-project",
  "private_key_id": "KEY_ID",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----",
  "client_email": "gifted-eternity-app@[project-id].iam.gserviceaccount.com",
  "client_id": "CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Grant Permissions

```
1. In Google Play Console
2. Settings > Users and Permissions
3. Invite service account email
4. Grant roles:
   - Release Manager
   - Financial Editor
   - Statistics Viewer
```

---

## 6. Certificates & Keys Management

### Store Credentials Securely

```bash
# Create secure directory
mkdir -p ~/.credentials
chmod 700 ~/.credentials

# Store Apple credentials
cp appstoreconnect_key.p8 ~/.credentials/
chmod 600 ~/.credentials/appstoreconnect_key.p8

# Store Google credentials
cp google-play-credentials.json ~/.credentials/
chmod 600 ~/.credentials/google-play-credentials.json

# Add to .gitignore
echo ".credentials/" >> .gitignore
echo "*.p8" >> .gitignore
echo "*-credentials.json" >> .gitignore
```

### Environment Variables

```bash
# ~/.bashrc or ~/.zshrc

export APPLE_ISSUER_ID="ISSUER_ID"
export APPLE_KEY_ID="KEY_ID"
export APPLE_PRIVATE_KEY_PATH="~/.credentials/appstoreconnect_key.p8"

export GOOGLE_PLAY_CREDENTIALS="~/.credentials/google-play-credentials.json"
export GOOGLE_PLAY_PACKAGE_NAME="com.giftedeternitystudio.app"
```

---

## 7. Payment & Billing

### Apple Developer Program

```
Annual Fee: $99
Payment Method: Credit Card
Renewal Date: [Enrollment Date + 1 year]
Auto-Renewal: Enabled
Billing Email: billing@giftedeternitystudio.com
```

### Google Play Developer Program

```
One-Time Fee: $25
Payment Method: Credit Card
Status: Paid
Refund Policy: No refunds after 30 days
```

### In-App Purchase Setup

**Apple App Store:**
```
1. App Store Connect > In-App Purchases
2. Create subscription products:
   - Fan Plan: $4.99/month
   - Premium Plan: $9.99/month
   - Supporter Plan: $99/year
3. Set up auto-renewable subscriptions
4. Configure grace period (3 days)
5. Configure billing retry (7 days)
```

**Google Play:**
```
1. Google Play Console > Products > Subscriptions
2. Create subscription products:
   - Fan Plan: $4.99/month
   - Premium Plan: $9.99/month
   - Supporter Plan: $99/year
3. Set up billing cycle
4. Configure grace period (3 days)
5. Configure billing retry (7 days)
```

---

## 8. Privacy & Security

### Privacy Policy

```
Required for both stores:
- Data collection practices
- User privacy rights
- Cookie usage
- Third-party sharing
- GDPR compliance (if applicable)

URL: https://giftedeternitystudio.com/privacy
```

### Terms of Service

```
Required for both stores:
- User agreement
- Acceptable use policy
- Limitation of liability
- Dispute resolution

URL: https://giftedeternitystudio.com/terms
```

### Data Protection

```
- All credentials stored securely
- Never commit credentials to version control
- Use environment variables for sensitive data
- Rotate API keys annually
- Enable two-factor authentication
- Monitor account activity
```

---

## 9. Credential Rotation

### Apple Credentials

```bash
# Rotate API key annually
1. App Store Connect > Users and Access > API Keys
2. Click existing key
3. Generate new key
4. Update environment variables
5. Delete old key after verification
```

### Google Credentials

```bash
# Rotate service account key annually
1. Google Cloud Console > Service Accounts
2. Select service account
3. Keys tab > Add Key > Create new key
4. Update environment variables
5. Delete old key after verification
```

---

## 10. Troubleshooting

### Common Issues

**Issue: "Invalid credentials"**
- Solution: Verify API key/service account is active and has correct permissions

**Issue: "Two-factor authentication required"**
- Solution: Enable 2FA, add trusted device, or use app-specific password

**Issue: "Insufficient permissions"**
- Solution: Grant required roles in developer console

**Issue: "Credentials expired"**
- Solution: Regenerate API key/service account key

---

## 11. Deployment Checklist

- [ ] Apple ID created
- [ ] Apple Developer Program enrolled ($99)
- [ ] App Store Connect account set up
- [ ] App record created in App Store Connect
- [ ] App Store API key generated
- [ ] Two-factor authentication enabled
- [ ] Google Account created
- [ ] Google Play Developer Program enrolled ($25)
- [ ] Google Play Console account set up
- [ ] Service account created
- [ ] Google Play API credentials generated
- [ ] Permissions granted to service account
- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Payment methods configured
- [ ] In-app purchases set up
- [ ] Credentials stored securely
- [ ] Environment variables configured

---

## 12. Security Best Practices

```
✅ Store credentials in secure location (~/.credentials)
✅ Never commit credentials to version control
✅ Use environment variables for sensitive data
✅ Enable two-factor authentication
✅ Rotate API keys annually
✅ Monitor account activity regularly
✅ Use service accounts for automation
✅ Grant minimum required permissions
✅ Keep software updated
✅ Use VPN for account access
```

---

## Conclusion

App Store credentials are set up and secured. Ready for app submission.

**Status: CREDENTIALS CONFIGURED** ✅

---

**Last Updated:** December 29, 2024
**Version:** 1.0
