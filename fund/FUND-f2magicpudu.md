# FUND — spor/f2-magicpudu: MagicLab og Pudu Robotics fra dansk til engelsk

**Skill:** `spor` kaldt via Skill-værktøjet (lykkedes, loadede fra disk i
denne worktree). `robotdata` G1 læst direkte fra disk (grep), ikke kaldt som
skill — indholdet var nok. `supabase` fravalgt: ren tekst-PATCH via
projektets eget `db/f2-skriv.mjs`, intet skema-/RLS-arbejde. `fejljagt` ikke
brugt — intet målte uventet.

**Ændring:** MagicLab (4 robotter, 69 celler) og Pudu Robotics (2 robotter,
35 celler) — alt dansk i `caveat`/`applications.note`/`note_wording`/
`robots.notes` oversat til engelsk. Ingen tal, ingen `caveat_class`, ingen
`value_text` rørt.

## Valgt/fravalgt

- `OPSKRIFT-fase2.md` (engelsk), IKKE cjk-varianten — målt: alle kilder
  100 % engelske, 0 CJK-tegn i det citerede.
- **Pudus kilder:** briefets gæt (`raa-producenter-resten-2026-08-19/`) var
  FORKERT. Fundet i `media/_kilder/raa-kand1a-2026-08-24/` (storeside/
  officielside/prnewswire, MANIFEST.tsv bekræfter).

## Målt (kommandoer: `node db/fase2-tjek.mjs --dansk|--tal --producent=…`)

| | MagicLab | Pudu Robotics |
|---|---|---|
| Danske celler før → efter | 69 → **0** | 35 → **0** |
| Talaftryk før → efter | 596709…dc3977d → **uændret** | bb0e94…305f08d → **uændret** |

Begge matcher briefets tal præcist — ingen afvigelse.

## Efterprøvning af citater

MagicLab: 28 fragmenter kontrolleret mod `raa-kina-deep-magic-2026-08-19/`
(`fund/f2magicpudu-magiclab-efterproevning.md`). Pudu: 21 fragmenter mod
`raa-kand1a-2026-08-24/` (`fund/f2magicpudu-pudu-efterproevning.md`). **49 i
alt, 0 ikke fundet.** Stikprøve af citerede/etiket-agtige stumper, ikke hver
analytisk sætning — metodenoter om selve indsamlingen kan ikke grep'es mod
HTML. 0 påstande måtte slettes under L87 (kasse D).

## Skrivning (kommando: `node db/f2-skriv.mjs <fil> --skriv`)

61 poster MagicLab (robots 4, applications 4, field_entries 53), 34 Pudu
(robots 1, applications 2, field_entries 31) — 95 i alt. `change_log`:
0 → 61 → 95, matcher præcist. Fuld kolonnediff før/efter på alle 198
field_entries-rækker: **0 uventede ændringer** uden for {caveat,
collected_by, change_reason}. Acceptkriterium 4: 0 change_log-rækker uden
for MagicLab/Pudu Robotics, ud af 95.

## Selv-læsning

104 tekster skrevet af mig direkte (ikke maskinoversat), læst under
skrivning. Automatisk detektor på de faktiske JSON-nyttelaster: 69+35=104
læst, **0 fejl fundet**.

## Konfidens

- **Høj:** dansk=0 begge producenter (kommando ovenfor). Var arbejdet
  forkert, ville tallet være >0 (var 69/35 før).
- **Høj:** talaftryk uændret. Var et tal rørt, ville aftrykket afvige.
- **Høj:** 0 change_log-rækker uden for de to — `node
  fund/f2magicpudu-changelog-ejerskab.mjs "spor/f2-magicpudu"`.
- **Middel:** citatverifikation — stikprøve, ikke udtømmende.

## Usikkerheder

`applications.note_wording` (2222) blandede narrativ dansk med et citat.
L87 siger ordlydsfelter bør bære KUN kildens ord — jeg oversatte hele
sætningen frem for at omstrukturere til rent citat, da det ikke var
briefets eksplicitte bestilling. Flagget nedenfor.

## Nye fælder og opdagelser

1. Pudus kildemappe var IKKE der, briefet gættede — se "Valgt/fravalgt".
2. `applications.note_wording` (2222) er strukturelt narrativ+citat blandet,
   ikke ren ordlyd — opskriften bør nævne dette mønster for note_wording/
   quote_wording, ikke kun caveat_wording.
3. Eksisterende afvigelse i DB, ikke rettet: MagicLab weight-caveat
   (2219/2220) skriver "Net Weight, Excluding Battery" (komma); kilden
   skriver "(Excluding Battery)" (parentes) — fandtes før dette spor.
4. `applications.note` for 2222 er tilsyneladende afkortet i eksisterende
   DB-data ("… (CN:)." uden indhold) vs. `note_wording`s fulde sætning.
   Ikke rettet (uden for scope), men flages.
5. `value_text` (lidar/cameras/autonomy_level hos Pudu) er STADIG dansk,
   bevidst — uden for `TEKSTKOLONNE_HVIDLISTE`, egen arbejdsbunke jf.
   OPSKRIFT-fase2.md §6.4.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks trin gennemført for begge producenter, alle fire
acceptkriterier målt og bestået.
