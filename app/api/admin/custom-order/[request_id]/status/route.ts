import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, updateRequest, pushStatusHistory, type RequestStatus } from '@/lib/custom-orders'

const ALLOWED_TRANSITIONS: RequestStatus[] = ['paid', 'in_progress', 'done']

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { request_id } = await params
  const request = getRequestById(request_id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { status, note, result_url } = await req.json() as { status: RequestStatus; note?: string; result_url?: string }
  if (!ALLOWED_TRANSITIONS.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const updates: Parameters<typeof updateRequest>[1] = { status }
  if (result_url) updates.order_id = request.order_id // keep order_id
  pushStatusHistory(request_id, status, note)
  if (result_url) updateRequest(request_id, { notes: { ...request.notes, for_customer: result_url } })

  return NextResponse.json({ ok: true })
}
