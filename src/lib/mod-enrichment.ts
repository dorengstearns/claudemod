import { fetchGitHubReadme } from '@/lib/github'
import { extractModVisual } from '@/lib/visuals'
import type { ModSubcategoryValue, PermissionLevel } from '@/lib/constants'

export interface ModEnrichmentInput {
  name: string
  description: string
  category: string
  github_url: string
  tags?: string[]
  repo_subpath?: string | null
}

export interface ModEnrichmentResult {
  github_url: string
  github_stars?: number
  long_description?: string | null
  thumbnail_url?: string | null
  license?: string | null
  install_commands?: string[]
  permissions_level?: PermissionLevel | null
  permissions_labels?: string[]
  hooks_events?: string[]
  surfaces?: string[]
  mod_subcategory?: ModSubcategoryValue | null
  tested_claude_version?: string | null
}

export function normalizeGithubUrl(url: string): string {
  return url.trim().replace(/\.git\/?$/i, '').replace(/\/+$/, '')
}

function ghHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': 'claudemod-app/1.0',
    'X-GitHub-Api-Version': '2022-11-28',
    Accept: 'application/vnd.github+json',
  }
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

async function ghJson<T = Record<string, unknown>>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`https://api.github.com${endpoint}`, {
      headers: ghHeaders(),
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export function scanCodeForCapabilities(code: string): {
  level: PermissionLevel
  labels: string[]
} {
  if (!code) return { level: 'unknown', labels: [] }
  const labels = new Set<string>()
  let maxLevel = 0 // 0=ui-only, 1=reads, 2=writes-or-runs, 3=network

  if (/\$\.ui\b|ui\.render|statusline|statusLine|sidebar|sidepane|panel|band/i.test(code)) {
    labels.add('Draws UI')
  }
  if (/\$\.storage\b|\$\.state\b|\$\.kv\b|persist/i.test(code)) {
    labels.add('Persists local state')
  }
  if (/\$\.fs\.(read|stat|list|readdir|exists|glob|ancestors)|readFileSync|readFile\b/.test(code)) {
    labels.add('Reads files')
    maxLevel = Math.max(maxLevel, 1)
  }
  if (/\$\.env\.get|process\.env\b/.test(code)) {
    labels.add('Reads env vars')
    maxLevel = Math.max(maxLevel, 1)
  }
  if (/\$\.transcript\b/.test(code)) {
    labels.add('Reads transcript')
    maxLevel = Math.max(maxLevel, 1)
  }
  if (/\$\.settings\b|\$\.config\.get/.test(code)) {
    labels.add('Reads settings')
    maxLevel = Math.max(maxLevel, 1)
  }
  if (/\$\.fs\.(write|rm|unlink|mkdir|append|rename)|writeFileSync|writeFile\b/.test(code)) {
    labels.add('Writes files')
    maxLevel = Math.max(maxLevel, 2)
  }
  if (/\$\.process\.(run|exec|spawn)|child_process|execFile|execSync|spawn\(|Bun\.spawn/.test(code)) {
    labels.add('Runs shell commands')
    maxLevel = Math.max(maxLevel, 2)
  }
  if (/\$\.model\.complete/.test(code)) {
    labels.add('Calls AI models')
    maxLevel = Math.max(maxLevel, 2)
  }
  if (/\$\.(session|claude|turn)\.(send|submit|interrupt|compact)|sendPrompt|submitPrompt/.test(code)) {
    labels.add('Drives Claude')
    maxLevel = Math.max(maxLevel, 2)
  }
  if (/\$\.prompt\.(set|write|replace|insert)/.test(code)) {
    labels.add('Modifies prompt')
    maxLevel = Math.max(maxLevel, 2)
  }
  if (/\$\.clipboard\b|pbcopy|xclip/.test(code)) {
    labels.add('Clipboard access')
    maxLevel = Math.max(maxLevel, 2)
  }
  if (/\$\.http\b|\bfetch\s*\(|WebSocket|axios|node:https?/.test(code)) {
    labels.add('Network access')
    maxLevel = Math.max(maxLevel, 3)
  }
  if (/\$\.auth\b|credentialHandle|anthropic.*credential/i.test(code)) {
    labels.add('Anthropic auth handle')
    maxLevel = Math.max(maxLevel, 3)
  }
  if (/\$\.mcp\b/.test(code)) {
    labels.add('Calls MCP servers')
    maxLevel = Math.max(maxLevel, 3)
  }

  if (labels.size === 0) return { level: 'unknown', labels: [] }
  const levelMap: PermissionLevel[] = ['ui-only', 'reads', 'writes-or-runs', 'network']
  return { level: levelMap[maxLevel], labels: [...labels] }
}

export function classifyModSubcategory(
  name: string,
  description: string,
  tags: string[] = [],
  readme = ''
): ModSubcategoryValue {
  const text = `${name} ${description} ${tags.join(' ')}`.toLowerCase()
  const extText = `${text} ${readme.slice(0, 1200).toLowerCase()}`

  if (/\b(game|games|arcade|chess|tetris|flappy|sandgame|falling-sand|pokemon|souls-like|git-gud|doom|wordle|2048|snake|rpg|adventure)\b/.test(text)) {
    return 'games'
  }
  if (/\b(pet|tamagotchi|companion|pixel pet|chibi|crab|coworker|mascot|buddy|devling|ambient|music|youtube|twitch|while you wait|while claude works|comic|fables|toons|intermission|stretch)\b/.test(text)) {
    return 'while-you-wait'
  }
  if (/\b(security|guard|firewall|redact|secret|pii|modwall|blast-radius|permission|audit|policy|lockdown|shift-left|toolgate|gate|sandbox)\b/.test(text)) {
    return 'security'
  }
  if (/\b(context|compact|compaction|cache|token|budget|memory|handoff|pitstop|checkpoint|trailback|notebook|wrapped|summary|tldr|tl;dr|prune|attachment|recall)\b/.test(text)) {
    return 'context-memory'
  }
  if (/\b(dashboard|monitor|usage|meter|limit|quota|cost|spend|burn|worklog|statusline|status line|statusbar|status bar|telemetry|timeline|cockpit|flightdeck|cctop|radar|footprint|pipeline|ci|pr-watcher|pull request|gitgraph|branch-status|unity|watch|board|panel|hud|progress|stats|profiler|standup|checklist|todo|inbox)\b/.test(text)) {
    return 'dashboards'
  }
  if (/\b(automat|router|orchestrat|subagent|tuner|loop|breaker|autopilot|workflow|commit|pager|notify|notification|alert|account-switcher|switch|relay|mixture|right-size|effort|loadout|harness-scope|claudex|comms|shared-session|time machine|enforcer|convey|suggest|polish|enhancer)\b/.test(text)) {
    return 'automation'
  }
  if (/\b(theme|skin|ui|render|markdown|math|latex|typst|browser|fold|rtl|tabs|links|sidebar|side pane|pane|diff|filetree|image|screenshot|paste|preview|replay|voice|speak|caption|audio|sound|desktop look)\b/.test(text)) {
    return 'interface'
  }
  if (/\b(dashboard|status line|usage|tokens?|cost)\b/.test(extText)) return 'dashboards'
  if (/\b(context|compact|cache)\b/.test(extText)) return 'context-memory'
  if (/\b(security|guard|permission)\b/.test(extText)) return 'security'
  return 'interface'
}

function extractInstallFromReadme(readme: string | null): string[] {
  if (!readme) return []
  const cmds: string[] = []
  for (const raw of readme.split(/\r?\n/)) {
    const line = raw.trim().replace(/^[$>]\s*/, '')
    if (/^(\/)?(claude\s+)?plugin\s+marketplace\s+add\s+\S+/i.test(line)) {
      const normalized = line.startsWith('/') ? `claude ${line.slice(1)}` : (line.startsWith('plugin') ? `claude ${line}` : line)
      if (!cmds.includes(normalized)) cmds.push(normalized)
    } else if (/^(\/)?(claude\s+)?plugin\s+install\s+\S+/i.test(line)) {
      const normalized = line.startsWith('/') ? `claude ${line.slice(1)}` : (line.startsWith('plugin') ? `claude ${line}` : line)
      if (!cmds.includes(normalized)) cmds.push(normalized)
    }
    if (cmds.length >= 2) break
  }
  return cmds
}

/**
 * Automatically enriches a mod row from live GitHub data on approval:
 * normalizes github_url, fetches live stars/license/README/thumbnail,
 * and for in-process Mods extracts install commands, hooked events, surfaces,
 * static permission footprints, tested Claude Code version, and sub-category.
 */
export async function enrichModFromGitHub(input: ModEnrichmentInput): Promise<ModEnrichmentResult> {
  const cleanUrl = normalizeGithubUrl(input.github_url)
  const result: ModEnrichmentResult = { github_url: cleanUrl }

  const urlMatch = cleanUrl.match(/github\.com\/([^/]+)\/([^/#?]+)(?:\/(?:blob|tree)\/([^/]+)\/(.+))?/i)
  if (!urlMatch) return result

  const [, rawOwner, rawRepo, urlBranch, urlSubpath] = urlMatch
  const cleanRepo = rawRepo.replace(/\.git$/i, '')
  const subpath = input.repo_subpath || urlSubpath || null

  const [repoData, readme] = await Promise.all([
    ghJson<{
      full_name?: string
      default_branch?: string
      stargazers_count?: number
      license?: { spdx_id?: string } | null
    }>(`/repos/${rawOwner}/${cleanRepo}`),
    fetchGitHubReadme(cleanUrl),
  ])

  const canonicalFullName = repoData?.full_name || `${rawOwner}/${cleanRepo}`
  const branch = urlBranch || repoData?.default_branch || 'main'
  const canonicalUrl = subpath
    ? `https://github.com/${canonicalFullName}/tree/${branch}/${subpath}`
    : `https://github.com/${canonicalFullName}`

  result.github_url = canonicalUrl
  if (typeof repoData?.stargazers_count === 'number') {
    result.github_stars = repoData.stargazers_count
  }
  if (repoData?.license?.spdx_id && repoData.license.spdx_id !== 'NOASSERTION') {
    result.license = repoData.license.spdx_id
  }
  if (readme && readme.length > 20) {
    result.long_description = readme
    result.thumbnail_url = extractModVisual(readme, canonicalUrl)
  }

  if (input.category !== 'mod') {
    return result
  }

  // In-process Mod specific enrichment (install commands, permissions, hooks, surfaces, sub-category)
  const treeData = await ghJson<{ tree?: Array<{ type: string; path: string }> }>(
    `/repos/${canonicalFullName}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  )
  const allPaths = (treeData?.tree ?? []).filter((t) => t.type === 'blob').map((t) => t.path)
  const scopedPaths = subpath
    ? allPaths.filter((p) => p.startsWith(subpath + '/') || p.includes('.claude-plugin'))
    : allPaths

  // 1. Install commands from marketplace.json + plugin.json (with README / --plugin-dir fallback)
  let installCommands: string[] = []
  const mktPath = allPaths.find((p) => p.toLowerCase().endsWith('marketplace.json'))
  const plugPath = scopedPaths.find((p) => p.toLowerCase().endsWith('plugin.json'))
  let mktName: string | null = null
  let plugName: string | null = null

  if (mktPath) {
    const mData = await ghJson<{ content?: string }>(
      `/repos/${canonicalFullName}/contents/${mktPath}?ref=${encodeURIComponent(branch)}`
    )
    if (mData?.content) {
      try {
        const j = JSON.parse(Buffer.from(mData.content, 'base64').toString('utf8'))
        mktName = j.name ?? null
        if (Array.isArray(j.plugins) && j.plugins.length === 1) {
          plugName = j.plugins[0]?.name ?? null
        }
      } catch {
        // Ignore malformed JSON
      }
    }
  }
  if (plugPath) {
    const pData = await ghJson<{ content?: string }>(
      `/repos/${canonicalFullName}/contents/${plugPath}?ref=${encodeURIComponent(branch)}`
    )
    if (pData?.content) {
      try {
        const j = JSON.parse(Buffer.from(pData.content, 'base64').toString('utf8'))
        if (j.name) plugName = j.name
      } catch {
        // Ignore malformed JSON
      }
    }
  }

  if (mktName && plugName) {
    installCommands = [
      `claude plugin marketplace add ${canonicalFullName}`,
      `claude plugin install ${plugName}@${mktName}`,
    ]
  } else {
    installCommands = extractInstallFromReadme(readme)
  }
  if (installCommands.length === 0 && plugPath) {
    const repoShort = canonicalFullName.split('/')[1] || cleanRepo
    installCommands = [
      `git clone https://github.com/${canonicalFullName}.git`,
      `claude --plugin-dir ./${repoShort}`,
    ]
  }

  // 2. Hooks & static capability scan across up to 5 hook/module files
  const hooksEvents = new Set<string>()
  const moduleFiles: string[] = []
  const hooksPath = scopedPaths.find(
    (p) => p.toLowerCase().endsWith('hooks/hooks.json') || p.toLowerCase() === 'hooks.json'
  )

  if (hooksPath) {
    const hData = await ghJson<{ content?: string }>(
      `/repos/${canonicalFullName}/contents/${hooksPath}?ref=${encodeURIComponent(branch)}`
    )
    if (hData?.content) {
      try {
        const hj = JSON.parse(Buffer.from(hData.content, 'base64').toString('utf8'))
        if (hj.hooks && typeof hj.hooks === 'object') {
          Object.keys(hj.hooks).forEach((k) => hooksEvents.add(k))
        }
        if (Array.isArray(hj.modules)) {
          const baseDir = hooksPath.includes('/') ? hooksPath.slice(0, hooksPath.lastIndexOf('/')) : ''
          for (const entry of hj.modules) {
            const p = typeof entry === 'string' ? entry : (entry?.path || entry?.file || entry?.entry)
            if (typeof p === 'string') {
              const rel = p.replace(/^\.\//, '')
              const candidate = baseDir ? `${baseDir}/${rel}` : rel
              if (allPaths.includes(candidate)) moduleFiles.push(candidate)
              else if (allPaths.includes(rel)) moduleFiles.push(rel)
            }
          }
        }
      } catch {
        // Ignore malformed hooks.json
      }
    }
  }

  const filesToScan =
    moduleFiles.length > 0
      ? moduleFiles.slice(0, 5)
      : scopedPaths
          .filter((p) => /\.(ts|tsx|mts|js|mjs)$/.test(p) && !/(\.test\.|\.spec\.|config\.|dist\/|node_modules\/)/.test(p))
          .slice(0, 5)

  let combinedCode = ''
  for (const f of filesToScan) {
    const fData = await ghJson<{ content?: string }>(
      `/repos/${canonicalFullName}/contents/${f}?ref=${encodeURIComponent(branch)}`
    )
    if (fData?.content) {
      combinedCode += '\n' + Buffer.from(fData.content, 'base64').toString('utf8')
    }
  }

  const scanned = scanCodeForCapabilities(combinedCode)
  for (const m of combinedCode.matchAll(/\$\.on\(\s*['"]([a-z0-9._:-]+)['"]/gi)) {
    hooksEvents.add(m[1])
  }

  const surfaces = new Set<string>(['terminal'])
  if (/claude desktop|desktop app|desktop surface|surfaces.*desktop/i.test(readme ?? '')) {
    surfaces.add('desktop')
  }

  result.install_commands = installCommands
  result.permissions_level = scanned.level
  result.permissions_labels = scanned.labels
  result.hooks_events = [...hooksEvents].slice(0, 12)
  result.surfaces = [...surfaces]
  result.mod_subcategory = classifyModSubcategory(
    input.name,
    input.description,
    input.tags ?? [],
    readme ?? ''
  )
  result.tested_claude_version = readme?.match(/2\.1\.\d{3}/)?.[0] ?? null

  return result
}
