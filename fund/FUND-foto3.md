# FUND-foto3 — fabrikantfoto til de sidste tre robotter (Lite3, X20, CyberDog 1)

Gren `spor/foto3`, worktree `c:\Praktik\websites\udstilling-wt-foto3`. Opgaven var udtrykkeligt
IKKE at gentage det, en tidligere agent allerede havde afvist (se `fund/FUND-fotos-2.md`), men at
prøve veje, den ikke prøvede.

---

## Skill-vurdering (obligatorisk første handling)

**Valgt: `robotdata`.** Kaldt via `Skill`-værktøjet med navnet `robotdata` — den blev fundet og
loadet uden `Unknown skill`, så der er intet fallback at rapportere. Den bærer 33-feltsskemaet,
og især de ti hårde regler er relevante her: regel 1 (opfind aldrig et tal/en kilde) og regel 2
(kilde + hentet på alt) gælder lige så meget for `billede:`-feltet som for et talfelt, og det er
den regel, der afgør CyberDog 1-sagen nedenfor.

**Gået forbi:** `parallelt` (jeg er selv ét spor, ikke fordeleren — tre andre agenter kører
allerede parallelt på andre spor ifølge opgavebeskrivelsen), `grillmig` (intet nyt agentbrief
eller åben beslutning at grille — briefet var allerede stramt og grillet, da jeg fik det),
`impeccable`/`critique`/`ui-ux-critique` (ren dataindsamling af billeder, intet bygget UI at
kritisere), `dataviz` (ingen graf), `new-project`/`code-review`/`simplify` (ingen kode ændret,
kun data og billedfiler).

---

## Færdigkriterium (tal)

**(a) N af 3 fik billede, K dokumenteret uden. N + K = 3.**
N = 2 (`deep-robotics-lite3`, `deep-robotics-x20`). K = 1 (`xiaomi-cyberdog-1`). N + K = 3. ✓

**(b) Pr. robot: antal URL'er prøvet, og resultat af hver** — se de tre afsnit nedenfor.

**(c) sha256 mod alle eksisterende filer i `assets/fotos/fabrikant/`** — se afsnittet "Dubletkontrol".

**(d) `node tools/validate.mjs` = 0 fejl, byggets billedtæller = 43+N.**
```
node tools/validate.mjs  →  46 fil(er) · 0 fejl · 1 advarsel
                             (ghost-robotics-vision-60/hastighed/R9 — foreksisterende, urørt af mig)
node tools/build.mjs     →  Billedfelter: 45 fil(er) brugt af 45 robot(ter) · fabrikant: 45
                             (43 baseline + 2 nu = 45, som krævet: 43+N med N=2)
```

**(e) Fuld liste over nye gitignorerede filer med absolut sti** — se afsnittet "Filer til flet"
nedenfor, inklusive et vigtigt forbehold om at `.gitignore` faktisk IKKE dækker den ene af de to
mapper, se der.

---

## deep-robotics-lite3 — FIK billede

**Præmis genkontrolleret, ikke gentaget:** Jeg hentede selv de 5 arkivfiler i hovedrepoets
`media/robotbilleder/deep-robotics-lite3/` (kun læst, aldrig rørt) og hashede dem uafhængigt:
`lite3-1.png` = `eecfc3ff…` og `lite3-3.png`/`x20-3.png` samt `lite3-5.png`/`x20-5.png` er
byte-identiske parvis på tværs af Lite3 og X20; `lite3-4.png` (`07baee9a…`) er en tydelig
ledmodul-nærbillede. Ingen af filnavnene matchede `4eb65513a6…` direkte i Lite3-mappen — men
`x20-2.png` gjorde, det tal opgavebeskrivelsen selv citerede for det delte "andre
produkter"-miniature. Bekræftet: den tidligere afvisning var korrekt, og jeg genbrugte intet af
det arkiverede materiale.

**Nye URL'er prøvet (4):**

