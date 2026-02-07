import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    console.log(`[api/events] SSE proxy: userId=${user.id} runId=${params.runId}`);

    const response = await fetch(`${BACKEND_URL}/api/events/${params.runId}`, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
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
