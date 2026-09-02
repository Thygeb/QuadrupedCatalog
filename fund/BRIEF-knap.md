# BRIEF — spor/knap: L77, én knapprimitiv til hele sitet

**Model:** Opus (L45 — leverancen dømmes med øjne).
**Worktree:** `C:/Praktik/websites/udstilling-wt-knap` · **gren:** `spor/knap` · **base:** `f8eac85`.
**Egen serverport: 8260.** Aldrig 8080.

## Opgaven

**L77, besluttet af JPK 2. sep 2026 og endnu ikke bygget:** der bliver **ÉN** knapprimitiv,
`.knap`, med varianter, og **grundformen taler TYPESKILT** — mono, versaler, spærret, skarpe
hjørner. Alle nuværende knapklasser foldes ind som varianter, så led 3's fladeplaner ikke hver
kan opfinde deres egen.

**Hvorfor det haster nu:** fire fladeplaner skal skrives efter dette spor. Bygges primitiven
bagefter, har fire planer allerede skrevet hver sin knap ind, og afstemningen bliver fire
omskrivninger i stedet for én beslutning. Det er Å103's egen forudsigelse:
*"uden det midterste led ville fem fladeplaner hver finde på deres egen knap."*

## Bestanden — målt af orkestratoren på `f8eac85`, 216 byggede sider

| Klasse | Sider | Elementer | CSS i system.css | CSS i generator.css |
|---|---|---|---|---|
| `videre` | **158** | **298** | 8 | 5 |
| `videre--stille` | 142 | 142 | (samme blok) | (samme blok) |
| `nulstil` | 2 | 2 | 0 | **12** |
| `kort__saml` | 2 | **344** | **14** | 0 |
| `valg__fjern` | 2 | 92 | 1 | 2 |
| `f-sort` | 2 | 10 | 0 | 0 |
| `saml-taeller__ryd` | 2 | 2 | 2 | 0 |

**Fire bygges KLIENTSIDE og findes derfor ikke i `dist/`** — de tælles i JS'en, ikke i HTML'en:

| Klasse | Forekomster i `assets/*.js` | CSS |
|---|---|---|
| `saml-fjern` | 4 | **0** (arver fra noget andet — find ud af hvad) |
| `saml-invit__link` | 1 | 4 (generator.css) |
| `klaebebar__ryd` | 2 | 3 (system.css) |
| `klaebebar__gaa` | 1 | 3 (system.css) |

**Det er 11 knapudtryk, ikke 7.** CLAUDE.md og Å110 siger 7; de fire klientside-byggede kom
til senere. **Tallene ovenfor er målt i dag — brug dem, ikke de gamle.**

## De to stemmer, og hvorfor valget allerede er truffet

`.videre` (`system.css`, omkring linje 1426) er **massiv blæk, hvid tekst, 46 px høj,
15 px/600 sans** — det forladte ORBIT-system. Den står på **158 sider**.
`.nulstil` (`generator.css`, omkring linje 1128) er **mono 12 px, versaler, spærret `.11em`** —
TYPESKILT. Den står på **2**.

**Den låste retning er TYPESKILT.** Grundformen skal derfor være `.nulstil`s stemme, ikke
`.videre`s — også selv om `.videre` er 79 gange så udbredt. Udbredelse er ikke et argument for
en retning; det er et mål for, hvor meget arbejde der ligger i at rette den.

## Låse, der ikke må brydes

- **L76 — `--accent` (gul) må ALDRIG være forgrundsfarve på lys bund.** Målt **1,38:1** mod
  WCAG's 4,5. `.videre--stille` er i dag `color:var(--accent)` på lys bund — **1,60:1** — og
  skal rettes uanset hvad denne opgave ellers gør. **Mål kontrasten på hver variant, du laver,
  og skriv tallet.** Angiv altid en læseretning: et kontrasttal uden "X på Y" er ikke et tal.
- **L79 — 2px er systemets radius**, tokenet hedder `--hjoerne`. **`--stans` er en FARVE**, ikke
  en radius; det navn er optaget.
- **L80 — `--sans` er udgået.** Saira til maskinen, Literata til brødteksten, `--mono` til
  TYPESKILT-stemmen.
- **P0: siden skal virke uden JavaScript.** Flere af knapperne er `<label for>` over en skjult
  `<input>`, og mekanikken er søskende-kombinatoren `~`, som **kun rammer senere søskende**.
  Flytter du et element, så efterprøv med JS slået fra.
- **Hård begrænsning 1:** ingen forhandleraftale. Ingen købsknap, intet affiliate-link, ingen
  prisforespørgselsformular. En knap må aldrig kunne læses som en salgshandling.
- **Designfrysen L70** gælder alt andet end denne opgave: ser du noget andet, der burde laves
  om, så **notér det, ret det ikke**.

