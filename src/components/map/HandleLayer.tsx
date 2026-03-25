'use client'

import { memo, useCallback, useRef } from 'react'
import type { Region, TerrainFeature } from '@/types/map'

type DragTarget = { type: 'region' | 'terrain' | 'continent'; id: string; vi: number }

interface HandleLayerProps {
  // Region/terrain mode
  region?: Region | null
  terrainFeature?: TerrainFeature | null
  onVertexDrag?: (regionId: string, vertexIndex: number, x: number, y: number) => void
  onTerrainVertexDrag?: (terrainId: string, vertexIndex: number, x: number, y: number) => void
  // Continent mode
  continentPts?: [number, number][] | null
  continentId?: string
  onContinentVertexDrag?: (targetId: string, vertexIndex: number, x: number, y: number) => void
  // Shared
  onDragEnd: () => void
  getMapCoords: (clientX: number, clientY: number) => [number, number]
  onEdgeClick?: (targetType: 'region' | 'terrain' | 'continent', targetId: string, edgeIndex: number, x: number, y: number) => void
  handleColor?: string
}

function HandleLayerInner({
  region,
  terrainFeature,
  onVertexDrag,
  onTerrainVertexDrag,
  continentPts,
  continentId,
  onContinentVertexDrag,
  onDragEnd,
  getMapCoords,
  onEdgeClick,
  handleColor = '#d4a830',
}: HandleLayerProps) {
  const dragRef = useRef<DragTarget | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent, type: DragTarget['type'], id: string, vi: number) => {
    e.preventDefault()
    e.stopPropagation()
    const target = e.currentTarget as SVGElement
    target.setPointerCapture(e.pointerId)
    dragRef.current = { type, id, vi }
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    e.stopPropagation()
    const [sx, sy] = getMapCoords(e.clientX, e.clientY)
    const { type, id, vi } = dragRef.current
    if (type === 'region') {
      onVertexDrag?.(id, vi, Math.round(sx), Math.round(sy))
    } else if (type === 'terrain') {
      onTerrainVertexDrag?.(id, vi, Math.round(sx), Math.round(sy))
    } else if (type === 'continent') {
      onContinentVertexDrag?.(id, vi, Math.round(sx), Math.round(sy))
    }
  }, [getMapCoords, onVertexDrag, onTerrainVertexDrag, onContinentVertexDrag])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    dragRef.current = null
    onDragEnd()
  }, [onDragEnd])

  const handleEdgeClick = useCallback((e: React.MouseEvent, type: DragTarget['type'], id: string, edgeIndex: number) => {
    e.stopPropagation()
    if (!onEdgeClick) return
    const [sx, sy] = getMapCoords(e.clientX, e.clientY)
    onEdgeClick(type, id, edgeIndex, Math.round(sx), Math.round(sy))
  }, [getMapCoords, onEdgeClick])

  // Determine which points to render
  let pts: [number, number][] | null = null
  let targetType: DragTarget['type'] = 'region'
  let targetId = ''
  let isRiver = false

  if (continentPts && continentId) {
    pts = continentPts
    targetType = 'continent'
    targetId = continentId
  } else if (region) {
    pts = region.pts
    targetType = 'region'
    targetId = region.id
  } else if (terrainFeature) {
    pts = terrainFeature.points
    targetType = 'terrain'
    targetId = terrainFeature.id
    isRiver = terrainFeature.type === 'river'
  }

  if (!pts) return null

  // Build edge lines
  const edges: { x1: number; y1: number; x2: number; y2: number; idx: number }[] = []
  for (let i = 0; i < pts.length; i++) {
    const next = isRiver ? i + 1 : (i + 1) % pts.length
    if (next >= pts.length) break
    edges.push({
      x1: pts[i][0], y1: pts[i][1],
      x2: pts[next][0], y2: pts[next][1],
      idx: i,
    })
  }

  return (
    <g id="L-handles">
      {/* Clickable edges for inserting vertices */}
      {edges.map((edge) => (
        <line
          key={`edge-${edge.idx}`}
          x1={edge.x1} y1={edge.y1}
          x2={edge.x2} y2={edge.y2}
          stroke="transparent"
          strokeWidth={16}
          className="cursor-copy"
          onClick={(e) => handleEdgeClick(e, targetType, targetId, edge.idx)}
          pointerEvents="stroke"
        />
      ))}

      {/* Visible edge highlights */}
      {edges.map((edge) => (
        <line
          key={`edge-vis-${edge.idx}`}
          x1={edge.x1} y1={edge.y1}
          x2={edge.x2} y2={edge.y2}
          stroke={handleColor}
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.25}
          pointerEvents="none"
        />
      ))}

      {/* Vertex handles */}
      {pts.map(([px, py], i) => (
        <g key={i}>
          <circle cx={px} cy={py} r={24} fill="none" stroke={handleColor} strokeWidth={1} opacity={0.3} />
          <circle
            cx={px} cy={py} r={16}
            fill={handleColor} stroke="#0e0902" strokeWidth={2}
            opacity={0.8}
            className="cursor-move touch-none hover:fill-white"
            onPointerDown={(e) => handlePointerDown(e, targetType, targetId, i)}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
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
