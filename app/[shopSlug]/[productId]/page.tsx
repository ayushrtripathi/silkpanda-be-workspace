import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquireButton } from "@/components/EnquireButton";
import { ProductViewTracker } from "@/components/ProductViewTracker";
import { RESERVED_SLUGS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/database";

export default async function ProductDetailPage({
  params,
}: PageProps<"/[shopSlug]/[productId]">) {
  const { shopSlug, productId } = await params;

  if (RESERVED_SLUGS.has(shopSlug)) {
    notFound();
  }

  const supabase = await createClient();
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("slug", shopSlug)
    .maybeSingle();

  if (!shop) notFound();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .eq("shop_id", shop.id)
    .maybeSingle();

  if (!product) notFound();

  const p = product as Product;
  const outOfStock = p.stock_status === "out_of_stock";

  return (
    <div className="min-h-screen bg-stone-50">
      <ProductViewTracker productId={p.id} shopId={shop.id} />

      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4">
          <Link
            href={`/${shopSlug}`}
            className="text-sm text-rose-700 hover:underline"
          >
            ← {shop.name}
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-100">
            {p.image_urls[0] ? (
              <Image
                src={p.image_urls[0]}
                alt={p.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-400">
                No image
              </div>
            )}
          </div>
          {p.image_urls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {p.image_urls.slice(1).map((url) => (
                <div
                  key={url}
                  className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg border border-stone-200"
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{p.title}</h1>
            {p.price != null && (
              <p className="mt-2 text-2xl font-semibold text-rose-700">
                ₹{p.price.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <dl className="grid gap-2 text-sm">
            {p.fabric && (
              <div className="flex gap-2">
                <dt className="text-stone-500">Fabric</dt>
                <dd className="font-medium">{p.fabric}</dd>
              </div>
            )}
            {p.occasion_tag && (
              <div className="flex gap-2">
                <dt className="text-stone-500">Occasion</dt>
                <dd className="font-medium">{p.occasion_tag}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="text-stone-500">Availability</dt>
              <dd className="font-medium capitalize">
                {p.stock_status.replace("_", " ")}
              </dd>
            </div>
          </dl>

          <div className="mt-auto pt-4">
            <EnquireButton
              productId={p.id}
              shopId={shop.id}
              productTitle={p.title}
              price={p.price}
              whatsappNumber={shop.whatsapp_number}
              disabled={outOfStock}
            />
            {outOfStock && (
              <p className="mt-2 text-center text-xs text-stone-500">
                This item is currently out of stock.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
