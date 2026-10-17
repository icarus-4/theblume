// Point-cloud generators for each scroll "scene". Every generator fills a
// Float32Array of length count*3 so the shader can morph between them 1:1.

const TAU = Math.PI * 2

// Small seeded PRNG so shapes are identical on every load.
export function rng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function gauss(r) {
  return (r() + r() + r() - 1.5) / 1.5
}

// 0 — Blooming tree with ripple rings at its base (hero).
export function tree(count, r = rng(11)) {
  const out = new Float32Array(count * 3)
  const segs = []
  const grow = (x, y, z, dx, dy, dz, len, depth) => {
    const ex = x + dx * len
    const ey = y + dy * len
    const ez = z + dz * len
    segs.push([x, y, z, ex, ey, ez, depth])
    if (depth >= 5) return
    const kids = depth < 2 ? 3 : 2
    for (let k = 0; k < kids; k++) {
      const a = r() * TAU
      const spread = 0.85 + depth * 0.1
      let nx = dx + Math.cos(a) * spread
      let ny = dy + (depth < 1 ? 0.5 : 0.15)
      let nz = dz + Math.sin(a) * spread
      const m = Math.hypot(nx, ny, nz)
      grow(ex, ey, ez, nx / m, ny / m, nz / m, len * (0.74 + r() * 0.12), depth + 1)
    }
  }
  grow(0, -2.35, 0, 0, 1, 0, 1.15, 0)

  const ringN = Math.floor(count * 0.22)
  const canopyN = Math.floor(count * 0.5)
  const branchN = count - ringN - canopyN
  let i = 0
  // branches, denser near trunk
  for (let n = 0; n < branchN; n++, i++) {
    const s = segs[Math.floor(Math.pow(r(), 1.4) * segs.length)]
    const t = r()
    const th = 0.09 / (1 + s[6] * 0.7)
    out[i * 3] = s[0] + (s[3] - s[0]) * t + gauss(r) * th
    out[i * 3 + 1] = s[1] + (s[4] - s[1]) * t + gauss(r) * th
    out[i * 3 + 2] = s[2] + (s[5] - s[2]) * t + gauss(r) * th
  }
  // canopy clusters around branch tips
  const tips = segs.filter((s) => s[6] >= 3)
  for (let n = 0; n < canopyN; n++, i++) {
    const s = tips[Math.floor(r() * tips.length)]
    const rad = 0.55 * Math.cbrt(r())
    const a = r() * TAU
    const b = Math.acos(2 * r() - 1)
    out[i * 3] = s[3] + rad * Math.sin(b) * Math.cos(a)
    out[i * 3 + 1] = s[4] + rad * Math.cos(b) * 0.8
    out[i * 3 + 2] = s[5] + rad * Math.sin(b) * Math.sin(a)
  }
  // concentric ripple rings on the "water" plane
  for (let n = 0; n < ringN; n++, i++) {
    const ring = Math.floor(r() * 7)
    const rad = 0.35 + ring * 0.62 + gauss(r) * 0.04
    const a = r() * TAU
    out[i * 3] = Math.cos(a) * rad * 1.35
    out[i * 3 + 1] = -2.4
    out[i * 3 + 2] = Math.sin(a) * rad * 0.9
  }
  return out
}

