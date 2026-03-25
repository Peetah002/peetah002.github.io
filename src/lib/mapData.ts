import type { Region, City, Tower, TerrainFeature, ContinentShape } from '@/types/map'
import { ellipsePolygon } from './geometry'

export const DEF_REGIONS: Region[] = [
  { id: 'aldheris', name: 'Aldheris', sub: 'Impero Teocratico', color: '#b8d090', stroke: '#7a9050', op: 0.88,
    pts: [[155,120],[230,88],[320,95],[395,100],[440,155],[465,270],[425,375],[340,420],[235,405],[158,335],[125,225]] },
  { id: 'kardromak', name: 'Kar Dromak', sub: 'Regno dei Nani', color: '#c8c8d8', stroke: '#9090b0', op: 0.88,
    pts: [[468,110],[540,82],[620,92],[698,104],[740,158],[772,270],[732,375],[640,422],[530,405],[448,215]] },
  { id: 'thanelorn', name: 'Thanelorn', sub: 'Regno Elfico', color: '#426832', stroke: '#3a7228', op: 0.90,
    pts: [[620,408],[668,388],[718,398],[762,410],[782,450],[795,540],[762,628],[685,672],[602,652],[558,582],[562,495]] },
  { id: 'rethMaar', name: 'Reth Maar', sub: 'Convergenza delle Razze', color: '#c09050', stroke: '#b08838', op: 0.90,
    pts: [[420,448],[480,428],[548,435],[618,444],[665,490],[715,592],[690,692],[608,748],[500,748],[410,690],[368,595],[378,493]] },
  { id: 'xhorrKhal', name: 'Xhorr-Khal', sub: 'Confederazione Orchesca', color: '#a87840', stroke: '#9a7030', op: 0.88,
    pts: [[162,452],[210,428],[272,432],[368,478],[392,558],[358,638],[280,672],[196,650],[148,578],[142,492]] },
]

