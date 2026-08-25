# FUND-db2 — tilslutningssporet for L34 (Supabase som redaktionslag)

Arbejdssted: worktree `C:/Praktik/websites/udstilling-wt-db2`, gren `spor/db2`. Bygger videre på
det lokale fundament i `fund/FUND-db1.md` — denne rapport dækker KUN det, der krævede en rigtig
Supabase-instans: `--til-db`/`--fra-db` gjort færdige, `db/rundtur.mjs --live`, og migreringen af
alle 62 robotposter til den levende database.

## Skillevurdering

Gennemgik både de globale skills (`critique`, `impeccable`, `ui-ux-critique`) og projektets egne
(`grillmig`, `parallelt`, `robotdata`). **Ingen passer**: opgaven er backend-/database-
migreringskode mod Supabase/PostgREST, ikke UI-design (udelukker `critique`/`impeccable`/
`ui-ux-critique`), ikke robotdata-indtastning (udelukker `robotdata`), og jeg er allerede den
udsendte enkeltagent — ikke en orkestrator, der skal splitte arbejde på flere agenter
(`parallelt`) eller grille et brief før afsendelse (`grillmig`, som er til afsenderen, ikke
modtageren). Fortsatte uden skill, som `fund/FUND-db1.md` også konkluderede for det lokale spor.

## Læst fra disk (LÆS FØRST, som krævet)

`db/LAESMIG.md` (hele filen, især "Ikke bygget endnu"), `db/skema.sql` (alle 522 linjer —
tabeller, enum-typer, CHECK-constraints, RLS-afsnittet), `fund/FUND-db1.md` (fundamentets
skemavalg, formscan, selv-review), `db/migrer.mjs`, `db/eksporter.mjs`, `db/rundtur.mjs` (alle tre
i deres helhed, før noget blev ændret) samt `tools/skema.mjs`s `FELTER`/`FELTNAVNE`-eksport for at
forstå `feltdefinitioner`-opbygningen.

## Adgang og hemmelighedshåndtering

`.env` ligger i worktree'ens rod og er bekræftet gitignoreret: `git check-ignore .env` svarede
`.env` (ignoreret). Nøglen er kun læst fra disk ved runtime af `migrer.mjs`/`eksporter.mjs`s egen
`laesDotEnv()` — aldrig printet, aldrig lagt i en commit-besked, aldrig i denne rapport. Alle
probe-scripts under arbejdet læste variabelnavnene med `grep -o '^[A-Z_]*='` (kun navne, ikke
værdier) for at bekræfte, at begge nøgler var til stede, før noget forsøgte at forbinde.

## Hvad blev færdiggjort

1. **`db/migrer.mjs --til-db`** — skriver nu ALLE seks tabeller, ikke kun `robotter`. Rækkefølgen
   følger FK'erne: `robotter` (med `Prefer: return=representation` for at få de genererede
   `id`-værdier tilbage) → slug→id-opslag bygges → `forgaenger_robot_id` sættes i et ANDET pas
   (PATCH pr. robot med en forgænger, kun 1/62 i dag) → `feltposter` (1860 rækker, ét POST) →
   `feltpost_varianter` (kræver at `feltposter` findes, sammensat FK) → `anvendelse` (bruger
   opslaget til `arvet_fra_robot_id`) → `billede` (bruger opslaget til `delt_med_robot_id`) →
   `feltdefinitioner` (uafhængig, udledt direkte af `FELTER`).
2. **`db/eksporter.mjs --fra-db`** — henter robotterne med ét indlejret GET (se select-strengen
   nedenfor), bygger et id→slug-opslag, og omsætter hver rå DB-række til PRÆCIS den samme
   kanoniske form (`omdanRobotFraDb`/`omdanFeltpostFraDb`), som `db/migrer.mjs`s `klassificerRobot`
   bygger lokalt af YAML — samme form, `byggRobotDoc` (uændret) allerede ved, hvordan den skal
   skrives til YAML igen.
