# BRIEF, FÆLLES DEL — fase 2's udrulning

Denne fil er ens for alle fire udrulningsspor. **Din egen fil,
`fund/BRIEF-<dit-spor>.md`, siger hvilke robotter du ejer og hvilke tal du skal
ramme.** Læs begge.

**Model: Sonnet. Egen worktree. Du SKRIVER i den levende Supabase — men kun i
dine egne robotters tekstkolonner.**

Rør aldrig `c:\Praktik\websites\udstilling` (hovedrepoet — to sessioner arbejder
i det), `c:\Praktik\websites\salg` eller `c:\Praktik\website`.

## Regel 0 — skill-vurdering, skriv den

Skriv **hvilken skill du valgte og hvilke du gik forbi, med begrundelse.**
`robotdata` bærer G1, kilde- og ordlydsreglen, og er formentlig dit valg.
Overvej også `supabase` og `fejljagt`. *"Ingen skill passer her"* er gyldigt,
men skal skrives. Lykkes et skill-kald ikke fra worktreen, så læs `SKILL.md` fra
disk og **skriv i rapporten at du gjorde det.**

## Læs først — opskrifterne er skrevet af to spor, der allerede har gjort det

- **`fund/OPSKRIFT-fase2.md`** — engelsk kilde: de tre kasser, grænsen mellem
  `caveat` og `caveat_wording`, multi-citat-reglen, PostgREST-fælderne.
- **`fund/OPSKRIFT-fase2-cjk.md`** — kinesisk kilde: hvordan en ordret CJK-streng
  skilles fra en dansk glose, hvordan en kinesisk etiket læses uden at gætte,
  UTF-8-kontrollen.
- `.claude/skills/robotdata/SKILL.md`, især **G1**.
- `CLAUDE.md`, især **værktøjsafsnittet** (Node-fælden nedenfor står der).

**Begge opskrifter ligger i din worktree.** Din egen fil siger hvilken der er
din primære — men læs begge: den anden bærer fælder, der også rammer dig.

**Opskrifterne er skrevet af de FØRSTE spor, ikke de sidste.** Finder du noget,
de tager fejl af, så skriv det i din rapport. Det er leverance, ikke ulydighed.

---

## L87 — tekstreglen, besluttet af JPK 2. sep 2026, EFTER opskrifterne blev skrevet

Dette er nyt siden pilotrunden, og det ændrer, hvad der sker med kasse C/D.

**Ordlydsfelterne** (`caveat_wording`, `quote_wording`, `notes_wording`,
`note_wording`) bærer **kildens ord ordret** — efterprøvet mod en råkildefil.

**Vores egen prosa** (`caveat`, `note`, `notes`) må stå, men **kun når hver
påstand i den kan efterprøves i en råkildefil.** Kan en påstand ikke føres
tilbage til en kilde, **slettes den — den oversættes ikke.** Det er hård
begrænsning 2 gjort til fase 2's arbejdsregel.

### Hvad "slettes" betyder præcist — HELE trioen, ikke prosaen alene

Databasen har tre CHECK-betingelser, og validatoren har den samme regel som
**R21** (`tools/validate.mjs:326`). R21's fejltekst bærer begrundelsen ordret:

> *"advarsel_ordlyd står uden advarsel — ordlyden hører til et forbehold,
> læseren ser, og uden det forbehold er der intet, den er en ordlyd til"*

Vi citerer producenten for at underbygge **vores** forbehold, ikke for at
citere. Falder forbeholdet, er citatet forældreløst.

**Derfor: sletter du en advarsel under L87, går `caveat`, `caveat_wording` og
`caveat_class` sammen — alle tre til null i samme PATCH.** Prøver du kun
prosaen, afviser databasen skrivningen med
`feltposter_advarsel_klasse_kraever_advarsel` eller
`feltposter_advarsel_ordlyd_kraever_advarsel`. Det kostede pilotrunden en runde.

**Feltets VÆRDI røres aldrig.** `value_number`, `value_text`, `unit`, `state`
står uændret — det er kun forbeholdet om værdien, der falder.

**Skriv i `change_reason`, at sletningen sker under L87**, og skriv i rapporten,
at den skete efter en besluttet regel og ikke på dit eget initiativ. Det er
forskellen mellem en beslutning og et gæt.

