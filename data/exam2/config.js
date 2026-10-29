// Exam 2 settings read by app.js and modes/*.js (anything not set falls back to the Exam 1 behavior).
// Plan: docs/exam2/00-website-plan.md.
window.DATA_CONFIG = {
  title: "Exam 2",
  storageKey: "clcv115_e2_v1",
  imgDir: "assets/exam2/exam-images/",
  imagesTested: 13,
  roman: false,
  // Sun Nov 1 2026, 11:59 PM Central — daylight time ends that morning, so CST (UTC−6)
  examEnd: Date.UTC(2026, 10, 2, 5, 59, 0),
  homeSub: "CBTF window Thu Oct 29 – Sun Nov 1, 2026 · 75 multiple-choice questions in 50 minutes (≈ 40 s each) · Powell ch. 10–14, 16–18 (not 15) + lectures, emphasis weeks 6–9.",
  countdownLabel: "Time left in the exam window (closes Sun Nov 1, 11:59 PM CT)",

  tags: ["review", "inclass", "crq", "demeter", "dying-gods", "dionysus", "underworld", "gilgamesh", "perseus", "thebes", "athens", "crete",
    "patterns", "sources", "images", "maps", "lecture"],
  tagLabel: {
    review: "Review lecture (Oct 27)", inclass: "In-class questions", crq: "Reading questions", demeter: "Demeter & Eleusis", "dying-gods": "Dying gods & syncretism",
    dionysus: "Dionysus", underworld: "Underworld", gilgamesh: "Gilgamesh & heroes", perseus: "Perseus & Argos", thebes: "Thebes & Oedipus",
    athens: "Athens & Theseus", crete: "Crete", patterns: "Story patterns & concepts", sources: "Source texts", images: "Images", maps: "Maps",
    lecture: "Lecture slides", auto: "Auto-generated"
  },
  clusterTag: { e2c1: "demeter", e2c2: "dying-gods", e2c3: "dionysus", e2c4: "underworld", e2c5: "gilgamesh", e2c6: "perseus", e2c7: "thebes",
    e2c8: "athens", e2c9: "crete", e2c10: "patterns" },
  termTag(t) {
    if (t.cat === "source") return "sources";
    if (t.cat === "place") return "maps";
    if (t.cat === "crq") return "crq";
    return this.clusterTag[t.cluster] || "patterns";
  },
  // mock: tags that say where a question comes from rather than its topic (topic balancing skips them)
  metaTags: ["review", "inclass", "crq", "lecture"],
  mockMix: { hand: 0.72, img: 0.15, map: 0.07, lecture: 0.22, mapHand: 3 },
  mockText: "~55% course-reading-question items (the professor: “most test questions are based on these”), ~15% lecture slides and in-class/review questions, ~15% images, ~7% maps, the rest generated from the study-guide terms — balanced across all ten story clusters.",

  // maps: Attica close-up first (Athens / Eleusis are only 18 km apart), then the Aegean, then Greece → Mesopotamia
  maps: ["attica", "aegean", "wide"],
  mapNames: { attica: "Attica, Boeotia & the Argive plain", aegean: "The Aegean", wide: "Greece to Mesopotamia" },
  regionFit: true,
  areaIds: ["greece", "mesopotamia", "argive", "crete", "attica", "boeotia", "arcadia", "euboea", "cyprus", "rhodes", "egypt", "anatolia", "italy", "persia", "phoenicia"],

  review: {
    tags: ["inclass", "review"],
    title: "Review & In-Class Questions",
    intro: (n) => `All ${n} questions shown in lecture: the in-class Canvas questions (Sept 29 – Oct 22) and the Oct 27 review lecture. Exam 1 showed that in-class questions get recycled on the exam. Items whose answer the slides don't confirm are marked in the explanation and kept out of the mock exam.`
  },
  canvasText: "Retook all Canvas in-class quizzes (weeks 6–9)",
  canvasHome: "retook every Canvas in-class quiz from weeks 6–9",

  deckDesc: {
    crq: "the course reading questions — most exam questions come from these",
    divinity: "gods, monsters, demigods", mortal: "Aegeus → Tiresias", concept: "apple of discord → wrath story",
    place: "the 10 map places", source: "Bacchae, Odyssey, Hymns, Ovid, Oedipus, Aeneid", lecture: "names & terms from the Sept 29 – Oct 22 slides + Powell",
    images: "the 13 tested images"
  },
  attrTitle: "Attribute → who",
  transferLinks: `<a href="https://commons.wikimedia.org/wiki/Category:Dionysus_in_ancient_Greek_pottery" target="_blank" rel="noopener">Dionysus</a> ·
    <a href="https://commons.wikimedia.org/wiki/Category:Perseus_in_ancient_Greek_pottery" target="_blank" rel="noopener">Perseus</a> ·
    <a href="https://commons.wikimedia.org/wiki/Category:Theseus_in_ancient_Greek_pottery" target="_blank" rel="noopener">Theseus</a> ·
    <a href="https://commons.wikimedia.org/wiki/Category:Oedipus_and_the_Sphinx" target="_blank" rel="noopener">Oedipus and the Sphinx</a> ·
    <a href="https://www.theoi.com" target="_blank" rel="noopener">theoi.com</a>`,

  protocolTitle: "Study protocol (the exam window is open — short version first)",
  protocolSub: "Retrieval practice + spacing + interleaving, weighted the way the professor said the exam is written. Tick blocks off as you go.",
  protocol: [
    ["30 min", "Story Mode — the 10 clusters (read cluster 10, the story patterns, twice)", "#/learn"],
    ["45 min", "Flashcards: Reading Questions until every card is box ≥ 2", "#/flash/crq"],
    ["45 min", "Flashcards: Divinities + Mortals", "#/flash/mortal"],
    ["20 min", "Flashcards: Concepts + Sources", "#/flash/concept"],
    ["20 min", "Picture Quiz until 100% twice in a row", "#/pictures"],
    ["10 min", "Map Test until 100% twice in a row", "#/map"],
    ["15 min", "Review & in-class questions", "#/review"],
    ["break", "Sleep if possible (spacing!)", null],
    ["50 min", "Mock Exam #1 → then Fix-My-Mistakes", "#/mock"],
    ["50 min", "Mock Exam #2 (new draw). Target ≥ 95%", "#/mock"],
    ["10 min", "“Final 10” sheet right before walking to the CBTF", "#/cheatsheet"]
  ],
  homeExtra: `<div class="card"><h2>Exam tips from the Oct 27 review</h2><ol class="small">
    <li><b>Study from the course reading questions</b> — most test questions are based on them; everything tested is on the checklist; a few come straight from the slides.</li>
    <li>Pronounce, listen to, or write the names (Powell's index has pronunciations) — and read the options carefully: Amazon / Actaeon / Aeneas / Antiope.</li>
    <li>Bring photo ID (i-card).</li>
    <li>If distractions bother you, book a smaller CBTF lab at a less popular time.</li>
    <li>Form a study group.</li>
    <li>Read the primary sources in Powell — they are tested.</li>
    <li>Save unsure questions and come back to them (PrairieTest allows it) — but watch the clock.</li>
    <li>Eat and sleep well.</li>
    <li>Anxious? “I can be anxious later. Right now I'm focusing on the exam.”</li>
    <li><b>Sign up</b> at cbtf.illinois.edu and <b>take the exam by Sunday, Nov 1</b>.</li></ol>
    <p class="small muted">Powell's index is available in the exam as a PDF — practice with the index-lookup drill on the Resources page.</p></div>`,

  lecturesNote: "Sources: the slide decks for Sept 29, Oct 6, 13, 15, 20, 22 and the Oct 27 review. No deck was provided for Oct 1 (Dionysus) or Oct 8 (Gilgamesh) — those pages come from Powell and the review slides.",

  treeIntro: "The family trees the reading questions ask you to draw (House of Cadmus, the line of Io and Perseus, Athens, Crete, Adrastus). Tap a name to expand/collapse; the quiz hides one name.",
  tree: (N) => [
    Object.assign(N("Agenor", "king of Phoenicia", [["children", [
      N("Europa", "carried off by Zeus as a bull", [["+ Zeus", [N("Minos", "king of Crete"), N("Sarpedon"), N("Rhadamanthys", "judge of the dead")]]]),
      N("Cadmus", "founder of Thebes", [["+ Harmonia (daughter of Ares & Aphrodite)", [
        N("Semele", "burned by Zeus' glory", [["+ Zeus", [N("Dionysus", "twice-born; + Ariadne")]]]),
        N("Ino", "nurse of Dionysus → Leucothea", [["+ Athamas", [N("Melicertes")]]]),
        N("Agave", "kills her son", [["+ Echion (one of the Spartoi)", [N("Pentheus", "king, torn apart")]]]),
        N("Autonoë", "", [["", [N("Actaeon", "stag, killed by his hounds")]]]),
        N("Polydorus", "", [["", [N("Labdacus", "", [["", [N("Laius", "king, killed at the crossroads", [["+ Jocasta", [
          N("Oedipus", "“swollen foot”", [["+ Jocasta (his own mother)", [N("Eteocles", "won't share the throne"), N("Polynices", "leads the Seven"), N("Antigone", "buries Polynices"), N("Ismene")]]])]]])]]])]]])]]]),
      N("Phoenix", "stays in Phoenicia"), N("Cilix", "settles Cilicia")]]]), { root: true }),
    N("Menoeceus", "", [["", [N("Jocasta", "wife of Laius, then of Oedipus"), N("Creon", "king after Oedipus' sons")]]]),
    (() => {
      // the line of Io → Perseus, built bottom-up
      const perseus = N("Perseus", "Gorgon-slayer, founds Mycenae", [["+ Andromeda", [N("Perses", "ancestor of the Persians")]]]);
      const acrisius = N("Acrisius", "king of Argos", [["", [N("Danaë", "", [["+ Zeus (shower of gold)", [perseus]]])]]]);
      const proetus = N("Proetus", "king of Tiryns", [["", [N("Proetids", "think they are cows")]]]);
      const danaus = N("Danaus", "50 daughters (the Danaids)", [["", [N("Hypermnestra", "spared her husband", [["+ Lynceus", [N("Abas", "", [["", [acrisius, proetus]]])]]])]]]);
      const belus = N("Belus", "", [["", [N("Aegyptus", "50 sons"), danaus, N("Cepheus", "", [["+ Cassiopea", [N("Andromeda", "chained to a rock")]]])]]]);
      const io = N("Io", "turned into a cow", [["+ Zeus", [N("Epaphus", "born in Egypt", [["+ Memphis", [N("Libya", "", [["+ Poseidon", [belus]]])]]])]]]);
      return Object.assign(N("Inachus", "river god of the Argive plain", [["+ Melia (an ash nymph)", [io]]]), { root: true });
    })(),
    Object.assign(N("Cecrops", "earth-born first king, snake below the waist", [["daughters", [N("Aglaurus", "looked in the basket"), N("Herse", "looked in the basket", [["+ Hermes", [N("Cephalus", "+ Procris")]]]), N("Pandrosus", "obeyed Athena")]]]), { root: true }),
    N("Hephaestus", "", [["+ Athena / Gaea (the earth)", [N("Erichthonius", "“wool + earth”", [["", [N("Pandion", "king of Athens", [["", [
      N("Procne", "", [["+ Tereus (son of Ares)", [N("Itys", "killed by his mother")]]]), N("Philomela", "tongue cut out; weaves the story"),
      N("Erechtheus", "", [["", [N("Procris", "+ Cephalus")]]])]]])]]])]]]),
    N("Pittheus", "king of Troezen", [["", [N("Aethra", "", [["+ Aegeus and Poseidon", [N("Theseus", "kills the Minotaur", [["+ Antiope / Hippolyta (Amazon)", [N("Hippolytus", "“undone by horses”")]]])]]])]]]),
    N("Helios", "the Sun", [["+ Perseis", [N("Pasiphaë", "", [["+ Minos", [N("Ariadne", "+ Dionysus"), N("Phaedra", "+ Theseus"), N("Androgeus", "killed by the Marathonian bull")]], ["+ Poseidon's bull", [N("Minotaur", "“bull of Minos”")]]]),
      N("Aeëtes", "king of Colchis", [["", [N("Medea", "witch; wife of Aegeus")]]]), N("Circe", "witch")]]]),
    N("Autolycus", "trickster, son of Hermes", [["", [N("Anticlea", "dies of grief", [["+ Laertes", [N("Odysseus", "", [["+ Penelope", [N("Telemachus")]]])]]])]]]),
    N("Agamemnon", "leader at Troy", [["+ Clytemnestra (his murderer)", [N("Orestes"), N("Electra")]]]),
    N("Adrastus", "king of Argos, sole survivor of the Seven", [["daughters", [N("Argeia", "+ Polynices"), N("Deipyle", "+ Tydeus")]]]),
    N("Eriphyle", "Adrastus' sister, bribed with Harmonia's necklace", [["+ Amphiaraus (seer)", [N("Alcmaeon", "avenges his father")]]])
  ],

  matchSets: () => ({
    katabasis: { name: "Why they went to the Underworld", pairs: [["Dumuzi", "sent by an angry Inanna"], ["Persephone", "stolen by Hades"], ["Odysseus", "sent by Circe to meet Tiresias"],
      ["Orpheus", "to retrieve Eurydice"], ["Theseus", "to steal Persephone for his friend"], ["Aeneas", "sent by his father, to learn Rome's future"], ["Heracles", "to fetch Cerberus"], ["Dionysus", "to bring back his mother Semele"]] },
    sinners: { name: "Sinner ↔ crime / punishment", pairs: [["Tantalus", "served his son Pelops → endless hunger & thirst"], ["Sisyphus", "cheated Death → boulder uphill"],
      ["Ixion", "lusted after Hera → fiery wheel"], ["Danaids", "killed their husbands → leaky jars"]] },
    labors: { name: "Theseus' road villains", pairs: [["Periphetes", "club-man (Theseus keeps the club)"], ["Sinis", "pine-bender"], ["Crommyonian sow", "giant pig bred by Phaea"],
      ["Sciron", "foot-washing, kicks travelers off a cliff"], ["Cercyon", "wrestler"], ["Procrustes", "stretches or cuts guests to fit his bed"], ["Marathonian bull", "sent by Medea; sacrificed to Apollo"]] },
    patterns: { name: "Pattern ↔ example", pairs: [["Wrath story", "Demeter and Persephone"], ["Divine visit (theoxeny)", "Dionysus and the pirates"], ["Girl's tragedy", "Danaë"],
      ["Doomed wedding", "Peleus and Thetis"], ["Dying god", "Osiris"], ["Katabasis", "Aeneas, Aeneid 6"], ["Potiphar's wife", "Hippolytus"], ["Dragon slaying", "Cadmus and the serpent"],
      ["“All but one”", "Hypermnestra and the Danaids"], ["Double founding", "Thebes"], ["Etiological story", "Erichthonius → the Arrhephoria"]] },
    goddess: { name: "Goddess ↔ lost loved one", pairs: [["Demeter", "Persephone"], ["Isis", "Osiris"], ["Inanna", "Dumuzi"], ["Aphrodite", "Adonis"], ["Cybele", "Attis"]] },
    homer: { name: "Odyssey 11 ↔ Aeneid 6", pairs: [["Elpenor (unburied crewman)", "Palinurus"], ["Ajax (silent hatred)", "Dido"], ["Agamemnon (killed through his wife)", "Deiphobus"], ["Anticlea (parent, 3 embraces)", "Anchises"], ["Tiresias (seer)", "the Sibyl of Cumae (guide)"]] },
    sources: { name: "Source ↔ story", pairs: [["Euripides, Bacchae", "Pentheus torn apart"], ["Homer, Odyssey 11", "Odysseus consults Tiresias"], ["Homeric Hymn to Demeter", "Persephone & the Mysteries"],
      ["Homeric Hymn to Dionysus", "the pirates become dolphins"], ["Ovid, Metamorphoses", "Procne & Philomela; Icarus; Cadmus; Andromeda"], ["Ovid, Art of Love", "Pasiphaë (“not a Holstein”)"],
      ["Sophocles, Oedipus the King", "Oedipus blinds himself"], ["Sophocles, Antigone", "Antigone buries Polynices"], ["Vergil, Aeneid 6", "the golden bough"], ["Vergil, Georgics 4", "Orpheus and Eurydice"],
      ["Aeschylus, Prometheus Bound", "Io's wanderings"], ["Euripides, Hippolytus", "Phaedra's false letter"], ["Aeschylus, Seven against Thebes", "the brothers kill each other"]] },
    mothers: { name: "Mother ↔ child", pairs: [["Danaë", "Perseus"], ["Semele", "Dionysus"], ["Agave", "Pentheus"], ["Aethra", "Theseus"], ["Jocasta", "Oedipus"], ["Procne", "Itys"],
      ["Pasiphaë", "the Minotaur"], ["Isis", "Horus"], ["Europa", "Minos"], ["Antiope", "Amphion & Zethus"], ["Autonoë", "Actaeon"], ["Thetis", "Achilles"]] },
    meaning: { name: "Name ↔ meaning", pairs: [["Oedipus", "swollen foot"], ["Hippolytus", "undone by horses"], ["Erichthonius", "wool + earth"], ["Medusa (Eurymedousa)", "wide-ruling"],
      ["Minotaur", "bull of Minos"], ["Korê", "daughter/girl"], ["Psychopompos", "escorter of souls"], ["Apotropaic", "warding off evil"], ["Autochthony", "born from the soil"],
      ["Mysterion (muo)", "close the mouth"], ["Enthousiasmos", "filled with the god"], ["Spartoi", "sown men"], ["Graeae", "grey ones"], ["Hades", "the unseen one"], ["Pluto", "enricher"]] },
    place: { name: "Place ↔ meaning", pairs: (window.DATA_PLACES || []).filter((p) => p.tested).map((p) => [p.name, p.meaning]) }
  }),

  cheat: {
    final10: [
      "Most exam questions come from the <b>course reading questions</b> — know every one.",
      "<b>Wrath story</b> = offense → anger → destruction → appeasement → new ritual (Demeter & Persephone; Demeter at Eleusis; Dionysus at Thebes; Poseidon & Minos).",
      "<b>Divine visit (theoxeny)</b> = Dionysus & the pirates, Demeter at Eleusis. <b>Girl's tragedy</b> = Danaë, Io, Antiope.",
      "<b>Potiphar's wife</b> = Joseph, Bellerophon, Peleus, Hippolytus. <b>Doomed weddings</b>: Peleus–Thetis (apple of discord), Cadmus–Harmonia (necklace), Pirithous (centaurs).",
      "<b>Katabasis</b>: Odysseus → Tiresias (sent by Circe); Orpheus → Eurydice; Theseus → Persephone for Pirithous; Aeneas → Anchises, Rome's future. They come back alive.",
      "<b>Heroes</b> are <b>worshipped</b> at their tombs (hero cult, from c. 800 BCE) to seek their help — not deified.",
      "<b>Enkidu</b> civilized by the prostitute (Shamhat); <b>Humbaba</b> guards the cedar forest; <b>Bull of Heaven</b> sent at Ishtar's demand; snake steals the plant of youth.",
      "<b>Perseus</b>: Acrisius → Danaë (gold) → box → Dictys/Polydectes → Graeae, nymphs (cap, sandals, pouch) → Medusa → Andromeda (Ceto) → discus → founds Mycenae.",
      "<b>Thebes</b> = House of Cadmus (founded twice); <b>Corinth</b> = Polybus & Merope; <b>Argive plain</b> = Mycenae, Argos, Inachus; <b>Eleusis</b> = Demeter; <b>Crete</b> = Minos & Minotaur.",
      "Your professor's advice: <b>eat and sleep well</b> — and take the exam by Sunday."
    ],
    mnemonics: [
      "<b>Dionysus' women</b>: Bacchae = Bacchus-possessed · maenads = raging · thyiades = frenzied.",
      "<b>Underworld sinners</b> “Tantalizing Sisyphean Ixion Damned”: Tantalus (food & water), Sisyphus (stone), Ixion (wheel), Danaids (leaky jars).",
      "<b>Dying gods</b> “ODA-AP”: Osiris, Dumuzi, Adonis, Attis, Persephone.",
      "<b>Potiphar's wife</b> = “Just Bad Partner Habits”: Joseph, Bellerophon, Peleus, Hippolytus.",
      "<b>Theseus' road</b> from Troezen: “Please Stop Calling Sciron Cercyon's Pal” = Periphetes, Sinis, Crommyonian sow, Sciron, Cercyon, Procrustes.",
      "<b>Athenian origins</b> “CAA”: Cecrops, Autochthony, Athena.",
      "<b>Perseus' gear</b>: nymphs give Cap, Sandals, Sack; Hermes gives the sword (and shield).",
      "<b>Names</b>: Hippo-lytus = undone by horses; Oedi-pus = swollen foot; Erichth-onius = wool + earth; Minotaur = bull of Minos.",
      "<b>Odyssey 11 → Aeneid 6</b>: Elpenor→Palinurus, Ajax→Dido, Agamemnon→Deiphobus, Anticlea→Anchises.",
      "<b>Eriphyle</b> = the necklace-bribed wife (treachery); <b>Scylla</b> = the hair-cutter (Megara)."
    ],
    mapTitle: "Practice map (review slide 21)",
    mapImg: "assets/exam2/slide-images/map-greece-blank-handdrawn.jpg",
    mapAlt: "Blank hand-drawn map of Greece from the review slides",
    mapCaption: "Point to Athens, Eleusis, Thebes, Corinth, Delphi, Mt. Olympus, the Argive plain and Crete without looking.",
    extras: [`<div class="card"><h2>Lecture-slide extras</h2><ul>
      <li><b>Eleusinian Mysteries</b>: Sacred Way from Athens · fasting · <b>kykeon</b> · <b>Telesterion</b> · things done/shown/said · hierophant's light · a blessed afterlife · <i>muo</i> = close the mouth.</li>
      <li><b>Demeter</b> is major in religion, minor in literature. Persephone = a female “dying god”. Allegory = crops / a girl's marriage.</li>
      <li><b>Dionysus</b> “foreign” = transgressive, not pre-Greek (Linear B); enthousiasmos; counterpart of Demeter (Haloa).</li>
      <li><b>Odyssey 11</b>: Elpenor (burial), Tiresias (the way home), Anticlea (get home), Agamemnon (wives), Ajax (silent), Achilles (better a hired hand). Purpose: <b>get home</b>.</li>
      <li><b>Orphism</b>: Time → cosmic egg → Phanes; Zagreus eaten by the Titans; reincarnation via Lethe; purity breaks the cycle. Plato's Myth of Er adds judgment and choice.</li>
      <li><b>Aeneid 6</b>: Sibyl + golden bough; Charon; Dido silent; Anchises: “spare the conquered, battle down the proud”.</li>
      <li><b>Perseus</b> dies happily in old age (unlike Achilles); Gorgons were apotropaic before the myth.</li>
      <li><b>Oedipus</b>: royal not divine; raised in a city; being vs. appearance; primary source for Thebes = <b>tragedy</b>.</li>
      <li><b>Theseus</b>: a “new Heracles” promoted by Pisistratus/Cimon — myth as propaganda; Amazons = Persians; unheroic end on Scyros.</li>
      <li><b>Crete</b>: Minoans (unfortified palaces, bull-leaping, snake goddess, Linear A/B, Evans); pro-Athenian Minos is <b>hostile to Athens</b>, pre-Athenian Minos is <b>wise</b>.</li></ul>
      <p class="small"><a href="#/lectures">Full lecture notes →</a></p></div>`]
  },

  resourcesHTML: `<div class="card"><h2>Read, watch &amp; practice</h2><ul>
    <li><a href="https://www.theoi.com" target="_blank" rel="noopener">Theoi Greek Mythology</a> — the review lecture recommends it for context (stories + vase paintings)</li>
    <li><a href="http://www.ancienttexts.org/library/mesopotamian/gilgamesh/" target="_blank" rel="noopener">The Epic of Gilgamesh</a> (full text, linked in Powell ch. 13)</li>
    <li><a href="http://classics.mit.edu/Aeschylus/prometheus.html" target="_blank" rel="noopener">Aeschylus, Prometheus Bound</a> (Io) · <a href="http://classics.mit.edu/Euripides/hippolytus.html" target="_blank" rel="noopener">Euripides, Hippolytus</a> (both linked in Powell)</li>
    <li><a href="https://www.youtube.com/playlist?list=PLEb6sGT7oD8G8nPbyvObaZUNdfV6kitZQ" target="_blank" rel="noopener">Crash Course World Mythology playlist</a> — episodes on Gilgamesh, heroes, Theseus, the underworld</li>
    <li><a href="https://cbtf.illinois.edu/students" target="_blank" rel="noopener">CBTF student page / PrairieTest</a> — book your slot; bring your i-card</li></ul></div>`
};
