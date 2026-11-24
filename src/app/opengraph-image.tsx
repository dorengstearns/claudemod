import { ImageResponse } from 'next/og'
import { getCategoryCounts, getTotalModCount } from '@/lib/queries/mods'

export const alt = 'ClaudeMod — Directory for Claude Code Mods, Skills & Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 86400

export default async function OpenGraphImage() {
  let modCount = 240
  let totalCount = 400
  try {
    const [counts, total] = await Promise.all([getCategoryCounts(), getTotalModCount()])
    if (counts['mod']) modCount = counts['mod']
    if (total) totalCount = total
  } catch {
    // Use safe fallback counts
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #09090b 0%, #111318 60%, #0b1915 100%)',
          color: '#fafafa',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                fontWeight: 800,
                color: '#052e16',
              }}
            >
              ❯
            </div>
            <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
              ClaudeMod
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 18px',
              borderRadius: 999,
              border: '1px solid rgba(16, 185, 129, 0.35)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            claudemod.com
          </div>
        </div>

        {/* Center Hero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 980 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Curated Directory for Claude Code Mods
          </div>
          <div
            style={{
              fontSize: 26,
              lineHeight: 1.4,
              color: '#a1a1aa',
            }}
          >
            In-process TypeScript plugins, skills, MCP servers &amp; hooks — with copy-paste install commands and scanned permission footprints.
          </div>
        </div>

        {/* Bottom Stats Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 22px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#34d399' }}>{modCount}</span>
            <span style={{ color: '#d4d4d8' }}>Claude Mods</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 22px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            <span style={{ color: '#60a5fa' }}>{totalCount}</span>
            <span style={{ color: '#d4d4d8' }}>Total Extensions</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 22px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: 20,
              fontWeight: 600,
              color: '#fbbf24',
            }}
          >
            Permissions Scanned
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
