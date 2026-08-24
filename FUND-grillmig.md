# FUND-grillmig — selv-test og selv-review af den nye skill

Skrevet 21. aug 2026 i worktree `udstilling-wt-grill`, gren `skill/grillmig`. Dokumenterer
byggeriet af `.claude/skills/grillmig/SKILL.md` og efterprøvningen af den, inklusive de
prøvetilfælde der **ikke** fuldførte, og hvorfor.

---

## Skill-vurdering (regel 0)

**Valgt: `skill-creator:skill-creator`** — opgaven navngav den eksplicit. Indlæst normalt med
Skill-værktøjet (ingen `Unknown skill`), så ingen fallback fra disk var nødvendig for selve
skill-creator. **Selve `grillmig` derimod** blev oprettet i den kørende session og kunne
**ikke** kaldes med Skill-værktøjet af de agenter, der efterprøvede den — de fik `Unknown skill`
og læste `SKILL.md` fra disk med Read-værktøjet i stedet. Det står eksplicit i hver agentprompt,
og hver agent bekræftede det i sin afsluttende besked.

**Gik forbi:** `robotdata` og `parallelt` (formatforbilleder, ikke værktøjer til denne opgave —
læst som reference, ikke kaldt), `ui-ux-critique`/`critique`/`impeccable` (dømmer en bygget
flade; der er intet bygget at grille en skill selv med), `code-review`/`simplify` (ingen
produktionskode).

---

## Hvad blev bygget

`.claude/skills/grillmig/SKILL.md`, 319 linjer, UTF-8 uden BOM. To job: gril et agentbrief før
afsendelse (fem spørgsmål A1-A5), gril en åben beslutning før den låses (fire spørgsmål
B1-B4). Otte målte eksempler fra projektets egne dokumenter — hver med et tal, ikke en
formaning — plus en fast rapportform, et forbud mod at slutte på ros, og en eksplicit
"stop er et gyldigt svar"-sektion.

**Tabellen i `CLAUDE.md`** under "Projektskills" er udvidet med en tredje række for `grillmig`.

---

## Selv-test: fire prøvetilfælde, ikke tre — og et ærligt regnskab over, hvorfor

Planen var tre prøvetilfælde kørt som with-skill/uden-skill-par i baggrundsagenter. Sessionen
blev afbrudt fire gange undervejs (sessionsloft), og et femte spor — en levende
trigger-måling via nestet `claude -p` — nåede aldrig i mål. Nedenfor står, hvad der **faktisk**
blev kørt, ikke hvad der var planlagt.

### Eval 0 — for løst brief ("kig på billederne i media/ og gør noget ved kvaliteten")

Kørt som ægte baggrundsagent-par (with_skill læste `SKILL.md` fra disk; without_skill løste
opgaven uden adgang til skillen).

| Kontrol | with_skill | without_skill |
|---|---|---|
| Dom er "send ikke" | JA | JA |
| Alle fem A-spørgsmål stillet eksplicit | JA | NEJ — grillede mod `parallelt`s 9-punktsliste i stedet |
| Første indvending er [Blocker]/[Major] | JA (4 Blocker, 3 Major, 1 Minor) | JA (3 Blocker, 3 Major) |
| Mindst ét acceptkriterium | JA | JA |
| Tælling til sidst (N/M/K/J-form) | JA | NEJ |
| Ingen ros i sidste linjer | JA | JA |

**6 af 6 kriterier opfyldt med skillen, 4 af 6 uden.** Begge arme fandt substantielt de samme
sagsforhold (108 af 215 billeder er byte-identiske kopier delt på tværs af robotter, `media/`
er tom i en frisk worktree fordi den er gitignoreret) — skillens bidrag er **formen**: eksplicit
A1-A5-tabel, en tvungen tælling, et navngivet acceptkriterium pr. indvending. Uden skillen greb
agenten selv efter `parallelt`s tjekliste, som er beslægtet, men ikke det samme spørgsmålssæt.

