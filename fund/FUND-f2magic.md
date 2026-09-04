# FUND — `spor/f2magic`: kildeordlyd til MagicLabs 53 forbehold

## Ændringen: A/B/C pr. robot (skærmen bagefter: `caveat_wording` på 53 rækker)

| Robot | Rækker | A (udfyldt) | B (dokumenteret tom) |
|---|---|---|---|
| magicdog-edu (2219) | 13 | **13** | 0 |
| magicdog-pro (2220) | 13 | **13** | 0 |
| magicdog-w (2221) | 13 | **12** | 1 (`stair_step_continuous`) |
| magicdog-y1 (2222) | 14 | **13** | 1 (`ros2`) |
| **I alt** | **53** | **51** | **2** (C=0) |

**Afvigelse fra briefet, meldt eksplicit:** briefet advarede mod et højt tal som mål.
Resultatet blev alligevel 51/53 (96 %) — men INGEN er strakt: MagicLabs specside er
velformede HTML-tabeller, og for 51/53 findes producentens etiket+værdi ordret i rækkens
EGEN `source`-fil, alle verificeret programmatisk, ingen gættet.

## B-listen — de to tomme, med søgningen

- **`magicdog-w.stair_step_continuous`:** forbeholdet peger IKKE på en selvstændig
  etikette — den eneste figur (60 cm) er citeret under `obstacle_single`. Ingen egen
  "kontinuerlig trappe"-etikette findes i `magiclab-magicdog-w-specside-{en,cn}-…html`.
  Redaktionel placeringsregel, ikke et citat.
- **`magicdog-y1.ros2`:** regex `\/y1\/[a-zA-Z0-9_-]+\/` mod
  `magiclab-magicdog-y1-udviklerguide-cn-…html` gav **25** unikke stier, **0** matcher
  `/ros2/i`. Ordet "ROS2" står ni gange i filen, men KUN i en global søgeindeks-JSON, der
  også dækker `/dog/`+`/dog_w/`. Y1s egen venstremenu (seks sektioner) har ingen ROS2.

## Cirkelsymboler og form

**Fyldt = U+25CF (●), åben = U+25CB (○)** — udtrukket med `String.fromCodePoint`, matcher
briefets gæt. `edu`/`pro`-forskellen holder: "SDK Support[2]" → `["○","●"]` for [PRO,EDU]
— EDU har adgangen, PRO ikke, den "counterintuitive" sammenhæng forbeholdet nævner. **51/51
A-rækker bruger etiket-plus-værdi-formen**, 0 ren værdi.

## Kildeverifikation

```
node db/f2magic-skriv.mjs --verificer
Kildeverifikation: 111 fragmenter tjekket, 0 fejl, 51 raekker.
```

## Acceptkriterier, målt

1. A+B+C=53: 51+2+0=53. ✓
2. Kildeverifikation: 111 fragmenter, 0 fejl, 51/51. ✓
3. Kun `caveat_wording` ændret — PATCH-body har KUN `caveat_wording`/`collected_by`/
   `change_reason`. Efter-tal: `2541, 1227994.46, 890, 773, 1226`. Ingen før-snapshot målt.
4. Herkomst: `collected_by='spor/f2magic'` → **51** = A. ✓
5. Kontrolgruppe andre producenter: **0**. ✓

## Konfidens

- Grundmåling, 51 A-rækker (111 fragmenter, 0 fejl), B-listens 0-træffere: alle **HØJ**
  — genkørbare kommandoer ovenfor. Et forkert fragment ville give `fejl>0` og stoppe ALT
  (skete faktisk under udvikling, se Nye fælder, rettet før skrivning); en
  `/y1/.../ros2.../`-sti ville flytte rækken til Kasse A.
- Kriterium 3: **MIDDEL** — kodegaranti (PATCH-body ekskluderer feltet), ikke en målt
  før/efter-diff.

## Nye fælder og opdagelser

- **Y1s dev-guide-fil siger "ROS2" NI gange uden at Y1 har en ROS2-sektion.** De ni
  forekomster ligger i en global søgeindeks-JSON, der er indlejret på ALLE support-sider
  og dækker `/dog/`+`/dog_w/`. Et naivt `indexOf('ROS2')` ville fejlagtigt give Kasse A —
  kun en sti-afgrænset søgning (`/y1/...`) viste den rigtige (tomme) konklusion. Endnu en
  variant af MagicLabs tre-domæne/delt-fil-fælde, denne gang inden for ÉT domæne.
- **HTML-rækker har 2 eller 3 celler, afhængigt af om rækken indleder en ny
  kategori-sektion** (kategori-`<span>` bliver en ekstra celle FORAN etiketten). Min
  første `udtraekLabelForVaerdi()`-version antog altid `celler[0]` og hev en
  kategori-overskrift ("电气参数") i stedet for den rigtige etikette ("本体算力") ind i
  `compute`-feltet. `--verificer` fangede den IKKE (kategoriteksten fandtes også ordret i
  filen — bare som forkert etikette) — kun manuel gennemlæsning af det udskrevne resultat
  gjorde. Rettet før nogen skrivning. Generel fælde for enhver fremtidig parsing af
  MagicLabs specside-tabeller.
- **`stair_step_continuous`s B-klassificering er en grænsevurdering**, ikke entydig — en
  anden agent kunne argumentere for at duplikere `obstacle_single`s citat her. Valgt B,
  fordi rækkens EGEN forbehold ikke selvstændigt navngiver en etikette.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fem acceptkriterier er målt (kriterium 3 med svagere bevis end efterspurgt,
se Konfidens).
