'use client'

import { memo, useCallback, useRef } from 'react'
import type { City } from '@/types/map'
import { CITY_CFG } from '@/lib/constants'
import { CityMarker } from './markers/CityMarker'

interface CityLayerProps {
  cities: City[]
  selectedId?: string | null
  editable?: boolean
  onCityClick?: (id: string) => void
  onCityDrag?: (cityId: string, x: number, y: number) => void
  onCityDragEnd?: () => void
  getMapCoords?: (clientX: number, clientY: number) => [number, number]
}

function CityLayerInner({
  cities,
  selectedId,
  editable,
  onCityClick,
  onCityDrag,
  onCityDragEnd,
  getMapCoords,
}: CityLayerProps) {
  const dragRef = useRef<{ id: string; moved: boolean } | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent, cityId: string) => {
    if (!editable || !onCityDrag) return
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as SVGElement
    target.setPointerCapture(e.pointerId)
    dragRef.current = { id: cityId, moved: false }
  }, [editable, onCityDrag])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !getMapCoords || !onCityDrag) return
    e.stopPropagation()
    dragRef.current.moved = true
    const [sx, sy] = getMapCoords(e.clientX, e.clientY)
    onCityDrag(dragRef.current.id, Math.round(sx), Math.round(sy))
  }, [getMapCoords, onCityDrag])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    e.stopPropagation()
    const wasDrag = dragRef.current.moved
    const cityId = dragRef.current.id
    dragRef.current = null
    if (wasDrag) {
      onCityDragEnd?.()
    } else {
      // It was just a click, not a drag
      onCityClick?.(cityId)
    }
  }, [onCityClick, onCityDragEnd])

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
            onClick={!editable && onCityClick ? (e) => {
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
            {/* Hit area - also handles drag in edit mode */}
            <circle
              cx={city.x} cy={city.y} r={20}
              fill="transparent"
              className={editable ? 'cursor-move' : 'cursor-pointer'}
              onPointerDown={editable ? (e) => handlePointerDown(e, city.id) : undefined}
              onPointerMove={editable ? handlePointerMove : undefined}
              onPointerUp={editable ? handlePointerUp : undefined}
              onPointerCancel={editable ? handlePointerUp : undefined}
            />
          </g>
        )
      })}
    </g>
  )
}

export const CityLayer = memo(CityLayerInner)
