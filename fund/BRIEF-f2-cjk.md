# BRIEF — spor/f2-cjk: den kinesiske opskrift, hvor "ordret" og "oversat" er blandet sammen

**Model: Sonnet. Egen worktree. Du SKRIVER i den levende Supabase — men kun i to robotters
tekstkolonner.**

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2cjk` (gren `spor/f2-cjk`).
Rør aldrig `c:\Praktik\websites\salg` eller `c:\Praktik\website` — andre projekter.
Rør ikke hovedrepoet `c:\Praktik\websites\udstilling`.

## Regel 0 — skill-vurdering, skriv den

Skriv **hvilken skill du valgte og hvilke du gik forbi, med begrundelse.** `robotdata`
bærer G1, indsamlingsreglen, og er formentlig dit valg. Overvej også `supabase` og
`fejljagt`. "Ingen skill passer her" er gyldigt, men skal skrives.
Lykkes et skill-kald ikke fra worktreen, så læs `SKILL.md` fra disk og **skriv i
rapporten at du gjorde det.**

## Læs først

`.claude/skills/robotdata/SKILL.md` — **især G1.** Derefter `CLAUDE.md` · `PLAN.md` §0,
især korrektionen "fase 2's verbum" og afsnittet "Det, der ikke er til forhandling".

## Hvorfor du findes — og hvad du skal løse, som planen ikke kender

Et søsterspor (`spor/f2-pilot`) kører samtidig på det engelske tilfælde: citatet ligger
inde i den danske prosa og skal skilles ud. **Dit tilfælde er det omvendte og værre.**

Målt 2. sep 2026 i den levende database: `caveat_wording` er udfyldt på 309 rækker på
tværs af kataloget — men **254 af dem indeholder danske bogstaver**. Feltet hedder
"ordlyd" og skal være producentens ord, ordret. Det er det ikke. Eksemplet er din egen
robot, `astrall-dynamics-hypertron-t01` / `weight`, ordret som det står i dag:

```
caveat_wording:  "重量 82kg（含电池）" (vægt 82kg, inkl. batteri) - inkl. batteri.
caveat:          (vægt 82kg, inkl. batteri) - inkl. batteri.
```

Den ordrette kilde er `重量 82kg（含电池）`. Resten er en dansk oversættelse og en dansk
bemærkning, klistret ind i samme streng. **"Ordret" og "oversat" kan ikke være sandt
samtidig for det samme felt** — og hård begrænsning 2 gør det til mere end en
skønhedsfejl. Du skal skille de to ad, og du skal skrive opskriften for det.

## Grundmåling — DINE FØRSTE TO KOMMANDOER

```
"/c/Program Files/nodejs/node.exe" tools/validate.mjs
git log --oneline -1
```

Mine tal fra main umiddelbart før afsendelse: validate **77 filer / 0 fejl / 1 advarsel**,
HEAD `f8eac85`. **Afviger dine, så STOP og rapportér det.**

Kør IKKE `tests/koer.mjs` mod hovedrepoet. Din worktree mangler `dist/` (gitignoreret);
kør `node tools/build.mjs` FØR en testkørsel, ellers får du 14 røde, der ikke er dine.

## Din anden kommando: læg måleredskabet ind

Opret `fund/maal-f2-cjk.mjs`. **Indholdet står ordret i `spor/f2-pilot`s brief** — kopier
det derfra, eller genskab det efter beskrivelsen; det læser `.env`, henter over REST og
tæller danske strenge pr. kolonne med to ben (æøå-scan **plus** en ordliste over danske
stopord, fordi 116 danske advarsler ikke har æøå).

*Redskabet duplikerer med vilje `db/fase2-tjek.mjs`, som `spor/f2-maal` bygger samtidig.
Det er din engangsmåling, den anden er det varige instrument. Fjern ikke duplikeringen —
den er der, så I tre spor ikke venter på hinanden.*

`node fund/maal-f2-cjk.mjs 2186,2258` **giver i dag præcis dette** — kør og bekræft:

```
robotter: astrall-dynamics-hypertron-t01, yufan-lingmao-cyvet
caveat                         35 | dansk:   32
  heraf uden ordlyd             3 | dansk:    -
