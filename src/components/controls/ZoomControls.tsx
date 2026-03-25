'use client'

import { Plus, Minus, Home } from 'lucide-react'
import type { MapControlsHandle } from '@/components/map/MapViewport'

interface ZoomControlsProps {
  controlsRef: React.RefObject<MapControlsHandle | null>
  visible?: boolean
}

export function ZoomControls({ controlsRef, visible = true }: ZoomControlsProps) {
  if (!visible) return null

  const btnClass = `
    w-11 h-11 rounded-xl
    bg-ink/95 border border-gold-dim
    text-gold flex items-center justify-center
    active:bg-accent active:border-gold
    transition-colors duration-100
  `

  return (
    <div className="fixed right-3 bottom-24 z-20 flex flex-col gap-1.5 safe-r safe-b">
      <button
        className={btnClass}
        onClick={() => controlsRef.current?.zoomIn()}
        aria-label="Zoom in"
      >
        <Plus size={20} />
      </button>
      <button
        className={btnClass}
        onClick={() => controlsRef.current?.zoomOut()}
        aria-label="Zoom out"
      >
        <Minus size={20} />
      </button>
      <button
        className={btnClass}
        onClick={() => controlsRef.current?.resetTransform()}
        aria-label="Reset view"
      >
        <Home size={17} />
      </button>
    </div>
  )
}
