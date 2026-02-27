'use client'

import { useTransition } from 'react'
import { approveMod, rejectMod } from '@/lib/actions/admin'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

type PendingMod = {
  id: string
  name: string
  description: string
  category: string
  github_url: string
  author_github: string
  created_at: string
}

export function AdminQueue({ mods }: { mods: PendingMod[] }) {
  if (mods.length === 0) {
    return <p className="text-muted-foreground text-sm">No pending submissions.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {mods.map((mod) => (
        <ModRow key={mod.id} mod={mod} />
      ))}
    </div>
  )
}

function ModRow({ mod }: { mod: PendingMod }) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{mod.name}</span>
            <Badge variant="outline" className="text-xs">{mod.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{mod.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <a
              href={mod.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" />
              {mod.github_url.replace('https://github.com/', '')}
            </a>
            <span>by @{mod.author_github}</span>
            <span>{new Date(mod.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            disabled={pending}
            onClick={() => startTransition(() => rejectMod(mod.id))}
          >
            Reject
          </Button>
          <Button
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => approveMod(mod.id))}
          >
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}
