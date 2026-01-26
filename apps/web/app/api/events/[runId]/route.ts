import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(
  request: NextRequest,
  { params }: { params: { runId: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/events/${params.runId}`, {
      headers: {
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });

    // Stream the SSE response through
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Failed to connect to backend", { status: 502 });
  }
}
