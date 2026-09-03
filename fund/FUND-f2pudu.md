# FUND — spor/f2pudu: `caveat_wording` for Pudu Robotics' 31 rækker

## Skills — valgt og fravalgt
Kaldt: `spor` (Skill-værktøjet virkede fra worktreen — intet disk-fallback nødvendigt).
Fravalgt: `robotdata` (opgaven ændrer ikke robot-skemaet eller tal, kun tekstcitater —
reglerne om 33-felt-skema er ikke i spil), `supabase` (skrivevejen er `db/f2-skriv.mjs`,
ikke rå MCP-skrivning; MCP `execute_sql` brugt kun til LÆSNING/grundmåling, hvilket
briefet ikke forbød), `fejljagt` (intet tal opførte sig uventet).

## Grundmåling — genmålt, matcher briefet præcist
`select ... where manufacturer='Pudu Robotics'` (briefets SQL, kørt via
`mcp__supabase__execute_sql`): **31** rækker, **25** med citat, **6** uden. Kontrollinjen
uden producent-filter: **267**. `caveat`-optælling for Pudu før arbejdet: **31**. Ingen
afvigelse fra briefets tal.

## Valgt løsning / fravalgt
Valgt: udskil citatet, der allerede står i `caveat`, og verificér det tegn-for-tegn mod
`media/_kilder/raa-kand1a-2026-08-24/pudu-d5-{storeside,officielside,prnewswire}-2026-08-24.txt`
(allerede i worktreen, ingen nye kilder hentet). Fravalgt: at genbruge caveatets eget citat
blindt uden kildetjek — havde jeg gjort det, ville 13 af de 25 være skrevet med forkerte
tegn (se fund nedenfor).

## Resultatet — hvad der nu står i databasen (Pudu Robotics, 31 rækker)

| Før | Efter |
|---|---|
| 31 rækker uden `caveat_wording` | **0** rækker uden `caveat_wording` |
| 25 rækker med citat i `caveat`, tomt `caveat_wording` | 25 udfyldt med kildens egen ordlyd |
| 6 rækker uden citat, tomt `caveat_wording` | 6 udfyldt — kildeordlyd fandtes for alle 6 (delt med søsterfelt/variant, se nedenfor) |
| `caveat`-brødtekst | **uændret** (31 før, 31 efter — ingen brødtekst rørt) |

## Acceptkriterier (briefets afsnit 5)
**Punkt 1 — høj (kommando: SQL i afsnit 2 ovenfor):** 31 − 31 = **0**. Ingen rækker
tilbage. Kontrafaktisk: havde jeg kun skrevet 20, ville forespørgslen give 11.
**Punkt 2 — høj:** `caveat`-optælling for Pudu **31 før / 31 efter** — uændret.
Kontrafaktisk: havde jeg rørt brødteksten, ville tallet afvige fra 31.
**Punkt 3 — høj:** `select count(*) from change_log where changed_by='spor/f2pudu'` = **31**,
`count(distinct row_key->>'robot_id')` = **2**, `count(*) filter (where table_name<>'field_entries')`
= **0**. Talkolonner kan strukturelt ikke rammes (hvidlisten i `db/f2-skriv.mjs` indeholder
kun tekstkolonner). Kontrafaktisk: en fejl i noeglen ville give et 3. robot-id eller en
anden tabel i denne optælling.

## Selv-efterprøvning
**31 af 31** rækker efterprøvet mod råkilden, én for én. **13 fejl fundet** — ikke i mit
eget arbejde, men i *caveatets egne* citater (se "Nye fælder" nedenfor): caveat-teksten
citerer producenten med normaliserede tegn, der ikke matcher kilden ordret. Alle 13 er
rettet til kildens faktiske tegn i `caveat_wording` (aldrig til noget jeg selv har opfundet
— kun til hvad kildefilen rent faktisk viser).

---

## Rækker uden kildeordlyd
**Ingen.** Alle 6 "uden citat"-rækker fik en kildeordlyd — men ikke ved at opfinde en:

