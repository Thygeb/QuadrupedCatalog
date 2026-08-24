# FUND — i18n-nøglerne flyttet ud af generatoren

Gren `kode/i18n-noegler`. Arbejdet udført 21. august 2026.

**Opgaven:** flytte de UI-strenge, generatoren hentede fra
`tools/skabelon/reserve-*.json`, ind i `data/i18n/da.json` og `data/i18n/en.json`,
og nedlægge reservemekanismen.

**Hvorfor det hastede:** CLAUDE.md's arkitekturregel siger *sprogneutrale tal ét sted,
oversat tekst i én fil pr. sprog, URL pr. sprog, `hreflang` imellem dem.* Med
reservefilerne lå oversat tekst **to** steder, og det ene af dem var dansk skrevet
uden æ, ø og å.

---

## Skill-vurdering

`ls .claude/skills/` gav `parallelt` og `robotdata`; de globale er `critique`,
`impeccable` og `ui-ux-critique`.

**Valgt: ingen skill.** Begrundelsen for hver:

| Skill | Fravalgt fordi |
|---|---|
| `robotdata` | Bærer 29-feltsskemaet for **robotposter**. Her røres ingen `data/robots/*.yaml` |
| `parallelt` | Opgaven er ét spor i én worktree. Alle 71 nøgler ligger i to filer, som skal skrives samlet — to agenter ville skrive i samme fil |
| `impeccable` | Design- og IA-planlægning. Det her er en dataflytning i en eksisterende, besluttet struktur |
| `ui-ux-critique` / `critique` | Kritik af en bygget side. Der er ikke bedt om en kritikrunde |
| `code-review` / `simplify` | Ville passe på en gennemgang af generatoren. Ændringen her er 12 linjer, og de er efterprøvet ved at bygge |

Ingen `Unknown skill` undervejs — ingen skill blev kaldt.

Fulgte i stedet de tre globale arbejdsregler direkte: **mål frem for at skøn**
(alle tal nedenfor er målt med et script, som er gengivet i kommandoen), **efterprøv
at noget når din kode** (afsnittet «Ni nøgler, der ikke vises nogen steder») og
**ret assertions, slet dem ikke** (bygrapportens optælling er ikke fjernet, kun
skrevet om til den nye virkelighed).

---

## Hvad der blev flyttet

| | Antal |
|---|---|
| Nøgler i `reserve-da.json` / `reserve-en.json` (ekskl. `_om`) | 76 + 76 |
| Bygget rapporterede som «hentet fra reserven» | **61** |
| Nøgler flyttet til sprogfilerne | **71** |
| Nøgler droppet, fordi de allerede stod i sprogfilerne | 5 |
| `da.json` før → efter (poster, `_om` medregnet) | 169 → **240** |
| `en.json` før → efter | 169 → **240** |

**De 61 mod de 71.** Bygget tæller kun de nøgler, en skabelon faktisk slår op. Ti
nøgler mere lå i reserven uden at blive ramt i denne kørsel. Seks af dem står i
kode, som bare ikke rammes med de nuværende 46 datafiler — de ville være blevet
slettet sammen med filen og var derefter dukket op som `«noegle»` første gang
grenen blev nået. Derfor blev alle 71 flyttet, ikke kun de 61.

**De 5 droppede** er `vaegtklasse_titel`, `vaegtklasse_under_20`, `vaegtklasse_20_40`,
`vaegtklasse_over_40` og `vaegtklasse_ikke_oplyst`. De stod allerede i `da.json` **med
rigtigt æ** (`Vægtklasse`, `Vægt ikke oplyst`), mens reserven havde dem
translittereret. Sprogfilen vandt, som den skulle — reserven blev aldrig læst for dem.

Nøglesættene i de to filer er nu **identiske og i samme rækkefølge**. Målt:
`JSON.stringify(Object.keys(da)) === JSON.stringify(Object.keys(en))` → `true`.

---

## Dansk skriver dansk

**Måling.** Maskinelt tjek for `ae`, `oe`, `aa` inde i ord, kun på **værdisiden**
(nøglenavne er identifikatorer og skal blive ved med at hedde `vaegtklasse_*`):

