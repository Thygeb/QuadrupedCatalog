# FUND — testpakken crasher, og to døde CSS-filer er en fælde

Målt 24. august 2026 i worktreen `udstilling-wt-test`, gren `spor/test`.

---

## Regel 0 — skill-vurdering

`ls .claude/skills/` (projekt: `grillmig`, `parallelt`, `robotdata`) og
`ls C:/Users/thyge/.claude/skills/` (globale: `critique`, `impeccable`, `ui-ux-critique`),
plus systemets fulde skill-oversigt.

| Skill | Valg | Begrundelse |
|---|---|---|
| **`code-review`** | **Valgt** | Kørt på den færdige diff (`git diff -- tests/koer.mjs`) via `Skill code-review low` — men den forkede kørsel så på et andet filsæt (sessionens udgangs-`git status`, ikke worktreens faktiske diff) og gav intet brugbart svar. Erstattet af selv-læsning af hele diffen plus fire baggrundsagenter (se nedenfor) |
| **`simplify`** | **Valgt, fulgt til punkt og prikke** | Fire baggrundsagenter (reuse/simplification/efficiency/altitude) sat i gang parallelt mod den samme diff, som skillen foreskriver. Fund og rettelser står i afsnittet "Simplify-runden" nedenfor |
| `robotdata` | Gået forbi | Ingen robotpost tilføjet, opdateret eller efterprøvet. `data/robots/` er direkte forbudt for dette spor |
| `impeccable` | Gået forbi | Ingen design- eller IA-planlægning. CSS-oprydningen her er en risikovurdering af to filer, ikke en visuel retning |
| `parallelt` | Gået forbi, begrundet | Opgaven er tildelt ÉN agent (mig) for hele arbejdet. De to opgaver (testfix, CSS-fælde) læser til dels samme kilder (skabelonerne, for at afgøre hvad testen skal forvente, og for at afgøre hvad CSS'en må miste) og skriver i forskellige, ikke-overlappende filer (`tests/koer.mjs` vs. ingenting rørt i CSS'en) — men at dele DEM ud til to agenter ville kræve, at begge først gennemførte den samme dybe undersøgelse af de levende skabeloner, hvilket er den dyre del. Ingen filkollision, men heller ingen gevinst ved at duplikere undersøgelsen |
| `grillmig` | Gået forbi | Ingen åben beslutning, der skulle grilles før den blev låst — opgaven var allerede skarpt afgrænset af briefet |
| `ui-ux-critique`, `critique`, `dataviz` | Gået forbi | Ingen bygget flade at kritisere, ingen grafik |

---

## Svaret kort

**(a) Testpakken.** Før: **145 ok / 3 FEJL / crasher: JA** (uhåndteret `ENOENT` på
`dist/stil.css`, linje 779 i den gamle fil). Efter: **190 ok / 7 FEJL / crasher: NEJ**
(kontrolleret exit 1, fordi der er 7 kendte, bevidst efterladte FEJL — se punkt "d.
7 tilbageværende FEJL" nedenfor).

**(b)** 29 assertions rettet, 1 tilføjet (netto), 0 slettet.

**(c)** 4 forventninger udledt af data i stedet for hardkodet.

**(d)** 142 CSS-regler (klasseselektorer) gennemgået i de to døde filer; 46 af dem
bruges af en levende skabelon og har INGEN modsvarighed i `system.css`/`generator.css`.
Filerne er **ikke slettet**.

**(e)** `node tools/validate.mjs` → 0 fejl. `node tools/build.mjs` → 0 fejl, 125 sider.
`node tools/linktjek.mjs` → 0 døde interne links.

---

## OPGAVE 1 — årsagen til crashet

`tests/koer.mjs` linje 779 (gamle nummerering) læste `dist/stil.css` direkte:

```js
const css = fs.readFileSync(path.join(dist, 'stil.css'), 'utf8');
```

`tools/build.mjs` kopierer aldrig en fil ved navn `stil.css` til `dist/` — det kopierer
`assets/system.css` → `dist/system.css` og `assets/generator.css` → `dist/generator.css`
(build.mjs L386-387, og siderne linker begge, ikke en tredje `stil.css`). `dist/stil.css`
har med andre ord **aldrig eksisteret** i dette byg. Et `fs.readFileSync` på en fil, der
ikke findes, kaster en uhåndteret `ENOENT`, og fordi ingen fangede den, døde HELE
Node-processen der — ikke kun assertionen. Alt efter linje 779 (afsnit 5, 6, i alt over
40 assertions) kørte aldrig, uanset om de var grønne eller røde.

Målt selv, uafhængigt af de to tidligere agenters tal: kørte `node tests/koer.mjs` på
den urørte gren og talte `ok`/`FEJL`-linjerne i outputtet før krascet:

```
145 ok
3 FEJL  (bygget taeller billedet i sin slutrapport, 11 HTML-sider bygget (fandt 19),
         alle fire tilstande har hver sin markoer i katalogets forklaring)
Error: ENOENT: no such file or directory, open '...\dist\stil.css'
    at tests/koer.mjs:779:18
```

Stemmer nøjagtigt med det tal, der stod i briefet. Krascet er bekræftet ÆLDRE end alt
arbejde i denne omgang.

### Hvorfor lige `stil.css`

Klassenavnene testen ledte efter i CSS'en (`tilstand--ikke-oplyst`, `tilstand--nej`,
`tilstand--kun-billede`, `maerke--nul`) findes **kun** i den døde `assets/stil.css` —
ikke i de levende filer, og ikke i nogen skabelon. Designsystemet er lagt om siden
testen sidst kørte hele vejen igennem: `tools/skabelon/side.mjs`s fælles
`tilstand()`/`tal()`-funktioner skriver i dag `v-ikke`, `v-nej`, `v-billede`, `v-nul`.
Testen pegede altså på en fil OG en navngivning, der begge hører til en tidligere
udgave af sitet — ikke to uafhængige fejl, men to symptomer på samme omlægning.

