/* Question generator (§7.4) + Quiz, Review-lecture, and Fix-My-Mistakes pages. */
(function () {
  "use strict";
  const { $, el, esc, shuffle, sample, pick, uniq } = App;
  const G = (App.Gen = {});

  const studyTerms = App.terms.filter((t) => t.cat !== "source" || !t.extra);

  // Pick n distractor items: same cluster first (harder), then the rest of the pool.
  function distract(target, pool, n, key) {
    const seen = new Set([key(target).toLowerCase()]);
    const out = [];
    const near = shuffle(pool.filter((p) => p !== target && p.cluster && p.cluster === target.cluster));
    const far = shuffle(pool.filter((p) => p !== target && !(p.cluster && p.cluster === target.cluster)));
    for (const p of near.concat(far)) {
      const k = key(p).toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(p);
      if (out.length === n) break;
    }
    return out;
  }
  function mcq(id, tags, q, correct, wrongs, why, extra) {
    const opts = shuffle([correct, ...wrongs]);
    return Object.assign({ id, tags, q, opts, ans: opts.indexOf(correct), why }, extra || {});
  }
  const who = (t) => (t.cat === "divinity" || t.cat === "mortal" ? "Who is" : "What is");

  G.termToDef = function (t) {
    const pool = App.terms.filter((x) => x.cat === t.cat);
    const ds = distract(t, pool, 3, (x) => x.guide);
    if (ds.length < 3) return null;
    return mcq(`auto:t2d:${t.id}`, [App.termTag(t), "auto"], `${who(t)} <b>${esc(t.term)}</b>?`, esc(t.guide), ds.map((d) => esc(d.guide)),
      `${esc(t.term)}: ${esc(t.guide)}.${t.more.length ? " " + esc(t.more[0]) + "." : ""}`);
  };
  G.defToTerm = function (t) {
    const pool = App.terms.filter((x) => x.cat === t.cat);
    const ds = distract(t, pool, 3, (x) => x.term);
    if (ds.length < 3) return null;
    return mcq(`auto:d2t:${t.id}`, [App.termTag(t), "auto"], `Which ${t.cat === "divinity" ? "figure" : t.cat === "mortal" ? "mortal" : t.cat === "place" ? "place" : t.cat === "source" ? "text" : "term"} is: “${esc(t.guide)}”?`,
      esc(t.term), ds.map((d) => esc(d.term)), `${esc(t.term)}: ${esc(t.guide)}.`);
  };
  const romanTerms = App.terms.filter((t) => t.roman && t.cat === "divinity" && !/\//.test(t.roman));
  G.roman = function (t) {
    t = t || pick(romanTerms);
    const ds = distract(t, romanTerms, 3, (x) => x.roman);
    return mcq(`auto:rom:${t.id}`, ["roman-names", "auto"], `What is the Roman name of <b>${esc(t.term)}</b>?`, esc(t.roman), ds.map((d) => esc(d.roman)),
      `${esc(t.term)} = ${esc(t.roman)}.`);
  };

  // ---- images
  const imgs = App.images;
  G.imageName = function (im) {
    im = im || pick(imgs);
    const ds = sample(imgs.filter((x) => x !== im), 3);
    return mcq(`auto:imgname:${im.id}`, ["images", "auto"], "What story / figure is depicted?", esc(im.answer), ds.map((d) => esc(d.answer)),
      `${esc(im.answer)} — ${esc(im.clues.join("; "))}.`, { img: im.id });
  };
  const ATTRS = window.DATA_ATTRS || [];
  G.imageClue = function (im) {
    im = im || pick(imgs.filter((x) => x.god));
    if (!im || !im.god) return null;
    const ds = sample(ATTRS.filter((a) => a[1] !== im.god), 3);
    return mcq(`auto:imgclue:${im.id}`, ["images", "auto"], `What identifies the figure as <b>${esc(im.god)}</b>?`, esc(im.clueText), ds.map((d) => esc(d[0])),
      `${esc(im.god)}: ${esc(im.clues.join("; "))}.`, { img: im.id });
  };
  const allSpots = imgs.flatMap((i) => (i.hotspots || []).map((h) => Object.assign({ img: i.id }, h)));
  G.imageLabel = function (im) {
    im = im || pick(imgs.filter((x) => (x.hotspots || []).length >= 2));
    const hs = im.hotspots || [];
    if (hs.length < 2) return G.imageClue(im.god ? im : null) || G.imageName(im);
    const k = Math.floor(Math.random() * hs.length);
    const h = hs[k];
    const pool = uniq(allSpots.filter((x) => x.kind === h.kind && x.label !== h.label).map((x) => x.label));
    const ds = sample(pool, 3);
    return mcq(`auto:imglabel:${im.id}:${k}`, ["images", "auto"], `What is item <b>${k + 1}</b>?`, esc(h.label), ds.map(esc),
      `Item ${k + 1} = ${esc(h.label)}. ${esc(im.answer)}.`, { img: im.id, pins: hs });
  };
  G.imageReverse = function (im) {
    im = im || pick(imgs);
    const ds = sample(imgs.filter((x) => x !== im), 3);
    const files = shuffle([im, ...ds]);
    return { id: `auto:imgrev:${im.id}`, tags: ["images", "auto"], q: `Which image shows <b>${esc(im.short)}</b>?`,
      opts: files.map((f) => f.id), optImgs: files.map((f) => f.file), ans: files.indexOf(im), imgAns: im.id,
      why: `${esc(im.answer)} — ${esc(im.clues.join("; "))}.` };
  };
  G.imageCrop = function (im) {
    const cands = imgs.filter((x) => x.god && (x.hotspots || []).some((h) => h.kind === "obj"));
    im = im && cands.includes(im) ? im : pick(cands);
    const h = pick(im.hotspots.filter((x) => x.kind === "obj"));
    const gods = uniq(ATTRS.map((a) => a[1]).filter((g) => g !== im.god));
    return mcq(`auto:imgcrop:${im.id}:${h.label}`, ["images", "auto"], "Zoom challenge: whose image is this? (Reveal to zoom out.)", esc(im.god), sample(gods, 3).map(esc),
      `${esc(h.label)} → ${esc(im.god)}. ${esc(im.answer)}.`, { img: im.id, crop: h.label });
  };

  // ---- maps
  const tested = App.places.filter((p) => p.tested);
  const pointPlaces = App.places.filter((p) => !p.region && ["egypt", "anatolia", "italy", "persia"].indexOf(p.id) < 0);
  const regionLike = ["greece", "mesopotamia", "egypt", "anatolia", "italy", "persia"].map((id) => App.placeById[id]);
  G.nearest = function (p, n) {
    const pool = p.region ? regionLike.filter((x) => x !== p) : pointPlaces.filter((x) => x !== p);
    return pool.map((x) => [x, App.MapKit.km(p, x)]).sort((a, b) => a[1] - b[1]).slice(0, n).map((x) => x[0]);
  };
  G.mapMarked = function (p) {
    const cands = tested.filter((x) => App.MapKit.canShow(x.id));
    p = p || pick(cands);
    if (!p || !App.MapKit.canShow(p.id)) return null;
    // nearest-first, but keep a little variety
    const ds = sample(G.nearest(p, 5), 3);
    const style = p.region ? "region" : pick(["star", "circle"]);
    const noun = p.region ? "region" : p.id === "cyprus" || p.id === "delos" ? "island" : "place";
    return mcq(`auto:map:${p.id}`, ["maps", "auto"], `Identify the ${noun} marked ${style === "region" ? "(outlined)" : "with a " + style} on the map.`,
      esc(p.name), ds.map((d) => esc(d.name)), `${esc(p.name)}: ${esc(p.note)}.`, { map: { marker: p.id, style } });
  };
  G.placeMeaning = function (p) {
    const cands = tested.filter((x) => !x.region && App.MapKit.canShow(x.id));
    p = p || pick(cands);
    if (!p || p.region) return null;
    // Distractor markers: near the target (harder) but far enough apart not to overlap on the map
    const MK = App.MapKit, view = MK.viewFor([p]);
    const sep = view === "aegean" ? 70 : 350;
    const pool = shuffle(G.nearest(p, view === "wide" ? 30 : 10).filter((x) => MK.canShow(x.id) && (view === "wide" || MK.viewFor([x]) === "aegean")));
    const chosen = [p];
    for (const x of pool) {
      if (chosen.length === 4) break;
      if (chosen.every((c) => MK.km(c, x) >= sep)) chosen.push(x);
    }
    if (chosen.length < 4) return null;
    const markers = shuffle(chosen);
    return { id: `auto:mapmean:${p.id}`, tags: ["maps", "auto"], q: `Which marker is <b>${esc(p.meaning)}</b>?`,
      opts: markers.map((m, i) => `Marker ${"ABCD"[i]}`), ans: markers.indexOf(p), noShuffle: true,
      mapMarkers: markers.map((m) => m.id), why: `${esc(p.name)}: ${esc(p.note)}.` };
  };

  G.fromTerms = function (terms) {
    return terms.map((t) => (Math.random() < 0.5 ? G.termToDef(t) : G.defToTerm(t)) || G.termToDef(t)).filter(Boolean);
  };
  G.pictureQ = function (im) {
    const f = pick([G.imageName, G.imageName, G.imageClue, G.imageLabel, G.imageReverse, G.imageCrop]);
    return f(im) || G.imageName(im);
  };
  G.random = function () {
    const r = Math.random();
    if (r < 0.6) return G.fromTerms([pick(studyTerms)])[0];
    if (r < 0.8) return G.pictureQ();
    if (r < 0.9) return G.mapMarked() || G.roman();
    return G.roman();
  };

  // Build a pool for a set of tags (hand-written + generated), used by Quiz page.
  G.poolForTags = function (tags, includeAuto) {
    const want = new Set(tags);
    const showable = (q) => !q.map || App.MapKit.canShow(q.map.marker);
    const hand = App.questions.filter((q) => q.tags.some((t) => want.has(t)) && showable(q));
    const auto = [];
    if (includeAuto) {
      studyTerms.filter((t) => want.has(App.termTag(t))).forEach((t) => {
        const a = G.termToDef(t), b = G.defToTerm(t);
        if (a) auto.push(a);
        if (b) auto.push(b);
      });
      if (want.has("images")) imgs.forEach((im) => { for (let i = 0; i < 3; i++) auto.push(G.pictureQ(im)); });
      if (want.has("maps")) tested.forEach((p) => { const a = G.mapMarked(p), b = G.placeMeaning(p); if (a) auto.push(a); if (b) auto.push(b); });
      if (want.has("roman-names")) romanTerms.forEach((t) => auto.push(G.roman(t)));
    }
    // de-duplicate by id (generated ids are stable per term/format)
    const seen = new Set();
    return hand.concat(auto).filter((q) => (seen.has(q.id) ? false : (seen.add(q.id), true)));
  };

  // ------------------------------------------------------------------ #/quiz
  App.route("quiz", function (root) {
    const saved = App.state.settings.quiz || { tags: App.TAGS.slice(), count: 25, mode: "learn", auto: true };
    const cfg = Object.assign({}, saved, { tags: saved.tags.slice() });
    root.append(el(`<div class="page-head"><h1>Quiz</h1>
      <p>Mixed topics = interleaving (the real exam is mixed). Learning mode shows the explanation after every answer; Test mode grades at the end. Every question has a 40-second pace bar.</p></div>`));
    const card = el(`<div class="card stack"></div>`);
    root.append(card);
    const host = el(`<div></div>`);
    root.append(host);

    const tagRow = el(`<div><h3>Topics</h3><div class="row tagchips"></div><div class="row" style="margin-top:8px"><button class="btn small" data-all type="button">All</button><button class="btn small" data-none type="button">None</button></div></div>`);
    const chips = $(".tagchips", tagRow);
    App.TAGS.forEach((t) => {
      const b = el(`<button class="chip ${cfg.tags.includes(t) ? "on" : ""}" type="button" aria-pressed="${cfg.tags.includes(t)}">${esc(App.TAG_LABEL[t])}</button>`);
      b.onclick = () => {
        const i = cfg.tags.indexOf(t);
        i >= 0 ? cfg.tags.splice(i, 1) : cfg.tags.push(t);
        b.classList.toggle("on"); b.setAttribute("aria-pressed", i < 0); updateCount();
      };
      chips.append(b);
    });
    $("[data-all]", tagRow).onclick = () => { cfg.tags = App.TAGS.slice(); App.$$(".chip", chips).forEach((c) => c.classList.add("on")); updateCount(); };
    $("[data-none]", tagRow).onclick = () => { cfg.tags = []; App.$$(".chip", chips).forEach((c) => c.classList.remove("on")); updateCount(); };
    card.append(tagRow);

    const opts = el(`<div class="row">
      <label>Questions <select id="qCount" class="btn small">${[10, 25, 50].map((n) => `<option ${n === cfg.count ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <label>Mode <select id="qMode" class="btn small"><option value="learn" ${cfg.mode === "learn" ? "selected" : ""}>Learning (instant feedback)</option><option value="test" ${cfg.mode === "test" ? "selected" : ""}>Test (feedback at end)</option></select></label>
      <label class="row"><input type="checkbox" id="qAuto" ${cfg.auto ? "checked" : ""}> include auto-generated questions</label>
    </div>`);
    card.append(opts);
    const go = el(`<div class="spread"><span class="muted small" id="poolInfo"></span><button class="btn primary" type="button">Start quiz</button></div>`);
    card.append(go);
    function updateCount() {
      const pool = G.poolForTags(cfg.tags, $("#qAuto", opts).checked);
      $("#poolInfo", go).textContent = `${pool.length} questions in pool`;
    }
    $("#qAuto", opts).onchange = updateCount;
    updateCount();
    function start() {
      cfg.count = +$("#qCount", opts).value;
      cfg.mode = $("#qMode", opts).value;
      cfg.auto = $("#qAuto", opts).checked;
      App.state.settings.quiz = cfg;
      App.save();
      const pool = G.poolForTags(cfg.tags, cfg.auto);
      if (!pool.length) { alert("Pick at least one topic."); return; }
      card.classList.add("hidden");
      host.innerHTML = "";
      App.runQuiz(host, sample(pool, cfg.count), { mode: cfg.mode, title: "Quiz", restart: () => App.go("#/quiz") });
    }
    $(".btn.primary", go).onclick = start;
  });

  // ------------------------------------------------------------------ #/review
  App.route("review", function (root) {
    const review = App.questions.filter((q) => q.tags.includes("review"));
    root.append(el(`<div class="page-head"><h1>Review-Lecture Questions</h1>
      <p>All ${review.length} questions from the Sept 24 review slides. Canvas in-class quiz questions get recycled on the exam — also retake every Canvas quiz from weeks 1–5.</p></div>`));
    const card = el(`<div class="card row">
      <button class="btn primary" data-a type="button">All ${review.length} in order (learning)</button>
      <button class="btn" data-b type="button">Shuffled, test mode</button>
      <label class="row"><input type="checkbox" id="canvasDone" ${App.state.settings.canvas ? "checked" : ""}> Retook all Canvas quizzes (weeks 1–5)</label></div>`);
    root.append(card);
    const host = el(`<div></div>`);
    root.append(host);
    $("#canvasDone", card).onchange = (e) => { App.state.settings.canvas = e.target.checked; App.save(); };
    const show = (qs, mode) => { card.classList.add("hidden"); App.runQuiz(host, qs, { mode, title: "Review", restart: () => App.go("#/review") }); };
    $("[data-a]", card).onclick = () => show(review, "learn");
    $("[data-b]", card).onclick = () => show(shuffle(review), "test");
  });

  // ------------------------------------------------------------------ #/errors
  App.route("errors", function (root) {
    const entries = Object.values(App.state.errors).sort((a, b) => b.miss - a.miss);
    const open = entries.filter((e) => (e.streak || 0) < 2);
    const cardMisses = Object.entries(App.state.cards).filter(([, c]) => c.wrong > 0 && c.box < 4).length;
    root.append(el(`<div class="page-head"><h1>Fix My Mistakes</h1>
      <p>Every miss anywhere on the site lands here. A question counts as fixed after you get it right twice in a row.</p></div>`));
    const card = el(`<div class="card row">
      <button class="btn primary" data-drill type="button" ${open.length ? "" : "disabled"}>Drill ${open.length} open mistakes</button>
      <a class="btn" href="#/flash/mistakes">Flashcards: missed cards (${cardMisses})</a>
      <button class="btn small" data-clear type="button" ${entries.length - open.length ? "" : "disabled"}>Clear ${entries.length - open.length} fixed</button></div>`);
    root.append(card);
    const host = el(`<div></div>`);
    root.append(host);
    $("[data-drill]", card).onclick = () => {
      card.classList.add("hidden"); list.classList.add("hidden");
      App.runQuiz(host, shuffle(App.errorQuestions(false)), { mode: "learn", title: "Mistakes", restart: () => App.go("#/errors") });
    };
    $("[data-clear]", card).onclick = () => {
      for (const [k, e] of Object.entries(App.state.errors)) if ((e.streak || 0) >= 2) delete App.state.errors[k];
      App.save(); App.go("#/errors");
    };
    const list = el(`<div class="card"></div>`);
    if (!entries.length) list.append(el(`<p class="muted">No mistakes logged yet. Take a quiz or the mock exam.</p>`));
    entries.forEach((e) => {
      const q = App.qById[e.q.id] || e.q;
      if (!q || !q.opts) return;
      const ans = q.optImgs ? (App.imgById[q.imgAns] || {}).answer || "(image)" : q.opts[q.ans];
      list.append(el(`<div class="miss-item"><div class="spread"><strong>${q.q}</strong><span class="chip">missed ${e.miss}× ${(e.streak || 0) >= 2 ? "· fixed ✓" : e.streak ? "· 1 right" : ""}</span></div>
        <div class="ans">${ans}</div><div class="small muted">${q.why || ""}</div></div>`));
    });
    root.append(list);
  });
})();
