/* Flashcards with compressed Leitner boxes (§2, §8.1). */
(function () {
  "use strict";
  const { $, el, esc, shuffle } = App;
  const INTERVAL = { 1: 1, 2: 2, 3: 4 }; // box → review every Nth round; box 4 = mastered
  const CLUSTER_NAMES = Object.fromEntries(App.stories.map((s) => [s.id, s.title]));

  // ------------------------------------------------------------------ card building
  function termBack(t, showTerm) {
    const parts = [];
    if (showTerm) parts.push(`<div class="front-text" style="margin-bottom:8px">${esc(t.term)}</div>`);
    parts.push(`<div class="guide">${esc(t.guide)}</div>`);
    if (t.more.length) parts.push(`<ul>${App.uniq(t.more).map((m) => `<li>${esc(m)}</li>`).join("")}</ul>`);
    if (t.roman) parts.push(`<div class="small muted">Roman: ${esc(t.roman)}</div>`);
    if (t.mnemonic) parts.push(`<div class="mnemonic">🧠 ${esc(t.mnemonic)}</div>`);
    if (t.headsup) parts.push(`<div class="headsup">${esc(t.headsup)}</div>`);
    if (t.image) parts.push(`<img class="thumb" src="${App.imgSrc(t.image)}" alt="${esc(t.term)}">`);
    const rel = App.terms.filter((x) => x.cluster && x.cluster === t.cluster && x !== t && x.cat !== "source").slice(0, 6);
    if (t.cluster) parts.push(`<div class="small" style="margin-top:8px">Related: ${rel.map((r) => esc(r.term)).join(" · ")} — <a href="#/learn/${t.cluster}" target="_blank" rel="noopener">story ${t.cluster.toUpperCase()}</a></div>`);
    return parts.join("");
  }
  function termCards(t) {
    const cards = [
      { id: `${t.id}:f`, term: t, label: "Term → meaning", front: `<div class="front-text">${esc(t.term)}</div>`, back: termBack(t, false), answer: [t.guide] },
      { id: `${t.id}:r`, term: t, label: "Meaning → term", front: `<div class="front-text long">${esc(t.guide)}</div>`, back: termBack(t, true), answer: variants(t.term) }
    ];
    if (App.state.settings.factCards) {
      t.more.forEach((m, i) => cards.push({ id: `${t.id}:x${i}`, term: t, label: "Fact → who/what?", front: `<div class="front-text long">${esc(m)}</div>`, back: termBack(t, true), answer: variants(t.term) }));
    }
    return cards;
  }
  function variants(name) {
    const v = [name];
    const noParen = name.replace(/\(.*?\)/g, "").trim();
    v.push(noParen);
    (name.match(/\((.*?)\)/g) || []).forEach((m) => v.push(m.slice(1, -1)));
    noParen.split(/[\/&]/).forEach((x) => x.trim() && v.push(x.trim()));
    return App.uniq(v);
  }
  function imageCards() {
    return App.images.map((im) => ({
      id: `img:${im.id}`, label: "Image → who / what?", tag: "images",
      front: `<img class="card-img" src="${App.imgSrc(im.file)}" alt="Quiz image">`,
      back: `<div class="guide">${esc(im.answer)}</div><ul>${im.clues.map((c) => `<li>${esc(c)}</li>`).join("")}</ul><div class="small">${esc(im.story)}</div><img class="thumb" src="${App.imgSrc(im.file)}" alt="${esc(im.answer)}">`,
      answer: [im.answer, im.short]
    }));
  }
  function romanCards() {
    return App.terms.filter((t) => t.roman && t.cat === "divinity").map((t) => ({
      id: `rom:${t.id}`, label: "Greek → Roman", term: t, front: `<div class="front-text">${esc(t.term)}</div><div class="muted">Roman name?</div>`,
      back: `<div class="front-text">${esc(t.roman)}</div><div class="muted small">${esc(t.guide)}</div>`, answer: variants(t.roman)
    }));
  }

  const DECKS = [
    { id: "due", name: "Due now", desc: "Leitner: everything due across all decks" },
    { id: "all", name: "All", desc: "every card" },
    { id: "divinity", name: "Divinities", desc: "gods, Titans, monsters" },
    { id: "mortal", name: "Mortals", desc: "Actaeon → Sibyl" },
    { id: "concept", name: "Concepts", desc: "aegis → xenia" },
    { id: "place", name: "Places", desc: "the 7 map places" },
    { id: "source", name: "Sources", desc: "texts & authors" },
    { id: "lecture", name: "Lecture slides", desc: "terms from the Aug 27–Sept 15 decks" },
    { id: "images", name: "Images", desc: "the 14 tested images" },
    { id: "roman", name: "Roman names", desc: "Zeus → Jupiter…" },
    ...App.stories.map((s) => ({ id: s.id, name: s.id.toUpperCase() + " · " + s.title.split("(")[0].trim(), desc: "story cluster" })),
    { id: "mistakes", name: "Fix My Mistakes", desc: "cards you've missed" },
    { id: "mastered", name: "Mastered review", desc: "box-4 cards, once before the mock" }
  ];
  App.allCards = function () {
    return App.terms.flatMap(termCards).concat(imageCards(), romanCards());
  };
  function deckCards(id) {
    const all = App.allCards();
    const st = App.state.cards;
    switch (id) {
      case "all": return all;
      case "due": return all.filter(isDue);
      case "images": return all.filter((c) => c.id.startsWith("img:"));
      case "roman": return all.filter((c) => c.id.startsWith("rom:"));
      case "mistakes": return all.filter((c) => st[c.id] && st[c.id].wrong > 0 && st[c.id].box < 4);
      case "mastered": return all.filter((c) => st[c.id] && st[c.id].box === 4);
      default:
        if (/^c\d$/.test(id)) return all.filter((c) => c.term && c.term.cluster === id && !c.id.startsWith("rom:"));
        return all.filter((c) => c.term && c.term.cat === id && !c.id.startsWith("rom:"));
    }
  }
  function isDue(c) {
    const s = App.state.cards[c.id];
    if (!s) return true;
    if (s.box >= 4) return false;
    return App.state.settings.round - (s.last || 0) >= INTERVAL[s.box];
  }
  App.cardStats = function () {
    const all = App.allCards();
    const byCat = {};
    all.forEach((c) => {
      const cat = c.id.startsWith("img:") ? "images" : c.id.startsWith("rom:") ? "roman" : c.term.cat;
      const s = (byCat[cat] = byCat[cat] || { total: 0, learned: 0, mastered: 0 });
      const cs = App.state.cards[c.id];
      s.total++;
      if (cs && cs.box >= 2) s.learned++;
      if (cs && cs.box >= 4) s.mastered++;
    });
    const tot = all.length, mastered = all.filter((c) => (App.state.cards[c.id] || {}).box >= 4).length;
    return { byCat, total: tot, mastered, due: all.filter(isDue).length };
  };

  // ------------------------------------------------------------------ similarity for "type the answer"
  function norm(s) { return App.plain(s).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim(); }
  function lev(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  App.similarity = function (typed, answers) {
    const t = norm(typed);
    if (!t) return 0;
    return Math.max(...answers.map((a) => { const b = norm(a); return 1 - lev(t, b) / Math.max(t.length, b.length, 1); }));
  };

  // ------------------------------------------------------------------ #/flash
  App.route("flash", function (root, args) {
    if (args[0]) return session(root, args[0]);
    const stats = App.cardStats();
    root.append(el(`<div class="page-head"><h1>Flashcards</h1>
      <p>Answer in your head <em>before</em> flipping (goal: under 5 s). Rate honestly: <strong>Again</strong> sends the card back to box 1.
      Box 1 = every round · box 2 = every 2nd · box 3 = every 4th · box 4 = mastered. Round ${App.state.settings.round}.</p></div>`));
    const opts = el(`<div class="card row">
      <label class="row"><input type="checkbox" id="typeAns" ${App.state.settings.typeAnswer ? "checked" : ""}> Type the answer (deeper retrieval)</label>
      <label class="row"><input type="checkbox" id="factCards" ${App.state.settings.factCards ? "checked" : ""}> Add fact → who? cards</label>
      <span class="muted small">${stats.due} due · ${stats.mastered}/${stats.total} mastered</span></div>`);
    root.append(opts);
    $("#typeAns", opts).onchange = (e) => { App.state.settings.typeAnswer = e.target.checked; App.save(); };
    $("#factCards", opts).onchange = (e) => { App.state.settings.factCards = e.target.checked; App.save(); App.go("#/flash"); };
    const grid = el(`<div class="deck-grid"></div>`);
    DECKS.forEach((d) => {
      const cards = deckCards(d.id);
      const due = d.id === "mastered" ? cards.length : cards.filter(isDue).length;
      const b = el(`<a class="btn deck-btn ${d.id === "due" ? "primary" : ""}" href="#/flash/${d.id}"><span>${esc(d.name)}</span><small>${esc(d.desc)}</small><small>${d.id === "due" ? due + " due" : due + " due / " + cards.length}</small></a>`);
      grid.append(b);
    });
    root.append(grid);
  });

  function session(root, deckId) {
    const deck = DECKS.find((d) => d.id === deckId) || DECKS[0];
    const cards = deckCards(deck.id);
    let queue = deck.id === "mastered" || deck.id === "mistakes" ? shuffle(cards) : shuffle(cards.filter(isDue));
    root.append(el(`<div class="spread page-head"><h1>${esc(deck.name)}</h1><a class="btn small" href="#/flash">← Decks</a></div>`));
    const wrap = el(`<div class="flash-wrap"></div>`);
    root.append(wrap);
    if (!cards.length) { wrap.append(el(`<div class="card"><p>No cards in this deck yet.</p><a class="btn" href="#/flash">Back to decks</a></div>`)); return; }
    if (!queue.length) {
      const c = el(`<div class="card"><p>Nothing due in <strong>${esc(deck.name)}</strong> this round. 🎉</p><div class="row"><button class="btn primary" type="button">Study all ${cards.length} anyway</button><a class="btn" href="#/quiz">Take a quiz instead</a></div></div>`);
      $("button", c).onclick = () => { queue = shuffle(cards); c.remove(); show(); };
      wrap.append(c);
      return;
    }
    let seen = 0, flipped = false, t0 = 0, timerId = null, cur = null, again = 0;
    const startLen = queue.length;
    show();

    function show() {
      clearInterval(timerId);
      wrap.innerHTML = "";
      if (!queue.length) return finish();
      cur = queue.shift();
      flipped = false;
      const s = App.state.cards[cur.id];
      const card = el(`<div class="card flashcard" tabindex="0" aria-live="polite">
        <span class="label">${esc(cur.label)} · box ${s ? s.box : "new"}</span><span class="timer">0.0s</span>
        <div class="face">${cur.front}</div></div>`);
      wrap.append(el(`<div class="spread small muted" style="margin-bottom:6px"><span>${seen} done · ${queue.length + 1} left</span><span>avg recall ${avgRecall()}</span></div>`));
      wrap.append(card);
      const ctl = el(`<div></div>`);
      wrap.append(ctl);
      if (App.state.settings.typeAnswer) {
        const tb = el(`<form class="typebox"><input type="text" placeholder="Type your answer…" aria-label="Your answer" autocomplete="off"><button class="btn" type="submit">Check</button></form>`);
        tb.onsubmit = (e) => { e.preventDefault(); flip($("input", tb).value); };
        ctl.append(tb);
        setTimeout(() => $("input", tb).focus(), 30);
      }
      const fb = el(`<button class="btn primary" type="button" style="width:100%;margin-top:10px">Show answer <kbd>Space</kbd></button>`);
      fb.onclick = () => flip();
      ctl.append(fb);
      card.onclick = () => { if (!flipped) flip(); };
      t0 = performance.now();
      timerId = setInterval(() => {
        const s = (performance.now() - t0) / 1000;
        const tm = $(".timer", card);
        tm.textContent = s.toFixed(1) + "s";
        tm.classList.toggle("slow", s > 5);
      }, 100);
      App.onCleanup(() => clearInterval(timerId));
    }
    function avgRecall() {
      const r = App.state.settings.recall || [];
      return r.length ? (r.reduce((a, b) => a + b, 0) / r.length).toFixed(1) + " s" : "—";
    }
    function flip(typed) {
      if (flipped) return;
      flipped = true;
      clearInterval(timerId);
      const secs = (performance.now() - t0) / 1000;
      const rec = (App.state.settings.recall = (App.state.settings.recall || []).concat(Math.min(secs, 60)).slice(-50));
      void rec;
      const card = $(".flashcard", wrap);
      $(".face", card).innerHTML = cur.back;
      const ctl = card.nextElementSibling;
      ctl.innerHTML = "";
      let suggest = null;
      if (typed !== undefined) {
        const sim = App.similarity(typed, cur.answer);
        const ok = sim >= 0.8;
        suggest = ok ? (secs < 5 ? 4 : 3) : 1;
        ctl.append(el(`<div class="feedback ${ok ? "good" : "bad"}">${ok ? "✓" : "✗"} ${Math.round(sim * 100)}% match — you typed “${esc(typed || "")}”</div>`));
      }
      const rate = el(`<div class="rate">
        <button class="btn again" data-r="1" type="button">Again<small>box 1 · key 1</small></button>
        <button class="btn" data-r="2" type="button">Hard<small>stay · key 2</small></button>
        <button class="btn good" data-r="3" type="button">Good<small>+1 · key 3</small></button>
        <button class="btn" data-r="4" type="button">Easy<small>+2 · key 4</small></button></div>`);
      App.$$("button", rate).forEach((b) => {
        if (suggest && +b.dataset.r === suggest) b.classList.add("on");
        b.onclick = () => rateCard(+b.dataset.r);
      });
      ctl.append(rate);
      ctl.append(el(`<div class="kbd-hint">Recall time: ${secs.toFixed(1)} s ${secs > 5 ? "(aim for < 5 s)" : "✓"}</div>`));
    }
    function rateCard(r) {
      const st = App.state.cards;
      const s = (st[cur.id] = st[cur.id] || { box: 1, seen: 0, correct: 0, wrong: 0, last: 0 });
      s.seen++;
      s.last = App.state.settings.round;
      if (r === 1) {
        s.box = 1; s.wrong++; again++;
        queue.splice(Math.min(3, queue.length), 0, cur); // see it again this session
      } else {
        s.correct++;
        if (r === 3) s.box = Math.min(4, s.box + 1);
        if (r === 4) s.box = Math.min(4, s.box + 2);
      }
      seen++;
      App.save();
      show();
    }
    function finish() {
      App.state.settings.round++;
      App.save();
      App.onKey = null;
      wrap.innerHTML = "";
      const c = el(`<div class="card"><h2>Round complete</h2><p>${startLen} cards · ${again} “Again” presses · avg recall ${avgRecall()}.</p>
        <p class="muted">Round counter is now ${App.state.settings.round}; box-2 and box-3 cards come back on their schedule.</p>
        <div class="row"><a class="btn primary" href="#/flash/due">Next: due cards</a><a class="btn" href="#/flash">Decks</a><a class="btn" href="#/quiz">Mixed quiz</a></div></div>`);
      wrap.append(c);
    }
    App.onKey = (e) => {
      if (!cur) return;
      const typing = e.target && e.target.tagName === "INPUT";
      if (e.key === " " && !typing) { e.preventDefault(); if (!flipped) flip(); }
      else if (e.key === "Enter" && !flipped && !typing) { e.preventDefault(); flip(); }
      else if (flipped && "1234".includes(e.key) && !typing) { e.preventDefault(); rateCard(+e.key); }
    };
  }
})();
