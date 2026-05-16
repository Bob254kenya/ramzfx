# Vercel Deployment Configuration Guide

## Overview

This guide explains how to properly configure your RAMZFX Trading Bot for deployment on Vercel with all required environment variables and OAuth settings.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required Environment Variables](#required-environment-variables)
3. [Vercel Dashboard Setup](#vercel-dashboard-setup)
4. [OAuth Configuration](#oauth-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Security Best Practices](#security-best-practices)

---

## Quick Start

### 1. Local Development

**Copy the environment template:**
```bash
cp .env.example .env.local
```

**Edit `.env.local` and add your credentials:**
```
APP_ENV=development
CLIENT_ID=your_client_id_here
APP_ID=your_app_id_here
```

**Start development server:**
```bash
npm run build  # Verify build succeeds
npm run start  # Start dev server on port 8443
```

### 2. Deploy to Vercel

**Link your project:**
```bash
npm install -g vercel
vercel link
```

**Set environment variables in Vercel Dashboard** (see sections below)

**Deploy:**
```bash
vercel deploy --prod
```

---

## Required Environment Variables

### Critical Variables (App will NOT work without these)

#### `CLIENT_ID` ⚠️ REQUIRED
- **Description**: OAuth2 Client ID from Deriv API Console
- **Type**: Public (exposed to frontend)
- **Where to Get**: 
  1. Go to https://app.deriv.com/account/api-token
  2. Scroll to "OAuth Applications"
  3. Create new application or copy existing CLIENT_ID
- **Example**: `337Xtpf8o2P74cGAJejAa`
- **Security Notes**:
  - This is intentionally public
  - Restrict API access in Deriv dashboard:
    - Scope: `trade` (trading operations only)
    - Redirect URLs: Add your Vercel URLs (e.g., `https://ramzfx254.vercel.app`)

### Optional Variables

#### `APP_ID`
- **Description**: OAuth2 Application ID (for legacy Deriv API routing)
- **Type**: Public
- **Where to Get**: https://app.deriv.com/account/api-token
- **Example**: `133717`
- **Required**: Only if using legacy Deriv API

#### `GD_CLIENT_ID`
- **Description**: Google Drive OAuth2 Client ID
- **Type**: Public
- **Where to Get**: https://console.cloud.google.com/
- **Required**: Only if bot backup to Google Drive is enabled

#### `GD_APP_ID`
- **Description**: Google Drive Project ID
- **Type**: Public
- **Where to Get**: https://console.cloud.google.com/
- **Required**: Only if Google Drive integration is enabled

#### `GD_API_KEY`
- **Description**: Google Drive API Key
- **Type**: Public
- **Where to Get**: https://console.cloud.google.com/apis/credentials
- **Security**: Must restrict to Google Drive API only
- **Required**: Only if Google Drive integration is enabled

#### `APP_ENV`
- **Description**: Application environment
- **Type**: Public
- **Values**:
  - `development`: Uses staging OAuth/API endpoints
  - `staging`: Uses staging OAuth/API endpoints
  - `production`: Uses production OAuth/API endpoints
- **Default**: `development`
- **Recommended for Vercel**:
  - Production: `production`
  - Preview: `staging`
  - Development: `development`

---

## Vercel Dashboard Setup

### Step-by-Step Instructions

#### 1. Access Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project (or create new from GitHub)
3. Navigate to: **Settings** → **Environment Variables**

#### 2. Add Production Environment Variables

Click "Add new" for each variable and configure:

| Variable | Value | Environment |
|----------|-------|-------------|
| `CLIENT_ID` | Your Deriv Client ID | Production, Preview, Development |
| `APP_ID` | Your Deriv App ID (optional) | Production, Preview, Development |
| `APP_ENV` | `production` | Production |
| `APP_ENV` | `staging` | Preview |
| `APP_ENV` | `development` | Development |

**Production Deployment Variables:**

```
CLIENT_ID = 337Xtpf8o2P74cGAJejAa
APP_ID = 133717
APP_ENV = production
```

**Preview (Staging) Deployment Variables:**

```
CLIENT_ID = 337Xtpf8o2P74cGAJejAa
APP_ID = 133717
APP_ENV = staging
```

**Development Environment Variables:**

```
CLIENT_ID = 337Xtpf8o2P74cGAJejAa
APP_ID = 133717
APP_ENV = development
```

#### 3. Verify Configuration

1. In Vercel Dashboard, go to **Deployments**
2. Redeploy by clicking "..." on latest deployment and select "Redeploy"
3. Check build logs for:
   ```
   ✅ Build Configuration:
      Environment: production
      OAuth Enabled: YES
      Google Drive: NO (optional)
   ```

#### 4. Configure OAuth Redirect URLs

1. Go to https://app.deriv.com/account/api-token
2. Under "OAuth Applications", click your application
3. Add these URLs to "Authorized redirect URIs":
   - `https://ramzfx254.vercel.app`
   - `https://staging.ramzfx254.vercel.app` (if using staging)
   - `https://*.vercel.app` (for preview deployments)

---

## OAuth Configuration

### How OAuth Login Works

1. User clicks "Login" → Redirects to Deriv OAuth2 server
2. User authenticates and approves permissions
3. Redirected back to your app with authorization code
4. App exchanges code for access token (server-side)
5. Access token stored in sessionStorage
6. WebSocket connects using authenticated token

### Expected OAuth URLs

**Production:**
- OAuth Server: `https://auth.deriv.com/oauth2/`
- API: `https://api.derivws.com/trading/v1/`

**Staging:**
- OAuth Server: `https://staging-auth.deriv.com/oauth2/`
- API: `https://staging-api.derivws.com/trading/v1/`

These are configured in [brand.config.json](brand.config.json) based on `APP_ENV`.

### Testing OAuth Flow

**Local Development:**
```bash
npm run start  # Starts on https://localhost:8443
# Your app should use staging OAuth URLs
```

**Vercel Production:**
```bash
# Your app will use production OAuth URLs
# Test at: https://ramzfx254.vercel.app
```

---

## Troubleshooting

### Error: `invalid_client`

**Symptoms:**
- Login fails immediately
- Error message: "CLIENT_ID is not configured"

**Solutions:**
1. Verify `CLIENT_ID` is set in Vercel Environment Variables
2. Check Deriv dashboard: Settings → Account → API Tokens → OAuth Applications
3. Verify CLIENT_ID matches exactly (copy-paste to avoid typos)
4. Try clearing browser cache: `Ctrl+Shift+Delete` (or `Cmd+Shift+Delete`)

### Error: `redirect_uri_mismatch`

**Symptoms:**
- OAuth server rejects redirect
- Error: "redirect_uri does not match"

**Solutions:**
1. In Vercel, copy your deployment URL (e.g., `ramzfx254.vercel.app`)
2. Go to https://app.deriv.com/account/api-token
3. Edit your OAuth application
4. Add your Vercel URL to "Authorized redirect URIs"
5. Format: `https://ramzfx254.vercel.app` (no trailing slash)

### Error: `Missing required environment variables`

**Shows red banner on page**

**Solutions:**
1. Check which variables are missing (shown in banner)
2. Add them to Vercel Dashboard → Settings → Environment Variables
3. Redeploy: Click "..." on latest deployment → "Redeploy"
4. Wait for build to complete (~5 minutes)

### Build Fails: `CLIENT_ID is undefined`

**Symptoms:**
- Build error during rsbuild process
- Error: "CLIENT_ID is not defined"

**Solutions:**
1. Verify environment variable is in Vercel Dashboard (not `.env.local`)
2. Vercel doesn't read `.env.local` files
3. Check build logs in Vercel Dashboard → Deployments → Select deployment → Logs
4. Redeploy to trigger new build

### WebSocket Connection Error

**Symptoms:**
- Cannot execute trades
- Console error: "WebSocket connection failed"

**Solutions:**
1. Check if `APP_ENV` is correctly set (should match deployment type)
2. Verify API URLs in [brand.config.json](brand.config.json)
3. Check browser console for CORS errors
4. Verify account authentication: should see "Connected" status in header

---

## Security Best Practices

### ✅ DO

- ✅ Store `CLIENT_ID` in Vercel Environment Variables (not in `.env.local`)
- ✅ Add Vercel URLs to OAuth redirect URIs in Deriv dashboard
- ✅ Use HTTPS only (Vercel provides this automatically)
- ✅ Restrict API access scopes in Deriv dashboard to `trade` only
- ✅ Rotate credentials if they're accidentally exposed
- ✅ Keep `.env.local` in `.gitignore` (never commit credentials)
- ✅ Use different credentials for staging and production (if possible)

### ❌ DON'T

- ❌ Never commit `.env.local` or any file with credentials to Git
- ❌ Don't use weak or easily guessable CLIENT_IDs
- ❌ Don't add private API keys to frontend environment variables
- ❌ Don't share credentials in Slack, email, or unencrypted channels
- ❌ Don't set very broad OAuth scopes (use `trade` only)
- ❌ Don't hardcode credentials in source code
- ❌ Don't use credentials from production in development

### Environment Variable Visibility

| Variable | Frontend | Backend | Public | Private |
|----------|----------|---------|--------|---------|
| `CLIENT_ID` | ✅ Yes | Yes | ✅ Public | Private |
| `APP_ID` | ✅ Yes | Yes | ✅ Public | Private |
| `GD_CLIENT_ID` | ✅ Yes | Yes | ✅ Public | Private |
| `APP_ENV` | ✅ Yes | Yes | ✅ Public | N/A |

---

## Vercel Features Enabled

### Features in `vercel.json`

1. **Custom Build Command**: `npm run build`
2. **Custom Dev Command**: `npm run start`
3. **CORS Headers**: Enabled for `/api/*` routes
4. **Security Headers**:
   - `X-Content-Type-Options: nosniff` (prevent MIME type sniffing)
   - `X-Frame-Options: DENY` (prevent clickjacking)
   - `X-XSS-Protection: 1; mode=block` (XSS protection)
   - `Referrer-Policy: strict-origin-when-cross-origin` (referrer security)
   - `Permissions-Policy: geolocation=(), microphone=(), camera=()` (disable unused APIs)

4. **SPA Routing**: All non-API routes redirect to `/index.html`

---

## Environment Variables Reference

```bash
# .env.example - Template for all available variables
# See this file for descriptions and security notes

# .env.local - Local development (NOT committed to Git)
# Replace with your actual credentials

# Vercel Dashboard → Settings → Environment Variables
# Set production credentials here
```

---

## Next Steps

1. ✅ Set up local development with `.env.local`
2. ✅ Test build: `npm run build`
3. ✅ Test OAuth locally: `npm run start`
4. ✅ Add variables to Vercel Dashboard
5. ✅ Configure OAuth redirect URLs in Deriv dashboard
6. ✅ Deploy to Vercel: `vercel deploy --prod`
7. ✅ Test login on production URL

---

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Deriv API**: https://app.deriv.com/account/api-token
- **OAuth 2.0 PKCE**: https://datatracker.ietf.org/doc/html/rfc7636
- **Environment Configuration**: See `.env.example`

---

## File References

- [.env.example](.env.example) - All available environment variables with descriptions
- [.env.local](.env.local) - Local development configuration (local only)
- [vercel.json](vercel.json) - Vercel deployment configuration
- [rsbuild.config.ts](rsbuild.config.ts) - Build system environment setup
- [src/utils/env-validation.ts](src/utils/env-validation.ts) - Environment validation utility
- [src/components/env-error/](src/components/env-error/) - Error component for missing variables

---

Last Updated: May 16, 2026
