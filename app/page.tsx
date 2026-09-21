import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <span className="text-lg font-bold tracking-tight text-rose-800">
            SilkPanda
          </span>
          <Link
            href="/login"
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium hover:bg-stone-50"
          >
            Shop login
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col justify-center px-4 py-16">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-rose-600">
          Phase 1 MVP
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Your saree shop, online — share one link, get WhatsApp enquiries.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
          Each shop gets a branded catalog at{" "}
          <code className="rounded bg-stone-100 px-1.5 py-0.5 text-base">
            silkpanda.com/your-shop
          </code>
          . Buyers browse, filter, and tap Enquire — no payments, no app download.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-rose-700 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-800"
          >
            Shop owner dashboard
          </Link>
          <Link
            href="/prototype/discovery"
            className="rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-900 hover:bg-amber-100"
          >
            Marketplace demo
          </Link>
          <a
            href="https://github.com/ayushrtripathi/silkpanda-be-workspace"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-stone-200 bg-white px-6 py-3 text-sm font-semibold hover:bg-stone-50"
          >
            View on GitHub
          </a>
        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white py-6 text-center text-sm text-stone-500">
        SilkPanda — Swiggy for saree shops (Phase 1)
      </footer>
    </div>
  );
}
