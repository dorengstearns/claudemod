import { ShieldCheck, Eye, Terminal, Globe, HelpCircle } from 'lucide-react'
import { PERMISSION_LEVELS, type PermissionLevel } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface PermissionPillProps {
  level?: PermissionLevel | null
  labels?: string[]
  compact?: boolean
  className?: string
}

const ICONS: Record<PermissionLevel, React.ComponentType<{ className?: string }>> = {
  'ui-only': ShieldCheck,
  reads: Eye,
  'writes-or-runs': Terminal,
  network: Globe,
  unknown: HelpCircle,
}

export function PermissionPill({ level, labels = [], compact = false, className }: PermissionPillProps) {
  if (!level || level === 'unknown') return null
  const config = PERMISSION_LEVELS[level]
  if (!config) return null

  const Icon = ICONS[level]
  const tooltip =
    labels.length > 0
      ? `${config.label}: ${labels.join(', ')}`
      : `${config.label} — ${config.description}`

  return (
    <span
      title={tooltip}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium leading-none whitespace-nowrap',
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        config.badgeClass,
        className
      )}
    >
      <Icon className={cn(compact ? 'h-3 w-3' : 'h-3.5 w-3.5', 'shrink-0')} />
      <span>{compact ? config.shortLabel : config.label}</span>
    </span>
  )
}
