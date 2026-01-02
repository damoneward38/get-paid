# Gifted Eternity Platform

Gifted Eternity is a full-stack music streaming and analytics platform built for creators.

## 🎵 Features

### Music Streaming
- Unlimited music streaming from 50+ gospel tracks
- 4 complete albums with high-quality audio
- Browse, search, and discover functionality
- Personalized recommendations
- Offline download support

### DistroKid-Style Distribution
- Multi-platform distribution (Spotify, Apple Music, Amazon, YouTube, TIDAL, Deezer, Pandora, SoundCloud)
- Release management & scheduling
- Royalty tracking & real-time earnings
- Metadata management (ISRC, UPC codes)
- Rights management & licensing
- Artist collaboration & revenue splits
- Playlist pitching system
- White label distribution

### Analytics & Payments
- Real-time streaming analytics
- Listener demographics & trends
- PayPal integration for payouts
- Artist dashboards & insights
- Subscription management

## 🏗️ Architecture

### Structure
```
.
├── client/              – React + Vite frontend
├── server/              – Node.js backend services
├── shared/              – Shared types & logic
├── drizzle/             – Database schema & migrations
├── index.html           – Public landing page (GitHub Pages)
├── package.json         – Dependencies
├── vite.config.ts       – Vite configuration
└── vercel.json          – Vercel deployment config
```

### Technology Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS 4
- shadcn/ui components
- tRPC client

**Backend:**
- Node.js + Express
- tRPC (type-safe APIs)
- Drizzle ORM
- PayPal SDK

**Database:**
- MySQL or TiDB
- Drizzle schema migrations

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Environment Variables

Create `.env` file:

```env
DATABASE_URL=mysql://user:password@host:3306/database
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
PAYPAL_MODE=sandbox
VITE_APP_TITLE=Gifted Eternity
VITE_APP_LOGO=/logo.png
```

## 📦 Deployment

### Important
This repository is **not a static website**. GitHub Pages is used **only** for the landing page.

### Frontend Deployment
Build with Vite, deploy to:
- **Vercel** (Recommended) – Full-stack support, free tier
- **Netlify** – Alternative, free tier
- **Cloudflare Pages** – Fast CDN, free tier

### Backend Deployment
Node.js services, deploy to:
- **Vercel** (Recommended) – Full-stack support
- **Railway** – Simple, good free tier
- **Fly.io** – Global deployment
- **AWS / GCP** – Enterprise scale
- **VPS** – Self-hosted (DigitalOcean, Linode)

### Deploy to Vercel (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this GitHub repository
3. Configure environment variables
4. Click Deploy
5. Your app is live in 2-3 minutes!

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📊 Project Status

- ✅ All features implemented
- ✅ Type-safe backend (tRPC)
- ✅ Beautiful responsive UI
- ✅ PayPal integration complete
- ✅ Database schema ready
- ✅ Production ready

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) – Detailed deployment guide
- [index.html](index.html) – Landing page & architecture overview
- Backend API documentation in code comments
- Frontend component documentation in code comments

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm dev:server       # Start backend only
pnpm dev:client       # Start frontend only

# Building
pnpm build            # Build for production
pnpm build:client     # Build frontend only
pnpm build:server     # Build backend only

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Run tests in watch mode

# Database
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations

# Linting
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## 🎯 Features by Module

### Distribution (`server/services/distribution.ts`)
- Multi-platform distribution
- Release scheduling
- Bulk uploads
- DSP management

### Royalty Tracking (`server/services/royaltyTracking.ts`)
- Real-time earnings
- Platform-specific rates
- Automatic payouts
- Statement generation

### Release Management (`server/services/releaseManagement.ts`)
- Schedule releases
- Pre-order management
- Bulk distribution
- Status tracking

### Metadata Management (`server/services/metadataManagement.ts`)
- ISRC code generation
- UPC code generation
- Songwriter credits
- Revenue splits

### Rights Management (`server/services/rightsManagement.ts`)
- Copyright registration
- Mechanical licensing
- Sync licensing
- Publishing rights

### Distribution Analytics (`server/services/distributionAnalytics.ts`)
- Stream tracking
- Listener demographics
- Platform performance
- Trending tracks

### Artist Collaboration (`server/services/artistCollaboration.ts`)
- Featured artist tracking
- Producer credits
- Revenue splits
- Collaboration earnings

### Playlist Pitching (`server/services/playlistPitching.ts`)
- DSP playlist submission
- Bulk pitching
- Pitch tracking
- Curator management

### White Label Distribution (`server/services/whiteLabelDistribution.ts`)
- Label creation (3 tiers)
- Artist management
- Label analytics
- Custom revenue splits

## 💳 PayPal Integration

Complete PayPal payment processing for automatic artist payouts:
- Account linking & verification
- Automatic payout processing
- Webhook event handling
- Payment history tracking
- Error handling & retry logic

See [server/services/paypalPayments.ts](server/services/paypalPayments.ts) for implementation.

## 🔐 Security

- Type-safe APIs with tRPC
- JWT authentication
- Protected procedures
- Input validation with Zod
- Environment variable management
- Secure PayPal integration

## 📈 Monitoring

- Real-time analytics dashboard
- Error logging
- Performance monitoring
- User engagement tracking
- Revenue analytics

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## 📄 License

© 2025 Gifted Eternity • Built by Damone Ward Sr.

## 🆘 Support

For deployment issues, see [DEPLOYMENT.md](DEPLOYMENT.md)

For technical questions, check the code comments and documentation.

---

**Ready to deploy?** [Deploy to Vercel](https://vercel.com/new) now! 🚀