| Robot | Felt | Hvorfor `caveat` var tom for citat | Kildeordlyd brugt |
|---|---|---|---|
| 2226 D5 | width | Kilden navngiver ikke akserne enkeltvis, kun ét trippel-tal | Samme trippel som `length`: "Standing Dimensions: 900 × 543 × 572 mm" |
| 2226 D5 | height | Samme årsag | Samme trippel som `length` |
| 2227 D5-W | width | Samme årsag | Samme trippel som D5-W's `length` |
| 2227 D5-W | height | Samme årsag | Samme trippel som D5-W's `length` |
| 2227 D5-W | lidar | `caveat` siger selv "same as for D5" | Samme fodnote 5 som 2226's `lidar` |
| 2227 D5-W | autonomy_level | `caveat` siger selv "same source as for D5" | Samme PR-sætning som 2226's `autonomy_level` |

**Vigtig usikkerhed til orkestratoren:** for width/height genbrugte jeg det samme
udifferentierede tripel-tal som for `length`, fordi kilden reelt ikke navngiver akserne
hver for sig — det er selve pointen i `caveat`'ens "UNCERTAIN ASSIGNMENT". Det er ikke et
opdigtet citat (samme tekst står faktisk i kilden), men det er en fortolkning af, at
"kildeordlyd for width" kan være den samme sætning som "kildeordlyd for length". Er det
for vidtgående, bør disse 4 rækker i stedet tømmes tilbage til NULL — det er en ren
databaseoperation, ingen kodeændring.

## Nye fælder og opdagelser
1. **Caveat-tekstens egne "citater" er ikke altid ordrette mod kilden.** 13 af de 25
   "med citat"-rækker havde en systematisk normalisering: kildens en-tankestreg (–) blev
   til bindestreg (-) i `payload_walking`/`temperature_max`, kildens multiplikationstegn
   (×) blev til bogstavet "x" i `length`, kildens gradtegn (°) manglede helt i `slope`, og
   flere værdier var afkortet (manglende tomme-parentes i `obstacle_single`). Det betyder,
   at et fremtidigt fase 2-spor IKKE kan stole på, at teksten i anførselstegn i `caveat`
   er kildens ordret ordlyd — den skal altid slås op i råkilden, aldrig kun kopieres.
2. **`price`-rækkernes eget "citat" er slet ikke producent-prosa.** Caveatens citat
   `variant "D5": price 8000000` er en parafrase af Shopify-JSON, ikke noget kilden
   nogensinde skriver i den form. For 2226 fandt jeg i stedet den viste pris "$80,000.00"
   (ægte, synlig tekst). For 2227 (D5-W) er der INGEN synlig prisstreng i det gemte
   snapshot — kun D5 er default-valgt variant på siden — så jeg brugte det indlejrede
   JSON-felt `"price":8500000`, som er ordret, men usædvanligt som "ordlyd". Se ovenfor
   under usikkerheder — orkestratoren bør vurdere om dette er en acceptabel kildeform.
3. **2227's `speed`-felt fik en bedre kilde end det oprindelige citat pegede på.**
   Caveatens citat ("Cruises at up to 5 m/s") er generel D5-serie-markedsføring. PR-teksten
   (linje 464) har en D5-W-specifik sætning ("Advanced wheel-leg hybrid locomotion reaches
   5 m/s...") som stemmer overens med D5-W's egne 30°/25cm-tal. Brugt i stedet — ikke en
   fejlretning af noget forkert, men en mere præcis kilde til samme påstand.
4. **`har_citat`-regexen i briefets grundmåling gav falske positiver.** Den flaggede
   `price`-rækkerne som "med citat", fordi `"D5-W"` (4 tegn i anførselstegn) matcher
   mønsteret — selvom det ikke er en producent-sætning. 25/6-fordelingen holdt tal-mæssigt,
   men klassifikationen af HVILKE rækker der reelt havde brugbar prosa, var ikke perfekt.

## Punkter i briefet, jeg ikke nåede
Ingen. Alle 31 rækker er udfyldt, begge robotter committet hver for sig, tørløb kørt
før hver skrivning, og alle tre acceptkriterier er efterprøvet med kommandoer ovenfor.
