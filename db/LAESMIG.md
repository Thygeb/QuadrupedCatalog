# db/ — Supabase som redaktionslag (L34)

Læs [STATUS.md](../STATUS.md) L34 først for selve beslutningen. Denne fil er
**hvordan**, ikke **hvorfor**.

**Tilslutningen er koblet på (25. aug 2026).** Der findes et rigtigt
Supabase-projekt, `db/skema.sql` er kørt i det, og `--til-db`/`--fra-db` er
afprøvet mod det — se `fund/FUND-db2.md` for måltallene (rækketal,
genkørsel, live rundtur). Det lokale fundament (`fund/FUND-db1.md`) er
stadig sandheden for selve skemavalgene og formscannet — denne fil beskriver
nu BEGGE veje, lokal og live.

## Filerne

| Fil | Hvad den gør |
|---|---|
| `skema.sql` | Postgres/Supabase-DDL. Kør den i Supabase' SQL-editor (eller `psql`), én gang, i et tomt projekt |
| `migrer.mjs` | `data/robots/*.yaml` → DB. Lokalt: skriver `seed.sql` + `kanonisk.json`. `--til-db`: skriver til en rigtig Supabase-instans |
| `eksporter.mjs` | DB → YAML-filer. Lokalt: læser `kanonisk.json`. `--fra-db`: læser fra en rigtig Supabase-instans |
| `rundtur.mjs` | Færdighedstesten: kører migrer → eksporter → sammenligner mod originalerne, kører `tools/validate.mjs` og `tools/build.mjs` på resultatet |
| `kanonisk.json`, `seed.sql`, `.tmp/` | **Genereret.** Ikke til redigering, ikke commitet — se `.gitignore` |

## Rækkefølgen, når projektet findes

1. **Opret Supabase-projektet.** Notér projekt-URL'en og `service_role`-nøglen
   (Project Settings → API).
2. **Kør `db/skema.sql`** i SQL-editoren. Det opretter enum-typerne, de seks
   tabeller og slår RLS til — se filens egne kommentarer, hver eneste
   beslutning har en begrundelse ved siden af, ikke kun i denne fil.
