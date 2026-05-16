# Deployment Error Resolution Guide

## Overview

This document provides solutions for common deployment issues with the RAMZFX Trading Bot on Vercel, with focus on environment variables, OAuth, and missing dependencies.

---

## Error 1: `invalid_client`

### Symptoms

```
OAuth Error: invalid_client
Error Description: CLIENT_ID is not configured. Please set the CLIENT_ID environment variable.
```

**When it happens:**
- User clicks "Login" button
- Redirected to error page immediately
- No redirect to Deriv OAuth server

### Root Causes

1. ❌ `CLIENT_ID` environment variable not set in Vercel Dashboard
2. ❌ `CLIENT_ID` is set but empty string
3. ❌ `CLIENT_ID` value is incorrect or typo
4. ❌ Using wrong CLIENT_ID (from staging when production is needed)
5. ❌ CLIENT_ID expired or revoked in Deriv dashboard

### Solutions

**Solution 1: Verify Vercel Environment Variables**

1. Go to https://vercel.com/dashboard
2. Select "ramzfx254" project
3. Click "Settings" → "Environment Variables"
4. Check if `CLIENT_ID` exists and has a value
5. If missing, add it: 
   ```
   Key: CLIENT_ID
   Value: 337Xtpf8o2P74cGAJejAa (or your actual ID)
   Environments: ✓ Production ✓ Preview ✓ Development
   ```

**Solution 2: Verify Value is Not Empty**

1. Click on `CLIENT_ID` variable
2. Ensure value is not empty (not blank string)
3. If empty, update with actual CLIENT_ID

**Solution 3: Verify Correct CLIENT_ID**

1. Go to https://app.deriv.com/account/api-token
2. Scroll to "OAuth Applications"
3. Copy your Client ID exactly (including any special characters)
4. Paste into Vercel, checking for typos

**Solution 4: Redeploy After Adding Variable**

After adding/changing CLIENT_ID:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Select "Redeploy"
4. Wait for build to complete
5. Check "Logs" → "Build" for confirmation:
   ```
   ✅ Build Configuration:
      OAuth Enabled: YES
   ```

**Solution 5: Check Deriv Dashboard**

1. Go to https://app.deriv.com/account/api-token
2. Verify your OAuth Application exists
3. Check if application is active (not disabled)
4. Verify API scope includes `trade`
5. If revoked/expired, create new application and update CLIENT_ID

### Verification Steps

After applying solutions, verify:

```bash
# 1. Check build logs
# Vercel Dashboard → Deployments → [Latest] → Logs → Build
# Should show: OAuth Enabled: YES

# 2. Test login on production
# Go to: https://ramzfx254.vercel.app
# Click Login button
# Should redirect to Deriv OAuth server (not error page)

# 3. Check browser console
# Open Dev Tools (F12) → Console tab
# Look for error messages about CLIENT_ID
```

---

## Error 2: `redirect_uri_mismatch`

### Symptoms

```
OAuth Error: redirect_uri_mismatch
Error Description: The redirect_uri does not match the one registered with your OAuth application
```

**When it happens:**
- User logs in successfully on Deriv
- After approval, app shows error instead of completing login
- Stuck on Deriv login page

### Root Causes

1. ❌ Vercel URL not added to Deriv OAuth redirect URIs
2. ❌ Redirect URL has trailing slash (should be without)
3. ❌ Using staging Vercel URL but prod credentials
4. ❌ Using preview URL not in authorized list
5. ❌ Domain mismatch (e.g., `www.` vs no `www.`)

### Solutions

**Solution 1: Add Your Vercel URL to Deriv Dashboard**

1. Get your Vercel deployment URL:
   - Production: `https://ramzfx254.vercel.app`
   - Preview: `https://staging.ramzfx254.vercel.app` (or your branch preview)
   - Local: `https://localhost:8443` (for local testing)

2. Go to https://app.deriv.com/account/api-token

3. Find your OAuth Application and click to edit

4. In "Authorized redirect URIs" section, add:
   ```
   https://ramzfx254.vercel.app
   https://staging.ramzfx254.vercel.app
   ```

5. ⚠️ **Important**: URLs should NOT have:
   - Trailing slashes: ❌ `https://ramzfx254.vercel.app/` → ✅ `https://ramzfx254.vercel.app`
   - Path after domain: ❌ `https://ramzfx254.vercel.app/login` → ✅ `https://ramzfx254.vercel.app`
   - Query parameters: ❌ `https://ramzfx254.vercel.app?param=1` → ✅ `https://ramzfx254.vercel.app`

