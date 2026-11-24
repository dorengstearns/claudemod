'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CATEGORIES, PERMISSION_LEVELS, SORT_OPTIONS, SURFACES } from '@/lib/constants'
import { X } from 'lucide-react'

interface FilterBarProps {
  activeCategory?: string
  activeSubcategory?: string
  activePermission?: string
  activeSurface?: string
  activeSort?: string
}

export function FilterBar({
  activeCategory,
  activeSubcategory,
  activePermission,
  activeSurface,
  activeSort = 'stars',
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    if (key === 'category' && value !== 'mod') {
      params.delete('sub')
      params.delete('permission')
      params.delete('surface')
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `/browse?${qs}` : '/browse')
  }

  const clearAll = () => {
    router.push('/browse')
  }

  const showModFilters = activeCategory === 'mod' || Boolean(activePermission || activeSurface)
  const hasFilters = Boolean(
    activeCategory || activeSubcategory || activePermission || activeSurface || (activeSort && activeSort !== 'stars')
  )

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full sm:w-auto">
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

      {/* Permission level filter (when browsing Mods) */}
      {showModFilters && (
        <Select
          value={activePermission ?? 'all'}
          onValueChange={(v) => updateParam('permission', v === 'all' ? null : v)}
        >
          <SelectTrigger className="flex-1 min-w-[130px] sm:w-40 sm:flex-none h-9">
            <SelectValue placeholder="All access" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All access levels</SelectItem>
            {(['ui-only', 'reads', 'writes-or-runs', 'network'] as const).map((lvl) => (
              <SelectItem key={lvl} value={lvl}>
                {PERMISSION_LEVELS[lvl].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Surface filter (when browsing Mods) */}
      {showModFilters && (
        <Select
          value={activeSurface ?? 'all'}
          onValueChange={(v) => updateParam('surface', v === 'all' ? null : v)}
        >
          <SelectTrigger className="flex-1 min-w-[115px] sm:w-32 sm:flex-none h-9">
            <SelectValue placeholder="All surfaces" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All surfaces</SelectItem>
            {SURFACES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

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
        <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1.5 h-9 text-muted-foreground cursor-pointer">
          <X className="h-3.5 w-3.5" />
          Clear
        </Button>
      )}
    </div>
  )
}
