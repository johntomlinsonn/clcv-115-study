/* Greek Life unit: notes, flashcards, quiz, plus modes built for this kind of content —
   timeline ordering, bucket sorting, typed cloze and free-recall lists. */
(function () {
  "use strict";
  const { $, $$, el, esc, shuffle, sample, uniq, pct } = App;
  const G = window.DATA_GREEK;
  if (!G) return;

  const SEC_TAG = Object.fromEntries(Object.keys(G.SEC).map((k) => [k, "greek-" + k]));
  Object.assign(App.TAG_LABEL, { greek: "Greek life" }, ...Object.entries(G.SEC).map(([k, v]) => ({ ["greek-" + k]: "Greek life · " + v })));

  const gs = () => {
    const s = App.state.settings;
    const g = (s.greek = s.greek || {});
    g.cards = g.cards || {}; g.best = g.best || {}; g.done = g.done || {};
    return g;
  };
  const bump = (key, ok) => {
    const d = (gs().done[key] = gs().done[key] || { c: 0, n: 0 });
    d.n++; if (ok) d.c++;
    App.save();
  };

  // ---------------------------------------------------------------- generated multiple choice
  function autoQuestions() {
    const out = [];
    G.CARDS.filter((c) => c.s && c.g && c.g !== "text").forEach((c) => {
      const same = G.CARDS.filter((x) => x !== c && x.g === c.g && x.s && x.s !== c.s).map((x) => x.s);
      const dist = sample(uniq(same.concat(G.POOL[c.g] || [])).filter((x) => x !== c.s), 3);
      if (dist.length < 3) return;
      out.push({ id: "ga_" + c.id, tags: ["greek", SEC_TAG[c.sec]], q: c.q.replace(/\?*$/, "") + "?", opts: [c.s, ...dist], ans: 0, why: c.a + "." });
    });
    return out;
  }
  function allQuestions() {
    const hand = G.QUESTIONS.map((q, i) => Object.assign({ id: "gq" + String(i + 1).padStart(3, "0") }, q));
    return hand.concat(autoQuestions());
  }

  // ---------------------------------------------------------------- shared bits
  const MODES = [
    ["learn", "Read the slides", "Every slide as clean notes + a check per section", "📖"],
    ["flash", "Flashcards", "Leitner boxes, reverse cards, type-the-answer", "🗂"],
    ["quiz", "Quiz", "Hand-written + auto-generated multiple choice", "❓"],
    ["order", "Timeline Builder", "Tap events in chronological order", "⏳"],
    ["sort", "Sort It", "Drop each fraternity/event into the right triad, school, era or house", "🧺"],
    ["cloze", "Fill the Blank", "Type the missing name, year or place", "✍️"],
    ["recall", "Free Recall", "Name all 12 campuses, 5 founders, 9 triad frats…", "🧠"]
  ];
  const back = () => `<p class="small" style="margin-bottom:10px"><a href="#/greek">← Greek Life menu</a></p>`;
  function pills(root, items, onPick, current) {
    const bar = el(`<div class="row" style="margin-bottom:12px"></div>`);
    items.forEach(([k, label]) => {
      const b = el(`<button class="btn ${k === current ? "on" : ""}" type="button">${esc(label)}</button>`);
      b.onclick = () => { $$("button", bar).forEach((x) => x.classList.toggle("on", x === b)); onPick(k); };
      bar.append(b);
    });
    root.append(bar);
    return bar;
  }
  const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  // accepted = array of strings; numbers must match exactly, words may be a little off
  function accepts(typed, accepted) {
    const t = norm(typed);
    if (!t) return false;
    return accepted.some((a) => {
      const n = norm(a);
      if (t === n) return true;
      if (/\d/.test(n)) return false;
      return n.length > 3 && App.similarity(t, [n]) >= 0.8;
    });
  }

  // ---------------------------------------------------------------- route + hub
  App.route("greek", function (root, args) {
    const mode = args[0];
    const fn = { learn, flash, quiz, order, sort, cloze, recall }[mode];
    if (fn) return fn(root, args.slice(1));
    hub(root);
  });

  function hub(root) {
    const g = gs();
    root.append(el(`<div class="page-head"><h1>Greek Life</h1>
      <p>History of fraternities and of Alpha Delta Phi at Illinois, from the slide deck. This content is dates, names, places and lists — so beyond flashcards and quizzes you get timeline building, sorting, typed fill-in-the-blank and free recall.</p></div>`));
    const grid = el(`<div class="deck-grid"></div>`);
    MODES.forEach(([k, name, desc, icon]) => {
      grid.append(el(`<a class="btn deck-btn" href="#/greek/${k}"><span>${icon} ${esc(name)}</span><small>${esc(desc)}</small></a>`));
    });
    grid.append(el(`<a class="btn deck-btn" href="#/match"><span>🔗 Match Games</span><small>4 new Greek Life sets at the end of the list</small></a>`));
    root.append(grid);
    const rows = [["quiz", "Quiz"], ["order", "Timeline"], ["sort", "Sort"], ["cloze", "Fill-blank"], ["recall", "Recall"]];
    const prog = el(`<div class="card" style="margin-top:16px"><h3>Your accuracy</h3></div>`);
    let any = false;
    rows.forEach(([k, label]) => {
      const keys = Object.keys(g.done).filter((x) => x === k || x.startsWith(k + ":"));
      const c = keys.reduce((a, x) => a + g.done[x].c, 0), n = keys.reduce((a, x) => a + g.done[x].n, 0);
      if (!n) return;
      any = true;
      prog.append(el(`<div class="bar-row"><span>${label}</span><div class="bar ${pct(c, n) < 80 ? "accent" : ""}"><span style="width:${pct(c, n)}%"></span></div><span>${c}/${n}</span></div>`));
    });
    const cards = G.CARDS;
    const mastered = cards.filter((c) => (g.cards[c.id] || {}).box >= 4).length;
    prog.append(el(`<div class="bar-row"><span>Cards mastered</span><div class="bar"><span style="width:${pct(mastered, cards.length)}%"></span></div><span>${mastered}/${cards.length}</span></div>`));
    if (!any) prog.append(el(`<p class="muted small">Nothing yet — start with “Read the slides”.</p>`));
    root.append(prog);
    root.append(el(`<div class="headsup" style="margin-top:16px"><strong>Check this:</strong> the slides give 2015 as the year the brothers were kicked out of the house, but also say the house was used until 2018 and the chapter “shut down in 2018.” Know both dates as given, and ask your instructor which one they want. Also, the slides list the Illinois re-founders ("6 Founding Fathers") separately from the 5 original 1830s founders.</div>`));
  }

  // ---------------------------------------------------------------- learn
  function learn(root) {
    root.append(el(back() + `<div class="page-head"><h1>Greek Life — slide notes</h1><p>One block per slide. Read a section, then take its check.</p></div>`));
    const host = el(`<div></div>`);
    let cur = Object.keys(G.SEC)[0];
    pills(root, Object.entries(G.SEC), (k) => { cur = k; draw(); }, cur);
    root.append(host);
    function draw() {
      host.innerHTML = "";
      G.NOTES.filter((n) => n.sec === cur).forEach((n) => {
        host.append(el(`<div class="card story"><h3>${esc(n.title)}</h3><ul>${n.bullets.map((b) => `<li>${b}</li>`).join("")}</ul></div>`));
      });
      const qs = allQuestions().filter((q) => q.tags.includes(SEC_TAG[cur]) && q.id.startsWith("gq"));
      const box = el(`<div></div>`);
      const btn = el(`<button class="btn primary" type="button" style="margin:8px 0 16px">Check this section (${Math.min(5, qs.length)} Qs)</button>`);
      btn.onclick = () => {
        btn.disabled = true;
        App.runQuiz(box, sample(qs, 5), { mode: "learn", title: G.SEC[cur] });
        box.scrollIntoView({ behavior: "smooth", block: "start" });
      };
      host.append(btn, box);
    }
    draw();
  }

  // ---------------------------------------------------------------- flashcards
  function flash(root) {
    root.append(el(back() + `<div class="page-head"><h1>Greek Life — flashcards</h1><p>Rate honestly: <em>Missed</em> sends a card to box 1, <em>Got it</em> moves it up. Box 4 = mastered.</p></div>`));
    const g = gs();
    const opts = { deck: "all", reverse: false, type: false, mastered: false };
    const bar = el(`<div class="row" style="margin-bottom:10px"></div>`);
    const sel = el(`<select aria-label="Deck">${[["all", "All sections"], ...Object.entries(G.SEC), ["weak", "Missed cards"]].map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("")}</select>`);
    const chk = (key, label) => {
      const l = el(`<label class="small"><input type="checkbox"> ${esc(label)}</label>`);
      $("input", l).onchange = (e) => { opts[key] = e.target.checked; start(); };
      return l;
    };
    sel.onchange = () => { opts.deck = sel.value; start(); };
    bar.append(sel, chk("reverse", "Reverse (answer → prompt)"), chk("type", "Type the answer"), chk("mastered", "Include mastered"));
    root.append(bar);
    const host = el(`<div></div>`);
    root.append(host);

    function start() {
      let deck = G.CARDS.filter((c) => c.a && c.s !== null);
      if (opts.deck === "weak") deck = deck.filter((c) => (g.cards[c.id] || {}).wrong > 0 && (g.cards[c.id] || {}).box < 4);
      else if (opts.deck !== "all") deck = deck.filter((c) => c.sec === opts.deck);
      if (!opts.mastered) deck = deck.filter((c) => !((g.cards[c.id] || {}).box >= 4));
      deck = shuffle(deck).sort((a, b) => ((g.cards[a.id] || {}).box || 1) - ((g.cards[b.id] || {}).box || 1));
      let i = 0, right = 0;
      next();
      function next() {
        host.innerHTML = "";
        if (i >= deck.length) {
          host.append(el(`<div class="card"><h2>${deck.length ? "Round complete" : "Nothing to review here"}</h2><p>${deck.length ? `${right}/${deck.length} got it.` : "Try another deck or tick “Include mastered”."}</p></div>`));
          return;
        }
        const c = deck[i];
        const front = opts.reverse ? c.a : c.q, backTxt = opts.reverse ? c.q : c.a;
        const box = (g.cards[c.id] || {}).box || 1;
        const card = el(`<div class="card flashcard"><div class="muted small">${i + 1} / ${deck.length} · ${esc(G.SEC[c.sec])} · box ${box}</div>
          <div class="front-text long" style="margin:14px 0">${esc(front)}</div><div class="fc-body"></div></div>`);
        host.append(card);
        const body = $(".fc-body", card);
        let revealed = false;
        function reveal(extra) {
          if (revealed) return;
          revealed = true;
          body.innerHTML = "";
          if (extra) body.append(extra);
          body.append(el(`<div class="guide" style="margin:10px 0">${esc(backTxt)}</div>`));
          const rate = el(`<div class="rate row"><button class="btn" data-r="0" type="button">Missed<small>box 1 · 1</small></button><button class="btn" data-r="1" type="button">Hard<small>stay · 2</small></button><button class="btn primary" data-r="2" type="button">Got it<small>box +1 · 3</small></button></div>`);
          $$("button", rate).forEach((b) => (b.onclick = () => rate_(c, +b.dataset.r)));
          body.append(rate);
          App.onKey = (e) => { if ("123".includes(e.key) && e.key) rate_(c, +e.key - 1); };
        }
        if (opts.type) {
          const inp = el(`<input type="text" class="typed" placeholder="Type your answer…" autocomplete="off" style="width:100%;min-height:44px;padding:8px;font:inherit">`);
          const go = el(`<button class="btn" type="button" style="margin-top:8px">Check</button>`);
          const answers = [c.s || backTxt, backTxt];
          const check = () => {
            const ok = accepts(inp.value, opts.reverse ? [c.q] : answers);
            reveal(el(`<div class="feedback ${ok ? "good" : "bad"}">${ok ? "Looks right." : "Not quite — compare:"} You typed: ${esc(inp.value || "(blank)")}</div>`));
          };
          go.onclick = check;
          inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
          body.append(inp, go);
          setTimeout(() => inp.focus(), 0);
        } else {
          const b = el(`<button class="btn primary" type="button">Flip (Space)</button>`);
          b.onclick = () => reveal();
          body.append(b);
          App.onKey = (e) => { if (e.key === " ") { e.preventDefault(); reveal(); } };
        }
      }
      function rate_(c, r) {
        const s = (g.cards[c.id] = g.cards[c.id] || { box: 1, wrong: 0 });
        if (r === 0) { s.box = 1; s.wrong++; } else if (r === 2) { s.box = Math.min(4, s.box + 1); right++; }
        App.save(); i++; next();
      }
    }
    start();
  }

  // ---------------------------------------------------------------- quiz
  function quiz(root) {
    root.append(el(back() + `<div class="page-head"><h1>Greek Life — quiz</h1><p>Learning mode shows feedback after each answer; Test mode grades at the end.</p></div>`));
    const cfg = { sec: "all", mode: "learn", n: 15 };
    const card = el(`<div class="card"><div class="row" style="gap:12px;flex-wrap:wrap">
      <label>Section <select data-s>${[["all", "All sections"], ...Object.entries(G.SEC)].map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join("")}</select></label>
      <label>Mode <select data-m><option value="learn">Learning</option><option value="test">Test</option></select></label>
      <label>Questions <select data-n><option>10</option><option selected>15</option><option>25</option><option value="999">All</option></select></label>
      <button class="btn primary" type="button">Start</button></div></div>`);
    root.append(card);
    const host = el(`<div style="margin-top:16px"></div>`);
    root.append(host);
    $("button", card).onclick = () => {
      cfg.sec = $("[data-s]", card).value; cfg.mode = $("[data-m]", card).value; cfg.n = +$("[data-n]", card).value;
      run();
    };
    function run() {
      let qs = allQuestions();
      if (cfg.sec !== "all") qs = qs.filter((q) => q.tags.includes(SEC_TAG[cfg.sec]));
      qs = sample(qs, cfg.n);
      host.innerHTML = "";
      if (!qs.length) { host.append(el(`<p>No questions.</p>`)); return; }
      App.runQuiz(host, qs, { mode: cfg.mode, title: "Greek life", restart: run, onDone: (r) => { gs().done["quiz:" + cfg.sec] = Object.assign({ c: 0, n: 0 }, gs().done["quiz:" + cfg.sec]); const d = gs().done["quiz:" + cfg.sec]; d.c += r.correct; d.n += r.total; App.save(); } });
    }
  }

  // ---------------------------------------------------------------- timeline builder
  function order(root) {
    root.append(el(back() + `<div class="page-head"><h1>Timeline Builder</h1><p>Tap the events from <strong>earliest to latest</strong>. Tap a placed event to take it back out. Dates stay hidden until you check.</p></div>`));
    const host = el(`<div></div>`);
    pills(root, Object.entries(G.ORDER).map(([k, v]) => [k, v.name]), (k) => play(k), "history");
    root.append(host);
    function play(key) {
      const set = G.ORDER[key];
      const items = set.items.map(([label, when], i) => ({ label, when, i }));
      let placed = [], checked = false;
      const pool = shuffle(items);
      draw();
      function draw() {
        host.innerHTML = "";
        const card = el(`<div class="card"><div class="row" style="gap:8px;flex-wrap:wrap;margin-bottom:12px" data-pool></div><h3>Your timeline</h3><ol data-line style="padding-left:22px;display:grid;gap:6px"></ol><div data-fb></div></div>`);
        host.append(card);
        pool.filter((x) => !placed.includes(x)).forEach((x) => {
          const b = el(`<button class="tile" type="button" style="min-width:140px">${esc(x.label)}</button>`);
          b.onclick = () => { if (!checked) { placed.push(x); draw(); } };
          $("[data-pool]", card).append(b);
        });
        placed.forEach((x, pos) => {
          const ok = checked && x.i === pos;
          const li = el(`<li><button class="tile ${checked ? (ok ? "done" : "shake") : ""}" type="button" style="width:100%;text-align:left">${esc(x.label)}${checked ? ` — <strong>${esc(x.when)}</strong>` : ""}</button></li>`);
          $("button", li).onclick = () => { if (!checked) { placed = placed.filter((p) => p !== x); draw(); } };
          $("[data-line]", card).append(li);
        });
        const fb = $("[data-fb]", card);
        if (!checked && placed.length === items.length) {
          const b = el(`<button class="btn primary" type="button" style="margin-top:12px">Check order</button>`);
          b.onclick = () => {
            checked = true;
            items.forEach((x, pos) => bump("order:" + key, placed[pos] && placed[pos].i === pos));
            draw();
          };
          fb.append(b);
        }
        if (checked) {
          const right = placed.filter((x, pos) => x.i === pos).length;
          fb.append(el(`<div class="feedback ${right === items.length ? "good" : "bad"}" style="margin-top:12px"><strong>${right}/${items.length} in the right slot.</strong>${right === items.length ? " Perfect." : " Correct order: " + items.map((x) => esc(x.label) + " (" + esc(x.when) + ")").join(" → ")}</div>`));
          const again = el(`<button class="btn" type="button" style="margin-top:10px">Try again</button>`);
          again.onclick = () => play(key);
          fb.append(again);
        }
      }
    }
    play("history");
  }

  // ---------------------------------------------------------------- sort it
  function sort(root) {
    root.append(el(back() + `<div class="page-head"><h1>Sort It</h1><p>Each item appears once — tap the bucket it belongs to. Great for keeping the three triads straight.</p></div>`));
    const host = el(`<div></div>`);
    pills(root, Object.entries(G.SORT).map(([k, v]) => [k, v.name]), (k) => play(k), "triads");
    root.append(host);
    function play(key) {
      const set = G.SORT[key];
      const queue = shuffle(set.items);
      let i = 0, ok = 0; const misses = [];
      next();
      function next() {
        host.innerHTML = "";
        if (i >= queue.length) {
          host.append(el(`<div class="card"><h2>${ok}/${queue.length}</h2>${misses.length ? `<p>Review: ${misses.map(([t, b]) => `<strong>${esc(t)}</strong> → ${esc(set.buckets[b])}`).join(" · ")}</p>` : "<p>Flawless.</p>"}<button class="btn primary" type="button">Again</button></div>`));
          $("button", host).onclick = () => play(key);
          return;
        }
        const [txt, b] = queue[i];
        const card = el(`<div class="card"><div class="muted small">${i + 1} / ${queue.length}</div><div class="front-text long" style="margin:14px 0">${esc(txt)}</div><div class="opts"></div><div data-fb></div></div>`);
        set.buckets.forEach((name, bi) => {
          const o = el(`<button class="opt" type="button"><span class="letter">${bi + 1}</span><span>${esc(name)}</span></button>`);
          o.onclick = () => {
            const right = bi === b;
            $$(".opt", card).forEach((x, xi) => { x.disabled = true; if (xi === b) x.classList.add("correct"); });
            if (!right) o.classList.add("wrong");
            if (right) ok++; else misses.push([txt, b]);
            bump("sort:" + key, right);
            const nx = el(`<button class="btn primary" type="button" style="margin-top:12px">${i === queue.length - 1 ? "Finish" : "Next →"}</button>`);
            nx.onclick = () => { i++; next(); };
            $("[data-fb]", card).append(nx);
            App.onKey = (e) => { if (e.key === "Enter") nx.click(); };
          };
          $(".opts", card).append(o);
        });
        host.append(card);
        App.onKey = (e) => { const n = "1234".indexOf(e.key); if (n >= 0 && n < set.buckets.length) $$(".opt", card)[n].click(); };
      }
    }
    play("triads");
  }

  // ---------------------------------------------------------------- cloze
  function cloze(root) {
    root.append(el(back() + `<div class="page-head"><h1>Fill the Blank</h1><p>Typing the answer from memory beats recognising it. Spelling can be a little off for names; numbers must be exact. Enter = check / next.</p></div>`));
    const host = el(`<div></div>`);
    root.append(host);
    let queue = shuffle(G.CLOZE.map(([s, a], i) => ({ s, a: a.split("|"), i })));
    let idx = 0, ok = 0, total = 0;
    const redo = [];
    next();
    function next() {
      host.innerHTML = "";
      if (idx >= queue.length) {
        if (redo.length) { queue = shuffle(redo.splice(0)); idx = 0; host.append(el(`<div class="headsup">Second pass on the ones you missed.</div>`)); }
        else { host.append(el(`<div class="card"><h2>Done: ${ok}/${total} first-try</h2><button class="btn primary" type="button">New round</button></div>`)); $("button", host).onclick = () => { root.innerHTML = ""; cloze(root); }; return; }
      }
      const q = queue[idx];
      const parts = q.s.split("___");
      const card = el(`<div class="card"><div class="muted small">${idx + 1} / ${queue.length}</div><p class="stem" style="margin:12px 0"></p><div data-fb></div></div>`);
      const stem = $(".stem", card);
      stem.append(document.createTextNode(parts[0]));
      const inp = el(`<input type="text" autocomplete="off" aria-label="Missing word" style="min-height:40px;padding:4px 8px;font:inherit;width:11em;border-bottom:2px solid var(--accent)">`);
      stem.append(inp, document.createTextNode(parts[1] || ""));
      const btn = el(`<button class="btn primary" type="button">Check</button>`);
      const skip = el(`<button class="btn small" type="button" style="margin-left:8px">Show answer</button>`);
      $("[data-fb]", card).append(el(`<div class="row" style="margin-top:8px"></div>`));
      $(".row", card).append(btn, skip);
      host.append(card);
      inp.focus();
      let finished = false, tries = 0;
      function settle(right, text) {
        finished = true; inp.disabled = true; btn.textContent = "Next →";
        total++; if (right && tries === 0) ok++;
        if (!right) redo.push(q);
        bump("cloze", right && tries === 0);
        $("[data-fb]", card).append(el(`<div class="feedback ${right ? "good" : "bad"}" style="margin-top:10px">${text}</div>`));
      }
      function check() {
        if (finished) { idx++; next(); return; }
        const right = accepts(inp.value, q.a);
        if (right) settle(true, `<strong>Correct:</strong> ${esc(q.a[0])}`);
        else { tries++; inp.classList.add("shake"); setTimeout(() => inp.classList.remove("shake"), 400); inp.select(); if (tries >= 2) settle(false, `Answer: <strong>${esc(q.a[0])}</strong>`); }
      }
      btn.onclick = check;
      skip.onclick = () => { if (!finished) { tries = 9; settle(false, `Answer: <strong>${esc(q.a[0])}</strong>`); } };
      inp.onkeydown = (e) => { if (e.key === "Enter") check(); };
    }
  }

  // ---------------------------------------------------------------- free recall
  function recall(root) {
    root.append(el(back() + `<div class="page-head"><h1>Free Recall</h1><p>For lists, the best test is to produce every item with no options. Type one item at a time and press Enter. Order doesn't matter.</p></div>`));
    const host = el(`<div></div>`);
    pills(root, G.RECALL.map((r) => [r.id, r.name]), (k) => play(k), G.RECALL[0].id);
    root.append(host);
    function play(id) {
      const set = G.RECALL.find((r) => r.id === id);
      const found = new Set();
      host.innerHTML = "";
      const card = el(`<div class="card"><h3>${esc(set.name)}</h3><div class="spread"><span class="muted small" data-count></span><button class="btn small" type="button" data-reveal>Give up & reveal</button></div>
        <input type="text" autocomplete="off" placeholder="Type an item, press Enter" aria-label="Recall item" style="width:100%;min-height:44px;padding:8px;font:inherit;margin:10px 0"><div data-msg class="small muted"></div><ol data-list style="padding-left:22px;display:grid;gap:4px"></ol></div>`);
      host.append(card);
      const inp = $("input", card);
      inp.focus();
      function render(reveal) {
        $("[data-count]", card).textContent = `${found.size} / ${set.answers.length}`;
        const list = $("[data-list]", card);
        list.innerHTML = "";
        set.answers.forEach(([name], i) => {
          const hit = found.has(i);
          list.append(el(`<li class="${hit ? "" : "muted"}" style="${hit ? "color:var(--good);font-weight:600" : reveal ? "color:var(--bad)" : ""}">${hit || reveal ? esc(name) : "______"}</li>`));
        });
        if (found.size === set.answers.length) {
          const b = gs().best;
          $("[data-msg]", card).innerHTML = `<strong style="color:var(--good)">All ${found.size} recalled!</strong>`;
          bump("recall", true);
          b[id] = Math.max(b[id] || 0, found.size); App.save();
          inp.disabled = true;
        }
      }
      inp.onkeydown = (e) => {
        if (e.key !== "Enter" || !inp.value.trim()) return;
        const typed = inp.value;
        const hitIdx = set.answers.findIndex(([name, alt], i) => !found.has(i) && accepts(typed, [name, ...String(alt).split("|")]));
        const msg = $("[data-msg]", card);
        if (hitIdx >= 0) { found.add(hitIdx); msg.textContent = "✓"; }
        else if (set.answers.some(([name, alt], i) => found.has(i) && accepts(typed, [name, ...String(alt).split("|")]))) msg.textContent = "Already got that one.";
        else { msg.textContent = "Not on the list."; bump("recall", false); }
        inp.value = "";
        render(false);
      };
      $("[data-reveal]", card).onclick = () => { render(true); inp.disabled = true; };
      render(false);
    }
    play(G.RECALL[0].id);
  }
})();
