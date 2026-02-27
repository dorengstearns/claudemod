import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModGrid } from '@/components/mods/ModGrid'
import { ModCardSkeleton } from '@/components/mods/ModCardSkeleton'
import { CategoryNav } from '@/components/browse/CategoryNav'
import { getTopMods, getCategoryCounts, getTotalModCount } from '@/lib/queries/mods'
import { SITE_DESCRIPTION } from '@/lib/constants'

export const revalidate = 60

export default async function HomePage() {
  const [topMods, categoryCounts, totalCount] = await Promise.all([
    getTopMods(12),
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
          className="mx-auto mb-4 translate-x-[5px]"
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

      {/* Categories */}
      <section className="pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Browse by Category</h2>
          <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <CategoryNav counts={categoryCounts} />
      </section>

      {/* Top Mods */}
      <section className="pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold">Top Mods</h2>
          <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <ModCardSkeleton key={i} />)}
            </div>
          }
        >
          <ModGrid mods={topMods} />
        </Suspense>
      </section>
    </div>
  )
}
