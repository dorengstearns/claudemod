'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModGrid } from '@/components/mods/ModGrid'
import { UnfurlFeed } from '@/components/mods/UnfurlFeed'
import { MOD_SUBCATEGORIES } from '@/lib/constants'
import type { Mod } from '@/types/mod'

interface HomeModTabsProps {
  claudeMods: Mod[]
  totalClaudeModsCount: number
  modSubcategoryCounts: Record<string, number>
  recentMods: Mod[]
  topMods: Mod[]
}

export function HomeModTabs({
  claudeMods,
  totalClaudeModsCount,
  modSubcategoryCounts,
  recentMods,
  topMods,
}: HomeModTabsProps) {
  const [activeTab, setActiveTab] = useState('mods')

  return (
    <section aria-label="Mod directory" className="pb-12">
      <Tabs defaultValue="mods" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Clean architectural underline tabs */}
        <div className="flex items-end justify-between gap-4 border-b border-border/70 mb-4">
          <TabsList variant="line" className="h-auto p-0 bg-transparent rounded-none gap-4 sm:gap-6">
            <TabsTrigger
              value="mods"
              className="relative h-10 px-0 pb-3 pt-1.5 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer gap-2 -mb-px after:hidden data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent dark:data-[state=active]:border-transparent data-[state=active]:border-b-foreground dark:data-[state=active]:border-b-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold"
            >
              <span>Claude Mods</span>
              <span className="text-[13px] font-normal text-muted-foreground tabular-nums">
                {totalClaudeModsCount}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="recent"
              className="relative h-10 px-0 pb-3 pt-1.5 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer -mb-px after:hidden data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent dark:data-[state=active]:border-transparent data-[state=active]:border-b-foreground dark:data-[state=active]:border-b-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold"
            >
              <span>Recently added</span>
            </TabsTrigger>

            <TabsTrigger
              value="top"
              className="relative h-10 px-0 pb-3 pt-1.5 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer -mb-px after:hidden data-[state=active]:bg-transparent dark:data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-transparent dark:data-[state=active]:border-transparent data-[state=active]:border-b-foreground dark:data-[state=active]:border-b-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold"
            >
              <span>Top rated</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:block pb-3 shrink-0">
            {activeTab === 'mods' && (
              <Link
                href="/browse?category=mod"
                prefetch={false}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                Browse all {totalClaudeModsCount}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            {activeTab === 'recent' && (
              <Link
                href="/browse?sort=newest"
                prefetch={false}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                View all recent
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            {activeTab === 'top' && (
              <Link
                href="/browse"
                prefetch={false}
                className="text-[13px] font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                Full directory
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Claude Mods */}
        <TabsContent value="mods" className="mt-0 focus-visible:outline-none">
          {/* Plain typographic sub-category navigation rail (no decorative capsules) */}
          <nav
            aria-label="Mod subcategories"
            className="flex items-center gap-x-4 gap-y-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 mb-6"
          >
            {MOD_SUBCATEGORIES.map((sc) => {
              const count = modSubcategoryCounts[sc.value] ?? 0
              if (count === 0) return null
              return (
                <Link
                  key={sc.value}
                  href={`/browse?category=mod&sub=${sc.value}`}
                  prefetch={false}
                  className="inline-flex items-baseline gap-1.5 py-1 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <span>{sc.label}</span>
                  <span className="text-[13px] font-normal text-muted-foreground/65 tabular-nums">
                    {count}
                  </span>
                </Link>
              )
            })}
          </nav>

          <UnfurlFeed
            viewMoreLabel={`Show more Claude Mods (${totalClaudeModsCount} total)`}
            browseAllHref="/browse?category=mod"
            browseAllLabel={`Browse all ${totalClaudeModsCount} Claude Mods`}
          >
            <ModGrid mods={claudeMods} />
          </UnfurlFeed>
        </TabsContent>

        {/* Tab 2: Recently Added */}
        <TabsContent value="recent" className="mt-0 focus-visible:outline-none pt-2">
          <UnfurlFeed
            viewMoreLabel="Show more recent additions"
            browseAllHref="/browse?sort=newest"
            browseAllLabel="Browse all newest additions"
          >
            <ModGrid mods={recentMods} />
          </UnfurlFeed>
        </TabsContent>

        {/* Tab 3: Top Rated */}
        <TabsContent value="top" className="mt-0 focus-visible:outline-none pt-2">
          <UnfurlFeed
            viewMoreLabel="Show more top mods"
            browseAllHref="/browse"
            browseAllLabel="Browse full directory"
          >
            <ModGrid mods={topMods} />
          </UnfurlFeed>
        </TabsContent>
      </Tabs>
    </section>
  )
}
