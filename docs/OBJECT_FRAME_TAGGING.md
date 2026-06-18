# Object-frame tagging: a class-based alternative to hand-tagged `validFor`

**Status: proposal (research spike, [A3]/#225). Not adopted — no `src/data/verbs.js` or runtime changes accompany this document.**

## Why

Every tagged `sentences`/`negativeSentences`/`pronounSentences` variant in `verbs.js` carries a hand-written `validFor` array: the list of sibling verbs whose same-person form would *also* correctly complete that exact sentence. [A1] and [A2] showed this hand-tagging has gaps (missing entries that should be there) and the existing audit tooling (`scripts/validforGapAudit.mjs`) can find some of them mechanically, but only the ones implied by *agreement compatibility* — it has no model of whether the sentence's *object* makes semantic sense with a candidate verb (e.g. "I {jan/erosi/nahi} a book" vs "I {jan} a meeting").

This spike asks: if every object noun belonged to a small number of **semantic classes**, and each class declared a fixed *admitted verb set* (the verbs whose meaning is compatible with that kind of object), could `validFor` be derived from `(host verb, object class)` instead of hand-tagged sentence-by-sentence? If so, future verbs/tenses could get `validFor` mostly for free, and existing gaps/inconsistencies would surface automatically as diffs against the class model.

## Method

1. Dumped every tagged `sentences`/`negativeSentences` variant (text + `validFor`) for the 14 core-cluster verbs (`izan, egon, ukan, nahi, jakin, joan, etorri, jan, edan, erosi, ikusi, eduki, hartu, behar`) via a Node script against the real `verbs.js` data (no modifications made).
2. Looked for objects that recur with the *same* `validFor` set across sentences/tenses, and grouped them into candidate classes.
3. For each class, picked a canonical "ideal" admitted-verb-set — the verbs that should accept that kind of object, independent of which verb currently hosts the example sentence.
4. Tagged every sentence text in `scripts/frame-classes.json` with its class.
5. Wrote `scripts/frame-derive-diff.mjs`, which re-derives `validFor` from `(class admission set) ∩ (agreement-compatible siblings with a conjugated form for that tense/person)`, and diffs it against the real hand-tagged `validFor`. It's read-only — it never touches `verbs.js`.
6. Ran the diff and read the per-verb adds/removes/exact-match counts and samples (reproduced below).

## Object-class vocabulary

| Class | Admitted verb set | Example sentence |
|---|---|---|
| `concrete-ownable` | ukan, nahi, eduki, ikusi, erosi, behar | "Nik liburu bat ___." (ukan) |
| `food-drink` | ukan, nahi, eduki, ikusi, erosi, behar, jan, edan | "Nik sagarra ___." (jan) |
| `kinship` | ukan, nahi, eduki | "Nik arreba bat ___." (ukan) |
| `abstract-ownable` | ukan, nahi, eduki, behar | "Nik bilera bat ___." (ukan, "a meeting") |
| `inanimate-subject-possession` | eduki | "Etxeak lorategi bat ___." (ukan, "the house has a garden") |
| `non-agentive-subject` | ukan, nahi, eduki, ikusi | "Txakurrak hezur bat ___." (ukan, "the dog [has] a bone") |
| `animate-object` | ukan, nahi | "Irakasleak ikasleak ___." (ikusi, "the teacher sees the students") |
| `abstract-referent` | ukan, nahi, eduki, erosi, jakin | "Zuk hori ___?" (ikusi, "do you see that") |
| `possession-in-hand` | ukan, ikusi | "Nik giltza poltsikoan ___." (eduki) |
| `takeable-action` | behar | "Nik autobusa ___." (hartu, "I take/need the bus") |
| `fact-answer` | ikusi, nahi | "Nik erantzuna ___." (jakin) |
| `secret-knowledge` | nahi, ukan | "Nik sekretua ___." (jakin) |
| `path-object` | ikusi | "Nik bidea ___." (jakin, "I know the way") |
| `directional-destination` | etorri | "Ni hondartzara ___." (joan) |
| `directional-origin` | joan | "Ni etxera ___." (etorri) |
| `verb-complement` | (none) | "Zuk etorri ___?" (nahi, "do you want to come" — not an object frame) |
| `predicate-nominal` | (none) | "Ni irakaslea ___." (izan — identity, not possession) |
| `location` | (none) | "Ni etxean ___." (egon — location, not possession) |
| `scenery-no-frame` | (none) | "Nik mendia ___." (ikusi — scenery/people you see but don't "have") |

The all-empty classes (`verb-complement`, `predicate-nominal`, `location`, `scenery-no-frame`) reflect sentence types that aren't object-possession frames at all — `izan`/`egon`'s tagged sentences are uniformly `validFor: []` in the real data, confirming they sit entirely outside this frame.

## Verb × class admission table

This is the same information as the vocabulary table above, viewed from the verb side — which classes each core-cluster verb is admitted into (i.e., which other verbs' sentences of that class it could legally substitute into):

| Verb | Admitted into classes |
|---|---|
| ukan | concrete-ownable, food-drink, kinship, abstract-ownable, inanimate-subject-possession, non-agentive-subject, animate-object, abstract-referent, possession-in-hand, secret-knowledge |
| nahi | concrete-ownable, food-drink, kinship, abstract-ownable, non-agentive-subject, animate-object, abstract-referent, fact-answer, secret-knowledge |
| eduki | concrete-ownable, food-drink, kinship, abstract-ownable, inanimate-subject-possession, non-agentive-subject, abstract-referent, possession-in-hand |
| ikusi | concrete-ownable, food-drink, non-agentive-subject, possession-in-hand, fact-answer, path-object |
| erosi | concrete-ownable, food-drink, abstract-referent |
| behar | concrete-ownable, food-drink, abstract-ownable, takeable-action |
| jan | food-drink |
| edan | food-drink |
| jakin | abstract-referent |
| joan | directional-origin |
| etorri | directional-destination |

## Diff results

Running `node scripts/frame-derive-diff.mjs` against the real `verbs.js` data:

```
izan     exact=105 adds=0  removes=0  unmapped=0
egon     exact=102 adds=0  removes=0  unmapped=0
ukan     exact=36  adds=2  removes=52 unmapped=0
nahi     exact=24  adds=0  removes=0  unmapped=0
jakin    exact=27  adds=0  removes=0  unmapped=0
joan     exact=81  adds=0  removes=0  unmapped=0
etorri   exact=81  adds=0  removes=0  unmapped=0
jan      exact=0   adds=45 removes=15 unmapped=0
edan     exact=0   adds=45 removes=14 unmapped=0
erosi    exact=12  adds=9  removes=27 unmapped=0
hartu    exact=30  adds=0  removes=15 unmapped=0
ikusi    exact=26  adds=3  removes=17 unmapped=0
eduki    exact=51  adds=0  removes=0  unmapped=0

Totals: exact=575 adds=104 removes=140 unmapped=0
```

(`--samples` shows the actual sentence/diff for each non-exact case; `--json` emits the full machine-readable report.)

Three distinct findings fall out of this:

1. **A real gap, not a tagging quirk: `jan`/`edan`/`erosi`'s own food sentences are under-tagged.** `jan`'s and `edan`'s sentences (e.g. "Nik sagarra ___.") are tagged `validFor: [erosi, behar]` only, but the *same* food objects under `nahi`'s sentences (e.g. "Nik kafe bat ___.") get the full `[ukan, eduki, ikusi, erosi, behar]`. There's no semantic reason "I have/want/see an apple" should be valid but "I eat an apple" should disallow `ukan/nahi/eduki/ikusi` as substitutes when the reverse direction (under `nahi`) allows it. This is a genuine asymmetry in the hand-tagged data that a class model catches automatically — the `adds` in `jan`/`edan`/`erosi` are exactly this.
2. **Expected, harmless "removes" caused by incomplete conjugation tables, not by the model being wrong.** Most of `ukan`'s 52 removes and all of `hartu`'s 15 removes are `nahi` (whose conjugation table only has `ni/zu/hura` — no `gu/zuek/haiek`) and `behar` (whose conjugations only cover `present/future`, no `past`) being correctly excluded by the "agreement-compatible + form exists" filter, not a class-vocabulary problem. These would resolve themselves if/when those verbs' tables are filled in.
3. **Real, irreducible fine-grained distinctions the class model doesn't fully capture.** `ikusi`'s "Txakurrak katua ___." (non-agentive subject) is hand-tagged narrower than the `non-agentive-subject` class predicts (missing `ukan`), and "Zuk hori ___?" is hand-tagged with `jakin`/`nahi` that the `abstract-referent` class (built from this exact sentence) doesn't include `nahi` for — these are genuine edge cases where a human tagger made a judgment call finer than a class label can express.

## Recommendation: adopt with changes

The class model is not a drop-in replacement for hand-tagging — finding #3 shows some sentences need judgment a fixed class can't supply. But finding #1 is the headline result: it caught a real, systematic under-tagging bug (`jan`/`edan`/`erosi`'s food objects) that the existing agreement-based audit (`validforGapAudit.mjs`) cannot detect, because agreement compatibility alone doesn't know "an apple" and "a book" belong to overlapping-but-different semantic classes.

Concretely, if a future issue wants to act on this:
- **Adopt** the class vocabulary as a *second-pass audit*, layered on top of (not replacing) `validforGapAudit.mjs`'s agreement-based gap audit — i.e. a `--classes` mode for the delta-audit CLI that flags `adds` as candidate fixes for human review, the same way gap slots are today.
- **Reject** the idea of deriving `validFor` automatically/unattended from classes — finding #3's edge cases mean a derived value still needs a human sign-off before landing in `verbs.js`.
- Treat `food-drink`'s under-tagging (finding #1) as the one finding here with enough signal to justify a dedicated follow-up issue, independent of whether the class-audit tooling itself gets built.

## Artifacts

- `scripts/frame-classes.json` — sentence-text → class mapping for all tagged core-cluster sentences.
- `scripts/frame-derive-diff.mjs` — read-only diff tool; `CLASS_ADMISSION` is the canonical per-class admitted-verb-set.
- This document.

None of these are wired into the app, the CLI delta-audit script, or any test — they're standalone research artifacts for this spike.
