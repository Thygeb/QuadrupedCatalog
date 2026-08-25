# FUND-db1 — det lokale fundament for L34 (Supabase som redaktionslag)

Arbejdssted: worktree `C:/Praktik/websites/udstilling-wt-db`, gren `spor/db`. Alt arbejde er
lokalt — der findes intet Supabase-projekt endnu (25. aug 2026).

## Skillvurdering

- **`robotdata`** — valgt. Læst fra disk (`.claude/skills/robotdata/SKILL.md`) som en del af
  "LÆS FØRST". Databaseskemaet er udledt af de fire tilstande og de ti hårde regler, den bærer.
- **`grillmig`** — fravalgt. Bruges før et brief sendes eller en åben beslutning låses. L34 er
  allerede en låst beslutning (grillet, jf. STATUS.md), og jeg er modtageren af briefet, ikke
  afsenderen.
- **`parallelt`** — fravalgt for selve denne opgave. Jeg er den udsendte subagent for hele sporet,
  og de fem leverancer har hård sekvens (skema → migrer → eksporter → rundtur), så en yderligere
  opdeling i flere agenter ville skabe filkollisioner i `db/` uden gevinst. Gjort direkte, jf.
  instruksen om ikke at re-uddelegere hele opgaven.

## Læst fra disk

`STATUS.md` (L34 samt L30/L32), `tools/skema.mjs`, `tools/yaml.mjs`, `tools/validate.mjs` (hele
filen, R0-R18), `tools/build.mjs`, `.claude/skills/robotdata/SKILL.md`.

## CEO-tilføjelse: Supabase' egne agent-skills

Hentet med WebFetch, FØR `db/skema.sql` blev skrevet:

- `skills/supabase-postgres-best-practices/SKILL.md` (indeksfil) → henviste til
  `references/schema-constraints.md`, `schema-data-types.md`, `schema-primary-keys.md`,
  `schema-foreign-key-indexes.md`, `schema-lowercase-identifiers.md`, `security-rls-basics.md`,
  `security-privileges.md` — alle hentet (kun skema/RLS-relevante, ikke hele repoets 34 filer;
  `schema-partitioning.md`, `advanced-*`, `conn-*`, `data-*`, `lock-*`, `monitor-*`, `query-*`
  sprunget over som irrelevante for 62 rækker).
- `skills/supabase/SKILL.md` (generel brug) → kun én reference (`skill-feedback.md`, irrelevant),
  ellers egen tekst om at aldrig eksponere `service_role`-nøglen i en offentlig klient.

Se afsnittet "Supabase-skillens anbefalinger" nedenfor for hvad der blev fulgt og fravalgt.

---

## Formscan — den mekaniske opgørelse (ikke hukommelse)

Engangsscript i scratchpad, kørt mod alle 62 `data/robots/*.yaml` med projektets egen
`tools/yaml.mjs`/`tools/skema.mjs`. Rå JSON-uddata er grundlaget for hvert skemavalg nedenfor.

**Topnøgler** (ud af 62 filer): slug 62 · navn 62 · producent 62 · producentland 62 ·
producentby 46 · status 62 · anvendelse 61 · noter 59 · billede 46 · felter 62 ·
foerste_udgivelse 3 · varianter 7 · forgaenger 1.

**1860 feltposter (62 × 30) fordeler sig i PRÆCIS syv former, uden rest:**

| Form | Antal | Form i YAML |
|---|---:|---|
| `bare_tilstand` | 899 | ren streng: `feltnavn: ikke_oplyst` |
| `tilstand_med_herkomst` | 111 (105 ikke_oplyst + 6 nej) | `{ vaerdi: <tilstand>, kilde, hentet, ... }` |
| `tal` | 556 | `{ vaerdi: <tal>, enhed, kilde, hentet, ... }` |
| `interval` | 48 | `{ min, maks, enhed, kilde, hentet, ... }` |
| `tekst` | 167 | `{ vaerdi: <tekst>, kilde, hentet, ... }` |
| `bool` | 43 | `{ vaerdi: true/false, kilde, hentet, ... }` |
| `liste` | 36 | `{ vaerdi: [tekst, ...], kilde, hentet, ... }` |

