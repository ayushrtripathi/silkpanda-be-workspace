# ADR-0007: Image/media storage strategy

**Status:** Proposed  
**Date:** 2026-03-21

## Context

Product photos drive conversion. We need storage, CDN delivery, and cost predictability as catalogs grow. Phase 1 MVP currently uses Supabase Storage as a pragmatic default.

## Decision (proposed)

**Short term (MVP):** Supabase Storage bucket `product-images`, public read, authenticated upload, URLs in `products.image_urls`.

**Under evaluation for scale:** dedicated image CDN/transform (Cloudinary, Imgix, or S3 + CloudFront), compression on upload, and per-shop quotas.

## Alternatives Considered

- **Shop-owner hosted URLs only:** Inconsistent quality and broken links.
- **Immediate Cloudinary:** Extra vendor and cost before volume is known.

## Consequences

- MVP ships with Supabase Storage (implemented in migrations)
- Must monitor bandwidth/storage before multi-shop photo load
- Accept **Proposed** until post-pilot cost/quality review; may move to **Accepted** with amendment locking Supabase-only or **Superseded** if CDN ADR wins
