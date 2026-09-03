# PLAN — sammenligningssidens flade

**Spor:** `spor/samlplan`, 3. sep 2026. **Skill:** `spor` (kaldt), derefter `impeccable shape`
(kaldt, `reference/shape.md` + `reference/operate.md` læst). Shape fase 1 er et
opdagelsesinterview; der er ingen at spørge herinde, så skillens egen undtagelse gælder —
*"When no human or structured answer mechanism exists, mark assumptions plainly, return the
brief, and stop."* Briefet bærer svarene (JPK's tre krav), og planen går derfor direkte til
shape fase 3.

**Planen bygger ikke noget.** Den foreskriver, med målte tal, hvad der skal bygges, og af
hvem — og den siger nej til to ting, briefet foreslog.

---

## MODE: Operate

Den besøgende løser en opgave: **afgøre hvilken robot der passer**, og kunne begrunde det.
Ikke Read. Konsekvensen er ikke kosmetisk — den afgør, hvad hvert forslag herunder dømmes på:

| Operate dømmer på | Betyder her |
|---|---|
| Skanbarhed | Kan man følge **én række** på tværs af 1.336,8 px uden at miste den? |
| Konsistens | Ser samme værdi ens ud på robotsiden og her? |
| Den rigtige brugsscene | 33 rækker × op til 3 plader, hvoraf 9 rækker er helt tavse |
| Præcision i detaljen | Tre tilstande — *ikke oplyst*, *nej*, *0* — skal kunne skelnes |

Operate tillader tæthed og forbyder udtryk for udtrykkets skyld. Det er derfor, K2 herunder
ender med **ét** nyt skel og **ingen** 33-dobbelt stregning.

---

## Fladen, som den faktisk er — målt, ikke antaget

Grundmåling først: `node tools/validate.mjs` → **77 filer · 0 fejl · 1 advarsel**.
(I en frisk worktree giver den **76 fejl**, alle R18, fordi `assets/fotos/fabrikant/`
er gitignoreret. Kopieret ind fra hovedrepoet, 610 filer, før noget blev målt.)
`node tools/build.mjs` → **216 sider**, 107 pr. sprog. Server på port **8141**, verificeret
mod disken (`daek__enhed`: 15 = 15, `saml-raekke__navn`: 3 = 3).

Alt herunder er målt i browseren på `http://localhost:8141/da/sammenligning/`.

### F1. Der findes ingen vandrette streger i matricen. Ikke svage — fraværende.

Dette vender K2 på hovedet, så det står først.

`generator.css:604` sætter `.saml-raekke > *{border-top:1px solid var(--linje)}`.
`generator.css:589–590` sætter `.saml-raekke > th,.saml-raekke > td{border-top:0}`.
Den anden er **(0,1,1)**, den første **(0,1,0)** — specificitet slår kilderækkefølge, så
regel 604 taber. Og hver eneste celle i en `.saml-raekke` **er** enten en `th` eller en `td`.

Målt på hver celle i tabellen med `getComputedStyle`:

| Element | Antal | `border-top` |
|---|---|---|
| `th.saml-raekke__navn` | 33 | `0px none` |
| `td.saml-raekke__celle` | 99 | `0px none` |
| `th.saml-gruppe__titel` | 6 | `0px none` |
| `th.specimen` | 3 | `0px none` |
| `td.specimen-hoved__hjoerne` | 1 | `0px none` |

**Regel 604 er død CSS.** Briefets præmis — *"Rækkestregen findes allerede … den kan bare ikke
ses (1,56:1)"* — er forkert: den kan ikke ses, fordi den ikke tegnes. Det er `fil:linje`-fælden
i ren form; reglen findes, og ingen kalder den.

Det, der **er** synligt, er lodret: `border-left:1px solid var(--linje)` på 99 celler
(brugt bredde målt til **0,8 px** ved `devicePixelRatio` 1 — årsagen er ikke isoleret) og
`box-shadow:1px 0 0 var(--linje)` på det klæbende rækkehoved.

### F2. Kolonnebredderne, i tre tilfælde

`table-layout` er **`auto`** (målt som *computed*, ikke som fravær i kilden). Ved 1440 px:

