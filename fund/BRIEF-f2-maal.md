# BRIEF — spor/f2-maal: instrumentet, der dømmer alle fase 2-spor

**Model: Sonnet. Egen worktree. Du skriver INTET i databasen.**

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2maal` (gren `spor/f2-maal`).
Rør aldrig `c:\Praktik\websites\salg` eller `c:\Praktik\website` — andre projekter.
Rør ikke hovedrepoet `c:\Praktik\websites\udstilling`; en anden session arbejder i det.

## Regel 0 — skill-vurdering, skriv den

Vurdér hvilken skill der passer, og skriv **hvilken du valgte og hvilke du gik forbi,
med begrundelse.** "Ingen skill passer her" er et gyldigt svar, men det skal skrives.
Overvej mindst: `supabase` (projektets egen, `.claude/skills/supabase/`),
`supabase-postgres-best-practices`, `robotdata`, `fejljagt`.
Lykkes et skill-kald ikke fra worktreen, så læs `SKILL.md` fra disk og **skriv i
rapporten at du gjorde det** — et stille fallback må ikke forveksles med at skillen kørte.

## Læs først

`CLAUDE.md` · `PLAN.md` §0 (især korrektionen af fase 2's verbum) · `db/LAESMIG.md` ·
`db/ordbog.mjs` · `tests/LAESMIG.md` (testkontrakten — nummerering og form).

## Hvorfor du findes

Fase 2 skriver engelsk tekst ind i 77 robotters rækker, fordelt på ~23 senere spor med
rækkeejerskab pr. producent. **Ingen af dem kan flettes uden en måling, der beviser to
ting:** at ingen talkolonne rørte sig, og at der ikke er dansk tilbage. Den måling findes
ikke. Du bygger den. Alt andet i fase 2 venter på dig.

## Grundmåling — DIN FØRSTE KOMMANDO

Kør og skriv resultatet i rapporten, før du ændrer noget:

```
"/c/Program Files/nodejs/node.exe" tools/validate.mjs
git log --oneline -1
```

Orkestratorens tal 2. sep 2026, målt umiddelbart før dette brief blev sendt:
validate **77 filer / 0 fejl / 1 advarsel**. **Afviger dit tal, så STOP og rapportér
det** — så måler du et andet miljø end mit, og resten af briefets tal er da også
mistænkte.

Kør IKKE `tests/koer.mjs` mod hovedrepoet. Din worktree har sin egen kopi; brug den.
Din worktree mangler `dist/` (gitignoreret), og **13 tests spørger, om en side er
bygget** — kør derfor `node tools/build.mjs` FØR din første testkørsel, ellers får du
14 røde, der ikke er dine.

## Leverancerne — tre filer, som du ejer alene

| Fil | Hvad |
|---|---|
| `db/fase2-tjek.mjs` | Det varige instrument. Læser kun |
| `db/f2-skriv.mjs` | Den delte skrivehjælper. Bruges af de 23 senere spor |
| `tests/dele/69-fase2-tjek.mjs` | Enhedstests uden database |

**Ingen andre filer.** Rør ikke `db/tjek.mjs`, `db/eksporter.mjs`, `db/ordbog.mjs`,
`tools/`, `assets/`, `data/i18n/` eller tests 38, 55, 57, 63, 64, 66, 68 — de er ejet
af andre spor lige nu.

**Testnummeret 69 er et gæt fra min side**: 66 var højeste, da briefet blev skrevet.
Slå selv efter i `tests/dele/` og `tests/LAESMIG.md`, tag det næste ledige, og
**skriv i rapporten hvilket nummer du faktisk brugte.**

---

## Punkt 1 — `db/fase2-tjek.mjs --tal`: beviset for at tallene ikke rørte sig

Fase 2 må ændre tekst og kun tekst. Kommandoen skal give et **aftryk** af alle
talbærende kolonner, der kan sammenlignes før og efter et spor.

Aftrykket dækker `field_entries`: `value_number`, `minimum`, `maximum`, `value_bool`,
`value_list`, `unit`, `imperial_unit`, `imperial_value`, `operator`, `state`, `form`,
`load_state`, `load_value`, `load_unit`, `currency`, `source`, `retrieved_at`,
`source_type` — samt `robots.first_released`, `robots.variants`,
`field_entry_variants.value`, `applications.value`.

Form: én SHA-256 pr. robot plus ét samlet aftryk, sorteret deterministisk (sortér på
`robot_id`, derefter `field_name`; JSON med sorterede nøgler — ellers flytter en
nøglerækkefølge fra PostgREST aftrykket, uden at data har ændret sig).

`--producent=<navn>` afgrænser til én producent (eksakt match, trim, versalblind —
samme regel som `db/tjek.mjs --kun`).

**Færdig når:** to kørsler i træk giver **samme** samlede aftryk.
**Kontrafaktisk linje, obligatorisk:** vis også, at aftrykket ÆNDRER sig, hvis et tal
ændrer sig. Bevis det uden at røre produktionsdata — fx ved at køre aftryksfunktionen
over en indlæst kopi i hukommelsen, hvor du har ændret ét `value_number`. **Skriv begge
aftryk i rapporten.** Et aftryk, der er stabilt uden at være følsomt, måler ingenting.

## Punkt 2 — `db/fase2-tjek.mjs --dansk`: hvor der er dansk tilbage

Tæller pr. kolonne, hvor mange strenge der stadig er danske, og opdeler pr. producent.

Kolonner: `field_entries.caveat`, `field_entries.caveat_wording`, `applications.note`,
`applications.note_wording`, `applications.quote`, `applications.quote_wording`,
`images.note`, `images.alt`, `robots.notes`, `robots.notes_wording`.
De fem sidste er jsonb — `notes`/`notes_wording`/`quote`/`quote_wording` er **arrays**
af strenge (tæl elementer, ikke rækker), `alt` er et **objekt** `{da, en}`.
Nogle rækker er skalarer og ikke arrays; `jsonb_typeof` før du folder ud, ellers
fejler kørslen med *"cannot extract elements from a scalar"* — det gjorde min.

**Dansk-detektionen skal have to ben, ikke ét.** Et æøå-scan alene er utilstrækkeligt:
målt i dag har 677 af 891 `caveat` æøå, men 116 flere er danske uden. Andet ben er en
ordliste over danske stopord, der ikke er engelske ord (`producenten`, `oplyst`,
`ikke`, `samme`, `kilde`, `angiver`, `skemaet`, `nærmeste` …).

**Skriv i kildekoden, at tallet er nødvendigt og ikke tilstrækkeligt** — en dansk
sætning uden æøå og uden et af ordene slipper igennem. Det er en kendt grænse, ikke
en fejl, og den skal stå, så ingen senere læser tallet som en garanti.

**Færdig når** kørslen mod hele databasen giver disse tal, som jeg selv målte
2. sep 2026 (SQL mod den levende DB, `~ '[æøåÆØÅ]'`):

```
caveat            891 i alt, 677 med aeoeaa   (dit tal bliver HOEJERE med ordlisten)
caveat_wording    309 i alt, 254 med aeoeaa
applications.note  76 i alt,  70 med aeoeaa
images.note        21 i alt,  19 med aeoeaa
robots.notes      147 elementer
images.alt         35 i alt,   0 med aeoeaa (alle 35 har allerede en udfyldt en-noegle)
```

Totalerne (891, 309, 76, 21, 147, 35) er **krav** — rammer du dem ikke, tæller du
noget andet end jeg. Æøå-tallene er **kontroltal**: dit tal skal være ≥ dem, fordi
ordlisten fanger mere. **Er dit tal LAVERE, er det en fejl i din tæller.**

## Punkt 3 — `db/fase2-tjek.mjs --belaeg`: står tallet i den citerede ordlyd?

Konsistenskontrollen fra PLAN.md §0. For hver `field_entries`-række med både et
`value_number` og et `caveat_wording`: forekommer tallet i ordlyden?

Vær konservativ og rapportér en **liste**, ikke en dom. Tallet kan optræde lovligt i
mange former — `18`, `18.0`, `18 KG`, `１８`, `82kg`, med komma som decimaltegn, eller
omregnet fra en anden enhed. Et manglende træf er et **spørgsmål til et menneske**, ikke
en fejl. Skriv det i kildekoden.

**Færdig når** kommandoen kører over alle 309 rækker med ordlyd og skriver antal
undersøgt, antal med træf og antal uden. **Kør den, og skriv de tre tal i rapporten** —
jeg har ikke målt dem på forhånd, så her har jeg ingen forudsigelse at give dig. Det er
med vilje: du måler det, jeg ikke ved.

## Punkt 4 — `db/f2-skriv.mjs`: skrivehjælperen, 23 spor skal bruge

Læser en JSON-fil med opdateringer og anvender dem via PostgREST. Form:

```json
[{ "tabel": "field_entries", "noegle": { "robot_id": 2183, "field_name": "weight" },
   "saet": { "caveat": "...", "caveat_wording": "..." },
   "change_reason": "fase 2: engelsk brødtekst + ordret kildeordlyd udskilt" }]
