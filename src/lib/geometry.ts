export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

export function centroid(pts: [number, number][]): [number, number] {
  const n = pts.length
  return [
    pts.reduce((s, p) => s + p[0], 0) / n,
    pts.reduce((s, p) => s + p[1], 0) / n,
  ]
}

export function ptsStr(pts: [number, number][]): string {
  return pts.map(p => `${p[0]},${p[1]}`).join(' ')
}

export function darken(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgb(${Math.floor(r * 0.5)},${Math.floor(g * 0.5)},${Math.floor(b * 0.5)})`
  } catch {
    return '#333'
  }
}

export function pointInPolygon(x: number, y: number, pts: [number, number][]): boolean {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const xi = pts[i][0], yi = pts[i][1]
    const xj = pts[j][0], yj = pts[j][1]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

/** Generate polygon points approximating an ellipse (or circle if rx===ry) */
export function ellipsePolygon(cx: number, cy: number, rx: number, ry: number, n = 32): [number, number][] {
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([Math.round(cx + rx * Math.cos(a)), Math.round(cy + ry * Math.sin(a))])
  }
  return pts
}

export function longestEdgeIndex(pts: [number, number][]): number {
  let best = 0
  let bestLen = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1])
    if (l > bestLen) {
      bestLen = l
      best = i
    }
  }
  return best
}
