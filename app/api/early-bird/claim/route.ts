import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addClaim } from '@/lib/early-bird'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const { name, service } = await req.json()
  if (!name?.trim() || !service?.trim()) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
  }

  try {
    const claim = addClaim({
      userId: session.user.id,
      name: name.trim(),
      email: session.user.email,
      service: service.trim(),
    })
    return NextResponse.json({ claim })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'error'
    if (msg === 'already_claimed') {
      return NextResponse.json(
        { error: 'already_claimed', message: 'Kamu udah pernah klaim Early Bird nih! Cek kode kamu di dashboard profil ya 😊' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
