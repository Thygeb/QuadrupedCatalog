# BRIEF — spor/f2-pilot: opskriften for fase 2, målt på Addverb

**Model: Sonnet. Egen worktree. Du SKRIVER i den levende Supabase — men kun i to robotters
tekstkolonner.**

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2pilot` (gren `spor/f2-pilot`).
Rør aldrig `c:\Praktik\websites\salg` eller `c:\Praktik\website` — andre projekter.
Rør ikke hovedrepoet `c:\Praktik\websites\udstilling`.

## Regel 0 — skill-vurdering, skriv den

Skriv **hvilken skill du valgte og hvilke du gik forbi, med begrundelse.**
`robotdata` er den, jeg forventer du vælger — den bærer G1, indsamlingsreglen, og den
er hele grunden til at dette spor har et snapshot-krav. Overvej også `supabase` og
`fejljagt`. "Ingen skill passer her" er gyldigt, men skal skrives.
Lykkes et skill-kald ikke fra worktreen, så læs `SKILL.md` fra disk og **skriv i
rapporten at du gjorde det.**

## Læs først

`.claude/skills/robotdata/SKILL.md` — **især afsnit G1.** Derefter
`CLAUDE.md` · `PLAN.md` §0 og korrektionen "fase 2's verbum" · `db/LAESMIG.md`.

## Hvorfor du findes

Fase 2 skal gennem 77 robotter fordelt på ~23 senere spor. **Du kører de to første og
skriver opskriften, de andre følger.** Din vigtigste leverance er derfor ikke de 17
felter — det er `fund/OPSKRIFT-fase2.md`. Bliver opskriften utydelig, arver 23 spor
utydeligheden.

Du har fået Addverb, fordi kilden er **engelsk**: to robotter, 17 advarsler, alle uden
udskilt ordlyd. Et søsterspor (`spor/f2-cjk`) kører samtidig på det kinesiske tilfælde.
I rører ikke samme robotrække og ikke samme fil.

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

Opret `fund/maal-f2.mjs` med **præcis** dette indhold — jeg har kørt det mod den
levende database, og tallene nedenfor er dets faktiske output i dag:

```js
/* Maaleredskab for et fase 2-spor. Koeres FOER og EFTER arbejdet.
   Brug:  node fund/maal-f2.mjs <robot_id[,robot_id...]> */
import fs from 'node:fs';
for (const l of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) process.env[m[1]] = m[2].trim();
}
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!U || !K) { console.error('mangler SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY i .env'); process.exit(1); }
const H = { apikey: K, Authorization: `Bearer ${K}` };
const q = async (p) => { const s = await fetch(`${U}/rest/v1/${p}`, { headers: H });
  if (!s.ok) { console.error('HTTP', s.status, await s.text()); process.exit(1); } return s.json(); };
