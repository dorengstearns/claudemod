import { createPublicClient } from '@/lib/supabase/public'
import { PERMISSION_LEVELS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants'

export const revalidate = 86400

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const supabase = await createPublicClient()
  const { data: mods } = await supabase
    .from('mods')
    .select('slug, name, description, category, mod_subcategory, permissions_level, author_github, github_stars, created_at')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })
    .limit(50)

  const items = (mods ?? [])
    .map((m) => {
      const link = `${SITE_URL}/mods/${m.slug}`
      const permLabel =
        m.permissions_level && m.permissions_level in PERMISSION_LEVELS
          ? PERMISSION_LEVELS[m.permissions_level as keyof typeof PERMISSION_LEVELS].label
          : null
      const metaParts = [
        `by @${m.author_github}`,
        m.github_stars > 0 ? `${m.github_stars.toLocaleString()} GitHub stars` : null,
        permLabel ? `Access: ${permLabel}` : null,
      ].filter(Boolean)
      const fullDesc = `${m.description} (${metaParts.join(' · ')})`
      const catTag = m.mod_subcategory ? `${m.category}/${m.mod_subcategory}` : m.category
      const pubDate = new Date(m.created_at).toUTCString()

      return `    <item>
      <title>${escapeXml(m.name)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(catTag)}</category>
      <description>${escapeXml(fullDesc)}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} — Latest Claude Code Mods</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${SITE_URL}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
