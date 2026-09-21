# ADR-0006: No Buyer Accounts in Phase 1

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Buyer authentication enables wishlists, order history, and personalized recommendations — none of which are required to validate whether shops will maintain catalogs and receive enquiries.

## Decision

**No buyer signup or login in Phase 1.** Storefronts are fully public. Identity is only required for shop admins.

Analytics (`events` table) are anonymous — product views and enquiry clicks only.

## Alternatives Considered

- **Optional buyer accounts:** Adds auth UX and GDPR-style data handling before product-market fit.
- **Phone OTP login:** Common in India but unnecessary for browse-and-enquire flow.

## Consequences

- Simpler storefront UX (no login walls)
- Cannot retarget buyers or save carts
- Revisit if repeat-buyer features become a traction signal
