# Fix API Token Permissions for Cloudflare Pages

## The Problem
Your API token doesn't have permission to deploy to Cloudflare Pages. The error shows:
```
Authentication error [code: 10000]
The API Token is read from the CLOUDFLARE_API_TOKEN environment variable.
```

## Solution 1: Update API Token Permissions (Recommended)

### Step 1: Create/Update API Token
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Find your existing token (or create a new one)
3. Edit the token permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Account Settings** → **Read**
   - **Zone** → (if you have custom domains) → **Zone Settings** → **Read**

### Step 2: Update in Cloudflare Pages
1. Go to: **Pages** → `moonsteelfab-web` → **Settings** → **Environment Variables**
2. Update `CLOUDFLARE_API_TOKEN` with the new token (or remove it if using OAuth)

## Solution 2: Use OAuth Instead (Easier)

Remove the API token and let Wrangler use OAuth login:

### Step 1: Remove API Token from Pages
1. Go to: **Pages** → `moonsteelfab-web` → **Settings** → **Environment Variables**
2. **Delete** the `CLOUDFLARE_API_TOKEN` variable (if it exists)

### Step 2: Update Deploy Command
The deploy command should work without the token if you're logged in via OAuth. However, since this runs in Cloudflare's build environment, you may need to:

**Option A:** Keep using API token but with correct permissions (Solution 1)

**Option B:** Use a different approach - let Cloudflare Pages auto-deploy (no deploy command needed)

## Solution 3: Remove Deploy Command Entirely (Simplest)

Cloudflare Pages can auto-deploy after build without a deploy command:

1. Go to: **Pages** → `moonsteelfab-web` → **Settings** → **Builds & deployments**
2. **Delete** the "Deploy command" field (leave it empty)
3. Make sure "Build output directory" is set to: `web/.vercel/output/static`
4. Save and redeploy

Pages will automatically deploy the build output - no deploy command needed!

## Recommended: Solution 3

Since your build is succeeding, the simplest fix is to **remove the deploy command** and let Cloudflare Pages handle deployment automatically. This avoids API token permission issues entirely.
