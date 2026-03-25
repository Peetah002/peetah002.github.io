'use client'

import { memo, useMemo } from 'react'
import type { TerrainFeature } from '@/types/map'
import { ptsStr } from '@/lib/geometry'
import { TERRAIN_CFG } from '@/lib/constants'

interface TerrainLayerProps {
  terrain: TerrainFeature[]
  selectedId?: string | null
  onTerrainClick?: (id: string) => void
}

// Pre-compute terrain icon positions keyed by feature id + points hash
const positionCache = new Map<string, [number, number][]>()

function getCacheKey(id: string, pts: [number, number][]): string {
  return `${id}:${pts.map(p => `${p[0]},${p[1]}`).join(';')}`
}

function getCachedPositions(
  id: string,
  pts: [number, number][],
  generator: (pts: [number, number][]) => [number, number][]
): [number, number][] {
  const key = getCacheKey(id, pts)
  let cached = positionCache.get(key)
  if (!cached) {
    cached = generator(pts)
    positionCache.set(key, cached)
  }
  return cached
}

// Pre-rendered SVG strings for terrain icons (avoid React element creation overhead)
const TreeIcon = memo(function TreeIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points="0,-6 4,2 -4,2" fill="#1a4a18" opacity={0.8} />
      <polygon points="0,-4 3,1 -3,1" fill="#2a6a28" opacity={0.9} />
      <line x1={0} y1={2} x2={0} y2={5} stroke="#4a3020" strokeWidth={1} />
    </g>
  )
})

const MountainIcon = memo(function MountainIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <polygon points="0,-10 8,4 -8,4" fill="#7a6a5a" stroke="#5a4a3a" strokeWidth={0.5} />
      <polygon points="0,-10 3,-4 -3,-4" fill="#d0c8c0" opacity={0.7} />
    </g>
  )
})

const TerrainFeatureComponent = memo(function TerrainFeatureComponent({
  feature,
  isSelected,
  onTerrainClick,
}: {
  feature: TerrainFeature
  isSelected: boolean
  onTerrainClick?: (id: string) => void
}) {
  const cfg = TERRAIN_CFG[feature.type]
  const op = feature.opacity ?? 0.5

  // Memoize computed positions
  const treePositions = useMemo(() => {
    if (feature.type !== 'forest') return []
    return getCachedPositions(feature.id, feature.points, generateTreePositions)
  }, [feature.id, feature.type, feature.points])

  const mountainPositions = useMemo(() => {
    if (feature.type !== 'mountain') return []
    return getCachedPositions(feature.id, feature.points, generateMountainPositions)
  }, [feature.id, feature.type, feature.points])

  if (feature.type === 'river') {
    const d = feature.points.reduce((acc, [x, y], i) => {
      return acc + (i === 0 ? `M${x},${y}` : ` L${x},${y}`)
    }, '')
    return (
      <g data-tid={feature.id}>
        <path
          d={d}
          fill="none"
          stroke={cfg.color}
          strokeWidth={isSelected ? 6 : 4}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={op}
          className={onTerrainClick ? 'cursor-pointer' : undefined}
          onClick={onTerrainClick ? (e) => {
            e.stopPropagation()
            onTerrainClick(feature.id)
          } : undefined}
        />
        <path
          d={d}
          fill="none"
          stroke="#4a9ac0"
          strokeWidth={2}
          strokeLinecap="round"
          opacity={op * 0.6}
          pointerEvents="none"
        />
        {feature.label && (
          <text
            x={feature.points[Math.floor(feature.points.length / 2)]?.[0]}
            y={(feature.points[Math.floor(feature.points.length / 2)]?.[1] ?? 0) - 8}
            fontFamily="var(--font-body), serif"
            fontSize={8}
            fontStyle="italic"
            fill="#4a8ab0"
            textAnchor="middle"
            opacity={0.7}
            pointerEvents="none"
          >
            {feature.label}
          </text>
        )}
      </g>
    )
  }

  // Area features
  return (
    <g data-tid={feature.id}>
      <polygon
        points={ptsStr(feature.points)}
        fill={cfg.color}
        stroke={isSelected ? '#d4a830' : cfg.color}
        strokeWidth={isSelected ? 2 : 0.5}
        opacity={op}
        className={onTerrainClick ? 'cursor-pointer' : undefined}
        onClick={onTerrainClick ? (e) => {
          e.stopPropagation()
          onTerrainClick(feature.id)
        } : undefined}
      />
      {feature.type === 'forest' && treePositions.length > 0 && (
        <g pointerEvents="none" opacity={op * 0.7}>
          {treePositions.map((pos, i) => (
            <TreeIcon key={i} x={pos[0]} y={pos[1]} />
          ))}
        </g>
      )}
      {feature.type === 'mountain' && mountainPositions.length > 0 && (
        <g pointerEvents="none" opacity={op * 0.7}>
          {mountainPositions.map((pos, i) => (
            <MountainIcon key={i} x={pos[0]} y={pos[1]} />
          ))}
        </g>
      )}
      {feature.label && (
        <text
          x={feature.points.reduce((s, p) => s + p[0], 0) / feature.points.length}
          y={feature.points.reduce((s, p) => s + p[1], 0) / feature.points.length}
          fontFamily="var(--font-body), serif"
          fontSize={9}
          fontStyle="italic"
          fill={feature.type === 'lake' ? '#4a8ab0' : '#2a2010'}
          textAnchor="middle"
          opacity={0.6}
          pointerEvents="none"
        >
          {feature.label}
        </text>
      )}
    </g>
  )
})

