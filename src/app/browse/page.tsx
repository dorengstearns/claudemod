import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SearchBar } from '@/components/browse/SearchBar'
import { FilterBar } from '@/components/browse/FilterBar'
import { ModGrid } from '@/components/mods/ModGrid'
import { ModCardSkeleton } from '@/components/mods/ModCardSkeleton'
import { searchMods, getCategoryCounts } from '@/lib/queries/mods'
import { CATEGORIES, SITE_NAME } from '@/lib/constants'
import type { CategoryValue } from '@/lib/constants'

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: BrowsePageProps): Promise<Metadata> {
  const params = await searchParams
  const category = CATEGORIES.find((c) => c.value === params.category)
  const title = category ? `${category.label} — Browse` : 'Browse Mods'
  return {
    title: `${title} — ${SITE_NAME}`,
    description: `Browse and search Claude Code ${category?.label.toLowerCase() ?? 'mods'}.`,
  }
}

async function ModResults({ q, category, sort, page }: { q?: string; category?: string; sort?: string; page?: string }) {
  const mods = await searchMods({
    query: q,
    category,
    sort,
    page: page ? parseInt(page) : 1,
  })
  return <ModGrid mods={mods} />
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams
  const { q, category, sort = 'votes', page } = params

  const categoryCounts = await getCategoryCounts()
  const activeCategory = CATEGORIES.find((c) => c.value === category)

  const resultLabel = q
    ? `Search results for "${q}"`
    : activeCategory
    ? `${activeCategory.label}`
    : 'All Mods'

  const totalInCategory = category ? (categoryCounts[category] ?? 0) : Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{resultLabel}</h1>
        {totalInCategory > 0 && (
          <p className="text-sm text-muted-foreground">
            {totalInCategory} mod{totalInCategory !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Suspense>
          <SearchBar className="flex-1" placeholder="Search by name, description, tags..." />
        </Suspense>
        <Suspense>
          <FilterBar activeCategory={category as CategoryValue | undefined} activeSort={sort} />
        </Suspense>
      </div>

      {/* Results */}
      <Suspense
        key={`${q}-${category}-${sort}-${page}`}
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <ModCardSkeleton key={i} />)}
          </div>
        }
      >
        <ModResults q={q} category={category} sort={sort} page={page} />
      </Suspense>
    </div>
  )
}
