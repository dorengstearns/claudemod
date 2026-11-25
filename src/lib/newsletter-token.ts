import crypto from 'node:crypto'
import { SITE_URL } from '@/lib/constants'

const HMAC_DOMAIN = 'claudemod:newsletter-optin:v1:'
const DEFAULT_TTL_SECONDS = 90 * 24 * 60 * 60 // 90 days
const STRICT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function getSigningSecret(secretOverride?: string): string | null {
  const raw =
    secretOverride?.trim() ||
    process.env.NEWSLETTER_TOKEN_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  return raw || null
}

function signPayload(payloadB64: string, secret: string): string {
  return crypto
    .createHmac('sha256', `${HMAC_DOMAIN}${secret}`)
    .update(payloadB64)
    .digest('base64url')
}

export function createNewsletterOptInToken(
  email: string,
  source = 'approval_email',
  secretOverride?: string
): string | null {
  const secret = getSigningSecret(secretOverride)
  if (!secret) return null

  const normalized = email.trim().toLowerCase()
  if (!STRICT_EMAIL_RE.test(normalized)) return null

  const payload = {
    e: normalized,
    s: source.slice(0, 40),
    exp: Math.floor(Date.now() / 1000) + DEFAULT_TTL_SECONDS,
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const sig = signPayload(payloadB64, secret)
  return `${payloadB64}.${sig}`
}

export function buildNewsletterOptInUrl(
  email: string,
  source = 'approval_email',
  secretOverride?: string
): string {
  const token = createNewsletterOptInToken(email, source, secretOverride)
  if (!token) return `${SITE_URL}/#digest`
  return `${SITE_URL}/newsletter/opt-in?token=${encodeURIComponent(token)}`
}

export type VerifyOptInResult =
  | { valid: true; email: string; source: string }
  | { valid: false; error: string }

export function verifyNewsletterOptInToken(
  token: string,
  secretOverride?: string
): VerifyOptInResult {
  const secret = getSigningSecret(secretOverride)
  if (!secret) {
    return { valid: false, error: 'Opt-in verification is temporarily unavailable.' }
  }

  const parts = token.split('.')
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, error: 'This opt-in link is invalid.' }
  }

  const [payloadB64, providedSig] = parts
  const expectedSig = signPayload(payloadB64, secret)

  const providedBuf = Buffer.from(providedSig, 'utf8')
  const expectedBuf = Buffer.from(expectedSig, 'utf8')
  if (
    providedBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return { valid: false, error: 'This opt-in link is invalid or tampered with.' }
  }

  let parsed: { e?: unknown; s?: unknown; exp?: unknown }
  try {
    parsed = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'))
  } catch {
    return { valid: false, error: 'This opt-in link is malformed.' }
  }

  if (typeof parsed.exp !== 'number' || parsed.exp < Math.floor(Date.now() / 1000)) {
    return { valid: false, error: 'This opt-in link has expired. You can subscribe anytime on claudemod.com.' }
  }

  if (typeof parsed.e !== 'string' || !STRICT_EMAIL_RE.test(parsed.e)) {
    return { valid: false, error: 'This opt-in link contains an invalid email address.' }
  }

  const source = typeof parsed.s === 'string' && parsed.s.trim() ? parsed.s.trim().slice(0, 40) : 'approval_email'
  return { valid: true, email: parsed.e, source }
}
