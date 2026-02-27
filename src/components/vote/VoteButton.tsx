'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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

export function VoteButton({ modId, githubStars, githubUrl, slug }: VoteButtonProps) {
  const [count, setCount] = useState(githubStars)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setHydrated(true)
        return
      }
      const { data } = await supabase
        .from('votes')
        .select('id')
        .eq('mod_id', modId)
        .eq('user_id', user.id)
        .maybeSingle()
      setVoted(!!data)
      setHydrated(true)
    })
  }, [modId])

  const handleVote = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = `/auth/signin?next=/mods/${slug}`
      return
    }

    const willBeVoted = !voted

    // Optimistic update
    const prevCount = count
    const prevVoted = voted
    setVoted(willBeVoted)
    setCount((c) => (voted ? c - 1 : c + 1))
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

  return (
    <Button
      variant={voted ? 'default' : 'outline'}
      size="sm"
      onClick={handleVote}
      disabled={loading || !hydrated}
      className={cn('gap-1.5 min-w-[3.5rem] font-semibold tabular-nums', voted && 'bg-primary text-primary-foreground')}
      aria-label={voted ? 'Remove vote' : 'Vote for this mod'}
    >
      <ChevronUp className="h-4 w-4" />
      {count.toLocaleString()}
    </Button>
  )
}
