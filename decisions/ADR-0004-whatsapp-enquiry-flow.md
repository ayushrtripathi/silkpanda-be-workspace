# ADR-0004: WhatsApp Deep Links for Enquiries

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Indian saree buyers already negotiate and enquire on WhatsApp. Building custom messaging infrastructure adds cost and support burden in Phase 1.

## Decision

The **Enquire** button opens a pre-filled **`wa.me/<number>`** deep link to the shop's WhatsApp number. On click, insert an `events` row with `type = 'inquiry'` for analytics.

Message template (example):

```
Hi, I'm interested in [Product Title] (₹[Price]) from your SilkPanda catalog.
```

## Alternatives Considered

- **In-app chat:** Requires moderation, notifications, and ongoing infra.
- **Phone/SMS links:** WhatsApp is the dominant channel for this market.

## Consequences

- No message delivery guarantees or read receipts in-app
- Shop owners manage conversations entirely in WhatsApp
- Inquiry counts are click-based, not conversation-confirmed
