#!/usr/bin/env node
/**
 * Resumable backlog approval emailer for ClaudeMod.
 *
 * Groups approved, un-notified user submissions (`submitted_by IS NOT NULL AND notified_at IS NULL`)
 * by submitter so multi-mod authors receive ONE clean email listing all their approved mods.
 *
 * Usage:
 *   node scripts/send-backlog-emails.mjs --dry-run
 *   node scripts/send-backlog-emails.mjs --test you@example.com
 *   node scripts/send-backlog-emails.mjs --send --limit 95
 */

import { execSync } from 'node:child_process'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

const SITE_URL = 'https://www.claudemod.com'
const BADGE_IMG_URL = 'https://img.shields.io/badge/Listed%20on-ClaudeMod-10b981?style=flat-square'

// Parse CLI flags
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run') || (!args.includes('--send') && !args.includes('--test'))
const isSend = args.includes('--send')
const testIdx = args.indexOf('--test')
const testRecipient = testIdx !== -1 ? args[testIdx + 1] : null
const limitIdx = args.indexOf('--limit')
const maxRecipients = limitIdx !== -1 ? Number.parseInt(args[limitIdx + 1], 10) : 95
const fromOverrideIdx = args.indexOf('--from')
const fromOverride = fromOverrideIdx !== -1 ? args[fromOverrideIdx + 1] : null

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local')
const env = {}
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL
const RESEND_API_KEY = process.env.RESEND_API_KEY || env.RESEND_API_KEY
const FROM_EMAIL = fromOverride || process.env.RESEND_FROM_EMAIL || env.RESEND_FROM_EMAIL || 'ClaudeMod <hello@claudemod.com>'
const REPLY_TO = process.env.RESEND_REPLY_TO || env.RESEND_REPLY_TO || 'hello@claudemod.com'

