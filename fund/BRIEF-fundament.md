# BRIEF — `spor/fundament`: TYPESKILTETS fundament

Runde 1 af tre i L54-redesignet. Worktree `C:/Praktik/websites/udstilling-wt-fundament`,
gren `spor/fundament`, base `3288900`. Model: Sonnet. Port **8150**.

---

## 0. Grundmåling — din FØRSTE handling

Målt af orkestratoren **i din worktree** umiddelbart før afsendelse:

```
node tools/validate.mjs     → 77 filer · 0 fejl · 1 advarsel
node tools/build.mjs        → 213 sider · 1110 tal med kilde, 0 uden · Taethedsnaevnere 30
node tests/koer.mjs         → 642 bestaaet · 0 fejlet
```

Kør alle tre, før du ændrer noget, og skriv tallene i rapporten. **Afviger et tal, så STOP
og rapportér** — så er det miljøet, ikke dit arbejde. (De 77 gitignorerede fabrikantfotos
og `.env` er allerede kopieret ind af mig; det er netop dét, der ellers giver 54 falske
valideringsfejl.)

---

## 1. Hvad sporet er — og hvad det ikke er

Compen i `retninger/nyverden/` er den **godkendte retningskontrakt** (L57, JPK dømte den
med øjnene 31. aug 2026). Du bygger **fundamentet** ind i den virkelige side: skrifter,
palette, primitiver, ramme.

Du bygger **ikke** katalogsidens filtermekanik og **ikke** robotsidens layout — det er
runde 2, tre parallelle spor efter dit flet.

**Det skal se halvfærdigt ud bagefter, og det er meningen.** Alle 213 sider skal stadig
bygge, og de skal bære TYPESKILTs skrift og farve — men deres layout er endnu ikke
omformet. Lad være med at "gøre det færdigt".

---

## 2. Retningskontrakten — og de to steder den er forældet

Læs `retninger/nyverden/MANIFEST.md`. Den er kontrakten, **med to undtagelser, som JPK
besluttede efter at manifestet blev skrevet** (L57, STATUS.md Å66):

1. **§"Signaturelementet: højdelinealen" er OPHÆVET.** Manifestet bruger ~40 linjer på
   højdelinealen. **Byg den ikke.** Signaturen er selve typeskilt-pladen (TYPE/UDGAVE/
   POSTER-blokken). Vægtklasse-facettens afkrydsningsfelter består — men de er runde 2's.
2. **Tæthedsmåler-blokken på robotsiden er droppet.** Tætheden består som begreb og
   sorteringsvalg; kun måler-UI'et ryger.

Alt andet i manifestet står ved magt — paletten, skriftrollerne, tre-tilstandsreglen,
layouttesen, det stansede udtryk.

---

## 3. Leverancen — syv punkter i udførelsesrækkefølge

### 3.1 Skrifterne ind i repoet

**HVAD:** Kopiér de 10 `.woff2` fra `retninger/nyverden/skrift/` til `assets/fonts/`.
Erstat `@font-face`-blokken i `assets/system.css:26-37`, som i dag lyder:

```
font-family:"Manrope lokal";
src:local("Manrope"),local("Manrope Regular"),
```

med rigtige `@font-face`-regler, der peger på de kopierede filer, med `font-display:swap`
og `unicode-range` delt korrekt mellem `-latin` og `-latin-ext`-filerne.

**HVORFOR:** Målt i dag: **0 `.woff2` i hele repoet**. `src:local()` betyder, at en bruger
uden Manrope installeret ser en systemskrift — siden har aldrig self-hostet en skrift.
Saira og Literata er begge SIL OFL 1.1 (manifestet §Skriftrollerne), så selvhosting er fri.

**FÆRDIG NÅR:** `find assets/fonts -name "*.woff2" | wc -l` giver **10** (giver i dag **0**).

### 3.2 `build.mjs` kopierer skrifterne til `dist/`

**HVAD:** Tilføj `assets/fonts/` til build-kopilisten omkring `tools/build.mjs:428-433`.
Læs den eksisterende liste og følg dens mønster — kopiér ikke `media/` med (det er den
strukturelle håndhævelse af, at fabrikantmateriale aldrig kan slippe ud).

**FÆRDIG NÅR:** `node tools/build.mjs && find dist -name "*.woff2" | wc -l` giver **10**
(giver i dag **0**).

### 3.3 Paletten — nye værdier, **samme token-navne**

