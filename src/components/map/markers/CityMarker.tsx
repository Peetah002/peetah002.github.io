'use client'

import { memo } from 'react'
import type { CityConfig } from '@/types/map'
import { darken } from '@/lib/geometry'

interface CityMarkerProps {
  cfg: CityConfig
  x: number
  y: number
}

function CityMarkerInner({ cfg, x, y }: CityMarkerProps) {
  const { r, fill, inner, tri, sq, star, cross } = cfg
  const dk = darken(fill)

  // Capitale — ornate castle with towers and crown
  if (r >= 10 && inner) {
    return (
      <g transform={`translate(${x},${y})`}>
        <ellipse cx={0} cy={8} rx={11} ry={3} fill="#000" opacity={0.2} />
        <rect x={-5} y={-8} width={10} height={16} rx={1} fill={fill} stroke={dk} strokeWidth={1} />
        <rect x={-10} y={-5} width={5} height={13} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        <rect x={-11} y={-7} width={7} height={3} rx={0.5} fill={inner} stroke={dk} strokeWidth={0.5} />
        <rect x={5} y={-5} width={5} height={13} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        <rect x={4} y={-7} width={7} height={3} rx={0.5} fill={inner} stroke={dk} strokeWidth={0.5} />
        <polygon points="0,-16 3,-8 -3,-8" fill={inner} stroke={dk} strokeWidth={0.5} />
        <circle cx={0} cy={-17} r={2} fill={inner} stroke={dk} strokeWidth={0.5} />
        <path d="M-2,8 L-2,2 A2,2 0 0,1 2,2 L2,8" fill={dk} opacity={0.6} />
        {[-9,-7,4,6].map(bx => (
          <rect key={bx} x={bx} y={-9} width={1.5} height={2} fill={dk} opacity={0.5} />
        ))}
        <rect x={-2} y={-4} width={4} height={3} rx={0.5} fill={inner} opacity={0.8} />
      </g>
    )
  }

  // Fortezza — strong fortress with thick walls and corner towers
  if (sq) {
    const h = r + 1
    return (
      <g transform={`translate(${x},${y})`}>
        <ellipse cx={0} cy={h + 1} rx={h + 2} ry={2} fill="#000" opacity={0.12} />
        <rect x={-h} y={-h} width={h * 2} height={h * 2} rx={1.5} fill={fill} stroke={dk} strokeWidth={1.5} />
        {[[-h,-h],[h,-h],[-h,h],[h,h]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={2.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        ))}
        <rect x={-3} y={-3} width={6} height={6} rx={0.5} fill={inner || dk} stroke={dk} strokeWidth={0.5} />
        {Array.from({length: 4}, (_, i) => -h + 1 + i * (h * 2 - 2) / 3).map((bx, i) => (
          <rect key={i} x={bx} y={-h - 1.5} width={2} height={1.5} fill={dk} opacity={0.5} />
        ))}
      </g>
    )
  }

  // Missione — banner on pole with quest marker
  if (tri) {
    return (
      <g transform={`translate(${x},${y})`}>
        <polygon points="0,-10 5,-5 0,-1" fill="#8B1e1e" stroke="#4a0e0e" strokeWidth={0.7} />
        <line x1={0} y1={-12} x2={0} y2={6} stroke="#5a3020" strokeWidth={1.5} strokeLinecap="round" />
        <line x1={-4} y1={2} x2={4} y2={2} stroke="#5a3020" strokeWidth={1.2} strokeLinecap="round" />
        <circle cx={0} cy={7} r={1.5} fill={inner || fill} />
        {inner && <circle cx={0} cy={-5} r={2} fill={inner} opacity={0.8} />}
      </g>
    )
  }

  // Rovine — crumbling columns and rubble
  if (star) {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-6} y={-4} width={2.5} height={9} fill="#8a7a5a" stroke="#5a4a3a" strokeWidth={0.5} />
        <polygon points="-6,-4 -4.75,-7 -3.5,-4" fill="#9a8a6a" stroke="#5a4a3a" strokeWidth={0.5} />
        <rect x={-1.5} y={-2} width={2.5} height={7} fill="#7a6a4a" stroke="#5a4a3a" strokeWidth={0.5} />
        <polygon points="-1.5,-2 -0.25,-5 1,-2" fill="#8a7a5a" stroke="#5a4a3a" strokeWidth={0.5} />
        <rect x={3} y={-1} width={2.5} height={6} fill="#6a5a3a" stroke="#5a4a3a" strokeWidth={0.5} />
        <circle cx={-3} cy={6} r={1} fill="#7a6a5a" opacity={0.6} />
        <circle cx={1} cy={6.5} r={0.8} fill="#6a5a3a" opacity={0.5} />
        <circle cx={4} cy={5.5} r={1.2} fill="#8a7a5a" opacity={0.4} />
        {inner && <circle cx={0} cy={-1} r={2} fill={inner} opacity={0.6} />}
      </g>
    )
  }

  // Tempio — temple with dome and cross
  if (cross) {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-6} y={1} width={12} height={5} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        <rect x={-5} y={-4} width={1.5} height={5} fill={fill} stroke={dk} strokeWidth={0.5} />
        <rect x={3.5} y={-4} width={1.5} height={5} fill={fill} stroke={dk} strokeWidth={0.5} />
        <path d="M-4,-4 Q0,-12 4,-4" fill={fill} stroke={dk} strokeWidth={0.8} />
        <line x1={0} y1={-14} x2={0} y2={-10} stroke={inner || dk} strokeWidth={1.2} />
        <line x1={-2} y1={-12.5} x2={2} y2={-12.5} stroke={inner || dk} strokeWidth={1.2} />
        <rect x={-7} y={6} width={14} height={1.5} rx={0.3} fill={dk} opacity={0.4} />
        {inner && <circle cx={0} cy={-3} r={1.5} fill={inner} opacity={0.7} />}
      </g>
    )
  }

  // Grande — walled city with two towers
  if (r >= 7) {
    return (
      <g transform={`translate(${x},${y})`}>
        <ellipse cx={0} cy={6} rx={8} ry={2.5} fill="#000" opacity={0.15} />
        <rect x={-7} y={-4} width={14} height={10} rx={1} fill={fill} stroke={dk} strokeWidth={1} />
        <rect x={-8} y={-7} width={4} height={5} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.7} />
        <rect x={4} y={-7} width={4} height={5} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.7} />
        <polygon points="-6,-7 -4,-10 -2,-7" fill={dk} />
        <polygon points="2,-7 4,-10 6,-7" fill={dk} />
        <path d="M-1.5,6 L-1.5,1 A1.5,1.5 0 0,1 1.5,1 L1.5,6" fill={dk} opacity={0.5} />
        {[-6,-3,0,3].map(bx => (
          <rect key={bx} x={bx} y={-5.5} width={1.2} height={1.5} fill={dk} opacity={0.4} />
        ))}
        {inner && <rect x={-1.5} y={-3} width={3} height={2.5} rx={0.3} fill={inner} opacity={0.7} />}
      </g>
    )
  }

  // Porto — sailing ship
  if (r === 6) {
    return (
      <g transform={`translate(${x},${y})`}>
        <path d="M-7,2 Q-5,-3 0,-4 Q5,-3 7,2 Z" fill={fill} stroke={dk} strokeWidth={0.8} />
        <line x1={0} y1={-4} x2={0} y2={-12} stroke="#5a3020" strokeWidth={1.2} />
        <path d="M0,-11 Q4,-8 1,-4" fill="#e8d8c0" stroke={dk} strokeWidth={0.5} opacity={0.8} />
        <path d="M-8,3 Q-4,1 0,3 Q4,5 8,3" fill="none" stroke="#3a7090" strokeWidth={0.8} opacity={0.5} />
        {inner && <circle cx={0} cy={-1} r={1.5} fill={inner} opacity={0.7} />}
      </g>
    )
  }

  // Media — small walled settlement with rooftops
  if (r === 5 && inner) {
    // Accademia — arcane tower with magic orb
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-3} y={-5} width={6} height={11} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        <polygon points="-4,-5 0,-12 4,-5" fill={inner} stroke={dk} strokeWidth={0.5} />
        <circle cx={0} cy={-12} r={2} fill={inner} opacity={0.8} />
        <circle cx={0} cy={-12} r={3.5} fill={inner} opacity={0.15} />
        <circle cx={0} cy={-1} r={1.5} fill={inner} opacity={0.6} />
      </g>
    )
  }

  if (r === 5) {
    // Media — two houses with roofs
    return (
      <g transform={`translate(${x},${y})`}>
        <ellipse cx={0} cy={4} rx={5} ry={1.5} fill="#000" opacity={0.1} />
        <rect x={-4} y={-2} width={4} height={5} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        <polygon points="-4,-2 -2,-5 0,-2" fill={dk} />
        <rect x={0} y={-1} width={4} height={4} rx={0.5} fill={fill} stroke={dk} strokeWidth={0.8} />
        <polygon points="0,-1 2,-4 4,-1" fill={dk} />
        <rect x={-2.5} y={1} width={1.5} height={2} rx={0.3} fill={dk} opacity={0.5} />
      </g>
    )
  }

  // Borgo — small cottage
  if (r <= 4) {
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-2.5} y={-1} width={5} height={4} rx={0.3} fill={fill} stroke={dk} strokeWidth={0.7} />
        <polygon points="-3,-1 0,-4 3,-1" fill={dk} />
        <line x1={1.5} y1={-3} x2={2} y2={-5} stroke="#8a7a5a" strokeWidth={0.5} opacity={0.4} />
      </g>
    )
  }

  // Fallback
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={r + 2} fill="none" stroke={dk} strokeWidth={0.5} opacity={0.3} />
      <circle cx={0} cy={0} r={r} fill={fill} stroke={dk} strokeWidth={1} />
      {inner && <circle cx={0} cy={0} r={Math.max(1.5, r - 3)} fill={inner} />}
    </g>
  )
}

export const CityMarker = memo(CityMarkerInner)
