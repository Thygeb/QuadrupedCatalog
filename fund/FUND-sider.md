# FUND-sider — måleplade på robot- og producentsider, producentindeks (F1)

Agentrapport, 24. aug 2026. Gren `kode/sider`, worktree `udstilling-wt-sider`.
Commits: `ce6f1ed` (måleplade-koblingen), `6110818` (producentindeks m.m.).

## Skill-vurdering

**Valgt: ingen** — opgaven er ren skabelonkode: koble to skabeloner på eksisterende
fælles hjælpere og bygge en indeksside af eksisterende CSS-klasser. Gået forbi med
begrundelse: `robotdata` (ingen dataposter røres), `impeccable`/`frontend-design`
(ingen ny designretning — alle klasser genbruges fra system.css/generator.css),
`ui-ux-critique` (ingen kritikrunde bestilt), `parallelt` (jeg er selv ét spor i en
allerede delt opgave), `grillmig` (briefet var grillet af orkestratoren),
`new-project` (intet scaffolding). Code-review-tankegang kørt på egen diff før
aflevering (fund: de tre forbehold under "Usikkerheder").

## Hvad ctx.billede-mekanismen viste sig at være

Advarslen fra 347051a handlede om denne kæde:

1. `producent.mjs` `modelkort()` (linje 272 før ændringen) slår selv et billede op:
   `ctx.billeder?.[m.slug] ?? m.billede ?? null` og lægger resultatet som
   `kortCtx.billede`, før den kalder `billedled()` i robot.mjs.
2. `robot.mjs` `billedeAf(ctx)` lader `ctx.billede` **overskrive** robottens eget
   `billede:`-felt: er den sat, læses den i stedet for `robot.billede`.
3. **Søgning efter hvem der SÆTTER `ctx.billeder`** (grep over `tools/` efter
   `billeder :=`/`ctx.billeder`): den læses ét sted (producent.mjs) og sættes
   **ingen steder** — build.mjs har aldrig leveret den. Den levende halvdel af
   mekanismen er altså i praksis `m.billede` (robottens eget felt), og
   `ctx.billeder`-opslaget er en død krog beregnet til, at bygget en dag kan give
   producentsiden andre billeder end robotsidens.

Derfor kunne koblingen laves uden at ændre mekanismen: `billedled()` afgør stadig
selv via `billedeAf(ctx)`, hvilket billede der gælder (overskrivningen vinder).
Kun når svaret er *intet billede*, falder den nu til den fælles `hjaelp.billede()`
i side.mjs — og den får det **effektive** emne med
(`ctx.billede ? { ...robot, billede: ctx.billede } : robot`), så en sat-men-ubrugelig
overskrivning stadig undertrykker robottens eget foto i stedet for at blive
omgået. producent.mjs behøvede ingen ændring for pladerne: dens kort går gennem
samme `billedled()`.

## Tællinger (færdigkriterierne)

**(a) Plader i dist, målt med tællescript over alle HTML-filer** (46 robotter × 2
sprog; 14 robotter uden billede, heraf 10 med både længde og højde):

| sidetype | før: flad / måltro | efter: flad / måltro |
|---|---|---|
| forside + rod | 8 / 20 | 8 / 20 (uændret) |
| katalog | 8 / 20 | 8 / 20 (uændret) |
| robotsider (92) | **28 / 0** | **8 / 20** |
| producentsider (26) | **28 / 0** | **8 / 20** |
| producentindeks (2, nye) | — | 0 / 0 (ingen kort) |
| i alt | 72 / 40 | 32 / 80 |

De 4 flade pr. sprog (anybotics-anymal-x, deep-robotics-lynx-s10,
raion-robotics-raibo2, unitree-laikago) er efterprøvet felt for felt i deres
YAML: alle har `laengde: ikke_oplyst` **og** `hoejde: ikke_oplyst` — den flade
plade er korrekt adfærd, ikke en fejl. Målepladens tal efterprøvet mod datafilen
for deep-robotics-lite3: 610/1900 = 32,11 % og 406/1187,5 = 34,19 % — begge
stemmer med `--bw`/`--bh` i den byggede HTML, begge sprog.

**(b) Linktjek** (`tools/linktjek.mjs`, nyt målescript): 125 HTML-filer læst,
**2977 interne henvisninger, 0 døde**. 26 producentsider, **alle 26 nås** fra
deres sprogs `producenter/index.html`. Negativ kontrol kørt: ét bevidst brudt
link i en kopi af dist blev fanget af begge målere (1 DØDT + 1 UNÅET, exit 1) —
scriptet kan altså fejle, når det skal.

**(c) Begge sprog:** `dist/da/producenter/index.html` og
`dist/en/producenter/index.html` findes; da siger "Producenter / Alle 13
producenter / Kina / 9 modeller / 1 model", en siger "Manufacturers / All 13
manufacturers / China / 9 models / 1 model" — alt via i18n-nøgler, ingen
hårdkodede strenge i skabelonen. hreflang-parret mellem de to efterset i HTML.

