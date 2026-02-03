# Update API Token in Cloudflare Pages

## ⚠️ SECURITY WARNING
Your API token was exposed in chat. **Rotate it after use**:
1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Find your token → **Revoke** it
3. Create a new one with proper permissions

## Current Token Status
✅ Token is **valid and active**
- Token ID: `2e3045f4502fbb24971dc5d9e1e8b8cb`
- Status: Active

## Next Steps

### 1. Verify Token Has Pages Permissions

Go to: https://dash.cloudflare.com/profile/api-tokens

Find your token and check if it has:
- **Account** → **Cloudflare Pages** → **Edit** ✅

If not, you need to create a new token with these permissions.

### 2. Update Token in Cloudflare Pages

1. Go to: **Cloudflare Dashboard** → **Pages** → `moonsteelfab-web` → **Settings**
2. Go to: **Environment Variables**
3. Find or create: `CLOUDFLARE_API_TOKEN`
4. Set value to: `8qPxbIo8e2QVDK_KzHlXW6y6hppRlmnHwIUOrO-P`
5. **Save**

### 3. Test Deployment

After updating, retry the deployment. The deploy command should work:
```
npx wrangler pages deploy web/.vercel/output/static --project-name=moonsteelfab-web
```

## Better Solution: Remove Deploy Command

**Even better:** Remove the deploy command entirely and let Pages auto-deploy:
1. Go to: **Pages** → `moonsteelfab-web` → **Settings** → **Builds & deployments**
2. **Delete** the deploy command (leave empty)
3. **Save**

Pages will automatically deploy after successful build - no token needed!
