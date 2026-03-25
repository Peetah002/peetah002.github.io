'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { MapViewport, type MapControlsHandle } from '@/components/map/MapViewport'
import { TopBar } from '@/components/layout/TopBar'
import { ZoomControls } from '@/components/controls/ZoomControls'
import { Compass } from '@/components/controls/Compass'
import { Legend } from '@/components/controls/Legend'
import { RegionEditor } from '@/components/editor/RegionEditor'
import { CityEditor } from '@/components/editor/CityEditor'
import { TerrainEditor } from '@/components/editor/TerrainEditor'
import { useMapStore } from '@/stores/mapStore'
import { useUIStore } from '@/stores/uiStore'
import { longestEdgeIndex } from '@/lib/geometry'
import type { EditorMode, City } from '@/types/map'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Eye, MapPin, Mountain, Plus, Save, RotateCcw, Upload,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function EditorPage() {
  const controlsRef = useRef<MapControlsHandle | null>(null)
  const [mounted, setMounted] = useState(false)
  const [resetDialog, setResetDialog] = useState(false)

  const store = useMapStore()
  const ui = useUIStore()

  useEffect(() => { setMounted(true) }, [])

  const {
    regions, cities, tower, terrain, version,
    updateRegion, addRegion, removeRegion,
    updateCity, addCity, removeCity,
    setTower,
    addTerrain, updateTerrain, removeTerrain,
    updateContinent,
    resetMap, exportMap,
  } = store

  const {
    mode, setMode,
    selectedRegion, selectRegion,
    selectedCity, selectCity,
    selectedTerrain, selectTerrain,
    panelOpen, panelContent, openPanel, closePanel,
    legendCollapsed, toggleLegend,
    newCityCoords, setNewCityCoords,
  } = ui

  const region = selectedRegion ? regions.find(r => r.id === selectedRegion) ?? null : null
  const city = selectedCity ? cities.find(c => c.id === selectedCity) ?? null : null
  const terrainFeature = selectedTerrain ? terrain.find(t => t.id === selectedTerrain) ?? null : null

  // Mode buttons
  const modes: { id: EditorMode; label: string; icon: typeof Eye }[] = [
    { id: 'view', label: 'Vista', icon: Eye },
    { id: 'edit', label: 'Modifica', icon: Layers },
    { id: 'addcity', label: '+Città', icon: MapPin },
    { id: 'addterrain', label: '+Terreno', icon: Mountain },
  ]

  const handleModeChange = useCallback((m: EditorMode) => {
    setMode(m)
    if (m === 'addcity') toast.info('Tocca la mappa per piazzare una città')
    if (m === 'addterrain') {
      openPanel('terrain-new')
    }
  }, [setMode, openPanel])

  const handleRegionClick = useCallback((id: string) => {
    if (mode === 'edit') {
      selectRegion(id)
      openPanel('region-edit')
    }
  }, [mode, selectRegion, openPanel])

  const handleCityClick = useCallback((id: string) => {
    selectCity(id)
    openPanel(mode === 'view' ? 'city-info' : 'city-edit')
  }, [selectCity, openPanel, mode])

  const handleTerrainClick = useCallback((id: string) => {
    if (mode === 'edit') {
      selectTerrain(id)
      openPanel('terrain-edit')
    }
  }, [mode, selectTerrain, openPanel])

  const handleMapClick = useCallback((x: number, y: number) => {
    if (mode === 'addcity') {
      setNewCityCoords({ x, y })
      openPanel('city-new')
    }
    if (mode === 'edit' && !panelOpen) {
      selectRegion(null)
      selectTerrain(null)
    }
  }, [mode, panelOpen, setNewCityCoords, openPanel, selectRegion, selectTerrain])

  const handleVertexDrag = useCallback((regionId: string, vertexIndex: number, x: number, y: number) => {
    const r = regions.find(rr => rr.id === regionId)
    if (!r) return
    const newPts = r.pts.map((p, i) => i === vertexIndex ? [x, y] as [number, number] : p)
    updateRegion(regionId, { pts: newPts })
  }, [regions, updateRegion])

  const handleTerrainVertexDrag = useCallback((terrainId: string, vertexIndex: number, x: number, y: number) => {
    const t = terrain.find(tt => tt.id === terrainId)
    if (!t) return
    const newPts = t.points.map((p, i) => i === vertexIndex ? [x, y] as [number, number] : p)
    updateTerrain(terrainId, { points: newPts })
  }, [terrain, updateTerrain])

  const handleEdgeClick = useCallback((targetType: 'region' | 'terrain', targetId: string, edgeIndex: number, x: number, y: number) => {
    if (targetType === 'region') {
      const r = regions.find(rr => rr.id === targetId)
      if (!r) return
      const newPts = [...r.pts]
      newPts.splice(edgeIndex + 1, 0, [x, y] as [number, number])
      updateRegion(targetId, { pts: newPts })
      toast.success('Vertice inserito')
    } else {
      const t = terrain.find(tt => tt.id === targetId)
      if (!t) return
      const newPts = [...t.points]
      newPts.splice(edgeIndex + 1, 0, [x, y] as [number, number])
      updateTerrain(targetId, { points: newPts })
      toast.success('Vertice inserito')
    }
  }, [regions, terrain, updateRegion, updateTerrain])

  const handleCityDrag = useCallback((cityId: string, x: number, y: number) => {
    updateCity(cityId, { x, y })
  }, [updateCity])

  const handleCityDragEnd = useCallback(() => {
    // State already persisted via zustand persist
  }, [])

  const handleDragEnd = useCallback(() => {
    // State already persisted via zustand persist
  }, [])

  const handleAddRegion = useCallback(() => {
    const id = `reg_${Date.now()}`
    addRegion({
      id,
      name: 'Nuova Regione',
      sub: '',
      color: '#c0a060',
      stroke: '#806030',
      op: 0.85,
      pts: [[360,300],[460,280],[510,350],[460,430],[360,430],[310,350]],
    })
    setMode('edit')
    selectRegion(id)
    openPanel('region-edit')
    toast.success('Nuova regione — trascina i vertici')
  }, [addRegion, setMode, selectRegion, openPanel])

  const handleAddVertex = useCallback(() => {
    if (!region) return
    const best = longestEdgeIndex(region.pts)
    const a = region.pts[best]
    const b = region.pts[(best + 1) % region.pts.length]
    const newPts = [...region.pts]
    newPts.splice(best + 1, 0, [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)])
    updateRegion(region.id, { pts: newPts })
    toast.success('Vertice aggiunto')
  }, [region, updateRegion])

  const handleRemoveVertex = useCallback(() => {
    if (!region) return
    if (region.pts.length <= 3) {
      toast.error('Minimo 3 vertici')
      return
    }
    const newPts = region.pts.slice(0, -1)
    updateRegion(region.id, { pts: newPts })
    toast.success('Vertice rimosso')
  }, [region, updateRegion])

  const handleAddTerrainVertex = useCallback(() => {
    if (!terrainFeature) return
    const pts = terrainFeature.points
    const isRiver = terrainFeature.type === 'river'
    if (isRiver) {
      // For rivers, add a point at the end extending the last segment
      const last = pts[pts.length - 1]
      const prev = pts[pts.length - 2] || last
      const dx = last[0] - prev[0]
      const dy = last[1] - prev[1]
      const newPts = [...pts, [Math.round(last[0] + dx * 0.5), Math.round(last[1] + dy * 0.5)] as [number, number]]
      updateTerrain(terrainFeature.id, { points: newPts })
    } else {
      const best = longestEdgeIndex(pts)
      const a = pts[best]
      const b = pts[(best + 1) % pts.length]
      const newPts = [...pts]
      newPts.splice(best + 1, 0, [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)])
      updateTerrain(terrainFeature.id, { points: newPts })
    }
    toast.success('Vertice aggiunto')
  }, [terrainFeature, updateTerrain])

  const handleRemoveTerrainVertex = useCallback(() => {
    if (!terrainFeature) return
    const minPts = terrainFeature.type === 'river' ? 2 : 3
    if (terrainFeature.points.length <= minPts) {
      toast.error(`Minimo ${minPts} vertici`)
      return
    }
    const newPts = terrainFeature.points.slice(0, -1)
    updateTerrain(terrainFeature.id, { points: newPts })
    toast.success('Vertice rimosso')
  }, [terrainFeature, updateTerrain])

  const handleExport = useCallback(() => {
    const data = exportMap()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mappa.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Mappa esportata')
  }, [exportMap])

  const handleReset = useCallback(() => {
    resetMap()
    setResetDialog(false)
    setMode('view')
    toast.success('Mappa reimpostata')
  }, [resetMap, setMode])

  if (!mounted) {
    return <div className="h-screen bg-ink flex items-center justify-center">
      <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
    </div>
  }

  const continent = store.continent ?? { oceanRadius: 418, landRx: 355, landRy: 348 }
  const state = { regions, cities, tower, terrain, continent, version }
  const controlsVisible = !panelOpen

  return (
    <div className="h-screen overflow-hidden">
      <TopBar>
        {/* Mode buttons */}
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleModeChange(id)}
            className={cn(
              'h-8 px-2.5 rounded-md border text-[10px] font-heading tracking-wider whitespace-nowrap flex-shrink-0',
              'flex items-center gap-1.5 transition-all duration-100',
              mode === id
                ? 'bg-accent border-gold text-gold'
                : 'bg-secondary/80 border-border text-foreground hover:border-gold-dim hover:text-gold'
            )}
          >
            <Icon size={13} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}

        <div className="w-px h-6 bg-border flex-shrink-0 mx-0.5" />

        <button
          onClick={handleAddRegion}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0"
        >
          <Plus size={13} />
          <span className="hidden sm:inline">Regione</span>
        </button>

        <div className="w-px h-6 bg-border flex-shrink-0 mx-0.5" />

        <button
          onClick={handleExport}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0"
        >
          <Upload size={13} />
          <span className="hidden sm:inline">Esporta</span>
        </button>

        <button
          onClick={() => setResetDialog(true)}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-destructive/50 text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-destructive hover:text-destructive transition-all flex-shrink-0"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </TopBar>

      <MapViewport
        state={state}
        mode={mode}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        selectedTerrain={selectedTerrain}
        onRegionClick={handleRegionClick}
        onCityClick={handleCityClick}
        onTerrainClick={handleTerrainClick}
        onVertexDrag={handleVertexDrag}
        onTerrainVertexDrag={handleTerrainVertexDrag}
        onCityDrag={handleCityDrag}
        onCityDragEnd={handleCityDragEnd}
        onDragEnd={handleDragEnd}
        onMapClick={handleMapClick}
        onEdgeClick={handleEdgeClick}
        onContinentChange={updateContinent}
        onContinentDragEnd={handleDragEnd}
        controlsRef={controlsRef}
      />

      <ZoomControls controlsRef={controlsRef} visible={controlsVisible} />
      <Compass visible={controlsVisible} />
      <Legend collapsed={legendCollapsed} onToggle={toggleLegend} visible={controlsVisible} />

      {/* Mode badge */}
      <div className="fixed bottom-4 right-3 z-20 bg-ink/94 border border-border rounded-full px-3 py-1.5 font-heading text-[9px] text-muted-foreground tracking-wider pointer-events-none">
        {mode === 'view' && 'VISTA'}
        {mode === 'edit' && 'MODIFICA'}
        {mode === 'addcity' && 'PIAZZA CITTÀ'}
        {mode === 'addterrain' && 'AGGIUNGI TERRENO'}
      </div>

      {/* Region editor */}
      {panelContent === 'region-edit' && region && (
        <RegionEditor
          key={region.id}
          region={region}
          open={panelOpen}
          onClose={closePanel}
          onSave={(data) => updateRegion(region.id, data)}
          onDelete={() => removeRegion(region.id)}
          onAddVertex={handleAddVertex}
          onRemoveVertex={handleRemoveVertex}
        />
      )}

      {/* City editor (edit existing) */}
      {panelContent === 'city-edit' && city && (
        <CityEditor
          key={city.id}
          city={city}
          open={panelOpen}
          onClose={closePanel}
          onSave={(data) => {
            updateCity(city.id, data)
            setMode('view')
          }}
          onDelete={() => {
            removeCity(city.id)
            setMode('view')
          }}
        />
      )}

      {/* City editor (new) */}
      {panelContent === 'city-new' && (
        <CityEditor
          isNew
          coords={newCityCoords}
          open={panelOpen}
          onClose={() => {
            closePanel()
            setMode('view')
          }}
          onSave={(data) => {
            addCity({ ...data, id: data.id ?? `city_${Date.now()}` })
            setMode('view')
          }}
        />
      )}

      {/* City info (view mode) */}
      {panelContent === 'city-info' && city && (
        <CityEditor
          key={city.id}
          city={city}
          open={panelOpen}
          onClose={closePanel}
          onSave={(data) => updateCity(city.id, data)}
          onDelete={() => removeCity(city.id)}
        />
      )}

      {/* Terrain editor (new) */}
      {panelContent === 'terrain-new' && (
        <TerrainEditor
          isNew
          open={panelOpen}
          onClose={() => {
            closePanel()
            setMode('view')
          }}
          onSave={(data) => {
            addTerrain(data)
            setMode('edit')
          }}
        />
      )}

      {/* Terrain editor (edit existing) */}
      {panelContent === 'terrain-edit' && terrainFeature && (
        <TerrainEditor
          key={terrainFeature.id}
          feature={terrainFeature}
          open={panelOpen}
          onClose={closePanel}
          onSave={(data) => {
            updateTerrain(terrainFeature.id, data)
          }}
          onDelete={() => {
            removeTerrain(terrainFeature.id)
            selectTerrain(null)
          }}
          onAddVertex={handleAddTerrainVertex}
          onRemoveVertex={handleRemoveTerrainVertex}
        />
      )}

      {/* Reset dialog */}
      <Dialog open={resetDialog} onOpenChange={setResetDialog}>
        <DialogContent className="bg-ink border-blood-dim max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold text-sm">Reimpostare la mappa?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground/80">
            Tutti i cambiamenti andranno persi e la mappa tornerà ai valori di default.
          </p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setResetDialog(false)} className="flex-1 text-xs">
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleReset} className="flex-1 text-xs">
              Reimposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
