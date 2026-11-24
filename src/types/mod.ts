import type { CategoryValue, ModSubcategoryValue, PermissionLevel } from '@/lib/constants'

export type ModCategory = CategoryValue

export interface Mod {
  id: string
  slug: string
  name: string
  description: string
  long_description?: string | null
  thumbnail_url?: string | null
  category: ModCategory
  github_url: string
  author_github: string
  author_name: string | null
  tags: string[]
  vote_count: number
  github_stars: number
  is_featured: boolean
  is_official?: boolean
  install_commands?: string[]
  permissions_level?: PermissionLevel | null
  permissions_labels?: string[]
  hooks_events?: string[]
  surfaces?: string[]
  mod_subcategory?: ModSubcategoryValue | null
  tested_claude_version?: string | null
  license?: string | null
  repo_subpath?: string | null
  created_at: string
  updated_at?: string
}

export interface ModWithRank extends Mod {
  rank: number
}

export interface ModWithVoteState extends Mod {
  userHasVoted?: boolean
}
