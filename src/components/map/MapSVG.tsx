'use client'

import { memo } from 'react'
import { SVG_SIZE } from '@/lib/constants'
import { ptsStr } from '@/lib/geometry'
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
  selectedTerrain: string | null
  selectedContinent: string | null
  onRegionClick?: (id: string) => void
  onCityClick?: (id: string) => void
  onTerrainClick?: (id: string) => void
  onContinentClick?: (id: string) => void
  onVertexDrag?: (regionId: string, vertexIndex: number, x: number, y: number) => void
  onTerrainVertexDrag?: (terrainId: string, vertexIndex: number, x: number, y: number) => void
  onContinentVertexDrag?: (targetId: string, vertexIndex: number, x: number, y: number) => void
  onCityDrag?: (cityId: string, x: number, y: number) => void
  onCityDragEnd?: () => void
  onDragEnd?: () => void
  getMapCoords?: (clientX: number, clientY: number) => [number, number]
  onMapClick?: (x: number, y: number) => void
  onEdgeClick?: (targetType: 'region' | 'terrain' | 'continent', targetId: string, edgeIndex: number, x: number, y: number) => void
}

function MapSVGInner({
  state,
  mode,
  selectedRegion,
  selectedCity,
  selectedTerrain,
  selectedContinent,
  onRegionClick,
  onCityClick,
  onTerrainClick,
  onContinentClick,
  onVertexDrag,
  onTerrainVertexDrag,
  onContinentVertexDrag,
  onCityDrag,
  onCityDragEnd,
  onDragEnd,
  getMapCoords,
  onEdgeClick,
}: MapSVGProps) {
  const editable = mode === 'edit'
  const region = selectedRegion ? state.regions.find(r => r.id === selectedRegion) ?? null : null
  const terrainFeature = selectedTerrain ? state.terrain.find(t => t.id === selectedTerrain) ?? null : null

  const c = state.continent
  const oceanBorder = c.oceanBorder
  const landMasses = c.landMasses

  // Determine which continent polygon to show handles for
  let continentHandlePts: [number, number][] | null = null
  let continentHandleId = ''
  if (selectedContinent === 'ocean') {
    continentHandlePts = oceanBorder
    continentHandleId = 'ocean'
  } else if (selectedContinent) {
    const lm = landMasses.find(l => l.id === selectedContinent)
    if (lm) {
      continentHandlePts = lm.pts
      continentHandleId = lm.id
    }
  }

  return (
    <svg
      id="map-svg"
      viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: SVG_SIZE, height: SVG_SIZE, overflow: 'visible', display: 'block' }}
    >
      <MapDefs oceanBorder={oceanBorder} />

      {/* Ocean background */}
      <rect x={0} y={0} width={SVG_SIZE} height={SVG_SIZE} fill="#060d18" />
      <polygon points={ptsStr(oceanBorder)} fill="url(#g-ocean)" />
      <polygon points={ptsStr(oceanBorder)} fill="url(#p-waves)" />

      {/* Ocean label */}
      {c.oceanLabel && (
        <text
          x={oceanBorder.reduce((s, p) => s + p[0], 0) / oceanBorder.length}
          y={oceanBorder.reduce((s, p) => s + p[1], 0) / oceanBorder.length}
          fontFamily="var(--font-body), IM Fell English, serif"
          fontSize={14} fontStyle="italic"
          fill="#3a6a9a" textAnchor="middle" opacity={0.4}
          pointerEvents="none"
        >
          {c.oceanLabel}
        </text>
      )}

      {/* Ocean border clickable in edit mode */}
      {editable && onContinentClick && (
        <polygon
          points={ptsStr(oceanBorder)}
          fill="none"
          stroke={selectedContinent === 'ocean' ? '#3a7abf' : 'transparent'}
          strokeWidth={selectedContinent === 'ocean' ? 2 : 8}
          className="cursor-pointer"
          data-continent="ocean"
          onClick={(e) => { e.stopPropagation(); onContinentClick('ocean') }}
          pointerEvents="stroke"
        />
      )}

      <g clipPath="url(#clip-map)">
        {/* Land masses */}
        {landMasses.map(lm => (
          <g key={lm.id}>
            <polygon
              points={ptsStr(lm.pts)}
              fill="url(#g-land)"
              filter="url(#fx-rough)"
            />
            {editable && onContinentClick && (
              <polygon
                points={ptsStr(lm.pts)}
                fill="transparent"
                stroke={selectedContinent === lm.id ? '#8a7a40' : 'transparent'}
                strokeWidth={selectedContinent === lm.id ? 2 : 0}
                className="cursor-pointer"
                data-continent={lm.id}
                onClick={(e) => { e.stopPropagation(); onContinentClick(lm.id) }}
              />
            )}
          </g>
        ))}

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

        {/* Land mass labels */}
        <g pointerEvents="none">
          {landMasses.map(lm => {
            if (!lm.label) return null
            const cx = lm.pts.reduce((s, p) => s + p[0], 0) / lm.pts.length
            const cy = lm.pts.reduce((s, p) => s + p[1], 0) / lm.pts.length
            return (
              <text key={`lbl-${lm.id}`} x={cx} y={cy}
                fontFamily="var(--font-cinzel), Cinzel, serif"
                fontSize={12} fontWeight={700} fontStyle="italic"
                fill="#2a2010" textAnchor="middle" opacity={0.5}
                letterSpacing={1.5}
              >
                {lm.label}
              </text>
            )
          })}
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

        {/* Vertex handles for region/terrain */}
        {editable && onVertexDrag && onTerrainVertexDrag && onDragEnd && getMapCoords && !selectedContinent && (
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
        <polygon points={ptsStr(oceanBorder)} fill="url(#g-vig)" pointerEvents="none" />
      </g>

      {/* Continent vertex handles (outside clip so always visible) */}
      {editable && continentHandlePts && onContinentVertexDrag && onDragEnd && getMapCoords && (
        <HandleLayer
          continentPts={continentHandlePts}
          continentId={continentHandleId}
          onContinentVertexDrag={onContinentVertexDrag}
          onDragEnd={onDragEnd}
          getMapCoords={getMapCoords}
          onEdgeClick={onEdgeClick}
          handleColor={selectedContinent === 'ocean' ? '#3a7abf' : '#8a7a40'}
        />
      )}
    </svg>
  )
}

export const MapSVG = memo(MapSVGInner)
