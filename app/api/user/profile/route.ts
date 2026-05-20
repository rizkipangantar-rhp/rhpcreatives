import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { findUserById, updateUserProfile } from '@/lib/users'
import { normalizeWa, formatWaDisplay, isValidWa } from '@/lib/wa'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await findUserById(session.user.id)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    name: user.name,
    email: user.email,
    whatsapp: user.whatsapp ?? null,
    whatsappDisplay: user.whatsapp ? formatWaDisplay(user.whatsapp) : null,
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { whatsapp?: string; name?: string }

  if (body.whatsapp !== undefined) {
    if (!isValidWa(body.whatsapp)) {
      return NextResponse.json({ error: 'Format nomor WhatsApp tidak valid (contoh: 08xx atau 628xx)' }, { status: 400 })
    }
    body.whatsapp = normalizeWa(body.whatsapp)
  }

  await updateUserProfile(session.user.id, body)
  return NextResponse.json({ ok: true })
}