| Fil | Træf | Ægte fejl |
|---|---|---|
| `reserve-da.json` (HEAD) | 63 | 53 |
| `da.json` (HEAD) | 3 | 0 |
| `da.json` (nu) | **4** | **0** |

De 63 træf i reserven fordelte sig på 9 i `_om` (et kommentarfelt, som forsvandt med
filen) og 54 i værdier; ét af de 54 var `skemaet` og altså falsk. Tilbage: **53 ægte
translittererede ord**, hvoraf 2 lå i de fem droppede nøgler. **51 ord blev rettet
tilbage til æ, ø og å** i de flyttede værdier — talt maskinelt ord for ord mod
HEAD-udgaven.

De 4 tilbageværende træf i `da.json` er alle falske positiver, og hver er set efter:

| Nøgle | Ord | Hvorfor det ikke er en fejl |
|---|---|---|
| `taethed_forklaring` | `skemaets` | `skema` + `ets`. Mønsteret rammer overgangen a→e |
| `skema_titel` | `skemaet` | Samme |
| `felt_kameraer` | `Kameraer` | Almindelig dansk flertalsform af *kamera* |
| `land_Israel` | `Israel` | Egennavn |

Værdier med ægte æ/ø/å: 37 før → **66** nu.

**En rettelse ud over translitterationen.** `tegnforklaring_titel` stod i reserven
som `"Sadan laeses tallene"`. `Sadan` er ikke translittereret `Sådan` — det ville have
været `Saadan` — men en stavefejl. Skrevet som `"Sådan læses tallene"`. Det er den
eneste danske værdi, der ikke er tegn-for-tegn identisk med reserven efter
translitteration; de øvrige **70 af 71** er.

Filerne er skrevet af node som UTF-8 **uden BOM** — målt: første tre bytes er
`7b 0d 0a`, altså `{`, ikke `EF BB BF`. Linjeskiftene er CRLF i arbejdstræet, fordi
`core.autocrlf=true` på denne maskine; den commitede blob er LF, målt til 0 CR-bytes.

---

## Engelsk

52 af de 71 engelske strenge er overtaget uændret fra reserven. **13 er skrevet om**,
fordi de var dansk med engelske ord eller brugte det forkerte fagudtryk:

| Nøgle | Før | Nu | Hvorfor |
|---|---|---|---|
| `filter_anvendelse` | Application | **Intended use** | `en.json` kaldte allerede samme datafelt *Intended use, per the manufacturer*. Reserven gav ét felt to navne på to sider |
| `forside_filtre_etiket` | Application according to the manufacturer | **Intended use, per the manufacturer** | Samme |
| `forside_ordning` | … Application is a filter … | … **Intended use** is a filter … | Samme |
| `vaegtklasse_forklaring` | The boundaries … The manufacturer's **operator** stays **on** the figure | The **class** boundaries … The manufacturer's own **qualifier** stays **with** the figure | *Operator* er dansk fagsprog for fortegnet. `en.json` bruger selv *qualifier* i `vaegtklasse_graense` |
| `kilde_maerke_forklaring` | A **raised** letter … sources **get** several letters | A **superscript** letter … sources **carry** several letters | *Superscript* er det typografiske fagord |
| `kilde_sek_forklaring` | **Dashed letter:** a secondary source … | **A dashed letter marks** a secondary source … **a** datasheet … | Sætningen manglede verbum og artikel |
| `eu_ce_nej` | The manufacturer states there is no CE | … that there is no CE **marking** | *CE* alene er ikke et substantiv på engelsk |
| `eu_ce_ikke_oplyst` | CE is stated nowhere | CE is **not stated anywhere** | Naturlig ordstilling |
| `eu_tilgaengelig_ja` | Stated available in the EU | Stated **as** available in the EU | Grammatik |
| `eu_tilgaengelig_nej` | Not stated available in the EU | Not stated **as** available in the EU | Grammatik |
| `eu_forklaring` | It is **a field of fact**, not import advice | It is **a record of fact**, not import advice | *Field of fact* er en direkte oversættelse af *faktafelt* og betyder ingenting |
| `produktside_link` | Open the manufacturer's page **on** {model} | … page **for** {model} | *Page on X* læses som «side om emnet X» |
| `eu_ce_ingen` | None of {n} models state CE. | None of **the** {n} models state CE. | Artikel |

