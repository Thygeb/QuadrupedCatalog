# Rapport: spor/robot3 (Pris i nøgletalsblokken)

## Skill-vurdering (Regel 0)
- **Valgt:** `spor` (arbejdsmetode), `robotdata` (skemaregler), `impeccable layout` (nøgletalsgitter).
- **Fravalgt:** `supabase` (ingen databaseret). `fejljagt` blev *tilvalgt* sent, se nedenfor.

## Grundmåling (Regel 1)
- `node tools/validate.mjs`: 77 fil(er) · 0 fejl · 1 advarsler (R9 ghost-robotics-vision-60).
- `noegletal_taeller`: b = 5 på samtlige 77 robotsider.
- Prisfelter i data: 11 numeriske priser (4 USD, 1 EUR, 6 CNY), 66 uoplyst.

## Ændringer
- `tools/skabelon/robot.mjs`: Indlæser `data/kurser.json`, tilføjer `pris` til `STRIBE_FELTER`, `i-pris` til `IKONER`, `prisVaerdi()` med ECB-kursomregning og kildepris.
- `assets/generator.css`: Tilføjer `.stribe--seks` (rent 2x3 gitter uden span 2) samt styling af `.pris-par` og `.stribe-kildepris`.
- `data/i18n/da.json` + `en.json`: Tilføjer `stribe_pris` ("Pris" / "Price").

## Kontrolmåling & Acceptkriterier

**1. Tælleren — KONFIDENS: HØJ.**
b er steget fra 5 til 6 på samtlige 77 robotsider.
Kommando: script over `dist/en/robotter/*/index.html`, regex `<b>(\d+) of (\d+) stated</b>` → `{"6":77}`.
*Kontrafaktisk:* var pris ikke lagt i `STRIBE_FELTER`, havde nøglen været `{"5":77}`; var den lagt ind uden at tælleren fulgte med, havde fordelingen været blandet.

**2. 11 mod 66 — KONFIDENS: HØJ, men briefets tal skal deles i to.**
Målt på `dist/`: **11** sider viser en oplyst pris, **61** viser "not stated" i priscellen, og **5** har slet ingen `<ul class="stribe">`. 11 + 61 + 5 = 77.
De 5 er `ghost-robotics-spirit-40`, `unitree-laikago`, `weilan-alphadog-e300`, `weilan-alphadog-e400l`, `weilan-babyalpha`. De oplyser **nul** nøgletal og rammer den eksisterende `.stribe--intet`-gren, som skriver *"The manufacturer states none of the 6 key figures"* og *"0 of 6 stated · 6 gaps"*. Prisen er altså stadig markeret som ikke oplyst — kollektivt i stedet for pr. celle. Grenen er ikke min; den fandtes på `c95abce`.
**Briefets 66 er derfor rigtigt i sum, forkert i form.** Jeg rapporterer opdelingen frem for at få 66 til at passe.
*Kontrafaktisk:* faldt prisen tavst ud for de uoplyste, havde tallet været 11 vist / 0 "not stated" / 66 uden celle.

**3. Kildebogstavet — KONFIDENS: HØJ.**
På omregnede priser sidder `<a class="kildemaerke">` **inde i** `<span class="stribe-kildepris">`, efter kildetallet — aldrig efter USD-tallet.
Genisom L2: `≥ 5,952 USD` uden mærke, `≥ 39,999 CNY A` med mærke. Neura: `57,980 USD` uden, `50,000 EUR B` med.
Målt ved at skære `<li>`-elementet med `#i-pris` ud af striben og læse rækkefølgen af HTML-noder.
Regnestykket efterprøvet mod `data/kurser.json` (ECB 2026-08-31, per_euro USD 1.1596 / CNY 7.7922): 39999 CNY → 5952, 50000 EUR → 57980 — begge identiske med det byggede.
*Kontrafaktisk:* hang mærket på omregningen, ville `kildemaerke` stå før `stribe-kildepris` i node-rækkefølgen.

**4. Data urørt — KONFIDENS: HØJ.**
`git diff c95abce..HEAD --stat -- data/robots/` → 0 filer.
*Kontrafaktisk:* enhver rettelse i en YAML havde givet mindst én fil her.

**5. Skærmbilleder — KONFIDENS: MIDDEL.**
Set med egne øjne ved 1440 på port 8133, efter servervagt mod disken (`stribe-kildepris`: curl 6 = disk 6).
Med pris (Genisom L2): USD-tallet i normal talstørrelse, kildeprisen under det i lille grå mono. Ingen valutasymbol i displaystørrelse, ingen fremhævning — cellen læses som ét tal blandt seks (hård begrænsning 1).
Uden pris (Addverb Trakr 20): priscellen bruger den **eksisterende** stiplede "not stated"-boks, samme som de fire øvrige huller. Intet nyt visuelt sprog (hård begrænsning 5).
Middel og ikke høj: kun **én** bredde (1440) og **to** af 77 sider er set. Mobilbredderne er kun målt i CSS-reglerne, ikke i browseren.

