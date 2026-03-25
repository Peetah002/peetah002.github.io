'use client'

import { memo } from 'react'
import { SVG_SIZE } from '@/lib/constants'
import { MapDefs } from './MapDefs'
import { RegionLayer } from './RegionLayer'
import { TerrainLayer } from './TerrainLayer'
import { CityLayer } from './CityLayer'
import { TowerLayer } from './TowerLayer'
import { HandleLayer } from './HandleLayer'
import type { MapState, EditorMode } from '@/types/map'

interface MapSVGProps {
  state: MapState
  mode: EditorMode
  selectedRegion: string | null
  selectedCity: string | null
  onRegionClick?: (id: string) => void
  onCityClick?: (id: string) => void
  onTerrainClick?: (id: string) => void
  onVertexDrag?: (regionId: string, vertexIndex: number, x: number, y: number) => void
  onDragEnd?: () => void
  getMapCoords?: (clientX: number, clientY: number) => [number, number]
  onMapClick?: (x: number, y: number) => void
}

function MapSVGInner({
  state,
  mode,
  selectedRegion,
  selectedCity,
  onRegionClick,
  onCityClick,
  onTerrainClick,
  onVertexDrag,
  onDragEnd,
  getMapCoords,
}: MapSVGProps) {
  const editable = mode === 'edit'
  const region = selectedRegion ? state.regions.find(r => r.id === selectedRegion) ?? null : null

  return (
    <svg
      id="map-svg"
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: SVG_SIZE, height: SVG_SIZE, overflow: 'visible', display: 'block' }}
    >
      <MapDefs />

      {/* Ocean */}
      <circle cx={450} cy={450} r={450} fill="#060d18" />
      <circle cx={450} cy={450} r={418} fill="url(#g-ocean)" />
      <circle cx={450} cy={450} r={418} fill="url(#p-waves)" />

      <g clipPath="url(#clip-map)">
        {/* Land mass */}
        <ellipse cx={450} cy={450} rx={355} ry={348} fill="url(#g-land)" filter="url(#fx-rough)" />

        {/* Regions */}
        <RegionLayer
          regions={state.regions}
          editable={editable}
          selectedId={selectedRegion}
          onRegionClick={onRegionClick}
        />

        {/* Terrain */}
        <TerrainLayer
          terrain={state.terrain}
          onTerrainClick={onTerrainClick}
        />

        {/* Static decorations - ocean labels */}
        <g pointerEvents="none">
          <text x={95} y={445} fontFamily="var(--font-body), IM Fell English, serif" fontSize={13} fontStyle="italic" fill="#3a6a9a" textAnchor="middle" opacity={0.35} transform="rotate(-10,95,445)">Mare</text>
          <text x={95} y={460} fontFamily="var(--font-body), IM Fell English, serif" fontSize={13} fontStyle="italic" fill="#3a6a9a" textAnchor="middle" opacity={0.35} transform="rotate(-10,95,460)">Occidentale</text>
          <text x={808} y={430} fontFamily="var(--font-body), IM Fell English, serif" fontSize={12} fontStyle="italic" fill="#3a6a9a" textAnchor="middle" opacity={0.32} transform="rotate(8,808,430)">Mare</text>
          <text x={808} y={444} fontFamily="var(--font-body), IM Fell English, serif" fontSize={12} fontStyle="italic" fill="#3a6a9a" textAnchor="middle" opacity={0.32} transform="rotate(8,808,444)">Orientale</text>
        </g>

        {/* Tower */}
        <TowerLayer tower={state.tower} editable={editable} />

        {/* Cities */}
        <CityLayer
          cities={state.cities}
          selectedId={selectedCity}
          onCityClick={onCityClick}
        />

        {/* Vertex handles (editor only) */}
        {editable && onVertexDrag && onDragEnd && getMapCoords && (
          <HandleLayer
            region={region}
            onVertexDrag={onVertexDrag}
            onDragEnd={onDragEnd}
            getMapCoords={getMapCoords}
          />
        )}

        {/* Vignette */}
        <circle cx={450} cy={450} r={418} fill="url(#g-vig)" pointerEvents="none" />
      </g>
    </svg>
  )
}

export const MapSVG = memo(MapSVGInner)
