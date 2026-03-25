'use client'

import { ChevronUp } from 'lucide-react'
import { CITY_CFG, TERRAIN_CFG } from '@/lib/constants'
import { CityMarker } from '@/components/map/markers/CityMarker'
import type { CityType } from '@/types/map'

interface LegendProps {
  collapsed: boolean
  onToggle: () => void
  visible?: boolean
}

export function Legend({ collapsed, onToggle, visible = true }: LegendProps) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-3 left-3 z-20 bg-ink/96 border border-gold-dim rounded-xl text-[11px] max-w-[calc(100vw-80px)] transition-all duration-200 overflow-hidden cursor-pointer select-none safe-l safe-b"
      onClick={onToggle}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 gap-2">
        <h3 className="font-heading text-[9px] text-gold tracking-wider uppercase">Legenda</h3>
        <ChevronUp
          size={14}
          className={`text-gold-dim transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Body */}
      {!collapsed && (
        <div className="px-3 pb-2.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
          {(Object.entries(CITY_CFG) as [CityType, typeof CITY_CFG[CityType]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 leading-relaxed whitespace-nowrap">
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="-13 -13 26 26" width={20} height={20} style={{ overflow: 'visible' }}>
                  <CityMarker cfg={cfg} x={0} y={0} />
                </svg>
              </div>
              <span>{cfg.lbl}</span>
            </div>
          ))}

          {/* Terrain types */}
          <div className="col-span-2 h-px bg-gold-dim/30 my-1" />
          {Object.entries(TERRAIN_CFG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 leading-relaxed whitespace-nowrap">
              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-sm">
                {cfg.icon}
              </div>
              <span>{cfg.lbl}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