| URL | Resultat |
|---|---|
| `https://www.deeprobotics.us/products/x20/` og forsiden | **Afvist uden brug.** Footer: "©2026 Warpify, Inc. - Official DEEP Robotics Partner." Det er en tredjepartsforhandler, ikke producentens eget domæne — forbudt af regel 3 i opgavebeskrivelsen, uanset hvor gode billederne ser ud (og det gør de: `deep-robotics-lite3-quadruped-robot.png` findes der) |
| `https://www.deeprobotics.cn/en/wap/product1.html` | **HTTP 200.** Lite3's egen mobilside — IKKE i det tidligere indsamlede materiale (kun desktop-siderne `index/product1.html` var hentet før). Indeholder 7 nye billed-stier: `p111_.jpg, p222.jpg, p333.jpg, p444.jpg, p555.jpg, lite_01.jpg, p8_.jpg` |
| De 7 billeder ovenfor, hentet enkeltvis med `curl` | Alle HTTP 200. 6 af dem viser samme kompakte robot i producentens eget laboratorium — `p222.jpg` har ligefrem det fysiske neonskilt "DEEPRobotics 云深处科技" synligt i baggrunden, det stærkest mulige bevis for at billederne er taget i producentens eget lokale. `p8_.jpg` blev åbnet visuelt og viser tydelig teksten **"X30"** trykt på robottens krop — det er IKKE Lite3, og blev derfor kasseret, selvom det lå på Lite3's side (delt "udforsk mere"-widget, samme fælde som `pro1.png`, bare i en anden variant) |
| Google-søgning efter `deeprobotics.cn`-undersider | Bekræftede wap-siderne findes og er indekseret; gav iken yderligere kandidat-URL ud over dem, jeg allerede havde fundet |

**Valgt:** `lite_01.jpg` (800×600, hvidt CGI-render, side-vinkel) — DEEP Robotics' eget
"produktspecifikations"-billede for netop denne model. Valgt frem for de 5 miljøbilleder, fordi
et rent studiobillede matcher den konvention, projektet allerede bruger for andre DEEP
Robotics-modeller (Lynx, X30 fik begge "rene hvide studiofoto" ifølge `FUND-fotos-2.md`), og
fordi det undgår den blå lab-belysning, der farver de øvrige billeder.

---

## deep-robotics-x20 — FIK billede

**Samme præmiskontrol som for Lite3** (delt datasæt, se ovenfor). Bekræftet: den tidligere
afvisning var korrekt.

**Nye URL'er prøvet (3):**

| URL | Resultat |
|---|---|
| `https://www.deeprobotics.us/products/x20/` | Samme afvisning som for Lite3 — Warpify, Inc., tredjepartsforhandler, ikke brugt |
| `https://www.deeprobotics.cn/en/wap/product.html` | **HTTP 200.** X20's egen mobilside (samme sidetitel som desktop-siden: "X20: The Ultimate Quadruped Bot series for Industrial Use"). 7 nye billed-stier: `p11_.jpg, p22.jpg, p33.jpg, p44.jpg, p55.jpg, p66.jpg, p8_.jpg` (sidstnævnte delt med Lite3-siden, samme "X30"-billede, samme kassering) |
| De 6 øvrige billeder, hentet enkeltvis | Alle HTTP 200. `p22.jpg`, `p33.jpg` og `p44.jpg` viser robotten med "DEEPRobotics / 云深处科技"-logoet trykt direkte på chassiset — ikke et neonskilt i baggrunden denne gang, men et fysisk logo PÅ selve robotten. `p33.jpg` viser desuden en montør i sikkerhedshjelm ved siden af robotten foran en transformerstation — størrelsen matcher en stor industrirobot, ikke Lite3's kompakte format. Ingen af de 6 bærer teksten "X30" |

**Valgt:** `p66.jpg` (800×600, hvidt CGI-render, side-vinkel) — samme "hero"-mønster som `lite_01.jpg`
for Lite3: hvidt studiorender, tydeligvis den samme fysiske form (rund sensor-top, ikke den
kantede X30-hovedform fra `p8_.jpg`) som de 5 branded feltbilleder på samme side.

---

## xiaomi-cyberdog-1 — INTET billede (bevidst afslag)

**Ingen mappe fandtes i hovedrepoets `media/robotbilleder/`** — bekræftet med `ls` før noget
arbejde blev startet.

**URL'er/veje prøvet (7, alle nye ift. den tidligere agents forsøg på `mi.com/cyberdog`,
`/gallery`, `/specs` og købssiden, som IKKE blev gentaget):**

