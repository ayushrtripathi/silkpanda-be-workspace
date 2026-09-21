import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/database";

interface ProductCardProps {
  product: Product;
  shopSlug: string;
}

export function ProductCard({ product, shopSlug }: ProductCardProps) {
  const imageUrl = product.image_urls[0];
  const outOfStock = product.stock_status === "out_of_stock";

  return (
    <Link
      href={`/${shopSlug}/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:border-rose-200 hover:shadow-md"
    >
      <div className="relative aspect-[3/4] bg-stone-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            No image
          </div>
        )}
        {outOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-stone-900/80 px-2 py-0.5 text-xs font-medium text-white">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-stone-900">
          {product.title}
        </h3>
        {product.price != null && (
          <p className="text-sm font-semibold text-rose-700">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1 pt-1">
          {product.fabric && (
            <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
              {product.fabric}
            </span>
          )}
          {product.occasion_tag && (
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-700">
              {product.occasion_tag}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
