import Link from 'next/link'
import { ExternalLink, ShieldCheck, Eye, Terminal, Globe } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ModThumbnail } from '@/components/mods/ModThumbnail'
import { QuickCopyInstall } from '@/components/mods/QuickCopyInstall'
import { VoteButton } from '@/components/vote/VoteButton'
import type { Mod } from '@/types/mod'
import { CATEGORIES, MOD_SUBCATEGORIES, PERMISSION_LEVELS, type PermissionLevel } from '@/lib/constants'
import { extractModVisual } from '@/lib/visuals'
import { cn } from '@/lib/utils'

interface ModCardProps {
  mod: Mod
}

const PERMISSION_META: Record<
  Exclude<PermissionLevel, 'unknown'>,
  { icon: React.ComponentType<{ className?: string }>; textClass: string }
> = {
  'ui-only': {
    icon: ShieldCheck,
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  reads: {
    icon: Eye,
    textClass: 'text-sky-700 dark:text-sky-400',
  },
  'writes-or-runs': {
    icon: Terminal,
    textClass: 'text-amber-700 dark:text-amber-400',
  },
  network: {
    icon: Globe,
    textClass: 'text-rose-700 dark:text-rose-400',
  },
}

export function ModCard({ mod }: ModCardProps) {
  const visual = mod.thumbnail_url ?? extractModVisual(mod.long_description, mod.github_url)
  const category = CATEGORIES.find((c) => c.value === mod.category)
  const subcategory = mod.mod_subcategory
    ? MOD_SUBCATEGORIES.find((s) => s.value === mod.mod_subcategory)
    : null

  const permLevel =
    mod.category === 'mod' && mod.permissions_level && mod.permissions_level !== 'unknown'
      ? mod.permissions_level
      : null
  const permInfo = permLevel ? PERMISSION_LEVELS[permLevel] : null
  const permStyle = permLevel ? PERMISSION_META[permLevel] : null
  const PermIcon = permStyle?.icon

  const permTooltip = permInfo
    ? mod.permissions_labels && mod.permissions_labels.length > 0
      ? `${permInfo.label}: ${mod.permissions_labels.join(', ')}`
      : `${permInfo.label}: ${permInfo.description}`
    : undefined

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/70 bg-card transition-[border-color,box-shadow] duration-200 ease-out hover:border-foreground/20 hover:shadow-sm">
      {/* Stretched link covers the whole card */}
      <Link
        href={`/mods/${mod.slug}`}
        prefetch={false}
        className="absolute inset-0 z-0"
        aria-label={mod.name}
      />

      {visual && <ModThumbnail src={visual} alt={mod.name} />}

      <CardContent className="p-5 pb-4 flex-1">
        {/* Clean typographic metadata row + interactive star button */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap text-[13px] text-muted-foreground mb-1">
              {mod.is_official ? (
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  Official
                </span>
              ) : (
                <span className="font-medium text-foreground/75">
                  {category?.label ?? mod.category}
                </span>
              )}
              {subcategory && (
                <>
                  <span aria-hidden="true" className="text-muted-foreground/45">/</span>
                  <span>{subcategory.label}</span>
                </>
              )}
            </div>
            <h3 className="font-semibold text-base tracking-[-0.015em] leading-snug text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
              {mod.name}
            </h3>
          </div>

          <div className="relative z-10 shrink-0">
            <VoteButton
              modId={mod.id}
              githubStars={mod.github_stars}
              githubUrl={mod.github_url}
              slug={mod.slug}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {mod.description}
        </p>

        {/* Inline semantic permission indicator (plain typography, no capsule clutter) */}
        {permInfo && PermIcon && permStyle && (
          <div
            title={permTooltip}
            className={cn(
              'relative z-10 mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium',
              permStyle.textClass
            )}
          >
            <PermIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{permInfo.shortLabel}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 py-3 border-t border-border/50 flex items-center justify-between gap-3 text-[13px] text-muted-foreground">
        <span className="truncate min-w-0">
          by {mod.author_name ?? mod.author_github}
        </span>
        <div className="flex items-center gap-3.5 shrink-0">
          <QuickCopyInstall
            commands={mod.install_commands}
            githubUrl={mod.github_url}
            category={mod.category}
            modName={mod.name}
          />
          <a
            href={mod.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
            aria-label={`View ${mod.name} on GitHub`}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span>GitHub</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
