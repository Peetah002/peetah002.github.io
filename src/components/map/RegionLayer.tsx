'use client'

import { memo } from 'react'
import type { Region } from '@/types/map'
import { ptsStr, centroid } from '@/lib/geometry'

interface RegionLayerProps {
  regions: Region[]
  editable?: boolean
  selectedId?: string | null
  onRegionClick?: (id: string) => void
}

function RegionLayerInner({ regions, editable, selectedId, onRegionClick }: RegionLayerProps) {
  return (
    <>
      {/* Region polygons */}
      <g id="L-regions">
        {regions.map(r => (
          <polygon
            key={r.id}
            points={ptsStr(r.pts)}
            fill={r.color}
            stroke={r.id === selectedId ? '#d4a830' : r.stroke}
            strokeWidth={r.id === selectedId ? 3 : 1.5}
            opacity={r.op}
            data-rid={r.id}
            className={editable ? 'cursor-pointer' : undefined}
            onClick={editable && onRegionClick ? (e) => {
              e.stopPropagation()
              onRegionClick(r.id)
            } : undefined}
          />
        ))}
      </g>

      {/* Region labels */}
      <g id="L-labels" pointerEvents="none">
        {regions.map(r => {
          const [cx, cy] = centroid(r.pts)
          return (
            <g key={r.id}>
              <text
                x={cx} y={cy - 5}
                fontFamily="var(--font-cinzel), Cinzel, serif"
                fontSize={14} fontWeight={700}
                fill="#1a1208" textAnchor="middle"
                opacity={0.82} letterSpacing={1.5}
              >
                {r.name.toUpperCase()}
              </text>
              <text
                x={cx} y={cy + 10}
                fontFamily="var(--font-body), IM Fell English, serif"
                fontSize={9} fontStyle="italic"
                fill="#2a2010" textAnchor="middle"
                opacity={0.62}
              >
                {r.sub}
              </text>
            </g>
          )
        })}
      </g>
    </>
  )
}

export const RegionLayer = memo(RegionLayerInner)
