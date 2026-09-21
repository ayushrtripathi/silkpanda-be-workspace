# ADR-0002: Phase 1 monetization: free/low-friction, not subscription

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Shop owners are skeptical of new software fees before seeing enquiries. Subscription billing adds support, invoicing, and churn before product-market fit.

## Decision

Phase 1 is **free or very low friction** for pilot shops (no mandatory subscription). Monetization experiments (listing fee, success fee, optional paid tier) wait until shops are active and we understand willingness to pay.

## Alternatives Considered

- **Monthly SaaS from day one:** Filters out small shops; slows learning.
- **Take rate on orders:** Requires payments (deferred per ADR-0004).

## Consequences

- Focus metrics on adoption and enquiries, not MRR in Phase 1
- Infrastructure costs (Supabase, Vercel) absorbed as learning investment
- Revisit pricing after soft launch with real shop feedback
