import fs from 'fs'
import path from 'path'

// On Vercel (and other serverless platforms), the project directory at
// /var/task/ is read-only. Only /tmp is writable, but it's ephemeral.
// We detect write access once per cold start and cache the result.

const cache = new Map<string, string>()

export function getDataPath(filename: string): string {
  const cached = cache.get(filename)
  if (cached) return cached

  const localPath = path.join(process.cwd(), 'data', filename)
  const localDir = path.dirname(localPath)

  let resolved: string
  try {
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true })
    fs.accessSync(localDir, fs.constants.W_OK)
    resolved = localPath
  } catch {
    // Read-only filesystem → use /tmp
    resolved = path.join('/tmp', `rhp-${filename}`)

    // Seed /tmp from the bundled read-only copy so existing data is available
    if (!fs.existsSync(resolved) && fs.existsSync(localPath)) {
      try { fs.copyFileSync(localPath, resolved) } catch { /* ignore */ }
    }
  }

  cache.set(filename, resolved)
  return resolved
}