**Er du i tvivl, om en påstand har belæg: så har den det ikke — men SLET IKKE.**
Skriv den på listen til JPK og lad rækken stå urørt. Tvivl er hans, ikke din.

---

## Kolonnerne du må røre, og ikke én mere

`caveat` · `caveat_wording` · `caveat_class` (kun til null under L87) ·
`note` · `notes` · `notes_wording` · `value_text` · `collected_by` ·
`change_reason`.

**Alt andet er forbudt.** Rører du `value_number`, `minimum`, `maximum`, `unit`,
`state`, `form`, `operator`, `source`, `retrieved_at` eller en billedsti, er
sporet forkert, og det bliver målt.

### `value_text` er ny i denne runde — læs hvorfor

Målt 2. sep: **230 `value_text`-værdier i kataloget, 105 danske.** Pilotrunden
lod dem stå, fordi de lå uden for dens kolonneliste. De skal med nu, fordi L87
siger, at der ikke må stå dansk i databasen.

**Men `value_text` er feltets SVAR, ikke en bemærkning om svaret** — den vises
som robottens data. Derfor:

- Oversæt **kun betydningen**, aldrig indholdet. `"grundlæggende"` →
  `"basic"`. Ikke `"basic (entry-level)"`.
- Er værdien producentens eget ord, så brug producentens engelske ord, hvis
  kilden har et — ellers en ordret oversættelse, og skriv i `change_reason`, at
  det er vores oversættelse.
- **Ændrer du betydningen, har du ændret et datapunkt**, og det er samme
  alvorlighed som at røre et tal.

---

## Rækkefølgen — en skrive-grænse, ikke en commit-grænse

1. **Grundmåling.** Din egen fils kommandoer, før du ændrer noget. Commit.
2. **Klassificér** hver advarsel i kasser efter din primære opskrift. Commit.
3. **Efterprøv** hvert citat mod råkilden. Nedgradér, hvis det ikke findes. Commit.
4. **Skriv teksterne**, kør tørløb. Commit.
5. **Skriv til databasen**, mål efter. Commit.
6. **Rapport + eventuelle tilføjelser til opskriften.** Commit.

**Skriv ALDRIG alt i ét Write-kald.** Målt tre gange i dette projekt: en agent,
der gør det, får punkt 2's commit til at bære punkt 5's uefterprøvede kode.
Et spor, der dør i punkt 5, skal kunne genoptages fra punkt 4's commit.

---

## PostgREST — de to fælder, der koster en runde hver

1. **`Prefer: return=representation` er obligatorisk.** Uden den svarer
   PostgREST **204 uden krop**, og du kan ikke skelne *"1 række opdateret"* fra
   *"0 rækker matchede"* (forkert `robot_id`/`field_name` i URL'en — en tavs
   fejl).
2. **Præcis 1 række pr. PATCH.** Tæl svarets længde og afbryd hele kørslen ved
   0 eller >1. Kopiér `patchEen()` fra `db/f2-pilot-skriv.mjs` eller
   `db/f2-cjk-skriv.mjs` — begge ligger i din worktree.

Primærnøgler: `field_entries` (robot_id, field_name) · `applications` (robot_id)
· `images` (robot_id) · `robots` (id).

**Tørløb er standard; `--skriv` skal være eksplicit.** Kør tørløbet og læs det
igennem — ikke bare tæl linjerne.

---

## Efterprøvningen, du selv skal levere

**(a) Talkolonnerne må ikke have rørt sig.** Hent alle `field_entries`-rækker for
dine robotter FØR første skriv, gem som JSON i din worktree, hent igen bagefter,
diff alle kolonner undtagen dem, du har lov at røre. **Færdig når diffen er tom.**
Er den ikke, er det et **fund**, ikke en oprydningsopgave.

**(b) `change_log`.** Tæl rækker med dit grennavn før og efter. Antallet skal
svare til dine skrivninger, og **0 må ligge uden for dine egne robotter.**
Skriv begge tal.

