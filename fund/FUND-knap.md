# FUND — spor/knap: L77, én knapprimitiv

**Valgt løsning:** `.knap` er en **farveløs grundform** (`color:inherit`,
`background:transparent`) i TYPESKILT, og fladen vælges eksplicit ved navn i en af
seks varianter — tre vægte gange to flader, hvor de mørke bærer `-moerk` i navnet.
**Fravalgt:** en primitiv med en indbygget standardflade (fx `.nulstil`s toner som
grundform) — det er præcis konstruktionen, der gav `spor/saml3` 1,16:1, fordi den
forkerte flade så er den, man får ved ikke at vælge.

## Målingerne

| | Før | Efter |
|---|---|---|
| `node tools/validate.mjs` | 77 / 0 fejl / 1 adv. | **77 / 0 fejl / 1 adv.** |
| `node tools/build.mjs` | 216 sider · 1111 tal | **216 sider · 1111 tal, 0 uden kilde** |
| `node tests/koer.mjs` | 1591 / 0 fejlet | **1615 / 0 fejlet** (+24 nye, 0 slettede) |
| K1 elementer med klassen `videre`/`videre--stille` | 144 | **0** |
| K2/K3 `.videre` som **selektor** (u. kommentarer) | 6 / 1 | **0 / 0** |
| `<button>` i `dist/` der bærer `.knap` | 0 af 180 | **180 af 180** |
| Elementer i `dist/` med `.knap` | 0 | **414**, alle med en variant |
| Ægte døde CSS-klasser | 13 kendte | **13, uændret — 0 nye** |

## K4 — hvor endte hver af de elleve

| Gammel klasse | Endte som | Rest |
|---|---|---|
| `videre` | `knap knap--fyldt` (404) / `knap knap--kant` (robot, katalog) | væk |
| `videre--stille` | `knap knap--kant` | væk |
| `nulstil` | `knap knap--kant-moerk` | væk; margin hænger på `[data-nulstil]` |
| `kort__saml` | `knap knap--maerkat kort__saml` | **overlever som placering** (3 erklæringer: position/top-right/z-index) |
| `valg__fjern` | `knap knap--kryds` | væk |
| `f-sort` | **overlever uændret** | er ikke en knap — det er den skjulte `<input type="radio">`, sorteringen hænger på. Briefets liste tog fejl |
| `saml-taeller__ryd` | `knap knap--tekst` | overlever som JS-krog (`querySelector`, test 65.8) |
| `saml-fjern` | **fandtes ikke som klasse** — det er attributten `data-saml-fjern`. Knappen hed `specimen__fjern nulstil` | — |
| `specimen__fjern` | `knap knap--kant-moerk specimen__fjern` | overlever som størrelse/placering |
| `saml-invit__link` | `knap knap--kant saml-invit__link` | overlever som krog; alle farveregler slettet |
| `klaebebar__ryd` | `knap knap--tekst-moerk` | kun `flex:none` (flexbox-layout) |
| `klaebebar__gaa` | `knap knap--tekst-moerk knap--frem` | kun `flex:none` |

**Der var et tolvte:** `saml-taeller__gaa` → `knap knap--tekst knap--frem`. Ikke på
briefets liste, men den stod ved siden af `__ryd` og ville ellers have været den
eneste knap i sin række uden for primitiven.

## K5 — kontrast pr. variant, med læseretning

Regnet med WCAG-formlen, motoren valideret mod DESIGN.md's ti kendte svar (10/10).
Samme tal regnes nu af `tests/dele/70-knap.mjs` ved hver kørsel.

| Variant | Kontrast | Læseretning |
|---|---|---|
| `knap--fyldt` | **14,69** | panel på blæk |
| `knap--kant` | **12,72** | blæk på bund |
| `knap--tekst` | **4,74** | stoev-blæk på bund |
| `knap--kant-moerk` | **12,72** | paafod på fod |
| `knap--tekst-moerk` | **5,94** | paafod2 på fod |
| `knap--maerkat` | **4,74** | stoev-blæk på bund |
| `knap--tekst.knap--frem` | **12,72** | blæk på bund |
| `knap--tekst-moerk.knap--frem` | **9,19** | accent på fod (L76 tillader på mørk) |
| hover, alle kassevægte | **9,19** | blæk på accent |

