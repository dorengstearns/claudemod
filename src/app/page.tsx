import type { Metadata } from 'next'
import { ArrowRight } from 'lucide-react'
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
      {/* Slim emerald weekly digest bar (flush sticky on md+, scrolls naturally on mobile) */}
      <NewsletterCapture variant="sticky-bar" source="home_sticky" />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Compact Editorial Directory Masthead — opens straight into live mods */}
        <section className="pt-6 pb-5 sm:pt-8 sm:pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
            <div className="max-w-2xl space-y-1.5">
              <h1 className="text-2xl sm:text-[2rem] font-semibold tracking-[-0.03em] leading-tight text-foreground">
                Claude Code mod directory
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Curated plugins, skills, MCP servers, and hooks from the community.
                {formattedLastUpdated ? ` Updated ${formattedLastUpdated}.` : ''}
              </p>
            </div>

            <div className="w-full lg:w-[400px] shrink-0">
              <HeroSearchBar totalCount={totalCount} />
            </div>
          </div>
        </section>

        {/* Live Directory Grid */}
        <HomeModTabs
          claudeMods={claudeMods}
          totalClaudeModsCount={totalClaudeModsCount}
          modSubcategoryCounts={modSubcategoryCounts}
          recentMods={recentMods}
          topMods={topMods}
        />

        {/* Official Anthropic Reference Mods */}
        {officialMods.length > 0 && (
          <section className="py-10 border-t border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <h2 className="text-base font-semibold tracking-[-0.015em] text-foreground">
                  Official example mods from Anthropic
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Reference in-process mods from{' '}
                  <code className="text-[13px] font-mono bg-muted px-1.5 py-0.5 rounded">
                    anthropics/claude-code-playground
                  </code>
                </p>
              </div>
              <a
                href="https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0 transition-colors"
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

        {/* Deliberate Emerald Weekly Digest Band */}
        <div className="pb-14 pt-2">
          <NewsletterCapture variant="banner" source="home" />
        </div>
      </div>
    </>
  )
}
