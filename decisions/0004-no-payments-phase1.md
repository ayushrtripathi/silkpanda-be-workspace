# ADR-0004: No in-app payment handling in Phase 1

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Saree purchases often involve negotiation, customization, and trust. Adding payments implies refunds, reconciliation, GST, and dispute handling before we validate catalogue usage.

## Decision

**No checkout, payment gateway, or order settlement in Phase 1.** Buyers enquire via WhatsApp; commercial terms are handled off-platform.

## Alternatives Considered

- **Razorpay/Stripe checkout:** Compliance and support burden; premature before enquiry volume proof.
- **COD order capture only:** Still implies order state machine and buyer expectations.

## Consequences

- No payment compliance scope in Phase 1
- Cannot measure GMV in-app; enquiry clicks are the proxy metric
- Payments become a explicit later ADR when shops request it
