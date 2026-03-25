'use client'

import { memo } from 'react'
import { SVG_SIZE } from '@/lib/constants'
import { MapDefs } from './MapDefs'
import { RegionLayer } from './RegionLayer'
import { TerrainLayer } from './TerrainLayer'
import { CityLayer } from './CityLayer'
import { TowerLayer } from './TowerLayer'
import { HandleLayer } from './HandleLayer'
import { ContinentHandles } from './ContinentHandles'
import type { MapState, EditorMode, ContinentShape } from '@/types/map'

interface MapSVGProps {
  state: MapState
  mode: EditorMode
  selectedRegion: string | null
  selectedCity: string | null
  selectedTerrain: string | null
  onRegionClick?: (id: string) => void
  onCityClick?: (id: string) => void
  onTerrainClick?: (id: string) => void
  onVertexDrag?: (regionId: string, vertexIndex: number, x: number, y: number) => void
  onTerrainVertexDrag?: (terrainId: string, vertexIndex: number, x: number, y: number) => void
  onCityDrag?: (cityId: string, x: number, y: number) => void
  onCityDragEnd?: () => void
  onDragEnd?: () => void
  getMapCoords?: (clientX: number, clientY: number) => [number, number]
  onMapClick?: (x: number, y: number) => void
  onEdgeClick?: (targetType: 'region' | 'terrain', targetId: string, edgeIndex: number, x: number, y: number) => void
  onContinentChange?: (data: Partial<ContinentShape>) => void
  onContinentDragEnd?: () => void
}

function MapSVGInner({
  state,
  mode,
  selectedRegion,
  selectedCity,
  selectedTerrain,
  onRegionClick,
  onCityClick,
  onTerrainClick,
  onVertexDrag,
  onTerrainVertexDrag,
  onCityDrag,
  onCityDragEnd,
  onDragEnd,
  getMapCoords,
  onEdgeClick,
  onContinentChange,
  onContinentDragEnd,
}: MapSVGProps) {
  const editable = mode === 'edit'
  const region = selectedRegion ? state.regions.find(r => r.id === selectedRegion) ?? null : null
  const terrainFeature = selectedTerrain ? state.terrain.find(t => t.id === selectedTerrain) ?? null : null

  const c = state.continent ?? { oceanRadius: 418, landRx: 355, landRy: 348 }
  const cx = 450
  const cy = 450

  return (
    <svg
      id="map-svg"
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: SVG_SIZE, height: SVG_SIZE, overflow: 'visible', display: 'block' }}
    >
      <MapDefs oceanRadius={c.oceanRadius} />

      {/* Ocean */}
      <circle cx={cx} cy={cy} r={450} fill="#060d18" />
      <circle cx={cx} cy={cy} r={c.oceanRadius} fill="url(#g-ocean)" />
      <circle cx={cx} cy={cy} r={c.oceanRadius} fill="url(#p-waves)" />

      <g clipPath="url(#clip-map)">
        {/* Land mass */}
        <ellipse cx={cx} cy={cy} rx={c.landRx} ry={c.landRy} fill="url(#g-land)" filter="url(#fx-rough)" />

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
          selectedId={selectedTerrain}
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
          editable={editable}
          onCityClick={onCityClick}
          onCityDrag={onCityDrag}
          onCityDragEnd={onCityDragEnd}
          getMapCoords={getMapCoords}
        />

        {/* Vertex handles (editor only) */}
        {editable && onVertexDrag && onTerrainVertexDrag && onDragEnd && getMapCoords && (
          <HandleLayer
            region={region}
            terrainFeature={terrainFeature}
            onVertexDrag={onVertexDrag}
            onTerrainVertexDrag={onTerrainVertexDrag}
            onDragEnd={onDragEnd}
            getMapCoords={getMapCoords}
            onEdgeClick={onEdgeClick}
          />
        )}

        {/* Vignette */}
        <circle cx={cx} cy={cy} r={c.oceanRadius} fill="url(#g-vig)" pointerEvents="none" />
      </g>

      {/* Continent shape handles (outside clip-path so always visible) */}
      {editable && getMapCoords && onContinentChange && !selectedRegion && !selectedTerrain && (
        <ContinentHandles
          continent={c}
          getMapCoords={getMapCoords}
          onChange={onContinentChange}
          onDragEnd={onContinentDragEnd}
        />
      )}
    </svg>
  )
}

export const MapSVG = memo(MapSVGInner)
