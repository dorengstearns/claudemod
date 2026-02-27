import Link from 'next/link'
import {
  Workflow, Plug, Terminal, Bot, Layers, Zap, Package, FileText,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const ICONS = {
  Workflow, Plug, Terminal, Bot, Layers, Zap, Package, FileText,
} as Record<string, React.ComponentType<{ className?: string }>>

interface CategoryNavProps {
  counts?: Record<string, number>
  activeCategory?: string
}

export function CategoryNav({ counts = {}, activeCategory }: CategoryNavProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon]
        const count = counts[cat.value] ?? 0
        const isActive = activeCategory === cat.value

        return (
          <Link
            key={cat.value}
            href={`/browse?category=${cat.value}`}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-lg border text-center transition-all hover:border-primary/50 hover:bg-accent/50',
              isActive ? 'border-primary bg-accent' : 'border-border'
            )}
          >
            {Icon && <Icon className={cn('h-6 w-6', cat.color)} />}
            <div>
              <p className="text-sm font-medium leading-none">{cat.label}</p>
              {count > 0 && (
                <p className="text-xs text-muted-foreground mt-0.5">{count} mods</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
