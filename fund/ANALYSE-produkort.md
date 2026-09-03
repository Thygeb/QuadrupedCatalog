# ANALYSE — producentfladens UI målt mod DESIGN.md

**Spor:** `spor/produkort` · **Dato:** 3. sep 2026 · **Gren:** `spor/produkort`
**Flow:** `impeccable critique` + `impeccable audit`. Skillen blev kaldt med
Skill-værktøjet **fra worktreen, og kaldet LYKKEDES** — ingen diskreserve brugt.

**DETTE DOKUMENT RETTER INGENTING.** Designfrysen (L70, JPK 1. sep 2026) gælder:
*"vi skal have en overordnet designplan, inden vi retter noget design."* Hvert
punkt er et **fund**, ikke en opgave. Den eneste kode, sporet har ændret, er
leverance A's faktafejl, som frysen udtrykkeligt undtager.

**Rammen er DESIGN.md**, læst i fuld længde (834 linjer, målt). JPK's ord:
*"DESIGN.md beskriver hvordan websiden skal være designet, for at sikre
konsistens og standardisering af websidens udseende og funktionalitet."*
**Hvert fund peger på et linjenummer.** Fund uden DESIGN.md-dækning står samlet
i afsnit 3 — de er analysens mest værdifulde del.

---

## 1. MODE: Read — og hvad fladen skal lykkes med

**Producentsiden er `Read`.** Den besøgende skal **forstå** noget om en
producent; hun skal ikke løse en opgave. Katalogsiden er `Operate`. De to blev
behandlet ens i alt arbejde før 1. sep 2026, og det er stadig fladens
grundproblem.

Fladens ene berettigelse, ordret fra `producent.mjs`' eget hoved og gengivet i
`fund/PLAN-producent.md` afsnit 1: *"Siden har ét job, som robotsiden ikke kan
gøre: at vise CE-oplysningen SAMLET for hele producentens modelrække. Ét 'ikke
oplyst' er en tom rubrik; tolv under hinanden er en oplysning om producenten."*

Read-kriteriet er derfor: **kan læseren på fladen forstå, hvad vi ved om denne
producent — og hvad vi ikke ved?**

---

## 2. Fund, rangeret efter hvad de koster læseren

### F1 — DESIGN.md erklærer EU-fundet SLETTET, mens det står på 50 sider

**Målt.** `grep -ni "eu-fund" DESIGN.md` giver **2** forekomster, og **begge**
beskriver komponenten som død:

- **DESIGN.md:204-208:** *"Forsiden med hero, yderpunkter og EU-fundet … **er
  slettet** (L72) … De komponentbeskrivelser hører historien til."*
- **DESIGN.md:620-628,** afsnittet *"Slettede komponenter — historisk"*:
  *"Forsiden (`hero`, `yderpunkterne`, `EU-fundet`, `formålsfilteret`) er
  **slettet**."*

**Virkeligheden:** `.eu-fund-linje` står på **50 byggede sider** (25 producenter
× 2 sprog) med **52 elementer** efter leverance A.

```
grep -l "eu-fund-linje" dist/{da,en}/producenter/*/index.html | wc -l   ->  50
```

Designsystemet har altså **arkiveret beskrivelsen af en komponent, der stadig
sendes til brugeren.** En agent, der slår op i DESIGN.md for at finde ud af,
hvordan EU-fundet skal se ud, får ét svar: *"den er slettet."*

**Det er rodårsagen til F2.** Ingen ejer komponentens spec, så ingen opdagede,
at dens `span`-regel var uafgrænset.

**Dækket af PLAN-producent.md?** Planen kender forældreløsheden (afsnit 11.5,
*"fladen har arvet fire forældreløse abstraktioner"* fra L72), men **ikke** at
DESIGN.md aktivt fører komponenten som slettet. **Dette er NYT.**

**Pris at rette:** et afsnit i DESIGN.md's *Komponenter*. Ingen kode.

---

### F2 — Samme datatilstand tegnes i to størrelser på samme side

**Det skarpeste konsistensbrud på fladen, og det er målt på et isoleret
apparat** (egen Playwright-instans, URL bekræftet i samme kald).

På Xiaomis side står `.v-ikke` **to gange** — og de ser forskellige ud:

| Forekomst | Målt | DESIGN.md's krav |
|---|---|---|
| Header, *Hjemsted* (`.producent-fakta .v-ikke`) | **11px**, `rgb(95,104,111)` | **korrekt** (DESIGN.md:596) |
| EU-afsnittet (`.eu-fund-linje .v-ikke`) | **17px**, `rgb(84,92,99)` | **afviger** |

Samme gælder de to andre tilstande i EU-afsnittet:

