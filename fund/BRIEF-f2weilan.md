# BRIEF — spor/f2weilan: `caveat_wording` for WEILAN og Youbaotes 60 rækker

**Model:** sonnet · **Worktree:** `C:\Praktik\websites\udstilling-wt-f2weilan` ·
**Gren:** `spor/f2weilan`, forgrenet fra `38bfd53` · **Port:** 8153
**Rapport:** `fund/FUND-f2weilan.md`

---

## 0. Første handling

**Kald `spor`-skillen.** Den bærer grundmåling, skrive-grænse, kontrollinje,
filejerskab, selv-efterprøvning, rapportform og konfidensskala. Lykkes kaldet
ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og
**skriv i rapporten, at du gjorde det.**

**Vurdér desuden og skriv valg + fravalg:** `robotdata` (de ti hårde regler om
kilder og operatorer — læs den), `supabase` (du skriver i databasen),
`fejljagt` (hvis et tal opfører sig uventet).

---

## 1. Hvorfor sporet findes

Fase 2's færdigkriterium i `PLAN.md` er, at **`source_wording` er udfyldt på
alle 890 forbehold**, hvorefter kolonnen bliver `NOT NULL`. I dag: **623 af
890**. De manglende **267** er fase 2's tredje arbejde.

Du har fået de to producenter med **flest rækker pr. kilde**: 60 rækker, der
tilsammen kun hviler på **2 unikke kilde-URL'er**. Læser du de to kilder
grundigt én gang, har du grundlaget for dem alle.

**Begge producenter er kinesiske.** Å156's regel gælder: **læs den kinesiske
side, ikke en engelsk oversættelse af den.** Prisen for at lade være står i
projektets historik — `＜60 cm` var *undvigelsesafstand* på kinesisk og landede
som *forhindringshøjde* på siden.

---

## 2. Grundmåling — MINE tal, som du genmåler som din første kommando

Målt af orkestratoren 3. sep 2026 kl. ~23.40:

```sql
select r.manufacturer, count(*) as raekker,
       count(distinct fe.robot_id) as robotter,
       count(*) filter (where fe.caveat ~ '"[^"]{3,}"' or fe.caveat ~ '[«»""]') as med_citat,
       count(distinct fe.source) as unikke_kilder
from field_entries fe join robots r on r.id = fe.robot_id
where fe.caveat is not null and fe.caveat <> ''
  and (fe.caveat_wording is null or fe.caveat_wording = '')
  and r.manufacturer in ('WEILAN','Shandong Youbaote Intelligent Robot')
group by r.manufacturer;
```

| Producent | Rækker | Robotter | Med citat | Unikke kilder |
|---|---|---|---|---|
| WEILAN | **36** | 2 | **2** | **1** |
| Shandong Youbaote Intelligent Robot | **24** | 3 | **0** | **1** |
| **I alt** | **60** | **5** | **2** | **2** |

**Kontrollinje, så et lille tal ikke er en tavs forespørgselsfejl:** samme
forespørgsel uden `manufacturer`-filteret giver **267**.

**Afviger din genmåling fra mine tal, så STOP og rapportér det.** Mine tal er
påstande, indtil du har målt dem — det er en del af leverancen, ikke ulydighed.

---

## 3. Opgaven

### 3a. De 2 med citat: udskil ordret

Producentens ord står allerede i vores prosa i anførselstegn. Flyt dem til
`caveat_wording` **ordret** — ingen omskrivning, ingen oversættelse, ingen
normalisering af enheder eller store bogstaver. `caveat` (brødteksten) står
uændret.

### 3b. De 58 uden citat: find kildens sætning — eller meld, at der ingen er

Rækkens `source`-kolonne siger, hvilken kilde forbeholdet hviler på. Find den
sætning, der bærer forbeholdet, i **råkilden** (`media/_kilder/`, kopieret ind
til dig — 540 filer). Findes den, ind i `caveat_wording` ordret **på kildens
eget sprog**. Er kilden kinesisk, står der kinesisk.

**Findes den IKKE, så opfind den ikke.** Hård begrænsning 2 i CLAUDE.md:
*"Opfind aldrig tal, cases, certificeringer eller kapaciteter."* Et
`caveat_wording`, du selv har formuleret, er et **opdigtet producentcitat** —
værre end et tomt felt, fordi det ser ud som belæg.

Meld rækken i rapporten under **"ingen kildeordlyd findes"**: robot-id,
feltnavn, nuværende `caveat`, hvilken kilde du søgte i, og hvad du søgte
efter.

**Det er et gyldigt og forventet resultat, ikke en fiasko.** Orkestratorens
måling siger, at **238 af de 267** på tværs af alle producenter formentlig er
**vores egen analyse** uden noget producentcitat bag — stikprøven lyder
*"Qualitative, not a level on a scale."* og *"No load condition given."*
**Dine 58 er sandsynligvis i høj grad den slags.** Meld dem hellere end at
fylde feltet.

