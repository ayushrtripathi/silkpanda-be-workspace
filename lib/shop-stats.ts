import type { ShopStats } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";

function startOfWeek(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function getShopStats(shopId: string): Promise<ShopStats> {
  const supabase = await createClient();
  const weekStart = startOfWeek();

  const [viewsResult, inquiriesResult, viewsWeekResult, inquiriesWeekResult] =
    await Promise.all([
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("shop_id", shopId)
        .eq("type", "view"),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("shop_id", shopId)
        .eq("type", "inquiry"),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("shop_id", shopId)
        .eq("type", "view")
        .gte("created_at", weekStart),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("shop_id", shopId)
        .eq("type", "inquiry")
        .gte("created_at", weekStart),
    ]);

  return {
    views: viewsResult.count ?? 0,
    inquiries: inquiriesResult.count ?? 0,
    viewsThisWeek: viewsWeekResult.count ?? 0,
    inquiriesThisWeek: inquiriesWeekResult.count ?? 0,
  };
}