| Tilstand | Målt i EU-afsnittet | DESIGN.md's krav |
|---|---|---|
| `.v-nej` | 17px, `rgb(84,92,99)` | **10,5px**, fuld `blaek` `rgb(34,38,42)` — DESIGN.md:591-593 |
| `.v-ikke` | 17px, `rgb(84,92,99)` | **11px**, `blaek3` `rgb(95,104,111)` — DESIGN.md:596-597 |
| `.v-ja` | 17px, `rgb(84,92,99)` | em-baseret `.62em` — DESIGN.md:594 |

**Årsagen, læst ud af det levende stilark:**

```css
.eu-fund-linje span { font-size: 17px; line-height: 1.5; color: var(--blaek2); }
```

`assets/generator.css:30`. Specificiteten er **0,1,1** og slår `.v-nej`s
**0,1,0** (`assets/system.css:646`). Reglen er skrevet dengang linjen kun
indeholdt **én** `<span>` — sætningen. Den er ældre end de tilstandsmærker,
leverance A lægger ind.

**Hvad der IKKE er galt:** kontrasten. Målt med WCAG-formlen, med læseretning:

```
blaek2 #545C63 PAA bund #E8EBED  =  5,68 : 1     (AA-kravet er 4,5)
```

Måleapparatet er valideret mod et kendt svar: samme funktion giver 12,72 for
`blaek` på `bund` og 4,74 for `blaek3` på `bund` — **præcis** de tal, DESIGN.md
selv trykker på linje 267 og 271. **Det er altså et konsistensbrud, ikke et
tilgængelighedsbrud**, og det skal ikke rapporteres som det sidste.

**De ni-pixels firkanter overlever:** `.v-nej .mrk` måler 9×9px fyldt
`rgb(34,38,42)`, `.v-ikke .mrk` 9×9px stiplet — begge som DESIGN.md:454-456
kræver. **Hård begrænsning 5 er altså opfyldt**; det er systemets typografi, der
skrider, ikke tilstandsalfabetet.

**Ærligt om mit eget spor:** reglen er ældre end mig, men **den anden forekomst
af `.v-ikke` er min.** Leverance A indførte tilstandsmærker i en scope, der
overstyrer dem. Alternativet — at droppe mærkerne — ville have efterladt
begrænsning 5 opfyldt af ren prosa, og `fund/PLAN-producent.md` P1 foreskriver
udtrykkeligt *"den visuelle tilstandsgrammatik, siden allerede har"*.

**Kandidatrettelsen er målt, ikke gættet — og IKKE anvendt** (designfrys, og
`generator.css` ejes af `spor/testvend`). Injiceret i browseren gav tre linjer
CSS præcis DESIGN.md's tal tilbage (`.v-nej` 10,5px/`blaek`, `.v-ikke`
11px/`blaek3`):

```css
.eu-fund-linje span.v-nej { font-size:10.5px; color:var(--blaek) }
.eu-fund-linje span.v-ikke{ font-size:11px;   color:var(--blaek3) }
.eu-fund-linje span.v-ja  { font-size:.62em;  color:var(--blaek) }
```

**Dækket af PLAN?** Nej. Planen forudsagde P1's mærker, men ikke at de ville
lande i en overstyrende scope. **NYT.**

---

### F3 — 69 % af en producentside handler om de andre producenter

**Målt ved 1440px**, sektionshøjder som andel af `.producentside`:

| Sektion | Xiaomi (2 modeller) | Unitree (13 modeller) |
|---|---|---|
| Producentens identitet (header) | 150px — **6 %** | 150px — **5 %** |
| EU | 223px — 9 % | 170px — 6 % |
| Producentens modeller | 408px — 16 % | 946px — 32 % |
| **"Alle 25 producenter"** | **1715px — 69 %** | **1715px — 58 %** |
| **I alt om DENNE producent** | **31 %** | **42 %** |

*"Alle 25 producenter"* er **konstant 1715px** uanset producent. Jo tyndere
producenten er, jo mere handler hendes side om alle andre.

**DESIGN.md-hjemmel:** filen har ingen regel om sektionsvægt — se **hul H2**.
Den nærmeste er *Overblik* (DESIGN.md:210-215) om redaktionel stilhed og
*"personligheden ligger i præcisionen"*. For **MODE Read** er 6 % til fladens
emne det, der koster læseren mest på hele siden.

**Dækket af PLAN?** **JA — `fund/PLAN-producent.md` afsnit 5.3,
*"Undersidens største element er ikke om producenten"*.** Planen har allerede
afgjort, at det er et problem. **Mit bidrag er tallene** (6 %/69 % mod
5 %/58 %), som planen ikke havde, og konstateringen af, at blokken er en
konstant, så fejlen vokser omvendt med producentens størrelse.

---

### F4 — Producentfladen har intet kildemærke, men består udelukkende af tal

`fund/PLAN-producent.md` P6 har målt det: `kildemaerke` = **142** på kataloget,
**1.545** på robotsiderne, **0** på begge producentflader — mens *hvert eneste
tal på fladen* er noget, vi har regnet.

