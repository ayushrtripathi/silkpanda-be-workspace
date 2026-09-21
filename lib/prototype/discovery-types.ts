export interface DiscoveryShopFeed {
  id: string;
  slug: string;
  name: string;
  location: string | null;
  tagline: string | null;
  imageUrl: string | null;
}

export interface DiscoveryPostFeed {
  id: string;
  shopId: string;
  shopName: string;
  shopSlug: string;
  location: string | null;
  title: string;
  price: number | null;
  fabric: string | null;
  imageUrl: string | null;
}

export const DISCOVERY_CITIES = [
  "Chennai",
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
] as const;

export function cityFromLocation(location: string | null): string | null {
  if (!location) return null;
  const city = DISCOVERY_CITIES.find((c) =>
    location.toLowerCase().includes(c.toLowerCase()),
  );
  return city ?? location.split(",")[0]?.trim() ?? null;
}

export function locationMatchesCity(
  location: string | null,
  city: string,
): boolean {
  if (!location) return false;
  return location.toLowerCase().includes(city.toLowerCase());
}
