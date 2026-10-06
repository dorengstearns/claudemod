import { createServiceClient } from '@/lib/supabase/service'
import { fetchGitHubReadme } from '@/lib/github'
import { NextResponse } from 'next/server'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  const supabase = createServiceClient()
  const { data: mods, error } = await supabase
    .from('mods')
    .select('id, github_url')
    .eq('status', 'approved')

  if (error || !mods) {
    return NextResponse.json({ error: 'Failed to fetch mods' }, { status: 500 })
  }

  let updated = 0
  const BATCH_SIZE = 5

  for (let i = 0; i < mods.length; i += BATCH_SIZE) {
    const batch = mods.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map(async (mod) => {
        try {
          const readme = await fetchGitHubReadme(mod.github_url)
          if (readme && readme.length > 50) {
            await supabase.from('mods').update({ long_description: readme }).eq('id', mod.id)
            updated++
          }
        } catch {
          // Continue with next mod
        }
      })
    )
  }

  return NextResponse.json({ updated, total: mods.length })
}