**Efter leverance A er det blevet skarpere, ikke mildere.** Fladen trykker nu
*"1 af 2 · nej · Producenten oplyser, at der ikke er CE"*. Påstanden hviler på
en `kilde`, en `hentet`-dato og en `advarsel` i
`data/robots/xiaomi-cyberdog-2.yaml` — **og ingen af de tre kan ses på fladen.**
Robotsiden for CyberDog 2 viser dem; producentsiden gør ikke.

**DESIGN.md:573-581** definerer kildemærket som en komponent, fladen ikke
bruger. **PRODUCT.md's positionering nr. 1:** *"en journalist, der citerer ét
tal, skal kunne belægge det lige så let som en indkøber."*

**Dækket af PLAN?** Ja, P6 — som udtrykkeligt *"ikke foreslår en løsning"*.
**Mit bidrag:** leverance A hæver indsatsen, fordi et **dokumenteret nej** er
den mest bestridelige påstand, fladen kan fremsætte.

---

### F5 — Ti af elleve `forside_*`-i18n-nøgler er døde, og jeg gjorde den tiende død

**Målt** over `tools/`:

| Nøgle | Brug i kode |
|---|---|
| `forside_eu_tal` | **1** (producent.mjs) |
| `forside_eu_paastand` | **0** ← *var 1 før leverance A* |
| øvrige ni `forside_*` | **0** |

Nøglerne er navngivet efter en forside, der blev slettet 1. sep 2026 (L72), og
`tools/skabelon/forside.mjs` findes ikke. Den ene overlevende nøgle hedder
stadig `forside_eu_tal` og bruges kun af producentsiden.

**Der findes ingen test, der fanger døde i18n-nøgler** — jeg søgte efter én:
`tests/dele/63-ordbog-og-skema.mjs` jager ubrugte **databasekolonner**, ikke
i18n. Symmetritesten i `tests/dele/35:221` kræver kun, at `da` og `en` er enige.

**Ærligt:** leverance A øgede antallet af døde nøgler fra 9 til 10. Jeg har
**ikke** slettet `forside_eu_paastand` — sletning i i18n er en indholdsændring i
et område, sporet ikke ejer, og nøglen kan ønskes igen.

**DESIGN.md-hjemmel:** ingen direkte. Nærmeste princip er reglen bag
`tests/dele/57` om død CSS, gengivet i DESIGN.md:560-562: *"en variant uden
brugssted er død CSS"*. **Se hul H3.**

---

## 3. Huller i DESIGN.md — hvor fladen gør noget, systemet ikke har en regel for

Dette afsnit er analysens vigtigste, fordi det er dér, standardiseringen
mangler.

### H1 — Producentfladen har intet komponentafsnit overhovedet

**Målt.** DESIGN.md's *Komponenter* rummer ti afsnit: Dækket, Kort, Filtre,
Søgefeltet, Knapper, Kildemærket, De fire datatilstande, Nøgletalsstriben,
Stansningen, Slettede komponenter. **Ingen af dem er producentfladen.**

Ordet *"producent"* står **5** gange i hele filen, og alle fem er tilfældige:
en figur-størrelse (:355), en brudpunktsnote (:398), kortets rækkefølge (:474),
kildemærkets sekundærform (:580) og en sætning om hullers oprindelse (:214).

Klasser, fladen bygger på, og som **ikke** findes i DESIGN.md:
`.eu-fund-linje`, `.eu-fund-tal`, `.producent-fakta` (nævnt én gang, kun som
figur-størrelse), `.pnavn`, `.pland`, `.pantal`, `.prod-navne`, `.kort-legende`.

**Konsekvens:** to af analysens fem fund (F1, F2) findes, fordi ingen regel
siger, hvordan fladen skal se ud. Det er præcis den *"konsistens og
standardisering"*, JPK spørger til.

### H2 — Ingen regel om sektionsvægt eller om, hvor meget en flade må handle om noget andet

DESIGN.md regulerer farve, skrift, rum, form, dybde og komponenter — men har
**ingen** regel af typen *"en flades eget emne skal fylde mere end dens
navigation"*. F3's 69 % bryder derfor ingen skreven regel. For en `Read`-flade
er det den dyreste mangel i filen.

DESIGN.md nævner heller ikke **MODE** (Read/Operate) med ét ord, selv om
CLAUDE.md kræver, at fladens mode navngives hver gang. **Designsystemet og
arbejdsreglen taler ikke sammen.**

### H3 — Ingen regel om døde i18n-nøgler, kun om død CSS

Systemet har en test mod død CSS (`tests/dele/57`) og en beslutning om, at en
variant uden brugssted ikke må stå (DESIGN.md:560-562). Den samme tankegang er
aldrig skrevet for **sprogfilerne**, og resultatet er 10 døde nøgler (F5).

### H3b — Fladen har ingen sidefod, og DESIGN.md har ingen regel om én

