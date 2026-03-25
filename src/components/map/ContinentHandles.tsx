'use client'

import { memo, useCallback, useRef } from 'react'
import type { ContinentShape } from '@/types/map'

interface ContinentHandlesProps {
  continent: ContinentShape
  getMapCoords: (clientX: number, clientY: number) => [number, number]
  onChange: (data: Partial<ContinentShape>) => void
  onDragEnd?: () => void
}

type HandleType = 'oceanRight' | 'oceanTop' | 'landRight' | 'landTop'

const CX = 450
const CY = 450

function ContinentHandlesInner({ continent, getMapCoords, onChange, onDragEnd }: ContinentHandlesProps) {
  const dragRef = useRef<HandleType | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent, type: HandleType) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as SVGElement
    target.setPointerCapture(e.pointerId)
    dragRef.current = type
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    e.stopPropagation()
    const [sx, sy] = getMapCoords(e.clientX, e.clientY)
    const type = dragRef.current

    switch (type) {
      case 'oceanRight':
        onChange({ oceanRadius: Math.max(100, Math.round(sx - CX)) })
        break
      case 'oceanTop':
        onChange({ oceanRadius: Math.max(100, Math.round(CY - sy)) })
        break
      case 'landRight':
        onChange({ landRx: Math.max(50, Math.round(sx - CX)) })
        break
      case 'landTop':
        onChange({ landRy: Math.max(50, Math.round(CY - sy)) })
        break
    }
  }, [getMapCoords, onChange])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    dragRef.current = null
    onDragEnd?.()
  }, [onDragEnd])

  const { oceanRadius, landRx, landRy } = continent

  // Handle positions
  const handles: { type: HandleType; x: number; y: number; label: string; color: string }[] = [
    { type: 'oceanRight', x: CX + oceanRadius, y: CY, label: 'O', color: '#3a7abf' },
    { type: 'oceanTop', x: CX, y: CY - oceanRadius, label: 'O', color: '#3a7abf' },
    { type: 'landRight', x: CX + landRx, y: CY, label: 'T', color: '#8a7a40' },
    { type: 'landTop', x: CX, y: CY - landRy, label: 'T', color: '#8a7a40' },
  ]

  return (
    <g id="L-continent-handles">
      {/* Guide outlines */}
      <circle cx={CX} cy={CY} r={oceanRadius} fill="none" stroke="#3a7abf" strokeWidth={1} strokeDasharray="6 4" opacity={0.4} pointerEvents="none" />
      <ellipse cx={CX} cy={CY} rx={landRx} ry={landRy} fill="none" stroke="#8a7a40" strokeWidth={1} strokeDasharray="6 4" opacity={0.4} pointerEvents="none" />

      {handles.map(({ type, x, y, label, color }) => (
        <g key={type}>
          <circle cx={x} cy={y} r={20} fill="none" stroke={color} strokeWidth={1} opacity={0.3} />
          <circle
            cx={x} cy={y} r={14}
            fill={color} stroke="#0e0902" strokeWidth={2}
            opacity={0.8}
            className="cursor-move touch-none hover:fill-white"
            onPointerDown={(e) => handlePointerDown(e, type)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          <text
            x={x} y={y + 4}
            fontSize={9} fontWeight={700}
            fill="#fff" textAnchor="middle"
            pointerEvents="none"
          >
            {label}
          </text>
        </g>
      ))}
    </g>
  )
}

export const ContinentHandles = memo(ContinentHandlesInner)
