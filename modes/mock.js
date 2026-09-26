/* Mock Exam (§8.3): 75 questions, 50:00, a–d, flag, navigator, auto-submit. */
(function () {
  "use strict";
  const { $, el, esc, shuffle, sample } = App;
  const N = 75, SECONDS = 50 * 60;

  // Round-robin across groups so every topic is represented.
  function balanced(groups, n) {
    const lists = Object.values(groups).map((g) => shuffle(g)).filter((g) => g.length);
    const out = [];
    while (out.length < n && lists.some((l) => l.length)) {
      for (const l of shuffle(lists)) { if (l.length && out.length < n) out.push(l.pop()); }
    }
    return out;
  }
  App.drawMock = function () {
    const G = App.Gen, canMap = (q) => App.MapKit.canShow(q.map.marker);
    const hand = App.questions.filter((q) => !q.img && !q.file && !q.map);
    const handImg = App.questions.filter((q) => q.img || q.file);
    const handMap = App.questions.filter((q) => q.map && canMap(q));

    const nHand = Math.round(N * 0.35), nImg = Math.round(N * 0.15), nMap = Math.round(N * 0.05);
    // ~60% study-guide/review questions, ~40% lecture-slide questions, each balanced by topic
    const group = (qs) => {
      const g = {};
      qs.forEach((q) => { const t = q.tags.find((x) => x !== "review" && x !== "lecture") || "review"; (g[t] = g[t] || []).push(q); });
      return g;
    };
    const nLecture = Math.round(nHand * 0.4);
    const picked = balanced(group(hand.filter((q) => !q.lec)), nHand - nLecture).concat(balanced(group(hand.filter((q) => q.lec)), nLecture));

    const imgHand = sample(handImg, Math.ceil(nImg / 2));
    const usedImgs = new Set(imgHand.map((q) => q.img));
    const imgGen = shuffle(App.images.filter((i) => !usedImgs.has(i.id))).slice(0, nImg - imgHand.length).map((im) => G.pictureQ(im));

    const mapHand = sample(handMap, Math.min(2, handMap.length));
    const usedPlaces = new Set(mapHand.map((q) => q.map.marker));
    const mapGen = shuffle(App.places.filter((p) => p.tested && !usedPlaces.has(p.id) && App.MapKit.canShow(p.id)))
      .slice(0, nMap - mapHand.length).map((p) => G.mapMarked(p)).filter(Boolean);

    const rest = N - picked.length - imgHand.length - imgGen.length - mapHand.length - mapGen.length;
    const termGroups = {};
    App.terms.filter((t) => !t.extra || t.cat !== "source").forEach((t) => { const k = App.termTag(t); (termGroups[k] = termGroups[k] || []).push(t); });
    const autoTerms = balanced(termGroups, rest);
    const auto = G.fromTerms(autoTerms);
    while (auto.length < rest) auto.push(G.roman());

    return shuffle(picked.concat(imgHand, imgGen, mapHand, mapGen, auto)).slice(0, N);
  };

  App.route("mock", function (root) {
    const mocks = App.state.mocks;
    root.append(el(`<div class="page-head"><h1>Mock Exam</h1>
      <p><strong>75 questions · 50:00</strong> — the real CBTF format (≈ 40 s per question). Mix: ~35% hand-written (review lecture, study guide, lecture slides), ~15% images, ~5% maps, the rest generated from every study-guide term.
      Flag and come back; the exam auto-submits at 0:00. Target ≥ 95% before you go.</p></div>`));
    const card = el(`<div class="card stack">
      <div class="row"><button class="btn primary" type="button" id="startMock">Start mock exam</button>
      <a class="btn" href="#/flash/mastered">Warm-up: mastered cards</a></div>
      <p class="small muted">Tip: no notes, no pausing. Treat it like the CBTF. Powell's index is the only help file there — don't lean on it for more than ~3 questions.</p></div>`);
    root.append(card);
    if (mocks.length) {
      const hist = el(`<div class="card"><h2>History (readiness trend)</h2><table><thead><tr><th>#</th><th>Date</th><th>Score</th><th>Time</th><th>Weakest topics</th></tr></thead><tbody></tbody></table></div>`);
      mocks.slice().reverse().forEach((m, i) => {
        const weak = Object.entries(m.byTag || {}).map(([t, s]) => [t, s.c / s.n]).sort((a, b) => a[1] - b[1]).slice(0, 2)
          .map(([t, p]) => `${App.TAG_LABEL[t] || t} ${Math.round(p * 100)}%`).join(", ");
        $("tbody", hist).append(el(`<tr><td>${mocks.length - i}</td><td>${esc(new Date(m.date).toLocaleString())}</td><td><strong>${m.score}%</strong></td><td>${App.fmtTime(m.time)}</td><td class="small">${esc(weak)}</td></tr>`));
      });
      root.append(hist);
    }
    const host = el(`<div></div>`);
    root.append(host);
    $("#startMock", card).onclick = () => {
      App.$$(".card", root).forEach((c) => c.classList.add("hidden"));
      App.runQuiz(host, App.drawMock(), {
        mode: "mock", title: "Mock", timeLimit: SECONDS,
        onDone: (r) => {
          const byTag = {};
          r.items.forEach((it) => it.q.tags.forEach((t) => { const s = (byTag[t] = byTag[t] || { c: 0, n: 0 }); s.n++; if (it.answer === it.q.ans) s.c++; }));
          App.state.mocks.push({ date: Date.now(), score: App.pct(r.correct, r.total), time: Math.round(r.used), byTag });
          App.save();
        },
        restart: () => App.go("#/mock")
      });
    };
  });
})();
