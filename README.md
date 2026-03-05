<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Eradriel — Mappa (Giocatori)</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@700&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet">
<style>
:root{
  --gold:#d4a830;--gold-dk:#8B6914;--gold-dim:#5a4010;
  --ink:#0e0902;--border:#5a4010;
  --text:#c9b47a;--text-dim:#7a6030;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;}
html,body{width:100%;height:100%;background:var(--ink);overflow:hidden;font-family:'IM Fell English',serif;color:var(--text);}

/* ── VIEWPORT ── */
#vp{
  position:fixed;inset:0;
  /* pointer-events and touch-action managed via JS */
  touch-action:none;
  cursor:grab;
}
#vp.panning{cursor:grabbing;}
#vp.crosshair{cursor:crosshair;}

/* ── STAGE (transformed) ── */
#stage{position:absolute;top:0;left:0;transform-origin:0 0;will-change:transform;}
svg{display:block;width:900px;height:900px;overflow:visible;}

/* ── TOP BAR ── */
#topbar{
  position:fixed;top:0;left:0;right:0;height:52px;z-index:400;
  background:rgba(8,5,1,.97);border-bottom:1px solid var(--border);
  display:flex;align-items:center;gap:6px;padding:0 10px;
  overflow-x:auto;scrollbar-width:none;
}
#topbar::-webkit-scrollbar{display:none;}
.tb-ttl{font-family:'Cinzel Decorative',serif;font-size:13px;color:var(--gold);letter-spacing:2px;white-space:nowrap;margin-right:4px;flex-shrink:0;}
.sep{width:1px;height:26px;background:var(--border);flex-shrink:0;margin:0 2px;}
.tb{
  height:34px;min-width:34px;padding:0 10px;border-radius:6px;
  border:1px solid var(--border);background:rgba(18,10,2,.8);
  color:var(--text);font-family:'Cinzel',serif;font-size:10px;
  cursor:pointer;white-space:nowrap;flex-shrink:0;
  display:flex;align-items:center;gap:4px;letter-spacing:.5px;
  transition:background .1s,border-color .1s,color .1s;
}
.tb:active,.tb.on{background:rgba(70,40,4,.9);border-color:var(--gold);color:var(--gold);}

/* ── ZOOM BUTTONS ── */
#zoom{position:fixed;right:12px;bottom:90px;z-index:90;display:flex;flex-direction:column;gap:6px;}
.zb{
  width:46px;height:46px;background:rgba(8,5,1,.95);border:1px solid var(--border);
  border-radius:10px;color:var(--gold);font-size:24px;
  display:flex;align-items:center;justify-content:center;cursor:pointer;
}
.zb:active{background:rgba(50,28,4,.95);border-color:var(--gold);}

/* ── COMPASS ── */
#compass{position:fixed;top:62px;right:12px;z-index:90;opacity:.9;pointer-events:none;}

/* ── LEGEND ── */
#legend{
  position:fixed;bottom:12px;left:12px;z-index:90;
  background:rgba(6,4,1,.96);border:1px solid var(--gold-dim);
  border-radius:10px;font-size:11px;
  max-width:calc(100vw - 80px);
  transition:all .2s ease;
  overflow:hidden;
  cursor:pointer;
  user-select:none;
}
#leg-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:8px 12px;gap:8px;
}
#leg-header h3{font-family:'Cinzel',serif;font-size:9px;color:var(--gold);letter-spacing:1px;text-transform:uppercase;margin:0;}
#leg-toggle{font-size:14px;color:var(--gold-dim);line-height:1;transition:transform .2s;}
#leg-body{padding:0 12px 10px;display:grid;grid-template-columns:1fr 1fr;gap:2px 10px;}
#legend.collapsed #leg-body{display:none;}
#legend.collapsed #leg-toggle{transform:rotate(180deg);}
.li{display:flex;align-items:center;gap:6px;line-height:2;white-space:nowrap;}
.li-icon{width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}

