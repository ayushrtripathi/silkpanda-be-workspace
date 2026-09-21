# ADR-0006: Phase 1 feature scope and build sequence

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Without a locked scope, AI-assisted builds drift toward full marketplaces (search, cart, buyer accounts). Phase 1 must validate shop-side value: catalog live, enquiries received.

## Decision

**In scope**

- Per-shop storefront: `/<shop-slug>` and `/<shop-slug>/<product-id>`
- Shop admin: login, product CRUD, image upload, basic dashboard (views/enquiries)
- Filters: fabric, occasion, max price (within one shop)
- WhatsApp enquire + anonymous `events` (view/inquiry)
- Manual shop onboarding (no self-serve signup)

**Out of scope**

- Cross-shop discovery/search (see ADR-0010 for separate prototype)
- Buyer accounts, reviews, payments (ADR-0004)
- Native app (ADR-0009)
- Self-serve shop registration

**Build sequence:** stack + schema → admin panel → storefront → enquire + analytics → polish → 2–3 shop soft launch.

## Alternatives Considered

- **Buyer accounts early:** Adds auth UX without proving shop retention.
- **Marketplace homepage:** Conflicts with SaaS-first (ADR-0001).

## Consequences

- Reserved URL slugs for admin routes (`login`, `dashboard`, …)
- RLS: public read catalog; owners mutate own rows only
- Implementation detail: see `supabase/migrations/` and Phase 1 build plan
