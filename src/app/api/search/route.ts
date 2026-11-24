import { NextResponse } from 'next/server'
import { searchMods, getAnthropicMods } from '@/lib/queries/mods'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  const featured = searchParams.get('featured') === '1'

  try {
    if (!q && featured) {
      const topMods = await getAnthropicMods(6)
      return NextResponse.json(
        { results: topMods },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      )
    }

    if (!q) {
      return NextResponse.json({ results: [] })
    }

    const mods = await searchMods({ query: q, page: 1 })
    return NextResponse.json(
      { results: mods.slice(0, 8) },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    )
  } catch (err) {
    console.error('Search API Error:', err)
    return NextResponse.json({ results: [] })
  }
}
