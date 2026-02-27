import type { CategoryValue } from '@/lib/constants'

export type ModCategory = CategoryValue

export interface Mod {
  id: string
  slug: string
  name: string
  description: string
  long_description: string | null
  category: ModCategory
  github_url: string
  author_github: string
  author_name: string | null
  tags: string[]
  vote_count: number
  github_stars: number
  is_featured: boolean
  created_at: string
  updated_at?: string
}

export interface ModWithRank extends Mod {
  rank: number
}

export interface ModWithVoteState extends Mod {
  userHasVoted?: boolean
}
