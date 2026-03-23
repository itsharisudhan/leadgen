import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function getCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null;

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn("Auth check failed (likely no session):", error.message);
      return null;
    }
    return data.user ?? null;
  } catch (error) {
    console.error("Critical auth error:", error);
    return null;
  }
}
