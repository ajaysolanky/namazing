// For client-side fetches, use empty string (same-origin proxy)
// For server-side fetches (SSR), go directly to the backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined" ? "" : "http://localhost:4000");

// SSE connects through the Next.js proxy at /api/events/[runId] (same-origin)
// In local dev without the proxy, set NEXT_PUBLIC_SSE_BASE_URL=http://localhost:4000
export const SSE_BASE_URL = process.env.NEXT_PUBLIC_SSE_BASE_URL ??
  (typeof window !== "undefined" ? "" : "http://localhost:4000");
