import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ExternalLink, Star, Calendar, Github, ArrowLeft, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ModBadge } from '@/components/mods/ModBadge'
import { ModGrid } from '@/components/mods/ModGrid'
import { MarkdownContent } from '@/components/mods/MarkdownContent'
import { VoteButton } from '@/components/vote/VoteButton'
import { getModBySlug, getRelatedMods } from '@/lib/queries/mods'
import { SITE_NAME } from '@/lib/constants'
import { formatDistanceToNow } from '@/lib/utils'

export const revalidate = 3600

interface ModPageProps {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({ params }: ModPageProps): Promise<Metadata> {
  const { slug } = await params
  const mod = await getModBySlug(slug)
  if (!mod) return { title: 'Not Found' }

  return {
    title: `${mod.name} — ${SITE_NAME}`,
    description: mod.description,
    openGraph: {
      title: mod.name,
      description: mod.description,
      type: 'article',
    },
  }
}

export default async function ModPage({ params }: ModPageProps) {
  const { slug } = await params
  const [mod, related] = await Promise.all([
    getModBySlug(slug),
    getModBySlug(slug).then((m) => m ? getRelatedMods(m.category, slug, 3) : []),
  ])

  if (!mod) notFound()

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to browse
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ModBadge category={mod.category} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{mod.name}</h1>
          <p className="text-muted-foreground text-lg">{mod.description}</p>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <VoteButton modId={mod.id} githubStars={mod.github_stars} githubUrl={mod.github_url} slug={mod.slug} />
          <a href={mod.github_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              GitHub
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Button>
          </a>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Github className="h-4 w-4" />
          <a
            href={`https://github.com/${mod.author_github}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            {mod.author_name ?? mod.author_github}
          </a>
        </span>
        {mod.github_stars > 0 && (
          <span className="flex items-center gap-1.5">
            <Star className="h-4 w-4" />
            {mod.github_stars.toLocaleString()} stars
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          Added {formatDistanceToNow(mod.created_at)}
        </span>
      </div>

      {/* Tags */}
      {mod.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
          {mod.tags.map((tag) => (
            <Link key={tag} href={`/browse?q=${encodeURIComponent(tag)}`}>
              <Badge variant="outline" className="font-normal hover:border-primary/50 cursor-pointer">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <Separator className="mb-6" />

      {/* Long description */}
      {mod.long_description ? (
        <div className="mb-10 text-sm leading-relaxed">
          <MarkdownContent content={mod.long_description} githubUrl={mod.github_url} />
        </div>
      ) : (
        <div className="mb-10">
          <p className="text-muted-foreground">
            Visit the{' '}
            <a
              href={mod.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              GitHub repository
            </a>{' '}
            for full documentation and installation instructions.
          </p>
        </div>
      )}

      {/* Related mods */}
      {related.length > 0 && (
        <section>
          <Separator className="mb-6" />
          <h2 className="text-lg font-semibold mb-4">More {mod.category === 'mcp-server' ? 'MCP Servers' : `${mod.category.charAt(0).toUpperCase() + mod.category.slice(1)}s`}</h2>
          <ModGrid mods={related} />
        </section>
      )}
    </div>
  )
}
