'use client'

import { Button } from '@/components/ui/button'
import { GitHubIcon } from '@/components/shared/GitHubIcon'
import { createClient } from '@/lib/supabase/client'

import { cn } from '@/lib/utils'

interface GitHubSignInProps {
  next?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  label?: string
  className?: string
}

export function GitHubSignIn({
  next,
  variant = 'default',
  size = 'default',
  label = 'Sign in with GitHub',
  className,
}: GitHubSignInProps) {
  const handleSignIn = async () => {
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo, scopes: 'public_repo' },
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignIn}
      className={cn('gap-2 shrink-0 cursor-pointer', className)}
      aria-label={label}
    >
      <GitHubIcon className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )
}
