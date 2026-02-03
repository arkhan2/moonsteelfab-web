# Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare account** (logged in via `wrangler login`)
2. **GitHub repository** (recommended for automatic deployments)
3. **API Worker deployed** (see `README.md`)

## Recommended: GitHub Integration (Automatic Deployments)

This is the easiest method and works on Windows without WSL.

### 1. Push your code to GitHub

```powershell
cd C:\Users\msf\moonsteelfab-web
git add .
git commit -m "Configure Cloudflare Pages deployment"
git push origin main
```

### 2. Connect GitHub to Cloudflare Pages

1. Go to **Cloudflare Dashboard** → **Pages** → **Create a project**
2. Select **Connect to Git**
3. Choose your repository: `arkhan2/moonsteelfab-web`
4. Configure build settings:
   - **Project name**: `moonsteelfab-web`
   - **Production branch**: `main`
   - **Framework preset**: `None` (custom)
   - **Build command**: `npm run build`
   - **Build output directory**: `web/.vercel/output/static`
   - **Root directory**: (leave empty - use root of repo)
   - **Deploy command**: ⚠️ **MUST BE EMPTY** - Delete any value here! Pages auto-deploys after build

### 3. Set Environment Variables

In the Pages project settings → **Environment Variables**:

- **Production:**
  - `NEXT_PUBLIC_API_BASE_URL` = `https://moonsteelfab-api.mynickar.workers.dev`

- **Preview:** (optional, same as production)

### 4. Deploy

Cloudflare will automatically:
1. Build your Next.js app using `@cloudflare/next-on-pages` (runs on Linux)
2. Deploy to `https://moonsteelfab-web.pages.dev`
3. Auto-deploy on every push to `main`

## Alternative: Manual CLI Deploy (Requires WSL/Linux)

If you have **WSL** or a **Linux machine**, you can deploy manually:

### 1. Build for Cloudflare Pages

```bash
cd web
npm install
npm run build-pages
```

### 2. Deploy

```bash
npx wrangler pages deploy .vercel/output/static --project-name=moonsteelfab-web
```

**First time only:** You'll be prompted to create a new Pages project.

### 3. Set Environment Variables

Same as GitHub integration method above.

## Verify Deployment

After deployment, visit:
- **Production URL**: `https://moonsteelfab-web.pages.dev` (or your custom domain)

Test:
- Homepage: `https://moonsteelfab-web.pages.dev`
- Products: `https://moonsteelfab-web.pages.dev/products`
- Admin: `https://moonsteelfab-web.pages.dev/admin/login`

## Troubleshooting

### Build fails on Cloudflare Pages

- Check build logs in **Cloudflare Dashboard** → **Pages** → **Deployments**
- Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Verify `package.json` has all dependencies listed

### API calls fail

- Verify the API Worker URL is correct: `https://moonsteelfab-api.mynickar.workers.dev`
- Check CORS settings in `api/src/index.ts`
- Ensure API Worker is deployed and healthy (`/health` endpoint)

### Static assets not loading

- Check `next.config.ts` is correct
- Verify build output directory matches Pages config: `web/.vercel/output/static`

### Windows build issues

- **Solution**: Use GitHub integration (builds on Cloudflare's Linux servers)
- **Alternative**: Use WSL (Windows Subsystem for Linux) to run `npm run build-pages` locally

## Custom Domain (Optional)

1. Go to **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Custom domains**
2. Add your domain (e.g., `moonsteelfab.com`)
3. Follow DNS setup instructions
