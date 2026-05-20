import { dbGet, dbSet } from '@/lib/store'

export type ServiceCategory = 'Layanan Digital' | 'Layanan Desain' | 'Lainnya'

export type RequestStatus =
  | 'waiting_review'
  | 'price_sent'
  | 'negotiating'
  | 'accepted'
  | 'payment_pending'
  | 'paid'
  | 'in_progress'
  | 'done'
  | 'rejected_by_admin'
  | 'rejected_by_customer'

export type NegotiationEntry = {
  by: 'customer' | 'admin'
  note: string
  counter_price?: number | null
  created_at: string
}

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
  negotiation_history?: NegotiationEntry[]
  offer_expires_at: string | null
  created_at: string
  updated_at: string
}

type DB = { requests: CustomOrderRequest[] }

async function read(): Promise<DB> {
  return dbGet<DB>('rhp:custom-orders', 'custom-orders.json', { requests: [] })
}

async function write(data: DB): Promise<void> {
  return dbSet('rhp:custom-orders', 'custom-orders.json', data)
}

function generateRequestId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `REQ-${dateStr}-${suffix}`
}

export async function getAllRequests(): Promise<CustomOrderRequest[]> {
  const db = await read()
  return db.requests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function getRequestById(requestId: string): Promise<CustomOrderRequest | undefined> {
  const db = await read()
  return db.requests.find(r => r.request_id === requestId)
}

export async function getRequestsByUser(userId: string): Promise<CustomOrderRequest[]> {
  const db = await read()
  return db.requests
    .filter(r => r.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export async function countWaitingReview(): Promise<number> {
  const db = await read()
  return db.requests.filter(r => r.status === 'waiting_review').length
}

export async function createRequest(
  data: Omit<CustomOrderRequest, 'request_id' | 'created_at' | 'updated_at' | 'status_history'>
): Promise<CustomOrderRequest> {
  const db = await read()
  const req: CustomOrderRequest = {
    ...data,
    request_id: generateRequestId(),
    status_history: [{ status: data.status, changed_at: new Date().toISOString() }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  db.requests.push(req)
  await write(db)
  return req
}

export async function updateRequest(requestId: string, updates: Partial<CustomOrderRequest>): Promise<boolean> {
  const db = await read()
  const idx = db.requests.findIndex(r => r.request_id === requestId)
  if (idx === -1) return false
  db.requests[idx] = { ...db.requests[idx], ...updates, updated_at: new Date().toISOString() }
  await write(db)
  return true
}

export async function pushNegotiationEntry(requestId: string, entry: NegotiationEntry): Promise<boolean> {
  const db = await read()
  const idx = db.requests.findIndex(r => r.request_id === requestId)
  if (idx === -1) return false
  if (!db.requests[idx].negotiation_history) db.requests[idx].negotiation_history = []
  db.requests[idx].negotiation_history!.push(entry)
  db.requests[idx].updated_at = new Date().toISOString()
  await write(db)
  return true
}

export async function pushStatusHistory(requestId: string, status: RequestStatus, note?: string): Promise<boolean> {
  const db = await read()
  const idx = db.requests.findIndex(r => r.request_id === requestId)
  if (idx === -1) return false
  if (!db.requests[idx].status_history) db.requests[idx].status_history = []
  db.requests[idx].status_history.push({ status, note, changed_at: new Date().toISOString() })
  db.requests[idx].status = status
  db.requests[idx].updated_at = new Date().toISOString()
  await write(db)
  return true
}
