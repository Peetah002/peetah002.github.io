'use client'

import { memo } from 'react'
import type { CityConfig } from '@/types/map'
import { darken } from '@/lib/geometry'

interface CityMarkerProps {
  cfg: CityConfig
  x: number
  y: number
}

function CityMarkerInner({ cfg, x, y }: CityMarkerProps) {
  const { r, fill, inner, tri, sq, star, cross } = cfg
  const s = r + 3
  const dk = darken(fill)

  if (tri) {
    return (
      <>
        <polygon
          points={`${x},${y - s} ${x + s},${y + s} ${x - s},${y + s}`}
          fill={fill}
          stroke={dk}
          strokeWidth="1.5"
        />
        {inner && (
          <circle cx={x} cy={y + Math.round(s / 3)} r={3} fill={inner} opacity={0.9} />
        )}
      </>
    )
  }

  if (sq) {
    const h = r + 1
    return (
      <>
        <rect
          x={x - h} y={y - h} width={h * 2} height={h * 2}
          rx={1} fill={fill} stroke={dk} strokeWidth="1.5"
        />
        {inner && (
          <rect
            x={x - r + 2} y={y - r + 2}
            width={(r - 2) * 2} height={(r - 2) * 2}
            rx={1} fill={inner} opacity={0.8}
          />
        )}
      </>
    )
  }

  if (star) {
    const p1 = `${x},${y - s} ${x + s * 0.87},${y + s * 0.5} ${x - s * 0.87},${y + s * 0.5}`
    const p2 = `${x},${y + s} ${x + s * 0.87},${y - s * 0.5} ${x - s * 0.87},${y - s * 0.5}`
    return (
      <>
        <polygon points={p1} fill={fill} stroke={dk} strokeWidth="1" opacity={0.9} />
        <polygon points={p2} fill={fill} stroke={dk} strokeWidth="1" opacity={0.7} />
        {inner && <circle cx={x} cy={y} r={3} fill={inner} />}
      </>
    )
  }

  if (cross) {
    const t = Math.max(2, Math.floor(r / 3))
    return (
      <>
        <rect x={x - t} y={y - r} width={t * 2} height={r * 2} rx={1} fill={fill} stroke={dk} strokeWidth="1" />
        <rect x={x - r} y={y - t} width={r * 2} height={t * 2} rx={1} fill={fill} stroke={dk} strokeWidth="1" />
        {inner && <circle cx={x} cy={y} r={2} fill={inner} />}
      </>
    )
  }

  // Default: circle
  return (
    <>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={dk} strokeWidth={r >= 7 ? 2 : 1.2} />
      {inner && <circle cx={x} cy={y} r={Math.max(2, r - 4)} fill={inner} />}
    </>
  )
}

export const CityMarker = memo(CityMarkerInner)
