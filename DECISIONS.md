# Decisions

A running log of notable decisions made while developing this app, and the
reasoning behind them — so future sessions don't relitigate settled questions
without knowing why they were settled. Newest entries at the top.

## 2026-06-10 — Added §16 (Subjunctive & Imperative consolidated module)

**Decision:** Added §16, gathering the subjunctive material already scattered
across §§2–5 (NOR/NOR-NORI/NOR-NORK Subjuntiboa grids) into one
cross-referenced module, plus two genuinely new pieces: a `NOR-NORI-NORK`
Subjunctive Present grid (`NORI`=`hari`/`haiei` rows, derived from §5's
verified `Ahalera Orainaldia` ditransitive root by dropping `-ke-` and
applying §3's Subjuntiboa `-n`-family suffixes — cross-checked against the
recognizable forms `diezaiodan`/`diezaion`/`diezaiegun`/`diezazkion`), and a
`NOR-NORI-NORK` Imperative grid (root = the subjunctive root minus `d-`,
mirroring `dezazu`→`ezazu`), plus a synthetic-imperative table, a full
`NOR-NORK` imperative grid, and a syntax/usage section (final clauses,
volitional clauses, indirect commands, the Radical/Bare-Stem Rule, and a PCC
re-verification for these moods).

**Scope decisions:**
- `NOR-NORI-NORK` subjunctive **past** is explicitly *not* tabulated —
  derivable by the same recipe (`niezaiokeen` → `niezaioen`), but forms this
  deep in the ditransitive paradigm are unattested/vanishingly rare even in
  formal registers; real usage reaches for a periphrastic alternative first.
  Same "honest gap" posture as `etzan`/`ikusi`/`entzun`.
- `NOR-NORI-NORK` subjunctive `niri`/`guri`/`zuri`/`zuei` rows follow the
  identical recipe but aren't tabulated — left for a future pass.
- A literal reading of the source request's example forms included `badi` for
  `izan`'s 3rd-person imperative — that form doesn't exist in standard Batua,
  so used `bedi` (already established in §2) instead of introducing a second,
  incorrect form.
- `etorri`/`joan` 3rd-person jussives are given periphrastically (`etor
  bedi`, `joan bedi`) rather than guessing at synthetic `betor`/`bihoa`-type
  forms with no source — this also doubles as the Radical/Bare-Stem Rule's
  clearest example.

## 2026-06-10 — Added §14 (Non-finite forms) and §15 (Passive/"Nor-shift"), appended at end of document

**Decision:** Added two new closing sections rather than interleaving this
material into existing sections. §14 catalogues the non-finite jobs the
existing perfective/imperfective stems already do outside a finite clause —
verbal nouns (`-tea`/`-teari`/`-teagatik`/`-teko`/`-tean`), participles as
attributive adjectives (`-tako`) vs. resultative predicates (`-a` + `izan`,
e.g. `etorria da` vs. `etorri da`), and modal/instrumental adverbials (`-z`).
§15 explains Basque's lack of dedicated passive morphology and the "nor-shift"
that substitutes for it: drop `NORK`, swap `ukan`→`izan` on the same
participle (`Nik atea ireki dut` → `Atea ireki da`).