**Målt på dette spors udgangspunkt (`951fd29`):** producentsiden har **0**
`<footer>`, **0** elementer med en `fod`-klasse, og ordet **"KeyResearch"
optræder 0 gange**.

**PRODUCT.md's *Brand Commitments* siger:** *"Bindende: KeyResearch nævnes som
udgiver"*, og *"KeyResearch står som udgiver i footer og på Om-siden."*
DESIGN.md nævner `--fod`/`--paafod` som **farver** (:288-291) og sidefoden som
en flade, men har **intet komponentafsnit om sidefoden**.

**VIGTIGT FORBEHOLD, så dette ikke bliver et dobbeltarbejde:** `spor/sidefod`
kører netop nu og ejer `assets/system.css` og `tools/skabelon/side.mjs`.
Målingen er taget på **min** gren og siger intet om deres. Punktet står her,
fordi **DESIGN.md-hullet** består uanset hvad de bygger — ikke som en opgave.

### H4 — Ingen regel for, hvad der sker, når en komponent gentages

`.eu-fund-linje` var designet som **ét** element. Leverance A gør den til en
**liste**. DESIGN.md har regler for gitre (:381-384) og for rummets ottetalsskala
(:378-379), men ingen for et gentaget blokelement.

**Målt følge ved 390px** på Xiaomi:

| Afstand | Målt |
|---|---|
| **Inde i** én tilstandsblok (tal-bund → ombrudt sætning) | **10px** |
| **Mellem** to tilstandsblokke | **0px** |

Nærhed grupperer altså **modsat** af meningen: det, der hører sammen, står
længere fra hinanden end det, der ikke gør. Ved 1440px ombrydes intet, hver blok
er 53px høj, og problemet findes ikke.

**0px er ikke et trin på ottetalsskalaen** (DESIGN.md:378-379, `--r1`…`--r9` =
4/8/12/16/24/32/48/64/96), og DESIGN.md:643 siger *"**Gør** rummet fra
ottetalsskalaen."* Fladen bruger her et rum, skalaen ikke indeholder.

**Dette er en direkte følge af leverance A og skal med i designplanen.** Jeg har
ikke rettet det: `.eu-fund-linje` bor i `generator.css`, som ejes af
`spor/testvend`, og en margin er en systembeslutning om rytme, ikke en
funktionsfejl.

---

## 4. Dokumentdrift, som ikke er design, men som vildleder næste agent

Tre steder, hvor projektets egne dokumenter modsiger den byggede virkelighed.
Ingen af dem er mine at rette.

1. **`PRODUCT.md:113`** skriver stadig, at fabrikantbilleder kun må bruges,
   *"så længe siden er lokal"*, og henviser til *"spærring S1"*. **CLAUDE.md:160-165**
   siger, at S1 blev **ophævet af JPK 26. aug 2026 (L37)**, og at *"ingen agent
   skal fremover føre S1 som en åben spærring"*. PRODUCT.md indlæses af
   `impeccable`s egen `context.mjs` og vil derfor blive læst som gældende.
2. **`STATUS.md:375`** fører *"Fabrikanternes pressefotos"* på listen **"Kom
   ikke igen med disse"**. Bygget kopierer i dag **611** fabrikantbilleder, og
   **25** producentsider trykker sætningen *"Fotos på kortene er producenternes
   egne."* Om *pressefotos* er en snævrere kategori end *billeder*, kan en læser
   ikke afgøre af listen.
3. **`forside.mjs` nævnes 7 gange i `tools/`**, og filen findes ikke (slettet af
   L72). To af dem lå i `producent.mjs` og er rettet af dette spor; de øvrige
   fem står i `build.mjs` og `katalog.mjs`, som sporet ikke ejer.

---

## 5. Det, der VIRKER, og som skal bevares

En analyse, der kun rummer fejl, kan ikke bruges til at beslutte noget.

1. **Fladen er webstedets reneste overholdelse af hård begrænsning 1.** Målt af
   `fund/PLAN-producent.md` 6.1 og bekræftet her: **0** `.knap`, **0**
   `<button>`, **0** `<form>` på begge producentflader. Siden handler om ét
   firma og har alligevel ingen købsknap, intet logo, ingen kontaktlinje. Det er
   ikke et tilfælde, der må opdages igen — det skal stå skrevet.
2. **CE formuleres som "oplyst / ikke oplyst", aldrig som "har / har ikke".**
   L25's regel, gengivet i PLAN 6.2. Leverance A's tredje tilstand hedder
   *"Producenten oplyser, at der ikke er CE"* — ikke *"har ikke CE"*. Ordlyden
   var færdigoversat i forvejen og er ikke opfundet af dette spor.