3. **`db/rundtur.mjs --live`** — nyt flag. Kører `migrer.mjs --til-db` → `eksporter.mjs --fra-db
   --ud=db/.tmp/rundtur-live-eksport` → samme sammenligningskode som den lokale tilstand
   (`koerSammenligning`, udtrukket til en fælles funktion, så trin 3-5 IKKE findes i to kopier, der
   kan skride fra hinanden). Den lokale tilstand (`db/rundtur.mjs`, uden flag) er UÆNDRET i sin
   opførsel og stadig bestået.
4. **`db/LAESMIG.md`** opdateret: "Tilslutningen er koblet på" i toppen, ny
   "Genkørselsstrategi"-sektion, ny "LIVE rundtur"-sektion, ny "PostgREST-overraskelser"-sektion,
   og "Ikke bygget endnu" omdøbt til "Bygget og efterprøvet" med de resterende, stadig bevidst
   ikke-byggede dele (auth, finkornet RLS, redigerings-UI) bevaret som åbne.

## Genkørselsstrategi: tøm-og-genindlæs — begrundelse

Valgt fremfor upsert på `slug`/unikke nøgler. Begrundelsen ligger i selve opgavebrevets
formulering: "migreringen er redaktionslagets fulde indlæsning, ikke en inkrementel sync". En
upsert-strategi løser kun halvdelen af det problem: den opdaterer eksisterende rækker og indsætter
nye, men opdager IKKE en robot, der er fjernet fra `data/robots/` siden sidste kørsel — det ville
kræve en selvstændig sletningsdetektion oven i upserten (diff mod eksisterende slugs, slet dem der
ikke længere findes i kildefilerne). Tøm-og-genindlæs får den sletning gratis: databasen efter
kørslen er præcis det, `data/robots/` siger, hverken mere eller mindre, uden en ekstra
sammenligningsalgoritme, der selv kunne have en fejl.