const DANSKE_ORD = /\b(producenten|producentens|oplyst|oplyser|ikke|samme|kilde|kilden|kilder|angiver|staar|står|vaerdi|værdi|tallet|siden|derfor|hverken|hvorfor|mens|uden|indeholder|noteret|maalt|målt|skemaet|feltet|naermeste|nærmeste)\b/i;
const ae = (s) => /[æøåÆØÅ]/.test(s || '');
const dansk = (s) => ae(s) || DANSKE_ORD.test(s || '');
const tael = (a, f) => a.filter(f).length;
const ids = process.argv[2];
if (!ids) { console.error('brug: node fund/maal-f2.mjs <robot_id[,robot_id]>'); process.exit(1); }
const i = `robot_id=in.(${ids})`;
const cav  = await q(`field_entries?${i}&caveat=not.is.null&select=robot_id,field_name,caveat,caveat_wording`);
const app  = await q(`applications?${i}&select=robot_id,note,note_wording,quote,quote_wording`);
const img  = await q(`images?${i}&select=robot_id,note`);
const rob  = await q(`robots?id=in.(${ids})&select=id,slug,notes,notes_wording`);
const ordl = cav.filter(r => r.caveat_wording != null);
const notesEl  = rob.flatMap(r => Array.isArray(r.notes) ? r.notes : []);
const notesOrd = rob.flatMap(r => Array.isArray(r.notes_wording) ? r.notes_wording : []);
const linje = (navn, n, d) => console.log(navn.padEnd(28), String(n).padStart(4), '| dansk:', String(d).padStart(4));
console.log('robotter:', rob.map(r => r.slug).join(', '));
linje('caveat', cav.length, tael(cav, r => dansk(r.caveat)));
linje('  heraf uden ordlyd', tael(cav, r => r.caveat_wording == null), '-');
linje('caveat_wording', ordl.length, tael(ordl, r => dansk(r.caveat_wording)));
linje('applications.note', tael(app, r => r.note != null), tael(app, r => r.note != null && dansk(r.note)));
linje('images.note', tael(img, r => r.note != null), tael(img, r => r.note != null && dansk(r.note)));
linje('robots.notes (elementer)', notesEl.length, tael(notesEl, dansk));
linje('robots.notes_wording (el.)', notesOrd.length, tael(notesOrd, dansk));
```

`node fund/maal-f2.mjs 2182,2183` **giver i dag præcis dette** — kør det og bekræft:

```
robotter: addverb-trakr-20, addverb-trakr-5
caveat                         17 | dansk:   13
  heraf uden ordlyd            17 | dansk:    -
