# ADR-0001: Platform strategy: SaaS-first, defer marketplace

**Status:** Accepted  
**Date:** 2026-03-21

## Context

SilkPanda could launch as a multi-shop marketplace (discovery, unified checkout) or as shop-enablement SaaS (each shop owns its catalog and buyer relationship). Marketplace features require cross-shop trust, payments, and ops before we have proof that shops will adopt.

## Decision

**SaaS-first:** ship tools that help individual saree shops sell online (branded catalog URL, WhatsApp enquiries, simple analytics). **Defer** cross-shop marketplace discovery, unified cart, and platform-led demand generation until post-traction.

## Alternatives Considered

- **Marketplace-first (Swiggy model day one):** Higher cold-start cost; needs buyer liquidity and shop density.
- **WhatsApp-only catalog (PDF/links):** No structured data or analytics; harder to iterate.

## Consequences

- Faster path to onboarding 2–3 pilot shops
- Buyers discover shops via shop-shared links, not SilkPanda homepage search
- Marketplace ADRs and infra can follow once retention/enquiry metrics justify them
