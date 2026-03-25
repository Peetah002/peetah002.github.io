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
import { LandMassEditor } from '@/components/editor/LandMassEditor'
import { useMapStore } from '@/stores/mapStore'
import { useUIStore } from '@/stores/uiStore'
import { longestEdgeIndex, ellipsePolygon, scalePolygonToRadius } from '@/lib/geometry'
import type { EditorMode } from '@/types/map'
import { DEF_CONTINENT } from '@/lib/mapData'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Eye, MapPin, Mountain, Plus, RotateCcw, Upload,
  Layers, Globe,
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
    regions, cities, tower, terrain, continent, version,
    updateRegion, addRegion, removeRegion,
    updateCity, addCity, removeCity,
    addTerrain, updateTerrain, removeTerrain,
    updateOceanBorder, updateOceanLabel, addLandMass, updateLandMass, removeLandMass,
    resetMap, exportMap,
  } = store

  const {
    mode, setMode,
    selectedRegion, selectRegion,
    selectedCity, selectCity,
    selectedTerrain, selectTerrain,
    selectedContinent, selectContinent,
    panelOpen, panelContent, openPanel, closePanel,
    legendCollapsed, toggleLegend,
    newCityCoords, setNewCityCoords,
  } = ui

  const region = selectedRegion ? regions.find(r => r.id === selectedRegion) ?? null : null
  const city = selectedCity ? cities.find(c => c.id === selectedCity) ?? null : null
  const terrainFeature = selectedTerrain ? terrain.find(t => t.id === selectedTerrain) ?? null : null
  const selectedLandMass = selectedContinent && selectedContinent !== 'ocean'
    ? continent.landMasses.find(lm => lm.id === selectedContinent) ?? null
    : null

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
    if (m === 'addterrain') openPanel('terrain-new')
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

  const handleContinentClick = useCallback((id: string) => {
    if (mode === 'edit') {
      selectContinent(id)
      openPanel('landmass-edit')
    }
  }, [mode, selectContinent, openPanel])

  const handleMapClick = useCallback((x: number, y: number) => {
    if (mode === 'addcity') {
      setNewCityCoords({ x, y })
      openPanel('city-new')
    }
    if (mode === 'edit' && !panelOpen) {
      selectRegion(null)
      selectTerrain(null)
      selectContinent(null)
    }
  }, [mode, panelOpen, setNewCityCoords, openPanel, selectRegion, selectTerrain, selectContinent])

  // --- Vertex drag handlers ---
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

  const handleContinentVertexDrag = useCallback((targetId: string, vertexIndex: number, x: number, y: number) => {
    if (targetId === 'ocean') {
      const newPts = continent.oceanBorder.map((p, i) => i === vertexIndex ? [x, y] as [number, number] : p)
      updateOceanBorder(newPts)
    } else {
      const lm = continent.landMasses.find(l => l.id === targetId)
      if (!lm) return
      const newPts = lm.pts.map((p, i) => i === vertexIndex ? [x, y] as [number, number] : p)
      updateLandMass(targetId, { pts: newPts })
    }
  }, [continent, updateOceanBorder, updateLandMass])

  // --- Edge click (insert vertex) ---
  const handleEdgeClick = useCallback((targetType: 'region' | 'terrain' | 'continent', targetId: string, edgeIndex: number, x: number, y: number) => {
    if (targetType === 'region') {
      const r = regions.find(rr => rr.id === targetId)
      if (!r) return
      const newPts = [...r.pts]
      newPts.splice(edgeIndex + 1, 0, [x, y])
      updateRegion(targetId, { pts: newPts })
    } else if (targetType === 'terrain') {
      const t = terrain.find(tt => tt.id === targetId)
      if (!t) return
      const newPts = [...t.points]
      newPts.splice(edgeIndex + 1, 0, [x, y])
      updateTerrain(targetId, { points: newPts })
    } else if (targetType === 'continent') {
      if (targetId === 'ocean') {
        const newPts = [...continent.oceanBorder]
        newPts.splice(edgeIndex + 1, 0, [x, y])
        updateOceanBorder(newPts)
      } else {
        const lm = continent.landMasses.find(l => l.id === targetId)
        if (!lm) return
        const newPts = [...lm.pts]
        newPts.splice(edgeIndex + 1, 0, [x, y])
        updateLandMass(targetId, { pts: newPts })
      }
    }
    toast.success('Vertice inserito')
  }, [regions, terrain, continent, updateRegion, updateTerrain, updateOceanBorder, updateLandMass])

  // --- City drag ---
  const handleCityDrag = useCallback((cityId: string, x: number, y: number) => {
    updateCity(cityId, { x, y })
  }, [updateCity])

  const handleDragEnd = useCallback(() => {}, [])

  // --- Region vertex buttons ---
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
    if (!region || region.pts.length <= 3) {
      toast.error('Minimo 3 vertici')
      return
    }
    updateRegion(region.id, { pts: region.pts.slice(0, -1) })
    toast.success('Vertice rimosso')
  }, [region, updateRegion])

  // --- Terrain vertex buttons ---
  const handleAddTerrainVertex = useCallback(() => {
    if (!terrainFeature) return
    const pts = terrainFeature.points
    if (terrainFeature.type === 'river') {
      const last = pts[pts.length - 1]
      const prev = pts[pts.length - 2] || last
      const newPts = [...pts, [Math.round(last[0] + (last[0] - prev[0]) * 0.5), Math.round(last[1] + (last[1] - prev[1]) * 0.5)] as [number, number]]
      updateTerrain(terrainFeature.id, { points: newPts })
    } else {
      const best = longestEdgeIndex(pts)
      const a = pts[best], b = pts[(best + 1) % pts.length]
      const newPts = [...pts]
      newPts.splice(best + 1, 0, [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)])
      updateTerrain(terrainFeature.id, { points: newPts })
    }
    toast.success('Vertice aggiunto')
  }, [terrainFeature, updateTerrain])

  const handleRemoveTerrainVertex = useCallback(() => {
    if (!terrainFeature) return
    const min = terrainFeature.type === 'river' ? 2 : 3
    if (terrainFeature.points.length <= min) { toast.error(`Minimo ${min} vertici`); return }
    updateTerrain(terrainFeature.id, { points: terrainFeature.points.slice(0, -1) })
    toast.success('Vertice rimosso')
  }, [terrainFeature, updateTerrain])

  // --- Continent vertex buttons ---
  const handleAddContinentVertex = useCallback(() => {
    const pts = selectedContinent === 'ocean' ? continent.oceanBorder : selectedLandMass?.pts
    if (!pts) return
    const best = longestEdgeIndex(pts)
    const a = pts[best], b = pts[(best + 1) % pts.length]
    const newPts = [...pts]
    newPts.splice(best + 1, 0, [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)])
    if (selectedContinent === 'ocean') updateOceanBorder(newPts)
    else if (selectedLandMass) updateLandMass(selectedLandMass.id, { pts: newPts })
    toast.success('Vertice aggiunto')
  }, [selectedContinent, selectedLandMass, continent.oceanBorder, updateOceanBorder, updateLandMass])

  const handleRemoveContinentVertex = useCallback(() => {
    const pts = selectedContinent === 'ocean' ? continent.oceanBorder : selectedLandMass?.pts
    if (!pts || pts.length <= 3) { toast.error('Minimo 3 vertici'); return }
    const newPts = pts.slice(0, -1)
    if (selectedContinent === 'ocean') updateOceanBorder(newPts)
    else if (selectedLandMass) updateLandMass(selectedLandMass.id, { pts: newPts })
    toast.success('Vertice rimosso')
  }, [selectedContinent, selectedLandMass, continent.oceanBorder, updateOceanBorder, updateLandMass])

  // --- Continent uniform resize ---
  const handleContinentResize = useCallback((targetRadius: number) => {
    if (selectedContinent === 'ocean') {
      const newPts = scalePolygonToRadius(continent.oceanBorder, targetRadius)
      updateOceanBorder(newPts)
    } else if (selectedLandMass) {
      const newPts = scalePolygonToRadius(selectedLandMass.pts, targetRadius)
      updateLandMass(selectedLandMass.id, { pts: newPts })
    }
  }, [selectedContinent, selectedLandMass, continent.oceanBorder, updateOceanBorder, updateLandMass])

  // --- Add region / land mass ---
  const handleAddRegion = useCallback(() => {
    const id = `reg_${Date.now()}`
    addRegion({
      id, name: 'Nuova Regione', sub: '', color: '#c0a060', stroke: '#806030', op: 0.85,
      pts: [[360,300],[460,280],[510,350],[460,430],[360,430],[310,350]],
    })
    setMode('edit')
    selectRegion(id)
    openPanel('region-edit')
    toast.success('Nuova regione — trascina i vertici')
  }, [addRegion, setMode, selectRegion, openPanel])

  const handleAddLandMass = useCallback(() => {
    const id = `land_${Date.now()}`
    addLandMass({
      id,
      name: 'Nuova Isola',
      pts: ellipsePolygon(200, 200, 60, 45, 12),
    })
    setMode('edit')
    selectContinent(id)
    openPanel('landmass-edit')
    toast.success('Nuova land mass — trascina i vertici')
  }, [addLandMass, setMode, selectContinent, openPanel])

  // --- Export / Reset ---
  const handleExport = useCallback(() => {
    const data = exportMap()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'mappa.json'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Mappa esportata')
  }, [exportMap])

  const handleReset = useCallback(() => {
    resetMap(); setResetDialog(false); setMode('view')
    toast.success('Mappa reimpostata')
  }, [resetMap, setMode])

  if (!mounted) {
    return <div className="h-screen bg-ink flex items-center justify-center">
      <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
    </div>
  }

  const state = { regions, cities, tower, terrain, continent, version }
  const controlsVisible = !panelOpen

  return (
    <div className="h-screen overflow-hidden">
      <TopBar>
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

        <button onClick={handleAddRegion}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0">
          <Plus size={13} /><span className="hidden sm:inline">Regione</span>
        </button>

        <button onClick={handleAddLandMass}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0">
          <Globe size={13} /><span className="hidden sm:inline">Isola</span>
        </button>

        <div className="w-px h-6 bg-border flex-shrink-0 mx-0.5" />

        <button onClick={handleExport}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0">
          <Upload size={13} /><span className="hidden sm:inline">Esporta</span>
        </button>

        <button onClick={() => setResetDialog(true)}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-destructive/50 text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-destructive hover:text-destructive transition-all flex-shrink-0">
          <RotateCcw size={13} /><span className="hidden sm:inline">Reset</span>
        </button>
      </TopBar>

      <MapViewport
        state={state}
        mode={mode}
        selectedRegion={selectedRegion}
        selectedCity={selectedCity}
        selectedTerrain={selectedTerrain}
        selectedContinent={selectedContinent}
        onRegionClick={handleRegionClick}
        onCityClick={handleCityClick}
        onTerrainClick={handleTerrainClick}
        onContinentClick={handleContinentClick}
        onVertexDrag={handleVertexDrag}
        onTerrainVertexDrag={handleTerrainVertexDrag}
        onContinentVertexDrag={handleContinentVertexDrag}
        onCityDrag={handleCityDrag}
        onCityDragEnd={handleDragEnd}
        onDragEnd={handleDragEnd}
        onMapClick={handleMapClick}
        onEdgeClick={handleEdgeClick}
        controlsRef={controlsRef}
      />

      <ZoomControls controlsRef={controlsRef} visible={controlsVisible} />
      <Compass visible={controlsVisible} />
      <Legend collapsed={legendCollapsed} onToggle={toggleLegend} visible={controlsVisible} />

      <div className="fixed bottom-4 right-3 z-20 bg-ink/94 border border-border rounded-full px-3 py-1.5 font-heading text-[9px] text-muted-foreground tracking-wider pointer-events-none">
        {mode === 'view' && 'VISTA'}
        {mode === 'edit' && 'MODIFICA'}
        {mode === 'addcity' && 'PIAZZA CITTÀ'}
        {mode === 'addterrain' && 'AGGIUNGI TERRENO'}
      </div>

      {/* Region editor */}
      {panelContent === 'region-edit' && region && (
        <RegionEditor key={region.id} region={region} open={panelOpen} onClose={closePanel}
          onSave={(data) => updateRegion(region.id, data)}
          onDelete={() => removeRegion(region.id)}
          onAddVertex={handleAddVertex} onRemoveVertex={handleRemoveVertex} />
      )}

      {/* City editor (edit existing) */}
      {panelContent === 'city-edit' && city && (
        <CityEditor key={city.id} city={city} open={panelOpen} onClose={closePanel}
          onSave={(data) => { updateCity(city.id, data); setMode('view') }}
          onDelete={() => { removeCity(city.id); setMode('view') }} />
      )}

      {/* City editor (new) */}
      {panelContent === 'city-new' && (
        <CityEditor isNew coords={newCityCoords} open={panelOpen}
          onClose={() => { closePanel(); setMode('view') }}
          onSave={(data) => { addCity({ ...data, id: data.id ?? `city_${Date.now()}` }); setMode('view') }} />
      )}

      {/* City info (view mode) */}
      {panelContent === 'city-info' && city && (
        <CityEditor key={city.id} city={city} open={panelOpen} onClose={closePanel}
          onSave={(data) => updateCity(city.id, data)}
          onDelete={() => removeCity(city.id)} />
      )}

      {/* Terrain editor (new) */}
      {panelContent === 'terrain-new' && (
        <TerrainEditor isNew open={panelOpen}
          onClose={() => { closePanel(); setMode('view') }}
          onSave={(data) => { addTerrain(data); setMode('edit') }} />
      )}

      {/* Terrain editor (edit existing) */}
      {panelContent === 'terrain-edit' && terrainFeature && (
        <TerrainEditor key={terrainFeature.id} feature={terrainFeature} open={panelOpen} onClose={closePanel}
          onSave={(data) => updateTerrain(terrainFeature.id, data)}
          onDelete={() => { removeTerrain(terrainFeature.id); selectTerrain(null) }}
          onAddVertex={handleAddTerrainVertex} onRemoveVertex={handleRemoveTerrainVertex} />
      )}

      {/* Land mass / ocean border editor */}
      {panelContent === 'landmass-edit' && selectedContinent && (
        <LandMassEditor
          key={selectedContinent}
          isOcean={selectedContinent === 'ocean'}
          name={selectedContinent === 'ocean' ? 'Bordo Oceano' : selectedLandMass?.name ?? ''}
          label={selectedContinent === 'ocean' ? (continent.oceanLabel ?? '') : (selectedLandMass?.label ?? '')}
          pts={selectedContinent === 'ocean' ? continent.oceanBorder : selectedLandMass?.pts ?? []}
          vertexCount={selectedContinent === 'ocean' ? continent.oceanBorder.length : selectedLandMass?.pts.length ?? 0}
          open={panelOpen}
          onClose={closePanel}
          onSaveName={selectedContinent !== 'ocean' && selectedLandMass ? (name) => updateLandMass(selectedLandMass.id, { name }) : undefined}
          onSaveLabel={selectedContinent === 'ocean'
            ? (lbl) => updateOceanLabel(lbl)
            : selectedLandMass ? (lbl) => updateLandMass(selectedLandMass.id, { label: lbl || undefined }) : () => {}
          }
          onDelete={selectedContinent !== 'ocean' && selectedLandMass ? () => { removeLandMass(selectedLandMass.id); selectContinent(null) } : undefined}
          onAddVertex={handleAddContinentVertex}
          onRemoveVertex={handleRemoveContinentVertex}
          onResize={handleContinentResize}
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
            <Button variant="outline" onClick={() => setResetDialog(false)} className="flex-1 text-xs">Annulla</Button>
            <Button variant="destructive" onClick={handleReset} className="flex-1 text-xs">Reimposta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
