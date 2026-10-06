export async function checkGitHubRepoExists(repoUrl: string): Promise<boolean> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!match) return false
  const [, owner, repo] = match
  const cleanRepo = repo.replace(/\.git$/, '')

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'User-Agent': 'claudemod-app/1.0',
        Authorization: process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : '',
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

export async function fetchGitHubReadme(repoUrl: string): Promise<string | null> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)(?:\/(?:blob|tree)\/([^/]+)\/(.+))?/)
  if (!match) return null
  const [, owner, repo, branch, pathStr] = match
  const cleanRepo = repo.replace(/\.git$/, '')

  const headers = {
    'User-Agent': 'claudemod-app/1.0',
    Authorization: process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : '',
    'X-GitHub-Api-Version': '2022-11-28',
    Accept: 'application/vnd.github+json',
  }

  // Case 1: URL points directly to a file (ends in an extension like .md)
  if (pathStr && /\.[a-z0-9]+$/i.test(pathStr)) {
    const fileUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents/${pathStr}${branch ? `?ref=${branch}` : ''}`
    try {
      const res = await fetch(fileUrl, { headers, cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8')
        return content.slice(0, 50_000)
      }
    } catch {
      // Fall through to other methods
    }
  }

  // Case 2: URL points to a sub-directory - list contents and find a readme or skill file
  const dirPath = pathStr || ''
  if (dirPath) {
    const contentsUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents/${dirPath}${branch ? `?ref=${branch}` : ''}`
    try {
      const res = await fetch(contentsUrl, { headers, cache: 'no-store' })
      if (res.ok) {
        const items = await res.json()
        if (Array.isArray(items)) {
          const mdFiles = items.filter((item: { name: string }) => item.name.toLowerCase().endsWith('.md'))
          const readmeFile =
            mdFiles.find((item: { name: string }) => item.name.toLowerCase() === 'readme.md') ||
            mdFiles.find((item: { name: string }) => item.name.toLowerCase() === 'skill.md') ||
            mdFiles.find((item: { name: string }) => item.name.toLowerCase() === 'instructions.md') ||
            mdFiles[0]

          if (readmeFile) {
            const fileRes = await fetch(readmeFile.url, { headers, cache: 'no-store' })
            if (fileRes.ok) {
              const fileData = await fileRes.json()
              const content = Buffer.from(fileData.content.replace(/\n/g, ''), 'base64').toString('utf-8')
              return content.slice(0, 50_000)
            }
          }
        }
      }
    } catch {
      // Fall through
    }
  }

  // Case 3: Fall back to default repo readme endpoint (or subdirectory default readme)
  let readmeUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/readme`
  const params = []
  if (dirPath) params.push(`path=${encodeURIComponent(dirPath)}`)
  if (branch) params.push(`ref=${encodeURIComponent(branch)}`)
  if (params.length > 0) readmeUrl += `?${params.join('&')}`

  try {
    const res = await fetch(readmeUrl, { headers, cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    let content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8')

    // Follow redirect pointer files (e.g. "./apps/ccusage/README.md")
    if (content.length < 200 && content.trim().startsWith('./') && content.includes('.md')) {
      const pointer = content.trim().replace(/^\.?\//, '').replace(/^"|"$/g, '')
      const pointerUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents/${pointer}`
      const pointerRes = await fetch(pointerUrl, { headers, cache: 'no-store' })
      if (pointerRes.ok) {
        const pointerData = await pointerRes.json()
        content = Buffer.from(pointerData.content.replace(/\n/g, ''), 'base64').toString('utf-8')
      }
    }

    return content.slice(0, 50_000)
  } catch {
    return null
  }
}

export async function fetchGitHubStars(repoUrl: string): Promise<number> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!match) return 0
  const [, owner, repo] = match
  const cleanRepo = repo.replace(/\.git$/, '')

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`, {
      headers: {
        'User-Agent': 'claudemod-app/1.0',
        Authorization: process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : '',
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    })

    if (!res.ok) return 0
    const data = await res.json()
    return data.stargazers_count ?? 0
  } catch {
    return 0
  }
}