Laveste er 4,74 mod kravets 4,5. `.videre--stille`s 1,60 er væk. To utilsigtede
forbedringer: `specimen__fjern` gik fra 5,94 til 12,72, og dens hårstreg fra
**2,20** (under 1.4.11's 3:1) til 5,94.

## K6 — P0 uden JavaScript: 8 af 8

Kørt i `javaScriptEnabled:false`, rigtige museklik, aldrig `force`. **Kontrollen
først:** samlknappen står stadig `hidden`, hvilket beviser at JS'en ikke kørte.
Facetgruppe åbnes ✓ · filter 77→41 kort ✓ · **krydset (`knap--kryds`, en
`<label for>`) 41→77** ✓ · nulstil (`type="reset"`) 41→77 ✓ · sortering
(`order` 0,0,0,0 → 52,18,19,37) ✓ · enhedskontakten (`~`): `15 kg`→`33,1 lb`,
`0–9 km/h`→`0–5,59 mph` ✓ · døren ud 268×44 px ✓.

## K8 — set med egne øjne (5 flader × 1440/390, skud læst)

**Katalog 1440:** `+ SAMMENLIGN` på hvert kort, `NULSTIL` i den mørke strimmel,
`ÅBN SAMMENLIGNINGEN` (gul) og `RYD UDVALGET` (grå) i klæbebaren. De taler nu
samme sprog som `ANNONCERET` og `UNITREE ROBOTICS`. **390:** stemplet folder til
sit `+`-glyf, 44 px bevaret. **Robot:** døren ud står som omridset knap med pil.
**Sammenligning m. 3 valgte:** tre ens `FJERN` på de mørke kolonnehoveder.
**Producent og Om os: nul knapper** — korrekt, producentkort bærer bevidst intet
stempel (test 43.1). Første skud af producentsiden var en **404** (forkert gættet
URL); det ville have målt en tom side som "ingen knapper".

## Konfidens

| Punkt | Niveau | Hvis arbejdet var forkert |
|---|---|---|
| K1–K3, K4-tallene | **Høj** — `node <scratchpad>/k4b.mjs`, egen 5/5-selvkontrol | K1 ville vise 144, ikke 0 |
| Kontrast (K5) | **Høj** — `node tests/koer.mjs`, blok 70.5 | 70.5 falder; revert-beviset kræver at 1,38 afvises |
| Tests/byg | **Høj** — genkørbar, tallene ovenfor | en rød test ville stå i halen |
| K6 (P0) | **Høj** — `node <scratchpad>/p0-udenjs.mjs` | uden filtrering ville 77→41 være 77→77 |
| K8 (udseende) | **Middel** — skud læst af mig, ikke en måling andre kan genkøre til samme dom |
| Ingen ny død CSS | **Høj** — test 57.1 | den ville navngive den nye klasse |

## Usikkerheder

1. **Badge og knap er konvergeret.** Målt på robotsiden: `.maerke` er
   11px/600/0,99px/versaler/2px radius/1px kant/29px høj; `.knap--kant` er
   12px/600/1,32px/versaler/2px radius/1px kant/44px. **Et ikke-klikbart mærke og
   en sekundær knap adskiller nu 1px skrift og 15px højde.** Før L77 var knappen
   15px sans/46px og dermed tydeligt en anden ting. Det er en følge af mit spor.
   Under designfrysen (L70) noteret, ikke rettet — det hører i en fladeplan.
2. **10 knap-lignende kontroller på katalogsiden står uden for primitiven:** de 5
   sorteringschips (12,5px/600, ingen spatiering, **ikke** versaler, 31px høj,
   `cursor:pointer`, ingen klasse) og de 5 `chip__krop`. Sorteringschippene er
   `<label>` for `.f-sort`; briefet pegede på inputtet, ikke på etiketten.
   Foldes de ind, bliver fem lange etiketter versale og bredere — en synlig
   ændring på en Operate-flade, som hører i katalogets fladeplan.
3. `knap--tekst`/`--tekst-moerk` er kun 13px høje (chromeless, `padding:0`), altså
   under WCAG 2.5.8. Uændret fra før sporet — de lå i klæbende rækker, hvor 44px
   ville skubbe rækken ned over indholdet. `.specimen__fjern`s `::after`-felt er
   systemets løsning, hvis det skal rettes.
4. `knap--kryds` er 18×18 og dermed også under 24×24. Uændret fra `.valg__fjern`.

---

## Nye fælder og opdagelser

- **Briefets K1 kan aldrig nå 0.** Mønsteret `class="[^"]*\bvidere\b` tæller også
  `.robot-videre` — et `<p>` om "til producenten", ikke en knap — fordi
  bindestregen er en `\b`-ordgrænse. **298 = 144 knapper + 154 afsnit.** Efter
  sporet giver briefets grep 154. Jeg måler klasse-**tokens** i stedet.
- **Samme fejl ramte mit eget måleværktøj.** En bash-heredoc åd den ene backslash
  i `'\\.'`, så regexens punktum blev til "vilkårligt tegn" og `-videre` talte med.
  K2 viste derfor "1" på et stilark uden en eneste `.videre`-regel. Fanget af en
  forventning skrevet før aflæsningen. **Heredocs og `node -e` æder backslashes —
  brug Write/Edit.**
- Samme mekanisme skrev fire **literale backspace-tegn (0x08)** ind i
  `tests/dele/41`, fordi `\b` i en JS-streng er et backspace. Fundet med `cat -A`,
  kontrolleret med `grep -rlP '\x08'` over `tests/ assets/ tools/` = 0 filer.
- **`git commit -F` kræver `C:/...`, ikke `/c/...`** — samme fælde, CLAUDE.md kun
  dokumenterer for `git -C`. Filen fandtes; git kunne ikke læse stien.
- **`tests/dele/57` har sin EGEN kopi af dødklasse-detektorens JS-grænse, og
  kopien er den gamle, ubrugte:** `['"\`]` uden `\s` foran klassenavnet. Den misser
  derfor enhver klasse som nr. 2+ i en JS-streng. `fund/maal-doede-klasser.mjs`
  blev rettet 1. sep; testens kopi fulgte ikke med. `knap--tekst-moerk` findes kun
  i JS og blev talt som død. **Løst uden at røre testen:** klæbebarens klasser
  sættes nu med `classList.add('a','b','c')`. Fælden venter på næste spor, der
  skriver en JS-only modifier.
- **DESIGN.md's `nulstil`-post var direkte forkert** — `textColor: blaek2`,
  `height: 44px`; koden havde `color:var(--paafod)` (lys forgrund til mørk flade)
  og ingen height. Dokumentationen bar samme fejl som koden, og en læser ville tro
  `.nulstil` var en lys-flade-knap. Det er nøjagtig antagelsen bag saml3's 1,16:1.
- **Playwrights `:visible` og `getBoundingClientRect` er ikke enige.** Facetlabels
  i en lukket `<details>` rapporterer 303×32,7 px, men `checkVisibility()` og
  Playwright siger korrekt "ikke synlig". Jeg troede først, det var en P0-fejl;
  målt med **og** uden JS er tilstanden identisk, så det er normal
  `<details>`-adfærd, ikke en fejl. Kontrolmålingen mod JS-til reddede den
  konklusion.
- **Filtrering skjuler en ANCESTOR, ikke kortet.** Mekanismen er
  `.styr:has(#id:checked) .lag-anv[...]{display:contents}`, så kortets eget
  `display` er uændret uanset om det vises. Tre af mine P0-prøver var røde på et
  intakt arbejde, indtil jeg skiftede til `checkVisibility()`. Måler man
  `getComputedStyle(kort).display`, får man 86→86 både med og uden JS — et
  fuldstændig plausibelt tal, der intet måler.

## Punkter i briefet, jeg ikke nåede

- **Ingen.** Alle ni acceptkriterier er kørt. To med korrigerede mønstre, og
  korrektionen er begrundet ovenfor: K1 (klasse-tokens frem for `\b`-grep, fordi
  briefets mønster tæller et `<p>` med) og K2/K3 (selektorer i kommentar-strippet
  CSS, fordi min egen forklarende kommentar ellers ville holde tallet over 0 —
  samme metode som `tests/dele/55` allerede bruger).
- Ikke gjort med vilje, under designfrysen L70: de to punkter i *Usikkerheder*
  1 og 2 (mærke/knap-konvergensen og de 10 kontroller uden for primitiven).
  Begge er noteret til fladeplanerne, ikke rettet.
