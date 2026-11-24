import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Terminal, ShieldCheck, Eye, Globe, CheckCircle2, Layers, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PERMISSION_LEVELS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'How to Install Claude Code Mods',
  description:
    'Step-by-step guide to installing, testing, and auditing Claude Code 2.1.287+ in-process TypeScript mods safely using claude plugin marketplace and claude plugin validate.',
  alternates: {
    canonical: '/install',
  },
}

export default function InstallGuidePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/browse?category=mod"
        prefetch={false}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse Claude Mods
      </Link>

      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
          Claude Code 2.1.287+ Guide
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          How to Install &amp; Audit Claude Mods
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          In-process TypeScript mods run directly inside Claude Code to draw live terminal panels,
          intercept tool calls, manage context, and customize your workflow.
        </p>
      </header>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Prerequisites */}
        <section className="rounded-xl border border-border/70 bg-card p-5">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Prerequisites
          </h2>
          <p className="text-muted-foreground mb-3">
            In-process mods require <strong>Claude Code v2.1.287 or later</strong>. Check your installed version and update if needed:
          </p>
          <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-3.5 font-mono text-xs overflow-x-auto">
            <code>{`claude --version\nclaude update`}</code>
          </pre>
        </section>

        {/* Standard 2-command install */}
        <section>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            1. Standard 2-Command Install
          </h2>
          <p className="text-muted-foreground mb-3">
            Most mods on ClaudeMod ship a <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">.claude-plugin/marketplace.json</code> manifest.
            Copy the two commands from any mod page and run them in your terminal:
          </p>
          <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-x-auto mb-3">
            <code>{`claude plugin marketplace add <owner>/<repo>\nclaude plugin install <mod-name>@<marketplace-name>`}</code>
          </pre>
          <p className="text-muted-foreground">
            If you already have a Claude Code session open, run{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">/reload-plugins</code>{' '}
            (or restart Claude Code) for the mod to load.
          </p>
        </section>

        {/* Single-session dry run */}
        <section>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-500" />
            2. Try a Mod Without Installing Permanently
          </h2>
          <p className="text-muted-foreground mb-3">
            Want to test a mod for one session or inspect its source code first? Clone the repository and pass{' '}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">--plugin-dir</code>:
          </p>
          <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-x-auto">
            <code>{`git clone https://github.com/<owner>/<repo>.git\nclaude plugin validate ./<repo>\nclaude --plugin-dir ./<repo>`}</code>
          </pre>
        </section>

        <Separator />

        {/* Security & Permission badges */}
        <section>
          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            3. Security &amp; Access Footprints
          </h2>
          <p className="text-muted-foreground mb-4">
            Because Claude Code mods execute <strong>in-process</strong> with your local user permissions (not inside a browser sandbox),
            ClaudeMod statically scans mod manifests and hook modules to highlight what APIs each mod accesses before you install:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3.5">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                <ShieldCheck className="h-4 w-4" />
                {PERMISSION_LEVELS['ui-only'].label}
              </div>
              <p className="text-xs text-muted-foreground">{PERMISSION_LEVELS['ui-only'].description}</p>
            </div>

            <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 p-3.5">
              <div className="flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-400 mb-1">
                <Eye className="h-4 w-4" />
                {PERMISSION_LEVELS.reads.label}
              </div>
              <p className="text-xs text-muted-foreground">{PERMISSION_LEVELS.reads.description}</p>
            </div>

            <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400 mb-1">
                <Terminal className="h-4 w-4" />
                {PERMISSION_LEVELS['writes-or-runs'].label}
              </div>
              <p className="text-xs text-muted-foreground">{PERMISSION_LEVELS['writes-or-runs'].description}</p>
            </div>

            <div className="rounded-lg border border-rose-500/25 bg-rose-500/5 p-3.5">
              <div className="flex items-center gap-1.5 font-semibold text-rose-700 dark:text-rose-400 mb-1">
                <Globe className="h-4 w-4" />
                {PERMISSION_LEVELS.network.label}
              </div>
              <p className="text-xs text-muted-foreground">{PERMISSION_LEVELS.network.description}</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Static scanning is a helpful first-pass indicator, not a formal security audit. Always review source code on GitHub
            and run <code className="bg-muted px-1 py-0.5 rounded font-mono">claude plugin validate</code> for mods with shell or network access.
          </p>
        </section>

        <Separator />

        {/* Managing & Uninstalling */}
        <section>
          <h2 className="text-xl font-semibold mb-2">4. Managing &amp; Removing Mods</h2>
          <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-x-auto mb-6">
            <code>{`claude plugin list\nclaude plugin uninstall <mod-name>@<marketplace-name>`}</code>
          </pre>

          <div className="flex flex-wrap gap-3">
            <Link href="/browse?category=mod" prefetch={false}>
              <Button className="cursor-pointer">Explore Claude Mods</Button>
            </Link>
            <Link href="/submit" prefetch={false}>
              <Button variant="outline" className="cursor-pointer">Submit Your Mod</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
