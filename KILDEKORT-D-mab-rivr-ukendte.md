# KILDEKORT D — MAB, RIVR og de otte ukendte råfiler

Agent D. 19. aug 2026. **Ren læsning.** Ingen fil i repoet er ændret, flyttet eller slettet.
Ingen git-commit. Denne rapport ligger i scratchpad, ikke i repoet.

Kilde: `c:\Praktik\websites\udstilling\media\_kilder\raa-vest-2026-08-19\` (58 filer,
gitignoreret). Intet herfra er kopieret ind i repoet eller citeret ud over de tal og
sætninger, efterprøvningen kræver.

---

## Regel 0 — skill-vurdering

**Valgt: `robotdata`** (projektets egen, `.claude/skills/robotdata/SKILL.md`). Kaldt med
Skill-værktøjet, og **den indlæste normalt** — ingen `Unknown skill`, intet disk-fallback.
Den bærer de ti hårde regler, og fire af dem er direkte i spil her: regel 2 (kilde + dato
på hvert tal), regel 4 (bevar operator — `up to`, `over`), regel 5 (bevar intervaller —
`13-50 cm`, `2–3 hours`) og regel 6 (nyttelast er to felter).

**Gået forbi:**

| Skill | Hvorfor ikke |
|---|---|
| `parallelt` | Jeg *er* en af de parallelle agenter. Skillen bruges af den, der deler arbejdet ud, ikke af sporet |
| `impeccable`, `critique`, `ui-ux-critique`, `dataviz` | Der er ingen bygget flade at vurdere. Opgaven er kildekritik af råmateriale |
| `new-project`, `code-review`, `simplify` | Der er ingen kode i projektet endnu |

---

# DEL 1 — De otte ukendte filer

## 1.1 Hash-tælling over hele mappen

`md5sum *` på alle 58 filer, sorteret. **Præcis én dublet-gruppe findes i hele mappen:**

| md5 | Filer |
|---|---|
| `768306a78d5a63ed362b43a9ce1e51b0` | **`p_838e03.html`** og **`s_9c6633.html`** — byte-identiske |

De øvrige 56 filer har hver sin unikke md5. Ingen anden dublet, hverken blandt mine 17
eller i resten af mappen.

## 1.2 Identifikation — alle otte

Fremgangsmåde pr. fil: `<title>`, `<link rel="canonical">`, `og:url`, absolutte links i
filens egen HTML, og for GitBook-siderne den indlejrede RSC-nyttelast.

| Fil | Bytes | Producent | Model / indhold | Sidetype | Kilde-URL (fra filens eget indhold) |
|---|---|---|---|---|---|
| `1101b7e2.html` | 661.647 | ANYbotics | ANYmal (Gen D) | Produktside | `https://www.anybotics.com/robotics/anymal/` |
| `25d42ffc.html` | 660.260 | ANYbotics | ANYmal X | Produktside | `https://www.anybotics.com/robotics/anymal-x/` |
| `b9c7fcb9.html` | 619.095 | ANYbotics | — (produktoversigt) | Kategori/hub-side | `https://www.anybotics.com/robotics/` |
| `p_1cb5f2.html` | 604.719 | Petoi | Bittle / Bittle X / Nybble | Dokumentationsforside | `https://docs.petoi.com` |
| `p_c6f6fc.html` | 201.172 | Petoi | — | **GitBook-fejlside (404)** | `docs.petoi.com/<ukendt sti>` — stien står ikke i filen |
| `p_838e03.html` | 339.709 | Petoi | — | **Shopify-fejlside (404)** | `https://www.petoi.com/404` |
| `s_9c6633.html` | 339.709 | Petoi | — | **Shopify-fejlside (404)** | `https://www.petoi.com/404` — byte-identisk med `p_838e03.html` |
| `s_61c509.html` | 231.114 | MangDang | — | **Shopify-fejlside (404)** | `https://mangdang.store/404` |

**Otte af otte identificeret** for producent og sidetype. **Syv af otte** har en fuld
kilde-URL i filen selv; den ottende (`p_c6f6fc.html`) kan kun stedfæstes til domænet — se
1.5.

