'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { enrichModFromGitHub } from '@/lib/mod-enrichment'
import { revalidatePath } from 'next/cache'

const ADMIN_USERNAME = process.env.ADMIN_GITHUB_USERNAME

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.user_name !== ADMIN_USERNAME) {
    throw new Error('Unauthorized')
  }
}

export async function approveMod(id: string) {
  await assertAdmin()
  const admin = createAdminClient()

  // Load submission details so we can enrich stars, README, thumbnail, install & permissions immediately
  const { data: mod } = await admin
    .from('mods')
    .select('id, slug, name, description, category, github_url, tags, repo_subpath')
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

  await admin
    .from('mods')
    .update({
      ...enriched,
      status: 'approved',
    })
    .eq('id', id)

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/browse')
  revalidatePath(`/mods/${mod.slug}`)
  revalidatePath('/sitemap.xml')
}

export async function rejectMod(id: string) {
  await assertAdmin()
  const admin = createAdminClient()
  await admin.from('mods').update({ status: 'rejected' }).eq('id', id)
  revalidatePath('/admin')
}
