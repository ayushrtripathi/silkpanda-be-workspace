# SilkPanda — Architecture Decision Records

This folder tracks major product, business, and technical decisions for SilkPanda as they're made. Each ADR is a standalone file, numbered sequentially, and stays even after it's superseded — we update `Status` rather than deleting history.

## Status values

- **Proposed** — under discussion, not yet locked
- **Accepted** — decided, currently in effect
- **Superseded by ADR-XXXX** — replaced by a later decision
- **Deprecated** — no longer relevant, kept for history

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-platform-strategy.md) | Platform strategy: SaaS-first, defer marketplace | Accepted |
| [0002](0002-phase1-monetization.md) | Phase 1 monetization: free/low-friction, not subscription | Accepted |
| [0003](0003-tech-stack.md) | Tech stack: Next.js, Supabase backend, no native app | Accepted (amended) |
| [0004](0004-no-payments-phase1.md) | No in-app payment handling in Phase 1 | Accepted |
| [0005](0005-team-and-hiring.md) | No hiring pre-traction; solo + informal help only | Accepted |
| [0006](0006-phase1-scope.md) | Phase 1 feature scope and build sequence | Accepted |
| [0007](0007-image-storage.md) | Image/media storage strategy | Proposed |
| [0008](0008-repo-structure.md) | Repository structure: single repo | Accepted |
| [0009](0009-mobile-app-timing.md) | Native mobile app deferred to a later phase | Accepted |
| [0010](0010-dummy-discovery-feed-prototype.md) | Dummy-data discovery feed prototype (feed, follow, location, chat) | Accepted |

### Implementation supplements (superseded numbering)

Early build-time ADRs (`ADR-0001-*` … `ADR-0007-*`) are folded into **0003** and **0006**; files kept under [archive/](archive/) for history.

## How to add a new ADR

Copy the template below, number it sequentially, add a row to the index above.

```markdown
# ADR-XXXX: <Title>

**Status:** Proposed | Accepted | Superseded | Deprecated
**Date:** <YYYY-MM-DD>

## Context
What situation/problem led to this decision being needed.

## Decision
What we decided, stated plainly.

## Alternatives Considered
Other options and why they were rejected (or deferred).

## Consequences
What this makes easier, what it makes harder, what it defers or forecloses.
```
