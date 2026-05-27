/**
 * Generates favicon.ico (48x48 + 32x32 + 16x16) + favicon PNGs from pure Node.js.
 * Design: dark bg (#06060f), white "RHP" on top, purple→pink "creatives" below.
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

// 5×7 uppercase — used for R, H, P at base scale
const UPPER_5x7 = {
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  H: [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  P: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
}

// 3×5 mini uppercase — R, H, P for the 16px icon
const MINI_3x5 = {
  R: [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  H: [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  P: [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
}

// 3×5 lowercase — for 32px "creatives" (compact fit: 9×3 = 27px wide)
const LOWER_3x5 = {
  c: [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  r: [[1,1,0],[1,0,1],[1,0,0],[1,0,0],[1,0,0]],
  e: [[0,1,1],[1,0,0],[1,1,0],[1,0,0],[0,1,1]],
  a: [[0,1,0],[0,0,1],[0,1,1],[1,0,1],[0,1,1]],
  t: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,1]],
  i: [[0,1,0],[0,0,0],[0,1,0],[0,1,0],[0,1,0]],
  v: [[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
  s: [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
}

// 4×6 lowercase — for 48px "creatives" (9×4 + 8×1 gap = 44px wide, more readable)
const LOWER_4x6 = {
  c: [[0,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0],[0,1,1,1]],
  r: [[1,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,0,0],[1,0,0,0],[1,0,0,0]],
  e: [[0,1,1,0],[1,0,0,1],[1,1,1,0],[1,0,0,0],[1,0,0,1],[0,1,1,0]],
  a: [[0,1,1,0],[1,0,0,0],[0,1,1,0],[1,0,0,1],[1,0,0,1],[0,1,1,1]],
  t: [[0,1,0,0],[1,1,1,0],[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,1,1]],
  i: [[0,1,1,0],[0,0,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,0],[0,1,1,1]],
  v: [[1,0,0,1],[1,0,0,1],[1,0,0,1],[0,1,0,1],[0,1,1,0],[0,0,0,0]],
  s: [[0,1,1,0],[1,0,0,1],[0,1,1,0],[0,0,0,1],[1,0,0,1],[0,1,1,0]],
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

  function white(px, py) {
    if (px < 0 || px >= size || py < 0 || py >= size) return
    const i = (py * size + px) * 4
    if (rgba[i+3] === 0) return
    rgba[i] = 255; rgba[i+1] = 255; rgba[i+2] = 255; rgba[i+3] = 255
  }

  function grad(px, py, xStart, xTotal) {
    if (px < 0 || px >= size || py < 0 || py >= size) return
    const i = (py * size + px) * 4
    if (rgba[i+3] === 0) return
    const t = Math.max(0, Math.min(1, (px - xStart) / Math.max(1, xTotal - 1)))
    rgba[i]   = lerp(0x8b, 0xec, t)
    rgba[i+1] = lerp(0x5c, 0x48, t)
    rgba[i+2] = lerp(0xf6, 0x99, t)
    rgba[i+3] = 255
  }

  // Draw a glyph with specified scale (supports fractional via 2x block painting)
  function drawGlyph(glyph, gW, gH, ox, oy, scale, paintFn) {
    for (let gy = 0; gy < gH; gy++) {
      for (let gx = 0; gx < gW; gx++) {
        if (!glyph[gy][gx]) continue
        for (let dy = 0; dy < scale; dy++)
          for (let dx = 0; dx < scale; dx++)
            paintFn(ox + gx * scale + dx, oy + gy * scale + dy)
      }
    }
  }

  if (size <= 16) {
    // ── 16px: "RHP" only, mini 3×5 glyphs ─────────────────────────────────
    const word = ['R','H','P']
    const w = word.length * 3 + (word.length - 1)  // 11px
    const x0 = Math.round((size - w) / 2)
    const y0 = Math.round((size - 5) / 2)
    word.forEach((ch, ci) => {
      drawGlyph(MINI_3x5[ch], 3, 5, x0 + ci * 4, y0, 1, white)
    })

  } else if (size === 32) {
    // ── 32px: "RHP" 5×7 (1×) + "creatives" 3×5 (1×) ──────────────────────
    const word1 = ['R','H','P']
    const word2 = ['c','r','e','a','t','i','v','e','s']
    const w1 = 3 * 5 + 2 * 1   // 17px
    const w2 = 9 * 3            // 27px (no gap, tight fit)
    const totalH = 7 + 2 + 5   // 14px
    const y1 = Math.round((size - totalH) / 2)
    const y2 = y1 + 7 + 2
    const x1 = Math.round((size - w1) / 2)
    const x2 = Math.max(1, Math.round((size - w2) / 2))

    word1.forEach((ch, ci) => {
      drawGlyph(UPPER_5x7[ch], 5, 7, x1 + ci * 6, y1, 1, white)
    })
    word2.forEach((ch, ci) => {
      drawGlyph(LOWER_3x5[ch], 3, 5, x2 + ci * 3, y2, 1,
        (px, py) => grad(px, py, x2, w2))
    })

  } else {
    // ── 48px: "RHP" 5×7 at 2× scale + "creatives" 4×6 at 1× (with 1px gap) ─
    const scale = 2
    const word1 = ['R','H','P']
    const word2 = ['c','r','e','a','t','i','v','e','s']

    // RHP: 3 letters × (5×2=10px) + 2 gaps × 2px = 34px wide, 14px tall
    const w1 = word1.length * (5 * scale) + (word1.length - 1) * scale
    const h1 = 7 * scale   // 14px

    // creatives: 9 letters × 4px + 8 gaps × 1px = 44px wide, 6px tall
    const w2 = word2.length * 4 + (word2.length - 1) * 1
    const h2 = 6

    const totalH = h1 + 3 + h2  // 14+3+6 = 23px
    const y1 = Math.round((size - totalH) / 2)   // ~12px
    const y2 = y1 + h1 + 3
    const x1 = Math.round((size - w1) / 2)        // ~7px
    const x2 = Math.round((size - w2) / 2)        // ~2px

    word1.forEach((ch, ci) => {
      drawGlyph(UPPER_5x7[ch], 5, 7, x1 + ci * (5 * scale + scale), y1, scale, white)
    })
    word2.forEach((ch, ci) => {
      drawGlyph(LOWER_4x6[ch], 4, 6, x2 + ci * 5, y2, 1,
        (px, py) => grad(px, py, x2, w2))
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
console.log('\nDone! Commit and push. Then re-crawl via Google Search Console.')