/* ── BOTTOM SHEET (shared) ── */
.sheet{
  position:fixed;bottom:0;left:0;right:0;z-index:300;
  background:rgba(8,5,1,.99);border-top:2px solid var(--gold-dk);
  border-radius:18px 18px 0 0;
  transform:translateY(100%);transition:transform .25s cubic-bezier(.4,0,.2,1);
  max-height:78vh;overflow-y:auto;overscroll-behavior:contain;
}
.sheet.open{transform:translateY(0);}
.sh-bar{width:38px;height:4px;background:var(--border);border-radius:2px;margin:12px auto 0;opacity:.7;}
.sh-head{display:flex;align-items:center;justify-content:space-between;padding:10px 18px 4px;}
.sh-title{font-family:'Cinzel',serif;font-size:14px;color:var(--gold);letter-spacing:1px;}
.sh-x{background:none;border:none;color:var(--text-dim);font-size:24px;cursor:pointer;padding:4px 8px;line-height:1;}
.sh-body{padding:6px 18px 16px;}

/* form elements */

/* info panel */
#ip-region{font-style:italic;font-size:11px;color:var(--text-dim);text-align:center;margin-bottom:4px;}
#ip-name{font-family:'Cinzel',serif;font-size:22px;color:var(--gold);text-align:center;margin-bottom:10px;}
.ip-line{width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--gold-dk),transparent);margin:0 auto 10px;}
#ip-pop{font-size:16px;color:#e8d5a0;text-align:center;opacity:.9;}
#ip-type{font-style:italic;font-size:12px;color:var(--text-dim);text-align:center;margin-top:5px;}

/* vertex handles */

/* mode indicator */

/* toast */
#toast{
  position:fixed;bottom:72px;left:50%;transform:translateX(-50%) translateY(10px);
  background:rgba(50,30,4,.96);border:1px solid var(--gold-dk);border-radius:6px;
  color:var(--gold);font-family:'Cinzel',serif;font-size:11px;letter-spacing:.5px;
  padding:8px 18px;z-index:550;opacity:0;transition:opacity .18s,transform .18s;
  pointer-events:none;white-space:nowrap;
}
#toast.show{opacity:1;transform:translateX(-50%) translateY(0);}

/* overlay for reset confirm */
#overlay{
  display:none;position:fixed;inset:0;z-index:600;
  background:rgba(4,2,0,.75);align-items:center;justify-content:center;padding:20px;
}
#overlay.show{display:flex;}
.ov-box{
  background:rgba(10,6,1,.99);border:1px solid #8a1a10;
  border-radius:12px;padding:24px 20px;max-width:320px;width:100%;text-align:center;
}
.ov-box h3{font-family:'Cinzel',serif;font-size:15px;color:var(--gold);margin-bottom:10px;}
.ov-box p{font-size:13px;color:var(--text);margin-bottom:20px;line-height:1.5;}

/* ── RESPONSIVE ── */
/* Make topbar buttons smaller on narrow screens */
@media (max-width: 420px) {
  .tb-ttl{font-size:11px;letter-spacing:1px;}
  .tb{height:30px;padding:0 8px;font-size:9px;}
  #compass{top:58px;right:8px;}
  #compass svg{width:42px;height:42px;}
  #zoom{right:8px;bottom:80px;}
  .zb{width:40px;height:40px;font-size:20px;}
  #legend{font-size:10px;padding:6px 10px;}
  #mode-badge{font-size:8px;padding:5px 10px;bottom:12px;right:8px;}
}

/* Ensure vp sits below all fixed UI */
#vp{z-index:1;}
#stage{z-index:1;}
</style>
</head>
<body>

