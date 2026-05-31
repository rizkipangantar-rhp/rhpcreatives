import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getAllInvitations, createInvitation, isSlugTaken } from '@/lib/invitations'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const invitations = await getAllInvitations()
  return NextResponse.json(invitations)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { template, slug } = body

  if (!template || !slug) {
    return NextResponse.json({ error: 'template dan slug wajib diisi' }, { status: 400 })
  }

  const taken = await isSlugTaken(template, slug)
  if (taken) {
    return NextResponse.json({ error: 'Slug sudah digunakan untuk template ini' }, { status: 409 })
  }

  const inv = await createInvitation(body)
  return NextResponse.json(inv, { status: 201 })
}