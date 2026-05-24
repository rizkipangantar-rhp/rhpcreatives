import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOrderById } from '@/lib/orders'
import { createReview, getReviewByOrderId, getAllReviews, deleteReview } from '@/lib/reviews'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('orderId')
  const mine = searchParams.get('mine')

  if (orderId) {
    const review = await getReviewByOrderId(orderId)
    return NextResponse.json({ exists: !!review, review: review ?? null })
  }
  const reviews = await getAllReviews()
  if (mine && session?.user?.id) {
    return NextResponse.json({ reviews: reviews.filter(r => r.userId === session.user.id) })
  }
  return NextResponse.json({ reviews })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { orderId: string; rating: number; text: string; role?: string }
  const { orderId, rating, text, role } = body

  if (!orderId || !rating || !text?.trim()) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating tidak valid' }, { status: 400 })
  }

  const order = await getOrderById(orderId)
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })
  if (order.userId !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const allStepsDone = order.progressSteps?.length === 5 && order.progressSteps.every(s => s.status === 'done')
  const isCompleted = order.status === 'completed' || allStepsDone
  if (!isCompleted) return NextResponse.json({ error: 'Order belum selesai' }, { status: 400 })

  const existing = await getReviewByOrderId(orderId)
  if (existing) return NextResponse.json({ error: 'Sudah pernah review order ini' }, { status: 409 })

  const name = order.name
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const service = order.serviceNameId

  const review = await createReview({ orderId, userId: session.user.id, name, initials, role: role?.trim() || undefined, service, rating, text: text.trim() })
  return NextResponse.json({ review })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await req.json() as { id: string }
  const ok = await deleteReview(id)
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Not found' }, { status: 404 })
}
