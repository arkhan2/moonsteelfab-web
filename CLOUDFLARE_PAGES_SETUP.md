# Cloudflare Pages Setup - Step by Step

## ⚠️ IMPORTANT: Remove Deploy Command

The build is **succeeding**, but deployment fails because Cloudflare Pages has a **deploy command** configured that shouldn't be there.

## Fix Steps (Do This in Cloudflare Dashboard)

### 1. Go to Cloudflare Dashboard
- Visit: https://dash.cloudflare.com
- Navigate to: **Pages** → `moonsteelfab-web` → **Settings**

### 2. Go to "Builds & deployments" Section

### 3. Update These Settings:

**✅ Build command:**
```
npm run build
```

**✅ Build output directory:**
```
web/.vercel/output/static
```

**✅ Root directory:**
```
(leave empty or set to `/`)
```

**✅ Deploy command:**
```
npx wrangler pages deploy web/.vercel/output/static --project-name=moonsteelfab-web
```

**Note:** If deploy command is required, use `wrangler pages deploy` (not `wrangler deploy`). This deploys the built static files to Cloudflare Pages.

### 4. Environment Variables

Go to **Environment Variables** section and add:

**Production:**
- Variable: `NEXT_PUBLIC_API_BASE_URL`
- Value: `https://moonsteelfab-api.mynickar.workers.dev`

### 5. Save Changes

Click **Save** at the bottom of the settings page.

### 6. Redeploy

- Go to **Deployments** tab
- Find the latest build (the one that failed)
- Click **Retry deployment** (or wait for next git push to auto-deploy)

## Expected Result

After removing the deploy command:
1. ✅ Build runs: `npm run build` → builds Next.js app
2. ✅ Build succeeds: Creates output in `web/.vercel/output/static`
3. ✅ Pages auto-deploys: Automatically deploys the build output
4. ✅ Site goes live: `https://moonsteelfab-web.pages.dev`

## Troubleshooting

**If deployment still fails:**
- Double-check that "Deploy command" field is **completely empty**
- Verify "Build output directory" is exactly: `web/.vercel/output/static`
- Check build logs to ensure build succeeded before deployment step

**Build succeeds but site doesn't work:**
- Verify `NEXT_PUBLIC_API_BASE_URL` environment variable is set correctly
- Check that API Worker is deployed and accessible
- Test API endpoint: `https://moonsteelfab-api.mynickar.workers.dev/health`
