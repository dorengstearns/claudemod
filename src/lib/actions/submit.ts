'use server'

import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { checkGitHubRepoExists } from '@/lib/github'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

const GITHUB_URL_REGEX = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/

const schema = z.object({
  github_url: z.string().regex(GITHUB_URL_REGEX, 'Must be a valid GitHub repository URL (e.g. https://github.com/owner/repo)'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be under 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be under 500 characters'),
  category: z.enum(['skill', 'mcp-server', 'command', 'agent', 'harness', 'hook', 'plugin', 'config'] as const, {
    error: 'Please select a valid category',
  }),
  tags: z.string().transform((s) =>
    s.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 10)
  ),
})

export type SubmitFormState = {
  error?: string | Record<string, string[]>
  success?: boolean
}

export async function submitMod(
  _prevState: SubmitFormState,
  formData: FormData
): Promise<SubmitFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin?next=/submit')
  }

  // 3 submissions per user per hour
  if (!checkRateLimit(`submit:${user.id}`, 3, 60 * 60_000)) {
    return { error: 'You have submitted too many mods recently. Please try again later.' }
  }

  const raw = {
    github_url: formData.get('github_url') as string,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    tags: formData.get('tags') as string ?? '',
  }

  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const repoExists = await checkGitHubRepoExists(parsed.data.github_url)
  if (!repoExists) {
    return { error: { github_url: ['Repository not found. Please check the URL and try again.'] } }
  }

  const slug = slugify(parsed.data.name)

  const { error } = await supabase.from('mods').insert({
    slug,
    name: parsed.data.name,
    description: parsed.data.description,
    category: parsed.data.category,
    github_url: parsed.data.github_url,
    tags: parsed.data.tags,
    author_github: (user.user_metadata?.user_name as string) ?? 'unknown',
    author_name: (user.user_metadata?.full_name as string) ?? null,
    submitted_by: user.id,
    status: 'pending',
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'A mod with this name or URL already exists.' }
    }
    console.error('submitMod error:', error)
    return { error: 'Submission failed. Please try again.' }
  }

  redirect('/browse?submitted=true')
}