<!-- VIEWPORT -->
<div id="vp">
  <div id="stage">
    <svg id="svg" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="fx-rough"><feTurbulence type="turbulence" baseFrequency="0.018" numOctaves="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
        <filter id="fx-glow"><feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#d4a830" flood-opacity=".35" result="c"/><feComposite in="c" in2="b" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="g-ocean" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#1a3550"/><stop offset="70%" stop-color="#0e2035"/><stop offset="100%" stop-color="#060d18"/></radialGradient>
        <radialGradient id="g-land" cx="52%" cy="48%" r="52%"><stop offset="0%" stop-color="#e2cc8e"/><stop offset="65%" stop-color="#cdb070"/><stop offset="100%" stop-color="#a88a48"/></radialGradient>
        <radialGradient id="g-vig" cx="50%" cy="50%" r="50%"><stop offset="58%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(4,2,1,.93)"/></radialGradient>
        <pattern id="p-waves" x="0" y="0" width="50" height="22" patternUnits="userSpaceOnUse"><path d="M0,11 Q12,5 25,11 Q38,17 50,11" fill="none" stroke="#2a5a8a" stroke-width=".9" opacity=".28"/><path d="M0,18 Q12,12 25,18 Q38,24 50,18" fill="none" stroke="#2a5a8a" stroke-width=".6" opacity=".18"/></pattern>
        <clipPath id="clip-map"><circle cx="450" cy="450" r="418"/></clipPath>
      </defs>

      <!-- Ocean -->
      <circle cx="450" cy="450" r="450" fill="#060d18"/>
      <circle cx="450" cy="450" r="418" fill="url(#g-ocean)"/>
      <circle cx="450" cy="450" r="418" fill="url(#p-waves)"/>

      <g clip-path="url(#clip-map)">
        <!-- Land -->
        <ellipse cx="450" cy="450" rx="355" ry="348" fill="url(#g-land)" filter="url(#fx-rough)"/>

        <!-- REGIONS -->
        <g id="L-regions"></g>
        <!-- REGION LABELS -->
        <g id="L-labels" pointer-events="none"></g>
        <!-- STATIC DECORATIONS -->
        <g id="L-deco" pointer-events="none">
          <!-- Ocean labels (static) -->
          <text x="95" y="445" font-family="IM Fell English,serif" font-size="13" font-style="italic" fill="#3a6a9a" text-anchor="middle" opacity=".35" transform="rotate(-10,95,445)">Mare</text>
          <text x="95" y="460" font-family="IM Fell English,serif" font-size="13" font-style="italic" fill="#3a6a9a" text-anchor="middle" opacity=".35" transform="rotate(-10,95,460)">Occidentale</text>
          <text x="808" y="430" font-family="IM Fell English,serif" font-size="12" font-style="italic" fill="#3a6a9a" text-anchor="middle" opacity=".32" transform="rotate(8,808,430)">Mare</text>
          <text x="808" y="444" font-family="IM Fell English,serif" font-size="12" font-style="italic" fill="#3a6a9a" text-anchor="middle" opacity=".32" transform="rotate(8,808,444)">Orientale</text>
        </g>
        <!-- TOWER (rendered by JS, draggable in edit mode) -->
        <g id="L-tower"></g>
        <!-- CITIES -->
        <g id="L-cities"></g>
        <!-- VERTEX HANDLES (top, edit mode only) -->
        <g id="L-handles"></g>
        <!-- Vignette -->
        <circle cx="450" cy="450" r="418" fill="url(#g-vig)" pointer-events="none"/>
      </g>
    </svg>
  </div>
</div>

<!-- TOP BAR -->
<div id="topbar">
  <span class="tb-ttl">ERADRIEL</span>
  <div class="sep"></div>
  <span style="font-family:'IM Fell English',serif;font-size:11px;color:var(--text-dim);white-space:nowrap;flex-shrink:0;font-style:italic;">Mappa di Eradriel</span>
  <div class="sep"></div>
  <button class="tb" id="btn-sync">🔄 Aggiorna</button>
  <button class="tb" id="btn-import">📥 Importa</button>
</div>
<!-- Hidden file input for import -->
<input type="file" id="file-input" accept=".json" style="display:none">

<!-- ZOOM -->
<div id="zoom">
  <button class="zb" id="z+">+</button>
  <button class="zb" id="z-">−</button>
  <button class="zb" id="z0" style="font-size:17px">⌂</button>
</div>

