# ADR-0011: Feed Layout — Single-Column Scroll (Instagram-Style), Replacing Grid

**Status:** Accepted
**Date:** 2026-09-21
**Supersedes (partially):** ADR-0010's "product grid" layout description — tab structure (All/Following) and pagination approach from ADR-0010 are unchanged, only the visual layout and card content are revised here.

## Context
The initial feed implementation (ADR-0010) used a multi-column grid of product cards, similar to a typical e-commerce layout (Amazon-style). Founder wants a single-column, vertically scrollable feed instead — each product gets a full-width tile, better suited to showing off saree photography than a small grid thumbnail.

## Decision
Feed tiles are restructured as a **single-column, vertically scrolling list**, one product per tile, in place of the grid. Each tile contains:
- Product image — full-width, portrait-oriented (suggest ~4:5 aspect ratio, matches how sarees are typically photographed for social media)
- Product/saree name — below the image, regular weight
- Shop name — below the product name, smaller/muted font, tappable through to that shop's storefront page
- Like button — a heart icon, toggles filled/outline on tap

**Like is a new, separate interaction from Follow** (ADR-0010): Follow applies to a shop; Like applies to an individual product. Implemented the same way as Follow — **client-side only, a localStorage array of liked product IDs, no backend column or table.** Consistent with keeping Phase 1 free of buyer accounts (ADR-0006).

This layout applies to both the "All" and "Following" tabs established in ADR-0010 — only the tile's visual structure changes, not the tab logic or the location-filter/pagination behavor underneath it.

## Alternatives Considered
- **Full-screen snap-scroll (Reels/TikTok-style, one tile per screen)** — not chosen; founder's reference point was Instagram's main feed (continuous scroll), not Stories/Reels. Worth revisiting only if a more immersive single-item browsing mode is wanted later.
- **Backend-tracked likes (a `likes` table or a `like_count` column on `products`)** — deferred, same reasoning as Follow in ADR-0010: no buyer accounts yet, so a persisted per-user like has nowhere real to attach. Aggregate like counts (visible to shop owners, e.g. "12 people liked this") would need this later.

## Consequences
- Feed becomes taller/more scroll-heavy per session — expected trade-off for giving photos more room; pagination (already planned in ADR-0010) matters more here since a single column shows fewer products per viewport than a grid did.
- Like state, like Follow state, is local to the browser — doesn't sync across devices and isn't visible to shop owners. If shop-side visibility into "who liked what" becomes a wanted feature, it needs real accounts and a backend table — a future decision, not this one.
- Existing grid-based components from the ADR-0010 build likely need restructuring rather than pure styling changes, since the underlying markup shape (grid item vs. full-width post) differs.