caveat_wording                  0 | dansk:    0
applications.note               2 | dansk:    2
images.note                     2 | dansk:    2
robots.notes (elementer)        0 | dansk:    0
robots.notes_wording (el.)      0 | dansk:    0
```

**Får du andre tal, så STOP og rapportér.** Det betyder enten, at et andet spor har
skrevet i dine rækker, eller at redskabet ikke måler det, jeg tror.

*Redskabet duplikerer med vilje logik fra `db/fase2-tjek.mjs`, som `spor/f2-maal` bygger
samtidig. Det er din engangsmåling, den anden er det varige instrument. Fjern ikke
duplikeringen — den er bevidst, så I to spor ikke venter på hinanden.*

## Dine robotter — og INGEN andre

`robot_id` **2182** (`addverb-trakr-20`) og **2183** (`addverb-trakr-5`).
Ethvert skriv mod et andet `robot_id` er en fejl i dit spor.

## Filejerskab

Du ejer: `fund/maal-f2.mjs` · `db/f2-pilot-skriv.mjs` · `fund/OPSKRIFT-fase2.md` ·
`fund/FUND-f2pilot.md` · `media/_kilder/raa-kand6-2026-08-25/MANIFEST.tsv` (ny fil).

Du rører **ikke**: `db/fase2-tjek.mjs`, `db/f2-skriv.mjs`, `tests/dele/69-*` (ejes af
`spor/f2-maal`) · `db/f2-cjk-skriv.mjs`, `fund/OPSKRIFT-fase2-cjk.md` (ejes af
`spor/f2-cjk`) · `assets/`, `tools/`, `data/`, `db/tjek.mjs`, `db/ordbog.mjs`.

---

## Punkt 1 — Læs alle 17 advarsler, og klassificér dem, før du ændrer noget

Hent dem og læs dem én for én. Hver advarsel falder i præcis én af tre kasser:

**(A) Citatet står inde i den danske prosa.** Det almindelige tilfælde. Eksempel,
`addverb-trakr-5` / `weight`, ordret som det står i dag:

> `"WEIGHT (INCL BATTERY): 18 KG" i den strukturerede specifikationstabel for Trakr 5-fanen.`

Skal blive til to felter:

```
caveat          →  From the structured specification table on the Trakr 5 tab.
caveat_wording  →  WEIGHT (INCL BATTERY): 18 KG
```

`caveat_wording` er **kildens ord og kun kildens ord** — ingen dansk glose, ingen
oversættelse, ingen anførselstegn omkring, ingen forklaring efter.

**(B) Advarslen er vores egen analyse uden noget citat.** Findes der intet i teksten,
som producenten har skrevet, forbliver `caveat_wording` **null**, og `caveat` skrives
om til engelsk. Eksempel på formen (fra en anden robot, til illustration): *"Vægten er
UDEN batteri — alle andre Unitree-modeller oplyser med."* Den sætning står ingen steder
hos nogen producent.

**(C) Advarslen påstår noget, du ikke kan føre tilbage til nogen kilde.** Hverken til
et citat i teksten eller til en råkildefil. **Ret den ikke, og gæt ikke.** Skriv den på
listen i punkt 5 og lad rækken stå urørt.

**Færdig når** du har skrevet en tabel i `fund/FUND-f2pilot.md` med én række pr. af de
17: `robot_id`, `field_name`, kasse A/B/C. **Antallene i de tre kasser skal summe til 17.**
Jeg har ikke forudsagt fordelingen — den måler du, og jeg vil se den.

Commit punkt 1, før du skriver punkt 2's kode.

## Punkt 2 — Efterprøv hvert citat mod råkilden, og luk MANIFEST-hullet

Addverbs råkilder findes allerede, seks filer:

```
media/_kilder/raa-kand6-2026-08-25/addverb-ai-blog-trakr-2026-08-25.html  (+ -text.txt)
media/_kilder/raa-kand6-2026-08-25/addverb-ai-trakr-2026-08-25.html       (+ -text.txt)
media/_kilder/raa-kand6-2026-08-25/addverb-com-press-trakr2-2026-08-25.html (+ -text.txt)
```

**Men mappen har intet MANIFEST.tsv.** Målt i dag: 5 af 18 råkildemapper mangler det
(`raa-genisom`, `raa-kand4`, `raa-kand6`, `raa-kand7`, `raa-pdf`). Din er én af dem, og
uden proveniens er et citat ikke belagt.

To ting:

**(a)** For hvert kasse-A-citat: `grep` efter den ordrette streng i råfilerne og skriv,
om den findes. **Findes den ikke, er advarslen kasse C**, uanset hvor rigtig den ser ud.
Skriv antal citater søgt og antal fundet.

**(b)** Opret `media/_kilder/raa-kand6-2026-08-25/MANIFEST.tsv` med de otte kolonner,
kontrakten bruger — hovedet er ordret:

```
filnavn	kilde_url	http_status	hentet_utc	sha256	bytes	indhold	sprogversion
```

Én række pr. fil. **`hentet_utc` er filens mtime, og det er en ØVRE GRÆNSE, ikke en
måling** — det er en kendt fælde i dette projekt: 58 filer havde mtime inden for 0,475
sekund af hinanden, hvilket er fysisk umuligt for 58 hentninger. **Skriv den forbehold
ind i filens egen første linje som en kommentar**, så ingen senere læser den som et
hentetidspunkt. `sha256` og `bytes` måler du på filen; `kilde_url` udleder du af
filnavnet og skriver **kun**, hvis du kan bekræfte den inde i HTML'en — ellers `ukendt`.

**Færdig når** filen har 6 datarækker plus hoved, og `sha256`-summen for én tilfældig
række kan genberegnes og passer. Skriv hvilken fil du efterprøvede.

## Punkt 3 — Skriv de engelske tekster

Alle 17 `caveat`, plus **2** `applications.note` og **2** `images.note`.

Fire regler, og de er hårde:

1. **Opfind intet.** Ingen påstand må komme til, som ikke stod i den danske tekst.
   En oversættelse må gøre en sætning klarere; den må ikke gøre den stærkere.
2. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal blive ved med
   at være tre forskellige formuleringer på engelsk. Det er der, katalogsider lyver.
3. **Ingen salgssprog.** Siden er ikke en salgskanal. Skriv, som en teknisk katalogpost
   skriver: konstaterende, uden tillægsord.
4. Enheder, tal og egennavne står uændret. Ændrer du et tal, har du brudt sporet.

## Punkt 4 — Skriv til databasen

`db/f2-pilot-skriv.mjs`. Mønstret, som virker mod PostgREST:

```
PATCH ${U}/rest/v1/field_entries?robot_id=eq.2183&field_name=eq.weight
headers: apikey, Authorization: Bearer, Content-Type: application/json,
         Prefer: return=representation
