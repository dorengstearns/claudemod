import { createPublicClient as createClient } from '@/lib/supabase/public'
import type { Mod, ModWithRank } from '@/types/mod'
import type { CategoryValue } from '@/lib/constants'
import { PAGE_SIZE } from '@/lib/constants'

// Lean card projection that excludes heavy long_description (README) to minimize database egress by ~99%
export const MOD_CARD_FIELDS = 'id, slug, name, description, category, github_url, author_github, author_name, tags, vote_count, github_stars, is_featured, created_at, thumbnail_url'
const MOD_CARD_FIELDS_FALLBACK = 'id, slug, name, description, category, github_url, author_github, author_name, tags, vote_count, github_stars, is_featured, created_at'

async function fetchModCards(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryBuilder: (fields: string) => PromiseLike<{ data: any; error: any }>
): Promise<Mod[]> {
  let { data, error } = await queryBuilder(MOD_CARD_FIELDS)
  // Graceful fallback if migration 018 hasn't been executed yet in remote Supabase
  if (error && error.code === '42703') {
    const fallback = await queryBuilder(MOD_CARD_FIELDS_FALLBACK)
    data = fallback.data
    error = fallback.error
  }
  if (error) {
    console.warn('fetchModCards error:', error)
    return []
  }
  return (data ?? []) as Mod[]
}

export async function getFeaturedMods(): Promise<Mod[]> {
  const supabase = await createClient()
  return fetchModCards((fields) =>
    supabase
      .from('mods')
      .select(fields)
      .eq('is_featured', true)
      .eq('status', 'approved')
      .order('vote_count', { ascending: false })
      .order('github_stars', { ascending: false })
      .limit(6)
  )
}

export async function getAnthropicMods(limit = 6): Promise<Mod[]> {
  const supabase = await createClient()
  return fetchModCards((fields) =>
    supabase
      .from('mods')
      .select(fields)
      .eq('category', 'mod')
      .eq('status', 'approved')
      .order('github_stars', { ascending: false })
      .order('vote_count', { ascending: false })
      .limit(limit)
  )
}

export async function getRecentlyAddedMods(limit = 6): Promise<Mod[]> {
  const supabase = await createClient()
  return fetchModCards((fields) =>
    supabase
      .from('mods')
      .select(fields)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(limit)
  )
}

function getRepoKey(githubUrl: string): string {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
  if (!match) return githubUrl.toLowerCase()
  return `${match[1]}/${match[2]}`.toLowerCase()
}

export async function getTopMods(limit = PAGE_SIZE): Promise<Mod[]> {
  const supabase = await createClient()
  // Fetch tight pool of mods for repo deduplication without excessive over-fetching
  const fetchPool = Math.min(limit + 10, 36)
  const mods = await fetchModCards((fields) =>
    supabase
      .from('mods')
      .select(fields)
      .eq('status', 'approved')
      .order('github_stars', { ascending: false })
      .order('vote_count', { ascending: false })
      .limit(fetchPool)
  )

  const seenRepos = new Set<string>()
  const uniqueMods: Mod[] = []

  for (const mod of mods) {
    const repoKey = getRepoKey(mod.github_url)
    if (!seenRepos.has(repoKey)) {
      seenRepos.add(repoKey)
      uniqueMods.push(mod)
      if (uniqueMods.length >= limit) {
        break
      }
    }
  }

  return uniqueMods
}

export async function getModBySlug(slug: string): Promise<Mod | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (error) return null
  return data as Mod
}

export async function getAllModSlugs(): Promise<string[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('mods')
    .select('slug')
    .eq('status', 'approved')

  return (data ?? []).map((m) => m.slug)
}

export async function getRelatedMods(category: CategoryValue, excludeSlug: string, limit = 4): Promise<Mod[]> {
  const supabase = await createClient()
  return fetchModCards((fields) =>
    supabase
      .from('mods')
      .select(fields)
      .eq('category', category)
      .eq('status', 'approved')
      .neq('slug', excludeSlug)
      .order('vote_count', { ascending: false })
      .limit(limit)
  )
}

export async function searchMods(params: {
  query?: string
  category?: string
  sort?: string
  page?: number
}): Promise<ModWithRank[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('search_mods', {
    query: params.query || null,
    p_category: (params.category as CategoryValue) || null,
    p_sort: params.sort || 'stars',
    p_limit: PAGE_SIZE,
    p_offset: ((params.page ?? 1) - 1) * PAGE_SIZE,
  })

  if (error) {
    console.warn('searchMods error:', error)
    return []
  }
  return (data ?? []) as ModWithRank[]
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_category_counts')
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.category] = Number(row.count)
  }
  return counts
}

export async function getTotalModCount(): Promise<number> {
  const supabase = await createClient()
  const { count } = await supabase
    .from('mods')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
  return count ?? 0
}
