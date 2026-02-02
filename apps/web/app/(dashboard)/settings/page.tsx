import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { AccountSettings } from "@/components/dashboard/AccountSettings";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?next=/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <Container size="md" className="py-10">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-studio-ink mb-2">Settings</h1>
        <p className="text-studio-ink/60">
          Manage your profile and account preferences.
        </p>
      </div>
      <AccountSettings
        displayName={profile?.display_name ?? ""}
        email={user.email ?? ""}
      />
    </Container>
  );
}
