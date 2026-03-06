# Eradriel Map

Progetto personale per la mia campagna di D&D ambientata nel mondo di **Eradriel**.

---

## Cos'è

Una mappa interattiva del mondo di gioco, hostata su GitHub Pages, pensata per due scopi distinti: tenerla aggiornata io come DM sessione per sessione, e mostrarla ai giocatori in tempo reale senza che debbano installare niente o aprire PDF.

Niente di sofisticato. L'ho costruita perché mi seccava aggiornare una mappa su Inkscape, esportarla, mandarla su Discord, e poi ricominciare la sessione successiva. Volevo qualcosa che funzionasse dal browser, anche da telefono, e che potessi aggiornare in cinque minuti prima di giocare.

---

## Come funziona

Il progetto è composto da due file HTML e un file JSON:

### `eradriel_map.html` — Vista DM
La versione completa, accessibile solo a me. Permette di:
- Disegnare e modificare le **regioni** della mappa (poligoni colorati con nome e sottotitolo)
- Aggiungere, spostare e modificare le **città** con tipo, nome, popolazione e regione di appartenenza
- Spostare la **Torre di Nartharion** (sede del party) trascinandola sulla mappa
- Esportare tutto in un file `mappa.json`
- Resettare la mappa se necessario

La mappa supporta pan e zoom sia da mouse che da touch, e tutti i dati vengono salvati in `localStorage` per non perderli tra una sessione e l'altra.

### `index.html` — Vista Giocatori
La versione di sola lettura, quella che i giocatori aprono dal browser. Hanno la mappa aggiornata all'ultima sessione, possono zoomare, spostarsi, e toccare una città per vedere il suo nome e le informazioni base. Nessun controllo di modifica.

Hanno due pulsanti:
- **Aggiorna** — scarica automaticamente il `mappa.json` aggiornato da GitHub
- **Importa** — carica manualmente un file JSON locale, come fallback

### `mappa.json` — I dati
Il file JSON che contiene lo stato della mappa: regioni, città, e posizione della torre. Viene generato dal tool DM ed è quello che i giocatori scaricano per aggiornarsi. Non è nel repository (viene pubblicato separatamente su GitHub Pages).

---

## Workflow sessione per sessione

1. Prima della sessione apro `eradriel_map.html` in locale
2. Aggiungo o modifico regioni e città in base a cosa è successo nella sessione precedente
3. Esporto il `mappa.json` e lo carico su GitHub Pages (nella stessa repo, come file statico)
4. I giocatori aprono `index.html` e premono **Aggiorna** per ricevere la mappa aggiornata

---

## Stile

L'estetica è volutamente da mappa fantasy antica: font tipografici (Cinzel, IM Fell English), colori oro e inchiostro, bussola, legenda, vignettatura. Tutto SVG, niente canvas, niente librerie esterne oltre ai Google Fonts.

---

## Stack

- HTML + CSS + JavaScript vanilla, zero dipendenze
- GitHub Pages per l'hosting
- `localStorage` per la persistenza dei dati lato DM
- `fetch` per il sync automatico lato giocatori

---

## Note

Il progetto è pensato per uso personale e non è costruito per scalare o per essere riutilizzato da altri così com'è. Non c'è autenticazione, non c'è backend, non c'è niente di complicato — e va bene così.
