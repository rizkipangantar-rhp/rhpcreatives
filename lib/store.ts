import { Redis } from '@upstash/redis'
import fs from 'fs'
import { getDataPath } from './data-path'
import { safeWriteJson } from './safe-write'

let _redis: Redis | null = null

function getRedis(): Redis | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

export async function dbGet<T>(key: string, fallbackFile: string, defaultValue: T): Promise<T> {
  const r = getRedis()
  if (r) {
    try {
      const val = await r.get<T>(key)
      return val ?? defaultValue
    } catch {
      return defaultValue
    }
  }
  try {
    const p = getDataPath(fallbackFile)
    if (!fs.existsSync(p)) return defaultValue
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
  } catch {
    return defaultValue
  }
}

export async function dbSet<T>(key: string, fallbackFile: string, data: T): Promise<void> {
  const r = getRedis()
  if (r) {
    await r.set(key, JSON.stringify(data))
    return
  }
  safeWriteJson(getDataPath(fallbackFile), data)
}
