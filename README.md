# SilkPanda — Phase 1 MVP

Backend component of SkillPanda (a Swiggy for saree shops): a shop-enablement web app where each saree shop gets a branded storefront (`silkpanda.com/<shop-slug>`). Buyers browse and enquire via WhatsApp — no payments, no cross-shop search in Phase 1.

**Stack:** Next.js (App Router) · Tailwind CSS · Supabase (Postgres, Auth, Storage)

Architectural decisions are documented in [`/decisions`](./decisions/README.md).

## Quick start

### 1. Supabase (automated)

Create a [Supabase access token](https://supabase.com/dashboard/account/tokens), then from the repo root:

```powershell
$env:SUPABASE_ACCESS_TOKEN = "sbp_your_token"
npm run supabase:setup
```

This creates/links project `silkpanda-mvp`, applies migrations, writes `.env.local`, and seeds a demo shop owner + `demo-sarees` catalog. Details: [`supabase/SETUP.md`](./supabase/SETUP.md).

**Manual alternative:** run [`supabase/schema.sql`](./supabase/schema.sql) in the SQL Editor, copy keys into `.env.local`, then `npm run supabase:bootstrap`.

### 2. Environment

### 3. Run locally

```bash
npm install
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Shop login: [http://localhost:3000/login](http://localhost:3000/login)
- Storefront: [http://localhost:3000/demo-sarees](http://localhost:3000/demo-sarees)

### 4. Deploy

Push to GitHub and connect the repo to [Vercel](https://vercel.com). Set the same Supabase env vars in Vercel project settings.

## Project structure

```
app/
  (admin)/login          Shop owner auth
  (admin)/dashboard      Stats + product CRUD
  [shopSlug]/            Public storefront + product detail
components/              ProductCard, EnquireButton, ImageUpload, …
lib/supabase/            Browser + server Supabase clients
supabase/schema.sql      Database schema + RLS policies
decisions/               ADR-0001 … ADR-0007
```

## Phase 1 scope (in / out)

| In scope | Out of scope |
|----------|--------------|
| Per-shop catalog URLs | Cross-shop discovery |
| Product CRUD + images | Payments / checkout |
| Fabric / occasion / price filters | Buyer accounts |
| WhatsApp enquire + click analytics | Native app |
| Shop owner dashboard | Self-serve shop signup |

See [`decisions/`](./decisions/README.md) for ADRs that define Phase 1 scope and stack choices.
