# FUND-vagt2 — Å14 (fingeraftryksvagt) og Å12 (regex-deduplikering)

Skills vurderet foerst: `supabase-postgres-best-practices` indlaest foer `db/skema.sql`s nye
tabel blev skrevet (schema-primary-keys.md, security-rls-performance.md). `supabase`-skillen
IKKE geninvokeret — dens raad er allerede indlejret i db/LAESMIG.md, og intet her (auth, edge
functions, troubleshooting) laa uden for det, den allerede daekker.

## Punkt 1 — Å14

**Valgt:** singleton-tabel `synk_aftryk` (id boolean PK + CHECK, jsonb-aftryk), genbruger
`fraDb`/`dybtLig`/`findAfvigelser`. **Fravalgt:** en logtabel med én raekke pr. koersel —
loeser intet ekstra og vokser ubegraenset (77 robotter x hver migrering).

**Konfidens:**
- **Ren beslutningsfunktion (`afgoerVagt`): HOEJ.** `node tests/koer.mjs` → 217 bestaaet,
  2 fejlet (samme 2 som grundmaalingen, ikke relateret). 5 nye tests i afsnit 7 daekker alle
  fire grene (tom-db, aftryk-match, aftryk-afvigelse, yaml-fallback-match, yaml-fallback-afvigelse).
  Kontrafaktisk: var logikken byttet om, ville "DB matcher AFTRYKKET, YAML rykket videre -
  naegter IKKE" faktisk naegte, og testen ville vise `fejlet`, ikke `ok`.
- **Live scenarie (a): HOEJ for exit-koden, LAV for aftryksskrivningen.** `node db/migrer.mjs
  --til-db` → exit 0 (maalt, genkoerbart). Men aftrykket kunne IKKE gemmes: `synk_aftryk`
  findes ikke i den live database (404/PGRST205) — se fælde nedenfor.
- **Live scenarie (b): MIDDEL.** Studio-redigering (`producentby` → "VAGT2TEST" via REST paa
  boston-dynamics-spot) → exit 1, "producentby — DB "VAGT2TEST" vs YAML "Waltham,
  Massachusetts"", raekketal 77/2310/127/76/54 urort foer og efter. Vaerdien sat tilbage,
  bekraeftet. Middel og ikke hoej, fordi afvisningen her koerte via FALD-TILBAGE-grenen (intet
  aftryk), ikke via selve fingeraftryks-sammenligningen — samme udfald som L35s foerste udgave.
- **Live scenarie (c): IKKE OPNAAET — se "Punkter jeg ikke naaede".**

## Punkt 2 — Å12

**Valgt:** `traekValidateTal` eksporteret fra `db/rundtur.mjs`, importeret i
`db/eksporter.mjs`, den lokale regex-kopi slettet. Intet reelt fravalgt — opgavebrevet
pegede direkte paa loesningen.

**Konfidens: HOEJ.** `grep -n 'match(/' db/eksporter.mjs db/rundtur.mjs` viser den faktiske
regex kun i `db/rundtur.mjs:106` (eksporter.mjs's eneste `match(/…/)` er en anden regex, til
.env-parsing). `node db/eksporter.mjs --fra-db --ud=db/eksport-tjek` → 77 YAML-fil(er)
skrevet, 0 fejl — samme filantal som grundmaalingen (mappen ryddet bagefter). Kontrafaktisk:
en forkert import ville kaste `ReferenceError: traekValidateTal is not defined` ved foerste
kald, synligt med det samme.

**OBS paa selve acceptkriteriets kommando:** `grep -c "fil(er) · " db/eksporter.mjs
db/rundtur.mjs` giver **1 og 2** (3 i alt), IKKE "ét sted i alt" — den grep'er en PROSA-
delstreng (docstrings/log-linjer nævner ordlyden tre gange tilsammen), ikke selve regex-koden.
Den praecise maaling (regex-KILDEN) staar ovenfor og viser ét sted, som krævet.

## Usikkerheder

- Om `synk_aftryk` boer vaere en singleton-raekke eller (fx) en raekke pr. tabel/enum-navn er
  ikke grillet med JPK — jeg valgte singleton, fordi Å14 kun har brug for SENESTE tilstand.