body:    { "caveat": "...", "caveat_wording": "...",
           "collected_by": "spor/f2-pilot",
           "change_reason": "fase 2: engelsk brødtekst, ordret kildeordlyd udskilt" }
```

Primærnøgler, målt i dag: `field_entries` (robot_id, field_name) ·
`applications` (robot_id) · `images` (robot_id) · `robots` (id).

Fem krav:

1. **`Prefer: return=representation` er obligatorisk.** Uden den svarer PostgREST **204
   uden krop**, og du kan da ikke skelne "1 række opdateret" fra "0 rækker matchede".
   Det er den dyreste fælde i hele denne fil.
2. **Præcis 1 række pr. opdatering.** Svarer arrayet med 0 eller mere end 1: afbryd
   hele kørslen og skriv hvilken post det var.
3. **Kun disse kolonner:** `caveat`, `caveat_wording`, `note`, `collected_by`,
   `change_reason`. Rører du en talkolonne, er sporet forkert.
4. `--toerloeb` er **standard**. Skrivning kræver `--skriv` eksplicit. Kør tørløbet
   først, læs det igennem, og skriv i rapporten hvor mange opdateringer det viste.
5. Skriv til sidst antal ændrede rækker.

**Færdig når** `node fund/maal-f2.mjs 2182,2183` giver:

```
caveat                         17 | dansk:    0      (i dag: 17 | dansk: 13)
  heraf uden ordlyd            <A-kassens komplement>  (i dag: 17)
