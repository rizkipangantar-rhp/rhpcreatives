import { NextResponse } from 'next/server'
import { findClaimByCode } from '@/lib/early-bird'

export async function POST(req: Request) {
  try {
    const { code } = await req.json() as { code: string }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Kode tidak valid' })
    }

    const normalized = code.trim().toUpperCase()

    if (!normalized.startsWith('EBIRD-') || normalized.length < 10) {
      return NextResponse.json({ valid: false, message: 'Format kode tidak valid' })
    }

    const claim = findClaimByCode(normalized)

    if (!claim) {
      return NextResponse.json({ valid: false, message: 'Kode voucher tidak ditemukan' })
    }

    return NextResponse.json({
      valid: true,
      discount: 0.25,
      message: 'Voucher berhasil diterapkan! Diskon 25%',
    })
  } catch {
    return NextResponse.json({ valid: false, message: 'Terjadi kesalahan' })
  }
}
