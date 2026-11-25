'use client'

import { useState, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight } from 'lucide-react'

const emptySubscribe = () => () => {}
const getModifierSnapshot = () =>
  /Mac|iPod|iPhone|iPad/i.test(navigator.platform) ? '⌘' : 'Ctrl'
const getServerModifierSnapshot = () => '⌘'

interface HeroSearchBarProps {
  totalCount: number
}

export function HeroSearchBar({ totalCount }: HeroSearchBarProps) {
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
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search ${totalCount > 0 ? totalCount : ''} Claude mods, skills, MCP servers...`.trim()}
        aria-label="Search Claude mods"
        className="w-full h-11 sm:h-12 pl-11 pr-24 rounded-xl border border-border/80 bg-background/95 text-sm shadow-xs transition-all placeholder:text-muted-foreground/75 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/60"
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-palette'))}
          title="Open quick command palette"
          className="hidden sm:inline-flex items-center gap-0.5 h-7 px-2 rounded-md border border-border/70 bg-muted/60 hover:bg-muted text-[11px] font-mono text-muted-foreground transition-colors cursor-pointer"
        >
          <span>{modifier}</span>K
        </button>
        <button
          type="submit"
          aria-label="Submit search"
          className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}
