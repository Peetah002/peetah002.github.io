'use client'

import { useState } from 'react'
import type { Region } from '@/types/map'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, Minus, Save, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'

interface RegionEditorProps {
  region: Region
  open: boolean
  onClose: () => void
  onSave: (data: Partial<Region>) => void
  onDelete: () => void
  onAddVertex: () => void
  onRemoveVertex: () => void
}

export function RegionEditor({
  region,
  open,
  onClose,
  onSave,
  onDelete,
  onAddVertex,
  onRemoveVertex,
}: RegionEditorProps) {
  const [name, setName] = useState(region.name)
  const [sub, setSub] = useState(region.sub)
  const [color, setColor] = useState(region.color)
  const [stroke, setStroke] = useState(region.stroke)
  const [op, setOp] = useState(Math.round(region.op * 100))
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleSave = () => {
    onSave({
      name: name.trim() || region.name,
      sub: sub.trim(),
      color,
      stroke,
      op: op / 100,
    })
    toast.success('Regione salvata')
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
            <SheetTitle className="font-heading text-gold text-sm tracking-wider">Modifica Regione</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Nome Regione</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Sottotitolo</Label>
              <Input
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                placeholder="es. Impero Teocratico"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Colore Fill</Label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 rounded-md border border-border cursor-pointer bg-transparent"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Colore Bordo</Label>
                <input
                  type="color"
                  value={stroke}
                  onChange={(e) => setStroke(e.target.value)}
                  className="w-full h-10 rounded-md border border-border cursor-pointer bg-transparent"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">
                Opacità: {op}%
              </Label>
              <Slider
                value={[op]}
                onValueChange={(v) => setOp(v)}
                min={20}
                max={100}
                step={1}
                className="py-2"
              />
            </div>

            {/* Vertex hint */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 border border-border/50">
              <Info size={14} className="text-gold-dim mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Trascina i vertici dorati per modificare la forma. Usa i bottoni qui sotto per aggiungere o rimuovere vertici.
              </p>
            </div>

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

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-accent border border-gold-dark text-gold hover:bg-gold-dim/30 font-heading text-xs"
              >
                <Save size={14} className="mr-1.5" />
                Salva
              </Button>
              <Button
                variant="destructive"
                onClick={() => setConfirmDelete(true)}
                className="px-4"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="bg-ink border-blood-dim max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-heading text-gold text-sm">Eliminare questa regione?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-foreground/80">Tutti i dati della regione andranno persi.</p>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 text-xs">
              Annulla
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmDelete(false)
                onDelete()
                onClose()
                toast.success('Regione eliminata')
              }}
              className="flex-1 text-xs"
            >
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
