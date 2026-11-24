import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SearchBar } from '@/components/browse/SearchBar'
import { FilterBar } from '@/components/browse/FilterBar'
import { CategoryNav } from '@/components/browse/CategoryNav'
import { ModGrid } from '@/components/mods/ModGrid'
import { ModCardSkeleton } from '@/components/mods/ModCardSkeleton'
import { Button } from '@/components/ui/button'
import {
  searchMods,
  getCategoryCounts,
  getModSubcategoryCounts,
  getFilteredModCount,
} from '@/lib/queries/mods'
import { CATEGORIES, MOD_SUBCATEGORIES, PAGE_SIZE, SITE_NAME } from '@/lib/constants'
import type { CategoryValue } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const revalidate = 300

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sub?: string
    permission?: string
    surface?: string
    sort?: string
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: BrowsePageProps): Promise<Metadata> {
  const params = await searchParams
  const category = CATEGORIES.find((c) => c.value === params.category)
  const subcategory = MOD_SUBCATEGORIES.find((s) => s.value === params.sub)

  const title = subcategory
    ? `${subcategory.label} Claude Mods`
    : category
    ? `${category.label} — Browse`
    : 'Browse Mods'

  const description = subcategory
    ? `Browse curated ${subcategory.label.toLowerCase()} in-process mods for Claude Code — ${subcategory.description.toLowerCase()}.`
    : `Browse and search Claude Code ${category?.label.toLowerCase() ?? 'mods, skills, MCP servers, and plugins'}.`

  return {
    title: `${title} — ${SITE_NAME}`,
    description,
  }
}

function buildBrowseHref(
  base: Record<string, string | undefined>,
  overrides: Record<string, string | null | undefined>
) {
  const sp = new URLSearchParams()
  const merged = { ...base, ...overrides }
  for (const [k, v] of Object.entries(merged)) {
    if (v && v !== '') sp.set(k, v)
  }
  const qs = sp.toString()
  return qs ? `/browse?${qs}` : '/browse'
}

async function ModResults({
  q,
  category,
  sub,
  permission,
  surface,
  sort,
  pageNum,
  totalFiltered,
  baseParams,
}: {
  q?: string
  category?: string
  sub?: string
  permission?: string
  surface?: string
  sort?: string
  pageNum: number
  totalFiltered: number
  baseParams: Record<string, string | undefined>
}) {
  const mods = await searchMods({
    query: q,
    category,
    subcategory: sub,
    permission,
    surface,
    sort,
    page: pageNum,
  })

  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

  return (
    <>
      <ModGrid mods={mods} />

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between gap-4"
        >
          <div>
            {pageNum > 1 ? (
              <Link
                href={buildBrowseHref(baseParams, { page: pageNum === 2 ? null : String(pageNum - 1) })}
                prefetch={false}
              >
                <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1.5">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
          </div>

          <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
            Page <strong className="text-foreground">{pageNum}</strong> of {totalPages}
          </span>

          <div>
            {pageNum < totalPages ? (
              <Link
                href={buildBrowseHref(baseParams, { page: String(pageNum + 1) })}
                prefetch={false}
              >
                <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1.5">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </nav>
      )}
    </>
  )
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams
  const { q, category, sub, permission, surface, sort = 'stars', page } = params
  const pageNum = Math.max(1, Number.parseInt(page || '1', 10) || 1)

  const [categoryCounts, subcategoryCounts, totalFiltered] = await Promise.all([
    getCategoryCounts(),
    category === 'mod' ? getModSubcategoryCounts() : Promise.resolve({} as Record<string, number>),
    getFilteredModCount({ query: q, category, subcategory: sub, permission, surface }),
  ])

  const activeCategory = CATEGORIES.find((c) => c.value === category)
  const activeSubcategory = MOD_SUBCATEGORIES.find((s) => s.value === sub)

  const resultLabel = q
    ? `Search results for "${q}"`
    : activeSubcategory
    ? `${activeSubcategory.label} Mods`
    : activeCategory
    ? activeCategory.label
    : 'All Mods & Tools'

  const baseParams = { q, category, sub, permission, surface, sort: sort === 'stars' ? undefined : sort }
  const totalModsCount = categoryCounts['mod'] ?? 0
  const totalAllCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0)

  return (
    <>
      {/* Unified Category Pills Sub-Bar — matches homepage */}
      <div className="sticky top-14 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
        <div className="container mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-4">
          <CategoryNav
            counts={categoryCounts}
            totalCount={totalAllCount}
            activeCategory={category ?? 'all'}
            className="flex-1"
          />
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-7">
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold mb-1">{resultLabel}</h1>
          <p className="text-sm text-muted-foreground">
            {totalFiltered.toLocaleString()} {totalFiltered === 1 ? 'listing' : 'listings'}
            {activeSubcategory ? ` · ${activeSubcategory.description}` : ''}
          </p>
        </div>
        {category === 'mod' && (
          <Link
            href="/install"
            prefetch={false}
            className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            How to install &amp; audit Claude Mods →
          </Link>
        )}
      </div>

      {/* Mod Sub-Category Pills (shown when browsing in-process Mods) */}
      {category === 'mod' && (
        <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5">
          <Link
            href={buildBrowseHref(baseParams, { sub: null, page: null })}
            prefetch={false}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 border',
              !sub
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 border-border/50'
            )}
          >
            <span>All Mods</span>
            {totalModsCount > 0 && (
              <span className="text-[10px] opacity-70 tabular-nums">{totalModsCount}</span>
            )}
          </Link>

          {MOD_SUBCATEGORIES.map((sc) => {
            const count = subcategoryCounts[sc.value] ?? 0
            if (count === 0) return null
            const isActive = sub === sc.value
            return (
              <Link
                key={sc.value}
                href={buildBrowseHref(baseParams, { sub: sc.value, page: null })}
                prefetch={false}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shrink-0 border',
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-semibold'
                    : 'bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 border-border/50'
                )}
              >
                <span>{sc.label}</span>
                <span className="text-[10px] opacity-70 tabular-nums">{count}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        <Suspense>
          <SearchBar className="flex-1" placeholder="Search by name, description, author, tags..." autoFocus={false} />
        </Suspense>
        <Suspense>
          <FilterBar
            activeCategory={category as CategoryValue | undefined}
            activeSubcategory={sub}
            activePermission={permission}
            activeSurface={surface}
            activeSort={sort}
          />
        </Suspense>
      </div>

      {/* Results */}
      <Suspense
        key={`${q}-${category}-${sub}-${permission}-${surface}-${sort}-${pageNum}`}
        fallback={
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-4">
                <ModCardSkeleton />
              </div>
            ))}
          </div>
        }
      >
        <ModResults
          q={q}
          category={category}
          sub={sub}
          permission={permission}
          surface={surface}
          sort={sort}
          pageNum={pageNum}
          totalFiltered={totalFiltered}
          baseParams={baseParams}
        />
      </Suspense>
    </div>
    </>
  )
}
