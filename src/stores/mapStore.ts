'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MapState, Region, City, Tower, TerrainFeature } from '@/types/map'
import { DEF_REGIONS, DEF_CITIES, DEF_TOWER, DEF_TERRAIN } from '@/lib/mapData'

interface MapStore extends MapState {
  // Actions
  setRegions: (regions: Region[]) => void
  updateRegion: (id: string, data: Partial<Region>) => void
  addRegion: (region: Region) => void
  removeRegion: (id: string) => void

  setCities: (cities: City[]) => void
  updateCity: (id: string, data: Partial<City>) => void
  addCity: (city: City) => void
  removeCity: (id: string) => void

  setTower: (tower: Tower) => void

  setTerrain: (terrain: TerrainFeature[]) => void
  addTerrain: (feature: TerrainFeature) => void
  updateTerrain: (id: string, data: Partial<TerrainFeature>) => void
  removeTerrain: (id: string) => void

  importMap: (data: Partial<MapState>) => void
  resetMap: () => void
  exportMap: () => MapState
  exportPlayerMap: () => Omit<MapState, 'version'> & { version: number }
}

const defaultState: MapState = {
  regions: DEF_REGIONS.map(r => ({ ...r, pts: r.pts.map(p => [...p] as [number, number]) })),
  cities: DEF_CITIES.map(c => ({ ...c })),
  tower: { ...DEF_TOWER },
  terrain: [...DEF_TERRAIN],
  version: 1,
}

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setRegions: (regions) => set({ regions }),
      updateRegion: (id, data) => set(s => ({
        regions: s.regions.map(r => r.id === id ? { ...r, ...data } : r),
      })),
      addRegion: (region) => set(s => ({ regions: [...s.regions, region] })),
      removeRegion: (id) => set(s => ({ regions: s.regions.filter(r => r.id !== id) })),

      setCities: (cities) => set({ cities }),
      updateCity: (id, data) => set(s => ({
        cities: s.cities.map(c => c.id === id ? { ...c, ...data } : c),
      })),
      addCity: (city) => set(s => ({ cities: [...s.cities, city] })),
      removeCity: (id) => set(s => ({ cities: s.cities.filter(c => c.id !== id) })),

      setTower: (tower) => set({ tower }),

      setTerrain: (terrain) => set({ terrain }),
      addTerrain: (feature) => set(s => ({ terrain: [...s.terrain, feature] })),
      updateTerrain: (id, data) => set(s => ({
        terrain: s.terrain.map(t => t.id === id ? { ...t, ...data } : t),
      })),
      removeTerrain: (id) => set(s => ({ terrain: s.terrain.filter(t => t.id !== id) })),

      importMap: (data) => {
        set({
          regions: data.regions ?? get().regions,
          cities: data.cities ?? get().cities,
          tower: data.tower ?? get().tower,
          terrain: data.terrain ?? get().terrain,
          version: data.version ?? get().version,
        })
      },

      resetMap: () => set({
        regions: DEF_REGIONS.map(r => ({ ...r, pts: r.pts.map(p => [...p] as [number, number]) })),
        cities: DEF_CITIES.map(c => ({ ...c })),
        tower: { ...DEF_TOWER },
        terrain: [...DEF_TERRAIN],
      }),

      exportMap: () => {
        const { regions, cities, tower, terrain, version } = get()
        return { regions, cities, tower, terrain, version }
      },

      exportPlayerMap: () => {
        const { regions, cities, tower, terrain, version } = get()
        // Strip DM-only notes from cities
        const playerCities = cities.map(({ notes, ...rest }) => rest) as City[]
        return { regions, cities: playerCities, tower, terrain, version }
      },
    }),
    {
      name: 'eradriel_v4',
    }
  )
)