- Den nye tabel er IKKE oprettet i den live database (se fælde nedenfor) — koden er derfor
  kun delvist bevist paa den database, brugeren rent faktisk bruger.

## Maalingerne (grundmaaling → nu)

- validate: 77/0/1 → 77/0/1 (uaendret)
- tests: 212/2 → 217/2 (5 nye, alle bestaaet; de 2 fejlende er kendte, ikke relaterede)
- rundtur --live: 77/77 dybt lig, build 213=213, kilder 1110=1110 → uaendret efter begge punkter
- `git status --short data/robots`: tom (testposten fjernet igen)

---

## Nye fælder og opdagelser (uden for de 60 linjer)

**Den store: en Sonnet-agent-session kan ikke koere DDL mod den live Supabase-database.**
`.env` giver kun `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` — PostgREST (som al kode i
`db/` bruger) tager IKKE imod `CREATE TABLE`. Der findes ingen `psql` og ingen `supabase`-CLI
paa maskinen (begge `which`-tjekket, ingen fundet), og Supabase-MCP kraever en interaktiv
OAuth-godkendelse, som denne session eksplicit blev fortalt ikke er tilgaengelig ("This
session is non-interactive"). Selve `.claude/skills/supabase/SKILL.md` bekraefter dette
moenster indirekte: den peger paa MCP `execute_sql` eller `psql` som de eneste veje til
skemaaendringer, begge udenfor raekkevidde her.

**Konsekvens for Å14:** koden er skrevet, SQL'en staar i `db/skema.sql`, og hele
beslutningslogikken er bevist ren og korrekt (5/5 nye tests). Men selve `synk_aftryk`-tabellen
findes IKKE i den database, JPK rent faktisk bruger — den findes kun som DDL-tekst, indtil
nogen med adgang (JPK i SQL-editoren, eller en session med autoriseret Supabase-MCP) koerer
den. Det er en strukturel graense for, hvad et Sonnet-spor kan efterprøve i dette projekt for
ETHVERT punkt, der kraever en live skemaaendring — ikke kun dette. Boer noteres i
`db/LAESMIG.md` eller CLAUDE.md af orkestratoren: "et Sonnet-spor kan skrive SQL, men ikke
koere den mod den live database."

**Genkoerbar naar tabellen findes:** naar `db/skema.sql`s nye afsnit 7 er koert,
gentag noejagtig sekvensen fra denne rapport (grundmaaling → --til-db → REST-patch paa
boston-dynamics-spot → --til-db igen → tilfoej/slet en midlertidig robotpost → --til-db to
gange) for at faa (a)-(d) bevist med selve fingeraftryks-mekanismen i stedet for fald-tilbage.

## Punkter i briefet, jeg ikke nåede

- **Scenarie (c), den centrale af de fire:** MAALT resultat var AFVIST (exit 1), ikke
  "koerer igennem uden at naegte" som krævet — fordi `synk_aftryk` ikke findes i den live
  database (se fælden ovenfor). Dette reproducerer noejagtigt Å14s oprindelige fejl og er
  dermed den maalte bekraeftelse af, at rettelsen virker i teorien (tests) men ikke endnu i
  produktion. Testposten (`vagt2-test-temp.yaml`) blev alligevel oprettet, valideret (78/0),
  koerslen udfoert og resultatet maalt aerligt, derefter slettet igen —
  `git status --short data/robots` er tom.
- **Scenarie (d)s "mindst samme antal beståede som grundmaalingen plus mine nye tests":**
  opnaaet (212→217, +5), men KUN fordi (c) faldt tilbage til den gamle logik og ikke naaede at
  teste den nye vej live — testtallet beviser den RENE funktion, ikke produktionsdatabasen.
- Ingen af de fire scenarier blev bevist med den FAKTISKE aftryks-sammenligning paa den live
  database — kun (a) og (b) er maalt (via fald-tilbage), (c) er maalt som afvist (forventet
  ikke-afvist), og "aftryk gemt" (del af (a)s kriterium) skete aldrig, fordi tabellen mangler.