| Udvalg | Rækkehoved | Kolonner | Forhold bred:smal |
|---|---|---|---|
| P1 (24 felter) + BabyAlpha (0) | 224 | 917,7 · 195,1 | **4,70×** |
| P1 (24) + BabyAlpha (0) + Laikago (0) | 224 | 728,7 · 195,1 · 189,0 | **3,86×** |
| 3 × WEILAN (alle tynde) | 224 | 427,9 · 371,0 · 313,9 | 1,36× |

Briefets *"omtrent dobbelt så bred"* er altså det **milde** tilfælde. Værste målte er 4,70×,
og det opstår med **to** plader — ikke tre. Lige deling ville være 370,9 px ved tre.

### F3. Gruppetitlens klæbning virker ikke

`.saml-gruppe__titel{position:sticky;left:0}` (`generator.css:595`) sidder på en
`th colspan="4"`. Målt ved 390 px, `.saml-rulle.scrollLeft` 0 → 250:

- `.saml-raekke__navn` (rækkehovedet): venstre kant **16 → 16 px**. Klæber. ✓
- `.saml-gruppe__titel`: venstre kant **16 → −234,4 px**. Klæber ikke. ✗

Mekanismen: `sticky` flytter **kassen**, og denne kasse er hele rullebredden bred, så der er
intet at flytte. CSS-kommentaren ved siden af siger, at den klæber *"så den ikke forsvinder
under vandret rulning"*. Den forsvinder. Uændret af `table-layout`, målt i begge tilstande.

### F4. Enhedskontakten står allerede i topbaren

`side.mjs:2150` skriver `<label class="enhedsskift" for="enhedsskift">` i `.daek__enhed` på
**alle 107** danske sider. `system.css:2399` skjuler den, og `system.css:2411–2413` viser den
kun via `:has()`, når siden har en `.enhedsskift__boks`. Landet i commit `8bd39b3`
(*"PUNKT 2: enhedsvælgeren samlet i topbaren"*), som er forfader til dette spors gren.

Målt i den byggede `dist/da`:

| | Tal |
|---|---|
| `<header class="daek">` | 107 / 107 |
| `class="enhedsskift"` (etiketten) | **107 / 107** |
| `id="enhedsskift"` (den fysiske boks) | 72 / 107 |
| Kontakten synlig på robotside | **ja** — 300 × 36 px ved x = 1080,8 |
| Kontakten synlig på katalog | **nej** — `display:none` |

Briefets *"`side.mjs` … tegner den **0** gange"* er forkert: `side.mjs` tegner etiketten
107 gange. Briefet målte `id=`, som er boksen, og boksen ejes stadig af `robot.mjs` og
`sammenligning.mjs`. Se `## K3` for, hvad JPK så i stedet.

### F5. Ingen rækkemarkering, og en lang rejse for øjet

- Regler, der matcher `.saml-raekke…:hover`, læst ud af CSSOM: **0**.
- `focus-within` i hele `generator.css`: **1** (ikke i matricen).
- Øjets rejse fra feltnavnets venstre kant til sidste celles højre kant ved 1440: **1.336,8 px**.
- Rækkehøjde: median **43,7 px**, mindste 43,7, største 70,2.
- 33 rækker, 6 grupper, **9 helt tavse rækker**.

### F6. En klasse uden CSS

`assets/sammenligning.js:526` sætter `saml-raekke__celle--tavs` på hver tavs celle — målt
**42 af 66** ved to plader. Forekomster i `system.css` + `generator.css`: **0**.
En færdig, gratis krog, som ingen har brugt.

### F7. Loftet er tre plader, ikke fem

`tools/skabelon/sammenligning.mjs:228` sætter `maksAntal: 3`, efterprøvet i den byggede
HTML (`"maksAntal":3`). Briefet beder om en beskrivelse ved **4 og 5** valgte robotter.
De tilstande **kan ikke opstå**. De er beskrevet under K1 som betingelse, ikke som
tilfælde.

---

## K1 — lige kolonnebredder

**Forskriften er én erklæring:**

```css
.saml-matrix{table-layout:fixed}
```

**Den eksplicitte bredde på rækkehoved-kolonnen, briefet efterlyser, findes allerede** — tre
steder, og alle tre bliver respekteret af `fixed`:

