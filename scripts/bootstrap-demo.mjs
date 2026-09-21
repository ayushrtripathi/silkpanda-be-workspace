/**
 * Creates demo shop owner + shop + sample products (idempotent).
 * Requires SUPABASE_SERVICE_ROLE_KEY — never expose to the browser.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email =
  process.env.DEMO_OWNER_EMAIL ?? "owner@demo.silkpanda.local";
const password =
  process.env.DEMO_OWNER_PASSWORD ?? "DemoShopOwner123!";

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function getOrCreateOwnerId() {
  const { data: created, error: createError } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (!createError && created.user) {
    return created.user.id;
  }

  if (
    createError &&
    !/already|registered|exists/i.test(createError.message)
  ) {
    throw createError;
  }

  const { data: listed, error: listError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;

  const existing = listed.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (!existing) {
    throw new Error(`Could not find or create user ${email}`);
  }
  return existing.id;
}

async function main() {
  const ownerId = await getOrCreateOwnerId();
  console.log(`Demo owner: ${email} (${ownerId})`);

  const shopPayload = {
    slug: "demo-sarees",
    name: "Demo Saree Palace",
    whatsapp_number: "+919876543210",
    location: "Chennai, Tamil Nadu",
    description: "Handpicked Kanjeevaram and Banarasi sarees for Phase 1 testing.",
    owner_id: ownerId,
  };

  const { data: shop, error: shopError } = await admin
    .from("shops")
    .upsert(shopPayload, { onConflict: "slug" })
    .select("id, slug")
    .single();

  if (shopError) throw shopError;
  console.log(`Shop ready: /${shop.slug}`);

  const { count, error: countError } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("shop_id", shop.id);

  if (countError) throw countError;

  if ((count ?? 0) === 0) {
    const samples = [
      {
        shop_id: shop.id,
        title: "Kanjeevaram Bridal Red",
        price: 18500,
        fabric: "Kanjeevaram",
        occasion_tag: "Wedding",
        stock_status: "in_stock",
      },
      {
        shop_id: shop.id,
        title: "Banarasi Festive Gold",
        price: 14200,
        fabric: "Banarasi",
        occasion_tag: "Festive",
        stock_status: "in_stock",
      },
      {
        shop_id: shop.id,
        title: "Cotton Daily Wear Teal",
        price: 2800,
        fabric: "Cotton",
        occasion_tag: "Daily Wear",
        stock_status: "in_stock",
      },
    ];

    const { error: productsError } = await admin.from("products").insert(samples);
    if (productsError) throw productsError;
    console.log(`Inserted ${samples.length} sample products.`);
  } else {
    console.log(`Products already exist (${count}); skipping sample insert.`);
  }

  console.log("\nLogin credentials for /login:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`\nStorefront: ${url.replace(".supabase.co", "")} → use app URL /${shop.slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
