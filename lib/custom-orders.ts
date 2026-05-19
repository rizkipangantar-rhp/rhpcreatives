import fs from 'fs'
import { getDataPath } from '@/lib/data-path'
import { safeWriteJson } from '@/lib/safe-write'

const DB_PATH = () => getDataPath('custom-orders.json')

export type ServiceCategory = 'Layanan Digital' | 'Layanan Desain' | 'Lainnya'

export type RequestStatus =
  | 'waiting_review'
  | 'price_sent'
  | 'accepted'
  | 'payment_pending'
  | 'paid'
  | 'in_progress'
  | 'done'
  | 'rejected_by_admin'
  | 'rejected_by_customer'

export type DiscountType = 'percent' | 'nominal' | null

export type CustomOrderRequest = {
  request_id: string
  order_id?: string | null
  user_id: string
  customer: {
    name: string
    email: string
    whatsapp: string
  }
  service: {
    category: ServiceCategory
    name: string
    package: string
    description: string
    reference?: string
    deadline?: string
  }
  voucher_code?: string | null
  pricing: {
    base_price: number | null
    discount_type: DiscountType
    discount_value: number
    discount_amount: number
    final_price: number | null
    estimated_days: number | null
  }
  notes: {
    for_customer?: string
    internal?: string
    rejection_reason?: string
  }
  status: RequestStatus
  status_history: Array<{ status: RequestStatus; note?: string; changed_at: string }>
  offer_expires_at: string | null
  created_at: string
  updated_at: string
}

type DB = { requests: CustomOrderRequest[] }

function read(): DB {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return { requests: [] }
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as DB
  } catch {
    return { requests: [] }
  }
}

function write(data: DB): void {
  safeWriteJson(DB_PATH(), data)
}

function generateRequestId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `REQ-${dateStr}-${suffix}`
}

export function getAllRequests(): CustomOrderRequest[] {
  return read().requests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function getRequestById(requestId: string): CustomOrderRequest | undefined {
  return read().requests.find(r => r.request_id === requestId)
}

export function getRequestsByUser(userId: string): CustomOrderRequest[] {
  return read().requests
    .filter(r => r.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function countWaitingReview(): number {
  return read().requests.filter(r => r.status === 'waiting_review').length
}

export function createRequest(
  data: Omit<CustomOrderRequest, 'request_id' | 'created_at' | 'updated_at' | 'status_history'>
): CustomOrderRequest {
  const db = read()
  const req: CustomOrderRequest = {
    ...data,
    request_id: generateRequestId(),
    status_history: [{ status: data.status, changed_at: new Date().toISOString() }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  db.requests.push(req)
  write(db)
  return req
}

export function updateRequest(requestId: string, updates: Partial<CustomOrderRequest>): boolean {
  const db = read()
  const idx = db.requests.findIndex(r => r.request_id === requestId)
  if (idx === -1) return false
  db.requests[idx] = { ...db.requests[idx], ...updates, updated_at: new Date().toISOString() }
  write(db)
  return true
}

export function pushStatusHistory(requestId: string, status: RequestStatus, note?: string): boolean {
  const db = read()
  const idx = db.requests.findIndex(r => r.request_id === requestId)
  if (idx === -1) return false
  if (!db.requests[idx].status_history) db.requests[idx].status_history = []
  db.requests[idx].status_history.push({ status, note, changed_at: new Date().toISOString() })
  db.requests[idx].status = status
  db.requests[idx].updated_at = new Date().toISOString()
  write(db)
  return true
}
