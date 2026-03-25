const REPO_OWNER = 'peetah002'
const REPO_NAME = 'peetah002.github.io'
const FILE_PATH = 'public/mappa.json'
const BRANCH = 'main'

const TOKEN_KEY = 'eradriel_gh_token'

export function getGitHubToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setGitHubToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearGitHubToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function getFileSha(token: string): Promise<string | null> {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json' } },
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`)
  const data = await res.json()
  return data.sha as string
}

export async function pushMapToGitHub(token: string, mapData: object): Promise<void> {
  const sha = await getFileSha(token)
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(mapData, null, 2))))

  const body: Record<string, unknown> = {
    message: 'aggiorna mappa',
    content,
    branch: BRANCH,
  }
  if (sha) body.sha = sha

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `GitHub PUT failed: ${res.status}`)
  }
}
