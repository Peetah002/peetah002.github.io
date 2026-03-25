'use client'

import { useState } from 'react'
import type { City, CityType } from '@/types/map'
import { CITY_CFG, REGIONS_LIST } from '@/lib/constants'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CityTypeGrid } from './CityTypeGrid'
import { CityMarker } from '@/components/map/markers/CityMarker'
import { Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CityEditorProps {
  city?: City | null
  isNew?: boolean
  coords?: { x: number; y: number } | null
  open: boolean
  onClose: () => void
  onSave: (data: Omit<City, 'id'> & { id?: string }) => void
  onDelete?: () => void
}

export function CityEditor({
  city,
  isNew,
  coords,
  open,
  onClose,
  onSave,
  onDelete,
}: CityEditorProps) {
  const [name, setName] = useState(city?.name ?? '')
  const [pop, setPop] = useState(city?.pop ?? '')
  const [region, setRegion] = useState(city?.region ?? 'Reth Maar')
  const [type, setType] = useState<CityType>(city?.type ?? 'media')
  const [description, setDescription] = useState(city?.description ?? '')
  const [notes, setNotes] = useState(city?.notes ?? '')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const cfg = CITY_CFG[type] || CITY_CFG.borgo

  const handleSave = () => {
    const n = name.trim()
    if (!n) {
      toast.error('Inserisci un nome')
      return
    }
    onSave({
      id: city?.id,
      name: n,
      pop: pop || 'Sconosciuta',
      region,
      type,
      x: city?.x ?? Math.round(coords?.x ?? 450),
      y: city?.y ?? Math.round(coords?.y ?? 450),
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
    })
    toast.success(isNew ? 'Città aggiunta' : 'Città salvata')
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
              {isNew ? 'Nuova Città' : 'Modifica Città'}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4 pt-4">
            {/* Preview */}
            <div className="flex justify-center">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <svg viewBox="-30 -30 60 60" width={60} height={60} style={{ overflow: 'visible' }}>
                  <CityMarker cfg={cfg} x={0} y={0} />
                </svg>
              </div>
            </div>

            {/* Type grid */}
            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Tipo</Label>
              <CityTypeGrid selected={type} onChange={setType} />
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome città"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Popolazione</Label>
              <Input
                value={pop}
                onChange={(e) => setPop(e.target.value)}
                placeholder="es. ~50.000 ab."
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Regione</Label>
              <Select value={region} onValueChange={(v) => v && setRegion(v)}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-ink border-border">
                  {REGIONS_LIST.map(r => (
                    <SelectItem key={r} value={r} className="text-foreground">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Descrizione (visibile ai giocatori)</Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrizione della città..."
                rows={3}
                className="w-full bg-secondary border border-border rounded-md text-foreground text-sm p-2 resize-none focus:border-gold-dark outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="font-heading text-[9px] tracking-wider uppercase text-muted-foreground">Note DM (solo per te)</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Note private del DM..."
                rows={2}
                className="w-full bg-secondary border border-destructive/30 rounded-md text-foreground text-sm p-2 resize-none focus:border-destructive/50 outline-none"
              />
            </div>

            {coords && (
              <p className="text-[10px] text-muted-foreground text-center">
                Posizione: {Math.round(coords.x)}, {Math.round(coords.y)}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleSave}
                className="flex-1 bg-accent border border-gold-dark text-gold hover:bg-gold-dim/30 font-heading text-xs"
              >
                <Save size={14} className="mr-1.5" />
                {isNew ? 'Piazza Città' : 'Salva'}
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
              <DialogTitle className="font-heading text-gold text-sm">Eliminare questa città?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-foreground/80">La città verrà rimossa definitivamente.</p>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmDelete(false)} className="flex-1 text-xs">
                Annulla
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmDelete(false)
                  onDelete?.()
                  onClose()
                  toast.success('Città eliminata')
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
