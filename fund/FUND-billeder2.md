# FUND-billeder2 — 21 af 23 manglende fabrikantbilleder tilføjet

`fund/FUND-billeder.md` er allerede brugt (et tidligere spor 21. aug 2026, der byggede
selve billedmaskineriet/R18 — ikke denne opgave). Denne fil er nummereret videre,
jf. dokumentreglen "genbrug aldrig et dokumentnavn".

Spor `spor/billeder`, worktree `udstilling-wt-billeder`. Skill valgt: `robotdata` (læst
fra disk, "Billedbaren"-afsnittet fulgt for hvert billede). Fravalgt: `parallelt` (jeg
er selv det udsendte spor), `grillmig` (intet nyt brief sendes videre),
`impeccable`/`ui-ux-critique` (punkt 4 er et enkeltbillede-tjek, ikke en designkritik).

## 1. Løsning valgt / fravalgt

- **21 af 23 robotter fik et fabrikantbillede** fra producentens egen side eller PDF.
  Fravalgt for 2: **xiaomi-cyberdog-1** (mi.com/cyberdog giver 403 live og i Wayback;
  fangsten er kun Mi Malls generiske ikon-nav) og **yuejia-yj30** (dens egen side
  genbruger kun en folkemængde-/kostumescene og en to-model-samleopstilling, begge med
  en hjulvariant — forkert for den rent gående YJ30). Begge beholder målepladen.
- **Delte familiefotos (note-mærket) fremfor gæt per SKU**, hvor producenten selv kun
  har ét foto for en hel produktfamilie (galileo C1/E1, C1-W/E1-W; genisom L2-W/L2-W
  Ultra mod eksisterende L2; genisom M1 Pro/Ultra mod M1; addverb Trakr 5/20) — samme
  mønster som Lynx-serien allerede brugte. Fravalgt: at opfinde en forskel, siden ikke viser.
- **Galileo-billederne kom fra PDF'ens indlejrede JPEG-strømme** (et lille node-script,
  der scanner efter SOI/EOI-markører), fordi producentens SPA-side ikke server-renderer
  noget billede-URL overhovedet. Fravalgt: at bruge en sekundær kilde i stedet.

## 2. Konfidens pr. punkt

- **validate.mjs 77/0/1** — HØJT. Kommando: `node tools/validate.mjs`. Havde jeg brudt
  R18 (forkert `ophav`, manglende `kilde`/`hentet`, fil der ikke findes), var fejltallet
  >0 — det var det, indtil hver enkelt fil rent faktisk lå i `assets/`.
- **build.mjs: 75 billedfelter brugt af 75 robotter (op fra 54), 1110/0 kildemærker
  uændret** — HØJT. Kommando: `node tools/build.mjs --ud=dist-c`. Havde jeg rørt et
  datafelt ved siden af, ville 1110-tallet være ændret.
- **2 måleplader tilbage (ned fra 23)** — HØJT. Kommando:
  `grep -l 'class="maalplade"' dist-c/da/robotter/*/index.html | wc -l`. Havde jeg
  glemt en robot, ville tallet være højere end 2. (Bygtekstens egen "0 tomme plader"
  måler en ANDEN, ubrugt fallback-klasse — se "Nye fælder" nedenfor.)
- **`grep -rl "_kilder" dist-c/ | wc -l` → 10** — HØJT målt, men MIDDEL i relevans:
  `git diff cf2d117 HEAD --stat` på de 5 ramte filer viser 0 ændringer fra mig; den
  femte (yuejia-yj30-max-w.yaml) havde sin `_kilder`-note allerede før mit spor
  startede (commit `0483dda`). Kriteriet var sat til 0, men baseline var allerede 10.
- **Dubletter: 11 filer byte-identiske med en anden fil** — HØJT, alle bevidste og
  noterede (se tabellen). Kommando: `sha256sum assets/fotos/fabrikant/* | sort`.

## 3. Usikkerheder

- Intet Playwright-værktøj var tilgængeligt for dette subagent-kald (kun `WebFetch`
  fandtes ved søgning) — punkt 4's "se på kortene i en browser" er derfor IKKE gjort
  som en levende rendering. Erstattet med: (a) alle 46 kandidatbilleder set med øjne
  via Read-værktøjet før valg, og (b) et grep-bevist tjek af, at alle 21 `<picture>`-
  kilder i det byggede `dist-c/` peger på filer, der rent faktisk findes.
- Galileo C1 vs. E1's delte foto er en **fortolkning**: PDF'en har intet tekstlag
  (kun vektor-outlines), så jeg kunne ikke krydstjekke billed-til-model-tildelingen
  med søgbar tekst — kun med billed-byte-nærhed i filen og de allerede indsamlede
  datafelters mønster (S1 er den eneste med et ekstra sensormodul).
