# CLCV 115 Exam 1 — Interactive Study Website: Design & Content Spec

> **For Claude Code (the builder):** This file is the *complete* spec. It contains (1) the study method the site must enforce, (2) the architecture and every feature, (3) **all of the content** — every term, story, image, map location, and a 170-question bank — so you do **not** need to invent facts. Build exactly from the data here. Where this document and the course study guide disagree, **the study guide wins** (it is what the exam is written from).
>
> **For the student:** Build it, then follow the *Study Protocol* in §2. No website can guarantee 100%, but this covers every item on the official checklist plus every review-lecture question, drilled the way the exam tests it (fast, multiple choice, images, maps).

---

## 0. Exam facts the whole site is built around

| Fact | Consequence for the site |
|---|---|
| **Exam window: Thu Sept 24 – Sun Sept 27, 2026, at the CBTF** (register on PrairieTest; bring i-card) | Home page shows a countdown to **Sun Sept 27 11:59 PM CT** and a big "Did you book your CBTF slot?" checkbox. |
| **75 multiple-choice (a–d) questions in 50 minutes** ≈ **40 seconds per question** | Every quiz mode has a pace timer. "Mock Exam" mode = exactly 75 Q / 50 min. Flashcards target < 5 s recall. |
| Content: **Weeks 1–5, Powell *Classical Myth* (9th ed.) ch. 1–9 + lectures** | Content is organized by the study guide's 5 categories + images + maps + source texts. |
| **Help file during exam = Powell's index** | Include an "Index-lookup drill": practice finding a name fast. Teach: never rely on it for more than ~3 questions. |
| Only the **14 images on the study guide** are tested (iconography only; NOT date/painter/medium) | Picture Quiz uses exactly those images; drills *who / doing what / identifying objects / which story*. |
| **Maps**: Athens, Cyprus, Delos, Delphi, Greece, Mesopotamia, Mt. Olympus | Map Test mode with "click the location" AND "what is marked here? (a–d)" formats (the review lecture used the second format with a star/circle). |
| Review lecture questions labeled "Sept 10 Q1/Q3" = **Canvas in-class quiz questions are recycled** | Site includes all 40 review-lecture questions verbatim-style, tagged `review`, and a reminder to also retake every Canvas quiz. |

**Academic integrity note (display once in the footer):** This site is for studying *before* the exam. Do not open it (or anything else) during a CBTF exam.

---

## 1. Assets: images and where to get them

### 1.1 Primary source — the student's own files (use these first)
The student has two course files; the exact exam images are embedded in the study-guide PDF. They have **already been extracted and renamed** into a folder that accompanies this spec:

```
clcv115-assets/
  exam-images/            # the 14 tested images (Typhoeus has 3 views)
  slide-images/           # extra images from the Sept 24 review slides (maps, etc.)
```

If the folder is missing, regenerate it from the originals:

```bash
# Requires poppler-utils (pdfimages) and python-pptx + Pillow
pdfimages -j -p First_Exam_Terms_Images-1.pdf g          # study-guide images → g-PPP-NNN.jpg
# mapping (page-index → final name):
# g-004-000 → 01-niobids.jpg            g-004-001 → 02-tiamat-marduk.jpg
# g-005-002 → 03a-zeus-typhoeus.jpg     g-005-003 → 03b-typhoeus-detail.jpg
# g-005-004 → 03c-zeus-detail.jpg       g-005-005 → 04-atlas-prometheus.jpg
# g-005-006 → 05-prometheus-creates-humans.jpg
# g-006-007 → 06-birth-of-pandora.jpg   g-006-008 → 07-wedding-hera-zeus.jpg
# g-006-010 → 08-apollo-kylix.jpg       g-007-011 → 09-hermes-lekythos.jpg
# g-007-012.ppm → 10-apollo-baby-hermes.jpg (convert with Pillow)
# g-007-013 → 11-pan-mosaic.jpg         g-008-014 → 12-hephaestus-thetis.jpg
# g-008-015 → 13-aphrodite-rising.jpg   g-008-017 → 14-birth-of-athena.jpg
# g-008-019 → 15-athena-panathenaic.jpg
# (ignore the .ppm files on pages 6 and 8 that are 1-channel soft masks)

python3 - <<'EOF'
from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE
p = Presentation("Sept24_Optional_Review_Slides_With_Answers.pptx")
for i, s in enumerate(p.slides, 1):
    for n, sh in enumerate([x for x in s.shapes if x.shape_type == MSO_SHAPE_TYPE.PICTURE], 1):
        open(f"s{i:02d}_{n}.{sh.image.ext}", "wb").write(sh.image.blob)
EOF
# useful slide images: s02_1 (blank Greece map), s19_1 (blank Aegean map), s20_1 (labeled Aegean map),
# s10_1 (Deucalion→Hellen family tree), s25_1 (Helios chariot), s31_2 (Athena & Poseidon vase),
# s46_2 (Pan chasing shepherd), s18_1 (temple on Delos), s11_2 (Gilgamesh flood)
```

### 1.2 Backup web links (Wikimedia Commons, verified to exist)
Use as fallbacks if a local file is missing. For a **direct image URL**, convert the file page to `https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>?width=800`. Always show an attribution line ("Image: Wikimedia Commons") under web images. Some Commons photos are *different photos of the same object* — that's fine for learning iconography.

| # | Image (study guide) | Commons page (backup) |
|---|---|---|
| 01 | Artemis & Apollo kill Niobe's children (Niobid krater) | https://commons.wikimedia.org/wiki/File:Niobid_Krater_-_Niobid_massacre.jpg · category: https://commons.wikimedia.org/wiki/Category:Niobid_crater_(Louvre,_G_341) |
| 02 | Tiamat (snake) destroyed by Marduk (cylinder seal) | https://commons.wikimedia.org/wiki/File:Tiamat.JPG (Neo-Assyrian seal: storm god vs. serpent-dragon) |
| 03 | Zeus hurls thunderbolt at Typhoeus | https://commons.wikimedia.org/wiki/File:Zeus_Typhon_Staatliche_Antikensammlungen_596.jpg · https://commons.wikimedia.org/wiki/File:Typhon_Staatliche_Antikensammlungen_596.jpg |
| 04 | Atlas holds the sky; eagle eats chained Prometheus' liver | https://commons.wikimedia.org/wiki/Category:Prometheus_and_Atlas_(Arkesilas_Painter) |
| 05 | Athena + seated Prometheus creating humans from mud (relief) | https://commons.wikimedia.org/wiki/File:Sarcophagus_Prometheus_Louvre_Ma339.jpg · https://commons.wikimedia.org/wiki/File:Creation_Prometheus_Louvre_Ma445.jpg |
| 06 | Birth of Pandora (Zeus, Hermes, Epimetheus, Pandora) | Use local file (Ashmolean vase). Related: https://commons.wikimedia.org/wiki/File:Niobid_Painter_ARV_601_23_creation_of_Pandora_-_chorus_of_women_-_Pans_-_satyrs_and_maenad_(05).jpg |
| 07 | Wedding of Hera & Zeus (Selinus metope) | https://commons.wikimedia.org/wiki/Category:Zeus_and_Hera_(Temple_E_in_Selinunte) |
| 08 | Apollo with raven, lyre, laurel, pouring libation (Delphi kylix) | https://commons.wikimedia.org/wiki/Category:Apollo_black_bird_AM_Delphi_8140 · https://commons.wikimedia.org/wiki/File:Kylix_with_Apollo,_AM_of_Delphi_8140,_201391y.jpg |
| 09 | Hermes: petasos, caduceus, winged sandals (lekythos) | https://commons.wikimedia.org/wiki/Category:Hermes_in_ancient_Greek_pottery |
| 10 | Apollo and baby Hermes in cradle, stolen cow | Use local file. Browse: https://commons.wikimedia.org/wiki/Category:Hermes_in_ancient_Greek_pottery |
| 11 | Pan (horns, hooves, goat legs, tail) — Roman mosaic | Use local file. |
| 12 | Hephaestus (seated, clothed, hammer) hands armor to Thetis | https://commons.wikimedia.org/wiki/File:Hephaistos_Thetis_at_Kylix_by_the_Foundry_Painter_Antikensammlung_Berlin_F2294.jpg |
| 13 | Aphrodite rising from the sea (Pompeii fresco) | https://commons.wikimedia.org/wiki/File:Wall_painting_-_birth_of_Venus_from_a_shell_-_Pompeii_(VII_6_7)_-_Napoli_MAN.jpg · https://commons.wikimedia.org/wiki/Category:House_of_Venus_in_Shell |
| 14 | Birth of Athena from Zeus' head (Hephaestus helps) | https://commons.wikimedia.org/wiki/File:Amphora_birth_Athena_Louvre_F32.jpg · https://commons.wikimedia.org/wiki/File:Black-figure_amphora_Birth_of_Athena_(Boston_MFA_00.330)_01.jpg |
| 15 | Athena: helmet, spear, aegis, shield (Panathenaic amphora) | https://commons.wikimedia.org/wiki/Category:Athena_in_ancient_Greek_pottery |

Extra practice images (for "transfer" drills — same iconography, different artwork): https://commons.wikimedia.org/wiki/Category:Hephaestus_in_ancient_Greek_pottery , https://commons.wikimedia.org/wiki/Category:Apollo_in_ancient_Greek_pottery , https://commons.wikimedia.org/wiki/Category:Athena_in_ancient_Greek_pottery , https://commons.wikimedia.org/wiki/Category:Aphrodite_in_a_shell .

> Note: the CBTF sandbox may block network access during the build. The local `clcv115-assets` folder is the source of truth; web links are optional enrichment.

---

## 2. Study method the site enforces (evidence-based)

The site is not a textbook — it is a **retrieval-practice machine**. Every screen makes the student *produce* an answer before seeing it.

1. **Retrieval practice (testing effect).** Flashcards and quizzes always hide the answer first. Self-testing beats rereading by a wide margin.
2. **Spaced repetition (Leitner boxes, compressed for a 1–2 day window).** Box 1 = review every session round; box 2 = every 2nd round; box 3 = every 4th; box 4 = "mastered" (re-shown once before the mock exam). A miss sends the card back to box 1.
3. **Interleaving.** After the first pass through a topic, quizzes mix topics (gods + images + maps + concepts) — the real exam is mixed.
4. **Elaboration / clusters.** Terms are taught in story clusters (§4.2), not alphabetically, with a "why" line on each card (e.g., "Pan → *panic* because he frightened rural travelers").
5. **Dual coding.** Every god card shows the image + attribute icons; every place card shows the map.
6. **Exam-pace simulation.** Mock exam = 75 Q / 50 min; per-question pace bar turns amber at 30 s, red at 40 s.
7. **Error log.** Every miss is logged; the "Fix My Mistakes" deck is built from misses only.
8. **Mnemonics** where helpful (§4.8).
9. **Sleep.** Home page reminder: "Your professor's last slide: *get eight hours of sleep*." Memory consolidation happens during sleep.

### 2.1 Study protocol shown on the home page (1–2 day plan)

