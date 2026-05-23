import { MongoClient, type Collection } from 'mongodb'
import fs from 'fs'
import { getDataPath } from './data-path'
import { safeWriteJson } from './safe-write'

// ─── MongoDB connection (singleton) ──────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> | null {
  if (!process.env.MONGODB_URI) return null
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI)
    global._mongoClientPromise = client.connect().catch(err => {
      // Reset so next request retries instead of reusing the rejected promise
      global._mongoClientPromise = undefined
      throw err
    })
  }
  return global._mongoClientPromise
}

async function getCollection(): Promise<Collection<{ _id: string; data: unknown }> | null> {
  const promise = getClientPromise()
  if (!promise) return null
  try {
    const client = await promise
    const db = client.db(process.env.MONGODB_DB ?? 'rhpcreatives')
    return db.collection<{ _id: string; data: unknown }>('store')
  } catch {
    return null
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function dbGet<T>(key: string, fallbackFile: string, defaultValue: T): Promise<T> {
  const col = await getCollection()

  if (col) {
    try {
      const doc = await col.findOne({ _id: key })
      return doc ? (doc.data as T) : defaultValue
    } catch {
      return defaultValue
    }
  }

  // File system fallback
  try {
    const p = getDataPath(fallbackFile)
    if (!fs.existsSync(p)) return defaultValue
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
  } catch {
    return defaultValue
  }
}

export async function dbSet<T>(key: string, fallbackFile: string, data: T): Promise<void> {
  const col = await getCollection()

  if (col) {
    try {
      await col.updateOne({ _id: key }, { $set: { data } }, { upsert: true })
      return
    } catch { /* fall through to file */ }
  }

  // File system fallback
  safeWriteJson(getDataPath(fallbackFile), data)
}
