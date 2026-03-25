'use client'

import { memo } from 'react'
import type { City } from '@/types/map'
import { CITY_CFG } from '@/lib/constants'
import { CityMarker } from './markers/CityMarker'

interface CityLayerProps {
  cities: City[]
  selectedId?: string | null
  onCityClick?: (id: string) => void
}

function CityLayerInner({ cities, selectedId, onCityClick }: CityLayerProps) {
  return (
    <g id="L-cities">
      {/* CSS animation for selection glow - no SVG animate element */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.15; }
        }
        .city-glow { animation: glow-pulse 2s ease-in-out infinite; }
      `}</style>
      {cities.map(city => {
        const cfg = CITY_CFG[city.type] || CITY_CFG.borgo
        const isSelected = city.id === selectedId
        return (
          <g
            key={city.id}
            data-cid={city.id}
            onClick={onCityClick ? (e) => {
              e.stopPropagation()
              onCityClick(city.id)
            } : undefined}
          >
            {/* Selection glow - CSS animated */}
            {isSelected && (
              <circle
                cx={city.x} cy={city.y} r={cfg.r + 8}
                fill="none" stroke="#d4a830" strokeWidth={2}
                className="city-glow"
              />
            )}
            <CityMarker cfg={cfg} x={city.x} y={city.y} />
            {/* Hit area */}
            <circle
              cx={city.x} cy={city.y} r={20}
              fill="transparent"
              className="cursor-pointer"
            />
          </g>
        )
      })}
    </g>
  )
}

export const CityLayer = memo(CityLayerInner)
