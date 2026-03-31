import { NextResponse } from 'next/server'
import { searchMods } from '@/lib/queries/mods'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  try {
    const mods = await searchMods({ query: q, page: 1 })
    // Only return top 8 results for the command palette
    return NextResponse.json({ results: mods.slice(0, 8) })
  } catch (err) {
    console.error('Search API Error:', err)
    return NextResponse.json({ results: [] })
  }
}
