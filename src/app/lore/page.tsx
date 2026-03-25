'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { BookOpen, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const articles = [
  { slug: 'aldheris', title: 'Aldheris', category: 'location', excerpt: 'L\'Impero Teocratico di Aldheris, governato dalla luce divina di Solmeris.' },
  { slug: 'kar-dromak', title: 'Kar Dromak', category: 'location', excerpt: 'Il Regno dei Nani, scolpito nelle montagne da millenni di lavoro.' },
  { slug: 'thanelorn', title: 'Thanelorn', category: 'location', excerpt: 'Il Regno Elfico, custode delle foreste antiche.' },
  { slug: 'reth-maar', title: 'Reth Maar', category: 'location', excerpt: 'La Convergenza delle Razze, dove ogni popolo trova il suo posto.' },
  { slug: 'xhorr-khal', title: 'Xhorr-Khal', category: 'location', excerpt: 'La Confederazione Orchesca, unita dalla forza e dall\'onore.' },
  { slug: 'doom-e', title: 'DOOM-E', category: 'faction', excerpt: 'L\'organizzazione che opera dalla Torre di Nartharion.' },
]

const categoryColors: Record<string, string> = {
  location: 'text-gold',
  faction: 'text-destructive',
  npc: 'text-parchment',
  event: 'text-ocean-light',
}

function LoreContent() {
  const searchParams = useSearchParams()
  const slug = searchParams?.get('article')

  if (slug) {
    const article = articles.find(a => a.slug === slug)
    return (
      <div className="min-h-screen bg-ink">
        <TopBar />
        <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
          <Link href="/lore" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors mb-6">
            <ArrowLeft size={14} />
            Torna al Lore
          </Link>
          <h1 className="font-heading text-2xl text-gold tracking-wider mb-4">
            {article?.title ?? slug.replace(/-/g, ' ')}
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold-dark to-transparent mb-6" />
          <p className="text-foreground/80 leading-relaxed italic">
            {article?.excerpt ?? 'Contenuto in arrivo.'}
          </p>
          <p className="text-xs text-muted-foreground mt-8 text-center italic">
            Questa sezione sarà popolata con il lore dettagliato del mondo di Eradriel.
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink">
      <TopBar />
      <main className="pt-16 pb-8 px-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl text-gold tracking-wider">Lore</h1>
            <p className="text-xs text-muted-foreground italic mt-1">Enciclopedia del mondo di Eradriel</p>
          </div>
        </div>

        <div className="space-y-3">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/lore?article=${article.slug}`}
              className="block p-4 rounded-xl border border-border bg-card/50 hover:border-gold-dim transition-all group"
            >
              <div className="flex items-start gap-3">
                <BookOpen size={18} className="text-gold-dim mt-0.5 flex-shrink-0 group-hover:text-gold transition-colors" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading text-sm text-gold tracking-wider group-hover:text-gold/90">{article.title}</h3>
                    <span className={`text-[9px] font-heading uppercase tracking-wider ${categoryColors[article.category] ?? 'text-muted-foreground'}`}>
                      {article.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground italic">
            Pagina in costruzione — gli articoli completi saranno disponibili presto.
          </p>
        </div>
      </main>
    </div>
  )
}

export default function LorePage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-ink flex items-center justify-center">
        <div className="font-display text-gold text-xl tracking-[4px] animate-pulse">ERADRIEL</div>
      </div>
    }>
      <LoreContent />
    </Suspense>
  )
}
