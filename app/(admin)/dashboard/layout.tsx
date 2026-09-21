import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: shop } = await supabase
    .from("shops")
    .select("name, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <Link href="/dashboard" className="text-lg font-bold text-rose-800">
              SilkPanda
            </Link>
            {shop && (
              <p className="text-sm text-stone-500">
                {shop.name} · /{shop.slug}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {shop && (
              <Link
                href={`/${shop.slug}`}
                target="_blank"
                className="text-sm text-rose-700 hover:underline"
              >
                View storefront
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-4 border-t border-stone-100 px-4 py-2 text-sm">
          <Link href="/dashboard" className="font-medium text-stone-700 hover:text-rose-700">
            Overview
          </Link>
          <Link
            href="/dashboard/products"
            className="font-medium text-stone-700 hover:text-rose-700"
          >
            Products
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