3. **Hullet er formgivet som tallet.** DESIGN.md:634 (*"**Gør** hullet lige så
   formgivet som tallet"*) holdes: hjemstedets *"ikke oplyst"* tegnes som en
   tilstand med stiplet kant og egen flade, ikke som en tom celle. `hjemstedAf()`
   gætter aldrig en by.
4. **Tilstandsalfabetet overlever selv en forkert typografisk scope.** De 9×9px
   firkanter måler korrekt (fyldt for nej, stiplet for ikke oplyst) selv dér,
   hvor skriftgraden skrider — så begrænsning 5 holder, også hvor DESIGN.md's
   typografi ikke gør.
5. **Ingen accent som forgrund.** L76 holdes på fladen; EU-ikonet står i
   `--blaek` (12,72 : 1) med en kommentar i `generator.css:25-26`, der forklarer
   hvorfor det ikke længere er gult.
6. **Tastaturets STRUKTUR er rigtig — men se F6: ringens farve er det ikke.**
   Målt ved at trykke Tab otte gange på en isoleret instans: **skip-linket
   *"Spring til indholdet"* kommer først**, hvert element får en fokusring, og
   navigationens fire punkter tegner den **indad** (`outline-offset: -3px`),
   præcis som DESIGN.md:391-393 foreskriver, *"fordi `overflow-x:auto` ellers
   klipper den"*. Tab-ordenen er logisk: skip → ordmærke → nav → retur → indhold.

   > **RETTELSE AF MIT EGET FUND.** Her stod i første udgave, at fokus var
   > *"fladens stærkeste håndværk"*, og at accent her var *"markør, ikke
   > forgrund — L76 efterlevet i praksis"*. **Assessment B modbeviste det.**
   > Jeg målte, at ringen ER der, og glemte at måle den MOD den flade, den
   > tegnes på. Det er nøjagtig den fælde, DESIGN.md selv underviser i —
   > *"et kontrasttal uden en læseretning er ikke et tal"* — begået i den
   > sætning, der roste efterlevelsen af L76. **Strukturen er stadig en styrke;
   > farven er fund F6.**
7. **Semantikken er i orden, og det er målt frem for antaget.** På begge flader:
   **1** `h1`, overskriftsrækken `1,2,2,3,3,2` med **nul spring**, `main`=1,
   `nav`=1, `lang="da"`, **3** `hreflang`-led. Producentindekset er en **rigtig
   `<table>` med 4 `<th>` og 4 `scope`** — modsat sammenligningsfladen, hvor Å54
   målte `<table>` 0 · `<th>` 0 · `scope` 0. Det ene billede har `alt`.
   *(Manglende `<caption>` på indekset er den eneste rest — mindre observation.)*
8. **Ingen vandret overløb ved nogen målt bredde.** 390, 768 og 1440 px:
   `scrollWidth > clientWidth` er **falsk** alle tre steder.

**Berøringsmål, præcist frem for alarmerende:** 33 links på fladen. **1** er
under WCAG 2.5.8's AA-grænse på 24px — ordmærket i topbaren, 22px højt (og
site-bredt, ikke producentfladens). De 25 links, der er under **44** px, ligger
over AA-kravet; 44px er 2.5.5 **AAA**, og DESIGN.md sætter kun 44px for
**filtre** (:498) og **søgefeltet** (:508), som er betjeningsflader — ikke for
tekstlinks i en liste. **Et råt "27 af 33 links er for små" ville være et
overdrevet tal, og det er derfor ikke rapporteret som fund.**

---

## 6. Måleapparater — og de to, der var i stykker

**Rapporteret, fordi et tal fra et forstyrret apparat ikke er et tal.**

- **`impeccable`s `detect.mjs` kører degraderet og må ikke bruges her.**
  Valideret mod et kendt svar: en kontrolside med ~10 bevidste fejl (7px skrift,
  `#eee` på `#fff`, `div` med `onclick`, `img` uden `alt`, h1→h4-spring, tom
  `<button>`, `input` uden label, "Læs mere"-link, fast 1400px bredde,
  marketing-floskel) gav **1 fund af ~10** — kun floskel-reglen, som er ren
  regex. På den ægte side giver den `[]` og **exit 0**, med denne linje på
  stderr: *"DEGRADED - HTML parser modules unavailable … findings are an
  undercount, not a clean bill of health."* **Ingen af dens tal er brugt i denne
  analyse.**
- **Den delte Playwright-browser gav et forkert svar midt i målingen.**
  `browser_navigate` meldte ANYbotics, mens `location.href` stadig var Xiaomi og
  senere producentindekset — fordi analysens to underagenter kørte i **samme**
  browserinstans og navigerede samtidig. Fejlen så ud som et ægte nul
  (*"intet `v-ja` fundet"*). Alle tal i F2 er derfor **gentaget på en isoleret
  Playwright-instans med `location.href` læst i samme kald**, og de to
  apparater er enige.

---

---

# 7. SYNTESE — `impeccable critique`, to uafhængige vurderinger

**Method: dual-agent** (A: design review · B: detektor + browser-evidens), begge
kørt som isolerede underagenter på `model: opus`, jf. projektets regel om at
analyser aldrig er Sonnets. **Ingen degradering af selve orkestreringen.**

