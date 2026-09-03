---
name: parallelt
description: Sæt flere agenter i gang parallelt på dette projekt, hver i sin egen git-worktree, med selv-test og selv-review indbygget. Brug den hver gang en opgave kan deles i uafhængige spor — dataindsamling, research, flere sektioner. Bærer også fælden ved Agent-værktøjets isolation:"worktree" og diskprisen pr. spor. Metoden i sporets egen prompt ligger i `spor`-skillen, og fletningen i `flet` — denne peger på dem.
user-invokable: true
argument-hint: "[antal spor] [kort beskrivelse af opgaven]"
---

# Parallelt arbejde

Fast regel i dette projekt, sat af JPK 19. aug 2026: **kør agenter parallelt, når opgaven
kan deles. Én agent ad gangen er undtagelsen, ikke normen.**

---

## Fælden, læs den først

**Brug ikke Agent-værktøjets `isolation: "worktree"`.** Den forgrener fra *sessionens
arbejdsmappe*, som ikke nødvendigvis er det repo, arbejdet hører til. Arbejder man på
tværs af projekter — og det gør man her, fordi salgssiden ligger ved siden af — lander
worktreen i det forkerte repo.

**Lav worktrees i hånden fra det rigtige repo.** Så er der ingen tvivl om, hvor de kommer
fra.

## 1. Opret worktrees

```bash
cd <projektets rod>
git worktree add ../<projekt>-wt-<navn> -b <gren>
```

Ét spor = én worktree = én gren. Navngiv grenen efter arbejdet, ikke efter agenten:
`data/kina`, ikke `agent-1`. Om et halvt år siger `data/kina` stadig noget.

**Repoet skal have mindst ét commit**, ellers findes der ingen ref at forgrene fra.
Er der uindchecket arbejde på `main`, så commit det først — ellers blandes strukturen og
resultaterne sammen i flettehistorikken og bliver ulæselig.

## 2. Skriv prompten

Agenter starter **koldt**. De arver ikke denne skill, ikke projektets CLAUDE.md-regler og
ikke samtalen. Hver prompt skal derfor selv bære:

1. **Arbejdsmappen**, som absolut sti, og hvilke mapper der **ikke** må røres.
2. **Hvilke projektfiler agenten skal læse først** (`CLAUDE.md`, `PLAN.md`, `DATAMODEL.md`).
3. **Opgaven**, konkret og afgrænset. Ikke "indsaml data", men "disse otte producenter,
   efter dette skema".
4. **De hårde regler**, eller en henvisning til den skill der bærer dem.
5. **Mærk forventede tal som forudsigelser.** Et acceptkriterium skal udledes, ikke
   hårdkodes: *"samme sidetal som før dit spor, plus 2 pr. nyt sprog"*, ikke *"213 sider"*
   — det sidste bliver forkert, så snart kataloget vokser. Bærer prompten et forventet
   tal, så skriv, at det er et gæt, og at agenten skal måle og rapportere det faktiske.
   Målt 25. aug 2026: mit "177 sider" blev 175, mit "stort set alle 77" blev 33 af 77.
   Begge agenter skrev det målte tal; en mindre samvittighedsfuld ville have rettet mod
   mit gæt. Det er orkestratorens ansvar, fordi det er orkestratorens gæt.
6.–10. **Metoden peger på `spor`-skillen.** Punkterne om skill-vurdering, grundmåling,
   selv-test med tælling, selv-review, skrive-grænse, ærlig rapportering, rapportform og
   konfidensskala stod her indtil 3. sep 2026 og blev kopieret ind i hvert brief — 20 af
   21 briefs i `fund/` bar de samme otte blokke. De ligger nu i `.claude/skills/spor/`,
   som sporet kalder som sin første handling. Prompten bærer i stedet **én linje**:

   > *Kald `spor`-skillen som din første handling. Lykkes kaldet ikke fra din worktree,
   > så læs `.claude/skills/spor/SKILL.md` fra disk og skriv i rapporten, at du gjorde det.*

   Se `brief`-skillens punkt 5.–8. for, hvad prompten stadig selv skal bære.
