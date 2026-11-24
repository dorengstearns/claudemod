import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

/**
 * Resend Inbound Receiving Webhook (`email.received`).
 * Verifies the Svix webhook signature and invisibly forwards incoming replies
 * sent to hello@claudemod.com straight to FORWARD_INBOUND_TO (your personal inbox).
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_INBOUND_API_KEY?.trim() || process.env.RESEND_API_KEY?.trim()
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET?.trim()
  const forwardTo = process.env.FORWARD_INBOUND_TO?.trim()
  const fromAddress = process.env.RESEND_FROM_EMAIL?.trim() || 'ClaudeMod <hello@claudemod.com>'

  if (!apiKey || !webhookSecret || !forwardTo) {
    console.warn('[resend-inbound] Missing RESEND_API_KEY / RESEND_WEBHOOK_SECRET / FORWARD_INBOUND_TO')
    return NextResponse.json({ error: 'Inbound forwarding not configured' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const payload = await request.text()

  let event: {
    type?: string
    data?: {
      email_id?: string
      from?: string
      to?: string[]
      subject?: string
    }
  }

  try {
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get('svix-id') ?? '',
        timestamp: request.headers.get('svix-timestamp') ?? '',
        signature: request.headers.get('svix-signature') ?? '',
      },
      webhookSecret,
    }) as typeof event
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type !== 'email.received' || !event.data?.email_id) {
    return NextResponse.json({ received: true })
  }

  // Loop protection: never re-forward emails originated from our own forwarding address
  const senderLower = (event.data.from ?? '').toLowerCase()
  if (senderLower.includes('hello@claudemod.com') && senderLower.includes(forwardTo.toLowerCase())) {
    return NextResponse.json({ skipped: 'loop_guard' })
  }

  const { data, error } = await resend.emails.receiving.forward({
    emailId: event.data.email_id,
    to: forwardTo,
    from: fromAddress,
  })

  if (error) {
    console.error('[resend-inbound] forward error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.info('[resend-inbound] forwarded email', event.data.email_id, '-> id:', data?.id)
  return NextResponse.json({ forwarded: true, id: data?.id })
}
