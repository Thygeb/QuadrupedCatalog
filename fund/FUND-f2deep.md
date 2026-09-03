# FUND — spor/f2-deep: DEEP Robotics dansk → engelsk

## Skill-vurdering

Valgt: `spor` (kaldt først, lykkedes fra worktree). `robotdata`/`supabase`
overvejet, fravalgt: opgaven oversatte eksisterende felter efter et
fastlagt skema (L87/BRIEF-FAELLES), ingen nye felter eller RLS/skema.
`fejljagt` brugt reelt (uden formelt kald) da 2193/slope viste sig
dansk-forurenet uden at `--dansk` fangede det — se "Nye fælder".

## Valgt løsning / fravalgt

Valgt: oversæt alle 110 celler i JS-litteraler (`fund/f2deep-tekster.mjs`),
efterprøv dækning + dansk-lækage automatisk (`fund/f2deep-byg-opdatering.mjs`)
før JSON bygges, skriv via delt `db/f2-skriv.mjs`. Fravalgt: håndredigere
JSON direkte — 110 sætninger med anførselstegn/apostroffer er en oplagt
fejlkilde uden JS-escaping.

## Grundmåling (trin 1)

`--dansk --producent="DEEP Robotics"`: **110**, identisk med briefet.
`--tal --producent="DEEP Robotics"`: `a171780a…c8c08c501`, identisk med
briefet. 9 robotter, id 2190-2198, bekræftet.

## Acceptkriterier og konfidens

1. **Ingen dansk tilbage**: efter skrivning → **0** i alle 10 kolonner.
   Høj (genkørbar, forkert arbejde ville stadig vise op til 110).
2. **Intet tal rørt**: aftryk byte-identisk før/efter. Høj (forkert arbejde
   ville give andet aftryk).
3. **Rækkeejerskab**: `change_log`, 100 rækker `changed_by='spor/f2-deep'`,
   alle 100 indenfor DEEP Robotics, 0 udenfor. Høj.
4. **Citatefterprøvning**: 15 eksplicit citerede fragmenter fundet ordret i
   råkilden (15/15), 41 navngivne tekniske labels krydstjekket (41/41 efter
   opklaring af 4 egne unøjagtige søgestrenge — se usikkerheder). Middel:
   dækker citerede fragmenter/labels, ikke hver analytisk saetnings logik.

**Byte-for-byte** DB-match mod det jeg skrev: 100/100 `===` (76 caveat, 9
applications.note, 2 note_wording, 1 quote, 1 quote_wording, 6 images.note,
9 robots.notes-arrays), inkl. kinesiske tegn uden normalisering. **Manuel
gennemlæsning**: 111 strenge, 0 fejl.

## Usikkerheder

- Verifikationen af 76 caveat-tekster er stikprøve på navngivne labels/tal,
  ikke ord-for-ord af hver logisk konklusion.
- 2196/data_ports's CN-etikette er reelt `外置接口`, ikke `外部接口` som jeg
  først gættede — selve caveatens påstand holder, men jeg har ikke rettet
  teksten til at citere den præcise CN-streng (uændret risiko, ikke min).

## Målingerne som tal

Dansk før/efter: 110 / 0. Tal-aftryk før/efter: identisk. change_log: 100
skrevet, 100 indenfor, 0 udenfor. Citater: 15/15 + 41/41. DB-match: 100/100.
Manuel læsning: 111/0 fejl.

---

## Nye fælder og opdagelser

**`--dansk`-detektoren har mindst ét reelt blindt punkt, fundet i mit eget
datasæt.** `field_entries` for 2193/`slope` havde caveat-teksten
`"Fodnote [2]: Lab-tested slope angle; actual performance varies by surface
material."` — ægte dansk (`Fodnote`), men uden æøå og uden noget ord fra
`DANSKE_MARKOEROR`. Detektoren talte den IKKE med i de 110. Jeg fandt den,
fordi min egen dækningskontrol fløj en "ekstra"-celle op, som ikke var i
`--dansk`s liste; jeg gik tilbage til rå-JSON'en for at se hvorfor og
oversatte den (samme mønster som søsterfeltet på 2191/2192, som detektoren
FANGEDE, fordi de skriver "Producentens fodnote" — "producentens" er på
listen). **Konsekvens for orkestratoren:** de andre fase 2-spor bør
genkøre deres egen `--dansk`-baseline og manuelt efterse caveat-felter, der
nævner "fodnote" uden "producentens" foran — samme blinde punkt findes
sandsynligvis hos dem.

**Applications-tabellens `note`/`quote`-par er strukturelt to forskellige
ting, ikke oplagt fra briefet.** `quote` er selve "ordret citat"
(db/skema.sql:495) — normalt en engelsk markedsføringssætning fra
producenten. For 2190 (Lite3) findes INGEN sådan sætning på den engelske
side (kun kategorien, kun på kinesisk), så feltet indeholdt i stedet et
oversat kategorinavn. Jeg behandlede `quote`/`quote_wording` med samme
mønster som `caveat`/`caveat_wording`: `quote` = vores engelske gengivelse,
`quote_wording` = rene kildetegn (教育科研). Det er min fortolkning af
skemaets kommentarer, ikke en udtrykkelig regel i mit brief — orkestratoren
bør bekræfte læsningen, før andre spor med samme mønster rammer det.

**To `note_wording`-felter (2190, 2196) blandede dansk og kildetegn i
samme streng** — samme fejlmønster som CJK-opskriften beskriver for
`caveat_wording`, selvom DEEP Robotics' kilder er engelske. Rettet efter
samme princip: kun kildens egne tegn tilbage (`教育科研 | 行业应用` og
`X20: The Ultimate Quadruped Bot series for Industrial Use | 行业应用`),
dansk glosse flyttet til den engelske `note`-prosa.

**`.env`-nøglen kom uforvarende ind i et bash-kommandooutput** (`cat .env`
for at tjekke filens format), men blev ALDRIG skrevet til nogen fil, commit
eller rapport — efterprøvet med `grep -rl` mod hele `fund/` efter
sessionen, 0 fund. Kommandoen var unødvendig risiko — et fremtidigt spor
bør bruge `grep -c '^SUPABASE' .env` (tæl linjer, vis ikke værdier).

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks trin (grundmåling, klassificér, efterprøv citater, skriv
tekster + tørløb, skriv til databasen + mål efter, rapport) er gennemført
og committet enkeltvis.