### Rettelsen

1. CSS læses fra de rigtige filer: `dist/system.css` + `dist/generator.css`.
2. Markørerne, testen leder efter, er rettet til `v-ikke`, `v-nej`, `v-billede`, `v-nul`.

Med det alene stopper krascet — men scriptet stødte straks på et NYT krasch længere
nede (`json.vaegtfordeling.under_20` på et `undefined`-objekt, i afsnit 6), fordi
`robots.json`s skema også er ændret. Løst i samme omgang, se nedenfor.

---

## Det forældede sidetal — udledt, ikke hardkodet

Linje 754 (gamle nummerering) forventede **11** HTML-sider fra 3-robot-prøvesættet
`tests/eksempel-robotter`. Målt direkte: `node tools/build.mjs --data=tests/eksempel-robotter
--ud=...` skriver i dag **19** sider. Braged af samme grund som `stil.css`: forsidesporet
har tilføjet producentsider og et producentindeks siden testen sidst blev opdateret
(build.mjs' egen kommentar ved L323-326: "Foer 24.08.2026 fandtes producentsiderne, men
INGEN side linkede til dem").

**Ny forventning, udledt — ikke et nyt hardkodet tal:**

```
forventetSider = 1                              // rodsidens sprogvælger
  + skema.SPROG.length × (                       // pr. sprog:
      2                                          //   forside + katalog
      + robotFiler.length                        //   én side pr. robot i FIXTUREN
      + (harProducentskabelon ? 1 + producentAntal : 0)   // producentindeks + pr. producent
    )
```

`skema.SPROG` importeres fra `tools/skema.mjs` (samme mønster som `NAEVNER`-testen i
afsnit 3b). Robot- og producentantal tælles direkte i `tests/eksempel-robotter/` (egen
fixture, jeg ejer den). Formlen gav 19 mod byggets faktiske 19 — efterprøvet. Ændrer
forsidesporet sidestrukturen igen (endnu en global side, eller producentindekset
fjernes), flytter tallet automatisk MED, fordi det læses af den samme kilde som
`build.mjs` selv bruger — ikke af en tredje, uafhængig gætning.

Samme mønster brugt tre andre steder (udledt i alt 4 gange, se punkt c):

- **Billedantallet** i "3c. Billedkaeden" (var hardkodet til `1`, forkert nu 43
  fabrikantfotos ligger lokalt i `assets/fotos/fabrikant/` per L13/S1 — de tælles ALTID
  med af `build.mjs`, uanset hvilket `--data=` der bygges, fordi kopikoden læser hele
  `assets/{fotos,silhuetter,ikoner}/`-træet). Rettet til at tælle billedfiler i
  `assets/` selv, med `skema.BILLEDMAPPER`/`skema.BILLEDE_ENDELSER` (de samme
  konstanter, build.mjs bruger til at afgøre, hvad der er et billede).
- **Vægtklasse-etiketten** på siden (`"Vægt ikke oplyst"`) læses nu fra
  `data/i18n/da.json`s `vaegtklasse_ikke_oplyst`-nøgle i stedet for skrevet i hånden.
- **Vægtfordelingen** (afsnit 6) — `robots.json.vaegtfordeling` findes ikke længere
  (se nedenfor); testen tæller den nu selv op af `json.robotter[].vaegtklasse`.

---

## De 29 rettede assertions — hvad ændrede sig, og hvorfor

Alle traceret til én af to årsager: (1) en ren navngivning i det nye designsystem, eller
(2) en RIGTIG regression i en forbudt fil, som IKKE er rettet — kun dokumenteret og
efterladt som FEJL (se afsnittet derefter). Ingen krav er sænket for at få noget grønt.

### Rene navngivninger (efterprøvet mod faktisk bygget markup, ikke gættet)

| Gammelt (testen forventede) | Nyt (koden skriver) | Fundet i |
|---|---|---|
| `tilstand--ikke-oplyst`/`--nej`/`--kun-billede`, `maerke--nul` | `v-ikke`, `v-nej`, `v-billede`, `v-nul` | `side.mjs` `tilstand()`/`tal()` |
| `class="operator"` + rå tekst mellem tegn og tal | `class="op" aria-hidden="true"` + `.kunskaerm` (skærmlæsertekst) + `<b class="num">` | `side.mjs` `tal()` |
| `"≈"` for cirka-operatoren | `"ca."` (dansk fagudtryk) | `side.mjs`, bekræftet af testens EGEN kommentar to linjer over den gamle assertion, som allerede sagde "ca." |
| `class="herkomst"` gentaget pr. tal | ét `class="dato"` pr. unik kilde i en delt `<ul class="kildeliste">`, med `class="kildemaerke"` som reference pr. tal | `side.mjs` `lavKilder()` |
| `vaerdi--ja`/`--nej` + glyfferne ✓/✗ | `v-ja`/`v-nej` + ordet "ja"/"nej", intet glyf i HTML'en | `side.mjs` `jaNej()`/`tilstand()` |
| `<tr data-slug=…>` i en `<table>`, filterform skjult for JS | `<article class="kort">`-kort, filterformularen ("styr") IKKE skjult (ren CSS `:has()`), kun fritekstsøgningen skjult for JS | `katalog.mjs`, `assets/katalog.js`s egen kommentar: "Filtrene virker uden JavaScript" |
| `data-vaegtklasse=`/`data-anvendelse=` | `data-vaegt=`/`data-anv=` (kortere attributnavne, samme mekanisme) | `katalog.mjs` L157 |
| `vaegtklasse--ikke_oplyst`-klasse | lokaliseret tekst i `<p class="t-mikro vaegtklasse">`, indholdet læst fra `da.json` | `side.mjs` `robotTop()` |
| `json.robotter[].vaegtklasse` som objekt (`{klasse, kg, operator, cirka, graensetilfaelde}`) | ren streng (ét af de fire ord) | `side.mjs` `vaegtklasse()` |
| "40 kg → over_40" | "40 kg → 20_40" | Se "Grænserettelsen" nedenfor — dette er IKKE en navngivning, men en efterprøvet regelrettelse |

### Grænserettelsen (den ene assertion, der IKKE er en navngivning)

Den gamle test forventede, at 40 kg lige akkurat lander i `over_40`. Nuværende kode
(`side.mjs`, `vaegtklasse()`): `if (kg <= VAEGTGRAENSER.over) return '20_40';` — 40 kg
lander i `20_40`. Rettet EFTER at have målt, ikke gættet: bygget på hele det rigtige
datasæt (`data/robots/`, 46 filer) med den nuværende kode giver **12/12/13/9**
(under_20/20_40/over_40/ikke_oplyst) — nøjagtig samme tal, som står skrevet direkte i
`side.mjs`s egen kommentar ("Maalt over data/robots/ 21.08.2026: 12 / 12 / 13 / 9").
Koden og dens egen dokumentation stemmer overens; det var testens ASYMMETRISKE
grænseregel (nedre grænse inklusiv opad, øvre grænse eksklusiv opad), der var forældet.

---

## d. De 7 tilbageværende FEJL — bevidst efterladt, IKKE rettet

Disse traceres til konkrete linjer i **forbudte** filer (`tools/skabelon/robot.mjs`,
`tools/skabelon/side.mjs`, `tools/skabelon/katalog.mjs`). Assertionerne beviser stadig
den oprindelige, aldrig-tilbagekaldte regel — de er IKKE svækket eller slettet. Jeg har
ikke rettet dem selv, fordi rettelsen kræver at røre filer, jeg ikke ejer i dette spor.

1. **"katalogtabellen markerer, at feltet har varianter"** — ingen erstatning fundet.
   `grep -c variant tools/skabelon/katalog.mjs` giver 0 træf. Enten mangler markeringen,
   eller den er flyttet et sted, jeg ikke har fundet.

2. **"interval 18-25 kg kollapser ikke til sit midtpunkt"** — `side.mjs`s `vaegtIKg()`
   regner et interval som `(min+maks)/2`. Et felt skrevet `18-25 kg` bliver til 21,5 kg
   og klassificeres som `20_40`, selv om 18 kg reelt ligger i `under_20`. Det er
   PRÆCIS den kollaps til midtpunktet, testens eget navn (uændret siden den blev
   skrevet) advarer imod, og der findes intet erstatnings-flag, der viser læseren
   uklarheden.

3.–5. **L27 (anvendelse er en mængde, ikke en rækkefølge)** — `side.mjs`s
   `anvendelse()`, L626: `vaerdier = (Array.isArray(raa.vaerdi) ? raa.vaerdi :
   [raa.vaerdi])` — rå YAML-rækkefølge, ingen sortering. To robotter med samme
   kategorisæt i modsat rækkefølge får forskellige arrays i `robots.json`. Målt
   direkte: `["logistik","industri","sikkerhed_overvaagning"]` mod
   `["sikkerhed_overvaagning","industri","logistik"]`. STATUS.md's L27 blev besluttet
   FOR at undgå netop dette ("ingen af værdierne er hovedkategorien"). To følgeassertions
   (samme rækkefølge på tværs af sider, alle tre kategorier vist) fejler af samme årsag
   — og desuden fordi `anvendelseBlok()` i `robot.mjs` (L518-549) regner en `vaerdier`-
   liste ud, men ALDRIG bruger den i den HTML, den returnerer. Kategori-mærker vises på
   katalogkortet (`side.mjs`s `anvendelse().maerker()`), men ikke på robottens egen side.

6.–7. **L23 (arv skal ses)** — `robot.mjs` L539: `arvet = a.arvet_fra ? '<p class="t-mikro
   arvet">' + a.arvet_fra + '</p>' : ''`. Det er den RÅ SLUG ("l-mor"), ingen `<a href>`,
   intet visningsnavn, og forklaringsteksten på L547 er den SAMME uanset arv (ingen
   "vores slutning"-variant). L23's krav — moderens navn, et link, og en tydelig
   markering af at koblingen her er redaktionel — er ikke indfriet i den nuværende kode.

**Ingen af disse 7 er rettet af mig.** De er efterprøvet mod kildekoden linje for linje,
ikke gættet, og de peger alle på konkrete steder i filer, dette spor ikke ejer.

---

## OPGAVE 2 — de to døde CSS-filer

`assets/stil.css` og `assets/sider.css` indgår ikke i noget byg — bekræftet: kun
`system.css` og `generator.css` linkes i den faktiske HTML (`grep '<link rel=
"stylesheet"'` på en bygget side giver præcis de to, ingen tredje).

### stil.css — den ene fælde, briefet pegede på

Filens egen header siger det selv: *"Den visuelle retning (Å2) er IKKE besluttet...
Skift den ud, når `impeccable → new-work` har kørt."* Den definerer sit EGET `:root`
med andre værdier end de levende:

| Variabel | `stil.css` (død) | `system.css` (levende) |
|---|---|---|
| `--blaek` | `#17191c` | `#14161A` |
| `--bund` | `#ffffff` | `#F2F3F5` |
| `--linje` | `#d8dbdf` | `#E3E5E9` |

Linkes filen nogensinde ved et uheld, skifter siden farve stille — præcis den fælde,
briefet advarede om.

### sider.css — en ANDEN slags fælde, ikke en variabel-fælde

`sider.css` definerer **ingen** `:root` og **ingen** egne farver. Dens egen header:
*"Lægger sig OVEN PÅ assets/system.css... Hver eneste værdi nedenfor er en polet fra
system.css' :root... Indlæses EFTER system.css. **Bygget skal kopiere begge til
dist/.**"* — skrevet 21. aug 2026, SAMME dag som `generator.css`. Den er ikke en
forladt prototype som `stil.css`; den ligner en frastødt/parallel version af det, som
`generator.css` siden overtog, kun delvist.

`generator.css`s egen kommentar bekræfter det direkte (L239-242): klassen
`.billedled--stor`, som `robot.mjs` rent faktisk bruger, "stod uden regel her — dens
eneste styling laa i den forladte sider.css." Ordet er "forladte" — den er bevidst
opgivet, ikke glemt, og forsidesporet flytter regler over derfra, ÉN AD GANGEN, når
de opdager et hul (som `.billedled--stor`).

### Regler gennemgået og talt

Metode: hver klasseselektor i de to filer sammenlignet mod `system.css`+`generator.css`
(ingen match = ikke i live-bygget). For dem uden match: søgt som `class="…navn…"` i
`tools/skabelon/*.mjs` (ikke bare et løst ordmatch — se metoden i self-tjekket).

| | Klasseselektorer talt | Uden modsvarighed i levende CSS | ...og bruges af en skabelon (RISIKO) |
|---|---|---|---|
| `stil.css` | 59 | 48 | **2** (`.variant`, `.noter`) |
| `sider.css` | 83 | 44 | **44** |
| **I alt** | **142** | **92** | **46** |

(91 + 130 = 221 CSS-regelblokke (åbne krøllede parenteser) i de to filer sammenlagt —
det tal, hvis "regler" tælles som blokke i stedet for unikke klassenavne.)

**De 46 er den fulde liste af `.billedled--stor`-lignende tilfælde.** Ud over
`.variant`/`.noter` (stil.css) er ALLE 44 klasser fra `sider.css`, der ikke findes i den
levende CSS, bekræftet brugt i `robot.mjs`/`producent.mjs`s faktiske `class="…"`-
attributter (ikke bare et løst ordmatch — verificeret med `grep -n 'class="[^"]*\bX\b'`
mod skabelonkilden for hver enkelt, stikprøvet direkte i outputtet ovenfor i denne
session):

```
side, retur, robotside, producentside, robot-top, robot-foto, billedfod, robot-navn,
aar, robot-varianter, variantnavn, feltvaerdi, v-liste, advarsel-navn, variant,
variant--navn, stribe--fem, stribe-under, stribe--intet-kort, eu-blok, eu-krop,
eu-ikon, eu-forklaring, produktside, produktside-url, anvendelse-citat, anvendelse,
arvet, skema, skema-titel, skema-taeller, skema-krop, skema-gruppe, noter, kilder,
producent-top, producent-fakta, hjemsted, eu-tabel, eu-tom, prodliste, pnavn, pland,
pantal   (sider.css — 44)
variant, noter   (stil.css — 2, samme to klasser som ovenfor, allerede talt med)
```

`class="side"` er særligt alvorligt — det er den YDERSTE `<main>`-wrapper på BÅDE
robot- og producentsider (`robot.mjs` L716, `producent.mjs` L356+L411).

**En anden slags fund, værd at nævne:** `.advarsel` findes i BÅDE `stil.css`
(`border-left: 3px solid var(--advarsel)`, farvet baggrund) OG `generator.css`
(`border-left: 2px solid var(--hegn)`, dæmpet baggrund) — med FORSKELLIGE værdier for
en klasse, der ER i live-bygget. Ikke en del af de 46 (den har jo en modsvarighed), men
samme underliggende fare: linkes `stil.css` NOGENSINDE ved siden af `generator.css`,
overskriver kaskaden advarselsboksens udseende afhængigt af linkrækkefølgen.

### Beslutning: filerne er IKKE slettet

Betingelsen fra briefet ("Er der bare én regel i tvivl, så slet ikke filen") er langt
overskredet — 46 klasser, ikke én. `sider.css` er desuden efter al sandsynlighed den
korrekte, opdaterede kilde for disse 44 klasser (skrevet samme dag som `generator.css`,
bruger dens tokens, eksplicit dokumenteret som forsidesporets egen abandonment). At
slette den nu ville fjerne den sidste reference, forsidesporet selv migrerer FRA, ét
fund ad gangen.

**Ingen regler flyttet af mig.** `assets/system.css` og `assets/generator.css` er
forbudte filer i dette spor.

---

## Simplify-runden

Fire baggrundsagenter sat i gang parallelt mod `git diff -- tests/koer.mjs`, én pr.
vinkel (reuse, simplification, efficiency, altitude), som `simplify`-skillen
foreskriver.

**Efficiency**: intet fundet. Diffen fjerner ét redundant modul-genimport-mønster
(skema/yaml hoistet til toppen) og tilføjer kun single-pass læsninger.

**Reuse + Simplification** (to agenter, samme to fund uafhængigt af hinanden):

1. `taelBilledfiler()` (billedtal i afsnit 3c) genimplementerede build.mjs' eget
   kopifilter (`BILLEDMAPPER`, `BILLEDE_ENDELSER`, dotfil/LÆSMIG-udelukkelse) for at
   FORUDSIGE et tal, i stedet for at måle det, bygget faktisk skrev — en tredje
   håndskrevet kopi af det samme rekursive gaa()-mønster, der allerede stod to steder
   i filen.
2. Operator-regex'en (`<span class="op">…</span>…<b class="num">…`) blev bygget tre
   gange i hånden (">", "ca.", "≤") med kun operator/tal/enhed forskellig.

**Altitude** (samme første fund, plus ét til): pegede præcist på HVORFOR fund 1 er en
altitude-fejl, ikke kun en stil-fejl: testen bygger allerede til `kaedeDist` og læser
selve de kopierede filer to linjer over — at forudsige et tal fra kildefiltrering i
stedet for at tælle den faktiske postcondition er den samme "to læsninger af samme
regel"-fejl, build.mjs' egen kommentar (L186) advarer imod, bare flyttet ind i testen.
Andet fund: `harProducentskabelon` målte kun `fs.existsSync(producent.mjs)`, ikke om
modulet rent faktisk eksporterer `renderIndeks` — build.mjs' egen gate for
producentindekset (L327) er strengere end det. De to gates giver samme svar i dag,
men kun fordi `producent.mjs` tilfældigvis har begge — en fremtidig ændring, der
fjerner `renderIndeks` uden at fjerne filen, ville få formlen til at tælle én side for
meget pr. sprog, tavst.

**Rettet, alle fire**:

- `taelBilledfiler()` fjernet. Erstattet af en delt `taelFilerRekursivt(dir, filtrer)`
  (skrevet ét sted, ved siden af `skema`/`yaml`-importen) og et kald, der tæller de
  FAKTISKE filer i `kaedeDist/billeder/` efter bygget - måling, ikke forudsigelse.
- `lasRobotter(mappe)` tilføjet (samme sted) og brugt til sidetals-fixturen i afsnit 4,
  så "læs en mappe YAML og normalisér dem" kun står ét sted i filen, ikke ét ekstra
  sted pr. brug.
- `operatorRegex(op, tal, enhed)` tilføjet og brugt på alle tre operator-tilfælde
  (">", "ca.", "≤") - én regel at rette, hvis `side.mjs`s markup flytter sig igen.
- `harProducentskabelon` erstattet af `harProducentindeks`, som importerer
  `producent.mjs` dynamisk og tester `typeof mod.renderIndeks === 'function'` - den
  PRÆCISE betingelse, `build.mjs` selv bruger (L327), ikke en proxy for den.

**Ikke rettet:** de to PRÆ-EKSISTERENDE rekursive filvandringer (linje ~706 og ~780 i
den nuværende fil), som reuse-fundet også nævnte som del af mønsteret. De er urørt
kode uden for denne opgaves diff, allerede grønne, og at flette dem ind i den nye
`taelFilerRekursivt()` ville udvide ændringen til afsnit, ingen fejl er fundet i - en
bevidst afgrænsning, ikke en overset rest.

Efterprøvet: `node tests/koer.mjs` gav **samme** 190 ok / 7 FEJL / crash NEJ efter alle
fire rettelser, og `node tools/validate.mjs` / `build.mjs` / `linktjek.mjs` blev kørt
igen med samme resultater som før (0 fejl / 125 sider / 0 døde links) - rettelserne
ændrede ingen adfærd, kun hvordan den bevises.

---

## Selv-tjek med tælling

- **Testkørsel talt selv, tre gange**: før (baseline på urørt gren, 145/3/crash JA),
  midtvejs efter crash-fix alene (188 ok/9 FEJL/crash NEJ), og efter alle rettelser
  (190 ok/7 FEJL/crash NEJ, stabilt over to gentagne kørsler).
- **29 rettede assertions talt** ved at gennemgå hele diffen linje for linje og
  klassificere hver ændrede `ok(...)`-kaldsted som "rettet" (samme kaldsted, ny
  betingelse/tekst) — ikke gættet ud fra antal linjer ændret.
- **`ok(`-kaldssteder talt før/efter**: 102 → 103, matcher regnestykket 29 rettet
  (samme antal kaldssteder) + 1 nettotilføjet (splittet "filterformularen er skjult" i
  to mere præcise påstande) + 0 slettet.
- **142 CSS-klasseselektorer talt** maskinelt (regex over begge filer), **46 uden
  modsvarighed OG brugt i en skabelon** efterprøvet ÉN AD GANGEN mod faktisk
  `class="…"`-tekst i `tools/skabelon/*.mjs` (ikke løst ordmatch — en første, løsere
  automatisk gennemgang gav falske positiver som `top`, `note`, `filter`, som viste sig
  at være JS-variabelnavne og `.filter()`-metodekald, ikke CSS-klasser; disse er
  udelukket fra de 46).
- **`node tools/validate.mjs`, `node tools/build.mjs`, `node tools/linktjek.mjs`** kørt
  til sidst mod den fulde, rigtige `data/robots/`-mappe (46 filer) — 0 fejl, 125 sider,
  0 døde links, alle tal skrevet af selve kommandoerne, ikke udledt.

## Selv-review — hvad jeg er usikker på

- **De 7 efterladte FEJL kan være for konservativt behandlet.** Jeg har sporet hver af
  dem til en konkret linje i en forbudt fil og argumenteret for, at det er en reel,
  udokumenteret regression — ikke en stale test. Men jeg kan ikke udelukke, at
  forsidesporet ALLEREDE ved det og har det på sin egen liste (fx er `.billedled--stor`
  bevis på, at de aktivt migrerer fra `sider.css` én ting ad gangen — måske er
  anvendelses-mærkerne og arve-linket næste på DERES liste, ikke en overraskelse for
  dem). Jeg har ikke haft adgang til deres interne status ud over det, der står skrevet
  i kildekodens kommentarer.
- **"46 klasser i risiko" er en øvre grænse, ikke en garanti for 46 reelle visuelle
  fejl.** Nogle af dem (fx `.variant`, `.variant--navn`) sidder som direkte børn af en
  flex-container (`.varianter{display:flex}` i `generator.css`), så de vil layoute
  nogenlunde fornuftigt selv uden egen regel — andre (fx `.side`, `.skema`,
  `.feltvaerdi`) er strukturelt langt federe og vil sandsynligvis se tydeligt forkerte
  ud. Jeg har ikke renderet siderne i en browser og screenshot-sammenlignet for at
  rangere alvoren — det ville kræve visuelt arbejde, jeg ikke har værktøj til i dette
  spor, og opgaven bad specifikt om en LISTE, ikke en prioritering.
- **`code-review`-skillen gav intet brugbart resultat** (den forkede kørsel så på
  `.claude/settings.json`, ikke på `tests/koer.mjs`-diffen — formentlig fordi den kørte
  mod et andet udgangspunkt end denne worktrees faktiske `git status`). Jeg har ikke
  fundet årsagen til det og har i stedet læst hele diffen selv og suppleret med
  `simplify`-skillens fire baggrundsagenter. Værd at nævne, hvis skillen skal bruges
  igen i dette projekt.
- **Sektion 6's rettede tal (1/5/1/6-fordelingen) afhænger af, at g-interval fortsat
  klassificeres som `20_40`** af den nuværende (uafklarede) midtpunkts-kollaps. Ændrer
  forsidesporet `vaegtIKg()` for at rette punkt 2 i FEJL-listen, skal fordelingstallet
  1/5/1/6 efterregnes igen — det er skrevet ud i en kommentar i koden, men jeg kan ikke
  garantere, at en fremtidig læser finder den kommentar før tallet driller igen.
- **Ingen af de 190 nu-grønne assertions er ny funktionalitetstest** — alle 29 rettede
  beviser den SAMME regel som før, bare med korrekt navngivning/kilde. Jeg har ikke
  tilføjet dækning for noget, testen ikke allerede forsøgte at bevise.
