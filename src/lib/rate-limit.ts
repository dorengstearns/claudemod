// Simple in-memory sliding-window rate limiter.
// Best-effort protection: counters are per-process and do not persist across
// serverless cold starts or multiple Vercel instances. Sufficient for
// deterring casual abuse; upgrade to Upstash Redis for strict enforcement.

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

/**
 * Returns true if the request is allowed, false if the limit is exceeded.
 * @param key      Unique identifier for the rate-limit bucket (e.g. userId + endpoint)
 * @param limit    Maximum number of requests allowed in the window
 * @param windowMs Length of the window in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false

  entry.count++
  return true
}
