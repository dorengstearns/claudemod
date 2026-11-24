'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import type { Mod } from '@/types/mod'
import { MOD_SUBCATEGORIES, PERMISSION_LEVELS } from '@/lib/constants'
import { Loader2, Star, BookOpen, Plus, Layers, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Mod[]>([])
  const [popular, setPopular] = React.useState<Mod[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', down)

    const handleOpen = () => setOpen(true)
    document.addEventListener('open-command-palette', handleOpen)

    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('open-command-palette', handleOpen)
    }
  }, [])

  // Load popular mods once when palette opens for the first time
  React.useEffect(() => {
    if (!open || popular.length > 0) return
    fetch('/api/search?featured=1')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.results)) setPopular(data.results)
      })
      .catch(() => {})
  }, [open, popular.length])

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error('Command search error:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)

    return () => clearTimeout(timer)
  }, [query])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    setQuery('')
    command()
  }, [])

  const renderModItem = (mod: Mod) => {
    const perm = mod.permissions_level ? PERMISSION_LEVELS[mod.permissions_level] : null
    return (
      <CommandItem
        key={mod.id}
        value={`${mod.name} ${mod.description} ${mod.author_github}`}
        onSelect={() => runCommand(() => router.push(`/mods/${mod.slug}`))}
        className="cursor-pointer py-2.5 flex items-start justify-between gap-3"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{mod.name}</span>
            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/60 border border-border/50 shrink-0">
              {mod.category}
            </span>
            {perm && mod.permissions_level !== 'unknown' && (
              <span
                title={perm.label}
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground shrink-0"
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', perm.dotClass)} />
                <span className="hidden sm:inline">{perm.shortLabel}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
            {mod.description}
          </p>
        </div>
        {mod.github_stars > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums shrink-0 pt-0.5">
            <Star className="h-3 w-3 text-amber-500/80" />
            {formatStars(mod.github_stars)}
          </span>
        )}
      </CommandItem>
    )
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search Claude mods, skills, MCP servers, or authors..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
              <span className="text-muted-foreground">Searching...</span>
            </div>
          ) : query ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">No quick matches for &ldquo;{query}&rdquo;.</p>
              <button
                type="button"
                onClick={() => runCommand(() => router.push(`/browse?q=${encodeURIComponent(query)}`))}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Search full directory <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <span className="text-muted-foreground">Type to search Claude mods...</span>
          )}
        </CommandEmpty>

        {/* Live Search Results */}
        {query.trim() && results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map(renderModItem)}
            <CommandItem
              value={`search-all-${query}`}
              onSelect={() => runCommand(() => router.push(`/browse?q=${encodeURIComponent(query)}`))}
              className="cursor-pointer justify-center text-xs text-primary font-medium py-2"
            >
              <span>See all results for &ldquo;{query}&rdquo;</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </CommandItem>
          </CommandGroup>
        )}

        {/* Default state when query is empty: Popular Mods + Sub-Categories + Quick Links */}
        {!query.trim() && (
          <>
            {popular.length > 0 && (
              <CommandGroup heading="Popular Claude Mods">
                {popular.map(renderModItem)}
              </CommandGroup>
            )}

            <CommandSeparator />

            <CommandGroup heading="Browse Mod Categories">
              {MOD_SUBCATEGORIES.map((sc) => (
                <CommandItem
                  key={sc.value}
                  value={`category ${sc.label} ${sc.description}`}
                  onSelect={() => runCommand(() => router.push(`/browse?category=mod&sub=${sc.value}`))}
                  className="cursor-pointer flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{sc.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {sc.description}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="Quick Links">
              <CommandItem
                value="install guide how to install claude mods"
                onSelect={() => runCommand(() => router.push('/install'))}
                className="cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>How to Install &amp; Audit Mods</span>
              </CommandItem>
              <CommandItem
                value="submit a mod add plugin"
                onSelect={() => runCommand(() => router.push('/submit'))}
                className="cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                <span>Submit a Mod</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
