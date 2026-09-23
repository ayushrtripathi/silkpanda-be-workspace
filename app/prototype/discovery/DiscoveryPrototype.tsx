"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatDrawer } from "@/components/prototype/ChatDrawer";
import { FeedPost } from "@/components/prototype/FeedPost";
import { DUMMY_POSTS, DUMMY_SHOPS } from "@/lib/prototype/discovery-data";
import {
  getFollowedShopIds,
  setFollowedShopIds,
  toggleFollowedShop,
} from "@/lib/prototype/follow-storage";
import {
  getLikedProductIds,
  setLikedProductIds,
  toggleLikedProduct,
} from "@/lib/prototype/like-storage";
import { placeholderForFabric } from "@/lib/prototype/placeholders";
import {
  cityFromLocation,
  DISCOVERY_CITIES,
  locationMatchesCity,
  type DiscoveryPostFeed,
  type DiscoveryShopFeed,
} from "@/lib/prototype/discovery-types";

/** Single-column feed shows fewer items per viewport (ADR-0011). */
const PAGE_SIZE = 3;

interface DiscoveryPrototypeProps {
  shops: DiscoveryShopFeed[];
  posts: DiscoveryPostFeed[];
}

type FeedTab = "all" | "following";

export function DiscoveryPrototype({
  shops: dbShops,
  posts: dbPosts,
}: DiscoveryPrototypeProps) {
  const shops = useMemo(() => {
    if (dbShops.length > 0) return dbShops;
    return DUMMY_SHOPS.map((s) => ({
      id: s.id,
      slug: s.id,
      name: s.name,
      location: `${s.city}, India`,
      tagline: s.tagline,
      imageUrl: s.imageUrl,
    }));
  }, [dbShops]);

  const posts = useMemo(() => {
    if (dbPosts.length > 0) return dbPosts;
    return DUMMY_POSTS.map((p) => ({
      id: p.id,
      shopId: p.shopId,
      shopName: p.shopName,
      shopSlug: p.shopId,
      location: `${p.city}, India`,
      title: p.title,
      price: p.price,
      fabric: p.fabric,
      imageUrl: p.imageUrl,
    }));
  }, [dbPosts]);

  const [feedTab, setFeedTab] = useState<FeedTab>("all");
  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");
  const [followedIds, setFollowedIds] = useState<string[]>(() =>
    typeof window !== "undefined" ? getFollowedShopIds() : [],
  );
  const [likedIds, setLikedIds] = useState<string[]>(() =>
    typeof window !== "undefined" ? getLikedProductIds() : [],
  );
  const [page, setPage] = useState(1);
  const [chatShop, setChatShop] = useState<string | null>(null);

  useEffect(() => {
    setFollowedIds(getFollowedShopIds());
    setLikedIds(getLikedProductIds());
  }, []);

  const filteredPosts = useMemo(() => {
    let list = posts;
    const q = query.trim().toLowerCase();

    if (feedTab === "following") {
      const followed = new Set(followedIds);
      list = list.filter((p) => followed.has(p.shopId));
    } else if (city !== "All") {
      list = list.filter((p) => locationMatchesCity(p.location, city));
    }

    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shopName.toLowerCase().includes(q) ||
          (p.fabric?.toLowerCase().includes(q) ?? false),
      );
    }

    return list;
  }, [posts, feedTab, followedIds, city, query]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, page * PAGE_SIZE),
    [filteredPosts, page],
  );

  const hasMore = visiblePosts.length < filteredPosts.length;

  const onToggleFollow = useCallback((shopId: string) => {
    setFollowedIds(toggleFollowedShop(shopId));
  }, []);

  const onToggleLike = useCallback((productId: string) => {
    setLikedIds(toggleLikedProduct(productId));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [feedTab, city, query]);

  const followingCount = followedIds.length;

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Top bar — Marketplace-style */}
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="hidden rounded-full p-2 text-stone-500 hover:bg-stone-100 sm:inline-flex"
            aria-label="Back home"
          >
            ←
          </Link>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-[#f0f2f5] px-4 py-2.5 ring-1 ring-stone-200/60 focus-within:ring-2 focus-within:ring-sky-500">
            <span className="text-stone-400" aria-hidden>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, shops, fabric…"
              className="w-full bg-transparent text-sm text-stone-800 outline-none placeholder:text-stone-400"
            />
          </div>
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Demo
          </span>
        </div>

        {/* All | Following — always visible */}
        <div className="mx-auto max-w-5xl px-4 pb-2">
          <div className="flex rounded-xl bg-[#f0f2f5] p-1">
            <SegmentTab
              label="All"
              count={posts.length}
              active={feedTab === "all"}
              onClick={() => setFeedTab("all")}
            />
            <SegmentTab
              label="Following"
              count={followingCount}
              active={feedTab === "following"}
              onClick={() => setFeedTab("following")}
            />
          </div>
        </div>

        {/* Location — only on All tab */}
        {feedTab === "all" && (
          <div className="mx-auto flex max-w-5xl items-center gap-3 border-t border-stone-100 px-4 py-3">
            <label
              htmlFor="discovery-location"
              className="shrink-0 text-sm font-medium text-stone-600"
            >
              Location
            </label>
            <select
              id="discovery-location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
            >
              <option value="All">All areas</option>
              {DISCOVERY_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4 pb-20">
        {/* Shop strip */}
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold text-stone-800">
            Shops to follow
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {shops.map((shop) => {
              const following = followedIds.includes(shop.id);
              const thumb = shop.imageUrl ?? placeholderForFabric(null);
              return (
                <div
                  key={shop.id}
                  className="w-28 shrink-0 text-center transition hover:opacity-95"
                >
                  <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-white shadow-md">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <p className="mt-2 truncate text-xs font-semibold text-stone-800">
                    {shop.name}
                  </p>
                  <p className="truncate text-[10px] text-stone-500">
                    {cityFromLocation(shop.location)}
                  </p>
                  <button
                    type="button"
                    onClick={() => onToggleFollow(shop.id)}
                    className={`mt-1.5 w-full rounded-lg py-1 text-[11px] font-semibold transition active:scale-95 ${
                      following
                        ? "bg-stone-200 text-stone-700"
                        : "bg-sky-600 text-white shadow-sm hover:bg-sky-700"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Single-column feed (ADR-0011) */}
        <section className="mx-auto max-w-lg">
          <div className="mb-3 flex items-end justify-between px-0.5">
            <h2 className="text-lg font-bold text-stone-900">
              {feedTab === "following" ? "Following" : "For you"}
            </h2>
            <span className="text-sm text-stone-500">
              {filteredPosts.length} post{filteredPosts.length === 1 ? "" : "s"}
            </span>
          </div>

          {feedTab === "following" && followedIds.length === 0 && (
            <div className="mb-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/80 p-8 text-center">
              <p className="text-sm font-medium text-sky-900">No follows yet</p>
              <p className="mt-1 text-sm text-sky-800/80">
                Tap <strong>Follow</strong> on a shop above, or switch to{" "}
                <button
                  type="button"
                  className="font-semibold underline"
                  onClick={() => setFeedTab("all")}
                >
                  All
                </button>{" "}
                to browse everyone.
              </p>
            </div>
          )}

          <ul className="flex flex-col gap-5">
            {visiblePosts.map((post) => (
              <li key={post.id}>
                <FeedPost
                  post={post}
                  liked={likedIds.includes(post.id)}
                  onToggleLike={() => onToggleLike(post.id)}
                  onMessage={() => setChatShop(post.shopName)}
                />
              </li>
            ))}
          </ul>

          {filteredPosts.length === 0 &&
            !(feedTab === "following" && followedIds.length === 0) && (
              <p className="py-12 text-center text-sm text-stone-500">
                No listings match your filters.
              </p>
            )}

          {hasMore && (
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-semibold text-sky-700 shadow-sm ring-1 ring-stone-200 transition hover:bg-sky-50 active:scale-[0.99]"
            >
              Load more ({filteredPosts.length - visiblePosts.length} left)
            </button>
          )}
        </section>

        {process.env.NODE_ENV === "development" && (
          <div className="mx-auto mt-8 flex max-w-lg gap-4 text-xs text-stone-400">
            <button
              type="button"
              onClick={() => {
                setFollowedShopIds([]);
                setFollowedIds([]);
              }}
              className="underline"
            >
              Reset follows (dev)
            </button>
            <button
              type="button"
              onClick={() => {
                setLikedProductIds([]);
                setLikedIds([]);
              }}
              className="underline"
            >
              Reset likes (dev)
            </button>
          </div>
        )}
      </main>

      <ChatDrawer
        shopName={chatShop ?? ""}
        open={Boolean(chatShop)}
        onClose={() => setChatShop(null)}
      />
    </div>
  );
}

function SegmentTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-white text-stone-900 shadow-sm"
          : "text-stone-500 hover:text-stone-700"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          active ? "bg-sky-100 text-sky-800" : "bg-stone-200/80 text-stone-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