Beviserne, ordret som de står i filerne:

```
1101b7e2.html   <title>ANYmal - Autonomous Robotic Inspection Solution - ANYbotic</title>
                rel="canonical" href="https://www.anybotics.com/robotics/anymal/"
25d42ffc.html   <title>ANYmal X - Ex-proof inspection robot - ANYbotics</title>
                rel="canonical" href="https://www.anybotics.com/robotics/anymal-x/"
b9c7fcb9.html   <title>Automate industrial inspection with ANYmal - ANYbotics</title>
                rel="canonical" href="https://www.anybotics.com/robotics/"
p_1cb5f2.html   <title>Welcome to Petoi Doc Center for Bittle, Bittle X &amp; Nybble | Petoi Doc Center</title>
                rel="canonical" href="https://docs.petoi.com"
p_838e03.html   <title>insta_1</title>   canonical + og:url = https://www.petoi.com/404
s_9c6633.html   <title>insta_1</title>   canonical + og:url = https://www.petoi.com/404
s_61c509.html   <title>404 Not Found &ndash; MangDang</title>   canonical = https://mangdang.store/404
p_c6f6fc.html   <title>Petoi Doc Center</title>   html id="__next_error__", meta robots=noindex
```

## 1.3 Det særlige spor: tre filer på nøjagtig 339.709 bytes

`petoi_shop.html`, `p_838e03.html` og `s_9c6633.html` har samme størrelse. **Svaret er
begge dele på én gang** — og det er værre end hypotesen i opgaven.

**Alle tre er den samme Shopify-fejlside, `https://www.petoi.com/404`.** Hentningen er
landet på 404 tre gange. Men de er ikke tre kopier af én hentning:

- `p_838e03.html` og `s_9c6633.html` er **byte-identiske** (samme md5).
- `petoi_shop.html` har **en anden md5** (`93e33f08…`) trods samme størrelse.

`cmp -l petoi_shop.html p_838e03.html` giver **6.688 afvigende bytes**. De ligger i
sessionsafhængige felter. Beviset står i Shopifys eget `__st`-objekt:

```
petoi_shop.html : "reqid":"f62e7cbe-14a1-4d03-a91b-5a54ed592482-1787124043", "u":"a18e61a13c19"
p_838e03.html   : "reqid":"929652b7-2874-431f-b125-6dfb8b8e88f7-1787124392", "u":"927fc3532988"
s_9c6633.html   : "reqid":"929652b7-2874-431f-b125-6dfb8b8e88f7-1787124392", "u":"927fc3532988"
```

Alle tre har `"pageurl":"www.petoi.com\/404"`. Tidsstemplerne i reqid'et er unix-sekunder:

| Fil | reqid-tidsstempel | UTC |
|---|---|---|
| `petoi_shop.html` | 1787124043 | 2026-08-19 **07:20:43** |
| `p_838e03.html` | 1787124392 | 2026-08-19 **07:26:32** |
| `s_9c6633.html` | 1787124392 | 2026-08-19 **07:26:32** (samme svar som ovenfor) |

**Konklusion:** to selvstændige HTTP-anmodninger, 5 min 49 s fra hinanden, begge til en
Petoi-URL der ikke findes. Det ene svar blev gemt to gange under to filnavne. Størrelsen
er ens, fordi Shopifys 404-skabelon har fast længde: reqid og token er hex-felter med fast
bredde, så et nyt svar fylder præcis lige så meget som det forrige.

**Det farlige er navnet.** `petoi_shop.html` ligner en Petoi-butiksside. Den *er* en
fejlside. En læser, der åbnede den for at finde en pris, ville finde nul — og ikke kunne
se forskel på "producenten oplyser ikke prisen" og "vi hentede den forkerte URL". Det er
regel 10's tre tilstande, brudt allerede i råmaterialet.

## 1.4 `p_`- og `s_`-præfikserne

Der er **to** navngivningsordninger i mappen, ikke én:

- **8 hex-tegn uden præfiks** (`1101b7e2`, `25d42ffc`, `b9c7fcb9`) — alle tre er
  `anybotics.com`.
