// Re-export the internal readUsers function for server-side use only (API routes, not client components)
import fs from 'fs'
import { getDataPath } from '@/lib/data-path'
import type { StoredUser } from '@/lib/users'

export function readUsers(): StoredUser[] {
  try {
    const p = getDataPath('users.json')
    if (!fs.existsSync(p)) return []
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as StoredUser[]
  } catch {
    return []
  }
}
