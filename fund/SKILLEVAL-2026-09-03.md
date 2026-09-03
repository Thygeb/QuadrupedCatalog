# SKILLEVAL 2026-09-03 — projektets skills målt med skill-creators kriterier

Bestilt af JPK 3. sep 2026: *"kan du lave en evaluering af de anvendte skills i denne
kontekst med skill-creator?"* — og undervejs: *"Mangler vi en skill til implementering?"*

**Metoden er skill-creators egen** (Anthropics plugin, `SKILL.md` læst fra
`plugins/cache/claude-plugins-official/skill-creator/ed404106fcd8`). Den dømmer en skill
på syv ting: (1) beskrivelsen er triggeren og skal være "pushy"; (2) `SKILL.md` under 500
linjer, med `references/` og `scripts/` til det, der ikke skal i kontekst hver gang;
(3) forklar *hvorfor* frem for MUST — *"ALWAYS or NEVER in all caps, or super rigid
structures, that's a yellow flag"*; (4) hold den slank, fjern det der ikke trækker;
(5) generalisér, overtilpas ikke til eksempler; (6) gentaget arbejde på tværs af kørsler
→ bundt et script; (7) evals med assertions, når udfaldet kan efterprøves objektivt.

**Dens fulde løkke — med/uden-skill-kørsler på subagenter, grader, viewer — er IKKE
kørt.** Prisen står nederst; valget er JPK's.

## Målt

Kommandoer: `wc -l`/`wc -w` på `SKILL.md`; beskrivelse = `description:`-linjens ord;
kapitæl-bud = `grep -oE '\b(ALDRIG|ALTID|SKAL|IKKE|KUN|HVER|FØR|MUST|NEVER|ALWAYS|…)\b'`
(kontrol: `ALDRIG` i parallelt gav 1, forventet >0); dato-anekdoter = forekomster af
`<dag>. aug/sep 2026`; fed = `\*\*[^*]+\*\*` pr. 100 ord (den bedre rigiditets-proxy her,
fordi disse skills bruger fed, ikke kapitæler); kald = `"skill":"<navn>"` i mit
transskript; api-kald = `session-report`s `analyze-sessions.mjs --json --since 48h`,
`by_skill.api_calls` — **over alle projekter**, og sandsynligvis attribueret på omtale,
ikke kun kald. Retning, ikke facit.

| Skill | linjer | ord | beskr. ord | kapitæl | dato-anekd. | fed/100 ord | evals | bundt | kald (mig) | api-kald 48 t |
|---|---|---|---|---|---|---|---|---|---|---|
| `robotdata` | 276 | 2135 | 48 | 2 | 11 | 2,0 | nej | — | 0 (6 spor) | 542 |
| `grillmig` | 319 | 2974 | 105 | 0 | 0 | 2,9 | **ja** 3/17 | `evals/` | 3 | 26 |
| `parallelt` | 234 | 2157 | 47 | 7 | **12** | 2,7 | nej | — | 4 | 15 |
| `flet` | 175 | 1395 | 69 | 4 | 7 | 1,1 | nej | — | 1 (9 flet) | 30 |
| `brief` | 146 | 1260 | 65 | 3 | 6 | 1,0 | nej | — | 2 (7 briefs) | 51 |
| `retro` | 108 | 693 | 44 | 1 | 2 | **4,3** | nej | — | 1 | 45 |
| `fejljagt` | 88 | 740 | 74 | 3 | **0** | 1,4 | nej | — | 0 | 188 |
| `supabase` | 149 | 1778 | 97 | 1 | 0 | 2,5 | nej | `assets/ references/` | 0 | 160 |
| `supabase-postgres-best-practices` | 64 | 436 | 122 | 0 | 0 | 0,0 | nej | `references/` | 3 | 494 |

Ingen af de ni er i nærheden af 500-linjers loftet. Kun én har evals. Kun de to
eksterne har progressive disclosure.

## Fund pr. skill — dom: behold · udvid · skær · fjern

