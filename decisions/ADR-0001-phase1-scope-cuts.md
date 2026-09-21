# ADR-0001: Phase 1 Scope Cuts

**Status:** Accepted  
**Date:** 2026-03-21

## Context

SilkPanda is a shop-enablement platform for saree retailers. Phase 1 must ship quickly to validate demand with real shops before investing in marketplace-scale features.

## Decision

Phase 1 is intentionally limited to:

- Single-shop storefronts at `silkpanda.com/<shop-slug>`
- Shop-admin catalog management (CRUD + images)
- Buyer browse + filter within one shop
- WhatsApp enquiry (no in-app messaging)
- Basic view/inquiry analytics for shop owners

**Explicitly out of scope for Phase 1:**

- Cross-shop discovery or search
- Payments and checkout
- Native mobile apps
- Self-serve shop signup
- Reviews and ratings

## Consequences

- Faster time to first shop onboarded
- Simpler data model and RLS policies
- No payment compliance burden in Phase 1
- Buyers cannot save favorites or order history (acceptable for validation)
