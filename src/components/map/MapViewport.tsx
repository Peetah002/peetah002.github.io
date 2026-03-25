'use client'

import { useCallback, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import { MapSVG } from './MapSVG'
import type { MapState, EditorMode, ContinentShape } from '@/types/map'

interface MapViewportProps {
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
  onMapClick?: (x: number, y: number) => void
  onEdgeClick?: (targetType: 'region' | 'terrain', targetId: string, edgeIndex: number, x: number, y: number) => void
  onContinentChange?: (data: Partial<ContinentShape>) => void
  onContinentDragEnd?: () => void
  controlsRef?: React.RefObject<MapControlsHandle | null>
}

export interface MapControlsHandle {
  zoomIn: () => void
  zoomOut: () => void
  resetTransform: () => void
}

function ControlsBridge({ controlsRef }: { controlsRef: React.RefObject<MapControlsHandle | null> }) {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  // Store controls ref once
  const stored = useRef(false)
  if (!stored.current && controlsRef) {
    (controlsRef as React.MutableRefObject<MapControlsHandle | null>).current = { zoomIn, zoomOut, resetTransform }
    stored.current = true
  }
  return null
}

export function MapViewport({
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
  onMapClick,
  onEdgeClick,
  onContinentChange,
  onContinentDragEnd,
  controlsRef,
}: MapViewportProps) {
  // Track whether a drag just finished so we can suppress the next click
  const suppressClickRef = useRef(false)

  const getMapCoords = useCallback((clientX: number, clientY: number): [number, number] => {
    const svg = document.getElementById('map-svg')
    if (!svg) return [0, 0]
    const rect = svg.getBoundingClientRect()
    const scaleX = 900 / rect.width
    const scaleY = 900 / rect.height
    return [
      (clientX - rect.left) * scaleX,
      (clientY - rect.top) * scaleY,
    ]
  }, [])

  // Wrapped drag end handlers to set suppress flag
  const wrappedDragEnd = useCallback(() => {
    suppressClickRef.current = true
    setTimeout(() => { suppressClickRef.current = false }, 100)
    onDragEnd?.()
  }, [onDragEnd])

  const wrappedCityDragEnd = useCallback(() => {
    suppressClickRef.current = true
    setTimeout(() => { suppressClickRef.current = false }, 100)
    onCityDragEnd?.()
  }, [onCityDragEnd])

  const wrappedContinentDragEnd = useCallback(() => {
    suppressClickRef.current = true
    setTimeout(() => { suppressClickRef.current = false }, 100)
    onContinentDragEnd?.()
  }, [onContinentDragEnd])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    if (!onMapClick) return
    const target = e.target as Element
    if (target.closest('[data-cid]') || target.closest('[data-rid]') || target.closest('[data-tid]') || target.closest('[data-tower]')) return
    const [x, y] = getMapCoords(e.clientX, e.clientY)
    if (x >= 0 && x <= 900 && y >= 0 && y <= 900) {
      onMapClick(x, y)
    }
  }, [onMapClick, getMapCoords])

  const cursorClass = mode === 'addcity' || mode === 'addterrain' ? 'cursor-crosshair' : mode === 'edit' ? 'cursor-default' : 'cursor-grab'

  // Memoize the SVG so it doesn't re-render on pan/zoom
  const mapContent = useMemo(() => (
    <div onClick={handleClick}>
      <MapSVG
        state={state}
        mode={mode}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        selectedTerrain={selectedTerrain}
        onRegionClick={onRegionClick}
        onCityClick={onCityClick}
        onTerrainClick={onTerrainClick}
        onVertexDrag={onVertexDrag}
        onTerrainVertexDrag={onTerrainVertexDrag}
        onCityDrag={onCityDrag}
        onCityDragEnd={wrappedCityDragEnd}
        onDragEnd={wrappedDragEnd}
        getMapCoords={getMapCoords}
        onMapClick={onMapClick}
        onEdgeClick={onEdgeClick}
        onContinentChange={onContinentChange}
        onContinentDragEnd={wrappedContinentDragEnd}
      />
    </div>
  ), [state, mode, selectedRegion, selectedCity, selectedTerrain, onRegionClick, onCityClick, onTerrainClick, onVertexDrag, onTerrainVertexDrag, onCityDrag, wrappedCityDragEnd, wrappedDragEnd, getMapCoords, handleClick, onMapClick, onEdgeClick, onContinentChange, wrappedContinentDragEnd])

  return (
    <div
      className={`fixed inset-0 bg-ink ${cursorClass}`}
      style={{ touchAction: 'none' }}
    >
      <TransformWrapper
        initialScale={0.9}
        minScale={0.15}
        maxScale={7}
        centerOnInit
        limitToBounds={false}
        panning={{
          velocityDisabled: true,
          excluded: ['handle-drag', 'cursor-move'],
        }}
        doubleClick={{ disabled: true }}
        wheel={{ smoothStep: 0.02 }}
      >
        {controlsRef && <ControlsBridge controlsRef={controlsRef} />}
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
          contentStyle={{
            width: 900,
            height: 900,
          }}
        >
          {mapContent}
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
