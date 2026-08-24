# FUND-vest-2 — de 17 fejl skrevet frem, plus to fund mere

Retter **R1** i STATUS.md. `fund/FUND-vest.md` er arkiv og er **ikke** rettet bagud — den staar,
som den blev skrevet 19. aug 2026. Det her dokument er stedet, en laeser skal gaa hen, naar
en paastand i FUND-vest skal bruges.

Skrevet 21. aug 2026 i worktree `udstilling-wt-vest2b`, gren `data/vest-rettelser`.

**Hver post har tre led:** hvad der stod · hvad der er rigtigt · hvilken raafil der beviser
det. Uden det tredje led er en rettelse bare en anden paastand.

**Skrivemaade.** Dokumentet foelger `KRITIK-1-plan.md` og bruger translittereret dansk uden
ae/oe/aa-tegn. Det gaelder ogsaa, naar jeg citerer FUND-vest' danske prosa. **Citater fra
producenternes egne sider er derimod byte-noejagtige** — det er dem, der baerer bevisbyrden,
og de er alle engelske.

---

## Regel 0 — skill-vurdering

**Valgt: `robotdata`** (`.claude/skills/robotdata/SKILL.md`). Den blev **laest fra disk med
`cat`**, ikke kaldt med Skill-vaerktoejet — jeg skriver det eksplicit, fordi CLAUDE.md
kraever, at et stille fallback ikke forveksles med, at skillen koerte. Den er den rigtige,
fordi hele opgaven er kildekritik: regel 1 (opfind aldrig et tal), regel 2 (hvert tal skal
have kilde), regel 3 (producentens egen side er primaerkilden) og regel 10 (tre tilstande)
er praecis de fire regler, de 17 fejl bryder.

Gik forbi, med begrundelse:

| Skill | Hvorfor ikke |
|---|---|
| `parallelt` | Baerer worktree-opsaetning for den, der **fordeler** arbejde. Jeg er ét spor i en allerede fordelt runde |
| `impeccable`, `critique`, `ui-ux-critique` | Vurderer en bygget flade. Der er ingen flade i denne opgave |
| `dataviz` | Relevant naar taetheden skal **vises**. Her rettes den |
| `code-review`, `simplify` | `x.js` og `pdf.js` er 20 linjers engangsvaerktoej, ikke produktionskode |
| `new-project` | Intet scaffoldes |

---

## Oversigt

De 17 fejl er fundet af `KILDEKORT-A` til `-D`. Jeg har efterproevet **hver enkelt mod
raafilen selv** frem for at overtage kortenes konklusion. Dertil to fund, kortene ikke har:

| # | Post | Klasse | Kilde til fundet | Scope |
|---|---|---|---|---|
| 1 | Spot felt 26 — `Gigabit Ethernet` | indhold | KILDEKORT-A | i katalog |
| 2 | Spot felt 19 — `built-in stereo cameras` | kilde | KILDEKORT-A | i katalog |
| 3 | Spot felt 23 — autonomi-citater | kilde | KILDEKORT-A | i katalog |
| 4 | ANYmal X — "25 felter" | regning | KILDEKORT-A | i katalog |
| 5 | Vision 60 felt 17 — dockingstation | kilde | KILDEKORT-B | i katalog |
| 6 | Vision 60 felt 21-22 — ROS 2 og SDK | kilde | KILDEKORT-B | i katalog |
| 7 | Vision 60 — kontrafaktisk 16/29 | slutning | KILDEKORT-B | i katalog |
| 8 | Vision 60 felt 25 — indsat mellemrum | citat | KILDEKORT-B | i katalog |
| 9 | Rainbow Robotics — "Daejeon" | opfundet | KILDEKORT-B | i katalog |
| 10 | Ghost Robotics — "Philadelphia" | opfundet | KILDEKORT-B | i katalog |
| 11 | RBQ-10 felt 4 — `12 joints` | kilde | KILDEKORT-B | i katalog |
| 12 | Kawasaki — konklusion paa én side | metode | KILDEKORT-B | i katalog |
| 13 | Bittle X felt 11 — IP-tilstand mangler | tilstand | KILDEKORT-C | **uden for scope** |
| 14 | "Eneste eksplicitte nej" | taelling | KILDEKORT-C | **uden for scope** |
| 15 | Mini Pupper — tredje pris mangler | udeladt | KILDEKORT-C | **uden for scope** |
| 16 | RIVR felt 7 — `14 km/h` tilskrevet K9 | kilde | KILDEKORT-D | i katalog |
| 17 | RIVR — "5x" tilskrevet K9 | kilde | KILDEKORT-D | i katalog |
| **18** | **Honey Badger 4.0 — IP-modsigelse** | **udeladt** | **denne runde** | i katalog |
| **19** | **Boston Dynamics — "Waltham"** | **opfundet** | **denne runde** | i katalog |

**Post 18 og 19 er ikke blandt de 17.** 18 foerte KILDEKORT-D som observation A, ikke som
fejl. 19 har **intet kildekort fundet** — den kom frem, da jeg efterproevede hjembyerne
samlet, og den er den tredje af samme slags som 9 og 10.

---

# Boston Dynamics Spot

## Fejl 1 — `Gigabit Ethernet` er dockingstationens port, ikke robottens

**Hvad der stod.** FUND-vest linje 190, afsnit 1, felt 26:

> `| 26 | dataporte | `DB25 (2 ports)`; `Gigabit Ethernet`; WiFi `2.4GHz / 5GHz b/g/n` | — | K1, K2 |`

**Hvad der er rigtigt.** Robottens egne dataporte er `DB25 (2 ports)`, `Ethernet` **uden
hastighedsangivelse**, og WiFi `2.4GHz / 5GHz b/g/n`. Gigabit-passthrough hoerer i felt 17
(dockingstation), hvor FUND-vest selv i forvejen placerer dockens `cTUVus`-certificering.