## En advarsel, købt for en fejl i går

`spor/saml3` byggede en ny knap ved at genbruge `.nulstil` og fik **1,16:1** — praktisk talt
usynlig. Årsagen: `.nulstil` er en **mørk-flade**-knap (`--paafod` = `#E8EBED`), og den blev sat
på lys bund. **Første rettelse virkede ikke**, fordi den nye klasse var lige så specifik som
`.nulstil`, der står 700 linjer senere i samme fil. Efter en mere specifik selektor: **14,69:1**.

**Læren for dette spor:** en primitiv skal bære sin flade i sig. Har du en mørk-flade-variant og
en lys-flade-variant, skal de hedde noget forskelligt, og ingen af dem må være den, man får ved
et uheld.

## Filejerskab

**Du ejer:**
```
assets/system.css
assets/generator.css
assets/katalog.js
assets/sammenligning.js
tools/skabelon/katalog.mjs · robot.mjs · sammenligning.mjs · producent.mjs · om-os.mjs
tools/skabelon/side.mjs · fejl404.mjs
data/i18n/da.json · data/i18n/en.json      (kun hvis en knaptekst skal ændres — begge filer, L82)
tests/dele/57-doed-css.mjs
tests/dele/70-knap.mjs                     (ny fil, nummeret er tildelt dig)
fund/FUND-knap.md                          (din rapport)
```

Du ejer med vilje næsten hele frontenden: en systemprimitiv kan ikke bygges i én fil. **Derfor
kører dette spor alene** — ingen andre frontend-spor er i gang.

**Forbudt — en anden session kører fase 2 samtidig:**
```
db/**  ·  media/_kilder/**  ·  data/robots/**
tests/dele/63-*  ·  64-*  ·  68-*  ·  69-*
PLAN.md  ·  DATAFLOW.md
```

Rører opgaven en forbudt fil, så **stop og rapportér**.

## Grundmåling — DIN FØRSTE KOMMANDO er at genmåle den

Målt af orkestratoren på `f8eac85` umiddelbart før afsendelse:

```
node tools/validate.mjs    77 filer / 0 fejl / 1 advarsel
node tools/build.mjs       216 sider · 1111 tal med kilde / 0 uden
node tests/koer.mjs        1591 bestaaet / 0 fejlet
```

**Nul røde. Enhver rød test efter dit spor er din.**

**Gitignorerede filer skal kopieres ind, ellers giver validate 54 fejl, der ikke er dine:**
```
cp -r ../udstilling/assets/fotos/fabrikant/. assets/fotos/fabrikant/
```

## Acceptkriterier

**K1–K3 er strukturelle og har målte nutal.** Skriv dine egne mønstre, hvis mine er for brede —
men **kør dem mod grenens udgangspunkt først og skriv, hvad de giver i dag**, før du ændrer noget.

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| K1 | `grep -rho 'class="[^"]*\bvidere\b' dist --include='*.html' \| wc -l` | **298** | **0** |
| K2 | `grep -c '\.videre' assets/system.css` | **8** | **0** |
| K3 | `grep -c '\.videre' assets/generator.css` | **5** | **0** |

**K4 — én primitiv, ikke elleve.** Efter sporet skal hver af de elleve klasser enten være
`.knap` med en variant, eller være væk. **Skriv tabellen om i rapporten med de nye tal**, én
række pr. gammel klasse, så en læser kan se, hvor hver enkelt endte. En klasse, der overlever
uændret, skal have en begrundelse på sin egen linje.

**K5 — kontrast på hver variant, med læseretning.** Ingen variant under **4,5:1** for tekst.
Skriv tallene i rapporten. `.videre--stille` giver **1,60:1** i dag — det er den værste og skal
være den første, du måler bagefter.

**K6 — P0 holder.** Efterprøv med JavaScript slået fra, at enhedskontakten, filtrene og
sorteringen stadig virker. Skriv, hvordan du målte det.

**K7 — ingen død CSS.** `tests/dele/57` fører en liste over kendte døde klasser med en præcis
match-assertion. Fjerner du en klasse helt, skal posten **ud** af listen, ikke blive stående.

**K8 — SET MED ØJNE, og det er kriteriet, de syv andre ikke kan erstatte.** Kør din server på
8260 og skyd mindst fem flader ved **1440 og 390**: katalogsiden, en robotside,
sammenligningssiden med tre robotter valgt, en producentside og Om os. **Læs skuddene selv med
Read-værktøjet.** Skriv, hvad du så — ikke "ser rigtigt ud", men hvilke knapper der står hvor,
og om de nu ligner hinanden.

**Det er den fejl, der gik grøn i går på nabofladen:** Å121's punkt 1 havde et kriterium, der
var kørt, reproducerbart og gyldigt — og som målte tre etiketter, hvoraf de to sad på skjulte
instanser. Kriteriet var grønt, funktionen virkede ikke.

