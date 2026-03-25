import type { CityConfig, CityType, TerrainType } from '@/types/map'

export const SVG_SIZE = 900

export const MAP_URL = 'https://peetah002.github.io/mappa.json'

export const CITY_CFG: Record<CityType, CityConfig> = {
  capitale:  { r: 10, fill: '#d4a830', inner: '#f0d060', lbl: 'Capitale' },
  grande:    { r: 7,  fill: '#c8a030', inner: '#e8c050', lbl: 'Città Grande' },
  media:     { r: 5,  fill: '#a05820', inner: null,       lbl: 'Città Media' },
  borgo:     { r: 3,  fill: '#885018', inner: null,       lbl: 'Borgo/Villaggio' },
  missione:  { r: 5,  fill: '#8B1e1e', inner: '#e84040', lbl: 'Luogo di Missione', tri: true },
  rovine:    { r: 6,  fill: '#6a5a3a', inner: '#c0a860', lbl: 'Rovine', star: true },
  fortezza:  { r: 7,  fill: '#8a7060', inner: '#d4b890', lbl: 'Fortezza', sq: true },
  porto:     { r: 6,  fill: '#3a7090', inner: '#80c0d8', lbl: 'Porto' },
  accademia: { r: 5,  fill: '#6060a8', inner: '#b0b0e8', lbl: 'Accademia/Torre Arcana' },
  tempio:    { r: 5,  fill: '#a06828', inner: '#e8c060', lbl: 'Tempio/Luogo Sacro', cross: true },
  avamposto: { r: 4,  fill: '#7a4020', inner: null,       lbl: 'Avamposto DOOM-E', tri: true },
  segreto:   { r: 4,  fill: '#501040', inner: '#c040a0', lbl: 'Luogo Segreto', sq: true },
}

export const TERRAIN_CFG: Record<TerrainType, { lbl: string; color: string; icon: string }> = {
  forest:   { lbl: 'Foresta',   color: '#2a5a28', icon: '🌲' },
  mountain: { lbl: 'Montagne',  color: '#8a7a6a', icon: '⛰️' },
  river:    { lbl: 'Fiume',     color: '#3a7090', icon: '🌊' },
  desert:   { lbl: 'Deserto',   color: '#c8a050', icon: '🏜️' },
  swamp:    { lbl: 'Palude',    color: '#4a6a3a', icon: '🌿' },
  lake:     { lbl: 'Lago',      color: '#1a4a60', icon: '💧' },
  hills:    { lbl: 'Colline',   color: '#8a9a5a', icon: '🏔️' },
}

export const REGIONS_LIST = ['Aldheris', 'Kar Dromak', 'Thanelorn', 'Reth Maar', 'Xhorr-Khal']
