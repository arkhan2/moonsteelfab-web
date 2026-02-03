# Fix API URL Connection Error

## The Problem
Your deployed site is trying to connect to `http://127.0.0.1:8787` (localhost) instead of your Cloudflare Worker API.

**Error:** `net::ERR_CONNECTION_REFUSED` to `http://127.0.0.1:8787/auth/login`

## Why This Happens
The `NEXT_PUBLIC_API_BASE_URL` environment variable is either:
1. ❌ Not set in Cloudflare Pages
2. ❌ Set but build happened before it was added
3. ❌ Set in wrong environment (Preview vs Production)

## Solution: Set Environment Variable + Redeploy

### Step 1: Set Environment Variable in Cloudflare Pages

1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. Scroll to: **Environment Variables** section
3. Click: **Add variable** (or edit if exists)
4. Set:
   - **Variable name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://moonsteelfab-api.mynickar.workers.dev`
   - **Environment:** ✅ **Production** (and ✅ **Preview** if you want)
5. **Save**

### Step 2: Redeploy (CRITICAL)

Environment variables are only available to **new builds**. You must redeploy:

**Option A: Retry Latest Build**
1. Go to: **Deployments** tab
2. Find the latest deployment
3. Click: **Retry deployment** (or **...** → **Retry deployment**)

**Option B: Trigger New Build**
```powershell
git commit --allow-empty -m "Trigger rebuild with API URL env var"
git push origin main
```

### Step 3: Verify

After redeploy completes:
1. Visit: `https://moonsteelfab-web.pages.dev/admin/login`
2. Open browser console (F12)
3. Check Network tab - API calls should go to:
   - ✅ `https://moonsteelfab-api.mynickar.workers.dev/auth/login`
   - ❌ NOT `http://127.0.0.1:8787/auth/login`

## Quick Test

After redeploying, test the API connection:
- Visit: `https://moonsteelfab-web.pages.dev/products`
- Should load products from your API (or show empty state if no products)
- Should NOT show connection errors

## Why NEXT_PUBLIC_ Prefix?

The `NEXT_PUBLIC_` prefix is required for Next.js to include the variable in the client-side bundle. Without it, the variable won't be available in the browser.

## Troubleshooting

**Still seeing localhost after redeploy?**
- Verify variable is set in **Production** environment (not just Preview)
- Check variable name is exactly: `NEXT_PUBLIC_API_BASE_URL` (case-sensitive)
- Verify value has no trailing slash: `https://moonsteelfab-api.mynickar.workers.dev`
- Check build logs to see if variable was available during build

**API calls work but get CORS errors?**
- Verify API Worker CORS is configured (already done in `api/src/index.ts`)
- Check API Worker is accessible: `https://moonsteelfab-api.mynickar.workers.dev/health`
