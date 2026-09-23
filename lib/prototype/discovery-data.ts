import { productArtifactAt } from "@/lib/products/artifact-images";

export interface DiscoveryShop {
  id: string;
  name: string;
  city: string;
  tagline: string;
  imageUrl: string;
}

export interface DiscoveryPost {
  id: string;
  shopId: string;
  shopName: string;
  city: string;
  title: string;
  price: number;
  fabric: string;
  imageUrl: string;
}

/** Static fallback when discovery shops are not seeded in Supabase */
export const CITIES = ["Chennai", "Bengaluru", "Hyderabad", "Mumbai"] as const;

export const DUMMY_SHOPS: DiscoveryShop[] = [
  {
    id: "s1",
    name: "Lakshmi Silks",
    city: "Chennai",
    tagline: "Kanjeevaram for every occasion",
    imageUrl: productArtifactAt(0),
  },
  {
    id: "s2",
    name: "Banaras House",
    city: "Hyderabad",
    tagline: "Banarasi weaves, direct from weavers",
    imageUrl: productArtifactAt(1),
  },
  {
    id: "s3",
    name: "Silk Route",
    city: "Bengaluru",
    tagline: "Contemporary silks under ₹8k",
    imageUrl: productArtifactAt(2),
  },
];

export const DUMMY_POSTS: DiscoveryPost[] = [
  {
    id: "p1",
    shopId: "s1",
    shopName: "Lakshmi Silks",
    city: "Chennai",
    title: "Temple border Kanjeevaram — maroon",
    price: 22400,
    fabric: "Kanjeevaram",
    imageUrl: productArtifactAt(0),
  },
  {
    id: "p2",
    shopId: "s2",
    shopName: "Banaras House",
    city: "Hyderabad",
    title: "Gold zari festive saree",
    price: 18900,
    fabric: "Banarasi",
    imageUrl: productArtifactAt(1),
  },
  {
    id: "p3",
    shopId: "s3",
    shopName: "Silk Route",
    city: "Bengaluru",
    title: "Office-friendly linen blend",
    price: 4200,
    fabric: "Linen",
    imageUrl: productArtifactAt(2),
  },
  {
    id: "p4",
    shopId: "s1",
    shopName: "Lakshmi Silks",
    city: "Chennai",
    title: "Bridal red — tissue silk",
    price: 35600,
    fabric: "Silk",
    imageUrl: productArtifactAt(3),
  },
];
