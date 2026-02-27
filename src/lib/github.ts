export async function checkGitHubRepoExists(repoUrl: string): Promise<boolean> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!match) return false
  const [, owner, repo] = match

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
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
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!match) return null
  const [, owner, repo] = match

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        Authorization: process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : '',
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = await res.json()
    const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8')
    return content.slice(0, 50_000)
  } catch {
    return null
  }
}

export async function fetchGitHubStars(repoUrl: string): Promise<number> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (!match) return 0
  const [, owner, repo] = match

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: process.env.GITHUB_TOKEN ? `Bearer ${process.env.GITHUB_TOKEN}` : '',
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 3600 },
    })

    if (!res.ok) return 0
    const data = await res.json()
    return data.stargazers_count ?? 0
  } catch {
    return 0
  }
}