| Block | Time | Mode |
|---|---|---|
| 1 | 30 min | **Story Mode** — read the 9 cluster stories (§4.2). Optional: watch Crash Course World Mythology creation episodes (§8). |
| 2 | 60 min | **Flashcards: Divinities** (Leitner) until every card is box ≥ 2. |
| 3 | 30 min | **Flashcards: Mortals + Concepts** |
| 4 | 30 min | **Picture Quiz** (all 3 formats) until 100% twice in a row. |
| 5 | 15 min | **Map Test** until 100% twice in a row. |
| 6 | 15 min | **Review-Lecture Questions** (the 40 slide questions). |
| — | break | Sleep if possible (spacing!). |
| 7 | 50 min | **Mock Exam #1** (75 Q / 50 min) → then Fix-My-Mistakes deck. |
| 8 | 50 min | **Mock Exam #2** (different random draw). Target ≥ 95% before going to the CBTF. |
| 9 | 10 min | "Final 10" sheet (§4.9) right before walking to the CBTF. |

Also: retake every **Canvas quiz** from weeks 1–5 (the site links a checklist).

---

## 3. Architecture

- **Single-page static site**: `index.html` + `app.js` + `styles.css` + `data/*.js` + `assets/` (copied from `clcv115-assets/`). No build step, no framework required (vanilla JS). Must open by double-clicking `index.html` **and** work when hosted.
  - Data files are plain JS (`window.DATA_TERMS = [...]`) — not JSON via fetch — so `file://` works.
- **Libraries (CDN, optional):** Leaflet 1.9 for the map (`https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js` + `.css`). If offline, fall back to the static blank map image with pre-set hotspot coordinates (§6.5).
- **State:** `localStorage` key `clcv115_v1` storing `{cards:{id:{box,seen,correct,wrong,last}}, errors:[qid...], mocks:[{date,score,time,byTag}], settings}`. Wrap every read/write in `try/catch`; the site must work (without persistence) if storage is unavailable. Provide **Export/Import progress** buttons (JSON download/upload) and **Reset**.
- **Routing:** hash routes: `#/home`, `#/learn`, `#/flash`, `#/pictures`, `#/map`, `#/quiz`, `#/mock`, `#/review`, `#/errors`, `#/tree`, `#/match`, `#/cheatsheet`.
- **Responsive:** works at 375 px phone width (student may study on the way to the CBTF). Large tap targets (≥ 44 px).
- **Theme:** light + dark (`prefers-color-scheme`), "Greek vase" palette: terracotta `#C8643B`, black `#1d1a17`, cream `#F4EAD5`, accent olive `#6B7A3A`. Font: Google Fonts "Cinzel" for headings, system sans for body.
- **Accessibility:** all images have alt text *except in Picture Quiz* (alt must not leak the answer — use `alt="Quiz image"`). Keyboard shortcuts: `1–4` / `a–d` answer, `Space` flip card, `Enter` next, `F` flag, `←/→` navigate.

### 3.1 File layout
```
clcv115-study/
  index.html
  styles.css
  app.js                 # router, state, shared UI
  modes/flash.js  pictures.js  map.js  quiz.js  mock.js  tree.js  match.js
  data/terms.js          # §4 terms (all study-guide items)
  data/images.js         # §5 image data
  data/places.js         # §6 map data
  data/questions.js      # §7 question bank (170 Q)
  data/stories.js        # §4.2 cluster stories
  assets/exam-images/*   assets/slide-images/*
```

---

## 4. Content: terms (every study-guide item)

### 4.1 Data schema
```js
{ id:"apollo", term:"Apollo", cat:"divinity"|"mortal"|"concept"|"place"|"source",
  guide:"god of disease, healing, poetry, music",       // EXACT study-guide wording — primary answer text
  more:["Born on Delos to Leto; twin of Artemis", ...],  // elaboration facts
  roman:"Apollo", cluster:"apollo", image:"08-apollo-kylix.jpg" (optional), mnemonic:"..." }
```
Flashcards are generated **both directions**: term → guide text, and guide text → term (the exam asks both ways). Plus cloze cards from `more` facts.

### 4.2 The 9 story clusters (Story Mode text; also used to group flashcards)

