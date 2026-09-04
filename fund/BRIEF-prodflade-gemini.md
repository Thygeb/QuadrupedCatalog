# BRIEF — producentfladen: skær rosteren (R3), og foreslå proveniens (R4)

**Til:** Gemini. **Gren:** `spor/prodflade`. **Worktree:** `c:\Praktik\websites\udstilling-wt-prodflade`
(**ikke oprettet endnu** — se *Opsætning* nederst). **Rapport:** `fund/FUND-prodflade.md`.

Målt af orkestratoren 4. sep 2026 på main `8476ab2`. **Alle tal nedenfor er påstande.
Afviger noget, du måler, fra noget, briefet siger, så skriv afvigelsen i rapporten — det er
en del af leverancen, ikke ulydighed.**

---

## Hvad der ændrer sig på skærmen

| Flade | I dag | Efter |
|---|---|---|
| Producentside, fx `/da/producenter/boston-dynamics/` | Nederst en liste *"Alle 25 producenter"* med **25 rækker** — navn, land, antal — hvoraf **24 handler om andre firmaer**. Boston Dynamics har selv **1** modelkort | Listen er **væk**. Siden slutter efter producentens egne modelkort |
| Samme side, andel af højden om fladens eget emne (1440 px) | **31 %** (Xiaomi) og **42 %** (Unitree) — citeret fra `fund/ANALYSE-produkort.md` F3, ikke min egen måling | **> 50 %** på både Boston Dynamics og Unitree. Du måler begge |
| Producentindekset `/da/producenter/` ved 390 px | Uændret | **Uændret — og det skal du bevise.** Se punkt 2 |
| Kildemærker på producentfladen | **0** på alle 26 sider | **Uændret i dette spor.** R4 leverer et forslag, ikke kode |

---

## Deliverance 1 (R3) — skær roster-blokken

`tools/skabelon/producent.mjs:375` står i dag ordret, som fjerde og sidste kald i artiklen:

```
<article class="producentside">
${top(arbejde, modeller)}
${euSaetning(arbejde, modeller)}
${modelafsnit(arbejde, modeller)}
${alleProducenter(arbejde)}
</article>
```

**Det ønskede resultat:** `${alleProducenter(arbejde)}` fjernes fra `.producentside`.
Funktionen `alleProducenter()` (`:330-348`) bliver derved ubrugt — **fjern den også**, og
fjern de **8** nu døde `.prodliste`-regler i `assets/generator.css:1942-1982`.
Efterlad ingen død kode.

**`.producentside`s tre øvrige dele står uændret:** `top()`, `euSaetning()`, `modelafsnit()`.
Dette spor omskriver ikke fladen — det fjerner én blok.

### Hvorfor blokken var spærret indtil i dag, og hvad der løste det

**Læs dette, før du skærer.** To dokumenter i repoet modsiger hinanden:

- `fund/PLAN-producent.md` §5.3 vil skære blokken væk, fordi den er *"en dårligere udgave
  af indekset"*.
- `fund/ANALYSE-produkort.md` P-E har målt, at den på **mobil** var den **bedre** udgave:
  undersidens liste viste navn + land + antal ved 390 px uden beskæring, mens **indekset
  skjulte land og antal**.

Sletter man blokken, mens den anden måling stadig gælder, **mister en mobillæser det eneste
sted, de tre oplysninger står sammen** — man retter desktoppen og ødelægger mobilen.

**Det er ikke længere tilfældet.** `spor/prodtabel` (R7, flettet 4. sep 2026, se STATUS.md
Å174) rettede indekset: ved 390 px var **277 px skjult**, LAND lå 60 px uden for
skærmkanten og ANTAL var helt væk — **nu 0 px skjult, begge sprog, 0 klippede celler.**
JPK's afgørelse i Å174 lyder derfor ordret: ***"ret R7 først, skær så blokken."***
R7 er landet. Betingelsen er opfyldt.

**Men Å174's tal er STATUS.md's, ikke dine.** Derfor er punkt 2 nedenfor obligatorisk.

### Acceptkriterier for deliverance 1

Hvert kriterium er kørt mod main, og dagens svar står ved siden af.

**1. Blokken er væk fra alle producentsider.**
`grep -rl 'class="prodliste"' dist --include=*.html | wc -l` viser **0**.
*Giver i dag **50*** (25 producenter × 2 sprog).

**KONTROLTAL, der IKKE må falde:** `grep -c 'class="prodliste"' dist/da/producenter/index.html`
viser **0 både før og efter**. *Giver i dag **0**.* Indekset har sin egen render
(`producent.mjs:567`) og skal ikke røres. **Pas på grep'et her:** indekssiden indeholder
strengen `prodliste` **to gange** som id'et `prodliste-h` i `aria-labelledby`. Et råt
`grep -c "prodliste"` giver derfor **2** på en side, der ikke har listen — søg altid på
`class="prodliste"`.

