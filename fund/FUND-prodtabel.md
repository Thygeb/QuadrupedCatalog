# FUND — spor/prodtabel (R7): producentindekset ved 390 px

**Fladens MODE: Operate** (DESIGN.md:296 og :309 — producentindekset er navngivet der).
**Udfald A valgt:** ingen rulleaffordance, fordi der ikke længere er noget at rulle til.

## Hvad JPK ser på skærmen — før og efter, ved 390 px

| På skærmen (da / en) | FØR | EFTER |
|---|---|---|
| Kolonnen **PRODUCENT / MANUFACTURER** | 418,3 / 392,5 px — den eneste synlige | **241 / 219 px**, synlig |
| Kolonnen **LAND / COUNTRY** | begyndte ved x = 434,3 / 408,5 mod en skærmkant på 374 — **helt usynlig** | **73,5 / 95,4 px**, synlig |
| Kolonnen **ANTAL / COUNT** | usynlig | **43,6 px**, synlig, højrestillet mod kanten |
| Kolonnen MODELLER / MODELS | `display:none` under 900 px (bevidst) | uændret |
| Vandret rulning i tabellen | **262 px skjult**, ingen affordance | **0 px skjult** |
| Ombrudte producentnavne | — | **1 af 25** (Shandong Youbaote Intelligent Robot, 2 linjer). `en`: også United States i LAND |
| Ved 1440 px | 237,1 / 174,3 / 104,6 / 836,0 | **identisk, alle fire tal** |

Set med egne øjne på skærmbilleder ved 390 px, begge sprog: før viste fladen kun
producentnavne; efter står navn, land og antal på samme linje med tallet flush mod
højre kant. Ingen tekst er klippet.

## Ændringen i kode

`assets/generator.css:2051` — én ny regel, `.prod-tabel { min-width: 0 }`, plus 38
linjers kommentar. **41 linjer tilføjet, 0 slettet** (`git diff --stat`): ingen
eksisterende regel er rørt, og `assets/system.css` er ikke åbnet.

## Årsagen var ikke der, hvor planen ledte

Planen (og briefet) pegede på de låste `20ch`/`12ch`-bredder. **De er uskyldige:**
`@media (max-width:899px)` sætter dem allerede til `auto` (generator.css:2141–2154),
og en browserprøve med `table-layout:fixed;width:100%` flyttede **intet**.

Skyldig er `assets/system.css:1820`, en bar elementregel:
`table{border-collapse:collapse;width:100%;min-width:620px;font-size:15px}`.
De **620** er tegn for tegn den `scrollWidth`, jeg målte. Reglen blev i sin tid
skrevet *til* denne tabel, dengang den var bred.

Fælden er allerede navngivet to steder i repoet — `.saml-matrix`
(generator.css:920–926: *"min-width:620px er den farligste af dem"*) og
`.typeskilt .skema-tabel` (system.css:2076) — og begge lukker den med præcis
`min-width:0` på deres egen tabelklasse. Min rettelse er den tredje anvendelse af en
kendt lokal neutralisering, ikke en ny opfindelse. `tests/dele/36-typeskilt-robot.mjs:241`
låser mønsteret for den ene af de to.

**Fravalgt alternativ:** udfald B (rulleaffordance via `::after`) — den løser ikke
problemet, den skilter med det, og en Operate-flade skal kunne løse opgaven, ikke
forklare hvorfor den ikke kan.

## Konfidens

| Punkt | Konfidens | Bevis · kontrafaktisk |
|---|---|---|
| Overløbet er 0 ved 390 px, begge sprog | **høj** | `node prodtabel-proev.mjs http://localhost:8123/{da,en}/producenter/ 390` → `overflow: 0`. Uden rettelsen giver samme kommando **262** |
| Intet klippes ved 320–1440 px | **høj** | Samme kommando ved 320/390/430/899/900/1440 × 2 sprog: klippede overskrifter **0**, celler med `scrollWidth > clientWidth` **0**. Uden rettelsen: 3 klippede overskrifter ved 390 (kun 390 blev maalt foer) |
| ≥900 px er uændret | **høj** | 1440 px før og efter: 237,1 / 174,3 / 104,6 / 836,0 i begge målinger. Var rettelsen for bred, ville mindst ét af de fire tal have flyttet sig |
| Byg og tests holder | **høj** | `node tools/build.mjs` → **77 filer · 0 fejl · 216 sider**. 21 testdele kørt (alle 19 der læser `generator.css`, plus 09 og 29): **556 assertions, 0 fejlet**. Var CSS'en ubalanceret, ville 52.1 have fejlet |
| Hård begrænsning 5 holder ved 390 | **høj** | `.v-ikke` injiceret i LAND og i ANTAL ved 320/390/430 × 2 sprog: `.mrk` måler **9 × 9 px**, ligger inden for fladen, overløb **0**. En for smal kolonne ville have klippet firkanten |

