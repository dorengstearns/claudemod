'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBar({
  placeholder = 'Search mods...',
  className,
  autoFocus,
}: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [value, setValue] = useState(searchParams.get('q') ?? '')

  const updateSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) {
        params.set('q', q)
      } else {
        params.delete('q')
      }
      params.delete('page')
      const target = pathname === '/browse' ? `/browse?${params.toString()}` : `/browse?q=${encodeURIComponent(q)}`
      startTransition(() => {
        router.push(target)
      })
    },
    [pathname, router, searchParams]
  )

  // Debounce
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value
      setValue(q)
      const timer = setTimeout(() => updateSearch(q), 300)
      return () => clearTimeout(timer)
    },
    [updateSearch]
  )

  const handleClear = () => {
    setValue('')
    updateSearch('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className={cn('absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground', isPending && 'opacity-50')} />
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-8"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
