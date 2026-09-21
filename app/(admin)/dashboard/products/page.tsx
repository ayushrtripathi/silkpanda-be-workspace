import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types/database";

export default async function ProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop) redirect("/dashboard");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shop.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-stone-600">Manage your catalog.</p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="rounded-xl bg-rose-700 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-800"
        >
          Add product
        </Link>
      </div>

      {!products?.length ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="text-stone-600">No products yet.</p>
          <Link
            href="/dashboard/products/new"
            className="mt-4 inline-block text-sm font-medium text-rose-700 hover:underline"
          >
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-100 bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {(products as Product[]).map((product) => (
                <tr key={product.id} className="border-b border-stone-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 overflow-hidden rounded bg-stone-100">
                        {product.image_urls[0] ? (
                          <Image
                            src={product.image_urls[0]}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : null}
                      </div>
                      <span className="font-medium">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {product.price != null
                      ? `₹${product.price.toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {product.stock_status.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="text-rose-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