`nej` og `kun_billede` forekommer **aldrig** som bar skalarstreng i de 62 filer i dag (0
forekomster) — kun `ikke_oplyst` gør (899 gange). `kun_billede` forekommer slet ikke nogen steder
(0/1860). Begge står alligevel i `tilstand_enum`, fordi skemaets sandhed (`TILSTANDE` i
`skema.mjs`) definerer dem, og en tilstand, ingen robot bruger i dag, er ikke det samme som en
tilstand, der ikke findes.

**`POST_NOEGLER`-brug:** vaerdi 914 · kilde 961 · hentet 961 · advarsel 682 · enhed 604 ·
vaerdi_imperial/enhed_imperial 26/26 · ved_last 52 · operator 142 · min/maks 48/48 ·
varianter 37 (se rettelse nedenfor) · kildetype 4 (alle `sekundaer`, 0 eksplicit `primaer`).
`raa` og `valuta`: **0 forekomster** — strukturelt gyldige kolonner, aktuelt tomme.

kilde=961 og hentet=961 er identisk: **hver eneste ikke-bar-tilstand-post** (961 = 850 talposter
jf. `build.mjs`'s "850 tal med kilde" + 111 tilstand_med_herkomst) bærer kilde+hentet — det
bekræfter empirisk, at R6/R7 gælder alle syv former undtagen `bare_tilstand`, ikke kun talfelter.

**Topnøglerne `anvendelse` og `billede`:** 61/62 hhv. 46/62 robotter har dem. Alle 46 billeder har
`ophav: fabrikant` (SPÆRRING S1's problem, ikke denne opgaves). `anvendelseTilstand` (bar streng
"ikke_oplyst") = 0 — alle 61 er kort-formen, selv de ikke_oplyst-markerede. `noterListe` = 59,
`noterString` = 0 (altid liste i dag, men R1 tillader begge, og `robotter.noter` er derfor `jsonb`,
ikke `text[]`).

### Tre ting, formscannet fandt, som IKKE var antaget på forhånd

1. **`varianter`-blokke findes på alle arter, ikke kun `art: 'tal'`.** Første klassificeringsforsøg
   hægtede kun `varianter` på talfelter og fangede 35 af 37 forekomster — de sidste 2 sad på
   `ip_klasse` (art `ip`) og `dockingstation` (art `jaNej`), fanget da `db/migrer.mjs` kørte og en
   efterfølgende målrettet scan viste 37 poster med `varianter` på tværs af tal, tekst, ip, jaNej
   OG liste. Rettet i `klassificerFeltpost`, så `varianter` hægtes på **efter** formen er afgjort,
   uafhængigt af den.
2. **`ved_last` kan være en tilstand OG bære en enhed samtidig.** Yobotics Y20's `driftstid` har
   `ved_last: { vaerdi: ikke_oplyst, enhed: kg }` — præcis den sag, `STATUS.md`s D10/R10-note selv
   beskriver ("Med last, kg ikke oplyst" er en anden oplysning end "ingen lastbetingelse"). Første
   udgave af `eksporter.mjs` tabte `enhed`, når `ved_last` var en tilstand. Rettet.
3. **Et tekstfelt kan bære et talinterval SOM SIDESPOR ved siden af sin egen tekst.** Boston
   Dynamics' Spot skriver `stroem_ud` (art `tekst`) som `"ureguleret DC 35-58,8 V, 150 W pr. port"`
   **og samtidig** `min: 35, maks: 58,8, enhed: V`. `tools/validate.mjs`s egen kildekode nævner
   netop dette eksempel i en kommentar ("Spot skriver 'ureguleret DC 35-58,8 V'") — men det stod
   ikke i mit oprindelige skema, og rundtursтesten fangede det som ét mismatch ud af 1860 poster.
   `db/skema.sql` tillader nu `min`/`maks` som sidespor på `tekst`/`bool`/`liste`-former, ikke kun
   på den rene `interval`-form (se `feltposter_min_maks_kun_paa_disse_former`).

Alle tre blev fundet af **rundtursтesten selv** (62/62-kravet), ikke ved gennemlæsning — det er
grunden til, at rundturen er fundamentets færdighedskriterium og ikke en formalitet.

### En fjerde ting: en parser-fælde i `tools/yaml.mjs`, ikke i mine data

Første eksportforsøg gav **49/62 dybt lig**, med 12 filers `noter`-liste kortere end originalen
(fx `bhairav-robotics-shvana`: 11 originale poster blev til 36 efter eksport). Årsagen ligger i
`tools/yaml.mjs`s **flow-liste-læser** (`laesFlow`): dens citat-sporing tjekker ikke, om et
anførselstegn er escaped med et forudgående backslash — modsat `fjernKommentar` i samme fil, som
har præcis den kontrol. Noter, der selv citerer en producent (`\"...\"`), splitter derfor forkert,
når de skrives som `noter: ["...", "..."]` på én linje. Rettelsen var **ikke** at røre
`tools/yaml.mjs` (uden for denne opgaves skrivetilladelse, og en reel fejlretning i delt kode hører
til sit eget spor) — men at `db/eksporter.mjs` aldrig skriver en flow-liste for strenge: alle
lister skrives som **bloksekvens** (`- "..."` pr. linje), hvor `laesSkalar` bruger `JSON.parse` på
hele linjen og håndterer `\"` korrekt. Efter rettelsen: **62/62 dybt lig**.

---

## Skemavalg — begrundelse

**Primærnøgle:** `id bigint generated always as identity` (Supabase-skillens anbefaling — undgår
UUID v4-fragmentering) **plus** `slug text unique not null` (opgavebrevets krav). De erstatter ikke
hinanden: `id` er FK-målet, `slug` er forretningsnøglen R14 og hele YAML-kæden allerede kender.

**`feltposter`: én bred tabel, ikke EAV.** 62 × 30 = 1860 rækker, altid — også som `ikke_oplyst`.
Det spejler D7/L30's nævner direkte: nævneren ER 30, fordi alle 30 felter altid skrives.
`form`-kolonnen (`feltform_enum`, 7 værdier — se formscannet) er R4 skrevet som CHECK i stedet for
applikationslogik.

**`jsonb` for scalar-eller-liste, ikke to kolonner med en switch.** `robotter.noter`,
`anvendelse.vaerdi`, `anvendelse.citat` kan hver være **enten** en streng **eller** en liste af
strenge i YAML, og en streng og en 1-elements liste er IKKE det samme i rundtursтesten. `jsonb`
bevarer formen præcist uden en ekstra diskriminator-kolonne.

**`producentfelter bor på robotposten`, ingen egen `producenter`-tabel.** Ikke en afvigelse fra i
dag: `tools/build.mjs` udleder selv "producenter" af robotternes eget `producent`-felt (en Map),
fordi `data/manufacturers/` er tom. En separat tabel ville kræve en normaliseringsbeslutning
(samme producent stavet forskelligt to steder?), som ingen af de 62 filer tester i dag, og som L34
ikke bad om at løse.

**`feltdefinitioner`: en tabel udledt af `FELTER`, aldrig håndskrevet.** `db/migrer.mjs` fylder den
fra `tools/skema.mjs` ved hver kørsel — den mekaniske håndhævelse af "databaseskemaet skal udledes
af skemaet, ikke opfindes". Bruges ikke af CHECK-constraints (Postgres CHECK kan ikke slå op i en
anden tabel), men er en maskinlæsbar kopi til en fremtidig UI eller et reviewscript.

