# OPSKRIFT — kinesisk ordlyd renset for dansk (fase 2, de 62 kinesiske robotter)

Skrevet af spor/f2-cjk efter arbejdet med `robot_id` 2186 og 2258. Målrettet
et senere spor, der skal gøre det samme for de resterende kinesiske
producenter — læsbar UDEN at åbne `fund/BRIEF-f2-cjk.md`.

## Problemet i én sætning

`caveat_wording` (og `robots.notes_wording` / `applications.quote_wording`)
skal være **kildens tegn og kun kildens tegn**. I praksis var de fleste
allerede udfyldte felter en sammenklistret streng: citat + dansk oversættelse
+ dansk kommentar, i samme kolonne. De to kan ikke være sande samtidig.

## De fire kasser, med et rigtigt eksempel hver

**(A) Ordlyd findes, forurenet af dansk.** Det almindelige tilfælde — 32 af
mine 35. Eksempel (`2186/weight`), FØR:

```
caveat_wording:  "重量 82kg（含电池）" (vægt 82kg, inkl. batteri) - inkl. batteri.
```

EFTER:

```
caveat_wording:  重量 82kg（含电池）
caveat:          Manufacturer's figure includes the battery.
```

**(B) Ordlyd findes og er allerede ren.** **0 af mine 35** — se "Det, der
overraskede mig" nedenfor. Beregn den ikke ud fra måleredskabets output;
læs teksten.

**(C) Ingen ordlyd — men kilden findes.** 2 af mine 35. Den ene
(`2258/ros2`) havde citatet liggende INDE i den danske prosa allerede,
i anførselstegn — bare træk det ud. Den anden (`2186/height`) havde INGEN
citat i prosaen overhovedet, kun et rent dansk tal — men samme kildeside
(allerede citeret for et andet felt) viste sig at have en anden tabelrække
(`俯卧尺寸 1130mm*755mm*320mm`) der dækkede præcis den påstand. Kasse C
dækker altså to varianter: "citat findes i prosaen" og "citat findes i
kilden, men blev aldrig hentet". Begge kræver at du selv går tilbage til
råkilden — stol ikke på, at fraværet af et citat betyder fraværet af en
kilde.

**(D) Kan ikke føres tilbage til nogen kilde.** 1 af mine 35
(`2186/ip_rating`): caveaten hævdede en "IP67-påstand i en pressemeddelelse,
der ikke kunne hentes" — søgt i alle tre kildefiler for den producent,
intet fundet.

**OPDATERET af JPK's beslutning L87 (2. sep 2026), EFTER at dette spor
oprindeligt afleverede kasse D som "rørt ikke, sat på en liste":**
*"Kildens ord ordret, vores prosa KUN når hver påstand kan efterprøves i et
snapshot — og det, der ikke kan, SLETTES."* **Kasse D betyder derfor ikke
længere "lad stå urørt og spørg JPK" — den betyder "sæt `caveat` (og
`caveat_wording`, hvis den findes) til `null`, og skriv hvorfor i
`change_reason`."** `value_text` og de øvrige talfelter røres stadig ikke —
kun selve den ubelagte påstand forsvinder. **Én ekstra kolonne kan følge
med, mekanisk, ikke som et valg:** har rækken en `caveat_class`, kræver
constraint'en `feltposter_advarsel_klasse_kraever_advarsel`
(`db/skema.sql`), at den OGSÅ sættes til `null` — en advarsels-klasse uden
en advarsel er ikke tilladt. Skriv altid `change_reason` som "L87: ..." så
en senere læser kan se, at sletningen er en besluttet regel og ikke et gæt.

## Reglen for `caveat_wording`, sagt så den ikke kan misforstås

Kun kildens tegn: ingen oversættelse, ingen parentes med dansk, ingen
bemærkning, ingen omsluttende anførselstegn ud over dem, der markerer FLERE
adskilte fragmenter fra kilden. **To faldgruber, fundet ved at forsøge at
verificere hvert fragment mod selve HTML-filen:**

1. **Kildens tabeller lægger etiket og værdi i to SEPARATE celler.** En
   rekonstruktion som `重量 82kg（含电池）` er ikke bogstaveligt
   sammenhængende tekst i kilden — den er etiket-celle + mellemrum +
   værdi-celle. Det er en accepteret konvention (den forrige indsamler
   gjorde det samme), MEN mellemrum omkring skråstreger i etiketter
   ("数量 / 检测距离", ikke "数量/检测距离") er en del af kildens tegn og
   skal bevares præcist — det var ikke gjort konsekvent i den eksisterende
   DB-tekst, og det kostede en runde at opdage.
