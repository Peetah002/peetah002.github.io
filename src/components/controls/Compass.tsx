'use client'

interface CompassProps {
  visible?: boolean
}

export function Compass({ visible = true }: CompassProps) {
  if (!visible) return null

  return (
    <div className="fixed top-16 right-3 z-20 opacity-90 pointer-events-none safe-r safe-t">
      <svg width={52} height={52} viewBox="0 0 80 80">
        <circle cx={40} cy={40} r={36} fill="rgba(6,3,1,0.9)" stroke="#8B6914" strokeWidth={1.5} />
        <polygon points="40,8 45,38 40,32 35,38" fill="#b02818" />
        <polygon points="40,72 45,42 40,48 35,42" fill="#a08040" />
        <polygon points="72,40 42,35 48,40 42,45" fill="#a08040" />
        <polygon points="8,40 38,35 32,40 38,45" fill="#a08040" />
        <circle cx={40} cy={40} r={4} fill="#d4a830" stroke="#8B6914" strokeWidth={1} />
        <text x={40} y={22} fontFamily="var(--font-cinzel), Cinzel, serif" fontSize={11} fontWeight={700} fill="#e8d5a0" textAnchor="middle">N</text>
        <text x={40} y={65} fontFamily="var(--font-cinzel), Cinzel, serif" fontSize={9} fill="#a08040" textAnchor="middle">S</text>
        <text x={65} y={44} fontFamily="var(--font-cinzel), Cinzel, serif" fontSize={9} fill="#a08040" textAnchor="middle">E</text>
        <text x={15} y={44} fontFamily="var(--font-cinzel), Cinzel, serif" fontSize={9} fill="#a08040" textAnchor="middle">O</text>
      </svg>
    </div>
  )
}
