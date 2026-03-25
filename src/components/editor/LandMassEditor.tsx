'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, Minus, Save, Trash2, Info } from 'lucide-react'
import { toast } from 'sonner'

interface LandMassEditorProps {
  isOcean: boolean
  name: string
  vertexCount: number
  open: boolean
  onClose: () => void
  onSaveName?: (name: string) => void
  onDelete?: () => void
  onAddVertex: () => void
  onRemoveVertex: () => void
}

export function LandMassEditor({
  isOcean,
  name: initialName,
  vertexCount,
  open,
  onClose,
  onSaveName,
  onDelete,
  onAddVertex,
  onRemoveVertex,
}: LandMassEditorProps) {
  const [name, setName] = useState(initialName)
  const [confirmDelete, setConfirmDelete] = useState(false)

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