**Raafilen der beviser det.** To uafhaengige led:

1. `spot.html` (K1, `https://bostondynamics.com/products/spot/`):
   `grep -o -i -c Gigabit spot.html` → **0**. Ordet findes ikke paa produktsiden. K1's
   `CONNECTIVITY`-blok lyder i sin helhed: `CONNECTIVITY / WIFI / 2.4GHz / 5GHz b/g/n /
   Ethernet`.
2. `bd_spec.pdf` (K2): strengen findes, men i dockens blok. Ordret fra det flade udtraek,
   mellem dockens `ENVIRONMENT` og dockens `CERTIFICATIONS`:
   `Mounting = Bolt/tie down locations provided CONNECTIVITY Gigabit Ethernet passthrough
   to robot CERTIFICATIONS cTUVus Certified to UL 1564`
   Ordet **`passthrough to robot`** er selv beviset: en port, der sender videre *til*
   robotten, sidder ikke *paa* robotten. Basisrobottens egen blok i K2 lyder
   `WiFi = 2.4GHz / 5GHz b/g/n Ethernet`.

**Hvorfor det betyder noget.** Posten ville love en gigabit-port paa en robot, hvor
producenten kun lover den paa ladestationen. Det er den dyreste slags katalogfejl: et tal,
der er rigtigt et sted og forkert, hvor det staar.

> **Forbehold, der foelger med.** Argumentet hviler paa, at PDF'ens tekststroem foelger den
> visuelle gruppering. Det er ikke garanteret i en PDF. Det staerke led er `passthrough to
> robot` plus at `Gigabit` slet ikke findes i K1 — men et menneske boer se PDF-siden med
> oejnene, foer posten skrives. **D2 viste, at oejnene giver et andet svar end mekanikken.**

## Fejl 2 — `built-in stereo cameras` er tilskrevet K1, men staar kun i K2

**Hvad der stod.** FUND-vest linje 183, afsnit 1, felt 19:

> `| 19 | kameraer ~ | `built-in stereo cameras`, `Horizontal Field of View 360°` | — | K1 |`

**Hvad der er rigtigt.** Raekken blander to kilder og krediterer kun den ene:

- `Horizontal Field of View 360°` **er** i K1.
- `built-in stereo cameras` er **K2's**, og staar i databladets marketingprosa, ikke i en
  specifikationstabel.

Feltet skal kildeangives `K1, K2`, og det boer fremgaa, at det ene led er prosa.

**Raafilen der beviser det.** `grep -o -i -c stereo spot.html` → **0**.
`grep -o -i -c 'Horizontal Field of View' spot.html` → **2** (tabellen staar 2x, desktop +
accordion). I `bd_spec.pdf`, ordret med kerningen som den staar:
`using an intuitiv e tablet applica tion and built-in s t er eo camer as.`

**Foelgevirkning.** Felt 18's note — *"Basisrobotten har stereokameraer, ikke LiDAR"* —
hviler paa samme K2-streng og arver samme kildefejl.

## Fejl 3 — autonomi-citaterne findes kun i K2

**Hvad der stod.** FUND-vest linje 187, afsnit 1, felt 23, kildeangivet **K1, K2**:

> `Manual & Autonomous Operation`, `Object Avoidance`, `Stair & Complex Terrain Navigation`

**Hvad der er rigtigt.** Alle tre er badge-tekster i `bd_spec.pdf`. Kilden er **K2 alene**.

K1 understoetter **substansen** i andre ord — `both manual operations and autonomous
missions`, `autonomously charging, dynamically replanning around new obstacles`,
`Collision Avoidance` — saa feltet er ikke opfundet. Men en laeser, der slaar citatet op i
K1, finder det ikke.

**Raafilen der beviser det.** Paa `spot.html`:
`grep -o -i -c 'Object Avoidance'` → **0** · `'Stair & Complex'` → **0** ·
`'Manual & Autonomous'` → **0**. Alle tre findes i `bd_spec.pdf`.

**Den mildeste af de sytten.** Man kan rimeligt mene, at "K1, K2" paa en kvalitativ raekke
betyder *understoettet af begge*, ikke *citeret fra begge*. Den foeres som fejl, fordi de
oevrige raekker i samme tabel bruger kolonnen som citatkilde — **inkonsistensen er selve
problemet**, ikke den enkelte raekke.

## Fejl 19 — "Waltham, Massachusetts" staar ingen steder *(ikke blandt de 17)*

**Hvad der stod.** FUND-vest linje 158:

> **Producent:** Boston Dynamics, Waltham, Massachusetts, USA. Majoritetsejet af Hyundai
> Motor [...]

**Hvad der er rigtigt.** `hjemby: ikke_oplyst`. Boston Dynamics oplyser ingen adresse i det
indsamlede materiale, og heller ikke ejerforholdet.

**Raafilen der beviser det.** Talt over alle fire Boston Dynamics-raafiler — `spot.html`,
`bd_arm.html`, `bd_shop.html` og `bd_spec.pdf` (fladt udtraek, mellemrum fjernet for at
komme uden om kerningen):

| Soegeord | Traef i alle fire filer |
|---|---|
| `waltham` | **0** |
| `massachusetts` | **0** |
| `hyundai` | **0** |

Databladet baerer `contact sales@bostondynamics.com` og
`www.bostondynamics.com/products/spot` — kontaktvej, ingen adresse.

**Dette fund er nyt.** Intet af de fire kildekort rejste det; de efterproevede FUND-vest'
tal, ikke dens producenthoveder. Det kom frem, da jeg efterproevede alle syv hjembyer under
ét, efter at fejl 9 og 10 havde vist, at netop det felt var svagt. **Derfor er det tredje
tilfaelde ikke fundet foer: ingen soegte paa det.**

---

# ANYbotics

