# BRIEF — bundbaren, Retning B (SKINNEN)

**Model: opus** (L45: designspor dømmes med øjne — ny formfamilie, typografi,
layout). **Testnummer: 81.** **Port: 8206** (målt fri med `netstat -ano | grep
LISTENING | grep ":82[0-9][0-9]"` → tomt, 3. sep 23:15).
**Forventet pris: ~300k tokens** (målt: `spor/barplan` kostede 244k på samme
flade; Å152 punkt 5 giver ~300k pr. opus-designspor med færdig plan).

**Worktree og gren oprettes af orkestratoren, når spærringen er væk — se
"Hvornår dette spor må starte" nedenfor. Start ikke selv.**

---

## 1. HVAD JPK SER PÅ SKÆRMEN BAGEFTER

Katalogsiden, `dist/<sprog>/index.html`, når 1-3 robotter er valgt.

| UI-element | I dag | Efter sporet |
|---|---|---|
| **Bjælkens bredde** ved 1440 px | 1.440 px, kant til kant | **~653 px** ved tre robotter, ~420 px ved én — så bred som sit indhold |
| **Bjælkens form** | Fuldbleed gunmetalbånd, klistret til kanten | **Fritstående genstand**, centreret over gitteret, løftet fri af kanten med `--r4` |
| **Bjælkens højde** ved ≥700 px | 45,7 px | **≤ 40 px** |
| **Bjælkens højde** ved 390 px, 3 valgte | 69,3 px (to rækker) | **≤ 40 px** (én række, vandret rullespor) |
| **Dækket gunmetal-areal** ved 1440 | 65.790 px² | **~26.000 px²** — en reduktion på 60 % |
| **Tom flade inde i bjælken** | 58-74 % (775-1.008 px dødt hul mellem navne og knapper) | **~0 %** |
| **Overkanten** | Rå `rgba`-slagskygge | **1 px hårstreg** i `--paafod2` — sidens eneste rå rgba forsvinder |
| **Fjern én robot** | Findes ikke. Man skal finde kortet igen i et 6.603 px dokument | **`Fjern`-knap ved hvert navn** inde i bjælken |
| **Berøringsmål på bjælkens knapper** | 13,2 px høje | **≥ 24 × 24 px** — bjælken bliver mindre, målene større |
| **Dokumentets sidste 45,7 px** | Dækket af bjælken, ulæselig | **0 px dækket** — `<body>` får målt bundplads |
| **Grænsebeskeden "højst 3"** | Læres ved at ramme den, 3.000 px fra udvalget | Står **i bjælken**, hvor udvalget er |
| **Tabulatorstop til `Åbn sammenligningen`** | Nr. **231 af 232** | **≤ 10** |
| **Fokus efter et `Fjern`-klik** | Falder til `<body>` | Næste `Fjern` → kortets knap → søgefeltet |
| **Skriftgrader** | — | **Uændret. Ikke én ny `font-size`** (DP3b) |

**Det, der IKKE ændrer sig:** paletten, skrifterne, `--hjoerne` 2px, de to
knapper (`Åbn sammenligningen`, `Ryd udvalget`), `SAML_MAKS` = 3, og de øvrige
215 sider.

---

## 2. HVORNÅR DETTE SPOR MÅ STARTE

**Det er spærret lige nu, af to ting i rækkefølge:**

1. **`spor/certfacet` skriver i `tools/skabelon/katalog.mjs`** (udstilling-19's
   spor, kørende). Se punkt 4 nedenfor — dette spor SKAL skrive i den fil.
2. **`udstilling-fb` kører `db/eksporter.mjs --fra-db` og committer 77 filer i
   `data/robots/`.** Grenen skal forgrenes **efter** den commit, ellers lander
   77 ændrede datafiler i grenen midt i sporets egne før/efter-målinger.

**Orkestratoren opretter worktreen først, når begge er i hus**, og skriver det
faktiske forgreningscommit ind her, før sporet sendes.

