'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Boxes, Clock, Sparkles, ArrowRight } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { ModGrid } from '@/components/mods/ModGrid'
import type { Mod } from '@/types/mod'

interface HomeModTabsProps {
  anthropicMods: Mod[]
  recentMods: Mod[]
  topMods: Mod[]
}

export function HomeModTabs({ anthropicMods, recentMods, topMods }: HomeModTabsProps) {
  const [activeTab, setActiveTab] = useState('anthropic')

  return (
    <section className="pb-16">
      <Tabs defaultValue="anthropic" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab switcher bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList className="h-10 p-1 bg-muted/80 w-full sm:w-auto grid grid-cols-3 sm:inline-flex rounded-lg">
            <TabsTrigger value="anthropic" className="gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium cursor-pointer">
              <Boxes className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Anthropic Mods</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium cursor-pointer">
              <Clock className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Recently Added</span>
            </TabsTrigger>
            <TabsTrigger value="top" className="gap-2 px-3 sm:px-4 text-xs sm:text-sm font-medium cursor-pointer">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Top Mods</span>
            </TabsTrigger>
          </TabsList>

          <div className="hidden sm:block">
            {activeTab === 'anthropic' && (
              <Link href="/browse?category=mod" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View all in Mods <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {activeTab === 'recent' && (
              <Link href="/browse?sort=newest" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View all newest <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {activeTab === 'top' && (
              <Link href="/browse" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                View all in Browse <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Tab 1: Anthropic Mods */}
        <TabsContent value="anthropic" className="mt-0 focus-visible:outline-none">
          <ModGrid mods={anthropicMods} />
          <div className="mt-8 text-center">
            <Link href="/browse?category=mod">
              <Button variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground">
                View more Anthropic Mods <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        {/* Tab 2: Recently Added */}
        <TabsContent value="recent" className="mt-0 focus-visible:outline-none">
          <ModGrid mods={recentMods} />
          <div className="mt-8 text-center">
            <Link href="/browse?sort=newest">
              <Button variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground">
                View all Recently Added <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        {/* Tab 3: Top Mods */}
        <TabsContent value="top" className="mt-0 focus-visible:outline-none">
          <ModGrid mods={topMods} />
          <div className="mt-8 text-center">
            <Link href="/browse">
              <Button variant="ghost" className="gap-1.5 text-muted-foreground hover:text-foreground">
                View all Top Mods <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