## Fejl 4 — "Alle oevrige 25 felter" skal vaere 26

**Hvad der stod.** FUND-vest linje 327, afsnit 3 (ANYmal X):

> Alle oevrige **25** felter: **ikke oplyst**.

**Hvad der er rigtigt.** **26.** Tabellen ovenfor har 5 udfyldte felter, og dokumentet
fastslaar selv i sit eget afsnit paa linje 59 — *"Naevneren er ikke 29 — den er 31"* — at
naevneren er 31. 31 − 5 = **26**. Med den gamle naevner 29 ville tallet vaere 24.
**Hverken 24 eller 26 er 25.**

**Raafilen der beviser det.** Ingen — det er en regnefejl internt i FUND-vest, ikke en
kildefejl. Beviset er dokumentets egne to tal.

**Hvad der derimod er rigtigt.** Alle seks taethedstal i afsnit 1-3 er genregnet og holder:
18/29 = 62,07 % · 18/31 = 58,06 % · 17/29 = 58,62 % · 17/31 = 54,84 % ·
11/29 = 37,93 % · 11/31 = 35,48 % · 5/29 = 17,24 % · 5/31 = 16,13 %.
Raekketaellingen er ogsaa kontrolleret: afsnit 1 har 18 udfyldte, afsnit 2 har 11,
afsnit 3 har 5. **Kun saetningen om "25" er gal.**

