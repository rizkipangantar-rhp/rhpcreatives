import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

const DB_PATH = () => getDataPath('orders.json')

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled'

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
  createdAt: string
  updatedAt: string
}

type OrdersData = { orders: Order[] }

function read(): OrdersData {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return { orders: [] }
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as OrdersData
  } catch {
    return { orders: [] }
  }
}

function write(data: OrdersData) {
  const p = DB_PATH()
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
}

function generateOrderId(): string {
  const now = new Date()
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `RHP-${dateStr}-${suffix}`
}

export function getAllOrders(): Order[] {
  return read().orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getOrderById(orderId: string): Order | undefined {
  return read().orders.find(o => o.orderId === orderId)
}

export function getOrdersByUser(userId: string): Order[] {
  return read().orders
    .filter(o => o.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function createOrder(data: Omit<Order, 'orderId' | 'createdAt' | 'updatedAt'>): Order {
  const db = read()
  const order: Order = {
    ...data,
    orderId: generateOrderId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  db.orders.push(order)
  write(db)
  return order
}

export function updateOrderStatus(orderId: string, status: OrderStatus): boolean {
  const db = read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].status = status
  db.orders[idx].updatedAt = new Date().toISOString()
  write(db)
  return true
}

export function updateOrderSnapToken(orderId: string, snapToken: string): boolean {
  const db = read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].snapToken = snapToken
  db.orders[idx].updatedAt = new Date().toISOString()
  write(db)
  return true
}

export function updateOrderNotes(orderId: string, notes: string): boolean {
  const db = read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  db.orders[idx].notes = notes
  db.orders[idx].updatedAt = new Date().toISOString()
  write(db)
  return true
}

export function updateOrderPaymentInfo(
  orderId: string,
  info: Partial<Pick<Order,
    'midtransOrderId' | 'paymentMethod' | 'paymentBank' | 'paymentVa' |
    'paymentBillerCode' | 'paymentBillKey' | 'paymentQrUrl' | 'paymentDeepLink' | 'paymentExpiry' | 'status'
  >>
): boolean {
  const db = read()
  const idx = db.orders.findIndex(o => o.orderId === orderId)
  if (idx === -1) return false
  Object.assign(db.orders[idx], info, { updatedAt: new Date().toISOString() })
  write(db)
  return true
}
