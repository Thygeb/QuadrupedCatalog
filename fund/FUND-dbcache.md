# FUND — spor/dbcache

Fuld udredning pr. punkt står i commits `486f9ba`/`b138779`/`8077122`.

## 1. Valgt løsning / fravalgt alternativ

Proces-krydsende cache af `fraDb()`s RAA svar, bag `QUAD_DBCACHE_FIL` (kun
sat af `tests/koer.mjs`), fil under `tests/.tmp-koersel/db-raa-cache.json`.
**Fravalgt:** en ny mappe uden for `tests/.tmp-*/` — ville kræve sin egen
sletningslogik; den valgte sti genbruger `koer.mjs`s eksisterende
`rmSync/mkdirSync`, som løser punkt 5 (stale cache) uden ny kode.

## 2. Konfidens pr. punkt — alle HØJ (genkørbar kommando + kontrafaktisk)

- **P1** (negativ kontrol): `SUPABASE_URL=<ugyldig> node tools/build.mjs`
  gav exit 1/0 sider/`fetch failed` FØR og EFTER, ordret ens. Kontrafaktisk:
  uden variablen følges cache-grenen aldrig (`CACHE_FIL` er `null`) — en
  fejlimplementering (varm som standard) ville have bygget 216 sider her.
- **P2** (krydsprocessuel): kald 1 skrev cachen; kald 2 **med en ugyldig
  `SUPABASE_URL`** læste alligevel 77 robotter fra filen. Kontrafaktisk: uden
  cachefilen ville kald 2 kaste `fetch failed` — det gjorde den ikke.
- **P3** (1 kald, ikke 39): midlertidig log i fetch-grenen, fjernet efter
  måling. `wc -l` af loggen efter fuld suite = **1**. Brief-tallet "39 i dag"
  genmålt uafhængigt (samme balanceret-parentes-metode): 56 kald i alt · 17
  med `--data=` · **39 uden** · 38 filer — matcher briefet på alle fire tal.
- **P4** (bygget uændret): tre byg (uden / koldt / varmt cache), alle
  216/216 sider. `diff -rq` mod hinanden = **0**. Kontrafaktisk KØRT: indsat
  linje → **2** (ikke briefets 3 — jeg brugte `-rq` ikke `-r`; retningen
  0→>0 er beviset), fjernet igen → **0**.
- **P5** (ingen stale cache — den farligste): koersel 1 skrev cachen
  (`"navn":"Trakr 20"`). Rettede PÅ DISK til `"TAMPERED-XYZ"`, efterprøvet
  med `grep`. Koersel 2 gav **samme 1817/6**, og `TAMPERED` findes **0**
  steder bagefter — `koer.mjs`s `rmSync(tmp)` sletter cachefilen FØR noget
  kald i den nye suite kan læse den.
- **P6+7** (samme resultat, hurtigere): 1817/6 begge gange, samme 6
  navngivne fejl ordret. Vægur **166,193 s → 111,386 s** (55 s/33 %
  hurtigere — mindre end mit gæt ~44 s, fordi `byggRobotDoc` m.fl. stadig
  køres 39 gange). Begge tal målt med `time`, ikke Å178s skøn.

## 3. Usikkerheder

- Genmålte IKKE "39" ved at køre den UÆNDREDE kode med instrumentering
  (endnu en ~166 s kørsel på et trangt drev) — i stedet statisk
  parentesmatch, som gav identiske tal. Middel på den ene sammenligning;
  P3's egentlige facit (**1**, efter ændringen) er direkte målt.
- Disken var ved 11 GB frit (briefet sagde ~20), formentlig fordi
  `spor/opdel` kørte parallelt. Ingen ENOSPC ramte mig, men margen var tynd.

## 4. Målingerne som tal

```
validate.mjs         77/0/1 advarsel        (før = efter, urørt)
build.mjs (DB-vej)    216 sider/1.111/0     (før = efter, urørt)
koer.mjs FØR          1817/6, 166,193 s
koer.mjs EFTER        1817/6, 111,386 s
fetch-taelling EFTER  1  (FØR, statisk genmålt: 39)
diff dist FØR/EFTER   0 / 2 (kontrafaktisk) / 0
stale-cache-forsøg    0 forekomster af den forfalskede værdi efter koersel 2
```

## Nye fælder og opdagelser

- **Briefet var ikke i min worktree.** `fund/BRIEF-dbcache.md` blev committet
  til `main` (`6eba534`) EFTER min worktrees base (`7b169b7`) blev skåret —
  filen fandtes slet ikke lokalt. Løst med `git show 6eba534:fund/BRIEF-dbcache.md`
  fra det delte objektlager (ingen rørte hovedrepoets arbejdstræ). Værd at
  vide for fremtidige spor: en worktree kan mangle sit eget brief, hvis
  orkestratoren committer det til `main` efter `git worktree add`.
- **MSYS-stier (`/c/...`) givet til `node.exe` via en env-var virker IKKE
  som forventet** — Node på Windows tolker `/c/Praktik/...` som en sti under
  aktuelt drevs rod (`C:\c\Praktik\...`), ikke driv-C. Ramte kun mit manuelle
  testscript (env-var sat i selve bash-kommandoen), ikke den rigtige kode —
  `tests/koer.mjs` bygger stien med Node's egen `path.join(rod, ...)`, som
  giver et korrekt `C:\...`-format. Værd at kende, hvis et fremtidigt spor
  sætter en filsti-env-var direkte fra bash i stedet for i selve JS-koden.
- `spawnSync`/`execFileSync` i `tests/dele/` er alle SYNKRONE, og
  test-løkken i `koer.mjs` kører sekventielt (`for...of` + `await`) — ingen
  parallelle `build.mjs`-processer kan skrive cachefilen samtidig. Ingen
  lock/atomic-write var nødvendig.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle syv acceptkriterier er målt, kontrafaktisk hvor krævet, og
committet i rækkefølgen briefet angav.
