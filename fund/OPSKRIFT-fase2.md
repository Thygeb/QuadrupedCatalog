# OPSKRIFT — fase 2 (tekstgenindsamling), skrevet af spor/f2-pilot

Skrevet 2. sep 2026 efter at have kørt de to første robotter (Addverb Trakr 5 og
Trakr 20, `robot_id` 2183 og 2182, 17 advarsler). ~23 spor følger efter dig — denne
fil er skrevet, så du kan følge den uden at læse `fund/BRIEF-f2-pilot.md` eller denne
sessions historik. Læs den hele igennem, før du starter — særligt afsnittet
"Miljøfælde" nedenfor, som med stor sandsynlighed rammer dig også.

---

## 0. Hvad fase 2 faktisk er (læs dette først, det er ikke det, navnet lyder som)

"Teksterne genindsamles fra producenterne" er **forkert for de fleste tekster** —
se PLAN.md's "Korrektion af fase 2's verbum" (2. sep 2026). Af Addverbs 17 advarsler
var **16 en udtrækningsopgave** (citatet stod allerede i den danske prosa og skulle
skilles ud) og **1 en ren omskrivning** (ingen kilde findes, det er vores egen
analyse). Du kommer sandsynligvis til at møde samme fordeling — gå ikke ud fra at
du skal "finde nye kilder"; du skal for det meste **skille det, der allerede er
citeret, fra det, der er vores fortolkning.**

## 1. Rækkefølgen — én skrive-grænse pr. punkt, commit hver gang

1. **Klassificér** hver advarsel i kasse A/B/C (se §2). Commit.
2. **Efterprøv** hvert kasse-A-citat mod råkilden (grep/tekstsøgning). Commit.
   Nedgradér til kasse C, hvis citatet ikke findes.
3. **Skriv de engelske tekster** — caveat (prosa) + caveat_wording (citat) for hver
   kasse-A/B-række, plus enhver anden tekstkolonne, dit brief navngiver
   (applications.note, images.note, osv.). Kør tørløb. Commit.
4. **Skriv til databasen** (`--skriv`), med `Prefer: return=representation` og krav
   om præcis 1 række pr. PATCH. Commit.
5. **Mål**: før/efter-diff på talkolonner (skal være 0), `change_log`-tælling,
   manuel gennemlæsning af alle skrevne tekster. Commit.

**Skriv ALDRIG alt i ét Write-kald og commit til sidst.** Et spor, der dør midt i
punkt 4, skal kunne genoptages fra punkt 3's commit — ikke fra nul.

## 2. De tre kasser — med rigtige eksempler fra mine 17

**Kasse A — citatet står inde i den danske prosa.** Det almindelige tilfælde (16 af
mine 17). Eksempel, `addverb-trakr-5` / `weight`:

> Dansk: `"WEIGHT (INCL BATTERY): 18 KG" i den strukturerede specifikationstabel for
> Trakr 5-fanen.`

bliver til:

```
caveat          -> From the structured specification table on the Trakr 5 tab.
caveat_wording  -> WEIGHT (INCL BATTERY): 18 KG
```

**Kasse B — vores egen analyse, intet citat.** Eksempel, `addverb-trakr-5` /
`autonomy_level`: teksten var sammensat af fire funktionskort og en tabelrække, uden
et eneste citationstegn, og sluttede selv med "Ingen navngivet autonominiveau-skala."
`caveat_wording` forbliver **null**. `caveat` skrives om til engelsk uden at opfinde
en kilde, der ikke findes.

**Kasse C — kan ikke føres tilbage til nogen kilde.** Jeg havde **0** af disse (se
§5 nedenfor for hvorfor det ikke er mistænkeligt). Ret dem ikke — skriv dem på
listen til JPK og lad rækken stå urørt. Det er hans beslutning, ikke din.

## 3. Grænsen mellem `caveat` og `caveat_wording` — sagt så den ikke kan misforstås

`caveat_wording` er **kildens ord og kun kildens ord** for **den værdi, feltet
faktisk har i dag**. Ikke: enhver interessant sætning i nærheden. Konkret regel,
brugt konsekvent på mine 17:

- **Har feltet ÉT citat, der understøtter værdien:** det citat, ordret, går i
  `caveat_wording`. Alt andet (kontekst, tolkning, sammenligning) bliver i den
  engelske `caveat`-prosa.
