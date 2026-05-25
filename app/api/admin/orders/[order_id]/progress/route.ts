import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById, updateProgressSteps, type ProgressStep } from '@/lib/orders'
import { getRequestByOrderId, pushStatusHistory } from '@/lib/custom-orders'

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

  // Sync linked custom order status
  const allDone = body.steps.length === 5 && body.steps.every(s => s.status === 'done')
  const anyActive = body.steps.some(s => s.status === 'done' || s.status === 'in_progress')
  const customReq = await getRequestByOrderId(order_id)
  if (customReq) {
    const terminal = ['done', 'rejected_by_admin', 'rejected_by_customer']
    if (allDone && !terminal.includes(customReq.status)) {
      await pushStatusHistory(customReq.request_id, 'done', 'Auto: semua progress selesai')
    } else if (anyActive && !allDone && customReq.status === 'paid') {
      await pushStatusHistory(customReq.request_id, 'in_progress', 'Auto: proses pengerjaan dimulai')
    }
  }

  return NextResponse.json({ ok: true })
}
