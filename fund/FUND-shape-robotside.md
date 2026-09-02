# FUND — spor/shaperobot: `impeccable shape` på robotsiden

**Leverance:** `fund/PLAN-robotside.md` (1.115 linjer). **Ingen kode rørt** — `git status --short` viser kun `fund/`. Base `a405066`, syv commits.

## Skills

**`impeccable shape` — kaldt med Skill-værktøjet fra worktreen, og kaldet LYKKEDES. Ikke læst fra disk.** (Fjerde datapunkt til noten om, at worktree-kald svinger: her virkede det.) `context.mjs` kørt én gang; `reference/shape.md` fulgt i fase 3's fulde syv-punktsform, fordi opgaven er selvstændig fladeplanlægning. `craft-floor.md` bevidst **ikke** hentet — skillen siger *"Do not load it for planning-only work."*

**Gået forbi:** `impeccable critique` + `ui-ux-critique` (fejljagt på bygget flade; en fejlliste kan ikke hæve loftet) · `impeccable new-work` (shape går kun derind, når den visuelle verden står åben — TYPESKILT er låst, L76–L80 netop truffet) · `frontend-design` (ny/omformet flade, ikke plan for en eksisterende) · `taste-skill:*` (dens egen første linje: *"not data tables"*) · `grillmig` (ude af workflow, aldrig på en designretning) · `robotdata`, `flet`, `parallelt`, `brief` (ingen robotpost, intet flet, ét spor, intet brief skrevet).

## Retning valgt / fravalgt

**Valgt: "Skiltet og Journalen".** Siden har én akt (skemaet, 53–68 % af siden) og har brug for to; foldens tomme højre spalte får optegnelsens tilstand. Kun **flytning, gruppering og sats** — ingen ny farve, skrift, radius, knap eller bevægelse.

**Fravalgt: en ny visuel retning** — L76–L80 er truffet i dag og led 2 flettet; en ny verden ville kassere det og genåbne fem lukkede punkter.

**Fravalgt: at folde tomme grupper sammen** — nærliggende, men i strid med hård begrænsning 5 og *"Gør hullet lige så formgivet som tallet"*. Skrevet frem, så næste læser kan se, at det blev afvist og ikke overset.

## Konfidens pr. påstand

| Påstand | Niveau | Kommando | Hvad tallet var, hvis arbejdet var forkert |
|---|---|---|---|
| Fund 1 (hover-zoom) rammer **ikke** robotsiden | **Høj** | `shape-hover.mjs <url> 1440 ".robot-foto img" ".robot-foto"` | Kontrollen på kataloget ville også vise `none`. Den viste `matrix(1.024,…)` |
| 18 forskellige `font-size` på én robotside @1440 | **Høj** | `shape-maal.mjs <url> 1440` | Apparatet ville ikke reproducere `maal.mjs`' sidehøjde 3763. Det gjorde det præcist |
| 49 elementer under skriftgulvet 10,5 px | **Høj** | `shape-regler.mjs <url> 1440` | Om-siden ville også fejle kontrollen. Den målte 62ch/18px/Literata, som DESIGN.md siger |
| Noteblok 85–92 % nede, fold 275–497 px tom | **Høj** | `shape-passer.mjs 1440 <12 slugs>` | Geometrifejl ville give anden `sidehøjde` end `maal.mjs`. Identisk (5536/3763/5846) |
| Billedspild gns 18,6 % · median 21,7 % · max 50,7 % | **Høj** | `shape-billedspild.mjs assets/fotos/fabrikant` | Ville ikke ramme browserens 50,7 % på lingmao-cyvet. Ramte på 0,0 point |
| **1148 af 1148 forbeholdstekster identiske da/en** | **Høj** | `node -e "…sammenlign advarsel-kroppe…"` | Var de oversat, var "KROP oversat" > 0. Den er 0 |
| Robotsidens syv blokke findes 0 gange i DESIGN.md | **Høj** | `grep -c '<navn>' DESIGN.md` | `.stribe*`, som ER dokumenteret, giver 6 — kontrollen skelner |
| Fund 3: nævneren forklares ikke | **Middel** | `grep` på synlig tekst → 1 forekomst af "33" | Efterprøvet på én robotside, ikke alle 77 |
| P1's blok **passer** i den tomme plads | **Middel** | `shape-passer.mjs`, 9 af 11 | Stikprøve på 12 af 77, og skrevet som stikprøve |
| At retningen er den rigtige | **Lav** | ingen | En retning kan ikke måles. Målingerne under den er høje; dommen er JPK's |

## Usikkerheder

- **Om P1 faktisk læses bedre.** At noten ligger dybt og folden er tom, er målt. At flytte den *dertil* er en vurdering.
- **Om `.enhed` ved 8,4 px bør hæves.** Jeg mener ja (*77* er ingenting, *77 kg* er et faktum) — men det rører alle flader, så det ligger hos JPK som S5.
- **11 avif/webp-fotos** kunne headerlæseren ikke måle; 65 af 76 er en stikprøve.
- **Om producentsiden reelt vil have S2's komponent.** Jeg har ikke set den flade.

## Målinger