11. **Gitignorerede forudsætninger følger ikke med i en frisk worktree.** `.env` og
    `assets/fotos/fabrikant/` mangler, og validatorens R18 giver da 54 fejl, der ligner
    agentens egne. To spor snublede samme dag (`fund/FUND-vagt.md`, `fund/FUND-eksval.md`).
    Skriv i prompten, hvad der skal kopieres ind, eller gør det før udsendelsen.
    **Og `dist/` mangler også** — den er gitignoreret byggeoutput, og 13 tests spørger, om
    en side *er bygget*. Målt 2. sep 2026 (`spor/crlf63`): grundmålingen i en frisk
    worktree gav **1384/14** mod main's **1478/1**, og de 13 ekstra røde var alle "siden
    findes"-tests. Skriv derfor i briefet: *"kør `node tools/build.mjs` FØR grundmålingen"*
    — ellers måler agenten sit miljø og rapporterer en afvigelse, der ikke er dens.
    **Byte-lighed mod en committet fil er en anden miljøfælde fra samme dag:**
    `core.autocrlf=true` checker filen ud med CRLF, mens node skriver LF — en sådan test er
    kun grøn i den worktree, der skrev filen. Normalisér `\r\n` → `\n` på begge sider.
    **`media/_kilder/` mangler også, og den fælde er dyrere end den ser ud:** et brief,
    der siger *"råkilderne findes allerede, seks filer"*, tager fejl i en frisk worktree,
    fordi hele mappen er gitignoreret. Begge fase 2-pilotspor brugte en runde på det
    2. sep 2026 — det ene gen-hentede kilderne over HTTP for at komme videre, hvilket var
    rigtigt, men gav et snapshot med en anden dato end det, dataene blev indsamlet fra.
    **Kopiér `media/_kilder/` ind sammen med `.env` og fotos** (målt: 164 MB), når sporet
    skal efterprøve et citat mod sin kilde.

12. **Diskforbruget er en egenskab ved BRIEFET, ikke ved sportypen.** Det er den vigtigste
    halvdel, og den blev opdaget ved at to sessioner lånte hinandens tal 2. sep 2026:
    ét spor blev kaldt "billigt som de andre" uden at nogen havde målt det.
    Komponenterne, målt hver for sig:

    | Post | Koster | Hvornår |
    |---|---|---|
    | worktree-kopien | ~380 MB | altid |
    | `media/_kilder/` | 164 MB | kun hvis briefet beder om kildeefterprøvning |
    | `dist/` | 68 MB | kun hvis briefet beder om et byg |
    | skærmbilleder | under 1 MB | selv en fuld runde er ubetydelig |
    | `tests/.tmp-koersel` | **2,8 GB** | **kun hvis briefet beder om `koer.mjs`** |

    Et spor, der ikke rører kode, skal have *"kør IKKE `tests/koer.mjs`"* skrevet i
    briefet — så koster det ~400 MB i stedet for 3,2 GB. Fire fase 2-spor med den linje
    kostede tilsammen 1,7 GB. **Skriv altid linjen bevidst, i den ene eller anden
    retning**, så tallet er valgt og ikke opdaget.

    **`tests/.tmp-koersel` akkumulerer IKKE pr. kørsel** — den er bundet til ~2,8 GB pr.
    worktree, der kører suiten (194 poster med scenarienavne, som overskrives). Et
    kørende spor bliver derfor ikke dyrere ved at fortsætte; det er en **ny**
    suite-kørende worktree, der koster. Et spor, der rammer ENOSPC, er **miljøet og ikke
    arbejdet** — se `fejljagt`. Og `rm -rf` står i projektets `deny`-liste, så oprydningen
    er JPK's: ingen agent kan rydde op efter sig selv.

Send alle agenter af sted **i samme svar**, ellers er de ikke parallelle.
Kør dem i baggrunden, så brugeren kan afbryde undervejs.

## 3. Mens de kører

- **Læs ikke deres transskriptionsfiler.** De er fulde JSONL-logs og fylder konteksten op.
- Vil du vide, om der er sket noget, så tæl commits i stedet — det er billigt og faktuelt:
  `git rev-list --count main..<gren>`
- **Forudsig aldrig et resultat, der ikke er kommet.** "Agenten er stadig i gang" er et
  fuldgyldigt svar.
- Arbejd videre på noget, der ikke rører de samme filer.

## 4. Flet og ryd op — se `flet`-skillen

