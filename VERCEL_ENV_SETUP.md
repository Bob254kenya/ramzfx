# RAMZFX Vercel Environment Variables - Quick Reference

## What to Add in Vercel Dashboard

**Location:** https://vercel.com/dashboard → Select Project → Settings → Environment Variables

---

## 📋 Summary: All Required Variables

| Variable | Status | For Which Environments | Example Value |
|----------|--------|------------------------|---|
| `CLIENT_ID` | 🔴 **REQUIRED** | All (prod, preview, dev) | `337Xtpf8o2P74cGAJejAa` |
| `APP_ID` | 🟡 Optional | All (if using legacy Deriv API) | `133717` |
| `APP_ENV` | 🟢 Optional (has default) | All | See section below |
| `GD_CLIENT_ID` | 🟢 Optional | All (if using Google Drive) | Your Google ID |
| `GD_APP_ID` | 🟢 Optional | All (if using Google Drive) | Your Google App ID |
| `GD_API_KEY` | 🟢 Optional | All (if using Google Drive) | Your Google API Key |

---

## 🚀 Vercel Environment Variables Setup

### For Production Deployment

In Vercel Dashboard, add these variables with environment set to **Production**:

```
CLIENT_ID          = 337Xtpf8o2P74cGAJejAa
APP_ID             = 133717
APP_ENV            = production
```

### For Preview Deployments (Staging)

In Vercel Dashboard, add these variables with environment set to **Preview**:

```
CLIENT_ID          = 337Xtpf8o2P74cGAJejAa
APP_ID             = 133717
APP_ENV            = staging
```

### For Development Environment

In Vercel Dashboard, add these variables with environment set to **Development**:

```
CLIENT_ID          = 337Xtpf8o2P74cGAJejAa
APP_ID             = 133717
APP_ENV            = development
```

---

## 📍 Where to Get These Values

### 1. `CLIENT_ID` - REQUIRED ⚠️

**Step 1:** Go to https://app.deriv.com/account/api-token

**Step 2:** Scroll to "OAuth Applications" section

**Step 3:** 
- If you have an existing app: Copy the **Client ID**
- If you don't: Click "Create New" and copy the generated Client ID

**Step 4:** Copy the Client ID (looks like: `337Xtpf8o2P74cGAJejAa`)

**Step 5:** IMPORTANT - Add OAuth Redirect URLs:
1. In the same OAuth Applications section, click your application
2. Add these URLs to "Authorized redirect URIs":
   - `https://ramzfx254.vercel.app`
   - `https://staging.ramzfx254.vercel.app` (if using staging preview)
   - `https://*.vercel.app` (optional: for all preview deployments)
3. Save changes

### 2. `APP_ID` - OPTIONAL

Same page as CLIENT_ID: https://app.deriv.com/account/api-token

Optional if using legacy Deriv API routing. Most projects don't need this.

### 3. Google Drive Variables - OPTIONAL

Only set these if bot backup to Google Drive feature is enabled:

**`GD_CLIENT_ID`, `GD_APP_ID`, `GD_API_KEY`:**
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (OAuth Application)
5. Copy credentials

---

## ✅ Step-by-Step Vercel Setup

### 1. Access Vercel Environment Variables

1. Go to https://vercel.com
2. Click "Dashboard" → Select "ramzfx254" project
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar

### 2. Add Production Variables

1. Click "Add new"
2. In the first field, enter: `CLIENT_ID`
3. In the second field, paste: `337Xtpf8o2P74cGAJejAa`
4. Under "Environments", select: **✓ Production  ✓ Preview  ✓ Development**
5. Click "Save"

Repeat for: `APP_ID`, `APP_ENV`

### 3. Set Different `APP_ENV` Per Environment

After adding `APP_ENV`, you can set different values:

1. Click the `APP_ENV` variable you just created
2. Delete it and re-add with different values for each environment:

**Add for Production:**
- Key: `APP_ENV`
- Value: `production`
- Environment: **✓ Production only**

**Add for Preview:**
- Key: `APP_ENV`
- Value: `staging`
- Environment: **✓ Preview only**

**Add for Development:**
- Key: `APP_ENV`
- Value: `development`
- Environment: **✓ Development only**