3. **Opret `.env`** i **projektroden** (samme mappe som `CLAUDE.md`, ikke i
   `db/`):

   ```
   SUPABASE_URL=https://<projekt>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role-nøglen fra Project Settings>
   ```

   `.env` er tilføjet til `.gitignore` (én linje, jf. opgavebrevet) — nøglen
   må **aldrig** committes, og må **aldrig** bruges i en offentlig klient
   (browserkode, en fremtidig redigerings-UI's frontend). Den bruges kun af
   `migrer.mjs`/`eksporter.mjs`, som begge kører lokalt på din maskine eller i
   en agent-worktree, aldrig i browseren.

4. **`node db/migrer.mjs --til-db`** — skriver alle 62 robotter (plus deres
   feltposter, varianter, anvendelse, billeder og feltdefinitioner) til
   databasen. Genkørselssikker — se "Genkørselsstrategi" nedenfor.
5. **`node db/eksporter.mjs --fra-db --ud=<mappe>`** — henter dem tilbage som
   YAML, i samme kanoniske form som den lokale vej.
6. **`node db/rundtur.mjs --live`** — kører 4-5 automatisk, plus dyb lighed
   mod `data/robots/`, `tools/validate.mjs` og en `tools/build.mjs`-
   sammenligning. Se "LIVE rundtur" nedenfor.

Alle tre trin er afprøvet mod en rigtig instans 25. aug 2026 — se
`fund/FUND-db2.md` for måltallene. Det lokale spor (uden `--til-db`/
`--fra-db`) er stadig kørt og efterprøvet uændret, se `fund/FUND-db1.md`.

## Genkørselsstrategi: tøm-og-genindlæs, ikke upsert

`--til-db` er redaktionslagets **fulde indlæsning**, ikke en inkrementel
sync (opgavebrevets egen formulering) — hver kørsel tømmer alle seks
tabeller og genindlæser dem fra `data/robots/*.yaml` fra bunden. Valgt frem
for upsert på slug/unikke nøgler, fordi upsert kun løser HALVDELEN af
problemet: den opdaterer og indsætter, men opdager ikke en robot, der er
FJERNET fra `data/robots/` siden sidste kørsel — det ville kræve en separat
sletningsdetektion oven i upserten. Tøm-og-genindlæs får den sletning
gratis: databasen efter kørslen er *præcis* det, `data/robots/` siger,
hverken mere eller mindre.

Prisen: de genererede `id`-værdier er **ikke** stabile på tværs af kørsler
(Postgres' `identity`-sekvens fortsætter, den nulstilles ikke af `DELETE`).
Det er accepteret, fordi `id` er den TEKNISKE nøgle (`db/skema.sql`'s egen
begrundelse), `slug` er den FORRETNINGSMÆSSIGE — og intet uden for selve
migreringskørslen gemmer et `id` på tværs af kørsler.

**Rækkefølgen sletningen sker i** (børn før forældre, plus ét særligt
hensyn): `feltpost_varianter` → `feltposter` → `anvendelse` → `billede` →
(nulstil `robotter.forgaenger_robot_id` med en UPDATE) → `robotter` →
`feltdefinitioner` (uafhængig, ingen FK). Selvreferencen
(`forgaenger_robot_id`) nulstilles FØR `robotter` slettes, så sletningen ikke
er afhængig af, i hvilken intern rækkefølge Postgres evaluerer FK'en inden
for én DELETE-sætning.

Målt: `--til-db` kørt **tre gange** i træk (to direkte, én som del af
`rundtur.mjs --live`) — rækketal identiske efter hver: 62 robotter · 1860
feltposter · 127 varianter · 61 anvendelser · 54 billeder · 30
feltdefinitioner. Se `fund/FUND-db2.md`.

## LIVE rundtur (`db/rundtur.mjs --live`)

Samme fem trin som den lokale rundtur, men trin 1-2 går mod den rigtige
Supabase-instans (`migrer.mjs --til-db` / `eksporter.mjs --fra-db`) i stedet
for `db/kanonisk.json`. Trin 3-5 (dyb lighed, `tools/validate.mjs`,
`tools/build.mjs`-sammenligning) er bogstaveligt samme kode som den lokale
tilstand (`koerSammenligning` i `db/rundtur.mjs`) — kun mappen, der
sammenlignes mod, skifter. Kræver `.env`. Målt resultat, se `fund/FUND-db2.md`.

## Tilslutningsformen: fetch mod PostgREST, ikke supabase-js

Projektets CLAUDE.md kræver nul npm-afhængigheder. Supabase' egen
`skills/supabase/SKILL.md` (hentet 25. aug 2026, se `fund/FUND-db1.md`)
anbefaler ellers klientbiblioteket `supabase-js` til stort set alt — men
`supabase-js` er selv blot et tyndt lag oven på **PostgREST**, Supabase' REST-
grænseflade, og den grænseflade er offentligt dokumenteret og kan kaldes
direkte med indbygget `fetch`. Det er vejen, `migrer.mjs`/`eksporter.mjs`
bruger:

```
GET  <SUPABASE_URL>/rest/v1/robotter?select=*,feltposter(*,feltpost_varianter(*)),
       anvendelse!anvendelse_robot_id_fkey(*),billede!billede_robot_id_fkey(*)
POST <SUPABASE_URL>/rest/v1/robotter
headers: apikey: <service_role>, Authorization: Bearer <service_role>,
         Content-Type: application/json, Prefer: return=representation
```

(Select-strengen ovenfor er den FAKTISKE forme, `eksporter.mjs --fra-db`
bruger — se "PostgREST-overraskelser" nedenfor for hvorfor den ikke er den
naive `feltposter(*),anvendelse(*),billede(*)`, en uprøvet læsning ville
have skrevet.)

`service_role` omgår RLS (se `skema.sql`'s afsnit 7) — det er meningen: disse
scripts ER redaktøren, ikke en offentlig bruger, og kravet "brug aldrig
service_role i en offentlig klient" (Supabase-skillens egen advarsel) er
netop grunden til, at nøglen kun læses server-side her, via `.env`.

## PostgREST-overraskelser — fundet ved afprøvning, ikke antaget

25. aug 2026, `spor/db2`. Fire ting, en uprøvet læsning af Supabase-skillens
dokumentation IKKE ville have fanget — se `fund/FUND-db2.md` for den fulde
udredning, her kun konklusionen:

1. **`DELETE`/`UPDATE` uden filter afvises hårdt** (400, `DELETE requires a
   WHERE clause`, kode `21000`) — også for `service_role`, som ellers
   omgår RLS. Løsning: et filter, der matcher enhver række,
   `<NOT NULL-kolonne>=not.is.null` (fx `id=not.is.null` på `robotter`).
2. **To fremmednøgler til samme tabel gør et indlejret select tvetydigt.**
   `anvendelse` og `billede` har hver TO FK'er til `robotter`
   (`robot_id` + hhv. `arvet_fra_robot_id`/`delt_med_robot_id`) — et
   `?select=*,anvendelse(*)` fejler med 300 + `PGRST201` ("more than one
   relationship was found"). Løsning: navngiv constraintet eksplicit,
   `anvendelse!anvendelse_robot_id_fkey(*)` / `billede!billede_robot_id_fkey(*)`.
3. **En sammensat fremmednøgle kan ikke indlejres direkte fra den fjerne
   ende.** `feltpost_varianter` har ingen egen FK til `robotter` — dens FK
   er (`robot_id`, `feltnavn`) → `feltposter`. `?select=*,feltpost_varianter(*)`
   fra `robotter` fejler med 400 + `PGRST200`. Løsning: indlejr den UNDER
   `feltposter`, `feltposter(*,feltpost_varianter(*))`.
4. **Et 0-1-forhold kommer tilbage som et OBJEKT, ikke et ét-elements
   array.** `anvendelse`/`billede` har `robot_id` som BÅDE fremmednøgle OG
   primærnøgle — PostgREST opdager selv, at forholdet er ét-til-ét, og
   returnerer `"anvendelse": {...}` (eller `null`), ikke `"anvendelse": [...]`.
   `db/eksporter.mjs`'s `omdanRobotFraDb` regner med objektformen direkte.

Alle fire er fundet af selve afprøvningen mod den rigtige instans (25. aug
2026), ikke ved at læse PostgREST's dokumentation på forhånd — samme princip
som formscannet i `fund/FUND-db1.md`: målt, ikke gættet.

En femte kom til med `spor/billedspand` samme dag, og den gælder Storage,
ikke PostgREST:

5. **En spand, der ikke findes, svarer 400 — ikke 404.** `GET
   /storage/v1/bucket/<navn>` på et ukendt navn giver HTTP **400** med
   `"statusCode": "404"` inde i JSON-kroppen. Koden alene lyver altså om,
   hvad der skete. Løsning: læs kroppen, ikke kun statuslinjen — det gør
   `sikrSpand()` i `db/billeder.mjs`, så "findes ikke" og "gik galt" ikke
   kan forveksles.

## Vagten: `--til-db` nægter at overskrive Studio-redigeringer (L35)

Siden L35 (25. aug 2026, `spor/vagt`) starter `db/migrer.mjs --til-db` med
at læse databasens nuværende indhold gennem **samme kodevej**, som
`db/eksporter.mjs --fra-db` bruger, og sammenligne det med `data/robots/`
via **samme dybe lighed**, som `db/rundtur.mjs` allerede bygger på. Begge
er importeret, ikke genskrevet: to kopier af samme sammenligning er præcis
den fælde, L30 kostede en uge.

Afviger databasen, stopper migreringen **før første `DELETE`** og skriver
hvilke robotter og felter der er uenige. Efterprøvet ved flettet med en
efterlignet Studio-redigering: afvisningen kom, og rækketallene bagefter
stod urørt på 77 robotter / 2.310 feltposter / 54 billeder.

- `node db/eksporter.mjs --fra-db --ud=data/robots` henter rettelserne hjem,
  hvorefter de committes som almindelige YAML-ændringer.
- `--overskriv-databasen` springer vagten over **og kasserer** det, der står
  i databasen. Brug den kun, når det er meningen.
- En tom database (0 robotter) stopper aldrig — den har intet at miste.

Grunden til at vagten skal findes: tøm-og-genindlæs er hurtig og
genkørselssikker, men den aner ikke, hvad den sletter.

## Bygget og efterprøvet (tidligere "ikke bygget endnu")

Opgavebrevet afgrænsede oprindeligt, hvad L34-fundamentet IKKE skulle
dække. `spor/db2` (25. aug 2026) lukkede migrerings-/eksport-hullerne — se
`fund/FUND-db2.md` for måltallene. Tilbage, stadig bevidst ikke bygget:

- **Auth.** Der er ingen brugerkonti, intet login. `service_role` er den
  eneste identitet, der nogensinde skriver til databasen.
- **RLS ud over basis.** `skema.sql` slår RLS til på alle seks tabeller UDEN
  nogen policy for `anon`/`authenticated` — Postgres' egen default (RLS
  slået til + ingen matchende policy = ingen adgang for andre end
  `service_role`/ejeren). Det er "basis". En fremtidig redigerings-UI med
  login vil kræve en rigtig policy pr. rolle, som ikke er skrevet.
- **Redigerings-UI.** Findes slet ikke. `feltdefinitioner`-tabellen (afsnit 1
  i `skema.sql`) er bygget netop for at gøre en fremtidig UI mulig UDEN at
  den skal importere `tools/skema.mjs` selv — men UI'en er ikke bygget.

**`--til-db`/`--fra-db` er nu FULDSTÆNDIGE og afprøvet mod en rigtig
instans**, ikke længere ufuldstændige:
  - `migrer.mjs --til-db` skriver alle seks tabeller i FK-rækkefølge, bruger
    `Prefer: return=representation` på `robotter`-INSERTet til at få de
    genererede `id`-værdier, bygger et slug→id-opslag, og sætter
    `forgaenger_robot_id` i et andet pas (PATCH pr. robot med en forgænger).
  - `eksporter.mjs --fra-db` henter den indlejrede PostgREST-respons (se
    "PostgREST-overraskelser" ovenfor for den præcise select-streng) og
    omsætter den til SAMME kanoniske form, `db/migrer.mjs` bygger lokalt
    (`omdanRobotFraDb`/`omdanFeltpostFraDb` i `eksporter.mjs`), inklusive
    det omvendte id→slug-opslag for `forgaenger`/`arvet_fra`/`delt_med`.

## Supabase-skillens anbefalinger — fulgt og fravalgt

Se `fund/FUND-db1.md` for den fulde tabel. Kort opsummeret: lowercase
snake_case-identifikatorer, eksplicitte FK-indekser og "least privilege"-RLS
er fulgt. `supabase-js` som klientvej og "bigint identity er den eneste
nøgle" er begge fravalgt, med begrundelse — projektets egne regler (nul
npm-afhængigheder, slug er nøgle) vinder ved konflikt, som CEO'en bad om.
