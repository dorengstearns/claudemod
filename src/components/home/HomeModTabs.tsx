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
    <section className="pb-14 pt-1">
      <Tabs defaultValue="mods" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Prominent Hero Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-border/40">
          <TabsList className="h-11 p-1 bg-muted/80 dark:bg-muted/50 w-full sm:w-auto grid grid-cols-3 sm:inline-flex rounded-xl border border-border/60 shadow-xs">
            <TabsTrigger
              value="mods"
              className="gap-1.5 sm:gap-2 px-1.5 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/40"
            >
              <Boxes className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span className="hidden sm:inline">Claude Mods</span>
              <span className="sm:hidden">Mods</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ml-1 tabular-nums">
                {totalClaudeModsCount}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="recent"
              className="gap-1.5 sm:gap-2 px-1.5 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/40"
            >
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 shrink-0" />
              <span className="hidden sm:inline">Recently Added</span>
              <span className="sm:hidden">Recent</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold ml-1">
                New
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="top"
              className="gap-1.5 sm:gap-2 px-1.5 sm:px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/40"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
              <span className="hidden sm:inline">Top All-Time</span>
              <span className="sm:hidden">Top</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:block">
            {activeTab === 'mods' && (
              <Link href="/browse?category=mod" prefetch={false} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 transition-colors">
                Browse all {totalClaudeModsCount} Claude Mods <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {activeTab === 'recent' && (
              <Link href="/browse?sort=newest" prefetch={false} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 transition-colors">
                View all newest additions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {activeTab === 'top' && (
              <Link href="/browse" prefetch={false} className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 transition-colors">
                Browse full directory <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Claude Mods (In-process TypeScript Mods) */}
        <TabsContent value="mods" className="mt-0 focus-visible:outline-none">
          {/* 1-click Mod Sub-Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5">
            {MOD_SUBCATEGORIES.map((sc) => {
              const count = modSubcategoryCounts[sc.value] ?? 0
              if (count === 0) return null
              return (
                <Link
                  key={sc.value}
                  href={`/browse?category=mod&sub=${sc.value}`}
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/45 text-muted-foreground hover:text-foreground hover:bg-muted/90 border border-border/50 transition-colors shrink-0"
                >
                  <span>{sc.label}</span>
                  <span className="text-[10px] opacity-65 tabular-nums">{count}</span>
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
