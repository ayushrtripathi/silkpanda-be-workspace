/**
 * Product tile images copied from D:\SilkPanda\Artifacts\Products → public/products/
 * Regenerate copies: npm run artifacts:sync
 */
export const PRODUCT_ARTIFACT_PATHS = [
  "/products/saree-01.jpg",
  "/products/saree-02.jpg",
  "/products/saree-03.jpg",
  "/products/saree-04.webp",
  "/products/saree-05.png",
  "/products/saree-06.jpeg",
  "/products/saree-07.png",
  "/products/saree-08.jpeg",
  "/products/saree-09.png",
] as const;

export function productArtifactAt(index: number): string {
  const i =
    ((index % PRODUCT_ARTIFACT_PATHS.length) + PRODUCT_ARTIFACT_PATHS.length) %
    PRODUCT_ARTIFACT_PATHS.length;
  return PRODUCT_ARTIFACT_PATHS[i];
}

/** Stable pick from product/shop id (for placeholders). */
export function productArtifactForKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i)) % 9973;
  }
  return productArtifactAt(hash);
}

export function absoluteArtifactUrl(path: string, siteOrigin: string): string {
  if (path.startsWith("http")) return path;
  return `${siteOrigin.replace(/\/$/, "")}${path}`;
}