**1. `robotdata` — RET (gjort i dag).** Tre tal, tre steder, ingen af dem passer koden:
beskrivelsen siger *30-feltsskemaet*, sektionen *"De 30 felter"* summer til 30 over
seks grupper, CLAUDE.md's skilltabel siger *29*, og skemaet har **33**
(`FELTNAVNE.length`). De tre, der mangler, er `fcc_oplyst`, `ul_oplyst`, `ccc_oplyst`:
gruppen *"EU (1)"* har kun CE, mens `spor/cert` (`11f5b98`) lagde tre til. Skillen siger
selv: *"er de to uenige, har skemaet ret — og så skal listen her rettes."* Det er den mest
brugte skill målt i tokens, og den bar et forkert feltantal gennem seks spor i går — uden
skade, fordi ingen af dem rørte skemaet. Rettet: beskrivelse, overskrift, gruppe, og
CLAUDE.md's 29.

**2. `parallelt` — SKÆR (ikke gjort; omstrukturering).** Vokset ved tilvækst — punkt 9,
9b, 9c, 9d, 10, 11, 12 — flest dato-anekdoter (12) og 58 fed-spænd. Punkt 2 er tolv
underpunkter om, hvad *prompten* skal bære: agentvendte regler skrevet til
orkestratoren. Resultatet er målt nedenfor (20 af 21 briefs bærer de samme otte blokke).
§4 *"Flet og ryd op"* er 41 linjer, som `flet` (bygget 27. aug) og CLAUDE.md nu dublerer —
tre kopier af samme regel, og CLAUDE.md siger selv, at tre kopier divergerer ved den
fjerde. Forslag: §4 → én linje *"se `flet`"*; punkt 2's agentvendte regler → den nye
implementeringsskill.

**3. `brief` — UDVID med bundt, RET overskrift (overskriften gjort).** Overskriften sagde
*"ni punkter"*; der er elleve (10 og 11 kom til uden at den fulgte med). Pkt 7 siger
ordret *"Kopiér blokken fra et nyligt brief"* — det er skill-creators signal nr. 6.
Bundtet hører i implementeringsskillen, så `brief` kun peger. Transskript: 2 kald, 7 briefs
— de fem sidste blev skrevet fra kontekst. Det virker inden for én session; efter en
komprimering er teksten væk, og et brief skrevet efter hukommelse er et brief uden værn.

**4. `flet` — BEHOLD.** Den bedste beskrivelse af de ni efter skill-creators mål: siger
hvornår, siger *"også når det bare er en lille ting"*, nævner de to regler. Pkt 5 fyrede
ni gange i går. Én mulig bundtning (PowerShell-serverlisten som `scripts/`) — lavt
udbytte, ikke gjort.

**5. `fejljagt` — BEHOLD; kandidat til evals.** Tættest på skill-creators ideal: 88
linjer, **0** dato-anekdoter (den siger *"ugens tre målefejl"* uden datoer — det er
generalisering), fed 1,4. Og den er den eneste projektskill, Sonnet-spor kalder af sig
selv: 0 kald fra mig, 188 api-kald i 48 t. Udfaldene er objektivt efterprøvelige
(mekanismesætning før rettelse, revert-bevis) — præcis den type, skill-creator vil have
evals på. Retroen i går skrev *"kaldt 2"*; mit transskript siger 0 — de to var enten
peer-sessionen eller læst fra disk. Uafklaret.

**6. `grillmig` — SKÆR ved at flytte (ikke gjort).** Den eneste med evals: 3 prøver, 17
assertions, kørt 21. aug — 6/6 mod baseline 4/6 (`fund/FUND-grillmig.md:128`). Også den
længste, og 93 af de 319 linjer er *"Fejl, der allerede er betalt"* — otte anekdoter.
Skill-creator: `references/betalte-fejl.md`, og `SKILL.md` beholder de to job og formen.
Ude af det obligatoriske workflow siden 28. aug; 3 kald i går, alle på SSOT-planen.
Evals skal genkøres efter et snit — det koster, se nederst.

