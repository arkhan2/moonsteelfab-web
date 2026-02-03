# Fix Deployment Failure

## Current Issue

The deployment is failing with:
```
✘ [ERROR] Deployment failed!
Failed to publish your Function. Got error: Unknown internal error occurred.
```

**Root Cause:** The deploy command is trying to manually deploy, but Cloudflare Pages should auto-deploy after a successful build.

## Solution: Remove Deploy Command

### Step 1: Remove Deploy Command in Cloudflare Dashboard

1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. Scroll to: **Builds & deployments** section
3. Find: **Deploy command** field
4. **Clear it completely** (leave it empty)
5. **Save** changes

### Step 2: Verify Build Output Directory

Make sure **Build output directory** is set to:
```
web/.vercel/output/static
```

### Step 3: Trigger New Deployment

After removing the deploy command:

**Option A: Retry Latest Build**
- Go to **Deployments** tab
- Click **Retry deployment** on the latest build

**Option B: Push New Commit**
```powershell
git commit --allow-empty -m "Remove deploy command, use auto-deploy"
git push origin main
```

## Why This Works

Cloudflare Pages automatically deploys the build output after a successful build. The deploy command (`npx wrangler pages deploy`) is:
- ❌ Unnecessary (Pages does this automatically)
- ❌ Can fail with internal errors
- ❌ Requires API token permissions
- ✅ Not needed - Pages handles deployment automatically

## Environment Variables

**Important:** Make sure `NEXT_PUBLIC_API_BASE_URL` is set in Pages settings:

1. Go to: **Settings** → **Environment Variables**
2. Verify:
   - **Variable:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://moonsteelfab-api.mynickar.workers.dev`
   - **Environment:** Production (and Preview if needed)
3. **Save**

After removing the deploy command and triggering a new build, the deployment should succeed automatically.

## Expected Result

1. ✅ Build runs: `npm run build` → builds Next.js app
2. ✅ Build succeeds: Creates output in `web/.vercel/output/static`
3. ✅ Pages auto-deploys: Automatically deploys without deploy command
4. ✅ Site goes live: `https://moonsteelfab-web.pages.dev`
5. ✅ API URL is correct: Uses `https://moonsteelfab-api.mynickar.workers.dev` (not localhost)

## If Deployment Still Fails

If removing the deploy command doesn't work:

1. **Check build logs** - Ensure build actually succeeded
2. **Verify output directory** - Should be `web/.vercel/output/static`
3. **Check function bundle size** - Should be under Cloudflare limits
4. **Try manual upload** - Use "Create deployment" → "Upload files" as a test

But in 99% of cases, removing the deploy command fixes the issue because Pages handles deployment automatically.