Prisen: de genererede `id`-værdier er IKKE stabile på tværs af kørsler (Postgres' `identity`-
sekvens fortsætter monotont, den nulstilles ikke af `DELETE` — bekræftet empirisk, se
"PostgREST-overraskelser" nedenfor og id-tallene i næste afsnit). Vurderet acceptabelt, fordi `id`
er den TEKNISKE nøgle (skema.sql's egen begrundelse: FK-mål, ikke forretningsidentitet), `slug` er
den FORRETNINGSMÆSSIGE, og intet uden for selve migreringskørslen (ingen anden tabel, ingen fil)
gemmer et `id`-tal på tværs af kørsler — `eksporter.mjs --fra-db` slår altid op på nuværende
`id`-værdier fra samme kørsel, aldrig en tidligere.

**Sletningsrækkefølge** (børn før forældre, plus ét særligt hensyn til selvreferencen):
`feltpost_varianter` → `feltposter` → `anvendelse` → `billede` → (UPDATE `robotter` SET
`forgaenger_robot_id = null` for alle rækker) → `robotter` → `feltdefinitioner` (uafhængig, ingen
FK). Selvreferencen (`forgaenger_robot_id`, `NO ACTION`, ingen `ON DELETE CASCADE`) nulstilles FØR
`robotter` slettes — ikke fordi jeg kunne bevise, at Postgres ville fejle på en enkelt DELETE-
sætning, der rammer både en forgænger og dens efterfølger samtidig, men fordi det gør sletningen
uafhængig af den interne evalueringsrækkefølge, i stedet for at stole på en detalje i Postgres'
constraint-timing, jeg ikke havde testet isoleret.

## Måltal (målt, ikke gættet)

**Baseline, urørt, FØR noget blev rørt:**
```
node tools/validate.mjs   → 62 fil(er) · 0 fejl · 1 advarsler
node tests/koer.mjs       → 195 bestaaet, 2 fejlet (samme to kendte, uafklarede fejl som FUND-db1.md)
node db/rundtur.mjs       → 62/62 dybt lig · validate 0 fejl · build sider 173=173 · kilder 857=857
```

**Live forbindelsesprobe (før migrering, tomme tabeller):**
```
GET robotter?select=id&limit=1&Prefer:count=exact       → 200, content-range: */0, body: []
GET feltdefinitioner?select=feltnavn&limit=1              → 200, body: []
```

**Første `--til-db`-kørsel:**
```
node db/migrer.mjs --til-db
  → Validerer 62 fil(er) foer migrering ... 62 fil(er) · 0 fejl · 1 advarsler
  → 62 robotter · 1860 feltposter · 127 varianter · 61 anvendelser · 54 billeder · 30 feltdefinitioner skrevet.
```

**Rækketal efter første kørsel** (`Prefer: count=exact` på hver tabel):
```
robotter: 62 · feltposter: 1860 · feltpost_varianter: 127 · anvendelse: 61 · billede: 54 · feltdefinitioner: 30
```

**Genkørsel — `--til-db` kørt IGEN (anden gang):**
```
node db/migrer.mjs --til-db → samme opsummeringslinje: 62 · 1860 · 127 · 61 · 54 · 30
```
Rækketal EFTER anden kørsel: identiske (62/1860/127/61/54/30) — bekræftet med samme
`count=exact`-probe. `forgaenger_robot_id` korrekt genopbygget efter tøm-og-genindlæs (kontrolleret
direkte: `mab-honey-badger-5.forgaenger_robot_id = 95`, peger på den forgænger, der findes i den
NUVÆRENDE kørsels id-rum, ikke et forældet id fra en tidligere kørsel).

**LIVE rundtur (`node db/rundtur.mjs --live`)** — denne kørsel var en TREDJE `--til-db`-kørsel:
```
1/5  node db/migrer.mjs --til-db ...
2/5  node db/eksporter.mjs --fra-db --ud=db/.tmp/rundtur-live-eksport ...
3-5/5  Dyb lighed for alle filer ...                    62/62 dybt lig.
3-5/5  node tools/validate.mjs paa den eksporterede mappe ...   62 fil(er) · 0 fejl · 1 advarsler.
3-5/5  node tools/build.mjs paa eksport vs. original ...
       eksport:  173 sider · 857 tal med kilde, 0 uden
       original: 173 sider · 857 tal med kilde, 0 uden
RUNDTUR: 62/62 dybt lig · validate 0 fejl · build sider 173=173 · kilder 857=857
RUNDTUR BESTAAET — fundamentet er efterproevet.
```
Rækketal efter denne (tredje) `--til-db`-kørsel: samme probe, samme resultat — 62/1860/127/61/54/30.

**Baseline igen, EFTER alt arbejdet (bevis for at `tools/`, `tests/`, `data/` ikke er rørt):**
```
node tools/validate.mjs   → 62 fil(er) · 0 fejl · 1 advarsler
node tests/koer.mjs       → 195 bestaaet, 2 fejlet (samme to kendte fejl)
node db/rundtur.mjs       → 62/62 dybt lig · validate 0 fejl · build sider 173=173 · kilder 857=857
```
Alle fire tal (validate/tests/lokal rundtur/live rundtur) er identiske før og efter — kun `db/`-
filerne og `db/LAESMIG.md` er ændret, som krævet.

## PostgREST-overraskelser — fundet ved afprøvning, ikke antaget

Fire ting, som ikke stod i Supabase-skillens dokumentation (`fund/FUND-db1.md`s kildeliste) og
IKKE var forudset af det uprøvede design i `db/LAESMIG.md`s tidligere "ikke bygget endnu"-afsnit.
Alle fire fundet ved direkte probe mod den levende instans, før selve migreringskoden blev skrevet
færdig — samme "mål, ikke gæt"-metode som formscannet i `fund/FUND-db1.md`:

1. **`DELETE`/`UPDATE` uden filter afvises med 400.** `DELETE .../rest/v1/robotter` (intet
   query-filter) gav `{"code":"21000","message":"DELETE requires a WHERE clause"}` — også for
   `service_role`, som ellers omgår RLS. Det er IKKE en RLS-begrænsning, men en separat
   PostgREST/Supabase-sikkerhedsspærring mod uforvarende fulde tabel-tømninger. Løst med et filter,
   der matcher enhver række på en NOT NULL-kolonne: `id=not.is.null`, `robot_id=not.is.null`,
   `feltnavn=not.is.null` (for `feltdefinitioner`, som ikke har en numerisk id-kolonne).
2. **To fremmednøgler til samme tabel gør et indlejret select tvetydigt.** Både `anvendelse` og
   `billede` har TO FK'er til `robotter` (deres egen `robot_id` OG hhv. `arvet_fra_robot_id`/
   `delt_med_robot_id`). Et naivt `?select=*,anvendelse(*)` fejler med HTTP 300 + `PGRST201`
   ("more than one relationship was found"), med et hjælpsomt hint om de to constraint-navne. Løst
   med eksplicit constraint-navngivning: `anvendelse!anvendelse_robot_id_fkey(*)`,
   `billede!billede_robot_id_fkey(*)`.
