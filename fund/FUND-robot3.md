# Rapport: spor/robot3 (Pris i nøgletalsblokken)

## Skill-vurdering
**Valgt:** `spor` (metode), `robotdata` (skema), `impeccable layout` (gitteret), `fejljagt` (MSYS-stifælden). **Fravalgt:** `supabase` — ingen databaseret.

## Grundmåling
- `validate.mjs`: 77 filer · 0 fejl · 1 advarsel (R9 ghost-robotics-vision-60).
- `noegletal_taeller`: b = 5 på alle 77 sider. Prisdata: 11 tal (6 CNY, 4 USD, 1 EUR), 66 uoplyst.

## Ændringer
- `robot.mjs`: læser `data/kurser.json`; `pris` i `STRIBE_FELTER`, `i-pris` i `IKONER`, `prisVaerdi()` med ECB-omregning og kildepris.
- `generator.css`: `.stribe--seks` (rent 2x3 uden span 2), `.pris-par`, `.stribe-kildepris`.

## Acceptkriterier

**1. Tælleren — HØJ.** b gik 5 → 6 på alle 77 sider. Script over `dist/en/robotter/*/index.html`, regex `<b>(\d+) of (\d+) stated</b>` → `{"6":77}`.
*Kontrafaktisk:* uden pris i `STRIBE_FELTER` havde nøglen været `{"5":77}`; fulgte tælleren ikke med, havde fordelingen været blandet.

**2. 11 mod 66 — HØJ, men briefets tal skal deles i to.**
Målt på `dist/`: **11** viser en pris, **61** viser "not stated" i cellen, **5** har slet ingen `<ul class="stribe">`. 11 + 61 + 5 = 77.
De 5 (`ghost-robotics-spirit-40`, `unitree-laikago`, `weilan-alphadog-e300`/`-e400l`, `weilan-babyalpha`) oplyser **nul** nøgletal og rammer den eksisterende `.stribe--intet`-gren: *"0 of 6 stated · 6 gaps"*. Prisen er stadig markeret uoplyst — kollektivt i stedet for pr. celle. Grenen fandtes på `c95abce`.
**Briefets 66 er rigtigt i sum, forkert i form.** *Kontrafaktisk:* faldt prisen tavst ud, havde tallet været 11 / 0 / 66.

**2b. De 13 sider med ordet "USD" — HØJ. Afvigelsen mod 11 er opklaret.** `grep -rl "USD" dist/da/robotter/` giver 13, fordi det matcher hele siden, ikke priscellen:

| gruppe | `pris` i YAML | i priscellen |
|---|---|---|
| genisom-l2, yuejia-yj30 ×4, yufan-cyvet (6 CNY) + neura (1 EUR) | tal | tal + kildepris |
| pudu-d5, pudu-d5-w, unitree-go1, unitree-go2 (4 USD) | tal | tal, ingen kildepris (basisvaluta) |
| **unitree-a2, unitree-b2** | **`vaerdi: "ikke_oplyst"`** | **IKKE OPLYST** |

7 + 4 = **11 viste priser.** De sidste to bærer kun "USD" i en **prosanote**: producentens shop viser pladsholderen 100.000 USD med *"Contact us for the real price"* — samme beløb på begge modeller. Indsamleren har korrekt ført prisen som `ikke_oplyst` og gemt beviset i noten. **Ingen tredje vej ind i tallet; 11 står.**
Census med projektets egen `parseYaml`: 6 CNY + 4 USD + 1 EUR = 11 tal, 58 rå streng + 8 objekt = 66 uoplyst — matcher `skema.mjs:664` præcis. *Kontrafaktisk:* arvede a2/b2 en pris fra en variant-søskende, ville deres celle vise et tal frem for `v-ikke`.

**3. Kildebogstavet — HØJ.** `<a class="kildemaerke">` sidder **inde i** `<span class="stribe-kildepris">`, efter kildetallet — aldrig efter USD-tallet. Genisom L2: `≥ 5,952 USD` uden mærke, `≥ 39,999 CNY A` med. Neura: `57,980 USD` uden, `50,000 EUR B` med.
Omregningen efterprøvet mod `kurser.json` (ECB 2026-08-31, per_euro USD 1.1596 / CNY 7.7922): 39999 CNY → 5952, 50000 EUR → 57980 — identisk med det byggede. *Kontrafaktisk:* hang mærket på omregningen, ville `kildemaerke` stå før `stribe-kildepris` i node-rækkefølgen.

