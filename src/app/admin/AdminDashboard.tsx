'use client'

import { useState } from 'react'
import { Inbox, Mail } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminQueue } from './AdminQueue'
import { AdminSubscribers, type SubscriberRow } from './AdminSubscribers'

type PendingMod = {
  id: string
  name: string
  description: string
  category: string
  github_url: string
  author_github: string
  created_at: string
}

export function AdminDashboard({
  mods,
  subscribers,
  recent7dCount,
}: {
  mods: PendingMod[]
  subscribers: SubscriberRow[]
  recent7dCount: number
}) {
  const [tab, setTab] = useState('queue')
  const activeCount = subscribers.filter((s) => s.status === 'active').length

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="border-b border-border/60 mb-6">
        <TabsList className="h-auto p-0 bg-transparent rounded-none gap-2">
          <TabsTrigger
            value="queue"
            className="relative h-10 px-3 pb-2.5 pt-2 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer gap-1.5 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >
            <Inbox className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            <span>Mod Queue</span>
            <span className="text-xs font-normal text-muted-foreground/75 tabular-nums">
              {mods.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="subscribers"
            className="relative h-10 px-3 pb-2.5 pt-2 rounded-none bg-transparent shadow-none border-0 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer gap-1.5 -mb-px data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-foreground data-[state=active]:text-foreground"
          >
            <Mail className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            <span>Digest Subscribers</span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 tabular-nums">
              {activeCount}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="queue" className="mt-0 focus-visible:outline-none">
        <AdminQueue mods={mods} />
      </TabsContent>

      <TabsContent value="subscribers" className="mt-0 focus-visible:outline-none">
        <AdminSubscribers subscribers={subscribers} recent7dCount={recent7dCount} />
      </TabsContent>
    </Tabs>
  )
}
