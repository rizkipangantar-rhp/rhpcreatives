/**
 * Generates favicon.ico (48x48 + 32x32 + 16x16) + favicon PNGs from pure Node.js.
 * Design: dark bg (#06060f), "RHP" in purple→pink gradient, centered.
 * Run: node scripts/gen-favicon.mjs
 */
import { deflateSync } from 'zlib'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dir, '..')

// ─── PNG helpers ──────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    t[i] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.allocUnsafe(4); lenBuf.writeUInt32BE(data.length, 0)
  const crcBuf = Buffer.allocUnsafe(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  const rowSize = 1 + width * 4
  const raw = Buffer.allocUnsafe(height * rowSize)
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4
      const dst = y * rowSize + 1 + x * 4
      raw[dst] = rgba[src]; raw[dst+1] = rgba[src+1]
      raw[dst+2] = rgba[src+2]; raw[dst+3] = rgba[src+3]
    }
  }
  return Buffer.concat([sig, pngChunk('IHDR', ihdr), pngChunk('IDAT', deflateSync(raw, { level: 9 })), pngChunk('IEND', Buffer.alloc(0))])
}

// ─── Pixel font glyphs ────────────────────────────────────────────────────────

// 6×9 — R, H, P — for 32px (1×) and 48px (2×)
const GLYPH_6x9 = {
  R: [
    [1,1,1,1,0,0],
    [1,0,0,0,1,0],
    [1,0,0,0,1,0],
    [1,0,0,0,1,0],
    [1,1,1,1,0,0],
    [1,0,0,1,0,0],
    [1,0,0,0,1,0],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
  ],
  H: [
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
    [1,1,1,1,1,1],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
    [1,0,0,0,0,1],
  ],
  P: [
    [1,1,1,1,0,0],
    [1,0,0,0,1,0],
    [1,0,0,0,1,0],
    [1,0,0,0,1,0],
    [1,1,1,1,0,0],
    [1,0,0,0,0,0],
    [1,0,0,0,0,0],
    [1,0,0,0,0,0],
    [1,0,0,0,0,0],
  ],
}
const GW = 6, GH = 9

// 3×5 mini — for 16px
const MINI = {
  R: [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  H: [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  P: [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
}

function lerp(a, b, t) { return Math.round(a + (b - a) * t) }

// ─── Renderer ─────────────────────────────────────────────────────────────────

function renderIcon(size) {
  const rgba = new Uint8Array(size * size * 4)
  const corner = Math.max(2, Math.round(size * 0.16))

  // Background: dark rounded square
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const cdx = Math.max(0, corner - x, x - (size - 1 - corner))
      const cdy = Math.max(0, corner - y, y - (size - 1 - corner))
      if (cdx * cdx + cdy * cdy > corner * corner) { rgba[i+3] = 0; continue }
      rgba[i] = 0x06; rgba[i+1] = 0x06; rgba[i+2] = 0x0f; rgba[i+3] = 255
    }
  }

  // Paint a pixel in purple→pink gradient based on x position within the text block
  function grad(px, py, xStart, totalW) {
    if (px < 0 || px >= size || py < 0 || py >= size) return
    const i = (py * size + px) * 4
    if (rgba[i+3] === 0) return
    const t = Math.max(0, Math.min(1, (px - xStart) / Math.max(1, totalW - 1)))
    rgba[i]   = lerp(0x8b, 0xec, t)
    rgba[i+1] = lerp(0x5c, 0x48, t)
    rgba[i+2] = lerp(0xf6, 0x99, t)
    rgba[i+3] = 255
  }

  const word = ['R', 'H', 'P']

  if (size <= 16) {
    // ── 16px: 3×5 mini glyphs, 1× scale ──────────────────────────────────────
    const totalW = word.length * 3 + (word.length - 1) * 1  // 11px
    const x0 = Math.round((size - totalW) / 2)
    const y0 = Math.round((size - 5) / 2)
    word.forEach((ch, ci) => {
      const glyph = MINI[ch]
      const ox = x0 + ci * 4
      for (let gy = 0; gy < 5; gy++)
        for (let gx = 0; gx < 3; gx++)
          if (glyph[gy][gx]) grad(ox + gx, y0 + gy, x0, totalW)
    })

  } else {
    // ── 32px: 6×9 glyphs at 1×   |   48px: 6×9 glyphs at 2× ────────────────
    const scale = size <= 32 ? 1 : 2
    const gap = scale  // 1px gap at 1×, 2px gap at 2×
    const totalW = word.length * GW * scale + (word.length - 1) * gap
    const totalH = GH * scale
    const x0 = Math.round((size - totalW) / 2)
    const y0 = Math.round((size - totalH) / 2)

    word.forEach((ch, ci) => {
      const glyph = GLYPH_6x9[ch]
      const ox = x0 + ci * (GW * scale + gap)
      for (let gy = 0; gy < GH; gy++) {
        for (let gx = 0; gx < GW; gx++) {
          if (!glyph[gy][gx]) continue
          for (let dy = 0; dy < scale; dy++)
            for (let dx = 0; dx < scale; dx++)
              grad(ox + gx * scale + dx, y0 + gy * scale + dy, x0, totalW)
        }
      }
    })
  }

  return rgba
}

// ─── ICO format ───────────────────────────────────────────────────────────────

function makeICO(pngBuffers, sizes) {
  const count = pngBuffers.length
  const headerSize = 6 + 16 * count
  let offset = headerSize
  const offsets = []
  for (const buf of pngBuffers) { offsets.push(offset); offset += buf.length }
  const header = Buffer.allocUnsafe(6)
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(count, 4)
  const dirs = pngBuffers.map((buf, i) => {
    const d = Buffer.allocUnsafe(16)
    const s = sizes[i]
    d[0] = s >= 256 ? 0 : s; d[1] = s >= 256 ? 0 : s; d[2] = 0; d[3] = 0
    d.writeUInt16LE(1, 4); d.writeUInt16LE(32, 6)
    d.writeUInt32LE(buf.length, 8); d.writeUInt32LE(offsets[i], 12)
    return d
  })
  return Buffer.concat([header, ...dirs, ...pngBuffers])
}

// ─── Generate ─────────────────────────────────────────────────────────────────

const sizes = [48, 32, 16]
const pngBufs = sizes.map(s => encodePNG(s, s, renderIcon(s)))

writeFileSync(resolve(ROOT, 'public/favicon-48.png'), pngBufs[0])
writeFileSync(resolve(ROOT, 'public/favicon-32.png'), pngBufs[1])
console.log('✓  public/favicon-48.png')
console.log('✓  public/favicon-32.png')

const ico = makeICO(pngBufs, sizes)
writeFileSync(resolve(ROOT, 'app/favicon.ico'), ico)
console.log(`✓  app/favicon.ico (${ico.length} bytes, sizes: ${sizes.join(', ')}px)`)
console.log('\nDone!')
