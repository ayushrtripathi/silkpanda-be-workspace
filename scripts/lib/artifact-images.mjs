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
];

export function productArtifactAt(index) {
  const n = PRODUCT_ARTIFACT_PATHS.length;
  const i = ((index % n) + n) % n;
  return PRODUCT_ARTIFACT_PATHS[i];
}

export function withArtifactImages(rows, startIndex = 0) {
  return rows.map((row, i) => ({
    ...row,
    image_urls: [productArtifactAt(startIndex + i)],
  }));
}
