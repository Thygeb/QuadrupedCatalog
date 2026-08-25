# FUND — billed3 (genbesøg af de 8 poster billedporten tømte)

Målt 25. august 2026 i worktreen `udstilling-wt-billed3`, gren `spor/billed3`. Opfølgning
på `fund/FUND-billedport.md`, som 24. aug slettede 8 fabrikantbilleder (dårligt foto =
intet foto) og efterlod dem på måleplade-fallback, fordi denne sessions billedlæsekvote
løb tør midt i arkivsøgningen — arkivkandidaterne blev aldrig set. Denne runde søgte frisk
direkte på producenternes egne sider (worktreen indeholder kun `MANIFEST.tsv` med 245
linjer, ingen faktiske billedfiler fra forrige runde) og dømte hvert fund med øjne.

---

## Regel 0 — skill-vurdering

`robotdata` valgt, læst direkte fra disk i denne worktree
(`.claude/skills/robotdata/SKILL.md`), som opgaven selv bad om — ikke fordi et
`Unknown skill`-kald fejlede, men fordi briefet eksplicit krævede læsning fra
worktree'ens disk frem for det globale skill-opslag. Billedbaren i afsnittet
"Billedbaren" er brugt ordret som dommekriterium.

Gået forbi: `parallelt` (jeg er allerede det ene track, sat i gang af orkestratoren via
worktree'en `udstilling-wt-billed3` — at splitte 8 robotter ud på endnu et lag
underagenter ville overskride "du er allerede den dedikerede agent for denne opgave,
deleger ikke videre" fra min egen systeminstruks); `grillmig` (intet åbent brief eller
beslutning at grille — opgaven var allerede grillet af orkestratoren før udsendelse);
`impeccable`/`critique`/`ui-ux-critique` (ren dataoprydning i `billede:`-blokke, ingen ny
flade og ingen visuel kritik af den bygget side som helhed).

---

## Hvorfor alle 8 lykkedes denne gang

Forrige rundes blokering var ikke, at de otte robotter manglede gode billeder — det var,
at billedlæsekvoten løb tør, FØR arkivkandidaterne kunne ses. Denne gang blev der søgt
helt friskt på producenternes egne produktsider (Unitree, DEEP Robotics, MAB Robotics,
Yobotics) i stedet for at genbruge arkivstierne fra forrige runde, som slet ikke findes i
denne worktree. Det gav adgang til andre, ofte nyere billeder end dem forrige runde havde
liggende — deraf de 8 beståede.

**Vigtigt sidefund:** producentsiden `yobotics.cn`'s egen markup (swiper med
`tit-en: Y10` / `Y20` / `e-Dog`) afslørede, at DET GAMLE MANIFEST havde krydstildelt
billeder mellem Y10 og Y20 — `pro-1.png` (som siden selv mærker Y20) stod under slug
`yobotics-y10` med rang 1. Rettet ved at læse HTML-konteksten direkte i stedet for at
genbruge den gamle crawler-tildeling.

---

## Dom-tabellen — alle 23 hentede kandidater