applications.note               2 | dansk:    0      (i dag: 2 | dansk: 2)
images.note                     2 | dansk:    0      (i dag: 2 | dansk: 2)
```

**`dansk: 0` er kravet. Tallet for "uden ordlyd" er IKKE 0** — det bliver antallet i
kasse B plus kasse C, og det tal måler du selv i punkt 1. Skriv det som `B + C = N`.

**Og tallet er nødvendigt, ikke tilstrækkeligt.** Ordlisten fanger ikke en dansk sætning
uden æøå og uden et af ordene. **Læs derfor alle 21 tekster igennem selv til sidst og
skriv, hvor mange du læste, og hvor mange fejl du fandt.** Nul fundne fejl uden en
tælling er ikke en efterprøvning.

## Punkt 5 — Tallene må ikke have rørt sig, og listen til JPK

**(a)** Bevis at ingen talkolonne ændrede sig. Hent alle `field_entries`-rækker for
2182 og 2183 **før** dit første skriv og gem som JSON i din worktree; hent igen bagefter;
sammenlign alle kolonner **undtagen** `caveat`, `caveat_wording`, `collected_by`,
`change_reason`. **Færdig når diffen er tom.** Er den ikke, har du et fund, ikke en
oprydningsopgave — rapportér det.

**(b)** `change_log` havde **0 rækker**, da dette brief blev skrevet. Efter dit spor
skal den have én pr. ændret række. **Tæl dem og skriv tallet.** Kommer der ingen, er
triggeren i stykker, og det er vigtigere end resten af dit spor — skriv det øverst.

**(c)** Kasse C-listen. Én række pr. advarsel: `robot_id`, `field_name`, advarslens
danske tekst, og **hvad du søgte efter og ikke fandt**. Den liste går til JPK som en
åben beslutning — hård begrænsning 2 siger, at en påstand uden belæg ikke må stå — og
**den beslutning er ikke din.** Ret ingen af dem.

## Punkt 6 — `fund/OPSKRIFT-fase2.md`, den vigtigste leverance

Det, 23 senere spor skal kunne følge uden at læse dette brief. Skriv den, som du ville
skrive den til en kollega, der starter i morgen. Mindst:

- Rækkefølgen: klassificér → efterprøv mod råkilde → skriv engelsk → skriv til DB → mål.
- **De tre kasser, med et rigtigt eksempel på hver fra dine egne 17.**
- Grænsen mellem `caveat` og `caveat_wording`, sagt så den ikke kan misforstås.
- PostgREST-fælderne: `Prefer: return=representation`, kravet om præcis 1 række.
- Hvad der skal måles før og efter, med kommandoen.
- **Det, der overraskede dig.** Den del bliver den mest læste.

---

## Rækkefølgen — en skrive-grænse, ikke en commit-grænse

Skriv **kun punkt 1's arbejde**, mål det, commit — og **først derefter** punkt 2. Sådan
hvert punkt. Målt to gange her: en agent, der skriver alt i ét Write-kald, får punkt 1's
commit til at bære punkt 4's uefterprøvede kode.

Commit undervejs er et krav. To spor er døde midt i arbejdet uden en linje efterladt.

## Miljøfælder — hver har kostet en runde

- `node` er `/c/Program Files/nodejs/node.exe`. Git Bash har den ikke på PATH.
- **`/tmp` findes ikke det samme sted for node og Git Bash.** Brug en sti i projektet.
- Commit-beskeder med backticks, `$` eller anførselstegn: `git commit -F <fil>`.
- `sed -i`, der ikke matcher, gør **intet — tavst, med exit 0**. Brug Edit-værktøjet.
- Lange markdown-filer knækker i bash-heredocs. Brug Write-værktøjet.
- UTF-8 **uden** BOM. `Set-Content -Encoding utf8` ødelægger tankestreger.
- `.env` og `assets/fotos/fabrikant/` er kopieret ind for dig. Efterprøv med
  `ls -la .env` og `ls assets/fotos/fabrikant | wc -l` (**forventer 610**).
- **Skriv aldrig nøglen fra `.env` i en fil, en commit eller din rapport.**
- Egen serverport, hvis du starter en: 8162. Aldrig 8080 — den er delt.

## Skriv en kontrol før hver måling

**Skriv, hvad tallet skal være, hvis alt er som forventet — FØR du læser det.**

```
echo -n "caveat i alt (forventer 17): "; <din kommando>
```

Et forkert mønster giver typisk et fuldstændig plausibelt tal. Kontrollen er det eneste,
der gør fejlen synlig i samme øjeblik.

## Briefets fakta er påstande

Alle tal ovenfor er **mine målinger**. Afviger noget, du måler, så **rapportér
afvigelsen — det er leverance, ikke ulydighed.** To agenter rettede mine fakta i sidste
uge, begge korrekt. Det er den billigste kvalitetskontrol, vi har.

## Rapporten — `fund/FUND-f2pilot.md`, højst 60 linjer

1. Valgt løsning, fravalgt alternativ — én linje hver.
2. **Konfidens pr. punkt.** Høj = målt med en kommando, jeg kan genkøre og få samme tal,
   **plus én linje om hvad tallet ville have været, hvis arbejdet var forkert.**
   Middel = efterprøvet indirekte. Lav = ikke efterprøvet.
   **Høj uden genkørbar kommando nedskrives automatisk til lav.**
3. Usikkerheder mødt undervejs.
4. Målingerne som **tal**: "17 advarsler, A=x B=y C=z", "change_log 21 nye rækker".

Tabellerne fra punkt 1 og punkt 5(c) må gerne ligge i samme fil under de 60 linjer.

**Uden for loftet, obligatorisk:**

- **"Nye fælder og opdagelser."** Er der intet, skal der stå at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.
