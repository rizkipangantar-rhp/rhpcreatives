import { dbGet, dbSet } from '@/lib/store'

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

export type ProgressStepStatus = 'pending' | 'in_progress' | 'done'

export type ProgressStep = {
  step: 1 | 2 | 3 | 4 | 5
  status: ProgressStepStatus
  timestamp?: string
  estimatedNext?: string
  noteForCustomer?: string
  internalNote?: string
}

export const PROGRESS_STEP_LABELS_ID = [
  'Pembayaran Diterima',
  'Proses Pengerjaan',
  'Revisi',
  'Finalisasi',
  'Selesai & Dikirim',
]

export const PROGRESS_STEP_LABELS_EN = [
  'Payment Received',
  'Working on It',
  'Revision',
  'Finalization',
  'Completed & Delivered',
]

export type Order = {
  orderId: string
  userId: string
  name: string
  email: string
  wa: string
  serviceId: string
  packageId: string
  serviceNameId: string
  serviceNameEn: string
  packageNameId: string
  packageNameEn: string
  originalPrice: number
  discountAmount: number
  totalPrice: number
  voucherCode?: string
  discountType?: 'early_bird' | 'referral_invitee' | 'referral_referrer' | null
  referralCodeUsed?: string   // referral code applied (if discountType is referral_invitee)
  referrerId?: string         // user ID of referrer (for reward tracking)
  notes?: string
  status: OrderStatus
  snapToken?: string
  midtransOrderId?: string
  paymentMethod?: 'bank_transfer' | 'qris' | 'gopay' | 'shopeepay' | 'credit_card'
  paymentBank?: string
  paymentVa?: string
  paymentBillerCode?: string
  paymentBillKey?: string
  paymentQrUrl?: string
  paymentDeepLink?: string
  paymentExpiry?: string
  adminNotes?: string
  resultUrl?: string
  statusHistory?: Array<{ status: OrderStatus; note: string; changedAt: string }>
  progressSteps?: ProgressStep[]
  progressUpdatedAt?: string
  createdAt: string
  updatedAt: string
}

type OrdersData = { orders: Order[] }

async function read(): Promise<OrdersData> {
  return dbGet<OrdersData>('rhp:orders', 'orders.json', { orders: [] })
}

async function write(data: OrdersData): Promise<void> {
  return dbSet('rhp:orders', 'orders.json', data)
}

function generateOrderId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `RHP-${dateStr}-${suffix}`
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await read()
  return db.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const db = await read()
  return db.orders.find(o => o.orderId === orderId)
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const db = await read()
  return db.orders
    .filter(o => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function createOrder(data: Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>): Promise<Order> {
  const db = await read()
  const order: Order = {
    ...data,
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.orders.push(order)
  await write(db)
  return order
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].status = status
  db.orders[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}

export async function updateOrderSnapToken(orderId: string, snapToken: string): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].snapToken = snapToken
  db.orders[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}

export async function updateOrderAdminData(orderId: string, data: { adminNotes?: string; resultUrl?: string }): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  if (data.adminNotes !== undefined) db.orders[idx].adminNotes = data.adminNotes
  if (data.resultUrl !== undefined) db.orders[idx].resultUrl = data.resultUrl
  db.orders[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}

export async function addOrderStatusHistory(orderId: string, status: OrderStatus, note: string): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  if (!db.orders[idx].statusHistory) db.orders[idx].statusHistory = []
  db.orders[idx].statusHistory!.push({ status, note, changedAt: new Date().toISOString() })
  db.orders[idx].status = status
  db.orders[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}

export async function updateProgressSteps(orderId: string, steps: ProgressStep[]): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].progressSteps = steps
  db.orders[idx].progressUpdatedAt = new Date().toISOString()
  db.orders[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}

export async function updateOrderNotes(orderId: string, notes: string): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].notes = notes
  db.orders[idx].updatedAt = new Date().toISOString()
  await write(db)
  return true
}

export async function updateOrderPaymentInfo(
  orderId: string,
  info: Partial<Pick<Order,
    'midtransOrderId' | 'paymentMethod' | 'paymentBank' | 'paymentVa' |
    'paymentBillerCode' | 'paymentBillKey' | 'paymentQrUrl' | 'paymentDeepLink' | 'paymentExpiry' | 'status'
  >>
): Promise<boolean> {
  const db = await read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  Object.assign(db.orders[idx], info, { updatedAt: new Date().toISOString() })
  await write(db)
  return true
}
