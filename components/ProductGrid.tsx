import type { Product } from "@/lib/types/database";
import { ProductCard } from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  shopSlug: string;
}

export function ProductGrid({ products, shopSlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center">
        <p className="text-stone-600">No products match your filters yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} shopSlug={shopSlug} />
      ))}
    </div>
  );
}
