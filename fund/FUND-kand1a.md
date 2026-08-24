# FUND-kand1a — Pudu Robotics D5/D5-W og DaxAI Qiji X1/XS

Opgave stillet af CEO'en 24. aug 2026: to producenter fra fund/FUND-messe.md's Tier 1
(World Robot Conference 2026) — Pudu Robotics D5/D5-W og DaxAI Qiji X1/XS. Indsamlet og
skrevet i worktree `C:\Praktik\websites\udstilling-wt-kand1a`, gren `spor/kand1a`.

**Resultat i korte træk:** Pudu D5 og D5-W er begge oprettet som fulde poster. DaxAI Qiji
X1 og XS er **begge afvist** — ikke fordi de ikke er firbenede (det er de efter al
sandsynlighed), men fordi der efter grundig søgning ikke findes NOGET producentmateriale
(hverken produktside, PDF, manual eller udviklerdokumentation) om dem, kun uafhængig
presse. Det gælder også efter CEO'ens regelændring midt i opgaven (se afsnit 4).

---

## 1. Skill-vurdering (regel 0)

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt** | Opgaven ER "tilføj/efterprøv robotposter" — kerneopgaven for skillen. Læst fra `.claude/skills/robotdata/SKILL.md`, fulgt fra start: 33-feltsskemaet, de ti hårde regler, billedbaren og selv-tjekket med tælling er alle brugt nedenfor. |
| `parallelt` | Gået forbi | Jeg *er* allerede det uddelegerede spor (spor/kand1a) i en fordeling, en overordnet agent har foretaget. Skillen bruges af den, der FORDELER arbejde på tværs af worktrees, ikke af udførelsen inden i ét spor — samme begrundelse som FUND-messe.md brugte for samme situation. Internt i opgaven overvejede jeg at splitte research på Pudu vs. DaxAI som to uafhængige tråde, men da jeg er én agent med én opgave og ingen adgang til at starte parallelle subagenter for min egen uddelegerede opgave, er research udført sekventielt af nødvendighed, ikke af et fravalg jeg selv traf. |
| `grillmig` | Gået forbi | Gælder gril af et brief *før* afsendelse eller lås af en åben STATUS.md-beslutning. Mit brief var allerede afsendt; jeg låser ingen beslutning i STATUS.md her (det er orkestratorens bord). |
| `impeccable`, `critique`, `ui-ux-critique`, `dataviz` | Gået forbi | Ingen UI eller design berørt — ren dataindsamling. |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode ændret. |

---

## 2. Pudu Robotics D5 / D5-W

### Stopprøve (regel: firbenet med producentens EGNE ord)

