/* Map Test (§6): MapKit helpers (Leaflet with offline fallback) + #/map page. */
(function () {
  "use strict";
  const { $, el, esc, shuffle, sample } = App;
  const MK = (App.MapKit = {});
  const FB = window.DATA_FALLBACK_MAP;
  const REGIONS = window.DATA_REGIONS || {};
  const AEGEAN = [[34.7, 19.6], [41.9, 28.4]];
  const WIDE = [[28.5, 17], [43.5, 50]];
  const TILE = "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

  MK.leaflet = () => typeof window.L !== "undefined" && !!window.L.map;
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
  // fallback image projection (fractions of image size)
  MK.toFrac = (lat, lng) => ({ x: (FB.x0 + (lng - FB.lng0) * FB.pxPerLng) / FB.w, y: (FB.y0 - (lat - FB.lat0) * FB.pxPerLat) / FB.h });
  MK.fromFrac = (fx, fy) => ({ lat: FB.lat0 + (FB.y0 - fy * FB.h) / FB.pxPerLat, lng: FB.lng0 + (fx * FB.w - FB.x0) / FB.pxPerLng });
  const onFallback = (p) => { const f = MK.toFrac(p.lat, p.lng); return !p.region && f.x > 0.03 && f.x < 0.97 && f.y > 0.03 && f.y < 0.97; };
  MK.canShow = (id) => { const p = App.placeById[id]; return !!p && (MK.leaflet() || onFallback(p)); };
  const isAegean = (p) => !p.region && p.lat > AEGEAN[0][0] && p.lat < AEGEAN[1][0] && p.lng > AEGEAN[0][1] && p.lng < AEGEAN[1][1];

  // Keep track of Leaflet instances so re-rendered questions don't leak maps.
  let live = [];
  function prune() {
    live = live.filter((m) => {
      if (m.getContainer().isConnected) return true;
      try { m.remove(); } catch (e) { /* already gone */ }
      return false;
    });
  }
  function makeMap(holder, bounds, opts = {}) {
    prune();
    const div = el(`<div class="mapbox" role="application" aria-label="Map"></div>`);
    if (opts.height) div.style.height = opts.height;
    holder.append(div);
    const map = window.L.map(div, { scrollWheelZoom: false, zoomSnap: 0.25, worldCopyJump: false });
    window.L.tileLayer(TILE, { attribution: "© OpenStreetMap contributors © CARTO", subdomains: "abcd", maxZoom: 12 }).addTo(map);
    map.fitBounds(bounds, { padding: [8, 8] });
    live.push(map);
    App.onCleanup(() => { try { map.remove(); } catch (e) { /* ignore */ } });
    // Leaflet needs a size recalc once the element is laid out
    setTimeout(() => map.invalidateSize(), 60);
    return map;
  }
  const L = () => window.L;
  function starIcon() { return L().divIcon({ className: "", html: `<div class="star-icon">★</div>`, iconSize: [34, 34], iconAnchor: [17, 17] }); }
  function letterIcon(t) { return L().divIcon({ className: "", html: `<div class="letter-icon">${t}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }); }
  function addMark(map, p, style) {
    if (style === "region" || p.region) {
      if (REGIONS[p.region || p.id]) L().polygon(REGIONS[p.region || p.id], { color: "#ff2d2d", weight: 3, fillOpacity: 0.18 }).addTo(map);
    } else if (style === "circle") {
      L().circleMarker([p.lat, p.lng], { radius: 16, color: "#ff2d2d", weight: 4, fill: false }).addTo(map);
    } else {
      L().marker([p.lat, p.lng], { icon: starIcon(), keyboard: false }).addTo(map);
    }
  }
  function boundsFor(places) {
    if (places.every(isAegean)) return AEGEAN;
    if (places.some((p) => p.region)) return WIDE;
    const lats = places.map((p) => p.lat), lngs = places.map((p) => p.lng);
    return [[Math.min(...lats, 34.5) - 1, Math.min(...lngs, 20) - 1], [Math.max(...lats, 41.5) + 1, Math.max(...lngs, 28) + 1]];
  }

  function fallbackPic(holder) {
    const box = el(`<div class="fallback-map"><img alt="Blank map of the Aegean" src="${FB.file}"></div>`);
    holder.append(box);
    holder.append(el(`<div class="credit">Offline map (review slides). Cyprus and Mesopotamia need the online map.</div>`));
    return box;
  }
  function fbMark(box, p, cls, text) {
    const f = MK.toFrac(p.lat, p.lng);
    box.append(el(`<span class="fb-marker ${cls}" style="left:${f.x * 100}%;top:${f.y * 100}%">${text || ""}</span>`));
  }

  // Render the map for a quiz question: {map:{marker,style}} or {mapMarkers:[ids]}
  MK.questionMap = function (holder, q) {
    const ids = q.mapMarkers || [q.map.marker];
    const places = ids.map((id) => App.placeById[id]);
    if (MK.leaflet()) {
      const map = makeMap(holder, q.map && q.map.marker === "cyprus" ? [[33.5, 20], [41.5, 36]] : boundsFor(places));
      if (q.mapMarkers) places.forEach((p, i) => L().marker([p.lat, p.lng], { icon: letterIcon("ABCD"[i]), keyboard: false }).addTo(map));
      else addMark(map, places[0], q.map.style);
    } else {
      const box = fallbackPic(holder);
      if (q.mapMarkers) places.forEach((p, i) => fbMark(box, p, "letter", "ABCD"[i]));
      else fbMark(box, places[0], q.map.style === "circle" ? "circle" : "star", q.map.style === "circle" ? "" : "★");
    }
  };

  // ------------------------------------------------------------------ #/map
  App.route("map", function (root) {
    root.append(el(`<div class="page-head"><h1>Map Test</h1>
      <p>Tested places: Athens, Cyprus, Delos, Delphi, Greece, Mesopotamia, Mt. Olympus. Goal: 100% twice in a row. Current streak: <strong id="mapStreak">${App.state.streaks.map}</strong>.
      ${MK.leaflet() ? "" : "<br><strong>Offline:</strong> using the blank Aegean map from the review slides."}</p></div>`));
    const tabs = el(`<div class="row no-print" role="tablist" style="margin-bottom:12px">
      <button class="btn on" data-t="marked" type="button">What is marked? (a–d)</button>
      <button class="btn" data-t="click" type="button">Click to locate</button>
      <button class="btn" data-t="letters" type="button">Place ↔ meaning</button>
      <button class="btn" data-t="explore" type="button">Explore</button></div>`);
    root.append(tabs);
    const host = el(`<div></div>`);
    root.append(host);
    const testedIds = App.places.filter((p) => p.tested && MK.canShow(p.id));
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
      const hand = App.questions.filter((q) => q.map && MK.canShow(q.map.marker));
      const qs = shuffle(testedIds.map((p) => App.Gen.mapMarked(p)).filter(Boolean).concat(hand));
      App.runQuiz(h, qs, { mode: "learn", title: "Map", onDone: (r) => streak(r.correct === r.total && r.total === qs.length), restart: () => { h.innerHTML = ""; marked(h); } });
    }
    function letters(h) {
      const qs = shuffle(testedIds.filter((p) => !p.region).map((p) => App.Gen.placeMeaning(p)).filter(Boolean));
      App.runQuiz(h, qs, { mode: "learn", title: "Which marker", onDone: (r) => streak(r.correct === r.total && r.total === qs.length), restart: () => { h.innerHTML = ""; letters(h); } });
    }

    function click(h) {
      const order = shuffle(testedIds.filter((p) => MK.leaflet() || !p.region));
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
        card.append(el(`<div class="stem">Click on <b>${esc(p.name)}</b>.</div>`));
        const holder = el(`<div class="media"></div>`);
        card.append(holder);
        const fb = el(`<div></div>`);
        card.append(fb);
        let answered = false;
        const judge = (lat, lng, show) => {
          if (answered) return;
          answered = true;
          let ok, msg;
          if (p.region) {
            ok = MK.inPolygon(lat, lng, REGIONS[p.region]);
            msg = ok ? "Inside the region." : "Outside the region.";
          } else {
            const d = MK.km(p, { lat, lng });
            ok = d <= p.tol_km;
            msg = `${Math.round(d)} km from ${esc(p.name)} (tolerance ${p.tol_km} km).`;
          }
          if (ok) right++;
          App.recordAnswer({ id: "auto:click:" + p.id, tags: ["maps", "auto"], q: `Locate ${esc(p.name)} on the map.`, opts: [esc(p.name), "—", "–", "−"], ans: 0, why: esc(p.note), map: { marker: p.id, style: "star" } }, ok);
          show();
          fb.append(el(`<div class="feedback ${ok ? "good" : "bad"}"><strong>${ok ? "Correct." : "Missed."}</strong> ${msg} ${esc(p.name)}: ${esc(p.note)}.</div>`));
          const nb = el(`<button class="btn primary" type="button" style="margin-top:12px">Next →</button>`);
          nb.onclick = () => { i++; next(); };
          fb.append(nb);
          nb.focus();
        };
        if (MK.leaflet()) {
          const map = makeMap(holder, isAegean(p) ? AEGEAN : WIDE, { height: "420px" });
          map.on("click", (e) => judge(e.latlng.lat, e.latlng.lng, () => {
            L().circleMarker(e.latlng, { radius: 7, color: "#b3261e", fillOpacity: 1 }).addTo(map);
            if (p.region) L().polygon(REGIONS[p.region], { color: "#3f7a25", weight: 3, fillOpacity: 0.2 }).addTo(map);
            else {
              L().circle([p.lat, p.lng], { radius: p.tol_km * 1000, color: "#3f7a25", weight: 2, fillOpacity: 0.15 }).addTo(map);
              L().circleMarker([p.lat, p.lng], { radius: 7, color: "#3f7a25", fillOpacity: 1 }).addTo(map);
              L().polyline([e.latlng, [p.lat, p.lng]], { color: "#1d1a17", dashArray: "4 4" }).addTo(map);
            }
          }));
        } else {
          const box = fallbackPic(holder);
          box.onclick = (e) => {
            const r = box.getBoundingClientRect();
            const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
            const ll = MK.fromFrac(fx, fy);
            judge(ll.lat, ll.lng, () => {
              box.append(el(`<span class="fb-marker guess" style="left:${fx * 100}%;top:${fy * 100}%"></span>`));
              fbMark(box, p, "dot");
            });
          };
        }
        App.onKey = (e) => { if (e.key === "Enter" && answered) { i++; next(); } };
      }
    }

    function explore(h) {
      const card = el(`<div class="card"></div>`);
      h.append(card);
      const holder = el(`<div></div>`);
      card.append(holder);
      const tested = App.places.filter((p) => p.tested);
      const info = (p) => {
        const t = App.termById[p.id];
        return `<strong>${esc(p.name)}</strong><br>${esc(p.note)}${t && t.more.length ? "<br><em>" + t.more.map(esc).join("<br>") + "</em>" : ""}${t && t.image ? `<br><img src="${App.imgSrc(t.image)}" alt="${esc(p.name)}" style="max-width:180px;margin-top:6px">` : ""}`;
      };
      if (MK.leaflet()) {
        const map = makeMap(holder, WIDE, { height: "480px" });
        App.places.filter((p) => !p.tested && !["egypt", "anatolia", "italy", "persia"].includes(p.id)).forEach((p) =>
          L().circleMarker([p.lat, p.lng], { radius: 4, color: "#6b5f53", fillOpacity: 0.8 }).bindPopup(`${esc(p.name)} <span style="color:#888">(not tested)</span>`).addTo(map));
        tested.forEach((p) => {
          if (p.region) L().polygon(REGIONS[p.region], { color: "#C8643B", weight: 2, fillOpacity: 0.12 }).bindPopup(info(p)).addTo(map);
          else L().marker([p.lat, p.lng]).bindPopup(info(p)).bindTooltip(p.name, { permanent: true, direction: "right" }).addTo(map);
        });
      } else {
        const box = fallbackPic(holder);
        tested.filter(onFallback).forEach((p) => fbMark(box, p, "dot"));
      }
      const list = el(`<table style="margin-top:12px"><thead><tr><th>Place</th><th>Why it matters</th></tr></thead><tbody></tbody></table>`);
      tested.forEach((p) => $("tbody", list).append(el(`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.note)}</td></tr>`)));
      card.append(list);
      card.append(el(`<p class="small muted" style="margin-top:8px">Labeled review-slide map:</p>`));
      card.append(el(`<img src="assets/slide-images/map-aegean-labeled.gif" alt="Labeled map of the Aegean from the review slides" style="max-width:100%;border-radius:8px">`));
    }
  });
})();
