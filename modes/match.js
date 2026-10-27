/* Match Games (§8.5): tap a left tile, then its partner on the right. Timed. */
(function () {
  "use strict";
  const { $, el, esc, shuffle, sample } = App;
  const SETS = {
    roman: { name: "Greek ↔ Roman", pairs: [["Zeus", "Jupiter"], ["Hera", "Juno"], ["Poseidon", "Neptune"], ["Hades", "Pluto"], ["Hestia", "Vesta"],
      ["Athena", "Minerva"], ["Artemis", "Diana"], ["Aphrodite", "Venus"], ["Ares", "Mars"], ["Hephaestus", "Vulcan"], ["Hermes", "Mercury"],
      ["Eros", "Cupid"], ["Cronus", "Saturn"], ["Apollo", "Apollo (same)"]] },
    meso: { name: "Greek ↔ Mesopotamian", pairs: [["Aphrodite", "Inanna / Ishtar"], ["Uranus (sky)", "An / Anu"], ["Adonis", "Dumuzi (Tammuz)"],
      ["Zeus vs. Typhoeus", "Marduk vs. Tiamat"], ["Deucalion", "Utnapishtim"], ["Hesiod's Theogony", "Enuma Elish"],
      ["Gaea", "Ki"], ["Persephone", "Ereshkigal"], ["Zeus (storms)", "Enlil / Teshub"], ["Cronus", "Kumarbi (Hittite)"], ["Achilles & Patroclus", "Gilgamesh & Enkidu"]] },
    dup: { name: "Hesiod's duplicates", pairs: [["Cronus", "Zeus (sky)"], ["Oceanus", "Nereus (sea)"], ["Eros", "Aphrodite (sex)"], ["Hyperion", "Helios (sun)"], ["Titanomachy", "Gigantomachy"]] },
    takes: { name: "Source ↔ version", pairs: [["Hesiod", "justifies Zeus; creation = sex"], ["Aeschylus", "Prometheus as victim; gifts of knowledge"], ["Ovid", "Prometheus crafts humans; Zeus a tyrant"], ["Apollodorus", "Typhoeus defeats Zeus first; Mt. Etna"], ["Genesis", "monotheistic, not anthropomorphized"], ["Book of Daniel", "Nebuchadnezzar's metal statue"]] },
    floods: { name: "Flood survivors", pairs: [["Ziusudra", "Sumerian (c. 2100 BCE)"], ["Atrahasis", "Akkadian (c. 1700 BCE)"], ["Utnapishtim", "Babylonian Gilgamesh"], ["Noah", "Hebrew Genesis"], ["Deucalion & Pyrrha", "Ovid, Latin (8 CE)"]] },
    fate: { name: "Mortal ↔ fate", pairs: [["Arachne", "spider"], ["Callisto", "bear"], ["Actaeon", "deer, killed by own dogs"], ["Daphne", "laurel tree"],
      ["Cassandra", "prophesy and be disbelieved"], ["Sibyl of Cumae", "age without youth"], ["Myrrha", "myrrh tree"], ["Syrinx", "reeds"],
      ["Lycaon", "wolf"], ["Niobe", "lost twelve children; emblem of grief"], ["Hyacinth", "flower (killed by discus)"], ["Adonis", "killed by a boar"],
      ["Ganymede", "made immortal cupbearer"], ["Asclepius", "killed by thunderbolt for raising the dead"]] },
    attr: { name: "God ↔ attribute", pairs: (window.DATA_ATTRS || []).map(([a, g]) => [g, a]) },
    meaning: { name: "Name ↔ meaning", pairs: [["Zeus", "bright"], ["Hades", "invisible"], ["Prometheus", "forethought"], ["Epimetheus", "afterthought"],
      ["Pandora", "all gifts"], ["Metis", "cleverness"], ["Apotropaic", "warding off evil"], ["Syncretism", "blending"], ["Anthropomorphism", "human form"],
      ["Mesopotamia", "between the rivers"], ["Phoebus", "bright (epithet of Apollo)"]] },
    text: { name: "Text ↔ content", pairs: [["Prometheus Bound (Aeschylus)", "Hephaestus binds Prometheus"], ["Enuma Elish", "Marduk defeats Tiamat"],
      ["Theogony (Hesiod)", "succession myth, Titanomachy"], ["Works and Days (Hesiod)", "Five Ages of Man"], ["Iliad 24", "Achilles hosts Priam"],
      ["Odyssey 8", "Ares & Aphrodite in the net"], ["Hymn to Hermes", "lyre & cattle theft"], ["Hymn to Apollo", "birth on Delos"],
      ["Hymn to Aphrodite", "Anchises"], ["Metamorphoses (Ovid)", "transformations: Daphne, Arachne…"], ["Gilgamesh", "Utnapishtim's flood"]] },
    place: { name: "Place ↔ meaning", pairs: App.places.filter((p) => p.tested).map((p) => [p.name, App.termById[p.id] ? App.termById[p.id].guide : p.note]) }
  };

  App.route("match", function (root) {
    root.append(el(`<div class="page-head"><h1>Match Games</h1><p>Tap a tile on the left, then its partner on the right. 6 pairs per round — beat your time.</p></div>`));
    const bar = el(`<div class="row" style="margin-bottom:12px"></div>`);
    Object.entries(SETS).forEach(([k, s], i) => {
      const b = el(`<button class="btn ${i === 0 ? "on" : ""}" type="button">${esc(s.name)}</button>`);
      b.onclick = () => { App.$$("button", bar).forEach((x) => x.classList.toggle("on", x === b)); play(k); };
      bar.append(b);
    });
    root.append(bar);
    const host = el(`<div class="card"></div>`);
    root.append(host);
    let timer = null;
    App.onCleanup(() => clearInterval(timer));
    play("roman");

    function play(key) {
      clearInterval(timer);
      const set = SETS[key];
      const pairs = sample(set.pairs, Math.min(6, set.pairs.length));
      const best = (App.state.settings.matchBest || {})[key];
      host.innerHTML = "";
      host.append(el(`<div class="spread" style="margin-bottom:10px"><strong>${esc(set.name)}</strong><span class="muted small"><span class="mt">0.0</span>s · misses <span class="mm">0</span>${best ? ` · best ${best.toFixed(1)}s` : ""}</span></div>`));
      const cols = el(`<div class="match-cols"><div class="col L"></div><div class="col R"></div></div>`);
      host.append(cols);
      const t0 = performance.now();
      let sel = null, done = 0, misses = 0;
      timer = setInterval(() => { $(".mt", host).textContent = ((performance.now() - t0) / 1000).toFixed(1); }, 100);
      shuffle(pairs.map((p, i) => [p[0], i])).forEach(([txt, i]) => $(".L", cols).append(tile(txt, i, "L")));
      shuffle(pairs.map((p, i) => [p[1], i])).forEach(([txt, i]) => $(".R", cols).append(tile(txt, i, "R")));
      function tile(txt, i, side) {
        const b = el(`<button class="tile" type="button">${esc(txt)}</button>`);
        b.dataset.i = i; b.dataset.side = side;
        b.onclick = () => {
          if (b.classList.contains("done")) return;
          if (!sel || sel.dataset.side === side) {
            if (sel) sel.classList.remove("sel");
            sel = b; b.classList.add("sel"); return;
          }
          if (sel.dataset.i === b.dataset.i) {
            sel.classList.remove("sel"); sel.classList.add("done"); b.classList.add("done");
            sel.disabled = b.disabled = true; sel = null; done++;
            if (done === pairs.length) finish();
          } else {
            misses++; $(".mm", host).textContent = misses;
            const a = sel; a.classList.remove("sel"); sel = null;
            [a, b].forEach((x) => { x.classList.add("shake"); setTimeout(() => x.classList.remove("shake"), 400); });
          }
        };
        return b;
      }
      function finish() {
        clearInterval(timer);
        const t = (performance.now() - t0) / 1000;
        const bests = (App.state.settings.matchBest = App.state.settings.matchBest || {});
        const rec = misses === 0 && (!bests[key] || t < bests[key]);
        if (rec) bests[key] = t;
        App.save();
        const again = el(`<div class="feedback good" style="margin-top:12px"><strong>${t.toFixed(1)} s</strong> with ${misses} miss${misses === 1 ? "" : "es"}${rec ? " — new best!" : ""} <button class="btn small" type="button" style="margin-left:8px">Play again</button></div>`);
        $("button", again).onclick = () => play(key);
        host.append(again);
      }
    }
  });
})();