// 1 — Neural sphere: fibonacci shell plus orbiting rings (services).
export function neuralSphere(count, r = rng(23)) {
  const out = new Float32Array(count * 3)
  const shellN = Math.floor(count * 0.62)
  const R = 2.1
  for (let i = 0; i < shellN; i++) {
    const y = 1 - (i / (shellN - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = i * 2.399963
    const j = 1 + gauss(r) * 0.03
    out[i * 3] = Math.cos(th) * rad * R * j
    out[i * 3 + 1] = y * R * j
    out[i * 3 + 2] = Math.sin(th) * rad * R * j
  }
  const tilts = [
    [0.3, 0.2],
    [-0.6, 0.9],
    [1.1, -0.4],
  ]
  for (let i = shellN; i < count; i++) {
    const [tx, tz] = tilts[i % 3]
    const a = r() * TAU
    const rr = R * 1.45 + gauss(r) * 0.04
    let x = Math.cos(a) * rr
    let y = 0
    let z = Math.sin(a) * rr
    // rotate around X then Z
    const y1 = y * Math.cos(tx) - z * Math.sin(tx)
    const z1 = y * Math.sin(tx) + z * Math.cos(tx)
    const x2 = x * Math.cos(tz) - y1 * Math.sin(tz)
    const y2 = x * Math.sin(tz) + y1 * Math.cos(tz)
    out[i * 3] = x2
    out[i * 3 + 1] = y2
    out[i * 3 + 2] = z1
  }
  return out
}

// 2 — Data cube: bright edges, sparse faces, dense core (AI).
export function cube(count, r = rng(37)) {
  const out = new Float32Array(count * 3)
  const h = 1.55
  const edgeN = Math.floor(count * 0.45)
  const faceN = Math.floor(count * 0.35)
  for (let i = 0; i < count; i++) {
    let x, y, z
    if (i < edgeN) {
      const axis = Math.floor(r() * 3)
      const sa = r() < 0.5 ? -h : h
      const sb = r() < 0.5 ? -h : h
      const t = (r() * 2 - 1) * h
      const j = () => gauss(r) * 0.025
      if (axis === 0) [x, y, z] = [t, sa + j(), sb + j()]
      else if (axis === 1) [x, y, z] = [sa + j(), t, sb + j()]
      else [x, y, z] = [sa + j(), sb + j(), t]
    } else if (i < edgeN + faceN) {
      const face = Math.floor(r() * 6)
      const u = (r() * 2 - 1) * h
      const v = (r() * 2 - 1) * h
      const s = face % 2 ? h : -h
      if (face < 2) [x, y, z] = [s, u, v]
      else if (face < 4) [x, y, z] = [u, s, v]
      else [x, y, z] = [u, v, s]
    } else {
      const rad = 0.75 * Math.cbrt(r())
      const a = r() * TAU
      const b = Math.acos(2 * r() - 1)
      ;[x, y, z] = [rad * Math.sin(b) * Math.cos(a), rad * Math.cos(b), rad * Math.sin(b) * Math.sin(a)]
    }
    out[i * 3] = x
    out[i * 3 + 1] = y
    out[i * 3 + 2] = z
  }
  return out
}

// 3 — Flowing data terrain; the shader animates its height (apps).
export function wave(count, r = rng(41)) {
  const out = new Float32Array(count * 3)
  const cols = Math.ceil(Math.sqrt(count * 2.2))
  const rows = Math.ceil(count / cols)
  for (let i = 0; i < count; i++) {
    const cx = i % cols
    const cz = Math.floor(i / cols)
    out[i * 3] = (cx / (cols - 1) - 0.5) * 11 + gauss(r) * 0.01
    out[i * 3 + 1] = -1.6
    out[i * 3 + 2] = (cz / Math.max(1, rows - 1) - 0.5) * 6
  }
  return out
}

// 4 — Double helix with rungs: growth / DNA (process).
export function helix(count, r = rng(53)) {
  const out = new Float32Array(count * 3)
  const H = 5.6
  const R = 1.05
  const turns = 2.6
  const rungN = Math.floor(count * 0.22)
  for (let i = 0; i < count; i++) {
    let x, y, z
    if (i < count - rungN) {
      const t = r()
      const strand = i % 2
      const a = t * turns * TAU + strand * Math.PI
      const j = gauss(r) * 0.06
      x = Math.cos(a) * (R + j)
      y = (t - 0.5) * H
      z = Math.sin(a) * (R + j)
    } else {
      const k = Math.floor(r() * 28)
      const t = (k + 0.5) / 28
      const a = t * turns * TAU
      const u = r() * 2 - 1
      x = Math.cos(a) * R * u
      y = (t - 0.5) * H
      z = Math.sin(a) * R * u
    }
    out[i * 3] = x
    out[i * 3 + 1] = y
    out[i * 3 + 2] = z
  }
  return out
}

// 5 — Ivies logo, sampled from the bright pixels of /logo.png (contact).
// Returns { positions, colors } or null if the image can't be read.
export async function logoShape(count, src, r = rng(67)) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  await img.decode()
  const S = 220
  const c = document.createElement('canvas')
  c.width = c.height = S
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, S, S)
  const { data } = ctx.getImageData(0, 0, S, S)
  const pts = []
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const o = (y * S + x) * 4
      const lum = Math.max(data[o], data[o + 1], data[o + 2])
      if (lum > 90) pts.push([x, y, data[o] / 255, data[o + 1] / 255, data[o + 2] / 255])
    }
  }
  if (!pts.length) return null
  // centre on the mark's bounding box
  let minX = S, maxX = 0, minY = S, maxY = 0
  for (const p of pts) {
    minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0])
    minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1])
  }
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const scale = 4.6 / Math.max(maxX - minX, maxY - minY)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const p = pts[Math.floor(r() * pts.length)]
    positions[i * 3] = (p[0] - cx + r() - 0.5) * scale
    positions[i * 3 + 1] = -(p[1] - cy + r() - 0.5) * scale
    positions[i * 3 + 2] = gauss(r) * 0.12
    colors[i * 3] = p[2]
    colors[i * 3 + 1] = p[3]
    colors[i * 3 + 2] = p[4]
  }
  return { positions, colors }
}
