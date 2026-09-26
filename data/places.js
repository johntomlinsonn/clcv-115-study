// Map data (§6). tested:true places are on the exam; the rest are distractors (as in the review slides).
window.DATA_PLACES = [
  { id: "athens", name: "Athens", lat: 37.9715, lng: 23.7267, tol_km: 35, note: "Athena's city (won contest vs. Poseidon)", tested: true, meaning: "Athena's city" },
  { id: "delphi", name: "Delphi", lat: 38.4824, lng: 22.5010, tol_km: 30, note: "shrine and oracle of Apollo; Pythia; Python", tested: true, meaning: "the shrine and oracle of Apollo" },
  { id: "delos", name: "Delos", lat: 37.3999, lng: 25.2680, tol_km: 30, note: "birthplace of Apollo/Artemis; shrine of Apollo (small island in the Cyclades)", tested: true, meaning: "the birthplace of Apollo and Artemis" },
  { id: "olympus", name: "Mt. Olympus", lat: 40.0859, lng: 22.3583, tol_km: 40, note: "home of the 12 Olympian gods (N. Greece, Thessaly/Macedonia border)", tested: true, meaning: "the home of the 12 Olympian gods" },
  { id: "cyprus", name: "Cyprus", lat: 35.1300, lng: 33.4300, tol_km: 120, note: "Aphrodite's island (large island in the far east Mediterranean)", tested: true, meaning: "Aphrodite's island" },
  { id: "greece", name: "Greece", lat: 39.0, lng: 22.0, region: "greece", note: "mainland + Aegean islands", tested: true, meaning: "the land of the Hellenes" },
  { id: "mesopotamia", name: "Mesopotamia", lat: 33.5, lng: 44.0, region: "mesopotamia", note: "'between the rivers' Tigris & Euphrates (modern Iraq); Babylon, Sumer", tested: true, meaning: "the land of the Enuma Elish and Gilgamesh" },
  { id: "troy", name: "Troy", lat: 39.9575, lng: 26.2389 }, { id: "sparta", name: "Sparta", lat: 37.0735, lng: 22.4297 },
  { id: "rome", name: "Rome", lat: 41.9028, lng: 12.4964 }, { id: "crete", name: "Crete", lat: 35.2400, lng: 24.8100 },
  { id: "sicily", name: "Sicily", lat: 37.6000, lng: 14.0154 }, { id: "malta", name: "Malta", lat: 35.9375, lng: 14.3754 },
  { id: "ephesus", name: "Ephesus", lat: 37.9397, lng: 27.3417 }, { id: "parnassus", name: "Mt. Parnassus", lat: 38.5357, lng: 22.6217 },
  { id: "thebes", name: "Thebes", lat: 38.3219, lng: 23.3190 }, { id: "mycenae", name: "Mycenae", lat: 37.7308, lng: 22.7561 },
  { id: "babylon", name: "Babylon", lat: 32.5364, lng: 44.4209 }, { id: "cythera", name: "Cythera", lat: 36.2500, lng: 22.9900 },
  { id: "arcadia", name: "Arcadia", lat: 37.5500, lng: 22.2000 }, { id: "lemnos", name: "Lemnos", lat: 39.9000, lng: 25.2500 },
  // extra distractors so region questions (Greece / Mesopotamia) get same-scale wrong answers
  { id: "egypt", name: "Egypt", lat: 27.0, lng: 30.5 }, { id: "anatolia", name: "Anatolia (Asia Minor)", lat: 39.0, lng: 33.0 },
  { id: "italy", name: "Italy", lat: 42.5, lng: 12.8 }, { id: "persia", name: "Persia (Iran)", lat: 32.0, lng: 53.0 }
];

// Region polygons (approximate; used for "click inside")
window.DATA_REGIONS = {
  greece: [[41.8, 20.0], [41.4, 22.6], [41.5, 24.5], [40.9, 26.3], [39.5, 26.0], [38.2, 25.6], [36.3, 26.4], [35.0, 24.0], [36.2, 22.4], [36.4, 21.6], [38.3, 20.6], [39.6, 19.9]],
  mesopotamia: [[37.2, 38.5], [37.3, 42.8], [35.5, 44.8], [33.0, 46.5], [31.0, 48.5], [29.9, 48.4], [30.6, 46.2], [32.3, 44.0], [33.8, 42.0], [35.8, 39.2]]
};

// Offline fallback: blank Aegean map from the review slides, calibrated linearly
// (x = px from left, y = px from top of the 713×697 image).
window.DATA_FALLBACK_MAP = {
  file: "assets/slide-images/map-aegean-blank.gif", w: 713, h: 697,
  lng0: 23.6, x0: 335, pxPerLng: 77.8,
  lat0: 35.6, y0: 630, pxPerLat: 99
};
