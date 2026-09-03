# FUND — spor/f2pudu: `caveat_wording` for Pudu Robotics' 31 rækker

## Skills — valgt og fravalgt
Kaldt: `spor` (Skill-værktøjet virkede fra worktreen — intet disk-fallback nødvendigt).
Fravalgt: `robotdata` (opgaven ændrer ikke robot-skemaet eller tal, kun tekstcitater —
reglerne om 33-felt-skema er ikke i spil), `supabase` (skrivevejen er `db/f2-skriv.mjs`,
ikke rå MCP-skrivning; MCP `execute_sql` brugt kun til LÆSNING/grundmåling, hvilket
briefet ikke forbød), `fejljagt` (intet tal opførte sig uventet).

## Grundmåling — genmålt, matcher briefet præcist
Briefets SQL (kørt via `mcp__supabase__execute_sql`): **31** rækker, **25** med citat,
**6** uden. Kontrollinje uden producent-filter: **267**. `caveat`-optælling for Pudu
før arbejdet: **31**. Ingen afvigelse fra briefets tal.

## Valgt løsning / fravalgt
Valgt: udskil citatet i `caveat`, verificér tegn-for-tegn mod
`media/_kilder/raa-kand1a-2026-08-24/pudu-d5-{storeside,officielside,prnewswire}-2026-08-24.{txt,html}`
(allerede i worktreen, intet nyt hentet). Fravalgt: kopiere caveatets citat blindt uden
kildetjek — så ville 13 af 25 være forkerte (se fund), og JSON-fragmentet for `2227 price`
være blevet stående som om det var producentordlyd (se rettelsen nedenfor).

## Resultatet — hvad der nu står i databasen (Pudu Robotics, 31 rækker)

**RETTET af orkestratoren efter første aflevering** (2026-09-03): `caveat_wording` for
`(2227, 'price')` var sat til `"price":8500000` — et JSON-fragment fra sidens kildekode,
ikke en streng en besøgende kan se på siden, og tallet stod i cent. Nulstillet til NULL
og flyttet til "Rækker uden kildeordlyd" nedenfor. Mekanismen: `db/f2-skriv.mjs` med
`"saet": {"caveat_wording": null}`, tørløb kørt først, se `fund/skriv-2227-price-ret.json`.

| Før (spor start) | Efter (nu, inkl. rettelsen) |
|---|---|
| 31 rækker uden `caveat_wording` | **30** udfyldt med ægte kildeordlyd, **1** dokumenteret umulig (`2227`, `price`) |
| 25 rækker med citat i `caveat`, tomt `caveat_wording` | 24 udfyldt med kildens egen ordlyd; 1 (`2227` `price`) viste sig IKKE at have producent-synlig ordlyd — sat til NULL |
| 6 rækker uden citat, tomt `caveat_wording` | 6 udfyldt — kildeordlyd fandtes for alle 6 (delt med søsterfelt/variant, se nedenfor) |
| `caveat`-brødtekst | **uændret** (31 før, 31 efter — ingen brødtekst rørt) |

## Acceptkriterier (opdateret efter rettelsen)
**Punkt 1 — høj:** briefets SQL giver nu **1** (ikke 0) — det RIGTIGE tal, ikke en
regression: `(2227, price)` er bevidst ført tilbage til NULL. 31 = 30 udfyldte + 1
dokumenteret umulig, 0 uforklarede. Kontrafaktisk: 19 ægte ville give 12.
**Rettelsens eget kriterium — høj:** `select caveat_wording from field_entries where
robot_id=2227 and field_name='price';` giver **NULL** (målt efter skrivning, se ovenfor).
Kontrafaktisk: forkert nøgle ville ramme et andet felt eller ikke give NULL.
**Punkt 2 — høj:** `caveat`-optælling for Pudu **31 før / 31 efter**, uændret, også efter
rettelsen. Kontrafaktisk: rørt brødtekst ville afvige tallet fra 31.
**Punkt 3 — høj:** `change_log` for `changed_by='spor/f2pudu'`: **32** rækker (31+1),
**2** robot-id'er, **0** uden for `field_entries`. Talkolonner kan strukturelt ikke
rammes (hvidlisten i `db/f2-skriv.mjs`). Kontrafaktisk: en nøglefejl ville give et 3.
robot-id eller en anden tabel.