**K9 — ny test i `tests/dele/70-knap.mjs`:** mindst én assertion, der fælder, hvis en klasse
uden for primitiven dukker op igen, og mindst én, der fælder, hvis en variant mister sin
kontrast. **Ret assertions, vend dem — slet dem ikke.** Knækker en eksisterende test, så vend
den, så den beviser den nye regel, og skriv hvilken og hvorfor. Der findes assertions om
`.videre` i flere testfiler; **find dem, før du bygger.**

## Skills

**Vurdér og skriv, hvad du valgte og hvad du gik forbi, med begrundelse.** Den oplagte er
`impeccable extract` (samle spredte primitiver ind i systemet — præcis denne opgaves form).
`impeccable typeset` og `layout` er relevante for grundformens mål. `impeccable audit` for
kontrast og tastaturbetjening. Gå forbi `critique`/`ui-ux-critique`: de er fejljagt på en bygget
side, ikke en primitiv.

Kald til plugin-skills fra en worktree svinger — stillingen er **4 virkede / 1 fejlede**.
Lykkes kaldet ikke, så læs fra disk:
```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```
**og skriv i rapporten, at du læste den fra disk.**

**Læs `DESIGN.md` før du navngiver noget.** Den beskriver systemet, som det er efter led 1 og 2.
Primitiven skal skrives **ind** i den — en primitiv, der ikke står i DESIGN.md, er ikke i
systemet, og det er præcis hullet, robotsidens fladeplan lige har målt: syv af robotsidens egne
blokke findes **0 gange** i DESIGN.md, mens 76 CSS-regler betjener dem.

## Miljø — hver af disse koster en runde, når den udelades

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- Commit-beskeder med backticks, `$` eller anførselstegn: skriv til fil, `git commit -F <fil>`.
- **`sed -i` fejler tavst med exit 0.** Brug Edit-værktøjet, som fejler synligt.
- **`tools/skabelon/katalog.mjs` er ÉN stor template literal** — et backtick i en HTML-kommentar
  dræber bygget med `SyntaxError`. Det kostede et spor en byggefejl i går.
- **En HTML-kommentar tæller med i et grep-baseret acceptkriterium**, og **råt `grep -o '{'` i
  CSS tæller også klammer i kommentarer.**
- **Send aldrig en kommando til `/dev/null`, hvis dens exitkode eller fejltekst er en del af
  målingen.**
- `git -C` skal have `C:/Praktik/...`, ikke `/c/Praktik/...`.
- Skriv filer som UTF-8 **uden** BOM.
- **Serveren:** `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m
  http.server 8260 --directory dist` fra worktree-roden, **aldrig `cd dist`**.
  **Verificér mod disken, før ét eneste tal bruges** — vælg et kontrolord, der kun findes i din
  udgave. Ordet `hjoerne` duer ikke; det findes 10 gange i mains eget stilark.
- **Bruger du den styrbare browser: den skriver skærmbilleder i HOVEDREPOET** (sessionens cwd),
  ikke i din worktree. Flyt dem ud og efterprøv, at `git status` i hovedrepoet er ren.
- **Luk din server, når du er færdig med at måle, og skriv i rapporten, at du gjorde det.**
- **Ryd `tests/.tmp-koersel` i din worktree, når du er færdig.**
- **`node tests/koer.mjs` må KUN køres i din egen worktree.** Tre fase 2-spor kører i andre
  worktrees; kører to testpakker i samme arbejdstræ, crasher den ene med `ENOTEMPTY`.

## Commit undervejs er et krav

Ét commit pr. sammenhængende ændring — primitivens definition, så én variant ad gangen. Dette er
sessionens største enkeltspor; et spor, der dør undervejs, skal kunne måles i stedet for gættes.

## Rapporten — `fund/FUND-knap.md`, højst 60 linjer

1. Valgt løsning og fravalgt løsning, én linje hver.
2. **Konfidens pr. punkt.** *Høj* kræver en genkørbar kommando **plus** én linje om, hvad tallet
   ville have været, hvis arbejdet var forkert. Uden begge dele: middel.
3. Usikkerheder.
4. Målingerne som tal — inklusive K4's tabel og K5's kontrasttal.

**UDEN FOR de 60 linjer, obligatorisk:**
- **"Nye fælder og opdagelser."** Er der intet, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen — det er en del af
leverancen, ikke ulydighed.** **Fem af mine brief-tal blev rettet af spor i går**, alle fem med
rette: to fordi kommentarer nævner klassenavnene, ét fordi `x-default` har en bindestreg, ét
fordi `kort-ophav` matchede `kort`, og ét fordi et citat havde to etiketter byttet om. Regn med,
at der er en sjette her.
