'use client'

import { useCallback, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import { MapSVG } from './MapSVG'
import type { MapState, EditorMode } from '@/types/map'

interface MapViewportProps {
  state: MapState
  mode: EditorMode
  selectedRegion: string | null
  selectedCity: string | null
  onRegionClick?: (id: string) => void
  onCityClick?: (id: string) => void
  onTerrainClick?: (id: string) => void
  onVertexDrag?: (regionId: string, vertexIndex: number, x: number, y: number) => void
  onDragEnd?: () => void
  onMapClick?: (x: number, y: number) => void
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
  onRegionClick,
  onCityClick,
  onTerrainClick,
  onVertexDrag,
  onDragEnd,
  onMapClick,
  controlsRef,
}: MapViewportProps) {
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

  const handleClick = useCallback((e: React.MouseEvent) => {
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
        onRegionClick={onRegionClick}
        onCityClick={onCityClick}
        onTerrainClick={onTerrainClick}
        onVertexDrag={onVertexDrag}
        onDragEnd={onDragEnd}
        getMapCoords={getMapCoords}
        onMapClick={onMapClick}
      />
    </div>
  ), [state, mode, selectedRegion, selectedCity, onRegionClick, onCityClick, onTerrainClick, onVertexDrag, onDragEnd, getMapCoords, handleClick, onMapClick])

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
        wheel={{ smoothStep: 0.08 }}
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
