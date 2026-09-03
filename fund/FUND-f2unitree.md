# FUND — spor/f2-unitree

## Regel 0 — skill-vurdering

Valgt: **`robotdata`** — læst `.claude/skills/robotdata/SKILL.md` fra disk, G1 (kilde +
MANIFEST + ordret ordlyd) fulgt for hver skrivning. Fravalgt: `supabase` (ingen
MCP/RLS-fejlsøgning nødvendig — direkte REST med `.env`-nøglen var nok, samme mønster som
f2-pilot/f2-cjk) · `fejljagt` (intet opførte sig uventet undervejs — de fejl, jeg fandt i
eksisterende tekst, kom af planlagt efterprøvning, ikke af et rødt måletal) · `parallelt`
(jeg ER allerede sporet, ikke orkestratoren).

## Valgt løsning / fravalgt

Metode: **OPSKRIFT-fase2.md alene** (engelsk udtrækning fra brødtekst/tabel). Fravalgt:
OPSKRIFT-fase2-cjk.md's karaktertegnsmetode — briefets præmis "kilden er kinesisk" holdt
ikke, se "Nye fælder" punkt 1. `-cjk.md` blev brugt étsteds: at læse en frisk hentet
kinesisk side for at efterprøve 6 `applications.note`-påstande.

## Konfidens — alle høje er genkørbare kommandoer, med kontrafaktisk linje

| Punkt | Kommando | Tal | Hvis arbejdet var forkert |
|---|---|---|---|
| validate uændret | `node tools/validate.mjs` | 77/0/1 (uændret) | ville vise et andet fejl-/advarselstal |
| kildecitater | `node db/f2-unitree-skriv.mjs --verificer` | 201 fragmenter/0 fejl | ville vise `FEJL <robot>/<felt>` pr. opfundet citat |
| talkolonner urørte | `node fund/_diff_check.mjs` | 0 uventede diffs | ville vise `UVENTET DIFF` pr. rørt kolonne |
| skreven tekst = sendt tekst | `node fund/_utf8_check.mjs` | 154/0 mismatches | ville vise `MISMATCH` pr. korrupt streng |
| dansk-detektor | `node fund/maal-f2-unitree.mjs 2231..2243` | 0 overalt (se Målinger) | ville vise et tal >0 |
| change_log-omfang | `node fund/_verify_changelog_scope.mjs` | 155/0 udenfor | ville vise `UDENFOR` pr. fejlramt robot_id |

**Middel:** manuel gennemlæsning af alle 154 skrevne tekster (`fund/_final_read_output.txt`)
— fandt og rettede 1 fejl (afkortet citat i 2240/compute, ikke dansk). Middel, ikke høj:
læsningen beviser at teksten er læst, ikke at den er 100 % korrekt.

## Usikkerheder

- Laikagos note "23 produktlinks" (genbrugt fra et tidligere spors indsamling) er
  stikprøvet (34 modellignende links fundet i samme fil), ikke genudledt til et eksakt tal.
- B1's "eneste af de tolv med en ladetid" er bekræftet INDIREKTE — ingen af de øvrige 11
  robotters caveats/kilder viste et sammenligneligt tal, ikke ved en dedikeret gennemgang
  af netop dette ene spørgsmål på alle 11 sider.

## Målinger

Før: `caveat 134|dansk 123` · `caveat_wording 0` · `applications.note 13|dansk 13` ·
`images.note 1|dansk 1` · `robots.notes 9|dansk 8`.
Efter: `caveat 134|dansk 0` · `caveat_wording 127|dansk 0` · `applications.note 13|dansk 0`
· `images.note 1|dansk 0` · `robots.notes 9|dansk 0`.
`change_log`: 155 rækker for `spor/f2-unitree`, 0 udenfor mine 13 robot_id'er.
Talkolonne-diff: 0. `value_text`: 35 i alt (uændret), 2 danske oversat (IKKE briefets
forudsagte 1 — se Nye fælder punkt 5).
Klassificering: kasse A 123 · kasse B (ingen ordlyd, negativkontrol/egen analyse) 7 ·
kasse RETTET (en delpåstand korrigeret efter efterprøvning) 4 · **kasse-fuld-sletning
(L87) 0 af 134**.
Aliengos 3 påstande (2234/weight): (1) "alle andre oplyser med batteri" — RETTET til
9/12 eksplicit med batteri, 2/12 (A1+Laikago) oplyser slet ikke vægt, 1/12 (Go1) uden
etiket; (2) Go2 = 15 kg — bekræftet; (3) As2 = 20 kg — bekræftet, plus kildens egen
etiket "Weight (with Battery)" fundet undervejs. Trioen IKKE slettet — alle tre har
belæg, én er præciseret.

---

## Nye fælder og opdagelser

1. **Briefets kerneantagelse holdt ikke.** "Kilden er kinesisk" var forkert for Unitree:
   alle 16 rå-HTML-filer i `raa-kina-unitree-2026-08-19/` er ENGELSKE (`en-US`,
   "United States / English" i MANIFEST.tsv) — målt `grep -oP '[\x{4e00}-\x{9fff}]'` pr.
   fil, **0 CJK-tegn i samtlige 16.** Kun 6 `applications.note`-tekster refererer reelt
   til kinesisk tekst — i den EKSISTERENDE, urørte `quote_wording`-kolonne — hvilket
   krævede at en frisk kinesisk forside blev hentet (manglede som råkilde i worktreen; ny
   mappe `media/_kilder/raa-f2-unitree-2026-09-02/`, MANIFEST.tsv medfølger, rigtig
   HTTP-status og Date-header).
