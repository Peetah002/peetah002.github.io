import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-ink">
      <h1 className="font-display text-4xl text-gold tracking-[4px] mb-4">404</h1>
      <p className="text-sm text-muted-foreground italic mb-8">Questa terra non è stata ancora esplorata...</p>
      <Link
        href="/"
        className="font-heading text-xs text-gold border border-gold-dim rounded-lg px-4 py-2 hover:bg-accent transition-colors tracking-wider"
      >
        Torna alla mappa
      </Link>
    </div>
  )
}
