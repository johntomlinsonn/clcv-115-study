/* Map Test (§6): unlabeled static maps (no tiles, no API key, works offline) + #/map page.
   Maps come from tools/build_maps.py: equirectangular SVGs with bounds in data/maps.js. */
(function () {
  "use strict";
  const { $, el, esc, shuffle } = App;
  const MK = (App.MapKit = {});
  const MAPS = window.DATA_MAPS || {};
  const REGIONS = window.DATA_REGIONS || {};
  const NS = "http://www.w3.org/2000/svg";

  MK.km = function (a, b) {
    const R = 6371, toR = Math.PI / 180;
    const dLat = (b.lat - a.lat) * toR, dLng = (b.lng - a.lng) * toR;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  };
  MK.inPolygon = function (lat, lng, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [yi, xi] = poly[i], [yj, xj] = poly[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  // Every tested place fits on one of the two maps, so everything can always be shown.
  MK.canShow = (id) => !!App.placeById[id];

  const inView = (v, p, margin = 0.3) => !p.region && p.lat > v.south + margin && p.lat < v.north - margin && p.lng > v.west + margin && p.lng < v.east - margin;
  // Aegean close-up when every place fits on it; otherwise the wide map (Cyprus, Mesopotamia, regions)
  MK.viewFor = (places) => (places.every((p) => inView(MAPS.aegean, p)) ? "aegean" : "wide");

  // Draw a map with an SVG overlay in the map's own pixel space.
  MK.draw = function (holder, viewId) {
    const v = MAPS[viewId];
    const box = el(`<div class="mapimg"><img alt="Blank map" draggable="false" src="${v.file}"></div>`);
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${v.w} ${v.h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.classList.add("map-overlay");
    box.append(svg);
    holder.append(box);
    // Marker sizes are given in screen pixels: convert via the map's displayed width
    const S = v.w / (box.getBoundingClientRect().width || 360);
    const xy = (lat, lng) => [((lng - v.west) / (v.east - v.west)) * v.w, ((v.north - lat) / (v.north - v.south)) * v.h];
    const kmPerUnit = (lat) => ((v.east - v.west) * 111.32 * Math.cos((lat * Math.PI) / 180)) / v.w;
    const add = (tag, attrs, text) => {
      const n = document.createElementNS(NS, tag);
      for (const [k, val] of Object.entries(attrs)) n.setAttribute(k, val);
      if (text != null) n.textContent = text;
      svg.append(n);
      return n;
    };
    const api = {
      box, svg, view: v,
      toLatLng(evt) {
        const r = box.getBoundingClientRect();
        const fx = (evt.clientX - r.left) / r.width, fy = (evt.clientY - r.top) / r.height;
        return { lat: v.north - fy * (v.north - v.south), lng: v.west + fx * (v.east - v.west) };
      },
      star(p) { const [x, y] = xy(p.lat, p.lng); add("text", { x, y, class: "mk-star", "font-size": 30 * S, "text-anchor": "middle", "dominant-baseline": "central" }, "★"); },
      circle(p) { const [x, y] = xy(p.lat, p.lng); add("circle", { cx: x, cy: y, r: 15 * S, class: "mk-ring-halo", "stroke-width": 6 * S }); add("circle", { cx: x, cy: y, r: 15 * S, class: "mk-ring", "stroke-width": 3.5 * S }); },
      region(id, cls = "mk-region") { add("polygon", { points: REGIONS[id].map(([la, ln]) => xy(la, ln).join(",")).join(" "), class: cls, "stroke-width": 2.5 * S }); },
      letter(p, t) { const [x, y] = xy(p.lat, p.lng); add("circle", { cx: x, cy: y, r: 13 * S, class: "mk-letter", "stroke-width": 2 * S }); add("text", { x, y, class: "mk-letter-t", "font-size": 15 * S, "text-anchor": "middle", "dominant-baseline": "central" }, t); },
      dot(lat, lng, cls) { const [x, y] = xy(lat, lng); add("circle", { cx: x, cy: y, r: 5 * S, class: cls, "stroke-width": 1.5 * S }); },
      tolerance(p) { const [x, y] = xy(p.lat, p.lng); add("circle", { cx: x, cy: y, r: p.tol_km / kmPerUnit(p.lat), class: "mk-tol", "stroke-width": 1.5 * S }); },
      line(a, b) { const [x1, y1] = xy(a.lat, a.lng), [x2, y2] = xy(b.lat, b.lng); add("line", { x1, y1, x2, y2, class: "mk-line", "stroke-width": 1.5 * S, "stroke-dasharray": `${5 * S} ${4 * S}` }); },
      label(p, text) { const [x, y] = xy(p.lat, p.lng); add("text", { x: x + 8 * S, y, class: "mk-label", "font-size": 12 * S, "dominant-baseline": "central", "stroke-width": 3 * S }, text); }
    };
    return api;
  };

  // Render the map for a quiz question: {map:{marker,style}} or {mapMarkers:[ids]}
  MK.questionMap = function (holder, q) {
    const ids = q.mapMarkers || [q.map.marker];
    const places = ids.map((id) => App.placeById[id]);
    const m = MK.draw(holder, MK.viewFor(places));
    if (q.mapMarkers) places.forEach((p, i) => m.letter(p, "ABCD"[i]));
    else {
      const p = places[0];
      if (p.region || q.map.style === "region") m.region(p.region || p.id);
      else if (q.map.style === "circle") m.circle(p);
      else m.star(p);
    }
  };

  // ------------------------------------------------------------------ #/map
  App.route("map", function (root) {
    root.append(el(`<div class="page-head"><h1>Map Test</h1>
      <p>Tested places: Athens, Cyprus, Delos, Delphi, Greece, Mesopotamia, Mt. Olympus. Goal: 100% twice in a row. Current streak: <strong id="mapStreak">${App.state.streaks.map}</strong>.
      Blank maps like the review slides — no labels, works offline.</p></div>`));
    const tabs = el(`<div class="row no-print" role="tablist" style="margin-bottom:12px">
      <button class="btn on" data-t="marked" type="button">What is marked? (a–d)</button>
      <button class="btn" data-t="click" type="button">Click to locate</button>
      <button class="btn" data-t="letters" type="button">Place ↔ meaning</button>
      <button class="btn" data-t="explore" type="button">Explore</button></div>`);
    root.append(tabs);
    const host = el(`<div></div>`);
    root.append(host);
    const testedIds = App.places.filter((p) => p.tested);
    const modes = { marked, click, letters, explore };
    App.$$("button", tabs).forEach((b) => (b.onclick = () => {
      App.$$("button", tabs).forEach((x) => x.classList.toggle("on", x === b));
      host.innerHTML = "";
      App.onKey = null;
      modes[b.dataset.t](host);
    }));
    marked(host);

    function streak(perfect) {
      App.state.streaks.map = perfect ? App.state.streaks.map + 1 : 0;
      App.save();
      $("#mapStreak").textContent = App.state.streaks.map;
    }
    function marked(h) {
      const hand = App.questions.filter((q) => q.map);
      const qs = shuffle(testedIds.map((p) => App.Gen.mapMarked(p)).filter(Boolean).concat(hand));
      App.runQuiz(h, qs, { mode: "learn", title: "Map", onDone: (r) => streak(r.correct === r.total && r.total === qs.length), restart: () => { h.innerHTML = ""; marked(h); } });
    }
    function letters(h) {
      const qs = shuffle(testedIds.filter((p) => !p.region).map((p) => App.Gen.placeMeaning(p)).filter(Boolean));
      App.runQuiz(h, qs, { mode: "learn", title: "Which marker", onDone: (r) => streak(r.correct === r.total && r.total === qs.length), restart: () => { h.innerHTML = ""; letters(h); } });
    }

    function click(h) {
      const order = shuffle(testedIds);
      let i = 0, right = 0;
      const card = el(`<div class="card"></div>`);
      h.append(card);
      next();
      function next() {
        card.innerHTML = "";
        if (i >= order.length) {
          const perfect = right === order.length;
          streak(perfect);
          card.append(el(`<div><div class="score-big">${right} / ${order.length}</div><p>${perfect ? "Perfect round!" : "Keep going until you get 100% twice in a row."}</p></div>`));
          const again = el(`<button class="btn primary" type="button">Another round</button>`);
          again.onclick = () => { h.innerHTML = ""; click(h); };
          card.append(again);
          return;
        }
        const p = order[i];
        card.append(el(`<div class="qhead"><span class="qcount">Place ${i + 1} / ${order.length}</span><span class="muted small">${right} correct</span></div>`));
        card.append(el(`<div class="stem">Click on <b>${esc(p.name)}</b>${p.region ? " (anywhere inside it)" : ""}.</div>`));
        const holder = el(`<div class="media"></div>`);
        card.append(holder);
        const fb = el(`<div></div>`);
        card.append(fb);
        // Aegean places are asked on the Aegean close-up; Cyprus, Greece, Mesopotamia on the wide map
        const m = MK.draw(holder, MK.viewFor([p]));
        m.box.classList.add("clickable");
        let answered = false;
        m.box.onclick = (e) => {
          if (answered) return;
          answered = true;
          m.box.classList.remove("clickable");
          const ll = m.toLatLng(e);
          let ok, msg;
          if (p.region) {
            ok = MK.inPolygon(ll.lat, ll.lng, REGIONS[p.region]);
            msg = ok ? "Inside the region." : "Outside the region (outlined in green).";
            m.region(p.region, "mk-region-ok");
          } else {
            const d = MK.km(p, ll);
            ok = d <= p.tol_km;
            msg = `${Math.round(d)} km from ${esc(p.name)} (tolerance ${p.tol_km} km).`;
            m.tolerance(p);
            m.line(ll, p);
            m.dot(p.lat, p.lng, "mk-true");
          }
          m.dot(ll.lat, ll.lng, "mk-guess");
          if (ok) right++;
          App.recordAnswer({ id: "auto:click:" + p.id, tags: ["maps", "auto"], q: `Locate ${esc(p.name)} on the map.`, opts: [esc(p.name), "—", "–", "−"], ans: 0, why: esc(p.note), map: { marker: p.id, style: "star" } }, ok);
          fb.append(el(`<div class="feedback ${ok ? "good" : "bad"}"><strong>${ok ? "Correct." : "Missed."}</strong> ${msg} ${esc(p.name)}: ${esc(p.note)}.</div>`));
          const nb = el(`<button class="btn primary" type="button" style="margin-top:12px">Next →</button>`);
          nb.onclick = () => { i++; next(); };
          fb.append(nb);
          nb.focus();
        };
        App.onKey = (e) => { if (e.key === "Enter" && answered) { i++; next(); } };
      }
    }

    function explore(h) {
      const card = el(`<div class="card"></div>`);
      h.append(card);
      const aeg = testedIds.filter((p) => inView(MAPS.aegean, p));
      card.append(el(`<h3>The Aegean</h3>`));
      const m1 = MK.draw(card, "aegean");
      App.places.filter((p) => !p.tested && inView(MAPS.aegean, p)).forEach((p) => { m1.dot(p.lat, p.lng, "mk-other"); m1.label(p, p.name); });
      aeg.forEach((p) => { m1.dot(p.lat, p.lng, "mk-true"); m1.label(p, p.name); });
      card.append(el(`<p class="small muted" style="margin-top:6px">Green = tested · grey = distractors used in questions.</p>`));
      card.append(el(`<h3 style="margin-top:16px">Greece to Mesopotamia</h3>`));
      const m2 = MK.draw(card, "wide");
      m2.region("greece", "mk-region-ok");
      m2.region("mesopotamia", "mk-region-ok");
      testedIds.forEach((p) => { m2.dot(p.lat, p.lng, "mk-true"); if (!inView(MAPS.aegean, p) || p.region) m2.label(p, p.name); });
      const list = el(`<table style="margin-top:12px"><thead><tr><th>Place</th><th>Why it matters</th></tr></thead><tbody></tbody></table>`);
      testedIds.forEach((p) => {
        const t = App.termById[p.id];
        $("tbody", list).append(el(`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.note)}${t && t.more.length ? `<div class="small muted">${t.more.map(esc).join(" · ")}</div>` : ""}</td></tr>`));
      });
      card.append(list);
      card.append(el(`<p class="small muted" style="margin-top:8px">Labeled review-slide map:</p>`));
      card.append(el(`<img src="assets/slide-images/map-aegean-labeled.gif" alt="Labeled map of the Aegean from the review slides" style="max-width:100%;border-radius:8px">`));
    }
  });
})();
