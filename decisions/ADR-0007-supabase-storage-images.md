# ADR-0007: Supabase Storage for Product Images

**Status:** Accepted  
**Date:** 2026-03-21

## Context

Product photos are central to saree catalog browsing. Images must be served quickly on mobile and manageable by non-technical shop owners.

## Decision

Store product images in a Supabase Storage bucket named **`product-images`**:

- **Public read** for storefront display
- **Authenticated write** scoped to shop owners (via storage policies)
- `products.image_urls` stores an array of public Storage URLs

## Alternatives Considered

- **Cloudinary / Imgix:** Better transforms but extra vendor + cost for MVP.
- **S3 direct:** More setup vs Supabase integrated auth policies.

## Consequences

- Monitor storage usage; upgrade Supabase tier before soft launch photo volume (see ADR-0003)
- No automatic image optimization pipeline in Phase 1 — accept reasonable upload size limits in admin UI
- Revisit CDN/transform strategy if bandwidth costs spike post-launch
