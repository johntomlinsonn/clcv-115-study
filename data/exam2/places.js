// Exam 2 map data (docs/exam2/05-maps.md). tested:true = on the study guide; the rest are distractors.
// tol_km = click tolerance; Athens/Eleusis are only ~18 km apart, so they get tight tolerances on the Attica close-up.
window.DATA_PLACES = [
  { id: "athens", name: "Athens", lat: 37.9715, lng: 23.7267, tol_km: 8, tested: true, note: "Athena's city; Theseus, Erichthonius, Cecrops, Procne & Philomela", meaning: "Athena's city" },
  { id: "eleusis", name: "Eleusis", lat: 38.0412, lng: 23.5420, tol_km: 7, tested: true, note: "township in Athens' territory (Attica), 14 miles west of Athens; sanctuary of Demeter, the Eleusinian Mysteries", meaning: "the site of the sanctuary of Demeter" },
  { id: "thebes", name: "Thebes", lat: 38.3219, lng: 23.3190, tol_km: 9, tested: true, note: "home of the House of Cadmus (Boeotia); Dionysus' first Greek city; Oedipus; Seven against Thebes", meaning: "the home of the House of Cadmus" },
  { id: "corinth", name: "Corinth", lat: 37.9057, lng: 22.8790, tol_km: 9, tested: true, note: "home of Oedipus' foster parents, Polybus and Merope (by the Isthmus)", meaning: "the home of Oedipus' foster parents, Polybus and Merope" },
  { id: "argive", name: "Argive plain", lat: 37.68, lng: 22.75, region: "argive", noun: "region", tested: true, note: "the Argolid: Mycenae, Argos, Tiryns, Lerna and the river Inachus", meaning: "the location of Mycenae, Argos and the river Inachus" },
  { id: "crete", name: "Crete", lat: 35.24, lng: 24.90, region: "crete", noun: "island", tested: true, note: "home of Minos and the Minotaur; Cnossus; Minoan palaces", meaning: "the home of Minos and the Minotaur" },
  { id: "delphi", name: "Delphi", lat: 38.4824, lng: 22.5010, tol_km: 25, tested: true, note: "shrine and oracle of Apollo; Cadmus, Laius, Oedipus and Aegeus all consult it", meaning: "the shrine and oracle of Apollo" },
  { id: "olympus", name: "Mt. Olympus", lat: 40.0859, lng: 22.3583, tol_km: 35, tested: true, note: "home of the 12 Olympian gods (northern Greece)", meaning: "the home of the 12 Olympian gods" },
  { id: "greece", name: "Greece", lat: 39.0, lng: 22.0, region: "greece", noun: "region", tested: true, note: "mainland + Aegean islands", meaning: "the land of the Hellenes" },
  { id: "mesopotamia", name: "Mesopotamia", lat: 33.5, lng: 44.0, region: "mesopotamia", noun: "region", tested: true, note: "“between the rivers” Tigris & Euphrates; Uruk, city of Gilgamesh", meaning: "the land of Gilgamesh" },
  // point distractors (course reading questions ask you to find several of these)
  { id: "argos", name: "Argos", lat: 37.6333, lng: 22.7290 }, { id: "mycenae", name: "Mycenae", lat: 37.7308, lng: 22.7561 },
  { id: "tiryns", name: "Tiryns", lat: 37.5995, lng: 22.7996 }, { id: "megara", name: "Megara", lat: 37.9960, lng: 23.3440 },
  { id: "troezen", name: "Troezen", lat: 37.4970, lng: 23.3510 }, { id: "cithaeron", name: "Mt. Cithaeron", lat: 38.1830, lng: 23.2500 },
  { id: "salamis", name: "Salamis", lat: 37.9300, lng: 23.4900 }, { id: "marathon", name: "Marathon", lat: 38.1530, lng: 23.9630 },
  { id: "sparta", name: "Sparta", lat: 37.0735, lng: 22.4297 }, { id: "troy", name: "Troy", lat: 39.9575, lng: 26.2389 },
  { id: "ithaca", name: "Ithaca", lat: 38.3700, lng: 20.7200 }, { id: "naxos", name: "Naxos", lat: 37.1000, lng: 25.3800 },
  { id: "delos", name: "Delos", lat: 37.3999, lng: 25.2680 }, { id: "seriphos", name: "Seriphos", lat: 37.1500, lng: 24.4800 },
  { id: "olympia", name: "Olympia", lat: 37.6380, lng: 21.6300 }, { id: "pylos", name: "Pylos", lat: 37.0270, lng: 21.6950 },
  { id: "dodona", name: "Dodona", lat: 39.5460, lng: 20.7880 }, { id: "chalcis", name: "Chalcis", lat: 38.4630, lng: 23.5940 },
  { id: "babylon", name: "Babylon", lat: 32.5364, lng: 44.4209 }, { id: "uruk", name: "Uruk", lat: 31.3240, lng: 45.6370 },
  { id: "byblos", name: "Byblos", lat: 34.1200, lng: 35.6480 }, { id: "sicily", name: "Sicily", lat: 37.6000, lng: 14.0154 },
  { id: "rome", name: "Rome", lat: 41.9028, lng: 12.4964 },
  // area-sized distractors for the outlined regions
  { id: "attica", name: "Attica", lat: 38.05, lng: 23.80 }, { id: "boeotia", name: "Boeotia", lat: 38.40, lng: 23.10 },
  { id: "arcadia", name: "Arcadia", lat: 37.55, lng: 22.20 }, { id: "euboea", name: "Euboea", lat: 38.55, lng: 23.80 },
  { id: "cyprus", name: "Cyprus", lat: 35.13, lng: 33.43 }, { id: "rhodes", name: "Rhodes", lat: 36.20, lng: 28.00 },
  { id: "egypt", name: "Egypt", lat: 27.0, lng: 30.5 }, { id: "anatolia", name: "Anatolia (Asia Minor)", lat: 39.0, lng: 33.0 },
  { id: "italy", name: "Italy", lat: 42.5, lng: 12.8 }, { id: "persia", name: "Persia (Iran)", lat: 32.0, lng: 53.0 },
  { id: "phoenicia", name: "Phoenicia", lat: 33.6, lng: 35.5 }
];

// Region outlines [lat, lng] (approximate; used for "click inside" and the outlined-region questions)
window.DATA_REGIONS = {
  greece: [[41.8, 20.0], [41.4, 22.6], [41.5, 24.5], [40.9, 26.3], [39.5, 26.0], [38.2, 25.6], [36.3, 26.4], [35.0, 24.0], [36.2, 22.4], [36.4, 21.6], [38.3, 20.6], [39.6, 19.9]],
  mesopotamia: [[37.2, 38.5], [37.3, 42.8], [35.5, 44.8], [33.0, 46.5], [31.0, 48.5], [29.9, 48.4], [30.6, 46.2], [32.3, 44.0], [33.8, 42.0], [35.8, 39.2]],
  argive: [[37.80, 22.62], [37.79, 22.80], [37.66, 22.90], [37.55, 22.84], [37.52, 22.72], [37.58, 22.64], [37.70, 22.60]],
  crete: [[35.70, 23.52], [35.58, 24.20], [35.52, 24.90], [35.40, 25.60], [35.32, 26.30], [35.00, 26.30], [34.90, 25.60], [34.88, 24.80], [35.05, 24.00], [35.20, 23.50]]
};
