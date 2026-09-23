const STORAGE_KEY = "silkpanda-prototype-likes";

export function getLikedProductIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function setLikedProductIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleLikedProduct(productId: string): string[] {
  const current = new Set(getLikedProductIds());
  if (current.has(productId)) current.delete(productId);
  else current.add(productId);
  const next = [...current];
  setLikedProductIds(next);
  return next;
}
