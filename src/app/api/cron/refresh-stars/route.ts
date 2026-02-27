import { createServiceClient } from '@/lib/supabase/service'
import { fetchGitHubStars } from '@/lib/github'
import { NextResponse } from 'next/server'

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
  for (const mod of mods) {
    const stars = await fetchGitHubStars(mod.github_url)
    if (stars > 0) {
      await supabase.from('mods').update({ github_stars: stars }).eq('id', mod.id)
      updated++
    }
  }

  return NextResponse.json({ updated })
}