function TerrainLayerInner({ terrain, selectedId, onTerrainClick }: TerrainLayerProps) {
  return (
    <g id="L-terrain">
      {terrain.map(feature => (
        <TerrainFeatureComponent
          key={feature.id}
          feature={feature}
          isSelected={feature.id === selectedId}
          onTerrainClick={onTerrainClick}
        />
      ))}
    </g>
  )
}

// --- Generation functions (deterministic, cacheable) ---

function generateTreePositions(pts: [number, number][]): [number, number][] {
  const positions: [number, number][] = []
  if (pts.length < 3) return positions

  const minX = Math.min(...pts.map(p => p[0]))
  const maxX = Math.max(...pts.map(p => p[0]))
  const minY = Math.min(...pts.map(p => p[1]))
  const maxY = Math.max(...pts.map(p => p[1]))

  const step = 14
  for (let x = minX; x <= maxX; x += step) {
    for (let y = minY; y <= maxY; y += step) {
      const ox = ((x * 7 + y * 13) % 9) - 4
      const oy = ((x * 11 + y * 3) % 9) - 4
      const px = x + ox
      const py = y + oy
      if (isInsidePolygon(px, py, pts)) {
        positions.push([px, py])
      }
    }
  }
  return positions
}

function generateMountainPositions(pts: [number, number][]): [number, number][] {
  const positions: [number, number][] = []
  if (pts.length < 3) return positions

  const minX = Math.min(...pts.map(p => p[0]))
  const maxX = Math.max(...pts.map(p => p[0]))
  const minY = Math.min(...pts.map(p => p[1]))
  const maxY = Math.max(...pts.map(p => p[1]))

  const step = 22
  for (let x = minX; x <= maxX; x += step) {
    for (let y = minY; y <= maxY; y += step) {
      const ox = ((x * 5 + y * 17) % 11) - 5
      const oy = ((x * 13 + y * 7) % 11) - 5
      const px = x + ox
      const py = y + oy
      if (isInsidePolygon(px, py, pts)) {
        positions.push([px, py])
      }
    }
  }
  return positions
}

function isInsidePolygon(x: number, y: number, pts: [number, number][]): boolean {
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

export const TerrainLayer = memo(TerrainLayerInner)
