import { NextRequest } from "next/server";
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
      return new Response("Unauthorized", { status: 401 });
    }

    const ownsRun = await userOwnsRun(params.runId, user.id);
    if (!ownsRun) {
      return new Response("Not found", { status: 404 });
    }

    console.log(`[api/events] SSE proxy: userId=${user.id} runId=${params.runId}`);

    const response = await fetch(`${BACKEND_URL}/api/events/${params.runId}`, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
        ...getBackendAuthHeaders(),
      },
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(`[api/events] Proxy error for runId=${params.runId}:`, error);
    return new Response("Failed to connect to backend", { status: 502 });
  }
}