**To ærlige forbehold om flowet:**

- **Assessment A kaldte ikke selv `impeccable critique`** — hverken som skill
  eller fra disk — men fulgte briefets ni-punkts-form. A skrev det selv. Det er
  en delvis degradering af *metoden*, ikke af strukturen, og det skal ikke
  forveksles med, at skillen kørte i A's kontekst.
- **`detect.mjs` er kørt af begge og af mig, og er ubrugelig her.** B kørte den
  på alle fem flader: degraderet, exit 0, tom liste hver gang. **Nul
  konklusioner i denne analyse hviler på den.**

## 7.1 Hvor de tre målinger er enige (trianguleret)

Tre uafhængige apparater — mit, A's og B's — nåede samme tal:

| Fund | Mig | A | B |
|---|---|---|---|
| `.v-nej`/`.v-ikke` renders **17px** i EU-linjen, ikke 10,5/11 | F2 | P-B | #3 |
| Årsag: `.eu-fund-linje span` (0,1,1) slår `.v-nej` (0,1,0) | ✓ | ✓ | ✓ |
| DESIGN.md fører EU-fundet som **slettet**, mens det sendes | F1 | H6 | — |
| Rosteren dominerer siden | 69 % / 58 % | 64,1 % / 65,9 % | — |
| **0** kildemærker på fladen | F4 | persona-flag | — |
| 9×9-mærkerne er korrekte | ✓ | S2 | ✓ |
| `detect.mjs` ubrugelig | ✓ | ✓ | ✓ |
| Den delte browser er et ødelagt apparat | ✓ | ✓ | ✓ |

**A tilføjede den kontrolgruppe, jeg manglede:** samme robot på **robotsiden**
tegner `.v-nej` i 10,5px `rgb(34,38,42)` og `.v-ikke` i 11px `rgb(95,104,111)` —
altså korrekt. Fejlen er fladespecifik, ikke systemisk. Og A fandt fejlmåden
skarpere end jeg: *"de to tilstande mødtes på præcis samme værdi fra hver sin
side"* — nej skulle stå 12,72:1 og står 5,68:1; ikke oplyst skulle stå 4,74:1 og
står 5,68:1. **Hård begrænsning 5's fejlmåde, på den ene flade der findes for at
vise CE-tilstand.**

## 7.2 F6 — Fokusringen er 1,38:1 og fejler WCAG 1.4.11 på hvert fokuserbart element

**B's vigtigste fund, og det retter mit eget.** `system.css:343`
`:focus-visible{outline:3px solid var(--accent)}` er global.

| Ring PÅ flade | Målt | Krav (1.4.11) |
|---|---|---|
| `--accent` PÅ `--bund` (sidens flade) | **1,38 : 1** | 3:1 |
| `--accent` PÅ `--panel` (kort) | **1,60 : 1** | 3:1 |
| `--accent` PÅ `--fod` (mørk flade) | 9,19 : 1 | ✓ |

**DESIGN.md:252** nævner *"fokusring"* i listen over accentens **lovlige** brug
og måler den aldrig mod fladen. Det er **DESIGN.md's egen læseretningsfælde, én
rolle længere ude**: L76 flyttede accent væk fra tekst, men lod den blive som
ring — og en ring er også forgrund. Systemet ved bedre andre steder:
`.skala__greb`, `.knap--maerkat` og `.rk__felt` bruger `var(--blaek)` (12,72:1).

**Hører i designplanen, ikke i et hastespor:** paletten er låst af TYPESKILT, og
rettelsen er en systemregel om, hvor `--accent` må bruges som forgrund — præcis
det mønster, L70's frys blev skrevet for at fange.

## 7.3 Fund, ingen af os havde alene

**A's P-A / B's #2 — producentindekset skjuler to af tre datakolonner ved 390px.**
`.prod-tabel-wrap`: `clientWidth` **343**, `scrollWidth` **620** → **277px
skjult**. "LAND" er klippet midt i ordet, "ANTAL" er helt væk. Ingen
rulleaffordance: **0** regler for fade/skygge/`::after` i begge stilark. Årsag:
`generator.css:1156-1157` låser kolonnerne til `20ch` og `12ch`.
**`fund/PLAN-producent.md` §12 siger udtrykkeligt *"der er ingen akut mobilfejl
at melde"* — det er nu målt falsk.** Gælder også `/en/`.

**A's P-E — og den vender planens anbefaling om.** Planen (§5.3) vil skære
roster-afsnittet væk, fordi det er *"en dårligere udgave af indekset"*. **På
mobil er det en BEDRE udgave:** undersidens liste viser navn + land + antal ved
390px uden beskæring, mens indekset skjuler land og antal. **Sletter man
afsnittet i dag, mister en mobillæser det eneste sted, de tre oplysninger står
sammen.** Dette bør nå JPK, før §5.3 besluttes.

