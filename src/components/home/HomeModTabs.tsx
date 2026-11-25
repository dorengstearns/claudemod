'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Boxes, Clock, Sparkles, ArrowRight } from 'lucide-react'
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
    <section className="pb-12">
      <Tabs defaultValue="mods" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Clean editorial underline tabs */}
        <div className="flex items-end justify-between gap-4 border-b border-border/60 mb-5">
          <TabsList className="h-auto p-0 bg-transparent rounded-none gap-1 sm:gap-2">
            <TabsTrigger
              value="mods"
              className="relative h-10 px-2.5 sm:px-3.5 pb-2.5 pt-2 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer gap-1.5 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground"
            >
              <Boxes className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              <span className="hidden sm:inline">Claude Mods</span>
              <span className="sm:hidden">Mods</span>
              <span className="text-[11px] font-normal text-muted-foreground/70 tabular-nums">
                {totalClaudeModsCount}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="recent"
              className="relative h-10 px-2.5 sm:px-3.5 pb-2.5 pt-2 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer gap-1.5 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground"
            >
              <Clock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              <span className="hidden sm:inline">Recently Added</span>
              <span className="sm:hidden">Recent</span>
            </TabsTrigger>

            <TabsTrigger
              value="top"
              className="relative h-10 px-2.5 sm:px-3.5 pb-2.5 pt-2 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer gap-1.5 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden="true" />
              <span className="hidden sm:inline">Top All-Time</span>
              <span className="sm:hidden">Top</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:block pb-2.5 shrink-0">
            {activeTab === 'mods' && (
              <Link
                href="/browse?category=mod"
                prefetch={false}
                className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                Browse all {totalClaudeModsCount}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            {activeTab === 'recent' && (
              <Link
                href="/browse?sort=newest"
                prefetch={false}
                className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                View all recent
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
            {activeTab === 'top' && (
              <Link
                href="/browse"
                prefetch={false}
                className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
              >
                Full directory
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Claude Mods (In-process TypeScript Mods) */}
        <TabsContent value="mods" className="mt-0 focus-visible:outline-none">
          {/* Clean flat sub-category chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5">
            {MOD_SUBCATEGORIES.map((sc) => {
              const count = modSubcategoryCounts[sc.value] ?? 0
              if (count === 0) return null
              return (
                <Link
                  key={sc.value}
                  href={`/browse?category=mod&sub=${sc.value}`}
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent hover:border-border/50 transition-colors shrink-0"
                >
                  <span>{sc.label}</span>
                  <span className="text-[11px] font-normal text-muted-foreground/60 tabular-nums">
                    {count}
                  </span>
                </Link>
              )
            })}
          </div>

          <UnfurlFeed
            viewMoreLabel={`View more Claude Mods (${totalClaudeModsCount} total)`}
            browseAllHref="/browse?category=mod"
            browseAllLabel={`Browse all ${totalClaudeModsCount} Claude Mods`}
          >
            <ModGrid mods={claudeMods} />
          </UnfurlFeed>
        </TabsContent>

        {/* Tab 2: Recently Added */}
        <TabsContent value="recent" className="mt-0 focus-visible:outline-none">
          <UnfurlFeed
            viewMoreLabel="View more recent additions"
            browseAllHref="/browse?sort=newest"
            browseAllLabel="Browse all newest additions"
          >
            <ModGrid mods={recentMods} />
          </UnfurlFeed>
        </TabsContent>

        {/* Tab 3: Top All-Time */}
        <TabsContent value="top" className="mt-0 focus-visible:outline-none">
          <UnfurlFeed
            viewMoreLabel="View more top mods"
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
