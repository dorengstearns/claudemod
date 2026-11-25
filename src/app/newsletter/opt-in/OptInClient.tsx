'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OptInClientProps {
  token?: string
}

export function OptInClient({ token }: OptInClientProps) {
  const ranRef = useRef(false)
  const [status, setStatus] = useState<'loading' | 'success' | 'unsubscribed' | 'error'>(
    token ? 'loading' : 'error'
  )
  const [email, setEmail] = useState<string>('')
  const [message, setMessage] = useState<string>(
    token ? '' : 'This opt-in link is missing a valid token.'
  )
  const [unsubscribeToken, setUnsubscribeToken] = useState<string>('')
  const [undoing, setUndoing] = useState(false)

  useEffect(() => {
    if (!token || ranRef.current) return
    ranRef.current = true

    fetch('/api/newsletter/opt-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.ok) {
          setStatus('error')
          setMessage(data.error || 'Could not confirm your subscription right now.')
          return
        }
        setEmail(data.email || '')
        setUnsubscribeToken(data.unsubscribeToken || '')
        setMessage(data.message || "You're subscribed to the Weekly Claude Mods Digest.")
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
        setMessage('Network error. Please try refreshing this page.')
      })
  }, [token])

  const handleUndo = async () => {
    if (!unsubscribeToken || undoing) return
    setUndoing(true)
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: unsubscribeToken }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setStatus('unsubscribed')
        setMessage("No problem — you've been removed from the Weekly Digest.")
      }
    } finally {
      setUndoing(false)
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-6 shadow-xs">
      <div role="status" aria-live="polite">
        {status === 'loading' && (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">Confirming your Weekly Digest opt-in...</p>
            {token && (
              <noscript>
                <form action="/api/newsletter/opt-in" method="POST" className="mt-2">
                  <input type="hidden" name="token" value={token} />
                  <Button type="submit" size="sm">
                    Confirm subscription
                  </Button>
                </form>
              </noscript>
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold tracking-tight">{message}</h2>
              {email && (
                <p className="text-sm text-muted-foreground">
                  Subscribed as <strong className="font-medium text-foreground">{email}</strong>.
                  Expect the top new Claude Code mods and install commands once a week — no fluff.
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Link href="/browse?category=mod" prefetch={false}>
                <Button size="sm" className="cursor-pointer">
                  Browse Claude Mods
                </Button>
              </Link>
              {unsubscribeToken && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleUndo}
                  disabled={undoing}
                  className="text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {undoing ? 'Removing...' : 'Undo / Unsubscribe'}
                </Button>
              )}
            </div>
          </div>
        )}

        {status === 'unsubscribed' && (
          <div className="text-center space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mx-auto">
              <Mail className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-sm font-medium">{message}</p>
            <Link href="/" prefetch={false}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Back to ClaudeMod
              </Button>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto">
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold">Couldn&apos;t confirm link</h2>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
            <Link href="/#digest" prefetch={false}>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Subscribe on ClaudeMod
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
