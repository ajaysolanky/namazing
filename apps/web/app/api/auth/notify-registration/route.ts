import { NextResponse } from "next/server";

import { notifyRegistrationIfNeeded } from "@/lib/auth/registration-notifier";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await notifyRegistrationIfNeeded({
      userId: user.id,
      email: user.email,
      displayName:
        user.user_metadata?.display_name ??
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        null,
      provider: user.app_metadata?.provider ?? null,
    });

    return NextResponse.json(result);
  } catch (notifyError) {
    console.error("[notify-registration] failed", notifyError);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}
