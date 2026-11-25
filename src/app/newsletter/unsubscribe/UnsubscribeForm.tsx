'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UnsubscribeFormProps {
  token?: string
}

export function UnsubscribeForm({ token }: UnsubscribeFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')

  if (!token) {
    return (
      <div className="rounded-xl border border-border/70 bg-card p-6 text-center space-y-3">
        <AlertCircle className="h-6 w-6 text-amber-500 mx-auto" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">
          This unsubscribe link is missing a valid token. Reply to any ClaudeMod digest email and we&apos;ll remove you immediately.
        </p>
        <Link href="/" prefetch={false}>
          <Button variant="outline" size="sm" className="cursor-pointer">
            Back to ClaudeMod
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setMessage('')

    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setStatus('error')
        setMessage(data.error || 'Could not process your request right now.')
        return
      }
      setStatus('done')
      setMessage(data.message || "You've been unsubscribed.")
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-6 space-y-4">
      {status === 'done' ? (
        <div role="status" aria-live="polite" className="text-center space-y-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" aria-hidden="true" />
          <p className="text-sm font-medium">{message}</p>
          <p className="text-xs text-muted-foreground">
            You won&apos;t receive any more weekly digest emails from ClaudeMod.
          </p>
          <Link href="/" prefetch={false}>
            <Button variant="outline" size="sm" className="cursor-pointer">
              Back to ClaudeMod
            </Button>
          </Link>
        </div>
      ) : (
        <form action="/api/newsletter/unsubscribe" method="POST" onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          <p className="text-sm text-muted-foreground">
            Confirm below to stop receiving the weekly ClaudeMod digest.
          </p>
          {status === 'error' && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{message}</span>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={status === 'submitting'} className="cursor-pointer">
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" aria-hidden="true" />
                  Unsubscribing...
                </>
              ) : (
                'Unsubscribe me'
              )}
            </Button>
            <Link href="/" prefetch={false}>
              <Button type="button" variant="ghost" className="cursor-pointer">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
