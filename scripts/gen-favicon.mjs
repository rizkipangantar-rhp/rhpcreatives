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

// 5×7 uppercase — R, H, P
const UPPER = {
  R: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  H: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
  P: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
  ],
}
const UW = 5, UH = 7  // glyph cell size

// 3×5 lowercase — letters in "creatives": c r e a t i v e s
const LOWER = {
  c: [[0,1,1],[1,0,0],[1,0,0],[1,0,0],[0,1,1]],
  r: [[1,1,0],[1,0,1],[1,0,0],[1,0,0],[1,0,0]],
  e: [[0,1,1],[1,0,0],[1,1,0],[1,0,0],[0,1,1]],
  a: [[0,1,0],[0,0,1],[0,1,1],[1,0,1],[0,1,1]],
  t: [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,1]],
  i: [[0,1,0],[0,0,0],[0,1,0],[0,1,0],[0,1,0]],
  v: [[1,0,1],[1,0,1],[1,0,1],[0,1,0],[0,1,0]],
  s: [[0,1,1],[1,0,0],[0,1,0],[0,0,1],[1,1,0]],
}
const LW = 3, LH = 5  // glyph cell size

// 3×5 mini uppercase for 16px icon (fits: 3+1+3+1+3 = 11px wide)
const MINI = {
  R: [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
  H: [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
  P: [[1,1,0],[1,0,1],[1,1,0],[1,0,0],[1,0,0]],
}
const MW = 3, MH = 5

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

  // Paint a pixel in white
  function white(px, py) {
    if (px < 0 || px >= size || py < 0 || py >= size) return
    const i = (py * size + px) * 4
    if (rgba[i+3] === 0) return  // skip transparent corners
    rgba[i] = 255; rgba[i+1] = 255; rgba[i+2] = 255; rgba[i+3] = 255
  }

  // Paint a pixel in gradient (purple→pink) based on x position
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

  if (size <= 16) {
    // 16px: "RHP" in mini 3×5 glyphs, white, centered
    const word = ['R', 'H', 'P']
    const totalW = word.length * MW + (word.length - 1) * 1  // 11px
    const x0 = Math.round((size - totalW) / 2)
    const y0 = Math.round((size - MH) / 2)
    for (let ci = 0; ci < word.length; ci++) {
      const glyph = MINI[word[ci]]
      const ox = x0 + ci * (MW + 1)
      for (let gy = 0; gy < MH; gy++)
        for (let gx = 0; gx < MW; gx++)
          if (glyph[gy][gx]) white(ox + gx, y0 + gy)
    }
  } else {
    // 32px+: "RHP" (white 5×7) on top, "creatives" (gradient 3×5) below
    const word1 = ['R', 'H', 'P']
    const word2 = ['c', 'r', 'e', 'a', 't', 'i', 'v', 'e', 's']

    // RHP: 3*(5) + 2*1 gap = 17px wide
    const w1 = word1.length * UW + (word1.length - 1) * 1
    // creatives: 9*(3) = 27px wide (no gap — tight fit)
    const w2 = word2.length * LW

    const totalH = UH + 2 + LH  // 7 + 2 + 5 = 14px
    const y1 = Math.round((size - totalH) / 2)
    const y2 = y1 + UH + 2
    const x1 = Math.round((size - w1) / 2)
    const x2 = Math.max(1, Math.round((size - w2) / 2))

    // Draw "RHP" in white
    for (let ci = 0; ci < word1.length; ci++) {
      const glyph = UPPER[word1[ci]]
      const ox = x1 + ci * (UW + 1)
      for (let gy = 0; gy < UH; gy++)
        for (let gx = 0; gx < UW; gx++)
          if (glyph[gy][gx]) white(ox + gx, y1 + gy)
    }

    // Draw "creatives" in gradient
    for (let ci = 0; ci < word2.length; ci++) {
      const glyph = LOWER[word2[ci]]
      const ox = x2 + ci * LW
      for (let gy = 0; gy < LH; gy++)
        for (let gx = 0; gx < LW; gx++)
          if (glyph[gy][gx]) grad(ox + gx, y2 + gy, x2, w2)
    }
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
