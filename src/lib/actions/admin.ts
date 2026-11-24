'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enrichModFromGitHub } from '@/lib/mod-enrichment'
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email'
import { revalidatePath } from 'next/cache'

const ADMIN_USERNAME = process.env.ADMIN_GITHUB_USERNAME

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.user_name !== ADMIN_USERNAME) {
    throw new Error('Unauthorized')
  }
}

async function resolveSubmitterEmail(
  admin: ReturnType<typeof createAdminClient>,
  submittedBy: string | null
): Promise<{ email: string; name: string | null } | null> {
  if (!submittedBy) return null
  try {
    const { data, error } = await admin.auth.admin.getUserById(submittedBy)
    if (error || !data?.user?.email) return null
    const name =
      (data.user.user_metadata?.full_name as string | undefined) ||
      (data.user.user_metadata?.user_name as string | undefined) ||
      null
    return { email: data.user.email, name }
  } catch {
    return null
  }
}

export async function approveMod(id: string, options?: { sendEmail?: boolean }) {
  await assertAdmin()
  const admin = createAdminClient()

  // Load submission details so we can enrich and notify submitter immediately
  const { data: mod } = await admin
    .from('mods')
    .select('id, slug, name, description, category, github_url, author_name, author_github, tags, repo_subpath, submitted_by, notified_at')
    .eq('id', id)
    .single()

  if (!mod) return

  let enriched: Record<string, unknown> = {}
  try {
    const meta = await enrichModFromGitHub({
      name: mod.name,
      description: mod.description,
      category: mod.category,
      github_url: mod.github_url,
      tags: mod.tags ?? [],
      repo_subpath: mod.repo_subpath,
    })
    enriched = {
      github_url: meta.github_url,
      ...(meta.github_stars !== undefined ? { github_stars: meta.github_stars } : {}),
      ...(meta.long_description !== undefined ? { long_description: meta.long_description } : {}),
      ...(meta.thumbnail_url !== undefined ? { thumbnail_url: meta.thumbnail_url } : {}),
      ...(meta.license !== undefined ? { license: meta.license } : {}),
      ...(meta.install_commands !== undefined ? { install_commands: meta.install_commands } : {}),
      ...(meta.permissions_level !== undefined ? { permissions_level: meta.permissions_level } : {}),
      ...(meta.permissions_labels !== undefined ? { permissions_labels: meta.permissions_labels } : {}),
      ...(meta.hooks_events !== undefined ? { hooks_events: meta.hooks_events } : {}),
      ...(meta.surfaces !== undefined ? { surfaces: meta.surfaces } : {}),
      ...(meta.mod_subcategory !== undefined ? { mod_subcategory: meta.mod_subcategory } : {}),
      ...(meta.tested_claude_version !== undefined ? { tested_claude_version: meta.tested_claude_version } : {}),
    }
  } catch (err) {
    console.warn('approveMod enrichment failed (approving anyway):', err)
  }

  let notifiedAt: string | undefined
  if (options?.sendEmail !== false && mod.submitted_by && !mod.notified_at) {
    const recipient = await resolveSubmitterEmail(admin, mod.submitted_by)
    if (recipient) {
      const res = await sendApprovalEmail({
        to: recipient.email,
        authorName: recipient.name ?? mod.author_name ?? mod.author_github,
        mods: [{ id: mod.id, name: mod.name, slug: mod.slug }],
        isBacklog: false,
        includeBcc: true,
      })
      if (res.ok) {
        notifiedAt = new Date().toISOString()
      }
    }
  }

  await admin
    .from('mods')
    .update({
      ...enriched,
      ...(notifiedAt ? { notified_at: notifiedAt } : {}),
      status: 'approved',
    })
    .eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/browse')
  revalidatePath(`/mods/${mod.slug}`)
  revalidatePath('/sitemap.xml')
}

export async function rejectMod(id: string, options?: { reason?: string; sendEmail?: boolean }) {
  await assertAdmin()
  const admin = createAdminClient()

  const { data: mod } = await admin
    .from('mods')
    .select('id, name, author_name, author_github, submitted_by, notified_at')
    .eq('id', id)
    .single()

  if (!mod) return

  const cleanReason = options?.reason?.trim() || null
  let notifiedAt: string | undefined

  if (options?.sendEmail !== false && mod.submitted_by && !mod.notified_at) {
    const recipient = await resolveSubmitterEmail(admin, mod.submitted_by)
    if (recipient) {
      const res = await sendRejectionEmail({
        to: recipient.email,
        authorName: recipient.name ?? mod.author_name ?? mod.author_github,
        modId: mod.id,
        modName: mod.name,
        reason: cleanReason,
        includeBcc: true,
      })
      if (res.ok) {
        notifiedAt = new Date().toISOString()
      }
    }
  }

  await admin
    .from('mods')
    .update({
      status: 'rejected',
      ...(cleanReason ? { rejection_reason: cleanReason } : {}),
      ...(notifiedAt ? { notified_at: notifiedAt } : {}),
    })
    .eq('id', id)

  revalidatePath('/admin')
}