- **Præfiks + 6 hex-tegn** (`p_1cb5f2`, `p_838e03`, `p_c6f6fc`, `s_61c509`, `s_9c6633`) —
  Petoi og MangDang.

Præfikserne er konsistente med, at **`p_` = Petoi-domæne** (`docs.petoi.com` ×2,
`www.petoi.com` ×1) og **`s_` = shop/butiks-domæne** (`mangdang.store` ×1,
`www.petoi.com`-butikken ×1). Overlappet forklarer dubletten: Petois butik er *både*
Petoi og en shop, så samme svar blev lagt ned under begge præfikser — deraf de
byte-identiske `p_838e03.html` og `s_9c6633.html`.

**Forbehold:** det er en slutning fra fem filer, ikke en dokumenteret regel. Der findes
ingen manifest-fil i mappen. Hex-delen er **ikke** en hash, jeg kunne genskabe: jeg testede
md5, sha1, sha256 og crc32 af URL'erne i flere former (med/uden skema, med/uden afsluttende
skråstreg) — **nul træf**. Den er heller ikke et præfiks af filens egen md5 (`1101b7e2.html`
har md5 `f83dff0e…`). Hex-navnene er altså **uigenkaldeligt uigennemsigtige**: de kan ikke
regnes tilbage til en URL, kun aflæses af filens indhold. Held, at indholdet bar canonical.

## 1.5 `p_c6f6fc.html` — den ene jeg ikke kunne stedfæste helt

Filen er GitBooks Next.js-fejlside: `<html … id="__next_error__">`, `meta robots=noindex`,
og i RSC-nyttelasten står `"notFound":[["$","title",null,{"children":"404: This page could
not be found."}]…`. Sidens navigationstræ er docs.petoi.com's (`getting-started-guide`,
`faq-frequently-asked-questions`, `petoi-robot-joint-index/joint-pins-on-nyboard/bittle` …),
og `eventUrl` er `https://docs.petoi.com/~gitbook/__evt?o=-M-_eWZUjFA4usjshHcZ&s=site_6kiTN`.

Så: **en 404 på `docs.petoi.com`.** Hvilken sti der blev bedt om, står ikke nogen steder i
filen. Jeg søgte efter `pathname`, `basePath`, `segment`, `route`, `href`, `url` og efter
absolutte `docs.petoi.com`-links; `basePath` er `"/"`, og de eneste stier i filen er
navigationens egne. Det er ikke muligt at genskabe. **Det er præcis den skade,
LÆSMIG.md's navngivningsregel findes for at forhindre.**

## 1.6 Hvad de otte skulle have heddet

LÆSMIG.md: `<producent>-<model>-<hvad>-<hentedato>.<ext>`. Reglen har ingen felt for
"fejlside" og intet felt for "ikke en bestemt model", så de fire 404-filer kan strengt
taget ikke navngives efter den. Forslagene nedenfor bøjer `<model>`-feltet til `intet`
eller udelader det, og markerer fejlsiderne eksplicit — ellers ville et filnavn påstå, at
filen indeholder data, den ikke har.

| Fil i dag | Skulle have heddet |
|---|---|
| `1101b7e2.html` | `anybotics-anymal-produktside-2026-08-19.html` |
| `25d42ffc.html` | `anybotics-anymal-x-produktside-2026-08-19.html` |
| `b9c7fcb9.html` | `anybotics-produktoversigt-2026-08-19.html` |
| `p_1cb5f2.html` | `petoi-doccenter-forside-2026-08-19.html` |
| `p_c6f6fc.html` | `petoi-doccenter-404-fejlside-2026-08-19.html` |
| `p_838e03.html` | `petoi-shop-404-fejlside-2026-08-19-0726.html` |
| `s_9c6633.html` | **slettes** — byte-identisk dublet af ovenstående |
| `s_61c509.html` | `mangdang-shop-404-fejlside-2026-08-19.html` |
| *(bonus)* `petoi_shop.html` | `petoi-shop-404-fejlside-2026-08-19-0720.html` |

