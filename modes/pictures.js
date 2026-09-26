/* Picture Quiz (§5): study gallery + 5 formats. Alt text never leaks the answer. */
(function () {
  "use strict";
  const { $, el, esc, shuffle } = App;
  const G = () => App.Gen;

  App.route("pictures", function (root) {
    root.append(el(`<div class="page-head"><h1>Picture Quiz</h1>
      <p>Only the 14 study-guide images are tested — iconography only (who, doing what, identifying objects, which story), <em>not</em> date/painter/medium.
      Goal: 100% twice in a row on the Mixed round. Current streak: <strong id="picStreak">${App.state.streaks.pictures}</strong>.</p></div>`));
    const tabs = el(`<div class="row" role="tablist" style="margin-bottom:12px">
      <button class="btn on" data-t="mixed" type="button">Mixed (all formats)</button>
      <button class="btn" data-t="name" type="button">Name it</button>
      <button class="btn" data-t="clue" type="button">Which clue?</button>
      <button class="btn" data-t="label" type="button">Label the object</button>
      <button class="btn" data-t="reverse" type="button">Reverse</button>
      <button class="btn" data-t="crop" type="button">Zoom challenge</button>
      <button class="btn" data-t="study" type="button">Study gallery</button></div>`);
    root.append(tabs);
    const host = el(`<div></div>`);
    root.append(host);

    const imgs = App.images;
    const withGod = imgs.filter((i) => i.god);
    const withSpots = imgs.filter((i) => (i.hotspots || []).length >= 2);
    const handPics = App.questions.filter((q) => q.img || q.file);
    const builders = {
      mixed: () => shuffle(imgs.map((im) => G().pictureQ(im)).concat(handPics)),
      name: () => shuffle(imgs.map((im) => G().imageName(im))),
      clue: () => shuffle(withGod.map((im) => G().imageClue(im))),
      label: () => shuffle(withSpots.map((im) => G().imageLabel(im))),
      reverse: () => shuffle(imgs.map((im) => G().imageReverse(im))),
      crop: () => shuffle(withGod.filter((im) => im.hotspots.some((h) => h.kind === "obj")).map((im) => G().imageCrop(im)))
    };
    function run(kind) {
      host.innerHTML = "";
      App.onKey = null;
      if (kind === "study") return study(host);
      const qs = builders[kind]();
      App.runQuiz(host, qs, {
        mode: "learn", title: "Pictures",
        onDone: (r) => {
          if (kind !== "mixed") return;
          const perfect = r.correct === r.total && r.total === qs.length;
          App.state.streaks.pictures = perfect ? App.state.streaks.pictures + 1 : 0;
          App.save();
          $("#picStreak").textContent = App.state.streaks.pictures;
        },
        restart: () => run(kind)
      });
    }
    App.$$("button", tabs).forEach((b) => (b.onclick = () => {
      App.$$("button", tabs).forEach((x) => x.classList.toggle("on", x === b));
      run(b.dataset.t);
    }));
    run("mixed");
  });

  function study(host) {
    host.append(el(`<p class="muted">Cover the caption, name the scene, then reveal. Tap “Show labels” to see the attribute pins.</p>`));
    const grid = el(`<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))"></div>`);
    App.images.forEach((im) => {
      const c = el(`<div class="card"></div>`);
      const pic = App.renderPic({ img: im.id }, { alt: im.answer });
      c.append(pic);
      const labels = el(`<div class="small hidden"></div>`);
      (im.hotspots || []).forEach((h, i) => {
        $(".pic", pic).append(el(`<span class="pin hidden" style="left:${h.x * 100}%;top:${h.y * 100}%">${i + 1}</span>`));
        labels.append(el(`<div><strong>${i + 1}</strong> ${esc(h.label)}</div>`));
      });
      const cap = el(`<details><summary><strong>Reveal</strong></summary>
        <p style="margin-top:6px"><strong>${esc(im.answer)}</strong></p>
        <p class="small"><strong>Who:</strong> ${esc(im.who.join(", "))}<br><strong>Doing:</strong> ${esc(im.doing)}</p>
        <ul class="small">${im.clues.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        <p class="small muted">${esc(im.story)}</p>
        ${im.backup ? `<p class="credit">More views: <a href="${im.backup}" target="_blank" rel="noopener">Wikimedia Commons</a></p>` : ""}</details>`);
      c.append(cap);
      if ((im.hotspots || []).length) {
        const tg = el(`<button class="btn small" type="button">Show labels</button>`);
        tg.onclick = () => {
          const on = labels.classList.toggle("hidden");
          App.$$(".pin", pic).forEach((p) => p.classList.toggle("hidden", on));
          tg.textContent = on ? "Show labels" : "Hide labels";
        };
        c.append(tg, labels);
      }
      grid.append(c);
    });
    host.append(grid);
    const tbl = el(`<div class="card"><h2>Attribute → god</h2><table><tbody></tbody></table>
      <p class="small muted" style="margin-top:8px">Transfer practice (needs internet) — same iconography on other vases:
      <a href="https://commons.wikimedia.org/wiki/Category:Hephaestus_in_ancient_Greek_pottery" target="_blank" rel="noopener">Hephaestus</a> ·
      <a href="https://commons.wikimedia.org/wiki/Category:Apollo_in_ancient_Greek_pottery" target="_blank" rel="noopener">Apollo</a> ·
      <a href="https://commons.wikimedia.org/wiki/Category:Athena_in_ancient_Greek_pottery" target="_blank" rel="noopener">Athena</a> ·
      <a href="https://commons.wikimedia.org/wiki/Category:Hermes_in_ancient_Greek_pottery" target="_blank" rel="noopener">Hermes</a> ·
      <a href="https://commons.wikimedia.org/wiki/Category:Aphrodite_in_a_shell" target="_blank" rel="noopener">Aphrodite in a shell</a></p></div>`);
    (window.DATA_ATTRS || []).forEach(([a, g]) => $("tbody", tbl).append(el(`<tr><td>${esc(a)}</td><td><strong>${esc(g)}</strong></td></tr>`)));
    host.append(tbl);
  }
})();