**C1. What is myth? (Powell ch. 1–3)**
- *Myth* = a traditional story with collective importance, especially about gods. Three kinds (Powell): **divine myth** (gods, the world's origins), **legend** (human heroes, set in the past; also called saga), **folktale** (ordinary people, talking animals, entertainment).
- A myth is **the complex of all its variants** — no one version is the "true" or original one (e.g., Homer and Sophocles tell Oedipus differently; both are "the myth").
- *Anthropomorphism* = giving human form/traits to gods and non-humans (anthropos "human" + morphē "shape"). Greek gods look, feel, lust, and quarrel like humans but are immortal and powerful.
- *Etiological story* = explains how something came to be (why Apollo has a shrine on Delos; why the laurel is Apollo's tree; why spiders weave).
- *Eponymous ancestor* = person whose name is given to a people (Hellen → Hellenes = Greeks). "-onym" = name.
- *Syncretism* = "blending": identifying foreign gods with Greek ones (Inanna/Ishtar = Aphrodite; Roman Venus = Aphrodite). Not to confuse with *deification* (making someone a god) or *catasterism* (turning someone into a star).
- *Cosmogony* = creation of the world; *Theogony* = creation/birth of the gods. Two models of creation: **birthing** (sexual generation: Gaea + Uranus produce offspring — Greek, Hesiod) vs. **crafting** (a maker builds the world/people: Marduk shapes the cosmos from Tiamat's body; Prometheus molds humans from mud; Hephaestus makes Pandora).
- Hesiod organizes variant myths through **genealogies (family trees) and themes** (e.g., the succession theme).
- Greek world background: Mycenaean Bronze Age → Dark Age → Greek alphabet (adapted from Phoenician, c. 800 BCE) lets Homer's and Hesiod's poems be written down (c. 8th–7th c. BCE). Mesopotamian myths are older and influenced Greek ones.

**C2. Creation & succession (Hesiod's *Theogony*)**
1. First: **Chaos** (a gap/void), then **Gaea** (Earth), **Tartarus** (the pit beneath the earth; later also a monster/place of punishment), and **Eros** (Love — a primordial force that makes generation possible).
2. Gaea bears **Uranus** (Sky). Gaea + Uranus → the 12 **Titans**, the 3 **Cyclopes**, the 3 **Hundred-handers** (Hecatonchires). Uranus hates his children and pushes them back into Gaea.
3. Gaea makes a sickle; her youngest Titan son **Cronus** castrates Uranus. From Uranus' blood on Earth come the **Furies (Erinyes)**, Giants, and ash-tree nymphs; from his genitals in the sea comes **Aphrodite** (born from the foam, *aphros*; comes ashore at **Cyprus**).
4. Cronus + **Rhea** (Titans) → **Hestia, Demeter, Hera, Hades, Poseidon, Zeus** = parents of the Olympians are **Cronus and Rhea**. Warned that a son will overthrow him, Cronus swallows each child. Rhea hides Zeus (on Crete) and gives Cronus a stone wrapped in swaddling clothes. Cronus is forced to vomit up the children.
5. **Titanomachy** (10-year war, Titans vs. Olympians). Zeus frees the **Cyclopes** (they craft his **thunderbolt**) and the **Hundred-handers** (they **hurl boulders**). The Titans are imprisoned in **Tartarus**.
6. Gaea's last challenge: **Typhoeus** (Typhon), a monster with 100 snake heads (child of Gaea + Tartarus). **Zeus defeats him with thunderbolts** and hurls him into Tartarus. → Zeus becomes king; divides the world: Zeus the sky, Poseidon the sea, Hades the underworld.
7. Zeus prevents his own overthrow by **swallowing Metis** ("cleverness") when pregnant; **Athena is born from Zeus' head** (Hephaestus splits his head with an axe). Zeus now "contains" cleverness — the succession cycle ends.
- **Succession myth** = the tale type Uranus → Cronus → Zeus (each son overthrows the father; the mother helps).
- **Oceanus** (Ocean, the river circling the earth) and his wife Tethys: in Homer, the *origin of the gods* — a rival creation tradition ("Oceanus is a creator").
- **Helius/Helios** (sun), son of the Titan **Hyperion**; drives the sun-chariot; originally separate from Apollo, later identified with him ("Phoebus" = bright). Apollo's solar features are **late** → gods **change over time**.

**C3. Mesopotamian parallels (*Enuma Elish*, *Gilgamesh*, Inanna)**
- ***Enuma Elish*** (Babylonian creation epic, "When on high…"): **Apsu** (fresh water) + **Tiamat** (salt water, sometimes a snake/dragon) mingle and produce the gods. Conflict among generations. The young god **Marduk** agrees to fight Tiamat if made king; he kills her (winds + arrow) and **splits her body to make sky and earth** (crafting creation). Humans are made from the blood of Tiamat's general Kingu, to serve the gods. Marduk becomes king — recited at the Babylonian New Year.
- **An/Anu** = Mesopotamian **sky god** (≈ Uranus).
- **Parallels:** storm god defeats a serpent/chaos monster and becomes king (Marduk–Tiamat ≈ Zeus–Typhoeus); generations of gods in succession; creation from primal waters.
- **Inanna/Ishtar** = Mesopotamian goddess of **love and war** ≈ **Aphrodite** (syncretism). Her young lover **Dumuzi (Tammuz)**, a dying god who is lamented, ≈ **Adonis**.
- **Flood stories** (tale type: human failure → mass destruction → survivors in a boat → repopulation): Babylonian *Gilgamesh* — **Utnapishtim**; Hebrew *Genesis* — **Noah**; Greek/Roman (Ovid) — **Deucalion & Pyrrha**. Flood as divine punishment, a boat/raft, and a bird scout are **shared**; what's **unique to Deucalion & Pyrrha** is that **they recreate humans from stones**.

**C4. Prometheus, Pandora, and humans (Hesiod, Aeschylus)**
- **Prometheus** ("Forethought"), Titan, son of Iapetus; brothers **Epimetheus** ("Afterthought") and **Atlas**.
- **Trick at Mecone:** Prometheus divides an ox — meat hidden in the stomach vs. bones wrapped in gleaming fat; Zeus picks the bones → etiology of why humans keep the meat and burn bones for the gods.
- Zeus hides fire; **Prometheus steals fire** (in a fennel stalk) and gives it to humans.
- Punishment: **chained to a mountain; an eagle eats his liver, which regrows each day** (later freed by Heracles). In the image, **Atlas holds up the sky** next to him (Atlas' punishment for fighting in the Titanomachy).
- In some traditions (and the Louvre relief) **Prometheus creates humans from mud**, with **Athena** giving them life/mind.
- **Aeschylus, *Prometheus Bound***: Hephaestus (with Might and Violence) **binds** Prometheus; Prometheus knows a secret (the sea-nymph Thetis' son will be greater than his father) that could topple Zeus.
- **Pandora** ("**all gifts**"), the **first woman, created to punish mankind** for the fire theft: fashioned by **Hephaestus** from earth and water; Athena dresses her and teaches weaving; Aphrodite gives allure; **Hermes** gives a deceitful mind and speech; Zeus sends her (with Hermes) to **Epimetheus**, who accepts her despite Prometheus' warning. She opens the jar (*pithos* — not a "box") releasing evils; **Hope** stays inside. Image: *Zeus, Hermes, Epimetheus, Pandora* (left → right).
- **Five Ages of Man** (Hesiod, *Works and Days*) — a story of **decline**: **Gold** (under Cronus; no toil, no old age) → **Silver** (100-year childhood, impious) → **Bronze** (violent, destroy each other) → **Heroes/Demigods** (the one improvement; fought at Thebes and Troy) → **Iron** (our age: toil, misery, injustice). (Ovid gives four metal ages, no heroes.)
- **Flood (Ovid, *Metamorphoses* 1):** Zeus visits **Lycaon** (king of Arcadia), who **serves him human flesh** — the ultimate violation of **hospitality (xenia)** → turned into a wolf; Zeus floods the world. **Deucalion** (son of Prometheus) and **Pyrrha** (daughter of Epimetheus & Pandora) survive on a boat (landing on Mt. Parnassus), consult Themis' oracle ("throw the bones of your great mother behind you" = stones of Mother Earth) → stones thrown by Deucalion become men, by Pyrrha women. Their son **Hellen** is the **eponymous ancestor** of the Greeks (Hellenes); his sons/grandsons (Dorus, Aeolus, Xuthus → Ion) give names to the Greek dialect groups (Doric, Aeolic, Ionic).

**C5. Zeus, Hera & the older Olympians**
- **Zeus**: storm god, king of the Olympians; enforces **justice (dikē)** and **hospitality (xenia)**; thunderbolt, eagle, scepter. Roman Jupiter. Name = "bright" (sky).
  - **Ganymede**: Trojan prince stolen by Zeus (as/with an eagle) to be cupbearer of the gods; **becomes immortal**. Zeus compensates his father.
  - **Callisto**: follower of Artemis seduced by Zeus, **turned into a bear** (becomes the Great Bear constellation).
- **Hera**: **goddess of marriage**, wife and sister of Zeus; jealous of Zeus' affairs (persecutes Leto, Callisto, etc.). Roman Juno. In art: **always fully dressed**; **hand-clasping = marriage** (Selinus wedding metope). **Unhappy mother of Hephaestus** (born lame / thrown from Olympus). Also mother of Ares.
- **Hestia**: **goddess of the hearth**; virgin; one of the three goddesses **immune to Aphrodite** (Hestia, Athena, Artemis). Roman Vesta.
- **Poseidon**: **god of the oceans**; "**Earth-shaker**" (earthquakes); horses; trident. Competed with **Athena for the patronage of Athens** (he gave a salt spring; she gave the olive tree — she won). Roman Neptune.
- **Hades**: **god of the dead**; name means "**invisible / the unseen one**". Roman Pluto.
- Name meanings: **Zeus = bright**, **Hades = invisible**, **Prometheus = forethought**, **Epimetheus = afterthought**, **Pandora = all gifts**, **Metis = cleverness**.
- **Justice (dikē)** = proper treatment of others, enforced by Zeus. **Hospitality (xenia)** = obligations between guest and host (protected by Zeus). *Good* xenia: Achilles gives King **Priam** food and a bed (Iliad 24); Anchises welcomes Aphrodite. *Bad* xenia: **Lycaon serves human flesh to Zeus**.
- **Furies (Erinyes)**: goddesses of vengeance, born from Uranus' blood; they **punish people who kill their kin** (and oath-breakers).

**C6. Apollo & Artemis**
- **Leto** (Titaness) is **mother of Apollo and Artemis** by Zeus. Hera's jealousy means no land will receive her; the small floating island of **Delos** accepts after Leto **promises Apollo will build a temple** (rich sanctuary) there. → **Delos = birthplace of Apollo/Artemis, shrine of Apollo** (Homeric Hymn to Apollo — shows link to Zeus, Hera's resentment, **etiology of the sanctuary**).
- **Apollo**: **god of disease, healing, poetry, music** (and prophecy, archery). Attributes: **lyre, laurel wreath, bow**; raven. Epithet **Phoebus** ("bright").
  - Kills the giant snake **Pytho(n)** at **Delphi** and founds his **oracle**; his priestess is the **Pythia**.
  - **Daphne**: nymph Apollo pursues (Cupid's arrow; Ovid); she **hates him and flees**, and is **turned into a laurel tree** → laurel is sacred to Apollo.
  - **Coronis**: Apollo's **cheating girlfriend** (a white raven reports her; the raven is turned black). Apollo/Artemis kill her; Apollo rescues their unborn son **Asclepius**.
  - **Asclepius**: **mortal son of Apollo & Coronis**, raised by the centaur Chiron; great healer **famous for bringing the dead back to life** → Zeus kills him with a thunderbolt; **then god of healing**.
  - **Hyacinth**: Spartan boy loved by Apollo, **killed accidentally by Apollo's discus**; becomes the hyacinth flower.
  - **Cassandra**: Trojan princess; Apollo gives her prophecy; she **rejects him** → **condemned to prophesy and be disbelieved**.
  - **Sibyl of Cumae**: asked Apollo for as many years as grains of sand but forgot to ask for youth → **condemned to age without youth**.
  - *Pattern*: Sibyl, Cassandra, Daphne, Coronis all **reject Apollo's love** (Apollo's loves go badly).
- **Artemis**: **goddess of hunting**, wild animals, virginity; brings **(sudden) death of women** with her arrows (and helps in childbirth). Roman Diana.
  - **Actaeon**: hunter who saw Artemis bathing → **turned into a deer, killed by his own dogs** (Ovid).
  - **Callisto** (see Zeus) — Artemis' companion turned into a **bear**.
  - **Orion**: **famous hunter**, companion of Artemis, killed (versions differ) and made a constellation.
  - **Niobe**: boasted she had more children than Leto → **lost twelve children**, **killed by Artemis & Apollo** (Artemis shoots the daughters, Apollo the sons); becomes an **emblem of grief** (turned to weeping stone).

**C7. Hermes & Pan**
- **Hermes**: **god of travelers, thieves, messengers, oratory** (also guide of souls to the underworld). Son of Zeus and the nymph **Maia**. Roman Mercury.
  - Iconography: **petasos (traveling hat)**, **caduceus** (twin-snake staff), **winged sandals**.
  - ***Homeric Hymn to Hermes***: on his first day, baby Hermes **invents the lyre** from a tortoise shell, **steals Apollo's cattle** (driving them backward to hide tracks), then climbs back into his **cradle**. Apollo brings him to Zeus. **They reconcile when Hermes gives Apollo the lyre** (Apollo gives Hermes the caduceus/cattle). → **Lyre: invented by Hermes, given to Apollo.**
  - **Herm**: stone pillar with a head of Hermes and genitals, marking **boundaries**/doorways; **apotropaic** ("warding off evil").
  - **Hermaphroditus**: **child of Hermes & Aphrodite**; merged with the nymph Salmacis → **both man and woman** (Ovid).
- **Pan**: **goat-shaped god of the wild** (horns, hooves, goat legs, tail), **son of Hermes**; from Arcadia. Chasing travelers/shepherds → English **"panic."** **Pan pipes** come from **Syrinx**, a nymph **transformed into reeds to escape Pan**.
- **Priapus**: god of the phallus/fertility; his statues **ward off evil** (apotropaic) in gardens.

**C8. Aphrodite, Hephaestus, Ares, Eros**
- **Aphrodite**: **goddess of love**; born from the sea foam (Uranus' genitals) → **Cyprus is Aphrodite's island** (in Homer she is daughter of Zeus & Dione). Roman Venus. Parallels **Inanna/Ishtar**. Cannot overpower **Hestia, Athena, Artemis** (the virgin goddesses).
  - Image: **rising from the sea** with sea goddess, **Eros/Cupid**, jewelry, billowing garment (Pompeii fresco).
  - **Anchises**: Trojan herdsman; **Zeus made Aphrodite fall in love with him to stop her gloating** over other gods (whom she made love mortals); she visits his **shepherd's hut** (good xenia); their son is **Aeneas** (Homeric Hymn to Aphrodite).
  - **Adonis**: beautiful youth **loved by Aphrodite/Venus, killed by a boar**; **lamented in an annual ritual** (Adonia); ≈ Dumuzi/Tammuz, a dying god.
  - **Myrrha**: offended Aphrodite, **slept with her own father**, was **turned into a (myrrh) tree**; her son (born from the tree) was **Adonis** (Ovid).
  - **Pygmalion**: sculptor on Cyprus who **created a perfect woman in marble** (study-guide wording; Ovid says ivory) — Aphrodite brings her to life (later named **Galatea**).
- **Eros**: **Love** — a **primordial force** in Hesiod; later the **son of Aphrodite** (Roman Cupid).
- **Hephaestus**: **god of metalworking, crafts**; lame; son of Hera; husband of Aphrodite (Odyssey). Roman Vulcan.
  - Makes Achilles' armor for **Thetis** (image: seated, clothed, holding a hammer, with the armor).
  - **Who Hephaestus binds or traps: Hera** (golden throne), **Ares & Aphrodite** (invisible net — caught in adultery, *Odyssey* 8, sung by the bard Demodocus), **Prometheus** (*Prometheus Bound*).
  - Helps at the **birth of Athena** (axe to Zeus' head); crafts **Pandora**.
- **Ares**: **god of war** (violent, bloodthirsty side); lover of Aphrodite. Roman Mars.

**C9. Athena**
- **Athena**: **goddess of cities, crafts, wisdom, war** (strategic). Daughter of Zeus and **Metis**; **born fully armed from Zeus' head**. Virgin (Parthenos → Parthenon). Roman Minerva.
- Iconography: **helmet, spear, shield, aegis** (goatskin chest-cape with snakes and the Gorgon's head, to **frighten enemies**); owl; olive.
- **Athens** is Athena's city — she beat **Poseidon** in the contest for **patronage of Athens** (her olive tree vs. his salt spring).
- **Arachne**: mortal weaver who challenged Athena → **turned into a spider**.
- **Panathenaic amphorae** (prize jars of olive oil for the Panathenaic games) show Athena striding with spear and shield.

### 4.3 Divinities & demi-gods (38) — `cat:"divinity"`
Use the **guide** text exactly; add the **more** facts from the clusters above.

| id | term | guide text (exact) | key extra facts | Roman |
|---|---|---|---|---|
| anu | An/Anu | Mesopotamian sky god | ≈ Uranus | — |
| aphrodite | Aphrodite | goddess of love | born from sea foam, Cyprus; loves Anchises, Adonis; ≈ Inanna | Venus |
| apollo | Apollo | god of disease, healing, poetry, music | Delos birth; Delphi oracle; lyre, laurel, bow; Phoebus | Apollo |
| ares | Ares | god of war | lover of Aphrodite; trapped by Hephaestus | Mars |
| artemis | Artemis | goddess of hunting, death of women | twin of Apollo; virgin; Actaeon, Callisto, Niobe | Diana |
| asclepius | Asclepius | mortal son of Apollo & Coronis, then god of healing | raised dead → killed by Zeus' thunderbolt | Aesculapius |
| athena | Athena | goddess of cities, crafts, wisdom, war | born from Zeus' head; aegis; Athens; Arachne | Minerva |
| atlas | Atlas | Titan who holds up the sky | brother of Prometheus; punishment after Titanomachy | Atlas |
| chaos | Chaos | primordial being | first to exist; "gap/void" | — |
| cronus | Cronus | son of Uranus, father of Zeus | castrates Uranus; swallows children; married to Rhea | Saturn |
| cyclopes | Cyclopes | thunderbolt crafters for Zeus | children of Gaea & Uranus; one eye | — |
| daphne | Daphne | nymph loved by Apollo, turned into a tree | laurel; hated Apollo, fled | — |
| deucalion | Deucalion & Pyrrha | flood survivors who recreate humankind | throw stones → people; son Hellen | — |
| epimetheus | Epimetheus | Prometheus' brother, marries Pandora | "afterthought" | — |
| eros | Eros | Love, primordial force/son of Aphrodite | Cupid | Cupid/Amor |
| furies | Furies (Erinyes) | vengeance goddesses | from Uranus' blood; punish kin-murder | Furiae |
| gaea | Gaea | earth, mother of creation, then monsters | plots against Uranus; mother of Typhoeus | Terra |
| hades | Hades | god of the dead | name = "invisible" | Pluto |
| helios | Helius/Helios | god of the sun, after Hyperion | sun-chariot; later identified with Apollo | Sol |
| hephaestus | Hephaestus | god of metalworking, crafts | lame; binds Hera, Ares & Aphrodite, Prometheus; makes Pandora | Vulcan |
| hera | Hera | goddess of marriage | wife of Zeus; mother of Hephaestus; fully dressed in art | Juno |
| hermes | Hermes | god of travelers, thieves, messengers, oratory | son of Maia; petasos, caduceus, winged sandals; lyre | Mercury |
| hestia | Hestia | goddess of the hearth | virgin; immune to Aphrodite | Vesta |
| hundred | Hundred-handers (Hecatonchires) | monsters with 100 hands (sons of Gaea & Uranus) | **hurl boulders** for Zeus in the Titanomachy | — |
| inanna | Inanna/Ishtar | Mesopotamian goddess of love/war | ≈ Aphrodite; lover Dumuzi | — |
| leto | Leto | titan, mother of Apollo and Artemis | persecuted by Hera; Delos | Latona |
| maia | Maia | nymph, mother of Hermes | daughter of Atlas | Maia |
| marduk | Marduk | Mesopotamian hero who defeats Tiamat | becomes king of the gods; makes world from her body | — |
| metis | Metis | 'cleverness' swallowed by Zeus, mother of Athena | ends succession cycle | — |
| nymphs | Nymphs | minor goddesses of nature | Daphne, Syrinx, Maia, Salmacis | — |
| oceanus | Oceanus | god of the Ocean, a creator | Titan; with Tethys origin of gods in Homer | Oceanus |
| pan | Pan | goat-shaped god of the wild, son of Hermes | "panic"; Syrinx → pan pipes | Faunus |
| poseidon | Poseidon | god of the oceans | Earth-shaker; lost Athens to Athena | Neptune |
| priapus | Priapus | god of the phallus, statues of him used to ward off evil | apotropaic | Priapus |
| prometheus | Prometheus | Titan, defies Zeus to give humans fire | "forethought"; liver-eating eagle; creates humans from mud | — |
| python | Pytho(n) | giant snake Apollo defeats at Delphi | origin of Delphic oracle, "Pythia" | — |
| tartarus | Tartarus | primordial underworld monster/place in the underworld | prison of the Titans; father of Typhoeus | — |
| tiamat | Tiamat | Mesopotamian salt water goddess, sometimes figured as a snake | killed by Marduk; body → sky & earth | — |
| titans | Titans | children of Gaea and Uranus, fought the Olympian gods | Cronus, Rhea, Oceanus, Hyperion, Iapetus… | — |
| typhoeus | Typhoeus | snake monster defeated by Zeus | 100 snake heads; son of Gaea & Tartarus | Typhon |
| uranus | Uranus | sky, father with Gaea to earliest living beings | castrated by Cronus | Caelus |
| zeus | Zeus | storm god, king of the Olympians, enforces justice, hospitality | thunderbolt, eagle; swallows Metis | Jupiter |

### 4.4 Mortals (20) — `cat:"mortal"`
| id | term | guide text (exact) | extra |
|---|---|---|---|
| actaeon | Actaeon | turned into a deer by Artemis, killed by own dogs | saw her bathing |
| adonis | Adonis | loved by Aphrodite/Venus, killed by a boar | lamented annually; son of Myrrha; ≈ Dumuzi |
| anchises | Anchises | loved by Aphrodite, father of Aeneas | Zeus caused it to stop her gloating |
| arachne | Arachne | turned into a spider by Athena | weaving contest |
| callisto | Callisto | turned into a bear | companion of Artemis, loved by Zeus |
| cassandra | Cassandra | condemned to prophesy and be disbelieved | rejected Apollo; Trojan princess |
| coronis | Coronis | cheating girlfriend of Apollo | mother of Asclepius; raven |
| ganymede | Ganymede | Trojan prince, stolen by Zeus, becomes immortal | cupbearer of gods |
| hermaphroditus | Hermaphroditus | both man and woman, child of Hermes and Aphrodite | merged with Salmacis |
| hyacinth | Hyacinth | boy loved and killed, accidentally, by Apollo | discus → flower |
| myrrha | Myrrha | offended Aphrodite, slept with her own father, turned into a tree, her son was Adonis | myrrh tree |
| niobe | Niobe | lost twelve children to boasting, children killed by Artemis & Apollo | emblem of grief |
| achilles | Achilles | main Greek fighter at Troy | son of Thetis; armor by Hephaestus; hosts Priam |
| priam | Priam | king of Troy | Achilles gives him food and a bed (good xenia) |
| orion | Orion | famous hunter | companion of Artemis; constellation |
| pandora | Pandora | perfect woman created to punish mankind | "all gifts"; jar; Epimetheus |
| pygmalion | Pygmalion | created a perfect woman (Galatea) in marble | Cyprus; Aphrodite animates her |
| pythia | Pythia | the oracle at Delphi | priestess of Apollo |
| sibyl | Sibyl of Cumae | condemned to age without youth | asked for years, not youth |
| lycaon | Lycaon *(extra, from review slides)* | served human flesh to Zeus (bad hospitality) | turned into a wolf; triggers flood |
| thetis | Thetis *(extra)* | sea-nymph, mother of Achilles | asks Hephaestus for armor |
| aeneas | Aeneas *(extra)* | Trojan hero, son of Aphrodite & Anchises | |

### 4.5 Concepts/Items (23) — `cat:"concept"`
| id | term | guide text (exact) |
|---|---|---|
| aegis | Aegis | goatskin worn by Athena to frighten enemies |
| anthropomorphism | Anthropomorphism | giving human traits to gods/other nonhumans |
| apotropaic | Apotropaic | 'warding off evil,' the function e.g., of a herm |
| caduceus | Caduceus | twin-snake staff of Hermes |
| cosmogony | Cosmogony | story of the creation of the world |
| creation | Creation | birthing vs. crafting analogy |
| eponymous | Eponymous ancestor | the origin of a name, e.g., Hellen as the ancestor of "Greeks," called Hellenes in Greek |
| etiological | Etiological story | explains how something came to be, e.g., why Apollo has a shrine on Delos |
| fiveages | Five ages of man | from gold to iron, in Hesiod, a story of decline |
| flood | Flood stories | a tale type exemplified in Gilgamesh, Genesis, and Ovid's Metamorphoses |
| folktale | Folk tale | stories about ordinary people, talking animals |
| herm | Herm | pillars with heads of Hermes plus genitals, to mark boundaries |
| xenia | Hospitality (xenia) | obligations of courteous treatment between guests and hosts |
| dike | Justice (dikê) | proper treatment of others, enforced by Zeus |
| legends | Legends | about human heroes, set in the past |
| lyre | Lyre | invented by Hermes, given to Apollo |
| myth | Myth | a traditional story with collective importance, especially about gods |
| panpipes | Pan pipes | from Syrinx, a nymph transformed into reeds to escape Pan |
| succession | Succession myth | a tale type exemplified in Hesiod's Theogony, with Uranus, Cronus, and Zeus |
| syncretism | Syncretism | "blending," Greek practice of identifying foreign gods with their own, e.g., that Sumerian Inanna = Aphrodite |
| theogony | Theogony | story of the creation of the gods |
| titanomachy | Titanomachy | battle between the Titans and the Olympian gods |
| petasos | Petasos *(extra)* | Hermes' traveling hat |

### 4.6 Places (7) — see §6 for map data
Athens (Athena's city) · Cyprus (Aphrodite's island) · Delos (birth place of Apollo/Artemis, shrine of Apollo) · Delphi (shrine and oracle of Apollo) · Greece · Mesopotamia · Mt. Olympus (home of the 12 Olympian gods).

### 4.7 Source texts (6) — `cat:"source"` (flashcards: text ↔ what's in it)
| Text | Author / culture | What we use it for |
|---|---|---|
| *Prometheus Bound* | **Aeschylus** (Athenian tragedian, 5th c. BCE) | Prometheus chained by Hephaestus; defiance of Zeus; secret about Thetis' son |
| *Enuma Elish* | Babylonian | creation: Apsu & Tiamat; **Marduk defeats Tiamat**, becomes king, makes world from her body |
| *Theogony* | **Hesiod** (Boeotia, c. 700 BCE) | origin of the gods; Chaos → Gaea…; **succession myth**; Titanomachy; Typhoeus; Pandora (short version) |
| *Works and Days* | **Hesiod** | **Five Ages of Man**; Pandora's jar; justice (dikē); farming advice to brother Perses |
| *Iliad*, *Odyssey* | **Homer** (8th c. BCE) | Achilles & Priam (xenia, Iliad 24); Hephaestus makes Achilles' armor (Iliad 18); **Ares & Aphrodite caught by Hephaestus (Odyssey 8)**; Oceanus as origin of gods |
| *Homeric Hymns* | anonymous, "Homeric" style | **Hymn to Apollo** (birth on Delos, Delphi/Python); **Hymn to Hermes** (lyre, cattle theft); **Hymn to Aphrodite** (Anchises; the three goddesses she can't sway) |
| *Metamorphoses* | **Ovid** (Roman, c. 8 CE; 15 books of transformations) | Lycaon & flood, Deucalion & Pyrrha; Daphne; Actaeon; Arachne; Niobe; Myrrha & Adonis; Pygmalion; Hermaphroditus; Syrinx; Callisto |
| *Epic of Gilgamesh* *(extra)* | Babylonian | flood survivor **Utnapishtim** |

### 4.8 Mnemonics (show on cards)
- **Olympian 12**: Zeus, Hera, Poseidon, Demeter, Hestia (sometimes replaced by Dionysus), Athena, Apollo, Artemis, Ares, Aphrodite, Hephaestus, Hermes.
- **Cronus' children** "**H**e **D**id **H**ave **H**ungry **P**owerful **Z**eus" = Hestia, Demeter, Hera, Hades, Poseidon, Zeus.
- **Immune to Aphrodite = "the 3 virgins": HAA** — Hestia, Athena, Artemis ("no children").
- **Hephaestus traps "HAAP"**: Hera, Ares, Aphrodite, Prometheus.
- **Titanomachy helpers**: **C**yclopes **C**raft thunderbolts; **H**undred-**H**anders **H**url boulders.
- **Apollo's A-list rejections**: Sibyl, Cassandra, Daphne (rejected); Coronis (cheated).
- **Five Ages**: "**G**ood **S**tudents **B**ecome **H**appy **I**ntellectuals" = Gold, Silver, Bronze, Heroes, Iron.
- **Names**: Pro-metheus = before-thought; Epi-metheus = after-thought; Pan-dora = all-gifts; A-des (Hades) = un-seen.
- **Deucalion & Pyrrha = D&P = "Drop Pebbles"** — the only flood survivors who make people from stones.
- **Pan → panic; Syrinx → syringe (tube) / pan pipes.**
- **Pygmalion = Cyprus = Aphrodite's island.**

### 4.9 "Final 10" (show as a one-page printable card)
1. Parents of the Olympians = **Cronus & Rhea**. 2. Hundred-handers **hurl boulders**; Cyclopes **forge thunderbolts**. 3. Unique to Deucalion & Pyrrha = **people from stones**. 4. Lycaon = **bad xenia**. 5. Hades = **invisible**; Pandora = **all gifts**. 6. Leto promised Delos a **temple**. 7. Hephaestus trapped **Hera, Ares, Aphrodite, Prometheus**. 8. Aphrodite ≈ **Inanna/Ishtar**; Adonis ≈ **Dumuzi**; killed by a **boar**, lamented annually. 9. Hermes + Apollo reconcile via the **lyre**; Pan → **panic**; Asclepius **raised the dead**. 10. Furies punish **kin-killers**; syncretism = **identifying foreign gods with Greek ones**; gods **change over time**.

---

## 5. Picture Quiz — image data (the 14 tested images)

### 5.1 Schema
```js
{ id:"img01", file:"01-niobids.jpg", backup:"<commons url>",
  answer:"Artemis and Apollo killing Niobe's children",
  who:["Artemis","Apollo","Niobids (Niobe's children)"],
  doing:"shooting Niobe's children with arrows",
  clues:["two archers (the twins) with bows","dying/fallen youths hit by arrows"],
  story:"Niobe boasted of her many children over Leto → Leto's twins kill them",
  hotspots:[{x:0.35,y:0.25,r:0.1,label:"Apollo with bow"}, ...]   // fractions of image w/h; OPTIONAL (see 5.3)
}
```

### 5.2 The images
| id | file | Who / what | Identifying clues (what the exam expects) | Story |
|---|---|---|---|---|
| img01 | 01-niobids.jpg | **Artemis and Apollo killing Niobe's children** | two divine archers with bows; fallen youths pierced by arrows | Niobe boasted over Leto |
| img02 | 02-tiamat-marduk.jpg | **Tiamat (as a snake/dragon) destroyed by Marduk** | god with weapons/thunderbolts attacking a serpent-dragon; Mesopotamian cylinder-seal style | *Enuma Elish* |
| img03a-c | 03a/b/c | **Zeus hurls a thunderbolt at Typhoeus** | bearded Zeus (inscribed ZEVS) with thunderbolt; winged monster with snake legs/tails | Theogony: Zeus's last battle for kingship |
| img04 | 04-atlas-prometheus.jpg | **Atlas holding up the sky (left) + eagle devouring chained Prometheus' liver (right)** | one figure holds the sky on his back; the other bound to a pillar with a large bird; snake below | punishments of Titan brothers |
| img05 | 05-prometheus-creates-humans.jpg | **Athena (left) and seated Prometheus creating humans from mud** | bearded seated craftsman shaping small human figures; helmeted goddess (Athena) | creation by crafting |
| img06 | 06-birth-of-pandora.jpg | **Birth of Pandora: Zeus, Hermes, Epimetheus, Pandora (L→R)** | Zeus with scepter; Hermes with petasos/caduceus; Epimetheus (sometimes with hammer); Pandora rising from the ground | first woman sent to punish men |
| img07 | 07-wedding-hera-zeus.jpg | **Wedding of Hera and Zeus** | seated Zeus grasps the wrist/hand of a standing, **fully dressed**, veiled Hera; **hand-clasping = marriage** | Hera, goddess of marriage |
| img08 | 08-apollo-kylix.jpg | **Apollo with raven, lyre, laurel wreath, pouring a libation** | laurel wreath, tortoise-shell lyre, black bird (raven — Coronis story), phiale for libation | Apollo's attributes; raven = Coronis |
| img09 | 09-hermes-lekythos.jpg | **Hermes** | **petasos (traveling hat) hanging from neck, caduceus (staff with entwined serpents), winged sandals** | messenger/traveler god |
| img10 | 10-apollo-baby-hermes.jpg | **Apollo and baby Hermes in his cradle (with his traveling hat), and a stolen cow** | baby in a cradle wearing a petasos; cattle; angry Apollo | Homeric Hymn to Hermes |
| img11 | 11-pan-mosaic.jpg | **Pan** | **horns, hooves, goat legs, tail** (+ pipes) | god of the wild; panic |
| img12 | 12-hephaestus-thetis.jpg | **Hephaestus (and Thetis)** | **seated, clothed, holding a hammer**, with **armor he has made**; woman (Thetis) receiving it | Achilles' armor (Iliad 18) |
| img13 | 13-aphrodite-rising.jpg | **Aphrodite rising from the sea** | nude goddess on a shell over water, **Eros/Cupid**, sea goddess/figures, **jewelry, billowing garment** | birth from the sea (Hesiod) |
| img14 | 14-birth-of-athena.jpg | **Birth of Athena from the head of Zeus (Hephaestus helps)** | seated Zeus with small armed figure emerging from his head; figure with an **axe** (Hephaestus) | Zeus swallowed Metis |
| img15 | 15-athena-panathenaic.jpg | **Athena** | **helmet, spear, aegis (goatskin with snakes/Gorgon), shield** (with snake device) | Panathenaic prize amphora |

### 5.3 Picture Quiz formats (all required)
1. **Name it (a–d):** show the image → "What story/figure is depicted?" 4 options drawn from other image answers (plausible distractors, e.g., *Hephaestus* vs *Hermes* vs *Zeus*).
2. **Which clue?** "What identifies the figure as Hermes?" → a–d (petasos/caduceus/winged sandals vs aegis vs lyre vs trident).
3. **Label the object (hotspot):** image shown with numbered pins; ask "What is item 2?" (aegis, caduceus, petasos, lyre, thunderbolt, hammer). If hotspot coordinates are not set, fall back to format 2. *(Builder: you may add approximate hotspot coordinates by viewing the images; test them visually.)*
4. **Reverse:** "Which image shows *the wedding of Hera and Zeus*?" → 4 thumbnails.
5. **Zoom/crop challenge:** show a 30% crop around a key attribute (CSS `object-position` + `transform: scale(2.5)`), student names the god. Click "Reveal" to zoom out.
6. **Transfer:** (optional, needs web) show a *different* artwork from the Commons categories and ask who it is — trains iconography, not memorizing one picture.

Attribute → god cheat table (shown after each answer and in the Cheat Sheet):
| Attribute | God |
|---|---|
| thunderbolt, eagle, scepter | Zeus |
| aegis, helmet, spear, shield, owl, olive | Athena |
| petasos, caduceus, winged sandals | Hermes |
| lyre, laurel wreath, bow, raven | Apollo |
| bow + hunting, deer | Artemis |
| hammer, tongs, anvil, (lame) | Hephaestus |
| trident, horses | Poseidon |
| horns, hooves, goat legs, tail, pan pipes | Pan |
| shell/sea foam, Eros, doves, jewelry | Aphrodite |
| fully dressed/veiled, hand-clasp, scepter, peacock | Hera |
| sun-chariot, rays | Helios |

---

## 6. Map Test

### 6.1 Places data (lat, lng)
```js
window.DATA_PLACES = [
 // TESTED
 {id:"athens",   name:"Athens",        lat:37.9715, lng:23.7267, tol_km:35,  note:"Athena's city (won contest vs. Poseidon)", tested:true},
 {id:"delphi",   name:"Delphi",        lat:38.4824, lng:22.5010, tol_km:30,  note:"shrine and oracle of Apollo; Pythia; Python", tested:true},
 {id:"delos",    name:"Delos",         lat:37.3999, lng:25.2680, tol_km:30,  note:"birthplace of Apollo/Artemis; shrine of Apollo (small island in the Cyclades)", tested:true},
 {id:"olympus",  name:"Mt. Olympus",   lat:40.0859, lng:22.3583, tol_km:40,  note:"home of the 12 Olympian gods (N. Greece, Thessaly/Macedonia border)", tested:true},
 {id:"cyprus",   name:"Cyprus",        lat:35.1300, lng:33.4300, tol_km:120, note:"Aphrodite's island (large island in the far east Mediterranean)", tested:true},
 {id:"greece",   name:"Greece",        region:"greece",       note:"mainland + Aegean islands", tested:true},
 {id:"mesopotamia", name:"Mesopotamia", region:"mesopotamia", note:"'between the rivers' Tigris & Euphrates (modern Iraq); Babylon, Sumer", tested:true},
 // DISTRACTORS / CONTEXT (used as wrong answers, as in the review slides)
 {id:"troy",   name:"Troy",   lat:39.9575, lng:26.2389}, {id:"sparta", name:"Sparta", lat:37.0735, lng:22.4297},
 {id:"rome",   name:"Rome",   lat:41.9028, lng:12.4964}, {id:"crete",  name:"Crete",  lat:35.2400, lng:24.8100},
 {id:"sicily", name:"Sicily", lat:37.6000, lng:14.0154}, {id:"malta",  name:"Malta",  lat:35.9375, lng:14.3754},
 {id:"ephesus",name:"Ephesus",lat:37.9397, lng:27.3417}, {id:"parnassus", name:"Mt. Parnassus", lat:38.5357, lng:22.6217},
 {id:"thebes", name:"Thebes", lat:38.3219, lng:23.3190}, {id:"mycenae", name:"Mycenae", lat:37.7308, lng:22.7561},
 {id:"babylon",name:"Babylon",lat:32.5364, lng:44.4209}, {id:"cythera", name:"Cythera", lat:36.2500, lng:22.9900},
 {id:"arcadia",name:"Arcadia",lat:37.5500, lng:22.2000}, {id:"lemnos", name:"Lemnos", lat:39.9000, lng:25.2500}
];
// Region polygons (approximate; used for "click inside")
window.DATA_REGIONS = {
  greece: [[41.8,20.0],[41.4,22.6],[41.5,24.5],[40.9,26.3],[39.5,26.0],[38.2,25.6],[36.3,26.4],[35.0,24.0],[36.2,22.4],[36.4,21.6],[38.3,20.6],[39.6,19.9]],
  mesopotamia: [[37.2,38.5],[37.3,42.8],[35.5,44.8],[33.0,46.5],[31.0,48.5],[29.9,48.4],[30.6,46.2],[32.3,44.0],[33.8,42.0],[35.8,39.2]]
};
```

### 6.2 Map setup
- Leaflet map with **label-free tiles** (so names don't give answers away): `https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png` (attribution: © OpenStreetMap contributors © CARTO). Default view: center `[37.5, 30]`, zoom 5 (shows Greece → Mesopotamia). Allow zoom.
- Offline fallback: `slide-images/map-aegean-blank.gif` (blank Aegean map from the review slides) with CSS hotspots; and `map-greece-blank.jpg`.

### 6.3 Map formats (all required)
1. **What is marked? (a–d)** — a ★ marker or ◯ circle on one location, 4 options (exactly like review slides: *"Identify the place marked with a star" → Troy / Delphi / Sparta / Rome*; *"Identify the island marked with a circle" → Crete / Malta / Delos / Sicily*).
2. **Click to locate** — "Click on Delos." Correct if within `tol_km` (Haversine) or inside region polygon. Show distance and the true spot after answering.
3. **Place ↔ meaning** — "Which place is Aphrodite's island?" → map options with markers A–D.
4. **Explore mode** — all tested places shown with popups (note + linked myths + image).

---

## 7. Question bank (170 questions)

### 7.1 Schema
```js
{ id:"q001", tags:["review","succession"], q:"Who were parents of the Olympian gods?",
  opts:["Zeus and Hera","Cronus and Rhea","Oceanus and Tethys","Uranus and Gaea"], ans:1,
  why:"Cronus and Rhea (Titans) produced Hestia, Demeter, Hera, Hades, Poseidon, Zeus.",
  img:null, map:null }
```
- **Shuffle options** at render time (keep track of the correct one), **except** when an option is "All of the above/None of the above".
- `img` = image id (Picture questions); `map` = `{marker:"delphi", style:"star"}` (Map questions).
- Tags used for the per-topic score report: `review, myth-theory, succession, mesopotamia, prometheus, flood, zeus-hera, apollo-artemis, hermes-pan, aphrodite, hephaestus-ares, athena, sources, concepts, images, maps, roman-names`.

### 7.2 Section A — Review-lecture questions (Sept 24 slides) — tag `review`
Answers marked **✔**.

1. Identify the place marked with a star on the map *(map: star on Delphi)*. A) Troy B) **Delphi ✔** C) Sparta D) Rome
2. Who becomes an emblem of grief after Apollo and Artemis kill her twelve children? A) Demeter B) Thetis C) **Niobe ✔** D) Hecuba
3. "The myth of Oedipus is the complex of all the variants" means: A) Only literary sources matter in the study of myth B) Homer tells the Oedipus myth differently than Sophocles C) **Myths appear in different versions, none more authentic than another ✔** D) The truest version of a myth is the oldest one
4. Who were parents of the Olympian gods? A) Zeus and Hera B) **Cronus and Rhea ✔** C) Oceanus and Tethys D) Uranus and Gaea
5. Hesiod reconciles variant myths by linking them through: A) **genealogies and themes ✔** B) transformations and themes C) genealogies and inherited curses D) transformations and genres
6. An eponymous ancestor like Hellen is one whose: A) **name is adopted for a race or tribe ✔** B) death benefits all humankind C) descendants all use his/her name D) deeds are recorded in pastoral poetry
7. What's unique to the Deucalion and Pyrrha story? A) the flood is a divine punishment B) a raft/boat allows some to survive C) a bird is sent out as a scout D) **the survivors recreate humans from stones ✔**
8. Which of the following is bad hospitality (xenia)? A) Anchises welcoming Aphrodite into his shepherd's hut B) Achilles offering king Priam food and a place to sleep C) **Lycaon serving a dead human to Zeus ✔** D) Zeus sending an eagle to torment Prometheus
9. Anthropomorphism is the: A) study of humankind past and present B) custom and practice of eating human flesh C) measurement of the human individual D) **attribution of human features to nonhumans ✔** *(why: A = anthropology, B = anthropophagy, C = anthropometry)*
10. Which name means "invisible"? A) **Hades ✔** B) Zeus C) Prometheus D) Epimetheus *(Zeus = bright, Prometheus = forethought, Epimetheus = afterthought)*
11. What do the Sibyl of Cumae, Cassandra, Daphne and Coronis all have in common? A) the gift of prophecy B) bearing Apollo sons C) losing their human form D) **rejecting Apollo's love ✔**
12. What did Apollo's mother promise the island of Delos, if it allowed her to give birth? A) a freshwater spring B) **a temple ✔** C) tripods and cauldrons D) octopus and seals
13. Identify the island marked with a circle on the map *(map: circle on Delos)*. A) Crete B) Malta C) **Delos ✔** D) Sicily
14. Who did Hephaestus bind or trap? A) Zeus, Ares, Aphrodite, Poseidon B) **Hera, Ares, Aphrodite, Prometheus ✔** C) Poseidon, Ares, Aphrodite, Hermes D) Prometheus, Ares, Aphrodite, Apollo
15. Aphrodite has overlap with the attributes of which Eastern deity? A) Tiamat B) Artemis (of Ephesus) C) Isis D) **Inanna (aka Ishtar) ✔**
16. The gods we have studied: A) originate on Mount Olympus B) exclude newcomers C) **change over time ✔** D) embody moral qualities
17. Which goddesses are immune to Aphrodite's power? A) Hestia, Athena, Hera B) Hestia, Hera, Artemis C) **Hestia, Athena, Artemis ✔** D) Hestia, Demeter, Athena
18. Zeus made Aphrodite fall in love with a mortal in order to: A) give the Trojan royal house a great warrior B) repay his debt for stealing Ganymede C) **prevent her from gloating over other gods ✔** D) distract her from the war god Ares
19. What is the circled item that Athena is wearing? *(img15)* A) snakes B) a petasus C) a caduceus D) **an aegis ✔**
20. Poseidon and Athena compete for the: A) olive tree as a symbol B) allegiance of sea deities C) horse as a symbol D) **patronage of Athens ✔**
21. Who was known as the "earth shaker"? A) Hades B) Zeus C) **Poseidon ✔** D) Hermes
22. The job of the Erinyes or Furies is to: A) accompany and serve Aphrodite B) forge thunderbolts for Zeus C) escort people to the underworld D) **punish people who kill their kin ✔** *(A = Cupids, B = Cyclopes, C = Hermes)*
23. The Greek practice of recognizing foreign deities simply as versions of Greek deities was called: A) **syncretism ✔** B) anthropomorphism C) deification D) catasterism
24. Aphrodite loved the handsome Adonis, who was: A) killed by Apollo & condemned to Tartarus B) deified & honored with annual sacrifices C) **killed by a boar & lamented in an annual ritual ✔** D) shared between Aphrodite & Artemis
25. The "hundred-handers" assist Zeus and the Olympians in the Titanomachy by: A) **hurling boulders ✔** B) hurling spears C) forging thunderbolts D) crafting arrows
26. Hera is the unhappy mother of: A) Argus B) **Hephaestus ✔** C) Hermes D) Atlas
27. This image depicts *(img08 crop of lyre)*: A) the Phaeacian singer Demodocus B) Homer pouring a drink offering C) **the turtle-shell lyre Hermes gave Apollo ✔** D) Apollo's silver bow
28. This image illustrates one representation of the monster *(img03b)*: A) Polyphemus B) Cerberus C) **Typhoeus ✔** D) Python
29. Pandora's name means: A) **all gifts ✔** B) all virtues C) the love of gods D) the love of mortals
30. How do Apollo and Hermes become reconciled in the Homeric Hymn to Hermes? A) Hermes vows to build a shrine for Apollo B) Apollo acknowledges Hermes as his son C) Apollo gives Hermes the title of Olympian god D) **Hermes gives Apollo the gift of a lyre ✔**
31. The figure in this image has the characteristic iconography of *(img09)*: A) Apollo B) Ares C) **Hermes ✔** D) Hephaestus
32. What English word is derived from the name Pan, because of his tendency to alarm rural travelers? A) pandemic B) pancreas C) **panic ✔** D) pander
33. What was the legendary doctor Asclepius famous for? A) dissecting human bodies B) taming Chiron the centaur C) **bringing the dead back to life ✔** D) killing deadly serpents
34. What story is depicted here? *(img01)* A) **Artemis and Apollo killing Niobe's children ✔** B) Apollo killing Python C) Achilles at Troy D) Actaeon killed by his dogs
35. What story is depicted here, and which gods? *(img06)* A) **Birth of Pandora — Zeus, Hermes, Epimetheus, Pandora ✔** B) Wedding of Hera and Zeus C) Birth of Athena D) Hermes presenting Ganymede to Zeus
36. What story is depicted here? *(img14)* A) Birth of Aphrodite B) **Birth of Athena from Zeus' head ✔** C) Zeus swallowing Metis D) Prometheus creating humans
37. Helios is best described as: A) an early solar form of Apollo worshipped in great temples B) **a sun god who drives a chariot and was later identified with Apollo ✔** C) Apollo's son D) a Mesopotamian sun god
38. The Deucalion & Pyrrha story explains the origin of: A) the Titans B) **the Greek peoples (via Hellen) ✔** C) the Olympians D) the Trojans
39. What is to the right of Pan when he chases a shepherd *(slide-images/pan-chasing-shepherd.jpg)*? A) **a herm ✔** B) an altar to Zeus C) a tree D) a lyre
40. Which of the following is NOT a flood survivor? A) Utnapishtim B) Noah C) Deucalion D) **Marduk ✔**

