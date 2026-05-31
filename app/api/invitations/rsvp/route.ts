import { NextRequest, NextResponse } from 'next/server'
import { addRsvpResponse, getInvitationById } from '@/lib/invitations'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { invitationId, guestName, attendance, guestCount, message } = body

  if (!invitationId || !guestName || !attendance) {
    return NextResponse.json({ error: 'invitationId, guestName, dan attendance wajib diisi' }, { status: 400 })
  }

  const inv = await getInvitationById(invitationId)
  if (!inv || !inv.isPublished) {
    return NextResponse.json({ error: 'Undangan tidak ditemukan' }, { status: 404 })
  }

  if (!inv.rsvpEnabled) {
    return NextResponse.json({ error: 'RSVP tidak aktif untuk undangan ini' }, { status: 403 })
  }

  await addRsvpResponse(invitationId, {
    guestName: String(guestName).slice(0, 100),
    attendance,
    guestCount: Math.max(1, Math.min(10, Number(guestCount) || 1)),
    message: message ? String(message).slice(0, 500) : undefined,
  })

  return NextResponse.json({ success: true })
}