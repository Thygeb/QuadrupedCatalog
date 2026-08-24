# FUND — billedmaskineriet (kode/billeder)

Målt 21. august 2026 i worktreen `udstilling-wt-billeder`, gren `kode/billeder`.
Bygger maskineriet, der lader siden vise billeder, når der er nogen. Flytter
**ikke** noget fra `media/` til `assets/` — se modstriden nederst, som er lagt op
til JPK.

---

## Regel 0 — skill-vurdering

Kørt `ls .claude/skills/` (projekt: `robotdata`, `parallelt`) og set den fulde
skill-oversigt i systemets skill-liste.

| Skill | Valg | Begrundelse |
|---|---|---|
| **`robotdata`** | **Valgt, læst fra disk** | Opgaven tilføjer et felt til robotskemaet og en valideringsregel. Skillen bærer de ti hårde regler (særligt regel 2: kilde + hentedato for hvert tal — genbrugt direkte for billedets `kilde`/`hentet`) og kravet om selv-tjek med tælling |
| `parallelt` | Gik forbi | Opgaven er ét sammenhængende spor: skema → validator → build → skabelon hænger i en kæde, hvor hvert led forudsætter det forrige. At dele den op ville betyde, at to agenter skrev i de samme fem-seks filer samtidig |
| `impeccable` | Gik forbi | Ingen ny flade eller IA-beslutning. `<picture>`-mønsteret og klasserne (`.billedled`, `.intetfoto`, `.billedmaerke`) er allerede besluttet i DESIGN.md og skulle **bruges**, ikke opfindes |
| `ui-ux-critique`, `critique` | Gik forbi | Ingen bygget side at kritisere visuelt — opgaven er maskineri, ikke udseende |
| `dataviz` | Gik forbi | Ingen grafik |
| `code-review`, `simplify` | Gik forbi | Passer bedre på et efterfølgende review end på selve byggeriet |

---

## Svaret kort

**Maskineriet er bygget og efterprøvet, men ingen rigtig robot har fået et billede.**
Det var ikke opgaven — opgaven var at kæden virker, den dag et billede kommer.

1. **Skemaet.** `billede:` er en ny topnøgle i `tools/skema.mjs` (som `anvendelse`,
   ikke som et felt i `felter:` — den må derfor ikke flytte specifikationstæthedens
   nævner). Bærer `fil`, `ophav` (`eget_foto` \| `silhuet` \| `fabrikant`), `kilde`,
   `hentet`, og valgfrit `alt`, `note`, `delt_med`, `plade`, `pos`.
2. **Validatoren.** Ny regel **R18** i `tools/validate.mjs`, 24 selvstændige
   fejlsteder. Fejler på: manglende ophav, ukendt ophav, manglende/tom fil,
   `\`` i stien, absolut sti, sti der går op ad træet (`..`), sti der begynder med
   `assets/` (allerede relativ), sti der peger i `media/`, ukendt undermappe, ukendt
   filendelse, fil der ikke findes i `assets/`, manglende kilde for `silhuet`/
   `fabrikant`, manglende hentedato, ukendte nøgler, `billede:` som ren tekst
   (der findes ingen tilstand `billede: ikke_oplyst` — udelad nøglen i stedet),
   tom `alt`/`note`, forkert type på `plade`, og `delt_med` der peger på robotten
   selv eller på en robot, der ikke findes i datasættet.
3. **Kopitrinnet.** `tools/build.mjs` kopierer rekursivt fra `assets/fotos/`,
   `assets/silhuetter/`, `assets/ikoner/` til `dist/billeder/`, tæller filerne,
   og **påstår** (kaster BYGFEJL), hvis en robotpost peger på en fil, kopitrinnet
   ikke fandt. Slutrapporten viser nu også ophavsfordelingen (`silhuet: 2` osv.)
   og antal `<picture>`-led mod tomme plader.
4. **Skabelonen.** Billedmaskineriet flyttet ind i `tools/skabelon/side.mjs` som
   delt kode (`laesBillede`, `billedledHTML`, `billedLinjer`, `billedAlternativer`,
   `billedFiler`) og genbrugt af både kortet (via `hjaelp.billede`/`hjaelp.kort`)
   og robotsiden (`tools/skabelon/robot.mjs`, `billedled`/`billedfod`). Ét sted,
   ikke to skrevne i hånden — det var netop den slags divergens, der kostede 358
   felter tidligere i projektet (se `tools/skema.mjs`'s egen kommentar om
   normalisering). Bruger `<picture>` med `<source>` **kun** for de moderne
   formater (`.avif`/`.webp`), der rent faktisk findes som fil — en `srcset` til
   noget, ingen har lavet, er en tom påstand.
