'use client'

import { ptsStr } from '@/lib/geometry'

interface MapDefsProps {
  oceanBorder?: [number, number][]
}

export function MapDefs({ oceanBorder }: MapDefsProps) {
  return (
    <defs>
      <filter id="fx-rough">
        <feTurbulence type="turbulence" baseFrequency="0.018" numOctaves={3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={4} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="fx-glow">
        <feGaussianBlur stdDeviation={4} result="b" />
        <feFlood floodColor="#d4a830" floodOpacity={0.35} result="c" />
        <feComposite in="c" in2="b" operator="in" result="g" />
        <feMerge>
          <feMergeNode in="g" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="fx-shadow">
        <feDropShadow dx={0} dy={1} stdDeviation={2} floodColor="#000" floodOpacity={0.4} />
      </filter>
      <radialGradient id="g-ocean" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#1a3550" />
        <stop offset="70%" stopColor="#0e2035" />
        <stop offset="100%" stopColor="#060d18" />
      </radialGradient>
      <radialGradient id="g-land" cx="52%" cy="48%" r="52%">
        <stop offset="0%" stopColor="#e2cc8e" />
        <stop offset="65%" stopColor="#cdb070" />
        <stop offset="100%" stopColor="#a88a48" />
      </radialGradient>
      <radialGradient id="g-vig" cx="50%" cy="50%" r="50%">
        <stop offset="58%" stopColor="transparent" />
        <stop offset="100%" stopColor="rgba(4,2,1,0.93)" />
      </radialGradient>
      <pattern id="p-waves" x={0} y={0} width={50} height={22} patternUnits="userSpaceOnUse">
        <path d="M0,11 Q12,5 25,11 Q38,17 50,11" fill="none" stroke="#2a5a8a" strokeWidth={0.9} opacity={0.28} />
        <path d="M0,18 Q12,12 25,18 Q38,24 50,18" fill="none" stroke="#2a5a8a" strokeWidth={0.6} opacity={0.18} />
      </pattern>
      <clipPath id="clip-map">
        {oceanBorder ? (
          <polygon points={ptsStr(oceanBorder)} />
        ) : (
          <circle cx={450} cy={450} r={418} />
        )}
      </clipPath>
    </defs>
  )
}
