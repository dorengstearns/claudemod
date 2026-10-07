'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'
import { X } from 'lucide-react'

interface FilterBarProps {
  activeCategory?: string
  activeSort?: string
}

export function FilterBar({ activeCategory, activeSort = 'stars' }: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/browse?${params.toString()}`)
  }

  const clearAll = () => {
    router.push('/browse')
  }

  const hasFilters = activeCategory || (activeSort && activeSort !== 'stars')

  return (
    <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
      {/* Category filter */}
      <Select value={activeCategory ?? 'all'} onValueChange={(v) => updateParam('category', v === 'all' ? null : v)}>
        <SelectTrigger className="flex-1 min-w-[130px] sm:w-40 sm:flex-none h-9">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={activeSort} onValueChange={(v) => updateParam('sort', v)}>
        <SelectTrigger className="flex-1 min-w-[110px] sm:w-36 sm:flex-none h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 h-9 text-muted-foreground">
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