**2. Mobilen er ikke blevet værre — målt, ikke antaget.**
Åbn `/da/producenter/` og `/en/producenter/` ved **390 px** og bevis, at **navn, land og
antal alle tre er synlige og uklippede** for mindst 3 producenter. Skriv `scrollWidth` og
`clientWidth` for `.prod-tabel-wrap` i rapporten. Færdig, når skjult bredde er **0 px**
i begge sprog. *Å174 forudsiger 0; det er en **forudsigelse**, ikke min måling.*

**Dette kriterium er hele grunden til, at punktet var spærret. Skær ikke, før det er grønt.**

**3. Fladens eget emne fylder mere end halvdelen.**
Browsermål ved **1440 px** på **både** `/da/producenter/boston-dynamics/` (1 model) og
`/da/producenter/unitree-robotics/` (13 modeller): summen af højderne på `.producent-top`,
EU-sektionen og modelafsnittet skal udgøre **> 50 %** af `.producentside`s højde.
*I dag: 31 % (Xiaomi) og 42 % (Unitree), citeret fra `fund/ANALYSE-produkort.md` F3.
**Boston Dynamics har ingen målt før dig** — mål den og skriv tallet.*

**4. Bygget er intakt.**
`node tools/build.mjs` viser **216 sider** og **0 uden kildemærke**.
*Giver i dag 216 sider / 1.111 kildemærker / 0 uden.*
`node tests/koer.mjs` viser **samme antal røde som din egen grundmåling, plus 0.**
*Giver i dag 1815 bestået / 6 fejlet — citeret fra STATUS.md Å175, ikke min egen kørsel.*

**Sammenlign fejlteksterne, ikke nettotallet.** Skriv de røde testnumre ved navn i din
grundmåling og igen til sidst, og sammenlign de to lister. `9 → 8` ser ens ud, uanset om
én test blev grøn, eller tre blev grønne og to nye blev røde.

**Går en test rød, fordi den kræver rosteren:** slet den ikke. **Læs dens navn først** — bærer
det et L-nummer eller en dato, er testen det sidste sted, en beslutning findes. Vend den, så
den beviser den nye regel, og citér R3 i det nye navn. Meld det i rapporten.

---

## Deliverance 2 (R4) — proveniens: et FORSLAG, ikke kode

**Skriv ingen kode til dette punkt.** `fund/PLAN-producent.md` P6 måler problemet og siger
udtrykkeligt, at den *"ikke foreslår en løsning"*. Grunden til, at det er farligt at bygge
blindt: **hvert eneste tal på producentfladen er noget, VI har regnet**, så et mærke pr. tal
kan ende som 30 hævede tegn i en støjmur.

**Problemet, målt:** `grep -ro "kildemaerke" dist/da/producenter/ | wc -l` giver **0**,
mod **1.732** under `dist/da/robotter/`. Fladen trykker i dag sætninger som
*"1 af 2 · nej · Producenten oplyser, at der ikke er CE"* — påstanden hviler på en `kilde`,
en `hentet` og en `advarsel` i `data/robots/xiaomi-cyberdog-2.yaml`, **og ingen af de tre
kan ses.** Et dokumenteret nej er den mest bestridelige påstand, fladen kan fremsætte.

**De regnede tal, du skal dække** (find dem selv i skabelonen og bekræft listen):
antal modeller (`:183` og `:315`), EU-optællingen *"n af m"* (`:253`), og
fordelingssætningen (`:445`).

**Leverancen er et afsnit i `fund/FUND-prodflade.md` med:**

1. En **tælling** af, hvor mange regnede tal fladen faktisk bærer pr. side — mindst for
   Boston Dynamics (1 model) og Unitree (13 modeller), fordi tætheden er forskellig.
2. **2-3 konkrete forslag**, hvert med et lille HTML-uddrag, der viser hvordan det ser ud i
   praksis — ikke en beskrivelse. Fx: mærke pr. tal · ét samlet metodeafsnit nederst ·
   en note ved sektionsoverskriften.
3. For hvert forslag: **hvad det koster i støj** på den tætteste side, og hvad det vinder.
4. **Din anbefaling**, med den fravalgte pris skrevet frem.

**Genbrug `.kildemaerke`-primitiven** (`assets/system.css`, 12 forekomster) i dine uddrag.
Opfind ingen ny måde at vise en kilde på, og **ret ikke primitiven** — den er fælles med
robotsiderne.