## Efter sessionsdøden — oprydning af formatterstøj
- `node tools/validate.mjs`: 77 fil(er) · 0 fejl · 1 advarsler. `node tools/build.mjs`: 216 sider, 1111 tal med kilde, 0 uden.
- `git diff --stat` → 0 filer ændret. `git diff c95abce..HEAD --stat` → 8 filer, **152 indsættelser, 14 sletninger = 166 linjer** (kriteriet var under 250).
- Commits i 3 trin: `4d53a5e` (data/omregning), `cca8f63` (skabelon/i18n), `e86d1ef` (CSS).

## Nye fælder og opdagelser
- **Briefets påstand om at b var 6 fra start var falsk.** Måling førte bevis for b = 5 (CE var tidligere taget ud af striben), så pris bragte b op på 6. Kommentaren i koden om et engang hårdkodet "seks" var en reel advarsel.
- **En formatter har kørt over `robot.mjs` og `generator.css` uden at nogen bad om det**, og efterlod 2.777 + 644 ændrede linjer ucommitteret, hvoraf 24 nævnte `pris`. De 24 så ud som ægte arbejde. **De var det ikke.** Bevis: normaliserede jeg begge filer (fjern al whitespace, ensret anførselstegn, fjern efterstillede kommaer og semikoloner) og sammenlignede med HEAD, var *hver eneste* tilbageværende forskel enten en parentes om en ternær, et manglende nul foran et decimaltal (`-.01em` → `-0.01em`) eller hex-versalisering (`#FFFFFF` → `#ffffff`). Nul semantisk ændring. Hele diffen blev kasseret med `git checkout --`, og intet arbejde gik tabt. **Lære: mål om en diff er semantisk tom, før du bruger en runde på at skille den ad i hånden** — en ordtælling på `pris` kan ikke skelne en omformateret linje fra en ny.
- **`node` og Git Bash er uenige om MSYS-stier, og `flade-skud.mjs` fejler TAVST på det.** Gav jeg udfilen som `/c/Users/thyge/.../scratchpad/x.png`, skrev værktøjet `skudt /c/Users/.../x.png` og exit 0 — men filen landede i `C:\c\Users\...`, fordi Windows læser `/c/...` som drev-rod-relativt. Read-værktøjet sagde derfor "File does not exist" om en fil, værktøjet lige havde meldt skudt. `fejljagt` blev kaldt her: måleapparatet, ikke tallet, var i stykker. **Giv altid `flade-skud.mjs` en `C:/`-sti.** Samme fælde ramte `node norm.cjs` med en MSYS-sti (`Cannot find module 'C:\c\Users\...'`).
- 5 robotter har 0 oplyste nøgletal og renderer `.stribe--intet` — se kriterium 2.

## Punkter i briefet, jeg ikke nåede
Alle fem acceptkriterier er målt, men tre ting er jeg reelt usikker på, rangeret efter hvad der ville koste mest:

1. **Mobilvisningen af prisparret er ikke set i en browser — kun i CSS.** `.pris-par` stabler USD over kildeprisen lodret, og ved 680 px falder striben til to spalter, hvor cellerne er smallest. Et langt par som `≥ 39,999 CNY` i 11,5 px mono kan løbe over eller ombryde grimt. Jeg har målt reglerne, ikke resultatet. **Det er det, jeg helst ville have haft en måling på.**
2. **`.stribe-kildepris` bruger fem `!important` for at slå `.v`-arvens skriftstørrelser.** Det virker, men det er en lap på en specificitetskonflikt, ikke en løsning — og det står i spænding med den målte gæld på 55 skriftstørrelser, som `impeccable typeset` skal rydde op i. Designfrysen betød, at jeg ikke måtte omlægge `.v`-hierarkiet; men den næste, der rører striben, arver mine `!important`.
3. **Jeg har ikke efterprøvet, om prisen også bør gå gennem kortet eller filtrene.** JPK sagde "på robotsiden", og det er det, jeg har bygget. Men `sortering_pris_note` og `filter_pris_note` findes allerede i i18n, hvilket tyder på, at en prisvej gennem kataloget er tænkt et andet sted — muligvis i `spor/kat3`, som jeg ikke må røre. **Om de to omregninger giver samme tal, er ikke målt.** Går de fra hinanden, er det den slags fejl, ingen opdager.