**4. Data urørt — HØJ.** `git diff c95abce..HEAD --stat -- data/robots/` → 0 filer. *Kontrafaktisk:* enhver YAML-rettelse havde givet mindst én fil.

**5. Set med egne øjne — MIDDEL.** 1440 (to sider) og 390/680 (én), efter servervagt mod disken (curl 6 = disk 6).
Med pris: USD-tallet i normal talstørrelse, kildeprisen under i lille grå mono — ingen valutasymbol i displaystørrelse, ingen fremhævning. Cellen læses som ét tal blandt seks (begrænsning 1). Uden pris: den **eksisterende** stiplede "not stated"-boks, som de fire øvrige huller (begrænsning 5). Middel, fordi **68 af 77 sider aldrig er set i en browser.**

**2c. Mobilmålingen — HØJ. Lukker min tidligere største usikkerhed.**
Isoleret Playwright med URL- og breddevagt, `.pris-par` mod dens `<li>`: ved 390 er parret 107 px i en celle på 177 (`overloeb_i_celle: false`); ved 680 114 mod 315. `vandretOverloeb: 0` på hele siden ved 390.
Ved 390 ombryder enheden `USD` til sin egen linje — men det gør nabocellens `approx. 16 / kg` også. Cellens **eksisterende** opførsel, ikke noget parret indfører. *Kontrafaktisk:* løb parret over, ville `parScrollW` have oversteget `celleClientW`.

**6. De fem `!important` — orkestratorens spørgsmål, nu målt. HØJ.** Målt via CSSOM i browseren, uden at røre repoet: fjernet `!important` fra mine regler, derefter samme værdier lagt ind med højere specificitet.

| | `.v` | `.num` | `.enhed` | `.op` |
|---|---|---|---|---|
| i dag | 11,5px | 11,5px | 10px | 11px |
| uden `!important` | **23px** | 11,5px | 10px | 11px |
| med specificitet | 11,5px | 11,5px | 10px | 11px |

**Kun ÉN af de fem er bærende** — `.stribe-kildepris .v` (0,0,2,0) taber til `.robot-noegletal .stribe .v:not(...)` (0,0,4,0) i `generator.css:846`. **De fire andre er tom last.** Konflikten *kan* løses: `.robot-noegletal .stribe .stribe-kildepris .v` (0,0,4,0), senere i filen, giver 11,5px uden `!important`. **Jeg har ikke rettet det.** Frysen siger, at fund noteres, og tvivl gør noget til en designrettelse — og det rører netop det `.v`-system, som `generator.css:823-845` beskriver som en fejl, der allerede er indført og rettet én gang før.

## Målinger til sidst
- `validate.mjs` 77/0/1 · `build.mjs` 216 sider, 1111 tal med kilde, 0 uden · `git status` rent · `git diff c95abce..HEAD --stat` 6 filer, 195+/14- = **209 linjer** (kriteriet: under 250), heraf 146 i kode, resten rapport. De to i18n-filer er nu byte-identiske med `c95abce`, fordi den døde nøgle blev fjernet igen.
- Commits: `4d53a5e` omregning · `cca8f63` skabelon/i18n · `e86d1ef` CSS · `3d55dd3` oprydning · `e584157` død i18n-nøgle · `6639741` tre tilstande.

