// Week 3 slide decks (Sept 8 Powell 6, Sept 10 Powell 7) + the student's own lecture notes
// (Aug 25 – Sept 22). Extends the arrays defined in data/lectures.js.
(function () {
  "use strict";
  const T = (id, term, cluster, guide, more, extra) => Object.assign({ id, term, cat: "lecture", cluster, guide, more: more || [] }, extra || {});
  let n = 0;
  const Q = (lec, tags, q, opts, ans, why, extra) => Object.assign({ id: "N" + String(++n).padStart(3, "0"), lec, tags: ["lecture"].concat(tags), q, opts, ans, why }, extra || {});

  window.DATA_LECTURE_TERMS.push(
    // Aug 25
    T("lx_calyxkrater", "Calyx krater", "c1", "red-figure wine-mixing bowl; lecture's first example shows the fall of Troy — King Priam killed, a priestess (Cassandra) assaulted"),
    T("lx_woodenhorse", "Wooden horse", "c1", "lecture's first example of a myth — a traditional story (the fall of Troy)"),
    // Sept 8 — Zeus, Hera, Poseidon, Hades
    T("lx_godhumor", "Humor about the gods", "c5", "comedy about the gods was acceptable in Greece (not sacrilege) — an unintended result of anthropomorphism; Plato objected", ["Myths about gods = essential knowledge and entertainment", "Comic treatments are in literature, not in art/archaeology"]),
    T("lx_worlddivision", "Division of the world", "c5", "Zeus the sky, Poseidon the sea, Hades the underworld (the “water cycle”)"),
    T("lx_hesiodzeus", "Hesiod's Zeus stories", "c5", "tricks Cronus, wins the Titanomachy, kills Typhoeus, marries Hera not Thetis (prophecy), punishes Prometheus — order and justice", ["Hesiod whitewashes Zeus; Ovid does not"]),
    T("lx_zeusepithets", "Zeus' epithets", "c5", "Cronides (son of Cronus), cloud-gatherer, father of gods and men", ["Zeus = “sky”; Latin Jupiter = “sky father”; an Indo-European sky/storm god like Enlil, Marduk", "Iliad 8: stronger than all the other gods together (the golden chain)"]),
    T("lx_zeusicon", "Zeus' iconography", "c5", "thunderbolt, eagle, aegis, bull (sacrificed to him; Europa)", ["Eagle: Prometheus' punishment, Ganymede", "Heroic nudity; bronze statue could be Zeus or Poseidon depending on what he throws"]),
    T("lx_jupiter", "Jupiter's signs", "c5", "Roman Zeus: scepter, globe (= earth), throne, eagle", ["Pompeii fresco; Greeks and Romans took him seriously (Ovid did not)"]),
    T("lx_europa", "Europa", "c5", "woman Zeus carried off as a bull; mother of Minos and Rhadamanthys"),
    T("lx_leda", "Leda", "c5", "woman Zeus seduced as a swan (she lays an egg); painted by Correggio", ["Renaissance art (from Ovid) is less respectful of Zeus than Hesiod"]),
    T("lx_deception", "Deception of Zeus (Iliad 14)", "c5", "Hera dresses up, borrows Aphrodite's magic strap, seduces Zeus on Mt. Ida so Sleep can knock him out and Poseidon can help the Greeks", ["Comic Zeus, bad marriage, duped", "Zeus lists his affairs (Danae, Europa, Semele, Alcmena, Demeter, Leto…)"]),
    T("lx_herafeatures", "Hera's features", "c5", "epithets ox-eyed, white-armed; children Hephaestus, Hebe, Eileithyia, Ares; marriage & fertility; cow (later peacock)", ["Distrusts and resents Zeus; seeks and destroys his girlfriends and kids (e.g. Heracles)", "In art: dressed as a Greek wife, veiled; limited iconography"]),
    T("lx_hebe", "Hebe", "c5", "daughter of Zeus & Hera (youth)"),
    T("lx_athmarriage", "Athenian marriage norms", "c5", "arranged; men around 30, women around 15; unequal roles — except in religion", ["Pandora is about half Epimetheus' age on the vase"]),
    T("lx_symposium", "Symposium", "c5", "elite Athenian men's drinking party (“party”)"),
    T("lx_hetairai", "Hetairai", "c5", "educated female entertainers (musicians/call girls) — the only women at a symposium"),
    T("lx_pederasty", "Pederasty", "c5", "“love of boys [teens]” — accepted within limits among elite Athenian men"),
    T("lx_115", "Zeus' 115 affairs", "c5", "local goddesses “marry” the Indo-European sky god — a way to link local cults to Zeus (Burkert counts 115 women)"),
    T("lx_dione", "Dione", "c5", "feminine form of “Zeus” — possibly his original wife; shrine at Dodona; Aphrodite's mother in Homer"),
    T("lx_dodona", "Dodona", "c5", "very old oracle of Dione, then Zeus — priests interpreted the rustling of a sacred oak"),
    T("lx_heraolympia", "Hera's older cult", "c5", "Hera was worshipped at Olympia (Zeus' biggest shrine), Argos and Samos before Zeus — an earth goddess “demoted” to his wife", ["Leto: originally a goddess, reduced to a Titan (?)"]),
    T("lx_pluto", "Pluto", "c5", "“wealthy” — other name of Hades"),
    T("lx_capofhades", "Cap of Hades", "c5", "cap of invisibility made by the Cyclopes; Perseus uses it"),
    T("lx_persephone", "Persephone", "c5", "wife of Hades, who stole her; they have no children"),
    T("lx_amphitrite", "Amphitrite", "c5", "Poseidon's wife; their son is Triton (a merman)"),
    T("lx_poseidonkids", "Poseidon's children", "c5", "Triton (with Amphitrite), Theseus (with Aethra — he has two dads), Pegasus (with Medusa)", ["“+ 105 more” partners"]),
    // Sept 10 — Apollo
    T("lx_accurate", "Accurate-shooter", "c6", "Apollo's epithet (Iliad 1, oldest reference): his arrows send disease — a plague god, not originally a fighter"),
    T("lx_resheph", "Resheph", "c6", "Syrian plague god with arrows (also a healer), worshipped from the 3rd millennium; one text identifies him with Apollo", ["Another deity folded into the Greek pantheon?"]),
    T("lx_admetus", "Admetus", "c6", "mortal whom Zeus made Apollo serve"),
    T("lx_apollovszeus", "Apollo vs. Zeus", "c6", "Apollo can be resisted; few children (Asclepius, whom Zeus kills); weaker — serves a mortal; intellect vs. power", ["Why so junior? Newer than Zeus, maybe imported (epithet “Lycian”)"]),
    T("lx_delianpythian", "Delian / Pythian", "c6", "Apollo's epithets from his two cult centers: Delos (island) and Pytho (Delphi)"),
    T("lx_python_rot", "Pytho “Rot”", "c6", "the snake Apollo shoots at Delphi rots — killing Python = conquest of “rot” (death)", ["Proof of divinity (Indo-European hero like Marduk, Zeus)", "Allegiance to Zeus against Gaea's monsters", "Bringing order (cf. killing Typhoeus)"]),
    T("lx_newsheriff", "Apollo, “new sheriff” at Delphi", "c6", "replaces older goddesses (Themis, then Phoebe) and takes the epithet Phoebus (“bright”)"),
    T("lx_omphalos", "Omphalos", "c6", "stone at Delphi marking the center of the world — said to be the stone Cronus swallowed"),
    T("lx_tripod", "Tripod", "c6", "three-legged seat of the Pythia at Delphi"),
    T("lx_delphioracle", "Delphic oracle", "c6", "open 9 months a year from before 800 BCE (maybe 1400) until 394 CE; the Sacred Way leads to the temple", ["Visible temple remains 4th c. BCE on a 6th c. foundation", "Bring your sacrificial goat"]),
    T("lx_bernini", "Bernini's Apollo and Daphne", "c6", "marble sculpture (1622–25) based on Ovid: Daphne turning into a laurel, a very young Apollo", ["Impression of movement; his calm vs. her emotion; seamless transition"]),
    T("lx_peneus", "Peneus", "c6", "river god, Daphne's father, who turns her into a laurel tree to protect her"),
    T("lx_hymnsfacts", "Homeric Hymns (facts)", "c6", "33 poems, 8th–2nd c. BCE, NOT by the author(s) of the Iliad and Odyssey; define gods through birth, places, feats, crisis, entry into Olympus; some humor"),
    T("lx_panhellenic", "Panhellenic poems", "c6", "“for all Greece” (Homeric Hymns, Iliad, Odyssey): connect separate local cults, put the gods on Olympus, create family relationships"),
    T("lx_apolloafter", "Apollo after the Hymn", "c6", "subordinate to Zeus; care of youth; music, art, poetry, knowledge, athletics; physical & mental perfection — god of aristocrats", ["Olympia temple of Zeus sculpture: Apollo embodies order and rationality"]),
    // Sept 17 — Aphrodite, Artemis, Athena (from notes)
    T("lx_ida", "Mt. Ida", "c8", "mountain near Troy: Aphrodite visits the herdsman Anchises there (and Hera seduces Zeus there in Iliad 14)"),
    T("lx_aphroshrines", "Aphrodite's shrines", "c8", "Cyprus and Cythera; not originally Greek — she comes from Inanna"),
    T("lx_ephesus", "Artemis of Ephesus", "c6", "older (Anatolian) form of Artemis associated with fertility — the opposite of the virgin huntress"),
    T("lx_hippolytus", "Hippolytus", "c6", "hunter devoted to Artemis — named in lecture with Orion and Actaeon among her hunters")
  );

  Object.assign(window.DATA_LECTURE_MORE, {
    zeus: (window.DATA_LECTURE_MORE.zeus || []).concat(["Sept 8: signs — thunderbolt, eagle, aegis, bull; epithets Cronides, cloud-gatherer, father of gods and men", "Hesiod's Zeus = order & justice; enforces dikē and xenia (Temple of Zeus, Athens)", "Affairs: 115 women (Burkert) — local goddesses linked to the sky god; NOT a role model"]),
    hera: (window.DATA_LECTURE_MORE.hera || []).concat(["Epithets ox-eyed, white-armed; children Hephaestus, Hebe, Eileithyia, Ares; cow (later peacock)", "Iliad 14: seduces Zeus with Aphrodite's strap", "Worshipped at Olympia, Argos, Samos before Zeus"]),
    hades: ["Also called Pluto (“wealthy”); stole Persephone, his wife; no children", "Cap of invisibility made by the Cyclopes (Perseus uses it); fire imagery is post-classical"],
    poseidon: ["Name “lord/husband of [?]”; powers: sea, earthquakes, horses; inventory: trident, water chariot", "Curses Odysseus; wife Amphitrite (son Triton); Aethra → Theseus; Medusa → Pegasus"],
    olympus: ["Hard to reach in antiquity, far from major cities (Athens, Delphi, Sparta); c. 9,570 ft"],
    ganymede: ["Sept 8 Q2: sleeping with the boy Ganymede would have been “sort of acceptable” for aristocratic Athenian men (pederasty) — but Zeus is not a role model"],
    apollo: (window.DATA_LECTURE_MORE.apollo || []).concat(["Iliad 1: “accurate-shooter” whose arrows bring plague; parallel Resheph (Syria)", "Can be resisted; serves the mortal Admetus; intellect vs. Zeus' power", "Epithets Delian, Pythian, Phoebus; after the Hymn: music, poetry, knowledge, athletics, care of youth"]),
    artemis: ["Opposite of Aphrodite: young, unmarried, short skirt, hunts; dances to Apollo's lyre", "Goddess of childbirth and of the death of women; her hunters: Orion, Hippolytus, Actaeon", "Older form (Artemis of Ephesus) linked to fertility"],
    aphrodite: (window.DATA_LECTURE_MORE.aphrodite || []).concat(["Homeric Hymn: dresses up to seduce Anchises on Mt. Ida — a theoxeny; their son Aeneas", "Children: Eros, Hermaphroditus, Priapus, Aeneas; shrines at Cyprus and Cythera; from Inanna", "Makes gods fall for mortals and chase them in disguise"]),
    anchises: ["Trojan herdsman on Mt. Ida; fears that sleeping with a goddess will unman him"],
    aeneas: ["Name linked to “terrible” (ainos) — the grief Aphrodite felt"],
    athena: ["Lecture: “a female Zeus”, born from his head; daughter of Zeus & Metis (cleverness)", "Sept 8 vase: Athena with helmet, aegis, spear, owl, snake vs. Poseidon's trident and sea horse"],
    priapus: ["A child of Aphrodite (fertility), per lecture notes"],
    leto: ["Gives birth holding a palm tree; bribes Delos with a temple", "Maybe originally a goddess, reduced to a Titan"],
    delos: ["Inhabited from 3000 BCE; early major sanctuary; Roman-era slave market; Apollo's temple newer than Artemis'"],
    delphi: ["Oracle open 9 months/year, from before 800 BCE to 394 CE; omphalos = center of the world"],
    pythia: ["Sits on a tripod; the oracle's older goddesses were Themis, then Phoebe"],
    python: ["Pytho = “Rot” — the snake rots after Apollo shoots it; Apollo is called Pythian"],
    daphne: ["Cupid's arrows: Apollo made to love, Daphne made to reject; her father, the river god Peneus, turns her into a laurel (Bernini sculpture)"],
    cassandra: ["Later murdered; newly found Pompeii fresco (2024)"],
    sibyl: ["Shrank and shrank; Romans consulted her oracle books"],
    coronis: ["Apollo couldn't save her but saved their son Asclepius"],
    hyacinth: ["Doubles the Ganymede story; another dying-god figure (?)"],
    asclepius: ["Zeus kills him — Apollo has few children"],
    helios: (window.DATA_LECTURE_MORE.helios || []).concat(["No temples or worship; NASA's Apollo program named for Apollo as sun god"]),
    hymns: (window.DATA_LECTURE_MORE.hymns || []).concat(["33 poems, 8th–2nd c. BCE; not by Homer"]),
    myth: (window.DATA_LECTURE_MORE.myth || []).concat(["Aug 25: traditional = told many times, in art and literature; collective importance = transmits ideas about a culture"]),
    priam: ["Killed at the fall of Troy (calyx krater, Aug 25 lecture)"],
    lx_theoxeny: ["Aphrodite visits Anchises to test him (Homeric Hymn to Aphrodite)"],
    herm: (window.DATA_LECTURE_MORE.herm || []).concat(["Review notes: Hermes “made of rock” = the herm / stone heap"])
  });

  const img = (id) => ({ img: id });
  window.DATA_LECTURE_QUESTIONS.push(
    // Aug 25
    Q("aug25", ["myth-theory"], "“Collective importance” in the definition of myth means a story:", ["transmits ideas about a culture", "is written by many authors", "is only about gods", "is historically true"], 0, "Traditional = told many times (in art and literature); collective importance = transmits ideas about the culture."),
    Q("aug25", ["myth-theory"], "A calyx krater is a:", ["wine-mixing bowl", "drinking cup", "oil flask for athletes", "funeral urn"], 0, "Lecture example: red-figure calyx krater showing the fall of Troy (Priam killed)."),
    // Sept 8
    Q("sept8", ["zeus-hera"], "Which action by Zeus would have been “sort of acceptable” for aristocratic Athenian men? (Sept 8 Q2)", ["Sleeping with the boy Ganymede", "Sleeping with unmarried citizen women", "Marrying his full sister Hera", "Swallowing his girlfriend Metis"], 0, "Pederasty was OK within limits for the 5th-c. elite — though Ganymede was a Trojan prince, and lecture's bottom line is that Zeus is NOT a role model."),
    Q("sept8", ["zeus-hera", "myth-theory"], "Why could Greeks laugh at stories about their gods?", ["Comedy about the gods wasn't sacrilege — humor was a by-product of anthropomorphism", "They didn't believe in the gods", "Plato encouraged it", "Only Romans told those stories"], 0, "Myths were knowledge and entertainment; Plato objected."),
    Q("sept8", ["zeus-hera"], "In the division of the world, Poseidon gets:", ["the sea", "the sky", "the underworld", "the earth"], 0, "Zeus sky, Poseidon sea, Hades underworld."),
    Q("sept8", ["zeus-hera"], "Which is NOT one of Hesiod's Zeus stories?", ["turning into a swan to seduce Leda", "tricking Cronus", "killing Typhoeus", "marrying Hera instead of Thetis"], 0, "Hesiod's Zeus = order & justice; animal disguises come from Ovid and Renaissance art."),
    Q("sept8", ["zeus-hera", "roman-names"], "“Jupiter” means:", ["sky father", "cloud-gatherer", "thunderer", "king of kings"], 0, "Zeus = “sky”; Jupiter = “sky father”."),
    Q("sept8", ["zeus-hera"], "Which is an epithet of Zeus?", ["Cronides (son of Cronus)", "Phoebus", "Argeiphontes", "ox-eyed"], 0, "Also cloud-gatherer, father of gods and men. Phoebus = Apollo; Argeiphontes = Hermes; ox-eyed = Hera."),
    Q("sept8", ["zeus-hera", "images"], "Zeus' identifying signs (Sept 8):", ["thunderbolt, eagle, aegis, bull", "trident, horses, sea chariot", "lyre, laurel, bow", "hammer, anvil, tongs"], 0, "Bull: sacrificed to him; Europa."),
    Q("sept8", ["zeus-hera"], "Zeus carried off Europa in the form of a:", ["bull", "swan", "eagle", "shower of gold"], 0, "Swan = Leda; eagle = Ganymede."),
    Q("sept8", ["zeus-hera", "roman-names"], "Roman Jupiter's signs include:", ["scepter, globe, throne, eagle", "trident and horses", "petasos and caduceus", "hammer and tongs"], 0, "Pompeii fresco; globe = earth."),
    Q("sept8", ["zeus-hera", "sources"], "In Iliad 14, Hera seduces Zeus in order to:", ["distract him so Poseidon can help the Greeks", "have another child", "end the war for Troy", "punish Aphrodite"], 0, "She borrows Aphrodite's magic strap; Sleep knocks Zeus out — comic Zeus, bad marriage."),
    Q("sept8", ["zeus-hera"], "Hera's epithets are:", ["ox-eyed, white-armed", "grey-eyed, bright", "earth-shaker, dark-haired", "cloud-gatherer, far-seeing"], 0, "Her animal is the cow (later the peacock)."),
    Q("sept8", ["zeus-hera"], "Which is NOT a child of Hera in lecture?", ["Apollo", "Hebe", "Eileithyia", "Hephaestus"], 0, "Hera's children: Hephaestus, Hebe, Eileithyia, Ares. Apollo is Leto's."),
    Q("sept8", ["zeus-hera"], "Athenian marriage norms (lecture):", ["arranged; men around 30, women around 15", "men and women married around 20", "women chose their husbands", "equal legal rights for wives"], 0, "Unequal roles — except in religion."),
    Q("sept8", ["zeus-hera"], "Hetairai were:", ["educated female entertainers, the only women at a symposium", "priestesses of Hera", "Athenian wives", "the Muses"], 0, "Symposium = elite men's drinking party."),
    Q("sept8", ["zeus-hera", "myth-theory"], "Lecture's religious explanation for Zeus' 115 affairs:", ["local goddesses were linked (“married”) to the Indo-European sky god", "Zeus was a fertility god only", "Greek poets invented them for humor", "each affair marks a flood"], 0, "Hera, Dione, Leto — separate deities made consorts of Zeus."),
    Q("sept8", ["zeus-hera"], "Dione's name is:", ["the feminine form of “Zeus” — perhaps his original wife", "“invisible”", "“bright”", "“all gifts”"], 0, "Shrine at Dodona (then Zeus'); Aphrodite's mother in Homer."),
    Q("sept8", ["zeus-hera"], "At Dodona, priests learned Zeus' will from:", ["the rustling of a sacred oak", "a priestess on a tripod", "bird flight over the sea", "reading entrails"], 0, "A very old oracle of Dione, then Zeus."),
    Q("sept8", ["zeus-hera"], "Which goddess was worshipped at Olympia before Zeus?", ["Hera", "Athena", "Aphrodite", "Artemis"], 0, "Also at Argos and Samos — an earth goddess demoted to his wife."),
    Q("sept8", ["zeus-hera"], "Hades' other name, Pluto, means:", ["wealthy", "invisible", "dark", "death"], 0, "Hades = “invisible”."),
    Q("sept8", ["zeus-hera"], "The Cap of Hades gives:", ["invisibility (Perseus uses it)", "immortality", "the power to raise the dead", "control of the sea"], 0, "Made by the Cyclopes."),
    Q("sept8", ["zeus-hera"], "Hades' wife is:", ["Persephone", "Hecate", "Amphitrite", "Demeter"], 0, "He stole her; they have no children."),
    Q("sept8", ["zeus-hera"], "Poseidon's wife Amphitrite bears:", ["Triton, a merman", "Pegasus", "Theseus", "Polyphemus"], 0, "Aethra → Theseus; Medusa → Pegasus."),
    Q("sept8", ["zeus-hera"], "Poseidon's powers (character sheet):", ["sea, earthquakes, horses", "sky, storms, justice", "the dead, wealth", "fire, forge, volcanoes"], 0, "He also curses Odysseus; inventory: trident, water chariot."),
    Q("sept8", ["zeus-hera", "maps"], "Mt. Olympus, in lecture, was:", ["hard to reach and far from major cities", "right next to Athens", "an island in the Aegean", "in Crete"], 0, "Far from Athens, Delphi, Sparta."),
    // Sept 10
    Q("sept10", ["apollo-artemis"], "What do Cassandra, Daphne and Coronis all have in common? (Sept 10 Q1)", ["rejecting Apollo's love", "the gift of prophecy", "bearing Apollo sons", "losing their human form"], 0, "Apollo's failed affairs."),
    Q("sept10", ["apollo-artemis"], "What might the killing of Python signify? Which is NOT one of lecture's readings?", ["Apollo's marriage to Themis", "proof of Apollo's divinity", "his allegiance to Zeus", "a “new sheriff” in Delphi"], 0, "All of the in-class options were valid readings: proof of divinity, allegiance to Zeus, conquest of disorder, new sheriff."),
    Q("sept10", ["apollo-artemis"], "Apollo as a “new sheriff” in Delphi means he:", ["replaced older goddesses (Themis, then Phoebe) and took the name Phoebus", "arrested Hermes", "founded Athens", "overthrew Zeus"], 0, "Phoebus = “bright”."),
    Q("sept10", ["apollo-artemis"], "“Pytho” (Python) means:", ["rot", "bright", "snake-king", "center"], 0, "The snake rots after Apollo shoots it — conquest of death/rot."),
    Q("sept10", ["apollo-artemis"], "Apollo's epithets from his two cult centers:", ["Delian and Pythian", "Olympian and Cronian", "Lycian and Cyllenian", "Argive and Samian"], 0, "Delos and Pytho (Delphi)."),
    Q("sept10", ["apollo-artemis"], "In Iliad 1 (the oldest reference), Apollo is the “accurate-shooter” whose arrows:", ["send disease", "kill giants", "start the Trojan War", "bring the sun"], 0, "A plague god, not originally a fighter."),
    Q("sept10", ["apollo-artemis", "mesopotamia"], "Resheph is:", ["a Syrian plague god with arrows, identified with Apollo in one text", "Apollo's son", "a Sumerian sky god", "a Hittite storm god"], 0, "Another deity folded into the Greek pantheon?"),
    Q("sept10", ["apollo-artemis"], "Which is NOT how Apollo differs from Zeus (lecture)?", ["Apollo has many more children", "Apollo can be resisted", "Zeus makes Apollo serve a mortal", "power vs. intellect"], 0, "Apollo has few children (Asclepius, whom Zeus kills)."),
    Q("sept10", ["apollo-artemis"], "Zeus made Apollo serve the mortal:", ["Admetus", "Priam", "Anchises", "Lycaon"], 0, "Shows Apollo is junior to Zeus."),
    Q("sept10", ["apollo-artemis", "sources"], "The Homeric Hymns are:", ["33 poems (8th–2nd c. BCE), NOT by the author of the Iliad and Odyssey", "written by Homer", "Roman poems by Ovid", "prose histories"], 0, "They define gods through birth, places, feats, crisis, entry into Olympus."),
    Q("sept10", ["apollo-artemis", "myth-theory"], "Panhellenic poems like the Homeric Hymns:", ["connect separate local cults and put the gods on Olympus in families", "were only performed at Delos", "reject the Olympian gods", "are Mesopotamian"], 0, "Panhellenic = for all Greece."),
    Q("sept10", ["apollo-artemis"], "The omphalos at Delphi is:", ["the stone marking the center of the world (the stone Cronus swallowed)", "Apollo's lyre", "the Pythia's tripod", "Python's tomb"], 0, "Omphalos = navel."),
    Q("sept10", ["apollo-artemis"], "The Pythia sat on a:", ["tripod", "throne of gold", "rock by the sea", "chariot"], 0, "Attic kylix c. 450 BCE shows the Pythia (as Themis) on a tripod."),
    Q("sept10", ["apollo-artemis", "maps"], "The Delphic oracle operated:", ["from before 800 BCE until 394 CE, 9 months a year", "only during the Trojan War", "from 8 CE", "year-round on Delos"], 0, "Maybe from as early as 1400 BCE."),
    Q("sept10", ["apollo-artemis"], "Who turns Daphne into a laurel in Ovid?", ["her father, the river god Peneus", "Artemis", "Zeus", "Apollo"], 0, "Cupid's arrows made Apollo love her and her reject him. Bernini sculpted it (1622–25)."),
    Q("sept10", ["apollo-artemis"], "Hyacinth's story is said to double the story of:", ["Ganymede", "Actaeon", "Adonis", "Orion"], 0, "Also possibly another dying-god figure."),
    Q("sept10", ["apollo-artemis"], "After the Homeric Hymn, Apollo is associated with:", ["music, poetry, knowledge, athletics, care of youth", "the sea and earthquakes", "the dead and wealth", "the hearth"], 0, "A god of aristocrats; physical and mental perfection."),
    Q("sept10", ["apollo-artemis"], "Apollo's solar features are:", ["late — Helios (no temples) was later identified with him", "his oldest role", "from Mesopotamia", "found in the Homeric Hymn"], 0, "Gods change over time."),
    Q("sept10", ["apollo-artemis"], "Leto gives birth to Apollo holding onto a:", ["palm tree", "laurel", "olive tree", "column"], 0, "Attic red-figure pyxis, 370 BCE."),
    // Sept 17
    Q("sept17", ["aphrodite", "concepts"], "Aphrodite's visit to Anchises is an example of:", ["theoxeny — a divine visit that is a test", "catasterism", "syncretism", "etiology"], 0, "She visits him on Mt. Ida."),
    Q("sept17", ["aphrodite", "maps"], "Anchises herds his cattle on:", ["Mt. Ida, near Troy", "Mt. Olympus", "Mt. Parnassus", "Mt. Cyllene"], 0, "Homeric Hymn to Aphrodite."),
    Q("sept17", ["aphrodite"], "Aphrodite's shrines named in lecture:", ["Cyprus and Cythera", "Delos and Delphi", "Athens and Sparta", "Crete and Lemnos"], 0, "She is not originally Greek — she comes from Inanna."),
    Q("sept17", ["aphrodite"], "Which is NOT a child of Aphrodite in lecture?", ["Pan", "Eros", "Hermaphroditus", "Priapus"], 0, "Also Aeneas (with Anchises)."),
    Q("sept17", ["apollo-artemis"], "Lecture calls Artemis:", ["the opposite of Aphrodite — young, unmarried, a huntress", "a mother goddess", "a sea goddess", "Apollo's wife"], 0, "She dances to Apollo's lyre; goddess of childbirth and the death of women."),
    Q("sept17", ["apollo-artemis"], "Which hunter is NOT on lecture's list of Artemis' hunters?", ["Adonis", "Orion", "Hippolytus", "Actaeon"], 0, "Adonis is killed by a boar and is Aphrodite's."),
    Q("sept17", ["apollo-artemis"], "The older Artemis of Ephesus was associated with:", ["fertility", "war", "the sea", "the underworld"], 0, "The opposite of the virgin huntress."),
    Q("sept17", ["athena"], "Lecture describes Athena as:", ["a female Zeus", "a sea goddess", "a Titan", "the daughter of Hera alone"], 0, "Born from Zeus' head; daughter of Metis (cleverness).")
  );

  // Lecture pages: new ones + the student's own notes on existing ones
  window.DATA_LECTURES.push(
    { id: "aug25", date: "Aug 25", title: "Introduction: what is a myth?", powell: "Powell ch. 1", notesOnly: true,
      sections: [["Definition", ["<b>Myth</b> = a traditional story with collective importance, e.g. the <b>wooden horse</b> (fall of Troy).", "<b>Traditional</b> = told many times; appears in both art and literature.", "<b>Collective importance</b> = transmits ideas about a culture.", "Example object: red-figure <b>calyx krater</b> (wine-mixing bowl) — the fall of Troy: King Priam (in the fine clothes) being killed; the assault on a priestess (Cassandra)."]]],
      inclass: [], check: ["N001", "N002"] },
    { id: "sept8", date: "Sept 8", title: "Zeus, Hera, Poseidon and Hades", powell: "Powell ch. 6",
      sections: [
        ["The Olympians", ["Humor about gods was OK in Greece (not sacrilege) — an unintended result of anthropomorphism; myths were knowledge <i>and</i> entertainment (Plato objected).", "“Divine family drama” (the Kardashian comparison): wealth, easy life (nectar & ambrosia), spheres of influence, feuds.", "Genealogy organizes local deities and the Indo-European tradition under a head sky god, Zeus (Homer and Hesiod do this work).", "<b>Mt. Olympus</b>: hard to reach, far from major cities (Athens, Delphi, Sparta); c. 9,570 ft.", "<b>Division of the world</b>: Zeus sky, Poseidon sea, Hades underworld. Renaissance art (Correggio's <i>Leda and the Swan</i>, from Ovid) shows a less respectful Zeus."]],
        ["Zeus", ["<b>Hesiod's Zeus</b>: tricks Cronus, wins the Titanomachy, kills Typhoeus, marries Hera not Thetis (prophecy), punishes Prometheus → <b>order, justice</b>.", "Zeus = “sky”; Latin <b>Jupiter</b> = “sky father”; Indo-European sky/storm god like Enlil, Marduk. Epithets: <b>Cronides</b> (son of Cronus), <b>cloud-gatherer</b>, <b>father of gods and men</b>. Iliad 8: stronger than all the other gods together.", "<b>Iconography</b>: thunderbolt (Typhoeus), eagle (Prometheus, Ganymede), aegis (goat skin — also Athena's), <b>bull</b> (sacrificed to him; Europa). Roman Jupiter adds scepter, globe (= earth), throne.", "Enforces <b>dikē</b> (justice) and <b>xenia</b> (hospitality); taken seriously in religion (Temple of Zeus, Athens).", "<b>Iliad 14</b> (Deception of Zeus): Zeus favors the Trojans; Hera dresses up, borrows Aphrodite's magic strap, seduces him on Mt. Ida; he falls asleep → comic Zeus, bad marriage, duped. Comic treatments appear in literature, not art."]],
        ["Hera", ["Wedding of Hera & Zeus (Selinus metope, c. 550 BCE): traditional, not comic; <b>hand-clasping = marriage</b>; dressed as a Greek wife, veiled; limited iconography.", "Epithets <b>ox-eyed, white-armed</b>; children <b>Hephaestus, Hebe, Eileithyia, Ares</b>; areas marriage & fertility; animals cow (later peacock); toward Zeus: distrust, resentment; toward his girlfriends and kids: seek and destroy (Heracles)."]],
        ["Zeus' affairs and Athenian society", ["115 women (Burkert). Athenian norms: arranged marriage; men ~30, women ~15; unequal roles except in religion.", "<b>Symposium</b> = drinking party; <b>hetairai</b> = musicians/call girls, the only women there; <b>pederasty</b> = “love of boys [teens]”, OK within limits. Norms of the 5th-c. elite; Zeus reflects them — Zeus is NOT a role model.", "Religious explanation: local goddesses “marry” the Indo-European sky god. Hera was worshipped at Olympia, Argos, Samos before Zeus; <b>Dione</b> (feminine of “Zeus”) maybe his original wife, at <b>Dodona</b> (oracle of the sacred oak); Leto perhaps a goddess reduced to a Titan."]],
        ["Brothers: Hades and Poseidon", ["<b>Hades</b> = “invisible” (α + ειδ-), also <b>Pluto</b> (“wealthy”); lord of the dead; stole and married <b>Persephone</b> (no kids); <b>Cap of Hades</b> (invisibility, made by the Cyclopes, used by Perseus). Fire imagery is post-classical.", "<b>Poseidon</b> “lord/husband of [?]”, <b>Earth-shaker</b>; sea, earthquakes, horses; contest for Athens; curses Odysseus; <b>Amphitrite</b> (son Triton, merman), Aethra (Theseus), Medusa (Pegasus) + 105 more; trident, water chariot.", "Athena & Poseidon vase (380–360 BCE): Poseidon — trident, sea horse; Athena — helmet, aegis, spear, owl, snake.", "Recap: Zeus king of gods, storms, justice · Hera wife of Zeus, marriage · Hades brother, underworld · Poseidon brother, ocean, earthquakes."]]
      ],
      inclass: [
        ["Q1: Anthropomorphism is the…", "D — attribution of human features to nonhumans (A anthropology, B anthropophagy, C anthropometry)."],
        ["Q2: Which action by Zeus would have been sort of acceptable for aristocratic Athenian men?", "Sleeping with the boy Ganymede (pederasty, within limits) — though the professor's note: technically Ganymede was a Trojan prince, and “honestly, probably none of it — Zeus is just not a role model.”"],
        ["Q3: Which name means “invisible”?", "Hades."]
      ],
      check: ["N005", "N009", "N013", "N021"] },
    { id: "sept10", date: "Sept 10", title: "Myths of the great god Apollo", powell: "Powell ch. 7",
      sections: [
        ["Apollo's failed affairs", ["<b>Daphne</b>: rejects him; turned into a laurel (Bernini's marble, 1622–25, based on Ovid: a very young Apollo, calm vs. her emotion).", "<b>Cassandra</b>: Trojan princess, gift of prophecy, never believed, later murdered (Pompeii fresco found 2024).", "<b>Sibyl of Cumae</b>: Romans consulted her oracles (real books).", "<b>Coronis</b>: mother of Asclepius, the famous doctor (Delphi kylix with the black bird).", "<b>Hyacinth</b>: killed with a discus; doubles the Ganymede story; another dying-god figure?"]],
        ["Who is Apollo?", ["<b>Apollo vs. Zeus</b>: Apollo can be resisted; few children (Asclepius, whom Zeus kills); weaker — Zeus makes him serve a mortal (<b>Admetus</b>); power vs. intellect.", "<b>Plague god</b>: Iliad 1 (oldest reference), epithet “<b>accurate-shooter</b>”; arrows send disease; not originally a fighter.", "Eastern origin? <b>Resheph</b>, a Syrian plague god with arrows (3rd millennium, later Egypt), also a healer; one text identifies him with Apollo."]],
        ["Homeric Hymn to Apollo", ["Homeric Hymns: 33 poems, 8th–2nd c. BCE, NOT by the author(s) of the Iliad/Odyssey; define gods through birth, places, feats/power, crisis of a new god, entry into the Olympian hierarchy; some humor.", "Zeus + Leto (a Titan) → Apollo, Artemis. <b>Leto bribes Delos with a temple</b>; connection to sky god Zeus; Hera's resentment; Leto gives birth holding a palm tree.", "<b>Delos</b>: inhabited from 3000 BCE, early major sanctuary, Roman slave market; the Hymn connects Apollo to his two cult centers → shows link to Zeus, Hera's resentment, <b>etiology of the sanctuary</b>.", "Epithets <b>Delian</b> (Delos) and <b>Pythian</b> (Pytho: he kills the snake with his bow and it rots)."]],
        ["What does killing Python (“Rot”) signify?", ["<b>Proof of divinity</b>: Indo-European hero (like Marduk, Zeus); conquest of rot (death); bringing order (cf. Typhoeus); qualifies him for Olympus.", "<b>Allegiance to Zeus</b>: against the monsters of Gaea.", "<b>A ‘new sheriff’ in Delphi</b>: replaces older goddesses (Themis, then Phoebe); takes the epithet <b>Phoebus</b> (“bright”)."]],
        ["After the Hymn; the sun; Delphi", ["Apollo the entertainer: subordinate to Zeus; care of youth; reflects male aristocratic interests — music, art, poetry, knowledge, athletics, physical & mental perfection (Olympia sculpture: order and rationality).", "Why so junior? Newer than Zeus, maybe imported (epithet “Lycian”). <b>Panhellenic</b> poems (Hymns, Iliad, Odyssey) connect separate local cults, put the gods on Olympus (later 12), create family relationships.", "Recap: birth and places; defining feat = snake-killing; music, prophecy, purification; more contact with mortals than Zeus; local (Delos, Delphi) but Olympian; linked to Zeus, Artemis, Asclepius.", "<b>Sun</b>: Helios (after Hyperion) drives the chariot, no temples or worship, later identified with Apollo — Apollo's solar features are late (NASA's Apollo program).", "<b>Delphi</b>: oracle open 9 months/year, from before 800 BCE (maybe 1400) to 394 CE; the Sacred Way; temple remains 4th c. on a 6th-c. foundation; the <b>Pythia</b> on a <b>tripod</b>; the <b>omphalos</b> (center of the world) = the stone Cronus swallowed; bring a sacrificial goat."]]
      ],
      inclass: [
        ["Q1: What do Cassandra, Daphne and Coronis all have in common?", "Rejecting Apollo's love."],
        ["Q2: What might the killing of Python signify?", "Discussion question — the next slide develops all four: proof of divinity, allegiance to Zeus, conquest of disorder/chaos, and a “new sheriff” in Delphi."],
        ["Q3: What did Apollo's mother promise Delos, if it allowed her to give birth?", "A temple."]
      ],
      check: ["N028", "N031", "N035", "N041"] },
    { id: "sept17", date: "Sept 17", title: "Aphrodite, Artemis and Athena", powell: "Powell ch. 9", notesOnly: true,
      sections: [
        ["Aphrodite", ["Makes others look like fools — makes gods lust after mortals and chase them in disguise.", "<b>Homeric Hymn to Aphrodite</b> (origins, powers, proof of divinity): she dresses up to seduce the Trojan herdsman <b>Anchises</b> on <b>Mt. Ida</b>; he offers to build her an altar/temple.", "She visits to test him — a <b>theoxeny</b> (a divine visit that is a test). Sleeping with a goddess transforms a man (Anchises fears he will be unmanned).", "Their son is <b>Aeneas</b> (name linked to “terrible” grief).", "Not originally Greek: from <b>Inanna</b>. Shrines at <b>Cyprus</b> and <b>Cythera</b>.", "Children: <b>Eros, Hermaphroditus, Priapus</b> (fertility), Aeneas."]],
        ["Artemis", ["The <b>opposite of Aphrodite</b>: young and attractive but unmarried; her job is hunting animals.", "With Apollo kills <b>Niobe's</b> children (Niobe bragged she had more children than Leto).", "Like Apollo: bow and arrows; dances to Apollo's lyre.", "Kills hunters: <b>Orion, Hippolytus, Actaeon</b>."]],
        ["Athena", ["A <b>female Zeus</b>, born from Zeus' head; daughter of Zeus and Metis (cleverness).", "Turns <b>Arachne</b> into a spider after Arachne claimed she wove better."]]
      ],
      inclass: [], check: ["N046", "N048", "N050", "N053"] },
    { id: "sept22", date: "Sept 22", title: "Review for Exam 1", powell: "review", notesOnly: true,
      sections: [["From your review notes", ["<b>Hermes</b>: god of domestic animals, travelers, messengers; originally a rock (herm / stone heap); after inventing the lyre he sang about his own birth.", "<b>Artemis</b>: short skirt; Apollo's hunting sister; goddess of childbirth and of the death of women; unmarried, virgin; her older version (Artemis of Ephesus) is known for fertility even though she is the opposite.", "<b>Hades</b>: lord of the dead; married to Persephone; name means “invisible”.", "The Sept 24 review slides (40 questions) are under <a href=\"#/review\">Review Qs</a>."]]],
      inclass: [], check: ["q002", "q010", "q030", "N050"] }
  );

  // The student's own notes, attached to the lectures that already have slides, plus corrections.
  const MY = {
    aug27: { notes: ["Uranus didn't want Gaea to have kids; Gaea asked one of her kids to cut off Uranus' genitals.", "Divine myths are about supernatural forces, usually in polytheistic cultures; Inanna/Ishtar → Aphrodite.", "Early Greeks learned the stories orally (from c. 2100); singers tell them in the Iliad.", "Folk tales: ordinary people, magic, talking animals, ogres (Little Red Riding Hood); Uranus is the ogre (keeps his kids inside Gaea).", "Legend: people believed to exist (Paul Bunyan, Davy Crockett); Greek legends = heroes, royalty, demigods (Heracles, Achilles, Theseus & the Minotaur).", "Reading famous versions makes them the “default” versions."],
      fix: ["Your notes say Greeks “probably did not have access to Greek writings” — the slide says <b>Sumerian</b> writings."] },
    sept1: { notes: ["Gaea's children include Uranus (sky) and Pontus (sea); monsters = animal + human parts or duplicated parts.", "Each ruling god gets a prophecy that his kid will overthrow him.", "Titanomachy: the Hundred-handers (Hecatoncheires) are released and hurl boulders.", "Typhoeus: 100 snake heads that breathe fire; the gods flee to Egypt; he defeats Zeus; Hermes rescues him; Zeus buries him → Mt. Etna (etiology).", "“Learn the Zeus and Marduk stories.”"],
      fix: ["Your notes say the Hundred-handers throw “3000 rocks at once”; Hesiod has a volley of <b>three hundred</b> rocks. On the exam the key fact is just: they <b>hurl boulders</b>."] },
    sept3: { notes: ["Hesiod hates humans, loves Zeus; Prometheus loves humans.", "Trick 1: an ox — gleaming fat outside, only bones inside → Zeus takes fire away; etiology of sacrifice.", "Hermes makes Pandora thievish; she was made to seduce Epimetheus; Pandora = her jar (containing/hiding).", "Five Ages: Gold (perfect life, spirits after), Silver (fought more, 100-year childhood, spirits underground), Bronze (killed each other, not spirits), Heroes, Iron.", "Theoxeny: Zeus visits to test morals, is offended, plans the flood; Hellen → Doric, Aeolic, Ionic."],
      fix: ["Your notes say “Titans — children of Cronus and Rhea.” The Titans are children of <b>Gaea and Uranus</b>; Cronus and Rhea's children are the Olympians (Hestia, Demeter, Hera, Hades, Poseidon, Zeus).", "Your notes say Prometheus' prophecy is that “Zeus's son will overthrow him.” Per the slides: a goddess (<b>Thetis</b>) will bear a son greater than his father — so Zeus marries Hera, not Thetis."] },
    sept8: { notes: ["Hesiod glorified Zeus; Zeus is order and justice.", "Zeus is a sky god like Jupiter (same root).", "Zeus: thunderbolt, eagle, aegis, bull.", "Hera seduces Zeus (Iliad 14).", "Symposium = drinking party; hetairai = musicians; pederasty = love of boys."], fix: [] },
    sept10: { notes: ["Apollo: killed a snake at Delphi; lyre, laurel wreath, bird (raven); god of athletics and prophecy; Delos; identified with the sun later.", "Daphne: Cupid shoots Apollo (love) and Daphne (rejection); her father Peneus turns her into a tree to protect her.", "Cassandra: rejects him, so her prophecy is cursed — no one believes her. Sibyl: years like grains of sand, no youth — she shrinks and shrinks.", "Coronis: he shoots her, couldn't save her, but saves their child.", "Apollo vs. Zeus; plague god (“accurate-shooter”, Resheph); Delian and Pythian; after the Hymn: care of mortal youth, god of aristocrats.", "Killing Python: proof of divinity, Indo-European hero, bringing order, qualifies him for Olympus, allegiance to Zeus, killing Gaea's monsters."],
      fix: ["Your notes say “Gaea throws a discus in his face and kills Hyacinth.” Study guide: Hyacinth was <b>killed accidentally by Apollo</b> (with a discus). (Some versions blame the west wind, Zephyrus — never Gaea.)", "Your notes say Coronis “rejected him.” The study guide calls Coronis Apollo's <b>cheating girlfriend</b> (the raven reported her). The review question still groups her with women whose affairs with Apollo failed."] },
    sept15: { notes: ["(Notes dated 9-14.) Hades: Zeus' brother, “invisible”, also Pluto (wealth). Poseidon: earth-shaker; seas, earthquakes, horses; contest for Athens; wife Amphitrite; trident.", "Hermes: petasos (traveling hat with a string), winged sandals; guides the dead; parents Maia & Zeus; long infancy, extreme anthropomorphism; rival to big brother Apollo; must give back the cows to join the gods; herding, messenger, merchants, commerce, thieves.", "Pan(ic): shepherds and flocks, rustic music, inspires panic; rejected by Syrinx and Echo.", "Hephaestus: Vulcan, hammer, never shown nude; Aphrodite was his wife.", "Ares: “war”, murder and blood; loves Aphrodite. Mars: father of the founder of Rome. Athena: war strategy."],
      fix: ["Your notes call Pan an “early depiction of the devil.” The slide's point: later images of the <b>devil were modeled on Pan</b> (goat features)."] }
  };
  const byId = Object.fromEntries(window.DATA_LECTURES.map((l) => [l.id, l]));
  for (const [id, v] of Object.entries(MY)) Object.assign(byId[id], { mynotes: v.notes, fix: v.fix });
  byId.sept17.fix = ["Your notes list Hippolytus among the hunters Artemis kills. In the usual myth Hippolytus is Artemis' devotee, killed through Aphrodite's anger (Poseidon's bull) — Orion and Actaeon are the ones Artemis kills."];

  const ORDER = ["aug25", "aug27", "sept1", "sept3", "sept8", "sept10", "sept15", "sept17", "sept22"];
  window.DATA_LECTURES.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
})();