| Slug | Fil | Dom | Begrundelse |
|---|---|---|---|
| unitree-go2 | unitree-go2-6.jpg | AFVIST | Hero-billede med indbrændt overskriftstekst ("Scientific and Technological Sovereignty to Unitree Go 2" + underoverskrift) — samme fejlklasse som "infografik/reklametekst", blot som headline i stedet for komponentkald |
| unitree-go2 | unitree-go2-7.jpg | AFVIST | Eksploderet infografik med 12 komponentkald-tekstbokse (Tracking module, 4D LiDAR osv.) |
| unitree-go2 | unitree-go2-8.jpg | **GODKENDT — valgt** | Hel robot på en klippe i vand, feltfoto/kunstnerisk lys, intet tekstoverlay. Anden fejl end den oprindelige (app-skærmbillede) — ingen gentagelse |
| unitree-go2-w | unitree-go2-w-6.png | **GODKENDT — valgt** | Enkelt hjulforsynet Go2-W i ørkenterræn, hjulene og sensorhovedet tydelige, "G02"-mærkning er produktbranding. Anden fejl end den oprindelige (formation af dusinvis af robotter med kostumehoveder) — ingen gentagelse |
| unitree-go2-w | unitree-go2-w-7.jpeg | AFVIST | GENTAGER den oprindelige fejl: dusinvis af robotter i formation på stadion, røde løve-dans-kostumehoveder skjuler sensorhovedet |
| unitree-go2-w | unitree-go2-w-8.jpg | AFVIST | Forkert robot — Unitree H1 (humanoid), ikke en firbenet, plus tung indbrændt kinesisk reklametekst til nytårsshow |
| unitree-go2-w | unitree-go2-w-9.jpg | AFVIST | Forkert robot — to H1-humanoider i kostume, plus tung indbrændt kinesisk reklametekst |
| unitree-go2-w | unitree-go2-w-10.jpg | AFVIST (usikker) | Blåt, tåget studiofoto af én robot — men billedet viser almindelige ben, ikke hjul, så det kan ikke bekræftes at være Go2-W-specifikt (formodentlig en generisk Unitree-billedbank-fil genbrugt på siden). Ikke valgt af forsigtighed |
| unitree-b2 | unitree-b2-6.png | GODKENDT, men ikke valgt | Dette er den fil, forrige rundes `fil:`-felt pegede på uden nogensinde at blive set (sha256 matcher). Nu set: hele robotten på en klippe med bjergpanorama — IKKE et diagram, som WebFetch-teksten antydede. Ville have bestået, men et mere utvetydigt alternativ blev valgt i stedet |
| unitree-b2 | unitree-b2-7.png | AFVIST | Infografik med 4 turkise komponentkald-tekstbokse (LiDAR, Depth Camera, Joint Modules, Battery) |
| unitree-b2 | unitree-b2-8.jpeg | AFVIST | Forkert motiv — scenefremvisning med dansere og robot-oksemaskotter, slet ikke B2 |
| unitree-b2 | unitree-b2-9.jpg | AFVIST | Person i centrum af billedet med udstrakte arme; robotten er lille og hængende højt i baggrunden — stuntagtig belastningstest, ikke en præsentation af maskinen |
| unitree-b2 | unitree-b2-10.jpg | AFVIST | Robot i unaturlig, næsten væltet positur på gulv med en menneskehånd der skubber en træstok ind i billedet, bananskræller spredt rundt — demofoto af en holdbarhedstest |
| unitree-b2 | unitree-b2-11.png | **GODKENDT — valgt** | Rent hvidt studiorender fra shop.unitree.com, hel maskine, samme stil som Xiaomi Cyberdog 2's godkendte billede |
| deep-robotics-mini | deep-robotics-mini-6.png | **GODKENDT — valgt** | Blåt/sort glansrender, hel maskine, hvid/transparent baggrund, intet tekstoverlay. Hentet direkte fra Mini's egen produktside (`pro2_main.png`, sidens eget hovedbillede for netop denne model) |
| deep-robotics-mini | deep-robotics-mini-7.png | AFVIST | GENTAGER den oprindelige fejlklasse: 3D-terrænrekonstruktion/pointcloud-visualisering med et lille indlejret foto — teknisk visualisering, ikke et foto af robotten |
| deep-robotics-mini | deep-robotics-mini-8.png | AFVIST | Forkert motiv — fire mennesker med positurgenkendelses-skeletoverlay, intet robotindhold overhovedet |
| mab-honey-badger-4 | mab-honey-badger-4-6.png | **GODKENDT — valgt** | Hel robot under en rusten jernbanebro, "MAB ROBOTICS" som påmalet produktnavn (ikke overlejret reklame), feltfoto |
| mab-honey-badger-5 | mab-honey-badger-5-6.jpg | GODKENDT, men ikke valgt | To identiske enheder side om side i en park — grænsetilfælde efter `rivr-one`-præcedens (samme model, ikke flere modeller). Det renere enkeltmaskine-alternativ blev valgt i stedet |
| mab-honey-badger-5 | mab-honey-badger-5-7.jpg | **GODKENDT — valgt** | Én robot på en betonkant i samme parkanlæg, "MAB ROBOTICS" påmalet, feltfoto — den utvetydige komposition |
| yobotics-y10 | yobotics-y10-6.png | **GODKENDT — valgt** | Rent hvidt studiorender, hel maskine, intet tekstoverlay. `pro-2.png`, som producentsidens egen markup mærker "Y10" |
| yobotics-y20 | yobotics-y20-6.png | **GODKENDT — valgt** | Rent hvidt studiorender med et påmonteret kamera-/sensorpayload — i tone med Y20's større nyttelast og industrielle profil. `pro-1.png`, som producentsidens egen markup mærker "Y20" |
| yobotics-y20 | yobotics-y20-7.png | AFVIST | Samme render, men med otte cirkulære ikonmærkater med kinesisk tekst placeret rundt om robotten — infografik, ikke et rent foto |