```

Primærnøglerne, målt i dag: `field_entries` (robot_id, field_name) ·
`applications` (robot_id) · `images` (robot_id) · `robots` (id) ·
`field_entry_variants` (robot_id, field_name, variant_name).

Krav til hjælperen:

1. `collected_by` sættes automatisk til grennavnet, `change_reason` tages fra posten.
   Begge er **påkrævede**; en post uden `change_reason` afvises før noget sendes.
2. **`Prefer: return=representation` er obligatorisk.** Uden den svarer PostgREST 204
   uden krop, og du kan ikke skelne "1 række opdateret" fra "0 rækker matchede". Det er
   den dyreste fælde i hele denne fil.
3. **Præcis 1 række pr. post.** Svarer arrayet med 0 eller >1, så afbryd hele kørslen
   og skriv hvilken post det var.
4. **Kun tekstkolonner.** En hvidliste i koden: `caveat`, `caveat_wording`,
   `caveat_class`, `note`, `note_wording`, `notes`, `notes_wording`, `quote`,
   `quote_wording`, `alt`, `manufacturer_city`, `manufacturer_country`.
   Alt andet afvises med det samme. Det er værnet, der gør punkt 1's aftryk ægte:
   sporene kan ikke røre et tal, selv hvis de prøver.
5. `--toerloeb` som **standard**: viser hvad der ville ske og sender intet. Skrivning
   kræver `--skriv` eksplicit.
6. Skriver til sidst hvor mange rækker der blev ændret, pr. tabel.

**Færdig når** et tørløb mod en JSON-fil med to poster udskriver de to opdateringer og
`0 rækker skrevet`, og et `--skriv` mod en post, der sætter en kolonne til dens
NUVÆRENDE værdi, giver `1 række skrevet`. Vælg den post selv, og **skriv i rapporten
hvilken række du brugte** — en identitetsskrivning ændrer intet indhold, men beviser
hele vejen igennem, at hjælperen rammer præcis én række. Efterprøv derefter, at
`change_log` har fået **1 ny række** for den (`change_log` har **0 rækker i dag** —
triggeren har aldrig fyret på en rigtig UPDATE, så du er den første, der ser den virke).

Bemærk: triggeren er AFTER UPDATE/DELETE. En identitetsskrivning tæller stadig som en
UPDATE i Postgres, så rækken skal komme. **Kommer den ikke, er det et fund** — skriv
det i "Nye fælder", det er vigtigere end resten af dit spor.

## Punkt 5 — testene

`tests/dele/<nr>-fase2-tjek.mjs` efter kontrakten i `tests/LAESMIG.md`.
**Ingen databaseadgang i testene** — brug fixtures. Dæk mindst:
aftryksfunktionen er stabil under nøgleomrokering · aftrykket ændrer sig ved et
ændret tal · dansk-detektoren fanger både æøå og ordlisten · den slipper en ren
engelsk streng igennem · hvidlisten i `f2-skriv.mjs` afviser en talkolonne ·
en post uden `change_reason` afvises.

**Færdig når** `node tests/koer.mjs` giver samme beståtal som din grundmåling plus
dine nye assertions, og **0 nye røde**. Skriv begge tal.

---

## Rækkefølgen — en skrive-grænse, ikke en commit-grænse

Skriv **kun punkt 1's kode**, mål den, commit — og **først derefter** må punkt 2's kode
skrives. Sådan hvert punkt. Målt to gange i dette projekt: en agent, der skriver hele
scriptet i ét Write-kald, får punkt 1's commit til at bære punkt 3's uefterprøvede kode.

Commit undervejs er et krav. To spor er døde midt i arbejdet uden en linje efterladt.

## Miljøfælder — hver af dem har kostet en runde

- `node` er `/c/Program Files/nodejs/node.exe`. Git Bash har den ikke på PATH.
- **`/tmp` findes ikke det samme sted for node og Git Bash.** Brug en sti i projektet.
  Jeg gik selv i den fælde en time før dette brief.
- Commit-beskeder med backticks, `$` eller anførselstegn: skriv til en fil,
  `git commit -F <fil>`. PowerShell 5.1 ødelægger argumentoverførsel.
- `sed -i`, der ikke matcher, gør **intet — tavst, med exit 0**. Brug Edit-værktøjet.
- Lange markdown-filer knækker i bash-heredocs. Brug Write-værktøjet.
- UTF-8 **uden** BOM. `Set-Content -Encoding utf8` ødelægger tankestreger.
- `.env` er gitignoreret og skal kopieres ind i din worktree. Det er gjort for dig —
  efterprøv det med `ls -la .env`, og sig til, hvis den mangler.
- **Skriv aldrig nøglen fra `.env` i en fil, en commit eller din rapport.**
- Skal du starte en server: egen port (8161), aldrig 8080 — den er delt mellem spor.

## Skriv en kontrol før hver måling

Fast projektregel: **skriv, hvad tallet skal være, hvis alt er som forventet — FØR du
læser det.**

```
echo -n "caveat i alt (forventer 891): "; <din kommando>
```

Det koster ingenting og er den eneste ting, der fanger et forkert `grep`. Et forkert
mønster giver typisk et fuldstændig plausibelt tal, så der er intet at undre sig over.

## Briefets fakta er påstande — at måle dem er en del af leverancen

Alle tal ovenfor er **mine målinger, ikke sandheder**. Afviger noget, du måler, fra
noget, briefet påstår, så **rapportér afvigelsen — det er leverance, ikke ulydighed.**
To agenter rettede mine fakta i sidste uge, begge på eget initiativ, begge korrekt. Det
er den billigste kvalitetskontrol, vi har; orkestratoren kontrolleres ellers af ingen.

## Rapporten — `fund/FUND-f2maal.md`, højst 60 linjer

Fire ting og ikke mere:

1. Valgt løsning og fravalgt alternativ, én linje hver.
2. **Konfidens pr. punkt.** Høj = målt med en kommando, jeg kan genkøre og få samme
   tal. Middel = efterprøvet indirekte. Lav = ikke efterprøvet.
   **Høj uden en genkørbar kommando nedskrives automatisk til lav**, og høj kræver
   desuden **én linje om, hvad tallet ville have været, hvis arbejdet var forkert.**
3. Usikkerheder mødt undervejs.
4. Målingerne som **tal**, ikke prosa: "validate 77/0/1", "tests 1552/0" — ikke
   "alt kører".

**Uden for de 60 linjer, obligatorisk:**

- **"Nye fælder og opdagelser."** Er der intet, skal der stå at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

Skriv hvad du ikke nåede og hvad du sprang over. En rapport, der kun indeholder det,
der lykkedes, kan ikke bruges til at beslutte noget.