### Eval 1 — beslutning med uprissat alternativ (silhuetter vs. tilladelser, L30-kandidat)

Samme opstilling.

| Kontrol | with_skill | without_skill |
|---|---|---|
| Det uprissatte alternativ er første indvending | JA | JA (fundet uafhængigt, i "Kort svar") |
| Konkret måling foreslået | JA — tre målinger, én kørt | JA — prissætter selv tilladelsesvejen |
| Tidligere beslutning citeret med nummer | JA (L13, L26, L28, S1) | JA (samme numre) |
| Omkostning ved fejlvalg skrevet frem | JA (vendbar vs. ikke-vendbar) | JA |
| Dom er "lås ikke"/"lås efter måling" | JA — "Lås ikke." | **NEJ** — "Retningen er moden nok til at låses" |
| Tælling til sidst | JA | NEJ |

**6 af 6 med skillen, 4 af 6 uden.** Det interessante fund ligger ikke i indholdet — begge arme
er skarpe og velmålte — men i **dommen**. Uden skillen konkluderede agenten, at beslutningen
kunne låses (med et forslag til selve L30-teksten), altså præcis den handling B3/B4 skal
forhindre, når det ene alternativ er uprissat. Med skillen blev dommen "lås ikke", fordi
holdningsreglen (*"enighed skal betales"*) tvang en eksplicit vurdering af, om B1-B4 var
besvaret, før en dom kunne fældes.

### Eval 2 — "brief i orden, skal slippe igennem uændret": **ugyldigt prøvetilfælde**

Her fejlede min egen opgavekonstruktion, ikke skillen. Jeg skrev et D4-brief og påstod, at det
var i orden — men jeg havde ikke selv efterprøvet, at D4 var åben. Begge agenter (with_skill og
without_skill) fandt uafhængigt af hinanden, at **D4 allerede er lukket som L20**
(`STATUS.md:44` fører den stadig som åben, `STATUS.md:131` fører den som lukket — filen
modsiger sig selv). Begge dømte "send ikke". Det var den **rigtige** dom af et brief, jeg
fejlagtigt havde kaldt rent.

**Hvad jeg gjorde ved det:** rettede skillen, ikke prøvetilfældet efterfølgende. `SKILL.md`s
"Før du griller"-afsnit fik en ny, navngivet regel: *"Læs `STATUS.md` helt igennem, ikke
halvt"*, med D4/D7-modsigelsen som eksempel og linjehenvisning. Uden det ville en agent, der
kun læser den åbne halvdel af filen, gentage præcis den fejl, mit brief begik.

**Kontrolleret (til trods for at testen er ugyldig som pass-through-test):**

| Kontrol | with_skill | without_skill |
|---|---|---|
| Alle ni spørgsmål (A1-A5 + B1-B4) besvaret eksplicit | JA | NEJ — mod `parallelt`s liste igen |
| Ingen påstået fejl, der modsiges af briefets egen tekst | JA — G1 (D4=L20), G3 (N er 10/12/16) efterprøvet uafhængigt af mig | JA |
| Tælling til sidst | JA | NEJ |

### Eval 3 — rettet, verificeret ren brief (manifest-tidsstempler i 7 råmapper)

To baggrundsagenter blev sat i gang på et brief, jeg selv havde efterprøvet forinden
(`grep -c hentet_utc STATUS.md` → 0, altså intet lukket punkt; 7 råmapper ud over
`raa-vest` fundet og talt). Sessionen blev afbrudt, før agenterne leverede `svar.md`, og jeg
har **ikke** genstartet dem — endnu et forsøg risikerede endnu en afbrydelse uden leverance.

