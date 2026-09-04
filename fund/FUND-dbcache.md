# FUND — spor/dbcache

## Baseline (før nogen kodeændring), målt på `7b169b7` i denne worktree

```
node tools/validate.mjs      -> 77 fil(er) · 0 fejl · 1 advarsler   (matcher briefet)
node tools/build.mjs         -> 216 sider · 1.111 tal med kilde · 0 uden   (matcher briefet)
node tests/koer.mjs          -> 1817 bestaaet, 6 fejlet   (matcher briefet, samme 6 navngivne)
                                 vaegur: 166,193 s (Å178 skoennede ~2 min; det er 2:46)
```

## Punkt 1 — negativ kontrol, KØRT FØR ændringen

```
SUPABASE_URL=https://ugyldig.invalid node tools/build.mjs --ud=tests/.tmp-koersel/negativ-foer
```
Output: `Kunne ikke hente robotter fra databasen: fetch failed`
Exit: **1**. Sider i `negativ-foer/`: **0**.

Matcher briefets påstand præcist. Denne måling er ankeret for punkt 1 —
efter kodeændringen skal SAMME kommando give SAMME tre ting.