- `generator.css:434` `.specimen-hoved__hjoerne{…width:224px;min-width:224px}`
- `generator.css:607–608` `.saml-raekke__navn{…width:224px;min-width:224px}`
- `generator.css:679` ved ≤720 px: begge til `150px`

`table-layout:fixed` læser **første rækkes** bredder, og første række er `.specimen-hoved`,
hvis hjørnecelle allerede bærer de 224 px. Målt: hjørnet står på **224,0** før og efter, og på
**150,0** ved 390 px. Der skal altså ikke tilføjes en bredde. En fjerde kopi af det samme tal
ville være D7/L30-fælden — et håndskrevet tal ved siden af et, der allerede udledes.

**Virkningen, målt på samme side med kun `table-layout` skiftet:**

| Tilfælde | `auto` (i dag) | `fixed` |
|---|---|---|
| 2 plader, 1440 | 224 · 917,7 · 195,1 → **4,70×** | 224 · 556,4 · 556,4 → **1,00×** |
| 3 plader, 1440 | 224 · 728,7 · 195,1 · 189,0 → **3,86×** | 224 · 370,9 · 370,9 · 371,0 → **1,00×** |
| 3 plader, 390 | tabel 662 px · 150 · 224,9 · 149,4 · 137,8 | tabel **640** px · 150 · 163,3 · 163,3 · 163,4 |

**Prisen — og det er hele prisen:**

| | 2 plader @1440 | 3 plader @1440 | 3 plader @390 |
|---|---|---|---|
| Sidehøjde `auto` | 2.561 | 2.550 | 3.356 |
| Sidehøjde `fixed` | 2.657 | 2.742 | 3.716 |
| Forskel | +96 px (+3,7 %) | +192 px (+7,5 %) | +360 px (+10,7 %) |

Det, der **ikke** koster noget, målt i samme kørsler:

- Celler med indholdsoverløb: **0 af 102** ved 1440, **0 af 99** ved 390 — i begge tilstande.
- Vandret overløb på siden: **0** i alle seks målinger.
- `.saml-rulle`s rullelængde ved 390: **319 → 297 px**. Fixed ruller **mindre**, ikke mere.

**De to omkostninger, briefet beder om stilling til:**

