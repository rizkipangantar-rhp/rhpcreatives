import { dbGet, dbSet } from '@/lib/store'

export type Review = {
  id: string
  orderId: string
  userId: string
  name: string
  initials: string
  service: string
  rating: number
  text: string
  created_at: string
}

type DB = { reviews: Review[] }

async function read(): Promise<DB> {
  return dbGet<DB>('rhp:reviews', 'reviews.json', { reviews: [] })
}

async function write(data: DB): Promise<void> {
  return dbSet('rhp:reviews', 'reviews.json', data)
}

function generateId(): string {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `REV-${d}-${s}`
}

export async function getAllReviews(): Promise<Review[]> {
  const db = await read()
  return db.reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getReviewByOrderId(orderId: string): Promise<Review | undefined> {
  const db = await read()
  return db.reviews.find(r => r.orderId === orderId)
}

export async function createReview(data: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
  const db = await read()
  const review: Review = { ...data, id: generateId(), created_at: new Date().toISOString() }
  db.reviews.push(review)
  await write(db)
  return review
}
