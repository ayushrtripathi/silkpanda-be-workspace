import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { StorefrontFilters } from "@/components/StorefrontFilters";
import { RESERVED_SLUGS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/database";

export default async function ShopStorefrontPage({
  params,
  searchParams,
}: PageProps<"/[shopSlug]">) {
  const { shopSlug } = await params;
  const filters = await searchParams;

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

  let query = supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  const fabric = typeof filters.fabric === "string" ? filters.fabric : "";
  const occasion = typeof filters.occasion === "string" ? filters.occasion : "";
  const maxPrice =
    typeof filters.maxPrice === "string" ? filters.maxPrice : "";

  if (fabric) query = query.eq("fabric", fabric);
  if (occasion) query = query.eq("occasion_tag", occasion);
  if (maxPrice) query = query.lte("price", Number(maxPrice));

  const { data: products } = await query;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-sm font-medium text-rose-600">SilkPanda shop</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{shop.name}</h1>
          {shop.location && (
            <p className="mt-2 text-stone-600">{shop.location}</p>
          )}
          {shop.description && (
            <p className="mt-3 max-w-2xl text-stone-600">{shop.description}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Suspense fallback={<div className="h-10" />}>
          <StorefrontFilters shopSlug={shopSlug} />
        </Suspense>
        <div className="mt-6">
          <ProductGrid
            products={(products ?? []) as Product[]}
            shopSlug={shopSlug}
          />
        </div>
      </main>
    </div>
  );
}