- **Har feltet FLERE citater, der SAMMEN understøtter værdien** (fx `slope`: tallet
  står ét sted, operatoren et andet; eller `compute`: to reelle datapunkter for
  samme felt): alle relevante citater går i `caveat_wording`, adskilt med `" | "`.
- **Har kilden et EKSTRA citat, der IKKE understøtter den valgte værdi** (et
  modstridende tal, et ubrugt beslægtet felt, en alternativ kameraopstilling fra en
  anden side): det citat bliver i `caveat`-prosaen, i anførselstegn, som kontekst —
  det går ALDRIG i `caveat_wording`. Eksempel: `stair_step_continuous` havde
  tabellens "MAXIMUM STEP: 120 MM" (brugt, i `caveat_wording`) og brødtekstens
  modstridende "climb steps upto 170 mm" (ikke brugt, forbliver citeret i `caveat`).

**Overraskelse, som ryster den "ét citat, én værdi"-model, briefet selv bruger som
eksempel:** kun 10 af mine 16 kasse-A-rækker havde præcis ét enkelt citat. Resten
havde 2 (bekræftende sekundærkilde, tal+operator delt over to steder, et reelt
to-delt svar, eller et ubrugt modstridende tal). **Forvent det samme hos dig.**

## 4. PostgREST-fælderne

1. **`Prefer: return=representation` er ikke valgfri.** Uden den svarer PostgREST
   `204 uden krop` på en vellykket PATCH, og du kan ikke skelne "1 række ramt" fra
   "0 rækker matchede" (forkert `robot_id`/`field_name` i URL'en, stille fejl).
2. **Krav om præcis 1 række pr. PATCH.** Byg dit skrivescript, så det TÆLLER
   `JSON.parse(svar).length` og afbryder hele kørslen, hvis det er 0 eller >1 — se
   `db/f2-pilot-skriv.mjs`s `patchEen()`-funktion, som du kan kopiere direkte.
3. **Kun tekstkolonner:** `caveat`, `caveat_wording`, `note`, `collected_by`,
   `change_reason`. Aldrig en talkolonne (`value_number`, `minimum`, `maximum` osv.),
   og heller ikke `value_text`, som er tekst men uden for denne fases scope — se
   §6.4: den er en FEMTE tekstbunke, som endnu intet spor ejer, selvom den også
   er dansk.
4. **Tørløb er standard, `--skriv` er eksplicit.** Kør altid tørløbet først og læs
   det igennem — ikke bare tæl linjerne.

## 5. Hvad der skal måles, og hvornår

| Hvornår | Kommando | Hvad du kigger efter |
|---|---|---|
| Før alt andet | `node tools/validate.mjs` + `git log --oneline -1` | Matcher dit brief? Afviger de, STOP og rapportér |
| Før dit første skriv | Dit måleredskab (kopiér `fund/maal-f2.mjs`, ret DANSKE_ORD-regex om nødvendigt) på dine `robot_id`'er | Grundlinjen — `dansk:` skal matche det uudfyldte felt |
| Før dit første skriv | Hent ALLE `field_entries`-rækker for dine robotter (`select=*`), gem som JSON | Beviset for at ingen talkolonne rørte sig |
| Efter `--skriv` | Samme måleredskab igen | `dansk: 0` overalt du skrev |
| Efter `--skriv` | Samme fulde `field_entries`-hentning igen, diff mod "før" på ALLE kolonner UNDTAGEN caveat/caveat_wording/collected_by/change_reason | 0 diffs. Er diffen ikke tom, har du et FUND, ikke en oprydningsopgave |
| Efter `--skriv` | Tæl `change_log`-rækker | Skal stige med præcis dit skrevne rækkeantal. Stiger den ikke, er triggeren i stykker — det er vigtigere end resten af dit spor |
| Til sidst | Læs ALLE dine skrevne tekster selv, manuelt | Ordlisten fanger ikke en dansk sætning uden æøå og uden ordlistens ord. Skriv tælling: "N læst, M fejl" |

## 6. Det, der overraskede mig

**1. Råkildemappen kan mangle helt i din worktree — ikke bare MANIFEST.tsv.**
Mit brief sagde "råkilderne findes allerede, seks filer". De gjorde ikke:
`media/_kilder/**` er gitignoreret i HELE projektet, og kun `.env` og
`assets/fotos/fabrikant/` bliver rutinemæssigt kopieret ind i en ny worktree —
ikke `media/_kilder/`. **Tjek dette FØR du stoler på et brief, der siger råkilderne
"findes allerede".** Hvis de mangler:
- Find de originale kilde-URL'er i `data/robots/<slug>.yaml`s `kilde:`-felter (eller
  i selve advarslens citerede sekundærkilde).
