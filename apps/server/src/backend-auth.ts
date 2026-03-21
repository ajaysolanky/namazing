import type { Request, Response, NextFunction } from "express";

function getConfiguredBackendToken() {
  return process.env.BACKEND_SHARED_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

export function getBackendAuthToken() {
  return getConfiguredBackendToken();
}

export function requireTrustedBackendRequest(req: Request, res: Response, next: NextFunction) {
  const configured = getConfiguredBackendToken();
  if (!configured) {
    console.error("[backend-auth] Missing BACKEND_SHARED_SECRET or SUPABASE_SERVICE_ROLE_KEY");
    return res.status(500).json({ error: "Backend auth is not configured" });
  }

  const provided = req.header("x-namazing-backend-token");
  if (provided !== configured) {
    return res.status(401).json({ error: "Unauthorized backend request" });
  }

  next();
}