3. **En sammensat fremmednøgle kan ikke indlejres direkte fra den "fjerne" ende.**
   `feltpost_varianter`s eneste FK er den SAMMENSATTE (`robot_id`, `feltnavn`) → `feltposter` — den
   har ingen egen FK til `robotter`. `?select=*,feltpost_varianter(*)` fra `robotter` fejler med 400
   + `PGRST200` ("no matches were found... Perhaps you meant 'feltposter' instead"). Løst ved at
   indlejre variantetabellen UNDER `feltposter` i stedet: `feltposter(*,feltpost_varianter(*))`.
4. **Et 0-1-forhold kommer tilbage som et enkelt OBJEKT, ikke et ét-elements array.** Fordi
   `robot_id` i BÅDE `anvendelse` og `billede` er samtidig primærnøgle OG fremmednøgle, opdager
   PostgREST selv, at forholdet er ét-til-ét, og returnerer `"anvendelse": {...}` (eller `null`, hvis
   robotten ikke har nogen), IKKE `"anvendelse": [...]`. Dette er ikke dokumenteret som en general
   regel i det, jeg havde læst forud — bekræftet empirisk med en to-robot testopsætning (proeve-a
   med anvendelse+billede, proeve-b som arv/delingsmål) før koden mod de rigtige 62 blev skrevet.

Mindre, men værd at notere: `numeric`-kolonner (`vaerdi_tal`, `min`, `maks`, `vaerdi_imperial`)
kommer tilbage som JSON-TAL (ikke som strenge, hvilket nogle PostgREST-opsætninger gør for at
undgå præcisionstab på meget store tal) — bekræftet i selve testresponsen (`"vaerdi_tal": 12.5`,
ikke `"vaerdi_tal": "12.5"`), og efterfølgende bekræftet indirekte ved at hele den 62-fils dybe
lighed bestod uden en eneste type- eller præcisionsafvigelse.

## Selv-review

**Hvad jeg efterprøvede, og med hvilken optælling:**
- Alle seks tabellers rækketal talt eksplicit med `Prefer: count=exact` efter kørsel 1, 2 og 3 af
  `--til-db` — tre målinger, alle identiske (62/1860/127/61/54/30), ikke kun én kørsel antaget
  repræsentativ for alle.
- Den fulde 62-fils dybe lighed (trin 3 i `koerSammenligning`) kørte to gange under dette spor: én
  gang isoleret via manuel `--fra-db`-eksport + `validate.mjs`, én gang som del af
  `rundtur.mjs --live` — begge gange 62/62, ingen delvis pass.
- `--til-db` afprøvet EKSPLICIT for genkørselssikkerhed (krav 2 i opgavebrevet): kørt to gange
  direkte + én gang mere via `--live`, rækketal talt efter hver af de tre.
- Baseline (`validate.mjs`, `tests/koer.mjs`, lokal `rundtur.mjs`) kørt FØR og EFTER hele arbejdet,
  begge gange med samme tal — beviser at `tools/`, `tests/`, `data/` ikke er rørt undervejs.

