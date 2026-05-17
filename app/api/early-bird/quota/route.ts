import { NextResponse } from 'next/server'
import { getQuota } from '@/lib/early-bird'

export async function GET() {
  return NextResponse.json(getQuota())
}
