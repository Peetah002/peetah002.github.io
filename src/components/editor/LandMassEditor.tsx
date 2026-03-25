'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, Minus, Save, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'
import { polygonRadius } from '@/lib/geometry'

interface LandMassEditorProps {
  isOcean: boolean
  name: string
  pts: [number, number][]
  vertexCount: number
  open: boolean
  onClose: () => void
  onSaveName?: (name: string) => void
  onDelete?: () => void
  onAddVertex: () => void
  onRemoveVertex: () => void
  onResize: (targetRadius: number) => void
}

export function LandMassEditor({
  isOcean,
  name: initialName,
  pts,
  vertexCount,
  open,
  onClose,
  onSaveName,
  onDelete,
  onAddVertex,
  onRemoveVertex,
  onResize,
}: LandMassEditorProps) {
  const [name, setName] = useState(initialName)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const currentRadius = Math.round(polygonRadius(pts))
  const [radiusInput, setRadiusInput] = useState(String(currentRadius))
  const [sliderValue, setSliderValue] = useState(currentRadius)

  // Sync when pts change externally (e.g. vertex drag)
  useEffect(() => {
    const r = Math.round(polygonRadius(pts))
    setSliderValue(r)
    setRadiusInput(String(r))
  }, [pts])

  const handleSliderChange = (v: number | number[]) => {
    const r = Array.isArray(v) ? v[0] ?? sliderValue : v
    setSliderValue(r)
    setRadiusInput(String(r))
    onResize(r)
  }

  const handleRadiusSubmit = () => {
    const r = Math.max(10, Math.min(900, parseInt(radiusInput) || currentRadius))
    setSliderValue(r)
    setRadiusInput(String(r))
    onResize(r)
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
              {isOcean ? 'Bordo Oceano' : 'Modifica Land Mass'}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 pt-4">
            {!isOcean && onSaveName && (
              <div className="space-y-1.5">
                <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Nome</Label>
                <div className="flex gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="es. Isola del Drago"
                    className="bg-secondary border-border text-foreground flex-1"
                  />
                  <Button
                    onClick={() => { onSaveName(name.trim() || initialName); toast.success('Nome salvato') }}
                    className="bg-accent border border-gold-dark text-gold hover:bg-gold-dim/30 font-heading text-xs px-3"
                  >
                    <Save size={14} />
                  </Button>
                </div>
              </div>
            )}

            {/* Uniform resize */}
            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">
                Dimensione (raggio): {sliderValue}
              </Label>
              <Slider
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                min={10}
                max={600}
                step={1}
                className="py-2"
              />
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={radiusInput}
                  onChange={(e) => setRadiusInput(e.target.value)}
                  onBlur={handleRadiusSubmit}
                  onKeyDown={(e) => e.key === 'Enter' && handleRadiusSubmit()}
                  min={10}
                  max={900}
                  className="bg-secondary border-border text-foreground w-24 text-center"
                />
                <span className="text-[10px] text-muted-foreground">px (raggio equivalente)</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Info size={14} className="text-gold-dim mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {vertexCount} vertici — Trascina i vertici per modificare la forma.
                Clicca su un lato per aggiungere un vertice in quel punto.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={onAddVertex}
                className="border-gold-dim/50 text-gold hover:bg-accent">
                <Plus size={14} className="mr-1" /> Vertice
              </Button>
              <Button variant="outline" size="sm" onClick={onRemoveVertex}
                className="border-destructive/50 text-destructive hover:bg-destructive/10">
                <Minus size={14} className="mr-1" /> Vertice
              </Button>
            </div>

            {!isOcean && onDelete && (
              <div className="pt-2">
                <Button variant="destructive" onClick={() => setConfirmDelete(true)} className="w-full text-xs">
                  <Trash2 size={14} className="mr-1.5" /> Elimina Land Mass
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {!isOcean && (
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogContent className="bg-ink border-blood-dim max-w-xs">
            <DialogHeader>
              <DialogTitle className="font-heading text-gold text-sm">Eliminare questa land mass?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 text-xs">Annulla</Button>
              <Button variant="destructive" onClick={() => {
                setConfirmDelete(false); onDelete?.(); onClose()
                toast.success('Land mass eliminata')
              }} className="flex-1 text-xs">Elimina</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