### 7.3 Section B — New questions (130) by topic
Format: `Question — A / B / C / D — ✔answer — why`.

**Myth theory & concepts (`myth-theory`, `concepts`)**
41. A myth is best defined as — A private dream / **a traditional story with collective importance, especially about gods** / a true historical account / a modern novel — ✔B
42. Stories about human heroes set in the past are — divine myths / **legends** / folktales / hymns — ✔B
43. Stories about ordinary people and talking animals are — legends / theogonies / **folktales** / epics — ✔C
44. An etiological story — **explains how something came to be** / tells of the gods' birth / predicts the future / praises a hero — ✔A
45. Which is an etiological myth? — Achilles' anger / **why the laurel is Apollo's sacred tree** / Priam's ransom / the Titanomachy's length — ✔B
46. "Cosmogony" means — **story of the creation of the world** / story of the creation of the gods / study of stars / battle of Titans — ✔A
47. "Theogony" means — **story of the creation (birth) of the gods** / worship of gods / hatred of gods / the end of the world — ✔A
48. The "birthing vs. crafting" analogy describes — **two models of creation** / two kinds of hospitality / two types of oracle / two kinds of heroes — ✔A
49. Which is creation by *crafting*? — Gaea bearing Uranus / **Prometheus shaping humans from mud** / Chaos arising / Cronus and Rhea's children — ✔B
50. Which is creation by *birthing*? — Marduk splitting Tiamat / Hephaestus making Pandora / **Gaea and Uranus producing the Titans** / Deucalion throwing stones — ✔C
51. "Apotropaic" means — **warding off evil** / blending gods / human-shaped / relating to the dead — ✔A
52. Which object is apotropaic? — lyre / **herm** / laurel / trident — ✔B
53. Identifying Roman Venus with Greek Aphrodite is an example of — anthropomorphism / **syncretism** / catasterism / etiology — ✔B
54. Turning someone into a star is — deification / **catasterism** / syncretism / apotheosis by fire — ✔B
55. Hellen gives his name to the Greeks, so he is an — etiological hero / **eponymous ancestor** / apotropaic figure / Titan — ✔B
56. The idea that no version of a myth is more "authentic" means myth is — a single text / **the complex of all its variants** / only the oldest version / only Homer's version — ✔B