**Denne sektion var 41 linjer indtil 3. sep 2026 og dublerede `flet`-skillen**, som blev
bygget 27. aug og siden har fået tre regler, denne kopi ikke havde: tests på det *flettede*
resultat, meld til den anden session før `koer.mjs`, og kommandoen skal stå i fletbeskeden
ved siden af tallet. Tre kopier af samme regel divergerer ved den fjerde — og her var det
allerede sket.

Hele fletprotokollen står i `.claude/skills/flet/SKILL.md`: efterprøvning efter
konfidensniveau, de tre udfald (**flet** · **flet efter rettelse** · **afvis**),
gitignorerede filer kopieret ind FØR flettet, `--force` kræver en måling, og oprydningen
af gren, `additionalDirectories` og STATUS.

Det ene, der hører hjemme her, fordi det er parallelitetens egen regel:
**et spor er ikke færdigt, før worktreen er væk.** En efterladt worktree bliver til en
gren, ingen tør slette, fordi ingen længere ved, om der lå noget i den —
`spor/retning-atlas` og `spor/retning-moerk` har ligget siden designrunden.
**Sættes en worktree bevidst på pause, skal den skrives ind i STATUS.md** med gren, sti
og indhold, målt og ikke husket.

## 5. Flytning under kørsel — gør det ikke

En worktrees `.git`-fil indeholder en **absolut sti** til hovedrepoets
`.git/worktrees/<navn>`. Flyttes hovedrepoet, mens agenter arbejder, mister de deres
git-binding og fejler først, når de skal committe — altså efter at arbejdet er gjort.

Skal repoet flyttes: vent, flet, fjern worktrees, flyt derefter.

---

## Tre fælder mere, betalt 24.-25. aug 2026

**6. Worktree ældre end en beslutnings-commit.** En agents worktree er et øjebliksbillede
af `main` ved forgreningen. Træffes en beslutning (nyt L-nummer i STATUS.md) EFTER
forgreningen, kender agenten den ikke — og en ægte besked om den nye beslutning kan blive
afvist som forsøg på manipulation, fordi agentens egen STATUS.md modsiger den. Betalt
24. aug: kand2-agenten afviste orkestratorens ægte L33-besked som "mulig injection",
fordi dens worktree var forgrenet før L33-committet. Agentens skepsis var KORREKT adfærd.
Reglerne: (a) commit friske beslutninger til `main`, FØR nye worktrees forgrenes;
(b) sendes en besked om en beslutning, agentens worktree ikke kender, så henvis til
commit-hash, og forvent at agenten arbejder videre efter den strengere af de to regler.

**7. Agentprocesser kan dø, hænge — og transcriptet kan gå tabt.** Betalt tre gange:
billedport-agenten (procesgenstart, 24. aug) og PDF-sporet (to 600s-stalls, 25. aug;
andet stall = transcript væk, ingen genoptagelse mulig). Reglerne: (a) skriv i briefet,
at agenten committer i logiske trin UNDERVEJS — en død agents ucommittede arbejde er
næsten værdiløst, fordi det er uefterprøvet; (b) i hente-/PDF-tunge opgaver: læs store
filer i små bidder (PDF: `pages`, 3-5 sider pr. kald) og VENT ALDRIG på retries — ét
ekstra forsøg, videre med note; (c) dør en agent alligevel: mål efterladenskaberne
(`git status`, `git diff`, evidensmapper), og skriv i efterfølgerens brief, at arvet
halvarbejde skal efterprøves linje for linje mod kilden, før noget beholdes.

**8. Gitignorerede leverancer følger ikke med grenen.** Flettet henter kun det
committede; evidensmapper, fotos og manifester skal kopieres i hånden af orkestratoren.
For akkumulerende filer (MANIFEST.tsv, logs): agenten afleverer NYE RÆKKER, aldrig hele
filen, og orkestratoren beviser med `head -N | diff` at de eksisterende rækker er urørte,
FØR delta'et appendes. Betalt 24. aug: 219 rækkers proveniens overskrevet med en 3-linjers
fil; kun 87,9 % kunne genskabes. Fuld historik: `fund/FUND-manifest.md`.

---

## Hvornår det ikke betaler sig

Parallelisering koster en fuld prompt pr. agent, og agenter deler ikke opdagelser
undervejs. Del kun op, når sporene er **reelt uafhængige**. To agenter, der begge skal
bruge det samme svar for at komme videre, er langsommere end én.
