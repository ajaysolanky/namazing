import { NextRequest, NextResponse } from "next/server";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import { createClient } from "@/lib/supabase/server";
import { userOwnsRun } from "@/lib/run-access";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownsRun = await userOwnsRun(params.runId, user.id);
    if (!ownsRun) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log(`[api/result] Fetch: userId=${user.id} runId=${params.runId}`);

    const response = await fetch(`${BACKEND_URL}/api/result/${params.runId}`, {
      headers: {
        "Cache-Control": "no-store",
        ...getBackendAuthHeaders(),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[api/result] Proxy error for runId=${params.runId}:`, error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 502 }
    );
  }
}