6. Save changes

**Solution 2: Add Wildcard for Preview Deployments**

If you have many preview branches, add:
```
https://*.vercel.app
```

This allows ALL preview deployments on your Vercel project.

**Solution 3: Verify No WWW Mismatch**

Ensure all URLs use same format:
- ✅ All without www: `https://ramzfx254.vercel.app`
- ❌ Mix: `https://ramzfx254.vercel.app` + `https://www.ramzfx254.vercel.app`

**Solution 4: For Local Testing**

Add this to local Deriv OAuth application:
```
https://localhost:8443
```

Then test with:
```bash
npm run start  # Runs on https://localhost:8443
```

### Verification Steps

After adding URLs, test:

```bash
# 1. Go to your production URL
# https://ramzfx254.vercel.app

# 2. Click Login button

# 3. Should see Deriv login page (not error)

# 4. After login and approval, should return to app

# 5. Check browser console for errors
# Should NOT see "redirect_uri_mismatch"
```

---

## Error 3: Missing Environment Variables at Build Time

### Symptoms

```
Build Error: Cannot find CLIENT_ID during build
Error: process.env.CLIENT_ID is undefined
```

**When it happens:**
- Build fails on Vercel
- Build logs show environment variable errors
- Local build works but Vercel build fails

### Root Causes

1. ❌ Environment variable not in Vercel Dashboard (only in `.env.local`)
2. ❌ Vercel doesn't read `.env.local` files
3. ❌ Variable set after previous deployment (needs redeploy)
4. ❌ Variable set but build cache not cleared

### Solutions

**Solution 1: Variables Must Be in Vercel Dashboard, Not .env.local**

❌ Wrong:
```bash
# Only in local .env.local - NOT seen by Vercel
CLIENT_ID=337Xtpf8o2P74cGAJejAa
```

✅ Correct:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add CLIENT_ID there
3. Redeploy by clicking "..." → "Redeploy"

**Solution 2: Verify Variable is Visible During Build**

1. Go to Vercel Dashboard → Deployments
2. Click latest deployment
3. Click "Logs" → "Build"
4. Look for your configuration output:
   ```
   ✅ Build Configuration:
      Environment: development
      OAuth Enabled: YES
   ```

If it shows `OAuth Enabled: NO`, the variable wasn't set during build.

**Solution 3: Redeploy to Force New Build**

Even if you add variable after first deploy:
1. Vercel Deployments tab
2. Click "..." on latest deployment
3. Select "Redeploy"
4. This rebuilds with new environment variables

**Solution 4: Check Build Filter Settings**

Ensure Vercel is building all branches:
1. Settings → Git
2. Check "Build & Deploy" section
3. Verify ignored build step is appropriate (or disabled)

### Verification Steps

```bash
# 1. Check build logs show your environment
# Vercel Dashboard → Deployments → [Latest] → Logs → Build
# Should show: OAuth Enabled: YES

# 2. If still failing, check environment variable in Vercel
# Settings → Environment Variables
# Verify CLIENT_ID is listed

# 3. If added recently, redeploy
# Deployments → Click "..." → Redeploy
```

---

## Error 4: App Shows "Configuration Error" Banner

### Symptoms

```
⚠️ Configuration Error

Critical Issues (Must Fix):
❌ MISSING REQUIRED: CLIENT_ID - This variable must be set for the application to work

Missing Variables:
⚠️ CLIENT_ID
```

**When it happens:**
- App loads but shows error banner
- Login button doesn't work
- Shown at runtime (after deployment succeeds)

### Root Causes

1. ❌ APP_ENV=production but CLIENT_ID not set
2. ❌ Valid on staging but not on production environment
3. ❌ Variable set in Preview environment but app deployed to Production
4. ❌ Environment-specific variable not copied to all environments

### Solutions

**Solution 1: Set Variable for Current Environment**

1. Check what environment you're on:
   - Production: `https://ramzfx254.vercel.app`
   - Preview: `https://staging.ramzfx254.vercel.app` or `https://*-...-ramzfx254.vercel.app`

2. Go to Vercel Dashboard → Settings → Environment Variables

3. Edit `CLIENT_ID` variable

