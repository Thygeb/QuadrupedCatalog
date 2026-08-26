# FUND: retning REGISTER

Skill valgt: `impeccable` (`new-work`), som briefet bad om. Gik forbi `ui-ux-critique` og
`critique`/`impeccable critique` (de dømmer et bygget resultat, ikke en ny retning) og
`grillmig` (er orkestratorens værktøj, ikke byggerens). Efter grillet feedback midtvejs
læste jeg desuden `frontend-design`-skillen fra disk (den kan ikke kaldes med
Skill-værktøjet — ikke installeret som plugin) og fulgte dens to-trins proces: kompakt
designplan → selvkritik mod broadsheet-kalibreringen → derefter kode.

## 1. Påstand

Siden er et register, ikke en montre: bygget til at blive slået op i, ikke læst top til
bund. Signaturelementet er en **bogstavskant** — rigtige HTML-ankre i en klikbar
tommelfingerfane, som et leksikons afskårne faner — der springer til producentnavne
faktisk til stede i data. Det er ikke broadsheet-avisspalter (ingen artikeltekst i
spalter, ingen nulradius-austeritet); det er en ledger, du slår op i.

## 2. Vind og pris

**Vind:** 12 robotter synlige i første 1000 px ved 1440 px (mod ca. 4 på den nuværende
side) — 3× tætheden, målt, ikke skønnet. Alle 77 står på én side uden JS-filter.

**Pris — ærligt:** siden har **ingen fotografier af nogen robot**. Læseren kan ikke se
formen, proportionerne eller "hvad er det for en ting" ved et blik — kun tal og navn.
Måltro-pladen (DESIGN.md) er heller ikke brugt. Det er en reel pris for den nysgerrige
fagperson, PRODUCT.md nævner som primær bruger: hun mister det visuelle
genkendelsespunkt, montreretningen giver hende gratis.

## 3. Konfidens

- **HØJ** — 0 opfundne tal: 5 celler (Spot/CyberDog/NEURA/ANYmal X/Trakr 20, ~15
  enkeltværdier) slået op i `dist-re/robots.json` og matcher siden ord for ord. Kommando:
  `node tools/build.mjs --ud=dist-re` + manuel diff mod skærmbillede. Var arbejdet
  forkert, ville et af de 15 tal afvige fra JSON — det gjorde ingen.
- **HØJ** — 0 vandret overløb, 0 klippede celler, 12 rækker synlige ved 1440×1000:
  genkørbar kommando nedenfor. Var layoutet forkert, ville `overflow` være >0 eller
  `klippedeCeller` >0 — begge var 0 før OG efter strammet tæthed.
- **MIDDEL** — "0 ser ud som et tal, ikke som et hul": ingen af de fire viste
  talkolonner har et ægte 0 i de 77 robotter, så påstanden er efterprøvet med en isoleret
  komponenttest (samme CSS-klasser, syntetisk 0-værdi), ikke på den leverede sides egne
  data. Kunne ikke gøres HØJ uden at ændre kolonnevalget.
- **HØJ** — 0 udokumenterede farver: `detect.mjs` fandt 2 (#DCEAF3, #0f6d9e), begge
  rettet til eksisterende tokens; genkørsel viser 0.

## 4. Målinger

Server: `python -m http.server 8089 --directory retninger/register` (fra worktree-rod).

```
node -e "import('file:///C:/Praktik/websites/maalevaerktoej/node_modules/playwright/index.mjs').then(async({chromium})=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1440,height:1000}});await p.goto('http://localhost:8089/index.html',{waitUntil:'networkidle'});console.log(await p.evaluate(()=>{const d=document.documentElement;const r=[...document.querySelectorAll('tr.post')];return{overflow:Math.round(d.scrollWidth-d.clientWidth),raekkerSynlige1000px:r.filter(e=>(e.getBoundingClientRect().top+scrollY)<1000).length,klip:[...document.querySelectorAll('table.ledger td')].filter(t=>t.scrollWidth>t.clientWidth+2).length}}));await b.close();})"
```

1440 px: `{ overflow: 0, raekkerSynlige1000px: 12, klip: 0 }` (nøjagtig konsoloutput) ·
390 px (samme kommando, viewport 390×1000): `{ overflow: 0, raekkerSynlige1000px: 1,
klip: 0 }` — kun 1, fordi hero/yderpunkter/iagttagelser fylder mere paa en smal skaerm,
ikke fordi noget er klippet · `node tools/build.mjs --ud=dist-re`: 77 robotter, 0
valideringsfejl, 1 advarsel (uaendret, ikke roert af sporet) · `detect.mjs`
(regex-degraderet): 32 advarsler, alle skala/radius, 0 farve-fund · Kort paa forsiden:
**77 af 77**, de 6 paakraevede markeret med `*`.

## Nye fælder og opdagelser

- `context.mjs`-scriptet fejler med `/c/Users/...`-stier i Git Bash (sti-oversættelse
  giver `C:\c\Users\...`); det kræver en Windows-sti (`C:\Users\...`) i single quotes.
- Et `<table>` tvunget til `display:block` for mobil-reflow efterlader et løst
  `<caption>` i sin oprindelige `table-caption`-rolle i Chromium — den blev ekstremt
  smal og høj, ikke fuld bredde. Rettelse: `caption{display:block;width:100%}` i samme
  medieforespørgsel.
- Ingen af de 77 robotter har et ægte 0 i egenvægt/nyttelast/hastighed/driftstid — de
  fire kolonner, jeg valgte til registret. "0 ser forskelligt ud fra et hul" kunne derfor
  kun efterprøves med en syntetisk komponenttest, ikke på siden selv.

## Punkter i briefet, jeg ikke nåede

(ingen — alle punkter i briefet er adresseret: hero, yderpunkter, iagttagelser, register
med de seks påkrævede robotter, afslutning, 1440/390-mål, kildetjek, fire tilstande)
