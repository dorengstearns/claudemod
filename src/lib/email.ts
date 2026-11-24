import { Resend } from 'resend'
import { SITE_URL } from '@/lib/constants'

const BADGE_IMG_URL = 'https://img.shields.io/badge/Listed%20on-ClaudeMod-10b981?style=flat-square'

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getSenderConfig() {
  return {
    from: process.env.RESEND_FROM_EMAIL?.trim() || 'ClaudeMod <hello@claudemod.com>',
    replyTo: process.env.RESEND_REPLY_TO?.trim() || 'hello@claudemod.com',
    bcc: process.env.ADMIN_BCC_EMAIL?.trim() || undefined,
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export interface ApprovedModSummary {
  id: string
  name: string
  slug: string
}

export interface EmailSendResult {
  ok: boolean
  id?: string
  skipped?: boolean
  error?: string
}

export function buildApprovalEmailContent(params: {
  authorName?: string | null
  mods: ApprovedModSummary[]
  isBacklog?: boolean
}) {
  const { authorName, mods, isBacklog = false } = params
  const greeting = authorName ? `Hi ${authorName},` : 'Hi there,'
  const isMultiple = mods.length > 1

  const subject = isMultiple
    ? `Your ${mods.length} submissions are live on ClaudeMod`
    : `${mods[0].name} is live on ClaudeMod`

  const multiLabel = mods.length === 2 ? 'both of your submissions' : `all ${mods.length} of your submissions`
  const introLine = isBacklog
    ? isMultiple
      ? `Sorry for the wait — I just finished a major overhaul of ClaudeMod (with copy-paste install commands and scanned permission badges), and ${multiLabel} are now live:`
      : `Sorry for the wait — I just finished a major overhaul of ClaudeMod (with copy-paste install commands and scanned permission badges), and ${mods[0].name} is now live:`
    : isMultiple
    ? `Good news — ${multiLabel} have been approved and are now live on ClaudeMod:`
    : `Good news — ${mods[0].name} has been approved and is now live on ClaudeMod:`

  const textItems = mods
    .map((m) => {
      const url = `${SITE_URL}/mods/${m.slug}`
      const badgeMd = `[![Listed on ClaudeMod](${BADGE_IMG_URL})](${url})`
      return isMultiple
        ? `- ${m.name}\n  Live page: ${url}\n  README badge: ${badgeMd}`
        : `Live page: ${url}\n\nOptional "Listed on ClaudeMod" badge for your GitHub README:\n${badgeMd}`
    })
    .join('\n\n')

  const text = [
    greeting,
    '',
    introLine,
    '',
    textItems,
    '',
    'We automatically pulled your README, GitHub stars, install commands, and static permission footprint. Just hit reply if anything on your listing looks off or if you want to update your description or screenshot.',
    '',
    'Thanks for building for the Claude Code community,',
    'ClaudeMod',
    SITE_URL,
  ].join('\n')

  const htmlModBlocks = mods
    .map((m) => {
      const url = `${SITE_URL}/mods/${m.slug}`
      const badgeMd = `[![Listed on ClaudeMod](${BADGE_IMG_URL})](${url})`
      return `
        <div style="margin: 14px 0; padding: 14px 16px; border: 1px solid #e4e4e7; border-radius: 8px; background: #fafafa;">
          <div style="font-weight: 600; font-size: 15px; color: #18181b; margin-bottom: 4px;">
            ${escapeHtml(m.name)}
          </div>
          <div style="margin-bottom: 10px;">
            <a href="${escapeHtml(url)}" style="color: #059669; text-decoration: none; font-size: 14px;">${escapeHtml(url)}</a>
          </div>
          <div style="font-size: 12px; color: #52525b; margin-bottom: 6px;">
            Optional README badge:
          </div>
          <div style="margin-bottom: 8px;">
            <a href="${escapeHtml(url)}" style="text-decoration: none; display: inline-block; font-family: Verdana, Geneva, DejaVu Sans, sans-serif; font-size: 11px; line-height: 1; border-radius: 3px; overflow: hidden;">
              <span style="display: inline-block; background: #555555; color: #ffffff; padding: 5px 8px;">Listed on</span><span style="display: inline-block; background: #10b981; color: #ffffff; padding: 5px 8px; font-weight: 600;">ClaudeMod</span>
            </a>
          </div>
          <code style="display: block; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; color: #27272a; background: #f4f4f5; padding: 8px 10px; border-radius: 6px; word-break: break-all;">${escapeHtml(badgeMd)}</code>
        </div>`
    })
    .join('\n')

  const html = `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; line-height: 1.55; max-width: 560px; margin: 0 auto; padding: 24px 16px;">
    <p style="margin: 0 0 14px;">${escapeHtml(greeting)}</p>
    <p style="margin: 0 0 16px;">${escapeHtml(introLine)}</p>
    ${htmlModBlocks}
    <p style="margin: 16px 0 14px; font-size: 14px; color: #3f3f46;">
      We automatically synced your README, GitHub stars, install commands, and static permission footprint. Just hit reply if anything looks off or if you'd like to update your listing.
    </p>
    <p style="margin: 0; font-size: 14px; color: #3f3f46;">
      Thanks for building for the Claude Code community,<br />
      <strong>ClaudeMod</strong> · <a href="${SITE_URL}" style="color: #059669; text-decoration: none;">claudemod.com</a>
    </p>
  </body>
</html>`

  return { subject, text, html }
}

export async function sendApprovalEmail(params: {
  to: string
  authorName?: string | null
  mods: ApprovedModSummary[]
  isBacklog?: boolean
  includeBcc?: boolean
}): Promise<EmailSendResult> {
  const resend = getResendClient()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not configured; skipping approval email.')
    return { ok: false, skipped: true, error: 'RESEND_API_KEY not configured' }
  }
  if (!params.mods.length) return { ok: false, skipped: true, error: 'No mods provided' }

  const sender = getSenderConfig()
  const { subject, text, html } = buildApprovalEmailContent(params)
  const idempotencyKey = `approval/${params.mods.map((m) => m.id).sort().join('_').slice(0, 200)}`

  const { data, error } = await resend.emails.send(
    {
      from: sender.from,
      to: [params.to],
      replyTo: sender.replyTo,
      ...(params.includeBcc && sender.bcc && sender.bcc.toLowerCase() !== params.to.toLowerCase()
        ? { bcc: [sender.bcc] }
        : {}),
      subject,
      html,
      text,
    },
    { idempotencyKey }
  )

  if (error) {
    console.error('[email] approval send error:', error)
    return { ok: false, error: error.message }
  }

  console.info('[email] approval sent:', data?.id, '-> mods:', params.mods.map((m) => m.slug).join(', '))
  return { ok: true, id: data?.id }
}

export async function sendRejectionEmail(params: {
  to: string
  authorName?: string | null
  modId: string
  modName: string
  reason?: string | null
  includeBcc?: boolean
}): Promise<EmailSendResult> {
  const resend = getResendClient()
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not configured; skipping rejection email.')
    return { ok: false, skipped: true, error: 'RESEND_API_KEY not configured' }
  }

  const sender = getSenderConfig()
  const greeting = params.authorName ? `Hi ${params.authorName},` : 'Hi there,'
  const cleanReason = params.reason?.trim()
  const subject = `Update on your ClaudeMod submission: ${params.modName}`

  const reasonText = cleanReason
    ? `Reason: ${cleanReason}`
    : `We're keeping the directory tightly curated around working, developer-focused Claude Code extensions and decided not to list this one right now.`

  const text = [
    greeting,
    '',
    `Thanks for submitting ${params.modName} to ClaudeMod. After reviewing the repository, we won't be adding it to the directory at this time.`,
    '',
    reasonText,
    '',
    'If you think we missed something or make updates to the project, feel free to reply to this email or submit again anytime.',
    '',
    'Best,',
    'ClaudeMod',
    SITE_URL,
  ].join('\n')

  const html = `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #18181b; line-height: 1.55; max-width: 560px; margin: 0 auto; padding: 24px 16px;">
    <p style="margin: 0 0 14px;">${escapeHtml(greeting)}</p>
    <p style="margin: 0 0 14px;">
      Thanks for submitting <strong>${escapeHtml(params.modName)}</strong> to ClaudeMod. After reviewing the repository, we won't be adding it to the directory at this time.
    </p>
    <p style="margin: 0 0 16px; padding: 12px 14px; border-left: 3px solid #d4d4d8; background: #fafafa; font-size: 14px; color: #3f3f46;">
      ${escapeHtml(reasonText)}
    </p>
    <p style="margin: 0 0 14px; font-size: 14px; color: #3f3f46;">
      If you think we missed something or make updates to the project, feel free to reply to this email or submit again anytime.
    </p>
    <p style="margin: 0; font-size: 14px; color: #3f3f46;">
      Best,<br />
      <strong>ClaudeMod</strong> · <a href="${SITE_URL}" style="color: #059669; text-decoration: none;">claudemod.com</a>
    </p>
  </body>
</html>`

  const { data, error } = await resend.emails.send(
    {
      from: sender.from,
      to: [params.to],
      replyTo: sender.replyTo,
      ...(params.includeBcc && sender.bcc && sender.bcc.toLowerCase() !== params.to.toLowerCase()
        ? { bcc: [sender.bcc] }
        : {}),
      subject,
      html,
      text,
    },
    { idempotencyKey: `rejection/${params.modId}` }
  )

  if (error) {
    console.error('[email] rejection send error:', error)
    return { ok: false, error: error.message }
  }

  console.info('[email] rejection sent:', data?.id, '-> mod:', params.modName)
  return { ok: true, id: data?.id }
}
