# Environment Variables for Cloudflare Pages

## Required Environment Variables

Set these in **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings** → **Environment Variables**

### Production Environment

**Variable Name:** `NEXT_PUBLIC_API_BASE_URL`  
**Value:** `https://moonsteelfab-api.mynickar.workers.dev`  
**Description:** The base URL of your Cloudflare Workers API. The web app uses this to make API calls.

### Preview Environment (Optional - Same as Production)

**Variable Name:** `NEXT_PUBLIC_API_BASE_URL`  
**Value:** `https://moonsteelfab-api.mynickar.workers.dev`  
**Description:** Same as production - use the same API URL for preview deployments.

---

## Variables NOT Needed in Pages

These should **NOT** be set in Cloudflare Pages:

- ❌ `ADMIN_BOOTSTRAP_PASSWORD` - This is only for the API Worker, not the web app
- ❌ `SESSION_SECRET` - This is only for the API Worker, not the web app
- ❌ `CLOUDFLARE_API_TOKEN` - Only needed if using deploy command (which we recommend removing)

---

## How to Set Variables

1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. Scroll to: **Environment Variables** section
3. Click: **Add variable** (or edit existing)
4. Set:
   - **Variable name:** `NEXT_PUBLIC_API_BASE_URL`
   - **Value:** `https://moonsteelfab-api.mynickar.workers.dev`
   - **Environment:** Select **Production** (and **Preview** if you want)
5. **Save**

---

## After Setting Variables

**Important:** After adding/updating environment variables, you need to **redeploy**:

1. Go to: **Deployments** tab
2. Click: **Retry deployment** on the latest build
3. Or: Push a new commit to trigger a new build

Environment variables are only available to new deployments, not existing ones.

---

## Verify It's Working

After redeploying with the environment variable set:

1. Visit: `https://moonsteelfab-web.pages.dev`
2. Check browser console (F12) for any API errors
3. Try visiting: `/products` - should load products from API
4. Try: `/admin/login` - should connect to API for authentication

If you see API connection errors, verify:
- ✅ `NEXT_PUBLIC_API_BASE_URL` is set correctly
- ✅ API Worker is deployed and accessible: `https://moonsteelfab-api.mynickar.workers.dev/health`
- ✅ CORS is configured in API (already done in `api/src/index.ts`)