5. **Den tomme plade.** Uændret klasse (`.intetfoto`), men grunden er nu ærlig:
   "Ingen fil er valgt til denne model" i stedet for den gamle, forkerte "vi har
   ikke selv fotograferet den" (som ikke passede til en silhuet). Efterprøvet:
   alle 46 robotter viser stadig den tomme plade, fordi ingen af dem har et
   `billede:`-felt endnu.
6. **S1 mekanisk.** Nyt flag `--til-udgivelse` på `node tools/build.mjs`. Uden
   flaget bygger den lokalt som i dag (L13). Med flaget kaster bygget en
   BYGFEJL, hvis nogen robot har `ophav: fabrikant` — spærringen kan ikke glemmes,
   fordi den er en påstand i kode, ikke en huskeregel i et dokument.

---

## Selv-test med tælling

### `node tools/validate.mjs` — de 46 rigtige robotposter

```
46 fil(er) · 0 fejl · 1 advarsler
```

Advarslen er R9 (Ghost Robotics Vision 60, upåvirket af mit arbejde — den stod
der før). **0 af de 46 filer har i dag et `billede:`-felt**, så R18 er ikke
prøvet mod rigtigt indhold af den simple grund, at der ikke er noget endnu.

### `node tools/build.mjs`

```
Byggede 123 sider. Vaegtklasser: 12/12/13/9 over 46 datafiler. Kort paa forsiden: 46
Kort i kataloget: 46 · sekundaere kilder: 3 felter · billeder kopieret fra assets/: 1
Billedfelter: 0 fil(er) brugt af 0 robot(ter) · ingen robotpost peger paa en fil
Billedled i dist/: 0 <picture> · 368 tomme plader
Taethedsnaevnere brugt: 33
```

**123 sider og 46 kort — uændret**, som krævet. Nævneren siger **33** — det er
`data/naevner`-sporets L30, allerede landet på `main` og indfusioneret her; mit
billedfelt rører den ikke (se afsnittet om fletningen nedenfor).

Det ene kopierede billede er `_proeve-kaede.svg`, min prøvefigur i
`assets/silhuetter/` — den bliver kopieret, fordi kopitrinnet tager **alt**, der
ligger i `assets/`, men **ingen** side peger på den, så den optræder ikke i
`<picture>`-tallet. Det er den korrekte adfærd: kopitrinnet kender ikke
robotposterne, kun mappen.

### Mutationskontrol — `node tools/muteringstjek.mjs`

Fire nye sager, indsat mod **rigtige** filer (ikke syntetiske), fordi
`tests/koer.mjs` beviser reglen, men kun mod opdigtet data:

```
FANGET   B2: billede tilfoejet uden ophav  ->  R18
FANGET   B2: billede peger paa en fil, ingen har lagt i assets/  ->  R18
FANGET   Spot: billede hentet direkte fra media/  ->  R18
FANGET   ANYmal: silhuet uden kilde paa de maal, den er tegnet efter  ->  R18

18 bevidst oedelagte kopier af RIGTIGE datafiler · 17 skulle fanges, fangede 17 · 1 kendt hul (D10)
```

**17 af 17 forventede fanget, 0 nye fejl.** Det ene "kendte hul" (D10, arv af
`anvendelse`) er forudgående og urelateret til billeder.

### `node tests/koer.mjs` — den syntetiske testpakke

**47 nye assertions specifikt om billeder/R18, alle bestået:**

- **19** statiske R18-sager (14 der SKAL fejle, hver på sin egen regel — manglende
  ophav, ukendt ophav, manglende fil, fil der ikke findes, sti ind i `media/`,
  sti der går op ad træet, sti med `assets/` foran, silhuet uden kilde,
  fabrikantbillede uden kilde, kilde uden hentedato (falder tilbage på R7),
  ukendt nøgle, `billede: ikke_oplyst` som ren tekst, `delt_med` der peger på
  sig selv, tom `alt`; plus 5 der SKAL passere — komplet silhuet, eget foto uden
  kilde, fabrikantbillede med kilde, håndskrevet `plade`/`pos`, robot uden billede).