4. Under "Environments", ensure ✓ for your current environment:
   - For production URL: Check ✓ Production
   - For preview URL: Check ✓ Preview
   - For development: Check ✓ Development

5. Click "Save"

**Solution 2: Add Variable to All Environments**

To ensure variable works everywhere:
1. Vercel Dashboard → Settings → Environment Variables
2. Click "CLIENT_ID"
3. Check all three boxes:
   - ✓ Production
   - ✓ Preview
   - ✓ Development
4. Click "Save"

**Solution 3: Verify Variable Actually Has Value**

1. Vercel Dashboard → Settings → Environment Variables
2. Look for `CLIENT_ID`
3. You should see a value shown (usually masked as `•••••`)
4. If no value shown, click to edit and add it

### Verification Steps

After applying solutions:

```bash
# 1. Refresh your browser
# Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

# 2. Check if error banner gone
# Should show normal app interface

# 3. Try clicking Login
# Should work without errors

# 4. Check browser console (F12)
# Should NOT show "Configuration Error"
```

---

## Error 5: WebSocket Connection Failed

### Symptoms

```
Error: WebSocket connection failed
Error: Cannot execute trades - not connected
Console: WebSocket connection to wss://... failed
```

**When it happens:**
- Successfully logged in
- Cannot execute trades
- Disconnected from trading server

### Root Causes

1. ❌ APP_ENV doesn't match deployment environment
2. ❌ Using staging credentials on production (wrong endpoints)
3. ❌ Wrong API URL in brand.config.json
4. ❌ CORS policy blocking WebSocket
5. ❌ Firewall/network blocking WebSocket

### Solutions

**Solution 1: Verify APP_ENV Matches Environment**

Production deployment should use:
```
APP_ENV = production
```

Check:
1. Vercel Dashboard → Settings → Environment Variables
2. Find `APP_ENV`
3. For Production environment, value should be `production`
4. For Preview environment, value should be `staging`

**Solution 2: Check API Endpoints in brand.config.json**

The app should automatically select endpoints based on APP_ENV:

Production (APP_ENV=production):
```
auth2_url: https://auth.deriv.com/oauth2/
derivws: https://api.derivws.com/trading/v1/
```

Staging (APP_ENV=staging):
```
auth2_url: https://staging-auth.deriv.com/oauth2/
derivws: https://staging-api.derivws.com/trading/v1/
```

Verify [brand.config.json](brand.config.json) has these URLs.

**Solution 3: Check Vercel Logs for Errors**

1. Vercel Dashboard → Deployments → [Latest]
2. Click "Logs" → "Runtime"
3. Look for WebSocket connection errors
4. May show which URL it's trying to connect to

**Solution 4: Browser Console Errors**

1. Open app on deployed URL
2. Press F12 to open Dev Tools
3. Click "Console" tab
4. Look for error messages
5. May show actual URL it's trying to connect to

### Verification Steps

```bash
# 1. Check App Environment
# Browser → App → Look at header or network tab
# Verify using correct endpoints

# 2. Verify APP_ENV in Vercel
# Settings → Environment Variables
# APP_ENV should match environment (prod/staging)

# 3. Test on local if possible
# npm run start
# Check if WebSocket connects locally

# 4. Check WebSocket in Dev Tools
# F12 → Network tab → WS filter
# Should see WebSocket connection open
```

---

## Error 6: Build Timeout

### Symptoms

```
Build Timeout: The build process exceeded the maximum time limit
Error: Build did not complete within 900 seconds
```

**When it happens:**
- Build logs stop after several minutes
- Deployment status shows "Error"
- Build doesn't complete

### Root Causes

1. ❌ Large dependencies taking too long to install
2. ❌ Slow network on Vercel build servers
3. ❌ Infinite loop in build process
4. ❌ Too many large assets to process

### Solutions

**Solution 1: Check for Circular Dependencies**

Look for imports that cause infinite loops:
```bash
# Run locally to test
npm run build

# If it builds locally but fails on Vercel, likely deployment issue, not code issue
```

**Solution 2: Optimize Asset Size**

If build is spending time processing assets:
1. Check [rsbuild.config.ts](rsbuild.config.ts)
2. Look for large file copies
3. Consider removing unnecessary assets
4. Use image optimization

**Solution 3: Increase Vercel Build Timeout**

In [vercel.json](vercel.json), you can set:
```json
{
  "buildCommand": "npm run build",
  "maxDuration": 3600
}
```

But first try optimizing the build.

