import Link from 'next/link'
import { Star, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ModBadge } from '@/components/mods/ModBadge'
import { VoteButton } from '@/components/vote/VoteButton'
import type { Mod } from '@/types/mod'
import { formatDistanceToNow } from '@/lib/utils'

interface ModCardProps {
  mod: Mod
}

export function ModCard({ mod }: ModCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow border-border/60">
      <CardContent className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <ModBadge category={mod.category} className="mb-2" />
            <Link href={`/mods/${mod.slug}`} className="block">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                {mod.name}
              </h3>
            </Link>
          </div>
          <VoteButton modId={mod.id} initialCount={mod.vote_count} slug={mod.slug} />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mod.description}</p>

        {/* Tags */}
        {mod.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mod.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 font-normal">
                {tag}
              </Badge>
            ))}
            {mod.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 font-normal text-muted-foreground">
                +{mod.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-5 pb-4 pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {mod.github_stars > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {mod.github_stars.toLocaleString()}
            </span>
          )}
          <span>by {mod.author_name ?? mod.author_github}</span>
        </div>
        <a
          href={mod.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          aria-label="View on GitHub"
        >
          <ExternalLink className="h-3 w-3" />
          GitHub
        </a>
      </CardFooter>
    </Card>
  )
}
