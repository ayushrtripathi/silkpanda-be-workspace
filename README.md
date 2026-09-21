# SilkPanda — Phase 1 MVP

Backend + web app for **SkillPanda / SilkPanda**: a shop-enablement platform where each saree shop gets a branded storefront (`silkpanda.com/<shop-slug>`). Buyers browse and enquire via WhatsApp — no payments, no cross-shop search in Phase 1.

**Stack:** Next.js (App Router) · Tailwind CSS · Supabase (Postgres, Auth, Storage)

Architectural decisions are documented in [`/decisions`](./decisions/README.md).

## Quick start

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com) (free tier).
2. In **SQL Editor**, run [`supabase/schema.sql`](./supabase/schema.sql).
3. Enable email auth under **Authentication → Providers**.
4. Create a shop owner user, then link them:

```sql
insert into shops (slug, name, whatsapp_number, location, description, owner_id)
values (
  'demo-sarees',
  'Demo Saree Palace',
  '+919876543210',
  'Chennai',
  'Handpicked sarees.',
  '<auth-user-uuid>'
);
```

### 2. Environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase URL and anon key.

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
