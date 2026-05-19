import fs from 'fs'
import path from 'path'

/**
 * Write JSON to a file safely:
 * 1. Keep a .bak copy of the previous version before overwriting
 * 2. Write to a .tmp file first, then rename (atomic on most FSes)
 * This prevents total data loss if the process crashes mid-write.
 */
export function safeWriteJson(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const json = JSON.stringify(data, null, 2)
  const tmpPath = filePath + '.tmp'

  // Backup existing file
  try {
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, filePath + '.bak')
    }
  } catch { /* backup failure is non-fatal */ }

  // Atomic-ish write: write to tmp then rename
  try {
    fs.writeFileSync(tmpPath, json, 'utf-8')
    fs.renameSync(tmpPath, filePath)
  } catch (err) {
    // If rename fails (cross-device), fall back to direct write
    try { fs.unlinkSync(tmpPath) } catch { /* ignore */ }
    fs.writeFileSync(filePath, json, 'utf-8')
    throw err
  }
}