**`anvendelse`/`billede`: egne tabeller, ikke kolonner på `robotter`.** Begge er topnøgler, der med
vilje ligger uden for `felter` i `skema.mjs` (tæller ikke i specifikationstætheden) — en separat
0-1-tabel gør fraværet af en robots anvendelse/billede til fravær af en RÆKKE, ikke en
NULL-udfyldt kolonne, hvilket er den samme sondring som "ikke_oplyst" vs. fravær andre steder i
skemaet.

**Enum for de tre tilstande, ikke tekst+CHECK.** Supabase-skillens `schema-data-types.md` anbefaler
enum netop når værdisættet er stabilt og sjældent ændres — TILSTANDE har stået fast siden projektets
start. "De fire tilstande" (ikke_oplyst/nej/0/kun_billede) kan strukturelt ALDRIG kollapse: de tre
første er enum-medlemmer, og `0` kan kun opstå som `form='tal', vaerdi_tal=0` — en helt anden
kolonne.

**RLS: "basis", ikke finkornet.** RLS slås til på alle seks tabeller UDEN nogen `anon`/
`authenticated`-policy — Postgres' egen default-luk-alt. Kun `service_role` (altid BYPASSRLS)
læser/skriver. Begrundelse: Supabase er redaktørens eget redskab (L34), ikke en offentlig API —
siden bygges stadig statisk fra YAML.

