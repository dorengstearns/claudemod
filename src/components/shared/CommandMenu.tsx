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
} from '@/components/ui/command'
import type { Mod } from '@/types/mod'
import { Loader2 } from 'lucide-react'

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Mod[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    
    // Event listener so the Navbar can trigger it globally
    const handleOpen = () => setOpen(true)
    document.addEventListener('open-command-palette', handleOpen)

    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('open-command-palette', handleOpen)
    }
  }, [])

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
    }, 250) // Debounce
    
    return () => clearTimeout(timer)
  }, [query])

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    []
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Type a command or search mods..." 
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
            <span className="text-muted-foreground">No matching mods found.</span>
          ) : (
            <span className="text-muted-foreground">Type to search for tags, skills, or mods...</span>
          )}
        </CommandEmpty>
        
        {results.length > 0 && (
          <CommandGroup heading="Mods">
            {results.map((mod) => (
              <CommandItem
                key={mod.id}
                value={mod.name}
                onSelect={() => {
                  runCommand(() => router.push(`/mods/${mod.slug}`))
                }}
                className="cursor-pointer"
              >
                <span>{mod.name}</span>
                <span className="ml-2 text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted/50 border">
                  {mod.category}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
