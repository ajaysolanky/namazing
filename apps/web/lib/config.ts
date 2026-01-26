// For client-side fetches, use empty string (same-origin proxy)
// For server-side fetches (SSR), go directly to the backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== "undefined" ? "" : "http://localhost:4000");

// SSE needs a direct connection to the backend (can't be proxied through Next.js)
export const SSE_BASE_URL = process.env.NEXT_PUBLIC_SSE_BASE_URL ??
  (typeof window !== "undefined"
    ? `http://${window.location.hostname}:4000`
    : "http://localhost:4000");
