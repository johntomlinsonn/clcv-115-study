/* Home dashboard, Story Mode, Cheat Sheet, Resources. */
(function () {
  "use strict";
  const { $, el, esc } = App;
  // Sun Sept 27 2026, 11:59 PM Central Daylight Time (UTC−5)
  const EXAM_END = Date.UTC(2026, 8, 28, 4, 59, 0);

  const PROTOCOL = [
    ["30 min", "Story Mode — read the 9 cluster stories", "#/learn"],
    ["60 min", "Flashcards: Divinities until every card is box ≥ 2", "#/flash/divinity"],
    ["30 min", "Flashcards: Mortals + Concepts", "#/flash/mortal"],
    ["30 min", "Picture Quiz until 100% twice in a row", "#/pictures"],
    ["15 min", "Map Test until 100% twice in a row", "#/map"],
    ["15 min", "Review-Lecture Questions (the 40 slide questions)", "#/review"],
    ["break", "Sleep if possible (spacing!)", null],
    ["50 min", "Mock Exam #1 → then Fix-My-Mistakes", "#/mock"],
    ["50 min", "Mock Exam #2 (new draw). Target ≥ 95%", "#/mock"],
    ["10 min", "“Final 10” sheet right before walking to the CBTF", "#/cheatsheet"]
  ];
  const CAT_LABEL = { divinity: "Divinities", mortal: "Mortals", concept: "Concepts", place: "Places", source: "Sources", lecture: "Lecture slides", images: "Images", roman: "Roman names" };

  function nextAction(stats) {
    const st = App.state;
    const storiesRead = Object.keys(st.settings.storiesRead || {}).length;
    const seenCards = Object.keys(st.cards).length;
    if (!storiesRead && !seenCards) return ["Start with Story Mode", "#/learn"];
    const div = stats.byCat.divinity || { learned: 0, total: 1 };
    if (div.learned < div.total && stats.due) return [`Flashcards: ${stats.due} cards due`, "#/flash/due"];
    const weak = Object.entries(st.tagStats).filter(([t, s]) => t !== "auto" && s.c + s.w >= 5).map(([t, s]) => [t, s.c / (s.c + s.w)]).sort((a, b) => a[1] - b[1])[0];
    if (weak && weak[1] < 0.8) return [`Drill your weakest topic: ${App.TAG_LABEL[weak[0]] || weak[0]} (${Math.round(weak[1] * 100)}%)`, "quiz:" + weak[0]];
    if (!st.mocks.length) return ["Take Mock Exam #1", "#/mock"];
    if (App.errorQuestions(false).length) return [`Fix ${App.errorQuestions(false).length} logged mistakes`, "#/errors"];
    if (stats.due) return [`Flashcards: ${stats.due} cards due`, "#/flash/due"];
    return ["Take another mock exam", "#/mock"];
  }

  // ------------------------------------------------------------------ #/home
  App.route("home", function (root) {
    const st = App.state;
    const stats = App.cardStats();
    const lastMock = st.mocks.length ? st.mocks[st.mocks.length - 1].score : 0;
    const readiness = Math.round((stats.mastered / stats.total) * 50 + lastMock * 0.5);
    const [actLabel, actHref] = nextAction(stats);

    const hero = el(`<div class="hero">
      <div class="card">
        <h1>CLCV 115 · Exam 1</h1>
        <p class="muted">CBTF window Thu Sept 24 – Sun Sept 27, 2026 · 75 multiple-choice questions in 50 minutes (≈ 40 s each) · Powell ch. 1–9 + lectures.</p>
        <div class="muted small">Time left in the exam window (closes Sun Sept 27, 11:59 PM CT)</div>
        <div class="countdown" id="countdown">—</div>
        <label class="big-check ${st.settings.cbtf ? "done" : ""}" style="margin-top:12px"><input type="checkbox" id="cbtf" ${st.settings.cbtf ? "checked" : ""}><span>Did you book your CBTF slot?<br><span class="small muted">PrairieTest · bring your i-card</span></span></label>
      </div>
      <div class="card">
        <div class="muted small">Overall readiness</div>
        <div class="readiness">${readiness}%</div>
        <div class="bar accent" style="margin-bottom:10px"><span style="width:${readiness}%"></span></div>
        <div class="small muted">= mastered cards (${stats.mastered}/${stats.total}) × ½ + last mock (${st.mocks.length ? lastMock + "%" : "none yet"}) × ½</div>
        <button class="btn primary" id="nextBtn" type="button" style="width:100%;margin-top:14px">Next best action → ${esc(actLabel)}</button>
      </div></div>`);
    root.append(hero);
    const tickCountdown = () => {
      const left = EXAM_END - Date.now();
      const c = $("#countdown");
      if (!c) return;
      if (left <= 0) { c.textContent = "Exam window closed"; return; }
      const d = Math.floor(left / 864e5), h = Math.floor((left % 864e5) / 36e5), m = Math.floor((left % 36e5) / 6e4), s = Math.floor((left % 6e4) / 1e3);
      c.textContent = `${d ? d + "d " : ""}${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
    };
    tickCountdown();
    const cd = setInterval(tickCountdown, 1000);
    App.onCleanup(() => clearInterval(cd));
    $("#cbtf").onchange = (e) => { st.settings.cbtf = e.target.checked; App.save(); e.target.closest(".big-check").classList.toggle("done", e.target.checked); };
    $("#nextBtn").onclick = () => {
      if (actHref.startsWith("quiz:")) {
        st.settings.quiz = { tags: [actHref.slice(5)], count: 25, mode: "learn", auto: true };
        App.save();
        App.go("#/quiz");
      } else App.go(actHref);
    };

    const prog = el(`<div class="two-col"><div class="card"><h2>Flashcard progress</h2><div class="small muted" style="margin-bottom:6px">olive = learned (box ≥ 2) · number = mastered (box 4)</div></div><div class="card"><h2>Quiz accuracy by topic</h2></div></div>`);
    Object.entries(CAT_LABEL).forEach(([k, label]) => {
      const s = stats.byCat[k];
      if (!s) return;
      prog.firstElementChild.append(el(`<div class="bar-row"><span>${label}</span><div class="bar"><span style="width:${App.pct(s.learned, s.total)}%"></span></div><span class="small">${s.mastered}/${s.total}</span></div>`));
    });
    const tagBox = prog.lastElementChild;
    const tags = App.TAGS.filter((t) => st.tagStats[t]);
    if (!tags.length) tagBox.append(el(`<p class="muted">No quiz answers yet.</p>`));
    tags.forEach((t) => {
      const s = st.tagStats[t], p = App.pct(s.c, s.c + s.w);
      tagBox.append(el(`<div class="bar-row"><span>${esc(App.TAG_LABEL[t])}</span><div class="bar ${p < 80 ? "accent" : ""}"><span style="width:${p}%"></span></div><span class="small">${p}%</span></div>`));
    });
    root.append(prog);

    const proto = el(`<div class="card"><h2>Study protocol (1–2 days)</h2>
      <p class="small muted">Retrieval practice + spacing + interleaving. Tick blocks off as you go.</p>
      <table class="protocol"><thead><tr><th></th><th>Block</th><th>Time</th><th>Mode</th></tr></thead><tbody></tbody></table>
      <label class="row" style="margin-top:10px"><input type="checkbox" id="canvasChk" ${st.settings.canvas ? "checked" : ""}> Also: retook every Canvas quiz from weeks 1–5</label></div>`);
    PROTOCOL.forEach(([time, what, href], i) => {
      const tr = el(`<tr><td><input type="checkbox" aria-label="Block ${i + 1} done" ${st.settings.protocol[i] ? "checked" : ""}></td><td>${i === 6 ? "—" : i < 6 ? i + 1 : i}</td><td>${time}</td><td>${href ? `<a href="${href}">${esc(what)}</a>` : esc(what)}</td></tr>`);
      $("input", tr).onchange = (e) => { st.settings.protocol[i] = e.target.checked; App.save(); };
      $("tbody", proto).append(tr);
    });
    $("#canvasChk", proto).onchange = (e) => { st.settings.canvas = e.target.checked; App.save(); };
    root.append(proto);
    root.append(el(`<div class="card sleep"><strong>Your professor's last slide: <em>get eight hours of sleep.</em></strong> Memory consolidation happens during sleep — a night between study blocks is part of the plan, not a break from it.</div>`));
  });

  // ------------------------------------------------------------------ #/learn
  App.route("learn", function (root, args) {
    const stories = App.stories;
    let i = Math.max(0, stories.findIndex((s) => s.id === args[0]));
    root.append(el(`<div class="page-head"><h1>Story Mode</h1><p>Terms are learned in story clusters, not alphabetically. Read one cluster, then answer its 3-question check right away.</p></div>`));
    const nav = el(`<div class="story-nav"></div>`);
    root.append(nav);
    const host = el(`<div></div>`);
    root.append(host);
    stories.forEach((s, k) => {
      const read = (App.state.settings.storiesRead || {})[s.id];
      const b = el(`<button class="chip" type="button">${s.id.toUpperCase()}${read ? " ✓" : ""}</button>`);
      b.onclick = () => { i = k; draw(); };
      nav.append(b);
    });
    function draw() {
      const s = stories[i];
      if (location.hash !== "#/learn/" + s.id) history.replaceState(null, "", "#/learn/" + s.id);
      App.$$(".chip", nav).forEach((c, k) => c.classList.toggle("on", k === i));
      host.innerHTML = "";
      App.onKey = null;
      const card = el(`<div class="card story"><div class="muted small">Cluster ${i + 1} of ${stories.length}</div><h2>${esc(s.id.toUpperCase())}. ${esc(s.title)}</h2>${s.html}</div>`);
      s.headsup.forEach((h) => card.append(el(`<div class="headsup">${esc(h)}</div>`)));
      const terms = App.terms.filter((t) => t.cluster === s.id);
      card.append(el(`<p class="small muted" style="margin-top:12px">Study-guide terms in this cluster: ${terms.map((t) => esc(t.term)).join(" · ")}. <a href="#/flash/${s.id}">Flashcards for ${s.id.toUpperCase()} →</a></p>`));
      host.append(card);
      const checkBox = el(`<div></div>`);
      const bar = el(`<div class="spread" style="margin-bottom:16px">
        <button class="btn" data-p type="button" ${i === 0 ? "disabled" : ""}>← Previous</button>
        <button class="btn primary" data-c type="button">Mini-check (3 Qs)</button>
        <button class="btn" data-n type="button" ${i === stories.length - 1 ? "disabled" : ""}>Next →</button></div>`);
      host.append(bar, checkBox);
      $("[data-p]", bar).onclick = () => { i--; draw(); };
      $("[data-n]", bar).onclick = () => { i++; draw(); };
      $("[data-c]", bar).onclick = () => {
        bar.querySelector("[data-c]").disabled = true;
        App.runQuiz(checkBox, s.check.map((id) => App.qById[id]).filter(Boolean), {
          mode: "learn", title: s.id.toUpperCase() + " check",
          onDone: () => {
            const r = (App.state.settings.storiesRead = App.state.settings.storiesRead || {});
            r[s.id] = true; App.save();
            App.$$(".chip", nav)[i].textContent = s.id.toUpperCase() + " ✓";
          }
        });
        checkBox.scrollIntoView({ block: "start", behavior: "smooth" });
      };
      window.scrollTo(0, 0);
    }
    // swipe between clusters on phones
    let sx = null;
    host.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    host.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      sx = null;
      if (Math.abs(dx) > 80 && !host.querySelector(".quiz")) { i = Math.min(stories.length - 1, Math.max(0, i + (dx < 0 ? 1 : -1))); draw(); }
    });
    draw();
  });

  // ------------------------------------------------------------------ #/cheatsheet
  App.route("cheatsheet", function (root) {
    root.append(el(`<div class="spread page-head"><div><h1>Cheat Sheet</h1><p>One page for the walk to the CBTF — for studying only, never inside the exam.</p></div>
      <button class="btn no-print" type="button" onclick="window.print()">Print</button></div>`));
    root.append(el(`<div class="card final10"><h2>The Final 10</h2><ol>
      <li>Parents of the Olympians = <b>Cronus &amp; Rhea</b>.</li>
      <li>Hundred-handers <b>hurl boulders</b>; Cyclopes <b>forge thunderbolts</b>.</li>
      <li>Unique to Deucalion &amp; Pyrrha = <b>people from stones</b>.</li>
      <li>Lycaon = <b>bad xenia</b>.</li>
      <li>Hades = <b>invisible</b>; Pandora = <b>all gifts</b>.</li>
      <li>Leto promised Delos a <b>temple</b>.</li>
      <li>Hephaestus trapped <b>Hera, Ares, Aphrodite, Prometheus</b>.</li>
      <li>Aphrodite ≈ <b>Inanna/Ishtar</b>; Adonis ≈ <b>Dumuzi</b>; killed by a <b>boar</b>, lamented annually.</li>
      <li>Hermes + Apollo reconcile via the <b>lyre</b>; Pan → <b>panic</b>; Asclepius <b>raised the dead</b>.</li>
      <li>Furies punish <b>kin-killers</b>; syncretism = <b>identifying foreign gods with Greek ones</b>; gods <b>change over time</b>.</li></ol></div>`));
    const two = el(`<div class="two-col"><div class="card"><h2>Attribute → god</h2><table><tbody></tbody></table></div><div class="card"><h2>Mnemonics</h2><ul class="mn"></ul></div></div>`);
    (window.DATA_ATTRS || []).forEach(([a, g]) => $("tbody", two).append(el(`<tr><td>${esc(a)}</td><td><strong>${esc(g)}</strong></td></tr>`)));
    [
      "<b>Olympian 12</b>: Zeus, Hera, Poseidon, Demeter, Hestia (or Dionysus), Athena, Apollo, Artemis, Ares, Aphrodite, Hephaestus, Hermes.",
      "<b>Cronus' children</b>: “He Did Have Hungry Powerful Zeus” = Hestia, Demeter, Hera, Hades, Poseidon, Zeus.",
      "<b>Immune to Aphrodite</b> = HAA: Hestia, Athena, Artemis.",
      "<b>Hephaestus traps</b> HAAP: Hera, Ares, Aphrodite, Prometheus.",
      "<b>Titanomachy</b>: Cyclopes Craft thunderbolts; Hundred-Handers Hurl boulders.",
      "<b>Apollo's rejections</b>: Sibyl, Cassandra, Daphne (rejected); Coronis (cheated).",
      "<b>Five Ages</b>: Good Students Become Happy Intellectuals = Gold, Silver, Bronze, Heroes, Iron.",
      "<b>Names</b>: Pro-metheus = before-thought; Epi-metheus = after-thought; Pan-dora = all-gifts; A-des = un-seen.",
      "<b>D&amp;P</b> = “Drop Pebbles”.",
      "<b>Pan</b> → panic; <b>Syrinx</b> → pan pipes.",
      "<b>Pygmalion</b> = Cyprus = Aphrodite's island."
    ].forEach((m) => $(".mn", two).append(el(`<li>${m}</li>`)));
    root.append(two);
    const maps = el(`<div class="two-col"><div class="card"><h2>Map places</h2><table><tbody></tbody></table></div>
      <div class="card"><h2>Aegean map</h2><img src="assets/slide-images/map-aegean-labeled.gif" alt="Labeled Aegean map from the review slides" style="width:100%"></div></div>`);
    App.places.filter((p) => p.tested).forEach((p) => $("tbody", maps).append(el(`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.note)}</td></tr>`)));
    root.append(maps);
    root.append(el(`<div class="card"><h2>Lecture-slide extras</h2><ul>
      <li><b>Sumer ↔ Greece</b>: An = Uranus · Ki = Gaea · Inanna + Dumuzi = Aphrodite + Adonis · Enlil = Zeus · Ereshkigal = Persephone. Spread by <b>idea diffusion</b>.</li>
      <li><b>Hittite Kingship in Heaven</b>: Alalush → Anush (Uranus) → Kumarbi (Cronus, castrates) → Teshub (Zeus, storms).</li>
      <li><b>Mythos</b> = authoritative speech; myths spread <b>orally</b> (aoidoi); Linear B not for literature; alphabet c. 750 BCE.</li>
      <li><b>Hesiod</b> (750–700 BCE, pessimistic) organizes by <b>space, genealogy, themes</b>; duplicates Cronus:Zeus, Ocean:Nereus, Eros:Aphrodite, Hyperion:Helios.</li>
      <li><b>Typhoeus</b>: Apollodorus variant — beats Zeus first; Hermes & Aegipan rescue; buried under <b>Mt. Etna</b>. Kill + snake = <b>Indo-European</b> formula; dragon combat = cosmogony.</li>
      <li><b>Prometheus</b>: Hesiod justifies Zeus (creation = sex) · Aeschylus (525–456) Prometheus as victim, gifts of knowledge, Thetis secret · Ovid (exiled by Augustus) Prometheus crafts humans, Zeus a tyrant. Fire in a <b>fennel stalk</b>.</li>
      <li><b>Five Races</b> ≈ Nebuchadnezzar's dream (Daniel). Floods: Ziusudra → Atrahasis / Utnapishtim → Noah → Deucalion & Pyrrha (Themis instructs; <b>theoxeny</b>).</li>
      <li><b>Hermes</b>: herm = stone heap/boundary → apotropaic, fertility; psychopompos; Argeiphontes; Mt. Cyllene; cradle = winnowing fan; 12 portions spoof a test of divinity; god of thieves.</li>
      <li><b>Pan</b> &lt; “feed”; Syrinx & Echo; caves. <b>Hephaestus</b> &lt; Lemnos; clothed, bearded, seated laborer. <b>Ares</b> = war, disliked, no cult (vs. Mars: Romulus & Remus, March, wolf); kids Phobos, Deimos, Eros, Harmonia.</li></ul>
      <p class="small"><a href="#/lectures">Full lecture notes →</a></p></div>`));
    const hu = el(`<div class="card"><h2>Heads-up: where sources disagree</h2><ul></ul></div>`);
    App.terms.filter((t) => t.headsup && t.id !== "hera").forEach((t) => $("ul", hu).append(el(`<li><strong>${esc(t.term)}:</strong> ${esc(t.headsup)}</li>`)));
    root.append(hu);
  });

  // ------------------------------------------------------------------ #/resources
  App.route("resources", function (root) {
    root.append(el(`<div class="page-head"><h1>Resources</h1><p>External links open in a new tab.</p></div>`));
    root.append(el(`<div class="card"><h2>Watch &amp; practice</h2><ul>
      <li><a href="https://www.youtube.com/playlist?list=PLEb6sGT7oD8G8nPbyvObaZUNdfV6kitZQ" target="_blank" rel="noopener">Crash Course World Mythology playlist</a> — start with <a href="https://thecrashcourse.com/courses/creation-from-the-void-crash-course-world-mythology-2/" target="_blank" rel="noopener">#2 Creation from the Void</a></li>
      <li>Quizlet sets (other schools, same textbook — skip terms not on the guide):
        <a href="https://quizlet.com/411889980/classical-myth-powell-ch-1-9-flash-cards/" target="_blank" rel="noopener">Powell ch. 1–9</a> ·
        <a href="https://quizlet.com/84501075/classical-myth-powell-quiz-1-chapters-1-3-flash-cards/" target="_blank" rel="noopener">ch. 1–3</a> ·
        <a href="https://quizlet.com/46190940/classical-myth-powell-chapter-9-flash-cards/" target="_blank" rel="noopener">ch. 9</a></li>
      <li><a href="https://www.theoi.com" target="_blank" rel="noopener">Theoi Greek Mythology</a> — encyclopedia + ancient art per god</li>
      <li><a href="https://cbtf.illinois.edu/students" target="_blank" rel="noopener">CBTF student page / PrairieTest</a></li></ul>
      <label class="row"><input type="checkbox" id="canvasR" ${App.state.settings.canvas ? "checked" : ""}> Retook all Canvas quizzes (weeks 1–5)</label></div>`));
    $("#canvasR").onchange = (e) => { App.state.settings.canvas = e.target.checked; App.save(); };

    // Index-lookup drill: the only help file at the CBTF is Powell's index.
    const pool = App.terms.filter((t) => ["divinity", "mortal"].includes(t.cat)).map((t) => t.term.split(/[\/(]/)[0].trim());
    const drill = el(`<div class="card"><h2>Index-lookup drill</h2>
      <p>At the CBTF the only help file is <strong>Powell's index</strong>. Practice finding a name fast: open the index, press Start, find the name, press Found.
      Aim for under 20 s — and never rely on the index for more than ~3 questions (that's 2+ minutes of your 50).</p>
      <div class="row"><button class="btn primary" type="button" data-s>Start</button><span class="countdown" data-name style="font-size:1.5rem"></span>
      <span class="clock" data-t>0.0s</span><button class="btn" type="button" data-f disabled>Found</button></div>
      <p class="small muted" data-log></p></div>`);
    root.append(drill);
    let t0 = 0, tm = null;
    const times = [];
    App.onCleanup(() => clearInterval(tm));
    $("[data-s]", drill).onclick = () => {
      $("[data-name]", drill).textContent = App.pick(pool);
      t0 = performance.now();
      $("[data-f]", drill).disabled = false;
      clearInterval(tm);
      tm = setInterval(() => { $("[data-t]", drill).textContent = ((performance.now() - t0) / 1000).toFixed(1) + "s"; }, 100);
    };
    $("[data-f]", drill).onclick = () => {
      clearInterval(tm);
      times.push((performance.now() - t0) / 1000);
      $("[data-f]", drill).disabled = true;
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      $("[data-log]", drill).textContent = `${times.length} lookups · average ${avg.toFixed(1)} s · last ${times[times.length - 1].toFixed(1)} s`;
    };

    root.append(el(`<div class="card"><h2>How this site teaches</h2><ul class="small">
      <li><b>Retrieval practice</b> — every screen makes you answer before you see it.</li>
      <li><b>Spaced repetition</b> — Leitner boxes: box 1 every round, box 2 every 2nd, box 3 every 4th, box 4 mastered.</li>
      <li><b>Interleaving</b> — quizzes and the mock mix gods, images, maps and concepts, like the exam.</li>
      <li><b>Elaboration</b> — terms grouped by story cluster with a “why” on each card.</li>
      <li><b>Dual coding</b> — images on god cards, maps for places.</li>
      <li><b>Exam pace</b> — 40-second pace bar; mock = 75 Q / 50 min.</li>
      <li><b>Error log</b> — every miss goes to Fix-My-Mistakes.</li>
      <li><b>Sleep</b> — consolidation happens overnight.</li></ul></div>`));
  });
  // ------------------------------------------------------------------ #/lectures
  App.route("lectures", function (root, args) {
    const L = App.lectures;
    let i = Math.max(0, L.findIndex((l) => l.id === args[0]));
    root.append(el(`<div class="page-head"><h1>Lecture Notes</h1>
      <p>Everything from the lecture slide decks, condensed. Each lecture ends with its in-class questions and a quick check.
      Lecture-only questions are also mixed into Quiz and Mock Exam (topic “Lecture slides”) and the terms have their own flashcard deck.</p>
      <p class="headsup">No slide decks for Week 3 (Sept 8 & 10) or Week 5 (review). Week 3's content (Zeus & Hera, Poseidon, Hades, Apollo, Artemis, Delos, Delphi…) is covered by the study-guide terms, Story clusters C5–C6 and the review-lecture questions.</p></div>`));
    const nav = el(`<div class="story-nav"></div>`);
    L.forEach((l, k) => {
      const b = el(`<button class="chip" type="button">${esc(l.date)}</button>`);
      b.onclick = () => { i = k; draw(); };
      nav.append(b);
    });
    root.append(nav);
    const host = el(`<div></div>`);
    root.append(host);
    function draw() {
      const l = L[i];
      if (location.hash !== "#/lectures/" + l.id) history.replaceState(null, "", "#/lectures/" + l.id);
      App.$$(".chip", nav).forEach((c, k) => c.classList.toggle("on", k === i));
      host.innerHTML = "";
      App.onKey = null;
      const card = el(`<div class="card story"><div class="muted small">${esc(l.date)} · ${esc(l.powell)}</div><h2>${esc(l.title)}</h2></div>`);
      l.sections.forEach(([h, items]) => {
        card.append(el(`<h3 style="margin-top:14px">${esc(h)}</h3>`));
        card.append(el(`<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul>`));
      });
      host.append(card);
      const ic = el(`<div class="card"><h2>In-class questions</h2></div>`);
      l.inclass.forEach(([q, a]) => ic.append(el(`<details style="margin:8px 0"><summary><strong>${esc(q)}</strong></summary><p style="margin-top:6px">${esc(a)}</p></details>`)));
      host.append(ic);
      const bar = el(`<div class="spread" style="margin-bottom:16px">
        <button class="btn" data-p type="button" ${i === 0 ? "disabled" : ""}>← Previous</button>
        <button class="btn primary" data-c type="button">Quick check (4 Qs)</button>
        <button class="btn" data-all type="button">All ${App.questions.filter((q) => q.id.startsWith("L") && q.lec === l.id).length} questions from this lecture</button>
        <button class="btn" data-n type="button" ${i === L.length - 1 ? "disabled" : ""}>Next →</button></div>`);
      const box = el(`<div></div>`);
      host.append(bar, box);
      $("[data-p]", bar).onclick = () => { i--; draw(); };
      $("[data-n]", bar).onclick = () => { i++; draw(); };
      const run = (qs, title) => { box.innerHTML = ""; App.runQuiz(box, qs, { mode: "learn", title }); box.scrollIntoView({ block: "start", behavior: "smooth" }); };
      $("[data-c]", bar).onclick = () => run(l.check.map((id) => App.qById[id]).filter(Boolean), l.date + " check");
      $("[data-all]", bar).onclick = () => run(App.shuffle(App.questions.filter((q) => q.id.startsWith("L") && q.lec === l.id)), l.date);
      window.scrollTo(0, 0);
    }
    draw();
  });
})();