export const DEF_CITIES: City[] = [
  { id: 'solmeris', name: 'Solmeris', pop: '~420.000 ab.', region: 'Aldheris', type: 'capitale', x: 255, y: 210 },
  { id: 'aurelport', name: 'Aurelport', pop: '~260.000 ab.', region: 'Aldheris', type: 'grande', x: 140, y: 308 },
  { id: 'heliongrad', name: 'Heliongrad', pop: '~190.000 ab.', region: 'Aldheris', type: 'grande', x: 400, y: 148 },
  { id: 'lumenfall', name: 'Lumenfall', pop: '~230.000 ab.', region: 'Aldheris', type: 'grande', x: 300, y: 348 },
  { id: 'aurivela', name: 'Aurivela', pop: '~55.000 ab.', region: 'Aldheris', type: 'media', x: 190, y: 158 },
  { id: 'castrumv', name: 'Castrum Valtis', pop: '~40.000 ab.', region: 'Aldheris', type: 'media', x: 388, y: 270 },
  { id: 'selenaiM', name: 'Selenai Minor', pop: '~35.000 ab.', region: 'Aldheris', type: 'media', x: 330, y: 168 },
  { id: 'brighold', name: 'Brighold', pop: '~28.000 ab.', region: 'Aldheris', type: 'media', x: 420, y: 320 },
  { id: 'claristern', name: 'Claristern', pop: '~22.000 ab.', region: 'Aldheris', type: 'media', x: 175, y: 258 },
  { id: 'campoluce', name: 'CampoLuce', pop: '~900 ab.', region: 'Aldheris', type: 'borgo', x: 255, y: 110 },
  { id: 'rivabassa', name: 'Rivabassa', pop: '~650 ab.', region: 'Aldheris', type: 'borgo', x: 162, y: 378 },
  { id: 'trefienili', name: 'TreFienili', pop: '~420 ab.', region: 'Aldheris', type: 'borgo', x: 355, y: 388 },
  { id: 'serravento', name: 'Serravento', pop: '~1.100 ab.', region: 'Aldheris', type: 'borgo', x: 160, y: 200 },
  { id: 'cavabianca', name: 'CavaBianca', pop: '~780 ab.', region: 'Aldheris', type: 'borgo', x: 295, y: 126 },
  { id: 'lontanombra', name: 'Lontanombra', pop: '~230 ab.', region: 'Aldheris', type: 'borgo', x: 440, y: 370 },
  { id: 'kardromak_c', name: 'Kar Dromak', pop: 'Sconosciuta', region: 'Kar Dromak', type: 'capitale', x: 608, y: 255 },
  { id: 'thanelorn_c', name: 'Thanelorn', pop: 'Sconosciuta', region: 'Thanelorn', type: 'capitale', x: 676, y: 525 },
  { id: 'veilTharis', name: "Veil'Tharis", pop: '~520.000 ab.', region: 'Reth Maar', type: 'capitale', x: 545, y: 590 },
  { id: 'cragshold', name: 'Cragshold', pop: '~180.000 ab.', region: 'Reth Maar', type: 'grande', x: 435, y: 488 },
  { id: 'silversong', name: 'Silversong', pop: '~210.000 ab.', region: 'Reth Maar', type: 'grande', x: 620, y: 660 },
  { id: 'dunemar', name: 'Dunemar', pop: '~195.000 ab.', region: 'Reth Maar', type: 'grande', x: 460, y: 710 },
  { id: 'ashveil', name: 'Ashveil', pop: '~62.000 ab.', region: 'Reth Maar', type: 'media', x: 490, y: 530 },
  { id: 'thornvale', name: 'Thornvale', pop: '~48.000 ab.', region: 'Reth Maar', type: 'media', x: 510, y: 470 },
  { id: 'crystalbrook', name: 'Crystalbrook', pop: '~55.000 ab.', region: 'Reth Maar', type: 'media', x: 640, y: 560 },
  { id: 'ironridge', name: 'Ironridge', pop: '~58.000 ab.', region: 'Reth Maar', type: 'media', x: 570, y: 468 },
  { id: 'starfall', name: 'Starfall Crossing', pop: '~51.000 ab.', region: 'Reth Maar', type: 'media', x: 540, y: 720 },
  { id: 'ashford', name: 'Ashford', pop: '~2.800 ab.', region: 'Reth Maar', type: 'borgo', x: 468, y: 548 },
  { id: 'thornwatch', name: 'Thornwatch', pop: '~1.400 ab.', region: 'Reth Maar', type: 'borgo', x: 508, y: 612 },
  { id: 'misthollow', name: 'Misthollow', pop: '~1.200 ab.', region: 'Reth Maar', type: 'borgo', x: 590, y: 622 },
  { id: 'coppergate', name: 'Coppergate', pop: '~3.100 ab.', region: 'Reth Maar', type: 'borgo', x: 415, y: 648 },
  { id: 'sandrift', name: 'Sandrift', pop: '~1.700 ab.', region: 'Reth Maar', type: 'borgo', x: 668, y: 622 },
  { id: 'wraithfen', name: 'Wraithfen', pop: '~620 ab.', region: 'Reth Maar', type: 'borgo', x: 660, y: 698 },
  { id: 'cinderhill', name: 'Cinderhill', pop: '~480 ab.', region: 'Reth Maar', type: 'borgo', x: 470, y: 668 },
  { id: 'glimmerford', name: 'Glimmerford', pop: '~890 ab.', region: 'Reth Maar', type: 'borgo', x: 425, y: 558 },
  { id: 'brughiscuri', name: 'Brughiscuri', pop: '~300 ab.', region: 'Reth Maar', type: 'missione', x: 462, y: 456 },
  { id: 'xhorrkhal_c', name: 'Xhorr-Khal', pop: 'Sconosciuta', region: 'Xhorr-Khal', type: 'capitale', x: 262, y: 558 },
]

export const DEF_TOWER: Tower = { x: 450, y: 440 }

export const DEF_TERRAIN: TerrainFeature[] = []

export const DEF_CONTINENT: ContinentShape = {
  oceanBorder: ellipsePolygon(450, 450, 418, 418, 32),
  landMasses: [
    { id: 'main', name: 'Continente Principale', pts: ellipsePolygon(450, 450, 355, 348, 32) },
  ],
}
