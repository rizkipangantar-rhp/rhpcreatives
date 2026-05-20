import { dbGet, dbSet } from '@/lib/store'

type DailyRecord = { views: number; paths: Record<string, number> }
type AnalyticsData = { daily: Record<string, DailyRecord> }

async function read(): Promise<AnalyticsData> {
  return dbGet<AnalyticsData>('rhp:analytics', 'analytics.json', { daily: {} })
}

async function write(data: AnalyticsData): Promise<void> {
  return dbSet('rhp:analytics', 'analytics.json', data)
}

export async function recordPageview(path: string): Promise<void> {
  const day = new Date().toISOString().slice(0, 10)
  const data = await read()
  if (!data.daily[day]) data.daily[day] = { views: 0, paths: {} }
  data.daily[day].views++
  data.daily[day].paths[path] = (data.daily[day].paths[path] ?? 0) + 1
  await write(data)
}

export type AnalyticsSummary = {
  totalViews: number
  todayViews: number
  last7Days: { date: string; views: number }[]
  topPaths: { path: string; views: number }[]
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const data = await read()
  const today = new Date().toISOString().slice(0, 10)
  const todayViews = data.daily[today]?.views ?? 0
  const totalViews = Object.values(data.daily).reduce((s, d) => s + d.views, 0)

  // Last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const date = d.toISOString().slice(0, 10)
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

  return { totalViews, todayViews, last7Days, topPaths }
}
