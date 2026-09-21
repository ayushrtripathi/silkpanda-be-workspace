import {
  createClient as createClientWithCookies,
  createServerSupabaseClient,
} from "@/utils/supabase/server";

export { createClientWithCookies, createServerSupabaseClient };

/** Server Components — matches existing app imports */
export async function createClient() {
  return createServerSupabaseClient();
}
