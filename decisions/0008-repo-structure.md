# ADR-0008: Repository structure: single repo

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Splitting frontend, backend, and docs across repos adds coordination overhead for a solo Phase 1 build.

## Decision

**Single monorepo** (`silkpanda-be-workspace`) containing:

- Next.js app (storefront + admin)
- `supabase/` migrations and setup scripts
- `decisions/` ADRs (this folder)
- `scripts/` for bootstrap and Supabase CLI automation

GitHub: [ayushrtripathi/silkpanda-be-workspace](https://github.com/ayushrtripathi/silkpanda-be-workspace).

## Alternatives Considered

- **Separate FE/BE repos:** Unnecessary while backend is Supabase-managed.
- **Turborepo packages:** Overkill for current size.

## Consequences

- One PR can span schema + app changes
- ADRs live with code agents read in Cursor
- Deploy remains Vercel + Supabase cloud (no repo split)
