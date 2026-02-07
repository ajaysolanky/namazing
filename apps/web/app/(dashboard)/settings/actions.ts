"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const displayName = formData.get("displayName") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error(`[settings] Failed to update profile for user ${user.id}:`, error);
    throw new Error("Failed to update profile");
  }

  console.log(`[settings] Profile updated for user ${user.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/settings");
}

export async function deleteAccount() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  // Delete profile (cascades to runs and results)
  const { error } = await supabase.from("profiles").delete().eq("id", user.id);

  if (error) {
    console.error(`[settings] Failed to delete account for user ${user.id}:`, error);
    throw new Error("Failed to delete account");
  }

  console.log(`[settings] Account deleted for user ${user.id}`);
  await supabase.auth.signOut();
  redirect("/");
}