| Vej | Resultat |
|---|---|
| `https://www.mi.com/us/about/mediakit/` (Xiaomis officielle mediekit) | **HTTP 403 Forbidden** — ingen adgang overhovedet |
| Wayback CDX-opslag på `mi.com/cyberdog*` | Fandt et snapshot fra selve lanceringsdagen: `20210810192215`, 20.882 bytes |
| `web.archive.org/web/20210810192215/https://www.mi.com/cyberdog` | **HTTP 200**, men samme arkitektur som i dag: siden præloader `s02.mifile.cn/assets/js/product/cyberdog/index.001869a4.js` — en Vue-app. De ~217 `<img>`-tags på siden er alle butiksnavigationens miniaturer for ANDRE Xiaomi-produkter (telefoner, TV'er), ikke CyberDog. **Selv på lanceringsdagen i 2021 var siden en ren JS-SPA** — det er ikke noget, der er sket senere |
| Samme snapshots JS-bundle (`index.001869a4.js`), hentet direkte | Indeholder kun API-basiskonfiguration (`/api/get_content`, url'er for prod/staging/test-miljøer) — ingen hardkodede billed-URL'er. Den rigtige produktside-data hentes af browseren fra en API ved kørsel, som jeg ikke kan udføre uden en JS-motor |
| `specs.5406502c.js` (den bundle, den forrige agent brugte til specifikationstekst) hentet direkte og gennemsøgt for billed-endelser | Kun to billeder: en WeChat-ikon og en generisk pladsholder — ingen CyberDog-fotos |
| `https://blog.mi.com/en/?s=cyberdog` | Omdirigerer til en generisk "Discover \| Xiaomi Global"-forside — ingen søgeresultater, samme JS-renderingsproblem |
| WebSearch efter Xiaomis egen presse-/mediemappe for CyberDog 1 | Ingen officiel `mi.com`- eller `blog.mi.com`-URL fundet — kun tredjepartspresse (TechCrunch, The Robot Report, Android Authority m.fl.), som er udtrykkeligt forbudt af regel 3 |

**Konklusion:** mi.com var allerede en ren klient-renderet Vue-applikation ved lanceringen i
2021, ikke kun i dag. Uden en JS-udførende browser kan sidens billedgalleri ikke nås statisk —
hverken live, arkiveret eller via dens egne JS-bundler. Intet nyt fund ændrer den tidligere
agents konklusion, men afvisningen er nu efterprøvet fra fire yderligere, uafhængige veje.

**Det efterladte, uverificerbare `xiaomi-cyberdog-1.jpg`-orphanbillede, som den tidligere agent
slettede (se `FUND-fotos-2.md`), fandtes ikke i denne worktree — der var intet at tage stilling
til på ny.**

---

## Dubletkontrol (obligatorisk, punkt c)

Alle 43 eksisterende filer i `assets/fotos/fabrikant/` blev hashet, og de to nye filers sha256
blev sammenlignet mod hele listen:

```
comm -12 <nye-hashes> <eksisterende-43-hashes>   →   TOM (ingen overlap)
```

De to nye filers hashes matcher desuden ikke hinanden, og ingen af dem matcher de kendte
"smoking gun"-hashes fra opgavebeskrivelsen (`4eb65513a6…`, den delte "andre
produkter"-miniature) eller de øvrige fire arkivhashes, jeg selv genberegnede fra hovedrepoets
Lite3/X20-mapper:

| Fil | sha256 (fuld) |
|---|---|
| `deep-robotics-lite3.jpg` | `d1ae82df1465b51bde215288a4ff90e7b229b22d12eacb02afd24050ad48af7e` |
| `deep-robotics-x20.jpg` | `6a1ed590d4111395316c1a7968cd7947692108a673169df58c947709d17dc264` |

---

## Selv-tjek (obligatorisk, med tælling)

Efterprøvede begge `billede:`-blokke felt for felt mod mønsterfilerne `unitree-go2.yaml` og
`unitree-laikago.yaml` (felterne `fil`, `ophav`, `kilde`, `hentet`, `alt`, `note` — 6 felter pr.
robot, 12 i alt):

- **`fil`** (2/2): begge stier bekræftet at pege på filer, der faktisk findes, med `ls` OG med
  `tools/validate.mjs`/`build.mjs`s egen mekaniske tælling (45 = 43+2).
- **`ophav`** (2/2): `fabrikant` er korrekt — begge billeder kommer fra `deeprobotics.cn`, intet
  eget foto eller silhuet.
- **`kilde`** (2/2): begge URL'er genbekræftet **live, lige før commit** med `curl -I` →
  `HTTP/1.1 200 OK` på både sideurl og selve billedfilens URL.
- **`hentet`** (2/2): `2026-08-24` — matcher filernes egen mtime, målt med node
  (`lite_01.jpg`: 11:49:28 UTC, `p66.jpg`: 11:50:37 UTC), ikke gættet.
- **`alt`** (2/2): "hvidt studiofoto/render fra siden af" — kontrolleret ved selv at se begge
  billeder igen: begge viser robotten fra en 3/4-sidevinkel på hvid baggrund. Korrekt.
- **`note`** (2/2): begge noters faktapåstande (sha256-match til `4eb65513a6…`, "X30"-teksten på
  `p8_.jpg`, det synlige neonskilt) er alle noget, jeg selv har set/målt i denne session, ikke
  gengivet fra hukommelse.

**Efterprøvet 12 felter, fandt 0 fejl.**

Ud over billedblokkene: `node tools/validate.mjs` kørt efter ændringerne gav 0 fejl (kun den ene
foreksisterende R9-advarsel på en helt anden robot, urørt af mig).

---

## Filer til flet (absolutte stier)

**VIGTIGT FUND, afviger fra opgavebeskrivelsen:** Opgaveteksten sagde, at både
`assets/fotos/fabrikant/` og `media/robotbilleder/` er gitignorerede. Jeg kørte selv
`git check-ignore -v` på alle tre nye stier og fandt, at **kun `assets/fotos/fabrikant/**` rent
faktisk matcher en regel i `.gitignore`** (linje 28). `media/robotbilleder/` er IKKE nævnt noget
sted i `.gitignore` — hverken direkte eller via et mønster som `media/_kilder/**` eller
`media/_arbejde/**`, som er de mønstre, der faktisk findes. `git status --short` viste da også
`media/robotbilleder/` som almindeligt `??` untracked, ikke ignoreret. Jeg har alligevel bevidst
**ikke** git-added den mappe, fordi den efter sit indhold (rå fabrikantmateriale før beskæring)
hører til i samme kategori som `media/_kilder/` og `media/_arbejde/`, og fordi den forrige agent
(`FUND-fotos-2.md`) traf samme valg. **Dette er en huludfyldning i `.gitignore`, som en anden
agent eller JPK bør rette**, ikke noget jeg selv har rettet, fordi `.gitignore` ikke stod på min
liste over filer, jeg ejer i denne opgave.

**`assets/fotos/fabrikant/` (2 nye filer, det billede siden reelt bruger):**
```
C:\Praktik\websites\udstilling-wt-foto3\assets\fotos\fabrikant\deep-robotics-lite3.jpg
C:\Praktik\websites\udstilling-wt-foto3\assets\fotos\fabrikant\deep-robotics-x20.jpg
```

**`media/robotbilleder/` (ny mappe i denne worktree — fandtes slet ikke før):**
```
C:\Praktik\websites\udstilling-wt-foto3\media\robotbilleder\MANIFEST.tsv
C:\Praktik\websites\udstilling-wt-foto3\media\robotbilleder\deep-robotics-lite3\deep-robotics-lite3-1.jpg
C:\Praktik\websites\udstilling-wt-foto3\media\robotbilleder\deep-robotics-x20\deep-robotics-x20-1.jpg
```

**Ikke en del af leverancen — disponibelt scratch-materiale, kan slettes uden tab:**
```
C:\Praktik\websites\udstilling-wt-foto3\.tmp-fotos\fetch\   (alle 13 kandidatbilleder + JS-bundler + HTML-snapshots brugt til vurdering)
C:\Praktik\websites\udstilling-wt-foto3\.tmp-fotos\view\    (tom, blev ikke brugt)
C:\Praktik\websites\udstilling-wt-foto3\.tmp-fotos\existing-hashes.txt / existing-hashes-only.txt
C:\Praktik\websites\udstilling-wt-foto3\.tmp-fotos\commit-msg-1.txt
```

**Committet (kun de to YAML-filer jeg ejer):**
```
data/robots/deep-robotics-lite3.yaml
data/robots/deep-robotics-x20.yaml
```
Commit `3ddae7e` på `spor/foto3`.

---

## Selv-review — hvad jeg er usikker på

**Det vigtigste spørgsmål: er der et billede, jeg har valgt, hvor jeg ikke er helt sikker på, at
det viser den rigtige model?**

Ærligt svar: **nej, ikke i samme grad som CyberDog 1-orphanbilledet i forrige runde**, men med to
forbehold, jeg vil sige højt:

1. **X20 vs. X30-forveksling var den reelle risiko i denne opgave, og jeg tror, jeg har undgået
   den — men ikke med 100 % sikkerhed.** DEEP Robotics' X20 og X30 er søsterprodukter med samme
   overordnede silhuet (stor industrirobot med rotérbar sensor-mast). Det ENESTE direkte
   modelbevis, jeg har for `p66.jpg` (X20's valgte billede), er at det ligger på siden med titlen
   "X20", at det billedmæssigt er internt konsistent med 4 branded feltbilleder på samme side
   (ingen af dem bærer teksten "X30"), og at det AFVIGER fra `p8_.jpg`s tydelige "X30"-form på
   samme side. Det er en stærk, men indirekte kæde af beviser — jeg har ikke fundet en eneste
   pixel med bogstaverne "X20" trykt på selve `p66.jpg`s robot. Hvis DEEP Robotics har blandet
   billeder på tværs af X-serien på samme måde, som de blandede Lite3/X20/X30/Lynx i den delte
   miniature, kunne jeg tage fejl. Jeg vurderer risikoen som lav (fordi de fire feltbilleder på
   samme side ER tydeligt logo-mærkede uden "X30"), men den er ikke nul.
2. **Lite3-billedet (`lite_01.jpg`) har stærkere bevis** — filnavnet indeholder selve ordet
   "lite", og det ligger sammen med fem andre billeder, hvoraf ét (`p222.jpg`) viser producentens
   fysiske neonskilt i baggrunden. Jeg er mere sikker på denne end på X20's.

**Andre usikkerheder:**

- Jeg har ikke fundet nogen tredje, uafhængig kilde til at bekræfte "X20" udover selve
  sidestrukturen (URL, titel, sammenhæng med de branded feltbilleder). Et absolut bevis ville
  kræve et billede med "X20" trykt direkte på robotten, som jeg ikke fandt.
- `hentet_utc` i `MANIFEST.tsv` er sat til filernes egen mtime (målt med node), ikke et separat
  `date -u`-kald umiddelbart efter hver hentning — de to burde være få minutter fra hinanden i
  praksis, men jeg har ikke en uafhængig log, der beviser det for netop disse to filer.
- Jeg har ikke prøvet en headless browser / JS-udførelse for CyberDog 1 — værktøjssættet i denne
  opgave (curl, WebFetch, WebSearch) udfører ikke JavaScript. Det er den samme begrænsning, den
  forrige agent rapporterede, og jeg har ikke fundet en vej udenom den, kun bekræftet den fra
  flere selvstændige retninger (arkivsnapshot, JS-bundler, mediekit, blog-søgning).
- Jeg har ikke undersøgt, om DEEP Robotics har en fransk/tysk/anden landespecifik underside med
  endnu et sæt billeder — kun EN og CN samt US-forhandlerens (afviste) side.

## Hvad jeg ikke nåede

- Ingen forsøg med en JS-udførende metode til CyberDog 1 (se ovenfor — uden for værktøjssættet).
- Har ikke forsøgt at kontakte Xiaomi via `global-pr@xiaomi.com` (fundet i søgeresultaterne) —
  det er uden for denne opgaves scope (dataindsamling, ikke kontaktetablering).
- Har ikke undersøgt, om der findes flere, endnu upublicerede undersider på deeprobotics.cn's
  kinesiske (ikke-engelske) mobilvisning — kun de engelske wap-sider blev afsøgt, fordi de
  allerede gav et brugbart, entydigt fund for begge robotter.
