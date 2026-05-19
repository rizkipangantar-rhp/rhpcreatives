import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, updateRequest, pushStatusHistory } from '@/lib/custom-orders'

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { request_id } = await params
  const request = getRequestById(request_id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { reason } = await req.json() as { reason?: string }

  updateRequest(request_id, {
    status: 'rejected_by_admin',
    notes: { ...request.notes, rejection_reason: reason || 'Admin menolak request' },
  })
  pushStatusHistory(request_id, 'rejected_by_admin', reason)

  return NextResponse.json({ ok: true })
}