- Har du netadgang (`curl -s -o /dev/null -w "%{http_code}" <url>` — test det), kan
  du gen-hente siden **friskt, i dag**, med `curl -D <fil>.headers` for at få en
  ÆGTE HTTP-statuskode og `Date`-header (bedre end den sædvanlige mtime-øvregrænse,
  som `media/_kilder/LÆSMIG.md` selv opfordrer til som "næste gang"-forbedring).
- Byg din `MANIFEST.tsv` af DISSE friske filer, dateret med DAGENS dato i
  filnavnet — ikke den oprindelige indsamlingsdato, som ville være løgn om
  proveniensen. Skriv en kommentarlinje øverst i MANIFEST.tsv, der forklarer
  afvigelsen. Se `media/_kilder/raa-f2-pilot-2026-09-02/MANIFEST.tsv` for et fuldt
  eksempel.
- Verificér at det friskt hentede indhold rent faktisk BÆRER de citater, du skal
  bruge — søg dem alle, tæl fundet/ikke-fundet. Hvis siden har ændret sig siden
  den oprindelige indsamling, kan et citat mangle uden at være opfundet — men
  behandl det stadig som en advarsel, du skal undersøge nærmere (evt. gennem
  et arkiv som Wayback Machine), ikke som automatisk kasse C.

**2. "LABEL: VALUE"-citater er ofte IKKE én sammenhængende tekststreng i kilden.**
Addverbs specifikationstabel er bygget med separate DOM-elementer for label og
værdi (`<h4>WEIGHT (INCL BATTERY)</h4>` og en nabo-`<div>18 KG</div>`) — kolonnet i
`"WEIGHT (INCL BATTERY): 18 KG"` er en rendering-konvention TILFØJET af den, der
først læste siden, ikke et bogstaveligt tegn i kilden. Begge ordstumper ER
producentens egne ord, bare adskilt i markup. Behandl det som gyldig kasse-A-ordlyd
alligevel — men lav din tekstudtrækning (HTML → ren tekst) FØR du grep'er, ellers
finder du intet, fordi det bogstavelige HTML har et virvar af tags mellem ordene.

**3. Multi-citat-felter er reglen, ikke undtagelsen.** Se §3 ovenfor.

**4. Andre tekstkolonner (`value_text`) er STADIG danske efter dit spor, og det er
korrekt.** Din kolonneliste er snæver med vilje (kun `caveat`, `caveat_wording`,
`note`). Robotter med `value_text`-felter (fx `compute`, `autonomy_level`) har
STADIG dansk prosa i selve værdien efter du er færdig — det er en ANDEN
tekstgenindsamlings-bunke, som endnu ikke har sit eget spor. Rør den ikke, men
flag den i din rapport, så JPK ved den findes.

**Målt af orkestratoren 2. sep 2026, ikke et gæt:** `value_text` er en **femte**
arbejdsbunke, som ingen plan nævner — **230 `value_text`-værdier i kataloget,
heraf 105 danske.** Det er et spor for sig, ikke noget du løser undervejs.

---

## 7. Filerne du sandsynligvis skal bygge (mine, til inspiration — kopiér mønstret)

- `fund/maal-f2.mjs` — måleredskabet, kopiér direkte, du behøver næppe ændre det.
- `db/f2-<dit-spor>-skriv.mjs` — kopiér `db/f2-pilot-skriv.mjs`s struktur:
  `FIELD_ENTRIES`-array + `patchEen()`-motor med indbygget 1-række-krav og
  tørløb/`--skriv`-skifte.
- `fund/FUND-<dit-spor>.md` — din rapport, samme skabelon som denne fils forfatter
  brugte (se `fund/FUND-f2pilot.md`).
- `media/_kilder/raa-<dit-spornavn>-<dagens-dato>/MANIFEST.tsv`, hvis den mangler
  (se §6.1). **Aldrig i en anden batches mappe** — heller ikke selvom dit brief
  nævner en ældre batch-mappe ved navn (fx `raa-kand6-...`): den mappe hører til
  en anden indsamling, med sit eget MANIFEST, der ikke dækker dine friske filer.

God fornøjelse. Skriv til denne fil, hvis du finder noget, DEN tog fejl af — den er
skrevet af det FØRSTE spor, ikke det sidste.
