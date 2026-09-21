# ADR-0005: Per-Shop Slug Routing Model

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Each shop needs a shareable, branded URL. Phase 1 has no cross-shop marketplace homepage requirement beyond a simple landing page.

## Decision

Public storefronts live at **`/<shop-slug>`** with product detail at **`/<shop-slug>/<product-id>`**.

- `shops.slug` is unique, URL-safe, and set at onboarding (not self-serve in Phase 1)
- Reserved slugs (`login`, `dashboard`, `api`, etc.) are blocked in application logic
- Admin routes use static paths (`/login`, `/dashboard`) that take precedence over the dynamic slug segment

## Alternatives Considered

- **Subdomains (`shop.silkpanda.com`):** DNS/SSL complexity for MVP.
- **Query params (`?shop=xyz`):** Poor shareability and SEO.

## Consequences

- Clean URLs for shop owners to print on WhatsApp status / flyers
- Slug collisions must be handled at shop creation time
- Dynamic route must not shadow admin paths
