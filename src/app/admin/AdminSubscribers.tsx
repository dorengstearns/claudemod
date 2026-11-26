'use client'

import { useId, useMemo, useState, useTransition } from 'react'
import { Check, Copy, Download, Trash2 } from 'lucide-react'
import { deleteSubscriber } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type SubscriberRow = {
  id: string
  email: string
  source: string
  status: 'active' | 'unsubscribed'
  created_at: string
  unsubscribed_at: string | null
}

const SOURCE_LABELS: Record<string, string> = {
  home_sticky: 'Top Sticky Bar',
  home: 'Homepage Banner',
  browse: 'Browse Banner',
  mod_sidebar: 'Mod Sidebar',
  backlog_email: 'Backlog Email',
  approval_email: 'Approval Email',
  sponsor: 'Sponsor Page',
  site: 'Site',
}

function formatSource(source: string): string {
  return SOURCE_LABELS[source] ?? source
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(d) + ' UTC'
}

function csvCell(value: string | null | undefined): string {
  const s = value ?? ''
  return `"${s.replace(/"/g, '""')}"`
}

export function AdminSubscribers({
  subscribers,
  recent7dCount,
}: {
  subscribers: SubscriberRow[]
  recent7dCount: number
}) {
  const captionId = useId()
  const [filter, setFilter] = useState<'active' | 'all' | 'unsubscribed'>('active')
  const [copied, setCopied] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const activeSubscribers = useMemo(
    () => subscribers.filter((s) => s.status === 'active'),
    [subscribers]
  )
  const unsubscribedCount = subscribers.length - activeSubscribers.length

  const sourceCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const s of activeSubscribers) {
      map.set(s.source, (map.get(s.source) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [activeSubscribers])

  const filtered = useMemo(() => {
    if (filter === 'all') return subscribers
    return subscribers.filter((s) => s.status === filter)
  }, [subscribers, filter])

  const handleCopyActive = async () => {
    if (activeSubscribers.length === 0) return
    const list = activeSubscribers.map((s) => s.email).join('\n')
    await navigator.clipboard.writeText(list)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportCsv = () => {
    const header = ['email', 'source', 'status', 'created_at', 'unsubscribed_at'].join(',')
    const rows = filtered.map((s) =>
      [
        csvCell(s.email),
        csvCell(s.source),
        csvCell(s.status),
        csvCell(s.created_at),
        csvCell(s.unsubscribed_at),
      ].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `claudemod-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id)
      return
    }
    setConfirmDeleteId(null)
    startTransition(() => {
      deleteSubscriber(id)
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.04] p-3.5">
          <div className="text-2xl font-bold tracking-tight tabular-nums text-emerald-700 dark:text-emerald-400">
            {activeSubscribers.length}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Active subscribers</div>
        </div>
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <div className="text-2xl font-bold tracking-tight tabular-nums">
            +{recent7dCount}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Last 7 days</div>
        </div>
        <div className="rounded-lg border border-border/70 bg-card p-3.5">
          <div className="text-2xl font-bold tracking-tight tabular-nums text-muted-foreground">
            {unsubscribedCount}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Unsubscribed</div>
        </div>
      </div>

      {/* Conversion breakdown by placement source */}
      {sourceCounts.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active by Source
          </h2>
          <div className="flex flex-wrap gap-2">
            {sourceCounts.map(([source, count]) => (
              <div
                key={source}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-xs"
              >
                <span className="font-medium text-foreground">{formatSource(source)}</span>
                <span className="text-muted-foreground tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5 self-start">
          {(
            [
              { id: 'active', label: `Active (${activeSubscribers.length})` },
              { id: 'all', label: `All (${subscribers.length})` },
              { id: 'unsubscribed', label: `Unsubscribed (${unsubscribedCount})` },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer',
                filter === opt.id
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyActive}
            disabled={activeSubscribers.length === 0}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                Copied {activeSubscribers.length}
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                Copy active emails
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="h-8 gap-1.5 text-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Responsive Subscribers Table */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center rounded-lg border border-dashed border-border/70">
          No subscribers in this view yet.
        </p>
      ) : (
        <div
          tabIndex={0}
          role="region"
          aria-labelledby={captionId}
          className="subscribers-table-wrapper rounded-lg border border-border/70 bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <table className="subscribers-table text-left text-xs">
            <caption id={captionId} className="sr-only">
              Weekly digest newsletter subscribers
            </caption>
            <thead className="bg-muted/80 backdrop-blur border-b border-border/70 text-muted-foreground">
              <tr>
                <th scope="col" className="px-3.5 py-2.5 font-medium border-b border-border/60">
                  Email
                </th>
                <th scope="col" className="px-3.5 py-2.5 font-medium border-b border-border/60">
                  Source
                </th>
                <th scope="col" className="px-3.5 py-2.5 font-medium border-b border-border/60">
                  Status
                </th>
                <th scope="col" className="px-3.5 py-2.5 font-medium border-b border-border/60">
                  Joined
                </th>
                <th scope="col" className="px-3.5 py-2.5 font-medium border-b border-border/60 text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                  <th
                    scope="row"
                    className="bg-card px-3.5 py-2.5 font-medium text-foreground whitespace-nowrap"
                  >
                    {sub.email}
                  </th>
                  <td className="px-3.5 py-2.5 text-muted-foreground whitespace-nowrap">
                    <Badge variant="outline" className="text-[11px] font-normal">
                      {formatSource(sub.source)}
                    </Badge>
                  </td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    {sub.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        Active
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Unsubscribed</span>
                    )}
                  </td>
                  <td className="px-3.5 py-2.5 text-muted-foreground whitespace-nowrap tabular-nums">
                    {formatDate(sub.created_at)}
                  </td>
                  <td className="px-3.5 py-2.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => handleDelete(sub.id)}
                      onBlur={() => {
                        if (confirmDeleteId === sub.id) setConfirmDeleteId(null)
                      }}
                      className={cn(
                        'inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-50',
                        confirmDeleteId === sub.id
                          ? 'bg-destructive text-white'
                          : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                      )}
                      aria-label={
                        confirmDeleteId === sub.id
                          ? `Confirm remove ${sub.email}`
                          : `Remove ${sub.email}`
                      }
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                      {confirmDeleteId === sub.id ? 'Confirm?' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