**On accuracy for §15:** rather than presenting `ireki da`-type forms as a
clean passive, the section explicitly splits the reading in two —
**anticausative** for change-of-state verbs (`ireki`/`hautsi`/`itzali`, "the
door opened (by itself)") vs. **impersonal/generic** for verbs without that
alternation (`hitz egiten da` = "Basque is spoken (here)"), since collapsing
these would overstate how passive-like `ireki da` actually feels to a native
speaker. The genuinely agentive analytic passive (`-a`/`-ak` + conjugated
`izan`, e.g. `irekia izan da`) is included for completeness but flagged as the
least idiomatic of the three options — included because the task asked for
it, not because it's the recommended form for the app.

**Numbering note:** §13's text already had a forward reference to "`(§14)`"
for `ukan`/`izan` participles (written during an earlier pass), which lines
up with this placement — no renumbering needed for these two new sections.

## 2026-06-10 — Filled §5's missing "Ahalera, Alegiazkoa (ditransitive)" hypothetical-potential grid; confirmed §4's NOR-NORI side already covered

**Decision:** §4 (`izan` + dative, NOR-NORI) already had a "Potentziala —
Hypothetical" subsection (`le-`/`lekioke`-type forms) — that half of the
"hypothetical potential for dative systems" request was already satisfied
and needed no new content. The genuine gap was §5 (`ukan` + dative,
NOR-NORI-NORK ditransitive), which had Orainaldia ("can give") and Lehenaldia
("could have given") grids but no Alegiazkoa ("would be able to give, if…")
grid.

**Derivation:** mirrored §3's own Alegiazkoa-vs-Lehenaldia relationship
(`zezakeen`→`lezake`, `zitzakeen`→`litzake`) applied to every cell of the
already-verified §5 Lehenaldia ditransitive grids (both `NOR`=`hura` and
`NOR`=`haiek`, 24 real cells each): drop the trailing `-en` (or just `-n`
where the form already ends `-ten`), and additionally swap a leading
`zi-`→`li-` for the `hark`/`haiek`-as-`NORK` columns only (the same columns
that carry the `z-`/`zi-` past-tense `NORK` prefix in §5's indicative past
grid). `nik`/`hik`/`guk`/`zuk`/`zuek`-as-`NORK` columns keep their prefixes
unchanged. Pure position-independent string transformation from
already-verified forms, consistent with the methodology used for the rest of
this document — no new round-trip verification needed.

## 2026-06-10 — Added new verb tables (Task 3) as appended subsections of §6/§7 rather than a new numbered section

**Decision:** `ihardun`, `mintzatu`/`hitz egin`, `ikusi`, and `entzun` were
added as new `###` subsections at the end of §6 ("More synthetic `nor`
verbs") and §7 ("More synthetic nor-nork verbs") respectively, rather than as
a new `##`-numbered section. This avoids cascading renumbering of §8–§13
(and their many `§N` cross-references) for what is, structurally, just more
entries in the same kind of list those sections already are.

- **`ihardun`** (nor): conjugated by mechanically applying §8's `iraun`
  di-root pattern (`di-` present prefix on bare stem, `n/h/z/gen/zen/zen/z`
  + stem + `-en` past) to the stem `-hardu-`. Noted that `jardun` is the more
  common Batua spelling with identical conjugation.
- **`mintzatu`/`hitz egin`** (nor / nor-nork, "Literary/Northern"): used the
  Iparraldeko `mintzo` + `izan` construction (reuses §1's `izan` paradigm
  verbatim, prefixed with the invariant participle `mintzo`) for the
  "Literary/Northern" `nor` paradigm the task asked for, plus a fully regular
  periphrastic `hitz egin` table (built from §3's `du`/`zuen` auxiliary) for
  completeness.
- **`ikusi`/`entzun`** (nor-nork): **decided not to fabricate synthetic
  paradigms.** Neither verb has a productive synthetic conjugation in modern
  Batua (an archaic literary `-kus-` root for `ikusi` exists in old texts —
  e.g. Etxepare's *dakusquet* — but isn't reliable enough to present as
  current Batua). Presented both as periphrastic tables
  (`ikusten/ikusi` + `ukan`, `entzuten/entzun` + `ukan`) instead, explicitly
  noting why no synthetic table is given — prioritizing "absolute technical
  accuracy" over matching the letter of "synthetic verbs" in the request.

## 2026-06-10 — Filled the last `hik`-as-`NOR`/`NORK` gaps in §3 and §5's Ahalera Alegiazkoa/Lehenaldia grids

**Decision:** Closed the remaining `hik` gaps left by the prior session's
`-zki-`-insertion pass:

- §3's Ahalera Alegiazkoa and Lehenaldia grids (`NOR`-NORK, `NOR`=1st/2nd
  person) had blank `hik` rows/cells. Derived `hik`-as-`NOR` forms via the
  `nin-/hin-/gin-/zin-` + `-tza-ke(-en)` series already used elsewhere in
  these grids, and `hik`-as-`NORK` forms via the `-k`/`-n` gender split for
  Alegiazkoa and `-a-`/`-na-` insertion for Lehenaldia — mirroring the
  already-verified `ninduen`→`ninduan`/`nindunan` pattern from §3's plain
  past grid. Replaced the prose note that previously said these forms
  "aren't attested... and are left blank" with an explanation of the
  derivation instead.
- §5's Ahalera Lehenaldia ditransitive grids (`NOR`=`hura` and `NOR`=`haiek`)
  were missing their `hik`-as-`NORK` column entirely (flagged "remains open
  for a future pass" in both places). Derived via `diezaioke` →
  `iezaioke` → `hiezaioke` → `hiezaiokeen` (drop `d-`, prepend past-tense
  `h-` prefix from §5's own `hion`/`hidan`/etc., append `-en`) — **not**
  gender-split, matching §5's existing past `hik` column precedent
  (`hidan`/`hion`/`higun`/`hien`, single form per cell).

Both removed "remains open for a future pass" notes are now resolved — no
outstanding `hik` gaps remain in the Ahalera/Subjuntiboa systems.

## 2026-06-10 — New §10 "Allocutive register (hitanoa/alokutiboa)" inserted before Periphrastic; §10–12 renumbered to §11–13

**Decision:** Added a new section covering the allocutive/hitano register
(tokano `-k`/nokano `-n` addressee agreement, independent of the verb's own
`NOR`/`NORI`/`NORK` arguments — `dator`→`datork`/`datorn`, `du`→`dik`/`din`,
etc.), placed it as the new §10, and renumbered the three sections after it
(old §10 Periphrastic → §11, old §11 Pronoun & case → §12, old §12 Beyond
present/past → §13). Verified via grep that no other `§1[0-9]` cross-reference
in the document needed updating as a result (none of the pre-existing
cross-references pointed at the old §10–12).

**Placement rationale:** allocutive sits conceptually between the core
finite-mood sections (§1–9, all of which the allocutive forms are *layered
on top of*) and the periphrastic/reference material (old §10–12), so it reads
as "one more register to be aware of before moving on to periphrastics" —
naturally between the two — rather than tacked on at the very end where it'd
read as an afterthought.

## 2026-06-10 — Added "The full periphrastic tense matrix" to §11 (Periphrastic)

**Decision:** Expanded §11 with an 8-row tense matrix (Oraina, Lehenaldiko
Burutua, Geroa, Ondorioa, Ondorio Orokorra, Lehenaldi Mugatua, Lehenaldi
Ez-mugatua, Ez-ohiko Baldintza) crossing the three aspect suffixes from §11's
existing "Aspect suffixes" table with `izan`/`ukan`'s present/past/ondorioa
paradigms (§2/§3). The four "compound" rows (Ondorio Orokorra, Lehenaldi
Mugatua, Lehenaldi Ez-mugatua, Ez-ohiko Baldintza) get their own explanatory
paragraphs distinguishing, in particular, the event-vs-state nuance between
`Lehenaldi Mugatua` (`ikusi nuen`, simple past) and `Lehenaldi Ez-mugatua`
(`ikusi izan nuen`, pluperfect, using an invariant `izan` participle — the
same invariant-`izan` mechanism §14 picks up later for the resultative/passive
constructions).

## 2026-06-10 — Completed §5's Ahalera Lehenaldia ditransitive `NOR`=`haiek` grid via mechanical `-zki-` insertion

**Decision:** Asked Gemini to confirm whether the `-zki-` infix slots into the
Lehenaldia ditransitive forms at the same position as in Orainaldia
(`diezaioke` → `diezazkioke`), predicting `niezaiokeen` → `niezazkiokeen` and
the analogous `niezazkigukeen`/`niezazkizukeen`/`niezazkiekeen` for the `nik`
column. All 4 confirmed exactly as predicted, certified against standard
*Euskara Batua*, with examples confirming `-zki-` + `-ie-` (haiei) causes no
contraction.

**Then completed the rest of the grid without a further round-trip.** The
already-applied Orainaldia grid shows `-zki-` inserted at the *same relative
position* — immediately before the `NORI` suffix — across **all five** `NORI`
suffixes (`diezadake`→`diezazkidake`, `diezaioke`→`diezazkioke`,
`diezaguke`→`diezazkiguke`, `diezazuke`→`diezazkizuke`,
`diezaieke`→`diezazkieke`). This round's confirmations show the same
insertion point holds for the Lehenaldia root across **four** of those five
suffixes (`-io-`/`-gu-`/`-zu-`/`-ie-`). The `NORK` prefix sits at the front of
the word, entirely separated from where `-zki-` lands next to the `NORI`
suffix, so prefix choice can't interact with the infix — meaning the rule
generalizes across all 6 `NORK` columns (5 confirmed Round 5 + `nik`). The
only combination not directly tested for Lehenaldia is `-da-` (niri row) +
`-zki-`, but that's the same purely positional rule already confirmed for
`-da-` in Orainaldia, and the root (`-keen` vs `-ke`) doesn't change where the
`NORI` suffix attaches.

Applied `-zki-` insertion to all 26 real cells (i.e. excluding `*(refl.)*`/
`*(zu↔zuek)*` markers) of the confirmed `NOR`=`hura` grid, producing a
complete `NOR`=`haiek` grid (4 cells Gemini-confirmed this round, 22 derived
mechanically). Only `hik` as `NORK` (both `NOR` values) remains open for
Lehenaldia.

**Why this composition is lower-risk than a 3-piece composition:** unlike
"compose 2 independently-confirmed pieces across many never-jointly-tested
cells" (Round 5's approach, still a meaningful inference), this is a single
position-independent string transformation that has now been verified across
9 of the 10 (suffix × root) combinations it's applied to — the 10th
(`-da-`+Lehenaldia) differs from a verified combination only in a part of the
word (`-ke` vs `-keen`) that is provably irrelevant to where `-zki-` lands.

## 2026-06-10 — Filled §5's Ahalera Lehenaldia ditransitive `NOR`=`hura` grid via cross-pattern composition

**Decision:** Asked Gemini to confirm the predicted `hari` row (`hark`/`guk`/
`zuk`/`zuek`/`haiek` as `NORK`, `NOR`=`hura`) — specifically flagging `hark`
as the riskiest cell, since §3 shows `hark` can take *different* prefixes for
Alegiazkoa (`le-`) vs. Lehenaldia (`ze-`). All 5 confirmed exactly as
predicted (`ziezaiokeen`/`geniezaiokeen`/`zeniezaiokeen`/`zeniezaioketen`/
`ziezaioketen`), each with a fresh example whose object (`zopa beroa`,
`gure iritzia`, `opari polit bat`, `albiste txarra`, `isuna` — all singular,
matching `NOR`=`hura`) and `NORI`/`NORK` roles line up correctly. Gemini also
explained *why* `hark` uses `z-`/`zie-` here: it's the past counterpart of
present `die-`, distinct from the hypothetical's `lie-` — resolving the
caveat rather than hand-waving past it.

This gives a confirmed `nik` column **and** a confirmed `hari` row (sharing
the cell `niezaiokeen`) — together they pin down both halves of the formula
(`NORK`-prefix/suffix wrapper `n-/z-/gen-/zen-/zen-…ten/z-…ten` + `-en`/`-ten`,
and `NORI`-suffix `-da-/-io-/-gu-/-zu-/-ie-`) *for this tense specifically*,
with fresh examples for each half. Composed the two to fill the rest of the
`NOR`=`hura` grid (17 new cells), with `*(refl.)*`/`*(zu↔zuek)*` in the same
positions as Orainaldia's grid.

**Not done**: `NOR`=`haiek` (the `-zki-` infix is confirmed for Orainaldia but
not yet for *this* tense — composing three confirmed-but-never-jointly-tested
pieces felt like one step too far without a fresh check) and `hik` as `NORK`.
Both left open for future passes.

## 2026-06-10 — Started §5's Ahalera Lehenaldia (past potential) ditransitive grid: `nik` row resolved, root confirmed different from Orainaldia

**Decision:** Asked Gemini for the citation form `nik`→`hari`/`NOR`=`hura`
("I could have given it to him") for this new tense, plus a self-check across
`guri`/`zuri`/`haiei`. Gemini confirmed the `dieza-`/`diezazki-` root does
*not* carry over from Orainaldia, giving `niezaiokeen` plus
`niezagukeen`/`niezazukeen`/`niezaiekeen` for the sanity-check rows.

Cross-checked these two ways, both clean:

- **Against §3's Lehenaldia**: `nezake` (Alegiazkoa) → `nezakeen` (Lehenaldia)
  is `nezake`+`-en`. Applying the same "`d`→`n`, then `+en`" transform to the
  *already-verified Orainaldia `hark`-column forms* (`diezaioke` →
  `niezaioke` → `niezaiokeen`, etc.) reproduces all four of Gemini's cells
  exactly.
- **Against §5's own indicative grids**: the resulting extra `-i-`
  (`n-i-eza-io-ke-en`) is the same linking vowel that distinguishes `nion`
  (ditransitive past) from `nuen` (plain past) — not an ad-hoc addition.

Applied the `nik` row (`NOR`=`hura`; `niri`=`*(refl.)*` as elsewhere). Wrote up
the general derivation rule (Orainaldia `hark`-column form, minus `d-`, plus
§5's already-applied indicative-past `NORK` prefix, plus `-en`/`-ten`) as a
hypothesis for the rest of the grid — `hark`'s prefix in particular needs its
own check, since §3 shows `hark` can use *different* prefixes for Alegiazkoa
(`le-`) vs. Lehenaldia (`ze-`), so the "same prefix as indicative past" guess
isn't guaranteed to hold beyond `nik` (where Alegiazkoa and Lehenaldia
prefixes happen to coincide). `NOR`=`haiek`, `hark`/`guk`/`zuk`/`zuek`/`haiek`
as `NORK`, and `hik` all left open.

## 2026-06-10 — Completed §5's Ahalera Orainaldia ditransitive grid with the `hik` column

**Decision:** Asked Gemini to verify the last open piece of this grid: the
`hik` column (8 masc./fem. pairs = 16 forms across `niri`/`hari`/`guri`/
`haiei` × `NOR`=`hura`/`haiek`), predicted via the `-k`/`-n` suffix already
cross-checked against §3's `hik` row. All 8 pairs confirmed exactly as
predicted, each with a fresh example sentence whose object number agrees with
the predicted form (plural `liburuak`/`argazkiak` for the `diezazki-` cells,
singular `egia`/`mezu bat` for the `dieza-` cells) — a marked improvement over
the previous no-examples round. Applied all 16 forms; `zuri`/`hik` stays
`*(hika/zuka)*` as before. Also kept Gemini's "sociolinguistic reality" note
(these forms are grammatically regular but rare outside formal/literary
register — *hika* speakers favour the indicative or `ahal izan`
periphrastically) since it matches how the doc already treats §3's rare
Subjuntiboa `hi`-cells.

**Aside, not chased**: example 4's surrounding context used `zeudeat` for "the
parents were worried" (3rd-plural past of `egon`), which doesn't match any
*hika* past form expected (`zeudean`/`zeudenan`). Doesn't affect the verified
target form (`diezazkiekek`/`diezazkieken`, whose own number agreement is
correct), so not pursued — flagged here in case a future `egon` *hika*
past-tense pass runs into the same thing.

**Status:** §5's Ahalera Orainaldia ditransitive grid is now complete (no `—`
cells; all gaps are principled `*(refl.)*`/`*(zu↔zuek)*`/`*(hika/zuka)*`
markers). Ahalera Lehenaldia (past potential) ditransitive is the natural next
tense.

## 2026-06-10 — Filled out §5's Ahalera Orainaldia ditransitive grid to `nik`/`guk`/`zuk`/`zuek`/`haiek` (full grid minus `hik`)

**Decision:** Asked Gemini to verify just the `nik` column (6 cells:
`hari`/`zuri`/`haiei` × `NOR`=`hura`/`haiek`, predicted by appending the `-t`
suffix to the already-verified `hark` column). The predicted forms
(`diezaioket`, `diezazuket`, `diezaieket` and their `diezazki-` siblings) came
back unchanged — but with **no examples this time**, despite the explicit
ask, and Gemini additionally supplied full `guk`/`zuk`/`zuek`/`haiek` columns
(34 more cells) unprompted, backed only by hand-wavy assurances ("fully
backed by standard syntax models", "now locked in").

Rather than accept that on faith or discard it, cross-checked it against parts
of *this document* that are already settled:

- **`NORK`-suffix-after-`-ke-`**: §3's Ahalera grid already has
  `dezaket`/`dezakegu`/`dezakezu`/`dezakezue`/`dezakete` (the `-t`/`-gu`/`-zu`/
  `-zue`/`-te` suffixes Gemini's new cells apply to `diezaXXke`/
  `diezazkiXXke`) — exact match.
- **`*(refl.)*`/`*(zu↔zuek)*` placement**: every blocked cell in Gemini's grids
  sits in the same `NORI`/`NORK` position as the corresponding block in this
  section's own already-applied indicative present grid (`niri`/`nik`,
  `guri`/`nik`+`guk`, `zuri`/`zuk`+`zuek`) — exact match, row by row.

Both checks passed with no contradictions, so applied the `nik`/`guk`/`zuk`/
`zuek`/`haiek` columns for both `NOR`=`hura`/`haiek` (replacing the previous
`hark`-only citation table with the full grid). `hik` stays `—` (open gap),
except `zuri`/`hik` = `*(hika/zuka)*` (matches the existing register-clash
marker, independent of the new cells) — Gemini itself flagged `hik` as "on
ice", and it deserves its own verification pass rather than being swept in on
the back of a no-examples response.

## 2026-06-10 — Added Ahalera Orainaldia ditransitive `hark` column to §5 (citation table)

**Decision:** Followed up on the previous entry's "not yet applied" Ahalera
Orainaldia ditransitive (`dieza-`/`diezazki-`) forms with two more focused
Gemini verification rounds:

1. **`niri`/`hari`/`haiei` rows**: the previous round's example for
   `diezaieke` paired a plural object (`kezka horiek`) with a form that has no
   `-zki-`, a number mismatch. Asked for a corrected example with a singular
   object (got one), plus fresh plural-object examples for
   `diezazkidake`/`diezazkioke`/`diezazkieke` to confirm the plural-object
   root is `diezazki-`, not `diezaizki-` — all three came back with genuinely
   plural objects and the same `dieza-` + `-zki-` + `NORI`-suffix + `-ke`
   shape.
2. **`guri`/`zuri` rows**: these were the two remaining `hark`-column cells —
   ordinary, non-reflexive meanings ("he can give it to us/you"), not covered
   by any previous round. Predicted `diezaguke`/`diezazuke`/
   `diezazkiguke`/`diezazkizuke` by analogy (no hiatus glide needed for
   `-da-/-gu-/-zu-`, vs. the `-i-`-glide `-io-/-ie-` forms for `hari`/`haiei`)
   and asked Gemini to confirm or correct each with a real example — all four
   confirmed with object-number-appropriate examples.

Added a new §5 citation table for the `hark` column across both `NOR`=`hura`/
`haiek` (10 cells, all either example-backed this round or pattern-identical
to a cell that is), with the `NORI`-suffix + hiatus-glide rule written up —
same posture as §3's citation-paradigm tables before their grids were filled
out. `nik`/`hik`/`guk`/`zuk`/`zuek`/`haiek` as `NORK` remain open for a future
pass.

## 2026-06-10 — Added `hik` NORK column to §5's `NOR`=hura/haiek Present/Past grids

**Decision:** §5's four grids only had 6 `NORK` columns
(`nik`/`hark`/`guk`/`zuk`/`zuek`/`haiek`), unlike §3 which includes `hik`.
Asked Gemini to derive a `hik` column anchored on §3's `duk`/`huen`/`hituen`.
Result was a clean mechanical pattern with no internal contradictions (unlike
earlier rounds):

- **Present**: `di-`/`di-zki-` + `NORI`-suffix + `-k`/`-n` (gender split,
  same as §3's `duk`/`dun`) — `diok`/`dion`, `didak`/`didan`,
  `dizkiok`/`dizkion`, etc. Self-check passed: `hari`/`hik` = `diok`/`dion`,
  exactly `di-` + `∅` + `-k`/`-n`.
- **Past**: same `h-` prefix as the existing `hark`→`z-` etc. (`hidan` =
  `h-i-da-n`, `hizkion` = `h-izki-o-n`), **not** gender-split — matches §3's
  note that `hik`'s `hura`/`haiek`-object past forms (`huen`/`hituen`) aren't
  gender-split either.
- `zuri`/`zuei` × `hik` are `*(hika/zuka)*`, same register clash as
  `zuk`/`zuek` × `NOR`=`hi` in §3.

Applied directly — every cell follows an established formula/anchor with no
loose ends.

**Not yet applied**: a follow-up request for Ahalera Orainaldia
(`NOR`=hura/haiek, ditransitive "can give X to Y") came back with a `dieza-`/
`diezazki-` root family (`diezaioke` etc.). The `hari`/`haiei` rows look
plausible (`diezaioke`/`diezaieke` match recallable real forms), but the
`niri`/`guri`/`zuri` rows are derived purely by analogy and the "self-check"
Gemini provided doesn't actually reduce algebraically to the cited citation
forms (`diezaioket` minus `-io-` ≠ `dezaket`) — needs another verification
pass before going in.

## 2026-06-10 — Fixed §3's `guk`→`hi` past cell (`*(refl.)*` → `hindugun`); declined a new `*(PCC-blocked)*` marker

**Decision:** Followed up on two doubts from the previous round.

- **`guk`→`hi` past**: was marked `*(refl.)*`, but `guk`→`hi` *present*
  (`haugu`) is a real, non-reflexive form — `gu` and `hi` are different
  person categories, so there's no reflexivity to block it. Asked Gemini to
  re-derive it; it proposed `hindugun`, built from the already-established
  `NOR`=`hi` past prefix `hind-` (seen in `hindudan`/`hinduen`/`hinduten`) +
  stem `-u-` + `NORK`=`guk` suffix `-gu-` (as in `zintugun`) + `-n`. This is
  structurally consistent with every other cell in the past grid and with
  `guk`→`hi` present, so applied it.
- **`hiri` `NORI` row in the `NOR`=1st/2nd ditransitive grids**: asked Gemini
  to re-derive this row, since its previous answer marked `hark`/`haiek`
  columns `*(refl.)*` for no reason. It came back with a new
  `*(PCC-blocked)*` marker for `hark`/`haiek` (vs. `*(hika/zuka)*` for
  `nik`/`guk`/`zuk`/`zuek`) when `NOR`=`ni`/`gu` — but then marked the *entire*
  `hiri` row `*(hika/zuka)*`, including `hark`/`haiek`, when `NOR`=`zu`/`zuek`.
  Both are "`NOR` and `NORI` both 1st/2nd person" cases that the PCC should
  treat the same regardless of `NORK`, so this `*(hika/zuka)*`/
  `*(PCC-blocked)*` split looks like patching rather than a principled rule.
  **Declined** — §5's existing "NOR = 1st/2nd person" subsection already
  states the substance (PCC blocks any `NOR`+`NORI` both non-3rd-person
  combination) without needing a new marker or per-cell breakdown.

## 2026-06-10 — Fixed §3's `haiek`→`zuek` present cell (`zaituzte` → `zaituztete`); declined Gemini's 10 NOR=1st/2nd grids again

**Decision:** Asked Gemini to resolve the contradictions flagged in the
previous round (`naukazu`/`naukazue`, `ninduzuten`, `zuk`→`zu` marker) and
regenerate the 10 `NOR` = 1st/2nd-person grids self-checked against §3.
Gemini agreed all three flagged values were its own errors (confirms `nauzu`/
`nauzue`/`ninduzuen`/`*(refl.)*` as already in §3 — no §3 change needed for
those).

While re-deriving the `haiek`→`zuek` present cell for one of the new grids,
Gemini produced `zaituztete`, which **conflicts with §3's existing
`zaituzte`** for that cell (line ~195, "Present — `NOR` = 1st/2nd person").
Checked this independently against §3's own past-tense and Baldintza grids,
both of which *do* distinguish `haiek`→`zu` from `haiek`→`zuek`
(`zintuzten`/`zintuzteten`, `bazintuzte`/`bazintuztete`) — present tense
having both columns read `zaituzte` was the odd one out and looks like a
copy-paste error. Corrected to `zaituztete`, matching the established
`-te-` infix pattern visible in the other two tenses.

**Still declined** to add the 10 full `NOR` = 1st/2nd grids: beyond the
`hari`/`haiei` rows (pure §3 clones, already covered by §5's "NOR = 1st/2nd
person" subsection via cross-reference, and now correct after the fix
above), the other five `NORI` rows had internally inconsistent markers (e.g.
the `hiri` row for `NOR`=`ni` marked `hark`/`haiek` columns `*(refl.)*` for
no apparent reason while marking `nik`/`guk`/`zuk`/`zuek` `*(hika/zuka)*`),
plus an open `?` cell (`guk`→`hi` past) and a grammatically garbled example
sentence used to justify the `zuk`→`zu` marker. Not reliable enough to
tabulate; §5's existing concise explanation stands.

## 2026-06-10 — Filled §5's `*(refl.)*` gaps, fixed `zenion`/`zenizkion`, and added a "NOR = 1st/2nd person" subsection instead of full new grids

**Decision:** Asked Gemini to fill in §5's remaining `—` cells and produce the
full NOR-NORI-NORK paradigm for `NOR` = 1st/2nd person. Applied only the parts
that checked out:

- **Gap fills**: `niri`/`nik` and `guri`/`nik` (previously `—`) are
  `*(refl.)*` in all four `NOR` = `hura`/`haiek` × Present/Past grids — they
  fall under §3's same-person-category extension (1st category = `ni`/`gu`)
  just like the already-marked `guri`/`guk` and `zuri`/`zuk`. Rewrote the
  prose under the `hura`/Present grid to explain all four cells together plus
  the `buru`-periphrasis fallback (*nire buruari eman diot*).
- **Form corrections**: `hari`/`zuk` past was `zenioen` → corrected to
  `zenion` (`NOR` = `hura`), and `zenizkioen` → `zenizkion` (`NOR` = `haiek`),
  for consistency with the parallel `-zki-`-infixed forms and the standard
  attested forms ("...esan zenion").
- **Did not** paste Gemini's ten full `NOR` = 1st/2nd-person grids — they
  contained internal inconsistencies (e.g. `naukazu`/`naukazue` borrowing
  `eduki`'s stem instead of `ukan`'s `nau-`; `ninduzuten` vs. §3's
  `ninduzuen`; `zuk`→`zu` marked `*(hika/zuka)*` when §3 marks it
  `*(refl.)*`) and would have duplicated ~90% of §3's existing grid. Instead
  added a concise new "`NOR` = 1st/2nd person" subsection explaining the
  Person-Case Constraint: `NORI` = `hari`/`haiei` forms reduce exactly to
  §3's plain NOR-NORK forms (cross-referenced rather than duplicated), while
  `NORI` = 1st/2nd person cells are `*(refl.)*`/`*(hika/zuka)*`/
  `*(zu↔zuek)*`/PCC-blocked — covered by the `buru` periphrasis in practice.
  A careful per-cell verification pass for the full grids could be done later
  if ever needed.

## 2026-06-10 — Restructured CONJUGATIONS.md as a pure reference, stripping process narrative

**Decision:** Rewrote `CONJUGATIONS.md` to remove everything about *how* it
was compiled — the ✅/📖/🔍 confidence-marker system, the sources list, the
"Resolved"/"Superseded"/per-Gemini discrepancy-resolution stories, the §13
source-description section, and cross-references to `DECISIONS.md`/
`VERB_COVERAGE.md`. Kept every conjugation table, example sentence, and
grammatical/morphological explanation (recipe formulas, the `-zki-` and
`K/N`↔`A/NA` rules, the `-zke-` merger rule, and the `*(refl.)*`/
`*(hika/zuka)*`/`*(zu↔zuek)*`/`*(masc.)*`/`*(fem.)*` markers, now defined once
in a "Notation" section up top). Cells previously marked `🔍` now read as
plain forms (no longer flagged as less-confident); cells previously marked
`❓` (genuine gaps, e.g. `hi`-forms in Ahalera Alegiazkoa/Lehenaldia) now
render as `—` like other gaps. §13 (a description of an external cross-check
source) was removed entirely; §14 (`eduki`/`erabili`/`eraman`) became §13.
1398 lines → 979. Reasoning: the doc's purpose is now lookup, not an audit
trail of the research process — that history lives in this file and in git
history if ever needed.

## 2026-06-10 — Incorporated Gemini's verification pass: corrected the Ondorioa `-zke-` rule, resolved the `-io-`/`-ioe-` and `zidan`/`dit` discrepancies, added a `zu↔zuek` impossibility marker, filled Ahalera-Orainaldia's `hi` cells

**Decision:** Asked Gemini to check the remaining `🔍`/`❓`/`⚠️` cells across
§3 and §5. Applied its corrections wholesale:

- **Baldintza** (§3): every remaining `🔍` cell confirmed correct as written
  — flags dropped, no value changes. Noted `bagintuk`/`bagintun`
  (`hik`→`gu`) is grammatical but pragmatically rare.
- **Ondorioa present/past** (§3): **supersedes** the two 2026-06-08 entries
  below. The `zintukezte` cell those entries treated as a confirmed anchor
  for a "`-zte-` after `-ke-`" rule was itself wrong — Gemini corrects it to
  `zintuzkete` and gives the real rule: a plural object (`zuek`/`haiek`) or
  `haiek`-subject-on-`zint-`/`gint-`-stem makes `-ke-` merge with the
  pluralizer `-z-` into **`-zke-`**, *before* the tense/person suffixes
  (`zint-u-zke-te`, not `zint-u-ke-zte`). This matches the `-zke-` shape
  this grid's pre-existing `haiek`-as-`NOR` anchors (`lituzke`,
  `genituzke`, `lituzkete`, `zituzkeen`, …) already used, unflagged. Recast
  ~12 `🔍`-derived cells from `-tuke(z)te-` to `-tuzke-` shapes and dropped
  `🔍` from the rest; fixed one outright typo, `zintukezun` (`guk`→`zu`,
  Ondorioa-past) → `zintukegun`.
- **Indicative past, `nik`→`zuek`** (§3): confirmed `zintuztedan`;
  `zaituztet` (this grid's own present-tense `nik`→`zuek` cell) was a print
  error in the source that suggested it here. `🔍` dropped.
- **§5 `hari`-past `-io-` vs `-ioe-`**: Gemini confirms `nion`/`zion`/
  `genion` (not `nioen`/`zioen`/`genioen`) are standard *Batua* for
  `nik`/`hark`/`guk` — the `-ioe-` shape is a Bizkaian/Western dialect
  variant. `zenioen`/`zenioten`/`zioten` (`zuk`/`zuek`/`haiek`) were never in
  dispute. Same fix applied to the parallel `-zki-` (`NOR`=`haiek`) past row
  (`nizkion`/`zizkion`/`genizkion`).
- **§5 `hura`-present `niri`/`hark`**: `zidan` is a *past*-tense form and
  doesn't belong in a present table; Gemini confirms the present cell is
  `dit`. By the same `di-`+suffix formula, `niri`/`haiek` (`zidaten`, also
  past-shaped) becomes `didate` (🔍 — formula-derived, not independently
  checked by Gemini).
- **New marker `*(zu↔zuek)*`**: per Gemini, `dizuzue`/`dizkizuzue`/
  `zenizuten`/`zenizkizuten` (all four `zuri`/`zuek` cells across §5's
  `hura`/`haiek` present/past grids) **don't exist** — `zu` and `zuek` share
  one morpheme block and can't fill both the NORI and NORK slots of one
  auxiliary at once (Basque uses `Zuen buruari ematen diozue` instead).
  Replaces the `🔍` previously on those four cells.
- **Ahalera Orainaldia `hi`-cells** (§3): Gemini filled the `hi`-as-`NOR`
  column (`hazake`/`hazaket`/`hazakegu`/`hazakete`, gender-invariant,
  `h-` + `-zake-`) and `hik`-as-`NORK` → `ni`/`gu` (`nazakek`/`nazaken`,
  `gaitzakek`/`gaitzaken`, masc./fem. via `-k`/`-n` like the other columns).
  Alegiazkoa/Lehenaldia's matching `hi`-cells remain `❓` — Gemini's answer
  was scoped to Orainaldia only.

## 2026-06-10 — Filled both Subjuntiboa NOR-NORK grids (Present + Past) from a user-supplied table, including the `hi` masc./fem. split

**Decision:** A user-supplied table gave full Subjuntiboa Orainaldia
(Present) and Lehenaldia (Past) NOR-NORK grids, including `hi` as both `NOR`
and `NORK` — the first source in this document to cover `hi` for any
NOR-NORK grid. Added a brand-new Present grid (previously didn't exist) and
completed the Past grid's remaining `❓` cells (it previously only had
`hura`/`haiek` columns). Both grids are now fully populated with no `❓`
left. The `hura`/`haiek` columns of the Past grid match this document's
pre-existing citations exactly, corroborating both sources.

**Findings:** `hi`-as-`NOR` is gender-invariant (the source's `hi (M)`/
`hi (F)` rows are identical) — only `hi`-as-`NORK` (the `hik` row) splits,
via `-a-`/`-na-` insertion (`dezaan`/`dezanan`, `nintzaan`/`nintzanan`, …),
*(masc.)*/*(fem.)* notation as used in §4. One exception: `hik`/`hura` in
the Past grid (`hezan`) is given as the *same* form for both genders —
reproduced as-is rather than guessed at.

**Scope boundary:** Did *not* use this data to fill Ahalera's remaining `hi`
gaps — Subjuntiboa's `-a-`/`-na-` insertion is a different mechanism from
the suffix-based `-k`/`-n` pattern Ahalera-Orainaldia would need (mirroring
indicative `ukan`'s `duk`/`dun`), so cross-paradigm extrapolation isn't
safe without its own source.

## 2026-06-10 — Ahalera "contradiction" was a tense split, not an error; filled the `❓` `NOR`=1st/2nd-person cells from a user-supplied table

**Decision:** A previous session concluded `dezaket` (NOR-prefix/NORK-suffix
recipe) was a mistaken artifact and `nezake` (NORK-prefix/NOR-stem,
`*ezan`-mirrored) was "correct" for Ahalera, marking the entire `NOR` =
1st/2nd-person block `❓` ("plausibly outside this paradigm's range"). A
user-supplied reference table (Orainaldia/Alegiazkoa/Lehenaldia, full
NOR×NORK grids minus `hi`) shows **both recipes are real, for different
tenses**: Orainaldia (present, "I can…") uses the `dezaket`/`nazake`/
`gaitzake`/`zaitzaket`/`ditzaket`-type prefix recipe; Alegiazkoa
(hypothetical) and Lehenaldia (past) use the `nezake`/`nintzake`-type
`*ezan`-mirrored recipe. Replaced the old combined "present/hypothetical"
grid with three full grids (Orainaldia/Alegiazkoa/Lehenaldia), filling
nearly all of the previously-`❓` `NOR`=1st/2nd-person cells with real,
user-sourced forms.

**New finding:** the source also reveals a same-person-category blocking
pattern broader than the old strict-diagonal `*(refl.)*` — 1st-on-1st
(`nik`/`guk` ↔ `ni`/`gu`, any number combination) and 2nd-on-2nd (`zuk`/
`zuek` ↔ `zu`/`zuek`) cells are all impossible, not just `nik`→`ni` and
`zuk`→`zu`. Extended `*(refl.)*` to cover this whole 8-cell block per grid.

**Remaining gap:** `hi` (as `NOR` or `NORK`) is omitted by the new source
entirely (allocutive simplification) — `hi`-row/column `❓`s remain.
Subjuntiboa wasn't covered by the new table either; its `❓` grid is
untouched, with a pointer note that the same patterns likely apply.

## 2026-06-09 — Started NOR-NORI-NORK (§5): completed the `hura` grid, added a `haiek` (`-zki-`) grid, scoped out NOR=1st/2nd person

**Decision:** §5 (`ukan` with dative, ditransitive) previously had a single
`NOR=hura` grid with several blank `NORI`×`NORK` cells (`niri`/`guri` rows ×
`guk`/`zuk`/`zuek` columns) plus an unexplained `—` on the `nik` column for
those same rows. Filled the blanks via the same `di-` + NORI-suffix +
NORK-suffix formula already visible in the `hari`/`zuri`/`haiei` rows
(`didazu`, `diguzu`, `diezu`, …) — one of the new fills (`didazu`, "you give
it to me") is itself a well-known form, corroborating the formula. Two of the
new cells (`guri`/`guk`, `zuri`/`zuk`) turned out to be reflexive
("we/you give it to ourselves/yourself") and got `*(refl.)*`, distinct from
the pre-existing unexplained `—` cells (`niri`/`nik`, `guri`/`nik`), which
were left as `—` rather than reclassified since their status wasn't actually
investigated. `zuri`/`zuek` (`dizuzue`) got a 🔍 — `zu`/`zuek` aren't a
register clash here, just unattested.

Also added a parallel `NOR=haiek` grid (Present + Past) using §4's `-zki-`
infix (`dizkidazu`, `dizkio`, `zizkidan`, `nizkion`, …) — these are common,
recognizable forms, so this grid rests on firmer ground than `hura`'s
blanker corners did before this pass.

**Follow-up (scoped out, not done):** `NOR`=1st/2nd person ditransitive forms
("he gives *me* to him") exist in principle but are vanishingly rare in
practice and unattested in any source this doc draws on — left out
entirely (no `❓` shell even) rather than invented, pending source material,
the same posture as the Ahalera/Subjuntiboa `❓` cells in §3.

## 2026-06-08 — Filled Ondorioa `zuek`-as-object blanks using `-zte-after-ke` rule

**⚠️ Superseded** by the 2026-06-10 entry above — the `zintukezte` anchor
this entry relies on was itself wrong; the real rule merges `-ke-` + `-z-`
into `-zke-` instead. Kept for history.

**Decision:** The `zintukezte` cell (NORK=haiek, NOR=zu, Ondorioa-present)
already in the grid showed `-zte-` sitting *after* `-ke-` — the ordering
question I'd previously flagged as unresolved was already answered by the
existing data. Extended the same position to the NOR=zuek marker in both
Ondorioa grids (present and past): `[zint-u-ke-zte-suffix]`. For haiek/zuek
cells specifically, the `NORK`=haiek marker falls back to the shorter `-te`
(not `-zte-`) when the NOR-marking `-zte-` is already present — same pattern
as the user-confirmed Baldintza `bazintuztete`. All 8 cells marked 🔍.

## 2026-06-08 — Cross-checked `ukan`'s NOR-NORK 🔍-cells against the paradigm-chart PDF; recovered the `-zte-`-insertion rule for `zuek`-as-object cells

**Note:** The Past/Baldintza findings here (no `-ke-` involved) still stand.
Only the Ondorioa extension of this rule (see the entry two above) was
superseded on 2026-06-10.

**Decision:** The user supplied a batch of forms read off the paradigm-chart
PDF (§13) that either matched existing 🔍-derived guesses outright (letting
the flag drop — `ninduan/nindunan`, `gintuan/gintunan`, `zintugun`,
`gintuzun`, `gintuzuen`, `ninduzuen` in the Past grid; `banindu`,
`baninduk/banindun` in Baldintza) or filled previously-honest `zuek`-as-object
gaps. Comparing the new fills against their `zu`-cell counterparts
(`zintuen`→`zintuzten`, `zintugun`→`zintuztegun`, `bazintugu`→
`bazintuztegu`, …) revealed the rule cleanly: `-zte-` slots in right after
the stem `-u-`, before the `NORK` person-suffix — resolving, in the user's
favor, the exact contraction risk the doc had flagged as a reason to leave
those cells blank rather than guess. Applied that rule to fill 3/4 Past cells
and all 4 Baldintza cells; the remaining one (Past `nik`→`zuek`) got a 🔍
rule-derived form (`zintuztedan`) instead of the user-supplied `zaituztet`,
which is identical to this grid's own *present-tense* `nik`→`zuek` cell and
breaks the pattern the other three follow — flagged in-place as a likely
transcription slip pending a second look at the source, rather than silently
preferred or silently overwritten.

**Why the rule doesn't reach the Ondorioa grids too:** Baldintza/Past go
straight from stem to suffix, leaving one slot for `-zte-`; Ondorioa inserts
an extra `-ke-` mood layer between them, and nothing sourced anywhere pins
down which side of `-ke-` the object-plural `-zte-` lands on. Left those four
cells/grid blank rather than extend the rule somewhere it hasn't been
validated — same "honest gap over a guess two layers deep" call the doc
already made once for the Past grid's `zuek` column.

## 2026-06-08 — Merged `ukan`'s citation paradigm into its NOR-NORK section; renumbered §3–§15 down by one

**Decision:** `CONJUGATIONS.md` had two `ukan` sections — a small citation-form
table (`NOR` fixed at `hura`) and, three sections later, the full NOR-NORK
grid whose `hura` column *was* that exact table (same six persons, same
forms). The user pointed out they "conjugate the same" and asked to merge
them to avoid the duplication. Folded the citation table into the NOR-NORK
section's intro — framed explicitly as the **✅ baseline** (straight from
`VERBS`) the rest of that 📖 grid was built and cross-checked against, rather
than a redundant standalone table — and deleted the old section. Every
section from the old §3 onward shifted down by one number to close the gap;
old §2 and old §4 (now merged) both collapse onto the new §3. Updated all ~60
internal `§N` cross-references accordingly (leaving `VERB_COVERAGE.md §N` and
"original notes §N" references alone — those number a *different* document).
**Why bother with the renumbering** rather than leaving a gap or a
"see §4" stub: sequential numbering is part of what makes this file fast to
navigate, and a silent gap or forwarding stub would be exactly the kind of
small structural debt that compounds the more the file grows.

**Follow-up (same day):** Looking at the now-merged section with fresh eyes
surfaced a *second*, pre-existing duplication one level down: the NOR-NORK
section had two Present/Past grids back to back — a sparse one (citation
columns only) immediately followed, two subsections later, by the exact same
grid fully filled in. The first was wholly subsumed by the second, so it was
deleted outright (its one unique bit, the `hituen`/`hik`-gender-split note,
moved down to sit with the surviving complete grid) rather than merged —
there was nothing in it worth folding in that the complete version didn't
already have. **Pattern worth naming:** a "let's gradually fill this grid in"
section structure is exactly the shape that *grows* this kind of duplicate —
worth checking for, in this file or others, whenever a table appears to get
"completed" in stages.

**Follow-up #2 (same day):** A *third* duplication, same pattern again: the
"Further moods (citation paradigm)" table carried six mood/tense rows
(Baldintza, Ondorioa pres./past, Ahalera pres./past, Subjuntiboa), but three
of them — Baldintza and both Ondorioa tenses — are nothing but the `hura`/
`haiek` columns of the full NOR-NORK grids built out two subsections later
("Baldintza, Ondorioa — completing the grid the same way"), shown a second
time. Trimmed the table down to just Ahalera and Subjuntiboa — the two moods
that *don't* get a full-grid expansion (per "An unresolved contradiction"),
making this table their only remaining home in the file — and reworded the
dependent grids' intro to source their `hura`/`haiek` columns directly from
§13's citation paradigm (the shared upstream anchor) rather than from this
now-trimmed table.

## 2026-06-08 — `CONJUGATIONS.md` keeps the *current* picture; the story of how it got there belongs here

**Decision:** Trimmed `CONJUGATIONS.md` of in-place retrospectives — passages
like "an earlier pass assumed X, that was backwards, here's why" sitting
inside table sections (the §4 `hika`/`zuka` writeup, §5's `zu`-vs-`zuek`
correction, the §4 ahalera/subjuntiboa contradiction writeup) — down to short
notes that state the *current* fact plus a pointer to the dated `DECISIONS.md`
entry that records the correction and its reasoning. Also: compressed the
intro's "sources merged in, in arrival order" paragraph (a changelog dressed
as reference prose — accurate today, guaranteed to rot the moment a new
source lands or arrival order stops mattering) into a flat source list with
no ordering claims; trimmed §15's source-description preamble similarly; and
deleted the closing "Where this stands" section, which restated — and had
already drifted slightly out of sync with — the same ⚠️-flagged discrepancies
already documented inline at point of use (the doc's own stated policy).

**Why:** Asked to review the file as a *reference for further decisions* and
flag what wasn't pulling its weight. The throughline: a reference document's
job is to answer "what's true, and how sure are we?" as fast as possible —
every paragraph a reader has to get through to reach that answer is friction,
and a paragraph that *narrates a now-fixed mistake* is friction that actively
points backwards. `DECISIONS.md` already exists to carry exactly that kind of
story (the "why," the false starts, the methodology) — duplicating it inline
in the reference just gives the same content two homes, one of which (the
inline copy) has no mechanism keeping it in sync as understanding evolves
further. Corrections now live in the table itself (the thing that's actually
looked up) plus a one-line pointer to the dated entry that explains them —
shorter to read, and only one place can go stale.

## 2026-06-08 — Filling NOR-NORK's "`NOR` = 1st/2nd person" gap: derive-and-flag where the recipe checks out, stop cold where it contradicts a sourced form

**Decision:** Extended `CONJUGATIONS.md` §4 (`ukan`'s NOR-NORK system) with
grids that fill in the present/past/baldintza/ondorioa(×2) tables' other
half — the `ni`/`hi`/`gu`/`zu`/`zuek`-as-object columns the citation-paradigm
framing had left mostly blank ("you have *me*", "they had *us*", as opposed to
the already-covered "I have *it/them*"). §14's chart (the "Euskal aditz
laguntzailea" PDF) gives this half as compact `[prefix]+[stem]+[suffix]`
row-templates rather than spelled-out words; rather than transcribing those
templates wholesale (§14's own write-up already calls that "error-prone") or
mechanically expanding every cell into a word on faith, each mood got the same
treatment: (a) decode the recipe, (b) *cross-check it* against cells already
sourced elsewhere in §4 before trusting it on cells that aren't, (c) only then
fill — marking everything not already cross-checked 🔍 (recipe-derived, not
independently attested) — or, if the cross-check itself fails, *stop* and
flag the contradiction rather than paper over it. Both outcomes happened:

- **Present/past/baldintza/ondorioa(×2)**: the recipe cross-checks cleanly —
  e.g. `nind-` + `-u-` + `-en` → `ninduen`, matching the existing `hark`→`ni`
  cell — modulo one real wrinkle worth calling out by name: a `-z-` that
  appears between a plural-object stem and the `haiek`-subject suffix
  (`dituzte`, not `†ditute`; `gintuzten`, matching the existing sourced cell,
  not `†ginduten`). With that rule folded in, all five grids are now filled
  (`zuek`-as-object still left blank — see below).
- **Ahalera/Subjuntiboa**: the recipe *doesn't* cross-check. Running §14's own
  "`NOR` = 1st/2nd person" template for ahalera-present on the `nik`/`hura`
  cell yields `dezaket` (3rd-person-style `d-` marking) — but the
  already-sourced citation-paradigm cell for that exact combination is
  `nezake` (1st-singular-style `ne-` marking). These aren't spelling variants;
  they disagree about *which argument the verb is agreeing with*. Rather than
  silently pick a side (or, worse, expand a whole grid on top of an
  unreconciled foundation), this is written up as an open discrepancy and the
  templates are left untouched, unexpanded — the section explicitly says so,
  with the specific contradicting forms named, so a future pass with a better
  source can resolve it instead of having to rediscover it.

**Why:** Asked to use the PDF to build out the NOR-NORK tables, then asked
again to *complete* what was left as bare templates. The natural temptation
with a chart this information-dense is to mechanically expand every template
into every cell — but the `dituzte`-vs-`†ditute` wrinkle (found by
cross-checking the recipe against forms §4 *already* had, before trusting it
on cells it didn't) and, more sharply, the ahalera `dezaket`-vs-`nezake`
contradiction, are exactly the kind of thing that looks like correct Basque
while teaching a paradigm that doesn't exist — the failure mode
`DECISIONS.md`'s very first entries on `izan`/`ukan` content already named.
The two moods where expansion stopped aren't a "ran out of effort" gap; they're
a place where the *cross-check itself* returned "these two facts can't both be
true," and inventing a resolution would be strictly worse than naming the
contradiction — a wrong-but-confident table is harder to fix later than an
honest unresolved flag, because nothing signals it needs a second look.
Leaving `zuek`-as-object blank throughout for a related reason
(its `-zte-` infix would, for the first time in this paradigm, collide with a
*vowel-initial* suffix — `-zte-` + `-en`/`-uzun`/… — exactly the kind of
juncture that produced the `-z-` surprise above) is the same call made
smaller: an honest gap beats a guess stacked on a guess. 🔍-marking the
recipe-derived cells (rather than presenting them at the same ✅/📖 confidence
as sourced material) keeps the file's existing confidence-key promise intact —
"📖 means cross-checked where possible", and these specific cells, by
construction, couldn't be.

**Correction (same day):** A native speaker reviewed the freshly-filled `hi`
column (and, separately, confirmed the recipe-derived `hik`→`gu` present-tense
cell `gaituk`/`gaitun` as correct, promoting it from 🔍 too) and flagged two
things about the `hi` column itself. First, `haut`/`hau`/`haugu`/`haute`
("I/he-she/we/they have you-familiar") are real — confirmed directly, no
longer 🔍. That
also exposed a misclassification: `guk`→`hi` (and, by the same bad reasoning,
`zuk`/`zuek`→`hi`) had been marked `*(refl.)*` on the assumption they'd be
"exactly as reflexive-shaped" as the already-marked `nik`→`gu`/`zu`/`zuek`
diagonal — but "we have you" involves two *different* people, so it was never
reflexive; that was pattern-matching on shape, not checking the actual
grammar, and the file now says so plainly rather than quietly fixing it.
Second — and this is the bigger find — `hauzu`/`hauzue` ("don't make sense",
the speaker said) aren't unsourced gaps either: `hi` (familiar address, *hika*)
and `zu`/`zuek` (formal address, *zuka*) are mutually exclusive registers that
can never both be arguments of one verb form, so `hik`↔`zu`/`zuek` combinations
are *impossible*, not merely unattested. That's a third category distinct from
both "(refl.)" and "🔍 unsourced", so it gets its own marker, `*(hika/zuka)*`,
applied to every such cell across all five expanded grids (replacing what had
been a mix of wrong `(refl.)`, wrong 🔍 guesses, and honest blanks). **Lesson
for future passes on this file:** "shaped like an already-known impossible
diagonal" is not evidence of *being* impossible — each blank cell's
impossibility (or lack of it) needs its own justification, not an inherited
one from a cell that merely looks similar.

**Follow-up (same day):** That lesson applied immediately — the same speaker
spotted `zuek`-to-`hiri`-type cells ("you-all are to him-familiar") still
sitting unflagged in §5's NOR-NORI dative grids, the same `hika`/`zuka`
register clash just showing up in a different grid's argument slot (dative
rather than absolutive/ergative). Marked all four affected cells
(`hiri`×`zu`/`zuek`, `zuri`/`zuei`×`hi`) `*(hika/zuka)*` across all eleven of
§5's expanded grids, and added a bullet to that section's prose explaining it
— so the marker now covers every grid where `hi` and `zu`/`zuek` could
otherwise collide as a verb form's two arguments, not just the one where it
was first noticed.

## 2026-06-08 — "Spot the error" is a sixth question kind that bundles four sentences instead of testing one person

**Decision:** Added `kind: 'spot-error'`: the learner is shown four already
filled-in example sentences — one person's own, plus three random companions
sampled from whichever persons have `sentences` data for the tense — and has
to pick the one whose verb form has been swapped for a different person's
("Hura medikua zarete." — `zarete` is `zuek`'s form, not `hura`'s `da`). It
reuses the exact same `verb.sentences[tense][person]` data as `sentence`/
`type-verb` (just filling the blank itself rather than leaving it for the
learner), and stores the wrong sentence's full text as `correct` and all four
texts as `options`, so the existing string-equality grading
(`isAnswerCorrect`/`getOptionStatus`) and `AnswerOption` rendering work
unchanged — `QuestionPrompt` only needed one new branch (render nothing extra
when `question.items` is present, since the four sentences *are* the prompt).
It's gated on `personsWithSentences.length >= 4` so it only appears for verbs
with enough sentenced persons to build four distinct ones, alongside the
per-person `sentence`/`type-verb` check.

This is the one kind that doesn't fit "one question tests one person" —
generating it still consumes one slot in the per-person loop (keeping `total`
and the queue mechanics untouched), but the question it produces samples from
across the table. That's an intentional, narrow exception: restructuring
`generateQuestions` to support variable-width questions in general would have
been a much bigger change for one kind that naturally wants to span several
forms at once.

**Why:** Asked for an exercise that builds error-*detection* rather than
recall/recognition — a skill the other five kinds don't touch, since they only
ever show the learner correct forms to choose from or type. A bare true/false
"is this sentence correct?" judgment was the first idea, but it's only a
50/50 guess; framing it as "find the one wrong sentence among four" gives it
the same ~25% guess rate as the other multiple-choice kinds, so it sits at a
consistent difficulty rather than reading as the easy one. Distractor forms
are picked uniformly at random from other persons (matching `buildOptions`'s
existing approach) rather than biased toward "near-miss" persons (e.g.
singular↔singular) — that would make for a harder, more discriminating
question, but it's an extra layer of complexity/data-shape (defining person
adjacency) that nothing else in the file needs yet; worth revisiting if this
kind turns out to be too easy to spot via subject/verb number mismatches alone.

## 2026-06-07 — The itinerary now ramps up in three stages: bare forms → richer framings → cross-lesson reviews

**Decision:** Restructured the lesson progression so it starts simple and
single, then layers in complexity and combination, in three stages:

1. **Bare forms first.** `generateQuestions` gained an `onlyBareForm` option
   that suppresses the sentence/pronoun/typed framings entirely, so a brand-new
   conjugation is first met in its simplest, most recognisable shape — pick the
   right form for "hura", nothing else going on. `createExerciseState` sets it
   whenever `attempts === 0` for a (non-review) lesson; from the second run on,
   the lesson opens up to the full mix that already existed.
2. **Richer framings on repeat.** No new mechanism here — this *is* the
   existing sentence/pronoun/typed mix from prior decisions below, now
   deliberately held back until the learner has met the bare paradigm once.
3. **Cross-lesson review checkpoints.** `LESSONS` now appends *review* lessons
   alongside the existing (verb × tense) *practice* ones: once a verb has more
   than one tense, a `{ id: '${verbId}-review', review: true, sources: [...] }`
   lesson combining all of them slots in right after (e.g. izan's present +
   past, interleaved in one session); once there's more than one verb, a final
   cross-verb "mixed review" caps the whole sequence. Review lessons carry
   `sources` (the conjugation tables they draw from) instead of a single
   `verbId`/`tense`; `createExerciseState` runs `generateQuestions` once per
   source and shuffles the results together, and every generated question now
   carries the `verbId`/`tense` it came from so `ExerciseScreen` can derive the
   right verb/badges/prompt context *per question* rather than once for the
   whole lesson — which is what makes a session that jumps between `izan`
   present and `izan` past (or `izan` and `ukan` altogether) render correctly
   and, as a bonus, gives the learner a live "which paradigm am I in right now"
   cue as it changes question to question. `describeLesson` centralises the
   practice-vs-review display copy (icon/title/subtitle/heading) so
   `LessonNode`/`ProgressTab`/`LessonResultsScreen` don't each special-case the
   two shapes, and `groupLessonsByVerb` now splits lessons into per-verb groups
   plus a trailing `mixedLessons` bucket — a "verb review" (all sources share
   one verb) still slots into that verb's section in `LearnTab`, while a
   cross-verb "mixed review" gets its own trailing `ReviewSection`, keeping
   visual order matched to unlock order (no lesson appears somewhere other than
   "right after the one that unlocked it").

**Why:** Asked to plan a learning itinerary that starts with simple,
single-conjugation exercises and works up to complex, combined ones. Gating
question framings on `attempts` (rather than e.g. a global "skill level")
keeps the existing per-lesson progress model as the single source of truth —
no new state to track or persist. Making reviews *lessons* (not, say,
occasional bonus questions mixed into existing lessons) keeps every lesson's
identity and score meaning what it always has — "how well do you know `ukan`
past" stays a question about `ukan` past alone, never diluted by surprise
`izan` questions — which matches the project's running preference (see
"Complete the sentence" below) for folding new ideas in without disturbing
lesson identity, unlocking, or progress storage. Tagging every question with
its `verbId`/`tense` at generation time, rather than threading "current verb"
state through the exercise screen some other way, means `ExerciseScreen` and
`generateQuestions` stay decoupled from whether they're in a single-source or
multi-source lesson — the same code path serves both.

## 2026-06-07 — `izan`'s example sentences must stick to identity/characteristic predicates, not location/state ones (that's `egon`'s job)

**Decision:** Reworded the `hi`/`hura`/`gu`/`zuek`/`haiek` entries of `izan`'s
`sentences.past` and `pronounSentences.past` (e.g. swapped "Hi etxean ___."
→ "Hi nire laguna ___.", "Hura hemen ___." → "Hura irakasle ona ___.",
"Zuek pozik ___." → "Zuek oso azkarrak ___."). The originals predicated
location ("etxean", "hemen", "eskolan", "kanpoan") or a temporary
state/feeling ("pozik") of the subject — in Basque those call for `egon`
("Hura hemen zegoen", not "zen"), a distinct verb from `izan` that the app
doesn't model yet. Pairing `izan`'s conjugated forms with sentences that a
native speaker would only complete with `egon` taught a wrong/non-existent
paradigm. The new sentences all predicate identity, role, or an inherent
characteristic of the subject ("nire laguna", "irakasle ona", "oso
azkarrak"), which is squarely `izan` territory and mirrors the kind of
predicates already used in `sentences.present`/`pronounSentences.present`.

**Why:** A learner flagged that the displayed pronoun for a `nork`-agreement
question (`ukan`) showed the absolutive "ni" instead of the ergative "nik"
(fixed in `QuestionPrompt` by reading the case-correct form from
`verb.pronouns` instead of the bare grammatical-person key), and in the same
pass noticed `izan`'s past-tense sentences leaned on `egon`-flavoured
predicates. Both are the same class of bug — content that *looks* like
correct Basque but tests the wrong paradigm — so worth recording together:
when adding example sentences for a verb, the predicate has to be one that
verb actually governs, not just one that's grammatical with some "to be".

## 2026-06-07 — Typing exercises are two more question kinds, not a separate mode, and reuse the sentence data

**Decision:** Added `kind: 'type-verb'` and `kind: 'type-pronoun'` —
typed-answer siblings of the existing `sentence` and `pronoun` multiple-choice
kinds. They reuse exactly the same blanked-sentence data (`verb.sentences` /
`verb.pronouns` + `verb.pronounSentences`) and roll into the same
`availableKinds` pool in `generateQuestions`, so a verb that already supports
one framing automatically supports its typed sibling with no new data fields.
A typed question carries `correct` but no `options` — `ExerciseScreen` (renamed
from `MultipleChoiceScreen`, since "multiple choice" no longer described every
question) uses `Boolean(question.options)` to pick between the option-button
grid and a new `TypedAnswerInput` text field, and `QuestionPrompt` now keys its
blanked-sentence layout off `Boolean(question.sentence)` rather than an
explicit list of "sentence-flavoured" kinds, so it didn't need to learn about
the two new kinds at all. Correctness for typed answers is judged by a new
`isAnswerCorrect` (trims and case-folds both sides) — also adopted by
`exerciseReducer` for *all* answers, since multiple-choice options are always
exact strings from the same lookup table the correct answer comes from, so
normalising them is a no-op. `rollQuestionKind` was simplified from two
`Math.random` calls (one "is it special", one "which one") to a single roll
that partitions `[0, SPECIAL_QUESTION_CHANCE)` into equal slices, one per
available kind — same distribution, easier to reason about, and makes every
available kind individually reachable by mocking `Math.random` to a constant
(the old two-roll scheme couldn't reach the second half of the kinds list that
way, which is why this also unblocked writing deterministic tests for the new
framings).

**Why:** Asked for an exercise type where the learner types the verb or the
pronoun instead of picking it. Folding it into the existing (verb × tense)
lessons as two more *question kinds* — rather than a parallel typing-mode
lesson type — keeps it consistent with every other "new question style"
decision in this log: no changes to lesson identity, unlocking, progress
storage, or the exercise state machine, and learners get organic variety
within a lesson. Requiring sentence context for both typed kinds (rather than
e.g. a bare "type the form for `hura`") isn't just data reuse for its own
sake — typing without that anchor is ambiguous for pronouns in particular
(which declined form depends on which argument and case the sentence calls
for), and staying consistent between the verb and pronoun typed framings felt
better than making one contextual and the other not. Keeping the correct
answer hidden on an incorrect typed submission (matching the existing
multiple-choice behaviour, see below) means the learner still has to recall
the spelling when the question resurfaces, rather than being handed it.

## 2026-06-07 — Pronoun-fill questions reuse the sentence-completion machinery as a third question kind

**Decision:** Added a second "fill the blank" flavour alongside the existing
verb-completion one: `kind: 'pronoun'`, where the sentence's verb is already
spelled out and the learner picks the correctly-declined personal pronoun
("___ etxe bat du." → "Hark"). Each verb can now carry `pronouns` (the
declined form per grammatical person — e.g. absolutive `Ni/Hi/Hura/...` for
`izan`'s `nor` subject, ergative `Nik/Hik/Hark/...` for `ukan`'s `nork`
subject) and `pronounSentences` (by tense → person, mirroring `sentences` but
blanking the pronoun instead of the verb). `generateQuestions` now rolls a
single "framing" per question from whichever of `sentence`/`pronoun` have
supporting data for that person/tense (`SPECIAL_QUESTION_CHANCE = 0.5`,
split evenly across the available special kinds, else `form`), and a small
`buildOptions` helper builds the four-way multiple choice from whichever
lookup table matches the question's kind — conjugations for `form`/`sentence`,
declined pronouns for `pronoun` — so distractors are always same-kind, plausible
forms. `QuestionPrompt`/`SentenceWithBlank`/`QUESTION_PROMPTS` needed only a
one-line extension since the blanked-sentence layout is identical for both
flavours.

**Why:** Asked for a second sentence-exercise style that drills declined
pronouns instead of verb forms — folding it into the same (verb × tense)
lessons as a third question kind keeps it consistent with the existing
"complete the sentence" decision below (no new lesson type, no changes to
unlocking/progress/the exercise reducer). Storing `pronouns` per-verb rather
than as a single global declension table sidesteps having to encode "which
case does this verb's subject take" as a separate lookup — each verb just
states the forms its own example sentences need, the same way `conjugations`
already does for verb forms. Splitting the roll evenly across whichever
special kinds happen to be available (rather than e.g. a fixed per-kind
chance) means adding a third blank-filling flavour later won't silently
shrink how often any existing one appears.

## 2026-06-07 — "Complete the sentence" questions are mixed into existing lessons, not a separate lesson type

**Decision:** Added an optional `sentences` field to `VERBS` (mirroring
`conjugations`: tense → person → an example sentence with `___` marking where
the conjugated form goes). `generateQuestions` now rolls, once per question
and only where a sentence exists for that person/tense
(`SENTENCE_QUESTION_CHANCE = 0.5`), whether to ask the learner to recognise
the bare form (`kind: 'form'`, the original behaviour) or to fill the blank in
that sentence (`kind: 'sentence'`). `MultipleChoiceScreen` picks its prompt
copy and layout from `question.kind` via `QUESTION_PROMPTS`/`QuestionPrompt`,
rendering the sentence with a dashed visual blank (`SentenceWithBlank`)
instead of the bare person/label pair. Everything downstream — distractors,
`exerciseReducer`, scoring, the retry queue, progress persistence, lesson
unlocking — is untouched, since both kinds still resolve to "pick the right
conjugated form from four options".

**Why:** Asked for a new exercise type where the learner sees a full sentence
and picks the verb. Folding it into the existing (verb × tense) lessons as a
second *question style* — rather than adding a third axis to `LESSONS` or a
parallel lesson type — means no changes to lesson identity, unlocking,
progress storage, or the exercise state machine, and learners get organic
variety within a lesson rather than a whole separate mode to discover and
unlock. Rolling the kind per-question (not per-lesson) keeps lessons feeling
mixed; gating on `Boolean(sentence)` means verbs/persons without an example
sentence yet fall back to the original bare-form question with no special
casing elsewhere. `Math.random` here is fine where `shuffle` already used it
— `react-hooks/purity` only objects to *direct* calls inside component render
bodies, not to impure pure-logic helpers invoked from a `useReducer` lazy
initializer.

## 2026-06-07 — Streak nudges are throttled: a session-level cooldown plus a chance check

**Decision:** Showing the streak nudge (see below) on every milestone got
mechanical fast, so `App` now tracks a `streakNudgeCooldown` (a count of
lessons to wait), passed down as `canShowStreakNudge`. Once a nudge is shown,
`onStreakNudgeShown` resets the cooldown to a random 2–4 lessons
(`randomStreakNudgeCooldown`); it ticks down by one each time a lesson is
completed. Even when eligible, `MultipleChoiceScreen.handleSelect` only shows
the nudge ~60% of the time (`rollStreakNudgeChance`). Both random calls are
pulled into their own top-level functions and invoked from the answer-time
event handler — `react-hooks/purity` (part of `eslint-plugin-react-hooks`'s
recommended config) forbids calling impure functions like `Math.random`
directly inside a component body, even from within a nested event-handler
closure, since it can't always tell render code from event code apart;
wrapping the call in its own function and invoking *that* from the handler
satisfies it without losing the "decide once, at answer time, not at render
time" property that avoids flicker.

**Why:** Asked to make the nudge "smarter" — wait a few lessons after showing
one before showing another, and add randomness so it doesn't feel mechanical.
Cooldown lives in `App` (not `MultipleChoiceScreen`, which remounts per
lesson) since it has to persist across lesson plays for the session. Rolling
the chance check in `handleSelect` (an event, not a render) and stashing the
result in state keeps the decision stable for that answer's feedback bar
without the `useMemo`-during-render purity violation or the flicker a
post-render `useEffect` roll would introduce.

## 2026-06-07 — Mid-lesson streak encouragement lives in the feedback bar, not a new screen

**Decision:** Added a `streak` counter to the exercise state (`exerciseReducer`
increments it on a correct answer, resets it to 0 on a miss) and
`getStreakEncouragement(streak)` to `lessonLogic.js`, which returns
`{ icon, headline, message }` for milestone streaks (5/10/20 in a row) and
`null` otherwise. `FeedbackBar` shows it in place of the usual "Bikain! Great
job!" line — exactly when the streak *lands* on a milestone, so it surfaces
once per streak rather than on every subsequent correct answer.

**Why:** Asked for an encouraging message between exercises (e.g. after 5
correct in a row). A full extra screen (like `LessonResultsScreen`) would
interrupt the flow mid-lesson; reusing the feedback bar that already appears
after every answer keeps the nudge lightweight and in rhythm with the
exercise. Resetting on a miss (rather than e.g. only on first-attempt misses)
keeps "in a row" meaning what it says — an unbroken run of correct picks,
matching the learner's lived experience of the session.

## 2026-06-07 — Failed questions are requeued and hidden, not revealed and skipped

**Decision:** Reworked `exerciseReducer`/`createExerciseState` to drive the
exercise off a `queue` (plus a fixed `total`) instead of a linear
`questions`/`index` pair. A correct answer drops the question from the queue;
an incorrect one pushes it to the *back* of the queue marked `retry: true`, so
it resurfaces later in the same session — the lesson only ends once the queue
is empty, i.e. every question has eventually been answered correctly.
`correctCount` (and therefore the score/star rating shown on
`LessonResultsScreen`) only credits *first*-attempt correct answers, so it
keeps measuring actual recall rather than collapsing to 100% once retries
guarantee everything gets answered right eventually. Also changed
`getOptionStatus`/`FeedbackBar` so a wrong answer only flags the learner's
(incorrect) pick — the correct option/form is no longer revealed — while a
right answer still highlights the chosen option in green as before.

**Why:** Asked for explicitly: don't show the right answer on a miss, let the
learner move on, and bring the missed item back until they get it right
unaided. Hiding the answer only matters if the question can come back, so the
two changes are coupled. Pushing to the back of the queue (rather than e.g.
reinserting a few slots ahead) is the simplest "queue" semantics that still
guarantees some spacing before a retry in lessons with more than one question.

## 2026-06-07 — End-of-lesson encouragement screen keyed off `computeStars` bands

**Decision:** Added `LessonResultsScreen`, shown when `MultipleChoiceScreen`
finishes its last question (via local `finished` state) instead of calling
`onComplete` immediately. Added `getEncouragement(correctCount, total)` to
`lessonLogic.js`, returning `{ icon, headline, message }` selected by the
*same* star band as `computeStars` (3/2/1/0 stars → Bikain!/Oso ondo!/Ondo!/Ez
etsi!, with matching emoji and tone — celebratory for a perfect run, gentle
encouragement to retry for a poor one).

**Why:** Reusing `computeStars`' bands keeps the message, the star rating
shown on the same screen, and the `Stars` badges elsewhere in the app all
telling the same story — no separate thresholds to keep in sync. Kept the
"finished" flag as local component state rather than adding a state to
`exerciseReducer` since it's purely a screen-transition concern, not part of
the scored exercise; `onComplete` (and thus `recordResult`/progress
persistence) still only fires once the learner dismisses the results screen.

## 2026-06-07 — Use `dvh` instead of `vh`/`screen` for full-height screens

**Decision:** Switched `HomeScreen` and `MultipleChoiceScreen` from
`min-h-screen` (`100vh`) to `min-h-dvh`/`h-dvh`. Also restructured
`MultipleChoiceScreen` so the question/options area scrolls internally
(`overflow-y-auto` + `min-h-0` on the flex item) inside a fixed `h-dvh`
container, keeping the close button, progress bar, and `FeedbackBar`
(with its Continue/Finish button) always pinned within the visible area.

**Why:** On mobile browsers, `100vh` reflects the viewport height with the
browser chrome (address bar, gesture nav) hidden — which is taller than
what's actually visible when that chrome is shown. That made the bottom of
`MultipleChoiceScreen` (crucially, the Continue/Finish button) render below
the visible fold, looking cut off with no obvious way to reach it. `dvh`
units track the *current* visible viewport, and the internal-scroll layout
guarantees the action button stays reachable regardless of content height
or browser-chrome state.

## 2026-06-07 — Deploy to GitHub Pages via Actions, with hardcoded `base`

**Decision:** Set `base: '/testapp005/'` in `vite.config.js` and added
`.github/workflows/deploy.yml`, which builds on push to `main` and publishes
`dist/` using the official `actions/upload-pages-artifact` +
`actions/deploy-pages` flow (requires the repo's Pages source to be set to
"GitHub Actions" once in Settings → Pages).

**Why:** GitHub Pages serves project sites from `https://<owner>.github.io/<repo>/`,
so asset URLs need the repo-name prefix — Vite's `base` handles rewriting both
the build output and dev-time references. Hardcoded the repo name rather than
deriving it (e.g. from `process.env.GITHUB_REPOSITORY`) since this app isn't
expected to be renamed or forked under a different name; if that changes,
update `base` to match.

## 2026-06-07 — Extracted pure lesson logic into `src/lessonLogic.js`

**Decision:** Moved `computeStars`, `recordResult`, `getUnlockedLessonIds`,
`shuffle`, `generateQuestions`, and `exerciseReducer` out of `App.jsx` into a
new `src/lessonLogic.js` module.

**Why:** Wanted to unit-test these pure functions directly, but exporting
non-component functions from `App.jsx` trips the
`react-refresh/only-export-components` ESLint rule (it breaks Fast Refresh).
Splitting them out also keeps `App.jsx` focused on components/screens and
makes the logic easier to reason about and test in isolation as the app grows.

## 2026-06-07 — Added unit/component tests (Vitest + RTL), held off on e2e

**Decision:** Set up Vitest + React Testing Library for unit and component
tests (`src/logic.test.js`, `src/App.test.jsx`). Did not add an end-to-end
suite (e.g. Playwright) yet.

**Why:** The riskiest logic — scoring, lesson unlocking, progress persistence,
question generation, the exercise state machine — is pure and cheap to unit
test directly. E2e tests are the slowest and most maintenance-heavy layer of
the testing pyramid; worth adding once the app grows more complex multi-screen
flows that are worth protecting end-to-end (e.g. once periphrastic verbs,
dialect variants, or more navigation land). Playwright + a working Chromium
are already available in the dev container if/when we revisit this.

## 2026-06-07 — Added CI (GitHub Actions: lint, test, build)

**Decision:** `.github/workflows/ci.yml` runs `npm run lint`, `npm test`, and
`npm run build` on every push and pull request.

**Why:** An automated gate is what actually *prevents* regressions from
landing — relying on remembering to run checks locally doesn't scale as the
app evolves and more changes land via agents.

## 2026-06-07 — SessionStart hook installs deps synchronously

**Decision:** `.claude/hooks/session-start.sh` runs `npm install`
synchronously (not in async mode) on Claude Code web sessions, gated on
`$CLAUDE_CODE_REMOTE`.

**Why:** Guarantees dependencies are installed before the agent starts
working, avoiding race conditions where it might try to lint/test/run before
`node_modules` exists. Tradeoff: session start is gated on `npm install`
completing. Can switch to async mode later if startup latency becomes
annoying — see the `session-start-hook` skill.