2. **Kinesisk og engelsk navigation strukturerer sig forskelligt, ikke kun sprogligt.**
   Den kinesiske forside (frisk hentet) PARRER hver -W-variant med sin ikke-hjulede søster
   i samme gruppe ("A2 A2-W" sammen under 行业级). Den engelske gør det IKKE — kun "A2",
   "As2" osv. står i hovedgruppen; -W-varianterne findes kun i en undermenu. Tre
   `applications.note`-tekster (2233, 2236, 2239, 2242) er derfor præciseret til
   eksplicit at sige "den ENGELSKE navigation", i stedet for bare "navigationen".
3. **To eksisterende prisadvarsler (A2, B2) delte samme påstand — kun én holdt.** Begge
   hævdede at shopsidens $100.000-pladsholder stod sammen med teksten "Contact us for the
   real price". Efterprøvet ord for ord: sætningen findes kun på B2's SHOPSIDE tæt på
   B2's egen pris — bekræftet. På A2's shopside sidder den SAMME sætning ved et helt
   andet produkt (Unitree H1) længere nede på siden, ikke ved A2's pris. A2's caveat
   rettet, B2's bekræftet uændret.
4. **Samme metode fandt en tredje fejl, i en `robots.notes`-tekst (Laikago).** "Samme
   tidslinje nævner Laikago Pro under 2019" var forkert — "Laikago Pro" og
   salgstalsopgørelsen "1 million sets" findes på Go1's EGEN historik-sektion, ikke på
   Unitrees About-side, som teksten hævdede (0 forekomster af "Laikago Pro" i
   About-siden, målt). Rettet til korrekt kildehenvisning.
5. **Endnu et usynligt dansk ord i value_text-detektoren.** f2-cjk fandt allerede
   "under/over/men/dog". Her: "kerner" (dansk for "cores") har hverken æøå eller et
   ordlisteord og blev kun fundet ved at LÆSE Go1's `compute`-værdi, ikke ved at måle.
   **2 danske `value_text`-felter fundet på mine 13 robotter, ikke briefets forudsagte 1**
   (cameras OG compute, begge på 2240/Go1).
6. **Et "label + værdi i to DOM-celler"-citat SKAL skrives som to " | "-adskilte
   fragmenter, aldrig sammensat med ét mellemrum.** `"Weight (with battery) About 42kg"`
   ser rigtigt ud, men findes hverken bogstaveligt i rå-HTML eller i den
   linjeadskilte udtrukne tekst (label og værdi er to separate DOM-celler/linjer).
   Kostede 65 fejl i den første `--verificer`-kørsel, alle rettet ved at splitte til
   `" | "`. Én yderligere fejl (afkortet citat i 2240/compute) blev fundet ved den
   efterfølgende manuelle gennemlæsning og rettet med en enkelt PATCH.

## Punkter i briefet, jeg ikke nåede

(ingen — samtlige punkter i BRIEF-f2-unitree.md's "Færdig når"-liste er opfyldt, se
Målinger ovenfor)

## Til opskriften

**Det, de tre resterende spor skal bruge:**

1. **Mål CJK-tegn pr. råkildefil FØR du vælger metode — antag intet fra producentens
   hjemland.** "Producenten er en kinesisk virksomhed" er IKKE det samme som "kilden er
   PÅ kinesisk". En international producents primære produktsider kan være 100 %
   engelske, mens kun enkelte sekundære sider (fx navigationsmenuen, brugt til
   `applications.note`) findes på kinesisk. Kommandoen der afgør det:
   `grep -oP '[\x{4e00}-\x{9fff}]' <fil> | wc -l` pr. fil, ikke en antagelse fra
   robotmodellens producentland.
2. **Kombinér de to opskrifter sådan:** brug OPSKRIFT-fase2.md's kasse A/B/C-metode og
   citat/prosa-grænse som standard for ALLE felter. Brug OPSKRIFT-fase2-cjk.md's
   "læs etiketten i selve HTML'en, gæt aldrig den nærmeste engelske betydning" og dens
   UTF-8-kontrol (§"UTF-8-kontrollen efter skrivning") KUN for de konkrete felter, hvor
   kilden faktisk viser sig at bære CJK-tegn efter punkt 1's måling — ikke som en
   helhedsmetode valgt på forhånd ud fra producentnavnet.
3. **Et "label + værdi i to DOM-celler"-fragment skrives ALTID som separate
   `" | "`-adskilte led i `caveat_wording`**, aldrig sammensat med ét mellemrum — selv når
   den sammensatte streng ser ud som én naturlig sætning. Se punkt 6 ovenfor.
4. **Tilføj "kerner" (og evt. "kerne") til alle DANSKE_ORD-lister** — value_text-detektoren
   har nu 5 kendte blinde vinkler (under/over/men/dog/kerner); læs value_text, mål den ikke
   kun.
5. **En sammenlignings-påstand ("alle andre", "eneste af de N") skal efterprøves mod den
   FULDE mængde, ikke mod de robotter der allerede har en caveat.** Aliengos "alle andre
   Unitree-modeller" krævede at hente `weight`/`speed` for alle 13 robotter uden filter på
   caveat — 3 af de "andre" 12 (A1, Laikago, Go1) havde INGEN caveat på det relevante felt,
   og ville være usynlige, hvis kun caveat-bærende rækker blev tjekket.
