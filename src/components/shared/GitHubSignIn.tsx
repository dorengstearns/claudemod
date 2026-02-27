'use client'

import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface GitHubSignInProps {
  next?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  label?: string
}

export function GitHubSignIn({
  next,
  variant = 'default',
  size = 'default',
  label = 'Sign in with GitHub',
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
    <Button variant={variant} size={size} onClick={handleSignIn} className="gap-2">
      <Github className="h-4 w-4" />
      {label}
    </Button>
  )
}