De to Petoi-404'er har brug for et klokkeslæt i navnet, ikke bare en dato, fordi de er to
hentninger samme dag af samme URL. Det er et hul i LÆSMIG.md's regel, der er værd at
notere: **datoen alene kan ikke skille to hentninger, og det er netop ved gentagne
hentninger, man har brug for at kunne det.**

## 1.7 `.txt`-filerne — hvilke hører sammen med hvilke

`x.js` i mappen er tekstudtrækkeren (fjerner `<script>`/`<style>`/kommentarer, gør blok-tags
til linjeskift, afkoder entiteter, folder gentagne linjer sammen). Jeg kørte den på hver
kandidat-HTML og `diff`'ede mod hver `.txt`. **Nul afvigende linjer = eksakt match:**

| `.txt` | Kilde-HTML | diff-linjer |
|---|---|---|
| `mab.txt` | `mab.html` | **0** |
| `mab5.txt` | `mab5.html` | **0** |
| `rivr.txt` | `rivr.html` | **0** |
| `rivrp.txt` | `rivr_product.html` | **0** |
| `anymal.txt` | **`1101b7e2.html`** | **0** |
| `anymalx.txt` | **`25d42ffc.html`** | **0** |

Alle øvrige kombinationer gav 52-282 afvigende linjer. De to sidste rækker er et
uafhængigt bevis for identifikationen i 1.2: de pænt navngivne ANYbotics-tekstudtræk er
lavet af netop de to hash-navngivne HTML-filer.

**Uden udtræk:** `rivr_tech.html` og `b9c7fcb9.html`. Ingen `.txt` i mappen svarer til dem.

---

# DEL 2 — Efterprøvning af FUND-vest

## 2.1 MAB Honey Badger 5.0 (afsnit 7) — filer `mab5.html` / `mab5.txt`

`mab5.html` har `rel="canonical" href="https://www.mabrobotics.pl/honey-badger-5"` — det
er K10, som FUND-vest angiver. Specifikationstabellen står ordret sådan i udtrækket:

```
Specification
Physical dimensions      50 x 30 x 13-50 cm
Weight                   17 kg
Payload                  up to 5 kg
Battery runtime          up to 2 hours
Communication            5G Wi-Fi or Optic Fibre
Ingress Protection       IP66
Operating temperature    0-45°C
Control device           PC/Remote controller
```

| # | FUND-vest påstår | Søgeudtryk | Fil | Træf | Dom |
|---|---|---|---|---|---|
| 1 | `17 kg` | `grep -c -F "17 kg"` | `mab5.html` | 1 | ✔ |
| 2 | `50 x 30 x 13-50 cm` | `grep -c -F "50 x 30 x 13-50 cm"` | `mab5.html` | 1 | ✔ |
| 3 | `up to 5 kg` | `grep -c -F "up to 5 kg"` | `mab5.html` | 1 | ✔ |
| 4 | `IP66` | `grep -c -F "IP66"` | `mab5.html` | 5 | ✔ |
| 5 | `0-45°C` | `0-45&deg;C` i rå-HTML | `mab5.html` | 1 | ✔ |
| 6 | `up to 2 hours` | `grep -c -F "up to 2 hours"` | `mab5.html` | 1 | ✔ |
| 7 | **Intet om CE på siden** | se nedenfor | `mab5.html` | 0 | ✔ |
| 8 | VAT `PL7822870297` | `grep -c -F "PL7822870297"` | `mab5.html` | 1 | ✔ |
| 9 | Poznań-adresse | `grep -c -F "Za Cytadelą 108"` | `mab5.html` | 2 | ✔ |

Om #5: `°` står som HTML-entiteten `&deg;` i råfilen; `x.js` afkoder den. `&deg;` optræder
**præcis én gang** i hele filen, i strengen
`<span class="wixui-rich-text__text">0-45&deg;C</span>`. FUND-vests gengivelse `0-45°C` er
korrekt.

**Om #7 — CE-påstanden er den vigtigste, så den er efterprøvet både positivt og negativt.**

```
grep -o -E '\bCE\b' mab5.html | wc -l   ->  0
grep -o -E '\bCE\b' mab.html  | wc -l   ->  0
```

