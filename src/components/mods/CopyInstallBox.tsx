'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Terminal, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CopyInstallBoxProps {
  commands: string[]
  githubUrl: string
  category: string
  testedVersion?: string | null
  className?: string
}

export function CopyInstallBox({
  commands,
  githubUrl,
  category,
  testedVersion,
  className,
}: CopyInstallBoxProps) {
  const [copied, setCopied] = useState(false)

  // Derive fallback marketplace command for in-process mods if commands array is empty
  const effectiveCommands = (() => {
    if (commands && commands.length > 0) return commands
    if (category !== 'mod') return []
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
    if (!match) return []
    const ownerRepo = `${match[1]}/${match[2].replace(/\.git$/i, '')}`
    return [`claude plugin marketplace add ${ownerRepo}`]
  })()

  if (effectiveCommands.length === 0) return null

  const copyText = effectiveCommands.join('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback ignored if clipboard is unavailable
    }
  }

  return (
    <div className={cn('rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs', className)}>
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border/60 bg-muted/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Terminal className="h-3.5 w-3.5 text-emerald-500" />
          <span>Install</span>
          {testedVersion && (
            <span className="text-[10px] font-normal text-muted-foreground ml-1">
              · Claude Code {testedVersion}+
            </span>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2 text-xs gap-1.5 cursor-pointer"
          aria-label="Copy install commands"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      <div className="bg-zinc-950 text-zinc-100 p-3.5 font-mono text-xs leading-relaxed overflow-x-auto">
        {effectiveCommands.map((cmd, idx) => (
          <div key={idx} className="flex items-start gap-2 whitespace-pre">
            <span className="text-zinc-500 select-none">$</span>
            <span className="text-zinc-100">{cmd}</span>
          </div>
        ))}
      </div>

      <div className="px-3.5 py-2.5 bg-muted/20 border-t border-border/50 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span>Run <code className="font-mono text-foreground/80">claude plugin validate</code> to audit</span>
        </span>
        <Link
          href="/install"
          prefetch={false}
          className="text-primary hover:underline font-medium shrink-0"
        >
          Guide →
        </Link>
      </div>
    </div>
  )
}
