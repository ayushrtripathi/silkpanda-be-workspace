import type { EventType } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

export async function trackEvent(
  type: EventType,
  productId: string,
  shopId: string,
): Promise<void> {
  const supabase = createClient();
  await supabase.from("events").insert({ type, product_id: productId, shop_id: shopId });
}