**N = 23 kandidater hentet og vurderet · K = 8 valgt (ét pr. robot, alle 8 bestod) ·
2 yderligere ville have bestået men blev fravalgt til fordel for et bedre alternativ ·
13 afvist.** 8 + 2 + 13 = 23.

---

## Anti-gentagelses-kontrol (den udtrykkelige regel i briefet)

Hver robot fik tjekket, at det nye billede IKKE gentager forrige rundes specifikke
afvisningsgrund:

| Slug | Forrige fejl | Nyt billede | Samme fejl igen? |
|---|---|---|---|
| unitree-go2 | App-skærmbillede (LiDAR-kort + kamerafeed) | Feltfoto på klippe | Nej |
| unitree-go2-w | Robotformation med kostumehoveder | Enkelt robot, hjul og sensor synlige | Nej |
| unitree-b2 | Aldrig set (databug — uverificeret) | Studiorender, nu faktisk set | N/A — ingen tidligere billeddom at gentage |
| deep-robotics-mini | LiDAR-punktskybillede (farvet højdekort) | Studiorender af selve maskinen | Nej — og den nærmeste konkurrent (mini-7) blev korrekt afvist for PRÆCIS at gentage denne fejl |
| mab-honey-badger-4 | Forskningsinstitut-logo (Instituto Cajal) | Feltfoto af robotten | Nej |
| mab-honey-badger-5 | Byte-identisk logo-fejl med HB4 | Feltfoto af robotten (anden fil end HB4's) | Nej |
| yobotics-y10 | Familiebanner, 6 modeller, indbrændt kinesisk tekst | Enkelt studiorender af Y10 alene | Nej |
| yobotics-y20 | Samme familiebanner som Y10 | Enkelt studiorender af Y20 alene | Nej |

---

## Nye gitignorerede filer i min worktree

`assets/fotos/fabrikant/` er gitignoreret (`assets/fotos/fabrikant/**` i `.gitignore`).
`media/robotbilleder/` er IKKE dækket af noget mønster i `.gitignore`, men mappen stod
allerede utracket ved sessionsstart (kun `MANIFEST.tsv` fandtes, uden git-historik på
denne gren) — behandlet på samme måde: leveret som filliste, ikke committet, i tråd med
forrige rundes praksis og briefets eksplicitte "orkestratoren kopierer ved flet".

**Nye arkivfiler i `media/robotbilleder/<slug>/` (23 filer, alle downloadet fra
producentsider 25. aug 2026):**

```
unitree-go2/unitree-go2-6.jpg
unitree-go2/unitree-go2-7.jpg
unitree-go2/unitree-go2-8.jpg
unitree-go2-w/unitree-go2-w-6.png
unitree-go2-w/unitree-go2-w-7.jpeg
unitree-go2-w/unitree-go2-w-8.jpg
unitree-go2-w/unitree-go2-w-9.jpg
unitree-go2-w/unitree-go2-w-10.jpg
unitree-b2/unitree-b2-6.png
unitree-b2/unitree-b2-7.png
unitree-b2/unitree-b2-8.jpeg
unitree-b2/unitree-b2-9.jpg
unitree-b2/unitree-b2-10.jpg
unitree-b2/unitree-b2-11.png
deep-robotics-mini/deep-robotics-mini-6.png
deep-robotics-mini/deep-robotics-mini-7.png
deep-robotics-mini/deep-robotics-mini-8.png
mab-honey-badger-4/mab-honey-badger-4-6.png
mab-honey-badger-5/mab-honey-badger-5-6.jpg
mab-honey-badger-5/mab-honey-badger-5-7.jpg
yobotics-y10/yobotics-y10-6.png
yobotics-y20/yobotics-y20-6.png
yobotics-y20/yobotics-y20-7.png
```

**Nye web-klare kopier i `assets/fotos/fabrikant/` (8 filer, én pr. bestået robot):**

```
unitree-go2.jpg              (fra unitree-go2-8.jpg, beskaaret 2400px lang kant)
unitree-go2-w.png            (fra unitree-go2-w-6.png, uaendret 1478x788)
unitree-b2.png                (fra unitree-b2-11.png, uaendret 900x800)
deep-robotics-mini.png        (fra deep-robotics-mini-6.png, uaendret 930x616)
mab-honey-badger-4.jpg        (fra mab-honey-badger-4-6.png, beskaaret 2400px + konverteret PNG->JPEG, se note)
mab-honey-badger-5.jpg        (fra mab-honey-badger-5-7.jpg, beskaaret 2400px lang kant)
yobotics-y10.png               (fra yobotics-y10-6.png, uaendret 560x462)
yobotics-y20.png               (fra yobotics-y20-6.png, uaendret 560x462)
```

**Afvigelse fra "samme filendelse som originalen":** `mab-honey-badger-4`'s originalfil
er en `.png`, men originalen var et ukomprimeret 24 MB kamerafoto uden gennemsigtighed.
Beskåret til 2400 px lang kant fyldte den stadig 6,75 MB i lossless PNG — langt over de
eksisterende 46 filers spænd (op til 4,2 MB, gennemsnit 544 KB). Gemt som JPEG kvalitet
88 i stedet: 1,13 MB, intet synligt kvalitetstab, inden for det etablerede spænd. Valgte
"web-klar" over "samme endelse" — begge dele stod i briefet, og de kunne ikke begge
opfyldes for netop denne fil.

**MANIFEST.tsv:** 245 → 268 linjer (+23, alle nederst, ingen eksisterende rækker rørt).
De 23 nye rækker er allerede tilføjet i denne worktree (`media/robotbilleder/MANIFEST.tsv`)
— orkestratoren skal blot tage den fulde fil eller de sidste 23 linjer med ved flet, da
selve filen ikke er git-tracket.

Intet i de 245 oprindelige MANIFEST-linjer er ændret.

---

## Efterprøvning

- `node tools/validate.mjs` → **62 filer · 0 fejl · 1 advarsel** (den kendte,
  urelaterede Ghost Vision 60-hastighedsadvarsel — uændret).
- `node tools/build.mjs` → **173 sider** (uændret) · **850 kildebelagte tal, 0 uden**
  (uændret) · **billeder kopieret fra assets/: 55** (op fra 47 ved sessionsstart, +8) ·
  **billedfelter: 54 fil(er) brugt af 54 robotter** (op fra 46, +8) · **S1 fyrer på 54**
  (op fra 46, +8). Alle tre billedtal steg med præcis 8 — som forventet, da alle 8
  bestod.
- `node tests/koer.mjs` → **195 bestået, 2 fejlet** — samme to kendte, uafklarede fejl
  som før (intervalkollaps-testen og kategori-rækkefølge-testen, begge dokumenteret i
  `fund/FUND-test.md`/`fund/FUND-detalje.md`), ingen regression.
- Læste den byggede HTML for alle 8 robotter (ikke kun de krævede to): hvert
  `<picture><img src=".../fotos/fabrikant/<slug>.<ext>" alt="<navn>" decoding="async">`
  er til stede, med `figcaption` "Producentens eget billede. Ikke krediteret, ingen
  tilladelse." (da) / "Manufacturer photo. Uncredited, no permission." (en) — S1-teksten
  vises korrekt for alle 8.

---

## Tælling

23 kandidater hentet og vurderet · 8 bestod og er sat ind · 2 yderligere ville have
bestået men blev fravalgt til fordel for et renere alternativ · 13 afvist med
individuel begrundelse (se dom-tabellen) · MANIFEST 245 → 268 linjer (+23) ·
`billede:`-blokke tilføjet: 8 af 8 mulige.

---

## Selv-tjek

Alle 8 nye `billede:`-blokke efterprøvet felt for felt mod formatankeret
(`unitree-aliengo.yaml`/`pudu-d5.yaml`): `fil:`, `ophav: fabrikant`, `kilde:` (peger på
den faktiske producentside/webshop, ikke en generisk forside), `hentet: 2026-08-25`.
Fandt og rettede 1 strukturel fejl undervejs: `billede:`-blokken blev først indsat MIDT
i `noter:`-listen i 4 filer (mab-honey-badger-4, mab-honey-badger-5, yobotics-y10,
yobotics-y20), hvilket ville have brudt YAML — opdaget ved et eftersyn af alle 8 filers
`noter:`/`billede:`/`felter:`-rækkefølge før commit, rettet ved at flytte `billede:` til
efter sidste `noter:`-punkt i alle 4. Bekræftet rettet med
`grep -n "^noter:\|^billede:\|^felter:"` på alle 8 filer (se tabellen i arbejdsloggen) og
efterfølgende grønt `validate.mjs`.

Kvadratisk center-crop renderet med PIL for alle 8 valgte billeder (ikke skønnet) —
diagnoseresultatet viste, at samtlige 8 overlever beskæringen med hele maskinen synlig.
Renderingerne er slettet efter brug, som krævet.

Efterprøvet 23 kandidatfelter (kilde-URL, faktisk hentet fil, pixelmål, sha256), fandt 0
fejl i selve hentningen — men fandt undervejs 1 datafejl i det GAMLE manifest (Y10/Y20's
billeder krydstildelt, se afsnittet ovenfor) og genbekræftede, at det tidligere
"uverificerede" B2-billede (unitree-b2-6.png) rent faktisk var et godkendelsesværdigt
foto, ikke et diagram — begge dele rettet i denne runde, ingen af dem var min egen fejl.

## Selv-review

**Domme tættest på grænsen:**

- **unitree-go2-w-10.jpg** (afvist af forsigtighed, ikke af en konkret fejl): billedet
  viser en flot, moody enkeltrobot-optagelse, men jeg kunne ikke bekræfte hjul i
  billedet, og Go2-W's definerende træk ER hjulene. Uden den bekræftelse turde jeg ikke
  vælge den, selv om `unitree-go2-w-6.png` (valgt) i forvejen dækkede robotten fint. En
  mere velvillig læser kunne godt have accepteret den som "sandsynligvis Go2-W" ud fra
  sidekonteksten alene.
- **mab-honey-badger-5-6.jpg** (to enheder i en park): dømt "ville bestå" under
  `rivr-one`-præcedensen, men jeg valgte det enklere enkeltmaskine-billede i stedet for
  at undgå enhver diskussion om, hvorvidt "to enheder" nogensinde kan sammenblandes med
  "flere modeller" — det er en forsigtighedsvalg, ikke en nødvendighed.
- **unitree-b2-6.png**: dette er billedet, forrige runde aldrig fik set (databuggen).
  Nu bekræftet GODKENDT ved faktisk syn — modsiger den forsigtige antagelse, en
  WebFetch-tekstbeskrivelse gav undervejs i researchen ("technical spec image showing
  dimensions"), som viste sig forkert, da billedet faktisk blev åbnet. God påmindelse om,
  hvorfor billeder skal SES, ikke kun beskrives.
- **mab-honey-badger-4.jpg's filendelse**: ændrede fra producentens `.png` til `.jpg` for
  at holde web-kopien inden for et fornuftigt størrelsesspænd. Det er en afvigelse fra
  ordlyden "originalens filendelse" i briefet — begrundet og synligt noteret, ikke
  glattet ud.

**Det jeg ikke nåede:** har ikke forsøgt at kontakte MAB Robotics eller Yobotics for at
bekræfte Honey Badger 5's model-mærkning ("M?" på robottens sideplade er ikke fuldt
læsbar i mine billeder) eller Y10/Y20-navnesplittelsen (allerede et "ÅBENT PUNKT" i
begge YAML-filer fra tidligere runder — uændret af dette arbejde). Har heller ikke
undersøgt, om der findes ENDNU bedre billeder end de fundne på de fire producenters
sider — søgningen stoppede ved første bestående kandidat pr. robot plus et par
sammenligningspunkter, ikke en udtømmende gennemgang af hver sides fulde billedarkiv.
