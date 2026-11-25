'use client'

import { useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

const emptySubscribe = () => () => {}
const getModifierSnapshot = () =>
  /Mac|iPod|iPhone|iPad/i.test(navigator.platform) ? '⌘' : 'Ctrl'
const getServerModifierSnapshot = () => '⌘'

interface HeroSearchBarProps {
  totalCount: number
  className?: string
}

export function HeroSearchBar({ totalCount, className }: HeroSearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const modifier = useSyncExternalStore(
    emptySubscribe,
    getModifierSnapshot,
    getServerModifierSnapshot
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/browse?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/browse?category=mod')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative max-w-xl mx-auto w-full', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${totalCount > 0 ? `${totalCount} ` : ''}Claude mods, skills, MCP servers...`}
        aria-label="Search Claude mods"
        className="w-full h-11 pl-10 pr-24 rounded-lg border border-border/70 hover:border-border bg-background text-base sm:text-sm shadow-xs transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:border-foreground/30"
      />
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
          title="Open quick command palette"
          className="hidden sm:inline-flex items-center gap-0.5 h-7 px-2 rounded-md border border-border/60 bg-muted/40 hover:bg-muted text-[11px] font-mono text-muted-foreground/80 transition-colors cursor-pointer"
        >
          <span>{modifier}</span>K
        </button>
        <button
          type="submit"
          aria-label="Submit search"
          className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}