Nul ordgrænse-træf i 1,48 MB henholdsvis 1,55 MB HTML. Bredere sweep, begge MAB-filer:
`conformity` 0 · `Conformity` 0 · `declaration` 0 · `Declaration` 0 · `certif*` 0 ·
`EN ISO` 0 · `RoHS` 0 · `ATEX` 0 · `UKCA` 0 · `FCC` 0.

**Positiv kontrol, så nul-resultatet ikke bare er en søgning der ikke virker:** samme
udtryk på `1101b7e2.html` (ANYmal) giver **1** træf, og det er
`<p>FCC, CE and Anatel compliant</p>` — netop den sætning, DATAMODEL.md's F6 bygger på.
Søgemetoden virker. MAB-siderne siger intet om CE.

*(De 50-51 rå `CE`-forekomster i filerne er alle inde i ord — `SERVICE`, `SPACE`,
CSS-klasser. Derfor `\b`.)*

**FUND-vests EU-pointe holder**, og efterprøvningen skærper den: den eneste EU-producent i
indsamlingen nævner ikke bare CE — den nævner **ingen** overensstemmelsesmærkning
overhovedet, mens den amerikansk-europæiske ANYbotics-side lister tre. `CE oplyst = nej`
kan altså ikke læses som en oplysning om produktet.

## 2.2 MAB Honey Badger 4.0 (afsnit 7b) — filer `mab.html` / `mab.txt`

`mab.html` har `rel="canonical" href="https://www.mabrobotics.pl/honey-badger"` — K11.

| # | FUND-vest påstår | Søgeudtryk | Fil | Træf | Dom |
|---|---|---|---|---|---|
| 10 | `12 kg` | `grep -c -F "12 kg"` | `mab.html` | 1 | ✔ |
| 11 | `60 x 40 x 15-50 cm` | `grep -c -F "60 x 40 x 15-50 cm"` | `mab.html` | 1 | ✔ |
| 12 | `up to 4 kg` | `grep -c -F "up to 4 kg"` | `mab.html` | 1 | ✔ |
| 13 | `up to IP67` | `grep -c -F "up to IP67"` | `mab.html` | 1 | ✔ |
| 14 | `0-40°C` | `0-40&deg;C` i rå-HTML | `mab.html` | 1 | ✔ |
| 15 | `up to 2 hours` | `grep -c -F "up to 2 hours"` | `mab.html` | 1 | ✔ |
| 16 | Udgåetsætningen med stavefejlen | `grep -c "officialy"` | `mab.html` | 1 | ✔ |
| 17 | Garantisætningen | `grep -c -F "support your existing HB4.0 robot"` | `mab.html` | 1 | ✔ |

**#16 — stavefejlen "officialy" findes.** Ordret fra `mab.html`, med den omgivende markup:

```html
<h2 class="font_2 wixui-rich-text__text">With the launch of the new version, sales of the
Honey Badger 4.0 have officialy come to an end.&nbsp;<br class="wixui-rich-text__text">
Don&#39;t worry, we&#39;ll support your existing HB4.0 robot during the warranty period.</h2>
```

`grep -c "officialy"` giver 1; `grep -c "officially"` er ikke relevant, da FUND-vest
citerer producentens stavemåde. **Citatet er korrekt gengivet**, inklusive fejlen. Eneste
afvigelse er et efterfølgende `&nbsp;`, som FUND-vest med rette udelader.

## 2.3 RIVR ONE (afsnit 8) — filer `rivr.html`, `rivr_product.html`, `rivr_tech.html`

De tre RIVR-filer er Webflow-sider **uden** `canonical` og **uden** `og:url`.
Identifikationen hviler på `<title>` og `data-wf-page`:

| Fil | `<title>` | `data-wf-page` | Antaget URL |
|---|---|---|---|
| `rivr.html` | `RIVR` | `6995f95296e9202363ff356f` | `https://www.rivr.ai/` (K9) |
| `rivr_product.html` | `Product \| RIVR` | `67b852a4c31ffc841cb214e1` | `https://www.rivr.ai/product` (K8) |
| `rivr_tech.html` | `Technology \| RIVR` | `67b852b60eae0de15a909d6d` | `https://www.rivr.ai/technology` — **ingen K-nøgle** |

