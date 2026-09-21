import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type {
  DiscoveryPostFeed,
  DiscoveryShopFeed,
} from "@/lib/prototype/discovery-types";
import { placeholderForFabric } from "@/lib/prototype/placeholders";
import { DiscoveryPrototype } from "./DiscoveryPrototype";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Marketplace — SilkPanda prototype",
  robots: { index: false, follow: false },
};

const DISCOVERY_SLUGS = [
  "lakshmi-silks",
  "banaras-house",
  "silk-route",
  "mumbai-heritage",
];

export default async function DiscoveryPrototypePage() {
  const supabase = await createClient();

  const { data: shops } = await supabase
    .from("shops")
    .select("id, slug, name, location, description")
    .in("slug", DISCOVERY_SLUGS);

  const shopRows = shops ?? [];
  const shopIds = shopRows.map((s) => s.id);

  const { data: products } =
    shopIds.length > 0
      ? await supabase
          .from("products")
          .select("id, shop_id, title, price, fabric, image_urls")
          .in("shop_id", shopIds)
          .order("created_at", { ascending: false })
      : { data: [] };

  const shopMap = new Map(shopRows.map((s) => [s.id, s]));

  const feedShops: DiscoveryShopFeed[] = shopRows.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    location: s.location,
    tagline: s.description,
    imageUrl: null,
  }));

  const feedPosts: DiscoveryPostFeed[] = (products ?? []).map((p) => {
    const shop = shopMap.get(p.shop_id);
    return {
      id: p.id,
      shopId: p.shop_id,
      shopName: shop?.name ?? "Shop",
      shopSlug: shop?.slug ?? "",
      location: shop?.location ?? null,
      title: p.title,
      price: p.price != null ? Number(p.price) : null,
      fabric: p.fabric,
      imageUrl:
        p.image_urls?.[0] ?? placeholderForFabric(p.fabric),
    };
  });

  const shopThumbs = new Map<string, string>();
  for (const post of feedPosts) {
    if (!shopThumbs.has(post.shopId) && post.imageUrl) {
      shopThumbs.set(post.shopId, post.imageUrl);
    }
  }

  for (const shop of feedShops) {
    shop.imageUrl = shopThumbs.get(shop.id) ?? null;
  }

  return (
    <DiscoveryPrototype
      shops={feedShops}
      posts={feedPosts}
      seededInDatabase={feedShops.length > 0}
    />
  );
}