**7. `retro` — UDVID beskrivelse, RET sti (gjort); SKÆR fed (ikke gjort).** Min egen
fra i går: højeste fed-tæthed af alle, 4,3 pr. 100 ord — skill-creators gule flag, skrevet
af den, der skrev reglen om det. Beskrivelsen var den korteste (44 ord) og ikke pushy:
JPK's faktiske ord i går var *"hvad tænker du om dagens session, er der noget i
workflowet, som skal rettes eller optimeres"* — ingen af dem stod i beskrivelsen. Rettet.
Stien til `analyze-sessions.mjs` fejlede for mig selv i dag som MSYS-sti
(`C:\c\Users\…`, *Cannot find module*) — noten er føjet til.

**8. `supabase`, `supabase-postgres-best-practices` — BEHOLD, eksterne.** De eneste med
`references/`. Rør dem ikke.

## Svar: mangler vi en skill til implementering? Ja — målt

- **Reglen findes, målet gør ikke.** CLAUDE.md: *"Skriv aldrig reglerne af i hånden ind i
  en agentprompt. Peg på skillen."* `robotdata` dækker dataspor. Intet dækker kodespor.
- **Konsekvensen:** `grep -l` over `fund/BRIEF-*.md` (21 filer): *60 linjer* 21,
  *konfidens* 21, *Punkter i briefet* 21, *commit -F* 20, *node.exe* 20, *BOM* 20,
  *Nye fælder* 20, *sed -i* 19. I `BRIEF-f2-vaern.md` er det 47 af 205 linjer (23 %).
- **Jeg byggede den i går uden at kalde den det:** `BRIEF-FAELLES.md` (222 linjer, kun i
  scratchpad og i de fire worktrees). 7 af dens 14 afsnit er generiske — regel 0,
  skrivegrænse, miljøfælder, kontrol før måling, briefets fakta er påstande, rapportform.
  Det er en skill i forklædning, og den forsvinder med scratchpad'en.
- **Forslag:** `.claude/skills/spor/SKILL.md`, agentvendt, kaldt som sporets første
  handling. Indhold: grundmåling først · skrivegrænse = commit-grænse · kontrollinje før
  hver måling · afvigelser fra briefet er leverance · luk serveren · rapportform (60 linjer,
  de to obligatoriske sektioner, konfidensskalaen med kontrafaktisk linje) ·
  `references/miljoefaelder.md` — blokken ét sted. Derefter krymper `brief` pkt 5–8 til
  *"peg på `spor`"*, `parallelt` pkt 2 til et promptskelet, og §4 til *"se `flet`"*.
  Forudsigelse, ikke krav: næste brief bliver ~50 linjer kortere.
- Skill-creators løkke passer på netop den: den er agentvendt, så med/uden-skill på en
  Sonnet måler den rigtige bruger.

## Prisen for skill-creators fulde løkke

Med/uden × 3 prøver × ~60–100k tokens ≈ 360–600k pr. skill, plus grader. På
orkestratorvendte skills (`brief`, `flet`, `retro`) måler en subagent-kørsel den forkerte
bruger — dem kalder jeg, ikke Sonnet. Giver mening på `spor` (ny), `fejljagt`, `robotdata`.
**Anbefaling: kun `spor` og `fejljagt`, ~1M tokens, når `spor` findes.**

## Selv-review

- Mine egne fejl i dag: analysatorstien (MSYS), tre forkerte grep-mønstre (Å-numre,
  robotdatalisten, gættede brief-filnavne). Alle fanget af kontrollinjen; ingen nåede en
  konklusion. `bc` findes ikke på maskinen — brug `awk`.
- Ikke målt: om hver af `parallelt`s 12 anekdoter trækker sin vægt. Det kræver læsning af
  spor-transskripter (skill-creators pkt 4), og det gjorde jeg ikke.
- Kapitæl-målingen er svag (1–7); fed-tætheden er den brugbare proxy.
- `by_skill` tæller over alle projekter og på omtale — brugt som retning, ikke som facit.