**HVAD:** Erstat farveværdierne i `:root` (`assets/system.css:40-90`) med TYPESKILTs otte
roller fra MANIFEST.md §Paletten (eloxgrå `#E8EBED`, gunmetal `#22262A`, kridt `#FAFBFB`,
afmærkningsgul `#F2C400`, blæk-2 `#545C63`, rille `#C6CCD1`, stans `#FFFFFF`, støvgrå
`#9AA3A9`, støv-blæk `#5F686F`).

**BEHOLD token-NAVNENE** og giv dem de nye værdier. Den fulde liste i `:root` i dag er:

```
--bund --panel --panel-ro --tom --blaek --blaek2 --blaek3 --accent --accent-ro
--linje --hegn --fod --paafod --paafod2 --sans --mono --r1..--r9 --kant --maal
--rund --rund-ind --rund-lille --skygge --skygge-loeft --slyng --tid
```

Tilføj kun nye tokens, hvor TYPESKILT har en rolle, der ikke findes i dag (fx
stans-lyskanten og støv-blæk).

**To tokens er i direkte konflikt med retningen:** `--skygge` og `--skygge-loeft`.
Manifestet §Layouttesen siger ordret *"Ingen slagskygge findes på siden"* — materiale, ikke
skeuomorf teater. Lad tokenerne stå, men sæt dem til `none`, så de brugssteder, der i dag
kalder dem, holder op med at tegne skygge, uden at du skal opsøge hvert enkelt. **Skriv i
rapporten, hvor mange brugssteder det var** (`grep -c "var(--skygge" assets/system.css
assets/generator.css`).

**HVORFOR — det er den billigste vej, og jeg har målt hvorfor:** ingen test i hele suiten
matcher en hex-farve (grep: 0 træf), og kun **ét** sted matcher et token-navn
(`tests/dele/31-pudsning.mjs:141-142`). Bevarer du navnene, skifter hele siden farve, uden
at noget knækker. Omdøber du dem, skal hver regel i to CSS-filer på i alt 134 KB følges op.

**Bemærk manifestets egen måling:** støvgrå `#9AA3A9` er **2,14:1** mod pladen og må
**aldrig bære tekst** — kun kontur. Teksttonen for "ikke oplyst" er `#5F686F` (4,74:1).
Blander du de to, bryder du tilgængeligheden på præcis det felt, hård begrænsning 5 handler om.

**FÆRDIG NÅR:** `grep -ci "E8EBED\|F2C400\|22262A" assets/system.css` giver **≥3**
(giver i dag **0**) **OG** `node tests/koer.mjs` giver stadig **≥642 bestået, 0 fejlet**.

### 3.4 `--mono` peges på Saira — tokenet beholdes

**HVAD:** MANIFEST §Skriftrollerne, "Hvorfor ingen monospace": på et rigtigt typeskilt er
tallene stanset i **samme** skrift som etiketterne. Tabulartal løser justeringen.

**Gør det mindst risikable:** lad tokenet `--mono` blive stående, men peg det på
Saira-stakken med `font-variant-numeric: tabular-nums`. Så følger alle nuværende brugssteder
med uden at blive rørt enkeltvis.

**HVORFOR ikke fjerne tokenet:** `var(--mono)` står 8+ steder i `system.css` alene, og
`tests/dele/31-pudsning.mjs:141-142` kræver ordret `font-family:var(--mono)` på
variantnavnet. En omdøbning er runde 2's arbejde, ikke dit — den giver ingen synlig
forskel og koster en flettefront.

**FÆRDIG NÅR:** `grep -c "monospace\|JetBrains" assets/system.css` giver **0**
(giver i dag **6**), og tests er **≥642/0**.

### 3.5 Typeskilt-primitiverne — og testen, der forbyder dem

**HVAD:** Byg stansningen som genbrugelige klasser i `system.css`: 2 px radius, 1 px
indfældet kant, hvid lyskant (`stans #FFFFFF`), plus rillen og pladen. Kilden er
`retninger/nyverden/typeskilt.css` — læs den, men kopiér ikke blindt: den er skrevet
til en fritstående comp uden `system.css` omkring sig.

**VÆRN — læs dette, før du skriver den første radius.** `tests/dele/31-pudsning.mjs:105-118`
indeholder:

```
const LOVLIG = new Set(['0', '0px', '6px', '8px', '12px', '99px', '50%']);
```