**Acceptkriterium:** færdig, når rapporten bærer punkt 1-4, og `grep -ro "kildemaerke"
dist/da/producenter/ | wc -l` stadig viser **0** — altså at du ikke byggede noget.
**Kontroltal, der ikke må falde:** `grep -ro "kildemaerke" dist/da/robotter/ | wc -l` viser
fortsat **1.732**.

---

## Filejerskab

**Du ejer og må skrive i:**

- `tools/skabelon/producent.mjs` — kun `.producentside`s sammensætning (`:371-376`) og
  funktionen `alleProducenter()` (`:330-348`). **Rør ikke indeks-renderen fra `:567`.**
- `assets/generator.css` — kun de 8 `.prodliste`-regler (`:1942-1982`).
- `tests/` — kun hvis en test kræver rosteren og skal vendes. Ny test i egen fil.
- `fund/FUND-prodflade.md` og eventuelle skærmbilleder i `fund/`.

**Du må IKKE røre:** `assets/system.css` · `tools/skabelon/katalog.mjs` ·
`tools/skabelon/robot.mjs` · `data/` · `db/` · `STATUS.md` · `CLAUDE.md` · `DESIGN.md` ·
`PLAN.md` · `.claude/` · `tests/dele/_faelles.mjs`.

**To andre spor kører i repoet lige nu.** Ingen af dem rører dine filer, men de rører main:
`spor/hegn2` ejer `assets/system.css` + `tests/dele/59-farvetokens.mjs` + `DESIGN.md`, og et
fase 3-spor er på vej, som ejer `tools/build.mjs`, `tools/validate.mjs`, `tools/yaml.mjs`,
`tests/dele/_faelles.mjs`, `db/` og `data/robots/`. **Rør ingen af dem.**

---

## Miljø

- **`node` er ikke på PATH i Git Bash.** Brug `"/c/Program Files/nodejs/node.exe"`.
- **Din port er 8127.** Aldrig 8080 — den deles med andre spor, og en fremmed servers svar
  ser præcis ud som dit eget. Start serveren fra worktree-roden med fuld sti:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8127 --directory dist`
  **Aldrig `cd dist`** — så låser serveren mappen, og næste byg fejler med EPERM.
- **Verificér serveren mod disken, før ét eneste tal bruges.** Vælg en streng, der kun findes
  i din udgave, og sammenlign `curl -s http://localhost:8127/generator.css | grep -c "<streng>"`
  med `grep -c` på filen. **En server er et måleapparat og skal valideres som ethvert andet.**
- **Browsermåling** (ligger bevidst uden for repoet og indgår aldrig i et byg):
  `node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> [bredde]`
  `node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png>`
- **Disk:** hver `tests/koer.mjs` koster ~2,8 GB i din worktrees `tests/.tmp-koersel`.
  Der var ~23 GB fri, og to andre spor kører. **Kør suiten højst to gange.**
- **`sed -i`, der ikke matcher, gør intet — tavst og med exit 0.** Efterprøv med et `grep`
  bagefter.
- **`split()` på et sektions-id rammer det tomme mellemstykke.** Skabelonerne skriver hvert
  id **to gange** — i `aria-labelledby` og i `id` — så `html.split('alle-h')[1]` giver
  strengen *mellem de to forekomster*, ikke sektionen. Brug `indexOf` på klassenavnet og
  skær frem til næste sektion.

---

## Første og sidste handling

**Første:** kør grundmålingen, før du rører noget — `git log --oneline -1`,
`node tools/validate.mjs`, `node tools/build.mjs`, `node tests/koer.mjs`, og de fire
grep-kriterier ovenfor. **Skriv dine egne tal i rapporten.** Uden dem kan du ikke svare på
*"var det mig, der ødelagde det?"*

**Sidste:** skriv `fund/FUND-prodflade.md` med (a) grundmålingen, (b) de fire acceptkriteriers
faktiske tal, (c) R4-forslaget, (d) hvad du **ikke** nåede, og (e) hvad du er **usikker** på.
**En rapport, der kun indeholder det, der lykkedes, kan ikke bruges til at beslutte noget.**

**Flet ikke, og push ikke.** Commit på grenen undervejs — R3-koden for sig, den døde CSS for
sig, en eventuel vendt test for sig, rapporten for sig. Orkestratoren fletter.

---

## Opsætning (orkestratorens, ikke din)

Worktreen er ikke oprettet endnu:

```
git worktree add ../udstilling-wt-prodflade -b spor/prodflade
cp .env ../udstilling-wt-prodflade/.env
cp -r assets/fotos/fabrikant ../udstilling-wt-prodflade/assets/fotos/fabrikant
```

`.env` og `assets/fotos/fabrikant/` (610 filer, 60 MB) er gitignorerede og følger **ikke**
med worktreen. Uden dem fejler `validate.mjs` på manglende billeder — to spor er allerede
snublet over det.
