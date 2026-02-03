# Quick Fix: Deployment Failure

## The Problem

Deployment fails with: `Unknown internal error occurred` when trying to publish the Function.

## The Solution (2 Steps)

### Step 1: Remove Deploy Command

1. **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. **Builds & deployments** section
3. **Deploy command** field → **Clear it** (leave empty)
4. **Save**

### Step 2: Retry Deployment

1. Go to **Deployments** tab
2. Click **Retry deployment** on latest build

That's it! Pages will auto-deploy after the build succeeds.

## Why This Works

Cloudflare Pages **automatically deploys** build output. The deploy command is:
- ❌ Unnecessary
- ❌ Causes errors
- ✅ Not needed - Pages handles it

## Verify Environment Variable

Make sure `NEXT_PUBLIC_API_BASE_URL` is set:
- **Settings** → **Environment Variables**
- Variable: `NEXT_PUBLIC_API_BASE_URL`
- Value: `https://moonsteelfab-api.mynickar.workers.dev`
- Environment: Production

After removing deploy command and retrying, deployment should succeed! 🎉
