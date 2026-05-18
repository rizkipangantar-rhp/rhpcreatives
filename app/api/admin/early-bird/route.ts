import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getQuota } from '@/lib/early-bird'
import fs from 'fs'
import { getDataPath } from '@/lib/data-path'

function readEbData() {
  try {
    const p = getDataPath('early-bird.json')
    if (!fs.existsSync(p)) return { claims: [], waitlist: [] }
    return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch { return { claims: [], waitlist: [] } }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const quota = getQuota()
  const data = readEbData()
  return NextResponse.json({ quota, claims: data.claims, waitlist: data.waitlist })
}
