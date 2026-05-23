const FONNTE_TOKEN = process.env.FONNTE_TOKEN
const ADMIN_WA = process.env.ADMIN_WA_NUMBER ?? '6285179992598'

export async function notifyAdminWa(message: string): Promise<boolean> {
  if (!FONNTE_TOKEN) return false
  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: FONNTE_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ target: ADMIN_WA, message }),
    })
    return res.ok
  } catch {
    return false
  }
}

export function buildAdminWaMessage(data: {
  requestId: string
  name: string
  email: string
  wa: string
  serviceName: string
  packageName: string
  description: string
  deadline?: string
}): string {
  return (
    `CUSTOM ORDER REQUEST BARU\n` +
    `Request ID: ${data.requestId}\n` +
    `Dari: ${data.name} (${data.email})\n` +
    `WA: ${data.wa}\n` +
    `Layanan: ${data.serviceName} - ${data.packageName}\n` +
    `Deskripsi: ${data.description.slice(0, 300)}${data.description.length > 300 ? '...' : ''}\n` +
    (data.deadline ? `Deadline: ${data.deadline}\n` : '') +
    `Cek dashboard admin untuk input harga.`
  )
}

export { ADMIN_WA }
