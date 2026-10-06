import Link from 'next/link'
import Image from 'next/image'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CategoryNav } from '@/components/browse/CategoryNav'
import { HomeModTabs } from '@/components/home/HomeModTabs'
import { FaqSection } from '@/components/home/FaqSection'
import { getAnthropicMods, getRecentlyAddedMods, getTopMods, getCategoryCounts, getTotalModCount } from '@/lib/queries/mods'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 300

export default async function HomePage() {
  const [anthropicMods, recentMods, topMods, categoryCounts, totalCount] = await Promise.all([
    getAnthropicMods(20),
    getRecentlyAddedMods(18),
    getTopMods(18),
    getCategoryCounts(),
    getTotalModCount(),
  ])

  return (
    <div className="container mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <Image
          src="/mascot.png"
          alt="ClaudeMod mascot"
          width={200}
          height={200}
          className="mx-auto mb-4"
          priority
        />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          ClaudeMod
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {SITE_DESCRIPTION}
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link href="/browse">
            <Button size="lg" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Mods
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="lg" variant="outline">
              Submit a Mod
            </Button>
          </Link>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <p className="mt-6 text-sm text-muted-foreground">
            {totalCount} mod{totalCount !== 1 ? 's' : ''} and growing
          </p>
        )}
      </section>

      {/* Categories (Secondary Filter Strip) */}
      <section className="pb-8 pt-1">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Browse by Category
          </span>
          <Link href="/browse" className="text-xs text-muted-foreground/70 hover:text-foreground flex items-center gap-1 transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <CategoryNav counts={categoryCounts} />
      </section>

      {/* Tabbed Mods Discovery */}
      <HomeModTabs
        anthropicMods={anthropicMods}
        recentMods={recentMods}
        topMods={topMods}
      />

      {/* SEO FAQ Section */}
      <FaqSection />
    </div>
  )
}
