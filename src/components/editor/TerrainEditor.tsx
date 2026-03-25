'use client'

import { useState } from 'react'
import type { TerrainFeature, TerrainType } from '@/types/map'
import { TERRAIN_CFG } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Save, Trash2, Plus, Minus, Info } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface TerrainEditorProps {
  feature?: TerrainFeature | null
  isNew?: boolean
  open: boolean
  onClose: () => void
  onSave: (data: TerrainFeature) => void
  onDelete?: () => void
  onAddVertex?: () => void
  onRemoveVertex?: () => void
}

export function TerrainEditor({
  feature,
  isNew,
  open,
  onClose,
  onSave,
  onDelete,
  onAddVertex,
  onRemoveVertex,
}: TerrainEditorProps) {
  const [type, setType] = useState<TerrainType>(feature?.type ?? 'forest')
  const [label, setLabel] = useState(feature?.label ?? '')
  const [opacity, setOpacity] = useState(Math.round((feature?.opacity ?? 0.5) * 100))
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSave = () => {
    const defaultPts: [number, number][] = type === 'river'
      ? [[400, 300], [420, 350], [430, 400], [420, 450]]
      : [[400, 350], [450, 330], [470, 370], [450, 400], [410, 390]]

    onSave({
      id: feature?.id ?? `terrain_${Date.now()}`,
      type,
      points: feature?.points ?? defaultPts,
      label: label.trim() || undefined,
      opacity: opacity / 100,
    })
    toast.success(isNew ? 'Terreno aggiunto' : 'Terreno salvato')
    onClose()
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent
          side="bottom"
          className="bg-ink/99 border-t-2 border-gold-dark rounded-t-2xl max-h-[85vh] overflow-y-auto lg:max-w-md lg:ml-auto"
        >
          <SheetHeader>
            <SheetTitle className="font-heading text-gold text-sm tracking-wider">
              {isNew ? 'Nuovo Terreno' : 'Modifica Terreno'}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 pt-4">
            {/* Type grid */}
            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Tipo</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.entries(TERRAIN_CFG) as [TerrainType, typeof TERRAIN_CFG[TerrainType]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      'bg-secondary rounded-lg p-2 cursor-pointer text-center transition-colors border-2',
                      key === type ? 'border-gold' : 'border-transparent hover:border-gold-dim'
                    )}
                    onClick={() => setType(key)}
                  >
                    <div className="text-xl mb-1">{cfg.icon}</div>
                    <div className="font-heading text-[7px] text-muted-foreground">{cfg.lbl}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Etichetta (opzionale)</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="es. Foresta Nera"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">
                Opacità: {opacity}%
              </Label>
              <Slider
                value={[opacity]}
                onValueChange={(v) => setOpacity(v)}
                min={10}
                max={100}
                step={1}
              />
            </div>

            {!isNew && feature && (
              <>
                {/* Vertex hint */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <Info size={14} className="text-gold-dim mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {feature.points.length} vertici — Trascina i vertici dorati per modificare la forma.
                    Clicca su un lato per aggiungere un vertice in quel punto.
                  </p>
                </div>

                {onAddVertex && onRemoveVertex && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAddVertex}
                      className="border-gold-dim/50 text-gold hover:bg-accent"
                    >
                      <Plus size={14} className="mr-1" />
                      Vertice
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onRemoveVertex}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <Minus size={14} className="mr-1" />
                      Vertice
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-accent border border-gold-dark text-gold hover:bg-gold-dim/30 font-heading text-xs"
              >
                <Save size={14} className="mr-1.5" />
                {isNew ? 'Aggiungi' : 'Salva'}
              </Button>
              {!isNew && onDelete && (
                <Button
                  variant="destructive"
                  onClick={() => setConfirmDelete(true)}
                  className="px-4"
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {!isNew && (
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogContent className="bg-ink border-blood-dim max-w-xs">
            <DialogHeader>
              <DialogTitle className="font-heading text-gold text-sm">Eliminare questo terreno?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 text-xs">Annulla</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmDelete(false)
                  onDelete?.()
                  onClose()
                  toast.success('Terreno eliminato')
                }}
                className="flex-1 text-xs"
              >
                Elimina
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