**B's #4 — skriftgulvet på 10,5px brydes to steder** (DESIGN.md:369, :656):
`span.kort__mrk` **9,50px** (*"Udgået"/"Annonceret"*) og `span.daek__stempel`
**10,00px**. Faste px, uændret ved alle tre bredder — ikke en ombrydningseffekt.
Stemplet er sidedækkende, ikke producentspecifikt.

**A — `.v-ikke`s dæmpede flade gør ingenting på denne flade.** Chippens
baggrund er `--tom` `rgb(232,235,237)`; den omgivende flade er `--bund`, samme
hex. **1,00:1.** Hele tilstanden bæres af en 0,8px stiplet `--hegn`-kant på
**2,14:1**, under 1.4.11's 3:1. På robotsiden sidder chippen på `--panel`, og
fyldet virker. **Det er den første målte visuelle konsekvens af DESIGN.md's
Konflikt 3** (fem tokennavne på samme hex), som hidtil var journaliseret som et
navneproblem.

**A's P-C og P-D — to følger af leverance A, som jeg ikke selv så:**
`.eu-fund-tal` er `clamp(26px,2.6vw,34px)` og rammer **nøjagtig H2's 34px ved
1440** og **overgår H2 ved 390** (26 mod 23). Og Xiaomis to linjer indledes
begge med **"1 af 2"** i 34px/700 — øjet lander på en gentagelse, mens det
diskriminerende ligger til højre i halv størrelse. Komponentens egen kommentar
(`generator.css:22-23`) siger stadig *"Én sætning, ét stort tal — læsbar på to
sekunder, ikke en infografik"*; **leverance A gjorde det til to af hver uden at
revidere hensigten.** Over alle 25 sider er **24 af 26 tal "N af N"** — et tal,
der ikke kan være andet.

**B's øvrige målte fund:** det LCP-nære billede (`top=594`, inde i viewporten)
er `loading="lazy"`, og **13 af 13 billeder mangler `width`/`height`** (CLS).
**269.134 B blokerende CSS** mod 23.489 B HTML, **0** `rel=preload` til de fire
Saira-woff2. `.net` giver RIVR (1 model) **5 spalter** og **1.070px tom** ved
1440 — `auto-fill`, hvor `auto-fit` ikke ville. Kort-hover er **1,04:1**.
**`<footer>` findes 0 gange i alle 216 byggede sider** (bekræfter mit H3b og
udvider det fra producentfladen til hele sitet). Indekset har **ingen
`<caption>`** og **ingen `<th scope="row">`**, så en skærmlæser ikke kan koble
"Kina" til "Unitree Robotics".

**B's #11 — alt-teksterne, et fund ingen af os ledte efter.** 0 manglende, 0
tomme. Men **15 af 17 er ekkoer** af modelnavnet i `<h3>` lige under, og de to
beskrivende er skrevet med **translittereret dansk**: `alt="… studiofoto paa
graa baggrund"`. På tværs af `dist/` indeholder **83 af 474** alt-tekster
`paa`/`graa`/`staar`. **En dansk skærmlæser udtaler dem forkert** — projektets
ASCII-translitteration er sluppet ud af kildekoden og ind i det, brugeren hører.

## 7.4 Hvor vurderingerne var UENIGE med sig selv — og rettede

Begge agenter trak et fund tilbage efter genmåling. Det er værd at trykke,
fordi begge tilbagetrækninger reddede en falsk konklusion:

