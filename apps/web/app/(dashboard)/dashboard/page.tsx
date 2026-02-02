import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { NewConsultationCTA } from "@/components/dashboard/NewConsultationCTA";
import { RunHistoryList } from "@/components/dashboard/RunHistoryList";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/dashboard");
  }

  // Fetch user's runs
  const { data: runs } = await supabase
    .from("runs")
    .select("id, brief, mode, status, created_at, completed_at, run_results(result)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <Container size="lg" className="py-10 space-y-8">
      <DashboardGreeting displayName={profile?.display_name} />
      {(runs ?? []).length > 0 && <NewConsultationCTA />}
      <RunHistoryList runs={runs ?? []} />
    </Container>
  );
}
