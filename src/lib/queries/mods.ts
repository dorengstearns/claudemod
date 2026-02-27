import { createClient } from '@/lib/supabase/server'
import type { Mod, ModWithRank } from '@/types/mod'
import type { CategoryValue } from '@/lib/constants'
import { PAGE_SIZE } from '@/lib/constants'

export async function getFeaturedMods(): Promise<Mod[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'approved')
    .order('vote_count', { ascending: false })
    .limit(6)

  if (error) {
    console.warn('getFeaturedMods error:', error)
    return []
  }
  return (data ?? []) as Mod[]
}

export async function getTopMods(limit = PAGE_SIZE): Promise<Mod[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('status', 'approved')
    .order('vote_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.warn('getTopMods error:', error)
    return []
  }
  return (data ?? []) as Mod[]
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
  const { data, error } = await supabase
    .from('mods')
    .select('*')
    .eq('category', category)
    .eq('status', 'approved')
    .neq('slug', excludeSlug)
    .order('vote_count', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []) as Mod[]
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
    p_sort: params.sort || 'votes',
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
