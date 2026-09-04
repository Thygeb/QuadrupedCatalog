# BRIEF — spor/sletning

**Til:** Sonnet-agent i egen worktree · **Fra:** `udstilling-e6` (orkestrator) · **4. sep 2026**
**Model:** `sonnet` — mekanisk omstrukturering med et målbart facit.
**Forventet pris:** ~250-400k tokens. Meld det, hvis du nærmer dig, i stedet for at dø midtvejs.

**Beslutningsgrundlag:** L84 ([PLAN.md:42](../PLAN.md#L42)), ordret:
*"Intet mellemlag: bygget læser databasen direkte. `data/robots/` slettes, ingen eksport
committes."* Bekræftet af JPK 4. sep 2026 som **endelig**, efter at orkestratoren havde
forelagt prisen (kontrolgruppen forsvinder) og fået den afvist.

**Søgt efter beslutninger imod, og der er ingen:** STATUS.md's *"Kom ikke igen med disse"*
(linje 399-410, læst komplet, ikke afkortet med `head`) har ingen post om mappen.
`Lukket`-tabellens L12, L34 og L35 handler om skriveret og redaktionslag, ikke om sletning.

---

## Din første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

**Øvrige skills:** ingen af projektets andre skills passer — det her er hverken robotdata,
design eller Supabase-skema. Går noget uventet, så kald `fejljagt` før du retter.

---

## Grundmåling — orkestratorens egne tal

**Målt af orkestratoren på `ec1aea2` umiddelbart før afsendelse.** Genmål dem som din første
kommando efter `spor`-skillen, og skriv dine egne tal i rapporten. **Afviger de, er det et
fund, ikke en fejl hos dig.**

| Kommando | Orkestratorens tal på `ec1aea2` |
|---|---|
| `node tools/validate.mjs` | **77 filer · 0 fejl · 1 advarsel** (advarslen er `ghost-robotics-vision-60 · hastighed · R9`, og den er forventet) |
| `node tools/build.mjs` | **216 sider · 1.111 kildemærker · 0 uden** · tæthedsnævnere 33 · 611 billeder kopieret |
| `node tests/koer.mjs` | **1817 bestået · 6 fejlet** |

**De 6 røde er kendte og navneidentiske med Å178's. De er IKKE dine at rette:**
`4c` (Spots "strøm ud") · `259 forbehold mærket "gyldighed"` · `(d) fixture
(addverb-trakr-20)` · **2 × `64.3`** (unitree-aliengo bærer "UDEN batteri" i sin danske kilde).

**Bemærk de to `64.3`:** de læser `data/robots/`-kopien og hører til dine punkt 3-filer
(`64-i18nfelt.mjs:110`). De er røde **før** du begynder. **Bliver de grønne af dit arbejde, er
det et fund, du skal melde — ikke et mål du skal sigte efter.** Og bliver de rødere, eller
kommer der nye røde til, så er det dit. Sammenlign altid **fejlteksterne**, ikke nettotallet:
Å175 viste, at `9 → 8` lige så godt kan være tre nye grønne og to nye røde.

Tallene ovenfor er **krav** i den forstand, at du skal kunne forklare hver afvigelse — ikke i
den forstand, at du skal ramme dem. Antallet af beståede tests **vil** ændre sig, når
assertions omskrives; det er forventet, og din rapport skal bære det nye tal med begrundelse.

---

## Filejerskab

**Du ejer og må skrive i:**

- `data/robots/` (slettes)
- de 17 testfiler i punkt 3-4 nedenfor
- `tools/validate.mjs` (kun linje 1350)
- `db/tjek.mjs`
- `db/hentbyg.mjs` (slettes) og `tests/dele/71-hentbyg-vaern.mjs` (slettes)

**Du må IKKE røre:** `tools/build.mjs`, `tools/skema.mjs`, `db/hent.mjs`, `db/eksporter.mjs`,
`db/ordbog.mjs`. De nævner mappen **kun i kommentarer** — målt fil for fil. Retter du en
kommentar der, er det uden for dit ejerskab.

**Du må IKKE røre:** `STATUS.md`, `PLAN.md`, `CLAUDE.md`. De er orkestratorens.

---

## Punkterne, i den rækkefølge de skal udføres

### 1. `tools/validate.mjs:1350` — standardværdien peger på mappen

Der står i dag, ordret:

```js
    dataMappe = path.resolve(String(flag['data'] ?? 'data/robots'));
```

**Ønsket resultat:** når `--data` ikke er givet, skal `validate.mjs` hente fra databasen med
`hentRobotter()`, præcis som `tools/build.mjs` allerede gør. `--data=<sti>` skal fortsat virke
uændret — det er fixture-mekanismen, og **17 testkald bruger den bevidst** (målt i Å182).
Slet den ikke.

**Acceptkriterium:** `node tools/validate.mjs` uden flag validerer 77 robotter fra databasen.
`SUPABASE_URL=<ugyldig> node tools/validate.mjs` giver exit 1 — samme negative kontrol, som
fase 3 blev flettet på.
**Giver i dag:** kommandoen læser `data/robots/` fra disk.

**Hvorfor:** så længe standardværdien peger på mappen, kan mappen ikke slettes uden at
`validate.mjs` knækker.

### 2. `db/tjek.mjs` — trin 2 mister sit grundlag, trin 1, 3 og 4 overlever

`db/tjek.mjs:13-22` beskriver fire trin. **Trin 2** kræver dyb lighed mellem hver committet
`data/robots/*.yaml` og eksporten. Det trin kan ikke overleve mappen.

**Ønsket resultat:** trin 2 fjernes; trin 1, 3 og 4 beholdes uændret og kører mod en
**midlertidig** eksport (`db/.tmp/tjek-eksport`, som den allerede bruger på linje 282).
Trin 4's sammenligning bliver: byg fra databasen mod byg fra den midlertidige eksport —
**det er præcis fase 3's `diff -r`-bevis, og det kræver ingen committet mappe.**

De to læsninger af den rigtige mappe, `db/tjek.mjs:215` og `:287`, skal væk.

**Acceptkriterium:** `node db/tjek.mjs` giver exit 0 uden at `data/robots/` findes.
**Giver i dag:** trin 2 læser 77 filer fra `data/robots/`.

**Hvorfor:** filen er projektets bevis for, at database og byg siger det samme. Beviset skal
overleve mappen — kun dets *metode* ændrer sig.

### 3. De 13 mekaniske kildeskift

Erstat læsningen af den rigtige mappe med `hentRobotter()`, som **allerede er re-eksporteret**
fra [tests/dele/_faelles.mjs:22](../tests/dele/_faelles.mjs#L22). `build.mjs` og `validate.mjs`
bruger den i forvejen.

| Fil | Sted |
|---|---|
| `02-spec-taethed.mjs` | :82 |
| `15-hastighedsenhed.mjs` | :75 |
| `26-forbehold-klasse.mjs` | :35, :99 |
| `32-fremdrift.mjs` | :89 |
| `35-typeskilt-katalog.mjs` | :51, :274, :289 |
| `36-typeskilt-robot.mjs` | :220 |
| `42-cjk-ordlyd.mjs` | :108 |
| `42-om-os.mjs` | :75 |
| `44-samlenhed.mjs` | :118 |
| `50-taelleregnskab.mjs` | :88 |
| `62-uifix.mjs` | :141 |
| `64-i18nfelt.mjs` | :110 |
| `68-tjek-kun.mjs` | :100 |
| `76-produkort.mjs` | :63 |

**Assertionernes grænseværdier ændres IKKE.** CLAUDE.md: *"ret assertions, slet dem ikke."*
Ændrer et tal sig, fordi kilden er en anden, så **stop og meld det** — det er et fund om, at
databasen og filerne ikke var enige, ikke en test der skal justeres.

**To af dem er ikke rene kildeskift, læs dem før du retter:**
- `64-i18nfelt.mjs:110` kopierer alle filer til en scratch-mappe. Den skal skrive
  `hentRobotter()`s dokumenter ud som YAML i scratch-mappen i stedet.
- `76-produkort.mjs:63` kopierer udvalgte filer til en fixture. Samme mønster.

**Acceptkriterium:**
```
grep -rlE "rod, *'data', *'robots'|rod, *'data/robots'" tests/dele/*.mjs | wc -l
```
**Giver i dag: 17. Skal give 0.**
Kontrol på selve kriteriet: mønsteret er ankret på variablen `rod`, så
`22-kildetjek.mjs:73`s `path.join(testRod, 'data', 'robots')` — en fixture under en temp-rod —
**ikke** tælles med. Kør `... | grep -c 22-kildetjek` og få **0** både før og efter.

### 4. De 4 assertions, hvor sletningen koster noget

Disse er **ikke** kildeskift. Hver mister sin mening og skal have en ny.

**4a. `16-instrumentkort.mjs:156`** — holder i dag antal katalogkort (bygget fra DB) op mod
antal filer på disk. Efter sletningen bliver det DB mod DB.

**JPK har besluttet at acceptere tabet** (4. sep 2026). Skriv assertionen om, så den tæller
`hentRobotter().length` mod kortene, **og skriv en kommentar over den**, der siger, at den
uafhængige kontrolgruppe bevidst blev opgivet, med henvisning til Å183. Uden den kommentar
tror næste læser, at kontrollen stadig findes.

**4b. `35-typeskilt-katalog.mjs:241`** — bærer **L68** i sit navn:
`35.11c.${sprog}: L68 uroert - data/robots/ har 0 ucommitterede aendringer`.

**RØR DEN IKKE, FØR DU HAR LÆST STATUS.md's Å183.** Orkestratoren skriver L68's nye ordlyd
dér, *før* dette spor sendes. Testens navn er det eneste sted, beslutningen står — og
`brief`-skillens punkt 10 siger, at en assertion, der bærer et L-nummer, **er** arkivet.

Den nye assertion skal citere det L-nummer, Å183 giver den, og bevise samme regel i ny form:
**at datavejen ind i bygget kun læser.** Forslag, som du gerne må forbedre — meld det, hvis du
finder noget skarpere: assertér at `db/hent.mjs` ikke indeholder `POST`, `PATCH` eller
`DELETE`. Filen siger det allerede om sig selv på linje 29 (*"LAeS-KUN: fraDb() er et GET"*),
men ingen test håndhæver det.

**4c. `12-enheder.mjs:56`** — *"Spot har STADIG længde 1100 mm på disk"*, læst friskt uden om
bygget. Pointen er den **uafhængige** læsning: den beviser, at `normaliserRobot` regner
rigtigt, uden at gå gennem `build.mjs`. Læs samme robot friskt fra `hentRobotter()` i stedet.
Uafhængigheden af bygget bevares; uafhængigheden af databasen gør ikke. **Skriv det i
kommentaren.**

**4d. `06-vaegtklasse-anvendelse.mjs:298`** — *"ingen datafil indeholder ordet `vaegtklasse`"*,
altså: klassen er afledt, ikke gemt. Den kan blive **stærkere**: assertér at ingen af
`hentRobotter()`s dokumenter har en `vaegtklasse`-nøgle på nogen dybde. Det dækker databasen,
hvor den gamle kun dækkede filerne.

### 5. `db/hentbyg.mjs` og `tests/dele/71-hentbyg-vaern.mjs` slettes

`db/hentbyg.mjs`s hele formål er `db/eksporter.mjs --fra-db --ud=data/robots` efterfulgt af
`git commit -- data/robots` (linje 178-216). **Det er præcis den commit, L84 forbyder.**
Målt: **1 importør**, `tests/dele/71-hentbyg-vaern.mjs`, som kun tester den. Begge slettes.

**Acceptkriterium:** `grep -rl "db/hentbyg\.mjs" tests/ tools/ db/ --include=*.mjs` giver 0
filer. **Giver i dag: 1.**

**Hvorfor:** en fil, hvis eneste job er forbudt, er ikke en fil der skal rettes.

### 6. `data/robots/` slettes

Sidst, og først når 1-5 er grønne.

**Acceptkriterium:** `ls data/robots 2>/dev/null | wc -l` giver 0 og mappen findes ikke i git.
**Giver i dag: 77 YAML-filer.**

---

## Rækkefølge og commits

Commit **hvert punkt for sig**, i rækkefølgen 1 → 6. Punkt 6 er den, der ikke kan fortrydes;
alt før den skal være grønt først. Et spor, der dør undervejs, skal efterlade sine commits —
det er det eneste værn, vi har mod at skulle starte forfra.

---

## Det, briefet påstår, er påstande

**Afviger noget, du måler, fra noget, dette brief siger, så rapportér afvigelsen — det er en
del af leverancen, ikke ulydighed.** Orkestratoren kontrolleres ellers af ingen.

Tre af orkestratorens egne greps var forkerte i dag, alle fanget af kontrollinjer og ikke af
at tallet så forkert ud:

- `'data','robots'` uden mellemrum missede fem filer, fordi koden skriver `'data', 'robots'`.
- `tjek\.mjs` fangede også `kildetjek.mjs`, `linktjek.mjs`, `muteringstjek.mjs`,
  `fase2-tjek.mjs` — 19 filer i stedet for 6.
- Å182's *"18 testfiler"* indeholdt én fixture (`22-kildetjek.mjs`). Det rigtige tal er 17.

**Skriv en kontrollinje før hvert tal du måler** — hvad tallet skal være, hvis alt er som
forventet, *før* du læser det.

---

## Rapporten

`fund/FUND-sletning.md`. Formen står i `spor`-skillen. Ud over dens to obligatoriske
sektioner vil jeg have **én ekstra**: *"Assertions, hvis grænseværdi ændrede sig"* — med
gammelt tal, nyt tal og din forklaring på hvorfor. Er den tom, så skriv **tom**; det er et
resultat.
