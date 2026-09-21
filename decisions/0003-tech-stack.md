# ADR-0003: Tech stack: Next.js, Supabase backend, no native app

**Status:** Accepted (amended)  
**Date:** 2026-03-21

## Context

Phase 1 needs a mobile-friendly web experience, SEO-friendly shop URLs, auth for shop owners, Postgres for catalog data, and image storage — with minimal ops overhead for a solo builder.

## Decision

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router), Tailwind CSS |
| Backend | Supabase (Postgres, Auth, Storage, RLS) |
| Hosting | Vercel (app), Supabase cloud (data) |
| Messaging | `wa.me` deep links (no custom chat infra) |

**Amendment (2026-03-21):** Supabase **Free tier** for early weeks; plan **Pro (~$25/mo)** before real photo volume at soft launch.

Client keys use **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** with `@supabase/ssr` helpers under `utils/supabase/`.

## Alternatives Considered

- **Native mobile app:** Deferred (ADR-0009).
- **Custom Node API + RDS:** Slower to ship; more security/ops surface.
- **Firebase:** Weaker fit for relational catalog + SQL analytics.

## Consequences

- Single TypeScript repo; RLS is the primary authorization layer
- SSR storefronts for SEO and shareable shop links
- Vendor coupling acceptable for MVP velocity
