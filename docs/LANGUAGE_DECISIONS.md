# Language decisions

A running log of decisions from the research process that filled out
`CONJUGATIONS.md`'s conjugation grids and `VERB_COVERAGE.md` — the Basque
conjugation content being taught, as distinct from the app/code decisions
(including the interface-language/i18n feature) in `docs/DECISIONS.md`.
Newest entries at the top.

## 2026-06-26 — Added Subjuntiboa and Agintera (Imperative) NOR-NORI-NORK tables to §5

User requested audit of §5's completeness: all six NOR-NORI-NORK tenses
should have full conjugation tables. Found that Subjuntiboa (Present and
Past) and Agintera (Imperative) were documented in §16.1–16.2 but not yet
tabulated in §5's main grid-reference section. Added:
- **Subjuntiboa, Orainaldia (Present subjunctive)**: Six NORI recipient rows
  (niri, hari, guri, zuri, zuei, haiei) with both singular and plural NOR
  forms, following the drop-`-ke-` + `-n`-suffix-family rule from §16.1.
  All person-category restrictions (*(refl.)*,  *(hika/zuka)*, *(zu↔zuek)*)
  preserved from the existing Ahalera grid. Added sample usage examples.
- **Subjuntiboa, Lehenaldia (Past subjunctive)**: Not tabulated. Documented
  the policy (mirroring §16.1) that synthetic past forms this far down the
  ditransitive paradigm are vanishingly rare/unverifiable; real usage favours
  periphrastic alternatives (`eman ahal izan banio...`).
- **Agintera (Imperative), ditransitive**: Four sub-tables covering all
  combinations of addressees (zuk, zuek, hik, haiek) and object numbers
  (singular, plural with `-zki-`), with NORI recipients (niri, hari, guri,
  haiei). Noted that jussive 3rd-person forms are restricted to narrative/
  formal contexts; modern colloquial favours periphrastic `bedi`/`bitez`.

All tabulated forms already documented in §16 — this was a cross-file
reorganization for completeness in §5's reference layout.

## 2026-06-26 — Added `etorri` NOR-NORI (dative) present+past tables

User asked to verify whether `natorkio` (etorri + dative, to him/her) and
related forms exist in standard Basque. Web research confirmed:
- **Present singular-NOR forms** (natorkít, datorkit, zatorkit, etc.):
  attested in contemporary standard Batua, including in song titles and
  idiomatic use.
- **Past singular-NOR forms** (zetorkidan, zetorkion, etc.): attested via
  the idiom "burura/gogora etorri" (to come to mind), a living feature of
  standard speech.
- **Plural-NOR and mood forms** (potential -ke, conditional baldintza/
  ondorioa): derivable via the standard rule (NOR-prefix + stem + `-ki-` +
  NORI-suffix) but not independently attested in available sources. `WebFetch`
  failed on all conjugation-table URLs (ZUZEU, Wiktionary); `WebSearch`
  returned only single-form hits, not complete paradigms.

Decision: added NOR-NORI present/past tables to CONJUGATIONS.md §6's etorri
subsection (new subheading), documenting the confirmed singular-NOR forms
and noting that plural-NOR and moods are omitted pending native-speaker
verification. App data (`verbs.js`) left unchanged — extending `etorri`'s
`agreement` to include `'nori'` and wiring dative conjugations into lessons
is a separate scope, tracked separately (if needed).

## 2026-06-26 — Added `eraman`/`ekarri` plural-object forms (`zenekartzan` etc.)

`eraman` and `ekarri` were the last two `nor-nork` synthetic verbs in
`VERBS` still missing plural-object (`-tza-` infix) conjugations —
`eduki` and `jakin` already got theirs via #284/#287, but #260's original
comment for `eraman`/`ekarri` claimed this matched their "precedent,"
which was stale by the time #284/#287 landed. Added `presentPlural`/
`pastPlural`/`futurePlural` for both, sourced directly from
CONJUGATIONS.md §7's existing `/daramatza`/`/dakartza`-style table
columns (no new derivation needed — these were already tabulated in the
docs, just not carried into `verbs.js`). This closes the *zenekartzan*
gap a user asked about directly.

Ran `scripts/validfor-delta-audit.mjs --verb eraman`/`--verb ekarri` per
its own convention to review the new gap slots these tenses create (other
verbs' `presentPlural`/`pastPlural`/`futurePlural` sentences where
`eraman`/`ekarri`'s new forms are agreement-compatible). None read as a
natural also-correct completion — `eraman`/`ekarri` ("carry"/"bring")
don't fit the locative-only or unrelated-verb sentences in the candidate
list — so no `validFor` tags were added; regenerated
`scripts/validfor-gap-baseline.json` to reflect the new (reviewed) gap
count instead.

## 2026-06-26 — Scope of §6/§7's mood-table gap: only add what's confirmed standard, not pattern-derived

Asked to "fill all the possible tenses" for the weaker synthetic verbs
(`egon`, `joan`, `etorri`, `ibili`, `jakin`, `ekarri`, `eduki`, `erabili`,
`eraman`, `jario`) the way §2/§3 do for `izan`/`ukan`, with the explicit
constraint to only include forms "in use in standard basque." Mechanically
extending `izan`/`ukan`'s mood-formation recipes (stem + `-ke-` for
ahalera, `ba-` + past-minus-`-n` for baldintza, etc.) to these verbs was
tempting but unreliable — they don't share `izan`/`ukan`'s root, and even
`egon`'s own doc citations are inconsistent about which mood a given form
belongs to (*nengoke* is cited as both ondorioa and ahalera-adjacent
depending on the passage).

Web research (Euskaltzaindia search results, Basque-grammar blogs) turned
up isolated forms like *banengo* → *nengoke* (egon), *banindoa* →
*nindoake* (joan), *banentor* → *nentorke* (etorri), *banenbil* →
*nenbilke* (ibili) explicitly described as **regional/dialectal**, not
universally standard — confirming the suspicion rather than resolving it.
No source was found tabulating a complete 7-person mood paradigm for any
of these verbs as standard Batua.

Decision: added explanatory notes in §6/§7 (and a §13 cross-reference)
stating that these verbs have no confirmed-standard mood forms beyond
present/past — except `egon`'s `ni`-form examples already cited in §13
(*nagoke*, *banengo*, *nengoke*, *nengokeen*, *nengoen*) — rather than
adding tables of derived-but-unverified forms. This follows the same
restraint §7 already applies to `ikusi`/`entzun`/`jan`/`edan`/`erosi`
(verbs noted as having no productive synthetic paradigm at all): omit and
explain, don't fabricate. If a native speaker or authoritative source
later confirms specific fuller paradigms, they can be added then.

## 2026-06-25 — Criterion for `wordOrderSafe` (which sentences are fair to grade as a single-order reorder drill)

The `word-order` drill (reassemble a scrambled sentence) can only fairly grade
sentences with a single defensible order, but Basque word order is governed by
the **galdegaia (focus) rule**: whatever sits immediately before the finite
verb is the focus, and most constituents can move to claim that slot. So a
sentence like "Zuek herriko danborrada entzuten duzue goizean" has several
grammatical orders ("...danborrada goizean entzuten duzue" just refocuses onto
*goizean*) — grading one as the only right answer is wrong. (Mechanism for the
opt-in gate is in `docs/DECISIONS.md`/`docs/EXERCISE_ENGINE.md`; this entry is
the *language* criterion for the tag.)

A sentence variant earns `wordOrderSafe: true` only when its taught/neutral
order has **no reasonable competing arrangement a learner would produce**. The
operative invariant, applied during the first curation pass (negatives only):
a negated sentence is safe iff it has **exactly one constituent after the
pinned `ez`+auxiliary** (plus a fronted subject) — i.e. no *second* adjunct
competing for the slot. By complement type:

- **Yes — single predicate/complement after `ez`+aux**, regardless of whether
  it's a predicate nominal (`izan`: "Ni ez naiz irakaslea"), a locative
  (`egon`/`ibili`: "Ni ez nago etxean"), an object (`ukan`/`jakin`: "Nik ez
  dut liburu bat"), or an allative (`joan`/`etorri`: "Ni ez noa hondartzara").
  The `ez`+finite-verb sequence is pinned and the lone complement follows it;
  the only alternative (fronting that complement for contrastive focus) is
  marked enough that a learner won't default to it.
- **No — two movable constituents.** A sentence with both an object *and* a
  locative (`eduki`: "Nik ez daukat giltza poltsikoan"), or a time adverb
  *and* an allative (`etorri`'s `zu`/`hura`: "Zu ez zatoz bihar eskolara"),
  has several natural orders — left untagged. Same for the `jakin` past
  `hura`/`haiek` items, whose complement is a whole subordinate clause.

Tagged in the negatives pass: `izan`/`egon`/`ibili` (locative/predicate, all
persons), `ukan`/`jakin` (object; `jakin` also past `ni`/`zu`), `joan`
(allative, all persons), `etorri` (`ni` only).

## 2026-06-25 — `wordOrderSafe` affirmatives pass (4-word periphrastic, single-complement)

Extended the tag to affirmative sentences. The danborrada complaint that
started this was itself an affirmative, so the bar stayed strict. The safe
affirmative shape is **a periphrastic clause that fills out to exactly four
words** — `[subject] [one complement] [participle] [auxiliary]` — which leaves
the participle+aux as a tight two-word block and a single content slot before
it. Filter used (scripted, then reviewed):

- `type: 'periphrastic'` (the participle+aux supplies two of the four words, so
  four words ⇒ exactly one non-subject constituent — a *synthetic* verb at four
  words would instead mean two complements, e.g. `eduki`'s "Nik giltza
  poltsikoan daukat", object + locative);
- `agreement` excludes `nori` (a dative argument reorders freely against the
  absolutive — `ahaztu`/`gustatu`/`deitu`/`antzeman` etc. are out);
- **exactly four words** after filling the blank (five-plus almost always means
  a trailing time/place adjunct — "...adierazten du **kalean**" — i.e. the
  danborrada ambiguity; those stay untagged).

This yields canonical SOV transitives ("Nik ura edaten dut", "Hark filma
ikusten du"), the progressive frame (`ari`: "Ni idazten ari naiz", gerund
locked before `ari`), modal `nahi` ("Zuk etorri nahi duzu"), and `-arazi`
causatives ("Guk umeak dantzaraziko ditugu"). Verbs covered: `jan`, `edan`,
`erosi`, `ikusi`, `hartu`, `ari`, `nahi`, `ukatu`, `itzularazi`, `dantzarazi`.
Because `sentences.future` is aliased to `present` by reference (and `past`
falls back the same way when there's no adverbial past frame), tagging a
present template automatically covers its future/past fillings — same
two-word verb block, same four-word shape.

Deliberately still untagged: five-plus-word affirmatives (trailing adjunct),
synthetic-verb sentences with two complements, and any `nori` verb. Those
remain a later, fluent-reviewed pass — each is a naturalness judgment like the
`validFor` bar in `docs/SENTENCE_FRAMES.md`.

## 2026-06-24 — Open question: `hartu`/`erosi`'s `animateObject` call (#442) needs native-speaker confirmation

#442 added `animateObject: false` to gate a verb's personal-object cells out of its composed NOR-NORK object-axis table, and flagged `hartu`/`erosi` (both `dativeOvergeneration: true`, both already have a composed `presentByObject`/`pastByObject` table from #436) as a borderline call: `hartu` "take [someone]" reads as plausible (escorting/fetching a person), `erosi` "buy [someone]" reads as a metaphor (or worse, human trafficking) rather than the literal sense the table drills — but neither call was made here. Left both unset (default `true`, unfiltered) pending a native speaker confirming which, if either, should flip to `false`. Whoever resolves this should also check whether flipping either one orphans an already-shipped Unit 15 lesson (`src/data/lessons.js`'s `hartu-object-axis-present-zuek`, `erosi-object-axis-past-zu`, and the pooled `object-axis-*-review*` lessons all draw on these verbs' personal-`nor` cells) — same caveat #442 left for `jan`/`edan`, deferred to #443's Unit 15 rework.

**Still open as of #443**: #443 widened Unit 15's pool with ~30 *other* verbs (gating the unambiguous thing-only ones among those) but deliberately did not resolve this specific `jan`/`edan`/`erosi`/`hartu` question — flipping any of the four still requires rewriting the `persons` arrays of the shipped lessons named above in the same change, and `erosi`/`jan`/`edan`'s readings ("buy/eat/drink a person") are sensitive enough that a guess didn't feel right to bundle into an otherwise mechanical widening pass. Still pending a native-speaker call (or an explicit "we accept Claude's best-effort call" from a maintainer) before anyone resolves it.

## 2026-06-24 — Plural-object (`ditut`/`nituen`) tables for eight long-tail transitive verbs whose example sentences had plural objects

A user flagged "Guk baserriko barazkiak plazan saltzen **dugu**" as wrong — a
plural absolutive object (*barazkiak*, "the vegetables") forces plural-object
agreement on the auxiliary, so it must be *saltzen **ditugu***. Auditing every
`object: 'hura'` NOR-NORK verb surfaced the same mismatch in **8 verbs**: their
example sentences carried genuinely plural objects, but their conjugation
tables were singular-object only (`object: 'hura'`, i.e. only `dut`/`du`/...).
Affected verbs/objects: `egin` (talo freskoak), `irakurri` (olerkiak), `idatzi`
(bertso berriak, kantu hitzak), `ikasi` (dantza tradizionalak, arrantza
teknikak), `entzun` (kantuak), `utzi` (giltzak, abarketak, otarrak, poltsak),
`bilatu` (opor egokiak), `saldu` (barazkiak, artisautza lanak).

- **Fix chosen:** add `presentPlural`/`pastPlural`/`futurePlural` tables to
  these verbs (rather than singularising the sentences), then move each
  plural-object sentence out of the singular `present`/`past` buckets into the
  matching `presentPlural`/`pastPlural` buckets so it's answered by the
  plural-object table. The sentence wasn't wrong — the missing table was.
- **Forms** are the mechanical `dit-`/`nitu-` swap on the same participle/stem
  as the singular tables (`saltzen dut` → `saltzen ditut`, `saldu nuen` →
  `saldu nituen`, `salduko dut` → `salduko ditut`), exactly mirroring
  `jan`/`erosi`'s existing plural tables (#284). `sentences.futurePlural`
  reuses `presentPlural` by reference via the existing end-of-file loop; the
  `pastPlural` sentence buckets are hand-placed (no auto-alias for past).
- **Flag for native-speaker review:** these `dit-`/`nitu-` forms are
  mechanically derived and inherit the same standing "unconfirmed" flag as the
  rest of the periphrastic plural-object tables. `validFor` left `[]` on every
  relocated sentence (same conservative default as the rest of this batch).

## 2026-06-24 — #370: causative (`-arazi`) grammar documented, no new auxiliary needed

Researched and added `docs/CONJUGATIONS.md` §17 ("Causative (Arazlea)") to
unblock #370 (Units 37-39), whose "Done when" required citing the causative's
argument-structure conditioning before any `VERBS` data gets written.
Cross-checked across multiple grammar sources (Euskaltzaindia's own grammar
site, academic literature on Basque causatives/implicit causees, and learner
references) rather than relying on a single source, since this paradigm
wasn't previously documented anywhere in the repo:

- **Formation**: `-arazi` attaches to the bare radical (§16.3's existing
  Radical/Bare-Stem Rule — `idatzi`→`idatz-`→`idatzarazi`). `-erazi` is *not*
  a productive vowel-harmony variant (a common misconception) — it only
  survives in lexicalized forms like `adierazi`. Noun+`egin` compounds use
  the separately-lexicalized `eragin`, not `-arazi`.
- **Valency promotion** (the actual grammar, confirmed across sources): `NOR`
  base → `NOR-NORK` causative, original subject stays absolutive (the
  causee); `NOR-NORK` base → `NOR-NORI-NORK` causative, original object stays
  absolutive, original subject demotes to dative (the causee). This is the
  standard Batua "direct causative." A western-dialect "indirect causative"
  variant (dative causee even for `NOR`-base verbs) exists but is out of
  scope per `CLAUDE.md`'s `dialect: 'batua'`-only scope — noted in §17.6 so
  it isn't mistaken for an error if encountered elsewhere.
- **No new auxiliary morphology**: the big simplification. A causative is an
  ordinary periphrastic verb (§11) on a derived stem (`idatzarazi`,
  `etorrarazi`) — it conjugates with the *already-documented* `ukan` (§3) or
  `ukan`-dative (§5) auxiliary, exactly like any other periphrastic verb.
  §17.4's worked tables are direct citations from §3/§5, not new forms.
- **Ceiling, scoped out**: causativizing an already-`NOR-NORI`/
  `NOR-NORI-NORK` verb (`gustatu`-family, `esan`/`eman`) has no 4th
  cross-referencable slot — the causee can only be expressed via an
  "indirect causative" with an implicit causee, a distinct construction this
  app doesn't model. Units 37-39 should scope to causatives of `NOR`/
  `NOR-NORK` base verbs already in `VERBS` (`etorri`/`joan`/`egon`,
  `idatzi`/`ikusi`/`irakurri`-class) — same kind of scope cut #369 made for
  its own ditransitive-subjunctive-past ceiling case.

This research pass is doc-only — no `VERBS`/`journey.js`/`lessons.js`
changes yet. #370 still needs the data-shape decision (a causative wraps an
*existing* verb's stem rather than being a standalone paradigm — likely a
`causative: { baseVerbId, conjugations: {...} }`-shaped entry, or its own
verb entries with a `derivedFrom` pointer) and concrete Units 37-39
`lessonIds` scoping before the `blocked` label comes off.

## 2026-06-22 — #384: jarraitu/jario sourcing and scope calls

Added two more NOR-NORI verbs alongside `gustatu`/`iruditu`/`ahaztu`, per
`docs/VERB_COVERAGE.md:169` (`jario`) and `:205-210` (`jarraitu`):

- **`jarraitu`'s nor-nork-vs-nor-nori ambiguity** — `jarraitu` patterns as
  NOR-NORK ("jarraitzen dio" = "continues it") *and* NOR-NORI ("jarraitzen
  zaio" = "follows him/her", in a succession sense), and the issue flagged
  this as the one thing to get right. Picked a sentence frame that's
  unambiguously the NOR-NORI succession reading and can't be misheard as
  "continue it": turn order ("Aitorren txanda {nori} jarraitzen zait/zaizu/
  zaio/...", "Aitor's turn comes right after me/you/him/..."). Every
  `validFor` is left empty (`[]`) rather than guessed, same conservative
  default already used elsewhere for newly-authored sentences pending
  native-speaker review (#316).
- **`jario`'s table transcription** — `docs/CONJUGATIONS.md:1392-1400`'s
  grid is the source of truth, used directly over `VERB_COVERAGE.md:61`'s
  own abbreviated prose (which writes the niri-form example as `dariot`,
  one letter off from the grid's literal `dari(zki)t` → `darit`). Where the
  two disagreed, the grid won — it's the line-numbered, cell-by-cell
  source the issue itself points to; the prose elsewhere is a rougher
  paraphrase. The `(zki)` plural-`nor` alternant is dropped (out of scope
  per the issue — `jario`'s `nor` doesn't vary by person the way `ukan`'s
  does, so there's no `*ByNor` axis to build here).
- **`hi`/`hiri` omitted on both verbs** — same convention as `gustatu`/
  `iruditu`/`ahaztu` (#144): `jario`'s own past hitanoa cell
  (`zeri(zki)(n)an`) is written ambiguously enough in the source that
  guessing the masc./fem. split without a native check seemed worse than
  just omitting it, consistent with every other NOR-NORI verb already in
  `VERBS`.
- **`jario` is `recognitionOnly: true`**, not wired into any lesson by this
  issue — `VERB_COVERAGE.md:169` itself calls it "oso erabilpen mugatua"
  (very limited everyday use), so it's exposure-only content for whichever
  future issue pools it into a review, same flag the academic/rare fodder
  tiers use (#330). `jarraitu` is full periphrastic production-shaped data
  (no `recognitionOnly`) but likewise isn't wired into `LESSONS`/`journey.js`
  here — the issue's own "Done when" stops at "ready to be pooled into a
  review lesson," leaving that pooling to a separate issue.

## 2026-06-21 — #355: no NOR-NORK object-axis imperative — Unit 36 needs no extension

**Question:** does a `NOR-NORK` imperative with a 1st/2nd-person object (a
`zaitzaket`-type form, "see me!"/"see us!") exist as a distinct grammatical
form, the way it does for Ahalera/Baldintza/Ondorioa/Subjuntiboa (#352/#353)?

**Conclusion: no — not as a separate synthetic form.** Reasoning:

- `docs/CONJUGATIONS.md` §16.2's `NOR-NORK` imperative table (`ezazu`/`itzazu`,
  `bedi`/`bitza`, `dezagun`/`ditzagun`) is derived mechanically from the
  `NOR-NORK` subjunctive root (§3) by dropping the leading `d-` —
  `dezazu` → `ezazu`. That `d-` only exists on the cells where `NOR` is
  3rd-person (`hura`/`haiek`, the `deza-`/`ditza-` stems); the cells where
  `NOR` is 1st/2nd person use the object-prefix forms instead (`nazazun`,
  `gaitzazun`, `zaitzazun`, …, per §3's full subjunctive grid,
  `docs/CONJUGATIONS.md:370-378`) — there's no leading `d-` for the
  imperative-formation rule to strip, so the mechanical derivation that
  produces every other person's imperative cell simply doesn't apply here.
- This isn't just a documentation gap — §16.3's PCC re-verification confirms
  `NOR` = 1st/2nd person is independently fine in subjunctive/imperative
  *moods* (the constraint only blocks `NORI` = 1st/2nd person stacking with
  `NOR` = 1st/2nd person, irrelevant to plain `NOR-NORK`). The gap is
  specifically that **no dedicated imperative register exists for those
  cells** — Basque routes "have someone do something to you/me" through a
  subjunctive complement instead (`Nahi dut ikus nazazun`, "I want you to
  look at me") rather than a bare command, structurally because the
  addressee (the commanded `NORK`) and a 1st/2nd-person `NOR` both being
  non-3rd-person speech-act participants on the same command clashes with
  what an imperative *is* (an instruction about an action's effect on
  someone other than a co-present interlocutor) — the same person-hierarchy
  effect on imperatives documented cross-linguistically for object-marking
  language imperatives, not a Basque-specific oddity.
- This is **inferred from the documented morphology and PCC discussion
  already in `CONJUGATIONS.md`, not a direct citation** — flagging for
  native-speaker/grammar-reference confirmation before treating as fully
  settled, per the toka/noka precedent (2026-06-17, #167).

**Outcome:** #351's epic table already anticipated this ("Unit 34 may need
no extension at all") — confirmed. Unit 36 (Agintera, `journey.js:664-671`,
formerly Unit 34 before renumbering) needs no object-axis lesson; no
`VERBS`/`journey.js` changes from this issue. #351 updated to mark this
sub-issue resolved with no further action.

## 2026-06-20 — #334: optionally-dative verbs — reading decisions + future fodder

**Part 1 — six optionally-dative verbs each get a second `<verb>-dative` `VERBS` entry**, since no existing convention lets one verb id carry two simultaneous agreement-frame readings:

- `itxaron-dative` ("wait for someone") — no overt accusative object (the thing waited for is implicit, not a noun phrase competing for the object slot the way `eman`'s gift or `esan`'s "egia" is), so it's the *covert*-dative shape `recipient: 'hura'` (#307's `lagundu` family), not the `esan`/`eman` shape. Wired in as Unit 30's `dative-verb-*` pools' 10th carrier (present/past/future + the cumulative review), since it's structurally identical to the rest of that family and the pedagogical point of that pool (drilling #293's "covert dative" lure — no overt object to hint NORI) applies to it too.
- `saldu-dative`, `utzi-dative`, `adierazi-dative`, `eskatu-dative`, `galdetu-dative` — genuinely ditransitive: an overt accusative object *plus* a dative recipient ("etxea saldu diot" — "I sold him the house"). This is the `esan`/`eman` shape (§4a/§4b), not the covert-dative shape, so mixing them into Unit 30's `dative-verb-*` pools would muddy that pool's specific "no overt object" pedagogical contrast. Instead they got a new sibling pool family, `ditransitive-dative-{present,past,future}(+plural)` plus a cumulative `ditransitive-dative-review(+plural)`, wired into Unit 27 (present) and Unit 28 (past/future/review) alongside `esan`/`eman`'s own lessons — the existing semantic/structural home for this shape.

All six new entries use `recipient: 'hura'`/`person`-varies-over-NORK, the same `diot`-family present aux as `esan`/`lagundu` (present `Xtzen diot/diozu/dio/diogu/diozue/diote`, past `X nion/zenion/zion/genion/zenioten/zioten`, future `Xko/Xgo diot/...` per the `-ko`/`-go` rule). No new `sentences` blocks were added (consistent with #334 Part 2's "behar/nahi precedent" — these are carriers, not new lessons, so the multiple-choice engine drills the conjugation table directly without needing dedicated sentence frames). Ran the `validfor-delta-audit.mjs` workflow afterward: the new gap slots against `esan`/`eman`/`lagundu`-family sentences are the same axis-mismatch non-substitutions already documented in `esan`'s `VERBS` comment (different fixed argument ⇒ a shared `person` label names a different grammatical role) — `validFor: []` throughout, baseline regenerated.

**Part 2 — future-tense fodder forms.** Per #318, sourced `future` tables into the 16 `VERBS` entries that still lacked them: the 9 #307 covert-dative verbs (`lagundu`/`ekin`/`erantzun`/`deitu`/`eragin`/`antzeman`/`mesede-egin`/`kalte-egin`/`aurre-egin`) and 7 of the 9 #306 `egin`-construction verbs (`hitz-egin`/`lan-egin`/`lo-egin`/`ahaleginak-egin`/`parte-hartu`/`kontuan-hartu`/`arreta-eman` — `ados-egon`/`arriskuan-jarri` already had `future`). Wired each batch as carriers into a new sibling pool (`egin-construction-future(+plural)`, `dative-verb-future(+plural)`) in the *same* units that already host that family's present/past pools (29 and 30 respectively), rather than Unit 20's thematic future mixer — the mixer's lessons are narrowly scoped to a specific present-tense `nor`/`nor-nork` contrast among `izan`/`ukan`/`joan`/`ikusi`/etc., and these 16 verbs don't share that contrast; the present/past sibling-pool convention already established for every other verb family was the better fit.

## 2026-06-20 — #333: `eraman`/`ekarri`'s synthetic forms are the higher-register choice

**Note:** `eraman`/`ekarri` (Unit 42, "Carrying & Bringing") are taught on
their synthetic NOR-NORK present/past tables (`daramat`/`dakarte`, etc.) —
correct and the form CONJUGATIONS.md documents, but worth flagging that
everyday spoken Basque leans periphrastic for these two more than for most
other synthetic verbs in the curriculum (`eraman dut`/`ekarri dut` are
common, especially outside formal registers), unlike e.g. `izan`/`egon`
whose synthetic forms are the only forms in any register. No data change
follows from this — the synthetic drill is still the right thing to teach
first (it's the form `VERB_COVERAGE.md` §4a commits to, and it's what makes
these two count as "irregular synthetic morphology" rather than regular
pool verbs per #329/#333's particularity audit) — but a future
`docs/LEARNING_JOURNEY.md` gloss or in-app note could mention the
periphrastic alternative as a "you'll also hear..." aside, the way
`dativeOvergeneration` (#293) already flags real-usage variance on these
same two verbs from the other direction (covert dative, not auxiliary
choice).

## 2026-06-20 — #307: nine "covert dative" agentive verbs — morphology sourcing

**Decision:** added `lagundu`, `ekin`, `erantzun`, `deitu`, `eragin`,
`antzeman`, `mesede-egin`, `kalte-egin`, `aurre-egin` to `VERBS`, all
`agreement: ['nor', 'nori', 'nork']` with `recipient: 'hura'` (NORI fixed to
third person, `person` varies over NORK) — the exact same shape as `esan`
(`CONJUGATIONS.md` §5's `dio`-family, `NOR`=`hura`/`NORI`=`hari` row:
present `diot/diozu/dio/diogu/diozue/diote`, past `nion/zenion/zion/genion/
zenioten/zioten`).

Morphology derivation, following the established `-tzen`/`-ten`
imperfective-participle split from #319/#320/#321/#306 (consonant/`-tu`-final
stems → `-tzen`; `-n`-final or irregular stems → `-ten`):
- `lagundu` → `laguntzen diot` / `lagundu nion` (the `-ndu` cluster
  assimilates to `-ntzen`, same pattern as `bildu`→`biltzen`)
- `ekin` → `ekiten diot` / `ekin nion` (`-in`-final, `-ten`)
- `erantzun` → `erantzuten diot` / `erantzun nion` (`-n`-final, `-ten`)
- `deitu` → `deitzen diot` / `deitu nion` (`-tu`-final, `-tzen`)
- `eragin` → `eragiten diot` / `eragin nion` — mirrors `egin`'s own
  irregular `egiten` (both are `-in`-final and historically related: `eragin`
  is `egin`'s causative, "to cause to do")
- `antzeman` → `antzematen diot` / `antzeman nion` — mirrors `eman`'s own
  `ematen` (`antzeman` is lexically `antz` + `eman`, "to give a likeness to")
- `mesede-egin`/`kalte-egin`/`aurre-egin` → `mesede/kalte/aurre egiten diot`
  / `... egin nion` — the dative `egin` compounds deferred from #306 (see
  that entry below for why the noun+`egin` shape rides `egin`'s own
  paradigm with the noun prefixed onto every form); these differ from
  #306's batch only in taking `diot` instead of `dut`, since the noun's
  implicit argument is a dative "for/against whom" rather than a plain
  object.

No `future` table was added for any of the nine — matching #306's own scope
decision (see `docs/DECISIONS.md`) to ship present+past only and leave future
as a follow-on rather than bloating every new-verb batch with a third tense
tier nothing currently lessons against.

**Skipped:** the issue's "optionally-dative" set (`itxaron` plus the #304
optionally-ditransitive `saldu`/`utzi`/`adierazi`/`eskatu`/`galdetu`) needs
its own sourcing pass to resolve which of each verb's two readings (plain vs.
dative) is natural/common enough to drill — a fundamentally different kind
of research question than this batch's unambiguous dative verbs, so it's
left to a follow-up issue rather than guessed at here.

## 2026-06-20 — #306: nine `egin`-construction fixed expressions — morphology sourcing

**Decision:** added `hitz-egin`, `lan-egin`, `lo-egin`, `ahaleginak-egin`,
`parte-hartu`, `kontuan-hartu`, `arreta-eman`, `ados-egon`,
`arriskuan-jarri` to `VERBS`. Each rides an already-sourced base verb's
exact paradigm with an invariant noun/particle prefixed onto every form:

- `hitz`/`lan`/`lo`/`ahaleginak egin` ride `egin`'s own present
  (`egiten dut/duzu/du/dugu/duzue/dute`) and past
  (`egin nuen/zenuen/zuen/genuen/zenuten/zuten`) tables verbatim —
  CONJUGATIONS.md's existing `egin` entry, prefixed.
- `parte`/`kontuan hartu` ride `hartu`'s present
  (`hartzen dut/duzu/du/dugu/duzue/dute`) and past
  (`hartu nuen/zenuen/zuen/genuen/zenuten/zuten`) tables verbatim.
- `arreta eman` rides `eman`'s imperfective-participle shape
  (`ematen`) but **not** `eman`'s own ditransitive (`nor-nori-nork`)
  conjugation table — "to pay attention" is used transitively
  (`nor-nork`, `ukan`'s plain suffixes), not "give attention to
  someone" in the dative sense `eman`'s own entry models. Present:
  `arreta ematen dut/duzu/du/dugu/duzue/dute`; past:
  `arreta eman nuen/zenuen/zuen/genuen/zenuten/zuten`.
- `ados egon` rides `egon`'s full synthetic present/past/future tables
  (including `hi`, omitted from `future` — same shape as `egon`'s own
  entry) verbatim, prefixed with `ados`.
- `arriskuan jarri` is the one expression with no precedent base-verb
  entry to ride — `jarri` itself isn't in `VERBS`. Modeled as a
  standalone `agreement: ['nor']` periphrastic entry on `izan`'s
  suffixes (`naiz/zara/da/gara/zarete/dira` present-tense pattern,
  `nintzen/zinen/zen/ginen/zineten/ziren` past), with `jarri`'s own
  non-finite forms derived the same way #320/#321 derived others:
  imperfective participle `jartzen` (drop trailing `-i`, add `-tzen` to
  the `jar-` stem — same rule as `gaitzetsi`→`gaitzesten`'s family, just
  without the coronal-obstruent `-ten` allomorph since `jar-` doesn't end
  in one), future `jarriko` (vowel-final stem + `-ko`, same rule as
  `hartu`→`hartuko`). This is a deliberate one-off — `jarri` doesn't get
  its own base `VERBS` entry, since nothing else in the curriculum needs
  it yet (see `docs/DECISIONS.md`).

**Sentence variety is deliberately minimal** — one frame per person per
tense, same rationale as #321: these are recognition/production pool
lessons with one source-verb form drilled at a time, not the richer
pronoun/negative variant sets given to higher-frequency core verbs.
`validFor: []` throughout — every sentence frame is built around an
expression-specific object/context (`euskaraz`, `zortzi ordu`,
`zure iritzia`, `klasean`...) with no plausible cross-verb distractor
overlap among these nine siblings or any existing `nor-nork`/`nor` verb.

## 2026-06-20 — #321: academic/rare tier — 12 regular nor-nork verbs, recognition-only sentence variety

**Decision:** added `hausnartu`, `argudiatu`, `ondorioztatu`, `gaitzetsi`, `aldarrikatu`, `plazaratu`, `sustatu`, `bultzatu`, `bermatu`, `babestu`, `ziurtatu`, `borobildu` (all `nor-nork`) to `VERBS`, completing #304's split. Morphology follows the same `-tzen`/`-ten`/`-ko` rules established in #319/#320: imperfective participle = stem + `-tzen` for the common case (`hausnartzen`, `argudiatzen`, `ondorioztatzen`, `aldarrikatzen`, `plazaratzen`, `sustatzen`, `bultzatzen`, `bermatzen`, `ziurtatzen`), or `-ten` for stems ending in the established coronal-obstruent set (`gaitzetsi`→`gaitzesten`, `babestu`→`babesten`, both `s`-final stems, same pattern as `idatzi`→`idazten`/`bereiztu`→`bereizten`). `borobildu`→`borobiltzen` follows `bildu`→`biltzen`'s `l`-final `-du`-allomorph pattern rather than a literal `borobildu`+`tzen` concatenation. Future = perfective participle + `-ko` throughout (all 12 end in a vowel, so no `-go` cases).

**Sentence variety is deliberately minimal** — one frame per person per tense, rather than the richer pronoun/negative variant sets given to higher-frequency verbs — since #321 scoped this tier as recognition-only (`mode: 'recognition'`, no typed-production framings), so extra sentence variants would never surface in an exercise that uses them. `sentences.present` entries are wrapped as `{ text, validFor: [] }` per `docs/SENTENCE_FRAMES.md`'s requirement that every `nork`-agreement verb's present-tense sentences be explicit objects; `validFor: []` makes no unverified cross-verb claims rather than guessing distractor eligibility for a tier that won't get typed exercises anyway.

## 2026-06-20 — #320: mid/low fodder tier + #304's unassigned verbs — 18 regular verbs, same rules as #319

**Decision:** added `eskatu`, `galdetu`, `adierazi`, `bukatu`, `amaitu`, `gainditu`, `bereiztu`, `ezagutu`, `sentitu`, `pentsatu`, `sumatu`, `ulertu`, `aztertu`, `ukatu`, `batu`, `planteatu` (`nor-nork`) and `erori`, `jaiki` (`nor`) to `VERBS`. All 18 are regular `-tu`/`-i`-final periphrastic verbs sourced by the same #319-documented rules: imperfective participle = stem + `-tzen` (the common case — `eskatu`→`eskatzen`, `ulertu`→`ulertzen`, `aztertu`→`aztertzen`, despite their `r`-final stems, since `-ten` is reserved for the narrower coronal-obstruent set `idatzi`/`utzi`/`gal`/`sal` already established, not `r`/`l` generally) or `-ten` for stems ending in that coronal-obstruent set (`adierazi`→`adierazten`, `bereiztu`→`bereizten`, both `z`-final stems, same pattern as `idatzi`→`idazten`/`utzi`→`uzten`); future = perfective participle + `-ko` (all 18 end in a vowel, so no `-go` cases this tier — unlike #319's `egin`/`entzun`/`itxaron`, which are `n`-final).

**`erori`/`jaiki` land as plain intransitive `nor`** (izan auxiliary), the same shape as #319's `sartu`/`atera`/`hasi` — `erori`'s imperfective participle is `erortzen` (stem `eror` + `tzen`, the attested form, not a regular vowel-final derivation since the perfective participle's own final `-i` is dropped along with the preceding `o` retained as `eror-`). `jaiki`'s is the regular `jaikitzen`.

**`eskatu`/`galdetu`/`adierazi` land plain-`nor-nork`-only here**, same #307-deferral as #319's `itxaron`/`saldu`/`utzi` — their optionally-ditransitive dative reading (`eskatu diot`, etc.) stays #307's scope.

**Sentences carry empty `validFor: []` on every `present` variant** for the 16 `nor-nork` verbs, same rationale as #319 (cross-verb naturalness review deferred). `scripts/validfor-gap-baseline.json` regenerated to reflect the larger gap surface.

## 2026-06-20 — #319: high-frequency fodder tier — 16 regular verbs, plain participle/aspect/future rules

**Decision:** added `egin`, `irakurri`, `idatzi`, `ikasi`, `entzun`, `utzi`, `aurkitu`, `bilatu`, `galdu`, `jaso`, `saldu`, `itxaron` (`nor-nork`) and `sartu`, `atera`, `hasi`, `bizi izan` (`nor`) to `VERBS` — all fully regular, sourced by the standard rules already documented in `CONJUGATIONS.md` §11/§14: imperfective participle = perfective participle minus its final vowel/`-tu`/`-i`, plus `-tzen` after a consonant-final stem or `-ten` after a stem ending in a coronal (`s/z/ts/tz/n/l/r`-ish set — e.g. `irakur`+`tzen`→`irakurtzen`, but `idatz`+`ten`→`idazten`, `gal`+`tzen`→`galtzen`, `sal`+`tzen`→`saltzen`, `uz`+`ten`→`uzten`); future = perfective participle + `-go` after a stem ending in `n`/`l` (`egingo`, `entzungo`, `itxarongo`) or `-ko` otherwise (`irakurriko`, `idatziko`, `ikasiko`, `utziko`, `aurkituko`, `bilatuko`, `galduko`, `jasoko`, `salduko`, `sartuko`, `hasiko`). No native-speaker-check caveat needed here — every form is a direct application of an already-attested rule, not a by-analogy derivation like #287's.

**`atera`'s perfective participle is the bare citation form** (`atera`, not `*ateratu`) — one of a small set of `-a`-final verbs whose perfective participle doesn't take `-tu`. Its future contracts the same way `joan`'s does (`joan`+`-ko`→`joango`... actually `atera`+`-ko`→`aterako`, vowel-final + `-ko` with no epenthesis), confirmed against the attested form `aterako naiz`.

**`bizi izan`** ("to live") mirrors `ari izan`'s invariant-participle shape (#244/#230) — `bizi` never inflects; only the `izan` auxiliary conjugates across present/past/future. Unlike `ari` (which has no attested future use in this app and so only carries a `present` table), `bizi` is a regular `-i`-final participle and takes the ordinary `-ko` future (`biziko naiz`), no special-casing needed. Landed as fodder (`id: 'bizi-izan'`) per #304/#319's own resolution of the open question (default to fodder unless #306 says otherwise).

**`itxaron`/`saldu`/`utzi` land plain-`nor-nork`-only here** — their optionally-ditransitive dative reading (`itxaron diot`, etc.) is explicitly #307's scope, not this tier's; only the `nor-nork` present/past/future tables were added.

**Sentences carry empty `validFor: []` on every `present` variant** (required by `src/logic.test.js`'s nor-nork-cluster coverage check, since all 12 new verbs have `nork` in `agreement`) rather than populated cross-verb arrays — establishing genuine cross-verb sentence equivalence for 12 new verbs is its own research pass, out of scope for landing the verb data itself. `scripts/validfor-gap-baseline.json` was regenerated to reflect the larger (legitimate) gap surface these additions create; no naturalness review was done against `scripts/validfor-delta-audit.mjs --classes` for this batch — left as a follow-up if/when these verbs' sentences need richer distractor pools.

## 2026-06-19 — #287: resolved `jakin`'s plural-object (`dakizki-`) forms; still needs native-speaker check

**Decision:** #284 deferred `jakin`'s plural-object forms because it's its
own synthetic stem, not covered by either the `ukan` (`dit-` swap) or
`eduki` (`-z-` infix) pattern those other verbs use. Rather than guess
blindly, found that `docs/CONJUGATIONS.md` already has direct internal
evidence for this exact stem: its NOR-NORI subjunctive grid tabulates
`jakin`'s own `daki-`/`zeki-` root taking a `-zki-` infix right before the
person suffix (`dakidan`→`dakizkidan`, `zekidan`→`zekizkidan`, etc.).
Applying that same insertion point to the indicative present/past tables
gives `presentPlural`/`pastPlural` (e.g. `dakit`→`dakizkit`,
`nekien`→`nekizkien`) — added to `VERBS`'s `jakin` entry and to
`CONJUGATIONS.md`'s `jakin` table as a "(sg./pl. obj.)" column, matching
`ekarri`/`eduki`'s existing format.

`presentPlural` only covers the persons `jakin`'s `present` table already
has (`ni`/`zu`/`hura`/`hi-m`/`hi-f`) — `present` itself is missing
`guk`/`zuek`/`haiek` cells in `VERBS` despite `CONJUGATIONS.md` documenting
them, a pre-existing gap predating #287, left untouched here. No
`futurePlural`: `future` itself only has 3 persons, the same omission
`nahi`'s missing `pastPlural` already established as acceptable.

This derivation is by analogy from the same stem's attested infix
position in a different paradigm (NOR-NORI subjunctive), not an
independent indicative-paradigm source — so it carries the same
native-speaker-check caveat as #284's other plural-object forms below; it
narrows the gap (a sourced derivation instead of an unsourced one) but
doesn't remove the need for a speaker check.

## 2026-06-19 — #281: `presentPerfect` (*Lehenaldiko Burutua*) tables for Unit 11's core verbs

**Decision:** added a `presentPerfect` conjugation table to `izan`, `joan`,
`etorri` (the `izan`-auxiliary branch) and `ikusi` (the `ukan`-auxiliary
branch) — `docs/CONJUGATIONS.md` §11's formula (perfective participle +
*present* auxiliary) applied to each verb's own already-tabulated participle
and present aux, the same swap `past`'s table already does with the past
aux (`etorri naiz`/`joan naiz`/`ikusi dut`, all directly attested in §11's
worked examples). `izan`'s own `presentPerfect` (`izan naiz`, "I have been")
uses its own form as the participle, mirroring how its `past` table already
pairs `izan`+past-aux.

Added `sentences`/`pronounSentences` for `etorri` and `ikusi` only — the two
verbs Unit 11's recency-contrast lesson (#283) actually drills against a
time adverb — reusing each verb's existing frames with `gaur`/`gaurkoan`
("today") swapped in for `past`'s `atzo`/`herenegun`, per #268's precedent
for keeping recency adverbs out of `past`'s own frames. `izan`/`joan` stay
form-only for now (no new sentences), same treatment as their other
non-core tenses (`potential`/`conditional`/etc.) — `izan`'s `validFor: []`
predicate-nominal frames don't have a natural recency reading, and `joan`'s
allative frames already work via `etorri`'s `validFor: ['joan']`
cross-reference.

The `gaur`-frame distractor audit confirms `etorri`'s new `presentPerfect`
frames correctly exclude `izan` from `validFor` (`izan naiz` doesn't fit the
allative "etxera" frame), the same exclusion already accepted for `etorri`'s
existing `present`/`past` frames — not a new gap, just the established
pattern extended to the new tense. Forms themselves are directly attested in
§11 rather than derived/extrapolated, so no native-speaker-check flag is
needed here (unlike #284's plural-object forms below).

## 2026-06-19 — #284: plural-object (`dit-`/`dauzka-`) forms for the core NOR-NORK verbs; forms need native-speaker check

**Decision:** Added `presentPlural`/`pastPlural`/`futurePlural` conjugation
tables to `ukan`, `jan`, `edan`, `erosi`, `hartu`, `ikusi`, `eduki`, and `nahi`
— the everyday transitive verbs that previously only stored the
singular-object (`NOR` = `hura`) auxiliary forms (`dut`/`duzu`/`du`/…), with
no way to express "we have/saw/bought/took *them*" (`ditugu`/`ikusten
ditugu`/`erosi genituen`/…). Reuses the same `<tense>Plural` naming as #162/
#164's NOR-NORI(-NORK) plural tables, since both describe the same thing —
the absolutive `NOR` argument going from singular to plural.

For the periphrastic verbs riding `ukan` (`jan`/`edan`/`erosi`/`hartu`/
`ikusi`/`nahi`), forms are the participle + `docs/CONJUGATIONS.md` §3's
`NOR` = `haiek` column (`ditut`/`dituk`/`ditun`/`ditu`/`ditugu`/`dituzu`/
`dituzue`/`dituzte` present; `nituen`/`hituen`/`zituen`/`genituen`/
`zenituen`/`zenituzten`/`zituzten` past); future is each verb's `-ko`/`-go`
participle + the new plural present aux, same pattern as the existing
singular future tables. `nahi` has no `pastPlural` since it has no `past`
table to mirror. `ukan` itself keeps `hi`'s past unsplit (`hituen`), mirroring
its existing singular `past.hi: 'huen'`.

`eduki` is a separate synthetic stem (`dauka-`, not `ukan`'s `du-`), so its
`presentPlural`/`pastPlural` use the `-zk-`-infixed `dauzka-`/`-zeuzka-`
forms straight from CONJUGATIONS.md §7's `eduki` "(sg./pl. obj.)" table
instead of a `dit-` swap; its `futurePlural` still rides `ukan`'s plural aux
(`edukiko ditut`, etc.), same as its existing singular future does.

`jakin` is excluded from this round — it's synthetic and not covered by
either grid above; its plural-object form needs independent sourcing/
verification (tracked separately).

Like #162/#164, these forms are derived from the grids rather than
independently confirmed by a speaker — flagged here for the same
native-speaker check before being treated as authoritative.

## 2026-06-19 — #268: `etorri` past sentences shouldn't lean on recency adverbs; fixed an alias-loop bug that was silently discarding hand-authored `past` sentences

**Decision:** a user-reported word-order exercise produced "Mikel gaur
liburutegira etorri zen." ("Mikel went to the library today *[simple
past]*") — grammatically parseable, but non-idiomatic: Basque marks recency
via the present-perfect-like construction (*Lehenaldiko Burutua*, e.g.
"gaur etorri da") for same-day events, reserving simple past (*Lehenaldi
Mugatua*, "zen") for narrated/distant past ("atzo etorri zen"). Mixing a
same-day adverb (`gaur`/`orain`/`bihar`) with `zen` contradicts that
distinction. `etorri`'s `past` sentences were never independently authored
— they were aliased by reference from `present` (`verbs.js`'s "Looking
Back" loop, see 2026-06-12 below), which still carries `present`'s
`gaur`/`orain`/`bihar` adverbs verbatim.

**Fix:** gave `etorri` its own explicit `sentences.past`/
`pronounSentences.past` (swapping `gaur`/`orain`/`bihar` for `atzo`,
matching Unit 11's own documented "Atzo etorri zen" example), and tightened
the alias loop to skip verbs that already define their own `past` arrays
(`if (verb.sentences?.present && !verb.sentences.past) ...`).

That guard surfaced a separate, pre-existing bug: `ukan`, `behar`,
`eraman`, and `ekarri` each already had hand-authored, semantically-distinct
`sentences.past` blocks (e.g. `ukan`'s "#259" block sourced from
`SAMPLE_SENTENCES.md`) that the unguarded loop was silently overwriting
with `present`'s sentences on every module load — so that authored content
had never actually been served to learners. The guard restores it. This
shifted gap-slot counts for `ukan`/`behar`/`eraman`/`ekarri` and their
NOR-NORK-compatible siblings (`jakin`/`jan`/`edan`/`erosi`/`hartu`/`ikusi`)
in `scripts/validfor-gap-baseline.json`; reviewed the diff and the new gaps
are genuine (e.g. `erosi`'s "to buy" sense doesn't fit `behar`'s restored
"had to wake up early" sentence, correctly `validFor: []`), so the baseline
was regenerated rather than patched around.

**Scope note — present-perfect/recency is still entirely absent from the
curriculum:** `CONJUGATIONS.md` §11 documents *Lehenaldiko Burutua* as a
real, distinct paradigm, but no verb has a `conjugations` table for it and
no `journey.js` unit teaches it. The `atzo`-based fix above sidesteps the
gap (past-tense frames now avoid recency adverbs entirely rather than
teaching the present-perfect form), which is the right scope for a data
bug fix; adding present-perfect as a taught tense would be a substantial
curriculum addition (new conjugation tables, new unit(s), new lessons) and
is left as a separate, deliberate decision rather than folded into this fix.

## 2026-06-19 — #246: Researched `atxiki`/`iharduki`; concluded documentation-only, no `VERBS` entry

**Decision:** `VERB_COVERAGE.md` §4a flagged `atxiki` (misspelled "atxeki"
in the original draft) and `iharduki` as "genuinely synthetic, but rare/
dialectal enough that I couldn't pin down their argument structure" —
listed in EGLU-II alongside the app's other synthetic-verb candidates, so
worth a proper grammar-reference pass before either ruling them in or out.
WebFetch was blocked (403) on every direct source (euskaltzaindia.eus,
Wikipedia), so the research was relayed through an external model
(Gemini) with a prompt asking specifically for EGLU-II/OEH-sourced
present+past paradigms, with each cell marked directly-attested vs.
pattern-derived/rare vs. unattested — matching this log's own sourcing
standard (e.g. #245's caveat above).

The result: both verbs are *historically* defective, not just
under-researched — the original "couldn't pin down" caution turns out to
have been substantively correct, for a more specific reason than "needs
more digging."

- **`atxiki`** (nor-nori, "to adhere/cling [to]"): only one form is
  attested anywhere — 3sg present `datxika`/`datxeka`. No attested past,
  no other attested or safely-derivable persons. A one-cell paradigm.
- **`iharduki`** (nor-nork, sibling of `jardun`/`irudi`): present has 3
  directly-attested persons (hura/zu/haiek), 2 more pattern-derived/rare,
  `hi`/`zuek` unattested; past has exactly 1 attested form (3sg). Archaic,
  restricted to classical Lapurdian/Zuberoan literary register — its
  attested forms trace to Leiçarraga's 1571 Basque New Testament
  translation.

**Why documentation-only, no `VERBS`/`LESSONS` entry:** the app's lesson
format is built around a full or near-full person-by-person table per tense
(`generateQuestions` needs enough sibling forms in the same table to serve
as distractors). `atxiki`'s single attested cell can't support that at
all; `iharduki`'s partial, archaic paradigm is richer but still has 2 of 7
present persons and 6 of 7 past persons missing or unattested — filling
the gaps would mean inventing forms with no source backing, which this
project's sourcing standard rules out. Updated `VERB_COVERAGE.md` §4a with
the corrected spelling (`atxeki` → `atxiki`) and this summary in place of
the earlier "couldn't pin down" note.

## 2026-06-18 — #245: Sourced `jakin`'s past `hik`/`zuk`/`zuek` gaps; added it to Unit 13's "ukan" past pool

**Decision:** `CONJUGATIONS.md` §7's `jakin` past grid had `hik`/`zuk`/`zuek`
rows marked `—`. Filled them by mapping `ukan`'s past prefix pattern (§3:
`nuen`/`huen`/`zenuen`/`zenuten`, i.e. `n-`/`h-`/`zen-`+`-uen`, `zen-`+
`-uten`) onto `jakin`'s already-attested `-ekien`/`-ekiten` stem alternation
(`nekien`/`zekien`/`genekien`/`zekiten`, all pre-existing, non-gapped cells):
swap `ukan`'s `-uen`/`-uten` suffix for `jakin`'s `-ekien`/`-ekiten`, keeping
the same prefix consonant. Gives `hik` → `hekien`, `zuk` → `zenekien`, `zuek`
→ `zenekiten`. `hik` stays **unsplit** (no `-k`/`-n` gender split) — matching
`ukan`'s own past, which #167 already established "stays unsplit (`huen`)"
despite the present-tense split existing for both verbs.

With the grid complete, added `jakin`'s `conjugations.past` to `VERBS`
(`src/data/verbs.js`) and folded it into Unit 13's `ukan-past-pool`/
`ukan-past-pool-plural` (`src/data/lessons.js`) alongside `ukan`/`jan`/`edan`/
`erosi`/`ikusi` — the same past-auxiliary family `jakin`'s present already
rides in Unit 4. `sentences.past`/`pronounSentences.past` pick up the existing
`present` arrays via the same by-reference reuse loop already used for the
pool's other verbs (the sentence blank doesn't depend on tense); `jakin`
joins `SINGLE_WORD_PAST_NEGATION` (`izan`/`egon`/`ukan`/`eduki`) since its
past, like its present, is a single synthetic word that stays intact under
`ez`-negation.

**Flag for native-speaker review:** the `hik`/`zuk`/`zuek` forms are derived
by pattern, not independently attested in either doc's source material —
same standing caveat as other pattern-derived cells in this log (e.g. #180's
`ibili hintzen`). `nahi`/`ari`'s deferred past (periphrastic `nahi izan
nuen`/`ari izan nintzen`) remains out of scope, unaffected by this entry.

## 2026-06-18 — #244: Broadened Unit 9's `ari` examples beyond `jaten`

**Decision:** Unit 9 ("The Immediate Continuous") had already accumulated
`egiten`/`ikasten`/`idazten`/etc. as distractor-sentence vocabulary in
`ari`'s `sentences.present` array (#238's progressive-vs-plain lure work),
but the unit's *fixed* anchor examples — the journey roadmap's `payload`
copy and `ari`'s `pronounSentences` (one deterministic example per person,
used by the `pronoun`/`type-pronoun` question kinds) — still read on `jaten`
alone for `zu` (`'___ lanean ari zara.'`, not even a participle). Changed
`zu`'s `pronounSentence` to `'___ zer egiten ari zara?'`, pairing `egiten`
with the unit's own headline question ("Zer ari zara?" → "Zer egiten ari
zara?"), while keeping `ni`/`hura` on `jaten`/`irakurtzen` — three distinct
participles across the three fixed examples. Updated `journey.js`'s Unit 9
`payload` (and its `es`/`eu` translations in `journeyTranslations.js`) to
show all three: `Zer egiten ari zara?` / `Jaten ari naiz` / `Ikasten ari
naiz`.

**Why not touch `hura`:** `irakurtzen` ("reading") was already a genuine
imperfective participle, not a placeholder needing replacement — only `zu`'s
`lanean` (a locative idiom, not a participle) needed fixing to actually meet
the "at least three imperfective participles" bar literally, not just inside
the randomized distractor pool.

## 2026-06-17 — #180: `ibili`'s `hi` isn't a gap — `habil`/`ibili hintzen` by the same rule as `joan`/`etorri`

**Decision:** `ibili` gets `hi: 'habil'` (present) and `hi: 'ibili hintzen'`
(past) added to `src/data/verbs.js`, and is added as a 5th source in Unit
32's `unit-32-hi-present`/`unit-32-hi-past` pooled reviews
(`src/data/lessons.js`) alongside izan/egon/joan/etorri.

**Why this isn't the "irregular verb, may have a gap" research question
#180 flagged:** `CONJUGATIONS.md` §6 only marks `ibili`'s `hi` cell as `—` in
the **imperfective/habitual** past column (`nenbilen`-style) — a different
table from the **simple past** (`Lehenaldi Mugatua`) actually used in
`conjugations.past` (added per the 2026-06-12 "Simple past" entry below).
That simple past is compositional: perfective participle + `izan`'s past
auxiliary, the same formula already used for `joan hintzen`/`etorri
hintzen`. Since `izan`'s past auxiliary has a non-gapped `hi` cell
(`hintzen`), `ibili`'s simple past has one too — `ibili hintzen` — by the
same derivation already trusted for its two siblings. `habil` (present) was
already tabulated in §6 itself, just never wired into the data or Unit 32's
pooling. No native-speaker gap exists here; the omission was that `ibili`
was left out of #144's original four-verb `hi` core scope, not a defect in
the verb.

## 2026-06-17 — #170: §14 non-finite-form reading items reuse doc examples verbatim

**Decision:** Rather than author new sentences for the 8 new
`reading-nonfinite-*` items, every `source` sentence is copied verbatim from
`CONJUGATIONS.md` §14's own worked examples (e.g. `Filma ikusteko etorri
naiz.`, `Atzo ikusitako filma oso ona zen.`, `Etorria da.`). Distractor
options swap in other §14 suffixes/forms of the same verb (e.g. `-tako` vs.
`-a` vs. `-ten` vs. `-ko`) rather than inventing alternate phrasing, so the
only new judgment call is "is this distractor clearly wrong," not "is this
new sentence grammatical." Still worth a native-speaker pass before treating
as authoritative — non-finite forms are exactly where #170 flagged higher
risk of subtle errors.

## 2026-06-17 — #167: toka/noka and hi-as-NORK gender-split forms; need native-speaker check

**Decision:** Added `izan`/`ukan` toka/noka (`hura`/`haiek` only) and `ukan`/
`jakin`'s `hi`-as-NORK present gender split, all sourced from
`docs/CONJUGATIONS.md` §10's synthetic-verb allocutive table (`ukan`'s own
`hi`-as-NORK row is also used for `jakin`'s, per #144's prior decision that
§7's blank `hik` row for `jakin` is filled by §10's data).

- `izan` toka/noka: `da`/`dira` are suppletive — they switch to the `du`-stem
  before the `-k`/`-n` suffix (`duk`/`dun`, `dituk`/`ditun`), rather than the
  unattested `†dak`/`†dan`. Past inserts `-a-`/`-na-` before the final `-n`:
  `zen` → `zuan`/`zunan`, `ziren` → `zituan`/`zitunan`.
- `ukan` toka/noka: `du`/`dute` undergo a `u`→`i` stem shift before the
  `-k`/`-n` suffix (`dik`/`din`, `ditek`/`diten`), specifically so they stay
  distinct from `hi`-as-NORK's own `duk`/`dun` on the same verb. Past:
  `zuen` → `zian`/`zinan`, `zuten` → `zitean`/`zitenan`.
- `ukan`/`jakin` hi-as-NORK present: `duk`/`dun`, `dakik`/`dakin`. `ukan`'s
  past stays unsplit (`huen`) — §3 doesn't show a past split here.

**Caveat:** §10 only tabulates `hura`/`haiek` for izan/ukan's toka/noka (no
full person grid in the source), so the data and the Unit 33/34 lessons are
deliberately 2-person/binary-choice. These forms — especially the past
`-a-`/`-na-` insertions and the `u`→`i` stem shift — should be confirmed
against a native speaker or grammar reference before being treated as
authoritative beyond this app.

## 2026-06-16 — #162: plural-object (`-zki-`) forms for `esan`/`eman`'s axis-fixed slices; forms need native-speaker check

**Decision:** Added `presentPlural`/`pastPlural`/`futurePlural` conjugation
tables to `esan` (`recipient: 'hura'`, NORK still the varying `person`) and
`eman` (`agent: 'ni'`, NORI still the varying `person`), reusing the same
tense-key names as #164's NOR-NORI plural tables since both describe the
same thing — the absolutive `NOR` argument going from singular to plural.
Forms are taken directly from `docs/CONJUGATIONS.md` §5's `NOR`=haiek
present/past grids: for `esan`, the `hari` row across the `NORK` columns
(`dizkiot`/`dizkiozu`/`dizkio`/`dizkiogu`/`dizkiozue`/`dizkiote` present;
`nizkion`/`zenizkion`/`zizkion`/`genizkion`/`zenizkioten`/`zizkioten` past);
for `eman`, the `nik` column across the `NORI` rows (`dizkizut`/`dizkiot`/
`dizkizuet`/`dizkiet` present; `nizkizun`/`nizkion`/`nizkizuen`/`nizkien`
past). Future is the `-go` participle + the present-tense plural aux, same
pattern as the existing singular future tables. Sentence frames use plural
nouns (`gezurrak` "lies" for `esan`, `liburuak` "the books" for `eman`) so
the cue itself signals the `-zki-` slot. Flagged here for the same
native-speaker confirmation #164's plural-NOR forms are pending, since these
were derived from the grid rather than independently verified by a speaker.

## 2026-06-16 — #164: plural-NOR (`-zki-`) forms for `gustatu`/`iruditu`/`ahaztu`; forms need native-speaker check

**Decision:** Added `presentPlural`/`pastPlural`/`futurePlural` conjugation
tables to `gustatu`/`iruditu`/`ahaztu` — the same NORI-suffix family as their
existing singular-`NOR` tables, but `-zki-`-infixed because the fixed `NOR`
argument moves from `hura` ("it") to `haiek` ("they"), per
`docs/CONJUGATIONS.md` §4's `haiek`/`NOR` column. Reused each verb's existing
participle choice (`gustatu`/`iruditu`'s `-tzen` habitual, `ahaztu`'s bare
resultative participle) — only the dative auxiliary changes shape between the
singular and plural tables. Added a `presentPlural` `sentences` table too,
swapping each verb's singular-object cue ("hau"/"ongi"/"liburua") for a
genuine plural-or-pluralizable noun phrase ("hauek"/"gauza hauek
ongi"/"giltzak") — `ahaztu`'s "Niri giltzak ___." directly mirrors the
`docs/LEARNING_JOURNEY_PROPOSED.md`/#164 worked example ("Giltzak ahaztu
zaizkit" = "I forgot the keys").

**Flag for native-speaker review:** same standing flag as #146's singular
tables (still unconfirmed) — these `-zki-` plural forms inherit that
uncertainty and add their own: in particular `iruditu`'s `presentPlural`
sentence frame ("Niri gauza hauek ongi ___.") was constructed by analogy
(`iruditu`'s only existing sentence cue, "ongi", is an adverb rather than a
NOR-bearing noun phrase, so a plural subject had to be introduced) rather than
taken from a worked example in the docs.

## 2026-06-15 — Added `gustatu`/`iruditu`/`ahaztu` (NOR-NORI) as the first dative-subject `VERBS` entries; forms need native-speaker check

**Decision:** #146 added `gustatu` ("to like/please"), `iruditu` ("to seem"),
and `ahaztu` ("to forget") as `VERBS` entries for Unit 23 ("Pleasures,
Opinions, Feelings") and Unit 24 ("Dative Across Time") — the first NOR-NORI
("psych"/dative-subject) verbs. All three use `agreement: ['nor', 'nori']`
with `object: 'hura'` (NOR fixed to "it", reusing the same field `nor-nork`
verbs use for their fixed absolutive object); `person` ranges over NORI, the
dative experiencer, per CONJUGATIONS.md §4's `hari`/NOR=`hura` column:

- Present: `gustatu`/`iruditu` use the `-tzen` habitual participle —
  `gustatzen zait`/`zaizu`/`zaio`/`zaigu`/`zaizue`/`zaie` and
  `iruditzen zait`/.... `ahaztu` instead uses the **bare participle**
  (`ahaztu zait`/`zaizu`/...) — a resultative/perfect-like "it is in a state
  of being forgotten to me" reading, per `docs/LEARNING_JOURNEY_PROPOSED.md`'s
  dedicated `ahaztu` table and its Unit 23 example ("Liburua ahaztu zait").
  `ahazten zait` ("I tend to forget it", habitual) was *not* used.
- Past: bare participle + past dative aux for all three —
  `gustatu zitzaidan`/..., `iruditu zitzaidan`/..., `ahaztu zitzaidan`/...,
  per CONJUGATIONS.md §4's past grid (`hari` row, NOR=`hura`: `zitzaion` →
  generalizes to `zitzaidan`/`zitzaizun`/`zitzaigun`/`zitzaizuen`/`zitzaien`
  across NORI).
- Future: `[participle]+ko` + present dative aux — `gustatuko zait`/...,
  `irudituko zait`/..., `ahaztuko zait`/..., following the issue's stated
  `-tu` → `-tuko` rule (all three verbs end in `-tu`).

**Flag for native-speaker review:** none of these forms or example sentences
have had a native-speaker check yet — in particular `ahaztu`'s bare-participle
present (vs the `-tzen` habitual) and `iruditu`'s `-tzen`/`zitzai-`/`-ko` forms
(derived by analogy with `gustatu`/`ahaztu` rather than taken from a worked
example in the docs).

**Deferred to a follow-up issue** (same split-out pattern as #147/#162, per
the user's standing instruction): plural-NOR (`-zki-`) distractor fodder
(`zaizkit`/`gustatuko zaizkit`/etc., for the Distractor Engine Matrix's number
slot) and Unit 23's extra-practice lessons (recognition, production,
number-split, case-frame buffer). This PR covers the core "present+past+future
drillable" piece of the acceptance criteria.

## 2026-06-15 — Added `esan`/`eman` (NOR-NORI-NORK) as the first ditransitive `VERBS` entries; forms need native-speaker check

**Decision:** #147 added `esan` ("to tell/say") and `eman` ("to give") as
`VERBS` entries for Unit 25 ("Communication & Giving") and Unit 26 ("Telling &
Giving Across Time"), the first verbs to use #142's `recipient`/`agent`
axis-fixed metadata:

- `esan` sets `recipient: 'hura'` (NORI fixed = "to him/her"), so `person`
  varies over NORK — present `esaten diot`/`esaten diozu`/`esaten dio`/
  `esaten diogu`/`esaten diozue`/`esaten diote` (CONJUGATIONS.md §5's `hari`
  row), past `esan nion`/.../`esan zioten`, future `esango diot`/....
- `eman` sets `agent: 'ni'` (NORK fixed = "I give it to..."), so `person`
  varies over NORI — present `ematen dizut`/`ematen diot`/`ematen dizuet`/
  `ematen diet`, past `eman nizun`/`eman nion`/`eman nizuen`/`eman nien`,
  future `emango dizut`/.... Only 4 persons exist for this axis (`zu`/`hura`/
  `zuek`/`haiek`) — `ni`/`gu` are reflexive-only (§5) and `hi` is hitanoa
  (not yet modeled, #144), same shape as the small allocutive tables #139's
  distractor-floor fix anticipates.

**Present tense is periphrastic** (`esaten`/`ematen` + the `di-` ditransitive
auxiliary), matching `docs/LEARNING_JOURNEY_PROPOSED.md`'s Unit 25 examples
("ematen diot", "esaten diozu") rather than CONJUGATIONS.md §8's bare `diot`
(which §8 frames as `esan`'s own synthetic present but is ambiguous with the
shared `eman`/other-ditransitive auxiliary out of context). Past/future drop
the `-ten` infinitive for the bare participle + auxiliary (`esan nion`,
`esango diot`), per the same proposed-doc examples.

**Flag for native-speaker review:** `esan`'s past forms (`nion`/`zion`/
`genion`/`zenion`) follow CONJUGATIONS.md §5's general `hari`-row past grid
and the proposed doc's "Esan nion" example, but §8's `esan`-specific table
gives `nioen`/`zioen`/`genioen`/`zenioen` for the same NORK cells instead — a
genuine discrepancy between the two doc sections that should be resolved
against a grammar reference. None of `esan`/`eman`'s forms or example
sentences have had a native-speaker check yet.

**Deferred to a follow-up issue** (per #147's scope, split out at the user's
request): the `-zki-` object-number fodder (`dizkiot`, etc.) for the
Distractor Engine Matrix's number slot, and Unit 25's four extra-practice
lessons (fix-NORI, fix-NORK, object-number, two-axis recombination). This PR
covers the core "drillable present+past+future, one axis per lesson" piece of
the acceptance criteria.

## 2026-06-15 — Promoted `hartu` from candidate to a `VERBS` entry; forms need native-speaker check

**Decision:** #143 promoted `hartu` ("to take") from `VERB_COVERAGE.md`
§4b-bis's user-supplied candidate list to a full `VERBS` entry, used to stage
the `jaten`(-ten)/`hartzen`(-tzen) morphophonological pairing alongside `jan`
in Unit 12. Present (`hartzen dut`) and past (`hartu nuen`) reuse the forms
already logged in §4b-bis's 2026-06-13 entry; the future (`hartuko dut`...)
is new, following the regular `-tu` → `-tuko` periphrastic future pattern
used elsewhere (not yet present in VERB_COVERAGE.md's §4b-bis table).

None of `hartu`'s forms — conjugation tables or the example sentences
(`autobusa`/`aterkia`/`trena`/`taxia`/`katua`/`erabakia`/`txanda hartu`) — have
had a native-speaker sanity check yet, unlike most other active `VERBS`
entries. Flagging here so a future pass can confirm both the conjugations and
the naturalness of the example sentences before treating `hartu` as fully
verified.

## 2026-06-13 — Resolved `egin`'s synthetic-vs-periphrastic conflict: both exist, periphrastic is the everyday form

**Decision:** `egin` genuinely has both: rare synthetic forms (`dakit` "I do
it", `egizu` as an hitano imperative in some dialects), mostly preserved in
Western/Central dialects and literary Basque, *and* the everyday periphrastic
`egiten dut`/`egin nuen` (§4b-bis) — also Basque's classic transitive "light
verb" for compounds (`lo egin`, `dantza egin`, `barre egin`...). Not a
conflict to reconcile, like `iraun`'s noted synthetic/periphrastic overlap —
§4a's entry now describes the synthetic side, §4b-bis's the periphrastic side.
Resolves the flag raised in the previous entry.

## 2026-06-13 — Resolved `itxi`'s present-tense form: `ixten dut`

**Decision:** `VERB_COVERAGE.md` §4b-bis's `itxi` entry now reads `Ixten dut`
(not `itxiten dut`), confirmed — resolves the flag raised in the previous
entry.

## 2026-06-13 — Logged a batch of `nor-nork` periphrastic verb candidates in `VERB_COVERAGE.md`

**Decision:** Added §4b-bis to `VERB_COVERAGE.md` — `hartu`, `saldu`,
`irakurri`, `idatzi`, `ikasi`, `utzi`, `bilatu`, `aurkitu`, `zabaldu`, `itxi`,
and `egin`, each with present/past `nor-nork` forms (user-supplied), as
candidates for extending Unit 10's pooled `jan`/`edan`/`erosi`/`ikusi`-style
drill or seeding later units. Documentation only — no `VERBS` entries yet.

`maite izan` ("to love") was *not* added to this table — its "Maite dut" shape
is `maite` + `ukan`, the §5 `nahi`/`behar`-style fixed-expression pattern, not
a participle+auxiliary periphrastic verb. (`itxi`'s and `egin`'s flags, also
raised here, were resolved in later entries above.)

## 2026-06-12 — Simple past (`Lehenaldi Mugatua`) for `joan`/`etorri`/`jan`/`edan`/`erosi`/`ikusi`/`eduki`/`ibili`, for the new "Looking Back I/II" journey units

**Decision:** Added `conjugations.past` for 8 verbs, all full 6-person grids:

- **`jan`/`edan`/`erosi`/`ikusi`** (`jan nuen`/`zenuen`/`zuen`/`genuen`/
  `zenuten`/`zuten`, and the equivalent for `edan`/`erosi`/`ikusi`): perfective
  participle + `ukan`'s past auxiliary, already documented as each verb's
  "Past (lehena)" column in `CONJUGATIONS.md` §7 (`ikusi` was documented
  there already; `jan`/`edan`/`erosi` per the 2026-06-12 "Documented
  `jan`/`edan`/`erosi`" entry below) — copied directly, no new derivation.
- **`eduki`** (`neukan`/`zeneukan`/`zeukan`/`geneukan`/`zeneukaten`/
  `zeukaten`): synthetic, also already documented as §7's "Past (lehena)"
  column for `eduki` — copied directly.
- **`joan`/`etorri`/`ibili`** (`joan nintzen`/`zinen`/`zen`/`ginen`/`zineten`/
  `ziren`, and the equivalent for `etorri`/`ibili`): perfective participle +
  `izan`'s past auxiliary (§1's `nintzen`/`zinen`/`zen`/`ginen`/`zineten`/
  `ziren`), per §11's periphrastic tense matrix ("Lehenaldi Mugatua" row —
  perfective participle + `izan`/`ukan` past auxiliary, the same mechanism
  Units 14-15's future uses with the present auxiliary). These are **not**
  §6's existing "Past" column for these three verbs (`nindoan`/`zetorren`/
  `nenbilen`) — see below.

`sentences.past`/`pronounSentences.past` for all 8 verbs alias their
`present` arrays by reference (same reuse-loop pattern as the future tense,
since a sentence template's blank doesn't depend on tense).
`negativeSentences.past` is aliased only for `eduki` (joining `izan`/`egon`/
`ukan` from the earlier session) — the other 7 are periphrastic and split
apart under negation (`ez nuen ikusi`, not a single `___` blank), same
reasoning as their present-tense `negativeSentences` exclusion.

**Why this is "simple past" and not §6's "Past" column for `joan`/`etorri`/
`ibili`:** §6's `nindoan`/`zetorren`/`nenbilen`-type forms are **imperfective/
habitual past** ("I was going" / "he was coming" / "I used to walk around") —
ongoing or repeated past action, the opposite of "completed." The new
`conjugations.past` added here is **simple/completed past** ("I went" / "she
came" / "they walked around [that one time]") — what a learner needs to say
"I went to the beach yesterday." These are grammatically distinct forms in
Basque, not two names for the same thing; §6's imperfective forms remain
reserved for Phase III's Unit 19 ("Motion in Progress (Past)"), contrasted
explicitly with this entry's simple past.

**Deferred — `jakin`/`nahi`/`ari` past:** `jakin`'s past
(`CONJUGATIONS.md` §7) has gaps (`hik`/`zuk`/`zuek` rows are `—`), so it was
left out of Unit 8 ("Looking Back I — I Was, I Had") despite riding `ukan`'s
suffix family there. `nahi`/`ari` are modal particles whose past would derive
from `ukan`/`izan`'s past once paired with the right participle (`nahi izan
nuen`, `ari izan nintzen`) — grammatically straightforward but not part of
this redesign's payload (neither old Unit 9's future nor any "Looking Back"
unit's examples call for "I wanted"/"I was [in the middle of]"), so left for a
future pass alongside `jakin`'s gap.

## 2026-06-12 — Future-tense (`Geroa`) forms for Units 1-8's 12 verbs, `izan` as suppletive future participle for `ukan`/`eduki`, `ari` excluded

**Decision:** Per `docs/CONJUGATIONS.md` §11, every verb's future is its
`-ko`/`-go` prospective participle + the present tense of its agreement-
appropriate auxiliary (`izan` for `nor` verbs, `ukan` for `nor-nork` verbs) —
the same auxiliary table each verb already uses for its periphrastic present,
just with a different participle. Concretely: `izan`→`izango naiz/zara/da/
gara/zarete/dira`, `egon`→`egongo naiz/...`, `joan`→`joango naiz/...`,
`etorri`→`etorriko naiz/...`, `ibili`→`ibiliko naiz/...` (all `nor`, `izan`
aux); `ukan`/`eduki`→**`izango dut/duzu/du/dugu/duzue/dute`** (the suppletive
participle for "have" is `izango`, not a `ukan`-stem form — `ukango` doesn't
exist), `nahi`→`nahiko dut/duzu/du`, `jakin`→`jakingo dut/duzu/du`, `jan`→
`jango dut/...`, `edan`→`edango dut/...`, `erosi`→`erosiko dut/...`, `ikusi`→
`ikusiko dut/...` (all `nor-nork`, `ukan` aux, three-person tables kept at
their existing scope for `nahi`/`jakin`, full six for the rest). `ari` was
**not** given a `future` table — its only grammatical future ("ari izango
naiz" / "I will be [in the middle of] doing") is a periphrastic-of-a-
periphrastic that's marginal in everyday Batua and isn't part of Unit 9's
"`-ko`/`-go` + present auxiliaries" payload.

**Why:** All forms follow directly from §11's documented rule plus each verb's
already-established `agreement`/auxiliary pairing from its present-tense
table — no new research or cross-checking needed beyond confirming `izango`
(not `ukango`) is correct for `ukan`/`eduki`'s future, which §11 already notes
as the suppletive pattern. Excluding `ari` keeps Unit 9 to forms a learner
would actually produce, and avoids inventing a "future continuous" framing the
journey doesn't ask for.

## 2026-06-12 — Documented `jan`/`edan`/`erosi` in `CONJUGATIONS.md` §7, completing Unit 7's prerequisite

**Decision:** Added `jan`/`edan`/`erosi` as new `###` subsections appended to
§7 (after `entzun`), same placement precedent as `ikusi`/`entzun` themselves
("avoid renumbering §8-§13"). All three are regular periphrastic NOR-NORK
verbs (`docs/VERB_COVERAGE.md` §4b's "`-i`"/"`-n`" verb groups): imperfective
participle (`jaten`/`edaten`/`erosten`) + `ukan`'s present auxiliary for
"Present (oraina)", perfective participle (`jan`/`edan`/`erosi`) + `ukan`'s
past auxiliary for "Past (lehena)" — the exact same table shape as `ikusi`/
`entzun`, `NOR` fixed at `hura`. These are textbook A1 forms (no Gemini
cross-check needed, unlike the riskier Ahalera/ditransitive grids elsewhere in
this doc).

## 2026-06-11 — Filled `izan`/`ukan`'s missing `zu` rows in `CONJUGATIONS.md` §1/§3 — the v2 journey's one concrete prerequisite

**Decision:** Added `zu` (`zara`/`zinen`) to `izan`'s §1 table and `zu`
(`duzu`/`zenuen`) to `ukan`'s §3 table — both previously six-person with an
explicit "no `zu`" note. Both forms were cross-checked against material
already in the document (`mintzatu`'s `zu` row for `izan`; the NOR=1st/2nd
grids for `ukan`) rather than sourced fresh. `egon`/`joan`/`etorri`/`ibili`
already had `zu` rows; `VERBS` itself is unchanged (still six persons, no `zu`
— that's for later units).

## 2026-06-11 — Relabeled `ihardun`/`jardun`, `iraun`, `irudi` (§6/§8) as "unergative — nork-only", consistently

**Decision:** Fixed `ihardun`'s mislabeled person-column headers (suffixes are
`NORK`/ergative, not absolutive) to `nik/hik/hark/...` under "(unergative —
nork-only)", and applied the same fix to `iraun`/`irudi` (§8), which have the
identical suffix pattern. Also declined a request to reword `esan`'s heading
from "ditransitive" to "transitive" with a root-etymology framing — `esan`'s
forms fix a `NORI` argument (`hari`), making it genuinely ditransitive;
replaced the disputed etymology with a cross-reference to §5's already-
documented identical grid.

## 2026-06-11 — Confirmed `hiri` doesn't exist in §5's `-ke-` conditional/potential grids — replaced placeholders with an explanation

**Decision:** Verified (second opinion via Gemini) that `hiri` forms genuinely
don't exist for Baldintza/Ondorioa/Ahalera — not just undocumented. The
indicative `hiri` forms work only because they coincide with allocutive
(hitanoa) marking, which is independently banned in subordinate clauses and
clashes register-wise with the formal `-ke-` forms — the combination was never
grammaticalized. Replaced the `—` placeholders with this reasoning and added
the periphrastic alternatives speakers actually use (`emango nian`/`ninan`,
`eman ahal diat`).

## 2026-06-11 — Filled §5's missing `zuei` rows (and marked `hiri` as an honest gap) across the remaining NOR-NORI-NORK conditional/potential grids

**Decision:** Added `zuei` rows to Baldintza, Ondorioa present/past, and all
three Ahalera grids (12 grids total) via the same `-zu-`→`-zue-` mirror used
elsewhere, with `*(refl.)*`/`*(zu↔zuek)*` markers mirrored accordingly. Left
`hiri` as `—` in all of them — unlike the indicative grids, these `-ke-` forms
have no documented allocutive counterpart, and inventing ~24 new forms would
risk teaching incorrect Basque (per the doc's "honest gap over an unverifiable
form" policy).

## 2026-06-11 — Filled §5's missing `hiri`/`zuei` rows for the NOR-NORI-NORK Past grids

**Decision:** Same gap as the Present grids (next entry), same fix, applied to
Past. `zuei` mirrors `zuri` with `-zu-`→`-zue-`; `hiri` uses §10's allocutive
past `-a-`/`-na-`+`-n` forms (`nian`/`ninan`, etc.), with `-zki-` inserted for
the `NOR=haiek` grid at the same position as every other cell.

## 2026-06-11 — Filled §5's missing `hiri`/`zuei` rows for the NOR-NORI-NORK Present grids

**Decision:** §5's `NOR=hura`/`haiek` Present grids tabulated only 5 of 7
`NORI` categories, silently skipping `hiri`/`zuei`. Added `zuei` via the
standard `-zu-`→`-zue-` mirror, and `hiri` via §10's allocutive `-k`/`-n` forms
(`diat`/`dinat`, `dik`/`din`, etc.) — the same syncretism §10 documents from
the other direction. `hik`=`*(refl.)*`, `zuk`/`zuek`=`*(hika/zuka)*`. The
`NOR=haiek` grid gets the same forms with the `-zki-` infix.

## 2026-06-10 — Filled §16.1's missing `niri`/`guri`/`zuri`/`zuei` rows for the NOR-NORI-NORK Subjunctive Present

**Decision:** Added all four rows (each with `NOR=hura`/`haiek` columns),
following the existing "drop `-ke-`, append the Subjuntiboa-`NORK` suffix"
recipe used for `hari`/`haiei`. Roots derived from §5's Ahalera Orainaldia
roots (`zuei`'s `diezazue-` by analogy with §4's NOR-NORI `zuei` row, which has
no §5 antecedent). Gap placement mirrors `zuri`'s pattern with `zuk`/`zuek`
swapped for `zuei`. Closes the last "left for a future pass" item from §16.1;
Subjunctive Past remains an intentional honest gap.

## 2026-06-10 — Filled §5's missing Baldintza/Ondorioa (conditional) grids for the NOR-NORI-NORK ditransitive system

**Decision:** §3/§4 both have a Baldintza/Ondorioa-present/past trio but §5
jumped straight to Ahalera. Added all three, `NOR=hura`/`haiek`, by extending
§3's own Baldintza/Ondorioa relationship to §5's `n-i-`/`h-i-`/etc. shape:
Ondorioa-present swaps `hark`/`haiek`'s `z-`/`zi-` prefix to `l-`/`li-` plus
`-ke` (`zion`→`lioke`); Baldintza drops `-ke` and adds `Ba-` (`lioke`→`balio`);
Ondorioa-past reverts to `z-`/`zi-` and adds `-en`/`-ten` (`lioke`→`ziokeen`).
Flagged but not separately verified: `balio` (the Baldintza form) is
homophonous with the noun "value/worth" — disambiguated by context.

## 2026-06-10 — Added §16 (Subjunctive & Imperative consolidated module)

**Decision:** Gathered subjunctive material scattered across §§2-5 into one
cross-referenced module, plus two new pieces: a NOR-NORI-NORK Subjunctive
Present grid (derived from §5's Ahalera Orainaldia root by dropping `-ke-`)
and a NOR-NORI-NORK Imperative grid, plus synthetic-imperative and NOR-NORK
imperative tables and a syntax/usage section. NOR-NORI-NORK subjunctive past
and the `niri`/`guri`/`zuri`/`zuei` rows are explicitly left untabulated for a
future pass (later filled — see the 2026-06-10 entry above). Used `bedi`
rather than the literal-but-nonstandard `badi` for `izan`'s 3rd-person
imperative, and gave `etorri`/`joan` jussives periphrastically (`etor bedi`)
rather than guessing synthetic forms.

## 2026-06-10 — Added §14 (Non-finite forms) and §15 (Passive/"Nor-shift"), appended at end of document

**Decision:** §14 catalogues non-finite uses of the perfective/imperfective
stems (verbal nouns, attributive vs. resultative participles, modal/
instrumental `-z`). §15 explains Basque's lack of dedicated passive morphology
and the "nor-shift" (`Nik atea ireki dut` → `Atea ireki da`), explicitly
splitting the reading into **anticausative** (change-of-state verbs) vs.
**impersonal/generic** (verbs without that alternation), since collapsing
these would overstate how passive-like it feels — with the genuinely agentive
analytic passive included for completeness but flagged as least idiomatic.

## 2026-06-10 — Filled §5's missing "Ahalera, Alegiazkoa (ditransitive)" hypothetical-potential grid

**Decision:** §4 (NOR-NORI) already had its hypothetical-potential subsection;
the gap was §5 (ditransitive). Filled it by mirroring §3's
Alegiazkoa-vs-Lehenaldia relationship onto every cell of the already-verified
§5 Lehenaldia grids: drop the trailing `-en`, and additionally swap
`hark`/`haiek`'s `zi-`→`li-` prefix. A pure string transformation from
already-verified forms, consistent with the document's methodology — no new
round-trip verification needed.

## 2026-06-10 — Added new verb tables (`ihardun`, `mintzatu`/`hitz egin`, `ikusi`, `entzun`) as appended subsections of §6/§7 rather than a new numbered section

**Decision:** Added these as new `###` subsections at the end of §6/§7 to
avoid renumbering §8-§13. `ihardun` was conjugated by applying §8's `iraun`
di-root pattern. `mintzatu`/`hitz egin` reuse §1's `izan` paradigm (Literary/
Northern `mintzo` + `izan`) plus a regular periphrastic `hitz egin` table.
**`ikusi`/`entzun`: decided not to fabricate synthetic paradigms** — neither
has a productive synthetic conjugation in modern Batua; presented as
periphrastic tables instead, prioritizing accuracy over matching the letter of
"synthetic verbs".

## 2026-06-10 — Filled the last `hik`-as-`NOR`/`NORK` gaps in §3 and §5's Ahalera Alegiazkoa/Lehenaldia grids

**Decision:** Closed remaining `hik` gaps: §3's Ahalera Alegiazkoa/Lehenaldia
grids' blank `hik` rows/cells were derived from the existing
`nin-/hin-/gin-/zin-` + `-tza-ke(-en)` series and the `-k`/`-n`/`-a-`/`-na-`
patterns used elsewhere. §5's Ahalera Lehenaldia ditransitive grids' missing
`hik`-as-`NORK` column was derived via `diezaioke` → `iezaioke` → `hiezaioke`
→ `hiezaiokeen` (drop `d-`, prepend past `h-`, append `-en`), not gender-split,
matching §5's existing past `hik` precedent. No outstanding `hik` gaps remain
in Ahalera/Subjuntiboa.

## 2026-06-10 — New §10 "Allocutive register (hitanoa/alokutiboa)" inserted before Periphrastic; §10-12 renumbered to §11-13

**Decision:** Added a new section covering tokano `-k`/nokano `-n` addressee
agreement (independent of the verb's own arguments), placed as the new §10,
renumbering the three sections after it. Placed between the core finite-mood
sections (which these forms layer on top of) and the periphrastic/reference
material — verified via grep that no existing `§1[0-9]` cross-reference needed
updating.

## 2026-06-10 — Added "The full periphrastic tense matrix" to §11 (Periphrastic)

**Decision:** Added an 8-row tense matrix crossing §11's three aspect suffixes
with `izan`/`ukan`'s present/past/ondorioa paradigms. The four "compound" rows
(Ondorio Orokorra, Lehenaldi Mugatua/Ez-mugatua, Ez-ohiko Baldintza) get
explanatory paragraphs distinguishing, in particular, `Lehenaldi Mugatua`
(`ikusi nuen`, simple past) from `Lehenaldi Ez-mugatua` (`ikusi izan nuen`,
pluperfect via an invariant `izan` participle — the same mechanism §14 uses
for resultatives/passives).

## 2026-06-10 — Completed §5's Ahalera Lehenaldia ditransitive `NOR=haiek` grid via mechanical `-zki-` insertion

**Decision:** Confirmed (via Gemini, with fresh examples) that `-zki-` slots
into Lehenaldia ditransitive forms at the same position as in Orainaldia
(`diezaioke`→`diezazkioke`) across 4 of 5 `NORI` suffixes plus the `nik`
column. Since the `NORK` prefix is structurally separated from where `-zki-`
lands, the rule generalizes across all 6 `NORK` columns — applied to all 26
real cells of the confirmed `NOR=hura` grid to produce the `haiek` grid. Only
`hik`-as-`NORK` remains open for Lehenaldia.

## 2026-06-10 — Filled §5's Ahalera Lehenaldia ditransitive `NOR=hura` grid via cross-pattern composition

**Decision:** Confirmed the predicted `hari` row (5 cells, including the
riskiest `hark` cell, which uses a different prefix for Alegiazkoa vs.
Lehenaldia) via Gemini, each with a fresh, role-correct example. Combined with
the previously-confirmed `nik` column, this pins down both halves of the cell
formula (`NORK` wrapper + `NORI` suffix) with fresh examples for each —
composed to fill the remaining 17 cells. `NOR=haiek` and `hik`-as-`NORK` left
open.

## 2026-06-10 — Started §5's Ahalera Lehenaldia (past potential) ditransitive grid: `nik` row resolved, root differs from Orainaldia

**Decision:** Confirmed via Gemini that the `dieza-`/`diezazki-` Orainaldia
root does not carry over — Lehenaldia uses `niezaiokeen`-type forms.
Cross-checked two ways: against §3's `nezake`→`nezakeen` (`-ke`+`-en`)
transform applied to the verified Orainaldia `hark`-column forms, and against
§5's own indicative grids (the extra `-i-` matches `nion` vs `nuen`). Applied
the `nik` row and wrote up the general derivation rule as a hypothesis for the
rest of the grid, flagging that `hark`'s prefix needs its own check since §3
shows it can differ between Alegiazkoa and Lehenaldia.

## 2026-06-10 — Completed §5's Ahalera Orainaldia ditransitive grid with the `hik` column

**Decision:** Confirmed via Gemini (with fresh, number-appropriate examples for
all 8 masc./fem. pairs) the `hik`-as-`NORK` column, predicted via the `-k`/`-n`
suffix already cross-checked against §3's `hik` row. Applied all 16 forms;
`zuri`/`hik` stays `*(hika/zuka)*`. This completes §5's Ahalera Orainaldia
ditransitive grid (no `—` cells remain — only principled
`*(refl.)*`/`*(zu↔zuek)*`/`*(hika/zuka)*` markers).

## 2026-06-10 — Filled out §5's Ahalera Orainaldia ditransitive grid to `nik`/`guk`/`zuk`/`zuek`/`haiek` (full grid minus `hik`)

**Decision:** Gemini's `nik` column predictions checked out, but it also
supplied full `guk`/`zuk`/`zuek`/`haiek` columns (34 cells) unprompted with
only hand-wavy assurances. Cross-checked these against §3's already-verified
`NORK`-suffix-after-`-ke-` forms and against the `*(refl.)*`/`*(zu↔zuek)*`
placement of this section's existing indicative grid — both checks passed
exactly, so applied the columns. `hik` stays `—` except `zuri`/`hik`=
`*(hika/zuka)*`, deserving its own verification pass.

## 2026-06-10 — Added Ahalera Orainaldia ditransitive `hark` column to §5 (citation table)

**Decision:** Two more focused verification rounds: corrected a
number-mismatched example for `diezaieke` and confirmed `diezazki-` (not
`diezaizki-`) is the plural-object root for `niri`/`hari`/`haiei`; and
confirmed the remaining `guri`/`zuri` cells (`diezaguke`/`diezazuke` and their
`-zki-` siblings) by analogy. Added a new §5 citation table for the `hark`
column (10 cells, all example-backed or pattern-identical).
`nik`/`hik`/`guk`/`zuk`/`zuek`/`haiek` as `NORK` remain open.

## 2026-06-10 — Added `hik` NORK column to §5's `NOR=hura`/`haiek` Present/Past grids

**Decision:** §5's four grids only had 6 `NORK` columns (missing `hik`, unlike
§3). Derived a `hik` column anchored on §3's `duk`/`huen`/`hituen`: Present
uses `di-`/`di-zki-` + `NORI`-suffix + `-k`/`-n` (gender split, self-check
passed against `hari`/`hik`=`diok`/`dion`); Past uses the same `h-` prefix as
`hark`→`z-`, not gender-split (matching §3's `hi`-object past precedent).
`zuri`/`zuei`×`hik` are `*(hika/zuka)*`. Applied directly — every cell follows
an established formula.

A follow-up Ahalera Orainaldia request (`dieza-`/`diezazki-` root) was **not**
applied — its self-check didn't actually reduce algebraically to the cited
forms, needing another verification pass (later resolved in the entries
above).

## 2026-06-10 — Fixed §3's `guk`→`hi` past cell (`*(refl.)*` → `hindugun`); declined a new `*(PCC-blocked)*` marker

**Decision:** `guk`→`hi` past was wrongly marked `*(refl.)*` (no reflexivity
between `gu` and `hi`) — re-derived as `hindugun` from the established `hind-`
past prefix + `-u-` + `-gu-` + `-n`, consistent with `guk`→`hi` present
(`haugu`). Also **declined** a proposed new `*(PCC-blocked)*` marker for the
`hiri` row in the NOR=1st/2nd ditransitive grids — the proposal's marker
placement was internally inconsistent (patching rather than principled), and
§5's existing PCC explanation already covers the substance without a new
marker.

## 2026-06-10 — Fixed §3's `haiek`→`zuek` present cell (`zaituzte`→`zaituztete`); declined Gemini's 10 NOR=1st/2nd grids again

**Decision:** While re-deriving `haiek`→`zuek` present, found §3's existing
`zaituzte` cell conflicted with the `-te-` infix pattern that both past-tense
and Baldintza grids use to distinguish `haiek`→`zu` from `haiek`→`zuek` —
corrected to `zaituztete` (a copy-paste error). **Declined again** to add the
10 full NOR=1st/2nd grids: beyond the `hari`/`haiei` rows (already covered via
cross-reference), the other rows had inconsistent markers, an open `?` cell,
and a garbled example sentence — not reliable enough to tabulate.

## 2026-06-10 — Filled §5's `*(refl.)*` gaps, fixed `zenion`/`zenizkion`, and added a "NOR = 1st/2nd person" subsection instead of full new grids

**Decision:** Filled `niri`/`nik` and `guri`/`nik` (previously `—`) as
`*(refl.)*` per §3's same-person-category extension, across all four
`hura`/`haiek`×Present/Past grids. Corrected `zenioen`→`zenion` and
`zenizkioen`→`zenizkion` for consistency with the parallel `-zki-` forms.
**Did not** paste Gemini's ten full NOR=1st/2nd grids — they had internal
inconsistencies and would have duplicated ~90% of §3's grid. Instead added a
concise "NOR = 1st/2nd person" subsection explaining the Person-Case
Constraint: `NORI`=`hari`/`haiei` cells reduce to §3's plain forms
(cross-referenced), while `NORI`=1st/2nd cells are blocked/clashed, covered by
the `buru` periphrasis in practice.

## 2026-06-10 — Restructured `CONJUGATIONS.md` as a pure reference, stripping process narrative

**Decision:** Removed the ✅/📖/🔍 confidence-marker system, sources list,
per-Gemini discrepancy stories, and cross-references to
`DECISIONS.md`/`VERB_COVERAGE.md` — kept all conjugation tables, examples, and
grammatical explanations (now with markers defined once in a "Notation"
section). `🔍` cells now read as plain forms; `❓` gaps now render as `—`. 1398
lines → 979. **Why:** the doc's purpose is lookup, not an audit trail — that
history lives in `DECISIONS.md`/git history.

## 2026-06-10 — Incorporated Gemini's verification pass: corrected the Ondorioa `-zke-` rule, resolved `-io-`/`-ioe-` and `zidan`/`dit` discrepancies, added a `zu↔zuek` impossibility marker, filled Ahalera-Orainaldia's `hi` cells

**Decision:** Applied a batch of corrections to §3/§5: **Ondorioa
present/past** — supersedes the 2026-06-08 `-zte-after-ke` entries; the real
rule is that a plural object or `haiek`-subject merges `-ke-`+`-z-` into
`-zke-` *before* the suffixes (`zint-u-zke-te`, not `zint-u-ke-zte`), recasting
~12 cells. **§5 `hari`-past**: `nion`/`zion`/`genion` (not `-ioe-`, a Bizkaian
variant) confirmed standard Batua, applied to the parallel `-zki-` row too.
**§5 `hura`-present `niri`/`hark`**: `zidan` was a past form wrongly placed in
the present grid — corrected to `dit` (and `didate` for `haiek`,
formula-derived). **New `*(zu↔zuek)*` marker**: the four `zuri`/`zuek` cells
across §5's grids don't exist (`zu`/`zuek` can't fill both NORI/NORK slots —
`Zuen buruari ematen diozue` is used instead). **§3 Ahalera Orainaldia
`hi`-cells**: filled `hi`-as-`NOR` (`hazake` etc., gender-invariant) and
`hik`-as-`NORK`→`ni`/`gu`; Alegiazkoa/Lehenaldia's `hi`-cells remain open.

## 2026-06-10 — Filled both Subjuntiboa NOR-NORK grids (Present + Past) from a user-supplied table, including the `hi` masc./fem. split

**Decision:** A user-supplied table provided full Subjuntiboa Present (new)
and completed the Past grid's remaining cells, including `hi` as both `NOR`
and `NORK` for the first time in any NOR-NORK grid — `hari`/`haiei` columns of
the Past grid matched pre-existing citations, corroborating both sources.
**Finding:** `hi`-as-`NOR` is gender-invariant; only `hi`-as-`NORK` splits via
`-a-`/`-na-` insertion (one exception, `hezan`, given as identical for both
genders, reproduced as-is). Did **not** use this data to fill Ahalera's `hi`
gaps — Subjuntiboa's `-a-`/`-na-` mechanism differs from Ahalera's `-k`/`-n`
suffix pattern, so cross-paradigm extrapolation isn't safe.

## 2026-06-10 — Ahalera "contradiction" was a tense split, not an error; filled the `❓` NOR=1st/2nd-person cells from a user-supplied table

**Decision:** A previous session had concluded `dezaket` was a mistaken
artifact and marked the entire NOR=1st/2nd block `❓`. A user-supplied
reference table showed **both recipes are real, for different tenses**:
Orainaldia uses the `dezaket`/`nazake`-type prefix recipe, while
Alegiazkoa/Lehenaldia use the `nezake`/`nintzake`-type `*ezan`-mirrored recipe.
Replaced the old combined grid with three full grids
(Orainaldia/Alegiazkoa/Lehenaldia), filling nearly all previously-`❓` cells.
**New finding:** same-person-category blocking is broader than the old strict
diagonal — extended `*(refl.)*` to the whole 1st-on-1st/2nd-on-2nd 8-cell block
per grid. `hi` (omitted by the new source) and Subjuntiboa remain `❓`.

## 2026-06-09 — Started NOR-NORI-NORK (§5): completed the `hura` grid, added a `haiek` (`-zki-`) grid, scoped out NOR=1st/2nd person

**Decision:** §5 had a single `NOR=hura` grid with several blank cells. Filled
them via the same `di-`+NORI-suffix+NORK-suffix formula visible elsewhere (one
fill, `didazu`, is a well-known form, corroborating it); two cells turned out
reflexive (`*(refl.)*`), two pre-existing unexplained `—` cells were left
as-is. Added a parallel `NOR=haiek` grid (Present+Past) using §4's `-zki-`
infix. **Scoped out:** NOR=1st/2nd person ditransitive forms ("he gives *me*
to him") — vanishingly rare and unattested in any source, left out entirely
rather than invented.

## 2026-06-08 — Filled Ondorioa `zuek`-as-object blanks using a `-zte-after-ke` rule

**⚠️ Superseded** by the 2026-06-10 entry above — the real rule merges
`-ke-`+`-z-` into `-zke-` instead. Kept for history: extended an existing
`[zint-u-ke-zte-suffix]` pattern to the NOR=zuek marker in both Ondorioa grids,
marking all 8 cells `🔍`.

## 2026-06-08 — Cross-checked `ukan`'s NOR-NORK 🔍-cells against the paradigm-chart PDF; recovered the `-zte-`-insertion rule for `zuek`-as-object cells

**Note:** The Past/Baldintza findings here (no `-ke-` involved) still stand;
only the Ondorioa extension was superseded 2026-06-10.

**Decision:** User-supplied forms from the paradigm-chart PDF either confirmed
existing 🔍-derived guesses or filled previously-honest `zuek`-as-object gaps.
Comparing fills against their `zu`-cell counterparts revealed the rule:
`-zte-` slots in right after the stem `-u-`, before the `NORK` suffix. Applied
to 3/4 Past cells and all 4 Baldintza cells; the 4th Past cell (`nik`→`zuek`)
got a rule-derived form (`zintuztedan`) instead of the user-supplied
`zaituztet` (which duplicates the present-tense cell, flagged as a likely
transcription slip). The rule wasn't extended to the Ondorioa grids — an extra
`-ke-` layer means nothing pins down which side of it `-zte-` lands, so those
cells were left blank rather than guess two layers deep.

## 2026-06-08 — Merged `ukan`'s citation paradigm into its NOR-NORK section; renumbered §3-§15 down by one; removed two further duplications

**Decision:** `CONJUGATIONS.md` had a duplicate `ukan` citation table and full
NOR-NORK grid (same `hura` column) — merged the citation table into the
NOR-NORK section's intro as the **✅ baseline** the grid was built against,
deleted the old section, and renumbered everything after it down by one
(updating ~60 `§N` cross-references). Sequential numbering was kept rather
than leaving a gap, since a silent gap is exactly the kind of small structural
debt that compounds.

Two more duplications found the same day, same pattern ("gradually fill in a
grid" leaves a stale partial copy): a sparse Present/Past grid wholly subsumed
by a complete one later in the section was deleted (one unique note moved to
the surviving grid); and a "Further moods" citation table's Baldintza/Ondorioa
rows duplicated the full NOR-NORK grids built later — trimmed to just
Ahalera/Subjuntiboa (the two moods without full-grid expansions), with
dependent grids re-sourced from §13's citation paradigm.

## 2026-06-08 — `CONJUGATIONS.md` keeps the *current* picture; the story of how it got there belongs in `DECISIONS.md`

**Decision:** Trimmed `CONJUGATIONS.md` of in-place retrospectives ("an
earlier pass assumed X, that was backwards...") down to short notes stating the
current fact plus a pointer to the dated `DECISIONS.md` entry. Also compressed
the intro's "sources merged in arrival order" changelog-as-prose into a flat
source list, and deleted a closing "Where this stands" section that restated
already-inline ⚠️-flagged discrepancies. **Why:** a reference doc's job is to
answer "what's true, and how sure are we?" as fast as possible — a paragraph
narrating a now-fixed mistake is friction that points backwards, and
`DECISIONS.md` already exists to carry that story without two places going out
of sync.

## 2026-06-08 — Filling NOR-NORK's "NOR = 1st/2nd person" gap: derive-and-flag where the recipe checks out, stop where it contradicts a sourced form

**Decision:** Extended §4 (`ukan`'s NOR-NORK system) with the "you have
*me*"-type grids the citation framing had left blank, decoding the PDF chart's
`[prefix]+[stem]+[suffix]` templates and cross-checking each against
already-sourced cells before trusting them on new ones. **Present/past/
baldintza/ondorioa(×2)** cross-checked cleanly (with one wrinkle: a `-z-`
appears between a plural-object stem and the `haiek`-subject suffix, e.g.
`dituzte` not `†ditute`) and were filled, marked 🔍 where not independently
attested. **Ahalera/Subjuntiboa** did *not* cross-check — the PDF's
"NOR=1st/2nd" template gives `dezaket` for a cell whose sourced citation form
is `nezake` (different agreement marking entirely) — written up as an open
discrepancy rather than silently picked. `zuek`-as-object was left blank
throughout (its `-zte-` infix would collide with a vowel-initial suffix, an
untested juncture).

**Same-day corrections:** A native speaker confirmed `haut`/`hau`/`haugu`/
`haute` ("I/he/we/they have you-familiar") as real (no longer 🔍), and flagged
that `guk`/`zuk`/`zuek`→`hi` had been wrongly marked `*(refl.)*` (different
people aren't reflexive — pattern-matched on shape, not grammar). Also
identified that `hi` (hika) and `zu`/`zuek` (zuka) are mutually exclusive
registers, so `hik`↔`zu`/`zuek` cells are *impossible*, not unsourced — given a
new `*(hika/zuka)*` marker, applied across all five expanded grids and (in a
same-day follow-up) to the equivalent dative-argument clash in §5's NOR-NORI
grids. **Lesson:** a blank cell's impossibility needs its own justification,
not one inherited from a similar-looking cell.

