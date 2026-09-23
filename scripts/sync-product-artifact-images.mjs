/**
 * Sets image_urls on all products (empty or always refresh) using public/product artifacts.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { productArtifactAt } from "./lib/artifact-images.mjs";

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
    /* optional */
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: products, error } = await admin
    .from("products")
    .select("id, title, image_urls")
    .order("created_at", { ascending: true });

  if (error) throw error;

  let index = 0;
  for (const product of products ?? []) {
    const path = productArtifactAt(index);

    const { error: updateError } = await admin
      .from("products")
      .update({ image_urls: [path] })
      .eq("id", product.id);

    if (updateError) throw updateError;
    console.log(`${product.title} → ${path}`);
    index++;
  }

  console.log(`Updated ${index} products.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
