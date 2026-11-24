import Link from 'next/link'
import { ExternalLink, Sparkles } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ModBadge } from '@/components/mods/ModBadge'
import { ModThumbnail } from '@/components/mods/ModThumbnail'
import { PermissionPill } from '@/components/mods/PermissionPill'
import { VoteButton } from '@/components/vote/VoteButton'
import type { Mod } from '@/types/mod'
import { MOD_SUBCATEGORIES } from '@/lib/constants'
import { extractModVisual } from '@/lib/visuals'

interface ModCardProps {
  mod: Mod
}

export function ModCard({ mod }: ModCardProps) {
  const visual = mod.thumbnail_url ?? extractModVisual(mod.long_description, mod.github_url)
  const subcategory = mod.mod_subcategory
    ? MOD_SUBCATEGORIES.find((s) => s.value === mod.mod_subcategory)
    : null

  return (
    <Card className="group relative flex flex-col overflow-hidden hover:shadow-md transition-shadow border-border/60">
      {/* Stretched link covers the whole card */}
      <Link
        href={`/mods/${mod.slug}`}
        prefetch={false}
        className="absolute inset-0 z-0"
        aria-label={mod.name}
      />

      {visual && <ModThumbnail src={visual} alt={mod.name} />}

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <ModBadge category={mod.category} className="relative z-10" />
              {mod.is_official && (
                <Badge className="relative z-10 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/15 text-[10px] px-1.5 py-0 gap-0.5 font-medium">
                  <Sparkles className="h-2.5 w-2.5" />
                  Official
                </Badge>
              )}
              {subcategory && (
                <span className="relative z-10 text-[11px] text-muted-foreground font-medium">
                  · {subcategory.label}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {mod.name}
            </h3>
          </div>
          <div className="relative z-10">
            <VoteButton modId={mod.id} githubStars={mod.github_stars} githubUrl={mod.github_url} slug={mod.slug} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mod.description}</p>

        {/* Permission pill + Tags */}
        {(mod.permissions_level || mod.tags.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {mod.category === 'mod' && mod.permissions_level && mod.permissions_level !== 'unknown' && (
              <div className="relative z-10">
                <PermissionPill
                  level={mod.permissions_level}
                  labels={mod.permissions_labels}
                  compact
                />
              </div>
            )}
            {mod.tags.slice(0, mod.permissions_level ? 2 : 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 font-normal">
                {tag}
              </Badge>
            ))}
            {mod.tags.length > (mod.permissions_level ? 2 : 3) && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 font-normal text-muted-foreground">
                +{mod.tags.length - (mod.permissions_level ? 2 : 3)}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate">by {mod.author_name ?? mod.author_github}</span>
        </div>
        <a
          href={mod.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
          aria-label="View on GitHub"
        >
          <ExternalLink className="h-3 w-3" />
          GitHub
        </a>
      </CardFooter>
    </Card>
  )
}
