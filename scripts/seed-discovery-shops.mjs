/**
 * Seeds 4 dummy discovery shops with separate auth owners (ADR-0010).
 * Idempotent — safe to re-run.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { productArtifactAt, withArtifactImages } from "./lib/artifact-images.mjs";

function loadEnvLocal() {
  try {
    const text = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional if vars already exported
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const defaultPassword =
  process.env.DISCOVERY_OWNER_PASSWORD ?? "DiscoveryShop123!";

const SHOPS = [
  {
    slug: "lakshmi-silks",
    name: "Lakshmi Silks",
    email: "lakshmi@discovery.silkpanda.local",
    whatsapp: "+919800111001",
    location: "Chennai, Tamil Nadu",
    description: "Kanjeevaram for every occasion — prototype shop",
    products: [
      {
        title: "Temple border Kanjeevaram — maroon",
        price: 22400,
        fabric: "Kanjeevaram",
        occasion_tag: "Wedding",
      },
      {
        title: "Bridal red tissue silk",
        price: 35600,
        fabric: "Silk",
        occasion_tag: "Wedding",
      },
    ],
  },
  {
    slug: "banaras-house",
    name: "Banaras House",
    email: "banaras@discovery.silkpanda.local",
    whatsapp: "+919800111002",
    location: "Hyderabad, Telangana",
    description: "Banarasi weaves — prototype shop",
    products: [
      {
        title: "Gold zari festive saree",
        price: 18900,
        fabric: "Banarasi",
        occasion_tag: "Festive",
      },
    ],
  },
  {
    slug: "silk-route",
    name: "Silk Route",
    email: "silkroute@discovery.silkpanda.local",
    whatsapp: "+919800111003",
    location: "Bengaluru, Karnataka",
    description: "Contemporary silks under ₹8k — prototype shop",
    products: [
      {
        title: "Office-friendly linen blend",
        price: 4200,
        fabric: "Linen",
        occasion_tag: "Daily Wear",
      },
      {
        title: "Pastel chiffon party wear",
        price: 6800,
        fabric: "Chiffon",
        occasion_tag: "Party",
      },
    ],
  },
  {
    slug: "mumbai-heritage",
    name: "Mumbai Heritage Sarees",
    email: "mumbai@discovery.silkpanda.local",
    whatsapp: "+919800111004",
    location: "Mumbai, Maharashtra",
    description: "South Bombay multi-brand saree studio — prototype",
    products: [
      {
        title: "Georgette cocktail drape",
        price: 9500,
        fabric: "Georgette",
        occasion_tag: "Party",
      },
    ],
  },
];

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getOrCreateOwner(email) {
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    password: defaultPassword,
    email_confirm: true,
  });
  if (!error && created.user) return created.user.id;

  if (error && !/already|registered|exists/i.test(error.message)) throw error;

  const { data: listed, error: listError } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });
  if (listError) throw listError;
  const user = listed.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!user) throw new Error(`Could not resolve owner for ${email}`);
  return user.id;
}

async function main() {
  let globalProductIndex = 0;

  for (const shop of SHOPS) {
    const ownerId = await getOrCreateOwner(shop.email);
    const { data: row, error: shopError } = await admin
      .from("shops")
      .upsert(
        {
          slug: shop.slug,
          name: shop.name,
          whatsapp_number: shop.whatsapp,
          location: shop.location,
          description: shop.description,
          owner_id: ownerId,
        },
        { onConflict: "slug" },
      )
      .select("id, slug")
      .single();

    if (shopError) throw shopError;

    const { count } = await admin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("shop_id", row.id);

    if ((count ?? 0) === 0) {
      const payload = withArtifactImages(
        shop.products.map((p) => ({ ...p, shop_id: row.id })),
        globalProductIndex,
      );
      globalProductIndex += payload.length;
      const { error: prodError } = await admin.from("products").insert(payload);
      if (prodError) throw prodError;
      console.log(`Inserted products for /${row.slug}`);
    } else {
      const { data: existing } = await admin
        .from("products")
        .select("id, image_urls")
        .eq("shop_id", row.id);
      for (const [i, product] of (existing ?? []).entries()) {
        const urls = product.image_urls ?? [];
        if (urls.length > 0 && urls[0]) continue;
        const path = productArtifactAt(globalProductIndex + i);
        await admin
          .from("products")
          .update({ image_urls: [path] })
          .eq("id", product.id);
      }
      globalProductIndex += (existing ?? []).length;
      console.log(`Products exist for /${row.slug} (images synced if missing)`);
    }

    console.log(`Shop /${row.slug} → login ${shop.email}`);
  }

  console.log(`\nShared password for discovery owners: ${defaultPassword}`);
  console.log("Discovery feed: /prototype/discovery");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