**Apostroffer.** `en.json` bar to stilarter side om side: 11 værdier med typografisk
`’` og 10 forekomster af lige `'`. Alle 10 er ejefald. Normaliseret til `’`. Det rører
**2 værdier, der lå i `en.json` i forvejen** — `tilstand_kun_billede_forklaring` og
`taethed_forklaring` — og det er den eneste ændring i denne runde af tekst, en anden
agent har skrevet. Det er skrevet frem her frem for at være en stille rettelse.

**Jeg er ikke tryg ved disse tre og beder om et gennemsyn:**

1. `vaegtklasse_forklaring` — *qualifier* er valgt for at matche `en.json`s eget ordvalg,
   men en teknisk indkøber vil måske hellere læse *the manufacturer's own `≤`/`≥` sign*.
   Sætningen er lang på begge sprog.
2. `eu_forklaring` — *a record of fact, not import advice* er min formulering.
   Den danske original siger *faktafelt*, og der findes ikke et engelsk fagord for det.
   Alternativ: *It records what is stated; it is not advice on importing.*
3. `stribe_egenvaegt` — beholdt som **Weight**, selv om feltet er *egenvægt*
   (uden last). `en.json` kalder allerede `felt_egenvaegt` for *Weight*, så *Unladen
   weight* i striben ville give to navne til samme tal. Men *Weight* alene siger ikke,
   om batteriet tæller med — og D9 i STATUS.md noterer netop, at MagicDog vejes uden
   batteri og alle andre med. **Det er et datamodelproblem, ikke et oversættelsesproblem,
   og det bliver ikke løst her.**

---

## Rækkefølgen

Begge filer er skrevet om i **22 grupper**, adskilt af tomme linjer (lovligt JSON,
ingen ekstra nøgler):

`sprog og retning` · `sted og afsender` · `skal og navigation` · `billednoten` ·
`forsiden` · `kataloget og tabellen` · `filtre` · `vægtklasser` ·
`kortets stribe og nøgletallene` · `status` · `de fire datatilstande` ·
`kilder, mærker og tegnforklaring` · `tal, enheder og operatorer` ·
`specifikationstæthed og skemaet` · `feltgrupper` · `feltnavne` · `anvendelse` ·
`EU-kolonnen` · `robotsiden` · `producentsiden` · `billeder` · `lande`

Grupperingen retter samtidig en drift, der var opstået i `da.json`: `anvendelse_sikkerhed_overvaagning` og de tre `anvendelse_arvet_*` var tilføjet
nederst i filen, langt fra de øvrige `anvendelse_*`.

---

## Reservemekanismen er væk

| Fil | Ændring |
|---|---|
| `tools/skabelon/reserve-da.json` | slettet |
| `tools/skabelon/reserve-en.json` | slettet |
| `tools/skabelon/side.mjs` | `brugteReserver` fjernet · `lavSprog()` læser ikke længere en reservefil · `t()` slår kun op i sprogfilen · proxyens `get` og `has` falder ikke tilbage |
| `tools/build.mjs` | importerer ikke længere `brugteReserver` · advarselsblokken fjernet, og teksten i `manglendeNoegler`-blokken skrevet om |

`manglendeNoegler` er **beholdt**. Den er nu den eneste alarm: mangler en nøgle,
står den som `«noegle»` på siden og i bygrapporten. Sikkerhedsnettet blev ikke
sænket for at få noget grønt.

Der står en kommentar i `side.mjs` om, at reservesættet ikke må genindføres, med
begrundelsen: to steder at skrive den samme streng betyder, at det ene bliver glemt.

Maskinelt tjek efter oprydningen: `grep -rn "brugteReserver\|reserve-da\|reserve-en\|reserveFil"`
over alle `.mjs` og `.js` → **ingen træf**.

---

## Efterprøvning, med tællinger

### 1. Felt for felt mod HEAD

