import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById } from '@/lib/custom-orders'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { request_id } = await params
  const request = getRequestById(request_id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (!session.user.isAdmin && request.user_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(request)
}
