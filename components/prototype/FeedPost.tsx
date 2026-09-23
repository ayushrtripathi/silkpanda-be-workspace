"use client";

import Image from "next/image";
import Link from "next/link";
import { placeholderForFabric } from "@/lib/prototype/placeholders";
import type { DiscoveryPostFeed } from "@/lib/prototype/discovery-types";

interface FeedPostProps {
  post: DiscoveryPostFeed;
  liked: boolean;
  onToggleLike: () => void;
  onMessage: () => void;
}

export function FeedPost({
  post,
  liked,
  onToggleLike,
  onMessage,
}: FeedPostProps) {
  const image = post.imageUrl ?? placeholderForFabric(post.fabric);

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200/90">
      <div className="relative aspect-[4/5] w-full bg-stone-100">
        <Image
          src={image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 512px) 100vw, 512px"
          priority={false}
        />
      </div>

      <div className="px-3 pt-2 pb-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleLike}
            aria-pressed={liked}
            aria-label={liked ? "Unlike" : "Like"}
            className="rounded-full p-1.5 transition active:scale-90 hover:bg-stone-50"
          >
            <HeartIcon filled={liked} />
          </button>
          <button
            type="button"
            onClick={onMessage}
            aria-label={`Message ${post.shopName} about this saree`}
            className="rounded-full p-1.5 text-stone-700 transition hover:bg-stone-50 active:scale-90"
          >
            <ChatBubbleIcon />
          </button>
        </div>

        <p className="mt-1 text-[15px] leading-snug text-stone-900">{post.title}</p>
        {post.shopSlug ? (
          <Link
            href={`/${post.shopSlug}`}
            className="mt-0.5 block text-sm text-stone-500 transition hover:text-sky-700 hover:underline"
          >
            {post.shopName}
          </Link>
        ) : (
          <p className="mt-0.5 text-sm text-stone-500">{post.shopName}</p>
        )}
        {post.price != null && (
          <p className="mt-1 text-sm font-semibold text-stone-800">
            ₹{post.price.toLocaleString("en-IN")}
          </p>
        )}
        <button
          type="button"
          onClick={onMessage}
          className="mt-2 text-left text-xs font-medium text-sky-700 hover:underline"
        >
          Ask {post.shopName} about this saree
        </button>
      </div>
    </article>
  );
}

function ChatBubbleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-5 w-5 shrink-0"
      aria-hidden
    >
      <path
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.657-.735v-1.149c0-.61-.197-1.205-.559-1.704A8.972 8.972 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 fill-rose-500 text-rose-500"
        aria-hidden
      >
        <path
          d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className="h-6 w-6 text-stone-800"
      aria-hidden
    >
      <path
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