- **A troede først, at `.v-ja` og `.v-nej` tegnes som samme fyldte firkant** —
  hård begrænsning 5 brudt. Genmålt med `box-shadow` inkluderet: `.v-ja .mrk`
  bærer stadig `inset 0 0 0 2px` + `inset 0 0 0 3px` — den åbne firkant med
  fyldt kerne. **`system.css:685-689` forudsagde netop dette** (*"det er
  STRUKTURELT, ikke typografisk, så det overlever enhver skriftstørrelse"*), og
  forudsigelsen holdt under en font-size-override, den aldrig var prøvet mod.
  **Fundet trukket tilbage.** Lære: *en firkants udseende bor i mindst fem
  egenskaber, og at spørge om fire er ikke en måling.*
- **B ville have meldt 39 falske berøringsmålsfejl.** `getBoundingClientRect()`
  på et `<a>` med dækkende `::after` **undertæller med en faktor 30**:
  modelkortets link måler 13,9×24,8 px på papiret og **266,6×267,6 px** i
  virkeligheden (hit-testet med `elementFromPoint` i tre punkter). Det mønster
  er DESIGN.md:487's egen konstruktion. **Det er også grunden til, at jeg ikke
  rapporterede mit eget råtal "25 links under 44px" som fund.**

## 7.5 Design Health Score (A's heuristikker, Read-kriteriet)

| # | Heuristik | Score |
|---|---|---|
| 1 | Synlig systemtilstand | 2 |
| 2 | Match med virkeligheden | 3 |
| 3 | Brugerkontrol og frihed | 3 |
| 4 | **Konsistens og standarder** | **1** ← fladens værste |
| 5 | Fejlforebyggelse | n/a (0 `<button>`, 0 `<form>`) |
| 6 | Genkendelse frem for genkaldelse | 2 |
| 7 | Fleksibilitet | n/a (Read) |
| 8 | Æstetik og minimalisme | 2 |
| 9 | Fejlgenkendelse | n/a |
| 10 | Hjælp og dokumentation | 2 |

**B's fem audit-dimensioner:** Tilgængelighed **2**/4 · Ydelse **3**/4 ·
Theming/tokens **4**/4 (65 `border-radius`, **0** uden for
`var(--hjoerne)`/0/99px/50% — tokendisciplinen er fladens bedste tal) ·
Responsivt **3**/4 · Implementeringsintegritet **2**/4.

**Design-specificity-dom (A):** *"Delt — og delingen er målbar."* To ting kunne
kun stå her: EU-linjens tre-tilstands-opgørelse og `producentSaetning()`.
**Et konkurrerende katalog kunne overtage 91,7 % af fladen uændret.** Sidens
eneste egentlige grund til at eksistere fylder **8,3 %** af den.

## 7.6 Yderligere huller i DESIGN.md, fundet af vurderingerne

Ud over mine H1-H4:

- **H5 — ingen regel for fokusringens kontrast mod sin flade.** DESIGN.md:252
  licenserer accent som ring uden at måle den (F6). Filen har allerede et
  konfliktafsnit om `hegn`s 1.4.11-brud; ringen mangler.
- **H6 — ingen regel for hvilken FLADE en datatilstand må stå på.**
  DESIGN.md:583-597 fastsætter farve og grad, aldrig baggrunden. Da `--tom` og
  `--bund` er samme hex, mister `.v-ikke` sit fyld på enhver `--bund`-flade.
- **H7 — ingen regel, der beskytter en datatilstand mod en containers
  efterkommer-selektor.** *Lad være*-listen (:647-672) siger intet om scoping.
  Regelformen, der mangler: *en komponent må aldrig omstyle `.v*` via
  efterkommer; tilstandsklasserne vinder.*
- **H8 — ingen regel for hvad der må matche eller overgå en H2** (:355-358
  afviser udtrykkeligt at fastsætte en figurstørrelse).
- **H9 — ingen regel for en container, der ruller.** Layout (:372-400) lister
  11 brudpunkter, men siger intet om `overflow-x:auto`, om en affordance er
  påkrævet, eller hvilke kolonner der skal overleve den smalleste ombrydning.
  **Systemet lovgiver om den smalleste ombrydning for STØRRELSE, ikke for
  INDHOLD.**
- **H10 — ingen regel for billedleddets indhold.** L78 låser sideforhold og
  `object-fit`, men intet siger, hvad et produktfoto må *forestille*. Målt af A:
  på Unitrees 13 kort er **4** fabrikantens egne annoterede spec-ark (ulæselige
  i kortstørrelse), 1 bærer produktordmærket *"Laikago Pro"*, og RIVR's eneste
  kort viser en **butiksfacade**, hvor robotten knap er til stede. **På en
  producentflade er et net af fabrikantens marketingmateriale det tætteste,
  sitet kommer på hård begrænsning 1's forbudte læsning.**
- **H11 — ingen regel for, hvornår en datamængde er en `<table>` og hvornår en
  liste.** Samme 25 producenter er en `<table>` på indekset og en
  `<ul class="prodliste">` på alle 25 undersider.
- **H12 — ingen ydelsesregler** (`width`/`height`, `loading`, `preload`).
- **H13 — `/en/`-URL'erne bruger danske segmenter** (`/en/producenter/`,
  `/en/robotter/`, `/en/om/`). Uden for DESIGN.md, og en arkitekturbeslutning
  værd at tage bevidst, mens sitet er tosproget.

## 7.7 Det spørgsmål, analysen bør efterlade hos JPK

A's fjerde provokerende spørgsmål er det, der rækker længst ud over denne flade:

> Hård begrænsning 5 håndhæves **mekanisk** for manglende enhed og kilde —
> bygget fejler. **Intet håndhæver, at de tre tilstande forbliver visuelt
> forskellige.** Skal `tests/dele/` asserte computed skriftgrad og farve for
> `.v-nej`/`.v-ikke`/`.v-ja` på hver flade, der tegner dem — sådan som
> `70-knap.mjs` allerede gør for knapvarianternes kontrast (DESIGN.md:565-569)?

Dette spors leverance A rettede **datafejlen** (tilstandene kollapsede i tallet).
F2 viser, at de kollapsede igen i **typografien**, tre linjer længere nede i
samme komponent, uden at noget fangede det. En test af den type ville have
fanget begge.
