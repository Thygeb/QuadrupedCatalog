# FUND-lysbyg.md — retning LYS oversat fra mockup til generator (spor/lysbyg)

Agentrapport for spor/lysbyg. Arbejdssted: worktree
`C:/Praktik/websites/udstilling-wt-lysbyg`, gren `spor/lysbyg`. Kontrakten var
`prototype/retning-lys/` (fire mockups + `lys.css` + `BEGRUNDELSE.md`, godkendt
af orkestratoren i flettebeskeden på commit 399ee5e) — læst i sin helhed fra
disk før noget blev skrevet, sammen med `DESIGN.md`, alle fem
`tools/skabelon/*.mjs`, `tools/build.mjs`, `assets/system.css` +
`generator.css`, `data/i18n/{da,en}.json`, `tests/koer.mjs`, `tools/skema.mjs`
og `tools/validate.mjs`.

Fire commits på `spor/lysbyg`:

| Commit | Del |
|---|---|
| `d63deec` | 1 — forsiden bliver teaseren |
| `77cf3ac` | 2 — kataloget grupperes i vægtklasse-sale I-IV |
| `4ffd0ca` | 3 — ny side /sammenligning/ |
| `49c9a4b` | 4 — robotsidens "vitrine" + navigation |

---

## Skill-vurdering

- **Ingen skill kaldt undervejs i selve byggeriet.** Opgaven var et fuldt
  specificeret agentbrief (kontraktfiler + eksplicitte krav), ikke en åben
  design- eller planlægningsopgave — `impeccable`s "shape"/"new-work"-spor
  hører til FØR mockuppen fandtes (commit 655b5d2/399ee5e), ikke i
  oversættelsen af en allerede godkendt retning.