*(Til sammenligning: ANYbotics' hjemby ER kildebelagt. `Hagenholzstrasse 83a, 8050 Zürich,
Switzerland` staar ordret i alle fire ANYbotics-raafiler. Modsat fejl 9, 10 og 19.)*

---

# Ghost Robotics Vision 60

Tre af de fire Ghost-fejl er samme fejl: **databladet fik aeren for noget, produktsiden
selv oplyser.**

## Fejl 5 — dockingstationen staar ogsaa paa produktsiden

**Hvad der stod.** FUND-vest linje 371, afsnit 4, felt 17, kilde **K7**, med noten:

> Findes kun i databladet, ikke paa produktsiden

**Hvad der er rigtigt.** Den staar paa produktsiden. Kilde: **K6, K7**. Noten slettes.

**Raafilen der beviser det.** `ghost_v60.html` (K6,
`https://www.ghostrobotics.io/vision-60`):
`grep -o -c 'Wireless charging station for persistent' ghost_v60.html` → **1**.
Ordret i den raa HTML — altsaa i DOM'en, ikke bag en download:

```
Wireless Charge Kit
Wireless charging station for persistent 24x7 operation
```

## Fejl 6 — ROS 2 og SDK staar ogsaa paa produktsiden

**Hvad der stod.** FUND-vest linje 375-376, afsnit 4, felt 21 og 22, begge kildeangivet **kun K7**.

**Hvad der er rigtigt.** Begge felter er dokumenteret paa **K6**. Kilde: `K6, K7`.

**Raafilen der beviser det.** `ghost_v60.html`:
`grep -o -c 'MAVLink Compatible'` → **1** · `grep -o -c 'ROS2'` → **1**.
Ordret fra produktsiden:

```
Low-level | High-Level | Mission Control API
C/C++, ROS, ROS2, MAVLink Compatible, Zeno, ATAK, JSON Mission
Simulator
Bullet Physics-based, Windows, Linux, Mac
```

## Fejl 7 — det kontrafaktiske taethedstal er ubegrundet

**Hvad der stod.** FUND-vest linje 390:

> [...] uden K7 mangler ROS 2, SDK og dockingstation, og tallet falder til 16/29 = 55,2 %.

fulgt af konklusionen *"Igen er databladet forskellen."*

**Hvad der er rigtigt.** **Alle tre felter er dokumenteret paa K6 alene.** Det er derfor
ikke godtgjort, at taetheden falder til 16, og konklusionen er uunderbygget for Vision 60.

**Hovedtallet 19/31 er ikke beroert** — det er kun det kontrafaktiske tal, der falder.

**Raafilen der beviser det.** Foelger direkte af fejl 5 og 6, samme to `grep` paa
`ghost_v60.html`.

**Databladet er ikke overfloedigt.** K7 er stadig eneste kilde til
`submerged in up to 1 meter of water for up to 30 minutes` og til broedtekst om blind mode,
raekkevidde (`up to 6.0 miles on a single charge`) og aaben arkitektur. **Det er bare ikke
forskellen paa netop de tre felter.**

## Fejl 8 — indsat mellemrum i et ordret citat

**Hvad der stod.** FUND-vest linje 379, afsnit 4, felt 25, i en kolonne der hedder
*"Vaerdi som producenten skriver"*:

> `power: 12V regulated & unregulated 32-42V`

**Hvad der er rigtigt.** Producenten skriver det **uden** mellemrum efter kolon:

> `power:12V regulated & unregulated 32-42V`

**Raafilen der beviser det.** `v60.txt` (udtraek af `ghost_v60.html`):
`grep -o -c 'power: 12V regulated'` → **0** · `grep -o -c 'power:12V regulated'` → **1**.
Samme uden mellemrum i PDF'ens tekst (`po w er:12V r egulated`, kerning-spredt).

**Trivielt i sig selv. Ikke trivielt som moenster.** Det er samme klasse af stille
normalisering, som `robotdata` regel 4 forbyder for operatorer: retter man tavst
producentens skrivemaade, kan et automatisk kildetjek ikke laengere genfinde citatet.
Samme klasse, ikke talt som selvstaendig fejl: felt 19 gengives
`4 x D435 depth sensors, dual antenna RTK GPS`; kilden har
`4 x D435 depth sensors ,  dual antenna RTK GPS`.

## Fejl 10 — "Philadelphia" staar ingen steder

**Hvad der stod.** FUND-vest linje 350:

> **Producent:** Ghost Robotics, Philadelphia, USA.

**Hvad der er rigtigt.** `hjemby: ikke_oplyst`. **Ghost Robotics oplyser ingen hjemby noget
sted i materialet.**

**Raafilen der beviser det.** `grep -o -i -c philadelphia` paa `ghost_home.html`,
`ghost_v60.html` og `v60.txt` samlet → **0**. Sidefoden paa forsiden har kun *"Get In
Touch"* — ingen postadresse overhovedet. Databladet har `Sales@ghostrobotics.io` og
`www.ghostrobotics.io`, ingen adresse.

---

# Rainbow Robotics RBQ-10

## Fejl 9 — hjembyen er Sejong-si, ikke Daejeon

**Hvad der stod.** FUND-vest linje 435:

> **Producent:** Rainbow Robotics, Daejeon, Sydkorea.

**Hvad der er rigtigt.** **Sejong-si.** Producentens egen sidefod:

> `Headquarters` · `(30141) 8, Jipyeongjungang 3-ro, Jipyeon-dong, Sejong-si, Republic of
> Korea` · `Tel. +82-44-860-9600`

**Raafilen der beviser det.** `grep -o -i -c daejeon` paa **alle seks** Rainbow-filer
samlet (`rbq.html`, `rbq10.html`, `rbqgh.html`, `rbq.txt`, `rbq10.txt`, `rbq_llms.txt`) →
**0**. `grep -o -c 'Sejong-si' rbq10.txt` → **1**, i sidefoden, samme streng i `rbq.txt`.

**To uafhaengige bekraeftelser i selve adressen:** postnummer **30141** er Sejong, og
omraadenummer **044** er Sejong. Adressen modsiger ikke bare Daejeon — den udpeger Sejong to
gange mere.

**Hvorfor fejlen er forstaaelig og alligevel skal rettes.** Rainbow Robotics **udsprang** af
KAIST i Daejeon, saa byen er ikke grebet ud af luften. Men det er ikke, hvad kilden siger,
og det er ikke maerket som sekundaer viden. Under `robotdata` regel 1 og 2 er det en
oplysning uden kilde i et dokument, hvis egen indledning lover *"Alt herunder er
producentoplyst ... intet er gaettet."*

## Fejl 11 — `12 joints` kommer fra SDK-dokumentationen, ikke fra en specifikation

**Hvad der stod.** FUND-vest linje 443, afsnit 6, felt 4, kilde `K13`:

> `12 joints` — 3 pr. ben (hofte-rul, hofte-nik, knae)

**Hvad der er rigtigt.** Tallet er hoejst sandsynligt korrekt, men **producenten oplyser
ikke frihedsgrader som specifikation** — vi udleder dem af en API-beskrivelse. Feltet skal
enten maerkes som udledt eller taelles anderledes under D4.

**Raafilen der beviser det.** `rbq_llms.txt`. `grep -o -i -c '12 joints'` → **6 traef**, og
alle seks staar i SDK-/API-afsnittene. De fire unikke kontekster, ordret:

```
| Subscribe | rt/rbq/leg_joint | LegJointInfo_ | Joint position and velocity (12 joints) |
| ... /_20 | JointOwnershipCmd_ | Claim ownership of all 12 joints |
transitioning into Motion or Control state, claiming all 12 joints (`owner_20`)
once on entering Motion or Control state, claiming all 12 joints at priority 20.
```

Ikke én af dem er en specifikationstabel. Og afgoerende:
`grep -o -i -c 'degrees of freedom' rbq_llms.txt` → **0** i hele manualen paa 390 KB.

**Sammenligningen, der goer det til et problem.** Vision 60 oplyser det ordret som
specifikation: `3 Degrees of Freedom per leg`. Stilles de to poster ved siden af hinanden,
ser felt 4 ens ud — men det ene tal er producentens, det andet er vores.

---

# Kawasaki RHP Bex

## Fejl 12 — konklusionen hviler paa én side, og kilden er ikke registreret

**Hvad der stod.** FUND-vest linje 752:

> **Ingen produktside med specifikationer** paa `kawasakirobotics.com`. Bex er en
> forskningsplatform under `Robust Humanoid Platform`, ikke et katalogprodukt.

**Hvad der er rigtigt.** Tre ting:

1. Konklusionen boer nedtones til: *"ikke fundet i produktnavigationen paa forsiden
   2026-08-19"*.
2. `kawasakirobotics.com` skal **have en kildenoegle**. Raafilen findes, men URL'en staar
   ikke i FUND-vest' kildetabel K1-K24 — under regel 2 er det et hul.
3. Formuleringen `Robust Humanoid Platform` er **ikke kildeangivet og findes ikke i
   raafilen**.

**Raafilen der beviser det.** `kawasaki.html`
(`https://kawasakirobotics.com/`, canonical og og:url enige):

- `grep -o -i -c '\bbex\b'` → **0**
- `grep -o -i 'Robust Humanoid'` → **tomt**
- `grep -o -c 'is_front_page":true'` → **1** — filen er forsiden, ikke produktkataloget

**Hvorfor beviset er svagt.** Forsiden linker til seks produktindgange, som **ingen af dem
er hentet**: `/products/`, `/products-robots/`, `/products-controllers/`,
`/products-others/`, `/products/k-addon/`, `/products/retired-models/`. Forsiden naevner
ikke en eneste konkret robotmodel — saa at Bex mangler dér, siger naesten intet om, hvorvidt
der findes en Bex-side andre steder paa domaenet.

*(Paastanden om 100 kg baereevne er derimod korrekt maerket som presse og ikke indsamlet.
Den er ikke en fejl.)*

---

# RIVR ONE

Begge RIVR-fejl er kildehenvisningsfejl, ikke talfejl. **Alle 21 kontrollerede vaerdier er
korrekte.** Men efter `robotdata` regel 2 er et tal uden korrekt kilde ikke indsamlet.

## Fejl 16 — `14 km/h` er tilskrevet en kilde, der ikke indeholder tallet

**Hvad der stod.** FUND-vest linje 570, afsnit 8, felt 7:

> `| 7 | maks. hastighed | `up to 14 km/h (8.7 mph)` | `up to` | K8, K9 |`

**Hvad der er rigtigt.** Kilden er **K8 alene** (`https://www.rivr.ai/product`).

**Raafilen der beviser det.** `grep -o -c '14 km/h'`:
`rivr_product.html` → **1** · `rivr.html` (K9, forsiden) → **0**.
Hele forsidens tekst er **1423 byte** og handler om *"General Physical AI through Doorstep
Delivery"* — ingen specifikationer overhovedet. Ordret fra produktsiden:

```
Moves at more than twice the speed of a walking person and can reach up to 14 km/h
(8.7 mph) when needed, ensuring quick deliveries.
```

## Fejl 17 — "5x the battery life" staar paa en side, der slet ingen kildenoegle har

**Hvad der stod.** FUND-vest linje 579:

> `5x the battery life and speed, with 10x the coverage of traditional legged robots`
> (K9, teknologisiden)

**Parentesen modsiger sig selv.** K9 er defineret i kildetabellen som **forsiden**, ikke
teknologisiden.

**Hvad der er rigtigt.** Strengen staar paa **teknologisiden**,
`https://www.rivr.ai/technology`. **Den URL findes ikke i kildetabellen K1-K24 og skal have
sin egen noegle.**

**Raafilen der beviser det.** `grep -o -c '5x the'`: `rivr_tech.html` → **1** ·
`rivr.html` → **0**. Ordret, med den overskrift den staar under:

```html
<h3 class="lead medium bottom-4">Efficiency of wheels</h3>
<div class="p-14">5x the battery life and speed, with 10x the coverage of traditional
legged robots.</div>
```

> **Hullet i beviskaeden er nu lukket.** KILDEKORT-D kunne kun *sandsynliggoere*, at
> `rivr_tech.html` er `/technology`, fordi Webflow-siderne hverken har `canonical` eller
> `og:url`, og skrev det som et reelt forbehold. **Siden siger det selv alligevel:** Webflow
> saetter klassen `w--current` paa det navigationslink, der peger paa den side, man staar
> paa. `rivr_tech.html` baerer `w--current` paa `href="/technology"`; `rivr_product.html`
> paa `/product`; `rivr.html` paa `/`. Sammen med `data-wf-domain="www.rivr.ai"` er URL'en
> dermed **laest i filens eget indhold**, ikke rekonstrueret af filnavnet. Samme metode
> daterer Ghost-siderne. Det er skrevet ind i `MANIFEST.tsv`.

---

# MAB Robotics Honey Badger 4.0

## Fejl 18 — producenten modsiger sig selv om IP-klassen, og det er ikke noteret *(ikke blandt de 17)*

**Hvad der stod.** FUND-vest afsnit 7b, felt 13: `up to IP67`, med operatoren bevaret.
**Ingen note.**

**Hvad der er rigtigt.** Vaerdien er rigtigt gemt — FUND-vest tager med rette den forsigtige
tabelvaerdi og bevarer `up to` (regel 4). **Men modsigelsen paa producentens egen side
mangler som `note`.**

**Raafilen der beviser det.** `mab.html`
(`https://www.mabrobotics.pl/honey-badger`, canonical):

| Soegeudtryk | Traef |
|---|---|
| `IP67` i alt | **6** |
| `up to IP67` (specifikationstabellen) | **1** |
| `IP67-rated` (broedteksten) | **2** |

Broedteksten siger to gange noget staerkere end tabellen:

```
Honey Badger thrives in dust, water and wide temperature range thanks to durable and
IP67-rated construction.
... its IP67-rated waterproof construction, combined with MAB advanced actuators, adds a
unique capability ...
```

**Hvorfor den hoerer med.** Det er praecis samme slags fund som RBQ-10's `6 mod 9 km/h` og
Bittle X' kabelmodsigelse — og dem har FUND-vest **egne afsnit** til. At MAB's modsigelse
ikke fik ét, er en inkonsistens i dokumentet, ikke en vurdering af, at den er mindre
vaerd. **Skal ind paa 4.0-posten som `note`.**

---

# Uden for scope (L11) — Petoi og MangDang

> **L11:** legetoej, hobbyrobotter og undervisningskit hoerer ikke i kataloget. Petoi og
> MangDang er **ude**. Fejlene rettes alligevel, fordi dokumentationen skal vaere rigtig —
> men **posterne maa ikke laegges ind i kataloget** paa grundlag af de rettede tal.

## Fejl 13 — Bittle X mangler sin IP-tilstand *(uden for scope)*

**Hvad der stod.** Afsnit 9 lister **IP-klasse** blandt *"Ikke oplyst"*, og linje 625:

> **Udfyldt: 12.** Taethed **12/29 = 41,4 %**, **12/31 = 38,7 %**.

**Hvad der er rigtigt.** Producenten **oplyser** det, som et eksplicit `nej`:

> `Is Bittle X waterproof?`
> `No. But Bittle can walk in the shadow water area .`

Efter `robotdata` regel 10 og FUND-vest' egen taelleregel (*"`nej` og `0` taeller som
udfyldt"*) er det en **udfyldt vaerdi med tilstanden `nej`**, ikke `ikke oplyst`.

**Bittle X er 13 udfyldte felter, ikke 12.** Taethed **13/29 = 44,8 %** og
**13/31 = 41,9 %**.

**Raafilen der beviser det.** `petoi_bittlex.txt`, udtraek af `petoi_bittlex.html`
(`https://www.petoi.com/products/petoi-robot-dog-bittle-x-voice-controlled`):
`grep -o -c 'Is Bittle X waterproof'` → **1**, svaret staar paa linjen under.

*(Mellemrummet foer punktum er producentens eget — sidste led er et link.)*

## Fejl 14 — "eneste eksplicitte nej i hele indsamlingen" er forkert. Der er to

**Hvad der stod.** FUND-vest linje 677, paa Bittle v1:

> **Eneste eksplicitte nej i hele indsamlingen.** Praecis den tredje tilstand, PLAN.md
> kraever kan skelnes

og videre: *"Den hoejeste af Petoi-modellerne — udelukkende fordi den siger `nej` til
vandtaethed."*

**Hvad der er rigtigt.** **Der er to.** Begge udsagn falder med fejl 13:

- Saetningerne er naesten ord for ord ens paa de to sider.
- **Rangeringen mellem Bittle v1 og Bittle X falder vaek** — med rettelsen staar de begge
  paa **13** udfyldte felter.

**Raafilen der beviser det.** Soegt paa **alle 58 filer** i mappen efter et eksplicit
`No.`-svar paa et vandtaethedsspoergsmaal. Praecis **to** filer svarer:

```
petoi_bittle.txt    Is Bittle waterproof?    / No. But Bittle can walk in the shadow water area .
petoi_bittlex.txt   Is Bittle X waterproof?  / No. But Bittle can walk in the shadow water area .
```

Ordet `waterproof` findes ogsaa i `1101b7e2.html` (ANYmal), `mab.html`, `mab5.html` og
`rbq10.html` — men alle fire er **bekraeftende** udsagn (`dust and waterproof (IP67 rated)`,
`IP67-rated waterproof construction`, `waterproof design`, `Dustproof and waterproof
design`). Ingen af dem er et nej. **Taellingen "to" er alt-eller-intet efterproevet, ikke
stikproevet.**

**Hvorfor den er den dyreste af de sytten.** Paastanden er **hjoernestenen i projektets
regel om tre tilstande** — den bruges i FUND-vest som beviset for, at `nej` skal kunne
skelnes fra `ikke oplyst`. **Beviset holder stadig** (der *er* et eksplicit nej, og nu to),
men taellingen bag det var forkert. En regel, der begrundes med en forkert optaelling, er
skroebelig, selv naar reglen er rigtig.

*(Sidegevinst: at samme nej staar paa begge sider, bekraefter FUND-vest' egen konklusion om,
at Bittle X' FAQ er arvet uaendret fra Bittle v1 — svaret paa Bittle X-siden siger endda
stadig **"Bittle"**, ikke "Bittle X".)*

## Fejl 15 — Mini Pupper har tre priser, ikke én. `$669.00` mangler helt

**Hvad der stod.** FUND-vest linje 728, felt 27:

> Mini Pupper `$649.00` USD; Mini Pupper 2-siden viser `$399.00`, `$604.00` og `$649.00`

**Mini Pupper 2-halvdelen er praecis.** Mini Pupper-halvdelen er det ikke.

**Hvad der er rigtigt.** Tre varianter:

| Variant | Pris | Lager |
|---|---|---|
| Mini Pupper - Pre-assembled Kit | `$649.00` | InStock |
| Mini Pupper - Legs Pre-assembled Kit | `$604.00` | InStock |
| Mini Pupper - GenAI Pre-assembled Kit | **`$669.00`** | OutOfStock |

`$669.00` er **den hoejeste pris paa nogen af de to MangDang-sider**. Prisintervallet for
MangDang er `$399.00-$669.00`, ikke `$399.00-$649.00`.

**Raafilen der beviser det.** `md_mini-pupper.html`
(`https://mangdang.store/products/mini-pupper`, og:url).
`grep -o '"price":[0-9]*' | sort -u` giver praecis tre vaerdier: **`60400`, `64900`,
`66900`**. `grep -o -c '66900'` → **1**.

**Hvorfor fejlen opstod — og hvorfor den er den mest laererige af de sytten.**
Tekstudtraekket `md_mini-pupper.txt` viser **kun `$649.00`**, fordi Shopify kun renderer den
**valgte** variants pris som synlig tekst. De oevrige findes udelukkende i JSON-LD.

> **Regel, der boer ind i metoden:** *Et tekstudtraek af en Shopify-side er ikke en
> gengivelse af siden — det er den valgte variants udsnit.* Samme faelde ramte Petoi:
> `petoi_bittle` viser `$309.00` som synlig tekst, mens fire varianter fra `$289` til `$349`
> ligger i JSON-LD — og `$289.00` er `OutOfStock`. **Fortsaetter indsamlingen med `.txt`
> som primaer laesevej, vil den blive ved med at ramme netop den slags fejl.**
> Det er ogsaa grunden til, at `MANIFEST.tsv` maerker hvert af de fire Shopify-udtraek med
> en `ADVARSEL`.

---

## Selv-tjek

**Manifest: 47 af 58 filer med verificeret URL, 11 med ukendt. Fandt 6 fejlsider (4 var
kendt). Skrev 19 rettelser, efterproevede hver mod raafilen, fandt 0 fejl i mine egne.**

### Manifestet, praeciseret

"Verificeret URL" betyder her: **den adresse, filen blev hentet fra, laest i filens eget
indhold.** Efter den maalestok er 47 af 58 verificeret. De 11 oevrige er ikke huller i
gennemgangen — de er huller i **indsamlingen**, og manifestet maa ikke skjule dem.

Hver fil hoerer til praecis én raekke; summen er 58:

| Styrke | Antal | Hvordan |
|---|---|---|
| `canonical` og/eller `og:url` i filen | 23 | Direkte aflaest |
| Arvet fra kilde-HTML via eksakt udtraeks-match | 17 | Se nedenfor |
| Webflow `data-wf-domain` + `w--current` | 5 | Domaene + sidens egen aktive navigation |
| Filens egen header (`rbq_llms.txt`) | 1 | `Site: https://rainbowrobotics.github.io/RBQ/` |
| Brodtekstlink (`rbqgh.html`) | 1 | Linker selv til sin egen `llms-full.txt` |
| **= verificeret** | **47** | |
| **Fejlside: svar-URL kendt, anmodet sti tabt** | **6** | 4 har `canonical` til `/404`; 2 har kun domaene |
| **Indicium, ikke bevis** (de to PDF'er) | **2** | Downloadlink i soesterfilen + PDF'ens egen fod |
| **Ingen URL — vaerktoej og testfil** | **3** | `x.js`, `pdf.js`, `x.txt` |
| **= ukendt eller svagere** | **11** | |

**De fire Shopify-404'er taeller som ukendt, selv om de har et `canonical`.** Det
`canonical` peger paa `/404` og beviser, hvad **svaret** var — ikke hvad der blev
**spurgt om**. Det er praecis den forskel, R2 findes for.

**De 17 udtraeks-parringer er maalt, ikke antaget.** Jeg koerte mappens egen `x.js` forfra
paa alle 35 HTML-filer og sammenlignede hver `.txt` mod alle 35 resultater. Hver eneste
`.txt` matchede **praecis én** HTML eksakt. Ingen tvetydige og ingen uparrede — bortset fra
`rbq_llms.txt` (selvstaendigt hentet) og `x.txt` (testfil), som begge korrekt gav
"ingen kilde-HTML".

### De 6 fejlsider

| Fil | Hvad | Kendt foer? |
|---|---|---|
| `petoi_shop.html` | Petoi Shopify-404 | ja |
| `p_838e03.html` | Petoi Shopify-404 | ja |
| `s_9c6633.html` | Petoi Shopify-404, byte-identisk med ovenstaaende | ja |
| `p_c6f6fc.html` | GitBook/Next.js-404 paa `docs.petoi.com` | ja |
| `s_61c509.html` | MangDang Shopify-404 | ja (KILDEKORT-D, tabel 1.2) |
| `ghost_s40.html` | **Webflow-404 under et navn, der lover Spirit 40** | nej — kritikeren |

**Der er ingen syvende.** Gennemgangen var udtoemmende, ikke stikproevevis: jeg strimlede
**alle 35 HTML-filer** med `x.js`, maalte den renderede teksts laengde og soegte hele
saettet igennem for `page not found`, `404`, `403`, `forbidden`, `access denied`,
`just a moment`, `captcha`, `unavailable` og `maintenance`.

**To kandidater blev afvist ved at laese konteksten**, og de er vaerd at kende, fordi et
naivt `grep` ville have talt dem med:

- `p_1cb5f2.html` — traeffer paa `"notfound_title":"Page not found"`. Det er GitBooks
  **i18n-skabelon** i JS-bundtet, ikke sidens indhold. Filen er Doc Center-forsiden.
- `rbqgh.html` — traeffer paa `"notFound":{"title":"PAGE NOT FOUND"}`. Det er VitePress'
  **temakonfiguration**. Filen er dokumentationsforsiden.

Samme klasse af falske positiver: `nyq.html` traeffer paa "403" (det er `403 to 433 grams`),
og `rbq10.html` paa "unavailable" (cookiebanner).

### Rettelserne

19 poster: de 17 fra kildekortene, plus post 18 (MAB's IP-modsigelse, som KILDEKORT-D foerte
som observation) og post 19 (Boston Dynamics' hjemby, som **intet** kildekort har rejst).

Hver enkelt er efterproevet **mod raafilen**, ikke mod kildekortet. Soegeudtryk og
traefantal er gengivet ved hver post, saa enhver kan koere dem efter.
**0 af de 17 viste sig forkerte.**

---

## Selv-review — hvad jeg er usikker paa

### Filer jeg ikke kunne koble til en fuld URL, og hvad jeg proevede

**Seks — alle seks fejlsider.** For hver af dem kender jeg *domaenet* og *svaret*, men ikke
den **anmodede sti**. Det er derfor, de taeller som "ukendt" i tabellen ovenfor:

1. **`ghost_s40.html`.** Proevet: `canonical`, `og:url`, `data-wf-domain` (giver
   `www.ghostrobotics.io`), og — det nye greb — Webflows `w--current`. Sidstnaevnte virkede
   paa alle fem oevrige Webflow-sider, **men ikke paa denne**: en 404-side har intet
   navigationslink, der matcher, saa ingen faar klassen. Fravaeret er i sig selv
   bekraeftende for, at det er en 404, men det efterlader stien tabt.
   Understoettende: `grep -ril "spirit-40|spirit 40|Spirit40"` over **hele mappen** (58
   filer) → **0 filer**. Ghost Robotics omtaler ikke Spirit 40 nogen steder i materialet.
2. **`p_c6f6fc.html`.** Proevet: `pathname`, `basePath`, `segment`, `route`, `href`, `url` i
   RSC-nyttelasten, alle absolutte `docs.petoi.com`-links, og `~gitbook/__evt`-parametrene.
   `basePath` er `"/"`, og de eneste stier i filen er navigationens egne. **Jeg tror ikke,
   den kan genskabes** — men jeg kan ikke udelukke, at den ligger i et af de komprimerede
   RSC-fragmenter, jeg kun har `grep`'et i, ikke parset. Det ville kraeve, at man udfolder
   Next.js' flight-format.
3. **`petoi_shop.html`, `p_838e03.html`, `s_9c6633.html`** (Petoi) **og `s_61c509.html`**
   (MangDang). Shopify skriver kun `pageurl: .../404`; den anmodede sti findes ikke i
   svaret. Sidernes egne reqid-stempler viser, at nogen bad om en **Petoi**-butiks-URL to
   gange — 07:20:43Z og 07:26:32Z, knap seks minutter fra hinanden — og at begge fejlede.
   Det andet svar blev gemt under to filnavne. **Vi ved ikke, hvilken URL der blev bedt om.**
   Filnavnet `petoi_shop.html` er et gaet fra den, der navngav filen, ikke fra data.

### Hvor jeg kan tage fejl

- **Fejl 1 (`Gigabit`) er den, jeg er mindst sikker paa.** Den hviler paa, at PDF'ens
  tekststroem foelger den visuelle gruppering — ikke garanteret i en PDF. Jeg staar ved
  konklusionen, fordi `passthrough to robot` er selvforklarende og `Gigabit` slet ikke
  findes i K1. Men **et menneske boer se PDF-siden**.
- **De to PDF'ers identitet er sandsynliggjort, ikke bevist.** Ingen af dem har metadata med
  en kilde-URL. Manifestet skriver `INDICIUM, ikke bevis` i klartekst. Uden hentelog kan jeg
  ikke udelukke, at en fil er en anden revision end den, der ligger paa URL'en i dag.
  `Updated: 05/22/2024` er PDF'ens **eget** stempel, ikke en hentedato.
- **Fejl 13's taelleregel er en fortolkning, jeg ikke har afgjort.** At
  `Is Bittle X waterproof? No.` udfylder feltet **IP-klasse** foelger FUND-vest' egen metode
  og regel 10 — men *"ikke vandtaet"* er ikke en IP-kode. Om det skal vaere et selvstaendigt
  felt, er en beslutning for CEO'en. **Uanset hvad der besluttes, skal Bittle v1 og
  Bittle X behandles ens**, og det goer de ikke i dag.
- **Fejl 12 er nedtoning, ikke modbevis.** Jeg har ikke vist, at der *findes* en Bex-side —
  kun at forsiden ikke er bevis for, at der ikke goer. De seks produktindgange er stadig
  ikke hentet.

### Hvad jeg har rettet i kildekortenes egen kortlaegning

To praeciseringer, som ikke er blandt de 19, men som staar i `MANIFEST.tsv`:

1. **KILDEKORT-D angiver `<title>insta_1</title>` for `p_838e03.html` og `s_9c6633.html`.**
   Det er ikke dokumentets titel. Maalt med byteforskydning: dokumenttitlen staar paa
   **offset 5832** og lyder `404 Not Found &ndash; Petoi`; `insta_1` staar paa **offset
   271706** og er en `<title>` inde i en indlejret SVG i sidens brodtekst. Identifikationen
   (404-side) er rigtig; det citerede bevis var det forkerte tag. *(Aarsagen er kendt: et
   linjebaseret `grep` kan ikke se et `<title>`, der er brudt over to linjer, og finder
   derfor det foerste, der staar paa én.)*
2. **KILDEKORT-D's forbehold om `rivr_tech.html` er nu overfloedigt.** Se rammen under
   fejl 17.

### Hvad jeg ikke naaede, og hvad jeg bevidst sprang over

- **Jeg har ikke efterproevet FUND-vest' taethedstaellinger felt for felt** ud over de seks,
  fejl 4 rejser, og de fire Petoi-tal i fejl 13. Jeg har kontrolleret, at *procenterne er
  regnet rigtigt*, ikke at *antallet af udfyldte felter er rigtigt*. Det er den dyre retning.
- **Jeg har ikke gaaet den anden vej** — fra hver talstreng i raafilerne til skemaet — for at
  finde felter, FUND-vest har **overset**. Kildekortene faldt over fire (ANYmals `2 km`
  raekkevidde, pan-tilt-enheden paa ANYmal, MAB 5.0's `two onboard computers` og
  `5G Wi-Fi or Optic Fibre`). **En fuld gennemgang ville sandsynligvis finde flere.**
- **Jeg har ikke hentet noget fra nettet.** Alt hviler paa det lokale raamateriale. De fire
  404'er kan derfor ikke opklares herfra.
- **Jeg har ikke aabnet MangDangs specifikationsbillede.** Jeg har bevist, at der ikke er tal
  i teksten, og at `<img>`-elementet har **tom `alt`** — men billedet ligger paa MangDangs
  CDN, ikke i raamappen, saa jeg kan ikke bekraefte, hvad det indeholder.
- **`http_status` er `ukendt` for alle 58.** Det er ikke en mangel ved gennemgangen, men ved
  indsamlingen: ingen HTTP-header blev gemt. Jeg har **ikke** udledt `404` af indholdet paa
  de seks fejlsider, fordi en 404-*side* kan serveres med status 200. Se `LÆSMIG.md`.

### Det fund, jeg mener er vigtigere end de 19

**`hentet_utc` i manifestet er ikke et hentetidspunkt.** Det er filens mtime, og mtime er
her et **kopieringstidspunkt**. Maalt:

- Alle 58 filer har mtime **og** birthtime inden for **0,475 sekund** af hinanden
  (2026-08-19T07:44:19Z). 58 sider kan ikke hentes paa et halvt sekund.
- Tolv af siderne baerer serverens **eget** tidsstempel i Shopifys `__st.reqid`. De spaender
  fra **07:20:43Z til 07:27:31Z** — knap syv minutter, der slutter **17 minutter foer**
  mtime.

Kolonnen er altsaa en **oevre graense**, ikke en maaling. Jeg har skrevet det i `LÆSMIG.md`
sammen med de to andre regler, sagen laerer: gem en `curl`-hentelog med statuskode og
`Date`-header, og markér fejlsider frem for at slette dem.

**Det raekker ud over vest-saettet.** De oevrige syv raamapper har manifester — men hvis
deres `hentet_utc` er udfyldt paa samme maade, baerer de samme forbehold, og det staar
ikke i dem. **Det boer nogen se efter.** Jeg har ikke gjort det: de mapper er ikke mine.
