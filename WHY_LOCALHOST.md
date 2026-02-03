# Why You're Still Seeing localhost (127.0.0.1:8787)

## The Root Cause

**Next.js bakes `NEXT_PUBLIC_*` environment variables into the JavaScript bundle at BUILD TIME, not runtime.**

This means:
- ❌ Setting the env var AFTER a build = doesn't help (already baked in)
- ✅ Setting the env var BEFORE a build = gets included in bundle
- ❌ The env var exists in deployment config, but wasn't available during `next build`

## What's Happening

1. Your code has: `process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8787"`
2. During `next build`, Next.js replaces `process.env.NEXT_PUBLIC_API_BASE_URL` with the actual value
3. If the env var wasn't set during build → it uses the fallback `"http://127.0.0.1:8787"`
4. This value gets hardcoded into the JavaScript bundle
5. Even if you set the env var later, the bundle still has the old value

## The Fix

You need a **NEW BUILD** that happens **AFTER** the env var is set:

### Step 1: Verify Env Var is Set (Already Done ✅)
- Production: ✅ Set
- Preview: ✅ Set

### Step 2: Trigger a New Build

**Option A: Retry Latest Deployment**
1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Deployments**
2. Find the latest deployment
3. Click: **Retry deployment**
   - This will rebuild with the env var available

**Option B: Push New Commit**
```powershell
git commit --allow-empty -m "Rebuild with API URL env var"
git push origin main
```

**Option C: Manual Build Trigger**
- Go to **Deployments** → **Create deployment** → Upload files

### Step 3: Verify Build Used Env Var

After new deployment completes:
1. Visit: `https://moonsteelfab-web.pages.dev`
2. Open browser console (F12) → **Sources** tab
3. Search for: `127.0.0.1` or `moonsteelfab-api`
4. Should see: `https://moonsteelfab-api.mynickar.workers.dev` (not localhost)

## How to Verify Env Var Was Available During Build

Check build logs in Cloudflare Dashboard:
1. Go to: **Deployments** → Click on deployment → **View build logs**
2. Look for: Environment variables being loaded
3. Should see: `NEXT_PUBLIC_API_BASE_URL` in the build environment

## Why This Happens

Next.js replaces `process.env.NEXT_PUBLIC_*` at build time for performance:
- Client-side code can't access `process.env` at runtime
- So Next.js inlines the values into the JavaScript bundle
- This means the env var MUST be available when `next build` runs

## Quick Test

After triggering a new build, check the built JavaScript:
- Search for `127.0.0.1` → Should NOT find it
- Search for `moonsteelfab-api.mynickar.workers.dev` → Should find it

This confirms the env var was baked into the build correctly.