### 4. Verify and Redeploy

1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Select "Redeploy"
4. Watch build logs to verify environment variables are loaded
5. Look for message: `✅ Build Configuration: OAuth Enabled: YES`

---

## 🔒 Security Checklist

After adding environment variables:

- [ ] Verify `CLIENT_ID` is set in all three environments (prod, preview, dev)
- [ ] Added redirect URLs to Deriv dashboard OAuth settings
- [ ] URLs are HTTPS only
- [ ] `.env.local` is in `.gitignore` (never commit credentials)
- [ ] No credentials are hardcoded in source files
- [ ] Google Drive credentials are restricted to Google Drive API only
- [ ] Tested login on at least production URL

---

## 🧪 How to Test

### Test Production OAuth Login

1. Deploy to Vercel: `vercel deploy --prod`
2. Navigate to: `https://ramzfx254.vercel.app`
3. Click "Login"
4. Should redirect to Deriv OAuth server
5. Login and approve permissions
6. Should return to your app with authenticated session

### Test Build Logs

1. In Vercel Dashboard → Deployments
2. Click on a deployment
3. Click "Logs" → "Build"
4. Look for:
   ```
   ✅ Build Configuration:
      Environment: production
      OAuth Enabled: YES
      Google Drive: NO (optional)
   ```

### View Runtime Errors

1. In Vercel Dashboard → Deployments
2. Click on a deployment
3. Click "Logs" → "Runtime"
4. Check for missing variable warnings

---

## ⚠️ Common Issues

### Issue: OAuth Shows "invalid_client"

**Cause:** CLIENT_ID not set or incorrect

**Fix:** 
1. Verify CLIENT_ID is in Vercel Environment Variables
2. Verify it matches Deriv dashboard exactly
3. Redeploy: Click "..." → "Redeploy"

### Issue: OAuth Shows "redirect_uri_mismatch"

**Cause:** Your Vercel URL is not in OAuth redirect URIs

**Fix:**
1. Get your Vercel URL (e.g., `https://ramzfx254.vercel.app`)
2. Go to https://app.deriv.com/account/api-token
3. Edit OAuth Application → Add URL to "Authorized redirect URIs"
4. Try login again

### Issue: Build Fails - "Cannot read property of undefined"

**Cause:** Environment variable not set during build

**Fix:**
1. Add variable to Vercel Environment Variables
2. Redeploy by clicking "..." → "Redeploy"
3. Check build logs for errors

### Issue: App Shows "Configuration Error" Banner

**Cause:** Missing required environment variables

**Fix:**
1. Read the error message shown on page
2. Add missing variables to Vercel Dashboard
3. Redeploy

---

## 📚 Related Files

- **Full Setup Guide**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- **Environment Template**: [.env.example](.env.example)
- **Build Config**: [rsbuild.config.ts](rsbuild.config.ts)
- **Environment Validation**: [src/utils/env-validation.ts](src/utils/env-validation.ts)

---

## 📝 Copy-Paste Template

Use this to quickly fill in Vercel Dashboard:

```
Environment Variables to Add:

Variable Name: CLIENT_ID
Variable Value: [YOUR_CLIENT_ID_FROM_DERIV]
Environments: ✓ Production ✓ Preview ✓ Development

Variable Name: APP_ID  
Variable Value: [YOUR_APP_ID_FROM_DERIV]
Environments: ✓ Production ✓ Preview ✓ Development

Variable Name: APP_ENV
Variable Value: production
Environments: ✓ Production only

Variable Name: APP_ENV
Variable Value: staging
Environments: ✓ Preview only

Variable Name: APP_ENV
Variable Value: development
Environments: ✓ Development only
```

---

## ✨ Done!

After completing these steps:
1. ✅ Project builds successfully with environment variables
2. ✅ OAuth login works on production and preview
3. ✅ Different API endpoints for prod/staging/dev environments
4. ✅ Clear error messages if variables are missing
5. ✅ Secure: No credentials in git or source code

**Next:** Test the OAuth flow on your production deployment URL.

---

**Last Updated:** May 16, 2026
**Project:** RAMZFX Trading Bot
**Framework:** Rsbuild + React
**Deployment:** Vercel
