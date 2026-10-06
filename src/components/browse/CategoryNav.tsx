'use client'

import Link from 'next/link'
import {
  Workflow, Plug, Terminal, Bot, Layers, Zap, Package, FileText, Boxes, Code2,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICONS = {
  Workflow, Plug, Terminal, Bot, Layers, Zap, Package, FileText, Boxes, Code2,
} as Record<string, React.ComponentType<{ className?: string }>>

interface CategoryNavProps {
  counts?: Record<string, number>
  activeCategory?: string
}

export function CategoryNav({ counts = {}, activeCategory }: CategoryNavProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon]
        const count = counts[cat.value] ?? 0
        const isActive = activeCategory === cat.value

        return (
          <Link
            key={cat.value}
            href={`/browse?category=${cat.value}`}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                : 'text-muted-foreground/80 hover:text-foreground bg-muted/40 hover:bg-muted/80 border border-border/40'
            )}
          >
            {Icon && <Icon className={cn('h-3.5 w-3.5 shrink-0 opacity-70', cat.color)} />}
            <span>{cat.label}</span>
            {count > 0 && (
              <span className="text-[10px] text-muted-foreground/60 tabular-nums font-normal">
                {count}
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
