import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/service'

const tokenSchema = z.string().uuid()

async function extractToken(request: Request): Promise<string | null> {
  const url = new URL(request.url)
  const queryToken = url.searchParams.get('token')
  if (queryToken) return queryToken

  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      const json = (await request.json()) as { token?: unknown }
      return typeof json.token === 'string' ? json.token : null
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
      const token = formData.get('token')
      return typeof token === 'string' ? token : null
    } catch {
      return null
    }
  }

  return null
}

/**
 * POST /api/newsletter/unsubscribe
 * Supports both our confirmation page form POST and RFC 8058 List-Unsubscribe-Post one-click headers.
 */
export async function POST(request: Request) {
  const rawToken = await extractToken(request)
  const parsed = tokenSchema.safeParse(rawToken)

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or missing unsubscribe link.' },
      { status: 400 }
    )
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('unsubscribe_token', parsed.data)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[newsletter] unsubscribe error:', error)
    return NextResponse.json(
      { ok: false, error: 'Could not process unsubscribe right now. Please try again.' },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { ok: false, error: 'This unsubscribe link is invalid or has already expired.' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ok: true,
    message: "You've been unsubscribed from the ClaudeMod weekly digest.",
  })
}
