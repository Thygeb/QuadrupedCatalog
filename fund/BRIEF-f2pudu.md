# BRIEF — spor/f2pudu: `caveat_wording` udfyldt for Pudu Robotics' 31 rækker

**Model:** sonnet · **Worktree:** `C:\Praktik\websites\udstilling-wt-f2pudu` ·
**Gren:** `spor/f2pudu`, forgrenet fra `38bfd53` · **Port:** 8152
**Rapport:** `fund/FUND-f2pudu.md`

---

## 0. Første handling

**Kald `spor`-skillen.** Den bærer grundmåling, skrive-grænse, kontrollinje,
filejerskab, selv-efterprøvning, rapportform og konfidensskala. Lykkes kaldet
ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og
**skriv i rapporten, at du gjorde det.**

**Vurdér desuden og skriv valg + fravalg:** `robotdata` (bærer de ti hårde
regler om kilder og operatorer — læs den, du arbejder med kildebelæg),
`supabase` (du skriver i databasen), `fejljagt` (hvis et tal opfører sig
uventet).

---

## 1. Hvorfor sporet findes

Fase 2's færdigkriterium i `PLAN.md` er, at **`source_wording` er udfyldt på
alle 890 forbehold**, hvorefter kolonnen bliver `NOT NULL`. I dag er **623 af
890** udfyldt. De manglende **267** er fase 2's tredje arbejde — og de er
**ikke** et hul i indsamlingen, men to forskellige opgaver blandet sammen.

Du har fået **den nemme halvdel med vilje**: Pudu er den producent, hvor
flest rækker allerede bærer producentens ord inde i vores egen prosa.

---

## 2. Grundmåling — MINE tal, som du genmåler som din første kommando

Målt af orkestratoren 3. sep 2026 kl. ~23.40:

```sql
select r.manufacturer, count(*) as raekker,
       count(*) filter (where fe.caveat ~ '"[^"]{3,}"' or fe.caveat ~ '[«»""]') as med_citat,
       count(*) filter (where not (fe.caveat ~ '"[^"]{3,}"' or fe.caveat ~ '[«»""]')) as uden_citat
from field_entries fe join robots r on r.id = fe.robot_id
where fe.caveat is not null and fe.caveat <> ''
  and (fe.caveat_wording is null or fe.caveat_wording = '')
  and r.manufacturer = 'Pudu Robotics'
group by r.manufacturer;
```

| | I dag |
|---|---|
| Pudu-rækker uden `caveat_wording` | **31** |
| — heraf med et citat i anførselstegn | **25** |
| — heraf uden noget citat | **6** |
| Robotter | **2** |
| Unikke kilde-URL'er | **3** |

**Kontrollinje, så et lille tal ikke er en tavs forespørgselsfejl:** samme
forespørgsel uden `manufacturer`-filteret giver **267**. Får du 0 for Pudu,
så tjek filteret, før du konkluderer.

**Afviger din genmåling fra mine tal, så STOP og rapportér det.** Mine tal er
påstande, indtil du har målt dem — det er en del af leverancen, ikke ulydighed.

---

## 3. Opgaven — to slags rækker, to fremgangsmåder

### 3a. De 25 med et citat: udskil det, opfind intet

Producentens ord står allerede inde i vores prosa. Eksempel på formen (fra en
anden producent, så du ikke matcher blindt):

```
caveat:         "PAYLOAD: 5 KG" - producenten skelner ikke mellem gående og
                stående last. Placeringen under gående last er vores tolkning.
caveat_wording: (tom)
```

Bliver til:

```
caveat:         uændret engelsk brødtekst
caveat_wording: PAYLOAD: 5 KG        <- ORDRET, som kilden skriver det
```

**`caveat_wording` er kildens ord, ikke vores.** Ingen omskrivning, ingen
oversættelse, ingen normalisering af store bogstaver eller enheder. Skriver
kilden `0,5` med komma, står der `0,5`.

**Efterprøv hvert citat mod råkilden** i `media/_kilder/` (kopieret ind til
dig — 540 filer). Står strengen der ikke ordret, er det et **fund**, ikke
noget du retter til.

### 3b. De 6 uden citat: find kildens sætning — eller meld, at der ingen er

Gå til råkilden for feltet (`source`-kolonnen på rækken siger hvilken) og find
den sætning, der bærer forbeholdet. Findes den, ind i `caveat_wording` ordret.

**Findes den IKKE, så opfind den ikke.** Hård begrænsning 2 i CLAUDE.md:
*"Opfind aldrig tal, cases, certificeringer eller kapaciteter."* Et
`caveat_wording`, du selv har formuleret, er et opdigtet producentcitat — det
er værre end et tomt felt, fordi det ser ud som belæg.