---

## 2b. JPK'S INTERVIEWRUNDE — fem antagelser er nu beslutninger

**`spor/barplan` kunne ikke tage `impeccable shape`s interviewrunde.** Den skrev
det selv ordret: *"Dette spor er en subagent uden `AskUserQuestion` — der er
ingen at spørge herinde"*, og substituerede JPK's fire krav for interviewets
svar. **Runden er nu taget af orkestratoren med JPK, 3. sep 2026 kl. ~23.30.**

**Alt herunder er JPK's beslutning, ikke planens forslag og ikke dit valg.**
Tre af dem var eksplicit mærket `(antagelse)` i planen — sporet bad selv om at
blive modsagt på dem, og de er nu afgjort.

| # | Spørgsmål | JPK's svar | Var før |
|---|---|---|---|
| **J1** | Bjælkens vandrette placering | **Centreret over gitteret** | Planens `(antagelse)` — *"en læsning, ikke en måling"* |
| **J2** | Bevægelse når et led fjernes | **Ingen bevægelse** | §10, uafgjort |
| **J3** | Mobilen ved 390 px | **Vandret rullespor** | Planens `(antagelse)` — *"at det er acceptabelt her"* |
| **J4** | `Fjern` som ord eller kryds | **Ordet "Fjern"** | Planens tekst, uafklaret mod CSS-kommentaren |
| **J5** | `Ryd udvalget` | **Bliver** | §10, uafgjort — se punkt 5b |

**J1 — centreret.** Højre hjørne er systembeskedens plads og læses som en
notifikation; centreret over gitteret læses som *hendes udvalg*. **Byg ikke
venstrestillet og ikke i et hjørne.**

**J2 — ingen bevægelse. Dette er et forbud, ikke en udeladelse.** Navnet
forsvinder øjeblikkeligt, og bjælken bliver smallere med det samme. Begrundelsen:
sitet har i dag stort set ingen bevægelsesgrammatik — `.knap:active
{transform:translateY(1px)}` er det eneste, planen fandt. **En 150-250 ms
sammenfoldning ville være sidens eneste animerede tilstandsskift**, og så er det
en systembeslutning forklædt som en detalje. **Tilføj ingen `transition` og
ingen `@keyframes` til bjælken.** Finder du en eksisterende `transition` på
`.klaebebar`, så meld den som et fund frem for at bygge videre på den.

**J3 — vandret rullespor**, som planens §6 beskriver. De to alternativer blev
forelagt og fravalgt: afkortede navne kan få to robotter fra samme producent til
at se ens ud, og to rækker giver ~72 px, altså **værre end de 69,3 px, klagen
handlede om.**

**J4 — ordet "Fjern".** Tre ens knapper skelnes af navnet ved siden af, og ordet
kræver ingen tolkning.

**MEN FUNDET BAG SPØRGSMÅLET STÅR VED MAGT, og det skal med i din rapport:**
CSS-kommentaren i bjælken (`assets/system.css:2445`) siger *"Ingen symboler af
nogen art"* — og **reglen er allerede brudt på samme side.** Kortets eget stempel
`.knap--maerkat` tegner `content:"+"` i hvile og `content:"\00d7"` når robotten
er valgt (`system.css:2692` og `:2712`, planens egen måling).

**Det er en modstrid mellem en kommentar og koden, ikke en fejl, du skal rette.**
Designfrysen gælder for den: **notér den som et fund til designplanen, ret den
ikke.** Din opgave er bjælken; systemreglen om symboler hører et andet sted.

## 3. FØRSTE HANDLINGER

**Kald `spor`-skillen som din første handling** — den bærer grundmålingen,
skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
rapportformen og miljøfælderne. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde
det.**

**Kald derefter `design`-skillen.** Kald `fejljagt`, hvis noget opfører sig
uventet.

