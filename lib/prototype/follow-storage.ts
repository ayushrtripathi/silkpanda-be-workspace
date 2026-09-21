const STORAGE_KEY = "silkpanda-prototype-follows";

export function getFollowedShopIds(): string[] {
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

export function setFollowedShopIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function toggleFollowedShop(shopId: string): string[] {
  const current = new Set(getFollowedShopIds());
  if (current.has(shopId)) current.delete(shopId);
  else current.add(shopId);
  const next = [...current];
  setFollowedShopIds(next);
  return next;
}
