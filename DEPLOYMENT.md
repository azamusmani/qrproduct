# Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy Frontend
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel
```

### Step 3: Deploy Backend
You'll need to deploy the backend separately. Options:
- **Railway** (recommended)
- **Render**
- **Heroku**

### Step 4: Update Environment Variables
Set these in your hosting platform:
- `FRONTEND_URL` = Your Vercel URL
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase Key

## Alternative: Use ngrok for Testing

### Install ngrok
```bash
npm install -g ngrok
```

### Create Public URL
```bash
# For frontend
ngrok http 8081

# For backend (in another terminal)
ngrok http 3001
```

### Update QR Code Generation
Use the ngrok URL in your QR codes.

## Manual Testing
1. Deploy to get a public URL
2. Update the QR code generation to use the public URL
3. Test QR codes from any device 