**MODE: Operate.** Den besøgende løser en opgave — vælg op til tre robotter,
fjern dem hun fortryder, åbn sammenligningen. **Succeskriteriet er, at opgaven
bliver lettere, ikke at bjælken bliver pænere.**

**Designfrysen (L70) SPÆRRER IKKE dette spor, og her er hvorfor:** frysen kræver
en overordnet designplan, før design rettes. Den plan findes —
`fund/PLAN-klaebebar.md`, produceret af `impeccable shape` — og **JPK har valgt
Retning B.** Du udfører en truffet beslutning; du træffer den ikke. Møder du et
designspørgsmål, planen ikke har afgjort, er det et **fund**, ikke en rettelse.

### Punkt 0 — GRUNDMÅLING, din første kommando efter skill-kaldene

```
node tools/validate.mjs
node tools/build.mjs
node tests/koer.mjs
```

**Rækkefølgen er ikke valgfri.** Testene læser fra `dist/`, så et manglende byg
giver ~16 fejl med tekster som *"der ER bygget sider at måle på"* — det ser ud
som seksten ægte testfejl og er én manglende mappe. **Er `assets/fotos/fabrikant/`
ikke kopieret ind i din worktree** (den er gitignoreret, 610 filer), får du
**76** valideringsfejl af typen `R18: filen findes ikke`, og så stopper bygget.
Kopiér mappen ind fra hovedrepoet, før du måler noget som helst.

**ORKESTRATORENS TAL, MÅLT PÅ `e5e8cca` KL. 23:47-23:55. Du forgrener fra
netop det commit.**

```
node tools/validate.mjs   77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs      216 sider · 1111 tal med kilde, 0 uden
node tests/koer.mjs       1757 bestaaet, 9 fejlet
```

**DE 9 RØDE ER IKKE DINE, OG DE SKAL BLIVE VED MED AT VÆRE RØDE.** De kommer
fra `udstilling-fb`s dataeksport (`2518387`), som hentede fase 2's engelske
tekster hjem fra databasen til `data/robots/`. Fase 2's egen uløste tilstand
blev dermed synlig i den byggede side for første gang. **Det er ikke en
regression i koden.** Listen, så du kan skelne dine fra deres:

| Antal | Fejlteksten |
|---|---|
| 3 | han-tegn: *"0 han-tegn i advarsel/note/citat/noter"*, *"0 byggede sider baerer han-tegn"*, *"0 han-tegn i alt i dist/"* |
| 2 | `64.3`: unitree-aliengo bærer *"UDEN batteri"* i sin danske advarsel |
| 1 | `(d) fixture (addverb-trakr-20, engelsk)` |
| 1 | `4c`: Spots *"stroem ud"* viser kun tekstværdien |
| 2 | *"259 forbehold maerket gyldighed"* og *"562 i alt, ingen ugyldig vaerdi"* |

**Rør ingen af de 9.** Tre andre spor arbejder på dem netop nu. Går én grøn hos
dig, er det et **fund du melder** — ikke noget du retter.

**Baselinen 1757/9 er dobbeltmålt af to sessioner på hvert sit commit** (fb målte
1740/9 på `2518387`, orkestratoren 1740/9 på `38bfd53`, derefter 1757/9 efter
certfacet-flettet). **Måler du et andet tal end 1757/9 i din grundmåling, så
STOP og meld** — så er main flyttet under dig.

**MAIN FLYTTER SIG, MENS DU ARBEJDER, og det er planlagt:** `spor/fotofod`
venter på at blive flettet og lægger ~12 assertions til. **Det rører ingen af
dine filer** (den ejer `tests/dele/29` og `38`). Skal du flette main ind i din
gren undervejs, så gør det — men **mål din baseline forfra bagefter**, og skriv
begge tal i rapporten.

### Din hovedkilde