- **27** assertions i et nyt afsnit **"3c. Billedkaeden"**, der bygger tre
  opdigtede robotter (`tests/billedkaede/`) hele vejen fra YAML til `dist/`: filen
  kopieres, `<picture>` står på både kort og robotside, stien er korrekt fra hver
  sidedybde, den tomme plade virker stadig for naboen uden billede, det delte
  billede får `.billedmaerke`, `alt`-teksten arves korrekt for en silhuet uden
  egen tekst, ingen henvisning til `media/`, og `--til-udgivelse` afviser et
  fabrikantbillede mekanisk men slipper et sæt uden.
- **1** krydsfil-assertion (**"3d"**): `delt_med` der peger på en robot, der
  ikke findes.

**Samlet testkørsel:** 146 "ok"-linjer, **2 FEJL** — begge **forudgående og
urelaterede** til billeder (se nedenfor), ét crash i sektion 4 der stopper
kørslen før eventuelle senere sektioner (samme crash, forudgående).

**De to forudgående fejl, ikke mine:**

```
FEJL  11 HTML-sider bygget (fandt 17)
FEJL  alle fire tilstande har hver sin markoer i katalogets forklaring
Error: ENOENT ... tests/.tmp-koersel/dist/stil.css
```

Efterprøvet med `git show 86000eb:tests/koer.mjs` (min branch's udgangspunkt,
**før** jeg rørte noget): begge assertions stod der allerede. `producent.mjs`
blev tilføjet i commit `ace64b6` uden at opdatere sidetallet fra 11 til 17, og
CSS-filen hedder `system.css`/`generator.css` i det faktiske byg, men testen
leder efter et `stil.css`, der ikke længere skrives. Ingen af de to hænger
sammen med billedfeltet, R18, kopitrinnet eller skabelonerne. Jeg har **ikke**
rettet dem — de ligger uden for opgaven, og en rettelse ville røre en fil
(sektion 4 i `tests/koer.mjs`), jeg ikke fik mandat til at ændre ud over min
egen fletning af sektion 3b/3c.

---

## Fletningen med `main`

Min session blev afbrudt to gange og genstartet. Ved tredje forsøg var `main`
rykket til `15e42b6` (to landede spor: 71 UI-nøgler flyttet ind i
`data/i18n/*.json` med reservemekanismen nedlagt, og nævneren udledt som
`FELTNAVNE.length` = 33). Jeg havde i mellemtiden rørt filer, begge spor også
rørte. Oprydning:

- **Kasseret** mine ændringer i `data/i18n/da.json`, `data/i18n/en.json`,
  `tools/skabelon/reserve-da.json`, `tools/skabelon/reserve-en.json` (sidstnævnte
  to findes ikke længere) og i `assets/system.css`/`assets/generator.css`
  (designsporet arbejder der).
- **`git stash` → `git merge main` → `git stash pop`.** Ét reelt konfliktsted:
  `tests/koer.mjs`, hvor `main`s nye afsnit "3b. Nævneren (D7/L30)" og mit
  afsnit "3b. Billedkæden" begge indsatte sig samme sted. Løst ved at beholde
  begge fulde afsnit og omnummerere mit til **3c** og mit efterfølgende
  krydsfil-afsnit til **3d**. Ingen kode droppet fra nogen af siderne.
- **Genindsat de tre manglende i18n-nøgler** (`billede_ophav_eget_foto`,
  `billede_ophav_silhuet`, `billede_alt_silhuet`) direkte i `data/i18n/da.json`
  og `en.json`, fordi reservemekanismen, min kode oprindeligt faldt tilbage på,
  er nedlagt. Ingen eksisterende nøgle rørt.
- **Efterprøvet at nævneren stadig er 33** efter min tilføjelse af `billede`
  som topnøgle: `billede` står i `IDENTITET_VALGFRI`, ikke i `FELTER`, så
  `FELTNAVNE.length` er upåvirket. Målt direkte:
  ```
  FELTNAVNE.length = 33
  NAEVNER = 33
  has billede in FELTNAVNE: false
  ```