## Selv-efterprøvning
**31 af 31** rækker efterprøvet mod råkilden i første omgang. **13 fejl** fundet i
*caveatets egne* citater (normaliserede tegn, se "Nye fælder") og rettet til kildens
faktiske tegn. **1 fejl til** fundet af orkestratoren efter aflevering (`2227 price` —
JSON-fragment, ikke producentordlyd) og rettet. Samlet **14 afvigelser** fundet og
rettet på tværs af begge omgange, **32 rækker skrevet i alt**.

---

## Rækker uden kildeordlyd
**1 række** (tilføjet ved orkestratorens rettelse). De 6 oprindelige "uden citat"-rækker
fik alle en ægte kildeordlyd — ingen af dem er opdigtet:

| Robot | Felt | Nuværende `caveat` | Søgt i (filer) | Søgt efter | Resultat |
|---|---|---|---|---|---|
| **2227 D5-W** | **price** | "From the webstore's Shopify product data (variant \"D5-W\": price 8500000, i.e. USD 85,000 in cent units). USD 5,000 more expensive than D5." | Alle seks filer i `media/_kilder/raa-kand1a-2026-08-24/` (`pudu-d5-storeside-2026-08-24.{txt,html}`, `pudu-d5-officielside-2026-08-24.{txt,html}`, `pudu-d5-prnewswire-2026-08-24.{txt,html}`) | En renderet, producent-synlig prisstreng for D5-W (fx "$85,000" eller "$85,000.00"), parallel til D5's "$80,000.00" | **Findes ikke.** `"8500000"` findes kun som JSON-nøgleværdi (`"price":8500000`) i storeside-filerne — maskinlæsbar markup, ikke synlig tekst, og tallet er i cent. `caveat_wording` sat til **NULL** |

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
2. **`price`-rækkernes eget "citat" er slet ikke producent-prosa — og JSON kan se ud som
   en kilde uden at være én.** Caveatens citat `variant "D5": price 8000000` er en
   parafrase af Shopify-JSON, ikke noget kilden nogensinde skriver i den form. For 2226
   fandt jeg den viste pris "$80,000.00" (ægte, synlig tekst) — den holder. For 2227
   (D5-W) er der INGEN synlig prisstreng i det gemte snapshot (kun D5 er default-valgt
   variant på siden); jeg brugte oprindeligt det indlejrede JSON-felt `"price":8500000`,
   fordi det er byte-ordret til stede i kildefilen. **Orkestratoren rettede dette:**
   ordret tilstedeværelse er ikke det samme som producentens ordlyd — JSON-markup er
   maskinlæsbar kildekode, ikke noget en besøgende (eller en efterprøver uden adgang til
   sidens kilde) kan se, og `8500000` er cent, ikke dollars. Samme situation mødte
   `spor/f2weilan` samtidig for to WEILAN-priser, og det spor meldte dem korrekt som
   udokumenterede fra starten. `caveat_wording` for `(2227, price)` er nu NULL, se
   "Rækker uden kildeordlyd". **Læren:** "findes ordret i kildefilen" er en nødvendig
   betingelse for kildeordlyd, ikke en tilstrækkelig — teksten skal også være noget
   producenten reelt VISER, ikke kun noget der ligger i sidens opmærkning.
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
Ingen. 30 rækker er udfyldt med ægte kildeordlyd, 1 (`2227` `price`) er dokumenteret
umulig efter orkestratorens rettelse, begge robotter og rettelsen er committet hver for
sig, tørløb kørt før hver skrivning, og alle acceptkriterier er efterprøvet med kommandoer
ovenfor.