## Nye fælder og opdagelser
- **Briefets påstand om at b var 6 fra start var falsk.** Måling gav b = 5 (CE var taget ud af striben tidligere). Kodekommentaren om et engang hårdkodet "seks" var en reel advarsel.
- **En formatter har kørt over `robot.mjs` og `generator.css`, uden at nogen bad om det**, og efterlod 2.777 + 644 ændrede linjer ucommitteret — hvoraf 24 nævnte `pris` og lignede ægte arbejde. **De var det ikke.** Bevis: normaliseret (al whitespace fjernet, anførselstegn ensrettet, efterstillede kommaer og semikoloner fjernet) var *hver eneste* tilbageværende forskel enten en parentes om en ternær, et manglende nul foran et decimaltal (`-.01em` → `-0.01em`) eller hex-versalisering (`#FFFFFF` → `#ffffff`). Nul semantisk ændring; hele diffen kasseret med `git checkout --` uden tab. **Lære: mål om en diff er semantisk tom, før du bruger en runde på at skille den ad i hånden.** En ordtælling på `pris` kan ikke skelne en omformateret linje fra en ny.
- **`node` og Git Bash er uenige om MSYS-stier, og `flade-skud.mjs` fejler TAVST på det.** Med udfilen som `/c/Users/.../x.png` skrev værktøjet `skudt /c/Users/.../x.png` og exit 0 — men filen landede i `C:\c\Users\...`, fordi Windows læser `/c/...` drev-rod-relativt. Read sagde derfor "File does not exist" om en fil, værktøjet lige havde meldt skudt. **Giv altid `flade-skud.mjs` en `C:/`-sti.** Samme fælde ramte `node norm.cjs`. **`C:\c\` rummer i dag 113 MB forældreløst affald fra mindst tre spor** (68 MB fra `spor/saml2`, en hel `tests/.tmp-koersel`). Jeg fjernede kun mine egne to filer.
- **En ubrugt i18n-nøgle ligner ikke en fejl — den ligner omhu.** Jeg tilføjede `stribe_pris`, fordi de fem søskende `stribe_*` allerede stod der. De fem er selv halvdøde: kun fire kaldes, og `stribe_ip_klasse` var lige så ubrugt før mig. **En nøgle, der passer ind i et mønster, bliver ikke efterprøvet** — og mønsteret var allerede råddent. Målingen er én linje: fjern nøglen, byg, og tæl om siden ændrer sig (den gjorde ikke: 77 af 77 bar stadig "Vejledende pris").
- **Et `grep -A2` over YAML-blokke bløder ind i nabofeltet.** Mit første forsøg på at tælle pristilstande gav `2 × vaerdi: true` — hvilket ville have været en brudt begrænsning 5. Der findes ingen sådan pris; vinduet havde fanget det næste felts `vaerdi`. **Tal fra et fast linjevindue over strukturerede data er gæt.** Projektets egen `parseYaml` gav det rigtige svar lige så hurtigt.

## Punkter i briefet, jeg ikke nåede
To tidligere usikkerheder er nu målt og lukket (mobil, 2c; `!important`, 6). Tilbage står, rangeret efter pris:

1. **Om min omregning giver samme tal som katalogets, er ikke målt.** `sortering_pris_note` og `filter_pris_note` beskriver allerede en prisomregning med ECB-kurs og dato — altså en anden vej til det samme tal. Jeg genbrugte `data/kurser.json`, men jeg har aldrig set den anden implementering; den ligger i `spor/kat3`'s filer, som jeg ikke må røre. **Går de fra hinanden, viser katalog og robotside forskellige USD-priser for samme robot, og ingen test fanger det.** Den dyreste rest.
2. **68 af 77 sider er aldrig set i en browser.** De 11 med pris er den interessante delmængde, og jeg har set én. `yuejia-yj30-max-w` (358.000 CNY → seks cifre i begge tal) er et længere par end det, jeg målte, og er ikke set.
3. **Kursen er et tal med en dato, og cellen bærer ingen.** `kurser.json` er ECB pr. 2026-08-31, og dens `_laesmig` insisterer med rette på, at en vekselkurs selv er et tal med kilde. Min priscelle viser hverken kurs, dato eller en note om, at USD-tallet er **vores** omregning — modsat enhedsomregningen, som skriver *"a conversion has no source of its own"* i klartekst. Kildebogstavet peger korrekt, så intet er tilskrevet forkert; men en læser kan ikke se, at USD-tallet er beregnet, eller hvornår. **Jeg vurderer det som et hul, ikke en fejl — men det er en vurdering, ikke en måling, og beslutningen er JPK's.**
