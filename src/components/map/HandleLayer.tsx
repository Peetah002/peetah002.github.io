'use client'

import { memo, useCallback, useRef } from 'react'
import type { Region } from '@/types/map'

interface HandleLayerProps {
  region: Region | null
  onVertexDrag: (regionId: string, vertexIndex: number, x: number, y: number) => void
  onDragEnd: () => void
  getMapCoords: (clientX: number, clientY: number) => [number, number]
}

function HandleLayerInner({ region, onVertexDrag, onDragEnd, getMapCoords }: HandleLayerProps) {
  const dragRef = useRef<{ rid: string; vi: number } | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent, rid: string, vi: number) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as SVGElement
    target.setPointerCapture(e.pointerId)
    dragRef.current = { rid, vi }
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    e.stopPropagation()
    const [sx, sy] = getMapCoords(e.clientX, e.clientY)
    onVertexDrag(dragRef.current.rid, dragRef.current.vi, Math.round(sx), Math.round(sy))
  }, [getMapCoords, onVertexDrag])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    dragRef.current = null
    onDragEnd()
  }, [onDragEnd])

  if (!region) return null

  return (
    <g id="L-handles">
      {region.pts.map(([px, py], i) => (
        <g key={i}>
          {/* Visual ring */}
          <circle cx={px} cy={py} r={24} fill="none" stroke="#d4a830" strokeWidth={1} opacity={0.3} />
          {/* Drag handle */}
          <circle
            cx={px} cy={py} r={16}
            fill="#d4a830" stroke="#0e0902" strokeWidth={2}
            opacity={0.8}
            className="cursor-move touch-none hover:fill-white"
            onPointerDown={(e) => handlePointerDown(e, region.id, i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          {/* Index label */}
          <text
            x={px} y={py + 4}
            fontSize={10} fontWeight={700}
            fill="#0e0902" textAnchor="middle"
            pointerEvents="none"
          >
            {i + 1}
          </text>
        </g>
      ))}
    </g>
  )
}

export const HandleLayer = memo(HandleLayerInner)