caveat_wording                 32 | dansk:   29
applications.note               2 | dansk:    2
images.note                     0 | dansk:    0
robots.notes (elementer)        3 | dansk:    3
robots.notes_wording (el.)      3 | dansk:    3
```

**Får du andre tal, så STOP og rapportér.**

## Dine robotter — og INGEN andre

`robot_id` **2186** (`astrall-dynamics-hypertron-t01`, 17 advarsler) og
**2258** (`yufan-lingmao-cyvet`, 18 advarsler). Ethvert skriv mod et andet `robot_id`
er en fejl i dit spor.

## Filejerskab

Du ejer: `fund/maal-f2-cjk.mjs` · `db/f2-cjk-skriv.mjs` · `fund/OPSKRIFT-fase2-cjk.md` ·
`fund/FUND-f2cjk.md`.

Du rører **ikke**: `db/fase2-tjek.mjs`, `db/f2-skriv.mjs`, `tests/dele/69-*` (ejes af
`spor/f2-maal`) · `fund/maal-f2.mjs`, `db/f2-pilot-skriv.mjs`, `fund/OPSKRIFT-fase2.md`,
`media/_kilder/raa-kand6-*` (ejes af `spor/f2-pilot`) · `assets/`, `tools/`, `data/`,
`db/tjek.mjs`, `db/ordbog.mjs`.

---

## Punkt 1 — Kildesproget læses PÅ kildesproget

Fast projektregel, og den er købt dyrt: `＜60 cm` var **undvigelsesafstand** på kinesisk
og landede som **forhindringshøjde** på engelsk, fordi nogen læste den engelske udgave
af siden. **Læs den kinesiske ordlyd som kinesisk.** Er du usikker på, hvad en etiket
betyder, så skriv usikkerheden i rapporten frem for at vælge den nærmeste engelske
gætning.

Dine råkilder findes allerede:

```
media/_kilder/raa-kand2-2026-08-24/astralldynamics-hypertron-t01-produktside-2026-08-24.html
media/_kilder/raa-kand2-2026-08-24/astralldynamics-forside-2026-08-24.html
media/_kilder/raa-kand2-2026-08-24/astralldynamics-om-os-2026-08-24.html
media/_kilder/raa-kand2-2026-08-24/yufan-uniubi-lingmao-produktside-2026-08-24.html
media/_kilder/raa-kand2-2026-08-24/yufan-uniubi-shop-cyvet-2026-08-24.html
media/_kilder/raa-kand2-2026-08-24/yufan-uniubi-forside-2026-08-24.html
media/_kilder/raa-kand2-2026-08-24/yufan-uniubi-motor-2026-08-24.html
```

`raa-kand2-2026-08-24/` **har allerede et MANIFEST.tsv**. Rør det ikke — proveniensen er
i orden for dine filer. (Fem andre mapper mangler et; det er `spor/f2-pilot`s opgave for
sin egen.)

## Punkt 2 — Klassificér alle 35, før du ændrer noget

Fire kasser, ikke tre. Skriv én række pr. advarsel i `fund/FUND-f2cjk.md`:
`robot_id`, `field_name`, kasse.

**(A) Ordlyd findes, men er forurenet af dansk.** Forventet det almindelige tilfælde:
29 af 32. Den ordrette CJK-streng skal blive stående alene; den danske oversættelse og
bemærkning flyttes over i den engelske `caveat`-prosa. Eksemplet ovenfor bliver:

```
caveat_wording  →  重量 82kg（含电池）
caveat          →  Manufacturer's figure includes the battery.
```

**(B) Ordlyd findes og er allerede ren kilde.** Forventet 3 af 32. Lad `caveat_wording`
stå **uændret**, og skriv kun `caveat` om til engelsk.

**(C) Ingen ordlyd — citatet ligger inde i den danske prosa.** 3 af 35 i dag. Samme
arbejde som søstersporets kasse A: skil citatet ud i `caveat_wording`, lad prosaen blive
til engelsk `caveat`.

**(D) Påstanden kan ikke føres tilbage til nogen kilde.** Hverken til et citat eller til
råkildefilerne. **Ret den ikke, og gæt ikke.** Skriv den på listen i punkt 5 og lad
rækken stå urørt.

**Færdig når** A + B + C + D = **35**. Mine tal 29/3/3/0 er en **forudsigelse**, ikke et
krav — mål det faktiske og skriv det. Rammer du mit gæt uden at have målt, er det den
fejl, dette projekt kalder D7/L30-fælden.

Commit punkt 1-2, før du skriver punkt 3's kode.

## Punkt 3 — Reglen for hvad der bliver i `caveat_wording`

**`caveat_wording` = kildens tegn og kun kildens tegn.** Ingen oversættelse, ingen
parentes med dansk, ingen bemærkning, ingen omsluttende anførselstegn. Består kilden af
to adskilte strenge (etiket plus fodnote, som `astrall` / `speed`), så behold begge, men
kun deres kinesiske del, adskilt så det er tydeligt at det er to.

**Færdig når** `node fund/maal-f2-cjk.mjs 2186,2258` viser
`caveat_wording  32 | dansk: 0` (**i dag 32 | dansk: 29**).

**Oversættelsen af citatet forsvinder ikke — den flytter.** Den hører i den engelske
`caveat`-prosa, hvor den kan læses som det, den er: vores gengivelse, ikke kildens ord.

*Bemærk: PLAN.md §0 nævner et felt `source_wording_en` ved siden af det ordrette. **Den
kolonne findes ikke i skemaet** (målt i dag — `field_entries` har `caveat`,
`caveat_class`, `caveat_wording`, `collected_by`, `change_reason`, og ikke mere). Den
ville kræve en migrering, og migreringer er orkestratorens, ikke dine. **Byg efter reglen
ovenfor**, som virker uden skemaændring. Mener du efter at have set alle 35, at en
`_en`-kolonne alligevel er nødvendig, så skriv hvorfor i rapporten med et konkret
eksempel — så tager jeg den til JPK. Lav den ikke selv.*

## Punkt 4 — Skriv de engelske tekster og send dem til databasen

Alt dansk skal væk fra: 35 `caveat`, **2** `applications.note`, **3** elementer i
`robots.notes` og **3** i `robots.notes_wording`.

`notes` og `notes_wording` er **jsonb-arrays** af strenge — skriv hele arrayet tilbage
med samme antal elementer og samme rækkefølge. Ændrer længden sig, har du tabt noget.
Nogle rækker i kataloget er skalarer og ikke arrays; tjek typen, før du folder ud.
**`notes_wording`s elementer er ordlyd og følger samme regel som punkt 3:** kildens tegn
alene. Ét af dine tre er en tom streng — lad den være tom.

Fire regler for prosaen, og de er hårde:

1. **Opfind intet.** En oversættelse må gøre en sætning klarere; den må ikke gøre den
   stærkere.
2. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal blive ved med at
   være tre forskellige formuleringer på engelsk.
3. **Ingen salgssprog.** Konstaterende, uden tillægsord.
4. Enheder, tal og egennavne uændret. Ændrer du et tal, har du brudt sporet.

Skrivningen sker med `db/f2-cjk-skriv.mjs` mod PostgREST:

```
PATCH ${U}/rest/v1/field_entries?robot_id=eq.2186&field_name=eq.weight
headers: apikey, Authorization: Bearer, Content-Type: application/json,
         Prefer: return=representation
