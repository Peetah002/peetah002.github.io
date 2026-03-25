'use client'

import { memo } from 'react'

interface TowerMarkerProps {
  x: number
  y: number
}

function TowerMarkerInner({ x, y }: TowerMarkerProps) {
  const bx = x - 9
  const by = y - 30

  return (
    <g>
      {/* Glow rings */}
      <circle cx={x} cy={y} r={30} fill="#d4a830" opacity={0.07} />
      <circle cx={x} cy={y} r={24} fill="none" stroke="#d4a830" strokeWidth={1} strokeDasharray="3,5" opacity={0.45} />

      {/* Building */}
      <rect x={bx} y={by} width={18} height={52} rx={2} fill="#e0cc8a" stroke="#8B6914" strokeWidth={1.5} />
      <rect x={bx - 2} y={by - 5} width={6} height={8} rx={1} fill="#ccba78" stroke="#8B6914" strokeWidth={1} />
      <rect x={bx + 6} y={by - 8} width={6} height={11} rx={1} fill="#d8c682" stroke="#8B6914" strokeWidth={1} />
      <rect x={bx + 14} y={by - 5} width={6} height={8} rx={1} fill="#ccba78" stroke="#8B6914" strokeWidth={1} />

      {/* Window glow */}
      <rect x={bx + 5} y={by + 14} width={8} height={10} rx={1} fill="#d4a830" opacity={0.9} filter="url(#fx-glow)" />

      {/* Flagpole + flag */}
      <line x1={x} y1={by - 8} x2={x} y2={by - 24} stroke="#8B6914" strokeWidth={1.2} />
      <polygon points={`${x},${by - 24} ${x + 13},${by - 18} ${x},${by - 12}`} fill="#a02818" />

      {/* Labels */}
      <text x={x} y={y + 42}
        fontFamily="var(--font-cinzel), Cinzel, serif"
        fontSize={10} fontWeight={600} fill="#d4a830" textAnchor="middle"
        opacity={0.85} letterSpacing={1} pointerEvents="none">
        Torre di Nartharion
      </text>
      <text x={x} y={y + 53}
        fontFamily="var(--font-body), IM Fell English, serif"
        fontSize={8} fontStyle="italic" fill="#a07820" textAnchor="middle"
        opacity={0.7} pointerEvents="none">
        HQ DOOM-E
      </text>
    </g>
  )
}

export const TowerMarker = memo(TowerMarkerInner)