## Briefets to ekstra spørgsmål

**1. Hvad `ch` måler til.** `1ch` = 7,4 px på `thead th` (12,5 px skrift) og
**8,6 px** på `tbody td` (15 px). Altså `20ch` = 148,0 px og `12ch` = 88,8 px på
overskriften, men `12ch` = **103,2 px** på cellen — *samme deklaration, to bredder i
samme kolonne.* Ens ved 390 og 1440 og på begge sprog. **Og ingen af tallene er den
faktiske bredde:** ved 1440 er LAND 174,3 og ANTAL 104,6, fordi `table-layout:auto`
fordeler den overskydende plads. `width` virker som gulv, ikke som mål — de to
deklarationer er i praksis dekoration.

**2. Er der en tredje kolonne i klemme?** Nej — men briefets beskrivelse af de to
var for mild. LAND var ikke *"klippet midt i ordet"*: den lå 60 px uden for skærmen
og var lige så usynlig som ANTAL. MODELLER er `display:none` under 900 px ved en
dokumenteret beslutning (producent.mjs' hovedkommentar) og er ikke i klemme.

## Nye fælder og opdagelser

- **`system.css:1820`s bare `table{min-width:620px}` er en global fælde med tre
  ofre indtil videre** — `.saml-matrix`, `.typeskilt .skema-tabel` og nu
  `.prod-tabel`. Hver har måttet neutralisere den lokalt. Den fjerde tabel, nogen
  bygger, arver den samme 620 px uden varsel. **Anbefaling til orkestratoren:** dette
  hører hjemme i designplanen som en systembeslutning (skal gulvet flyttes ind i en
  klasse i stedet for at ligge på elementet?), ikke som endnu en lokal lap. Jeg har
  ikke rørt `system.css` — den ejes af `spor/tomstat`.
- **Der findes ingen test, der låser `.prod-tabel{min-width:0}`.** Mønsteret er låst
  for `.typeskilt .skema-tabel` af `tests/dele/36-typeskilt-robot.mjs:241`, og uden
  en tilsvarende assertion kan min regel fjernes tavst ved næste oprydning. Jeg ejer
  ikke `tests/`, så jeg har ikke tilføjet den — men den bør sendes som eget punkt.
- **Designfund, IKKE rettet (uden for mit ejerskab, frysen gælder):**
  `tools/skabelon/producent.mjs:547` skriver `antalDel = p.antal === null ? '' : …`.
  LAND får korrekt `H.tilstand('ikke_oplyst')`, men ANTAL får en **tom celle** for
  samme tilstand. Det er præcis *"et hul, der ligner et nul"* (hård begrænsning 5,
  DESIGN.md:934). Rammer ingen af de 25 producenter i dag (målt: 25 udfyldte
  antal-celler, 0 tomme, 0 nuller), men mekanismen står der.
- **Harmløs, men vildledende kaldeform:** `producent.mjs:543` kalder
  `H.tilstand('ikke_oplyst', i18n)`, hvor andet argument er et optionsobjekt
  `{kilder, post, hvorhen}` (`side.mjs:1343`). Nøglerne findes ikke i `i18n`, så
  defaults gælder og outputtet er korrekt — men formen ser ud, som om i18n bruges.
- **`design`-skillens kort er forældet**, som briefet forudsagde: den lover Layout på
  372 og Komponenter på 458; målt står de på **715** og **801**, og DESIGN.md er
  1.359 linjer, ikke 834. Briefets egne tal (801/715/934) er korrekte.
  **Desuden er DESIGN.md's egen DP2-tabel (linje 1013) forældet paa alle syv
  CSS-henvisninger.** Maalt: `.prod-navne` staar paa **2131**, ikke 1166;
  `.producent-fakta` paa **1911**, ikke 1087; `.eu-fund-linje` paa **29**, ikke 24.
  Vaerst: `.pnavn` (lovet 1099) og `.pland` (1104) findes slet ikke som de klasser,
  tabellen beskriver — de eksisterer kun som `.prodliste .pnavn` (**1958**) og
  `.prodliste .pland` (**1974**). Et spor, der greppede `^.pnavn`, ville faa nul.
- **DP2a er ikke bygget endnu, maalt her i forbifarten:** DESIGN.md:1085 stiller
  acceptkriteriet `grep -c "eu-fund-linje span" assets/generator.css` = **0**. Maalt
  paa min gren i dag: **1** (generator.css:50). Jeg har ikke roert det — det er en
  anden flade og et andet spor.
- **Briefets grep manglede en linje.** `grep -nE "width: *(20ch|12ch)"` giver
  2047, 2051, **2060** og 2087 paa grundmaalingens HEAD (`8eb117f`, foer min rettelse;
  efter den ligger de 41 linjer laengere nede). 2060 er en kommentarlinje med
  `width:12ch}` uden mellemrum efter kolon — uden den ser man ikke, at én af
  forekomsterne er prosa.
- **`netstat` findes ikke i Git Bash — og `2>/dev/null` skjuler det.** Mit foerste
  port-tjek var `netstat -ano 2>/dev/null | grep -c ":8123"`, som gav **0** og lignede
  "porten er fri". Den var tom, fordi kommandoen ikke findes. Samme form som
  CLAUDE.md's `git -C` + `2>/dev/null`-faelde. Brug fuld sti:
  `/c/Windows/System32/netstat.exe`, og `MSYS_NO_PATHCONV=1 taskkill /PID <n> /F`
  (`//PID` afvises af taskkill, selv om det er den saedvanlige MSYS-undvigelse).
  Det, der reddede maalingerne, var md5-sammenligningen mod disken — ikke porttjekket.
- **15 px er en rullebjælke.** Briefets `clientWidth 343` mod min `358` er ikke to
  forskellige sider — det er, om måleopstillingen tegner en klassisk rullebjælke.
  `scrollWidth` var identisk 620 i begge. Et `clientWidth` uden en note om
  rullebjælken er ikke et tal, man kan sammenligne på tværs af opstillinger.

## Punkter i briefet, jeg ikke nåede

- **Den fulde testsuite (`tests/koer.mjs`) er ikke kørt.** Jeg kørte 21 udvalgte
  testdele (556 assertions, 0 fejl) — alle 19, der læser `generator.css`, plus 09
  (producentoversigten) og 29 (tabelsemantik) — via en midlertidig delkører i
  scratchpad, ikke i repoet. Begrundelsen er briefets egen: 19 GB fri disk, fem
  spor, én suitekørsel ~2,8 GB. **Suiten på det flettede resultat er stadig
  orkestratorens, og dette spor har ikke bevist den.**
- Intet andet punkt i briefet er sprunget over.

## Oprydning

Maaleskripterne ligger i `C:/Praktik/websites/maalevaerktoej/` (aldrig i repoet):
`prodtabel-maal.mjs`, `prodtabel-sonde.mjs`, `prodtabel-proev.mjs`, `prodtabel-farve.mjs`,
`prodtabel-vikke.mjs`. De er efterladt med vilje, saa orkestratoren kan genkoere
konfidenstabellens kommandoer.

Serveren på 8123 er **stoppet** (se commit-beskeden for målingen).
`tests/.tmp-koersel` blev aldrig oprettet; delkørerens `tests/.tmp-delkoer` rydder
sig selv og er væk. Gitignorerede `assets/fotos/fabrikant/` (610 filer, 60 MB) blev
kopieret ind fra hovedrepoet for at få bygget grønt — uden dem giver `build.mjs`
**76 fejl**, som er miljø og ikke arbejde.
