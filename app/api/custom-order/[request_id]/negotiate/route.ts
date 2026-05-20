import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getRequestById, pushStatusHistory, pushNegotiationEntry } from '@/lib/custom-orders'

const ADMIN_WA = '6285179992598'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ request_id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { request_id } = await params
  const request = await getRequestById(request_id)
  if (!request) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (request.user_id !== session.user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  if (request.status !== 'price_sent') {
    return NextResponse.json({ error: 'Tidak bisa nego di tahap ini' }, { status: 400 })
  }

  const body = await req.json() as { note?: string; counter_price?: number | string }
  const { note, counter_price } = body
  if (!note?.trim()) return NextResponse.json({ error: 'Catatan wajib diisi' }, { status: 400 })

  const counterPriceNum = counter_price
    ? parseInt(String(counter_price).replace(/\D/g, ''), 10) || null
    : null

  await pushNegotiationEntry(request_id, {
    by: 'customer',
    note: note.trim(),
    counter_price: counterPriceNum,
    created_at: new Date().toISOString(),
  })

  await pushStatusHistory(request_id, 'negotiating', `Customer nego: ${note.trim()}`)

  const waText = `Customer mau nego harga untuk ${request_id}.${counterPriceNum ? ` Harga harapan: Rp${counterPriceNum.toLocaleString('id-ID')}.` : ''} Alasan: ${note.trim()}. Cek dashboard admin.`

  return NextResponse.json({ ok: true, adminWaUrl: `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(waText)}` })
}