**Solution 4: Check Environment Variables**

Sometimes missing variables cause infinite loops:
1. Verify all required variables are set
2. Verify variable values are correct
3. Redeploy

### Verification Steps

```bash
# 1. Build locally first
cd c:\Users\ROBERT\Desktop\ramzfx254\ramzfx
npm run build

# 2. If that works, issue is deployment-specific
# Check Vercel logs for details

# 3. Look at build duration
# Vercel Dashboard → Deployments → [Latest] → Logs → Build
# See how long different steps take

# 4. Check for large file copies
# Build output should show what's being copied
```

---

## Error 7: OAuth Token Expired

### Symptoms

```
Error: refresh_token expired
User gets logged out after inactivity
Error when trying to execute trades after user returned
```

**When it happens:**
- User logs in successfully
- User leaves app for while
- Returns to find they're logged out
- Or error when trying to execute trades

### Root Causes

1. Access token expired (normal, designed this way)
2. Refresh token expired or revoked
3. Session ended in Deriv
4. Token not properly stored/retrieved

### Solution

This is normal OAuth behavior. The app should:
1. Show login prompt when token expires
2. Allow user to login again
3. Store new tokens securely

If app is crashing instead:
1. Check browser console for errors
2. Check Vercel logs for server errors
3. May need to improve error handling

---

## Error 8: CORS Errors

### Symptoms

```
Error: Access to XMLHttpRequest at 'https://api.deriv.com/...' from origin 
'https://ramzfx254.vercel.app' has been blocked by CORS policy
```

**When it happens:**
- API calls fail
- Trading operations don't work
- Console shows CORS blocked error

### Root Causes

1. ❌ API doesn't allow cross-origin requests
2. ❌ Origin not whitelisted on API server
3. ❌ Missing Authorization header
4. ❌ Incorrect Content-Type header

### Solutions

**Solution 1: Check Vercel CORS Headers**

[vercel.json](vercel.json) has CORS headers configured:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

This applies to `/api/*` routes only.

**Solution 2: Verify API Calls Include Credentials**

OAuth calls should include:
```javascript
fetch(url, {
    method: 'POST',
    credentials: 'include',  // Important for OAuth
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: data
});
```

**Solution 3: Check Deriv API CORS Settings**

1. The Deriv API might need whitelist updates
2. Go to https://app.deriv.com/account/api-token
3. Check if your domain needs to be whitelisted
4. May need to request access

---

## Debugging Process

### Step-by-Step Debugging

1. **Check Vercel Build Logs**
   ```
   Vercel Dashboard → Deployments → [Latest] → Logs → Build
   ```
   Look for: ✅ OAuth Enabled: YES

2. **Check Vercel Runtime Logs**
   ```
   Vercel Dashboard → Deployments → [Latest] → Logs → Runtime
   ```
   Look for: Any error messages

3. **Check Browser Console**
   ```
   Production URL → F12 → Console tab
   Look for: Error messages and warnings
   ```

4. **Check Network Tab**
   ```
   Production URL → F12 → Network tab
   Click Login → Check requests
   Look for: Failed requests, CORS errors, response errors
   ```

5. **Check Environment Variables**
   ```
   Vercel Dashboard → Settings → Environment Variables
   Verify: All required variables present and have values
   ```

6. **Verify OAuth Configuration**
   ```
   https://app.deriv.com/account/api-token
   Check: CLIENT_ID exists, redirect URIs correct, scopes set to 'trade'
   ```

### Tips for Debugging

- 💡 Always check Vercel build logs first
- 💡 Redeploy after adding/changing environment variables
- 💡 Hard refresh browser: `Ctrl+Shift+R`
- 💡 Clear browser cache if behavior seems wrong
- 💡 Test on incognito/private window to avoid cache
- 💡 Check that URLs don't have trailing slashes
- 💡 Verify values are copied exactly (no extra spaces)
- 💡 Build locally first (`npm run build`) to isolate issues

---

## Getting Help

If issues persist:

1. **Check logs carefully** - Most errors are in Vercel build/runtime logs
2. **Verify environment variables** - 90% of issues are env var related
3. **Review this guide** - Most common issues documented here
4. **Check browser console** - F12 shows helpful error messages
5. **Redeploy** - Sometimes a fresh build fixes things

---

**Last Updated:** May 16, 2026
**For:** RAMZFX Trading Bot on Vercel
**Framework:** Rsbuild + React
