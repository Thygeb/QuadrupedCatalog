# FUND — spor/extract: L76, L78, L79 og L80 bygget ind i systemet

Gren `spor/extract`, 5 commits, forgrenet fra `36e1755`. Ikke flettet.

## Grundmåling (genkørt af mig, før noget blev ændret)

Alle fire reproducerede briefets tal nøjagtigt, og alle ni acceptkriterier
stod på deres "i dag"-værdi.

```
validate   77 fil(er) · 0 fejl · 1 advarsler
build      216 sider · 1111 tal med kilde, 0 uden
tests      1534 bestaaet, 0 fejlet · Validator: 71 fangede 71
linktjek   0 doede interne · 50 producentsider · 0 unaaede
```

## Efter (samme fire kommandoer)

```
validate   77 fil(er) · 0 fejl · 1 advarsler      uændret
build      216 sider · 1111 tal med kilde, 0 uden uændret
tests      1557 bestaaet, 0 fejlet                +23 nye assertions
linktjek   0 doede interne · 50 · 0 unaaede       uændret
```

## Punkt for punkt

| # | Valgt | Fravalgt | Konfidens |
|---|---|---|---|
| 1 · L76 | Links → `--blaek`, accent flytter til hover som **understregningens** farve | At give accent til hover som *tekst*farve: det ville give 1,38 mod hvilens 12,72 — modsat hensigten | **Høj** |
| 2 · L78 | 4:3 + `contain` i grundreglen; fire overflødige undtagelser slettet | At tage måltro-pladen med: målt 20,0 % forvrængning | **Høj** |
| 3 · L79 | `--hjoerne:2px`, 57 brugssteder samlet, 3 selvophævende regler slettet | `--stans` som navn (optaget af en **farve**) | **Høj** |
| 4 · L80 | `--sans` væk, 3 brug → `--mono`; `h1`–`h4` **arver** | At sætte `h1`–`h4` eksplicit — se nedenfor | **Høj** |
| 5 · DESIGN.md | Frontmatter + komponenter + 4 konflikter markeret AFGJORT + **11 prosasteder** | At nøjes med briefets fire punkter | **Høj** |
| 6 · Test | `61-extract.mjs`, 23 assertions, 8 ødelagte tilfælde | — | **Høj** |

Genkørbare kommandoer for alle otte acceptkriterier står i commit-beskederne.
**Kontrafaktisk:** var arbejdet forkert, ville de otte greps stå på deres
grundtal (1/6/2/2/26/3/0/4/3) i stedet for 0, og `61.0` ville rapportere
færre end 8 af 8 fangede ødelagte tilfælde.

**L76 i tal:** 15 regler med accent som forgrund gennemgået enkeltvis —
**12 flyttet, 3 beholdt** (`.klaebebar__gaa`, `.valg__fjern:hover`,
`.taeller__tal`, alle på `--fod`/`--blaek` = 9,19 : 1, hver med en kommentar
i koden om hvorfor). Efterprøvet i browseren på en bygget robotside: 29
links, **0** med accent som tekst, **0** under 4,5 : 1.

**h1–h4 arver, bevidst.** Fejlen, L80 rettede, lå i `body`s værdi; en
eksplicit erklæring på overskrifterne ville have arvet eller gentaget det
samme fantomtoken og været lige så forkert. Duplikatet køber ingen
sikkerhed, og det er den slags gentagelse, sporet findes for at fjerne.

## Fem afvigelser fra briefets påstande