**Ud over den strengt afgrænsede filliste rørte jeg også `tools/skabelon/side.mjs`.**
Det var ikke på den oprindelige liste ("skema.mjs, build.mjs, robot.mjs,
validate.mjs, assets/silhuetter/"), men en senere korrigerende besked bad
eksplicit om "`<picture>` i kortet" — og kortets billedled bygges i `side.mjs`,
ikke i `robot.mjs`. At skrive billedmaskineriet to gange (ét i `side.mjs` til
kortet, ét i `robot.mjs` til robotsiden) er præcis den slags divergens,
`tools/skema.mjs`s egen kommentar advarer om ("to læsninger af den samme fil er
præcis den fejl, der kostede 358 felter"). Jeg lagde derfor den delte logik i
`side.mjs` og lod `robot.mjs` kalde ind i den. `side.mjs` blev **ikke** rørt af
nogen anden gren under fletningen — merge var konfliktfri der.

---

## Prøvekæden bevist ende til ende

`tests/billedkaede/` (tre opdigtede poster, ingen ægte robot) og
`assets/silhuetter/_proeve-kaede.svg` (en håndtegnet, tydeligt mærket
prøvefigur — **ikke** en silhuet af nogen rigtig maskine) beviser:

```
YAML billede:  ->  R18 (validate.mjs)  ->  kopi assets/ -> dist/billeder/
              ->  <picture> paa kortet OG robotsiden  ->  korrekt sti fra hver dybde
```

Efterprøvet konkret: filen findes i `dist/billeder/silhuetter/`, `<picture>` står
i både `da/robotter/index.html` og `da/robotter/proeve-silhuet/index.html`, hver
`src`-attribut peger på en fil, der faktisk findes i `dist/`, den delte fil
(`proeve-delt.yaml`) får `.billedmaerke` med korrekt tekst, den tomme plade
virker stadig for `proeve-tom-plade.yaml` (ingen `billede:`-nøgle), og
`--til-udgivelse` afviser et fabrikantbillede med `SPAERRING S1` i output men
lader et sæt uden fabrikantbilleder passere.

---

## MODSTRIDEN — lagt op til JPK, ikke afgjort her

**CLAUDE.md siger:** `dist/` bygges kun fra `assets/`, og `media/` indgår
aldrig — det er den strukturelle håndhævelse af, at fabrikanternes materiale
ikke kan slippe ud ved et uheld.

**L13 (STATUS.md) siger:** fabrikanternes billeder må bruges, så længe siden er
lokal. **Spærring S1** siger: siden må ikke *publiceres* med dem uden skriftlig
tilladelse.

De to sætninger peger i hver sin retning på ét konkret spørgsmål: **hvordan
kommer et fabrikantbillede overhovedet ind i bygget, når det kun må bruges
lokalt og aldrig må ligge i `assets/` via en kopi fra `media/`?**

Maskineriet, jeg har bygget, løser det ved at **ikke løse det**: `ophav:
fabrikant` er en gyldig værdi i skemaet, og validatoren (R18) accepterer den,
men **filen skal stadig ligge fysisk i `assets/`** — samme krav som til en
silhuet eller et eget foto. Jeg har ikke flyttet noget fra `media/` til
`assets/`, og det var eksplicit forbudt i opgaven.

Det betyder i praksis: **`ophav: fabrikant` er i dag en gyldig, men ubrugelig
værdi.** Der er ingen vej fra de 239 filer i `media/` til et fabrikantbillede på
siden, uden at nogen manuelt kopierer en fil fra `media/` til `assets/` — en
handling, ingen af mine filer foretager, men som heller ikke er teknisk
forhindret af noget andet end fraværet af en kommando, der gør det.

**Tre veje, hver med sin pris:**

1. **Lad det stå som det er.** `ophav: fabrikant` forbliver teoretisk muligt,
   men ingen data bruger det. Billedvejen forbliver `eget_foto`/`silhuet` alene,
   indtil Å3 er afgjort. **Pris:** L13 (fabrikantbilleder tilladt lokalt) har
   reelt ingen kodesti, der fører til den. Beslutningen L13 hang i luften, indtil
   nogen bygger en eksplicit, afgrænset kopimekanisme.
2. **Byg en eksplicit, mærket kopimekanisme** — et separat script (ikke
   `build.mjs`), der kopierer navngivne filer fra `media/_kilder/` til en
   tydeligt mærket undermappe i `assets/` (fx `assets/fabrikant-lokalt/`,
   gitignoreret ligesom `media/` er det i dag), som `build.mjs` kun læser, når
   `--til-udgivelse` **ikke** er sat. **Pris:** endnu en mappe med endnu en
   regel at huske, og præcis den slags pladsholder, `media/_kilder/LÆSMIG.md`
   advarer om, kan opstå der i stedet.
3. **Luk L13 igen.** Beslut, at fabrikantbilleder aldrig bruges — heller ikke
   lokalt — og at Å3 udelukkende løses med egne fotos og måltro silhuetter.
   **Pris:** silhuetterne findes endnu ikke (0 tegnet ud over min prøvefigur),
   og "Behold fotos, mærk de dårlige" (L28) bliver taget af bordet igen.

Jeg anbefaler ikke en af de tre — det er præcis den beslutning, opgaven bad mig
lade ligge.

---

## Selv-review — hvad jeg er usikker på

- **`billedFiler()`-cachen i `side.mjs` er pr. proces, ikke pr. byg.** Den
  cacher `assets/`-indholdet efter rod-sti og ryddes aldrig automatisk. Et
  `--assets=`-flag på validatoren findes; et tilsvarende flag på build.mjs's
  billedlæsning findes ikke ud over `rod` selv, så to på hinanden følgende byg i
  samme Node-proces (kun relevant i tests, ikke i normal CLI-brug, hvor
  processen starter forfra hver gang) kunne teoretisk se en forældet fil-liste.
  `tests/koer.mjs`s eget kald til `billedAlternativer` med en separat `rod`
  beviser, at cachen er nøglet på rod-stien og derfor ikke kolliderer — men jeg
  har ikke skrevet en eksplicit test for "byg to gange i samme proces med
  ændret `assets/`-indhold imellem".
- **`R18` kender ikke til krydsreferencen `delt_med` <-> `delt_med`.** Hvis A
  siger `delt_med: B`, men B ikke selv siger `delt_med: A` (eller slet ikke har
  et billede), fejler intet. Jeg har bevidst ikke krævet gensidighed — B kan
  udmærket få sit eget billede senere uden at skulle opdatere A's post — men det
  er en designbeslutning, jeg traf underv­ejs, ikke noget, der stod i opgaven.
- **`plade`-udledningen (`billedPlade()`) gætter `silhuet` = plade, alt andet =
  ikke-plade, medmindre `plade:` er skrevet eksplicit.** Det er den regel,
  DESIGN.md beskriver ("Varianten `--plade` bruger `contain` ... til de måltro
  silhuetter"), men et fremtidigt eget foto, der ER taget frit på hvid baggrund
  (som DESIGN.md's "Miljøfoto mod plade"-eksempel), vil kræve `plade: ja`
  skrevet i hånden. Det er efter bogen, men det er let at glemme, og
  validatoren fanger det ikke — en glemt `plade: ja` giver ikke en fejl, kun
  en 16:10-beskæring, der måske tager poterne.
  Jeg har ikke bygget en heuristik for det, fordi enhver heuristik ("hvid
  baggrund" fra pixelanalyse) ville være langt større end opgaven bad om.
- **Jeg har ikke bevist, at `<picture>`-ændringen ikke ændrer noget visuelt for
  de 46 rigtige robotter**, fordi ingen af dem har et billede endnu — den tomme
  plade er den eneste tilstand, der reelt er efterprøvet mod rigtigt indhold.
  Kæden er bevist med opdigtet data (`tests/billedkaede/`); den er ikke bevist
  med en rigtig producents rigtige billede, fordi der ikke er nogen i
  `assets/` at bevise den med — det er netop modstriden ovenfor.
- **Jeg rørte `tools/skabelon/side.mjs` ud over den oprindeligt udmeldte
  filliste.** Begrundet ovenfor (delt logik mellem kort og robotside), men det
  er en afvigelse fra en eksplicit instruks, og jeg noterer den, så den ikke
  bliver overset ved fletning til `main`.

---

## Filer rørt (endeligt, efter fletning)

`.gitignore` · `assets/silhuetter/LÆSMIG.md` · `assets/silhuetter/_proeve-kaede.svg` (ny) ·
`data/i18n/da.json` (3 nye nøgler) · `data/i18n/en.json` (3 nye nøgler) ·
`tests/billedkaede/` (ny mappe, 4 filer) · `tests/koer.mjs` ·
`tools/build.mjs` · `tools/muteringstjek.mjs` · `tools/skabelon/robot.mjs` ·
`tools/skabelon/side.mjs` · `tools/skema.mjs` · `tools/validate.mjs`

Ikke rørt: `data/robots/*.yaml` (ingen af de 46 rigtige poster har fået et
billedfelt — det var ikke opgaven), `media/` (intet flyttet), `assets/fotos/`
og `assets/ikoner/` (stadig tomme), `tools/skabelon/producent.mjs` (genbruger
`robot.mjs`s eksporterede `billedled` uændret, verificeret ved at bygge og
læse en producentsides HTML).