**Er en kinesisk term allerede bevaret i rækkens `caveat`**, så hører den i
`caveat_wording`, ikke i brødteksten — men **rør den ikke her.** Det er
`spor/f2han`s opgave, og ingen af dine 5 robotter er blandt dens 16.

---

## 4. Skrivevejen — den ene, ingen anden

```
node db/f2-skriv.mjs <opdateringer.json>           TØRLØB (standard)
node db/f2-skriv.mjs <opdateringer.json> --skriv   skriver rigtigt
```

```json
{ "tabel": "field_entries",
  "noegle": { "robot_id": 2183, "field_name": "weight" },
  "saet": { "caveat_wording": "站立尺寸 1110mm*610mm*745mm" },
  "change_reason": "spor/f2weilan: kildeordlyd fundet i raakilden" }
```

`collected_by` sættes **automatisk** til grennavnet. `change_reason` er
**påkrævet på hver post**. **Kør altid tørløb først og læs outputtet.**

**Skriv ikke gennem noget andet** — ikke egne fetch-kald, ikke SQL, ikke
`db/eksporter.mjs`. Fire tidligere spor skrev uden om hvidlisten, og de 95
rækker er stadig uefterprøvede (Å163 punkt 1).

**Node-fælde på denne maskine:** har en fil lavet et `fetch()`, så kald
**aldrig** `process.exit()` bagefter — sæt `process.exitCode` og lad
event-løkken tømme sig. Ellers crasher node v24 med en libuv-assertion og
exit 127, også når kaldet lykkedes.

---

## 5. Acceptkriterier — kørt mod main, med dagens svar

**Punkt 1.** WEILAN+Youbaote-rækker uden `caveat_wording` giver **i dag 60**.
**Færdig når den giver 60 minus antallet, du faktisk udfyldte** — og det tal
skal stå i rapporten sammen med listen over dem, du ikke kunne udfylde.
**Et lavere tal er ikke i sig selv bedre: 20 udfyldte plus 40 dokumenterede
umuligheder er et bedre resultat end 60 udfyldte, hvoraf 40 er opdigtede.**

**Punkt 2 — kontrollen mod tavs skade:** `caveat`-tællingen for dine to
producenter skal være **uændret** før og efter. Ændrer den sig, har du rørt
brødteksten, og det er ikke opgaven.

**Punkt 3.** `change_log` på `changed_by='spor/f2weilan'`: **kun**
`caveat_wording` (plus metafelterne), **0 rækker i nogen talkolonne**,
**0 robotter uden for dine 5**. Skriv de målte tal.

---

## 6. Det, du IKKE skal gøre

- **Kør IKKE `node tests/koer.mjs`** — 2,8 GB, og to andre spor kører samtidig.
  Dine tal måles i SQL. Orkestratoren kører suiten på det samlede resultat.
- **Kør IKKE `db/eksporter.mjs`** — to andre spor skriver i databasen samtidig.
- **Rør IKKE `data/robots/`, `tools/`, `tests/`, `assets/`.**

## 7. Filejerskab

**Du ejer:** `fund/FUND-f2weilan.md`, `fund/BRIEF-f2weilan.md`, arbejdsfiler
under `fund/`. I databasen: **WEILAN's og Youbaotes 60 rækker uden
`caveat_wording`**, og kun deres `caveat_wording`.

**To andre spor kører samtidig i databasen:** `spor/f2han` og `spor/f2pudu`.
**Overlap er målt til 0 rækker.**

Hentede råkilder gemmes under `media/_kilder/raa-f2weilan-2026-09-03/` med
**MANIFEST** (URL, HTTP-status, UTC-tidspunkt, SHA-256). Mappen er
gitignoreret og følger **ikke** med grenen — **skriv i rapporten, at den
findes**, så orkestratoren kan redde den, før worktreen fjernes. Det tab er
sket før (MANIFEST-tabet 24. aug, 219 rækkers proveniens).

## 8. Commits undervejs

Commit dette brief **først**, før arbejdet begynder. Derefter commit efter
hver producent. Et spor, der dør med ucommitteret arbejde, efterlader næsten
intet brugbart.

## 9. Rapporten

`fund/FUND-f2weilan.md`, højst 60 linjer plus de to obligatoriske sektioner
uden for loftet. Konfidens bundet til bevistype: **høj** kræver en genkørbar
kommando **plus** en kontrafaktisk linje.

**Obligatorisk ekstra sektion:** *"Rækker uden kildeordlyd"* — robot-id,
feltnavn, nuværende `caveat`, hvilken kilde du søgte i, og hvad du søgte
efter.

Skriv **hvor mange rækker du efterprøvede, og hvor mange fejl du fandt.**
**Rapportér enhver afvigelse fra dette briefs påstande.**