og fejler på enhver anden radius i begge CSS-filer. **2 px er TYPESKILTs signatur**
("det stansede udtryk — 2 px radius og 1 px indfældet kant", manifestet §Layouttesen),
så testen som den står forbyder retningen.

**Udvid skalaen til at rumme 2 px, og ret testens kommentar, så den beviser den NYE regel.
Slet den ikke, og sænk ikke kravet.** (CLAUDE.md's globale regel: "Ret assertions, slet dem
ikke. En slettet test efterlader ingenting, der siger at reglen nogensinde var der.")
Kommentaren over `LOVLIG` forklarer i dag, at "en 3 px radius er hverken en kant eller et
hjørne" — den forklaring skal opdateres til, hvorfor 2 px nu er et gyldigt trin.

**FÆRDIG NÅR:** `grep -c "border-radius:2px" assets/system.css` giver **≥1**
(giver i dag **0**) **OG** tests **≥642/0**.

### 3.6 Tre-tilstandsmærkerne som SVG

**HVAD:** Fire mærker ind i SVG-spriten (`SPRITE`, indsat i `tools/skabelon/side.mjs:1512`),
efter MANIFEST §"Tre-tilstandsreglen, tegnet":

| Tilstand | Mærke |
|---|---|
| ja / oplyst | fyldt firkant, fuldt blæk |
| nej | kontur med skråstreg, fuldt blæk — et svar, ikke et hul |
| nul | kontur med udfyldt prik, fuldt blæk |
| ikke oplyst | stiplet kontur, ufyldt, støv-blæk |

**Ingen unicode-glyffer, ingen emoji** — manifestet er udtrykkelig om det, og en glyf, der
ikke findes i latin/latin-ext-subsettet, falder tilbage til systemskrift (det er grunden
til, at manifestets afvigelse 6 skiftede `≥` ud med ordet "fra").

**HVORFOR:** Hård begrænsning 5 — "ikke oplyst", "nej" og "0" er tre forskellige tilstande
og skal se forskellige ud. I dag bæres forskellen alene af CSS-klasser (`.v-ikke`, `.v-nej`,
`.v-tal`); mærkerne gør den til et synligt tegn.

**Følg spritens egen navnekonvention.** Symbolerne hedder i dag `i-vaegt`, `i-nyttelast`,
`i-driftstid`, `i-fart`, `i-ip`, `i-ce`, `i-hul`, `i-pil` — altså præfikset `i-`. Navngiv de
fire nye `i-ja`, `i-nej`, `i-nul`, `i-ioplyst`.

**FÆRDIG NÅR:** `grep -c 'id="i-ja"\|id="i-nej"\|id="i-nul"\|id="i-ioplyst"' tools/skabelon/side.mjs`
giver **4** (giver i dag **0**), og `node tools/build.mjs` giver stadig **213 sider**.

### 3.7 Menuen: "Forside" bliver "Oversigt" — og en måling til runde 2

**HVAD (byggedelen, lille):** JPK besluttede 31. aug 2026 (denne session), at L56's fire
menupunkter lægges **til** de eksisterende, så menuen ender som:

> Oversigt · Katalog · Sammenligning · Producenter · Nyheder · Services · Om os

Din del er **kun** omdøbningen: `nav_forside` skal hedde **"Oversigt"** i `da.json` og
**"Overview"** i `en.json`. Rør ikke nav-arrayets struktur i `side.mjs:1481-1488`.

**HVORFOR du ikke bygger de tre nye punkter:** Nyheder, Services og Om os har endnu ingen
sider. Menupunkter til sider, der ikke findes, er døde links, og `tools/linktjek.mjs` ville
med rette fange dem. Runde 2's "nye sider"-spor ejer både siderne og deres menupunkter.

**HVAD (måledelen — og den er den vigtige):** Menuen skal om kort tid bære **syv** punkter
plus sprogskiftet. Å60 flettede netop navigationen ned fra 160 px til **114 px ved 390 px
bredde**, fordi den fyldte for meget. Syv punkter risikerer at rulle det tilbage.

**Mål det, og byg det ikke:** indsæt de tre ekstra punkter midlertidigt (lokalt, ikke
committet), byg, og mål navigationens højde ved 390 px med
`node C:/Praktik/websites/maalevaerktoej/maal.mjs http://localhost:8150/da/ 390`.
Skriv tallet i rapporten, og fjern så de midlertidige punkter igen.

**FÆRDIG NÅR:** menuen viser "Oversigt"/"Overview" (nav-links er stadig **5**: fire punkter
+ sprogskifte — se måleopskriften i §10, `grep -o` duer ikke), **og** rapporten indeholder
den målte navigationshøjde ved 390 px med syv punkter, som et tal.

---

## 4. Filejerskab

**Du ejer** (ingen andre spor kører lige nu — du har repoet for dig selv):

- `assets/system.css`
- `assets/fonts/` (nyt indhold)
- `tools/skabelon/side.mjs`
- `tools/build.mjs` — **kun** kopilisten omkring linje 428-433
- `data/i18n/da.json` + `data/i18n/en.json`
- `tests/dele/31-pudsning.mjs` — kun rettelserne beskrevet i 3.4/3.5
- **ny fil** `tests/dele/34-typeskilt-fundament.mjs` (nye tests hører i egen fil, jf.
  `tests/LAESMIG.md`s kontrakt — aldrig i en delt)

**Du rører ikke:**

- `retninger/` — retningskontrakten er arkiv. Læs den, ændr den aldrig.
- `tools/skabelon/katalog.mjs`, `robot.mjs`, `forside.mjs`, `producent.mjs`,
  `sammenligning.mjs` — runde 2
- `assets/katalog.js`, `assets/generator.css` — runde 2
- `data/robots/`, `db/` — uden for redesignet

**Et fund, jeg allerede har målt, så du ikke bruger tid på det:** `assets/filter.js` er
**død kode** — 0 referencer i `tools/`, og den står ikke i build-kopilisten. Rør den ikke;
dens skæbne er runde 2's beslutning.

---

## 5. Skills

Vurdér skills som din første handling og **skriv, hvilken du valgte, og hvilke du gik forbi
med begrundelse.** "Ingen skill passer her" er et gyldigt svar, men det skal skrives.

Kandidater: `frontend-design` (CSS-håndværket) · `impeccable` · `robotdata` (næppe — ingen
robotposter røres, men skriv fravalget).

**Kaldet til en plugin-skill fra en worktree lykkes nogle gange og fejler andre gange, og
vi ved ikke hvorfor.** Diskstierne som udtrykkelig reserve:

```
C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```

Læser du en fra disk, **skriv det i rapporten** — så et stille fallback ikke forveksles med,
at skillen kørte.

**Du træffer ingen designbeslutninger.** Retningen er låst af L57. Er du i tvivl om en
visuel detalje, følg `retninger/nyverden/` og skriv tvivlen i rapporten.

---

## 6. Rapportform — bestilt eksplicit

**Højst 60 linjer**, og præcis fire ting:

1. Hvilken løsning blev valgt — og hvilken blev fravalgt, én linje hver
2. **Konfidensniveau pr. punkt**
3. Usikkerheder, du mødte undervejs
4. Målingerne som **tal**, ikke prosa ("tests 642/0", ikke "alt kører")

**Konfidensskalaen er bundet til bevistype, ikke til fornemmelse:**

- **Høj** = målt med en kommando, tallet står i rapporten, og jeg kan genkøre den og få
  samme tal — **plus én linje om, hvad tallet ville have været, hvis arbejdet var forkert.**
  Kan du ikke skrive den kontrafaktiske linje, er niveauet **middel**. Høj uden genkørbar
  kommando nedskrives automatisk til lav.
- **Middel** = efterprøvet indirekte, men ikke i den endelige form, brugeren møder
- **Lav** = ikke efterprøvet: antaget, udledt eller blokeret

**To sektioner ligger UDEN FOR de 60 linjer og er obligatoriske:**

- **"Nye fælder og opdagelser"** — det overraskende, du mødte. Er der intet, så skriv, at
  der intet er. (Under et hårdt loft dropper en agent ellers netop det uventede og beholder
  tjeklisten.)
- **"Punkter i briefet, jeg ikke nåede"** — én linje pr. punkt, tom hvis ingen.

---

## 7. Briefets fakta er påstande — at måle dem er en del af leverancen

Alt, jeg påstår ovenfor, har jeg målt selv i dag. Jeg kan stadig tage fejl.

**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen — det er en
del af leverancen, ikke ulydighed.** To agenter rettede orkestratorens fakta 26.-27. aug;
begge havde ret, og det var sessionens billigste kvalitetskontrol. Orkestratoren
kontrolleres ellers af ingen.

---

## 8. Commit undervejs — et krav, ikke et råd

**Ét commit pr. sammenhængende ændring.** To spor døde midtvejs på tre dage; begge gange
var det commit-kravet, der reddede arbejdet, så efterfølgeren kunne måle i stedet for at gætte.

Bærer en commit-besked backticks, `$`, `%` eller anførselstegn: skriv beskeden til en fil og
brug `git commit -F <fil>` — og filen skal angives med **Windows-sti**, ikke `/c/...`.

---

## 9. Miljø — fælder, der koster en runde hver

- **node kun med fuld sti:** `/c/Program Files/nodejs/node.exe`. Git Bash har den ikke på PATH.
- **Din port er 8150.** Aldrig 8080 (en dist-server kører der). Start serveren med fuld sti,
  fra worktree-roden — **aldrig** `cd dist`, for så låser serveren mappen, og næste byg
  fejler med EPERM:
  ```
  /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8150 --directory dist
  ```
  Startes den uden fuld sti i en baggrundsskal, fejler den **tavst** med exit 127.
- **Verificér serveren mod disken, før ét eneste tal bruges.** Vælg en streng, kun din udgave
  har, og sammenlign de to:
  ```
  curl -s http://localhost:8150/system.css | grep -c "<din streng>"
  grep -c "<din streng>" assets/system.css
  ```
  Forskellige tal betyder, at du måler en anden agents byg. En server er et måleapparat og
  skal valideres mod et kendt svar som ethvert andet.
- **`sed -i`, der ikke matcher, gør ingenting — tavst og med exit 0.** Brug Edit-værktøjet,
  som fejler synligt. Det samme gælder alt indhold skrevet gennem skallen: bærer teksten
  backticks, `$`, `%` eller anførselstegn, så brug Write/Edit.
- **UTF-8 uden BOM.** `Set-Content -Encoding utf8` ødelægger tankestreger.
- **`head` i Bash tæller ikke som en læsning for Edit-værktøjet** — kun Read-værktøjet gør.
- De 77 gitignorerede fabrikantfotos og `.env` er **allerede kopieret ind** af mig.
- Browsermåling: `node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> <bredde>` for tal,
  `flade-skud.mjs <url> <bredde> <udfil.png>` for et skærmbillede, du selv kan læse.

---

## 10. Acceptkriterierne samlet — alle kørt mod main af mig i dag

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| 3.1 | `find assets/fonts -name "*.woff2" \| wc -l` | **0** | **10** |
| 3.2 | `node tools/build.mjs && find dist -name "*.woff2" \| wc -l` | **0** | **10** |
| 3.3 | `grep -ci "E8EBED\|F2C400\|22262A" assets/system.css` | **0** | **≥3** |
| 3.4 | `grep -c "monospace\|JetBrains" assets/system.css` | **6** | **0** |
| 3.5 | `grep -c "border-radius:2px" assets/system.css` | **0** | **≥1** |
| 3.6 | `grep -c 'id="i-ja"\|id="i-nej"\|id="i-nul"\|id="i-ioplyst"' tools/skabelon/side.mjs` | **0** | **4** |
| 3.7 | nav-links, målt med node-opskriften nedenfor | **5** | **5**, med "Oversigt" |
| — | `node tools/validate.mjs` | 77 · 0 fejl · 1 advarsel | uændret |
| — | `node tools/build.mjs` | 213 sider · 1110/0 · nævnere 30 | uændret |
| — | `node tests/koer.mjs` | **642 / 0** | **≥642 / 0** |

**Nav-links måles med node, ikke med `grep -o`** — `grep -o '<nav...>.*</nav>'` matcher ikke
over linjeskift og gav mig **0** på en side, der har fem. Den rigtige måling:

```
node -e "const h=require('fs').readFileSync('dist/da/index.html','utf8');
const n=h.match(/<nav[\s\S]*?<\/nav>/)[0];
console.log('nav-links:',(n.match(/<a\b/g)||[]).length);"
```

→ giver i dag **5** (Forside · Katalog · Sammenligning · Producenter · In English) og skal
**stadig give 5** efter dit spor, med "Oversigt" i stedet for "Forside".

**Tallet 10 i 3.1/3.2 er et krav, ikke et gæt:** jeg har talt filerne i
`retninger/nyverden/skrift/`. Tallene 642 og 213 er **målte grundlinjer** — stiger testtallet,
fordi du tilføjer `tests/dele/34-*`, er det rigtigt og forventet; skriv det faktiske tal.
Alle øvrige tal i briefet er målt af mig 31. aug 2026 på commit `3288900`.