`validate` **77/0/1** før og efter (76 fejl før fotokopi, alle miljø) · `build` **216 sider, 1111/0** · robotsider **154** · tæthedsspænd **0–24 af 33**, fem robotter på 0 · `v-ikke` **2946** af 8019 værdiceller = **36,7 %** · sidehøjde @1440 **3763–5846**, @390 **5063–8515** · skema **53,4–67,8 %** af siden · `font-size` **18/16/12** · under skriftgulv **49** @1440, **46** @390 · prosa over 68ch **4 af 6** (da) / **5 af 7** (en), værst **155ch** · Literata **0** tegn · tom fold **275–497 px** · noteblok **85–92 %** dybde · billedspild **18,6/21,7/50,7 %** · forbehold identiske da/en **1148/1148** · robotsidens blokke i DESIGN.md **0 af 7** · CSS-regler uden navn **≥76**.

**Tests ikke kørt** — koordinatoren frabad det (diskplads), og sporet ændrer ingen kode. **Serveren på 8234 er nede** (døde selv, se punkt 5). `tests/.tmp-koersel` blev **aldrig oprettet** her — intet at rydde.

---

## Nye fælder og opdagelser

1. **Den engelske side er ikke oversat, hvor den tæller — og fundet kom af en kontrol, der FEJLEDE.** Min danskdetektor gav "482 af 1148 blokke på `/en/` indeholder dansk". Kontrollen på `/da/` skulle give et markant højere tal; den gav **nøjagtig de samme to tal**. To identiske tal er ikke et sammenfald — det er beviset for, at man måler den samme streng. Direkte sammenligning: **alle 1.148 forbeholds- og notetekster er byte-identiske mellem da og en. Nul er oversat.** Etiketten (*Forbehold* → *Caveat*) er oversat, kroppen ikke. i18n-nøglerne er i fuld paritet (394/394, 0 manglende) — teksterne er **data**, ikke i18n-strenge, og derfor har intet fanget det. **Hører i et eget spor.** Uden det er halvdelen af sidens Read-løfte ikke indfriet på engelsk.

2. **En kontrol væltede også et tal, jeg allerede havde skrevet i planen.** Kildemærket skulle være **3.458**; jeg skrev **4.463**, som er `v-tal`s tal, genbrugt uden at køre kommandoen. Rutinekontrollen af afsnittets fire tal fangede det; de tre øvrige holdt. Rettelsen står i planen **med begrundelse** frem for at være redigeret væk.

3. **`grep '\bkort\b'` gav en falsk positiv på `kort-ophav`** — bindestregen er en ordgrænse. Var jeg stoppet der, havde jeg konkluderet, at robotsiden har et kort, og dermed at hover-zoomen rammer den. **Et ordgrænse-grep er ikke et bevis for en CSS-selektor.**

4. **`md5` duer ikke som serverkontrol for et spor, der ikke rører CSS.** Mit `system.css` er byte-identisk med mains, så kontrollen ser rigtig ud, uanset hvilken server der svarer. **`Last-Modified` mod egen `dist`-mtime skiller dem** (12:20:11 UTC mod mains 14:13:10 lokal). Hører samme sted som `hjoerne`-fælden.

5. **Et andet spor ramte min port 8234 — og serverloggen beviste, at det ikke skadede.** Loggen viser forespørgsler på `/da/robotter/addverb-trakr-20/` og `/` kl. 14:47:41–14:48:59, som jeg ikke lavede; serveren døde derefter med exit 1. **Min sidste måling sluttede 14:44:13 — tre minutter før den første fremmede forespørgsel.** Egen port pr. worktree er en konvention, ikke en garanti; **serverloggens tidsstempler er selv en kontrol**, og de er grunden til, at jeg kan sige, at ingen måling blev ramt i stedet for at håbe det.

6. **En YAML-optælling gav tavst 0, fordi filerne er CRLF.** `^noter:\n(  - .*\n)+` matchede intet. Kontrollen ("med + uden noter skal give 77") gav **78** og afslørede det. Efter `.replace(/\r/g,'')`: 63 robotter med noter, 147 noter, 47 % med VERSAL-optakt. **Uden kontrollen havde jeg skrevet "ingen robotter har noter" — et fuldstændig plausibelt nul.**

7. **DESIGN.md modsiger sig selv om skriftgulvet.** Den navngivne regel siger 10,5 px *"også i den smalleste ombrydning"*; dens egen komponentspec for kildemærket siger `max(8px,.34em)`. Ikke en af de fire kendte konflikter. Lagt til JPK som S5.

8. **Specifikationstætheden — PRODUCT.md's *"eneste rangering"* — vises slet ikke på kataloget.** Målt: 0 forekomster på sprogroden, sammenligningen, producentindekset og Om os. Den findes kun på robotsiden. Uden for min flade; hører i katalogsidens plan.

## Punkter i briefet, jeg ikke nåede

- **`/en/` ved 390 blev ikke skudt.** Jeg *målte* `/en/` ved både 390 og 1440 og skød `/en/` ved 1440, men det engelske mobilskud mangler. Målingen viser +0,3 % sidehøjde mod dansk, så risikoen vurderes lav — men det er en vurdering, ikke et skud.
- **Kun to af de tre robotter blev skudt ved 390** (movenew-p1, spirit-40 — ikke lingmao-cyvet). Det høje foto blev målt ved 390, ikke set.
- **Fund 3 er middel, ikke høj**, fordi nævnerforklaringen blev efterprøvet på én robotside og ikke på alle 77.
