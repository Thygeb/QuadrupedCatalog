# FUND — spor/extract: L76, L78, L79 og L80 bygget ind i systemet

Gren `spor/extract`, 6 commits fra `36e1755`. Ikke flettet. Den fulde
udredning står i commit-beskederne ved siden af hver diff.

```
             grundmaaling (genkoert af mig)   efter
validate     77 fil · 0 fejl · 1 advarsel     uaendret
build        216 sider · 1111 tal m. kilde    uaendret
tests        1534 bestaaet, 0 fejlet          1557 bestaaet, 0 fejlet
linktjek     0 doede · 50 prod. · 0 unaaede   uaendret
```

Alle fire reproducerede briefets tal nøjagtigt, og alle ni acceptkriterier
stod på deres "i dag"-værdi, før noget blev ændret; de otte står nu på 0/1.
**Kontrafaktisk:** var arbejdet forkert, stod de otte greps på grundtallene
(1/6/2/2/26/3/0/4/3), og `61.0` ville melde under 8 af 8 fangede tilfælde.

## Valgt / fravalgt / konfidens

| # | Valgt | Fravalgt | Konf. |
|---|---|---|---|
| L76 | Links `--blaek`; accent til hover som **understregningens** farve | Accent som hover-*tekst*: 1,38 mod hvilens 12,72 | Høj |
| L78 | 4:3 + `contain` i grundreglen; 4 undtagelser slettet | At tage måltro-pladen med — målt 20,0 % forvrængning | Høj |
| L79 | `--hjoerne:2px`; 57 brugssteder samlet; 3 regler slettet | `--stans` som navn (optaget af en **farve**) | Høj |
| L80 | `--sans` væk, 3 brug → `--mono`; `h1`–`h4` **arver** | Eksplicit familie på overskrifter: fejlen lå i `body`s værdi, så et duplikat køber ingen sikkerhed | Høj |
| DESIGN.md | Frontmatter, komponenter, 4 konflikter AFGJORT — **+ 11 prosasteder** | At nøjes med briefets fire punkter | Høj |
| Test | `61-extract.mjs`: 23 assertions, 8 ødelagte tilfælde | — | Høj |

**L76 i tal:** 15 regler gennemgået enkeltvis — **12 flyttet, 3 beholdt** (alle på `--fod`/`--blaek` = 9,19 : 1, hver begrundet i koden). Målt i browseren: 29 links, **0** med accent som tekst, **0** under 4,5 : 1.

## Afvigelser fra briefets påstande

1. **Hvid-på-accent findes SYV steder, ikke seks.** Det syvende, `.videre:hover`, er usynligt for en linjebaseret søgning: farven står i `.videre`, baggrunden i `.videre:hover`. Kun farven rettet — formen er L77's.
2. **L78 ordret ville forvrænge måltro-pladen 20,0 %** (sandt 1,928, tegnet 1,606). Pladen er intet foto; kassen regnes i procent af et 16:10-felt i `side.mjs:1728`. Løst som `--plade-forhold` + en test, der læser begge sider.
3. **"saira 10 filer (5 vægte)"** → målt **8** (4 vægte) + 2 Literata = 10 i alt. **"--mono 62 brug"** → 59 i kode + 3 i kommentarer. Radius (31) holdt.

## Usikkerheder

- **Hover-zoomen beskærer nu 2,4 %.** `scale(1.024)` var harmløs under `cover`, klipper under `contain`. **Ikke rørt:** at fjerne sidens ene sanktionerede bevægelse ligger ud over L78's fire regler. Bør afgøres.
- **Producentindekset er blevet tungt** — ~250 mørke, understregede modelnavne. Understregningen er ikke ny (den var gul og usynlig), men densiteten er nu synlig. Et `impeccable layout`-spørgsmål.
- **`.v-tekst` mister en synlig forskel** — skellet til et tal var også en skriftforskel, men kun ved et uheld, fordi `--sans` faldt til Segoe UI.
- **Fire flader set med øjne**, ikke alle 216 sider.

## Efterprøvning, oprydning og skills

- **Måleapparater valideret mod kendte svar før brug:** kontrastmåleren (sort/hvid = 21,00), browserens link-scanner (accent tvunget tilbage → 29 og 15, altså et ægte nul bagefter), og `61.0`/`61.0b`.
- **Serveren kørte på 8144**, verificeret byte-identisk med disken før hvert måletal, og **er lukket** — `curl` svarer nu `000`.
- **Én assertion vendt, ingen slettet:** `34.20` krævede ordret `border-radius:2px`; beviser nu både at `.stans` bruger tokenet, og at det er 2px. `59-farvetokens` grøn: palet urørt. `tools/skabelon/*.mjs`, `build.mjs` og `data/robots/**` er ikke rørt; `side.mjs` kun læst.
- **Skills:** `impeccable`s SKILL.md **læst fra disk, ikke kaldt**; MODE brugt som ramme (robotside **Read**, katalog **Operate**). Fravalgt `new-work`/`shape` (retningen var truffet) og `critique`-skillene (facit var otte kørte kriterier). Brugt: `fejljagt` ved begge røde tests.

## Nye fælder og opdagelser

- **Et grep i CSS tæller kommentarer med, og det ramte mig tre gange.**
  `object-fit:cover`, `Manrope` og `var(--hjoerne)` stod alle i mine egne
  kommentarer og gav plausible, forkerte tal (1, 2, 55 mod 0, 0, 54). Løst
  ved at måle på CSS **uden** kommentarer og skrive døde værdier som prosa.
- **`tests/dele/31-pudsning.mjs` har samme blindhed, og den er der stadig.**
  Dens radius-vagt strimler ikke kommentarer, så `border-radius:0` i en
  kommentar blev læst som en erklæring og slæbte 35 prosaord med som "radius
  uden for skalaen". Uden for mit ejerskab; noteret begge steder.
- **`--stans` var optaget af en FARVE.** Briefets advarsel var rigtig.
- **CLAUDE.md's backtick-fælde ramte mig, præcis som beskrevet.** Jeg skrev
  denne rapports krop gennem en `node -e`-streng i bash; skallen udførte
  backtickene og strøg **hver eneste** kodemarkering plus hele kodeblokken.
  Reglen findes, fordi det skete 25. aug — og den gælder også, når teksten
  er ens egen rapport. Genskrevet med Write.
- **To flerlinjes strengerstatninger matchede TAVST ikke** (exit 0,
  "0 erstattet") i DESIGN.md. Fanget kun fordi jeg talte pr. erstatning —
  samme klasse fejl som `sed -i`, der ikke rammer.
- **`git commit -F /c/Users/...` fejler**; git vil have `C:/Users/...`.
  Samme MSYS-fælde ramte `node` på en scratchpad-sti.
- **Min egen nye vagt havde en fejl af præcis den type, den skal fange:**
  61.20 gættede filnavnet ud fra familienavnet (`SairaSemiCondensed` →
  `sairas…`), men filerne hedder `saira-400-…`. Rettet til at åbne
  `src:url()` og spørge disken.
- **`tests/.tmp-koersel` var vokset til 2,6 GB.** Forsøgt ryddet
  (CLAUDE.md's diskregel); `rm -rf` blev afvist af permissions. Ligger der
  stadig — gitignoreret og genskabes.

## Punkter i briefet, jeg ikke nåede

- Ingen. Alle seks punkter er gennemført.
- Ud over briefet: 11 prosasteder i DESIGN.md, som briefet ikke listede,
  men som var lige så forkerte som de fire, det gjorde.
