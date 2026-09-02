# db/ — Supabase som redaktionslag, ENGELSK skema (L34, L81-L83)

Læs [STATUS.md](../STATUS.md) L34 og Å115/Å116 først for selve beslutningerne.
Denne fil er **hvordan**, ikke **hvorfor**.

**Status 2. sep 2026 (spor/skema, FASE 1 af L81-L83):** databasens tabeller,
kolonner og enum-værdier er omdøbt til engelsk — se [ordbog.mjs](ordbog.mjs)
for selve navneoversættelsen. `db/migrer.mjs` (YAML → DB) er **slettet**:
den retning findes ikke længere, databasen ER kilden. `db/skema.sql` er
skrevet om, "som om det altid var sådan" — den beskriver derfor **den
ENGELSKE, fremtidige tilstand**, ikke nødvendigvis den levende database i
dette øjeblik. Den levende database når samme tilstand, når orkestratoren
har anvendt `db/migrering-cert.sql` og `db/migrering-engelsk.sql` (i den
rækkefølge — se hver fils egen toptekst) via `apply_migration`.

## Filerne

| Fil | Hvad den gør |
|---|---|
| `skema.sql` | Postgres/Supabase-DDL, engelsk. Kør den i Supabase' SQL-editor (eller `psql`), én gang, i et **tomt** projekt |
| `ordbog.mjs` | Den ENE dansk↔engelsk-ordbog: tabeller, kolonner, enum-typer, enum-labels, opremsede datavaerdier. Strukturelt 1:1 og vendbar (fejler ved import, hvis ikke) |
| `byg-migrering.mjs` | Læser `ordbog.mjs` og skriver `migrering-engelsk.sql` — ingen håndskrevet omdøbningsliste ved siden af (L30-lærdommen) |
| `migrering-engelsk.sql` | **Genereret**, committet. ALTER-migreringen fra det danske til det engelske skema på en LEVENDE database med 77 rækker — renames plus punkt 3's strukturelle tilføjelser (`collected_by`/`change_reason`, `change_log`-triggeren, `images.alt` → jsonb) |
| `migrering-cert.sql` | Den glemte migreringsfil fra `spor/cert` (Å115) — de tre `fcc_oplyst`/`ul_oplyst`/`ccc_oplyst`-enumværdier, danske navne med vilje (dokumenterer en tilstand FØR `migrering-engelsk.sql`). Idempotent, no-op på den levende database |
| `migrering-fremdrift.sql`, `migrering-cjk-ordlyd.sql` | Ældre ALTER-migreringer, allerede anvendt på den levende database (historik, ikke til genanvendelse) |
| `eksporter.mjs` | DB → YAML. `--fra-db`: læser fra den engelske Supabase-instans via PostgREST og OVERSÆTTER hver værdi tilbage til dansk via `ordbog.mjs`, så output er byte-for-byte den samme danske YAML-form, `data/robots/` altid har haft. Ingen anden tilstand længere (den tidligere lokale `db/kanonisk.json`-vej er fjernet sammen med `migrer.mjs`) |
| `tjek.mjs` | Efterfølgeren for `db/rundtur.mjs` (slettet): eksport fra den LEVENDE database → dyb lighed mod `data/robots/` → `tools/validate.mjs` på eksporten → `tools/build.mjs` sidetal/kildetal lig originalen. Læs-kun, ingen "lokal" tilstand (den fandtes kun, mens `migrer.mjs` skrev en mellemfil) |
| `hentbyg.mjs` | JPK's ét-kommando-vej: `eksporter.mjs --fra-db` → git commit → `tools/build.mjs`. Kalder de andre scripts som subprocesser, rører ikke selv tabelnavne |
| `billeder.mjs` | Storage-spandene (`robotbilleder`, `arkiv`). Ingen tabelreference — se filens egen toptekst |
| `.tmp/` | **Genereret.** Ikke til redigering, ikke committet — se `.gitignore` |

**Slettet i FASE 1 (spor/skema, 2. sep 2026):** `migrer.mjs` (YAML → DB),
`rundtur.mjs` (erstattet af `tjek.mjs`), `migrering-i18n.sql` (`_i18n`-
kolonnerne udgår helt, L82 gør dem meningsløse — se `skema.sql`s toptekst).
Med dem forsvandt `kanonisk.json`, `seed.sql`, `FELTPOST_NOEGLER_KENDT`,
`FELTNAVN_ENUM_I_SKEMA_SQL` og synk_aftryk-vagten — alle var værn om en
skriveretning (YAML → DB), der ikke findes mere. Fortrydelse er flyttet til
`change_log` (`skema.sql`s afsnit 7) — se nedenfor.

## Rækkefølgen for et NYT, tomt projekt

1. **Opret Supabase-projektet.** Notér projekt-URL'en og
   `service_role`-nøglen (Project Settings → API).
