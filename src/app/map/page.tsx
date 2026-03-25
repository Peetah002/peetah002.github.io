'use client'

import { useRef, useCallback, useState, useEffect } from 'react'
import { MapViewport, type MapControlsHandle } from '@/components/map/MapViewport'
import { TopBar } from '@/components/layout/TopBar'
import { ZoomControls } from '@/components/controls/ZoomControls'
import { Compass } from '@/components/controls/Compass'
import { Legend } from '@/components/controls/Legend'
import { CityInfoPanel } from '@/components/shared/CityInfoPanel'
import { useMapStore } from '@/stores/mapStore'
import { useUIStore } from '@/stores/uiStore'
import { MAP_URL } from '@/lib/constants'
import { DEF_CONTINENT } from '@/lib/mapData'
import { RefreshCw, Download } from 'lucide-react'
import { toast } from 'sonner'

export default function PlayerMapPage() {
  const controlsRef = useRef<MapControlsHandle | null>(null)
  const [mounted, setMounted] = useState(false)

  const { regions, cities, tower, terrain, continent, version, importMap } = useMapStore()
  const { selectedCity, selectCity, legendCollapsed, toggleLegend } = useUIStore()

  useEffect(() => { setMounted(true) }, [])

  const city = selectedCity ? cities.find(c => c.id === selectedCity) ?? null : null
  const panelOpen = !!city

  const handleCityClick = useCallback((id: string) => {
    selectCity(id)
  }, [selectCity])

  const handleSync = useCallback(async () => {
    toast.info('Caricamento...')
    try {
      const res = await fetch(`${MAP_URL}?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (!data.regions || !data.cities) throw new Error('Formato non valido')
      importMap(data)
      toast.success('Mappa aggiornata')
    } catch {
      toast.error('Errore connessione — prova a importare manualmente')
    }
  }, [importMap])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string)
          if (!data.regions || !data.cities) throw new Error('Formato non valido')
          importMap(data)
          toast.success('Mappa importata')
        } catch {
          toast.error('File non valido')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [importMap])

  if (!mounted) {
    return <div className="h-screen bg-ink flex items-center justify-center">
      <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
    </div>
  }

  const c = continent ?? DEF_CONTINENT
  const state = { regions, cities, tower, terrain, continent: c, version }

  return (
    <div className="h-screen overflow-hidden">
      <TopBar>
        <span className="text-xs italic text-muted-foreground whitespace-nowrap flex-shrink-0">
          Mappa di Eradriel
        </span>
        <div className="w-px h-6 bg-border flex-shrink-0 mx-0.5" />
        <button onClick={handleSync}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0">
          <RefreshCw size={13} /><span className="hidden sm:inline">Aggiorna</span>
        </button>
        <button onClick={handleImport}
          className="h-8 px-2.5 rounded-md border bg-secondary/80 border-border text-foreground text-[10px] font-heading tracking-wider whitespace-nowrap flex items-center gap-1.5 hover:border-gold-dim hover:text-gold transition-all flex-shrink-0">
          <Download size={13} /><span className="hidden sm:inline">Importa</span>
        </button>
      </TopBar>

      <MapViewport
        state={state}
        mode="view"
        selectedRegion={null}
        selectedCity={selectedCity}
        selectedTerrain={null}
        selectedContinent={null}
        onCityClick={handleCityClick}
        controlsRef={controlsRef}
      />

      <ZoomControls controlsRef={controlsRef} visible={!panelOpen} />
      <Compass visible={!panelOpen} />
      <Legend collapsed={legendCollapsed} onToggle={toggleLegend} visible={!panelOpen} />

      <CityInfoPanel city={city} open={panelOpen} onClose={() => selectCity(null)} />
    </div>
  )
}
