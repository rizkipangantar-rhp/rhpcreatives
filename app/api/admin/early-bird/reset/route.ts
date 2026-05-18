import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const p = getDataPath('early-bird.json')
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify({ claims: [], waitlist: [] }, null, 2), 'utf-8')
  return NextResponse.json({ ok: true })
}