1. **Den klæbende venstrekolonne er upåvirket.** Målt ved 390 px, `scrollLeft` 0 → 250:
   `.saml-raekke__navn` står på venstre kant **16 → 16 px** i *både* `auto` og `fixed`.
   `position:sticky` og `table-layout` rører ikke hinanden. (Gruppetitlens klæbning er
   allerede i stykker, F3 — men den er lige meget i stykker før og efter, så den er ikke
   K1's regning at betale.)
2. **`.saml-matrix{min-width:640px}` ved ≤820 px bliver mere sand, ikke mindre.** Under `auto`
   presser indholdet tabellen til 662 px; under `fixed` lander den præcis på de 640, reglen
   siger. Ingen ændring nødvendig.

**Ved 2 og 3 plader** står tallene i tabellen ovenfor. **Ved 4 og 5** kan intet ske: loftet
er 3 (F7). Hæves `maksAntal` en dag, giver `fixed` `(1.336,8 − 224) / n` = **278,2** px ved 4
og **222,6** px ved 5 — det sidste smallere end rækkehovedets egne 224 px, og uden at rulleren
tændes, fordi `min-width:640px` kun gælder ≤820 px. **Det er en betingelse, ikke en opgave:**
hæves loftet, skal `.saml-matrix` have en `min-width`, der vokser med pladeantallet. Byg det
ikke nu.

**Én ting mere i samme greb, og den er ikke gratis at udelade.** `overflow-wrap` på
`.saml-raekke__celle` er i dag `normal`. Under `auto` kan et langt ord altid tvinge kolonnen
bredere; under `fixed` kan det ikke. Længste ord i datasættet i dag er **29 tegn**, og det
klipper ingenting — 0 overløb målt. **Måleapparatet er valideret mod et kendt svar:** et
indsprøjtet 200-tegns ord gav `scrollWidth` 1.531 mod `clientWidth` 244, så apparatet *ser*
overløb, når der er noget at se; nullet er ægte. Men det er ægte for *dagens* data. Sæt
`overflow-wrap:anywhere` i samme commit, så en fremtidig 60-tegns modelbetegnelse ikke bliver
til et layoutbrud, ingen forbinder med denne ændring.

**Fravalgt 1 — `<colgroup>` med procentbredder.** Virker, men flytter en layoutbeslutning ind
i `sammenligning.js`' markup: et andet sted at ændre, og et sted, CSS'en ikke kan nå ved
≤720 px, hvor hovedkolonnen skal til 150. `fixed` læser den bredde, CSS'en allerede sætter
responsivt.

**Fravalgt 2 — `width:33.33%` på `.specimen`.** Under `auto` er procentbredder vejledende.
De målte 3,86× og 4,70× **er** `auto`s svar på indholdsbestemt bredde; en procent bliver
overtrumfet af samme mekanisme.

**Aldrig `table{table-layout:fixed}` på det bare element.** `system.css` §14's
`table{width:100%;min-width:620px;font-size:15px}` når allerede herind og måtte neutraliseres
én gang (`generator.css:575`, hvis egen kommentar kalder `min-width:620px` *"den farligste af
dem"*). En global regel ville ramme producentsidens tabel og robotsidernes 77 tabeller umålt.

---

## K2 — vandrette skillelinjer

**Spørgsmålet kan ikke besvares, som det er stillet, fordi præmissen ikke holder.** Der er
ingen vandrette streger at have flere eller færre af: alle 142 celler måler `border-top:
0px none` (F1). Både briefets *"de findes, og de kan bare ikke ses"* og JPK's *"skal vi have
dem?"* går ud fra, at der står noget svagt. Der står intet.

Det rigtige spørgsmål er derfor: **skal matricen have sin første vandrette struktur — og
hvilken?** Mit svar er ja til **én** ny streg, nej til 33 — og det, der faktisk løser
Operate-opgaven, er ikke en streg.

Rangeret efter målt virkning på opgaven *"følg én række på tværs"*:

### 1. Rækkemarkering ved svæv og fokus — den vigtigste, og den ingen bad om

Målt: **0** hover-regler på `.saml-raekke` (læst ud af CSSOM, ikke gættet). Øjets rejse fra
feltnavn til sidste værdi: **1.336,8 px**. 33 rækker, median rækkehøjde **43,7 px**.

Det, øjet mangler på den flade, er ikke en grænse mellem række 17 og 18. Det er at kunne
**holde fast i række 17**, mens blikket flytter 1.336,8 px til højre. En statisk streg hjælper
ikke på det; en markering af den række, man er i, gør.

- **Fladen: `background:var(--accent-ro)`** på `.saml-raekke:hover`. Det er *sidens egen
  etablerede hover-flade*, allerede brugt af `.filtre label:hover` (`system.css:1520`).
  Ingen ny farve, og samme vokabular på tværs af skærmene — hvilket er selve Operate-kravet.
  Målt: eloxgraa `#E8EBED` mod `--panel` `#FAFBFB` = **1,16:1**.
- **1,16:1 er tæt på perceptionsgulvet, så tonen må ikke stå alene.** Makkeren er feltnavnet:
  `.saml-raekke:hover .saml-raekke__navn` går fra `--blaek2` (**6,56:1**) til `--blaek`
  (**14,69:1**). En **farve**ændring, ikke en vægtændring — vægt ville ændre ordets bredde,
  og den fejl har topbaren allerede betalt for én gang (`system.css`-kommentaren ved
  `.daek__enhed`: *"en vægtændring ville ændre ordets BREDDE, så pillen hoppede"*).
- **Teksten holder på den tonede række.** Målt mod eloxgraa: `--blaek` 12,72 · `--blaek2` 5,68
  · `--blaek3` 4,74. Ingen tekst falder under 4,5.
- **Bivirkning, der skal stå i byggebriefet:** de lodrette kolonnestreger bliver svagere over
  en tonet række — `--linje` måler **1,56:1** mod panel, men **1,35:1** mod eloxgraa.
- **`@media (hover:hover)` som værn.** En touch-enhed skal ikke sidde fast i en markeret række.
- **`:focus-within` skal have en rigtig fokusring, ikke tonen.** Sidens globale
  `:focus-visible{outline:3px solid var(--accent);outline-offset:3px}` (`system.css:343`).
  En tone på 1,16:1 er ikke en fokusindikator, og må ikke bruges som en.

### 2. Gruppeskellet — den ene nye streg

6 grupper, 33 rækker. En streg mellem grupper er **5 streger**, ikke 33. Den bærer
information (hvor slutter FYSIK, hvor begynder ENERGI), og skal derfor måle **≥3,0:1**.

- `--linje` **1,56** og `--hegn` **2,47** er begge under grænsen.
- `--blaek3` `#5F686F` måler **5,48:1** mod panel — og er **allerede gruppetitlens egen
  tekstfarve**. Samme token, samme sted, ny læseretning. Ingen ny farve, så hård begrænsning 3
  og TYPESKILT står urørt.
- **Placering:** på gruppens første række, ikke på titlen selv. Titlen har allerede
  `padding-top:var(--r5)` (`generator.css:596`), så stregen får luft på begge sider uden en ny
  afstandsværdi.
- **Tykkelse 1 px.** Kontrasten bærer den, ikke vægten. (Bemærk F1's biobservation: en
  `1px`-kant måles til **0,8 px** brugt bredde ved `devicePixelRatio` 1 på denne maskine.
  Årsagen er ikke isoleret; den gælder alle kanter på siden i forvejen, så den ændrer ikke
  valget — men et byggespor, der måler 0,8 og forventer 1, skal vide det.)

### 3. Rækkehårstregen — nej. Her er jeg uenig med briefet

Briefet foreslår at *"løfte rækkestregen til mindst 3,0:1"*. Tre målte grunde til at lade være:

- **Det er 33 streger à 1.336,8 px.** Briefets egen sætning — *"33 rækker med ens
  fuldbredde-streger bliver et bur"* — holder også, når stregerne er stærke nok til at ses.
  Den bliver mere sand, ikke mindre.
- **Rækkeadskillelsen er allerede båret.** Median 43,7 px rækkehøjde, 11 px lodret polstring
  i cellen, og hver celle har sin egen venstrekant. Der er intet målt problem med at se, hvor
  en række slutter. Problemet er at **følge** den, og det er punkt 1.
- **Det er ikke en sammenligningssidebeslutning.** At løfte `--linje` selv rammer **70 linjer
  / 73 forekomster / 71 uden for kommentarer** på tværs af begge stilark. Se SYSTEMÆNDRING.

### Systemreglen, rettelsen skal skrives som

Hård begrænsning 3 forbyder *"vælg en anden farve"*. L76 løste det tilsvarende problem ved at
skrive en regel om, **hvor** `--accent` må stå. Samme form her, og den er målt, ikke skønnet:

> **En streg, der er den eneste bærer af en skelnen, skal bruge et token, der måler ≥3,0:1
> mod den flade, den ligger på. `--linje` (1,56) og `--hegn` (2,47) ligger under og må derfor
> kun bære adskillelse, der er redundant med et andet signal — luft, en etiket eller en
> tilstand.**

Reglen dømmer fladen, som den er i dag, uden at kræve en eneste ny farve: de lodrette
kolonnestreger på 1,56 er **lovlige**, fordi kolonnen også er markeret af plade-hovedet
ovenover; et gruppeskel er det **ikke**, fordi stregen ville være det eneste, der markerer
skellet — derfor `--blaek3`.

### Og hvad der skal ske med den døde regel

`generator.css:604` skal ikke blive stående. En regel, der ser ud som om den tegner en streg,
og ikke gør det, er præcis det, der gjorde briefets K2 forkert. **Fjern den** i samme commit
som gruppeskellet, med en kommentar, der siger hvorfor rækkestregen ikke kom tilbage — ellers
genopfinder den næste læser den om tre uger.

**F3 hører også til her, men er sit eget arbejde.** Gruppetitlens klæbning virker ikke
(16 → −234,4 px). Det er en ren funktionsfejl og dermed undtaget designfrysen, men den rører
gruppens rækkestruktur, som punkt 2 også rører. **Byg de to sammen, ikke hver for sig** — to
spor i `.saml-gruppe` er en flettekonflikt, der først viser sig til sidst.
