# Fix Cloudflare Pages Deployment

## Issue
Build succeeds but deployment fails with: "Missing entry-point to Worker script"

## Solution
Cloudflare Pages is trying to run a deploy command (`npx wrangler deploy`) which is for Workers, not Pages.

## Steps to Fix

1. **Go to Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**

2. **Go to Builds & deployments** section

3. **Check/Update these settings:**
   - **Build command**: `npm run build`
   - **Build output directory**: `web/.vercel/output/static`
   - **Root directory**: (leave empty or set to `/`)
   - **Deploy command**: **DELETE THIS** or leave it **completely empty**

4. **Save changes**

5. **Redeploy**:
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest build
   - Or push a new commit to trigger auto-deploy

## Why This Works

- **Build command** builds your Next.js app for Cloudflare Pages
- **Build output directory** tells Pages where to find the built files
- **Deploy command** should be empty - Pages automatically deploys the build output after a successful build

The error happens because `npx wrangler deploy` is for Cloudflare Workers, not Pages. Pages handles deployment automatically.
