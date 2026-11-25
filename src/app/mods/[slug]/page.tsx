import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ExternalLink,
  Star,
  Calendar,
  ArrowLeft,
  Tag,
  Shield,
  Scale,
  Monitor,
  Zap,
  Sparkles,
  ChevronRight,
  Layers,
  RefreshCw,
} from 'lucide-react'
import { GitHubIcon } from '@/components/shared/GitHubIcon'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ModBadge } from '@/components/mods/ModBadge'
import { ModGrid } from '@/components/mods/ModGrid'
import { MarkdownContent } from '@/components/mods/MarkdownContent'
import { CopyInstallBox } from '@/components/mods/CopyInstallBox'
import { EmbedBadgeButton } from '@/components/mods/EmbedBadgeButton'
import { PermissionPill } from '@/components/mods/PermissionPill'
import { VoteButton } from '@/components/vote/VoteButton'
import { getModBySlug, getRelatedMods } from '@/lib/queries/mods'
import {
  CATEGORIES,
  MOD_SUBCATEGORIES,
  PERMISSION_LEVELS,
  SITE_NAME,
  SITE_URL,
} from '@/lib/constants'
import { formatDistanceToNow } from '@/lib/utils'

export const revalidate = 86400

interface ModPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { getAllModSlugs } = await import('@/lib/queries/mods')
  const slugs = await getAllModSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ModPageProps): Promise<Metadata> {
  const { slug } = await params
  const mod = await getModBySlug(slug)
  if (!mod) return { title: 'Not Found' }

  return {
    title: mod.name,
    description: mod.description,
    alternates: {
      canonical: `/mods/${mod.slug}`,
    },
    openGraph: {
      title: `${mod.name} — Claude Code Mod`,
      description: mod.description,
      type: 'article',
    },
  }
}

