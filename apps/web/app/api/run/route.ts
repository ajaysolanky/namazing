import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
      { status: 502 }
    );
  }
}