**Succession & creation (`succession`)**
57. According to Hesiod, what came into being first? — Gaea / **Chaos** / Uranus / Eros — ✔B
58. Which is NOT one of the first primordial beings in the Theogony? — Chaos / Gaea / Tartarus / **Zeus** — ✔D
59. In Hesiod, Eros is — the son of Ares / **a primordial force of love** / a Titan / a Cyclops — ✔B
60. Uranus is — **the sky, who with Gaea fathers the earliest beings** / god of the sea / the underworld / a Mesopotamian god — ✔A
61. Who castrates Uranus? — Zeus / **Cronus** / Oceanus / Prometheus — ✔B
62. What is born from the sea foam around Uranus' severed genitals? — Athena / **Aphrodite** / Hera / Eros — ✔B
63. What arises from Uranus' blood falling on Earth? — the Muses / **the Furies (Erinyes)** / the Nymphs of the sea / Pan — ✔B
64. Cronus swallows his children because — he is hungry / **he fears a son will overthrow him** / Gaea orders him / Zeus tricks him — ✔B
65. What does Rhea give Cronus instead of Zeus? — a goat / **a stone in swaddling clothes** / a lyre / fire — ✔B
66. The Titanomachy is — the birth of the Titans / **the battle between the Titans and the Olympians** / Prometheus' punishment / a flood — ✔B
67. What do the Cyclopes give Zeus? — boulders / **the thunderbolt** / the aegis / a trident — ✔B
68. After their defeat, the Titans are imprisoned in — Olympus / **Tartarus** / Delos / Crete — ✔B
69. Typhoeus is — a Titan / **a snake monster defeated by Zeus** / a son of Hera by Zeus / a Mesopotamian god — ✔B
70. Why does Zeus swallow Metis? — she stole fire / **to prevent a child from overthrowing him** / she offended Hera / she was a monster — ✔B
71. Metis' name means — beauty / **cleverness** / justice / sky — ✔B
72. The succession myth is best exemplified by — Ovid's Metamorphoses / **Hesiod's Theogony (Uranus, Cronus, Zeus)** / Homer's Odyssey / Aeschylus — ✔B
73. "Titans" are — **children of Gaea and Uranus who fought the Olympian gods** / sons of Zeus / Mesopotamian gods / the first humans — ✔A
74. Oceanus is — **god of the Ocean, a creator** / god of rivers only / son of Poseidon / a Cyclops — ✔A
75. Atlas' job is — forging thunderbolts / **holding up the sky** / guarding Tartarus / carrying messages — ✔B
76. Gaea is described as — **earth, mother of creation, then monsters** / goddess of marriage / sky / goddess of the hearth — ✔A
77. Which god is the youngest son of Cronus and Rhea in Hesiod? — Poseidon / Hades / **Zeus** / Hephaestus — ✔C