body:    { "caveat": "...", "caveat_wording": "重量 82kg（含电池）",
           "collected_by": "spor/f2-cjk",
           "change_reason": "fase 2: ordret kildeordlyd renset for dansk glose" }
```

Primærnøgler: `field_entries` (robot_id, field_name) · `applications` (robot_id) ·
`robots` (id).

Fem krav:

1. **`Prefer: return=representation` er obligatorisk.** Uden den svarer PostgREST **204
   uden krop**, og du kan ikke skelne "1 række opdateret" fra "0 rækker matchede". Den
   dyreste fælde i hele filen.
2. **Præcis 1 række pr. opdatering.** 0 eller >1: afbryd hele kørslen, skriv hvilken post.
3. **Kun disse kolonner:** `caveat`, `caveat_wording`, `note`, `notes`, `notes_wording`,
   `collected_by`, `change_reason`.
4. `--toerloeb` er **standard**; skrivning kræver `--skriv`. Kør tørløbet først og skriv
   i rapporten, hvor mange opdateringer det viste.
5. **Send CJK som UTF-8 og efterprøv det bagefter.** Hent rækken tilbage og sammenlign
   tegn for tegn med det, du sendte. Kinesiske tegn er der, hvor en kodningsfejl gemmer
   sig, og en forvansket streng ser stadig ud som en streng. Skriv, hvor mange du
   sammenlignede.

**Færdig når** måleredskabet giver:

```
caveat                         35 | dansk:    0    (i dag: 35 | dansk: 32)
caveat_wording                 32 | dansk:    0    (i dag: 32 | dansk: 29)
applications.note               2 | dansk:    0    (i dag: 2  | dansk: 2)
robots.notes (elementer)        3 | dansk:    0    (i dag: 3  | dansk: 3)
robots.notes_wording (el.)      3 | dansk:    0    (i dag: 3  | dansk: 3)
```

**"Uden ordlyd" bliver ikke 0** — det bliver kasse D's antal.

**Og tallet er nødvendigt, ikke tilstrækkeligt.** Ordlisten fanger ikke en dansk sætning
uden æøå og uden et af ordene. **Læs derfor alle 43 tekster igennem selv til sidst og
skriv, hvor mange du læste, og hvor mange fejl du fandt.** Nul fundne fejl uden en
tælling er ikke en efterprøvning.

## Punkt 5 — Tallene må ikke have rørt sig, og listen til JPK

**(a)** Hent alle `field_entries`-rækker for 2186 og 2258 **før** dit første skriv og gem
som JSON i din worktree; hent igen bagefter; sammenlign alle kolonner **undtagen**
`caveat`, `caveat_wording`, `collected_by`, `change_reason`. **Færdig når diffen er tom.**
Er den ikke, er det et fund — rapportér det, ryd det ikke op.

**(b)** `change_log` havde **0 rækker**, da briefet blev skrevet, og triggeren har aldrig
fyret på en rigtig UPDATE. Tæl rækkerne for dine to robotter bagefter og **skriv tallet**.
Kommer der ingen, er triggeren i stykker — det er vigtigere end resten af dit spor, og
det skal stå øverst i rapporten.

**(c)** Kasse D-listen. Én række pr. advarsel: `robot_id`, `field_name`, den danske tekst,
og **hvad du søgte efter i råkilden og ikke fandt**. Listen går til JPK som en åben
beslutning — hård begrænsning 2 siger, at en påstand uden belæg ikke må stå — og **den
beslutning er ikke din.** Ret ingen af dem.

## Punkt 6 — `fund/OPSKRIFT-fase2-cjk.md`

Det, senere spor på de **62 kinesiske robotter** skal kunne følge uden at læse dette
brief. Mindst:

- De fire kasser, med et rigtigt eksempel på hver fra dine egne 35.
- **Reglen for hvad der bliver stående i `caveat_wording`**, sagt så den ikke kan
  misforstås, med et før/efter-par.
- Hvor den danske oversættelse flytter hen, og hvorfor den ikke må blive i ordlyden.
- Hvordan man læser en kinesisk etiket uden at gætte — og `＜60 cm`-fejlen som advarsel.
- UTF-8-kontrollen efter skrivning.
- **Det, der overraskede dig.** Den del bliver den mest læste.

---

## Rækkefølgen — en skrive-grænse, ikke en commit-grænse

Skriv **kun punkt 1-2's arbejde**, mål det, commit — og **først derefter** punkt 3's kode.
Sådan hvert punkt. Målt to gange her: en agent, der skriver alt i ét Write-kald, får
punkt 1's commit til at bære punkt 4's uefterprøvede kode.

Commit undervejs er et krav. To spor er døde midt i arbejdet uden en linje efterladt.

## Miljøfælder — hver har kostet en runde

- `node` er `/c/Program Files/nodejs/node.exe`. Git Bash har den ikke på PATH.
- **`/tmp` findes ikke det samme sted for node og Git Bash.** Brug en sti i projektet.
- Commit-beskeder med backticks, `$` eller anførselstegn: `git commit -F <fil>`.
- `sed -i`, der ikke matcher, gør **intet — tavst, med exit 0**. Brug Edit-værktøjet.
- Lange markdown-filer knækker i bash-heredocs. Brug Write-værktøjet.
- **UTF-8 uden BOM.** `Set-Content -Encoding utf8` ødelægger tankestreger — og for dig
  er det ikke en detalje: du skriver CJK.
- **Ikke-ASCII objektnøgler har givet `InvalidKey` her før.** Møder du det, er det
  kendt — skriv det i "Nye fælder".
- `.env` og `assets/fotos/fabrikant/` er kopieret ind. Efterprøv med `ls -la .env` og
  `ls assets/fotos/fabrikant | wc -l` (**forventer 610**).
- **Skriv aldrig nøglen fra `.env` i en fil, en commit eller din rapport.**
- Egen serverport, hvis du starter en: 8163. Aldrig 8080 — den er delt.

## Skriv en kontrol før hver måling

**Skriv, hvad tallet skal være, hvis alt er som forventet — FØR du læser det.**

```
echo -n "caveat_wording med dansk (forventer 29): "; <din kommando>
```

Et forkert mønster giver typisk et fuldstændig plausibelt tal. Kontrollen er det eneste,
der gør fejlen synlig i samme øjeblik.

## Briefets fakta er påstande

Alle tal ovenfor er **mine målinger**. Afviger noget, du måler, så **rapportér
afvigelsen — det er leverance, ikke ulydighed.** Særligt fordelingen 29/3/3/0 er et gæt.

## Rapporten — `fund/FUND-f2cjk.md`, højst 60 linjer

1. Valgt løsning, fravalgt alternativ — én linje hver.
2. **Konfidens pr. punkt.** Høj = målt med en kommando, jeg kan genkøre og få samme tal,
   **plus én linje om hvad tallet ville have været, hvis arbejdet var forkert.**
   Middel = efterprøvet indirekte. Lav = ikke efterprøvet.
   **Høj uden genkørbar kommando nedskrives automatisk til lav.**
3. Usikkerheder mødt undervejs — herunder hver kinesisk etiket, du ikke var sikker på.
4. Målingerne som **tal**: "35 advarsler, A=x B=y C=z D=w", "change_log N nye rækker".

Tabellerne fra punkt 2 og 5(c) må gerne ligge i samme fil under de 60 linjer.

**Uden for loftet, obligatorisk:**

- **"Nye fælder og opdagelser."** Er der intet, skal der stå at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.