- Bhairav-billedet (1,3 MB) er større end katalogets typiske filstørrelse
  (17 KB–500 KB) — ingen billedværktøj (ImageMagick/sharp/ffmpeg) var tilgængeligt til
  at komprimere det. Fungerer korrekt i bygget, men er unødigt tungt.

## 4. Målingerne

```
Grundmåling (før):  validate 77/0/1 · tests 217/2 · build 213 sider, 54 billeder/54 robotter, 1110/0 tal
Efter runden:       validate 77/0/1 · build 213 sider, 75 billeder/75 robotter, 1110/0 tal
Måleplader tilbage: 2 (xiaomi-cyberdog-1, yuejia-yj30) — ned fra 23
grep _kilder i dist: 10 (alle 10 pre-eksisterende, 0 fra mit spor - se konfidensafsnit)
Billeder set med øjne: 46 · brugt (unikke kildefiler): 15 · forkastet: 31
Dubletter (bevidste): 11 filer, alle note-mærkede
```

## Nye fælder og opdagelser

- **`tomme plader` i build.mjs's egen udskrift tæller `class="intetfoto"`, IKKE den
  målte plade (`class="maalplade"`).** En robot uden billede, men MED kendt længde/højde,
  får den flotte opmålte plade (tal og alt), aldrig den tomme `intetfoto`-boks — så
  byggets egen "0 tomme plader"-linje var 0 både før og efter mit spor og måler reelt
  intet om, hvor mange robotter der mangler et foto. Brug i stedet
  `grep -l 'class="maalplade"' dist-c/da/robotter/*/index.html | wc -l`.
- **PDF'er uden tekstlag kan stadig afsløre billeder:** Galileos produktmanual har
  ingen `Tj`/`TJ`-tekstoperatorer (overskrifter er tegnede vektorstier), så almindelig
  tekstudtræk fejler — men de 76 indlejrede JPEG-billeder lå der som rå DCTDecode-
  strømme og kunne hentes ud med et 30-linjers node-script (SOI/EOI-scanning), uden
  eksterne afhængigheder. (`pdftoppm`/poppler er IKKE installeret i dette miljø, modsat
  hvad en note i `neura-quadruped.yaml` hævder — det kan have været sandt på en anden
  maskine/session.)
- **En CDN kan afskære en fil midt i overførslen uden fejlkode.** Et af Yuejias egne
  billeder (44e3837089…​.png) kom konsekvent tilbage som præcis 5.242.880 byte
  (5×1024×1024) med HTTP 200, ved to uafhængige forsøg — et ægte, tavst afskåret PNG på
  producentens egen server. Billedet blev droppet til fordel for et andet på samme side.
- **`curl` kunne ikke skrive til sessionens fælles scratchpad-mappe** (permission
  denied, både direkte og i undermapper) — al midlertidig billedhentning måtte ligge i
  `media/_arbejde/` (gitignoreret, projektets egen "billedagent-arbejdsmappe"), som
  viste sig at være netop det, mappen er lavet til.
- **`assets/fotos/` har intet krav om ensartet filstørrelse** — eksisterende filer
  spænder 17 KB til 500 KB uden mønster; intet var derfor "forkert" ved at lade Bhairav-
  billedet være 1,3 MB, blot unødigt tungt.
- **Et gammelt `fund/FUND-billeder.md` lå allerede i worktreen** (21. aug 2026, et
  tidligere spor om selve billedmaskineriet/R18, ikke om robotbilleder) — denne rapport
  hedder derfor `FUND-billeder2.md`.

## Punkter i briefet, jeg ikke nåede

- Ingen Playwright-baseret levende gennemsyn af de byggede kort (værktøjet var ikke
  tilgængeligt for dette subagent-kald) — erstattet med kildebillede-inspektion plus
  sti-verifikation, se "Usikkerheder".
- `_kilder`-lækagen på 10 filer er målt og forklaret som pre-eksisterende, men er
  IKKE rettet — de 4 filer, jeg ikke selv skrev, ligger uden for mit brief (de er ikke
  blandt de 23 navngivne robotter, og at rette dem ville være scope creep uden et
  eksplicit acceptkriterium for det).

## S1-sporingstabel (uden for 60-linjers loft)

