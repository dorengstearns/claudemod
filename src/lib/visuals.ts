/**
 * Visual utilities for extracting and resolving images from GitHub readmes and mod descriptions.
 */

const BADGE_PATTERNS = [
  'shields.io',
  'badge.fury.io',
  'badgen.net',
  'awesome.re',
  'visitorbadge',
  'codecov.io',
  'coveralls.io',
  'travis-ci',
  'circleci.com',
  'badge.svg',
  '/badges/',
  '/badge/',
  '-badge',
  'type=badge',
  'pepy.tech',
  'npmjs.com/badge',
  'buymeacoffee',
  'star-history.com',
  'starchart.cc',
  'ko-fi.com',
  'patreon.com',
  'opencollective.com',
  'paypal.com',
  'github-readme-stats',
  'hits.dwyl.com',
  'komarev.com',
  'wakatime.com',
  'snyk.io',
  'sonarcloud.io',
  'twitter.com',
  'crates.io/api/v1/crates',
  'smithery.ai',
  'glama.ai',
  'mcpx.dev',
  'skills.sh/b/',
  'goreportcard.com',
  'bestpractices.dev',
  'contrib.rocks',
  'cursor.com/deeplink',
  'railway.com/button',
  'railway.app/button',
  'vercel.com/button',
  'deploy.svg',
  'button.svg',
  'trendshift.io',
  'actions/workflows',
  '/workflows/',
  'favicon.ico',
]

/**
 * Checks if a given image URL is a badge, shield, deploy button, or other non-content asset.
 */
export function isBadgeOrNonVisual(url: string): boolean {
  if (!url) return true
  const lower = url.toLowerCase()

  for (const pattern of BADGE_PATTERNS) {
    if (lower.includes(pattern)) return true
  }

  if (lower.endsWith('.ico') || lower.includes('favicon')) return true
  if (lower.includes('license') && (lower.endsWith('.svg') || lower.includes('badge'))) return true

  // Ensure the target is actually an image file extension or known image CDN asset
  const cleanPath = lower.split('?')[0].split('#')[0]
  const isImageExt = /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(cleanPath)
  const isImageHost =
    lower.includes('github.com/user-attachments/assets/') ||
    lower.includes('raw.githubusercontent.com') ||
    lower.includes('i.ytimg.com') ||
    lower.includes('img.youtube.com') ||
    lower.includes('pbs.twimg.com') ||
    lower.includes('ufs.sh/f/') ||
    lower.includes('capsule-render.vercel.app') ||
    lower.includes('cdn.jsdelivr.net')

  if (!isImageExt && !isImageHost) {
    return true
  }

  return false
}

/**
 * Resolves a relative or GitHub blob image URL to a raw accessible URL.
 */
export function resolveImageSrc(src: string, githubUrl?: string | null): string | null {
  if (!src) return null

  // Strip leading/trailing brackets, markdown artifacts, or extra whitespace
  let clean = src.split(/\s+/)[0].trim().replace(/^<|>$/g, '')

  // Convert github.com/.../blob/... or /raw/... into raw.githubusercontent.com
  if (clean.includes('github.com') && clean.includes('/blob/')) {
    clean = clean.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/')
  } else if (clean.includes('github.com') && clean.includes('/raw/')) {
    clean = clean.replace('github.com', 'raw.githubusercontent.com').replace('/raw/', '/')
  }

  // If already absolute or data URI
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean
  }

  // If no githubUrl is available to resolve against
  if (!githubUrl) return null

  try {
    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)(?:\/(?:blob|tree)\/([^/]+)\/(.+))?/)
    if (!match) return null

    const [, owner, repo, branch, pathStr] = match
    const cleanRepo = repo.replace(/\.git$/, '')
    const b = branch || 'HEAD'
    const cleanSrc = clean.replace(/^\.?\//, '')

    // If githubUrl had a subdirectory path (e.g. monorepo), resolve relative to that folder
    if (pathStr) {
      const dirPath = /\.[a-z0-9]+$/i.test(pathStr) ? pathStr.replace(/\/[^/]+$/, '') : pathStr
      return `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${b}/${dirPath}/${cleanSrc}`
    }

    return `https://raw.githubusercontent.com/${owner}/${cleanRepo}/${b}/${cleanSrc}`
  } catch {
    return null
  }
}

interface Candidate {
  url: string
  isRich: boolean
}

/**
 * Parses markdown/HTML content and extracts the best genuine visual preview image,
 * prioritizing screenshots and demo animations over simple logos.
 */
export function extractModVisual(longDescription?: string | null, githubUrl?: string | null): string | null {
  if (!longDescription) return null

  const mdImg = /!\[([^\]]*)\]\(([^)]+)\)/g
  const htmlImg = /<img[^>]+src=["']?([^"'>\s]+)["']?[^>]*>/gi
  const htmlAlt = /alt=["']([^"']*)["']/i

  const candidates: Candidate[] = []

  let match: RegExpExecArray | null

  while ((match = mdImg.exec(longDescription)) !== null) {
    const altText = match[1] || ''
    const rawUrl = match[2].split(/\s+/)[0].trim().replace(/^<|>$/g, '')
    const resolved = resolveImageSrc(rawUrl, githubUrl)
    if (resolved && !isBadgeOrNonVisual(resolved)) {
      const lower = (altText + ' ' + resolved).toLowerCase()
      const isRich =
        /(screenshot|preview|demo|capture|screen|terminal|dashboard|ui|overview|example|report|workflow)/.test(lower) ||
        resolved.toLowerCase().endsWith('.gif')
      candidates.push({ url: resolved, isRich })
    }
  }

  while ((match = htmlImg.exec(longDescription)) !== null) {
    const fullTag = match[0]
    const rawUrl = match[1].trim()
    const altMatch = htmlAlt.exec(fullTag)
    const altText = altMatch ? altMatch[1] : ''
    const resolved = resolveImageSrc(rawUrl, githubUrl)
    if (resolved && !isBadgeOrNonVisual(resolved)) {
      const lower = (altText + ' ' + resolved).toLowerCase()
      const isRich =
        /(screenshot|preview|demo|capture|screen|terminal|dashboard|ui|overview|example|report|workflow)/.test(lower) ||
        resolved.toLowerCase().endsWith('.gif')
      candidates.push({ url: resolved, isRich })
    }
  }

  if (candidates.length === 0) return null

  // Prioritize rich UI screenshots / demo animations
  const rich = candidates.find((c) => c.isRich)
  return rich ? rich.url : candidates[0].url
}
