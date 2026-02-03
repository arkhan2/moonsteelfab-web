# Check Environment Variable and Hardcoded URLs

## Current Status

### ✅ Code Analysis

**Environment Variable Usage:**
- **File:** `web/src/lib/env.ts`
- **Code:** `process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "http://127.0.0.1:8787"`
- **Status:** ✅ Correctly uses env var with fallback
- **Hardcoded:** ❌ Only fallback is hardcoded (expected behavior)

**Files Checked:**
- ✅ No hardcoded API URLs in source code
- ✅ Only fallback `http://127.0.0.1:8787` exists (this is correct)
- ✅ Environment variable is properly referenced

### ⚠️ Build Warning

**Warning in Build Logs:**
```
WARN! Build not running on Vercel. System environment variables will not be available.
```

**What This Means:**
- This is a warning from Vercel CLI (used by `@cloudflare/next-on-pages`)
- It says "System environment variables" won't be available
- **BUT:** Cloudflare Pages should still inject environment variables into the build environment
- The warning might be misleading - Cloudflare's env vars should still work

## How to Verify

### Step 1: Check Cloudflare Pages Settings

1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. Scroll to: **Environment Variables**
3. Verify:
   - ✅ Variable: `NEXT_PUBLIC_API_BASE_URL`
   - ✅ Value: `https://moonsteelfab-api.mynickar.workers.dev`
   - ✅ Environment: **Production** (and **Preview** if needed)

### Step 2: Check Built JavaScript Bundle

After deployment, check what URL was baked into the bundle:

**Option A: Browser Console**
1. Visit: `https://moonsteelfab-web.pages.dev` (or your preview URL)
2. Open browser console (F12)
3. Go to **Sources** tab
4. Search for: `127.0.0.1` or `moonsteelfab-api`
5. **Expected:** Should find `moonsteelfab-api.mynickar.workers.dev` (NOT `127.0.0.1`)

**Option B: Network Tab**
1. Visit: `https://moonsteelfab-web.pages.dev/admin/login`
2. Open browser console (F12) → **Network** tab
3. Try to login
4. Check API request URL:
   - ✅ Should be: `https://moonsteelfab-api.mynickar.workers.dev/auth/login`
   - ❌ Should NOT be: `http://127.0.0.1:8787/auth/login`

### Step 3: Add Build-Time Logging

To verify env var is available during build, we can add logging:

**Temporary Build Script:**
```bash
# Add to package.json build script temporarily
"build": "cd web && node -e \"console.log('ENV VAR:', process.env.NEXT_PUBLIC_API_BASE_URL)\" && npm install && npm run build-pages"
```

This will print the env var value in build logs.

## Current Deployment Status

**Latest Build (2026-02-03T08:42:40):**
- ✅ Build succeeded
- ✅ Deployment completed
- ✅ Preview URL: `https://c7e98dd9.moonsteelfab-web.pages.dev`
- ⚠️ Warning about Vercel env vars (might be misleading)

## Next Steps

1. **Test the deployed site:**
   - Visit: `https://moonsteelfab-web.pages.dev/admin/login`
   - Check browser console for API calls
   - Verify they go to the correct API URL

2. **If still using localhost:**
   - Verify env var is set in Cloudflare Pages (Step 1)
   - Trigger a new build (retry deployment)
   - The env var must be set BEFORE the build runs

3. **Add build-time verification:**
   - Add logging to build script to see env var value
   - Check build logs in Cloudflare Dashboard

## Summary

- ✅ **Code is correct** - no hardcoded URLs (except fallback)
- ✅ **Environment variable is properly referenced**
- ⚠️ **Build warning exists** but might be misleading
- 🔍 **Need to verify** what URL is actually baked into the bundle

The key question: **Is `NEXT_PUBLIC_API_BASE_URL` available during the Cloudflare Pages build?**

If the deployed site still uses `127.0.0.1:8787`, it means the env var wasn't available during build, and you need to:
1. Verify it's set in Cloudflare Pages settings
2. Trigger a new build after setting it
