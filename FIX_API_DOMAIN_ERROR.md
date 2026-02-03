# Fix: API Calls Going to Pages Domain Instead of Worker API

## The Problem

API calls are going to `https://head.moonsteelfab-web.pages.dev/auth/login` instead of `https://moonsteelfab-api.mynickar.workers.dev/auth/login`.

**Error:** `POST https://head.moonsteelfab-web.pages.dev/auth/login 404 (Not Found)`

## Root Cause

The `NEXT_PUBLIC_API_BASE_URL` environment variable is either:
1. ❌ Not set in Cloudflare Pages
2. ❌ Set to an empty string
3. ❌ Set incorrectly
4. ❌ Not available during build (so fallback is used, but somehow creating relative URLs)

## Solution

### Step 1: Verify Environment Variable in Cloudflare Pages

1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. Scroll to: **Environment Variables** section
3. Check if `NEXT_PUBLIC_API_BASE_URL` exists:
   - ✅ **Should be:** `https://moonsteelfab-api.mynickar.workers.dev`
   - ❌ **Should NOT be:** Empty, blank, or the Pages domain

### Step 2: Set/Update Environment Variable

If missing or incorrect:

1. Click: **Add variable** (or **Edit** if exists)
2. Set:
   - **Variable name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://moonsteelfab-api.mynickar.workers.dev`
   - **Environment:** ✅ **Production** (and ✅ **Preview** if needed)
3. **Important:** Make sure there are NO spaces, NO trailing slashes
4. **Save**

### Step 3: Trigger New Build

**CRITICAL:** Environment variables are only available to NEW builds. You must rebuild:

**Option A: Retry Deployment**
1. Go to: **Deployments** tab
2. Find latest deployment
3. Click: **Retry deployment**

**Option B: Push New Commit**
```powershell
git commit --allow-empty -m "Rebuild with API URL env var"
git push origin main
```

### Step 4: Verify After Build

After new deployment completes:

1. Visit: `https://moonsteelfab-web.pages.dev/admin/login`
2. Open browser console (F12)
3. Check for warnings:
   - ✅ Should NOT see: `⚠️ NEXT_PUBLIC_API_BASE_URL not set or invalid`
   - ✅ Should NOT see: `⚠️ Using localhost fallback`
4. Try to login
5. Check **Network** tab:
   - ✅ API call should go to: `https://moonsteelfab-api.mynickar.workers.dev/auth/login`
   - ❌ Should NOT go to: `https://head.moonsteelfab-web.pages.dev/auth/login`

## Code Changes Made

I've updated the code to:
1. ✅ Better validate the environment variable (must start with `http://` or `https://`)
2. ✅ Handle empty strings properly
3. ✅ Show console warnings if using fallback
4. ✅ Add debug logging for API calls

## Why This Happens

Next.js replaces `NEXT_PUBLIC_*` variables at **build time**, not runtime:
- If env var is not set during build → uses fallback `http://127.0.0.1:8787`
- If env var is empty string → should use fallback, but might create relative URLs
- If env var is set correctly → uses the Worker API URL

## Quick Test

After setting the env var and rebuilding:

1. Open browser console
2. Type: `window.location.origin`
3. Should see: `https://moonsteelfab-web.pages.dev` (or your Pages domain)
4. API calls should go to: `https://moonsteelfab-api.mynickar.workers.dev` (NOT the Pages domain)

If API calls still go to Pages domain, the env var wasn't available during build.