let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY
if (!serviceKey) {
  const apiKeysRaw = execSync(
    'npx supabase projects api-keys --project-ref liizqxiqrtlzzaxyebww -o json',
    { cwd: process.cwd(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
  )
  serviceKey = JSON.parse(apiKeysRaw).find((k) => k.name === 'service_role')?.api_key
}
if (!SUPABASE_URL || !serviceKey) throw new Error('Missing Supabase URL or service_role key')

const supabase = createClient(SUPABASE_URL, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const TOKEN_SECRET = process.env.NEWSLETTER_TOKEN_SECRET || env.NEWSLETTER_TOKEN_SECRET || serviceKey
const HMAC_DOMAIN = 'claudemod:newsletter-optin:v1:'
const OPT_IN_TTL_SECONDS = 90 * 24 * 60 * 60

function buildOptInUrl(email, source = 'backlog_email') {
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized || !TOKEN_SECRET) return `${SITE_URL}/#digest`
  const payload = {
    e: normalized,
    s: source,
    exp: Math.floor(Date.now() / 1000) + OPT_IN_TTL_SECONDS,
  }
  const payloadB64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const sig = crypto
    .createHmac('sha256', `${HMAC_DOMAIN}${TOKEN_SECRET}`)
    .update(payloadB64)
    .digest('base64url')
  return `${SITE_URL}/newsletter/opt-in?token=${encodeURIComponent(`${payloadB64}.${sig}`)}`
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildBacklogEmail(authorName, mods, recipientEmail) {
  const greeting = authorName ? `Hi ${authorName},` : 'Hi there,'
  const isMultiple = mods.length > 1
  const optInUrl = buildOptInUrl(recipientEmail, 'backlog_email')
  const subject = isMultiple
    ? `Your ${mods.length} submissions are live on ClaudeMod`
    : `${mods[0].name} is live on ClaudeMod`

  const multiLabel = mods.length === 2 ? 'both of your submissions' : `all ${mods.length} of your submissions`
  const intro = isMultiple
    ? `Sorry for the wait — I just finished a major overhaul of ClaudeMod (with copy-paste install commands and scanned permission badges), and ${multiLabel} are now live:`
    : `Sorry for the wait — I just finished a major overhaul of ClaudeMod (with copy-paste install commands and scanned permission badges), and ${mods[0].name} is now live:`

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
    intro,
    '',
    textItems,
    '',
    'We automatically pulled your README, GitHub stars, install commands, and static permission footprint. Just hit reply if anything on your listing looks off or if you want to update your description or screenshot.',
    '',
    'Thanks for building with the Claude Mod community,',
    'ClaudeMod',
    SITE_URL,
    '',
    `P.S. I'm starting a short weekly digest of the best new Claude Code mods and install commands — opt in with 1 click: ${optInUrl}`,
  ].join('\n')

  const htmlBlocks = mods
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
    <p style="margin: 0 0 16px;">${escapeHtml(intro)}</p>
    ${htmlBlocks}
    <p style="margin: 16px 0 14px; font-size: 14px; color: #3f3f46;">
      We automatically synced your README, GitHub stars, install commands, and static permission footprint. Just hit reply if anything looks off or if you'd like to update your listing.
    </p>
    <p style="margin: 0; font-size: 14px; color: #3f3f46;">
      Thanks for building with the Claude Mod community,<br />
      <strong>ClaudeMod</strong> · <a href="${SITE_URL}" style="color: #059669; text-decoration: none;">claudemod.com</a>
    </p>
    <p style="margin: 20px 0 0; padding-top: 14px; border-top: 1px solid #e4e4e7; font-size: 13px; color: #52525b;">
      P.S. I'm starting a short weekly digest of the best new Claude Code mods and install commands —
      <a href="${escapeHtml(optInUrl)}" style="color: #059669; font-weight: 500; text-decoration: underline;">opt in with 1 click</a>
      (unsubscribe anytime).
    </p>
  </body>
</html>`

  return { subject, text, html }
}

async function main() {
  // 1. Load all approved, un-notified user submissions
  const { data: mods, error } = await supabase
    .from('mods')
    .select('id, name, slug, author_name, author_github, submitted_by, created_at')
    .eq('status', 'approved')
    .not('submitted_by', 'is', null)
    .is('notified_at', null)
    .order('created_at', { ascending: false })

  if (error) throw error

  // 2. Load auth.users emails
  const userMap = new Map()
  let page = 1
  while (true) {
    const { data, error: uErr } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (uErr) throw uErr
    for (const u of data.users) {
      if (u.email) {
        userMap.set(u.id, {
          email: u.email,
          name: u.user_metadata?.full_name || u.user_metadata?.user_name || null,
        })
      }
    }
    if (data.users.length < 1000) break
    page++
  }

  // 3. Group mods by submitter
  const groups = new Map()
  for (const m of mods || []) {
    const user = userMap.get(m.submitted_by)
    if (!user?.email) continue
    if (!groups.has(m.submitted_by)) {
      groups.set(m.submitted_by, {
        userId: m.submitted_by,
        email: user.email,
        authorName: user.name || m.author_name || m.author_github,
        authorGithub: m.author_github,
        mods: [],
      })
    }
    groups.get(m.submitted_by).mods.push({ id: m.id, name: m.name, slug: m.slug })
  }

  const allGroups = [...groups.values()]
  console.log(`Un-notified approved submissions: ${mods.length}`)
  console.log(`Unique submitters ready to notify: ${allGroups.length}`)
  console.log(`Multi-mod authors grouped: ${allGroups.filter((g) => g.mods.length > 1).length}`)

  if (testRecipient) {
    if (!RESEND_API_KEY) throw new Error('Set RESEND_API_KEY in .env.local or env before running --test')
    const resend = new Resend(RESEND_API_KEY)
    const sample = allGroups[0] || {
      authorName: 'Builder',
      mods: [{ id: 'sample', name: 'Worklog', slug: 'worklog' }],
    }
    const { subject, text, html } = buildBacklogEmail(sample.authorName, sample.mods, testRecipient)
    console.log(`Sending test email to ${testRecipient} from ${FROM_EMAIL}...`)
    const { data, error: sErr } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [testRecipient],
      replyTo: REPLY_TO,
      subject: `[TEST] ${subject}`,
      html,
      text,
    })
    if (sErr) {
      console.error('Test send failed:', sErr)
      process.exit(1)
    }
    console.log('Test email sent! Resend ID:', data?.id)
    console.log(`Deliverability insights: https://resend.com/emails/${data?.id}?tab=insights`)
    return
  }

  if (isDryRun) {
    console.log('\n=== DRY RUN (no emails sent) ===')
    console.log(`Sender: ${FROM_EMAIL} | Reply-To: ${REPLY_TO}`)
    console.log(`Batch limit if --send run now: ${Math.min(maxRecipients, allGroups.length)} / ${allGroups.length}`)
    const single = allGroups.find((g) => g.mods.length === 1)
    const multi = allGroups.find((g) => g.mods.length > 1)
    if (single) {
      const p = buildBacklogEmail(single.authorName, single.mods, single.email)
      console.log('\n--- SAMPLE SINGLE-MOD EMAIL ---')
      console.log('Subject:', p.subject)
      console.log(p.text)
    }
    if (multi) {
      const p = buildBacklogEmail(multi.authorName, multi.mods, multi.email)
      console.log('\n--- SAMPLE MULTI-MOD GROUPED EMAIL ---')
      console.log('Subject:', p.subject)
      console.log(p.text)
    }
    return
  }

  if (isSend) {
    if (!RESEND_API_KEY) throw new Error('Set RESEND_API_KEY in .env.local or env before running --send')
    const resend = new Resend(RESEND_API_KEY)
    const batch = allGroups.slice(0, maxRecipients)
    console.log(`\nSending to ${batch.length} of ${allGroups.length} unique submitters (from: ${FROM_EMAIL})...`)

    let sent = 0
    let failed = 0
    for (const g of batch) {
      const { subject, text, html } = buildBacklogEmail(g.authorName, g.mods, g.email)
      const idempotencyKey = `backlog/${g.mods.map((m) => m.id).sort().join('_').slice(0, 200)}`

      const { data, error: sErr } = await resend.emails.send(
        {
          from: FROM_EMAIL,
          to: [g.email],
          replyTo: REPLY_TO,
          subject,
          html,
          text,
        },
        { idempotencyKey }
      )

      if (sErr) {
        failed++
        console.error(`  FAIL @${g.authorGithub} (${g.mods.length} mod(s)):`, sErr.message)
      } else {
        sent++
        const now = new Date().toISOString()
        await supabase
          .from('mods')
          .update({ notified_at: now })
          .in('id', g.mods.map((m) => m.id))
        console.log(`  SENT [${sent}/${batch.length}] @${g.authorGithub} (${g.mods.length} mod(s)) -> id=${data?.id}`)
      }

      // Pace below Resend's 2 req/sec default limit
      await new Promise((r) => setTimeout(r, 600))
    }

    console.log(`\nBatch complete! Sent: ${sent} | Failed: ${failed} | Remaining for next batch: ${allGroups.length - sent}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
