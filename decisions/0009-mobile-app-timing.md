# ADR-0009: Native mobile app deferred to a later phase

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Shop owners and buyers already live in WhatsApp and mobile browsers. A native app adds store review, release trains, and duplicate feature work.

## Decision

**No iOS/Android app in Phase 1.** Ship a **mobile-first responsive web app** only. Revisit native when retention, notifications, or offline needs justify it.

## Alternatives Considered

- **React Native early:** Splits focus from catalog + admin MVP.
- **PWA only:** Possible enhancement later; not required for first shops.

## Consequences

- All Phase 1 UX targets mobile Safari/Chrome
- Push notifications and deep links deferred
- App store presence not a launch blocker