**Mesopotamia (`mesopotamia`)**
78. The *Enuma Elish* is — a Greek hymn / **the Babylonian creation story of Tiamat and Marduk** / a Roman poem / a Hebrew flood story — ✔B
79. Tiamat is — **a Mesopotamian salt-water goddess sometimes shown as a snake** / a sky god / a love goddess / a hero — ✔A
80. Marduk — **defeats Tiamat and becomes king of the gods** / floods the world / invents the lyre / steals fire — ✔A
81. An/Anu is the Mesopotamian — **sky god** / sea goddess / love goddess / flood hero — ✔A
82. Inanna/Ishtar is the Mesopotamian goddess of — the hearth / **love and war** / the sea / hunting — ✔B
83. Adonis corresponds to the Mesopotamian dying god — Marduk / **Dumuzi (Tammuz)** / Anu / Utnapishtim — ✔B
84. The Babylonian flood survivor is — Noah / **Utnapishtim** / Deucalion / Hellen — ✔B
85. The Greek myth closest to Marduk vs. Tiamat is — Hermes vs. Apollo / **Zeus vs. Typhoeus** / Athena vs. Poseidon / Apollo vs. Niobe — ✔B
86. In the *Enuma Elish*, Marduk makes the world by — being born from Tiamat / **splitting Tiamat's body into sky and earth** / throwing stones / singing — ✔B
87. Flood stories appear in — **Gilgamesh, Genesis, and Ovid's Metamorphoses** / only Hesiod / only Homer / only the Homeric Hymns — ✔A
88. The shared pattern of flood stories is — **human failure, mass destruction, survivors, repopulation** / a war between gods / a god's birth / a contest — ✔A

