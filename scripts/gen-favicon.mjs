/**
 * Generates favicon.ico (32x32 + 16x16) + favicon-32.png from pure Node.js.
 * Design: dark rounded bg (#06060f), purple→pink gradient inner square,
 *         white "R" pixel-art centered.
 * Run:  node scripts/gen-favicon.mjs
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

/** Encode RGBA pixel array to PNG bytes. */
function encodePNG(width, height, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.allocUnsafe(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  const rowSize = 1 + width * 4
  const raw = Buffer.allocUnsafe(height * rowSize)
  for (let y = 0; y < height; y++) {
    raw[y * rowSize] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4
      const dst = y * rowSize + 1 + x * 4
      raw[dst]     = rgba[src]
      raw[dst + 1] = rgba[src + 1]
      raw[dst + 2] = rgba[src + 2]
      raw[dst + 3] = rgba[src + 3]
    }
  }

  const idat = deflateSync(raw, { level: 9 })
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// ─── Design ───────────────────────────────────────────────────────────────────

// "R" glyph: 8 cols × 9 rows pixel art (1 = white, 0 = transparent)
const R_GLYPH = [
  [1,1,1,1,1,0,0,0],
  [1,0,0,0,0,1,0,0],
  [1,0,0,0,0,1,0,0],
  [1,0,0,0,0,1,0,0],
  [1,1,1,1,1,0,0,0],
  [1,0,0,1,0,0,0,0],
  [1,0,0,0,1,0,0,0],
  [1,0,0,0,0,1,0,0],
  [1,0,0,0,0,0,1,0],
]
const G_ROWS = R_GLYPH.length    // 9
const G_COLS = R_GLYPH[0].length // 8

function lerp(a, b, t) { return Math.round(a + (b - a) * t) }

function renderIcon(size) {
  const rgba = new Uint8Array(size * size * 4)
  const r = Math.round(size * 0.18) // corner radius

  // scale factor for glyph (aim for ~56% of the icon)
  const glyphH = Math.round(size * 0.56)
  const glyphW = Math.round(glyphH * (G_COLS / G_ROWS))
  const offX = Math.round((size - glyphW) / 2)
  const offY = Math.round((size - glyphH) / 2)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4

      // Rounded-square mask
      const cdx = Math.max(0, r - x, x - (size - 1 - r))
      const cdy = Math.max(0, r - y, y - (size - 1 - r))
      if (cdx * cdx + cdy * cdy > r * r) {
        // outside corners → transparent
        rgba[i + 3] = 0; continue
      }

      // Gradient position (horizontal)
      const t = x / (size - 1)

      // Purple #8b5cf6 → Pink #ec4899
      const bgR = lerp(0x8b, 0xec, t)
      const bgG = lerp(0x5c, 0x48, t)
      const bgB = lerp(0xf6, 0x99, t)

      // Inner dark background over the gradient
      // (gradient shows only through a thin border ring)
      const borderW = Math.max(2, Math.round(size * 0.07))
      const innerR = lerp(0x06, 0x06, 0) // #06060f
      const innerG = 0x06
      const innerB = 0x0f

      const inBorder = (
        x < borderW || x >= size - borderW ||
        y < borderW || y >= size - borderW
      )

      let pr, pg, pb, pa
      if (inBorder) {
        pr = bgR; pg = bgG; pb = bgB; pa = 255
      } else {
        pr = innerR; pg = innerG; pb = innerB; pa = 255
      }

      // Check if pixel is inside the glyph
      const gx = x - offX
      const gy = y - offY
      const col = Math.floor(gx * G_COLS / glyphW)
      const row = Math.floor(gy * G_ROWS / glyphH)

      let isGlyph = false
      if (col >= 0 && col < G_COLS && row >= 0 && row < G_ROWS) {
        isGlyph = R_GLYPH[row][col] === 1
      }

      if (isGlyph) {
        // Gradient-colored glyph for larger sizes, white for small
        if (size >= 32) {
          pr = lerp(0x8b, 0xec, t)
          pg = lerp(0x5c, 0x48, t)
          pb = lerp(0xf6, 0x99, t)
        } else {
          pr = 255; pg = 255; pb = 255
        }
        pa = 255
      }

      rgba[i] = pr; rgba[i + 1] = pg; rgba[i + 2] = pb; rgba[i + 3] = pa
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
  for (const buf of pngBuffers) {
    offsets.push(offset)
    offset += buf.length
  }

  const header = Buffer.allocUnsafe(6)
  header.writeUInt16LE(0, 0)     // reserved
  header.writeUInt16LE(1, 2)     // type: 1 = ICO
  header.writeUInt16LE(count, 4) // count

  const dirs = pngBuffers.map((buf, i) => {
    const d = Buffer.allocUnsafe(16)
    const s = sizes[i]
    d[0] = s >= 256 ? 0 : s   // width (0 = 256)
    d[1] = s >= 256 ? 0 : s   // height
    d[2] = 0                   // color count (0 = no palette)
    d[3] = 0                   // reserved
    d.writeUInt16LE(1, 4)      // planes
    d.writeUInt16LE(32, 6)     // bit count
    d.writeUInt32LE(buf.length, 8)   // bytes in resource
    d.writeUInt32LE(offsets[i], 12)  // offset
    return d
  })

  return Buffer.concat([header, ...dirs, ...pngBuffers])
}

// ─── Generate ─────────────────────────────────────────────────────────────────

const sizes = [48, 32, 16]
const pngBufs = sizes.map(s => encodePNG(s, s, renderIcon(s)))

// Write individual PNGs (for reference / apple-touch-icon)
writeFileSync(resolve(ROOT, 'public/favicon-48.png'), pngBufs[0])
writeFileSync(resolve(ROOT, 'public/favicon-32.png'), pngBufs[1])
console.log('✓  public/favicon-48.png')
console.log('✓  public/favicon-32.png')

// Write ICO with all three sizes
const ico = makeICO(pngBufs, sizes)
writeFileSync(resolve(ROOT, 'app/favicon.ico'), ico)
console.log(`✓  app/favicon.ico (${ico.length} bytes, sizes: ${sizes.join(', ')}px)`)

console.log('\nDone! Commit and push. Then request a Google re-crawl via Search Console.')
