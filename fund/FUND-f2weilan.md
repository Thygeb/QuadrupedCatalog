# FUND — spor/f2weilan

**Skills:** `spor` + `robotdata` (begge kaldt, virkede fra worktree, ingen
disk-fallback nødvendig). **Fravalgt:** `supabase` (skrivevejen er allerede
struktureret af `db/f2-skriv.mjs`), `fejljagt` (intet uventet), `design`
(intet visuelt).

## Grundmåling — genmålt, matcher briefet præcis
`node fund/_maal-f2weilan.mjs`: WEILAN 36/2 robotter/2 med citat/1 kilde ·
Youbaote 24/3 robotter/0 med citat/1 kilde · i alt 60. Ingen afvigelse.

**Valgt/fravalgt:** for de 58 uden citat, kildens egen bærende sætning ordret
på kildens sprog (Å156), fravalgt oversættelse/normalisering. For de 2 med
citat (`weilan-alphadog-c500`/`-c501`, felt `speed`): udskilt den allerede
citerede streng `"up to"` ordret, fravalgt omskrivning.

## 3b — WEILAN (34/34 skrevet, 2/36 uden kildeordlyd)
**Fund:** WEILANs kinesiske sider 404'er alle tre steder (MANIFEST: `alphadogc.html`,
`alphadoge.html`, `robots.html`, alle `zh-CN`). Kilden
`weilan.com/en/en/alphadogc.html` er derfor producentens ENESTE sprogversion
— ikke en oversættelse af noget kinesisk — så `caveat_wording` er engelsk,
som siden selv er. 32 rækker: label+værdi fra spec-tabellen (fx `"Weight:
24Kg"`), samme "LABEL: VÆRDI"-facon som allerede i databasen (addverb-trakr-5).
2 rækker (`price`, begge robotter): ingen kildeordlyd — se tabel nedenfor.

## 3b — Shandong Youbaote (24/24 skrevet, ALLE på kinesisk)
**Fund, matcher Å156 direkte:** kilde-URL'en har `/en/` i stien, men
Y10/Y20/e-Dog-fanernes tekniske indhold er selv rent kinesisk — kun menuen er
engelsk. Havde jeg stolet på URL'en frem for at læse siden, var alle 24
rækker blevet fejlagtigt sat på engelsk. Udtrukket **programmatisk**
(linjenummer → streng, `fund/_byg-opdater-youbaote.mjs`) fra den lokale kopi
af raa-HTML'en, for at undgå håndafskrift-fejl i CJK-tegn.

**Skrivning** (dry-run så `--skriv`): `node db/f2-skriv.mjs
fund/_opdater-f2weilan-weilan.json --skriv` → 34 skrevet ·
`...-youbaote.json --skriv` → 24 skrevet.

## Acceptkriterier
**P1:** `60 − 58 = 2`, matcher slutmåling (`I ALT: 2`). **Høj** (genkørbar
kommando; kontrafaktisk: en oversprunget række ville give >2).
**P2, caveat uændret:** bevist strukturelt — begge JSON-filer har KUN
nøglen `caveat_wording` i `saet` (script-scannet, 0 forekomster af `caveat`).
WEILAN 36→36. Youbaote gav 24→25 ved 1. måling: undersøgt, se fælde 2. **Høj.**
**P3, change_log:** `changed_by='spor/f2weilan'` → 58 rækker, alle
`field_entries`, robot_id ∈ {2244,2245,2251,2252,2253} — 0 udenfor mine 5.
**Høj**, kommando kørt og tal gengivet ovenfor.

**Selv-tjek:** efterprøvet 58 skrevne rækker ved frisk DB-læsning. **0 fejl.**

## Rækker uden kildeordlyd
| robot_id | felt | caveat (kort) | søgt i |
|---|---|---|---|
| 2244 | price | "order page discloses no prices... email" | `alphadogc.html` (0 træf) + `order.html` (kun "Please contact us via email") |
| 2245 | price | samme | samme |

`order.html` viser faktisk priser for C100/C200/E300/E400L, bare ikke for
C500/C501 — at skrive kontaktlinjen som `caveat_wording` ville strække
"ordret bærer forbeholdet" for langt. Meldt uden citat.

## Nye fælder og opdagelser
1. **`price`-rækkernes `source`-kolonne peger på den forkerte side** —
   `alphadogc.html`, mens caveat-teksten beskriver `order.html`. Ikke rettet
   (uden for mit mandat), men bør rettes hvis `source` skal bruges til
   automatisk konsistenskontrol.
2. **En 25. Youbaote-række havde allerede `caveat_wording`** fra en gren
   `spor/f2-weilanyoubaote` (ikke `f2han`/`f2pudu`): `yobotics-y20`/`weight` =
   `"含电池"` ("inkl. batteri" — ufuldstændigt). Lå udenfor mine 60 fra
   starten (begge grundmålinger udelod den), rørt af mig 0 gange — men
   branch-navnet matcher intet i briefet og bør undersøges.
3. **URL'en lyver om sproget:** `yobotics.cn/en/...` har rent kinesisk
   specifikationsindhold under en `/en/`-sti — kun menuen er engelsk.

## Punkter i briefet, jeg ikke nåede
Ingen. 58/60 skrevet, 2/60 dokumenteret som umulige uden opdigtning.

## MANIFEST / råkilde
Intet nyt hentet — alle kilder lå allerede i
`media/_kilder/raa-kina-weilan-xiaomi-2026-08-19/` (kopieret ind ved sporets
start). Intet at redde ved fjernelse af worktreen.
