'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type NewsletterSource = 'home' | 'home_sticky' | 'browse' | 'mod_sidebar' | 'sponsor' | 'site'

interface NewsletterCaptureProps {
  variant?: 'banner' | 'compact' | 'sticky-bar'
  source: NewsletterSource
  className?: string
}

const STRICT_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function getValidationMessage(input: HTMLInputElement): string {
  if (input.validity.valueMissing || !input.value.trim()) {
    return 'Please enter your email address.'
  }
  return 'Enter an email address in the format you@example.com.'
}

function matchesUserInvalid(input: HTMLInputElement): boolean {
  try {
    return input.matches(':user-invalid')
  } catch {
    return !input.validity.valid && input.value.trim().length > 0
  }
}

export function NewsletterCapture({
  variant = 'banner',
  source,
  className,
}: NewsletterCaptureProps) {
  const uid = useId()
  const headingId = `${uid}-heading`
  const inputId = `${uid}-email`
  const hintId = `${uid}-hint`
  const errorId = `${uid}-error`
  const honeypotId = `${uid}-website`

  const inputRef = useRef<HTMLInputElement>(null)
  const announceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [liveAnnouncement, setLiveAnnouncement] = useState('')
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    return () => {
      if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    }
  }, [])

  const announce = (msg: string, delayMs = 0) => {
    if (announceTimerRef.current) clearTimeout(announceTimerRef.current)
    setLiveAnnouncement('')
    if (!msg) return
    if (delayMs > 0) {
      announceTimerRef.current = setTimeout(() => setLiveAnnouncement(msg), delayMs)
    } else {
      setLiveAnnouncement(msg)
    }
  }

  const hasError = Boolean(errorMessage)
  const describedBy = hasError ? `${hintId} ${errorId}` : hintId

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value
    setEmail(nextValue)
    if (errorMessage) {
      setErrorMessage('')
      announce('')
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    let nextError = ''
    if (matchesUserInvalid(input)) {
      nextError = getValidationMessage(input)
    } else if (input.value.trim() && !STRICT_EMAIL_RE.test(input.value.trim())) {
      nextError = 'Enter an email address in the format you@example.com.'
    }
    if (nextError) {
      setErrorMessage(nextError)
      announce(`Email address: Error: ${nextError}`, 500)
    }
  }

  const handleInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    const input = e.currentTarget
    setErrorMessage(getValidationMessage(input))
    announce('')
    input.focus()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return

    const input = inputRef.current
    const trimmed = email.trim()

    if (!trimmed) {
      setErrorMessage('Please enter your email address.')
      announce('')
      input?.focus()
      return
    }

    if (!STRICT_EMAIL_RE.test(trimmed)) {
      setErrorMessage('Enter an email address in the format you@example.com.')
      announce('')
      input?.focus()
      return
    }

    setErrorMessage('')
    announce('')
    setStatus('submitting')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source, website }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok || !data.ok) {
        const err = data.error || 'Could not subscribe right now. Please try again.'
        setStatus('idle')
        setErrorMessage(err)
        input?.focus()
        return
      }

      const msg = data.message || "You're subscribed to the weekly ClaudeMod digest."
      setStatus('success')
      setSuccessMessage(msg)
      announce(msg)
      setEmail('')
    } catch {
      setStatus('idle')
      setErrorMessage('Network error. Please try again.')
      input?.focus()
    }
  }

  if (variant === 'sticky-bar') {
    if (dismissed) return null
    return (
      <div
        className={cn(
          'md:sticky md:top-15 z-40 w-full border-b border-emerald-600/20 dark:border-emerald-400/20 bg-emerald-50/95 dark:bg-[#0d1c17]/95 md:backdrop-blur-md',
          className
        )}
      >
        <div aria-live="polite" className="sr-only">
          {liveAnnouncement}
        </div>
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-2">
          {status === 'success' ? (
            <div className="flex items-center justify-between gap-3 min-h-8">
              <div className="flex items-center gap-2 text-[13px] text-emerald-800 dark:text-emerald-300 font-medium">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                aria-label="Dismiss digest bar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-900/60 dark:text-emerald-200/60 hover:text-foreground hover:bg-emerald-500/15 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              aria-label="Weekly Claude Mods digest signup"
              onSubmit={handleSubmit}
              className="relative flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4"
            >
              <input type="hidden" name="source" value={source} />
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor={honeypotId}>Company website</label>
                <input
                  id={honeypotId}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between gap-2 min-w-0">
                <label
                  htmlFor={inputId}
                  className="flex items-center gap-2 text-[13px] min-w-0 cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-emerald-950 dark:text-emerald-50 shrink-0">
                    Weekly Claude Mods digest
                  </span>
                  <span className="hidden sm:inline text-emerald-900/80 dark:text-emerald-200/80 truncate">
                    Top new mods &amp; install commands every week.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss digest bar"
                  className="md:hidden inline-flex h-7 w-7 items-center justify-center rounded-md text-emerald-900/60 dark:text-emerald-200/60 hover:text-foreground hover:bg-emerald-500/15 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  ref={inputRef}
                  id={inputId}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="send"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onInvalid={handleInvalid}
                  aria-invalid={hasError ? 'true' : 'false'}
                  aria-describedby={hasError ? errorId : undefined}
                  className={cn(
                    'flex-1 min-w-0 md:w-52 lg:w-60 min-h-9 md:min-h-8 h-9 md:h-8 rounded-md border bg-card px-3 text-base md:text-[13px] text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-600/60 user-invalid:border-destructive',
                    hasError ? 'border-destructive focus-visible:ring-destructive/35' : 'border-emerald-600/25 dark:border-emerald-400/25'
                  )}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={status === 'submitting'}
                  className="min-h-9 md:min-h-8 h-9 md:h-8 px-3.5 text-[13px] font-medium shrink-0 cursor-pointer rounded-md bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 transition-colors"
                >
                  {status === 'submitting' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    'Subscribe'
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  aria-label="Dismiss digest bar"
                  className="hidden md:inline-flex h-8 w-8 items-center justify-center rounded-md text-emerald-900/55 dark:text-emerald-200/55 hover:text-foreground hover:bg-emerald-500/15 transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
          {hasError && (
            <p
              id={errorId}
              className="flex items-center md:justify-end gap-1.5 text-[13px] text-destructive mt-1.5 md:mt-1 md:pr-10"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" role="img" aria-label="Error" />
              <span>{errorMessage}</span>
            </p>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <section
        aria-labelledby={headingId}
        className={cn(
          'rounded-xl border border-emerald-500/25 bg-emerald-50/45 dark:bg-emerald-950/20 p-4 shadow-xs text-xs',
          className
        )}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 shrink-0">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <h2 id={headingId} className="font-semibold text-foreground text-sm">
            Weekly Mods Digest
          </h2>
        </div>

        <p id={hintId} className="text-xs text-muted-foreground leading-relaxed mb-3">
          Top new Claude Code mods and install commands, once a week. No fluff, unsubscribe anytime.
        </p>

        <div aria-live="polite" className="sr-only">
          {liveAnnouncement}
        </div>

        {status === 'success' ? (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{successMessage}</span>
          </div>
        ) : (
          <form
            action="/api/newsletter/subscribe"
            method="POST"
            aria-labelledby={headingId}
            onSubmit={handleSubmit}
            className="relative space-y-2.5"
          >
            <input type="hidden" name="source" value={source} />
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor={honeypotId}>Company website</label>
              <input
                id={honeypotId}
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={inputId} className="block text-xs font-medium text-foreground">
                Email address
              </label>
              <input
                ref={inputRef}
                id={inputId}
                name="email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="send"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                onInvalid={handleInvalid}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={describedBy}
                className={cn(
                  'w-full min-h-12 sm:min-h-10 rounded-lg border bg-background px-3 py-2 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:border-emerald-600/60 user-invalid:border-destructive',
                  hasError ? 'border-destructive focus-visible:ring-destructive/30' : 'border-emerald-600/20 dark:border-emerald-400/20'
                )}
              />
              {hasError && (
                <p
                  id={errorId}
                  className="flex items-start gap-1.5 text-xs text-destructive pt-0.5"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" role="img" aria-label="Error" />
                  <span>{errorMessage}</span>
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={status === 'submitting'}
              className="w-full min-h-11 sm:min-h-9 gap-1.5 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe free
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </>
              )}
            </Button>
          </form>
        )}
      </section>
    )
  }

  return (
    <section
      id="digest"
      aria-labelledby={headingId}
      className={cn(
        'rounded-xl border border-emerald-600/25 dark:border-emerald-400/20 bg-emerald-600/[0.06] dark:bg-emerald-500/[0.08] px-6 py-7 sm:px-8 sm:py-8 scroll-mt-24',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-lg space-y-2">
          <h2 id={headingId} className="text-base sm:text-lg font-semibold tracking-[-0.015em] text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Get the best new Claude mods every week</span>
          </h2>
          <p id={hintId} className="text-sm text-muted-foreground leading-relaxed">
            A concise weekly digest of newly verified Claude Code mods, copy-paste install commands, and static permission summaries. Unsubscribe anytime.
          </p>
        </div>

        <div className="w-full md:max-w-md shrink-0">
          <div aria-live="polite" className="sr-only">
            {liveAnnouncement}
          </div>

          {status === 'success' ? (
            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{successMessage}</span>
            </div>
          ) : (
            <form
              action="/api/newsletter/subscribe"
              method="POST"
              aria-labelledby={headingId}
              onSubmit={handleSubmit}
              className="relative"
            >
              <input type="hidden" name="source" value={source} />
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor={honeypotId}>Company website</label>
                <input
                  id={honeypotId}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <label htmlFor={inputId} className="block text-[13px] font-medium text-foreground/85 mb-1.5">
                Email address
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  ref={inputRef}
                  id={inputId}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  enterKeyHint="send"
                  placeholder="you@example.com"
                  value={email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onInvalid={handleInvalid}
                  aria-invalid={hasError ? 'true' : 'false'}
                  aria-describedby={describedBy}
                  className={cn(
                    'flex-1 min-h-12 sm:min-h-10 rounded-lg border bg-card px-3.5 py-2 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:border-emerald-600/60 user-invalid:border-destructive',
                    hasError ? 'border-destructive focus-visible:ring-destructive/30' : 'border-emerald-600/25 dark:border-emerald-400/25'
                  )}
                />
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="min-h-12 sm:min-h-10 px-5 text-sm font-medium gap-1.5 shrink-0 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>

              {hasError && (
                <p
                  id={errorId}
                  className="flex items-start gap-1.5 text-[13px] text-destructive mt-1.5"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" role="img" aria-label="Error" />
                  <span>{errorMessage}</span>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
