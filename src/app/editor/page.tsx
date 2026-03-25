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
    resetMap, exportMap,
  } = store

  const {
    mode, setMode,
    selectedRegion, selectRegion,
    selectedCity, selectCity,
    panelOpen, panelContent, openPanel, closePanel,
    legendCollapsed, toggleLegend,
    newCityCoords, setNewCityCoords,
  } = ui

  const region = selectedRegion ? regions.find(r => r.id === selectedRegion) ?? null : null
  const city = selectedCity ? cities.find(c => c.id === selectedCity) ?? null : null

  // Mode buttons
  const modes: { id: EditorMode; label: string; icon: typeof Eye }[] = [
    { id: 'view', label: 'Vista', icon: Eye },
    { id: 'edit', label: 'Regioni', icon: Layers },
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

  const handleMapClick = useCallback((x: number, y: number) => {
    if (mode === 'addcity') {
      setNewCityCoords({ x, y })
      openPanel('city-new')
    }
    if (mode === 'edit' && !panelOpen) {
      selectRegion(null)
    }
  }, [mode, panelOpen, setNewCityCoords, openPanel, selectRegion])

  const handleVertexDrag = useCallback((regionId: string, vertexIndex: number, x: number, y: number) => {
    const r = regions.find(rr => rr.id === regionId)
    if (!r) return
    const newPts = r.pts.map((p, i) => i === vertexIndex ? [x, y] as [number, number] : p)
    updateRegion(regionId, { pts: newPts })
  }, [regions, updateRegion])

  const handleDragEnd = useCallback(() => {
    // State already persisted via zustand persist
  }, [])

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

  const state = { regions, cities, tower, terrain, version }
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
        onRegionClick={handleRegionClick}
        onCityClick={handleCityClick}
        onVertexDrag={handleVertexDrag}
        onDragEnd={handleDragEnd}
        onMapClick={handleMapClick}
        controlsRef={controlsRef}
      />

      <ZoomControls controlsRef={controlsRef} visible={controlsVisible} />
      <Compass visible={controlsVisible} />
      <Legend collapsed={legendCollapsed} onToggle={toggleLegend} visible={controlsVisible} />

      {/* Mode badge */}
      <div className="fixed bottom-4 right-3 z-20 bg-ink/94 border border-border rounded-full px-3 py-1.5 font-heading text-[9px] text-muted-foreground tracking-wider pointer-events-none">
        {mode === 'view' && 'VISTA'}
        {mode === 'edit' && 'MODIFICA REGIONI'}
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
