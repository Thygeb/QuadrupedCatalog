# FUND — `spor/prodplan`

**Model: `claude-opus-5[1m]` (Opus 5, 1M kontekst)** — arven lykkedes; sporet kører
orkestratorens egen model, ikke en nedgraderet.
**Skills:** `spor` (kaldt, **virkede fra worktreen**) → `impeccable shape` (kaldt, virkede;
`reference/shape.md` + `scripts/context.mjs --target tools/skabelon/producent.mjs`).
**Gik forbi:** `frontend-design` (ingen ny flade — den findes), `impeccable critique` /
`ui-ux-critique` (fejljagt; briefet bad om en **plan** — L70), `robotdata` (ingen robotpost
røres), `grillmig` (kun på briefs, aldrig på design), `fejljagt` (ét måleapparat svigtede,
men fejlen var min egen regex, fanget af kontrollinjen i samme sekund).
**Leverance:** `fund/PLAN-producent.md`, 754 linjer, 3 commits. Ingen kode, ingen CSS.

## Valgt / fravalgt

**Valgt:** et **kriterium** frem for en dom — *en fratrækning er legitim, når det fratrukne
findes ét klik væk i samme form; den er ikke legitim, når fladen er det eneste sted,
oplysningen findes.* Brugbart på de tre andre planer også. **Svaret:** de tre nuller på
kortet er **legitime**, men EU-sætningen kollapser "dokumenteret nej" og "ikke oplyst" til
ét `0` — og fladen er **det eneste sted på webstedet, hvor CE opgøres pr. producent**.
**Fravalgt:** at svare "de tre nuller er fine" og stoppe. Sandt og ubrugeligt — og det ville
have overset, at fladen bryder begrænsning 5 et helt andet sted.

## Konfidens pr. punkt

| Punkt | Niveau | Genkørbar kommando | Hvad tallet var, hvis arbejdet var forkert |
|---|---|---|---|
| De tre nuller er legitime (obligatorisk sæt intakt) | **Høj** | `node tools/build.mjs` + sammenlign katalogets 77 alm. kort mod producentens 77: picture, `billedled--plade`, `billedled--tom`, `kort__mrk` | Var fratrækningen for stor, ville mindst ét par afvige. Målt **76/76 · 27/27 · 0/0 · 9/9** |
| Fladen bryder begr. 5 i EU-sætningen | **Høj** | `find dist/da/producenter -name "*.html" -exec grep -o 'v-nej' {} + \| wc -l` → **0**; samme grep på `dist/da/robotter/xiaomi-cyberdog-2/` → **1** | Var fundet forkert, ville producentfladen allerede vise ≥1 `v-nej` |
| Ordforrådet findes, er oversat og er ubrugt | **Høj** | `grep -rc 'eu_ce_nej' tools/skabelon/*.mjs` → alle **0**; nøglen står i `da.json` **og** `en.json` | Var den i brug, ville mindst én fil give ≥1 |
| Browsertallene (1.719,6 px · 102 links · 1 signatur) | **Høj** | Bilaget i planen: 8 linjer, egen chromium, `url`/`w`-vagt i svaret. Genkørt og reproduceret | Var fladen anderledes, ville `sektioner` eller `signaturer` afvige. Målt to gange, samme tal |
| Katalogets `eu_pointe` siger "74 af 77 producenter" | **Høj** | `grep -c '74 af 77 producenter' dist/da/index.html` → **1** | Talte sætningen producenter, ville den sige 23 af 25 og greppet give 0 |
| **P3's acceptkriterium** (signaturer 1 → 2) | **Middel** | Nu-tilstanden målt (1); den ønskede er ikke bygget og derfor ikke set | — |
| **P5's dom** (76 px firmanavn er et begr. 1-problem) | **Lav** | Tallene er målt; **vurderingen** er min og ikke efterprøvet af nogen | — |

## Usikkerheder

1. **P5 er planens svageste påstand.** Målingen (h1 på alle seks flader) er hård; at 76 px
   til et firmanavn *læses* som en salgsflade, er en vurdering. Det samme gælder `eu_ce_*`-
   nøglernes endelige sammensætning: en tekstbeslutning, ikke en måling.
2. **Briefets "~250 modelnavne" kunne jeg ikke reproducere** — målt 102 links pr. sprog (25 + 77).
3. **Jeg kunne ikke stille et spørgsmål.** `shape`s fase 1 og `AUTONOMY_DIRECTIVE_CHECK`
   kræver en interviewrunde; jeg har ingen `AskUserQuestion` og ingen vej til JPK.
   Antagelserne er mærket som sådan (afsnit 7), og de tre, der kræver JPK, står i afsnit 10.

## Målinger

Grundmåling: **byg 216 sider · 77 datafiler · 1.111 tal med kilde, 0 uden** (første byg gav
**76 R18-fejl** — gitignorerede fabrikantfotos, miljøet og ikke fladen). Briefets fem
påstande om fladen: **5/5 holder**. Briefets to katalogtal rettet: `kort__vaerdi`
**370 → 185**, `kort__saml` **172 → 86** (`\b`-fælden, briefet selv advarer om). CE over 77
filer: **ja 2 · nej 1 · ikke oplyst 74**; pr. producent **1 · 1 · 23 tavse**. På
producentfladen: `v-ikke` **6** · `v-nej` **0** · `v-tal` **0** · `kildemaerke` **0** ·
`.knap` **0** · Literata **0**. "Alle 25"-listen: **1.719,6 px** = 54,2 % / 65,3 % af siden.
**Selv-efterprøvning: 68 påstande genafledt maskinelt, 68 OK, 0 fejl** — negativ kontrol kørt
(bevidst forkert påstand giver 67/1, så apparatet detekterer faktisk fejl).

