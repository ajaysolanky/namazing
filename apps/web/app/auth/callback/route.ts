import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

function isLocalLikeHost(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === "localhost" || normalized === "0.0.0.0" || normalized.endsWith(".local")) return true;
  if (normalized === "::1") return true;
  if (/^127\./.test(normalized)) return true;
  if (/^10\./.test(normalized)) return true;
  if (/^192\.168\./.test(normalized)) return true;

  const private172 = normalized.match(/^172\.(\d{1,3})\./);
  if (private172) {
    const octet = Number(private172[1]);
    if (octet >= 16 && octet <= 31) return true;
  }

  return false;
}

function getOrigin(request: Request): string {
  const h = headers();
  const requestUrl = new URL(request.url);
  const hostHeader = h.get("host");
  const hostFromUrl = requestUrl.host;
  const currentHost = hostHeader || hostFromUrl;
  const currentHostname = currentHost.split(":")[0] ?? "";
  const currentProto = requestUrl.protocol.replace(":", "") || "https";

  // In local development or LAN-device testing, trust the current request host.
  if (process.env.NODE_ENV === "development" || isLocalLikeHost(currentHostname)) {
    return `${currentProto}://${currentHost}`;
  }

  const forwardedHost = h.get("x-forwarded-host");
  const forwardedProto = h.get("x-forwarded-proto") ?? currentProto;

  if (forwardedHost && !isLocalLikeHost(forwardedHost.split(":")[0] ?? "")) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return `${currentProto}://${currentHost}`;
}

function getNextPath(request: Request): string {
  const next = new URL(request.url).searchParams.get("next") ?? "/dashboard";
  return next.startsWith("/") ? next : "/dashboard";
}

export async function GET(request: Request) {
  const origin = getOrigin(request);
  const code = new URL(request.url).searchParams.get("code");
  const next = getNextPath(request);

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
