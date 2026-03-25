'use client'

import { memo } from 'react'
import type { Tower } from '@/types/map'
import { TowerMarker } from './markers/TowerMarker'

interface TowerLayerProps {
  tower: Tower
  editable?: boolean
}

function TowerLayerInner({ tower, editable }: TowerLayerProps) {
  return (
    <g id="L-tower">
      <TowerMarker x={tower.x} y={tower.y} editable={editable} />
    </g>
  )
}

export const TowerLayer = memo(TowerLayerInner)