**(c) Læs alle dine skrevne tekster igennem selv til sidst.** Dansk-detektorens
0-tal er **nødvendigt, ikke tilstrækkeligt** — en dansk sætning uden æøå og uden
et af ordlistens ord slipper igennem. Skriv *"N læst, M fejl fundet"*. Nul fejl
uden en tælling er ikke en efterprøvning.

**(d) Advarsel om detektorens ordliste:** `spor/f2-cjk` fandt, at den indeholdt
`under`, `over`, `men` og `dog` — alle fire også engelske ord, og `dog` er
direkte farligt på en side om robothunde. **Tjek din ordliste mod ægte engelsk
prosa, før du stoler på et 0-tal fra den.**

---

## Miljøfælder — hver har kostet mindst én runde

- `node` er `/c/Program Files/nodejs/node.exe`. Git Bash har den ikke på PATH.
- **NODE-FÆLDE, GENEREL FOR MASKINEN:** et ægte `fetch()` efterfulgt af
  `process.exit()` crasher node v24.13.0 med libuv-assertionen
  `!(handle->flags & UV_HANDLE_CLOSING)` og **exit 127** — også når kaldet
  lykkedes. **Brug `process.exitCode` og lad løkken tømme sig.**
  `process.exit()` FØR første `fetch` er ufarligt. Reproduceret med
  kontrolgruppe; står i CLAUDE.md's værktøjsafsnit.
- **`/tmp` ligger ikke samme sted for node og Git Bash.** Brug en sti i projektet.
- Commit-beskeder med backticks, `$` eller anførselstegn: `git commit -F <fil>`.
- `sed -i`, der ikke matcher, gør **intet — tavst, med exit 0**. Brug Edit.
- Lange markdown-filer knækker i bash-heredocs. Brug Write.
- **UTF-8 uden BOM.** `Set-Content -Encoding utf8` ødelægger tankestreger.
- `.env`, `assets/fotos/fabrikant/` **og `media/_kilder/`** er kopieret ind for
  dig denne gang. Efterprøv: `ls -la .env` · `ls assets/fotos/fabrikant | wc -l`
  (**610**) · `ls -d media/_kilder/*/ | wc -l` (**19**).
  *(I pilotrunden manglede `media/_kilder/`, og begge spor brugte en runde på
  det. Det er rettet — men efterprøv alligevel.)*
- **Skriv aldrig nøglen fra `.env` i en fil, en commit eller din rapport.**
- Kør IKKE `tests/koer.mjs`. Dit spor rører ingen kode, og en samtidig kørsel
  kolliderer med den anden session. Er du i tvivl, så spørg i rapporten.

## Skriv en kontrol før hver måling

**Skriv, hvad tallet skal være, hvis alt er som forventet — FØR du læser det.**

```
echo -n "caveat i alt (forventer N): "; <din kommando>
```

Et forkert mønster giver typisk et fuldstændig plausibelt tal, så der er intet
at undre sig over. Kontrollen er det eneste, der gør fejlen synlig med det samme.

## Briefets fakta er påstande

Alle tal i din egen fil er **orkestratorens målinger, ikke sandheder.** Afviger
noget, du måler, så **rapportér afvigelsen — det er leverance, ikke ulydighed.**
Fire agenter har rettet mine fakta i dag, alle fire korrekt. Det er den billigste
kvalitetskontrol, vi har.

## Rapporten — `fund/FUND-<dit-spor>.md`, højst 60 linjer

1. Valgt løsning, fravalgt alternativ — én linje hver.
2. **Konfidens pr. punkt.** Høj = målt med en kommando, orkestratoren kan
   genkøre og få samme tal, **plus én linje om hvad tallet ville have været,
   hvis arbejdet var forkert.** Middel = efterprøvet indirekte. Lav = ikke
   efterprøvet. **Høj uden genkørbar kommando nedskrives automatisk til lav.**
3. Usikkerheder mødt undervejs.
4. Målingerne som **tal**, ikke prosa.

Tabeller (klassificering, L87-listen) må ligge i samme fil under de 60 linjer.

**Uden for loftet, obligatorisk:**

- **"Nye fælder og opdagelser."** Er der intet, skal der stå at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.
- **"Til opskriften."** Hvad de to opskrifter bør lære af dit spor.
