'use client'

import { useState } from 'react'
import { Check, Terminal } from 'lucide-react'
import { toast } from 'sonner'

interface QuickCopyInstallProps {
  commands?: string[]
  githubUrl: string
  category: string
  modName: string
}

export function QuickCopyInstall({
  commands = [],
  githubUrl,
  category,
  modName,
}: QuickCopyInstallProps) {
  const [copied, setCopied] = useState(false)

  const effectiveCommands = (() => {
    if (commands.length > 0) return commands
    if (category !== 'mod') return []
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
    if (!match) return []
    return [`claude plugin marketplace add ${match[1]}/${match[2].replace(/\.git$/i, '')}`]
  })()

  if (effectiveCommands.length === 0) return null

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(effectiveCommands.join('\n'))
      setCopied(true)
      toast.success(`Copied install command for ${modName}`)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={`Copy install command:\n${effectiveCommands.join('\n')}`}
      aria-label={`Copy install command for ${modName}`}
      className="relative z-10 inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
        </>
      ) : (
        <>
          <Terminal className="h-3 w-3" />
          <span>Install</span>
        </>
      )}
    </button>
  )
}
