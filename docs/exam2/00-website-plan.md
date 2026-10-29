# Exam 2 — Website plan (Exam 1 / Exam 2 split)

**Status:** planning only. **No code until the student attaches the last zip** (see `README.md` → "Waiting on").
Goal (student's words): *split the website into 2 sections where you can say which exam you want to study for; then everything is changed to be Exam 2 questions and learning; the learning modules use exactly the same learning techniques as Exam 1.*

---

## 1. What stays exactly the same (the Exam-1 method)
Every Exam-1 technique is reused unchanged and filled with Exam-2 content:

| Exam-1 technique | Where | Exam-2 version |
|---|---|---|
| Retrieval first (answer hidden until you try) | all modes | same |
| Compressed **Leitner boxes** (box 1 every round, 2 every 2nd, 3 every 4th, 4 = mastered) | Flashcards | same, Exam-2 decks |
| Both directions (term → guide text, guide text → term), **type-the-answer**, **fact → who?** cards, **< 5 s recall timer** | Flashcards | same |
| **Story clusters** + 3-question check | Stories | 10 Exam-2 clusters (`06-story-clusters.md`) |
| **Interleaving** (mixed quizzes after first pass) | Quiz, Mock | same |
| **Dual coding** (image on god/hero cards, map on place cards) | Flashcards | 13 new images, 10 places |
| **Picture Quiz** — Name it · Which clue? · Label the object (pins) · Reverse · Zoom challenge · Study gallery; 100% twice in a row | Pictures | 13 Exam-2 images (`04-images.md`) |
| **Map Test** — What is marked (★/◯)? · Click to locate · Place ↔ meaning · Explore | Map | 10 places + Attica inset (`05-maps.md`) |
| **Pace bar** 40 s (amber 30 s, red 40 s); learning vs. test mode | Quiz | same |
| **Mock exam** 75 Q / 50:00, flags, navigator, auto-submit, history, by-topic score | Mock | Exam-2 pool + weights (§5) |
| **Fix-My-Mistakes** error log + drill (cleared after 2 correct in a row) | Mistakes | separate log per exam |
| **Review-lecture questions** page | Review Qs | in-class Qs + Oct 27 review (`03-lecture-questions-answer-key.md`) |
| **Lecture Notes** page per lecture with in-class Qs, quick check, "Check this" | Lectures | 6 decks + 2 Powell-only pages + review (§4) |
| **Family tree** + "which name is missing?" quiz | Family Tree | Exam-2 trees (§4) |
| **Match games** (timed) | Match | Exam-2 sets (§4) |
| **Cheat sheet / "Final 10"** printable | Cheat Sheet | Exam-2 Final 10 |
| **Resources** + **Powell-index lookup drill** | Resources | Exam-2 names (index is in the exam as a PDF) |
| Home: countdown, "CBTF booked?", readiness %, next best action, study protocol, sleep reminder | Home | Exam-2 dates & protocol (§6) |
| Mnemonics, Heads-up boxes (where sources disagree / guide typos) | cards | Exam-2 list (`01-study-guide-checklist.md`) |

The one emphasis change comes from the professor, not from us: *"Most test questions are based on [course reading questions]"* → the CRQ become their own flashcard deck and quiz topic (same Leitner + quiz techniques, not a new kind of mode).

## 2. The split: choosing an exam
- **Exam picker** at `#/` (first visit) — two big cards:
  - **Exam 1** · Powell 1–9 · Sept 24–27 · "done — review for the final"
  - **Exam 2** · Powell 10–14, 16–18 · Oct 29 – Nov 1 · countdown
- **Switcher in the top bar** (pill: `Exam 1 | Exam 2`) on every page; brand reads "CLCV 115 · Exam 2".
- Routes get an exam prefix: `#/e1/flash`, `#/e2/flash`, … Old Exam-1 links (`#/flash`) redirect to `#/e1/flash` so nothing breaks. The last exam chosen is remembered.
- **Progress is kept separate**: Exam 1 keeps its existing key `clcv115_v1` (nobody loses progress); Exam 2 uses `clcv115_e2_v1`. Export/Import/Reset act on the current exam (with a note saying which).
- Nav items are the same for both exams (same muscle memory); a page that has no content for an exam is hidden.
- Later (final exam, Dec 11): an "Exam 3 / Final" card could reuse the same switcher — design for N exams, not 2.

## 3. Architecture (minimal change to the working Exam-1 code)
Current: `index.html` loads `data/*.js` (sets `window.DATA_*`), `app.js` builds indexes **once at load**, and several modes compute exam-specific constants at load (`quiz.js` `studyTerms`/TAGS, `flash.js` cluster names, `match.js` SETS, `tree.js` TREE, `pages.js` PROTOCOL/EXAM_END, `mock.js` mix).

Plan (lowest-risk):
1. Move Exam-1 data into an "exam pack": keep files where they are but register them as `window.EXAMS.e1 = { terms, stories, images, places, questions, lectures, config }`.
2. New pack `data/exam2/*.js` → `window.EXAMS.e2 = {...}` with the same schemas (+ `config`: title, dates, countdown target, protocol, tag list/labels, cluster→tag map, match sets, trees, Final-10, mock weights, image folder `assets/exam2/exam-images/`).
3. `app.js` picks the pack from the hash prefix **at boot**; switching exam = set hash + `location.reload()` (keeps every mode's load-time code working untouched). Pull the hard-coded constants listed above out of the modes into `config`.
4. `App.imgSrc` uses the pack's image folder. Map module gets a third map (`attica`).
5. `tools/build_data.py` stays for Exam 1; Exam-2 data is hand-written JS generated from these docs (or a `tools/build_exam2.py` if it saves time).
6. `?selftest` runs for both packs (every question has 4 options, a valid answer index, no duplicate options, images/places exist).

## 4. Exam-2 content per page
- **Stories (`#/e2/learn`):** 10 clusters — e2c1 Demeter & Eleusis · e2c2 Dying gods & mourning goddesses · e2c3 Dionysus · e2c4 Death & Underworld · e2c5 Gilgamesh & the hero · e2c6 Perseus & Argive plain · e2c7 Thebes · e2c8 Athens & Theseus · e2c9 Crete · e2c10 Story patterns. Each with a 3-question check.
- **Lectures (`#/e2/lectures`):** Sept 29 (Powell 10) · Oct 1 (Powell 11, **no deck — from Powell**) · Oct 6 (Powell 12) · Oct 8 (Powell 13, **no deck — from Powell**) · Oct 13 (Powell 14) · Oct 15 (Powell 18) · Oct 20 (Powell 16) · Oct 22 (Powell 17) · Oct 27 review. Each: condensed slide content, in-class Qs (+answers), quick check, film/music clips listed but marked "not tested".
- **Flashcards:** decks Divinities (38) · Mortals (47) · Concepts (37) · Places (10) · Sources (6) · Images (13) · **Reading Questions** (~184 prompts, self-graded recall) · Lecture extras. Same Leitner/type-answer/fact cards.
- **Pictures:** 13 images. Best "Label the object" candidates: Underworld vase (torch, eagle sceptre, lyre, boulder, Cerberus, club/lion skin, caduceus) and Labors of Theseus (Minotaur, Cercyon, Procrustes, Sciron, bull, Sinis, sow).
- **Map:** 10 places; review-style "which letter is Athens?" items; Attica/Argolid inset for Athens–Eleusis–Thebes–Corinth–Argive plain.
- **Quiz topics (tags):** `review`, `inclass`, `crq`, `demeter`, `dying-gods`, `dionysus`, `underworld`, `gilgamesh-hero`, `perseus-argos`, `thebes`, `athens-theseus`, `crete`, `patterns`, `sources`, `concepts`, `images`, `maps`, `lecture`.
- **Family trees:** (1) **House of Cadmus**: Agenor → Cadmus & Europa; Cadmus = Harmonia → Semele (→ Dionysus), Ino (= Athamas), Agave (= Echion → Pentheus), Autonoë (→ Actaeon), Polydorus → Labdacus → Laius = Jocasta → Oedipus (= Jocasta) → Eteocles, Polynices, Antigone, Ismene; Creon; (2) **Argive line**: Inachus → Io → … Danaus/Aegyptus … Acrisius → Danaë + Zeus → Perseus = Andromeda (Cepheus = Cassiopea); (3) **Athens**: Cecrops (daughters Aglauros, Herse, Pandrosos); Hephaestus/Gaea → Erichthonius → Pandion → Procne (= Tereus → Itys), Philomela, Erechtheus → Procris (= Cephalus); Herse + Hermes → Cephalus; Aegeus/Poseidon + Aethra → Theseus = Ariadne / Hippolyta (→ Hippolytus) / Phaedra; (4) **Crete / Sun**: Helios = Perseis → Pasiphaë (= Minos → Ariadne, Phaedra, Androgeus, Minotaur), Aeëtes (→ Medea = Jason), Circe; Zeus + Europa → Minos, Sarpedon, Rhadamanthys; (5) **Odysseus**: Autolycus → Anticlea = Laertes → Odysseus = Penelope; (6) Agamemnon = Clytemnestra → Orestes, Electra; (7) Adrastus → 2 daughters = Polynices, Tydeus; Eriphyle = Amphiaraus. Exact lines from CRQ "draw a family tree" prompts (W6 Thu 6, W8 Thu 12 & 22, W9 Tue 7 & 11).
- **Match sets:** Why they went to the Underworld (review B14) · Sinner ↔ punishment · Theseus' villain ↔ what he did · Pattern ↔ example (e2c10 table) · Goddess ↔ dying partner (Isis–Osiris, Inanna–Dumuzi, Aphrodite–Adonis, Cybele–Attis, Demeter–Persephone) · Odysseus 11 ↔ Aeneid 6 counterparts (Elpenor–Palinurus, Ajax–Dido, Agamemnon–Deiphobus, Anticlea–Anchises) · Source text ↔ story (*Bacchae*–Pentheus, *Odyssey*–Book 11, *Homeric Hymns*–Demeter/pirates, Ovid *Met.*–Cadmus/Andromeda/Procne/Icarus, *OT*–Oedipus, *Aeneid*–Book 6) · Mother ↔ child (Danaë–Perseus, Semele–Dionysus, Agave–Pentheus, Aethra–Theseus, Jocasta–Oedipus, Procne–Itys, Pasiphaë–Minotaur, Isis–Horus).
- **Review Qs (`#/e2/review`):** 26 in-class + 41 review items; "? check" items appear in learning mode only.
- **Cheat sheet "Final 10" (draft):** 1. CRQs are the exam. 2. Wrath = offense → anger → destruction → appeasement → ritual (Demeter). 3. Theoxeny = disguised god tests (pirates, Eleusis). 4. Girl's tragedy = Danaë/Io/Antiope. 5. Potiphar's wife = Joseph, Bellerophon, Peleus, Hippolytus. 6. Katabasis: who & why (Odysseus→Tiresias, Orpheus→Eurydice, Theseus→Persephone for Pirithous, Aeneas→father/Rome). 7. Doomed weddings: Peleus–Thetis (apple), Cadmus–Harmonia (necklace), Pirithous (centaurs). 8. Heroes are *worshipped* at tombs (hero cult, c. 800 BCE), not deified. 9. Thebes = House of Cadmus; Corinth = Polybus & Merope; Argive plain = Mycenae, Argos, Inachus; Eleusis = Demeter. 10. Sleep 8 hours.

## 5. Question bank & mock mix
Sources, in order of exam weight (professor: CRQ > lecture slides; everything on the checklist):
1. **CRQ-based MC** (target ~180): at least one MC per CRQ prompt (some prompts give 2–3). Tag `crq` + topic.
2. **In-class + review** (~60): `03-lecture-questions-answer-key.md`, ✔/● items only in the mock.
3. **Lecture-slide MC** (~80): facts printed on slides (Mysteries day-by-day, Odyssey 11 meetings, labors, Minoan facts…).
4. **Images** (13 × 5 formats, auto-generated like Exam 1) and **maps** (auto-generated).
5. **Auto-generated** term ↔ guide-text MC (same generator as Exam 1, `§7.4`), distractors from the same cluster first.

Mock (75 Q / 50:00): ~45% CRQ, ~15% in-class/review, ~15% lecture slides, ~15% images, ~5% maps, ~5% auto term items; balanced round-robin across the 10 clusters (Exam-1 `balanced()` helper). Emphasis weeks 6–9.

Quality rules (from Exam 1): guide wording is the answer text; no "all of the above"; distractors are real names from the same cluster; explanation (`why`) on every item; never use the guide typo (Persephone "daughter of Persephone") as a correct answer; film/TV poll questions are not tested.

## 6. Home page for Exam 2
- Countdown to **Sun Nov 1, 2026, 11:59 PM CT** — note: DST ends that morning, so CT = **CST (UTC−6)** → `Date.UTC(2026, 10, 2, 5, 59)`.
- "Did you book your CBTF slot?" + link `https://cbtf.illinois.edu/students` (PrairieTest). Bring i-card. 4 labs: Grainger Library 057, DCL L520, Siebel 0403, Chemistry Annex 2nd floor.
- Readiness % and next best action (same logic as Exam 1).
- **Study protocol (exam window is already open → short version first):**

| Block | Time | Mode |
|---|---|---|
| 1 | 30 min | Stories — the 10 clusters (skim e2c10 patterns twice) |
| 2 | 45 min | Flashcards: **Reading Questions** deck until box ≥ 2 |
| 3 | 45 min | Flashcards: Divinities + Mortals |
| 4 | 20 min | Flashcards: Concepts + Sources |
| 5 | 20 min | Picture Quiz until 100% twice |
| 6 | 10 min | Map Test until 100% twice |
| 7 | 15 min | Review Qs (in-class + Oct 27) |
| — | break | sleep if possible |
| 8 | 50 min | Mock #1 → Fix-My-Mistakes |
| 9 | 50 min | Mock #2 (new draw), target ≥ 95% |
| 10 | 10 min | Final 10 before walking to the CBTF |

- The 10 exam tips from the review lecture (`03-lecture-questions-answer-key.md`, bottom).

## 7. Build order (so something useful exists fast — the exam window opened Oct 29)
1. Exam switcher + separate state + data-pack loading (Exam 1 must still work identically; run Exam-1 `?selftest`).
2. Exam-2 terms (138) + 10 stories → Flashcards & Stories work.
3. Review/in-class Qs + CRQ-based questions → Quiz, Review, Mock work.
4. Images (13) with hotspots → Picture Quiz.
5. Places + Attica map → Map Test.
6. Lectures pages, family trees, match sets, cheat sheet, resources/index drill.
7. Self-test for both packs, phone-width check (375 px), README update, commit & push.

## 8. Acceptance checklist (before handing over)
- [ ] Exam 1 unchanged: same routes (via redirect), same progress, `?selftest` passes.
- [ ] Every one of the 138 checklist terms has a flashcard with the guide wording.
- [ ] Every CRQ prompt has a recall card and ≥ 1 MC question.
- [ ] Every in-class/review question is on the Review page.
- [ ] All 13 images in all 5 picture formats; alt text never leaks the answer.
- [ ] All 10 places in all 4 map formats; Athens vs. Eleusis distinguishable.
- [ ] Mock = 75 Q / 50:00, mix per §5, history saved per exam.
- [ ] Heads-ups shown for the guide typos and "? check" items.
- [ ] Works from `file://`, offline, at 375 px, light + dark.
