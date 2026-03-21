import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function userOwnsRun(runId: string, userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("runs")
    .select("id")
    .eq("id", runId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function getOwnedRunResult(runId: string, userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("runs")
    .select("user_id, run_results(result)")
    .eq("id", runId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const results = Array.isArray(data.run_results) ? data.run_results[0] : data.run_results;
  return results?.result ?? null;
}
