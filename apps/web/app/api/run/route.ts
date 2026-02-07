import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const DAILY_RUN_LIMIT = 5;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Enforce daily run limit
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);

    const { count, error: countError } = await supabase
      .from("runs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", todayUTC.toISOString());

    if (countError) {
      console.error(`[api/run] Failed to check daily run count for userId=${user.id}:`, countError);
      return NextResponse.json(
        { error: "Failed to check usage limits" },
        { status: 500 }
      );
    }

    const runsToday = count ?? 0;
    if (runsToday >= DAILY_RUN_LIMIT) {
      console.warn(`[api/run] Daily limit: userId=${user.id} runsToday=${runsToday}`);
      return NextResponse.json(
        { error: "Daily limit reached", dailyLimit: DAILY_RUN_LIMIT, runsToday },
        { status: 429 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, userId: user.id }),
    });

    const data = await response.json();
    console.log(`[api/run] Proxied: userId=${user.id} status=${response.status} runId=${data.runId}`);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[api/run] Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 502 }
    );
  }
}
