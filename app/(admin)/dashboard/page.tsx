import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getShopStats } from "@/lib/shop-stats";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!shop) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-semibold text-amber-900">Shop not linked yet</h2>
        <p className="mt-2 text-sm text-amber-800">
          Your account is not linked to a shop. Ask the SilkPanda team to set{" "}
          <code className="rounded bg-amber-100 px-1">owner_id</code> on your shop
          row after signup (Phase 1 has no self-serve shop registration).
        </p>
      </div>
    );
  }

  const stats = await getShopStats(shop.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-stone-600">
          Weekly snapshot of catalog activity for {shop.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total views" value={stats.views} />
        <StatCard label="Total enquiries" value={stats.inquiries} />
        <StatCard label="Views this week" value={stats.viewsThisWeek} />
        <StatCard label="Enquiries this week" value={stats.inquiriesThisWeek} />
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="font-semibold">Shop profile</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-stone-500">WhatsApp</dt>
            <dd className="font-medium">{shop.whatsapp_number}</dd>
          </div>
          <div>
            <dt className="text-stone-500">Location</dt>
            <dd className="font-medium">{shop.location ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-stone-500">Description</dt>
            <dd className="font-medium">{shop.description ?? "—"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-rose-800">{value}</p>
    </div>
  );
}