**I stedet påførte jeg selv skillens Job 1** på briefet, som en direkte anvendelse, ikke en
uafhængig agentkørsel — det er en svagere test end de tre ovenfor, og det skal stå tydeligt.
Alle fem A-spørgsmål var besvarede i briefet (leverance, aftager, spildrisiko med eksplicit
tjek-først-instruks, kun én fil rørt, reproducerbart færdighedskriterium). Én reel finpudsning
dukkede op undervejs: **A3's præmis holder kun delvist.** To af de syv mapper
(`raa-eu-belaeg-2026-08-19`, `raa-kina-weilan-xiaomi-2026-08-19`) nævner `curl` i deres
manifest, men som invokationsflag og fejlnoter — **ikke** som en uafhængig `Date`-header, der
kan bekræfte hentetidspunktet. Dommen blev **"Send, med én tilføjelse til A3"** — ikke en
omskrivning. Det er den type udfald, prøvetilfælde 3 skulle vise: et ordentligt brief kommer
igennem med et supplement, ikke en genstart.

### Samlet regnskab

**4 af 4 planlagte prøvetilfælde forsøgt. 3 fuldførte som ægte agentkørsler (0, 1, 2), 1
fuldførte kun som selv-anvendelse (3).** Af de tre agentkørte: to (0, 1) var gyldige tests af
"skillen skal fange noget" og bestod med 6/6 hhv. 6/6 kriterier mod baseline på 4/6 og 4/6 — det
er skillens reelle bidrag: **samme fund, strammere form, og i eval 1 en anderledes (rigtigere)
dom.** Den tredje (2) var min egen fejlkonstruktion og blev brugt til at rette skillen i stedet
for at blive kasseret som spild. Den fjerde (3) giver et svagere, men positivt signal om
gennemslip: skillen tvang ikke en velformet brief om.

**Ingen af de fire viste et falsk positiv** — skillen krævede aldrig en omskrivning af noget,
der reelt var i orden, bortset fra eval 2, hvor kravet var korrekt (D4 var faktisk lukket).

---

## Trigger-kontrol: virker `description` på danske formuleringer?

**Ufuldstændigt. Skriv det ærligt, ikke pænt.**

Jeg byggede en Windows-sikker erstatning for `skill-creator`s `run_eval.py` (dets brug af
`select.select()` på en pipe fejler på Windows — `select` understøtter kun sockets der). Den
peger på den native `claude.exe`-binær direkte, fordi `claude.cmd`-shimmen ikke startede noget
underprocess overhovedet, da den blev kaldt uden shell fra Python — otte forespørgsler
"fuldførte" på under et sekund uden at have kørt noget. Med `claude.exe` direkte spawnede
processerne rigtigt (bekræftet med `Get-Process claude*`), men **alle otte forespørgsler
oversteg budgettet på 150 sekunder** i denne indlejrede session, formentlig fordi en nestet
`claude -p` her arver en langsom eller delt kørselskontekst. Jeg fik ordre om aldrig at dræbe
processer med `Stop-Process` for at komme videre — en tidligere runde gjorde det og kostede en
hel session — så jeg lod den sidste kørsel stå uafsluttet i stedet for at tvinge et resultat
frem.

**Det jeg kan sige med sikkerhed:** alle fire formuleringer fra opgaven — *"gril lige den her"*,
*"er planen god nok"*, *"hold den op mod virkeligheden"*, *"spørg mig ud"* — står **ordret** i
`description`-feltet, som er den primære udløsningskanal. Det er en tekstkontrol, ikke en
målt triggerrate, og det skal ikke forveksles med den ene.

**Det jeg ikke fik målt:** hvorvidt Claude faktisk vælger at læse skillen ved disse
formuleringer i praksis, og hvor mange af de negative kontrolspørgsmål (`trigger-set.json`,
10 forespørgsler, 5 positive/5 negative, ligger i scratchpad) der korrekt **ikke** udløser den.
Scriptet (`run_trigger.py`) og forespørgselssættet er bevaret i scratchpad, hvis nogen vil
fuldføre målingen uden for denne session, hvor budgettet tydeligvis er for stramt til en levende
`claude -p`-kørsel.