| # | FUND-vest påstår | Søgeudtryk | Fundet i | Dom |
|---|---|---|---|---|
| 18 | `over 30 kg of parcels, groceries, and food` | `grep -c "over 30 kg"` | `rivr_product.html` (1) | ✔ |
| 19 | `up to 14 km/h (8.7 mph)`, kilde **K8, K9** | `grep -c "14 km/h"` / `"8.7 mph"` | `rivr_product.html` (1/1), **`rivr.html` 0/0** | ✘ **kildefejl** |
| 20 | `recharges in just 2–3 hours` | `find("recharges in just")` | `rivr_product.html` | ✔ |
| 21 | `over 30 km of range` | `grep -c "over 30 km"` | `rivr_product.html` (1) | ✔ |
| 22 | `5x the battery life…`, kilde **(K9, teknologisiden)** | `grep -c "5x the"` / `"10x the"` | **`rivr_tech.html`** (1/1), `rivr.html` 0/0 | ✘ **kildefejl** |
| 23 | Alle øvrige 28 felter ikke oplyst | negativsøgning, se nedenfor | — | ✔ |

Ordret fra `rivr_product.html`:

```
Moves at more than twice the speed of a walking person and can reach up to 14 km/h
(8.7 mph) when needed, ensuring quick deliveries.

Securely carries over 30 kg of parcels, groceries, and food—matching the weight limits of
all non-bulky parcel carriers, food deliveries, and grocery purchases.

Matches a delivery driver's shift with over 30 km of range and recharges in just 2–3 hours
for the next round.
```

Tankestregen i `2–3` er **U+2013** (en dash), verificeret med Python. FUND-vests gengivelse
er tegnnøjagtig.

Ordret fra `rivr_tech.html`, med den overskrift den står under:

```html
<h3 class="lead medium bottom-4">Efficiency of wheels</h3>
<div … class="p-14">5x the battery life and speed, with 10x the coverage of traditional
legged robots.</div>
```

**#23, negativsøgningen.** Tre RIVR-sider gennemsøgt for `IP\d\d`, `\d+ ?kg`, `\d+ ?(mm|cm)`,
`\d+ ?Wh`, `degrees of freedom|DoF`:

| Fil | IP-klasse | kg | mm/cm | Wh | DoF |
|---|---|---|---|---|---|
| `rivr_product.html` | 0 | 1 (kun `over 30 kg`) | 0 | 0 | 0 |
| `rivr_tech.html` | 0 | 0 | 0 | 0 | 0 |
| `rivr.html` | 0 | 0 | 0 | 0 | 0 |

*(Ét falsk `DoF`-træf på produktsiden viste sig at være bogstaverne i `handoff`.)*

FUND-vests påstand om, at RIVR kun oplyser tre felter, holder. Der er **ingen** vægt, mål,
IP-klasse, batteristørrelse eller frihedsgrader nogen af de tre steder.

## 2.4 De to fejl, ordret hvad der er galt

**FEJL 1 — `maks. hastighed` er tilskrevet en kilde, der ikke indeholder tallet.**
FUND-vest linje ~570 angiver kilde `K8, K9` for `up to 14 km/h (8.7 mph)`. K9 er
`https://www.rivr.ai/` (forsiden) = `rivr.html`. Den fil indeholder **nul** forekomster af
`14 km/h` og **nul** af `8.7 mph`. Hele forsidens tekst er 1.423 bytes og handler om
"General Physical AI through Doorstep Delivery" — ingen specifikationer overhovedet.
**Rettelse: kilden er K8 alene.**

**FEJL 2 — "5x-påstanden" er tilskrevet K9, men står på en side uden K-nøgle.**
FUND-vest skriver `(K9, teknologisiden)`. Parentesen modsiger sig selv: K9 er defineret i
Kilder-tabellen som *forsiden*, ikke teknologisiden. Strengen står i `rivr_tech.html`,
altså `https://www.rivr.ai/technology`, og **den URL findes ikke i Kilder-tabellen.**
Forfatteren har åbenbart vidst, hvilken side det var, og peget på den forkerte nøgle.
**Rettelse: teknologisiden skal have sin egen nøgle.**