Meld i stedet rækken i rapporten under en overskrift **"ingen kildeordlyd
findes"**, med robot-id, feltnavn, den nuværende `caveat` og hvad du søgte
efter. **Det er et gyldigt og forventet resultat.** Orkestratorens egen måling
siger, at 238 af de 267 på tværs af alle producenter formentlig er vores egen
analyse uden noget producentcitat bag — så nogle af dine 6 er sandsynligvis
umulige, og det skal de have lov til at være.

---

## 4. Skrivevejen — den ene, ingen anden

```
node db/f2-skriv.mjs <opdateringer.json>           TØRLØB (standard)
node db/f2-skriv.mjs <opdateringer.json> --skriv   skriver rigtigt
```

```json
{ "tabel": "field_entries",
  "noegle": { "robot_id": 2183, "field_name": "weight" },
  "saet": { "caveat_wording": "PAYLOAD: 5 KG" },
  "change_reason": "spor/f2pudu: kildeordlyd udskilt af vores prosa" }
```

`collected_by` sættes **automatisk** til grennavnet. `change_reason` er
**påkrævet på hver post** — mangler den på bare én, afvises hele kørslen, før
noget sendes. **Kør altid tørløb først og læs outputtet.**

**Skriv ikke gennem noget andet** — ikke egne fetch-kald, ikke SQL, ikke
`db/eksporter.mjs`. Fire tidligere spor skrev uden om hvidlisten, og de 95
rækker er stadig uefterprøvede (Å163 punkt 1). Gentag det ikke.

---

## 5. Acceptkriterier — kørt mod main, med dagens svar

**Punkt 1.** Pudu-rækker uden `caveat_wording` (SQL'en i afsnit 2) giver
**i dag 31**. **Færdig når den giver 31 minus antallet, du faktisk udfyldte**
— og det tal skal stå i rapporten sammen med listen over dem, du IKKE kunne
udfylde og hvorfor. **Et lavere tal er ikke i sig selv bedre: 25 udfyldte
plus 6 dokumenterede umuligheder er et bedre resultat end 31 udfyldte, hvoraf
6 er opdigtede.**

**Punkt 2 — kontrollen mod tavs skade:** `caveat`-tællingen for Pudu skal være
**uændret**. Kør før og efter:
`select count(*) from field_entries fe join robots r on r.id=fe.robot_id
 where r.manufacturer='Pudu Robotics' and fe.caveat is not null and fe.caveat <> '';`
Ændrer den sig, har du rørt brødteksten, og det er ikke opgaven.

**Punkt 3.** `change_log` på `changed_by='spor/f2pudu'`: **kun** `caveat_wording`
(plus metafelterne), **0 rækker i nogen talkolonne**, **0 robotter uden for
dine 2**. Skriv de målte tal.

---

## 6. Det, du IKKE skal gøre

- **Kør IKKE `node tests/koer.mjs`** — 2,8 GB, og to andre spor kører samtidig.
  Dine tal måles i SQL. Orkestratoren kører suiten på det samlede resultat.
- **Kør IKKE `db/eksporter.mjs`** — to andre spor skriver i databasen samtidig.
- **Rør IKKE `data/robots/`, `tools/`, `tests/`, `assets/`.**

## 7. Filejerskab

**Du ejer:** `fund/FUND-f2pudu.md`, `fund/BRIEF-f2pudu.md`, arbejdsfiler under
`fund/`. I databasen: **Pudu Robotics' 31 rækker uden `caveat_wording`**, og
kun deres `caveat_wording`.

**To andre spor kører samtidig i databasen:** `spor/f2han` (kinesiske tegn,
16 robotter hos 8 andre producenter) og `spor/f2weilan` (WEILAN + Youbaote).
**Overlap er målt til 0 rækker.** Ingen Pudu-række tilhører dem.

Hentede råkilder gemmes under `media/_kilder/raa-f2pudu-2026-09-03/` med
**MANIFEST** (URL, HTTP-status, UTC-tidspunkt, SHA-256). Mappen er
gitignoreret og følger ikke med grenen — **skriv i rapporten, at den findes,
så orkestratoren kan redde den før worktreen fjernes.** Det tab er sket før
(MANIFEST-tabet 24. aug).

## 8. Commits undervejs

Commit dette brief **først**, før arbejdet begynder. Derefter commit efter
hver robot. Et spor, der dør med ucommitteret arbejde, efterlader næsten
intet brugbart.

## 9. Rapporten

`fund/FUND-f2pudu.md`, højst 60 linjer plus de to obligatoriske sektioner
uden for loftet. Konfidens bundet til bevistype: **høj** kræver en genkørbar
kommando **plus** en kontrafaktisk linje.

**Obligatorisk ekstra sektion:** *"Rækker uden kildeordlyd"* — robot-id,
feltnavn, nuværende `caveat`, hvilken kilde du søgte i, og hvad du søgte
efter. Den sektion er lige så meget leverancen som de udfyldte rækker.

Skriv **hvor mange rækker du efterprøvede, og hvor mange fejl du fandt.**
**Rapportér enhver afvigelse fra dette briefs påstande.**