**`fund/PLAN-klaebebar.md` (537 linjer) er sporets grundlag. Læs den helt.**
Dette brief gentager den ikke — det peger på den og retter tre steder, hvor den
er blevet forældet siden kl. 13.45 i dag.

Den er usædvanligt velbelagt: dens §11 slog 23 `fil:linje`-citater op enkeltvis
og rettede 3, og genberegnede alle fire kontrasttal med WCAG-formlen. **Men den
er skrevet FØR aftenens fire flet.** Se punkt 6.

### DESIGN.md — de afsnit, du faktisk skal bruge

**Kortet i `design`-skillen er FORÆLDET, og det er målt, ikke gættet:** skillen
lover 32 afsnit, `grep -c "^#" DESIGN.md` giver **45**, fordi DP1, DP2, DP3b og
DP3c er skrevet ind i dag. **Linjenumrene herunder er genmålt kl. 23:14 og er
dem, der gælder. Skriv i din rapport, hvis ét af dem er forkert, når du slår op
— så kan skillens kort rettes.**

| Afsnit | Linje | Hvad du skal bruge det til |
|---|---|---|
| **DP3b — svaret til klæbebar-sporet** | **666** | **Læs det først.** Skriftgraden er afgjort |
| DP1 — forgrundsreglen for `--accent` | 399 | Hvornår accent må stå som forgrund |
| DP1b — hvad fokusringen SKAL være | 457 | `--ring`, ikke en håndskrevet farve |
| Dybde | 745 | **Ingen slagskygge.** Dybde er fladeskift og streger |
| Former | 761 | `--hjoerne` = 2px, gælder overalt |
| Knapper — én primitiv `.knap` | 857 | `Fjern` er en `.knap`-variant, ikke en ny komponent |
| Fokusringen | 916 | |
| Farver → Navngivne regler | 545 | |
| Lad være | 1139 | Læs den, før du foreslår noget |

**DP3b afgør §10's første åbne punkt og gør det til et acceptkriterium:**

> *"Robotnavnene i klæbebaren er 14 px, vægt 600 — trinet 'Række'. Under 460 px
> falder de til 13 px, trinet Mikro. Begge værdier er dem, koden har i dag
> (`system.css:2459`); det, der manglede, var ikke en anden værdi, men hjemmel
> til den. **Acceptkriterium DP3b:** klæbebar-sporet kan bygge Retning B uden at
> ændre en eneste `font-size` — og hvis det ændrer én, skal det stå i rapporten
> som en afvigelse fra denne beslutning."*

**Citér DP3b, ikke planens §10.** §10's blokering er ophævet.

---

## 4. SPORETS PUNKTER

Planens **D1 er afgjort: Retning B.** **D2-D8 er rigtige uanset retning** og skal
alle bygges. Rækkefølgen nedenfor er den, du skal committe i.

### Punkt 1 — `Fjern` pr. robot (D2), og strengene skal først NÅ klienten

**Byg listen efter planens §4** (`<ul class="klaebebar__valg">`, `Fjern`-knap
efter hvert navn, `knap--tekst-moerk`, `padding:6px 8px;min-height:24px`).

**Knappen bærer ordet "Fjern", ikke et kryds — J4, JPK's beslutning.** Se §2b
for det fund om symbolforbuddet, der fulgte med, og som du skal **notere, ikke
rette.**

**MÅLT AF ORKESTRATOREN, OG PLANEN NÆVNER DET IKKE — det er punktets svære
halvdel:** `saml_fjern_kort` og `saml_fjern_navn` findes i begge sprogfiler
(`data/i18n/{da,en}.json:338-339`), men de **når aldrig katalogsiden**. Målt:

```
grep -rc "saml_fjern" tools/     ->  kun tools/skabelon/sammenligning.mjs: 3
grep -rn "saml_fjern" assets/*.js -> kun assets/sammenligning.js:357,359
```

