'use client'

import { create } from 'zustand'
import type { EditorMode } from '@/types/map'

// selectedContinent: 'ocean' for ocean border, landmass ID for a land mass, null for none
interface UIStore {
  mode: EditorMode
  selectedRegion: string | null
  selectedCity: string | null
  selectedTerrain: string | null
  selectedContinent: string | null
  panelOpen: boolean
  panelContent: 'region-edit' | 'city-edit' | 'city-new' | 'city-info' | 'terrain-new' | 'terrain-edit' | 'landmass-edit' | null
  legendCollapsed: boolean
  newCityCoords: { x: number; y: number } | null

  setMode: (mode: EditorMode) => void
  selectRegion: (id: string | null) => void
  selectCity: (id: string | null) => void
  selectTerrain: (id: string | null) => void
  selectContinent: (id: string | null) => void
  openPanel: (content: UIStore['panelContent']) => void
  closePanel: () => void
  toggleLegend: () => void
  setNewCityCoords: (coords: { x: number; y: number } | null) => void
  reset: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  mode: 'view',
  selectedRegion: null,
  selectedCity: null,
  selectedTerrain: null,
  selectedContinent: null,
  panelOpen: false,
  panelContent: null,
  legendCollapsed: false,
  newCityCoords: null,

  setMode: (mode) => set({
    mode,
    selectedRegion: null,
    selectedCity: null,
    selectedTerrain: null,
    selectedContinent: null,
    panelOpen: false,
    panelContent: null,
  }),

  selectRegion: (id) => set({ selectedRegion: id, selectedCity: null, selectedTerrain: null, selectedContinent: null }),
  selectCity: (id) => set({ selectedCity: id, selectedRegion: null, selectedTerrain: null, selectedContinent: null }),
  selectTerrain: (id) => set({ selectedTerrain: id, selectedRegion: null, selectedCity: null, selectedContinent: null }),
  selectContinent: (id) => set({ selectedContinent: id, selectedRegion: null, selectedCity: null, selectedTerrain: null }),

  openPanel: (content) => set({ panelOpen: true, panelContent: content }),
  closePanel: () => set({ panelOpen: false, panelContent: null, newCityCoords: null }),

  toggleLegend: () => set(s => ({ legendCollapsed: !s.legendCollapsed })),

  setNewCityCoords: (coords) => set({ newCityCoords: coords }),

  reset: () => set({
    mode: 'view',
    selectedRegion: null,
    selectedCity: null,
    selectedTerrain: null,
    selectedContinent: null,
    panelOpen: false,
    panelContent: null,
  }),
}))
