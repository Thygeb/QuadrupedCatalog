# BRIEF — spor/f2han: kinesiske tegn ud af det brugervendte `caveat`

**Model:** sonnet · **Worktree:** `C:\Praktik\websites\udstilling-wt-f2han` ·
**Gren:** `spor/f2han`, forgrenet fra `38bfd53` · **Port:** 8151 (bruges næppe)
**Rapport:** `fund/FUND-f2han.md`

---

## 0. Første handling

**Kald `spor`-skillen.** Den bærer grundmåling, skrive-grænse, kontrollinje,
filejerskab, selv-efterprøvning, rapportform og konfidensskala. Lykkes kaldet
ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og
**skriv i rapporten, at du gjorde det.**

**Vurdér desuden disse og skriv valg + fravalg:** `supabase` (du skriver i
databasen), `fejljagt` (hvis et tal opfører sig uventet), `robotdata` (bærer
feltskemaet — men du redigerer ikke en robotpost, så den er formentlig et
fravalg).

---

## 1. Hvad der er galt, og hvorfor det er en fejl og ikke en smagssag

`tests/dele/42-cjk-ordlyd.mjs` hedder ordret:

> *42. spor/cjkui — advarsel/note/citat/noter er rene for han-tegn, ordlyden er
> bevaret i `*_ordlyd`*

Det er reglen: **kinesisk hører i ordlydsfelterne, ikke i det felt en besøgende
læser.** Fase 2 brød den ved at skrive den kinesiske term **inline** i den
engelske brødtekst som en hjælpsom parentes. To ægte eksempler fra databasen:

```
galileo-c1-w  · advarsel: "... Nominal battery voltage (电池额定电压) 48V ..."
galileo-c1    · advarsel: "... Mapped to walking payload - '有效' (effective, during active use) ..."
```

Det ser hjælpsomt ud. Det er stadig en regelovertrædelse, og den gør **tre
tests røde** på main lige nu.

**Testen skal IKKE vendes.** Dens navn bærer beslutningen (`spor/cjkui`), og
CLAUDE.md's regel *"ret assertions, slet dem ikke"* har her sin skærpede form:
assertionen ER arkivet. Du retter data, ikke testen. Rører du en fil i
`tests/`, har du misforstået opgaven.

---

## 2. Grundmåling — MIN måling, som du skal genmåle som din første kommando

Målt af orkestratoren 3. sep 2026 kl. ~23.40 mod den levende database:

```sql
select count(*) filter (where caveat ~ '[一-鿿]')         as han_i_caveat,
       count(*) filter (where caveat_wording ~ '[一-鿿]') as han_i_caveat_wording,
       count(*) filter (where value_text ~ '[一-鿿]')     as han_i_value_text
from field_entries;
```

| Kolonne | I dag | Skal blive |
|---|---|---|
| `caveat` (brugervendt) | **43** | **0** |
| `caveat_wording` (kildeordlyd) | **317** | **mindst 317** — den må vokse, aldrig skrumpe |
| `value_text` | 0 | 0 |

Fordelt (målt, ikke gættet): GENISOM AI 19 · Yuejia Lingdong 13 ·
Galileo (Tianjin) 4 · Xiaomi 2 · Yufan Intelligent 2 · MicroRoboTech 1 ·
CVTE 1 · Astrall Dynamics 1. **I alt 43 rækker over 16 robotter.**

**Afviger din genmåling fra mine tal, så STOP og rapportér det** — det er en
del af leverancen, ikke ulydighed. Mine tal er påstande, indtil du har målt dem.

---

## 3. Opgaven, række for række

For hver af de 43 rækker:

1. **Læs `caveat` og `caveat_wording` som de står nu.**
2. **Er den kinesiske tekst allerede bevaret i `caveat_wording`?**
   → Fjern den fra `caveat`, så brødteksten står som ren engelsk prosa.
   Den engelske mening skal være **uændret** bagefter — du fjerner en
   parentes, ikke et led i sætningen.
3. **Er den IKKE bevaret i `caveat_wording`?**
   → Flyt den derover, ordret. `caveat_wording` er kildens ord, uændret.
   Er feltet allerede optaget af anden kildetekst, så **læg ikke to ting
   sammen uden at sige det** — flag rækken i rapporten og lad den stå.
4. **Efterprøv mod råkilden**, når den findes i `media/_kilder/` (kopieret
   ind til dig, 540 filer). Står den kinesiske streng ordret i kilden?
   Gør den ikke, er det et fund, ikke en rettelse.

**INGEN INFORMATION MÅ FORSVINDE.** Den dyre fejl her er at slette et kinesisk
udtryk, som var det eneste sted, en tvetydighed var dokumenteret. Å156's
`＜60 cm`-sag er præcis den: en kinesisk kilde sagde *undvigelsesafstand*, og
tallet landede som *forhindringshøjde*. Er du i tvivl, om en term bærer
betydning: **lad rækken stå og flag den.** En flaget række er et resultat.