2. **Kør `db/migrering-cert.sql`, dernæst `db/skema.sql`** — for et
   HELT NYT projekt er `migrering-cert.sql` faktisk et no-op (skemaet får
   allerede alle 33 feltnavne fra `skema.sql` selv); rækkefølgen betyder
   kun noget for den LEVENDE database, `spor/skema` fandt (se
   `migrering-cert.sql`s egen toptekst).
3. **Opret `.env`** i **projektroden** (samme mappe som `CLAUDE.md`, ikke i
   `db/`):

   ```
   SUPABASE_URL=https://<projekt>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role-nøglen fra Project Settings>
   ```

   `.env` er tilføjet til `.gitignore` — nøglen må **aldrig** committes, og
   må **aldrig** bruges i en offentlig klient (browserkode, en fremtidig
   redigerings-UI's frontend). Den bruges kun af `eksporter.mjs`, som
   kører lokalt på din maskine eller i en agent-worktree, aldrig i browseren.
4. Databasen udfyldes i dag KUN via Supabase Studio eller en fremtidig
   redigerings-UI — der findes ingen `--til-db`-vej længere.
5. **`node db/eksporter.mjs --fra-db --ud=data/robots`** — henter
   robotterne som YAML, dansk, i den kanoniske form `data/robots/` altid
   har haft.
6. **`node db/tjek.mjs`** — beviser at databasen og bygget siger det samme
   (dyb lighed, `tools/validate.mjs`, sidetal/kildetal). Kræver `.env`.

## Den LEVENDE database, 77 rækker — FASE 1's overgang

Den levende database, `spor/skema` fandt 2. sep 2026, stod stadig på det
DANSKE skema (`robotter`/`feltposter`/...). Overgangen til engelsk kræver
BEGGE migreringsfiler, i denne rækkefølge, hver som sin egen
`apply_migration` (transaktionel):

1. `db/migrering-cert.sql` — retter historikken (Å115's glemte fil), no-op
   i praksis (de tre enum-værdier findes allerede, bekræftet ved læsning
   2. sep 2026).
2. `db/migrering-engelsk.sql` — selve omdøbningen plus punkt 3's
   strukturelle tilføjelser. Se filens egen toptekst for
   FØR-KØRSEL-tjekket og rækkefølgens begrundelse (data først, mens
   navnene er danske; renames; strukturelle tilføjelser til sidst, fordi
   de refererer de nye engelske navne direkte).

**Sikkerhedsnettet, mens FASE 2 (tekstgenindsamling) ikke er startet:**
databasen er stadig 100 % genskabelig fra `data/robots/` på den commit,
`db/migrer.mjs` sidst eksisterede i (`git show <sha>:db/migrer.mjs`). Den
dag FASE 2's første tekst er skrevet, findes det net ikke mere.

**Kendt begrænsning, fundet under migreringen (ikke rettet, dokumenteret):**
`ALTER TABLE ... RENAME TO`/`RENAME COLUMN` ændrer IKKE en eksisterende
constraints, indeks' eller sekvens' EGET navn — kun selve tabellens/
kolonnens. De fleste af `skema.sql`s 30+ navngivne CHECK-constraints (og
alle FK-indekser) beholder derfor deres oprindelige DANSKE navne
(`anvendelse_robot_id_fkey`, `robotter_forgaenger_idx`, ...) på den
LEVENDE, migrerede database, selvom en FRISK `db/skema.sql`-installation
ville give dem rene engelske navne. To undtagelser, hvor selve VÆRDIEN (ikke
kun navnet) skulle ændres, blev eksplicit håndteret af
`db/byg-migrering.mjs`: `robotter_fremdrift_check` (droppet og genskabt som
`robots_locomotion_check` med de nye værdier) og `billede_alt_form`
(omdøbt til `images_alt_form`, samme betingelse). `db/eksporter.mjs`s
PostgREST-`select`-streng bruger derfor bevidst de GAMLE, danske FK-
constraint-navne (`anvendelse_robot_id_fkey`/`billede_robot_id_fkey`) til
disambiguering — se filens egen kommentar.

## Fortrydelse: `change_log`, IKKE `synk_aftryk` (L81-L83, punkt 3)

Den tidligere `synk_aftryk`-vagt (Å14) beskyttede kun ÉN skrivevej
(`db/migrer.mjs --til-db`), som selv er fjernet. `change_log` (`skema.sql`s
afsnit 7) dækker i stedet ALLE skrivevejes fravær: en række-trigger
(`log_change()`) på UPDATE/DELETE for de fem skrivbare tabeller (`robots`,
`field_entries`, `field_entry_variants`, `applications`, `images` — IKKE
`field_definitions`, som er en maskingenereret spejling af
`tools/skema.mjs`) gemmer den gamle række som jsonb, sammen med
`collected_by`/`change_reason`, som redaktøren selv sætter på raekken. En
afvisning bliver en forespørgsel ("find rækken i `change_log`, se hvad den
var"), ikke en gren.

## Tilslutningsformen: fetch mod PostgREST, ikke supabase-js

Uændret siden fundamentet (25. aug 2026) — se `supabase-js`-afsnittet
nedenfor. `db/eksporter.mjs --fra-db`s faktiske select-streng:

```
GET  <SUPABASE_URL>/rest/v1/robots?select=*,field_entries(*,field_entry_variants(*)),
       applications!anvendelse_robot_id_fkey(*),images!billede_robot_id_fkey(*)
headers: apikey: <service_role>, Authorization: Bearer <service_role>
```

`service_role` omgår RLS (se `skema.sql`'s afsnit 8) — det er meningen:
dette script ER redaktøren, ikke en offentlig bruger.

## PostgREST-overraskelser — fundet ved afprøvning, ikke antaget

25. aug 2026, `spor/db2` (tabelnavne herunder er OPDATERET til de engelske
navne, spor/skema, 2. sep 2026 — selve overraskelserne er uændrede, kun
hvad de hedder i dag):

1. **`DELETE`/`UPDATE` uden filter afvises hårdt** (400, `DELETE requires a
   WHERE clause`, kode `21000`) — også for `service_role`. Løsning: et
   filter, der matcher enhver række, `<NOT NULL-kolonne>=not.is.null`.
2. **To fremmednøgler til samme tabel gør et indlejret select tvetydigt.**
   `applications` og `images` har hver TO FK'er til `robots` (`robot_id` +
   hhv. `inherited_from_robot_id`/`shared_with_robot_id`) — et
   `?select=*,applications(*)` fejler med 300 + `PGRST201`. Løsning: navngiv
   constraintet eksplicit — men BEMÆRK: efter L81-L83's omdøbning er
   constraintets EGET navn stadig dansk (se ovenfor), så det er
   `applications!anvendelse_robot_id_fkey(*)`, IKKE
   `applications!applications_robot_id_fkey(*)`.
3. **En sammensat fremmednøgle kan ikke indlejres direkte fra den fjerne
   ende.** `field_entry_variants` har ingen egen FK til `robots` — dens FK
   er (`robot_id`, `field_name`) → `field_entries`. Indlejr den UNDER
   `field_entries`: `field_entries(*,field_entry_variants(*))`.
4. **Et 0-1-forhold kommer tilbage som et OBJEKT, ikke et ét-elements
   array.** `applications`/`images` har `robot_id` som BÅDE fremmednøgle OG
   primærnøgle — PostgREST returnerer `"applications": {...}` (eller
   `null`), ikke et array. `db/eksporter.mjs`'s `omdanRobotFraDb` regner med
   objektformen direkte.

En femte og sjette (Storage, ikke PostgREST) og to mere fra `spor/arkiv`,
alle uændrede af L81-L83 (Storage kender ikke til tabelnavne):

5. **En spand, der ikke findes, svarer 400 — ikke 404.** `GET
   /storage/v1/bucket/<navn>` på et ukendt navn giver HTTP **400** med
   `"statusCode": "404"` inde i JSON-kroppen. Løsning: læs kroppen, ikke kun
   statuslinjen — det gør `sikrSpand()` i `db/billeder.mjs`.
6. **Objektnøgler med ikke-ASCII eller `#`/`%` afvises med `InvalidKey`** —
   også percent-kodede. Løsning: `sikkerObjektNoegle()` i `db/billeder.mjs`.
7. **`object/list` returnerer mapper som poster med `id: null`** — de skal
   foldes ud med rekursive `prefix`-kald, før objektstørrelser kan summeres.

## Bygget og efterprøvet

- **Auth.** Der er ingen brugerkonti, intet login. `service_role` er den
  eneste identitet, der nogensinde skriver til databasen.
- **RLS ud over basis.** `skema.sql` slår RLS til på alle syv tabeller UDEN
  nogen policy for `anon`/`authenticated` — Postgres' egen default (RLS
  slået til + ingen matchende policy = ingen adgang for andre end
  `service_role`/ejeren). Det er "basis". En fremtidig redigerings-UI med
  login vil kræve en rigtig policy pr. rolle, som ikke er skrevet.
- **Redigerings-UI.** Findes slet ikke. `field_definitions`-tabellen er
  bygget netop for at gøre en fremtidig UI mulig UDEN at den skal importere
  `tools/skema.mjs` selv — men UI'en er ikke bygget.

## Supabase-skillens anbefalinger — fulgt og fravalgt

Se `fund/FUND-db1.md` for den fulde tabel. Kort opsummeret: lowercase
snake_case-identifikatorer, eksplicitte FK-indekser og "least privilege"-RLS
er fulgt. Ét reserveret Postgres-nøgleord blev fundet og undgået under
L81-L83's omdøbning: `feltdefinitioner.gruppe` blev IKKE til `group` (GROUP
BY), men til `field_group` — se `db/ordbog.mjs`s egen kommentar ved
kolonnen. `supabase-js` som klientvej og "bigint identity er den eneste
nøgle" er begge fravalgt, med begrundelse — projektets egne regler (nul
npm-afhængigheder, slug er nøgle) vinder ved konflikt, som CEO'en bad om.
