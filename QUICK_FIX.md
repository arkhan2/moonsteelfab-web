# ⚡ QUICK FIX - Update Deploy Command

## The Problem
Your deploy command is currently: `npx wrangler deploy` (for Workers)
It should be: `npx wrangler pages deploy web/.vercel/output/static --project-name=moonsteelfab-web` (for Pages)

## Fix Right Now

1. **Go to:** https://dash.cloudflare.com → **Pages** → `moonsteelfab-web` → **Settings**

2. **Scroll to:** "Builds & deployments" section

3. **Find:** "Deploy command" field

4. **Replace** the current value with:
   ```
   npx wrangler pages deploy web/.vercel/output/static --project-name=moonsteelfab-web
   ```

5. **Save** changes

6. **Redeploy:**
   - Go to **Deployments** tab
   - Click **Retry deployment** on the latest build

## Why This Works

- `wrangler deploy` = Deploys Cloudflare Workers (wrong for Pages)
- `wrangler pages deploy` = Deploys to Cloudflare Pages (correct!)

The build is succeeding perfectly - you just need the correct deploy command.