Webbutikkens sidetitel: **"PUDU D5 Series Quadruped Robot | PUDU Official Store"**.
Produktoverskriften (H1) på både butik og officiel side: **"Industry-Grade Autonomous
Quadruped Robot"**. Ingen tvivl — modsat Lenovo Daystar GS og Direct Drive TITA i sidste
runde er der intet i Pudus egen tekst, der peger på andet end fire ben. D5-W er samme
firbenede platform i hjul-ben-hybrid-udgave ("Choose between legged and wheel-legged
configurations"), og opgaven definerer eksplicit at hjul-ben-hybrider tæller.

### Kilder (alle producentens egne)

- `https://store.pudurobotics.com/products/pudu-d5` — Pudus egen Shopify-webbutik.
  Indeholder både en generel markedsføringstekst og en **variant-specifik
  sammenligningstabel** (D5 vs. D5-W) samt rå produkt-JSON med præcise priser.
- `https://www.pudurobotics.com/en/products/d5` — den officielle produktside, samme
  markedsføringstekst, MED fem fodnoter som butikssiden ikke gengiver.
- `https://www.prnewswire.com/news-releases/pudu-robotics-unveils-pudu-d5-series-...` —
  Pudus egen pressemeddelelse (byline: Pudu Robotics, med selskabets "About PUDU"-
  boilerplate), distribueret via PR Newswire. Behandlet som producentkilde, ikke presse —
  ordene er Pudus egne, kun distributionskanalen er ekstern. Eneste kilde med en
  eksplicit lastbetinget driftstid.

### Det vigtigste fund: markedsføringstekst og tabel modsiger hinanden pr. variant

Den generelle markedsføringssætning ("Easily handles 25 cm steps, 30° climbs, and 45°
descents") står ordret på begge Pudu-sider og er skrevet som om den beskriver "D5". Men
den variant-specifikke sammenligningstabel på butikssiden viser noget andet:

| Felt | D5 (tabel) | D5-W (tabel) | Markedsføringstekst |
|---|---|---|---|
| Slope/haeldning (ascent) | **25°** | **30°** | "30° climbs" |
| Maximum Step Height | **30 cm** | **25 cm** | "25 cm steps" |

Markedsføringstekstens tal er faktisk **D5-W's** tabelværdier, skrevet under en
overskrift der lyder som om den gælder D5 generelt. Havde jeg kun læst den fremhævede
prosa (som en AI-opsummering af siden gjorde i mit første forsøg), ville jeg have byttet
de to varianters haeldning og trappetrin om. Sammenligningstabellen er brugt som den
autoritative, variant-specifikke kilde i begge YAML-filer; uoverensstemmelsen er
dokumenteret i `noter` på begge poster.

Et andet fund af samme art: markedsføringsteksten fremhæver "Dual 192-line* spherical
LiDARs" som topspec — men den officielle sides fodnote 5 oplyser at **96-linjers LiDAR er
standardkonfigurationen**, og 192-linjers er en betalt opgradering. Fanget kun ved at
læse fodnoterne, som butikssidens variant af teksten ikke gengiver.

### Data leveret

- `data/robots/pudu-d5.yaml` — **20 af 33 felter udfyldt, 13 ikke_oplyst** (61 %).
- `data/robots/pudu-d5-w.yaml` — **19 af 33 felter udfyldt, 14 ikke_oplyst** (58 %).

Begge under skillens 67 %-alarmgrænse, men i den høje ende — forventeligt, da Pudu har en
usædvanligt fyldig, tabel-struktureret produktside sammenlignet med de fleste kinesiske
producenter i kataloget.

Ikke-skema-tal fundet men UDELADT (ingen felt i skemaet): maksimalt ledmoment (165 Nm),
enkelt-opladnings-rækkevidde (14 km). Noteret i `noter`, tæller ikke i tætheden.

### Selv-tjek (33 felter pr. post, felt for felt mod gemt kilde)

**pudu-d5.yaml: 33 felter efterprøvet, 0 fejl fundet.**
**pudu-d5-w.yaml: 33 felter efterprøvet, 0 fejl fundet.**

Kontrolleret særligt: operatorer bevaret (kun ">" på driftstid, hvor PR-teksten
eksplicit skriver "over two hours" — resten er rå tal uden operator, fordi producenten
selv ikke bruger ulighedstegn på disse felter); nyttelast_gående/stående ikke blandet
(stående er `ikke_oplyst` — intet stående-tal findes nogen steder); trappetrin/forhindring
ikke blandet (to adskilte producent-etiketter, "Climbing Capability" og "Maximum Step
Height", tildelt hver sit skemafelt — se advarsel i filerne om at denne tildeling er min
fortolkning, ikke en skelnen producenten selv navngiver); driftstid bærer `ved_last`
på begge poster (D5: 30 kg eksplicit; D5-W: `ikke_oplyst` eksplicit, da ingen
lastbetinget driftstid findes for den variant).

### Billedkandidater (INGEN billede:-blok oprettet, jf. opgavens instruks)

- `https://store.pudurobotics.com/cdn/shop/files/D5_eeebd6c0-5fa4-4689-808e-a4ab22b728c7.png` —
  hovedproduktbillede, D5, hvid/studio-baggrund. Ser ud til at bestå billedbarens kriterier
  ved øjemål (hele maskinen, intet UI, ingen indbrændt tekst) — **ikke efterprøvet med
  øjne af mig, kun fundet i produkt-JSON'en**, jf. billedport-reglen om at et ikke-efterprøvet
  billede ikke må bruges.
- `https://store.pudurobotics.com/cdn/shop/files/D5W.jpg` — tilsvarende for D5-W.
- Yderligere 8 galleribilleder på samme produktside (nummereret 1-8, samt `D5.png` i høj
  opløsning) — ikke gennemgået enkeltvis.

---

## 3. DaxAI Robotics Qiji X1 / Qiji XS — AFVIST, dokumenteret

### Stopprøve — sandsynligvis bestået, men IKKE med producentens egne, verificerbare ord

Fem uafhængige presseoutlets (to sprog) beskriver Qiji X1 konsistent som firbenet:

- ithome.com / tech.ifeng.com (kinesisk, sandsynligvis samme pressemeddelelse-oprindelse,
  ordret enslydende tal på tværs af outlets): **"纯四足仿生点足机型"** ("rent firbenet
  bionisk punktfods-model").
- tech360tv (citerer "Techeblog"): **"It moved via four mechanical legs"**, gentaget tre
  gange i artiklen.
- Ingen af de fem kilder modsiger hinanden eller antyder et andet bental.

Dette er stærkt, konvergerende bevis for at robotten faktisk ER firbenet. Men **ingen af
disse fem kilder er producentens egen side** — de er alle uafhængig presse eller en
finansnyhedsside, der gengiver en pressemeddelelse jeg ikke selv har kunnet finde hostet
af DaxAI selv.

### Hvad jeg gjorde for at finde en producentkilde (og hvorfor det ikke lykkedes)

1. Fandt DaxAI/大咖机器人's officielle hjemmeside: `https://daxrobotics.cn/` (bekræftet
   via `application/ld+json`-organisationsmarkup på siden selv: "大咖机器人 DAX Robotics").
2. Siden er en React/Vite-SPA — den rå HTML indeholder kun `<head>` og et tomt `#root`.
   Hentede derfor JS-applikationsbundtet direkte (`/assets/index-CXEhxk-c.js`, 584.780
   byte) og søgte i HELE filens tekst efter `X1`, `XS`, `骐骥`, `四足` og `quadruped`.
   **Nul produkt-træffere.** De eneste "X1"/"XS"-forekomster er interne variabelnavne i
   det medfølgende animationsbibliotek (framer-motion), ikke produktnavne.
3. Sitets EGET "Qiji"-produkt er **"骑骥 T1000"** — bemærk: andet første tegn (骑, ikke
   骐) end pressens "骐骥". Beskrevet som "吨级负载 · 工业级耐久" (ton-klasse last,
   industriel holdbarhed), men med billed-alt-teksten **"机器人产品图（透明背景占位）"**
   = "robotproduktbillede (transparent baggrund, PLADSHOLDER)" — dvs. producentens egen
   side markerer selv billedet som en pladsholder. Ingen ordet "四足" (firbenet)
   forekommer noget sted i forbindelse med T1000 heller.
4. Sitets nyhedsside (`#/news`) er tom: **"暂无新闻。后续将更新公司动态、产品进展与合作
   公告。"** = "Ingen nyheder endnu. Vi opdaterer senere med firmanyt, produktfremskridt og
   samarbejdsmeddelelser." — dvs. selskabet har ikke selv publiceret WRC-lanceringen
   (19.-23. aug 2026) på sin egen side endnu, en dag efter messens afslutning.
5. Søgte eksplicit efter PDF-datablade, manualer og udviklerdokumentation på
   `daxrobotics.cn` (websøgning med `filetype:pdf` og danske/engelske/kinesiske
   nøgleord for "download"/"specifikation"/"manual") — ingen fund.
6. Søgte efter en JD.com-butiksside (selskabet har en pressedækket 3-årig aftale med
   JD.com om "全球独家预售" — global eksklusiv forsalg) — JD's søgefunktion er for
   JS-tung til at kunne hentes, og ingen direkte produkt-URL blev fundet. Selv hvis den
   var fundet, ville en JD.com-butiksside efter min læsning af CEO'ens skærpede regel
   (se afsnit 4) tælle som "forhandler", ikke som producentens egen side.

**Konklusion: Der findes efter al sandsynlighed et rigtigt, firbenet produkt — men intet
verificerbart producentmateriale om det, hverken side, PDF, manual eller
udviklerdokumentation, kun uafhængig presse.**

### Regelændring midt i opgaven (L33, meddelt af koordinator under research)

CEO'en udvidede reglen midt i arbejdet: alt producentmateriale tæller nu som gyldig
kilde — ikke kun produktsider, men også PDF-datablade, manualer og
udviklerdokumentation. Kravet om URL + hentedato pr. tal og synligt sekundær-mærke
(`kildetype: sekundaer`) står uændret, og **kilden skal stadig være producenten selv —
aldrig presse eller forhandlere**, eksplicit gentaget af CEO'en.

Denne regelændring **afgjorde sagen for mig, i retning af afvisning**: den udvidede
hvilke FORMER producentmateriale kan have (webside → +PDF/manual/devdocs), men bekræftede
eksplicit at presse aldrig kan substituere producentkilden, med eller uden
sekundær-mærke. Jeg havde allerede fundet nul producentmateriale af nogen form for
Qiji X1/XS; den udvidede regel gav mig en ny søgevinkel (PDF/dev-docs, se punkt 5
ovenfor), men den ændrede ikke resultatet — stadig nul fund.

Jeg overvejede at oprette posterne alligevel, med alle felter mærket `kildetype:
sekundaer`, fordi skemaets `POST_NOEGLER` eksplicit har et `kildetype`-felt netop til
denne situation ("sekundær kilde... så det senere kan besluttes, om de overhovedet må
tælle med"). Jeg landede på at IKKE gøre det, fordi CEO'ens egen ordlyd — "aldrig presse
eller forhandlere" — er en klarere og friskere instruks end skemaets generelle
kildetype-mekanisme, og fordi opgavens egen ordlyd var eksplicit: "Ingen producentkilde
→ dokumenteret afvisning frem for tynd post." Det er præcis den situation her.

### Hvad der ER kendt (kun til orientering — ingen data-fil oprettet)

Fra pressens gengivelse af det, der efter al sandsynlighed er én fælles
pressemeddelelse (identiske tal på tværs af uafhængige outlets):

- **Qiji X1**: egenvægt ~300 kg, hastighed 7-10 km/t, dynamisk last op til 300 kg,
  maks. ledmoment 1400 Nm (intet skemafelt), rækkevidde 40 km (intet skemafelt),
  driftstid 8-10 t (uden eksplicit lastbetingelse sammen med driftstiden).
- **Qiji XS** (hjul-ben-hybrid): egenvægt ~320 kg, hastighed over 40 km/t, rækkevidde
  angivet til BÅDE 60 km (kinesisk presse) OG ~100 km (tech360tv/Techeblog) — en
  uforklaret modsigelse mellem kilderne, endnu et argument for ikke at publicere tal jeg
  ikke selv kan verificere hos producenten.
- **Pris**: ¥289.000/~$43.000 (X1), ¥359.000/~$53.000 (XS) — kun fundet i tech360tv, som
  selv skriver "estimated", og i et ubekræftet opslag på X/Twitter. For svagt til et tal
  jeg ville skrive i et felt, selv med `kildetype: sekundaer`.
- Status i pressen: "全球独家预售" (global eksklusiv FORSALG/reservation), ikke bekræftet
  almindeligt salg — endnu en grund til forsigtighed ift. `status`-feltet, hvis en
  fremtidig agent finder en producentkilde.

**Hvis en fremtidig agent finder producentmateriale** (fx hvis `daxrobotics.cn` opdateres
med Qiji-produktsider, eller en PDF/devdoc dukker op), er ovenstående presse-tal et godt
udgangspunkt for krydstjek — men skal ikke overføres direkte til en `felter:`-blok uden
egen producent-kilde.

---

## 4. Regelændringens konsekvens for dette spor — opsummeret

| | Før L33 | Efter L33 |
|---|---|---|
| Pudu D5/D5-W | Allerede kun producentkilder (webbutik, officiel side, egen PR) | Ingen ændring — ingen sekundær kilde brugt |
| DaxAI Qiji X1/XS | Overvejede at oprette med `kildetype: sekundaer` på alle felter | **Afvist** — regeltekstens "aldrig presse eller forhandlere" er eksplicit og fjernede tvivlen |

---

## 5. Gitignorerede nye filer (fuld sti)

Alle under `media/_kilder/` — gitignoreret bortset fra `LÆSMIG.md`, som ikke er ændret:

```
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\MANIFEST.tsv
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\pudu-d5-storeside-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\pudu-d5-storeside-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\pudu-d5-officielside-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\pudu-d5-officielside-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\pudu-d5-prnewswire-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\pudu-d5-prnewswire-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-officielside-forside-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-officielside-jsbundle-2026-08-24.js
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-ithome-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-ithome-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-ifeng-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-ifeng-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-eeo-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-eeo-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-10jqka-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-10jqka-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-tech360tv-2026-08-24.html
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\raa-kand1a-2026-08-24\daxai-qiji-tech360tv-2026-08-24.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\commit-msg-pudu-d5.txt
C:\Praktik\websites\udstilling-wt-kand1a\media\_kilder\commit-msg-pudu-d5-w.txt
```

`http_status` er reelle curl-statuskoder (alle 200), ikke "ukendt" som i det ældre
vest-sæt — hentet med `curl -sL -w "%{http_code}"` for hver fil. `hentet_utc` er filens
mtime, målt direkte, ikke skønnet.

---

## 6. Færdikriterium (tal)

**(a) Poster leveret/afvist:** 2 leveret (pudu-d5, pudu-d5-w), 2 afvist med begrundelse
(daxai-qiji-x1, daxai-qiji-xs — ingen filer oprettet). Dækker alle firbenede modeller
fundet hos de to producenter: Pudu har ingen andre firbenede modeller end D5-serien
(deres øvrige linjer er hjulrobotter/humanoider, jf. "About PUDU"-boilerplaten: service
delivery, commercial cleaning, industrial delivery, embodied intelligent — kun D5-serien
er quadruped). DaxAI's øvrige kendte produkt (T1000, "骑骥") er nævnt på egen side uden
et eneste tal og uden ordet "firbenet" nogen steder — ikke undersøgt som selvstændig
kandidat, da opgaven eksplicit bad om X1/XS.

**(b) Felter pr. post:**
- pudu-d5.yaml: 20 af 33 udfyldt, 13 ikke_oplyst. 20+13=33.
- pudu-d5-w.yaml: 19 af 33 udfyldt, 14 ikke_oplyst. 19+14=33.

**(c) Validering:** `node tools/validate.mjs` → 48 fil(er) · 0 fejl · 1 advarsel (den ene
advarsel er præeksisterende, på `ghost-robotics-vision-60`, urelateret til dette spor).
`node tools/build.mjs` → Byggede 131 sider, 48 kort på forsiden (46 gamle + 2 nye), 606
tal med kilde, 0 uden.

**(d) Selv-tjek med tælling:** pudu-d5.yaml — 33 felter efterprøvet, 0 fejl. pudu-d5-w.yaml
— 33 felter efterprøvet, 0 fejl. Samlet: 66 felter efterprøvet på tværs af de to poster,
0 fejl fundet.

**(e) Gitignorerede filer:** se afsnit 5, 22 filer, fuld sti angivet.

---

## 7. Selv-review — hvad jeg er mest usikker på

- **Akse-tildelingen L×B×H for Pudu D5/D5-W** (900 × 543 × 572 mm). Producenten trykker
  tre tal uden at mærke akserne, ligesom DEEP Robotics X30-precedenten. Jeg har fulgt
  samme konvention (første tal = længde) som X30-filen, men det er en antagelse, ikke en
  bekræftet kilde-læsning. Markeret med `advarsel:` på alle tre felter i begge filer.
- **Tildelingen af "Climbing Capability" (80 cm) til forhindring_enkelt og "Maximum Step
  Height" (25-30 cm) til trappetrin_kontinuerlig.** Producenten selv bruger hverken ordet
  "enkelt" eller "kontinuerlig" — det er min fortolkning af hvilket producent-felt der
  svarer til hvilket skema-felt, baseret på at "Climbing Capability" er det højere,
  mere lejlighedsvise tal, og "Maximum Step Height" det lavere, mere vedvarende. Kunne
  være byttet om. Flagget eksplicit i begge filer.
- **Hastighedsfeltet (5 m/s) er IKKE en del af den variant-specifikke sammenligningstabel**
  — kun den generelle markedsføringstekst. Givet at markedsføringsteksten allerede har
  vist sig at blande D5 og D5-W's tal sammen én gang (haeldning/trappetrin), er jeg
  usikker på om 5 m/s faktisk er identisk for begge varianter, eller om det reelt er
  D5-W-specifikt (PR-teksten kobler eksplicit "wheel-leg hybrid locomotion" til 5 m/s).
  Brugt for begge varianter med denne usikkerhed noteret.
- **DaxAI-afvisningen er en judgment call, ikke en mekanisk regel.** Et andet menneske
  kunne rimeligt argumentere for at fem konvergerende, uafhængige pressekilder på to
  sprog med identiske tal er stærkt nok bevis til at oprette en post med
  `kildetype: sekundaer` på alle felter — skemaet har trods alt mekanismen indbygget.
  Jeg valgte den strengere læsning af CEO'ens "aldrig presse eller forhandlere", men
  hvis CEO'en mente noget mildere med sekundær-mærket, er dette den ene beslutning i
  denne rapport, der bør efterprøves af et menneske, ikke kun af mig.
- **Billedkandidaterne er IKKE efterprøvet med øjne** — kun fundet i produkt-JSON'en.
  Opgaven bad eksplicit om ikke at oprette `billede:`-blokke, så dette er kun en
  markering af kandidater til en senere billedrunde, ikke en godkendelse.
- **Pudu-selskabets by (Shenzhen)** er skrevet uden inline kilde, i tråd med praksis for
  identitetsfelter i eksisterende poster (fx `deep-robotics-x30.yaml`'s "Hangzhou") — det
  er almindeligt kendt, offentligt faktum om selskabet, men ikke bekræftet direkte i
  D5-materialet selv (ingen af mine tre Pudu-kilder nævner en by).
