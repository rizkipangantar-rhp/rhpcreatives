import { dbGet, dbSet } from '@/lib/store'

type DailyRecord = { views: number; paths: Record<string, number>; devices?: Record<string, number> }
type AnalyticsData = { daily: Record<string, DailyRecord> }

async function read(): Promise<AnalyticsData> {
  return dbGet<AnalyticsData>('rhp:analytics', 'analytics.json', { daily: {} })
}

async function write(data: AnalyticsData): Promise<void> {
  return dbSet('rhp:analytics', 'analytics.json', data)
}

// WIB = UTC+7; offset all date calculations so "today" matches Indonesian time
function wibDate(daysAgo = 0): string {
  const ms = Date.now() + 7 * 60 * 60 * 1000 - daysAgo * 24 * 60 * 60 * 1000
  return new Date(ms).toISOString().slice(0, 10)
}

function detectDevice(ua: string): 'mobile' | 'desktop' {
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(ua) ? 'mobile' : 'desktop'
}

export async function recordPageview(path: string, userAgent?: string): Promise<void> {
  const day = wibDate()
  const data = await read()
  if (!data.daily[day]) data.daily[day] = { views: 0, paths: {}, devices: {} }
  data.daily[day].views++
  data.daily[day].paths[path] = (data.daily[day].paths[path] ?? 0) + 1
  if (userAgent) {
    const device = detectDevice(userAgent)
    if (!data.daily[day].devices) data.daily[day].devices = {}
    data.daily[day].devices![device] = (data.daily[day].devices![device] ?? 0) + 1
  }
  await write(data)
}

export type AnalyticsSummary = {
  totalViews: number
  todayViews: number
  last7Days: { date: string; views: number }[]
  topPaths: { path: string; views: number }[]
  deviceBreakdown: { desktop: number; mobile: number }
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const data = await read()
  const today = wibDate()
  const todayViews = data.daily[today]?.views ?? 0
  const totalViews = Object.values(data.daily).reduce((s, d) => s + d.views, 0)

  // Last 7 days (WIB dates)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = wibDate(i)
    return { date, views: data.daily[date]?.views ?? 0 }
  }).reverse()

  // Top paths (all-time)
  const pathTotals: Record<string, number> = {}
  for (const day of Object.values(data.daily)) {
    for (const [path, count] of Object.entries(day.paths)) {
      pathTotals[path] = (pathTotals[path] ?? 0) + count
    }
  }
  const topPaths = Object.entries(pathTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, views]) => ({ path, views }))

  // Device breakdown (all-time)
  const deviceBreakdown = { desktop: 0, mobile: 0 }
  for (const day of Object.values(data.daily)) {
    deviceBreakdown.desktop += day.devices?.desktop ?? 0
    deviceBreakdown.mobile += day.devices?.mobile ?? 0
  }

  return { totalViews, todayViews, last7Days, topPaths, deviceBreakdown }
}
