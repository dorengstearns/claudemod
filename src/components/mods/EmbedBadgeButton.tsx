'use client'

import { useState } from 'react'
import { Check, Code2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SITE_URL } from '@/lib/constants'

interface EmbedBadgeButtonProps {
  slug: string
  modName: string
}

export function EmbedBadgeButton({ slug, modName }: EmbedBadgeButtonProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const badgeImgUrl = 'https://img.shields.io/badge/Listed%20on-ClaudeMod-10b981?style=flat-square'
  const targetUrl = `${SITE_URL}/mods/${slug}`
  const markdown = `[![Listed on ClaudeMod](${badgeImgUrl})](${targetUrl})`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard failures
    }
  }

  return (
    <div className="pt-2.5 border-t border-border/50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          <Code2 className="h-3.5 w-3.5" />
          <span>Embed README badge</span>
        </span>
        <span>{open ? 'Hide' : 'Show'}</span>
      </button>

      {open && (
        <div className="mt-2.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badgeImgUrl}
              alt={`Listed on ClaudeMod — ${modName}`}
              height={20}
              className="h-5"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-[11px] gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy MD</span>
                </>
              )}
            </Button>
          </div>
          <pre className="p-2 rounded-md bg-muted text-[10px] font-mono text-foreground/85 overflow-x-auto whitespace-pre-wrap break-all select-all">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  )
}