export default async function ModPage({ params }: ModPageProps) {
  const { slug } = await params
  const mod = await getModBySlug(slug)
  if (!mod) notFound()

  const related = await getRelatedMods(mod.category, slug, 3)
  const categoryInfo = CATEGORIES.find((c) => c.value === mod.category)
  const subcategoryInfo = MOD_SUBCATEGORIES.find((s) => s.value === mod.mod_subcategory)
  const permissionConfig = mod.permissions_level ? PERMISSION_LEVELS[mod.permissions_level] : null
  const hasPermissionPanel = Boolean(
    mod.category === 'mod' && (mod.permissions_level || (mod.permissions_labels && mod.permissions_labels.length > 0))
  )
  const cleanHookEvents = Array.from(
    new Set(
      (mod.hooks_events ?? [])
        .map((raw) => {
          const trimmed = raw.trim()
          if (trimmed.startsWith('{')) {
            try {
              const parsed = JSON.parse(trimmed) as { event?: string; name?: string }
              return parsed.event || parsed.name || ''
            } catch {
              return trimmed
            }
          }
          return trimmed
        })
        .filter(Boolean)
    )
  )

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareSourceCode',
        name: mod.name,
        description: mod.description,
        codeRepository: mod.github_url,
        url: `${SITE_URL}/mods/${mod.slug}`,
        author: {
          '@type': 'Person',
          name: mod.author_name ?? mod.author_github,
          url: `https://github.com/${mod.author_github}`,
        },
        ...(mod.license ? { license: mod.license } : {}),
        ...(mod.thumbnail_url ? { image: mod.thumbnail_url } : {}),
        programmingLanguage: mod.category === 'mod' ? 'TypeScript' : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryInfo?.label ?? mod.category,
            item: `${SITE_URL}/browse?category=${mod.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: mod.name,
            item: `${SITE_URL}/mods/${mod.slug}`,
          },
        ],
      },
    ],
  }

  const PermissionsCard = hasPermissionPanel ? (
    <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
          <Shield className="h-3.5 w-3.5 text-primary" />
          Access &amp; Permissions
        </span>
        <PermissionPill level={mod.permissions_level} labels={mod.permissions_labels} compact />
      </div>

      {permissionConfig && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {permissionConfig.description}
        </p>
      )}

      {mod.permissions_labels && mod.permissions_labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {mod.permissions_labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/70 text-foreground/85 border border-border/60"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
        Statically scanned from hooks &amp; source.{' '}
        <Link href="/install" prefetch={false} className="underline underline-offset-2 hover:text-foreground">
          Learn how to audit
        </Link>
      </p>
    </div>
  ) : null

  const DetailsCard = (
    <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 text-xs shadow-xs">
      <h2 className="font-semibold text-foreground">Details</h2>
      <dl className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted-foreground flex items-center gap-1.5">
            <GitHubIcon className="h-3.5 w-3.5" />
            Author
          </dt>
          <dd className="font-medium truncate">
            <a
              href={`https://github.com/${mod.author_github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @{mod.author_github}
            </a>
          </dd>
        </div>

        {mod.github_stars > 0 && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5" />
              GitHub Stars
            </dt>
            <dd className="font-medium tabular-nums">{mod.github_stars.toLocaleString()}</dd>
          </div>
        )}

        {subcategoryInfo && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Sub-category
            </dt>
            <dd>
              <Link
                href={`/browse?category=mod&sub=${subcategoryInfo.value}`}
                prefetch={false}
                className="font-medium text-primary hover:underline"
              >
                {subcategoryInfo.label}
              </Link>
            </dd>
          </div>
        )}

        {mod.license && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              License
            </dt>
            <dd className="font-medium">{mod.license}</dd>
          </div>
        )}

        {mod.surfaces && mod.surfaces.length > 0 && (
          <div className="flex items-start justify-between gap-2">
            <dt className="text-muted-foreground flex items-center gap-1.5 pt-0.5">
              <Monitor className="h-3.5 w-3.5" />
              Surfaces
            </dt>
            <dd className="flex flex-wrap justify-end gap-1">
              {mod.surfaces.map((s) => (
                <Link key={s} href={`/browse?category=mod&surface=${s}`} prefetch={false}>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize hover:bg-accent cursor-pointer">
                    {s}
                  </Badge>
                </Link>
              ))}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted-foreground flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Added
          </dt>
          <dd className="text-muted-foreground">{formatDistanceToNow(mod.created_at)}</dd>
        </div>

        {mod.updated_at && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Last synced
            </dt>
            <dd className="text-muted-foreground">{formatDistanceToNow(mod.updated_at)}</dd>
          </div>
        )}

        {cleanHookEvents.length > 0 && (
          <div className="pt-2.5 border-t border-border/50 space-y-2">
            <dt className="text-muted-foreground flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              Events hooked
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {cleanHookEvents.map((ev) => (
                <code
                  key={ev}
                  className="px-2 py-0.5 rounded-md bg-muted/80 border border-border/60 font-mono text-[11px] text-foreground/90"
                >
                  {ev}
                </code>
              ))}
            </dd>
          </div>
        )}
      </dl>
      <EmbedBadgeButton slug={mod.slug} modName={mod.name} />
    </div>
  )

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mb-6 flex-wrap">
        <Link
          href="/browse"
          prefetch={false}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Browse
        </Link>
        <ChevronRight className="h-3.5 w-3.5 opacity-50" />
        <Link
          href={`/browse?category=${mod.category}`}
          prefetch={false}
          className="hover:text-foreground transition-colors"
        >
          {categoryInfo?.label ?? mod.category}
        </Link>
        {subcategoryInfo && (
          <>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <Link
              href={`/browse?category=mod&sub=${subcategoryInfo.value}`}
              prefetch={false}
              className="hover:text-foreground transition-colors"
            >
              {subcategoryInfo.label}
            </Link>
          </>
        )}
      </nav>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        {/* Left column: Header + README */}
        <div className="min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <ModBadge category={mod.category} />
              {mod.is_official && (
                <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/15 text-xs gap-1 font-medium">
                  <Sparkles className="h-3 w-3" />
                  Official Anthropic
                </Badge>
              )}
              {subcategoryInfo && (
                <Link href={`/browse?category=mod&sub=${subcategoryInfo.value}`} prefetch={false}>
                  <Badge variant="outline" className="text-xs font-normal hover:border-primary/50">
                    {subcategoryInfo.label}
                  </Badge>
                </Link>
              )}
              <PermissionPill
                level={mod.permissions_level}
                labels={mod.permissions_labels}
                compact
                className="lg:hidden"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{mod.name}</h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{mod.description}</p>
          </div>

          {/* Mobile Actions + Install + Permissions */}
          <div className="lg:hidden space-y-4 mb-6">
            <div className="flex items-center gap-2.5">
              <VoteButton modId={mod.id} githubStars={mod.github_stars} githubUrl={mod.github_url} slug={mod.slug} />
              <a href={mod.github_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto cursor-pointer">
                  <GitHubIcon className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </Button>
              </a>
            </div>
            <CopyInstallBox
              commands={mod.install_commands ?? []}
              githubUrl={mod.github_url}
              category={mod.category}
              testedVersion={mod.tested_claude_version}
            />
            {PermissionsCard}
          </div>

          {/* Meta row (compact) */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5 flex-wrap lg:hidden">
            <span className="flex items-center gap-1.5">
              <GitHubIcon className="h-4 w-4" />
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
              <Tag className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {mod.tags.map((tag) => (
                <Link key={tag} href={`/browse?q=${encodeURIComponent(tag)}`} prefetch={false}>
                  <Badge variant="outline" className="text-xs font-normal hover:border-primary/50 cursor-pointer">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          <Separator className="mb-6" />

          {/* Long description / README */}
          {mod.long_description ? (
            <div className="mb-10 text-sm leading-relaxed overflow-x-auto">
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

          {/* Mobile details card at bottom of README */}
          <div className="lg:hidden mb-8">{DetailsCard}</div>
        </div>

        {/* Right sticky sidebar (Desktop) */}
        <aside className="hidden lg:flex lg:flex-col gap-4 sticky top-20 self-start">
          <div className="flex items-center gap-2">
            <VoteButton modId={mod.id} githubStars={mod.github_stars} githubUrl={mod.github_url} slug={mod.slug} />
            <a href={mod.github_url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" size="sm" className="gap-2 w-full cursor-pointer">
                <GitHubIcon className="h-4 w-4" />
                GitHub
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </Button>
            </a>
          </div>

          <CopyInstallBox
            commands={mod.install_commands ?? []}
            githubUrl={mod.github_url}
            category={mod.category}
            testedVersion={mod.tested_claude_version}
          />

          {PermissionsCard}
          {DetailsCard}
        </aside>
      </div>

      {/* Related mods */}
      {related.length > 0 && (
        <section className="mt-4">
          <Separator className="mb-6" />
          <h2 className="text-lg font-semibold mb-4">
            More {categoryInfo?.label ?? `${mod.category}s`}
          </h2>
          <ModGrid mods={related} />
        </section>
      )}
    </div>
  )
}
