# FUND: retning "Instrument"

Skills: `impeccable` (`new-work`-sporet) valgt og forsøgt kaldt via Skill-værktøjet —
kunne ikke kaldes (`Unknown skill`-lignende, scriptstien pegede på en `.claude/skills/`
der ikke findes i denne worktree); læste derfor `C:/Users/thyge/.claude/skills/impeccable/
scripts/context.mjs` og `reference/new-work.md` fra disk og fulgte dem derfra, som CLAUDE.md
kræver ved en "Unknown skill". Efter orkestratorens tilføjelse læste jeg desuden
`frontend-design/SKILL.md` fra disk (kan ikke kaldes som plugin) og kørte dens to-trins
proces (plan → selv-kritik → kode) — se afsnittet nedenfor. Gik forbi `ui-ux-critique`
og `critique` (bygger, ikke reviewer) og `grillmig` (intet åbent beslutningspunkt at grille;
retningen er fuldt specificeret i briefet).

**Signaturelement, i én sætning:** Aflæsningslinjen — alle fire nøgletal står på én
tabulær mono-linje i faste, ens brede kolonner, samme rækkefølge på hvert kort og i en
delt "kanalhoved"-etikettering over hele gitteret, så siden læses som ét instruments
faste kanaler, ikke seks separate tabelrækker (som REGISTER) eller en billedtekst under
et foto (som VITRINE).

**Design-selvkritik (frontend-design-skillen), gjort FØR kode:** eneste frie akse er
tæthed/layout (palet og skrift er låst af DESIGN.md). Risikoen skillen navngiver — "hairline
rules, zero border-radius, dense newspaper columns" — er præcis den, briefet selv advarede
mod. Rettelse: alle indre kantlinjer mellem de fire kanaler er fjernet (kun kortets egen
ydre ramme og radius 12/8/6 er bevaret); adskillelse kommer af luft og vægt, ikke streger.

## 1. Hvad retningen påstår

Instrument-retningen viser alle fire nøgletal på hvert kort uden klik, i faste kolonner der
går igen fra kort til kort, og gør et datahul lige så synligt og genkendeligt som et tal.

## 2. Valgt / fravalgt

- **Valgt:** ren, byggetidsgenereret statisk HTML (som selve sitet) — **fravalgt:**
  klientside-JS-rendering (mit første udkast), fordi PRODUCT.md kræver at kataloget virker
  uden JavaScript, og en prøveside der er afhængig af JS ville modsige den regel unødigt.
- **Valgt:** én kontinuerlig mono-aflæsningslinje pr. kort — **fravalgt:** et 2×2-bokset
  mini-panel pr. kanal (tættere på dagens site), fordi det direkte genindfører den
  hårstregs-tætte "databaseværktøj"-stil, briefet bad om at undgå.
- **Valgt:** synligt mærke KUN på driftstidens lastbetingelse (kendt/ukendt) —
  **fravalgt:** dagens `fnote()`-mønster (altid-synligt tegn på ethvert forbehold).

## 3. Konfidens

- **HØJ** — 0 vandret overløb, 10/10 billeder indlæst, 0 kort beskåret >25%, ved BÅDE
  1440 og 390 px: `node C:/Praktik/websites/maalevaerktoej/maal.mjs http://localhost:8088/index.html 1440` (og `390`).
  Havde en kolonne skubbet et kort ud af sit spor, ville `vandretOverloeb` være >0.
- **HØJ** — 5 tilfældige tal på siden stemmer med `data/robots/*.yaml`: Spot vægt 33,8 kg;
  Go2 driftstid `~1–2 t`; Y10 letteste `±5,6 kg`; hero "77 robotter / 25 producenter";
  iagttagelsen "14 af 25 / 62 af 77". Kommando: `node -e` mod `dist-in/robots.json` +
  YAML-parseren (se commits). Var et tal opfundet, ville det afvige fra den citerede kilde.
- **HØJ** — 4 nøgletal synlige uden interaktion: verificeret ved at læse den udsendte
  `index.html` — `.aflaesning` har fire `.kanal`-elementer pr. kort i ren markup, intet
  `<details>`, ingen `:hover`-afsløring, ingen JS. Var et felt skjult bag et klik, ville
  markup vise en interaktiv kontrol i stedet for statisk tekst.
- **MIDDEL** — tilgængelighed (tabindex på kildemærker, fokus-synlig ring, kontrastpar):
  genbrugt VERBATIM fra system.css's allerede målte tokens/mønstre, men jeg har ikke selv
  genmålt kontrasten på den nye "last-tag"-styling med et værktøj denne session.

## 4. Målingerne

- `maal.mjs … 1440`: kort 6, rækker 2, spildtLodretPx 0, billeder 10/10 indlæst,
  beskåretOver25pct 0, vandretOverløb 0, sidehøjde 2239 px.
- `maal.mjs … 390`: kort 6, rækker 6, spildtLodretPx 0, billeder 10/10 indlæst,
  beskåretOver25pct 0, vandretOverløb 0, sidehøjde 4463 px.
- Forbeholdsmærker: 20 udfyldte talfelter på de 6 kort, 18 bærer et forbehold i kilden;
  5 fik en altid-synlig markering (kun driftstid-lastbetingelse), **13 (72% af de 18) er
  nu kun i `title` + skærmlæsertekst** — ned fra dagens mønster, hvor ALLE 18 ville vist en
  synlig `*`-chip.
- Billeder: 9 filer kopieret til `retninger/instrument/billeder/`, alle faktisk brugt
  (6 katalogkort + 3 unikke ekstra fra yderpunkterne; `microrobotech-movenew-p1` er delt).
- 3 commits på `spor/instrument` (gitignore-rettelse, CSS, HTML).

## Nye fælder og opdagelser

1. **Fabrikantfotos ville være havnet i git-historikken.** `retninger/instrument/billeder/`
   var IKKE dækket af det eksisterende `.gitignore`-mønster (kun `assets/fotos/fabrikant/**`
   er dækket) — havde jeg committet uden at tjekke, ville 9 fabrikantbilleder være gået ind i
   historikken i strid med den etablerede L13-regel. Rettet med en ny linje,
   `retninger/*/billeder/**`, så mønsteret dækker enhver fremtidig retningsmappe.
2. **"Last ukendt"-mærket lånte først samme stiplede hegn-kant som "ikke oplyst".** Fundet
   ved screenshotgennemsyn: en note på en UDFYLDT værdi så visuelt ud som endnu et hul.
   Rettet til ren, ubokset dæmpet tekst — kun "ikke oplyst" beholder den stiplede kant.
3. `const DATA = …` i en almindelig `<script>` bliver IKKE en egenskab på `window` — kun en
   global identifier. Irrelevant i det endelige (rent statiske) byg, men kostede en fejlfri,
   men forkert antagelse i det første JS-udkast, før jeg droppede klientside-rendering helt.
4. Node's ESM-loader accepterer ikke Windows-stien `C:\...` direkte som import-specifier —
   kræver enten en relativ sti fra scriptets egen placering eller en eksplicit `file:///`-URL.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks indholdspunkter, begge bredder, billedtjek og talstikprøven er udført.
