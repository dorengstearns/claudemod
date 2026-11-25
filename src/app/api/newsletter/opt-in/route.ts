import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { verifyNewsletterOptInToken } from '@/lib/newsletter-token'
import { checkRateLimit } from '@/lib/rate-limit'

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

async function extractToken(request: Request): Promise<{ token: string | null; isFormPost: boolean }> {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    try {
      const json = (await request.json()) as { token?: unknown }
      return { token: typeof json.token === 'string' ? json.token : null, isFormPost: false }
    } catch {
      return { token: null, isFormPost: false }
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    try {
      const formData = await request.formData()
      const token = formData.get('token')
      return { token: typeof token === 'string' ? token : null, isFormPost: true }
    } catch {
      return { token: null, isFormPost: true }
    }
  }

  return { token: null, isFormPost: false }
}

/**
 * POST /api/newsletter/opt-in
 * Verifies an HMAC-signed opt-in token from an approval/backlog email and subscribes the builder.
 */
export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (!checkRateLimit(`newsletter-optin:${ip}`, 15, 10 * 60_000)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again in a few minutes.' },
      { status: 429 }
    )
  }

  const { token, isFormPost } = await extractToken(request)
  if (!token) {
    return NextResponse.json({ ok: false, error: 'Missing opt-in token.' }, { status: 400 })
  }

  const verified = verifyNewsletterOptInToken(token)
  if (!verified.valid) {
    return NextResponse.json({ ok: false, error: verified.error }, { status: 400 })
  }

  const { email, source } = verified
  const supabase = createServiceClient()

  const { data: existing, error: lookupError } = await supabase
    .from('newsletter_subscribers')
    .select('id, status, unsubscribe_token')
    .eq('email', email)
    .maybeSingle()

  if (lookupError) {
    console.error('[newsletter-optin] lookup error:', lookupError)
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
        email,
        alreadySubscribed: true,
        unsubscribeToken: existing.unsubscribe_token,
        message: "You're already subscribed to the Weekly Claude Mods Digest.",
      })
    }

    const nextUnsubscribeToken = crypto.randomUUID()
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        status: 'active',
        source,
        unsubscribed_at: null,
        unsubscribe_token: nextUnsubscribeToken,
      })
      .eq('id', existing.id)

    if (updateError) {
      console.error('[newsletter-optin] reactivate error:', updateError)
      return NextResponse.json(
        { ok: false, error: 'Could not reactivate your subscription right now.' },
        { status: 500 }
      )
    }

    if (isFormPost) {
      return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
    }
    return NextResponse.json({
      ok: true,
      email,
      unsubscribeToken: nextUnsubscribeToken,
      message: "Welcome back — you're subscribed to the Weekly Claude Mods Digest.",
    })
  }

  const { data: inserted, error: insertError } = await supabase
    .from('newsletter_subscribers')
    .insert({ email, source, status: 'active' })
    .select('unsubscribe_token')
    .single()

  if (insertError) {
    console.error('[newsletter-optin] insert error:', insertError)
    return NextResponse.json(
      { ok: false, error: 'Could not save your subscription right now. Please try again.' },
      { status: 500 }
    )
  }

  if (isFormPost) {
    return NextResponse.redirect(new URL('/?subscribed=1', request.url), 303)
  }
  return NextResponse.json(
    {
      ok: true,
      email,
      unsubscribeToken: inserted?.unsubscribe_token,
      message: "You're subscribed to the Weekly Claude Mods Digest.",
    },
    { status: 201 }
  )
}
