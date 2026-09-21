# Supabase setup (cloud)

## One-command setup (recommended)

From the repo root, after you have a Supabase [access token](https://supabase.com/dashboard/account/tokens):

```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_your_token_here"
npm run supabase:setup
```

This script:

1. Creates project `silkpanda-mvp` in `ap-south-1` (or reuses it if it exists)
2. Links the repo and runs `supabase db push` (migrations in `supabase/migrations/`)
3. Writes `.env.local` with URL, anon key, and service role key
4. Runs `npm run supabase:bootstrap` (demo owner, shop `demo-sarees`, sample products)

Then start the app:

```bash
npm run dev
```

## Manual steps

1. `npx supabase login`
2. `npm run supabase:setup`
3. Confirm **Authentication → Providers → Email** is enabled (default on new projects)

## Commands

| Command | Purpose |
|---------|---------|
| `npm run supabase:setup` | Create/link cloud project + migrate + `.env.local` |
| `npm run supabase:push` | Apply new migrations to linked project |
| `npm run supabase:bootstrap` | Re-run demo user/shop/products (needs service role in env) |

## Schema source of truth

- Migrations: `supabase/migrations/`
- `supabase/schema.sql` is kept in sync for copy/paste into the SQL Editor if you prefer the dashboard

## Local Supabase (optional)

Requires Docker Desktop:

```bash
npx supabase start
npx supabase db reset
```

Copy keys from `npx supabase status` into `.env.local`.
