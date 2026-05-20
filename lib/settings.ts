import { dbGet, dbSet } from '@/lib/store'

export type Settings = {
  earlyBirdQuota: number
  earlyBirdActive: boolean
  earlyBirdEndDate: string
  waNumber: string
  maintenanceMode: boolean
  newOrderWaNotif: boolean
}

const DEFAULT: Settings = {
  earlyBirdQuota: 20,
  earlyBirdActive: true,
  earlyBirdEndDate: '2026-06-16T00:00:00.000Z',
  waNumber: '6285179992598',
  maintenanceMode: false,
  newOrderWaNotif: true,
}

export async function getSettings(): Promise<Settings> {
  const stored = await dbGet<Partial<Settings>>('rhp:settings', 'settings.json', {})
  return { ...DEFAULT, ...stored }
}

export async function updateSettings(data: Partial<Settings>): Promise<void> {
  const current = await getSettings()
  await dbSet('rhp:settings', 'settings.json', { ...current, ...data })
}