`assets/katalog.js` har altså **ingen adgang til de to strenge i dag.** Bjælken
henter alt sit sprog fra data-attributter på `.saml-taeller`
(`tools/skabelon/katalog.mjs:1472-1478`: `data-saml-skabelon`,
`data-saml-maks-tekst`, `data-klaebebar-etiket`), læst i `assets/katalog.js`.

**Det, du skal gøre:** føj to data-attributter til den samme `.saml-taeller`, i
samme mønster som de tre, der står der, og læs dem i `katalog.js`.
**Opfind ingen ny i18n-nøgle** — planens §9 punkt 1, og de to findes allerede.

**`.saml-taeller` må ikke slettes eller omdøbes** (planens §9 punkt 9): den er
bærer af bjælkens sprog, og `tests/dele/65-katalogbar.mjs` vogter netop det —
læs dens hovedkommentar, punkt B, før du rører elementet.

**Acceptkriterium 1:** i den byggede side findes de to nye attributter på
`.saml-taeller` på begge sprog, og en `Fjern`-knap pr. valgt robot i den kørende
bjælke. **Giver i dag:** `grep -rc "klaebebar__fjern" assets/` → **0** ·
`grep -c "saml_fjern" tools/skabelon/katalog.mjs` → **0**.

### Punkt 2 — fokusreglen efter et klik (D3)

Planens §4, afsnittet *"Fokus efter et klik"*. **Det er den ene ting, præcedensen
gør forkert** — `assets/sammenligning.js:705 fjernSlug()` lader fokus falde til
`<body>`. Kopiér den ikke.

**Acceptkriterium 2** (= planens 4.1): tre `Fjern`-klik i træk med tastatur, og
`document.activeElement` er **aldrig** `document.body` bagefter. 3 målinger, 0
gange `body`. **Giver i dag:** knappen findes ikke, så målingen kan ikke tages —
tag den på din egen byggede flade.

### Punkt 3 — Retning B's geometri (D1, D8)

Planens §3, Retning B. `left:auto;right:auto`, `width:max-content`,
`max-width:calc(100% - 2*var(--kant))`, `bottom:var(--r4)`, og
`box-shadow:inset 0 0 0 1px var(--paafod2)` i stedet for den rå rgba.

**Centreret over gitteret — J1, JPK's beslutning.** Ikke venstrestillet, ikke i
et hjørne.

**Ingen slagskygge** (DESIGN.md:745). **Ingen ny radius** (DESIGN.md:761).
**Ingen ny `font-size`** (DP3b). **Ingen `transition`, ingen `@keyframes`** — J2.

**Acceptkriterium 3:** `--skygge`/`--skygge-loeft` er stadig `none`, `grep -c
"rgba(" ` i `.klaebebar`-blokken går fra **1 til 0**, og bjælkens målte bredde
ved 1440 med tre valgte er **< 800 px**.

**Giver i dag, målt af orkestratoren 23:19 i `assets/system.css:2449-2500`:**
`rgba` → **1**, nemlig `box-shadow:0 -1px 0 rgba(0,0,0,.2)` på linje 2454.
**Bredden 1.440 px og forudsigelsen ~653 px er PLANENS browsermålinger fra kl.
13.45, ikke mine** — genmål begge i browseren, og skriv dine egne tal.

### Punkt 4 — bundpladsen (D4), og den hårdkodede 72px, planen ikke kender

Planens §5: `--barplads` i `:root`, `body{padding-bottom}`,
`html{scroll-padding-bottom}`, sat af `tegnSaml()` efter **målt** højde.

**DET, PLANEN IKKE KENDER — målt af orkestratoren i `assets/system.css:3148-3159`:**
sidefod-sporet har allerede lagt en regel ind:

```css
body:has(.klaebebar:not([hidden])) .sidefod__ramme{
  padding-bottom:calc(var(--r6) + 72px);
}
```

