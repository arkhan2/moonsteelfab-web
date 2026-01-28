# Moon Steel Fabricators

Production-ready industrial company website + product system.

## Tech

- **Web**: Next.js (React) + Tailwind CSS deployed to **Cloudflare Pages**
- **API**: Cloudflare **Workers** API (Hono) + **D1** SQL database

## Monorepo layout

- `web/` Next.js site (public pages + secure admin panel UI)
- `api/` Cloudflare Worker (auth + product CRUD APIs + D1 schema/migrations)
- `migrations/` D1 SQL migrations (source of truth)

## Prereqs

- Node.js 18+ (or 20+)
- Cloudflare account
- `wrangler` CLI (installed via workspace `devDependencies`)

## Quick start (local)

Install deps:

```bash
npm install
```

Create local D1 + apply migrations:

```bash
npm run db:local:create
npm run db:local:migrate
```

Run API:

```bash
npm run api:dev
```

Run web:

```bash
npm run web:dev
```

## Deploy

### 1) Create a D1 database (production)

```bash
npm run db:prod:create
```

Update `api/wrangler.toml` with the returned D1 binding IDs, then run:

```bash
npm run db:prod:migrate
```

### 2) Set API secrets

Set admin bootstrap password + session secret (never commit these):

```bash
npm run api:secret -- SESSION_SECRET
npm run api:secret -- ADMIN_BOOTSTRAP_PASSWORD
```

### 3) Deploy API Worker

```bash
npm run api:deploy
```

### 4) Configure web env + deploy to Pages

In Cloudflare Pages project settings for `web/`, set:

- `NEXT_PUBLIC_API_BASE_URL` = your Worker URL (e.g. `https://moonsteelfab-api.<your-subdomain>.workers.dev`)

Then deploy:

```bash
npm run web:deploy
```

## Admin access

1) Visit `/admin/login`
2) Log in with `admin` and your `ADMIN_BOOTSTRAP_PASSWORD`
3) Create additional users in the DB (optional) or extend the admin UI