Begge fejl er kildehenvisningsfejl, ikke talfejl. Alle 21 kontrollerede *værdier* er
korrekte. Men efter regel 2 i `robotdata` er et tal uden korrekt kilde ikke indsamlet — så
det er ikke kosmetik: en læser, der klikker K9 for at kontrollere 14 km/h, finder ingenting
og mister tilliden til hele posten.

## 2.5 Tre observationer, der ikke er fejl i FUND-vest, men bør noteres

**A. `mab.html` modsiger sig selv om IP-klassen.** Specifikationstabellen siger
`up to IP67`. Brødteksten på samme side siger to gange noget stærkere:

```
Honey Badger thrives in dust, water and wide temperature range thanks to durable and
IP67-rated construction.
… its IP67-rated waterproof construction, combined with MAB advanced actuators, adds a
unique capability …
```

`IP67` optræder 6 gange i filen, hvoraf kun **1** er `up to IP67`. FUND-vest gemmer med
rette den forsigtige tabelværdi med operatoren bevaret (regel 4), men **modsigelsen på
producentens egen side er ikke noteret** — og den er af samme slags som RBQ-10's og
Bittle X's interne modsigelser, som FUND-vest *har* eget afsnit til. Bør ind på 4.0-posten
som en `note`.

**B. Tre kilder er hentet, men står ikke i Kilder-tabellen.** `https://www.rivr.ai/technology`
(`rivr_tech.html`), `https://docs.petoi.com` (`p_1cb5f2.html`) og
`https://www.anybotics.com/robotics/` (`b9c7fcb9.html`). Grep i fund/FUND-vest.md bekræfter:
`docs.petoi` giver nul træf, tabellen har kun `/robotics/anymal/` og `/robotics/anymal-x/`.
Petois dokumentationssite er producentens eget og dermed primærkilde — det er præcis den
type kilde, DATAMODEL.md's **D1** stiller spørgsmålet om. At den er hentet uden at være
registreret, gør D1 sværere at afgøre, ikke lettere.

**C. Fire af mine 17 filer er fejlsider uden data.** `petoi_shop.html`, `p_838e03.html`,
`s_9c6633.html`, `p_c6f6fc.html`. De udgør 1,1 MB råmateriale, der intet dokumenterer,
og hvoraf én (`petoi_shop.html`) bærer et navn, der lover det modsatte.

---

## Efterprøvning med tælling

Slået op ordret i råfilerne, felt for felt, med søgeudtrykket noteret pr. påstand:

- MAB Honey Badger 5.0: **9** påstande (6 specfelter + CE-negativ + VAT + adresse)
- MAB Honey Badger 4.0: **8** påstande (6 specfelter + 2 ordrette citater)
- RIVR ONE: **6** påstande (4 værdier + 2 kildehenvisninger), plus en negativsøgning på
  5 feltklasser × 3 filer

Råfiler åbnet og søgt i: `mab.html`, `mab5.html`, `mab.txt`, `mab5.txt`, `rivr.html`,
`rivr.txt`, `rivr_product.html`, `rivrp.txt`, `rivr_tech.html`, `1101b7e2.html`
(positiv CE-kontrol), `25d42ffc.html`, `b9c7fcb9.html`, `p_1cb5f2.html`, `p_c6f6fc.html`,
`p_838e03.html`, `s_9c6633.html`, `s_61c509.html`, `petoi_shop.html`, `anyspec.html`,
`anymal.txt`, `anymalx.txt`, `x.js` — samt `md5sum` på alle 58.

**Efterprøvet 23 påstande i 22 råfiler, fandt 2 fejl, identificerede 8 af 8 ukendte filer.**

*(Begge fejl er kildehenvisningsfejl i FUND-vest, ikke forkerte tal. Nul af 21 kontrollerede
værdier var forkerte. 7 af de 8 ukendte fik en fuld URL; den ottende kun et domæne.)*

---

## Selv-review — hvad jeg er usikker på

