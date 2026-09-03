# FUND — spor/f2-feje: citatkolonnerne hos de spor, der meldte færdigt

**Skill:** `spor` (kaldt fra worktree — LYKKEDES, ingen disk-fallback nødvendig). Vurderet og
fravalgt: `robotdata` (feltskema/G1 er ikke relevant — jeg rører kun `applications`-tabellens
tekstfelter, ikke robotposternes YAML-felter), `supabase` (generel MCP-fejlfinding, ikke i spil —
`db/f2-skriv.mjs`/`fase2-tjek.mjs` dækkede alt), `fejljagt` (intet uventet at jage — se dog "Nye
fælder" for den ene reelle overraskelse).

## Ændringen, konkret

| Producent | Felt | Før | Efter |
|---|---|---|---|
| GENISOM AI (9 robotter) | `note_wording` | Dansk paragraf-oversættelse af `note` | Engelsk (= `note`'s egen tekst) |
| GENISOM AI | `quote`/`quote_wording` (33+33 celler) | Dansk+kinesisk blandet i én streng | quote=engelsk, quote_wording=ren kinesisk, verificeret ordret mod HTML |
| Astrall/CVTE/Yufan (1 robot hver) | samme 3 felter | samme mønster | samme fix |
| Xiaomi (2 robotter) | `note_wording` kun | Dansk "intet fundet" | Engelsk, samme indhold (`quote`/`quote_wording` er `null`) |

**Talkolonner er IKKE rørt** — kun de tre tekstfelter ovenfor.

## Valgt løsning / fravalgt

- **quote/quote_wording:** quote=vores engelske gengivelse, quote_wording=kildens ord ordret,
  samme mønster som `caveat`/`caveat_wording` (OPSKRIFT-fase2-cjk.md). Fravalgt: briefets
  bogstavelige "find kildens engelske ord" — GENISOMs råkilder er 100 % kinesiske (0 træf på
  engelske anvendelses-fraser i alle html/txt-filer), så kildens ord er kinesisk.
- **note_wording:** IKKE omstruktureret. Min første udgave reducerede paragraffen til en kort
  kilde-etikette — det ER en omstrukturering, briefets afsnit 7 forbyder ("du vil møde det: 20
  par hos GENISOM alene… omstrukturér ikke"). Rettet: `note_wording` bærer nu den fulde
  reasoning-paragraf oversat, som nu er ordret lig `note`. Fravalgt: at slette den som
  overflødig — samme forbud. **Flagget til JPK, ikke besluttet af mig.**

## Konfidens pr. punkt

1. **60/60 celler renset** — høj. `node db/fase2-tjek.mjs --dansk --producent="<navn>"` giver 0
   for alle fem. Forkert arbejde ville stadig vise 49/3/3/3/2.
2. **5/5 talaftryk uændrede** — høj. `--tal` giver samme SHA-256 som grundmålingen for alle fem.
3. **0 rækker uden for mine 14 robotter** — høj. `change_log` (`changed_by='spor/f2-feje'`)
   giver 23 rækker (9+9+5, to GENISOM-skrivninger + fire-producent-skrivningen), alle i tabellen
   `applications`, alle blandt mine 14 robot_id'er. Et fremmed id ville dukke op — det gør ikke.
4. **UTF-8/indhold-troskab** — høj. `node fund/f2feje-utf8-tjek.mjs`: 38/38 kolonner identiske
   mellem sendt og læst-tilbage, 0 afvigelser.
5. **Citatpar:** 36 undersøgt (33 GENISOM + 1×3), alle 36 fundet ordret i råkilden (mekanisk,
   `verificer()`-kaldene i payload-scripterne kaster ved afvigelse). 0 slettet under L87.
6. **Gennemlæsning ud over instrumentet:** 579 celler over 10 kolonner, 251 korte uflagede —
   180 af dem i URØRTE kolonner (`caveat` m.fl.), 0 danske. Konfidens middel (øjne, ikke facit).

## Usikkerheder

- **Afsnit 7's spørgsmål er STADIG åbent.** `note_wording` er nu bogstaveligt identisk med
  `note` for 9+1 robotter — en reel duplikering, flagget, ikke rettet af mig.
- Astrall/CVTE's `note_wording` er egen term-mapping-begrundelse, ikke et kildecitat — samme
  afsnit-7-forbehold.

## Målingerne som tal

Grundmåling (før): **60** danske celler (49+3+3+3+2). Efter: **0**. Talaftryk: **5/5** uændrede.
`change_log`: **0** før, **23** efter, 0 uden for mine 14 robot_id'er. Citatpar: **36**
efterprøvet, **36** fundet, **0** slettet. Gennemlæsning: **579** celler, **251** korte
uflagede, **0** danske i de 180 urørte.

## Nye fælder og opdagelser

1. **Briefets "find kildens engelske ord" holdt ikke for GENISOM.** Målt: 0 træf på engelske
   anvendelses-fraser ("application scenario", "reconnaissance", "firefighting", "inspection
   robot", "security patrol") i NOGEN af GENISOMs 25+ råkildefiler — trods et `/en/`-link på
   sitet, som ALDRIG blev hentet i noget snapshot. Kildens ord er kinesiske, ikke engelske.
   Fulgte i stedet OPSKRIFT-fase2-cjk.md's etablerede mønster (wording=kilde-ordret,
   prosa=engelsk gengivelse), som ER verificeret mod råkilden.
2. **Jeg omstrukturerede selv `note_wording` i første omgang** — reducerede en reasoning-paragraf
   til en kort etikette, hvilket briefets afsnit 7 udtrykkeligt forbyder. Fanget ved en
   fornyet læsning af briefet MIDT i arbejdet (før commit til databasen), rettet, og en
   corrigerende skrivning sendt. Ingen forkert data nåede at stå i databasen længe (opdaget
   mellem tørløb og `--skriv`), men det er en advarsel til næste spor: læs afsnit 7 IGEN, når du
   sidder med de faktiske celler, ikke kun ved briefingen.
3. **CVTE har en ægte engelsk kildeside** (`cvte-maxhub-x7-nyhed-en-2026-08-24.html`), men den
   bærer IKKE den korte anvendelses-sætning ordret — det er en anden, længere pressemeddelelse.
   Ingen genvej der.
4. **`media/_kilder/` havde 21 mapper i min worktree, ikke 19** som `CLAUDE.md`s generelle
   værktøjsafsnit nævner (det tal gælder projektet generelt, ikke specifikt dette brief — ingen
   reel afvigelse, men værd at notere for næste spor, der læser det tal og forventer et match).

## Punkter i briefet, jeg ikke nåede

Ingen. Alle fem producenter er færdige, alle acceptkriterier i afsnit 8 er opfyldt og målt.