1. **Hvid-på-accent findes SYV steder, ikke seks.** Det syvende,
   `.videre:hover`, kan ikke ses med en linjebaseret søgning: farven står i
   `.videre`, baggrunden i `.videre:hover`. Rettet (kun farven — knappens
   form er L77's).
2. **L78 ordret ville forvrænge måltro-pladen 20,0 %.** Pladen er intet
   foto (intet `<img>`); dens kasse regnes i procent af et 16:10-felt i
   `tools/skabelon/side.mjs:1728`. Målt på pladens egen kasse: sandt forhold
   1,928, tegnet 1,606 ved 4:3. Løst som tokenet `--plade-forhold` **plus**
   en test, der læser begge sider og fejler, hvis de skrider. 14 plader i
   bygget, 6 med en målt kasse.
3. **"saira 10 filer (5 vægte × 2 subsets)"** — målt: **8** Saira-filer
   (4 vægte) + 2 Literata = 10 i alt. DESIGN.md's egen tekst og
   `39-rod.mjs` 39.17 sagde uafhængigt det samme.
4. **"--mono 62 brug"** — 59 i kode + 3 i kommentarer. Efter mine 3 nye: 62
   i kode.
5. **`--rund` 10 / `--rund-ind` 12 / `--rund-lille` 9 = 31** holdt præcist.

## Usikkerheder

- **`.v-tekst` mister en synlig forskel.** Dens skel til et tal var indtil i
  dag *også* en skriftforskel — men kun ved et uheld, fordi `--sans` faldt
  til Segoe UI. Skellet bæres nu af vægt og `display:inline`. Korrekt efter
  L80, men det er en reel visuel ændring, ingen udtrykkeligt har set på.
- **Hover-zoomen beskærer nu 2,4 %.** `.kort:hover .billedled img{scale(1.024)}`
  var harmløs under `cover`; under `contain` klipper den. Jeg har **ikke**
  rørt den: at fjerne sidens ene sanktionerede bevægelse er en
  designbeslutning ud over L78's fire regler. Bør afgøres.
- **Producentindekset er blevet tungt.** Med læsbare links står ~250 model-
  navne nu som mørke, understregede ord. Understregningen er *ikke* ny (den
  var der, bare gul og usynlig), men densiteten er nu synlig. Et
  `impeccable layout`-spørgsmål, ikke en fejl.
- **Jeg har ikke set alle 216 sider.** Fire flader set med øjne: katalog,
  robotside, producentindeks, plus computed style-måling.

## Nye fælder og opdagelser

- **Et grep i CSS tæller kommentarer med, og det ramte mig tre gange.**
  `object-fit:cover` stod 1 gang i min egen kommentar og holdt kriteriet på
  1; `Manrope` det samme; `var(--hjoerne)` gav 55 i stedet for 54. Hver gang
  så tallet plausibelt ud. Løst ved at måle på CSS **uden** kommentarer og
  ved at skrive de døde værdier som prosa.
- **`tests/dele/31-pudsning.mjs` har samme blindhed, og den er stadig der.**
  Dens radius-vagt strimler ikke kommentarer, så teksten `border-radius:0`
  inde i en kommentar blev læst som en erklæring og slæbte 35 prosaord med
  som "radius uden for skalaen". Filen er uden for mit ejerskab; jeg
  omskrev min kommentar og noterede blindheden begge steder.
- **`--stans` var optaget af en FARVE.** Briefet advarede, og advarslen var
  rigtig. Valgt: `--hjoerne`.
- **To flerlinjes strengerstatninger matchede TAVST ikke** (exit 0,
  "0 erstattet") i DESIGN.md. Fanget kun fordi jeg talte pr. erstatning.
  Samme klasse fejl som `sed -i`, der ikke rammer.
- **`git commit -F /c/Users/...` fejler**; git vil have `C:/Users/...`.
  Samme MSYS-fælde ramte `node` på en scratchpad-sti.
- **Min egen nye vagt havde en fejl af præcis den type, den skulle fange:**
  61.20 gættede filnavnet ud fra familienavnet (`SairaSemiCondensed` →
  `sairas…`) og gav et falsk fund, fordi filerne hedder `saira-400-…`.
  Rettet til at åbne `src:url()` og spørge disken.
- **`tests/.tmp-koersel` var vokset til 2,6 GB.** Jeg forsøgte at rydde den
  (CLAUDE.md's diskregel), men `rm -rf` blev afvist af permissions. Den
  ligger der stadig; den er gitignoreret og genskabes.

## Punkter i briefet, jeg ikke nåede

- Ingen. Alle seks punkter er gennemført.
- Ud over briefet: 11 prosasteder i DESIGN.md, som briefet ikke listede,
  men som var lige så forkerte som de fire, det gjorde.

## Efterprøvning og oprydning

- **Målerapparater valideret mod kendte svar, før deres tal blev brugt:**
  kontrastmåleren (sort/hvid = 21,00; alle seks af briefets tal
  reproduceret), link-scanneren i browseren (accent tvunget tilbage → 29
  accent-links og 15 under 4,5 : 1, altså et ægte nul bagefter), og
  `61.0`/`61.0b` i den nye testfil.
- **Serveren kørte på port 8144** (aldrig 8080), blev verificeret
  byte-identisk med disken før hvert måletal, og **er lukket** — `curl` mod
  8144 svarer nu `000`, ikke `200`.
- **Én assertion vendt, ingen slettet:** `34.20` krævede den ordrette værdi
  `border-radius:2px`; den beviser nu, at `.stans` peger på systemets token
  **og** at tokenet er 2px. Kravet er skærpet, ikke sænket.
- `59-farvetokens` er grøn: paletten er urørt.
- Skærmbilleder i `fund/skud-extract/` (før/mellem/efter).
- `tools/skabelon/*.mjs`, `tools/build.mjs` og `data/robots/**` er **ikke**
  rørt. `side.mjs` er læst, aldrig skrevet.

## Skills

**Læst fra disk, ikke kaldt:** `impeccable`s SKILL.md
(`C:/Users/thyge/.claude/skills/impeccable/SKILL.md`) — sporet er et
designspor, og L70 gør dens flows til metoden. Fladernes MODE er brugt som
ramme: robotsiden er **Read** (L76 og L78 tjener begge læsbarheden af
maskinen og tallene), producentindekset og kataloget er **Operate**.

**Fravalgt:** `impeccable new-work` og `shape` — der skulle ikke findes en
ny retning; fire beslutninger var allerede truffet, og opgaven var at bygge
dem ind. `impeccable critique`/`ui-ux-critique` — de dømmer en flade, og
her var facit givet på forhånd som otte kørte kriterier; jeg brugte i
stedet browsermåling til at efterprøve, at reglerne nåede de rendrede
sider. `grillmig` — den er ude af det obligatoriske workflow (JPK 28. aug)
og må ikke køres på en designretning. `naturligt-dansk` nævnes ikke som
mulighed, jf. JPK's forbud 1. sep.

**Brugt:** `fejljagt`s metode ved begge røde tests — måleapparatet før
tallet. Det var rigtigt begge gange: 31.13 var en apparatfejl (kommentarer
talt som kode), 34.20 en ægte assertion, der skulle vendes.
