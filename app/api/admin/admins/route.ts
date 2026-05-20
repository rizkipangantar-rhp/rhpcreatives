import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { setUserRole, type AdminRole } from '@/lib/users'
import { readUsers } from '@/lib/users-internal'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin || session.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const users = await readUsers()
  const admins = users.filter(u => u.isAdmin)
  return NextResponse.json(admins.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
  })))
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin || session.user.role !== 'super_admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const { userId, role } = await req.json() as { userId: string; role: AdminRole | null }
  if (!userId) return NextResponse.json({ error: 'missing userId' }, { status: 400 })
  await setUserRole(userId, role)
  return NextResponse.json({ ok: true })
}