<!-- COMPASS -->
<div id="compass">
  <svg width="52" height="52" viewBox="0 0 80 80">
    <circle cx="40" cy="40" r="36" fill="rgba(6,3,1,.9)" stroke="#8B6914" stroke-width="1.5"/>
    <polygon points="40,8 45,38 40,32 35,38" fill="#b02818"/>
    <polygon points="40,72 45,42 40,48 35,42" fill="#a08040"/>
    <polygon points="72,40 42,35 48,40 42,45" fill="#a08040"/>
    <polygon points="8,40 38,35 32,40 38,45"  fill="#a08040"/>
    <circle cx="40" cy="40" r="4" fill="#d4a830" stroke="#8B6914" stroke-width="1"/>
    <text x="40" y="22" font-family="Cinzel,serif" font-size="11" font-weight="700" fill="#e8d5a0" text-anchor="middle">N</text>
    <text x="40" y="65" font-family="Cinzel,serif" font-size="9" fill="#a08040" text-anchor="middle">S</text>
    <text x="65" y="44" font-family="Cinzel,serif" font-size="9" fill="#a08040" text-anchor="middle">E</text>
    <text x="15" y="44" font-family="Cinzel,serif" font-size="9" fill="#a08040" text-anchor="middle">O</text>
  </svg>
</div>

<!-- LEGEND -->
<div id="legend">
  <div id="leg-header">
    <h3>Legenda</h3>
    <span id="leg-toggle">▲</span>
  </div>
  <div id="leg-body"></div>
</div>

<!-- INFO SHEET (view mode tap) -->
<div class="sheet" id="info-sheet">
  <div class="sh-bar"></div>
  <div class="sh-head">
    <span></span>
    <button class="sh-x" id="info-close">✕</button>
  </div>
  <div class="sh-body">
    <div id="ip-icon" style="display:flex;justify-content:center;margin-bottom:6px;"></div>
    <div id="ip-region"></div>
    <div id="ip-name"></div>
    <div class="ip-line"></div>
    <div id="ip-pop"></div>
    <div id="ip-type"></div>
  </div>
</div>

<!-- TOAST -->
<div id="toast"></div>

<script>
'use strict';
const NS   = 'http://www.w3.org/2000/svg';
const SKEY = 'eradriel_player_v1';
const SW = 900, SH = 900;

/* ── CITY TYPES (same as DM) ── */
const CITY_CFG = {
  capitale: {r:10, fill:'#d4a830', inner:'#f0d060', lbl:'Capitale'},
  grande:   {r:7,  fill:'#c8a030', inner:'#e8c050', lbl:'Città Grande'},
  media:    {r:5,  fill:'#a05820', inner:null,       lbl:'Città Media'},
  borgo:    {r:3,  fill:'#885018', inner:null,        lbl:'Borgo/Villaggio'},
  missione: {r:5,  fill:'#8B1e1e', inner:'#e84040',  lbl:'Luogo di Missione', tri:true},
  rovine:   {r:6,  fill:'#6a5a3a', inner:'#c0a860',  lbl:'Rovine', star:true},
  fortezza: {r:7,  fill:'#8a7060', inner:'#d4b890',  lbl:'Fortezza', sq:true},
  porto:    {r:6,  fill:'#3a7090', inner:'#80c0d8',  lbl:'Porto'},
  accademia:{r:5,  fill:'#6060a8', inner:'#b0b0e8',  lbl:'Accademia/Torre Arcana'},
  tempio:   {r:5,  fill:'#a06828', inner:'#e8c060',  lbl:'Tempio/Luogo Sacro', cross:true},
  avamposto:{r:4,  fill:'#7a4020', inner:null,        lbl:'Avamposto DOOM-E', tri:true},
  segreto:  {r:4,  fill:'#501040', inner:'#c040a0',  lbl:'Luogo Segreto', sq:true},
};

/* ── STATE ── */
let S = {regions:[], cities:[], tower:{x:450,y:440}};

/* ── HELPERS ── */
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function svgNS(tag,attrs){
  const el=document.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(attrs||{})) el.setAttribute(k,v);
  return el;
}
function ptsStr(pts){ return pts.map(p=>p[0]+','+p[1]).join(' '); }
function centroid(pts){
  const n=pts.length;
  return [pts.reduce((s,p)=>s+p[0],0)/n, pts.reduce((s,p)=>s+p[1],0)/n];
}
function darken(hex){
  try{const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return `rgb(${Math.floor(r*.5)},${Math.floor(g*.5)},${Math.floor(b*.5)})`;}catch(e){return '#333';}
}
let _tt;
function toast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(_tt); _tt=setTimeout(()=>el.classList.remove('show'),2200);
}