2. **"..." markerer en bevidst udeladelse** i et længere citat — accepteret
   citationskonvention, men "..." findes naturligvis ikke selv i kilden, så
   verificér delene FØR og EFTER hver "..." hver for sig, ikke hele strengen
   under ét.

## Hvor den danske oversættelse flytter hen, og hvorfor

Til den engelske `caveat`-prosa. Den forsvinder ikke — den bliver til
"vores gengivelse, ikke kildens ord", hvilket er præcis hvad `caveat`
(modsat `caveat_wording`) altid har været. Bland dem aldrig: en dansk sætning
i `caveat_wording` er lige så forkert som en oversættelse, der udgiver sig
for at være kildens egne ord.

## Sådan læses en kinesisk etiket uden at gætte

**`＜60 cm`-fejlen (projektets stående advarsel):** var undvigelsesafstand
på kinesisk, landede som forhindringshøjde på engelsk — fordi nogen læste
den ENGELSKE udgave af siden i stedet for den kinesiske. Konkret metode,
brugt på alle 35 her:

1. Find etiketten i selve HTML'en (`grep`/`indexOf` på det kinesiske ord),
   ikke i en engelsk parallelside, selv hvis en findes.
2. Slå betydningen op ord for ord, hvis du er usikker — `越障` er
   "forhindrings-/hindrings-krydsning", ikke "hældning". Et eksempel herfra:
   `最大越障角度` er "maksimal forhindringskrydsningsvinkel", IKKE en
   simpel hældningsangivelse — selvom feltet det står i hedder `slope`.
3. Er du STADIG usikker: skriv usikkerheden i rapporten. Gæt aldrig den
   nærmeste engelske betydning.

## UTF-8-kontrollen efter skrivning

Ikke nok at sammenligne visuelt — en forvansket streng ser stadig ud som en
streng. Hent hver skrevet kolonne tilbage og sammenlign med `===` (JSON
string-lighed er nok, ingen normalisering) mod PRÆCIS det, du sendte —
genbrug samme datastruktur du skrev fra (importér den, kopiér den ikke),
ellers kan de to kopier skride fra hinanden uden at du opdager det.

## Det, der overraskede mig

**To karaktertegn-korruptioner i den EKSISTERENDE database-tekst** (ikke i
mit eget arbejde) — begge fundet, fordi jeg verificerede citater mod
kildefilen i stedet for at stole på den tekst, der allerede lå der:

- `灵猫・Cyvet`: kildens skilletegn er `・` (U+30FB, katakana-midterprik).
  Den eksisterende `robots.notes_wording[1]` havde `•` (U+2022, almindelig
  bullet) — et andet Unicode-tegn, der ser identisk ud i de fleste
  skrifttyper.
- Kildens afsluttende `。` (U+3002, fuldbredde kinesisk punktum) var blevet
  til et ASCII-punktum `.` (U+2E) i `robots.notes_wording[2]`.

Ingen af dem ville være fanget af et visuelt tjek eller af
måleredskabets dansk-detektor — kun ved at sammenligne kodepunkt for
kodepunkt mod selve HTML-filen. **Konklusionen: en tidligere agents CJK-
citat er ikke automatisk korrekt, selvom det ser rigtigt ud og allerede
ligger i databasen — verificér det ALLIGEVEL, som om det var dit eget.**

**Den anden overraskelse: kasse B var 0, ikke det forventede "de fleste".**
Enhver `caveat_wording`, der SER ud til at mangle dansk (fordi den ikke har
æøå og ikke rammer et stopord), er ikke nødvendigvis ren — den kan bare
være usynlig for detektoren. Tre af mine 32 "kasse A"-tilfælde
(`payload_walking`, `temperature_max`, `data_ports` på 2186) var netop
dette: ægte danskforurenede, men usynlige for både æøå-scan og en almindelig
stopordsliste, fordi de danske ord i dem ("arbejdslast", "ekstern
kommunikation", "separat") hverken har æøå eller er på en typisk
funktionsordsliste. **Læs alle 35, mål ikke kun.**

**Den tredje: engelske stopord-kollisioner i selve måleredskabet.** Efter
selve skrivningen viste dansk-detektoren 5 falske positiver, fordi
stopordslisten indeholdt "under", "over", "men" og "dog" — alle fire også
gyldige ENGELSKE ord, og "dog" er direkte farligt på en side om
robothunde. Tjek din egen stopordsliste mod ÆGTE engelsk prosa, ikke kun
mod dansk, før du stoler på et 0-tal fra den.
