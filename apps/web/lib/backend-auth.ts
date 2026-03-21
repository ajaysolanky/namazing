import "server-only";

export function getBackendAuthHeaders() {
  const token = process.env.BACKEND_SHARED_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!token) {
    throw new Error("Missing BACKEND_SHARED_SECRET or SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    "x-namazing-backend-token": token,
  };
}