/* ── RENDER ── */
function renderRegions(){
  const rl=document.getElementById('L-regions');
  const ll=document.getElementById('L-labels');
  rl.innerHTML=''; ll.innerHTML='';
  S.regions.forEach(r=>{
    rl.appendChild(svgNS('polygon',{points:ptsStr(r.pts),fill:r.color,stroke:r.stroke,'stroke-width':'1.5',opacity:r.op}));
    const [cx,cy]=centroid(r.pts);
    const t1=svgNS('text',{x:cx,y:cy-5,'font-family':'Cinzel,serif','font-size':'14','font-weight':'700',fill:'#1a1208','text-anchor':'middle',opacity:'.82','letter-spacing':'1.5'});
    t1.textContent=r.name.toUpperCase(); ll.appendChild(t1);
    const t2=svgNS('text',{x:cx,y:cy+10,'font-family':'IM Fell English,serif','font-size':'9','font-style':'italic',fill:'#2a2010','text-anchor':'middle',opacity:'.62'});
    t2.textContent=r.sub; ll.appendChild(t2);
  });
}

function cityShape(cfg,x,y,g){
  const r=cfg.r, s=r+3;
  if(cfg.tri){
    g.appendChild(svgNS('polygon',{points:`${x},${y-s} ${x+s},${y+s} ${x-s},${y+s}`,fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':'1.5'}));
    if(cfg.inner) g.appendChild(svgNS('circle',{cx:x,cy:y+Math.round(s/3),r:'3',fill:cfg.inner,opacity:'.9'}));
  } else if(cfg.sq){
    const h=r+1;
    g.appendChild(svgNS('rect',{x:x-h,y:y-h,width:h*2,height:h*2,rx:'1',fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':'1.5'}));
    if(cfg.inner) g.appendChild(svgNS('rect',{x:x-r+2,y:y-r+2,width:(r-2)*2,height:(r-2)*2,rx:'1',fill:cfg.inner,opacity:'.8'}));
  } else if(cfg.star){
    const pts1=`${x},${y-s} ${x+s*.87},${y+s*.5} ${x-s*.87},${y+s*.5}`;
    const pts2=`${x},${y+s} ${x+s*.87},${y-s*.5} ${x-s*.87},${y-s*.5}`;
    g.appendChild(svgNS('polygon',{points:pts1,fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':'1',opacity:'.9'}));
    g.appendChild(svgNS('polygon',{points:pts2,fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':'1',opacity:'.7'}));
    if(cfg.inner) g.appendChild(svgNS('circle',{cx:x,cy:y,r:'3',fill:cfg.inner}));
  } else if(cfg.cross){
    const t=Math.max(2,Math.floor(r/3));
    g.appendChild(svgNS('rect',{x:x-t,y:y-r,width:t*2,height:r*2,rx:'1',fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':'1'}));
    g.appendChild(svgNS('rect',{x:x-r,y:y-t,width:r*2,height:t*2,rx:'1',fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':'1'}));
    if(cfg.inner) g.appendChild(svgNS('circle',{cx:x,cy:y,r:'2',fill:cfg.inner}));
  } else {
    g.appendChild(svgNS('circle',{cx:x,cy:y,r:r,fill:cfg.fill,stroke:darken(cfg.fill),'stroke-width':r>=7?'2':'1.2'}));
    if(cfg.inner) g.appendChild(svgNS('circle',{cx:x,cy:y,r:Math.max(2,r-4),fill:cfg.inner}));
  }
}

function renderCities(){
  const cl=document.getElementById('L-cities');
  cl.innerHTML='';
  S.cities.forEach(city=>{
    const cfg=CITY_CFG[city.type]||CITY_CFG.borgo;
    const g=svgNS('g',{'data-cid':city.id});
    cityShape(cfg,city.x,city.y,g);
    const hit=svgNS('circle',{cx:city.x,cy:city.y,r:'20',fill:'transparent',style:'cursor:pointer'});
    g.appendChild(hit);
    cl.appendChild(g);
  });
}

function renderTower(){
  const tl=document.getElementById('L-tower');
  tl.innerHTML='';
  const {x,y}=S.tower;
  tl.appendChild(svgNS('circle',{cx:x,cy:y,r:'30',fill:'#d4a830',opacity:'.07'}));
  tl.appendChild(svgNS('circle',{cx:x,cy:y,r:'24',fill:'none',stroke:'#d4a830','stroke-width':'1','stroke-dasharray':'3,5',opacity:'.45'}));
  const bx=x-9,by=y-30;
  tl.appendChild(svgNS('rect',{x:bx,y:by,width:'18',height:'52',rx:'2',fill:'#e0cc8a',stroke:'#8B6914','stroke-width':'1.5'}));
  tl.appendChild(svgNS('rect',{x:bx-2,y:by-5,width:'6',height:'8',rx:'1',fill:'#ccba78',stroke:'#8B6914','stroke-width':'1'}));
  tl.appendChild(svgNS('rect',{x:bx+6,y:by-8,width:'6',height:'11',rx:'1',fill:'#d8c682',stroke:'#8B6914','stroke-width':'1'}));
  tl.appendChild(svgNS('rect',{x:bx+14,y:by-5,width:'6',height:'8',rx:'1',fill:'#ccba78',stroke:'#8B6914','stroke-width':'1'}));
  tl.appendChild(svgNS('rect',{x:bx+5,y:by+14,width:'8',height:'10',rx:'1',fill:'#d4a830',opacity:'.9','filter':'url(#fx-glow)'}));
  tl.appendChild(svgNS('line',{x1:x,y1:by-8,x2:x,y2:by-24,stroke:'#8B6914','stroke-width':'1.2'}));
  tl.appendChild(svgNS('polygon',{points:`${x},${by-24} ${x+13},${by-18} ${x},${by-12}`,fill:'#a02818'}));
  const t1=svgNS('text',{x,y:y+42,'font-family':'Cinzel,serif','font-size':'10','font-weight':'600',fill:'#d4a830','text-anchor':'middle',opacity:'.85','letter-spacing':'1','pointer-events':'none'});
  t1.textContent='Torre di Nartharion'; tl.appendChild(t1);
  const t2=svgNS('text',{x,y:y+53,'font-family':'IM Fell English,serif','font-size':'8','font-style':'italic',fill:'#a07820','text-anchor':'middle',opacity:'.7','pointer-events':'none'});
  t2.textContent='HQ DOOM-E'; tl.appendChild(t2);
}

function renderAll(){ renderRegions(); renderCities(); renderTower(); }

/* ── PAN / ZOOM ── */
const vp=document.getElementById('vp');
const stage=document.getElementById('stage');
let tx=0,ty=0,sc=1;
const MINSC=0.22,MAXSC=7;

function applyTransform(animate){
  const vw=window.innerWidth,vh=window.innerHeight;
  const mw=SW*sc,mh=SH*sc;
  tx=clamp(tx,Math.min(0,vw-mw),Math.max(0,(vw-mw)/2));
  ty=clamp(ty,Math.min(0,vh-mh),Math.max(0,(vh-mh)/2));
  stage.style.transition=animate?'transform .22s ease':'none';
  stage.style.transform=`translate(${tx}px,${ty}px) scale(${sc})`;
}
function initTransform(){
  const vw=window.innerWidth,vh=window.innerHeight;
  sc=clamp(Math.min(vw,vh)/SW*0.97,MINSC,MAXSC);
  tx=(vw-SW*sc)/2; ty=(vh-SH*sc)/2; applyTransform(false);
}
function c2s(cx,cy){ return [(cx-tx)/sc,(cy-ty)/sc]; }
function zoomAt(cx,cy,ns){
  ns=clamp(ns,MINSC,MAXSC);
  tx=cx-(cx-tx)*(ns/sc); ty=cy-(cy-ty)*(ns/sc);
  sc=ns; applyTransform(true);
}
document.getElementById('z+').addEventListener('click',()=>zoomAt(window.innerWidth/2,window.innerHeight/2,sc*1.5));
document.getElementById('z-').addEventListener('click',()=>zoomAt(window.innerWidth/2,window.innerHeight/2,sc/1.5));
document.getElementById('z0').addEventListener('click',()=>initTransform());
vp.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,sc*(e.deltaY<0?1.15:1/1.15));},{passive:false});

/* ── POINTER (pan + tap only) ── */
const AP=new Map();
let panBase=null,pinch=null,tapStart=null;
const TAP_MAX_MOVE=10,TAP_MAX_MS=300;
function getPans(){ return [...AP.values()].filter(p=>p.role==='pan'); }

vp.addEventListener('pointerdown',e=>{
  e.preventDefault();
  vp.setPointerCapture(e.pointerId);
  AP.set(e.pointerId,{cx:e.clientX,cy:e.clientY,role:'pan'});
  tapStart={cx:e.clientX,cy:e.clientY,t:Date.now()};
  const pans=getPans();
  if(pans.length===1){
    panBase={tx,ty,sx:e.clientX,sy:e.clientY};
    vp.classList.add('panning');
  } else if(pans.length===2){
    const [a,b]=[pans[0],pans[1]];
    const dx=b.cx-a.cx,dy=b.cy-a.cy;
    pinch={d:Math.sqrt(dx*dx+dy*dy),mx:(a.cx+b.cx)/2,my:(a.cy+b.cy)/2,tx,ty};
    tapStart=null;
  }
},{passive:false});

vp.addEventListener('pointermove',e=>{
  const ptr=AP.get(e.pointerId); if(!ptr) return;
  ptr.cx=e.clientX; ptr.cy=e.clientY;
  if(tapStart){
    const dx=e.clientX-tapStart.cx,dy=e.clientY-tapStart.cy;
    if(Math.sqrt(dx*dx+dy*dy)>TAP_MAX_MOVE) tapStart=null;
  }
  const pans=getPans();
  if(pans.length===1&&panBase){
    tx=panBase.tx+(e.clientX-panBase.sx); ty=panBase.ty+(e.clientY-panBase.sy);
    applyTransform(false);
  } else if(pans.length>=2&&pinch){
    const [a,b]=[pans[0],pans[1]];
    const dx=b.cx-a.cx,dy=b.cy-a.cy;
    const nd=Math.sqrt(dx*dx+dy*dy);
    const nmx=(a.cx+b.cx)/2,nmy=(a.cy+b.cy)/2;
    if(nd>0&&pinch.d>0){
      const ns=clamp(sc*(nd/pinch.d),MINSC,MAXSC);
      tx=nmx+(pinch.tx-pinch.mx)*(ns/sc)+(nmx-pinch.mx);
      ty=nmy+(pinch.ty-pinch.my)*(ns/sc)+(nmy-pinch.my);
      sc=ns;
    }
    pinch={d:nd,mx:nmx,my:nmy,tx,ty};
    applyTransform(false);
  }
},{passive:true});

vp.addEventListener('pointerup',e=>{
  AP.delete(e.pointerId);
  vp.classList.remove('panning');
  if(tapStart){
    const dt=Date.now()-tapStart.t;
    const dx=e.clientX-tapStart.cx,dy=e.clientY-tapStart.cy;
    if(dt<TAP_MAX_MS&&Math.sqrt(dx*dx+dy*dy)<TAP_MAX_MOVE) handleTap(e.clientX,e.clientY);
    tapStart=null;
  }
  const pans=getPans();
  if(pans.length===1){ panBase={tx,ty,sx:pans[0].cx,sy:pans[0].cy}; pinch=null; }
  else { panBase=null; pinch=null; }
},{passive:true});

vp.addEventListener('pointercancel',e=>{
  AP.delete(e.pointerId);
  if(AP.size===0){ vp.classList.remove('panning'); panBase=null; pinch=null; }
},{passive:true});

/* ── TAP: city info only ── */
function handleTap(cx,cy){
  const el=document.elementFromPoint(cx,cy);
  const cg=el&&el.closest('[data-cid]');
  if(cg){ showInfo(cg.getAttribute('data-cid')); return; }
  closeInfo();
}

/* ── INFO PANEL ── */
function setUIVisibility(v){
  ['zoom','compass','legend'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){ el.style.opacity=v?'':'0'; el.style.pointerEvents=v?'':'none'; }
  });
}
function openInfo(){
  document.getElementById('info-sheet').classList.add('open');
  setUIVisibility(false);
}
function closeInfo(){
  document.getElementById('info-sheet').classList.remove('open');
  setUIVisibility(true);
}
document.getElementById('info-close').addEventListener('click',closeInfo);
const infSheet=document.getElementById('info-sheet');
let _isy=0;
infSheet.addEventListener('touchstart',e=>{_isy=e.touches[0].clientY;},{passive:true});
infSheet.addEventListener('touchend',  e=>{if(e.changedTouches[0].clientY-_isy>70)closeInfo();},{passive:true});

function showInfo(cid){
  const city=S.cities.find(c=>c.id===cid); if(!city) return;
  const cfg=CITY_CFG[city.type]||CITY_CFG.borgo;
  // Icon in info panel
  const iconWrap=document.getElementById('ip-icon');
  if(iconWrap){
    iconWrap.innerHTML='';
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','-16 -16 32 32');
    svg.style.cssText='width:36px;height:36px;display:block';
    const g=document.createElementNS(NS,'g'); cityShape(cfg,0,0,g);
    svg.appendChild(g); iconWrap.appendChild(svg);
  }
  document.getElementById('ip-region').textContent=city.region;
  document.getElementById('ip-name').textContent=city.name;
  document.getElementById('ip-pop').textContent=city.pop;
  document.getElementById('ip-type').textContent=cfg.lbl;
  openInfo();
}

/* ── LEGEND ── */
function buildLegend(){
  const body=document.getElementById('leg-body');
  body.innerHTML='';
  Object.entries(CITY_CFG).forEach(([key,cfg])=>{
    const li=document.createElement('div'); li.className='li';
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('viewBox','-13 -13 26 26');
    svg.style.cssText='width:20px;height:20px;flex-shrink:0;overflow:visible';
    const g=document.createElementNS(NS,'g');
    cityShape(cfg,0,0,g); svg.appendChild(g);
    const wrap=document.createElement('div'); wrap.className='li-icon'; wrap.appendChild(svg);
    const lbl=document.createElement('span'); lbl.textContent=cfg.lbl;
    li.appendChild(wrap); li.appendChild(lbl); body.appendChild(li);
  });
}
document.getElementById('legend').addEventListener('click',()=>{
  document.getElementById('legend').classList.toggle('collapsed');
});

/* ── IMPORT ── */
const MAP_URL = 'https://peetah002.github.io/mappa.json';

function importMap(json){
  try{
    const data=JSON.parse(json);
    if(!data.regions||!data.cities) throw new Error('Formato non valido');
    S=data;
    if(!S.tower) S.tower={x:450,y:440};
    localStorage.setItem(SKEY,JSON.stringify(S));
    renderAll(); toast('Mappa importata ✓');
  } catch(e){ toast('Errore: file non valido'); }
}

// 🔄 Sync from GitHub
document.getElementById('btn-sync').addEventListener('click', async ()=>{
  toast('Caricamento...');
  try{
    const res = await fetch(MAP_URL + '?t=' + Date.now()); // cache-bust
    if(!res.ok) throw new Error('HTTP ' + res.status);
    const json = await res.text();
    importMap(json);
  } catch(e){
    toast('Errore connessione — prova a importare manualmente');
  }
});

// 📥 Import from local file
document.getElementById('btn-import').addEventListener('click',()=>{
  document.getElementById('file-input').click();
});
document.getElementById('file-input').addEventListener('change',e=>{
  const file=e.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=ev=>importMap(ev.target.result);
  reader.readAsText(file);
  e.target.value='';
});

/* ── INIT ── */
window.addEventListener('resize',initTransform);
try{
  const d=localStorage.getItem(SKEY);
  if(d){ S=JSON.parse(d); if(!S.tower) S.tower={x:450,y:440}; }
} catch(e){}
renderAll(); initTransform(); buildLegend();
</script>
</body>
</html>
