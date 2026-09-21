# ADR-0010: Dummy-Data Discovery Feed — Prototyping Phase 2 UX Ahead of Real Onboarding

**Status:** Accepted
**Date:** 2026-09-21

## Context
ADR-0001 deferred cross-shop discovery to Phase 2, gated on 25-30 real shops with fresh inventory. Before any real shops are onboarded, the founder wants to build and demo the full discovery experience (feed, follow/unfollow, location filter, chat) using 3-4 seeded dummy shops, to validate and polish the UX ahead of real data.

## Decision
Build the discovery-feed UI now, against dummy/seeded data, as a **prototype layer** — explicitly separate from the real Phase 1 launch milestone (still 5-8 real shops, per ADR-0006). Specific sub-decisions:

1. **Shop login:** add `owner_id uuid references auth.users(id)` to the `shops` table; create one Supabase auth user per dummy shop so each can log into its own storefront admin.
2. **Follow/unfollow:** client-side only — a localStorage array of followed shop IDs, no backend `follows` table and no buyer accounts (keeps ADR-0006's "no buyer accounts in Phase 1" intact). Upgradeable to a real table once buyer accounts exist.
3. **Feed structure:** two tabs — **All** (every shop's products, paginated, optionally filtered by location) and **Following** (only followed shops). Not a strict opt-in/opt-out gate — both views coexist.
4. **Location filter:** uses the existing `shops.location` column; no schema change. No selection = full paginated "All" feed.
5. **Chat:** frontend-only mock (a `ChatDrawer` component with canned/delayed responses), no new table, no persistence. Real inquiries still route through WhatsApp per ADR-0004 — this is a UI placeholder, not a production messaging feature.

## Alternatives Considered
- **Wait until real shops are onboarded to build the discovery feed** — rejected for this iteration; founder wants to validate the full-product UX and get visual/interaction feedback before real shop acquisition effort begins.
- **Backend-tracked follows tied to a lightweight anonymous device ID** — rejected for now in favor of pure localStorage; adds backend complexity not justified while there are no real buyers yet.
- **Opt-in-only feed (Instagram-style, empty until you follow someone)** — rejected; founder wants an "All" feed to always be browsable, with Following as an additional, not exclusive, view.

## Consequences
- The `owner_id` addition is real, permanent schema — not just prototype scaffolding — and directly closes the shop-write-RLS gap flagged when the initial migration shipped.
- Follow state lives only in the browser; if the prototype demo needs to be shown across devices, follow state won't carry over — acceptable for a demo, revisit if this becomes user-facing before buyer accounts exist.
- Chat has no backend — if real in-app chat is ever wanted (vs. staying WhatsApp-only per ADR-0004), it will need its own future ADR and schema, not an extension of this mock.
- This prototype's existence doesn't change Phase 1's real launch gate (ADR-0006) — 5-8 real shops onboarded is still the actual milestone; the dummy feed is a design/UX exercise, not a substitute for it.
