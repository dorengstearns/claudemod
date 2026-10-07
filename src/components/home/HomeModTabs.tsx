'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Boxes, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModGrid } from '@/components/mods/ModGrid'
import { UnfurlFeed } from '@/components/mods/UnfurlFeed'
import type { Mod } from '@/types/mod'

interface HomeModTabsProps {
  anthropicMods: Mod[]
  recentMods: Mod[]
  topMods: Mod[]
}

export function HomeModTabs({ anthropicMods, recentMods, topMods }: HomeModTabsProps) {
  const [activeTab, setActiveTab] = useState('anthropic')

  return (
    <section className="pb-16 pt-2">
      <Tabs defaultValue="anthropic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Prominent Hero Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-3 border-b border-border/40">
          <TabsList className="h-11 sm:h-12 p-1 sm:p-1.5 bg-muted/80 dark:bg-muted/50 w-full sm:w-auto grid grid-cols-3 sm:inline-flex rounded-xl border border-border/60 shadow-xs">
            <TabsTrigger
              value="anthropic"
              className="gap-1.5 sm:gap-2 px-1.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/40"
            >
              <Boxes className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500 shrink-0" />
              <span className="hidden sm:inline">Anthropic Mods</span>
              <span className="sm:hidden">Anthropic</span>
              <span className="hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                {anthropicMods.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="recent"
              className="gap-1.5 sm:gap-2 px-1.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/40"
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
              className="gap-1.5 sm:gap-2 px-1.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/40"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
              <span className="hidden sm:inline">Top Mods</span>
              <span className="sm:hidden">Top</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:block">
            {activeTab === 'anthropic' && (
              <Link href="/browse?category=mod" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 transition-colors">
                View all Anthropic Mods <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {activeTab === 'recent' && (
              <Link href="/browse?sort=newest" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 transition-colors">
                View all newest additions <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {activeTab === 'top' && (
              <Link href="/browse" className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 transition-colors">
                Browse full directory <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Anthropic Mods */}
        <TabsContent value="anthropic" className="mt-0 focus-visible:outline-none">
          <UnfurlFeed
            viewMoreLabel={`View more Anthropic Mods (${anthropicMods.length})`}
            browseAllHref="/browse?category=mod"
            browseAllLabel={`Browse all ${anthropicMods.length} Anthropic Mods`}
          >
            <ModGrid mods={anthropicMods} />
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

        {/* Tab 3: Top Mods */}
        <TabsContent value="top" className="mt-0 focus-visible:outline-none">
          <UnfurlFeed
            viewMoreLabel="View more top mods"
            browseAllHref="/browse"
            browseAllLabel="Browse all Top Mods in directory"
          >
            <ModGrid mods={topMods} />
          </UnfurlFeed>
        </TabsContent>
      </Tabs>
    </section>
  )
}
