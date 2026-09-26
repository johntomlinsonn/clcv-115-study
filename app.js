/* CLCV 115 Exam 1 study site — core: utilities, state, router, question runner. */
(function () {
  "use strict";
  const App = (window.App = {});

  // ------------------------------------------------------------------ utils
  App.$ = (sel, el = document) => el.querySelector(sel);
  App.$$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  App.el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  App.esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  App.plain = (html) => String(html).replace(/<[^>]+>/g, "");
  App.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  App.sample = (arr, n) => App.shuffle(arr).slice(0, n);
  App.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  App.uniq = (arr) => Array.from(new Set(arr));
  App.pct = (a, b) => (b ? Math.round((100 * a) / b) : 0);
  App.fmtTime = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };
  App.imgSrc = (file) => (file.startsWith("../") ? "assets/" + file.slice(3) : "assets/exam-images/" + file);

  // ------------------------------------------------------------------ data indexes
  App.terms = window.DATA_TERMS || [];
  App.termById = Object.fromEntries(App.terms.map((t) => [t.id, t]));
  App.questions = window.DATA_QUESTIONS || [];
  App.qById = Object.fromEntries(App.questions.map((q) => [q.id, q]));
  App.images = window.DATA_IMAGES || [];
  App.imgById = Object.fromEntries(App.images.map((i) => [i.id, i]));
  App.places = window.DATA_PLACES || [];
  App.placeById = Object.fromEntries(App.places.map((p) => [p.id, p]));
  App.stories = window.DATA_STORIES || [];

  App.TAGS = ["review", "myth-theory", "succession", "mesopotamia", "prometheus", "flood", "zeus-hera", "apollo-artemis",
    "hermes-pan", "aphrodite", "hephaestus-ares", "athena", "sources", "concepts", "images", "maps", "roman-names"];
  App.TAG_LABEL = {
    review: "Review lecture", "myth-theory": "Myth theory", succession: "Creation & succession", mesopotamia: "Mesopotamia",
    prometheus: "Prometheus & Pandora", flood: "Flood", "zeus-hera": "Zeus, Hera & co.", "apollo-artemis": "Apollo & Artemis",
    "hermes-pan": "Hermes & Pan", aphrodite: "Aphrodite", "hephaestus-ares": "Hephaestus & Ares", athena: "Athena",
    sources: "Source texts", concepts: "Concepts", images: "Images", maps: "Maps", "roman-names": "Roman names", auto: "Auto-generated"
  };
  App.CLUSTER_TAG = { c1: "myth-theory", c2: "succession", c3: "mesopotamia", c4: "prometheus", c5: "zeus-hera",
    c6: "apollo-artemis", c7: "hermes-pan", c8: "aphrodite", c9: "athena" };
  App.termTag = (t) => {
    if (t.cat === "source") return "sources";
    if (t.cat === "place") return "maps";
    if (["hephaestus", "ares", "thetis"].includes(t.id)) return "hephaestus-ares";
    if (["deucalion", "flood", "lycaon"].includes(t.id)) return "flood";
    if (t.cat === "concept" && t.cluster !== "c1") return "concepts";
    return App.CLUSTER_TAG[t.cluster] || "concepts";
  };

  // ------------------------------------------------------------------ state (localStorage, fail-safe)
  const KEY = "clcv115_v1";
  App.storageOK = true;
  function defaults() {
    return {
      cards: {}, errors: {}, mocks: [], tagStats: {},
      settings: { round: 1, cbtf: false, canvas: false, protocol: {}, typeAnswer: false, factCards: false, recall: [] },
      streaks: { pictures: 0, map: 0 }
    };
  }
  function load() {
    const d = defaults();
    try {
      const raw = window.localStorage.getItem(KEY);
      if (!raw) return d;
      const s = JSON.parse(raw);
      return Object.assign(d, s, { settings: Object.assign(d.settings, s.settings || {}), streaks: Object.assign(d.streaks, s.streaks || {}) });
    } catch (e) {
      App.storageOK = false;
      return d;
    }
  }
  App.state = load();
  App.save = function () {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(App.state));
      App.storageOK = true;
    } catch (e) {
      App.storageOK = false;
    }
  };
  App.resetState = function () {
    App.state = defaults();
    try { window.localStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ }
  };

  // Record one answered question (all modes): tag stats + error log.
  App.recordAnswer = function (q, correct) {
    const st = App.state;
    for (const tag of q.tags || []) {
      const s = (st.tagStats[tag] = st.tagStats[tag] || { c: 0, w: 0 });
      correct ? s.c++ : s.w++;
    }
    const e = st.errors[q.id];
    if (!correct) {
      st.errors[q.id] = {
        q: snapshot(q), miss: (e ? e.miss : 0) + 1, streak: 0, last: Date.now()
      };
    } else if (e) {
      e.streak = (e.streak || 0) + 1;
    }
    App.save();
  };
  function snapshot(q) {
    // hand-written questions are looked up by id; generated ones are stored whole
    if (App.qById[q.id]) return { id: q.id };
    const s = {};
    for (const k of ["id", "tags", "q", "opts", "ans", "why", "img", "file", "crop", "circle", "pins", "map", "mapMarkers", "optImgs", "noShuffle"]) {
      if (q[k] !== undefined) s[k] = q[k];
    }
    return s;
  }
  App.errorQuestions = function (includeFixed) {
    return Object.values(App.state.errors)
      .filter((e) => includeFixed || (e.streak || 0) < 2)
      .map((e) => (App.qById[e.q.id] ? App.qById[e.q.id] : e.q))
      .filter(Boolean);
  };

  // ------------------------------------------------------------------ router
  App.routes = {};
  App.route = (name, fn) => { App.routes[name] = fn; };
  let cleanups = [];
  App.onCleanup = (fn) => cleanups.push(fn);
  App.onKey = null;

  function render() {
    cleanups.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    cleanups = [];
    App.onKey = null;
    const hash = location.hash.replace(/^#\/?/, "") || "home";
    const [name, ...rest] = hash.split("/");
    const fn = App.routes[name] || App.routes.home;
    App.$$("#nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#/" + (App.routes[name] ? name : "home")));
    const root = App.$("#app");
    root.innerHTML = "";
    window.scrollTo(0, 0);
    fn(root, rest);
    const active = App.$("#nav a.active");
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  App.go = (hash) => {
    if (location.hash === hash) render();
    else location.hash = hash;
  };

  document.addEventListener("keydown", (e) => {
    if (!App.onKey || e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    if (typing && e.key !== "Enter") return;
    App.onKey(e);
  });

  // ------------------------------------------------------------------ media rendering (shared by quizzes)
  App.renderPic = function (q, opts = {}) {
    const img = q.img ? App.imgById[q.img] : null;
    const file = q.file || (img && img.file);
    if (!file) return null;
    const alt = opts.alt || "Quiz image";
    const hs = img ? img.hotspots || [] : [];
    const wrap = App.el(`<div class="media"></div>`);
    if (q.crop) {
      const h = hs.find((x) => x.label === q.crop) || { x: 0.5, y: 0.5 };
      const box = App.el(`<div class="crop"><img alt="${App.esc(alt)}" src="${App.imgSrc(file)}"></div>`);
      const im = box.firstElementChild;
      im.style.transformOrigin = `${h.x * 100}% ${h.y * 100}%`;
      im.style.transform = "scale(2.6)";
      const btn = App.el(`<button class="btn small" type="button">Reveal (zoom out)</button>`);
      btn.onclick = () => { im.style.transform = "scale(1)"; btn.remove(); };
      wrap.append(box, btn);
      return wrap;
    }
    const pic = App.el(`<div class="pic"><img alt="${App.esc(alt)}" src="${App.imgSrc(file)}"></div>`);
    if (q.circle) {
      const h = hs.find((x) => x.label === q.circle);
      if (h) pic.append(App.el(`<span class="ring" style="left:${h.x * 100}%;top:${h.y * 100}%"></span>`));
    }
    if (q.pins) {
      q.pins.forEach((p, i) => pic.append(App.el(`<span class="pin" style="left:${p.x * 100}%;top:${p.y * 100}%">${i + 1}</span>`)));
    }
    wrap.append(pic);
    if (img && img.views && opts.views !== false && !q.file) {
      const th = App.el(`<div class="thumbs"></div>`);
      [img.file, ...img.views].forEach((f) => {
        const t = App.el(`<img alt="Another view" src="${App.imgSrc(f)}">`);
        t.onclick = () => { pic.querySelector("img").src = App.imgSrc(f); };
        th.append(t);
      });
      wrap.append(th);
    }
    return wrap;
  };

  App.renderMedia = function (q, holder) {
    if (q.map || q.mapMarkers) {
      const box = App.el(`<div class="media"></div>`);
      holder.append(box);
      App.MapKit.questionMap(box, q);
      return;
    }
    const pic = App.renderPic(q);
    if (pic) holder.append(pic);
  };

  // ------------------------------------------------------------------ question runner
  // mode "learn": instant feedback; "test"/"mock": answer freely, grade on submit.
  App.runQuiz = function (root, questions, cfg = {}) {
    const mode = cfg.mode || "learn";
    const test = mode !== "learn";
    const pace = cfg.pace || 40;
    const items = questions.map((q) => {
      const n = q.opts.length;
      const fixed = q.noShuffle || q.opts.some((o) => /\b(all|none) of the above\b/i.test(App.plain(o)));
      return { q, perm: fixed ? [...Array(n).keys()] : App.shuffle([...Array(n).keys()]), answer: null, flagged: false, time: 0, recorded: false };
    });
    let idx = 0, done = false, qStart = performance.now();
    const t0 = performance.now();
    const deadline = cfg.timeLimit ? t0 + cfg.timeLimit * 1000 : null;
    let timer = null;

    const wrap = App.el(`<div class="card quiz"></div>`);
    root.append(wrap);

    function elapsedQ() { return (performance.now() - qStart) / 1000; }
    function commitTime() { items[idx].time += elapsedQ(); qStart = performance.now(); }

    function tick() {
      const it = items[idx];
      const bar = App.$(".pace", wrap);
      if (bar && !(mode === "learn" && it.answer !== null)) {
        const s = it.time + elapsedQ();
        bar.firstElementChild.style.width = Math.min(100, (s / pace) * 100) + "%";
        bar.classList.toggle("amber", s >= 30 && s < 40);
        bar.classList.toggle("red", s >= 40);
        const lbl = App.$(".pace-s", wrap);
        if (lbl) lbl.textContent = Math.floor(s) + "s";
      }
      if (deadline) {
        const left = (deadline - performance.now()) / 1000;
        const c = App.$(".clock", wrap);
        if (c) { c.textContent = App.fmtTime(left); c.classList.toggle("low", left < 300); }
        if (left <= 0) finish(true);
      }
    }

    function draw() {
      const it = items[idx], q = it.q;
      const answered = it.answer !== null;
      const reveal = !test && answered;
      wrap.innerHTML = "";
      const head = App.el(`<div class="qhead">
        <span class="qcount">${cfg.title ? App.esc(cfg.title) + " · " : ""}Q ${idx + 1} / ${items.length}</span>
        <span class="row">
          <span class="muted small pace-s"></span>
          ${deadline ? `<span class="clock" aria-live="off"></span>` : ""}
          <button class="btn small flag ${it.flagged ? "flag-on" : ""}" type="button" title="Flag (F)">⚑ ${it.flagged ? "Flagged" : "Flag"}</button>
        </span></div>`);
      wrap.append(head);
      wrap.append(App.el(`<div class="pace" title="40-second pace"><span></span></div>`));
      App.renderMedia(q, wrap);
      wrap.append(App.el(`<div class="stem">${q.q}</div>`));
      const optsEl = App.el(`<div class="opts ${q.optImgs ? "img-opts" : ""}"></div>`);
      it.perm.forEach((oi, pos) => {
        const letter = "abcd"[pos] || String(pos + 1);
        const b = App.el(`<button class="opt ${q.optImgs ? "img-opt" : ""}" type="button" data-oi="${oi}"><span class="letter">${letter}</span><span class="otext"></span></button>`);
        if (q.optImgs) b.querySelector(".otext").append(App.el(`<img alt="Option ${letter.toUpperCase()}" src="${App.imgSrc(q.optImgs[oi])}">`));
        else b.querySelector(".otext").innerHTML = q.opts[oi];
        if (reveal) {
          b.disabled = true;
          if (oi === q.ans) b.classList.add("correct");
          else if (oi === it.answer) b.classList.add("wrong");
        } else if (answered && oi === it.answer) b.classList.add("selected");
        b.onclick = () => choose(oi);
        optsEl.append(b);
      });
      wrap.append(optsEl);
      if (reveal) {
        const ok = it.answer === q.ans;
        const fb = App.el(`<div class="feedback ${ok ? "good" : "bad"}" role="status"><strong>${ok ? "Correct." : "Not quite."}</strong> ${q.why || ""}</div>`);
        if (q.img && App.imgById[q.img]) {
          const im = App.imgById[q.img];
          fb.append(App.el(`<div class="small" style="margin-top:6px"><strong>Image:</strong> ${App.esc(im.answer)} — clues: ${App.esc(im.clues.join("; "))}</div>`));
        }
        wrap.append(fb);
      }
      const nav = App.el(`<div class="qnav"></div>`);
      if (test) {
        const prev = App.el(`<button class="btn" type="button" ${idx === 0 ? "disabled" : ""}>← Prev</button>`);
        prev.onclick = () => move(-1);
        const next = App.el(`<button class="btn" type="button" ${idx === items.length - 1 ? "disabled" : ""}>Next →</button>`);
        next.onclick = () => move(1);
        const sub = App.el(`<button class="btn primary" type="button">Submit</button>`);
        sub.onclick = () => {
          const un = items.filter((x) => x.answer === null).length;
          if (!un || confirm(`${un} unanswered. Submit anyway?`)) finish(false);
        };
        nav.append(prev, sub, next);
      } else {
        const quit = App.el(`<button class="btn small" type="button">End now</button>`);
        quit.onclick = () => finish(false);
        const next = App.el(`<button class="btn primary" type="button" ${answered ? "" : "disabled"}>${idx === items.length - 1 ? "Finish" : "Next →"} </button>`);
        next.onclick = () => (idx === items.length - 1 ? finish(false) : move(1));
        nav.append(quit, next);
      }
      wrap.append(nav);
      if (test) {
        const grid = App.el(`<div class="navgrid" aria-label="Question navigator"></div>`);
        items.forEach((x, i) => {
          const b = App.el(`<button type="button" class="${x.answer !== null ? "answered" : ""} ${i === idx ? "current" : ""} ${x.flagged ? "flagged" : ""}">${i + 1}</button>`);
          b.onclick = () => jump(i);
          grid.append(b);
        });
        wrap.append(grid);
      }
      wrap.append(App.el(`<div class="kbd-hint">Keys: <kbd>1</kbd>–<kbd>4</kbd> or <kbd>a</kbd>–<kbd>d</kbd> answer · <kbd>Enter</kbd> next · <kbd>F</kbd> flag${test ? " · <kbd>←</kbd>/<kbd>→</kbd> navigate" : ""}</div>`));
      head.querySelector(".flag").onclick = toggleFlag;
      tick();
    }

    function choose(oi) {
      const it = items[idx];
      if (done) return;
      if (!test && it.answer !== null) return;
      it.answer = oi;
      if (!test) {
        commitTime();
        const ok = oi === it.q.ans;
        App.recordAnswer(it.q, ok);
        it.recorded = true;
        if (cfg.onAnswer) cfg.onAnswer(it.q, ok);
      }
      draw();
    }
    function move(d) { jump(Math.max(0, Math.min(items.length - 1, idx + d))); }
    function jump(i) { if (i === idx) return; commitTime(); idx = i; draw(); }
    function toggleFlag() { items[idx].flagged = !items[idx].flagged; draw(); }

    function finish(auto) {
      if (done) return;
      done = true;
      commitTime();
      clearInterval(timer);
      App.onKey = null;
      const used = (performance.now() - t0) / 1000;
      if (test) items.forEach((it) => { if (!it.recorded) App.recordAnswer(it.q, it.answer === it.q.ans); });
      const answeredItems = test ? items : items.filter((it) => it.answer !== null);
      const correct = answeredItems.filter((it) => it.answer === it.q.ans).length;
      const result = { items: answeredItems, correct, total: answeredItems.length, used, auto };
      if (cfg.onDone) cfg.onDone(result);
      showResults(result);
    }

    function showResults(r) {
      wrap.innerHTML = "";
      const score = App.pct(r.correct, r.total);
      const byTag = {};
      r.items.forEach((it) => (it.q.tags || []).forEach((t) => {
        const s = (byTag[t] = byTag[t] || { c: 0, n: 0 });
        s.n++; if (it.answer === it.q.ans) s.c++;
      }));
      wrap.append(App.el(`<div>
        ${r.auto ? `<p class="headsup" style="margin-bottom:12px">Time's up — auto-submitted.</p>` : ""}
        <div class="spread"><div><div class="score-big">${score}%</div><div class="muted">${r.correct} / ${r.total} correct</div></div>
        <div class="muted small">Time used ${App.fmtTime(r.used)} · avg ${r.total ? Math.round(r.used / r.total) : 0} s / question (target ≤ 40 s)</div></div></div>`));
      const tagBox = App.el(`<div style="margin-top:14px"><h3>By topic</h3></div>`);
      Object.entries(byTag).sort((a, b) => a[1].c / a[1].n - b[1].c / b[1].n).forEach(([t, s]) => {
        const p = App.pct(s.c, s.n);
        tagBox.append(App.el(`<div class="bar-row"><span>${App.esc(App.TAG_LABEL[t] || t)}</span><div class="bar ${p < 80 ? "accent" : ""}"><span style="width:${p}%"></span></div><span>${s.c}/${s.n}</span></div>`));
      });
      wrap.append(tagBox);
      const misses = r.items.filter((it) => it.answer !== it.q.ans);
      const actions = App.el(`<div class="row" style="margin-top:14px"></div>`);
      if (misses.length) {
        const again = App.el(`<button class="btn primary" type="button">Drill these ${misses.length} misses now</button>`);
        again.onclick = () => { root.innerHTML = ""; App.runQuiz(root, misses.map((m) => m.q), { mode: "learn", title: "Misses" }); };
        actions.append(again);
      }
      if (cfg.restart) {
        const re = App.el(`<button class="btn" type="button">New round</button>`);
        re.onclick = cfg.restart;
        actions.append(re);
      }
      actions.append(App.el(`<a class="btn" href="#/errors">Fix-My-Mistakes →</a>`));
      wrap.append(actions);
      if (misses.length) {
        const list = App.el(`<div style="margin-top:16px"><h3>Review your misses (all logged to Fix-My-Mistakes)</h3></div>`);
        misses.forEach((it) => {
          const yours = it.answer === null ? "(no answer)" : it.q.optImgs ? "(image)" : it.q.opts[it.answer];
          const correct = it.q.optImgs ? App.imgById[it.q.imgAns] ? App.imgById[it.q.imgAns].answer : "(image)" : it.q.opts[it.q.ans];
          list.append(App.el(`<div class="miss-item"><div><strong>${it.q.q}</strong></div>
            <div class="yours">Your answer: ${yours}</div><div class="ans">Correct: ${correct}</div>
            <div class="small muted">${it.q.why || ""}</div></div>`));
        });
        wrap.append(list);
      }
      wrap.scrollIntoView({ block: "start" });
    }

    App.onKey = (e) => {
      if (done) return;
      const k = e.key.toLowerCase();
      const pos = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
      if (k.length === 1 && pos >= 0 && pos < items[idx].perm.length) { e.preventDefault(); choose(items[idx].perm[pos]); }
      else if (k === "enter") {
        e.preventDefault();
        if (!test) { if (items[idx].answer !== null) (idx === items.length - 1 ? finish(false) : move(1)); }
        else move(1);
      } else if (k === "f") toggleFlag();
      else if (k === "arrowright" && test) move(1);
      else if (k === "arrowleft" && test) move(-1);
    };

    draw();
    timer = setInterval(tick, 250);
    App.onCleanup(() => clearInterval(timer));
    return { finish };
  };

  // Self-test (acceptance §10): every question has one correct answer and shuffling preserves it.
  App.selfTest = function () {
    const problems = [];
    for (const q of App.questions) {
      if (!Array.isArray(q.opts) || q.opts.length !== 4) problems.push(`${q.id}: expected 4 options`);
      if (!(q.ans >= 0 && q.ans < q.opts.length)) problems.push(`${q.id}: bad ans`);
      if (new Set(q.opts.map(App.plain)).size !== q.opts.length) problems.push(`${q.id}: duplicate options`);
      const perm = App.shuffle([...Array(q.opts.length).keys()]);
      const displayed = perm.map((i) => q.opts[i]);
      const pos = perm.indexOf(q.ans);
      if (displayed[pos] !== q.opts[q.ans]) problems.push(`${q.id}: shuffle broke correctness`);
      if (q.img && !App.imgById[q.img]) problems.push(`${q.id}: unknown image ${q.img}`);
      if (q.map && !App.placeById[q.map.marker]) problems.push(`${q.id}: unknown place ${q.map.marker}`);
    }
    if (App.Gen) {
      for (let i = 0; i < 200; i++) {
        const q = App.Gen.random();
        if (!q || new Set(q.opts.map(App.plain)).size !== q.opts.length || !(q.ans >= 0)) problems.push(`generated question invalid: ${q && q.id}`);
      }
    }
    console.log(problems.length ? problems : `selfTest OK: ${App.questions.length} hand-written questions`);
    return problems;
  };

  // ------------------------------------------------------------------ footer actions
  function wireFooter() {
    App.$("#exportBtn").onclick = () => {
      const blob = new Blob([JSON.stringify(App.state, null, 1)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "clcv115-progress.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    App.$("#importInput").onchange = (e) => {
      const f = e.target.files[0];
      if (!f) return;
      f.text().then((txt) => {
        try {
          const s = JSON.parse(txt);
          if (!s || typeof s !== "object" || !s.cards) throw new Error("not a progress file");
          App.state = Object.assign(defaults(), s);
          App.save();
          render();
          alert("Progress imported.");
        } catch (err) { alert("Could not import: " + err.message); }
      });
      e.target.value = "";
    };
    App.$("#resetBtn").onclick = () => {
      if (confirm("Erase all progress (cards, mistakes, mock history)?")) { App.resetState(); render(); }
    };
    App.save();
    if (!App.storageOK) App.$("#storageNote").textContent = "Browser storage is off — progress won't persist (use Export).";
  }

  App.start = function () {
    wireFooter();
    window.addEventListener("hashchange", render);
    render();
    if (/[?&]selftest/.test(location.search)) App.selfTest();
  };
})();