**Prometheus, Pandora, Ages, Flood (`prometheus`, `flood`)**
89. Prometheus' name means — afterthought / **forethought** / all gifts / cleverness — ✔B
90. Epimetheus is — **Prometheus' brother who marries Pandora** / Zeus' son / a Cyclops / Atlas' father — ✔A
91. Prometheus gives humans — the lyre / **fire** / wine / the plow — ✔B
92. At Mecone Prometheus tricks Zeus into choosing — the meat / **the bones wrapped in fat** / the wine / the grain — ✔B
93. Prometheus' punishment is — being turned into a rock / **being chained while an eagle eats his liver** / holding up the sky / exile to Cyprus — ✔B
94. In *Prometheus Bound*, who binds Prometheus to the rock? — Zeus / Hermes / **Hephaestus** / Atlas — ✔C
95. *Prometheus Bound* was written by — Hesiod / Homer / **Aeschylus** / Ovid — ✔C
96. Pandora was created to — help Epimetheus / **punish mankind** / guard fire / serve Hera — ✔B
97. Who crafts Pandora? — Prometheus / **Hephaestus** / Athena / Hermes — ✔B
98. Who gives Pandora a deceptive mind and speech and brings her to Epimetheus? — Apollo / **Hermes** / Ares / Poseidon — ✔B
99. What remains in Pandora's jar? — fire / **hope** / death / love — ✔B
100. Hesiod's Five Ages of Man go from — iron to gold / **gold to iron** / bronze to silver / heroes to gods — ✔B
101. The Five Ages are found in Hesiod's — Theogony / **Works and Days** / Iliad / Hymn to Hermes — ✔B
102. Which age is the exception to the decline? — Silver / Bronze / **Heroes** / Iron — ✔C
103. We live in the age of — gold / bronze / heroes / **iron** — ✔D
104. What provokes Zeus to flood the world in Ovid? — Prometheus' theft / **Lycaon serving him human flesh** / Niobe's boasting / Arachne's weaving — ✔B
105. Deucalion's father is — Epimetheus / **Prometheus** / Zeus / Atlas — ✔B
106. How do Deucalion and Pyrrha repopulate the earth? — they have 100 children / **they throw stones that become people** / Zeus makes new people / Prometheus molds clay — ✔B
107. Who created humans from mud (with Athena present) in the Louvre relief? — Hephaestus / **Prometheus** / Zeus / Marduk — ✔B

**Zeus, Hera, siblings (`zeus-hera`)**
108. Zeus enforces — war and plague / **justice and hospitality** / music and poetry / crafts — ✔B
109. "Xenia" means — justice / **hospitality between guests and hosts** / fate / sacrifice — ✔B
110. "Dikē" means — **justice, proper treatment of others** / hospitality / madness / victory — ✔A
111. Which is good xenia? — Lycaon's feast / **Achilles giving Priam food and a bed** / Cronus swallowing his children / Zeus stealing Ganymede — ✔B
112. Ganymede is — **a Trojan prince stolen by Zeus who becomes immortal** / a son of Hermes / a Titan / a Cyclops — ✔A
113. Callisto was turned into — a spider / a deer / **a bear** / a tree — ✔C
114. Hera is goddess of — the hearth / **marriage** / hunting / love — ✔B
115. In Greek art, hand-clasping signifies — war / **marriage** / death / prophecy — ✔B
116. Hestia is goddess of — **the hearth** / the harvest / the moon / marriage — ✔A
117. Hades is — god of the sea / **god of the dead** / god of war / god of the sun — ✔B
118. Poseidon's gift in the contest for Athens was — the olive / **a salt-water spring** / the owl / the lyre — ✔B
119. Mt. Olympus is — **home of the 12 Olympian gods** / Apollo's birthplace / Aphrodite's island / the oracle of Apollo — ✔A
120. The Furies are — muses / **vengeance goddesses** / nymphs of the sea / the Fates — ✔B
121. Which of these is NOT a child of Cronus and Rhea? — Hera / Hestia / Poseidon / **Athena** — ✔D

**Apollo & Artemis (`apollo-artemis`)**
122. Apollo is god of — **disease, healing, poetry, music** / war, crafts / travelers, thieves / the sea — ✔A
123. Artemis is goddess of — **hunting, death of women** / love / hearth / cities — ✔A
124. The mother of Apollo and Artemis is — Hera / Maia / **Leto** / Metis — ✔C
125. Apollo and Artemis were born on — Crete / **Delos** / Cyprus / Olympus — ✔B
126. The Homeric Hymn to Apollo's Delos story is an etiology of — the lyre / **Apollo's sanctuary on Delos** / the laurel / the Olympics — ✔B
127. Apollo defeats which creature at Delphi? — Typhoeus / Tiamat / **Pytho(n)** / Cerberus — ✔C
128. The Pythia is — a snake / **the oracle (priestess) at Delphi** / Apollo's sister / a Muse — ✔B
129. Delphi is — Athena's city / **the shrine and oracle of Apollo** / Aphrodite's island / home of the gods — ✔B
130. Daphne was turned into — a spider / a bear / **a (laurel) tree** / reeds — ✔C
131. Coronis is — Apollo's sister / **Apollo's cheating girlfriend, mother of Asclepius** / a Muse / a Fury — ✔B
132. Asclepius is — **mortal son of Apollo & Coronis, then god of healing** / son of Zeus & Hera / a centaur / a Titan — ✔A
133. Hyacinth was — **a boy loved and accidentally killed by Apollo** / a nymph loved by Pan / a Trojan prince / a hunter — ✔A
134. Cassandra's punishment was — to age without youth / **to prophesy and be disbelieved** / to become a tree / to become a bear — ✔B
135. The Sibyl of Cumae was condemned to — **age without youth** / be disbelieved / become a spider / wander forever — ✔A
136. Actaeon was — **turned into a deer by Artemis and killed by his own dogs** / turned into a wolf by Zeus / killed by a boar / made a constellation — ✔A
137. Niobe lost her children because she — insulted Athena / **boasted (over Leto)** / cheated on Apollo / stole fire — ✔B
138. Orion is a famous — musician / **hunter** / king of Troy / smith — ✔B
139. Who kills Niobe's children? — Zeus & Hera / **Artemis & Apollo** / Ares & Aphrodite / Hermes & Pan — ✔B

**Hermes & Pan (`hermes-pan`)**
140. Hermes is god of — **travelers, thieves, messengers, oratory** / the forge / the sea / marriage — ✔A
141. Hermes' mother is — Leto / **Maia** / Hera / Metis — ✔B
142. The caduceus is — Athena's goatskin / **the twin-snake staff of Hermes** / Apollo's lyre / Zeus' thunderbolt — ✔B
143. The lyre was — invented by Apollo / **invented by Hermes, given to Apollo** / invented by Pan / a gift from Zeus — ✔B
144. What did baby Hermes steal? — fire / **Apollo's cattle** / Zeus' thunderbolt / Athena's aegis — ✔B
145. Herms are — **pillars with heads of Hermes plus genitals, marking boundaries** / Hermes' sandals / songs to Hermes / a type of lyre — ✔A
146. Pan is — **a goat-shaped god of the wild, son of Hermes** / a Titan / a son of Apollo / a sea god — ✔A
147. Pan pipes come from — Daphne / **Syrinx, a nymph turned into reeds** / Echo / Maia — ✔B
148. Hermaphroditus is the child of — Zeus & Hera / **Hermes & Aphrodite** / Ares & Aphrodite / Apollo & Artemis — ✔B
149. Priapus' statues were used to — honor the dead / **ward off evil** / mark the Olympics / tell the future — ✔B

