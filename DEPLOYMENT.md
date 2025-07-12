# Deployment Guide

## Step 1: Deploy Backend to Railway (Recommended)

### 1.1 Create Railway Account
- Go to [Railway.app](https://railway.app)
- Sign up with GitHub
- Create a new project

### 1.2 Deploy Backend
```bash
# In Railway dashboard:
# 1. Click "Deploy from GitHub repo"
# 2. Select your repository
# 3. Set the root directory to: server
# 4. Set the build command to: npm install
# 5. Set the start command to: node index.js
```

### 1.3 Set Environment Variables in Railway
Add these environment variables in Railway:
- `VITE_SUPABASE_URL` = Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase Key
- `FRONTEND_URL` = Your Netlify URL (e.g., https://your-app.netlify.app)

### 1.4 Get Your Backend URL
Railway will give you a URL like: `https://your-app-name.railway.app`

## Step 2: Update Netlify Configuration

### 2.1 Update netlify.toml
Replace `your-backend-url.railway.app` with your actual Railway URL:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-railway-url.railway.app/api/:splat"
  status = 200
```

### 2.2 Set Environment Variables in Netlify
In your Netlify dashboard, go to Site settings > Environment variables and add:
- `VITE_API_URL` = `https://your-actual-railway-url.railway.app/api`

## Step 3: Redeploy Frontend

### 3.1 Push Changes to GitHub
```bash
git add .
git commit -m "Update API configuration for production"
git push
```

### 3.2 Netlify Will Auto-Deploy
Netlify will automatically rebuild and deploy your site with the new configuration.

## Step 4: Test Your Deployment

### 4.1 Test on Different Devices
- Test on your laptop
- Test on your phone
- Test QR codes from your phone

### 4.2 Verify API Endpoints
Visit these URLs to test:
- `https://your-railway-url.railway.app/health`
- `https://your-railway-url.railway.app/api/test-supabase`

## Alternative: Quick Test with ngrok

If you want to test quickly without deploying:

### Install ngrok
```bash
npm install -g ngrok
```

### Create Public URLs
```bash
# Terminal 1: Backend
ngrok http 3001

# Terminal 2: Frontend  
ngrok http 3000
```

### Update Environment Variables
Set `VITE_API_URL` to your ngrok backend URL in your `.env` file.

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your backend has CORS enabled
2. **Environment variables not loading**: Check that they're set correctly in your hosting platform
3. **API not responding**: Verify your backend is running and accessible

### Check Logs:
- Railway logs: Check your Railway dashboard
- Netlify logs: Check your Netlify dashboard
- Browser console: Check for JavaScript errors 