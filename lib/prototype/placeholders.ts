const BY_FABRIC: Record<string, string> = {
  Kanjeevaram:
    "https://images.unsplash.com/photo-1610030469983-98e550783c08?w=600&q=80",
  Banarasi:
    "https://images.unsplash.com/photo-1583292650898-7d22cd406021?w=600&q=80",
  Linen:
    "https://images.unsplash.com/photo-1617627143750-d86bc21e3361?w=600&q=80",
  Chiffon:
    "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80",
  Georgette:
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
  Silk:
    "https://images.unsplash.com/photo-1610030469983-98e550783c08?w=600&q=80",
};

const DEFAULT =
  "https://images.unsplash.com/photo-1583292650898-7d22cd406021?w=600&q=80";

export function placeholderForFabric(fabric: string | null): string {
  if (!fabric) return DEFAULT;
  return BY_FABRIC[fabric] ?? DEFAULT;
}