Script, der læser HEAD-udgaverne med `git show` og sammenligner:

```
Flyttede noegler: 71
Felter efterproevet: 478
Fejl: 2
Dansk tegn-for-tegn identisk med reserven (efter translitteration): 70/71
Engelsk uaendret fra reserven: 52/71
Translittererede ord rettet til aegte æ/ø/å: 51
```

478 = 168 eksisterende danske + 168 eksisterende engelske + 71×2 flyttede.
De 2 «fejl» er de to apostroffer beskrevet ovenfor; ingen anden eksisterende værdi
er rørt.

### 2. Bygget

```
Byggede 123 sider. Vaegtklasser: 12/12/13/9 over 46 datafiler.
Kort paa forsiden: 46 (skal vaere lig 46). Kildemaerker: 566 tal med kilde, 0 uden.
Kort i kataloget: 46 · sekundaere kilder: 3 felter · billeder kopieret fra assets/: 0
Taethedsnaevnere brugt: 29, 31
```

Identisk med tallene før flytningen (123 sider, 566 kildemærker, 12/12/13/9).
**Advarslen om de 61 reservenøgler udskrives ikke længere,** og der kom ingen
`«noegle»`-advarsel i stedet.

### 3. Byggede sider

**16 sider åbnet** (8 danske, 8 engelske): forside, katalog, fire robotsider og to
producentsider pr. sprog. For hver forventet nøgle kræves, at **alle** dens
bogstavelige stumper (teksten mellem `{pladsholdere}`) står i HTML'en, HTML-undveget:

```
Sider aabnet: 16   feltopslag: 278   fundet: 230   fejl: 0
valgfri gren ikke i data: 48
```

De 48 er grene, dataene ikke rammer på netop den side — fx `eu_ce_ja` på en robot,
hvis producent intet skriver om CE, eller `varianter_forklaring` på en robot uden
varianter. De tælles for sig, ikke som fund.

Hele `dist/` scannet: **123 sider, 0 med tegnet `«`, altså ingen manglende nøgler.**

**Ærligt om denne test:** første kørsel meldte 22 fejl. Alle 22 var **min** fejl, ikke
generatorens — jeg havde gættet, hvilken sidetype hver nøgle hørte til.
`filter_land`, `filter_uden_js`, `filter_vis_alle`, `tegnforklaring_titel`,
`kilde_maerke_forklaring` og `soeg_ingen_traef` vises på **kataloget**, ikke forsiden;
`tabel_model` og `producent_alle` på **producentsiderne**; `stribe_egenvaegt` kun på
de to sider, der har kort. Forventningerne blev derefter lagt efter et
daekningskort målt på det byggede site frem for efter gæt. Det er værd at skrive,
fordi en tælling, der kun gengiver den sidste kørsel, skjuler, hvor tallet kom fra.

### 4. Testene

`node tests/koer.mjs`: **90 ok, 2 FEJL** — både før og efter ændringen, målt ved at
stashe arbejdet og køre igen.

De to fejl er der i forvejen på `main`:

- `11 HTML-sider bygget (fandt 17)`
- `alle fire tilstande har hver sin markoer i katalogets forklaring`

Derudover **stopper testfilen med en ubehandlet exception** på
`tests/.tmp-koersel/dist/stil.css`, som ikke findes — generatoren kopierer
`system.css` og `generator.css`, ikke `stil.css`. Også dette sker på `main`.
**Testene er altså ikke grønne, hverken før eller efter — men de er præcis lige så
grå.** Ingen assertion er ændret eller slettet.

---

## Ni nøgler, der ikke vises nogen steder

62 af de 71 flyttede nøgler kunne findes i mindst én bygget side. Ni kunne ikke.
Her er søgningen, ikke konklusionen — `grep` over alle `.mjs` uden for reservefilerne:

