'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Workflow, Plug, Terminal, Bot, Layers, Zap, Package, FileText, Boxes, Code2, ChevronDown, ChevronUp,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICONS = {
  Workflow, Plug, Terminal, Bot, Layers, Zap, Package, FileText, Boxes, Code2,
} as Record<string, React.ComponentType<{ className?: string }>>

interface CategoryNavProps {
  counts?: Record<string, number>
  activeCategory?: string
  initialLimit?: number
}

export function CategoryNav({ counts = {}, activeCategory, initialLimit = 5 }: CategoryNavProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Show first 5 categories by default (or all if expanded or if activeCategory is in the hidden ones)
  const isHiddenActive = activeCategory && CATEGORIES.findIndex((c) => c.value === activeCategory) >= initialLimit
  const shouldShowAll = isExpanded || isHiddenActive
  const visibleCategories = shouldShowAll ? CATEGORIES : CATEGORIES.slice(0, initialLimit)
  const remainingCount = CATEGORIES.length - initialLimit

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {visibleCategories.map((cat) => {
          const Icon = ICONS[cat.icon]
          const count = counts[cat.value] ?? 0
          const isActive = activeCategory === cat.value

          return (
            <Link
              key={cat.value}
              href={`/browse?category=${cat.value}`}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all hover:border-primary/50 hover:bg-accent/60',
                isActive
                  ? 'border-primary bg-accent text-accent-foreground font-semibold shadow-xs'
                  : 'border-border/70 bg-card/60 text-muted-foreground hover:text-foreground'
              )}
            >
              {Icon && <Icon className={cn('h-3.5 w-3.5 shrink-0', cat.color)} />}
              <span>{cat.label}</span>
              {count > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-normal text-muted-foreground">
                  {count}
                </span>
              )}
            </Link>
          )
        })}

        {remainingCount > 0 && !isHiddenActive && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-border/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Less' : `More (${remainingCount})`}</span>
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}
      </div>
    </div>
  )
}
