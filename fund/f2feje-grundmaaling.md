# Grundmåling — spor/f2-feje, 3. sep 2026

Kørt FØR nogen ændring. Kommandoer genkørbare fra worktree-roden.

## `--dansk` pr. producent

```
"/c/Program Files/nodejs/node.exe" db/fase2-tjek.mjs --dansk --producent="<navn>"
```

| Producent | note_wording | quote | quote_wording | I alt |
|---|---|---|---|---|
| GENISOM AI | 9 | 20 | 20 | **49** |
| Astrall Dynamics | 1 | 1 | 1 | **3** |
| CVTE | 1 | 1 | 1 | **3** |
| Yufan Intelligent | 1 | 1 | 1 | **3** |
| Xiaomi | 2 | 0 | 0 | **2** |

**Sum: 60.** Matcher briefets afsnit 2 og 8.1 præcist.

Alle andre kolonner (caveat, caveat_wording, applications.note, images.note,
images.alt, robots.notes, robots.notes_wording) gav **0** danske for alle fem
producenter — bekræfter briefets diagnose "intet er tilbage i caveat".

## `--tal` pr. producent — SAMLET AFTRYK

```
"/c/Program Files/nodejs/node.exe" db/fase2-tjek.mjs --tal --producent="<navn>"
```

| Producent | Aftryk (matcher briefets afsnit 3) |
|---|---|
| GENISOM AI | `a5a7e5d4617a3a52a910b018fbefb18a3deaac47b2093202e730227625b91e7c` |
| Astrall Dynamics | `48b0051c4ad447de281d35e1bd9495abeb739dc2a1e6be5b3094e23375828548` |
| CVTE | `6426ca180abd267e38bbc290de691bee3e951948bb708216f55064f48e296d79` |
| Yufan Intelligent | `0de112305d08e41528693e296153f5377929459434a52e3bcbc85f04dfb6cc82` |
| Xiaomi | `057a9bc8cf39c6caa934475b8bcb84d65626acff87c1403aa368054bb64e5fa2` |

Alle fem identiske med briefets tabel. Ingen afvigelse.

## `change_log` FØR — kontrollinje for acceptkriterium 3

```
curl -s -H "apikey: $SB_KEY" -H "Authorization: Bearer $SB_KEY" \
  -H "Prefer: count=exact" -H "Range: 0-0" -o /dev/null -D - \
  "$SB_URL/rest/v1/change_log?changed_by=eq.spor/f2-feje&select=id" | grep -i content-range
```

Svar: `Content-Range: */0` — **0 rækker**, som forventet (intet skrevet endnu).

## Miljø-forudsætninger, efterprøvet

- `.env`: findes (122 bytes).
- `assets/fotos/fabrikant/`: 610 filer (matcher facit).
- `media/_kilder/`: 21 mapper (briefet sagde 19 — afvigelse, se rapport).
- `dist/`: mangler. Ikke bygget — bruges ikke af dette spor (ingen build/tests køres).
