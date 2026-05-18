import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/data-path'

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

const DB_PATH = () => getDataPath('settings.json')

export function getSettings(): Settings {
  try {
    const p = DB_PATH()
    if (!fs.existsSync(p)) return DEFAULT
    return { ...DEFAULT, ...JSON.parse(fs.readFileSync(p, 'utf-8')) }
  } catch {
    return DEFAULT
  }
}

export function updateSettings(data: Partial<Settings>): void {
  const current = getSettings()
  const p = DB_PATH()
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(p, JSON.stringify({ ...current, ...data }, null, 2), 'utf-8')
}
