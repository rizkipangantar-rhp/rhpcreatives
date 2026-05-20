import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateProgressSteps, type ProgressStep } from '@/lib/orders'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ order_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { order_id } = await params
  const order = await getOrderById(order_id)
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json() as { steps: ProgressStep[] }
  if (!Array.isArray(body.steps)) return NextResponse.json({ error: 'Invalid steps' }, { status: 400 })

  await updateProgressSteps(order_id, body.steps)
  return NextResponse.json({ ok: true })
}
