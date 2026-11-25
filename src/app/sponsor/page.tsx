import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Mail, LayoutTemplate, Sparkles, ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getCategoryCounts, getTotalModCount } from '@/lib/queries/mods'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Sponsor ClaudeMod',
  description:
    'Reach active Claude Code developers discovering and installing mods, MCP servers, and skills on ClaudeMod. Native static placements and weekly digest sponsorships.',
  alternates: {
    canonical: '/sponsor',
  },
}

const SPONSOR_EMAIL = 'hello@claudemod.com'
const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent('Sponsoring ClaudeMod')}`

export default async function SponsorPage() {
  const [totalCount, categoryCounts] = await Promise.all([
    getTotalModCount(),
    getCategoryCounts(),
  ])

  const claudeModsCount = categoryCounts['mod'] ?? 0

  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        prefetch={false}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to ClaudeMod
      </Link>

      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
          Partnerships &amp; Sponsorships
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          Sponsor ClaudeMod
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Reach developers actively building with and customizing Claude Code — through clean, native placements with zero ad-network clutter.
        </p>
      </header>

      {/* Audience snapshot */}
      <section aria-label="Audience snapshot" className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="text-2xl font-bold tracking-tight tabular-nums">~30,000</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Monthly visits · 100% organic
          </div>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="text-2xl font-bold tracking-tight">#2 on Google</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Organic rank for &ldquo;claude mods&rdquo;
          </div>
        </div>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <div className="text-2xl font-bold tracking-tight tabular-nums">
            {totalCount > 0 ? `${totalCount}+` : '400+'}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Listings{claudeModsCount > 0 ? ` (${claudeModsCount} Claude Mods)` : ''}
          </div>
        </div>
      </section>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Placement options */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Placement Options</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-xl border border-border/70 bg-card p-5 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  Site-Wide Native Sponsor Slot
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Weekly or Monthly
                </span>
              </div>
              <p className="text-muted-foreground">
                A clean, static HTML card displayed on the homepage and browse pages. Because it&apos;s rendered natively with no third-party ad scripts, it isn&apos;t hidden by developer ad blockers.
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 pt-1">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                  Logo, concise 1-line developer pitch, and CTA link
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                  Exclusive single-sponsor slot (never rotated with noisy banners)
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-5 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                  Featured Listing
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  For commercial tools &amp; MCPs
                </span>
              </div>
              <p className="text-muted-foreground">
                Pin your official Claude Code mod, plugin, or MCP server at the top of its category with a clear <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">Sponsored</code> badge while organic star rankings stay untouched.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card p-5 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-sky-500" aria-hidden="true" />
                  Weekly Digest Mention
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  Bundleable
                </span>
              </div>
              <p className="text-muted-foreground">
                A dedicated developer-focused blurb in our weekly Claude Mods Digest email. Available standalone or bundled alongside the site-wide native slot.
              </p>
            </div>
          </div>
        </section>

        {/* Audience fit */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Who Fits Best</h2>
          <p className="text-muted-foreground mb-3">
            Our visitors are engineers using Claude Code daily in the terminal and IDE. Sponsorships perform best for technical products built for this workflow:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              AI coding tools, IDEs, and terminal harnesses
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              MCP servers, hosting, and API gateways
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              Agent sandboxes, evals, and observability
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-500 shrink-0" aria-hidden="true" />
              Code review, security, and developer infra
            </li>
          </ul>
        </section>

        {/* Editorial policy */}
        <section className="rounded-xl border border-border/70 bg-muted/30 p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm">Editorial Independence</p>
            <p>
              All paid placements are clearly labeled and tagged with{' '}
              <code className="bg-muted px-1 py-0.5 rounded font-mono">rel=&quot;sponsored noopener&quot;</code>.
              Organic search rankings, GitHub star sorting, and static permission scans are never for sale.
            </p>
          </div>
        </section>

        <Separator />

        {/* Contact CTA */}
        <section className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Interested in sponsoring?</h2>
            <p className="text-sm text-muted-foreground">
              Send a quick note with your product, link, and preferred timeframe to{' '}
              <a
                href={SPONSOR_MAILTO}
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                {SPONSOR_EMAIL}
              </a>
              .
            </p>
          </div>
          <a href={SPONSOR_MAILTO} className="shrink-0">
            <Button className="gap-2 cursor-pointer w-full sm:w-auto">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Get in touch
            </Button>
          </a>
        </section>
      </div>
    </div>
  )
}