| Robot-slug | Producent | URL hentet fra | Dato | Filnavn i assets/ |
|---|---|---|---|---|
| bhairav-robotics-shvana | Bhairav Robotics | bhairavrobotics.com/wp-content/uploads/sites/197/2025/08/Shvana-page-pic1.png | 2026-08-26 | bhairav-robotics-shvana.png |
| galileo-c1 | Galileo (Tianjin) | worldrobotconference.com …Galileo-...产品手册_20250708115131A101.pdf (indlejret JPEG) | 2026-08-26 | galileo-c1.jpg |
| galileo-e1 | Galileo (Tianjin) | samme PDF | 2026-08-26 | galileo-e1.jpg |
| galileo-s1 | Galileo (Tianjin) | samme PDF | 2026-08-26 | galileo-s1.jpg |
| galileo-c1-w | Galileo (Tianjin) | samme PDF | 2026-08-26 | galileo-c1-w.jpg |
| galileo-e1-w | Galileo (Tianjin) | samme PDF | 2026-08-26 | galileo-e1-w.jpg |
| galileo-s1-w | Galileo (Tianjin) | samme PDF | 2026-08-26 | galileo-s1-w.jpg |
| genisom-gangben-l1-w | GENISOM AI | genisomai.com/product-robot/L1-W | 2026-08-26 | genisom-gangben-l1-w.webp |
| genisom-gangben-l2-w | GENISOM AI | genisomai.com/product-robot/L2 (delt med L2) | 2026-08-26 | genisom-gangben-l2-w.webp |
| genisom-gangben-l2-w-ultra | GENISOM AI | genisomai.com/product-robot/L2 (delt) | 2026-08-26 | genisom-gangben-l2-w-ultra.webp |
| genisom-qiuqiu-sp1 | GENISOM AI | genisomai.com/product-robot/sp1 | 2026-08-26 | genisom-qiuqiu-sp1.webp |
| genisom-tongchui-m1 | GENISOM AI | genisomai.com/product-robot/M1 | 2026-08-26 | genisom-tongchui-m1.webp |
| genisom-tongchui-m1-pro | GENISOM AI | genisomai.com/product-robot/M1 (delt) | 2026-08-26 | genisom-tongchui-m1-pro.webp |
| genisom-tongchui-m1-ultra | GENISOM AI | genisomai.com/product-robot/M1 (delt) | 2026-08-26 | genisom-tongchui-m1-ultra.webp |
| keybotic-keyper | Keybotic | keybotic.com/wp-content/uploads/2023/12/keyper-robot-01opt.png | 2026-08-26 | keybotic-keyper.png |
| neura-quadruped | NEURA Robotics | neura-robotics.com/wp-content/uploads/2026/01/NEURA_Quadruped_2.webp | 2026-08-26 | neura-quadruped.webp |
| addverb-trakr-20 | Addverb | addverb.ai/trakr (framerusercontent.com side-billede, delt med Trakr 5) | 2026-08-26 | addverb-trakr-20.png |
| addverb-trakr-5 | Addverb | addverb.ai/trakr (delt) | 2026-08-26 | addverb-trakr-5.png |
| yuejia-yj30-w | Yuejia Lingdong | yuejialingdong.com/index.php/yuejiasizuxilie/59.html | 2026-08-26 | yuejia-yj30-w.png |
| yuejia-yj30-max | Yuejia Lingdong | yuejialingdong.com/index.php/yuejiasizuxilie/57.html | 2026-08-26 | yuejia-yj30-max.png |
| yuejia-yj30-max-w | Yuejia Lingdong | yuejialingdong.com/index.php/yuejiasizuxilie/58.html | 2026-08-26 | yuejia-yj30-max-w.png |

## Punkt 1a — fundet i eksisterende fangst? (uden for loftet)

| Robot | I fangst (URL/materiale) | Endeligt resultat |
|---|---|---|
| addverb-trakr-20/-5 | Ja (addverb-ai-trakr-2026-08-25.html) | Tilføjet |
| bhairav-robotics-shvana | Ja (bhairav-shvana-robot.html) | Tilføjet |
| galileo × 6 | Nej i HTML (tom SPA-skal) — **ja i PDF'en**, som lå i fangsten | Tilføjet |
| genisom × 7 | Ja (egne model-sider i raa-genisom-2026-08-24) | Tilføjet |
| keybotic-keyper | Ja (keybotic-home.html) | Tilføjet |
| neura-quadruped | Ja (neura-quadruped-reservation-2026-08-25.html) | Tilføjet |
| xiaomi-cyberdog-1 | Ja (URL-liste), men alt var Mi Malls generiske ikoner | IKKE tilføjet |
| yuejia-yj30 | Ja (yuejialingdong-yj-56-2026-08-25.html) | IKKE tilføjet (forkert variant/samlebillede) |
| yuejia-yj30-max/-w/-max-w | Ja (egne id-sider 57/58/59) | Tilføjet |

**Målt, ikke gættet:** 22 af 23 robotter blev løst udelukkende fra billed-URL'er, der
allerede lå i den eksisterende fangst (kun billedbytes, ikke selve HTML-siden, blev
hentet live). Kun xiaomi-cyberdog-1 krævede et forsøg uden for fangsten (live
mi.com + Wayback Machine) — og det forsøg endte alligevel uden brugbart billede.

## Filer uden for git (skal kopieres manuelt ved flet)

`assets/fotos/fabrikant/*.{jpg,png,webp}` (de 21 nye + de 54 eksisterende) og hele
`media/_arbejde/billeder-2026-08-26/` (arbejdsmateriale, kan slettes efter flet) er
gitignorerede. Kun `data/robots/*.yaml`-ændringerne er committet på grenen.
