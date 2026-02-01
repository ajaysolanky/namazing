import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { RunHistoryList } from "@/components/dashboard/RunHistoryList";
import { AccountSettings } from "@/components/dashboard/AccountSettings";

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
    <Container size="lg" className="py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-studio-ink mb-2">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="text-studio-ink/60">
          Your naming consultations and account settings.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-studio-ink mb-6">Your consultations</h2>
          <RunHistoryList runs={runs ?? []} />
        </div>
        <div>
          <h2 className="font-display text-2xl text-studio-ink mb-6">Account</h2>
          <AccountSettings
            displayName={profile?.display_name ?? ""}
            email={user.email ?? ""}
          />
        </div>
      </div>
    </Container>
  );
}