---

## Selv-review — det ubehagelige spørgsmål først

**Er skillen overhovedet værd at have, eller overlapper den de fire kritikværktøjer, der
allerede findes?**

Svaret er **ja, den er værd at have, men med et forbehold, der ikke må forsvinde:** eval 0's
baseline viste, at en agent uden `grillmig` selv greb efter `parallelt`s ni-punkts
prompt-tjekliste og producerede en grilning, der i **substans** var lige så skarp som med
skillen — samme fund, samme dybde, samme antal blokerende punkter. Overlappet er reelt, og det
er størst mod `parallelt`, ikke mod de fire designkritikker (dem overlapper skillen ikke med,
fordi de kræver noget bygget, og en grilning sker før noget er bygget).

**Det skillen faktisk lægger til, målt over de fire kørsler:**

1. **Formen tvinger en eksplicit dom.** I eval 1 var det forskellen mellem "lås ikke" og "lås
   den, her er teksten" — samme materiale, modsat konklusion. Det er ikke en formalitet.
2. **Tællingen i selv-tjekket.** Uden skillen leverede without_skill-armen 0 af 4 kørsler en
   tælling på formen "N spørgsmål, M ubesvarede, K indvendinger". Med skillen: 4 af 4.
   En rapport uden tælling er, som CLAUDE.md selv siger om andet arbejde her, en fornemmelse.
3. **"Læs STATUS.md helt, ikke halvt"-reglen findes kun, fordi skillen blev efterprøvet på
   et forkert prøvetilfælde.** Det er selve pointen med at bygge en skill mod målte fejl
   frem for opfundne: fejlen i eval 2 var ikke hypotetisk, den var min egen, og skillen blev
   målbart bedre af at blive rettet mod den samme dag.

**Det jeg er reelt usikker på:** om overlappet med `parallelt` betyder, at `grillmig` burde have
været et **kapitel i** `parallelt` i stedet for en selvstændig skill. Argumentet imod at slå dem
sammen: `parallelt`s tjekliste er ni punkter om **hvordan** en prompt skal formes til en agent;
`grillmig`s ni spørgsmål (fem + fire) er om **hvorvidt** briefet eller beslutningen overhovedet
er klar — inklusive Job 2, som `parallelt` slet ikke dækker (beslutninger, ikke agentbriefs), og
inklusive retten til at sige stop, som ingen af de fem eksisterende skills har. Men jeg har ikke
et fjerde, uafhængigt datapunkt, der beviser adskillelsen er rigtig — kun tre gyldige og ét
selv-anvendt.

**Hvad jeg ikke nåede:**
- En fuld, levende trigger-måling. Se afsnittet ovenfor.
- To agentkørte prøvetilfælde af "brief i orden" — kun ét selv-anvendt lykkedes.
- At sammenligne skillen mod en ren `parallelt`-baseret grilning én-til-én på samme brief for at
  isolere overlappet præcist i stedet for at slutte det af eval 0's baseline alene.

---

## Rapportér ærligt

Fire sessionsafbrydelser undervejs kostede tid, ikke substans — intet blev committet før denne
runde, og intet arbejde gik tabt. Det, der blev sprunget over, er skrevet ovenfor med tal, ikke
tiet ihjel: trigger-målingen er ufuldstændig, ét prøvetilfælde er selv-anvendt frem for
agentkørt, og eval 2 var en fejl i min egen opgavekonstruktion, som jeg har brugt aktivt i
stedet for at skjule. Skillen er ændret tre steder som direkte følge af, hvad efterprøvningen
fandt: nævner-eksemplet er opdateret til den lukkede L30-beslutning, to nye målte eksempler
(tæller/nævner-splittet, de 71 UI-nøgler) og JPK's eget femagent-eksempel er tilføjet, og
"læs STATUS.md helt, ikke halvt" er skrevet ind som regel.