**1. `p_c6f6fc.html`'s oprindelige URL er tabt.** Jeg fastslog domænet (`docs.petoi.com`)
og at det er en GitBook-404, men ikke hvilken sti der blev bedt om. Jeg søgte efter
`pathname`, `basePath`, `segment`, `route`, `href`, `url` i RSC-nyttelasten, efter alle
absolutte `docs.petoi.com`-links, og efter `~gitbook/__evt`-parametrene. Intet af det bærer
den anmodede sti. **Jeg tror ikke, den kan genskabes fra filen** — men jeg kan ikke udelukke,
at den ligger i en af de ~40 komprimerede RSC-fragmenter, jeg kun har grep'et i, ikke
parset. Det ville kræve, at man udfolder Next.js' flight-format.

**2. Ligeledes for de to Petoi-shop-404'er.** Shopify skriver kun `pageurl: www.petoi.com/404`
— den *anmodede* sti findes ikke i svaret. Vi ved, at nogen bad om en Petoi-butiks-URL to
gange på seks minutter, og at begge fejlede. Vi ved ikke hvilken. Filnavnet `petoi_shop.html`
er det eneste spor, og det er et gæt fra den, der navngav filen, ikke fra data.

**3. `p_`/`s_`-teorien er en slutning, ikke et bevis.** Fem filer, ingen manifest.
Den passer, men jeg har ingen kilde, der siger, at det var meningen. Hvis nogen ved, hvilket
værktøj der hentede materialet, kan det afgøres på et minut — det kan jeg ikke.

**4. RIVR-filernes URL'er er ikke bevist, kun sandsynliggjort.** De tre Webflow-sider har
hverken `canonical` eller `og:url`. Jeg læner mig på `<title>` og navigationsstrukturen.
`rivr_tech.html` = `https://www.rivr.ai/technology` er **min rekonstruktion** ud fra
menupunktet "Technology"; siden siger det ikke selv. **Dette er et reelt hul i beviskæden
for FEJL 2** — jeg kan bevise, at strengen *ikke* står på `rivr.html`, og at `rivr.html`
er forsiden. Det er nok til at fastslå, at K9-henvisningen er forkert. Det er ikke nok til
at fastslå, hvad den rigtige URL så er.

**5. Jeg har ikke efterprøvet FUND-vests tæthedsberegninger.** 6/29 = 20,7 % og 3/29 = 10,3 %
regner rigtigt, og jeg har bekræftet, at der er 6 henholdsvis 3 udfyldte felter i tabellerne.
Men jeg har **ikke** gennemgået alle 29 felter for at kontrollere, at der ikke ligger en
syvende oplysning i brødteksten, som burde have talt med. For MAB 5.0 er der to kandidater,
FUND-vest selv nævner uden at tælle dem: `two onboard computers` (onboard compute, men uden
model) og `5G Wi-Fi or Optic Fibre` (dataporte?). Om de tæller, afhænger af **D4**, som
stadig er åben. Det er en reel usikkerhed i tætheden, ikke en fejl.

**6. Jeg har ikke åbnet de øvrige 41 filer i mappen** ud over `md5sum` og et par
canonical-opslag. Der kan ligge flere fejlsider eller flere unavngivne kilder, jeg ikke
har set. Dublet-tællingen dækker dog **alle 58**, og der er kun det ene par.

**7. Jeg har ikke efterprøvet, at `x.js`-udtrækket er tabsfrit.** Jeg brugte det til at
parre `.txt` mod `.html`, hvilket kun kræver, at det er deterministisk (det er det:
diff = 0). Men alle mine *tal*-opslag er lavet direkte i HTML'en, ikke i udtrækket, netop
fordi udtrækket kaster markup væk. `&mdash;` slipper for eksempel uafkodet igennem — det
ses i `mab5.txt`. Et tal gemt i et `alt`-attribut eller et billede ville jeg ikke have
fundet nogen af stederne.

**Hvad jeg sprang over:** Jeg har ikke forsøgt at hente nogen URL fra nettet — hele
efterprøvningen er sket mod det lokale råmateriale, som opgaven foreskrev. Jeg har heller
ikke rørt `bd_spec.pdf` eller `ghost_spec.pdf`; de hører til andre agenters bunker.
