export type CityType =
  | 'capitale'
  | 'grande'
  | 'media'
  | 'borgo'
  | 'missione'
  | 'rovine'
  | 'fortezza'
  | 'porto'
  | 'accademia'
  | 'tempio'
  | 'avamposto'
  | 'segreto'

export type TerrainType =
  | 'forest'
  | 'mountain'
  | 'river'
  | 'desert'
  | 'swamp'
  | 'lake'
  | 'hills'

export interface Region {
  id: string
  name: string
  sub: string
  description?: string
  color: string
  stroke: string
  op: number
  pts: [number, number][]
}

export interface City {
  id: string
  name: string
  pop: string
  region: string
  type: CityType
  x: number
  y: number
  description?: string
  notes?: string
}

export interface TerrainFeature {
  id: string
  type: TerrainType
  points: [number, number][]
  label?: string
  opacity?: number
}

export interface Tower {
  x: number
  y: number
}

export interface CityConfig {
  r: number
  fill: string
  inner: string | null
  lbl: string
  tri?: boolean
  sq?: boolean
  star?: boolean
  cross?: boolean
}

export interface ContinentShape {
  oceanRadius: number      // outer circle radius (default 418)
  landRx: number           // ellipse rx (default 355)
  landRy: number           // ellipse ry (default 348)
}

export interface MapState {
  regions: Region[]
  cities: City[]
  tower: Tower
  terrain: TerrainFeature[]
  continent: ContinentShape
  version: number
}

export type EditorMode = 'view' | 'edit' | 'addcity' | 'addterrain'