---

## 4. Skrivevejen — den ene, ingen anden

```
node db/f2-skriv.mjs <opdateringer.json>           TØRLØB (standard)
node db/f2-skriv.mjs <opdateringer.json> --skriv   skriver rigtigt
```

Postformat:

```json
{ "tabel": "field_entries",
  "noegle": { "robot_id": 2183, "field_name": "weight" },
  "saet": { "caveat": "...", "caveat_wording": "..." },
  "change_reason": "spor/f2han: kinesisk term flyttet fra caveat til caveat_wording" }
```

`collected_by` sættes **automatisk** til grennavnet — sæt den ikke selv, den
er ikke på hvidlisten. `change_reason` er **påkrævet på hver post**; mangler
den på bare én, afvises hele kørslen før noget sendes.

**Kør altid tørløb først og læs dets output, før du sætter `--skriv`.**

**Skriv ikke gennem noget andet.** Ikke egne fetch-kald, ikke SQL, ikke
`db/eksporter.mjs`. Fire tidligere spor skrev uden om hvidlisten gennem egne
scripts, og de 95 rækker er stadig uefterprøvede — det er Å163's punkt 1, og
det skal ikke gentages.

---

## 5. Acceptkriterier — kørt mod main, med dagens svar

**Punkt 1.** `han_i_caveat` (SQL'en i afsnit 2) giver **i dag 43**.
**Færdig når den giver 0.**

**Punkt 2 — kontrollen, så nullet ikke er en tavs forespørgselsfejl:**
`han_i_caveat_wording` giver **i dag 317**. **Færdig når den er ≥ 317.**
Falder den, har du slettet kildeordlyd, og det er en fejl.

**Punkt 3.** `change_log` på `changed_by='spor/f2han'` skal give **præcis
det antal rækker, du faktisk rettede** (≤ 43), **alle i `caveat` og/eller
`caveat_wording`**, og **0 rækker i nogen talkolonne**. Skriv det målte tal.

**Punkt 4.** De 16 robotter må være **de eneste** berørte. Er der en robot i
`change_log`, som ikke står i din liste fra afsnit 2, er det en fejl.

---

## 6. Det, du IKKE skal gøre

- **Kør IKKE `node tests/koer.mjs`.** Den koster 2,8 GB, disken har 17 GB fri,
  og to andre spor kører samtidig. Vigtigere: dens tal ville alligevel være
  forkerte, fordi `dist/` bygges fra YAML, og YAML'en først opdateres, når
  orkestratoren eksporterer efter dit spor. **Orkestratoren kører suiten på
  det samlede resultat og verificerer, at de tre røde tests går grønne.**
- **Kør IKKE `db/eksporter.mjs`.** To andre spor skriver i databasen samtidig;
  en eksport ville trække deres halvfærdige arbejde ind i din worktree.
- **Rør IKKE `data/robots/`, `tools/`, `tests/`, `assets/`.**

## 7. Filejerskab

**Du ejer:** `fund/FUND-f2han.md`, `fund/BRIEF-f2han.md`, og eventuelle
arbejdsfiler under `fund/`. I databasen: **de 43 rækker med han-tegn i
`caveat`**, og kun deres `caveat`/`caveat_wording`.

**To andre spor kører samtidig i databasen** — `spor/f2pudu` (Pudu Robotics)
og `spor/f2weilan` (WEILAN + Youbaote). **Overlap er målt til 0 rækker.**
Ingen af dine 16 robotter tilhører deres producenter. Rører du en række uden
for dit sæt, kolliderer du med dem.

## 8. Commits undervejs — ikke til sidst

Commit efter hver producent, du bliver færdig med. Et spor, der dør med
ucommitteret arbejde, efterlader næsten intet brugbart. Det er målt: 27. aug
blev et stallet spor genoptaget uden tab, fordi der lå 3 commits.

Commit også dette brief som din **første** commit, før arbejdet begynder.

## 9. Rapporten

`fund/FUND-f2han.md`, højst 60 linjer plus de to obligatoriske sektioner uden
for loftet (*"Nye fælder og opdagelser"* og *"Punkter i briefet, jeg ikke
nåede"*). Konfidens bundet til bevistype: **høj** kræver en genkørbar kommando
**plus** en kontrafaktisk linje.

Skriv **hvor mange rækker du efterprøvede, og hvor mange fejl du fandt.**
Nul fundne fejl uden en tælling er ikke en efterprøvning.

**Rapportér enhver afvigelse fra dette briefs påstande.** Mine tal er målt,
men de er stadig påstande hos dig.
