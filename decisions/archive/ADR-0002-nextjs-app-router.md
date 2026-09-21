# ADR-0002: Next.js App Router for Frontend

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Storefront pages must load fast on mobile networks and be indexable for shop-specific URLs. Shop admins need a simple web dashboard.

## Decision

Use **Next.js (App Router)** with **Tailwind CSS** for the Phase 1 web app.

- SSR/SSG for public storefront pages (SEO + performance)
- Route groups for admin vs public surfaces
- Deploy frontend to **Vercel** (free tier, git auto-deploy)

## Alternatives Considered

- **Create React App / Vite SPA:** Worse default SEO for shop URLs; more client-side loading on mobile.
- **Separate mobile app:** Out of scope per ADR-0001.

## Consequences

- Single codebase for admin + storefront
- Server Components reduce client bundle for catalog browsing
- Requires Supabase SSR client setup for authenticated admin routes