---

## De 18 regler — hvor de håndhæves

| Regel | Hvad den kræver | Håndhæves |
|---|---|---|
| R0 | YAML-syntaks er gyldig | *(ikke en af de 18 — parserfejl, ikke en skemaregel)* |
| R1 | Identitetsfelter NOT NULL; ukendte topnøgler forbudt | **I DB** (NOT NULL) + strukturelt (rigidt kolonnesæt kan ikke bære en ukendt topnøgle) |
| R2 | Ukendt feltnavn forbudt | **I DB** (`feltnavn_enum` — en værdi uden for de 30 kan slet ikke INSERTes) |
| R3 | Kun de tre tilstande er gyldige | **I DB** (`tilstand_enum`). Normalisering af mellemrum→understreg sker før DB (migrer.mjs) |
| R4 | Vaerdi XOR min/maks; ukendte nøgler forbudt | **I DB** (`form`-diskriminator + CHECK pr. form) |
| R5 | Talfelt kræver kendt enhed af rette dimension | **Delvist i DB** (enhed NOT NULL når tal/interval/sidespor) — at enheden hører til feltets DIMENSION kræver opslag i `feltdefinitioner` (ingen subquery i CHECK) → **ved migrering/validate** |
| R6 | Kilde er en http(s)-URL | **I DB** (NOT NULL når krævet + regex-CHECK) |
| R7 | Hentedato er YYYY-MM-DD | **I DB** (kolonnetype `date` afviser ugyldige datoer strukturelt) |
| R8 | Operator er en af de seks | **I DB** (`operator_enum`) |
| R9 | Metrisk+imperial sammen, ikke hver for sig; %-afvigelse tjekkes | **Delvist i DB** (par-CHECK: begge eller ingen) — %-tolerance kræver runtime-udregning → **ved validate** |
| R10 | `ved_last` kun på driftstid; driftstid (tal/interval) kræver `ved_last` | **I DB** (CHECK bundet til `feltnavn = 'driftstid'`) |
| R11 | Ukendte nøgler i en feltpost forbudt | Strukturelt (rigidt kolonnesæt — en tastefejl i en nøgle kan ikke opstå) |
| R12 | `raa` skal indeholde værdien, operatoren skal matche | **Ikke i DB** — kræver strengparsing (`findTal`/`normaliser`) → **ved validate** |
| R13 | IP-klasse skal ligne "IP65" | **I DB** (regex-CHECK, kun når `feltnavn='ip_klasse'`) |
| R14 | Slug = filnavn | **Strukturelt ved eksport** (`eksporter.mjs` navngiver filen efter `slug` — kan ikke divergere) |
| R15 | Variantnavne på et felt ⊆ robottens egen `varianter`-liste | **Ikke i DB** (kræver opslag på tværs af rækker/tabeller, Postgres CHECK tillader ikke subqueries) → **ved migrering** (før INSERT) |
| R16 | Anvendelse kræver citat, medmindre ikke_oplyst; ikke_oplyst uden citat/arv | **Delvist i DB** (er_ikke_oplyst/citat-CHECK'ene) — at hver kategori-værdi er en af de syv gyldige kræver iteration over en jsonb-liste, som CHECK ikke kan uden subquery → **ved migrering/validate** |
| R17 | Arv: moderen findes, har selv en kategori, er ikke selv en arv, barnets kategorier ⊆ moderens, citat/kilde matcher moderens | **Delvist i DB** (FK sikrer "moderen findes") — resten er cross-row-logik → **ved validate** (kører på den eksporterede mappe i `db/rundtur.mjs`) |
| R18 | Billede: ophav påkrævet, kilde påkrævet for silhuet/fabrikant, sti-regler, fil skal findes på disk | **Delvist i DB** (ophav/kilde-CHECK) — stiregler og fileksistens kræver filsystemopslag → **ved validate** |

**Én regel, jeg tilføjede UD OVER R1-R18** (bør kunne fravælges): `feltposter_raa_kun_paa_tal`
tillader kun `raa` på `tal`/`interval`-former. `tjekRaa` kaldes i praksis kun fra `tjekTalfelt`, så
dette følger logisk af koden — men R11 selv tillader nøglen strukturelt overalt. Har 0 forekomster
i data i dag, så den er uprøvet mod en modstridende sag.

---

## Rundturstal (målt, ikke gættet)

```
1/5  node db/migrer.mjs                         → 0 fejl, 1 advarsel (samme som baseline)
2/5  node db/eksporter.mjs --ud=.../rundtur-eksport
3/5  Dyb lighed, alle 62 filer                   → 62/62 dybt lig
4/5  node tools/validate.mjs paa eksport-mappen  → 62 fil(er) · 0 fejl · 1 advarsel
5/5  node tools/build.mjs, eksport vs. original  → 173 sider = 173 sider
                                                    850 tal med kilde = 850 · 0 uden = 0 uden
RUNDTUR BESTAAET.
```

Sidetal og kildetal er **målt i selve testkørslen** (begge build-kørsler sker inde i
`db/rundtur.mjs`), ikke hardkodet fra en tidligere session — testen forbliver gyldig, hvis
datasættet vokser.

**Baseline på de URØRTE originaler** (kørt separat, som bevis for at intet i kæden er rørt):

```
node tools/validate.mjs   → 62 fil(er) · 0 fejl · 1 advarsler
node tests/koer.mjs       → 195 bestaaet, 2 fejlet (samme to kendte, uafklarede fejl som før:
                             "interval 18-25 kg kollapser ikke til sit midtpunkt" og
                             "to filer med samme kategorier i modsat raekkefoelge")
```

Begge tal er identiske før og efter mit arbejde — `tools/`, `tests/` og `data/` er ikke rørt.

---

## Supabase-skillens anbefalinger — fulgt og fravalgt

| Anbefaling (kilde) | Fulgt / fravalgt | Begrundelse |
|---|---|---|
| Lowercase snake_case-identifikatorer (`schema-lowercase-identifiers.md`) | **Fulgt** | Matcher allerede `skema.mjs`s danske feltnavne — ingen oversættelse nødvendig |
| Eksplicit indeks på hver FK-kolonne (`schema-foreign-key-indexes.md`) | **Fulgt** | Alle FK-kolonner har deres eget indeks (`robot_id`, `feltnavn`, `forgaenger_robot_id`, `arvet_fra_robot_id`) |
| `bigint identity` som primærnøgle, ikke UUID v4 (`schema-primary-keys.md`) | **Fulgt, men tilpasset** | `id` er `bigint identity` som teknisk nøgle — men skillen nævner slet ikke naturlige nøgler/slugs, og opgavebrevet kræver "slug er nøgle". Løsning: begge, `slug UNIQUE NOT NULL` ved siden af |
| Enum for stabile, sjældent ændrede værdisæt (`schema-data-types.md`) | **Fulgt** | Alle fem enum-typer (tilstand, status, kildetype, operator, ophav, form, feltnavn) |
| `text` frem for `varchar(n)` (`schema-data-types.md`) | **Fulgt** | Ingen `varchar(n)`-kolonner nogen steder |
| `timestamptz` frem for `timestamp` (`schema-data-types.md`) | **Ikke relevant** | Ingen tidsstempler i skemaet — `hentet` er en `date` (en dag, ikke et tidspunkt), matcher YAML'ens `YYYY-MM-DD` |
| RLS: enable + policies pr. rolle (`security-rls-basics.md`) | **Fulgt, men tilpasset** | Eksemplerne er alle multi-tenant (bruger A vs. bruger B). Her: RLS slået til UDEN policy = default-luk-alt, kun `service_role`. Ingen `authenticated`-policy bygget — der er ingen redigerings-UI endnu |
| Least privilege / REVOKE fra `public` (`security-privileges.md`) | **Fulgt** | `revoke all ... from public, anon, authenticated` i skemaets sidste linjer |
| `supabase-js`/`@supabase/ssr` som klientvej (`skills/supabase/SKILL.md`) | **Fravalgt** | Projektets CLAUDE.md kræver nul npm-afhængigheder. `fetch` mod PostgREST direkte er den samme underliggende REST-grænseflade, `supabase-js` selv kalder |
| "Never expose service_role key in public clients" (`skills/supabase/SKILL.md`) | **Fulgt** | Nøglen læses kun server-side i `migrer.mjs`/`eksporter.mjs` via `.env` (gitignoreret) |
| Deklarativt skema (`supabase/schemas/` + `db pull`) vs. imperativt (`execute_sql`) (`skills/supabase/SKILL.md`) | **Ikke relevant endnu** | Kræver Supabase CLI og et levende projekt — fundamentet er en enkelt SQL-fil, JPK selv limer ind. Bliver relevant, når projektet findes |

Rangorden ved konflikt (som CEO'en bad om): projektets egne regler vandt alle tre steder, hvor de
stod imod skillens generelle anbefaling (npm-afhængighed, primærnøgle-form, RLS-mønster).

---

## Selv-review

**Hvad jeg IKKE nåede:**
- `--til-db`/`--fra-db` er kodet, men **ikke afprøvet** mod en rigtig Supabase-instans (findes
  ikke). Konkret ufuldstændigt: slug→id-opslag efter INSERT for `forgaenger_robot_id`/
  `arvet_fra_robot_id`/`delt_med_robot_id` og for `feltposter`/`anvendelse`/`billede` generelt (kun
  `robotter`-tabellen skrives i `--til-db` i dag) — se `db/LAESMIG.md`.
- `db/skema.sql` er **ikke kørt mod en rigtig Postgres-instans** — der findes ingen lokalt
  (`psql` er ikke installeret på maskinen). Den er læst igennem manuelt to gange og rettet to
  reelle fejl undervejs (`array_length` på et tomt array returnerer NULL, ikke 0 — CHECK ville have
  lukket øjnene for en tom liste; et redundant indeks fjernet). Der kan stadig være syntaksfejl,
  jeg ikke har set — anbefaling: kør `db/skema.sql` i Supabase' SQL-editor FØR `migrer.mjs --til-db`
  og ret eventuelle fejl der, ikke antag filen er perfekt.
- R15's fulde krav (variantnavn ⊆ robottens egen liste) er kun tjekket implicit, fordi
  `validate.mjs` allerede har godkendt kildedataene — `db/migrer.mjs` gentjekker det ikke selv før
  INSERT. Var kilden ikke allerede valideret, ville en fejl her først vise sig som en fremmed
  variant i `feltpost_varianter` uden en synlig fejlbesked.

**Skemavalg, en anden læser rimeligt kunne træffe anderledes:**
- `feltposter_raa_kun_paa_tal` (se ovenfor) — en tilføjet begrænsning, R11 ikke selv kræver.
- `anvendelse`/`billede` som egne tabeller frem for JSONB-kolonner på `robotter`. Jeg valgte
  relationelle tabeller for CHECK-håndhævelse og FK-integritet (arv/deling kan pege på en anden
  robot med en rigtig fremmednøgle) — men en enklere DB kunne argumentere for at samle dem som
  JSONB på robotposten, på bekostning af at miste FK'erne til `arvet_fra`/`delt_med`.
  - `foerste_udgivelse` som `integer` (kun årstal) frem for `date` — matcher de tre observerede
  værdier (2017/2021/2025), men hvis en producent nogensinde oplyser en fuld dato, kræver det en
  skemaændring.
- RLS-designet ("ingen policy = default-luk") er den billigste mulige "basis", men betyder også at
  ALT arbejde i dag sker som `service_role` — der er ingen mellemvej (en læse-only rolle til fx et
  fremtidigt dashboard), før nogen aktivt bygger den.

**Filer i denne leverance:** `db/skema.sql`, `db/migrer.mjs`, `db/eksporter.mjs`, `db/rundtur.mjs`,
`db/LAESMIG.md`, `fund/FUND-db1.md`, én linje (+ forklarende kommentar) i `.gitignore`.
`db/kanonisk.json` og `db/seed.sql` er genererede outputs af `migrer.mjs` og committes som
tilstandsbevis, ikke som håndskrevet kilde — de regenereres ved hver `node db/migrer.mjs`-kørsel.
