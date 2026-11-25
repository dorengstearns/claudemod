import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'
import { checkRateLimit } from '@/lib/rate-limit'

const ALLOWED_SOURCES = new Set(['home', 'home_sticky', 'browse', 'mod_sidebar', 'sponsor', 'site'])

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'Email address is too long.')
    .email('Enter an email address in the format you@example.com.')
    .refine((val) => {
      const domain = val.split('@')[1]
      return Boolean(domain && domain.includes('.') && !domain.endsWith('.'))
    }, 'Enter an email address in the format you@example.com.'),
  source: z.string().trim().max(40).optional(),
  website: z.string().optional(), // Honeypot field
})

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

async function parseRequestBody(request: Request): Promise<{ data: Record<string, unknown>; isFormPost: boolean } | null> {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      const json = await request.json()
      if (json && typeof json === 'object') {
        return { data: json as Record<string, unknown>, isFormPost: false }
      }
      return null
    } catch {
      return null
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    try {
      const formData = await request.formData()
      return {
        data: {
          email: String(formData.get('email') ?? ''),
          source: String(formData.get('source') ?? 'site'),
          website: String(formData.get('website') ?? ''),
        },
        isFormPost: true,
      }
    } catch {
      return null
    }
  }

  return null
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  // 8 subscribe attempts per IP per 10 minutes
  if (!checkRateLimit(`newsletter:${ip}`, 8, 10 * 60_000)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

  const parsedBody = await parseRequestBody(request)
  if (!parsedBody) {
    return NextResponse.json(
      { ok: false, error: 'Invalid request payload.' },
      { status: 400 }
    )
  }

  const { data: raw, isFormPost } = parsedBody

  // Silently accept honeypot submissions without storing anything
  if (typeof raw.website === 'string' && raw.website.trim().length > 0) {
    if (isFormPost) {
      return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
    }
    return NextResponse.json({ ok: true, message: "You're subscribed to the weekly ClaudeMod digest." })
  }

  const parsed = subscribeSchema.safeParse(raw)
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message || 'Please enter a valid email address.'
    return NextResponse.json({ ok: false, error: firstIssue }, { status: 400 })
  }

  const email = parsed.data.email
  const source = parsed.data.source && ALLOWED_SOURCES.has(parsed.data.source)
    ? parsed.data.source
    : 'site'

  const supabase = createServiceClient()

  const { data: existing, error: lookupError } = await supabase
    .from('newsletter_subscribers')
    .select('id, status')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    console.error('[newsletter] lookup error:', lookupError)
    return NextResponse.json(
      { ok: false, error: 'Could not save your subscription right now. Please try again.' },
      { status: 500 }
    )
  }

  if (existing) {
    if (existing.status === 'active') {
      if (isFormPost) {
        return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
      }
      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        message: "You're already on the weekly digest list.",
      })
    }

    const { error: reactivateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'active',
        source,
        unsubscribed_at: null,
        unsubscribe_token: crypto.randomUUID(),
      })
      .eq('id', existing.id)

    if (reactivateError) {
      console.error('[newsletter] reactivate error:', reactivateError)
      return NextResponse.json(
        { ok: false, error: 'Could not reactivate your subscription. Please try again.' },
        { status: 500 }
      )
    }

    if (isFormPost) {
      return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
    }
    return NextResponse.json({
      ok: true,
      message: "Welcome back — you're subscribed to the weekly digest.",
    })
  }

  const { error: insertError } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, source, status: 'active' })

  if (insertError) {
    // Handle concurrent duplicate insert race gracefully
    if (insertError.code === '23505') {
      if (isFormPost) {
        return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
      }
      return NextResponse.json({
        ok: true,
        alreadySubscribed: true,
        message: "You're already on the weekly digest list.",
      })
    }

    console.error('[newsletter] insert error:', insertError)
    return NextResponse.json(
      { ok: false, error: 'Could not save your subscription right now. Please try again.' },
      { status: 500 }
    )
  }

  if (isFormPost) {
    return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
  }

  return NextResponse.json(
    { ok: true, message: "You're in! Expect the top new Claude mods once a week." },
    { status: 201 }
  )
}