**Aphrodite, Hephaestus, Ares, Eros (`aphrodite`, `hephaestus-ares`)**
150. Cyprus is — **Aphrodite's island** / Apollo's birthplace / Zeus' birthplace / Athena's city — ✔A
151. Anchises is — **loved by Aphrodite, father of Aeneas** / king of Troy / a son of Hermes / a hunter — ✔A
152. Myrrha — **slept with her father, became a tree, and was mother of Adonis** / was turned into a spider / was loved by Apollo / was Pan's nymph — ✔A
153. Pygmalion — **created a perfect woman (Galatea) as a statue** / stole fire / was killed by a boar / was a king of Troy — ✔A
154. Eros is — **Love, a primordial force / son of Aphrodite** / god of war / god of the sea — ✔A
155. Hephaestus is god of — **metalworking and crafts** / war / travelers / the sun — ✔A
156. In Odyssey 8, Hephaestus catches — **Ares and Aphrodite in a net** / Zeus and Hera / Hermes stealing / Prometheus stealing fire — ✔A
157. Ares is — **god of war** / god of the dead / god of the forge / god of the sun — ✔A
158. Hephaestus made armor for which hero at Thetis' request? — Odysseus / **Achilles** / Aeneas / Priam — ✔B

**Athena (`athena`)**
159. Athena is goddess of — **cities, crafts, wisdom, war** / love / hunting / the hearth — ✔A
160. Athena's mother is — Hera / **Metis** / Leto / Maia — ✔B
161. The aegis is — **the goatskin worn by Athena to frighten enemies** / Hermes' hat / Hera's veil / Zeus' scepter — ✔A
162. Arachne was turned into — **a spider** / a bear / a tree / a deer — ✔A
163. Athens is — **Athena's city** / Apollo's birthplace / Aphrodite's island / Poseidon's city — ✔A

**Sources (`sources`)**
164. The Homeric Hymn to Hermes tells of — **the lyre and the cattle theft** / Anchises / the flood / Prometheus — ✔A
165. The Homeric Hymn to Aphrodite tells of — **her love for Anchises** / Adonis' death / Pygmalion / her birth from foam only — ✔A
166. Ovid's *Metamorphoses* is famous for stories of — **transformation** / creation only / war at Troy / farming — ✔A
167. The Five Ages and the jar of Pandora appear in — **Works and Days** / Prometheus Bound / Enuma Elish / Iliad — ✔A

**Images & Maps & Roman names (`images`, `maps`, `roman-names`)**
168. *(img07)* This relief shows — **the wedding of Hera and Zeus** / Hephaestus and Thetis / Athena and Prometheus / Aphrodite and Anchises — ✔A
169. *(img04)* The figure holding up the sky is — Prometheus / **Atlas** / Zeus / Heracles — ✔B
170. *(map: circle on Cyprus)* Identify the island — Crete / Sicily / **Cyprus** / Delos — ✔C

**Bonus Roman-name matching** (Match Game, not MC): Zeus–Jupiter, Hera–Juno, Poseidon–Neptune, Hades–Pluto, Hestia–Vesta, Athena–Minerva, Artemis–Diana, Aphrodite–Venus, Ares–Mars, Hephaestus–Vulcan, Hermes–Mercury, Eros–Cupid, Cronus–Saturn, Apollo–Apollo.

### 7.4 Auto-generated questions (builder must implement)
To reach unlimited practice, generate MCQs from `terms.js`:
- **Term → definition**: "Who/what is *X*?" correct = guide text, 3 distractors = guide texts from the same `cat` (and preferably same cluster, for difficulty).
- **Definition → term**: "Which is *[guide text]*?" options = terms from the same category.
- **Image → story** and **clue → god** from `images.js`.
- **Map star/circle** from `places.js` (distractors from the distractor list, nearest first for difficulty).
- Tag auto-questions `auto` so the report distinguishes hand-written vs. generated.

---

## 8. Other modes & pages

### 8.1 Flashcards (`#/flash`)
- Deck picker: All · Divinities · Mortals · Concepts · Places · Sources · Images · Roman names · Clusters C1–C9 · **Fix My Mistakes** · **Due now** (Leitner).
- Card front: term (or image, or guide text for reverse). Back: guide text **bold**, then `more` facts, mnemonic, image thumbnail, related terms (links).
- Buttons: **Again** (box 1) · **Hard** (stay) · **Good** (+1 box) · **Easy** (+2). Keyboard 1/2/3/4.
- Recall timer on front (goal < 5 s; shows your average).
- "Type the answer" toggle (fuzzy-match ≥ 80% similarity) for deeper retrieval.

### 8.2 Quiz (`#/quiz`)
- Choose tags + count (10/25/50) + mode (Learning: instant feedback with `why`; Test: feedback at end).
- 40-s pace bar per question.

### 8.3 Mock Exam (`#/mock`)
- **75 questions / 50:00 countdown**, a–d, flag, question navigator grid, submit.
- Draw: ~35% review+hand-written, ~15% images, ~5% maps, rest auto-generated, balanced across tags.
- Results: score %, time used, avg s/question, per-tag bar chart, list of misses with `why` → "Add all misses to Fix-My-Mistakes."
- History table of previous mocks (readiness trend).

### 8.4 Family Tree (`#/tree`)
Interactive, collapsible genealogy (SVG or nested HTML):
```
Chaos · Gaea · Tartarus · Eros
Gaea + Uranus → Titans (Cronus, Rhea, Oceanus+Tethys, Hyperion→Helios, Iapetus→[Prometheus, Epimetheus, Atlas], Themis, Mnemosyne, Leto*…), Cyclopes, Hundred-handers
Uranus' genitals + sea → Aphrodite     Uranus' blood + Gaea → Furies
Gaea + Tartarus → Typhoeus
Cronus + Rhea → Hestia, Demeter, Hera, Hades, Poseidon, Zeus
Zeus + Metis → Athena (from head)      Zeus + Hera → Ares, (Hephaestus: Hera alone in Hesiod)
Zeus + Leto → Apollo, Artemis          Zeus + Maia (daughter of Atlas) → Hermes → Pan
Apollo + Coronis → Asclepius           Hermes + Aphrodite → Hermaphroditus
Aphrodite + Anchises → Aeneas          Myrrha (+ her father) → Adonis
Prometheus → Deucalion  +  Pyrrha ← Epimetheus + Pandora  →  Hellen → Dorus, Aeolus, Xuthus → Ion
```
*(Leto is a Titaness, daughter of the Titans Coeus and Phoebe.)* Quiz mode: hide a node, pick the missing name.

### 8.5 Match Games (`#/match`)
Drag-and-drop or tap-pairs, timed: Greek ↔ Roman; Greek ↔ Mesopotamian parallel; Mortal ↔ fate (spider, bear, deer, tree, disbelieved, age without youth…); God ↔ attribute; Name ↔ meaning; Text ↔ content.

### 8.6 Story Mode (`#/learn`)
The 9 clusters from §4.2 as swipeable cards; each ends with a 3-question mini-check (retrieval immediately after reading).

### 8.7 Cheat Sheet (`#/cheatsheet`)
Printable one-page (CSS `@media print`) with the Final 10, attribute table, mnemonic list, map thumbnails. (For study only, not for the CBTF.)

### 8.8 Resources page (external, open in new tab)
- Crash Course World Mythology playlist: https://www.youtube.com/playlist?list=PLEb6sGT7oD8G8nPbyvObaZUNdfV6kitZQ (start with #2 *Creation from the Void*: https://thecrashcourse.com/courses/creation-from-the-void-crash-course-world-mythology-2/)
- Quizlet sets (other schools, same textbook — skip terms not on the guide): https://quizlet.com/411889980/classical-myth-powell-ch-1-9-flash-cards/ · https://quizlet.com/84501075/classical-myth-powell-quiz-1-chapters-1-3-flash-cards/ · https://quizlet.com/46190940/classical-myth-powell-chapter-9-flash-cards/
- Theoi Greek Mythology (encyclopedia + ancient art per god): https://www.theoi.com
- CBTF student page / PrairieTest: https://cbtf.illinois.edu/students
- Checklist: "Retook all Canvas quizzes (weeks 1–5)" ☐

### 8.9 Home dashboard (`#/home`)
Countdown · "CBTF booked?" checkbox · overall readiness % (= mastered cards / total × 0.5 + last mock % × 0.5) · per-category progress bars · "Next best action" button (picks the weakest tag / due cards) · today's protocol step (§2.1).

---

## 9. Build order (so something usable exists within ~1 hour)
1. `data/*.js` from §4–§7 (copy verbatim).
2. Quiz engine + Section A review questions → **usable immediately**.
3. Flashcards with Leitner.
4. Picture Quiz (formats 1, 2, 4, 5), then hotspots.
5. Map Test (Leaflet), offline fallback.
6. Mock Exam.
7. Tree, Match, Story, Cheat Sheet, Dashboard polish.

## 10. Acceptance checklist (builder verifies before handing over)
- [ ] Every study-guide term (§4.3–4.7) appears as a flashcard, with guide text **exactly** as written.
- [ ] All 15 image files load from `assets/exam-images/`; Picture Quiz never shows the answer in `alt`, filename text, or tooltip.
- [ ] All 7 tested places work in both map formats; Delos is clickable at default zoom (tolerance 30 km) or map auto-zooms to the Aegean.
- [ ] All 170 hand-written questions render; each has exactly one correct answer; option shuffle preserves correctness (write a small console self-test: for each q, `opts[ans]` equals the displayed correct option after shuffle).
- [ ] Mock exam = 75 Q, 50:00 timer, auto-submits at 0.
- [ ] Works from `file://`; works at 375 px width; works with `localStorage` disabled.
- [ ] Dark mode readable.
- [ ] Run a quick Playwright smoke test: load each route, answer 3 questions, flip 3 cards, click the map once; no console errors.

---

## 11. Accuracy notes (where sources vary — the site should show these as "Heads-up" boxes)
- **Niobe's children**: study guide says **twelve** (Homer); Ovid says fourteen. On the exam → **twelve**.
- **Pygmalion's statue**: study guide says **marble**; Ovid says ivory. Either way: perfect woman statue, Cyprus, brought to life by Aphrodite.
- **Aphrodite's birth**: Hesiod = from Uranus' genitals/sea foam; Homer = daughter of Zeus & Dione. The image (rising from the sea) = Hesiod's version.
- **Hephaestus' parents**: Hesiod = Hera alone; Homer = Zeus & Hera. Either way: "Hera is the unhappy mother of Hephaestus."
- **Eros**: primordial force (Hesiod) **and** son of Aphrodite (later) — the guide accepts both.
- **Pandora's "box"** is really a jar (pithos).
- **Helios vs. Apollo**: separate early; identified later → evidence that **gods change over time**.
- **Tartarus**: both a primordial being (monster) and a place in the underworld.
