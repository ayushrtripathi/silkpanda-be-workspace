# ADR-0003: Supabase as Backend Platform

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Phase 1 needs Postgres, authentication, file storage, and row-level security without operating custom backend infrastructure.

## Decision

Use **Supabase** for:

- **Postgres** — shops, products, events tables
- **Auth** — shop owner login (email/password)
- **Storage** — product images (`product-images` bucket)
- **RLS** — enforce shop owners only mutate their own data; public read for storefront

**Hosting plan:** Free tier for weeks 1–6; upgrade to Pro (~$25/mo) before real photo volume in week 7+.

## Alternatives Considered

- **Custom Node API + managed Postgres:** More ops overhead for a solo/small team MVP.
- **Firebase:** Less natural fit for relational catalog + analytics queries.

## Consequences

- Schema and RLS policies are the primary security boundary — must be reviewed manually
- Vendor coupling acceptable for MVP velocity
- Storage/bandwidth limits require monitoring before soft launch
