/* Crash course (#/crash): everything in ~30 minutes — big ideas, names in context, patterns, images, places —
   with a short recognition test after each section and a final test. Only exams that ship DATA_CRASH get the page. */
(function () {
  "use strict";
  const SECTIONS = window.DATA_CRASH;
  if (!SECTIONS) return;
  const PATTERNS = window.DATA_CRASH_PATTERNS || [];
  const { $, el, esc, shuffle, sample } = App;
  const done = () => (App.state.settings.crash = App.state.settings.crash || {});
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ------------------------------------------------------------------ questions (built from the page's own names)
  function nameQ(sec, i, dir) {
    const [name, ctx] = sec.names[i];
    const pool = sec.names.filter((_, k) => k !== i);
    const others = pool.length >= 3 ? sample(pool, 3) : pool.concat(sample(SECTIONS.flatMap((s) => s.names).filter((n) => n[0] !== name && !pool.includes(n)), 3 - pool.length));
    const why = `<b>${esc(name)}</b> — ${esc(ctx)}. <span class="muted">(${esc(sec.title)})</span>`;
    return dir === 0
      ? { id: `crash:${sec.id}:${i}:n`, tags: [sec.tag], q: `Who or what is <b>${esc(name)}</b>?`, opts: [esc(ctx), ...others.map((o) => esc(o[1]))], ans: 0, why }
      : { id: `crash:${sec.id}:${i}:c`, tags: [sec.tag], q: `${esc(cap(ctx))} — who or what is this?`, opts: [esc(name), ...others.map((o) => esc(o[0]))], ans: 0, why };
  }
  function patternQ(k, dir) {
    const [pat, shape, ex] = PATTERNS[k];
    const why = `<b>${esc(pat)}</b>: ${esc(shape)}. Examples: ${ex.map(esc).join(", ")}.`;
    if (dir === 0) {
      const e = App.pick(ex);
      const wrong = sample(PATTERNS.filter((p) => !p[2].includes(e)).map((p) => p[0]), 3);
      return { id: `crash:pat:${k}:${e}`, tags: ["patterns"], q: `<b>${esc(e)}</b> is a classic example of which story pattern?`, opts: [esc(pat), ...wrong.map(esc)], ans: 0, why };
    }
    const otherEx = App.uniq(PATTERNS.filter((p, j) => j !== k).flatMap((p) => p[2])).filter((x) => !ex.includes(x));
    return { id: `crash:pat:${k}:ex`, tags: ["patterns"], q: `Which is an example of a <b>${esc(pat)}</b> (${esc(shape)})?`, opts: [esc(App.pick(ex)), ...sample(otherEx, 3).map(esc)], ans: 0, why };
  }
  function sectionQs(sec, n) {
    return sample(sec.names.map((_, i) => i), Math.min(n, sec.names.length)).map((i) => nameQ(sec, i, Math.random() < 0.5 ? 0 : 1));
  }
  const patternQs = (n) => sample(PATTERNS.map((_, k) => k), Math.min(n, PATTERNS.length)).map((k) => patternQ(k, Math.random() < 0.5 ? 0 : 1));
  const imageQs = (n) => sample(App.images, n).map((im) => App.Gen.imageName(im)).filter(Boolean);
  const mapQs = (n) => sample(App.places.filter((p) => p.tested && App.MapKit.canShow(p.id)), n).map((p) => App.Gen.mapMarked(p)).filter(Boolean);
  App.crashFinal = function () {
    // ~3 per section + patterns + images + maps = 40
    const qs = SECTIONS.flatMap((s) => sectionQs(s, 3)).concat(patternQs(6), imageQs(4), mapQs(3));
    return shuffle(qs).slice(0, 40);
  };

  // ------------------------------------------------------------------ page
  App.route("crash", function (root) {
    const total = SECTIONS.reduce((a, s) => a + s.mins, 0) + 4;
    root.append(el(`<div class="page-head"><h1>Exam-day crash course</h1>
      <p>Everything on the checklist: the big idea of each topic, the story in a few steps, and every name with one line of context so you recognize it on the exam.
      About ${total} minutes of reading, under 30 with the quick tests. Read a section, tap <b>Test me</b>, move on, then take the final test.</p></div>`));
    const prog = el(`<div class="card crash-top"><div class="spread"><div><strong class="crash-count"></strong><div class="bar" style="margin-top:6px"><span></span></div></div>
      <button class="btn primary" type="button" data-final>Final test (40 Qs)</button></div><nav class="crash-toc" aria-label="Sections"></nav></div>`);
    root.append(prog);
    const toc = $(".crash-toc", prog);
    const all = SECTIONS.map((s) => [s.id, s.title]).concat([["patterns", "Story patterns"], ["images", "The 13 images"], ["places", "The 10 places"]]);
    all.forEach(([id, t], k) => toc.append(el(`<a href="#crash-${id}" data-id="${id}">${k + 1}. ${esc(t)}</a>`)));
    toc.onclick = (e) => { const a = e.target.closest("a"); if (!a) return; e.preventDefault(); document.getElementById("crash-" + a.dataset.id).scrollIntoView({ behavior: "smooth", block: "start" }); };
    function refresh() {
      const d = done(), n = all.filter(([id]) => d[id]).length;
      $(".crash-count", prog).textContent = `${n} of ${all.length} sections tested`;
      $(".bar > span", prog).style.width = App.pct(n, all.length) + "%";
      App.$$("a", toc).forEach((a) => a.classList.toggle("done", !!d[a.dataset.id]));
    }

    // run a test inside a section's card
    function test(card, id, qs, title) {
      const box = $(".crash-test", card);
      box.innerHTML = "";
      App.runQuiz(box, qs, {
        mode: "learn", title,
        onDone: (r) => { if (r.total) { done()[id] = { c: r.correct, n: r.total }; App.save(); refresh(); mark(card, id); } },
        restart: () => test(card, id, regen[id](), title)
      });
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const regen = {};
    function mark(card, id) {
      const r = done()[id];
      $(".crash-score", card).textContent = r ? `Last test: ${r.c}/${r.n}` : "";
    }
    function section(id, num, title, meta, body, makeQs, label) {
      regen[id] = makeQs;
      const card = el(`<section class="card crash-sec" id="crash-${id}"><div class="crash-meta">${num}. ${esc(meta)}</div><h2>${esc(title)}</h2></section>`);
      card.append(body);
      const bar = el(`<div class="spread crash-actions"><button class="btn primary" type="button">${label}</button><span class="small muted crash-score"></span></div>`);
      $("button", bar).onclick = () => test(card, id, makeQs(), title);
      card.append(bar, el(`<div class="crash-test"></div>`));
      root.append(card);
      mark(card, id);
    }

    SECTIONS.forEach((s, k) => {
      const body = el(`<div></div>`);
      body.append(el(`<p class="crash-big">${s.big}</p>`));
      if (s.beats.length) body.append(el(`<ol class="crash-beats">${s.beats.map((b) => `<li>${b}</li>`).join("")}</ol>`));
      body.append(el(`<h3>Names to recognize</h3>`));
      body.append(el(`<dl class="crash-names">${s.names.map(([n, c]) => `<div><dt>${esc(n)}</dt><dd>${esc(c)}</dd></div>`).join("")}</dl>`));
      section(s.id, k + 1, s.title, `${s.powell} · ${s.mins} min`, body, () => sectionQs(s, 8), "Test me (8 questions)");
    });

    const n0 = SECTIONS.length;
    const pat = el(`<div><p class="crash-big">The exam asks you to name the <b>type of story</b>. Learn the shape, then match examples.</p>
      <div class="table-scroll"><table class="crash-pat"><thead><tr><th>Pattern</th><th>Shape</th><th>Examples</th></tr></thead><tbody>
      ${PATTERNS.map(([p, s, ex]) => `<tr><td><strong>${esc(p)}</strong></td><td>${esc(s)}</td><td>${ex.map(esc).join(" · ")}</td></tr>`).join("")}</tbody></table></div>
      <p class="small muted">Also know: <b>apotropaic</b> = warding off evil (gorgoneion) · <b>eponymous ancestor</b> = gives a place its name (Europa → Europe, Aegeus → Aegean) · <b>xenia</b> = guest-friendship · <b>double founding</b> = Thebes, Rome, Troy.</p></div>`);
    section("patterns", n0 + 1, "Story patterns", "cross-cutting · 1 min", pat, () => patternQs(8), "Test me (8 questions)");

    const imgs = el(`<div><p class="crash-big">Only these 13 images are tested — know <b>who</b>, <b>what they're doing</b> and <b>the clue</b> that gives it away.</p><div class="crash-imgs"></div></div>`);
    App.images.forEach((im) => $(".crash-imgs", imgs).append(el(`<figure><img loading="lazy" src="${App.imgSrc(im.file)}" alt="${esc(im.answer)}"><figcaption><strong>${esc(im.answer)}</strong><span>${esc(im.clues.slice(0, 2).join("; "))}</span></figcaption></figure>`)));
    section("images", n0 + 2, "The 13 images", "picture questions · 2 min", imgs, () => imageQs(App.images.length), `Test me (${App.images.length} questions)`);

    const places = App.places.filter((p) => p.tested);
    const pl = el(`<div><p class="crash-big">Map questions show a star or outline on a blank map: pick the place.</p>
      <dl class="crash-names">${places.map((p) => `<div><dt>${esc(p.name)}</dt><dd>${esc(p.note)}</dd></div>`).join("")}</dl>
      <p class="small"><a href="#/map">Open the map test → Explore</a> to see them all on the map.</p></div>`);
    section("places", n0 + 3, "The 10 places", "map questions · 1 min", pl, () => mapQs(places.length), `Test me (${places.length} questions)`);

    const fin = el(`<section class="card crash-sec" id="crash-final"><h2>Final test</h2>
      <p>40 questions mixed from every section, patterns, images and maps — instant feedback with the context after each answer. Misses go to Fix My Mistakes.</p>
      <button class="btn primary" type="button">Start the final test</button><div class="crash-test"></div></section>`);
    root.append(fin);
    const runFinal = () => {
      const box = $(".crash-test", fin);
      box.innerHTML = "";
      App.runQuiz(box, App.crashFinal(), { mode: "learn", title: "Final", restart: runFinal });
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    $("button", fin).onclick = runFinal;
    $("[data-final]", prog).onclick = runFinal;
    refresh();
  });
})();
