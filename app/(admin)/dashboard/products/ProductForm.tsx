"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/ImageUpload";
import {
  FABRIC_OPTIONS,
  OCCASION_OPTIONS,
  STOCK_STATUS_OPTIONS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Product, StockStatus } from "@/lib/types/database";

interface ProductFormProps {
  shopId: string;
  product?: Product;
}

export function ProductForm({ shopId, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);

  const [title, setTitle] = useState(product?.title ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [fabric, setFabric] = useState(product?.fabric ?? "");
  const [occasionTag, setOccasionTag] = useState(product?.occasion_tag ?? "");
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    product?.stock_status ?? "in_stock",
  );
  const [imageUrls, setImageUrls] = useState<string[]>(product?.image_urls ?? []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      shop_id: shopId,
      title: title.trim(),
      price: price ? Number(price) : null,
      fabric: fabric || null,
      occasion_tag: occasionTag || null,
      stock_status: stockStatus,
      image_urls: imageUrls,
    };

    const supabase = createClient();

    if (isEdit && product) {
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", product.id);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("products").insert(payload);

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  async function handleDelete() {
    if (!product || !confirm("Delete this product?")) return;

    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id);

    if (deleteError) {
      setError(deleteError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Price (₹)</label>
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">Fabric</label>
          <select
            value={fabric}
            onChange={(e) => setFabric(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {FABRIC_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Occasion</label>
          <select
            value={occasionTag}
            onChange={(e) => setOccasionTag(e.target.value)}
            className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
          >
            <option value="">Select</option>
            {OCCASION_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Stock</label>
        <select
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value as StockStatus)}
          className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
        >
          {STOCK_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Images</label>
        <div className="mt-2">
          <ImageUpload shopId={shopId} value={imageUrls} onChange={setImageUrls} />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Save changes" : "Create product"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
