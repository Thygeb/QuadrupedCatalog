# db/ — Supabase som redaktionslag (L34)

Læs [STATUS.md](../STATUS.md) L34 først for selve beslutningen. Denne fil er
**hvordan**, ikke **hvorfor**.

**Der findes intet Supabase-projekt endnu (25. aug 2026).** Alt herunder er
bygget og efterprøvet lokalt — se `fund/FUND-db1.md` for rundturstallene.
Tilslutningen kobles på, når JPK har oprettet projektet.

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

4. **`node db/migrer.mjs --til-db`** — skriver de 62 robotter til databasen.
   **Ufuldstændigt i dag** — se "Ikke bygget endnu" nedenfor.
5. **`node db/eksporter.mjs --fra-db --ud=<mappe>`** — henter dem tilbage som
   YAML. **Også ufuldstændigt** — samme afsnit.
6. Kør `node tools/validate.mjs --data=<mappe>` og sammenlign med
   `data/robots/` som i `db/rundtur.mjs`, nu mod den RIGTIGE database.

Ingen af trinene 4-6 er afprøvet mod en rigtig instans — der var ingen at
afprøve mod. Det lokale spor (uden `--til-db`/`--fra-db`) er derimod kørt og
efterprøvet fuldt ud, se `fund/FUND-db1.md`.

## Tilslutningsformen: fetch mod PostgREST, ikke supabase-js

Projektets CLAUDE.md kræver nul npm-afhængigheder. Supabase' egen
`skills/supabase/SKILL.md` (hentet 25. aug 2026, se `fund/FUND-db1.md`)
anbefaler ellers klientbiblioteket `supabase-js` til stort set alt — men
`supabase-js` er selv blot et tyndt lag oven på **PostgREST**, Supabase' REST-
grænseflade, og den grænseflade er offentligt dokumenteret og kan kaldes
direkte med indbygget `fetch`. Det er vejen, `migrer.mjs`/`eksporter.mjs`
bruger:

```
GET  <SUPABASE_URL>/rest/v1/robotter?select=*,feltposter(*),anvendelse(*),billede(*)
POST <SUPABASE_URL>/rest/v1/robotter
headers: apikey: <service_role>, Authorization: Bearer <service_role>,
         Content-Type: application/json, Prefer: return=representation
```

`service_role` omgår RLS (se `skema.sql`'s afsnit 7) — det er meningen: disse
scripts ER redaktøren, ikke en offentlig bruger, og kravet "brug aldrig
service_role i en offentlig klient" (Supabase-skillens egen advarsel) er
netop grunden til, at nøglen kun læses server-side her, via `.env`.

## Ikke bygget endnu — bevidst

Opgavebrevet afgrænsede eksplicit, hvad fundamentet IKKE skulle dække. Listen
her er den afgrænsning gjort konkret, plus de huller, arbejdet selv fandt:

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
- **`--til-db`/`--fra-db` er ufuldstændige, IKKE kun uprøvede.** Konkret:
  - `migrer.mjs --til-db` skriver `robotter`-tabellen, men **ikke**
    `feltposter`, `feltpost_varianter`, `anvendelse`, `billede` eller
    `feltdefinitioner` — de kræver at kende de `id`-værdier, PostgREST
    netop har genereret for `robotter`, og det opslag (slug → id efter
    INSERT) er ikke skrevet. Samme problem gælder `forgaenger_robot_id`,
    som selvreferentielt har brug for robottens EGEN nye id.
  - `eksporter.mjs --fra-db` henter den indlejrede PostgREST-respons
    (`?select=*,feltposter(*),...`), men omsætter den **ikke** til den
    samme `kanonisk()`-form, `db/migrer.mjs` bygger lokalt — det sidste,
    afgørende led (numerisk id → slug for `forgaenger`/`arvet_fra`/
    `delt_med`) mangler.
  - Årsagen er ikke dovenskab: uden en rigtig Supabase-instans er der intet
    at afprøve koden imod, og et upprøvet gæt på PostgREST's præcise
    JSON-facon (indlejrede relationer, fejlformater) er værre end et
    tydeligt "ikke færdig" — jf. CLAUDE.md's regel om at måle, ikke gætte.

## Supabase-skillens anbefalinger — fulgt og fravalgt

Se `fund/FUND-db1.md` for den fulde tabel. Kort opsummeret: lowercase
snake_case-identifikatorer, eksplicitte FK-indekser og "least privilege"-RLS
er fulgt. `supabase-js` som klientvej og "bigint identity er den eneste
nøgle" er begge fravalgt, med begrundelse — projektets egne regler (nul
npm-afhængigheder, slug er nøgle) vinder ved konflikt, som CEO'en bad om.
