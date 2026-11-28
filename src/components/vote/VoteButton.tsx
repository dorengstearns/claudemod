'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/shared/AuthProvider'
import { cn } from '@/lib/utils'

interface VoteButtonProps {
  modId: string
  githubStars: number
  githubUrl: string
  slug: string
}

async function syncGitHubStar(githubUrl: string, star: boolean, providerToken: string) {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!match) return
  const [, owner, repo] = match
  await fetch(`https://api.github.com/user/starred/${owner}/${repo.replace(/\.git$/, '')}`, {
    method: star ? 'PUT' : 'DELETE',
    headers: {
      Authorization: `Bearer ${providerToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Length': '0',
    },
  })
}

function formatStarCount(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(1)}k`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString()
}

export function VoteButton({ modId, githubStars, githubUrl, slug }: VoteButtonProps) {
  const { user, loading: authLoading } = useAuth()
  const [count, setCount] = useState(githubStars)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hydratedKey, setHydratedKey] = useState<string | null>(null)

  const currentKey = user ? `${user.id}:${modId}` : null

  useEffect(() => {
    if (authLoading || !user || !currentKey) return
    let cancelled = false
    const supabase = createClient()
    supabase
      .from('votes')
      .select('id')
      .eq('mod_id', modId)
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        setVoted(!!data)
        setHydratedKey(currentKey)
      })
    return () => {
      cancelled = true
    }
  }, [modId, user, authLoading, currentKey])

  const hydrated = !authLoading && (!user || hydratedKey === currentKey)
  const isVoted = Boolean(user && hydratedKey === currentKey && voted)

  const handleVote = async () => {
    if (!user) {
      window.location.href = `/auth/signin?next=/mods/${slug}`
      return
    }

    const supabase = createClient()

    const willBeVoted = !isVoted

    // Optimistic update
    const prevCount = count
    const prevVoted = isVoted
    setVoted(willBeVoted)
    setCount((c) => (isVoted ? c - 1 : c + 1))
    setLoading(true)

    try {
      const { data, error } = await supabase.rpc('toggle_vote', { p_mod_id: modId })
      if (error) throw error
      setVoted(data.voted)

      // Star/unstar on GitHub using provider_token (best effort, silent on failure)
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.provider_token) {
        syncGitHubStar(githubUrl, willBeVoted, session.provider_token).catch(() => {})
      }
    } catch {
      // Rollback
      setCount(prevCount)
      setVoted(prevVoted)
    } finally {
      setLoading(false)
    }
  }

  const tooltip = isVoted
    ? `${count.toLocaleString()} GitHub stars · Click to unstar`
    : user
    ? `${count.toLocaleString()} GitHub stars · Click to star on GitHub`
    : `${count.toLocaleString()} GitHub stars · Sign in with GitHub to star`

  return (
    <Button
      variant={isVoted ? 'default' : 'outline'}
      size="sm"
      onClick={handleVote}
      disabled={loading || !hydrated}
      title={tooltip}
      className={cn(
        'gap-1.5 min-w-[3.5rem] text-[13px] font-semibold tabular-nums cursor-pointer',
        isVoted && 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40 hover:bg-amber-500/25'
      )}
      aria-label={isVoted ? 'Unstar this mod' : 'Star this mod on GitHub'}
    >
      <Star
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          isVoted ? 'fill-amber-500 text-amber-500' : 'text-amber-500/85'
        )}
      />
      {formatStarCount(count)}
    </Button>
  )
}
