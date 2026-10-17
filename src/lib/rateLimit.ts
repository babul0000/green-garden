import { NextResponse } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store per action prefix
const storeMap = new Map<string, Map<string, RateLimitRecord>>();

export interface RateLimitConfig {
  limit: number;    // Maximum requests allowed within window
  windowMs: number; // Time window in milliseconds
  prefix?: string;  // Route bucket prefix
}

/**
 * Extract caller's IP address from proxy headers or connection
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Check if the request exceeds the rate limit
 */
export function checkRateLimit(
  req: Request,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const { limit, windowMs, prefix = "global" } = config;
  const ip = getClientIp(req);
  const now = Date.now();

  let ipStore = storeMap.get(prefix);
  if (!ipStore) {
    ipStore = new Map<string, RateLimitRecord>();
    storeMap.set(prefix, ipStore);
  }

  // Periodic pruning of expired records
  if (ipStore.size > 2000) {
    for (const [key, val] of ipStore.entries()) {
      if (val.resetAt < now) ipStore.delete(key);
    }
  }

  const record = ipStore.get(ip);

  if (!record || record.resetAt < now) {
    ipStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

/**
 * Return a standard 429 Too Many Requests response
 */
export function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: "Too many requests. Please wait a few moments before trying again.",
      retryAfter: retryAfterSec,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSec),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
