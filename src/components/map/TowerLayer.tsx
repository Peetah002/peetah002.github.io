'use client'

import { memo, useCallback, useRef } from 'react'
import type { Tower } from '@/types/map'
import { TowerMarker } from './markers/TowerMarker'

interface TowerLayerProps {
  tower: Tower
  editable?: boolean
  onTowerDrag?: (x: number, y: number) => void
  onTowerDragEnd?: () => void
  getMapCoords?: (clientX: number, clientY: number) => [number, number]
}

function TowerLayerInner({ tower, editable, onTowerDrag, onTowerDragEnd, getMapCoords }: TowerLayerProps) {
  const dragRef = useRef(false)
  const movedRef = useRef(false)

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!editable || !onTowerDrag) return
    e.preventDefault()
    e.stopPropagation()
    ;(e.currentTarget as SVGElement).setPointerCapture(e.pointerId)
    dragRef.current = true
    movedRef.current = false
  }, [editable, onTowerDrag])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current || !getMapCoords || !onTowerDrag) return
    e.stopPropagation()
    movedRef.current = true
    const [sx, sy] = getMapCoords(e.clientX, e.clientY)
    onTowerDrag(Math.round(sx), Math.round(sy))
  }, [getMapCoords, onTowerDrag])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    e.stopPropagation()
    dragRef.current = false
    if (movedRef.current) onTowerDragEnd?.()
  }, [onTowerDragEnd])

  return (
    <g id="L-tower" data-tower="1">
      <TowerMarker x={tower.x} y={tower.y} />
      {editable && (
        <circle
          cx={tower.x} cy={tower.y} r={34}
          fill="transparent"
          stroke="#d4a830" strokeWidth={1.5} strokeDasharray="4,4" opacity={0.5}
          className="cursor-move touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      )}
    </g>
  )
}

export const TowerLayer = memo(TowerLayerInner)
