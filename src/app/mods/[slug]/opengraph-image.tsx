import { ImageResponse } from 'next/og'
import { getModBySlug } from '@/lib/queries/mods'
import { CATEGORIES, MOD_SUBCATEGORIES, PERMISSION_LEVELS } from '@/lib/constants'

export const alt = 'ClaudeMod listing preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 86400

const PERM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'ui-only': { bg: 'rgba(16,185,129,0.16)', border: 'rgba(16,185,129,0.4)', text: '#34d399' },
  reads: { bg: 'rgba(56,189,248,0.16)', border: 'rgba(56,189,248,0.4)', text: '#38bdf8' },
  'writes-or-runs': { bg: 'rgba(245,158,11,0.16)', border: 'rgba(245,158,11,0.4)', text: '#fbbf24' },
  network: { bg: 'rgba(244,63,94,0.16)', border: 'rgba(244,63,94,0.4)', text: '#fb7185' },
}

export default async function ModOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const mod = await getModBySlug(slug)

  const title = mod?.name ?? 'ClaudeMod'
  const desc = (mod?.description ?? 'Curated Claude Code extension directory.').slice(0, 175)
  const categoryLabel = CATEGORIES.find((c) => c.value === mod?.category)?.label ?? 'Mod'
  const subLabel = MOD_SUBCATEGORIES.find((s) => s.value === mod?.mod_subcategory)?.label ?? null
  const permLevel = mod?.permissions_level && mod.permissions_level !== 'unknown' ? mod.permissions_level : null
  const permLabel = permLevel ? PERMISSION_LEVELS[permLevel]?.label : null
  const permStyle = permLevel ? PERM_COLORS[permLevel] : null
  const installPreview = mod?.install_commands?.[mod.install_commands.length - 1] ?? null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '58px 68px',
          background: 'linear-gradient(135deg, #09090b 0%, #111318 65%, #0c1816 100%)',
          color: '#fafafa',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {/* Top Row: Brand + Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                color: '#052e16',
              }}
            >
              ❯
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#e4e4e7' }}>ClaudeMod</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: '7px 16px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.16)',
                color: '#e4e4e7',
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              {subLabel ? `${categoryLabel} · ${subLabel}` : categoryLabel}
            </div>
            {permLabel && permStyle && (
              <div
                style={{
                  padding: '7px 16px',
                  borderRadius: 999,
                  background: permStyle.bg,
                  border: `1px solid ${permStyle.border}`,
                  color: permStyle.text,
                  fontSize: 17,
                  fontWeight: 600,
                }}
              >
                {permLabel}
              </div>
            )}
          </div>
        </div>

        {/* Center: Title + Description + Optional Install Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              fontSize: title.length > 28 ? 50 : 60,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 25,
              lineHeight: 1.4,
              color: '#a1a1aa',
              maxWidth: 1020,
            }}
          >
            {desc}
          </div>

          {installPreview && (
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                borderRadius: 12,
                background: '#050507',
                border: '1px solid rgba(255,255,255,0.14)',
                fontFamily: 'monospace',
                fontSize: 19,
                color: '#e4e4e7',
              }}
            >
              <span style={{ color: '#10b981' }}>$</span>
              <span>{installPreview.slice(0, 72)}</span>
            </div>
          )}
        </div>

        {/* Footer: Author + Stars + URL */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 20, color: '#a1a1aa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            {mod?.author_github && (
              <span style={{ color: '#e4e4e7', fontWeight: 600 }}>@{mod.author_github}</span>
            )}
            {mod && mod.github_stars > 0 && (
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                ★ {mod.github_stars.toLocaleString()} GitHub stars
              </span>
            )}
          </div>
          <span style={{ color: '#34d399', fontWeight: 600 }}>claudemod.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
