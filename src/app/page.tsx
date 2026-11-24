import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Search, ArrowRight, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryNav } from '@/components/browse/CategoryNav'
import { HomeModTabs } from '@/components/home/HomeModTabs'
import { ModCard } from '@/components/mods/ModCard'
import {
  getAnthropicMods,
  getOfficialMods,
  getRecentlyAddedMods,
  getTopMods,
  getCategoryCounts,
  getTotalModCount,
  getLastUpdatedAt,
} from '@/lib/queries/mods'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'ClaudeMod — Directory for Claude Code Mods, Skills & Tools',
  description: SITE_DESCRIPTION,
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
  const [claudeMods, officialMods, recentMods, topMods, categoryCounts, totalCount, lastUpdatedAt] = await Promise.all([
    getAnthropicMods(24),
    getOfficialMods(),
    getRecentlyAddedMods(18),
    getTopMods(18),
    getCategoryCounts(),
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
        {/* Hero */}
        <section className="py-10 sm:py-14 md:py-18 text-center">
          <Image
            src="/mascot.png"
            alt="ClaudeMod mascot"
            width={160}
            height={160}
            className="mx-auto mb-3 w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
            priority
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
            ClaudeMod
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            {SITE_DESCRIPTION}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
            <Link href="/browse?category=mod" prefetch={false} className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto cursor-pointer">
                <Search className="h-4 w-4" />
                Browse {totalClaudeModsCount} Mods
              </Button>
            </Link>
            <Link href="/submit" prefetch={false} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto cursor-pointer">
                Submit a Mod
              </Button>
            </Link>
            <Link href="/install" prefetch={false} className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="gap-1.5 w-full sm:w-auto cursor-pointer text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                Install Guide
              </Button>
            </Link>
          </div>

          {/* Stats + Live Freshness Indicator */}
          {totalCount > 0 && (
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground font-semibold">{totalClaudeModsCount}</strong> in-process Claude Mods
              </span>
              <span aria-hidden="true">·</span>
              <span>
                <strong className="text-foreground font-semibold">{totalCount}</strong> total curated extensions
              </span>
              {formattedLastUpdated && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    Updated {formattedLastUpdated}
                  </span>
                </>
              )}
            </div>
          )}
        </section>

        {/* Tabbed Mods Discovery */}
        <HomeModTabs
          claudeMods={claudeMods}
          totalClaudeModsCount={totalClaudeModsCount}
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
