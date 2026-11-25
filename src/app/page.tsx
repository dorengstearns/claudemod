import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowRight, Sparkles } from 'lucide-react'
import { HeroSearchBar } from '@/components/home/HeroSearchBar'
import { HomeModTabs } from '@/components/home/HomeModTabs'
import { ModCard } from '@/components/mods/ModCard'
import { NewsletterCapture } from '@/components/newsletter/NewsletterCapture'
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
      {/* Slim horizontal weekly digest bar (sticky on md+, scrolls naturally on mobile) */}
      <NewsletterCapture variant="sticky-bar" source="home_sticky" />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Clean Minimal Hero */}
        <section className="py-8 sm:py-11 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-2.5">
            <Image
              src="/mascot.png"
              alt="ClaudeMod mascot"
              width={56}
              height={56}
              className="w-10 h-10 sm:w-11 sm:h-11"
              priority
            />
            <h1 className="text-3xl sm:text-[2.25rem] font-semibold tracking-tight leading-none">
              ClaudeMod
            </h1>
          </div>

          <p className="text-sm sm:text-[15px] text-muted-foreground max-w-lg mx-auto mb-5 leading-relaxed px-2">
            {SITE_DESCRIPTION}
          </p>

          <div className="mb-3.5">
            <HeroSearchBar totalCount={totalCount} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground/85">
            {totalCount > 0 && (
              <>
                <span className="tabular-nums">
                  <span className="text-foreground/90 font-medium">{totalClaudeModsCount}</span> Claude Mods
                </span>
                <span aria-hidden="true" className="text-border">·</span>
                <span className="tabular-nums">
                  <span className="text-foreground/90 font-medium">{totalCount}</span> extensions
                </span>
              </>
            )}
            {formattedLastUpdated && (
              <>
                <span aria-hidden="true" className="text-border">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Updated {formattedLastUpdated}
                </span>
              </>
            )}
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
          <section className="pb-12 pt-2 border-t border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 pt-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold tracking-tight flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  Official Example Mods from Anthropic
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Reference in-process mods from{' '}
                  <code className="text-xs font-mono bg-muted/70 px-1.5 py-0.5 rounded">
                    anthropics/claude-code-playground
                  </code>
                </p>
              </div>
              <a
                href="https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0 transition-colors"
              >
                View playground repo <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {officialMods.map((mod) => (
                <ModCard key={mod.id} mod={mod} />
              ))}
            </div>
          </section>
        )}

        {/* Bottom Weekly Digest Banner */}
        <div className="pb-14 pt-2">
          <NewsletterCapture variant="banner" source="home" />
        </div>
      </div>
    </>
  )
}