| Nøgle | Findes den i kode? | Vurdering |
|---|---|---|
| `nav_producenter` | ja, `side.mjs:718` | **Fejl et andet sted.** `skal()` tager `harProducenter = false` og `build.mjs` sender den aldrig. Se nedenfor |
| `til_producent` | ja, `robot.mjs:689` | **Fejl et andet sted.** Betinget af `ctx.producent?.slug`, og `build.mjs` giver robotsiden `producenter` (flertal), aldrig `producent` |
| `kort_kilder_ingen` | ja, `side.mjs:615` | Levende gren. Kræver et kort uden kilder; alle 46 poster har kilder |
| `produktside_ingen` | ja, `robot.mjs:468` | Levende gren. Kræver en robot uden produktside |
| `producent_ingen_modeller` | ja, `producent.mjs:191, 295` | Levende gren. Kræver en producent uden modeller |
| `robotside_midlertidig` | ja, `build.mjs:148` | Levende gren. Bruges kun, hvis `robot.mjs` mangler |
| `soeg_kraever_js` | **nej** | Ingen reference nogen steder |
| `eu_tilgaengelig_ja` | **nej** | Ingen reference nogen steder |
| `eu_tilgaengelig_nej` | **nej** | Ingen reference nogen steder |

`alle_felter` skal regnes med i den sidste gruppe: den har heller ingen reference,
og at den «findes» på 46 danske sider skyldes, at `skema_titel` hedder
*Alle felter i skemaet* og indeholder strengen. På engelsk (*All fields* mod
*Every field in the schema*) vises den ikke.

**De fire uden reference blev flyttet med alligevel.** At slette tekst, ingen har
besluttet at slette, er en større fejl end at bære fire ubrugte nøgler. De bør
efterses og enten tages i brug eller fjernes bevidst.

### To fund, der ikke hører til denne opgave

**F1 — de 26 producentsider kan ikke nås.** Bygget skriver 13 producentsider pr.
sprog, men intet på siden linker til dem: navigationen udelader dem
(`harProducenter` er aldrig sand), robotsidens producentnavn er ren tekst og ikke et
link (`ctx.producent` sættes aldrig på en robotside), og der findes ingen
`dist/<sprog>/producenter/index.html`. Efterprøvet i `dist/da/robotter/unitree-b2/index.html`:
`<span class="prod">Unitree Robotics</span>` — intet `<a>`. Det er også forklaringen
på, at `producent_alle` («Alle 13 producenter») kun optræder som overskrift **inde
på** en side, ingen kan komme til.

**F2 — 42 af de 61 danske sider viser stadig translittereret dansk.** Det kommer
**ikke** fra sprogfilerne, men fra fritekst i `data/robots/*.yaml` — `advarsel:`- og
`noter:`-felterne. Målt: 1176 træf på `ae`/`oe`/`aa` i værdisiden af alle 46
YAML-filer; hyppigst `paa` (152), `staar` (66), `staaende` (33), `gaaende` (32).
Eksempel fra `dist/da/robotter/boston-dynamics-spot/index.html`:
*«Strengen built-in stereo cameras staar KUN i databladet»*.
Ikke alle 1176 når en side — mange sidder i feltnavne og kildetyper — men de, der
gør, står i brødtekst på dansk. **Det er samme fejl som den, denne opgave lige har
rettet i i18n, blot ét lag længere nede.** Den bør have sin egen runde.

---

## Hvad jeg ikke nåede

- **STATUS.md er ikke opdateret.** F1 og F2 hører hjemme der. Jeg lod være, fordi
  STATUS.md er den fil, alle parallelle grene skriver i, og en rettelse herfra ville
  give en flettekonflikt for hver anden agent. De to fund står her i stedet og bør
  føres over, når grenene er flettet.
- **F1 og F2 er ikke rettet.** F1 ligger i `build.mjs`s ctx-opbygning og
  `skal()`-kaldene; F2 ligger i 46 datafiler. Ingen af delene er i denne opgaves
  ramme, og begge ville skrive i filer, andre grene rører.
- **Testfilens nedbrud på `stil.css` er ikke rettet.** Den findes på `main`, og en
  rettelse ville skjule, om denne gren gjorde det værre.
- **Ingen browserkontrol.** Sidernes indhold er efterprøvet som HTML-tekst, ikke
  visuelt. En streng, der står i markuppen, men er skjult af CSS, ville jeg ikke
  have fanget.