**Hvad jeg IKKE nåede / sprang over:**
- Jeg testede IKKE eksplicit, hvad der sker, hvis `--til-db` afbrydes MIDT i en kørsel (fx
  netværksfejl mellem to POST-kald) — tøm-og-genindlæs betyder, at en afbrudt kørsel kan efterlade
  databasen i en delvist tømt/delvist genindlæst tilstand, indtil NÆSTE succesfulde kørsel retter
  det. Det er en kendt konsekvens af strategien (ikke transaktionel på tværs af de syv POST/DELETE-
  kald — PostgREST's REST-grænseflade giver ikke en tværgående transaktion uden en database-
  function/RPC, som opgavebrevet ikke bad om), men jeg har ikke simuleret fejlen for at se den
  faktiske mellemtilstand.
- Jeg har IKKE testet `--til-db` mod et datasæt, der er FJERNET en robot fra `data/robots/` mellem
  to kørsler (fx: kør, slet én YAML-fil lokalt, kør igen, bekræft at DB-rækken forsvinder). Logisk
  følger det af tøm-og-genindlæs-designet (databasen bygges fra bunden af de filer, der findes NU),
  men det er en logisk følgeslutning, ikke en målt test — nævnes her, så det ikke fremstår som
  efterprøvet, når det ikke er.
- Batch-størrelsen for `feltposter` (1860 rækker i ÉT POST-kald) blev IKKE stresset ud over den
  faktiske kørsel — jeg forsøgte ikke bevidst større datamængder for at finde en øvre grænse.
  62 robotter er hele det nuværende datasæt, så grænsen er ikke relevant i dag, men en fremtidig
  vækst i antal robotter kunne i princippet ramme en payload- eller statement-timeout-grænse, som
  denne kørsel ikke har afdækket.
- `db/.tmp/live-eksport-test` (en ad hoc-mappe fra en manuel probe tidligt i arbejdet, FØR
  `rundtur.mjs --live` fandtes) blev slettet undervejs; senere forsøg på at rydde den igen med
  `rm -rf` blev afvist af sandboxens tilladelsessystem — den er under `.gitignore`s `.tmp/`-mønster
  (bekræftet i `.gitignore` linje 19) og påvirker derfor hverken git-status eller nogen test, men
  den er ikke fysisk fjernet fra disken efter det afviste forsøg. Ufarligt, men nævnt for
  ærlighedens skyld.

**PostgREST-adfærd, der afveg fra min forventning (ud over de fire dokumenterede overraskelser):**
- Jeg havde forventet, at `Prefer: return=representation` på en fejlende INSERT ville give et
  brugbart delvist resultat — testede det ikke direkte (ingen af de rigtige 62-robotters INSERTs
  fejlede), så det er en antagelse, ikke en målt adfærd.
- Identity-sekvensen for `robotter.id` fortsætter på tværs af `DELETE`-kald (forventet, da `bigint
  generated always as identity` ikke er det samme som `serial` med en manuel resættelig sekvens,
  men Postgres nulstiller aldrig en identity-sekvens automatisk ved DELETE under nogen
  omstændighed) — bekræftet ved at se `id`-værdier stige gennem testkørslerne (2, 3, 5, 7, ... op
  til flere hundrede efter de mange test-inserts/-deletes under selve udviklingen af koden). Ingen
  overraskelse i sig selv, men værd at have skrevet ned, så en fremtidig læser af databasen ikke
  fejlagtigt slutter noget af, at `robotter.id` ikke starter ved 1.

**Skemavalg eller kodevalg, en anden læser rimeligt kunne træffe anderledes:**
- Tøm-og-genindlæs frem for upsert (begrundet ovenfor) — en anden læser kunne foretrække upsert +
  eksplicit sletningsdetektion for at bevare `id`-stabilitet på tværs af kørsler, hvis noget uden
  for denne kodebase nogensinde begynder at gemme et `robotter.id`-tal langtidsholdbart. I dag gør
  intet det.
- `feltposter` skrives i ÉT POST-kald (1860 rækker) i stedet for at chunke i mindre batches.
  Fungerede uden problemer i denne afprøvning, men er ikke stress-testet ved en betydeligt større
  fremtidig datamængde (se ovenfor).

**Filer i denne leverance:** `db/migrer.mjs`, `db/eksporter.mjs`, `db/rundtur.mjs`,
`db/LAESMIG.md`, `fund/FUND-db2.md`. Ingen filer uden for `db/` og `fund/` er rørt.
