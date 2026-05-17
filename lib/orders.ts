import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'orders.json')

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
  notes?: string
  status: OrderStatus
  snapToken?: string
  createdAt: string
  updatedAt: string
}

type OrdersData = { orders: Order[] }

function read(): OrdersData {
  try {
    if (!fs.existsSync(DB_PATH)) return { orders: [] }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as OrdersData
  } catch {
    return { orders: [] }
  }
}

function write(data: OrdersData) {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8')
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
