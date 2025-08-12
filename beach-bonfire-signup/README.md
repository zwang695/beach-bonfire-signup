# 🏖️ Beach Bonfire BBQ Sign-up App

A fun, beach-themed web application for organizing beach bonfires and BBQs with Google Sheets integration!

## ✨ Features

- 🔥 Beautiful beach-themed design with gradients and emojis
- 📝 Easy sign-up form for attendees
- 📊 Google Sheets integration for data storage
- 📋 Pre-populated list of needed items
- ✅ Real-time tracking of what's been brought vs what's still needed
- 📱 Fully responsive design
- 🎨 Smooth animations and modern UI

## 🚀 Free Deployment Options

### 1. Vercel (Recommended)
**Why**: Best Next.js support, easy setup, generous free tier
- Deploy: Connect GitHub repo at [vercel.com](https://vercel.com)
- Add environment variables in dashboard
- Automatic deployments on git push

### 2. Netlify
**Why**: Great for static sites, good CI/CD
- Deploy: Drag & drop build folder or connect GitHub
- Add environment variables in site settings
- Build command: `npm run build`

### 3. Railway
**Why**: Good for full-stack apps, easy database integration
- Connect GitHub at [railway.app](https://railway.app)
- Automatic environment variable detection
- Built-in database options if needed

### 4. Render
**Why**: Simple deployment, good free tier
- Connect GitHub at [render.com](https://render.com)
- Build command: `npm run build`
- Start command: `npm start`

## 🛠️ Setup Instructions

### 1. Google Sheets Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create service account credentials
5. Download the JSON key file
6. Create a Google Sheet and share it with the service account email

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```bash
GOOGLE_SHEET_ID=your_sheet_id_from_url
GOOGLE_SERVICE_ACCOUNT_EMAIL=service_account_email_here
GOOGLE_PRIVATE_KEY="your_private_key_with_newlines"
```

### 3. Local Development
```bash
npm install
npm run dev
```

### 4. Production Build
```bash
npm run build
npm start
```

## 📊 Google Sheets Structure

The app automatically creates two sheets:
- **Signups**: Stores attendee information and what they're bringing
- **NeededItems**: Pre-populated list of items needed for the BBQ

## 🎨 Customization

- Edit event details in `src/app/page.tsx`
- Modify needed items in `src/lib/sheets.ts`
- Customize colors in component files
- Add new categories as needed

## 🔧 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Google Sheets
- **Deployment**: Vercel/Netlify/Railway/Render

## 📝 Contributing

Feel free to customize this for your own events! Some ideas:
- Add photo upload for items
- Send email confirmations
- Add weather integration
- Create multiple event types
- Add RSVP deadline

## 🏖️ Have Fun!

Made with ❤️ for awesome beach parties! 🌊🔥
