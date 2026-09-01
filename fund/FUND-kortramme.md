# FUND-kortramme — katalogkortets billedramme, og hvorfor rettelsen ikke nåede den

**Målt 1. sep 2026 af orkestratoren (Fable 5.1 → Opus 5), ikke af et spor.**
Anledning: JPK skrev *"Kan se en del regressioner på websiden. er det sonnet som
ikke er god nok til design?"* Dokumentet svarer på begge dele: hvad der er galt,
og hvem der lavede det.

**Intet er rettet.** Designfrysen (L70) står, og spørgsmålet var en diagnose.

---

## Svaret på spørgsmålet: nej, det er ikke Sonnet

Den værste regression er sporet til **b144cce, 31. aug 2026** — TYPESKILT-arbejdet
med katalogkortet. Efter L45 kørte designspor på **Opus**, ikke Sonnet.

**Det led er en slutning, ikke en måling.** Git registrerer ikke modellen. Commit
og dato er målt; modellen er udledt af L45. Kan nogen senere binde spor til model
i STATUS.md, bliver det til evidens.

---

## Fundet: kortbillederne står i ragged højder

Målt på `http://localhost:8080/da/` ved 1440 px, med **alle 85 billeder tvunget
indlæst** (`loading="lazy"` sat til `eager`, ventet på `onload`, 0 uindlæste):

| | |
|---|---|
| Rækker med højdespring | **16 af 18** |
| Median spring i en række | **80 px** |
| Værste spring | **204 px** |
| Forskellige billedhøjder | **30** blandt 85 kort |
| Spænd | 144–397 px i en 202 px ramme |

**Første måling var forkert, og det er værd at kende.** Uden tvangsindlæsning
rendrede 59 af 82 billeder i **24 px** — højden på en alt-tekst. Det ligner en
grov CSS-fejl. Begge filer findes, og begge URL'er svarer 200; de var bare ikke
indlæst endnu. Det er skudkapløbs-fælden, som allerede står i hukommelsen og i
CLAUDE.md. **Mål aldrig billedhøjder uden at tvinge indlæsning først.**

Måleværktøjets `stoersteSpringIRaekke` gav **0** på samme side samtidig. Det er
ikke en fejl i værktøjet: det måler **kortets** kasse, som faktisk flugter.
Raggedheden sidder **inde i** kortet. Samme lærdom som beskæringsmålingen, der
gav 0 mod filmålingens 16.

---

## Mekanismen: to stykker korrekt arbejde, der ikke mødes

**1. Rammen er 4:3, ikke 16:10.** To regler rammer samme element:

- `assets/system.css:1056` — `.billedled{aspect-ratio:16/10}` + `object-fit:cover`
- `assets/generator.css:1533` — `.net .billedled{aspect-ratio:4/3}` + `object-fit:contain`

Den anden vinder på specificitet. Rammen bliver 270 × 202 px. Det er ikke i sig
selv fejlen — men to formater på samme primitiv i to filer er en systembeslutning,
ingen har truffet.

**2. Billedet fylder ikke rammen.** `<picture>` er `display:block` uden højde, så
`.billedled img{height:100%}` aldrig kan opløses. Billedet falder tilbage til sit
eget sideforhold: 144, 184, 208, 270, 397 px i en 202 px ramme. `.kort` har
`overflow:hidden`, så de høje klippes og de lave efterlader luft.

**Den fejl er fundet og rettet før — den 27. aug 2026, commit 5f44491.**
Rettelsen står i `assets/generator.css:144` med en ni-linjers kommentar, der
forklarer den præcist:

```
.yderpunkt .billedled picture{position:absolute;inset:0;display:block}
```

Den virker. Den er bare afgrænset til `.yderpunkt` — forsidens fire plader.
**Katalogets 86 kort fik den aldrig.**

---

## Hvorfor den ikke nåede kortet

Commit-beskeden fra 31. aug siger det selv, ordret:

> `.kort` deles med forsiden og producentsiderne. Alt kortarbejde er derfor
> scopet under `.net`; en uscopet regel ville have bygget to andre flader om
> ved et uheld.

**Det er præcis den disciplin, projektets egne regler kræver af hvert spor.** Den
forhindrer kollisioner, og den er grunden til, at rettelsen fra den 27. aldrig
nåede kortet. Samme agent fandt tre klassekollisioner ved at se på siden frem for
ved en test. Det er omhyggeligt arbejde, ikke sjusk.

**Tidslinjen, målt med `git log -S`:**

| Dato | Hvad |
|---|---|
| 24. aug | Forsiden bygges med `.yderpunkt`-plader |
| 27. aug | `<picture>`-fejlen findes og rettes — **scopet til `.yderpunkt`** |
| 31. aug | `.net .billedled` (4:3) kommer til med kortet — **uden rettelsen** |
| 1. sep | Forsiden slettes (L72). Rettelsen matcher nu **nul byggede sider** |

`.yderpunkt` findes i dag kun ét sted i `dist/`: i `generator.css` selv.
Rettelsen lever videre, afgrænset til en side, der ikke findes mere, mens fejlen
den kurerer står på 86 kort.

**Konklusionen er ikke modelvalget. Det er, at ingen ejer helheden.** Hvert spor
er sat til at holde sig inden for sit eget, og defekterne lever i mellemrummene.
Det er det, den overordnede designplan skal lukke.

---

## Tre sekundære fund fra samme kørsel