**(d) Validate: 46 filer, 0 fejl**, 1 kendt advarsel (vision-60 imperial, R9).
**Byg gennemført: 125 sider** (før 123; +2 er indekssiderne).

## Hvad der ellers blev lukket, fordi filerne var mine

- **Robotsidernes producent-links** (`.prod`-linket og "Se alle modeller fra
  {producent}") fandtes færdige i robot.mjs, men tændte aldrig, fordi build.mjs
  ikke gav `ctx.producent` med. Nu gives den — kun når producentskabelonen
  findes, så der aldrig linkes til mapper, bygget ikke skrev.
- **`harProducenter`-flaget** til `skal()` (frossen signatur, leddet fandtes
  allerede i side.mjs) sættes nu af build.mjs på alle sider, samme betingelse.
- **"1 modeller"**: `producent_modeller` gav forkert ental for 4 producenter
  (Boston Dynamics, RIVR, Rainbow, Raion). Ny nøgle `producent_model_en`
  tilføjet nederst i begge sprogfiler (ingen eksisterende nøgler rørt) og brugt
  i indekset, modelafsnittet og alle-producenter-listen.
- **alleProducenter-listen** talte kun `p.modeller`; byggets producenter hedder
  `p.robotter` — antal manglede derfor på producentsidernes bundliste. Rettet.

## Selv-tjek med tælling

- Plader: 8 sidetype-tal før + 10 efter talt med script; 4 flade robotter slået
  op i YAML (4 efterprøvet, 0 afvigelser); 2 procenttal håndregnet mod HTML
  (2 efterprøvet, 0 afvigelser).
- Links: 2977 interne efterprøvet mekanisk, 0 døde; 26/26 producentsider nået;
  1 negativ kontrol, fanget.
- Sider set i browser (Playwright, port 8002): 5 skærmbilleder (da-indeks 1440
  og 360, en-indeks, producentside DEEP, robotside lite3 med stor måleplade) —
  0 fejl fundet, men se usikkerhed 3 om styling.
- i18n: begge filer parser, 244 nøgler i begge, ingen BOM.
- Testpakken: **145 ok / 3 FEJL både før og efter** mine ændringer (målt med
  `git stash`-sammenligning) — de tre FEJL og stil.css-nedbruddet i afsnit 4
  prædaterer sporet. Eneste skred: den allerede fejlende forventning "11
  HTML-sider bygget" fandt 17 før og 19 efter (mine to indekssider).
- Fundne fejl i eget arbejde undervejs: 2 (første udkast til efter-tælling
  talte indekssiderne med i robotside-gruppen — rettet i tællescriptet før
  målingen ovenfor; commit-besked-fil lå først uden for worktree'en — slettet).

## Selv-review: usikkerheder og det, jeg ikke nåede

1. **Koblingspunktet til det andet spor er en antagelse.** `skal()`s frosne
   signatur tager `harProducenter` fra kalderen, og build.mjs er min fil — så
   jeg sætter flaget dér. Hvis det andet spors ombyggede side.mjs i stedet
   tegner leddet ubetinget, skal fletteren se efter dobbelt led / død parameter.
   Samme sted: tilføjer det andet spor også `nav_producenter`-nøglen (den
   fandtes allerede), er halekollisionen i sprogfilerne orkestratorens fletning.
2. **Kant i overskrivningen:** er `ctx.billede` sat men ubrugelig, mens robotten
   har et gyldigt eget billede, viste den flade plade sig før — nu vises
   måleplade/tom plade for samme robot. Overskrivningen undertrykker stadig
   fotoet; ingen kaldevej rammer kanten i dag (`ctx.billeder` sættes aldrig).
3. **Producentsiderne er stadig delvist ustylede** — `.producentside`, `.retur`,
   `.prodliste`, `.pantal`, `.producent-fakta`, `.eu-tabel` m.fl. findes kun i
   den forladte `sider.css`, som ikke indgår i bygget. Siderne er brugbare (se
   skærmbillede), men bundlisten "Alle 13 producenter" står uden listestil.
   CSS var forbudt for mig; mit indeks bruger derfor kun levende klasser.
   **Fund til STATUS/CSS-ejeren, ikke rettet.**
4. **tests/koer.mjs' sideantal-forventning er forældet** (fejlede på 17 før mig,
   19 nu). Filen er ikke min, og fejlen prædaterer sporet — men "ret assertions,
   slet dem ikke" gælder: ejeren bør sætte forventningen til den nye sandhed,
   ikke fjerne den.
5. **Banneret "Siden viser ingen billeder fra producenterne" modsiger de 32
   fabrikantfotos**, der har været på siden siden b22da4f. Prædaterer mig og er
   i18n-tekst/spærringstekst — flaget her, ikke rettet.
6. **Ikke nået:** en-producentsiderne kun efterset i HTML, ikke i browser;
   `--til-udgivelse`-bygget ikke kørt; linktjekkets nåbarhedsmåler matcher
   bogstaveligt `href="<slug>/"` og ville melde falsk, hvis indekset en dag
   linker absolut; `renderIndeks` med 0 producenter ville skrive "Alle 0
   producenter" over en tom liste — kaldevejen findes ikke i bygget i dag.
