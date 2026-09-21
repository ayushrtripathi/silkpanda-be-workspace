"use client";

import { FABRIC_OPTIONS, OCCASION_OPTIONS } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";

interface StorefrontFiltersProps {
  shopSlug: string;
}

export function StorefrontFilters({ shopSlug }: StorefrontFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fabric = searchParams.get("fabric") ?? "";
  const occasion = searchParams.get("occasion") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `/${shopSlug}?${query}` : `/${shopSlug}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        value={fabric}
        onChange={(e) => updateParam("fabric", e.target.value)}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">All fabrics</option>
        {FABRIC_OPTIONS.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
      <select
        value={occasion}
        onChange={(e) => updateParam("occasion", e.target.value)}
        className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">All occasions</option>
        {OCCASION_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Max price ₹"
        value={maxPrice}
        onChange={(e) => updateParam("maxPrice", e.target.value)}
        className="w-32 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm"
      />
    </div>
  );
}