| # | Fund | Tal |
|---|---|---|
| 1 | Skriftstørrelser med synlig tekst på **katalogsiden alene** | **22**, heriblandt parrene 9,5/9,52 px og 8/8,4 px. To værdier så tæt kan ikke begge være valgt — de opstår, når mange hænder hver skubber en værdi. Spring fra 17 px direkte til 25 px |
| 2 | Døde regler om kortet | **9 af 57** matcher nul elementer, fx `.kort .stribe`, `.kort .maerke`, `.producentside .gitter > li > .kort` |
| 3 | Klasser udsendt uden nogen CSS-regel | `kort--seneste` (×9) og `kort-legende` (×1) |

Desuden: **filterblokken begynder 857 px nede**, mens folden er 674 px. Kataloget
er en **Operate**-flade, og dens vigtigste kontrol står under folden.

En hypotese blev **afvist** undervejs: at skabelonens `kort__navn` og stilarkets
`kort-navn` ramte forbi hinanden. `.kort__navn` har sin egen regel. De gamle
`.kort-*`-navne er derimod døde og indgår i fund 2.

---

## Hvad der IKKE er efterprøvet

- **Ikke hver regression JPK selv har set.** Kun de fire hovedflader er gennemgået:
  katalog, robotside, sammenligning, producenter.
- **Modellen bag b144cce** kan ikke bevises fra git. Kun spor og dato er målt.
- **Sammenligning og producenter er kun set, ikke målt.** Begge har synlig død
  plads i første skærm. Tallene mangler.
- **Robotsidens nøgletalsgitter** efterlader en tom halvdel i sidste række. Ikke målt.

---

## Tillæg samme dag: fem flader mere, JPK pegede på

JPK sendte fem punkter og spurgte: *"Dette er alt kommet efter sonnet arbejde.
Kan du bekræfte dette?"* **Det kan jeg ikke. Fire af fem er ældre end
Sonnet-sporene, og den femte udfører hans egen beslutning fra i dag.**

**Alle fem observationer er rigtige.** Det er kun tilskrivningen, målingen
modsiger. De står her, fordi et fund uden en dateret oprindelse bliver
tilskrevet det senest kørte spor, hver gang nogen kigger.

| Punktet | Dommen | Oprindelse, målt med `git log -S` |
|---|---|---|
| *"Vælg robotter"-knappen har det gamle format* | **Rigtigt** | `.videre` er fra **21. aug** (f2d9aee), knap-primitiven fra FØR TYPESKILT. `spor/saml2` genbrugte den i dag. Katalogsiden bruger en anden klasse, `.nulstil` — **to knapgenerationer lever side om side** |
| *Der burde være 3 knapper, én pr. robot* | **Nyt ønske, ikke en regression** | Én knap ER **L73** — JPK's egen beslutning i dag: *"Choose robots sender en tilbage til katalogsiden … også fjerne robotvælgeren nederst"*. Sporet gjorde præcis det |
| *Kolonnerne skal være ens brede* | **Rigtigt** | Målt: **509 / 376 / 243 px**, spring **266 px**. `table-layout` er **aldrig sat nogen steder** i projektet, så tabellen kører på `auto` og bredden følger indholdet. Kolonnerne har **aldrig** været ens brede |
| *Valg-baren er grim, kedelig og for bred* | **Rigtigt** | `.strimmel`, **31. aug** (d049725 + b144cce), TYPESKILT-arbejdet — efter L45 **Opus**, samme kilde som kortrammen ovenfor. Målt: **1352 × 59 px**, mørk `#22262A`, og i hvile bærer den kun `VALGT · 74 AF 77 · NULSTIL` |
| *Fod-sætningen er pludselig dukket op* | **Malplaceret ja, ny nej** | `side.mjs:2086` udsender `taethed_forklaring` i **foden** på **107 sider**. Den har stået der siden **19. aug** (a81c327) — projektets ALLERFØRSTE pipeline-commit. **13 dage gammel.** Ingen test dækker den |

**Fod-sætningen er den skarpeste af de fem, fordi den er en klassefejl:**
*"Hvor mange af skemaets felter producenten selv oplyser. Det måler
producentens åbenhed, ikke robottens kvalitet."* er en **forklaring på
tæthedsmålet** (`24 af 33 felter oplyst`) — den hører ved tallet, ikke i foden
ved siden af forhandler-forbeholdet. Sådan som den står nu, læses den som en
udtalelse om sitet.

**Hvorfor JPK ser den nu og ikke før:** L72 slettede forsiden og gjorde
kataloget til sprogroden i dag. Han lander derfor på andre sider end før, og
foden kommer i syne i en ny sammenhæng. **Det er værd at kende som mønster: en
navigationsændring afslører gammelt indhold og får det til at ligne nyt.**

---

## Genkør målingerne

Serveren skal køre på 8080 fra projektroden. **Skriv det forventede tal, før du
læser resultatet** — ellers ser et forkert selektorudtryk ud som et gyldigt nul.

```bash
# 1. Rammen: to regler, to formater (forventer 16/10 i system, 4/3 i generator)
grep -n 'aspect-ratio' assets/system.css assets/generator.css

# 2. Rettelsen findes kun for .yderpunkt (forventer én linje, ingen generel regel)
grep -n 'billedled picture' assets/*.css

# 3. .yderpunkt er væk fra alle byggede sider (forventer kun dist/generator.css)
grep -rl 'yderpunkt' dist/

# 4. Kortene bruger <picture> (forventer 85 mod 86 billedled)
grep -o '<picture' dist/da/index.html | wc -l
grep -o 'class="billedled' dist/da/index.html | wc -l

# 5. Tidslinjen
git log --format="%h %ad %s" --date=short -S'.net .billedled' -- assets/generator.css
git log --format="%h %ad %s" --date=short -S'billedled picture' -- assets/generator.css
```

Højdespringene måles i browseren via `mcp__playwright__browser_evaluate`. **Sæt
alle `loading="lazy"` til `eager` og vent på `onload` først** — ellers måler du
uindlæste billeder og får 24 px.
