import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, Sparkles, BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryNav } from '@/components/browse/CategoryNav'
import { HeroSearchBar } from '@/components/home/HeroSearchBar'
import { HomeModTabs } from '@/components/home/HomeModTabs'
import { ModCard } from '@/components/mods/ModCard'
import {
  getAnthropicMods,
  getOfficialMods,
  getRecentlyAddedMods,
  getTopMods,
  getCategoryCounts,
  getModSubcategoryCounts,
  getTotalModCount,
  getLastUpdatedAt,
} from '@/lib/queries/mods'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: {
    absolute: 'ClaudeMod — Directory for Claude Code Mods, Skills & Tools',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
}

function formatUpdatedDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

export default async function HomePage() {
  const [
    claudeMods,
    officialMods,
    recentMods,
    topMods,
    categoryCounts,
    modSubcategoryCounts,
    totalCount,
    lastUpdatedAt,
  ] = await Promise.all([
    getAnthropicMods(24),
    getOfficialMods(),
    getRecentlyAddedMods(18),
    getTopMods(18),
    getCategoryCounts(),
    getModSubcategoryCounts(),
    getTotalModCount(),
    getLastUpdatedAt(),
  ])

  const totalClaudeModsCount = categoryCounts['mod'] ?? claudeMods.length
  const formattedLastUpdated = formatUpdatedDate(lastUpdatedAt)

  return (
    <>
      {/* Category Pills Sub-Bar — anchored directly beneath the top bar */}
      <div className="sticky top-14 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
        <div className="container mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-4">
          <CategoryNav counts={categoryCounts} totalCount={totalCount} className="flex-1" />
          <Link
            href="/browse"
            prefetch={false}
            className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground/80 hover:text-foreground transition-colors shrink-0 font-medium pl-2"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Compact Hero — keeps Mod cards visible above the fold */}
        <section className="py-6 sm:py-9 text-center">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <Image
              src="/mascot.png"
              alt="ClaudeMod mascot"
              width={72}
              height={72}
              className="w-12 h-12 sm:w-14 sm:h-14"
              priority
            />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              ClaudeMod
            </h1>
          </div>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto mb-5 px-2">
            {SITE_DESCRIPTION}
          </p>

          {/* Inline Search Bar */}
          <div className="mb-4">
            <HeroSearchBar totalCount={totalCount} />
          </div>

          {/* Stats + Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm text-muted-foreground">
            {totalCount > 0 && (
              <>
                <span>
                  <strong className="text-foreground font-semibold">{totalClaudeModsCount}</strong> Claude Mods
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  <strong className="text-foreground font-semibold">{totalCount}</strong> total extensions
                </span>
              </>
            )}
            {formattedLastUpdated && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Updated {formattedLastUpdated}
                </span>
              </>
            )}
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <div className="flex items-center gap-2">
              <Link href="/submit" prefetch={false}>
                <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs gap-1 cursor-pointer">
                  <Plus className="h-3.5 w-3.5" />
                  Submit
                </Button>
              </Link>
              <Link href="/install" prefetch={false}>
                <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs gap-1 text-muted-foreground cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5" />
                  Install Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Tabbed Mods Discovery */}
        <HomeModTabs
          claudeMods={claudeMods}
          totalClaudeModsCount={totalClaudeModsCount}
          modSubcategoryCounts={modSubcategoryCounts}
          recentMods={recentMods}
          topMods={topMods}
        />

        {/* Official Anthropic Example Mods Spotlight */}
        {officialMods.length > 0 && (
          <section className="pb-16 pt-2 border-t border-border/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pt-8">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Official Example Mods from Anthropic
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Reference in-process mods from <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">anthropics/claude-code-playground</code>
                </p>
              </div>
              <a
                href="https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
              >
                View playground repo <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {officialMods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
