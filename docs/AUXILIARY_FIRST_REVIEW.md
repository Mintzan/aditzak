# Auxiliary-First Review — Rethinking What Aditzak Teaches

**Status: review + proposed model (2026-07-08).** An expert review of the
app's learning model prompted by the observation that *"the application puts
a lot of focus on concrete verbs, but what the learner must learn is the
auxiliary verb — when to use it and how. There is no value in learning
concrete verbs like `hartu` or `utzi`."* This document assesses that claim
against Basque grammar, second-language pedagogy, and what the app actually
does today, then proposes a redesigned model. Companion documents:
`LEARNING_JOURNEY.md` (current journey rationale),
`LEARNING_JOURNEY_EVALUATION.md` (previous evaluation round),
`CONJUGATIONS.md` (the grammar), `DATA_MODEL_ACADEMIC.md` (data shapes).

---

## 1. The linguistic verdict: the claim is right about the core, wrong at the edges

### 1.1 Where it is right — the auxiliary *is* the grammar

Standard Basque has only a couple of dozen verbs with synthetic (directly
conjugated) forms in live use. **Every other verb in the language is
periphrastic**: a non-finite lexical form marked only for aspect, plus a
finite auxiliary that carries *all* of the person/number/tense/mood
morphology:

```
hartzen  dut      "I take it"        (imperfective participle + NOR-NORK present aux)
hartu    dut      "I have taken it"  (perfective participle + same aux)
hartuko  dut      "I will take it"   (future participle + same aux)
hartu    nuen     "I took it"        (perfective participle + NOR-NORK past aux)
```

The generative skills — the things that, once learned, apply to the entire
open-ended verb lexicon — are exactly the two the observation names:

- **"How":** producing the right auxiliary cell — the four paradigm families
  (NOR `naiz/da/…`, NOR-NORI `zait/zaio/…`, NOR-NORK `dut/du/…`,
  NOR-NORI-NORK `diot/dio/…`), each crossed with tense/mood and up to three
  agreement axes. Plus the aspect layer: the three participles
  (*burutua* `-tu/-i/-n`, *ez-burutua* `-t(z)en`, *gerokoa* `-ko/-go`) whose
  combination with auxiliary tense **is** the Basque tense system.
- **"When":** *selecting* the auxiliary — izan vs. ukan for a new intransitive
  vs. transitive verb (the ergative fault line), spotting the dative that
  pulls a sentence into `zaio`/`dio` territory, and reading the sentence's
  case morphology (`-k`, `-ri`) to know which family is even in play.

A learner who owns those two skills conjugates `hartu`, `utzi`, and every
verb they will ever meet in a dictionary — including verbs no course could
ever list. Conversely, a learner who has memorised "hartu's conjugation
table" as a fact about *hartu* owns nothing transferable: the table is not
hartu's, it is `ukan`'s, wearing a `har-` prefix. On this, the observation
is simply correct, and it matches how Basque is taught in euskaltegiak
(HABE/IRALE materials): *aditz laguntzailea* tables first, lexical verbs as
interchangeable material that rides them.

### 1.2 Where it overshoots — three kinds of verb-specific knowledge are real

**(a) Synthetic verbs are irreducibly lexical.** `izan`, `ukan`, `egon`,
`joan`, `etorri`, `ibili`, `jakin`, `eduki`, `eraman`, `ekarri`, `erabili`,
`esan` (partly), and the curiosities (`jario`, `irudi`, `iraun`, `ihardun`,
`etzan`) each carry their own paradigm (`nago/zaude/dago` ≠ `noa/zoaz/doa`).
They are among the highest-frequency verbs in the language, and two of them
(`izan`, `ukan`) *are* the auxiliaries — drilling them per-verb is drilling
the auxiliary. The app's per-verb investment here is correct and must stay.

**(b) Lexical verbs carry grammar-selecting features, even though they carry
no conjugation.** What a learner must know *about* `hartu` or `utzi` is not
a table but a feature bundle:

- **participle class / aspect allomorphy** — `jan → jaten` but
  `hartu → hartzen`, `ikusi → ikusten`, `eman → ematen` (`-ten` vs `-tzen`
  is a genuine, error-prone rule keyed to the participle's shape);
- **argument frame** — `lagundu`/`deitu`/`jarraitu` govern a dative;
  `gustatu`/`iruditu`/`ahaztu` are NOR-NORI psych verbs; `sartu`/`atera`/
  `hasi` run on izan intransitively; `utzi` can be plain NOR-NORK *or*
  ditransitive ("leave it" vs "let/leave something to someone") — this is
  precisely the "when" skill, and it is stored per verb;
- **future allomorph** — `-ko` vs `-go` (`hartuko` but `esango`).

So "no value in learning `hartu`" is true of hartu-as-a-paradigm and false
of hartu-as-a-lexeme: its value is as a **carrier** — it makes auxiliary
practice contentful, feeds sentence frames, and supplies the minimal pairs
(`jaten/hartzen`, `dut/diot`, `da/du`) that force the discriminations we
actually want to teach.

**(c) The pedagogy point.** Skill-acquisition research (interleaving,
variability-of-practice, transfer-appropriate processing) says abstraction
of a pattern comes from meeting it across *varied* carriers in *mixed*
practice — not from drilling the pattern bare. A learner shown only the raw
`dut/duzu/du` grid acquires a recitable table; a learner who completes
`hartzen ___`, `ikusten ___`, `erosten ___` across shuffled sentences
acquires the auxiliary. Concrete verbs are therefore not the enemy of
auxiliary learning — **verb-blocked practice is**. The critique should be
aimed at any place the app drills one verb long enough for the learner to
succeed by item memory rather than by running the rule.

---

## 2. Review of the current app: the engine already believes this; the learner-facing model doesn't yet

The audit surprise is that the codebase has *already converged* on the
auxiliary-first analysis — at the engineering layer:

1. **The data model stores the auxiliary once.** Periphrastic tables are
   composed at runtime from shared auxiliary skeletons
   (`OBJECT_AXIS_SKELETONS.edun`, `dativeIzan[ByNor]`) plus per-verb
   participle prefixes (`composedPrefixes`/`byObjectPrefixes`/
   `byNoriPrefixes`); `hartu`'s entry literally has `conjugations: {}`.
   The architecture *knows* hartu has no conjugation of its own.
2. **The curriculum has a pattern-first rule** (`LEARNING_JOURNEY.md` §7,
   #309): the learning target is a `(agreement-pattern × tense)` goal, "not
   any one verb — once a learner knows a pattern, every verb that rides it
   is interchangeable"; regular verbs are "interchangeable pool fodder" that
   may never own a lesson id, with a carve-out for one-verb *pattern
   introducers* and for synthetics.
3. **Recent units are already paradigm-named** ("The NOR-NORK Present —
   dut/duzu/du", "The NOR-NORI-NORK Present — diot/diozu/dio") and pooled
   across many carriers (`future-mixer-pool` spans every fodder verb; #443
   widened object-axis reviews to ~37 carriers).
4. **The distractor engine drills "when" at the margins** — `getCaseFrameLure`,
   the #293 `dut`-vs-`diot` covert-dative lure, and the 2026-07-06
   `getAuxiliarySwapLure` (*own participle + wrong-family aux*: `joango dut`)
   all inject auxiliary-*selection* pressure into form-selection questions.

So the observation is not asking the app to become something alien; it is
asking the app to **finish a migration it started**, and to surface it to
the learner. The verb-centric residue that remains:

- **R1 — The learner-facing frame is verb × tense.** Lesson cards read
  "hartu · Present"; `describeLesson` leads with the verb; progress and
  stars are per `lessonId` (≈ verb × tense); error stats are keyed
  `verbId:tense:person`. Mastery of `duzue` earned on `ikusi` and mastery of
  `duzue` earned on `hartu` are unrelated facts in the model, though they are
  the *same knowledge*. Nothing anywhere shows the learner "you own 14 of 18
  cells of the NOR-NORK present grid."
- **R2 — The journey's narrative spine is still verb-named in Phase I–II.**
  Units 5 (`ikusi`), 14 (`gustatu`), 16 (`maite izan`), 18–19 (`eduki`),
  22 (`behar`) — some justified (synthetics, pattern introducers, modals),
  but the *title* tells the learner the unit is about a verb when it is
  actually about a paradigm (`-tzen dut`, `zait`, the object axis, …).
- **R3 — "When" is under-drilled relative to "how."** Almost every question
  fixes the auxiliary family by construction (the lesson *is* a slice of one
  paradigm) and asks the learner to pick the right *cell*. Family-selection
  pressure exists only as distractor lures inside cell-selection questions,
  plus one early checkpoint (Unit 3, `Ni` vs `Nik`) and the Gate C mixer.
  There is no question kind whose *answer dimension* is "which auxiliary
  family does this sentence need?" — the single most valuable exercise for
  the stated goal.
- **R4 — The aspect layer is implicit.** The three participles are taught as
  a by-product of "tenses" (present lessons happen to use `-tzen`, perfect
  lessons `-tu`, future lessons `-ko`), and only `-ko/-go` gets an explicit
  choice drill (`suffixChoice`, #423). The learner is never shown the 3 × N
  combinatorial fact — participle aspect × auxiliary tense = the whole
  indicative — which is the cheapest "aha" in Basque verb pedagogy: it turns
  what looks like six tenses into two small systems.
- **R5 — No generalization test.** The app never verifies the learner can
  conjugate a verb they were *not* taught — the only direct proof that they
  learned the auxiliary rather than the items. With ~90 verbs in `VERBS`
  (most of them pool fodder added by #314/#319/#320/#321), a held-out
  "nonce verb" check at gates is nearly free.
- **R6 — Auxiliary identity is hidden in the moods.** `naiteke`/`dezaket`
  and `dadin`/`dezan` are lessons named `izan-potential`/`ukan-potential`/
  `*-subjunctive`, following the school convention of filing *edin/*ezan
  under izan/ukan. Defensible — but the learner is never told the one fact
  that makes the mood system regular: the same four-family logic reruns on a
  second auxiliary pair (root aspect + *edin/*ezan), so "can/should/if" is
  not 30 new tables, it is the same grid on new stems.

---

## 3. The proposed model: three learner-visible layers plus a closed synthetic track

Reframe what the app says it teaches — to itself (data/progress model) and
to the learner (journey, cards, progress screens) — as:

| Layer | Content | Size | Nature |
|---|---|---|---|
| **A. The auxiliary matrix** | 4 families (NOR, NOR-NORI, NOR-NORK, NOR-NORI-NORK) × tense/mood × agreement cells; izan/*edun for indicative, *edin/*ezan for the moods | finite, ~a few hundred cells on the taught horizon | **the** learning target; closed but generative |
| **B. The aspect system** | 3 participles (`-t(z)en`, `-tu/-i/-n`, `-ko/-go`) and the participle × aux-tense grid; `-ten/-tzen` and `-ko/-go` allomorphy | tiny | rules, teachable explicitly |
| **C. The carrier lexicon** | concrete verbs as *vocabulary with grammar-selecting features*: meaning, participle class, argument frame (incl. dative government, izan/ukan selection), animacy | open-ended | never a learning target per se; carriers, minimal pairs, frame-selection items |
| **D. Synthetic track** | the ~15 aditz trinkoak, each its own paradigm | closed, memorized | parallel strand; izan/ukan double as Layer A |

Everything below is a consequence of making these four layers the unit of
teaching, progress, and display.

### 3.1 Progress and mastery re-keyed to the auxiliary cell (fixes R1)

Keep raw error stats as they are (`verbId:tense:person` — the per-verb grain
is still useful for Layer C/D), but **derive and display aggregation by
auxiliary cell**. The mapping already exists in code: every composed form
resolves to a skeleton cell (`getComposedTable`), so
`ikusi:present:zuek` and `hartu:present:zuek` both roll up to
`edun:present:nork=zuek·nor=hura` = `duzue`. Concretely:

- a **paradigm mastery grid** on the progress tab — the learner sees the
  izan/edun/NOR-NORI/ditransitive grids filling in cell by cell, aggregated
  across every carrier they've practised (this is also the single strongest
  motivational artifact the app could add: the grid *is* the curriculum,
  visibly conquered);
- **weak-spot selection by aux cell across verbs** (`getWeakSpotQuestions`
  currently boosts the exact `verbId:tense:person` missed; boosting the
  *cell* lets the review present the same weakness on a different carrier —
  which tests the rule, not the memory of the failed item);
- stars/attempts stay per lesson (the unlock spine doesn't change), but the
  headline metric the learner sees shifts from "lessons done" to "cells
  owned."

### 3.2 A question kind whose answer *is* the auxiliary choice (fixes R3)

Add a **family-selection kind**: sentence with only the auxiliary blanked,
options drawn from *different families in the same tense/person*:

> `Nik ogia erosi ___.` → **dut** / naiz / zait / diot
> `Ander etxera joan ___.` → **da** / du / zaio / dio
> `Amak umeari ipuina irakurri ___.` → **dio** / du / da / zaio

This is the `getAuxiliarySwapLure` idea promoted from a lure inside a
cell-question to the *point* of the question, extended beyond izan/ukan to
the dative families. The sentence data needed (case-marked NPs that betray
the frame) already exists in `sentences`; the `validFor`/frame audit
infrastructure (`SENTENCE_FRAMES.md`, `validfor-audit.test.js`) is exactly
the safety net this kind needs. A recurring **"da or du?"** drill line
should run the length of the spine the way negation and case-marking
checkpoints already do — auxiliary selection is the essere/avere of Basque,
except harder (ergativity), and one Unit-3 checkpoint is not enough
exposure.

### 3.3 Teach the aspect grid explicitly, once (fixes R4)

One early unit (naturally at Unit 11, where the participle first appears)
gets a preview/lesson that shows the whole 3 × 2 indicative grid on a single
carrier —

|  | present aux | past aux |
|---|---|---|
| `hartzen` | hartzen dut *(habitual present)* | hartzen nuen *(used to)* |
| `hartu` | hartu dut *(just happened)* | hartu nuen *(simple past)* |
| `hartuko` | hartuko dut *(future)* | hartuko nuen *(would have)* |

— and a **participle-selection kind** (generalizing #423's `suffixChoice`):
fixed auxiliary, pick `hartzen`/`hartu`/`hartuko` from context
(`Bihar trena ___ dut` / `Atzo trena ___ nuen` / `Egunero trena ___ dut`).
This also gives `-ten/-tzen` (Unit 13's `jaten/hartzen` minimal pair) a
production home instead of living only in distractors.

### 3.4 Held-out generalization checks at gates (fixes R5)

Reserve a handful of `VERBS` fodder entries (or add trivially cheap ones —
they need only `meaning`, prefixes, and a couple of sentence frames) as
**never-taught test carriers**. Refresh Gates B/C additionally present:
"Here is a verb you've never seen: `aipatu`, 'to mention', transitive.
Complete: `Zuk hori atzo ___ ___.`" Passing proves Layer A+B transferred;
failing routes the learner to the paradigm's review, not to an `aipatu`
lesson (there is none — that's the point). This converts the user's thesis
into a measurable claim the app checks.

### 3.5 Journey reframing (fixes R2, R6) — rename, don't reorder

The *sequence* of the current 34-unit spine is sound (it was rebuilt around
exactly the right axes: ergative leap → periphrastic pattern → plural axes →
perfect/past → dative → ditransitive → moods). What changes is each unit's
**identity**:

- Titles lead with the pattern, verbs demoted to examples: Unit 5
  "ikusi — First Periphrastic Verb" → "**The `-tzen dut` pattern** (with
  ikusi)"; Unit 14 → "**zait — the NOR-NORI present** (gustatu: 'I like
  it')"; Units 18–19 stay verb-titled (eduki is synthetic — Layer D).
- Unit/lesson copy states the transfer explicitly: every periphrastic
  lesson's preview shows *participle + the auxiliary table the learner
  already owns*, visually reusing the same grid component as the auxiliary
  lessons — the learner should *see* that nothing new is being memorized.
- The mood units (32–35) add one line of framing: "same grid, new stems —
  Basque runs the whole system again on *edin/*ezan for can/if/let."
- Layer D becomes a visibly separate strand in the roadmap UI ("Aditz
  trinkoak" badge or lane), so the learner understands *why* egon/eduki/
  eraman get per-verb tables when hartu never did.
- Audit the residual single-verb periphrastic lessons against rule #309 and
  pool the ones the carve-out doesn't cover (e.g. the six single-verb
  `gustatu/iruditu/ahaztu` past+future lessons in Unit 26 duplicate one
  NOR-NORI aux table six times over; `ikusi-present-plural` post-dates the
  pattern's introduction). This is a continuation of #331/#469's collapses.

### 3.6 Worked example — what happens to the `zuek → edan zenituzten` card

The clearest live symptom of R1/R3/R4 combined is the engine's bare
`kind: 'form'` question (the "¿Qué forma es correcta?" card whose only cue
is a pronoun). It is the *fallback* kind, generated exactly where a
verb × tense has no `sentences` data — e.g. `edan`'s `pastPlural` today —
and it fails the model on every axis at once:

- **Framing:** the header reads "EDAN — BEBER · PASADO (PLURAL)", claiming
  the learner is practising *edan*. The participle is inert; the entire
  answer is `edun`'s past plural-object cell for NORK=`zuek`
  (`zenituzten`) — knowledge that is 100% auxiliary and 0% edan.
- **Cue:** with no sentence, tense and object-number are not inferable from
  any Basque input — only from the lesson's own metadata in the header. The
  learner is reading course labels, not the language. "When" is unpracticed
  by construction.
- **Distractors:** ungrounded bare-form questions may only draw from the
  same table (see `generateQuestions`' `default` branch — `formLures` are
  deliberately ignored without a sentence to keep options legible), so the
  options (`genituen`/`zenituzten`/`zituzten`) test *only* the
  person-suffix mapping. The discriminations that actually matter here —
  `zenuten` vs `zenituzten` (object number), `zineten` (wrong family) —
  are structurally excluded.

Under this proposal the card transforms in three steps, one per increment:

1. *(Reframe)* the header leads with the paradigm — "NOR-NORK · iragana ·
   objektu plurala (`zenituzten`)" — with `edan` demoted to the example
   slot, and the credit for a right answer accrues to the aux cell
   `edun:pastPlural:zuek`, whatever the carrier.
2. *(Data)* the bare fallback is treated as a **sentence-coverage bug on
   spine lessons**, and the coverage unit becomes the *paradigm cell*, not
   verb × tense × person: one frame like `Zuek ardo guztiak atzo ___ ___.`
   grounds tense (*atzo*) and object number (*ardo guztiak*) in the
   sentence itself, and — because periphrastic forms are composed — the
   same frame skeleton serves any carrier the pool rotates in (the
   `validFor` machinery already audits exactly this kind of sharing).
3. *(New kinds)* grounded by a sentence, the question can finally ask the
   real discriminations: object-number (`zenuten` lure), family selection
   (`zineten`), or participle selection (`edaten/edan/edango ___`) —
   instead of person-mapping inside a pre-announced table.

Bare-form cell drills don't vanish entirely — as fast fluency reps inside a
lesson's early ramp they have a place — but they should be visually framed
as *auxiliary* drills (participle greyed out, aux highlighted, "works with
any verb: edan/ikusi/erosi…") and never be the kind a spine lesson settles
into because sentence data ran out.

### 3.7 What deliberately does *not* change

- **Concrete verbs stay in the data and in the pools** — as carriers,
  minimal-pair material, frame-selection items, sentence content, and the
  held-out test set. Removing them would *reduce* auxiliary learning (§1.2c).
- **Synthetic per-verb lessons stay** (Layer D is genuinely lexical).
- **Sentence-first exercises stay primary.** An auxiliary-first model does
  not mean bare-table drilling — the auxiliary is only learnable as "when +
  how" if it keeps being selected *in sentences*. The reform is in what the
  model tracks, what the titles claim, and which dimension the learner is
  asked to decide — not a retreat from communicative material to tables.
- **The unlock spine and stored-progress shape stay** (no `STORAGE_KEY`
  bump needed by any of §3.1–3.5; aggregates are derived).

---

## 4. Suggested increments (each independently shippable)

1. **Reframe** — journey/unit titles + i18n copy + `describeLesson` leading
   with the paradigm; "same table you already know" preview reuse. Pure
   copy/UI; zero data-model risk.
2. **Aggregate** — derive aux-cell mastery from existing stats via the
   composed-prefix mapping; paradigm mastery grid on the progress tab;
   weak-spot boosting by cell across carriers.
3. **New question kinds** — family-selection ("da or du?" and the dative
   extensions) and participle-selection; wire a recurring selection drill
   line through the spine's review lessons. Includes retiring the bare
   `kind: 'form'` fallback on spine lessons per §3.6: audit which
   verb × tense slices actually degrade to it (no `sentences` data), and
   close the gap with paradigm-cell-level sentence frames shared across
   carriers rather than per-verb frames.
4. **Generalization gates** — held-out carriers at Gates B/C.
5. **Lesson diet** — the §3.5 pooling audit of residual single-verb
   periphrastic lessons.

Increments 1–2 alone resolve the substance of the critique (the learner's
mental model and the app's mastery model both become auxiliary-first);
3–4 are where the "when to use it" skill gains a first-class home.