- **`ui-ux-critique` fravalgt eksplicit**, selvom CLAUDE.md's tabel nævner den
  til "kritikrunder på en bygget side": jeg havde ikke adgang til en browser
  (se Playwright-afsnittet nedenfor), og en AI-prosa-/generisk-design-scanner
  uden mulighed for at SE siden ville have været en påstand om et resultat,
  jeg ikke kunne efterprøve. Retvisende at lade den stå til orkestratorens
  eget review, som CLAUDE.md selv antyder ("orkestratoren tager den visuelle
  del i sit review").
- **`parallelt` fravalgt**: jeg er selv den dedikerede agent for hele dette
  spor (tildelt egen worktree/gren af orkestratoren) og skulle ikke selv
  splitte arbejdet ud på flere subagenter — eksplicit i opgavebeskrivelsen
  ("Do the work directly — do not re-delegate").
- **`robotdata` fravalgt**: intet felt i `data/robots/` er tilføjet, ændret
  eller efterprøvet — den mappe var eksplicit fredet i opgaven. Jeg LÆSTE
  data (via `tools/validate.mjs`/`build.mjs`), men skrev intet i den.
- **`grillmig` fravalgt**: bruges før et brief sendes videre til en anden
  agent, eller før en åben beslutning låses i STATUS.md. Jeg sendte intet
  brief videre, og de beslutninger, jeg traf undervejs (se Afvigelser
  nedenfor), er redegjort her, ikke låst i STATUS.md af mig selv.
- **`supabase` og `supabase-postgres-best-practices` eksplicit vurderet og
  fravalgt** (bedt om i opgaven): intet i dette spor rører en database.
  Generatoren er statisk Node → HTML fra YAML-filer; der findes ingen
  Postgres, intet Supabase-projekt, ingen RLS, intet klientbibliotek at
  konfigurere. Fuldstændig irrelevant for opgaven.
- **`code-review`/`simplify` overvejet, ikke kaldt som selvstændig runde**:
  CLAUDE.md nævner dem "på generatoren, når den findes". Jeg lavede i stedet
  selv en gennemgang af mine egne ændringer (regel 5 i arbejdsformen) som del
  af selv-reviewet nedenfor, fremfor at hente en ekstra ekstern runde oven i
  den allerede krævede validate/build/tests/selv-tjek-kæde.
- **`new-project` irrelevant**: projektet er scaffoldet.

---

## Afvigelser fra kontrakten — hver enkelt begrundet

### 1. Katalogsiden fik IKKE en ny, separat URL `/katalog/`

Opgaven skrev "NY side: /katalog/" og forudsagde `2 nye sidetyper × 2 sprog =
177` sider (fra baseline 173). Jeg lod i stedet den EKSISTERENDE
`robotter/`-rute (`ctx.url.katalog`, `nav_katalog` = "Katalog" i begge
sprogfiler) bære den nye vægtklasse-sal-form. Begrundelse: `robotter/` var
allerede kodens og navigationens egen betegnelse for "kataloget" (variabelnavn
`url.katalog`, navnetekst "Katalog"/"Catalogue") — at bygge en PARALLEL side
på `/katalog/` ville enten kræve at gøre `/robotter/` forældreløs (stadig
bygget, ikke i navigationen, men stadig et fuldt HTML-katalog liggende der,
ubrugt) eller vise to forskellige "gennemse alle robotter"-oplevelser samtidig
på sitet. Begge dele er præcis den slags pladsholder/dobbeltsandhed, CLAUDE.md
advarer imod (`media/_kilder/LÆSMIG.md`s "en pladsholder overlevede til
lancering"; DESIGN.md's forbud mod to CSS-filer med samme tokennavne).

**Målt konsekvens:** `node tools/build.mjs` giver **175 sider**, ikke 177 — kun
ÉN ny sidetype (`/sammenligning/`), ikke to. Dette er skrevet frem som krævet
("skriv det målte tal"), ikke tilpasset til at ramme forudsigelsen.

### 2. Formålsfilterets STORE FLISER (`.formaal-gitter`) er ikke genskabt på katalogsiden

Opgaven sagde "Formålsfilteret ... flytter til katalogsiden". Katalogsiden
havde allerede en fungerende "Anvendelse"-facet (afkrydsningsfelter, samme
`:has()`-CSS-mekanik som de fire andre facetter) FØR dette spor — den dækker
funktionelt præcis det, formålsfilteret filtrerede på. At tilføje mockuppens
store, indbydende fliser OVEN I den eksisterende facet ville have været to
samtidige UI'er for samme filterdimension på samme side. Jeg portede derfor
FUNKTIONEN (allerede der), ikke den store visuelle PRÆSENTATION. `.formaal-*`
CSS-reglerne i `generator.css` er efterladt urørt (harmløse, ubrugte) frem for
slettet — se "Efterladt, ikke ryddet op" nedenfor.

**Usikkerhed jeg vil flage:** dette er MIN afvejning, ikke en, orkestratoren
eksplicit godkendte. Er den store flise-præsentation ønsket af smagsmæssige
grunde (ikke kun funktionelle), er dette punkt værd at tage op igen.

### 3. Katalogsidens "Sortering" er en statisk etiket, ikke skiftbare knapper

Mockuppens egen sorteringsrække (`katalog.html`) var tre `<span>`-elementer
UDEN `href` eller nogen anden hook — kun det første havde `aria-current`. Det
er selv i mockuppen en beskrivelse af den aktuelle sortering, ikke en
fungerende kontrol. Jeg byggede den samme troskab: `.katalog-sortering__vaerdi`
viser "Vægt, stigende" (den faktiske, faste sortering, uændret fra dagens
logik) som tekst. At bygge to ekstra, IKKE-implementerede sorteringstilstande
ville have krævet enten client-side JS (ny afhængighed af DOM-omordning, ikke
skitseret i kontrakten) eller en falsk, ikke-fungerende knap — begge dele
værre end en ærlig etiket.

### 4. `/sammenligning/` læser IKKE `robots.json` med `fetch()`

Data er i stedet INDLEJRET i et `<script type="application/json">` i hver
sprogudgave af siden. Begrundelse: Chromium nægter `fetch()` af en lokal fil
på tværs af mapper under `file://` (CORS) — og resten af sitet er bygget til
at virke uden en server (`assets/katalog.js`s egen kommentar: "Ingen
netværkskald"). Et `fetch('../../robots.json')`-kald ville fejle netop dér,
hvor siden skal virke uden en server. `dist/robots.json` er STADIG udvidet med
`alle_felter` pr. robot, som kontrakten bad om ("udvid tools/build.mjs's
robots.json") — det er blot ikke DENNE sides faktiske datakilde. Se
`tools/skema.mjs`s `feltVisning()` og `tools/skabelon/sammenligning.mjs`s
filhoved for den fulde begrundelse i koden.

### 5. Sammenligningens specimen-række har ingen fotografier

Mockuppens signaturelement er "de tre specimen-montrer i træk øverst" MED
billeder. Min klientside-udgave viser navn + producent + specifikationstæthed,
uden foto. At indlejre alle 62 robotters billedmarkup (`<picture>`/`<source>`,
alt-tekst, delt-foto-mærke) i den samme inline JSON-blok — for alle
kombinationer, læseren måtte vælge — var uforholdsmæssigt for et JS-lag, der
kun FORBEDRER en side, som allerede virker uden det. Den statiske
no-JS-fallback (en flad liste med links) har heller aldrig vist billeder, så
dette er ikke en regression i forhold til sidens egen fallback-tilstand.

### 6. Katalogkortenes "N AF 30 FELTER"-skilt er ikke tilføjet

Mockuppens `katalog.html` viser `<span class="skilt__nr">20 AF 30 FELTER</span>`
på hvert kort. Det er ikke i opgavens liste af HÅRDE krav, og at tilføje det
ville kræve at sende `naevnere`/`d4` (i dag kun kendt af `build.mjs`) ind i
`hjaelp.kort()`s signatur — en udvidelse af en delt funktion, `forside.mjs`,
`producent.mjs` og `katalog.mjs` alle kalder. Fravalgt for at holde
ændringsfladen lille; noteret her som en reel, ikke-implementeret
mockup-detalje, ikke en stille udeladelse.

### 7. Playwright kunne IKKE køres i denne session

**Dette er den vigtigste afvigelse at læse.** Opgaven beder eksplicit om at
"åbne forside, katalog, sammenligning ... og én robotside på BEGGE sprog i
1280 og 390 px; SE på skærmbillederne, ret det knækkede." Jeg har INGEN
browser-værktøjer tilgængelige i denne (sub-)agent-session — `ToolSearch`
finder intet `mcp__playwright__*`-værktøj, selvom en cachet Playwright-plugin
findes på maskinen (`~/.claude/plugins/cache/claude-plugins-official/playwright`)
og en tidligere sessions MCP-log for netop dette projekt viser, at værktøjet
HAR været tilgængeligt i en anden session. Node/npm har heller ingen lokal
eller global Playwright-installation (`npx` findes ikke i PATH, intet
`node_modules`), og projektet har bevidst nul npm-afhængigheder, så jeg
installerede ikke en midlertidig kopi.

**Hvad jeg gjorde i stedet, som den bedst tilgængelige erstatning:**
- Bygget hver del og læst den FAKTISKE genererede HTML/CSS/JSON strukturelt
  (grep + Node-scripts) efter hver commit — antal kort, sal-inddeling,
  hreflang, i18n-nøgler, JSON-gyldighed.
- `tools/linktjek.mjs` kørt over hele det byggede site: **0 døde interne
  links af 4259**, 42 producentsider alle nåelige.
- **`assets/sammenligning.js` afprøvet FUNKTIONELT** (ikke kun læst) med en
  minimal Node `vm`-DOM-shim, der udfører den RIGTIGE fil (ikke en
  genimplementering) mod den byggede sides egen inline-JSON: bekræftede at
  appen vises og fallback-listen skjules ved indlæsning, at tabellen får 6
  grupper/30 rækker, at alle fire datatilstande optræder i output, at
  under 2 valgte robotter viser beskeden og tømmer tabellen, og at et 4. valg
  bliver forkastet med en besked uden at ødelægge den gyldige tabel.
- Ingen af de to CSS-ændringer, der er rent visuelle (vitrinemat på
  robotfotoet, sal-layoutet, sammenligningstabellen) er set i en rigtig
  browser. Jeg har ræsonneret mig frem til dem ud fra CSS-boksmodellen og
  eksisterende, allerede-virkende mønstre i samme fil (se kommentarerne i
  `generator.css`), men det ER en påstand, ikke en måling.

**Konsekvens for orkestratoren:** den visuelle QA (skærmbilleder ved 1280/390
px, begge sprog, fire sidetyper) STÅR STADIG TILBAGE. Jeg leverer strukturelt
og funktionelt efterprøvet kode, men ikke det visuelle blik, opgaven bad om.

---

## Efterladt, ikke ryddet op

`assets/generator.css`s `.formaal-gitter`/`.formaal`/`.formaal--tom`-regler
(tilføjet 24. aug 2026, `forside.mjs`s tidligere formålsfilter) er nu ubrugte
— ingen skabelon skriver længere den markup. Jeg lod dem stå frem for at
slette dem: de er harmløse (ingen anden regel afhænger af dem), og
`DESIGN.md`s changelog beskriver komponenten detaljeret — at fjerne CSS'en
uden at rette dokumentationen ville efterlade en beskrivelse af noget, der
ikke længere findes. Dette hører til en dokumentationsrunde (DESIGN.md,
STATUS.md), som ikke stod i mit leverance-omfang, og som jeg derfor ikke
selv har rørt — begge filer bør opdateres ved flet, med denne rapport som
kilde.

---

## Tallene

| Måling | Værdi |
|---|---|
| `node tools/validate.mjs` | **62 filer · 0 fejl · 1 advarsel** (kendt, R9 på ghost-robotics-vision-60, urørt af dette spor) |
| `node tools/build.mjs` | **175 sider** (op fra 173 — kun `/sammenligning/` er en ny sidetype pr. sprog; se Afvigelse 1 for hvorfor ikke 177) |
| Kildemærker | **857 tal med kilde, 0 uden** — uændret, som krævet |
| Vægtklasser (kataloget) | **14/17/21/10** over 62 datafiler — matcher salenes egne, byggede tal |
| "Fra kataloget" på forsiden | **6 kort** (min(6, 62)) |
| Kort i kataloget | **62** (uændret — grupperingen flytter dem, taber ingen) |
| `dist/robots.json` | **377 348 tegn** for 62 robotter (ny `alle_felter`-nøgle, 30 felter/robot) |
| `node tests/koer.mjs` | **195 ok / 2 fejl** (de to fejl er FØR dette spor, uafklarede produktbeslutninger — urørt, se nedenfor) |
| `tools/linktjek.mjs` | **0 døde interne links af 4259**, 42/42 producentsider nåelige |
| i18n-nøgler | **260/260 parret** (da/en), verificeret med Node — **14 nye nøglepar** |
| `--til-udgivelse`-spærringen (S1) | Stadig afviser bygget korrekt (54 fabrikantbilleder) — urørt, som krævet |

De to vedvarende testfejl (`interval 18-25 kg kollapser...` og `to filer med
samme kategorier i modsat rækkefølge...`) er **ikke rørt** af dette spor — de
var der før (samme 2/195-status i baseline-målingen jeg tog før nogen
ændring), og begge er dokumenteret uafklarede produktbeslutninger i
`fund/FUND-test.md`/`fund/FUND-detalje.md`, ikke fejl i retning LYS'
oversættelse.

---

## Selv-tjek med tælling

- **14** nye i18n-nøglepar tilføjet (da+en), **260/260** nøgler parret
  efterprøvet med et Node-script efter hver af de fire commits.
- **4** skabelon-filer ændret/tilføjet i `tools/skabelon/`:
  `forside.mjs` (ændret), `katalog.mjs` (ændret), `side.mjs` (ændret — nav +
  `skal()`s `script`-parameter generaliseret), `sammenligning.mjs` (ny).
  Derudover: `tools/skema.mjs` (ny `feltVisning()`), `tools/build.mjs`
  (sidewiring + assertion vendt), `assets/generator.css` (ny CSS, tre
  omgange), `assets/sammenligning.js` (ny), `tests/koer.mjs` (én formel
  vendt).
- **2** assertions vendt (ikke slettet, ikke sænket):
  1. `tools/build.mjs`s `paastaa(kortPaaForside === robotter.length, ...)` →
     `=== Math.min(6, robotter.length)`, med ny fejlbesked.
  2. `tests/koer.mjs`s sidetalsformel: leddet `2` (forside+katalog) →
     `3` (+ sammenligningssiden), med opdateret kommentar der forklarer
     hvorfor.
  Én yderligere mulig kandidat (`robots.json er et lille indeks`, grænse
  8000 tegn) blev MÅLT, ikke vendt: fixture-datasættets kompakte
  `JSON.stringify().length` er 7168, stadig under grænsen — ingen ændring
  nødvendig, og jeg lod den derfor stå urørt fremfor at hæve en grænse, der
  faktisk stadig holder.
- **11** kildefiler ændret/tilføjet i alt (git diff --stat, 399ee5e..HEAD),
  plus denne rapport = **12**.
- **62** kort efterprøvet til at overleve grupperingen (kataloget, uændret
  antal før/efter del 2 — talt direkte af den byggede HTML, ikke antaget).
- **4** commits, én pr. del, som krævet.

---

## Selv-review — hvad jeg er usikker på

1. **Ingen visuel bekræftelse noget sted.** Det er den største mangel — se
   Afvigelse 7. Alt strukturelt/funktionelt er efterprøvet; intet er SET.
   Vitrinematten på robotsidens foto, sal-layoutets brudpunkter under
   900 px, og sammenligningstabellens mobile enkeltspalte-visning er de tre,
   jeg vurderer har størst risiko for et overset visuelt problem (klip,
   overlap, forkert kolonnetal) — de er nyeste CSS uden en eneste
   Playwright-måling.
2. **Formålsfilter-afvigelsen (punkt 2) er min egen afvejning**, ikke
   eksplicit efterspurgt af orkestratoren. Jeg tror den er rigtig
   (undgår dobbelt-UI for samme facet), men det ER en fortolkning af en
   flertydig sætning i briefet ("flytter til katalogsiden"), ikke en
   bogstavelig efterlevelse.
3. **Sammenligningens `feltVisning()`-gengivelse i JS er en bevidst
   duplikering** af `side.mjs`s `tal()`/`tilstand()`-logik (nødvendig, fordi
   den ene kører ved bygge-tid og den anden ved læserens valg i browseren) —
   men det ER stadig to steder, samme regel skal holdes ens. Jeg har
   efterprøvet dem mod hinanden med DOM-shimmen (alle fire tilstande,
   operator, forbehold, ved_last), men en fremtidig ændring af den ene uden
   den anden ville ikke blive fanget af noget automatisk — der findes ingen
   test, der sammenligner de to renderinger direkte.
4. **Advarselstekst i sammenligningens felter kan indeholde rå URL'er**
   (fx Spots egenvægt-forbehold citerer en PDF-URL). Jeg vurderer det IKKE
   som et brud på "kilder skjules", fordi den samme tekst allerede står
   ordret og ukrypteret på robotsiden i dag (samme `post.advarsel`-felt,
   samme `esc()`-uden-oversættelse) — men det er værd at CEO'en ser efter,
   hvis "kilder skjules" var tænkt bredere end kildemærke-mekanikken.
5. **62 afkrydsningsfelter i sammenligningens vælger** har ingen søgning
   (kun en scrollbar liste, `max-height:260px`). Med 62 robotter kan det
   føles tungt at finde en bestemt model. Jeg vurderede en søgeboks som
   ekstra scope ud over kontraktens "lader læseren vælge 2-3 robotter og
   renderer rækkerne" — men det er en UX-afvejning, ikke en hård regel.
6. **DESIGN.md og STATUS.md er ikke opdateret** af mig — se "Efterladt,
   ikke ryddet op". Det efterlader et hul mellem det bygget faktisk gør og
   det, den nyeste tekst i de to filer beskriver, indtil et fletcommit
   lukker det.