**`72px` er hårdkodet — præcis den D7/L30-fælde, planens §5 selv argumenterer
imod**, og den er forkert i begge retninger: bjælken er 45,7 px i dag og bliver
≤ 40 px efter dit arbejde. Reglens egen kommentar siger, at den blev skrevet,
fordi *"spor/barplan planlaegger den bar netop nu og ejer dens afsnit"* — altså
med vilje som en midlertidig løsning, indtil dette spor kom.

**Erstat de 72 px med `var(--barplads)`.** Det er reglens egen hensigt.

**Acceptkriterium 4a** (= planens 5.1): ved maks. rulning med 1 og med 3 valgte,
ved 1440, 1024 og 390 px, er `<p class="t-lille">`-elementets `bottom` **mindre
end** bjælkens `top`. **6 målinger, 0 overlap.**

**Giver i dag: 6 målinger, 6 overlap — PLANENS browsermåling fra kl. 13.45, ikke
orkestratorens.** Tag den selv som din grundmåling, før du retter noget; det er
den, der beviser, at problemet var der, før du kom.

**Acceptkriterium 4b** (= planens 5.2): på en robotside og på Om-siden er
`getComputedStyle(document.body).paddingBottom` **uændret** mod main. 4 sider, 2
sprog, 0 afvigelser. **Giver i dag:** `grep -c "barplads" assets/system.css
assets/katalog.js` → **0 og 0**.

**Acceptkriterium 4c:** `grep -c "72px" assets/system.css` går fra **1 til 0**.
**Giver i dag: 1** — målt af orkestratoren 23:19, og den ene forekomst er præcis
linje 3159 i sidefodens `:has()`-regel. Tallet er entydigt: der er ingen anden
`72px` i filen at forveksle den med.

### Punkt 5 — DOM-placering (D5) og grænsebeskeden (D6)

Planens §7 og §3's afsnit om Retning C. `assets/katalog.js` gør i dag
`document.body.appendChild(klaebebar)` — **målt: linje 186 i main.** Indsæt før
`<main>` i stedet; `position:fixed` gør, at intet flytter sig visuelt.

`<p class="saml-graense" data-saml-graense role="status">` **findes allerede**
(`tools/skabelon/katalog.mjs:1481`) — genbrug den, byg ingen ny.

**Ingen tal, intet mærke, ingen "2 af 3"** — heller ikke i `aria-live`. Hård
begrænsning 1, og planens §9 punkt 2.

**Acceptkriterium 5** (= planens 7.1): med 3 valgte ved 1440 er `Åbn
sammenligningen`s plads i den fokuserbare rækkefølge **≤ 10**.

**Giver i dag: 231 af 232 — PLANENS browsermåling, ikke orkestratorens.**
Orkestratorens del er kildecitatet: `document.body.appendChild(klaebebar)` står
på `assets/katalog.js:186`, slået op og bekræftet 23:12.

### Punkt 5b — `Ryd udvalget` BLIVER (J5). Afgjort af JPK, ikke af dig

