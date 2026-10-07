import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryNav } from '@/components/browse/CategoryNav'
import { HomeModTabs } from '@/components/home/HomeModTabs'
import { getAnthropicMods, getRecentlyAddedMods, getTopMods, getCategoryCounts, getTotalModCount } from '@/lib/queries/mods'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'ClaudeMod — Directory for Claude Code Mods, Skills & Tools',
  description: SITE_DESCRIPTION,
}

export default async function HomePage() {
  const [anthropicMods, recentMods, topMods, categoryCounts, totalCount] = await Promise.all([
    getAnthropicMods(20),
    getRecentlyAddedMods(18),
    getTopMods(18),
    getCategoryCounts(),
    getTotalModCount(),
  ])

  return (
    <>
      {/* Category Pills Sub-Bar — anchored directly beneath the top bar */}
      <div className="sticky top-14 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
        <div className="container mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-4">
          <CategoryNav counts={categoryCounts} totalCount={totalCount} className="flex-1" />
          <Link
            href="/browse"
            className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground/80 hover:text-foreground transition-colors shrink-0 font-medium pl-2"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Hero */}
        <section className="py-10 sm:py-14 md:py-20 text-center">
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
            <Link href="/browse" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 w-full sm:w-auto cursor-pointer">
                <Search className="h-4 w-4" />
                Browse Mods
              </Button>
            </Link>
            <Link href="/submit" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto cursor-pointer">
                Submit a Mod
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-muted-foreground">
              {totalCount} mod{totalCount !== 1 ? 's' : ''} and growing
            </p>
          )}
        </section>

        {/* Tabbed Mods Discovery */}
        <HomeModTabs
          anthropicMods={anthropicMods}
          recentMods={recentMods}
          topMods={topMods}
        />
      </div>
    </>
  )
}
