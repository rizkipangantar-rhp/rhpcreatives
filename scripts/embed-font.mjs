/**
 * Downloads Space Grotesk (ExtraBold 800) subsetted to just "RHP",
 * then embeds it as base64 in app/icon.svg so the favicon font matches the navbar.
 * Run: node scripts/embed-font.mjs
 */
import https from 'https'
import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dir, '..')

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        // Chrome UA required — Google Fonts returns woff2 only for modern browsers
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    }, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
    }).on('error', reject)
  })
}

// "text=RHP" tells Google Fonts to subset the font to only these 3 characters
const CSS_URL = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@800&text=RHP&display=block'

console.log('Fetching Google Fonts CSS (subsetted to R,H,P)...')
const css = await get(CSS_URL)
if (css.status !== 200) { console.error('CSS fetch failed:', css.status); process.exit(1) }

const cssText = css.body.toString()
const match = cssText.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/)
if (!match) { console.error('No woff2 URL found in CSS:\n', cssText); process.exit(1) }

const fontUrl = match[1]
console.log('Downloading font from:', fontUrl)

const font = await get(fontUrl)
if (font.status !== 200) { console.error('Font fetch failed:', font.status); process.exit(1) }

console.log(`Font downloaded: ${font.body.length} bytes → base64: ${Math.round(font.body.length * 4 / 3)} bytes`)
const b64 = font.body.toString('base64')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <style>
      @font-face {
        font-family: 'Space Grotesk';
        font-weight: 800;
        src: url('data:font/woff2;base64,${b64}') format('woff2');
      }
    </style>
    <linearGradient id="g" gradientUnits="userSpaceOnUse" x1="3" y1="0" x2="29" y2="0">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="5" fill="#06060f"/>
  <text x="16" y="21"
    text-anchor="middle"
    font-family="'Space Grotesk', system-ui, sans-serif"
    font-weight="800"
    font-size="18"
    fill="url(#g)"
    textLength="26"
    lengthAdjust="spacingAndGlyphs">RHP</text>
</svg>
`

writeFileSync(resolve(ROOT, 'app/icon.svg'), svg)
console.log('✓  app/icon.svg updated with embedded Space Grotesk (R+H+P only)')
console.log(`    SVG size: ${Math.round(svg.length / 1024)}KB`)
