import { Badge } from '@/components/ui/badge'
import { CATEGORIES } from '@/lib/constants'
import type { ModCategory } from '@/types/mod'
import { cn } from '@/lib/utils'

interface ModBadgeProps {
  category: ModCategory
  className?: string
}

const categoryColorMap: Record<string, string> = {
  'skill': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100',
  'mcp-server': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-100',
  'command': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100',
  'agent': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100',
  'harness': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100',
  'hook': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-100',
  'plugin': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 hover:bg-pink-100',
  'config': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 hover:bg-cyan-100',
}

export function ModBadge({ category, className }: ModBadgeProps) {
  const cat = CATEGORIES.find((c) => c.value === category)
  const label = cat?.label ?? category
  const colorClass = categoryColorMap[category] ?? ''

  return (
    <Badge
      variant="secondary"
      className={cn('font-medium border-0 text-xs', colorClass, className)}
    >
      {label}
    </Badge>
  )
}