**Oprydning:** serveren på 8144 er lukket (verificeret — `curl` svarer ikke), mine tre
målescripts fjernet fra `maalevaerktoej/`, sentinelfilen fra `dist/`. Ingen `tests/koer.mjs`
kørt. Hovedrepoet kun **læst** (610 fotos kopieret derfra), aldrig skrevet.

---

## Nye fælder og opdagelser

**1. Mit eget efterprøvningsscript fejlede på præcis den fælde, CLAUDE.md beskriver — i ny
forklædning.** `indexOf('prodliste')` rammer også `id="prodliste-h"` (sektionens
`aria-labelledby`) på producentindekset. Slicen derfra til `</ul>` gav en tom liste, som så ud
som en **anden rækkefølge**, og "1 unik rækkefølge" blev til 2. Tallet var fuldstændig
plausibelt. Det er samme mekanisme som CLAUDE.md's `split()`-på-sektions-id, men på `indexOf`,
og den ramte i det ene script, hvis eneste job var at fange den slags. **Match på
`<ul class="prodliste">`, ikke på ordet.**

**2. En kommentars tal ældes tavst — og det er værre, når tallet er en begrundelse.**
`producent.mjs` bærer **fire** forældede tal: l. 2 *"12 af dem"* (er 25), l. 6 *"Unitree har
12 modeller"* (13), l. 84 *"producentby står på 9 af Unitrees filer"* (**0** af 13), l. 141
*"2 ja, 2 nej, 42 intet"* (2/1/74). Nr. 84 er ikke bare forældet — den er **beviset** for
`hjemstedAf()`s form. Reglen er formentlig stadig rigtig; dens begrundelse er faktuelt falsk.

**3. En funktion kan navngive en regel og bryde den i samme fil.** `ceOpgoerelse()`s
kommentar siger ordret *"de tre må ikke kollapse — det er præcis CLAUDE.md begrænsning 5"*,
og funktionen 55 linjer nede kaster to af de tre tal væk. Filens hoved advarer mod
håndkopier (*"tre håndskrevne kopier divergerer ved den fjerde"*) — og funktionen **er** en
håndkopi af `side.mjs:1634 ceTilstand()`, som katalogsiden kalder to gange. **De to er
allerede divergeret latent:** for `ce_oplyst: "nej"` (streng) svarer `ceTilstand` `'nej'` og
`ceOpgoerelse` `ukendt`. Ingen robot bærer strengen i dag, så intet fejler.

**4. Katalogsiden viser et faktuelt forkert tal om producenter.** `katalog.mjs:1459` sender
robottal ind i `eu_pointe`, så den byggede side siger **"74 af 77 producenter oplyser intet om
CE"**. Der er 25 producenter; det rigtige tal er 23 af 25. Ikke opfundne tal, men et navneord
der ikke passer til sit tal — på en side, hvis positionering er, at ét tal skal kunne citeres
isoleret. **Rettelsen hører i katalogplanen, men tallet kan kun regnes over producenter.**

**5. Den slettede forside (L72) efterlod fire forældreløse abstraktioner, ikke én.** K.1 fandt
`kort()`. Jeg målte tre til: i18n-nøglerne `forside_eu_*` (eneste forbruger: `producent.mjs`),
CSS-klasserne `.eu-fund-*` (25/25 producentundersider, ingen andre) — og
`eu_ce_ja`/`eu_ce_nej`/`eu_ce_ikke_oplyst`, **færdigoversat i begge sprogfiler med nul
kaldere**. Den fjerde er præcis det ordforråd, planens hovedforslag mangler. **Den ville
formentlig være fundet for en uge siden, hvis nogen havde søgt på det ord, der stadig peger
på et slettet sted.**

**6. En rettet flade blev kopieret 50 gange i sin urettede form.** JPK's beslutning 1. sep
flyttede modeltallet ind før navnene på indekset for at løse "13-og-1-problemet". Undersidens
`.prodliste` har stadig den gamle form — navn til venstre, tal ~1.000 px ude til højre —
på 25 sider × 2 sprog. **Når to flader viser den samme liste, arver den ene ikke den andens
rettelse af sig selv.**

**7. `.eu-fund-tal` er sat i `--mono`, og `--mono` er Saira.** Tokenets navn er historisk
(MANIFEST: *"hvorfor ingen skrivemaskineskrift"*). Et forslag, der læste navnet i stedet for
værdien, ville have troet, fladen havde to skrifter. Den har én.

## Punkter i briefet, jeg ikke nåede

- **Ingen.** Alle fem acceptkriterier er kørt og passerer: filen findes · `SYSTEMÆNDRING` 1 ·
  `Read` 18 (og `MODE: Read` navngivet i prosa 2 steder) · kortarven, de tre nuller og
  indekset besvaret særskilt · diffen mod main er `fund/PLAN-producent.md` +
  `fund/BRIEF-prodplan.md` (+ denne rapport ved commit).
- Fladen er **ikke** målt i browseren ved andre bredder end 1440 og 390. Der er 0 vandret
  overløb ved begge, men mellembredder (700–1100 px, hvor modelkolonnen forsvinder ved 900)
  er ikke set.
