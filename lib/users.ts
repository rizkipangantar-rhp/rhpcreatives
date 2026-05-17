import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

export type StoredUser = {
  id: string
  name: string
  email: string
  hashedPassword: string
  createdAt: string
}

const DB_PATH = () => getDataPath('users.json')

function readUsers(): StoredUser[] {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return []
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as StoredUser[]
  } catch {
    return []
  }
}

function writeUsers(users: StoredUser[]): void {
  const p = DB_PATH()
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify(users, null, 2), 'utf-8')
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(data: Omit<StoredUser, 'id' | 'createdAt'>): StoredUser {
  const users = readUsers()
  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...data,
  }
  users.push(newUser)
  writeUsers(users)
  return newUser
}
