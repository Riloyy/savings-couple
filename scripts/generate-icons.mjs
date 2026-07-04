import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'

function createPNG(width, height, getPixel) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type (RGBA)
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace

  // Raw pixel data with filter byte per row
  const raw = Buffer.alloc(height * (1 + width * 4))
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0 // filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height)
      const off = y * (1 + width * 4) + 1 + x * 4
      raw[off] = r
      raw[off + 1] = g
      raw[off + 2] = b
      raw[off + 3] = a
    }
  }

  const compressed = deflateSync(raw)

  function crc32(buf) {
    let c = 0xffffffff
    for (let i = 0; i < buf.length; i++) {
      c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xff]
    }
    return (c ^ 0xffffffff) >>> 0
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length, 0)
    const typeB = Buffer.from(type, 'ascii')
    const crcBuf = Buffer.concat([typeB, data])
    const crcV = Buffer.alloc(4)
    crcV.writeUInt32BE(crc32(crcBuf), 0)
    return Buffer.concat([len, typeB, data, crcV])
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// Pre-compute CRC table
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
  }
  crcTable[n] = c
}

// Colors
const r1 = 91, g1 = 141, b1 = 239   // #5B8DEF
const r2 = 255, g2 = 107, b2 = 129  // #FF6B81

function heartShape(nx, ny) {
  // Heart equation: (x² + y² - 1)³ - x²·y³ ≤ 0
  const x = nx * 2 - 1
  const y = ny * 2 - 1
  const h = (x * x + y * y - 1) ** 3 - x * x * (y * y * y)
  return h <= 0
}

function getPixel(x, y, w, h) {
  const nx = x / w
  const ny = y / h

  if (!heartShape(nx, 1 - ny)) {
    return [0, 0, 0, 0] // transparent outside heart
  }

  // Gradient: blue top-left to pink bottom-right
  const t = (nx + ny) / 2
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return [r, g, b, 255]
}

mkdirSync('public', { recursive: true })

const png192 = createPNG(192, 192, getPixel)
writeFileSync('public/pwa-192x192.png', png192)
console.log('✓ public/pwa-192x192.png')

const png512 = createPNG(512, 512, getPixel)
writeFileSync('public/pwa-512x512.png', png512)
console.log('✓ public/pwa-512x512.png')
