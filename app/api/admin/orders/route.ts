import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllOrders } from '@/lib/orders'

const ADMIN_EMAIL = 'rhpcreativesid@gmail.com'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  const orders = getAllOrders()
  return NextResponse.json(orders)
}