**Planens §10 lod dette stå åbent** (*"om `Ryd udvalget` overhovedet skal
overleve, når der er tre `Fjern`-knapper"*). **JPK afgjorde det 3. sep 2026:
knappen bliver.**

Begrundelsen, så en efterfølger ikke "rydder op" i den: den er **den eneste
måde at tømme udvalget på, der ikke kræver, at man rammer tre knapper** — og
den koster ~40 px i en bjælke, der alligevel går fra 1.440 til ~653 px.

**Bjælken har derfor 5 fokusstop:** `Fjern` × 3 → `Åbn sammenligningen` →
`Ryd udvalget`. Det er tallet, planens §4 forudsætter, og det er nu bekræftet.

**Foreslå ikke at slette den, og byg ikke et alternativ.** §10's tredje punkt er
lukket.

### Punkt 6 — mobilen (D7)

Planens §6: ét vandret rullespor ved < 700 px — **J3, JPK's beslutning**, truffet
mod to forelagte alternativer. `Åbn sammenligningen` fast uden for sporet. **`overflow-x` klipper fokusringen** — dækket løser det allerede med
`scroll-padding-inline` og en indad-tegnet ring; genbrug det mønster.

**Acceptkriterium 6:** bjælkens højde ved 390 px med 3 valgte er **≤ 40 px**, og
fokusringen på det tredje `Fjern` er **synlig** på et skærmbillede, du selv har
set på. **Giver i dag: 69,3 px — PLANENS browsermåling, ikke orkestratorens.**

### Punkt 7 — test 81, og de tests, der allerede vogter bjælken

Ny fil `tests/dele/81-bundbar.mjs` efter `tests/LAESMIG.md`s kontrakt.

**LÆS DETTE, FØR DU RØRER EN EKSISTERENDE TEST — brief-skillens punkt 10: en
test kan være det sidste sted, en beslutning findes.** Tre filer nævner
bjælken (målt: `grep -rl "klaebebar" tests/dele/*.mjs | wc -l` → **3**):

- **`48-katalogets-flader.mjs:259-264`** — `48.28`/`48.29` skærer CSS-blokken ud
  med `udsnit(css, '/* PUNKT 6 (JPK 1. sep 2026, L67): den klaebende bjaelke.', …)`
  og tjekker, at den bærer **intet handels- eller kurv-ord**. **Din omskrivning
  af blokken kan flytte det anker, og så bliver 48.28 rød af en grund, der intet
  har med dit arbejde at gøre.** Bevar kommentarens første linje ordret, eller
  ret ankeret bevidst og skriv hvorfor.
- **`48.31`/`48.32`** vogter `klaebebar_etiket`. **`65-katalogbar.mjs`** vogter
  bærer-chippen. **`61-extract.mjs:55,60`** kender `.klaebebar__gaa`.
- **Vend, slet ikke.** Ændrer en assertion adfærd, så vend den, så den beviser
  den nye regel, og lad den citere hjemlen.

**Acceptkriterium 7:** `node tests/koer.mjs` viser **0 fejlede**, test 81's
overskrift står i outputtet, og suitens samlede antal er **grundmålingens tal
plus præcis dine nye assertions**. Hver assertion i 81 har et **revert-bevis** i
rapporten: hvad den kræver, og hvilken ændring der får den til at falde rød.

---

## 5. FILEJERSKAB

**Du ejer:**

- `assets/system.css` — **kun** `.klaebebar*`-reglerne, `:root`s nye
  `--barplads`, `body`/`html`-reglerne, og sidefodens `:has()`-regel på 3158
- `assets/katalog.js`
- `tools/skabelon/katalog.mjs` — **kun** `.saml-taeller`s data-attributter
  (1472-1478). **Rør ikke facetterne** (linje 433-534 og 1166-1188)
- `tests/dele/81-bundbar.mjs` (ny), og de assertions i `48`/`61`/`65`, du
  beviseligt selv har gjort røde
- `fund/FUND-bundbar.md`

**Du må IKKE røre:** `assets/generator.css`, `data/robots/`, `data/i18n/`
(**ingen ny nøgle** — de to, du skal bruge, findes), `tools/skabelon/side.mjs`,
`db/`, `DESIGN.md`, `STATUS.md`, `CLAUDE.md`, `dist/` (genereret).

**`.saml-taeller` er permanent `hidden`, men må ikke slettes** — den er bærer af
tre oversatte strenge (planens §9 punkt 9).

---

## 6. TRE STEDER, HVOR PLANEN ER FORÆLDET

Planen er skrevet kl. 13.45 i dag. Fire spor er flettet siden. **Alle tre er
målt af orkestratoren kl. 23:10-23:15, ikke husket.**

1. **Fokusringen.** Planens §4 siger, bjælken har sin egen 2 px accent-ring på
   `system.css:2482-2483`. Der er nu et **token**: `system.css:346` siger
   `.sidefod,.klaebebar{--ring:var(--accent)}`, og grundværdien er
   `var(--blaek)`. **Bjælken skal ikke opfinde sin egen ringfarve — den arver
   `--ring`.** Se DESIGN.md:457 (DP1b). Planens §11-kontrasttal er stadig
   rigtige; det er kun ringens *mekanisme*, der er ny.
2. **Sidefoden er kommet tilbage**, og der er nu en `:has()`-kobling mellem
   bjælken og foden med et hårdkodet `72px` — punkt 4 ovenfor. Planen kender
   ingen af delene.
3. **Å152 noterede et åbent designfund:** *"bundbaren og foden er samme gunmetal
   og smelter sammen ved 390 px."* **Retning B løser det** — en fritstående
   genstand med hårstreg, løftet fri af kanten, smelter ikke sammen med båndet
   under den. **Efterprøv det med et skærmbillede ved 390 px og skriv i
   rapporten, om fundet er lukket.** Er det ikke, er det stadig et fund.

---

## 7. BRIEFETS FAKTA ER PÅSTANDE

**Afviger noget, du måler, fra noget, dette brief påstår, så rapportér
afvigelsen — det er en del af leverancen, ikke ulydighed.** Orkestratoren
kontrolleres ellers af ingen; på denne session er orkestratorens fakta blevet
rettet elleve gange på én dag, og alle elleve rettelser var rigtige.

**Tal mærket "forudsigelse" skal du måle og erstatte med dit eget:** ~653 px
bredde, ~26.000 px², 60 % arealreduktion. Planens ~420 px ved én robot ligeså.

**HVERT "giver i dag"-tal bærer sin ophavsmand, og forskellen er ikke kosmetisk.**
De tal, der står som *målt af orkestratoren*, er `grep`/`sed` mod kilden kl.
23:10-23:19 i aften og kan genkøres med den kommando, der står ved siden af. De
tal, der står som *planens browsermåling*, er fra kl. 13.45 og er taget i en
browser mod en anden byg, **før aftenens fire flet.** De er sandsynligvis stadig
rigtige — men de er andenhånds, og fokusringen og sidefodens `:has()`-regel har
beviseligt ændret sig siden. **Genmål dem, før du bruger dem som før-tal.**

Det er ikke mistillid til planen; det er Å152's regel: *en måling, der var
rigtig, da den blev taget, er ikke et varigt faktum.* Tre gange på én dag har
den fejlform kostet noget her.

**Fælden, orkestratoren gik i her i aften, så du ikke gør det samme:**
`find dist -name index.html | wc -l` giver **213** — og 213 er præcis det
forældede sidetal, CLAUDE.md advarer imod. Det ser derfor ud som en bekræftelse.
Det rigtige tal er **216**: `find dist -name "*.html"` = 213 `index.html` + 3
`404.html`. **Et forkert tal, der tilfældigvis matcher et kendt tal, er farligere
end et, der ikke gør.**

---

## 8. RAPPORT

`fund/FUND-bundbar.md`. Højst 60 linjer plus `spor`-skillens to obligatoriske
sektioner.

**Først en før-og-efter-tabel i UI-termer** — samme form som punkt 1 ovenfor,
men med **dine målte tal** i "efter"-kolonnen. JPK skal kunne godkende uden at
læse en måleprotokol. Derefter målingerne, konfidensniveauerne og forbeholdene.

**Skærmbilleder, du selv har set på:** 1440 og 390 px, begge sprog, med 1 og med
3 valgte. Bjælken bygges **klientside** af `assets/katalog.js` — **et `grep` i
`dist/` kan ikke se den**, og orkestratoren tog fejl af netop det i dag. Brug:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png>
```

**Skriv udtrykkeligt, hvis en assertion viser sig ikke at bevise noget**, og hvis
du ændrer en `font-size` — DP3b's acceptkriterium er, at du ikke behøver.
