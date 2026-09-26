/* Family Tree (§8.4): collapsible genealogy + "which name is missing?" quiz. */
(function () {
  "use strict";
  const { $, el, esc, shuffle, sample } = App;
  // node: [name, note?, groups?]  group: [unionLabel, [nodes]]
  const N = (name, note, groups) => ({ name, note: note || "", groups: groups || [] });
  const TREE = [
    N("Chaos", "the gap/void — first"),
    N("Tartarus", "pit beneath the earth", [["+ Gaea", [N("Typhoeus", "100 snake heads; defeated by Zeus")]]]),
    N("Eros", "primordial Love"),
    N("Gaea", "Earth", [
      ["+ Uranus (Sky)", [
        N("Titans", "12 children of Gaea & Uranus", [["", [
          N("Cronus", "castrates Uranus; swallows his children", [["+ Rhea", [
            N("Hestia"), N("Demeter"), N("Hades", "“invisible”"), N("Poseidon"),
            N("Hera", "", [["alone (Hesiod)", [N("Hephaestus", "lame smith god", [["", [N("Erichthonius", "early Athenian king")]]])]], ["+ Zeus", [N("Ares", "war", [["+ Aphrodite", [N("Phobos & Deimos", "fear"), N("Eros", "variant parentage"), N("Harmonia", "harmony")]]]), N("Eileithyia", "childbirth")]]]),
            N("Zeus", "youngest; king of the Olympians", [
              ["+ Metis", [N("Athena", "born from Zeus' head")]],
              ["+ Leto", [N("Apollo", "", [["+ Coronis", [N("Asclepius", "raised the dead")]]]), N("Artemis")]],
              ["+ Maia", [N("Hermes", "", [["+ Penelope (per lecture)", [N("Pan", "goat god")]], ["+ Aphrodite", [N("Hermaphroditus")]]])]]
            ])
          ]]]),
          N("Oceanus", "origin of gods in Homer", [["+ Tethys", [N("Oceanids", "6000 children")]]]),
          N("Hyperion", "", [["", [N("Helios", "sun god")]]]),
          N("Iapetus", "", [["+ Themis (lecture; Clymene in Hesiod)", [
            N("Prometheus", "“forethought”", [["", [N("Deucalion", "flood survivor", [["+ Pyrrha", [N("Hellen", "eponymous ancestor of the Greeks", [["", [N("Dorus"), N("Aeolus"), N("Xuthus", "", [["", [N("Ion")]]])]]])]]])]]]),
            N("Epimetheus", "“afterthought”", [["+ Pandora", [N("Pyrrha", "wife of Deucalion")]]]),
            N("Atlas", "holds up the sky", [["", [N("Maia", "nymph, mother of Hermes")]]])
          ]]]),
          N("Coeus + Phoebe", "", [["", [N("Leto", "Titaness")]]]),
          N("Themis"), N("Mnemosyne")
        ]]]),
        N("Cyclopes", "forge Zeus' thunderbolt"),
        N("Hundred-handers", "hurl boulders")
      ]],
      ["+ Pontus (sea)", [N("Nereus", "sea god", [["+ Doris", [N("Nereids", "50 sea nymphs", [["", [N("Thetis", "mother of Achilles")]]])]]])]],
      ["Uranus' blood + Earth", [N("Furies (Erinyes)", "punish kin-killers")]],
      ["Uranus' genitals + sea", [N("Aphrodite", "from the foam; lands at Cyprus", [["+ Anchises", [N("Aeneas")]]])]]
    ]),
    N("Myrrha", "(+ her father)", [["", [N("Adonis", "killed by a boar")]]])
  ];
  const allNodes = [];
  (function walk(ns) { ns.forEach((n) => { allNodes.push(n); n.groups.forEach((g) => walk(g[1])); }); })(TREE);
  const quizzable = allNodes.filter((n) => !/\+/.test(n.name) && n.name !== "Titans");

  function render(nodes, blank, openAll) {
    const ul = el(`<ul></ul>`);
    nodes.forEach((n) => {
      const li = el(`<li></li>`);
      const label = n === blank ? `<span class="node blank">???</span>` : `<span class="node">${esc(n.name)}</span>`;
      const note = n.note && n !== blank ? `<span class="note">${esc(n.note)}</span>` : "";
      if (n.groups.length) {
        const d = el(`<details ${openAll || contains(n, blank) ? "open" : ""}><summary>${label}${note}</summary></details>`);
        n.groups.forEach(([u, kids]) => {
          if (u) d.append(el(`<div class="union">${esc(u)} →</div>`));
          d.append(render(kids, blank, openAll));
        });
        li.append(d);
      } else li.innerHTML = label + note;
      ul.append(li);
    });
    return ul;
  }
  function contains(n, target) {
    if (!target) return false;
    return n.groups.some((g) => g[1].some((k) => k === target || contains(k, target)));
  }

  App.route("tree", function (root) {
    root.append(el(`<div class="page-head"><h1>Family Tree</h1>
      <p>Hesiod organizes variant myths through genealogies. Tap a name to expand/collapse. Leto is a Titaness, daughter of the Titans Coeus and Phoebe.</p></div>`));
    const bar = el(`<div class="row" style="margin-bottom:12px"><button class="btn" data-open type="button">Expand all</button><button class="btn" data-close type="button">Collapse</button><button class="btn primary" data-quiz type="button">Quiz: missing name</button></div>`);
    root.append(bar);
    const box = el(`<div class="card tree"></div>`);
    const qbox = el(`<div></div>`);
    root.append(qbox, box);
    const show = (openAll, blank) => { box.innerHTML = ""; box.append(render(TREE, blank, openAll)); };
    show(false);
    $("[data-open]", bar).onclick = () => { qbox.innerHTML = ""; show(true); };
    $("[data-close]", bar).onclick = () => { qbox.innerHTML = ""; show(false); };
    let score = 0, n = 0;
    $("[data-quiz]", bar).onclick = ask;
    function ask() {
      const target = sample(quizzable, 1)[0];
      show(false, target);
      const opts = shuffle([target.name, ...sample(quizzable.filter((x) => x !== target), 3).map((x) => x.name)]);
      qbox.innerHTML = "";
      const c = el(`<div class="card"><div class="stem">Which name belongs in the <span class="node blank">???</span> box?</div><div class="opts"></div><div class="fb"></div></div>`);
      opts.forEach((o, i) => {
        const b = el(`<button class="opt" type="button"><span class="letter">${"abcd"[i]}</span><span>${esc(o)}</span></button>`);
        b.onclick = () => answer(o, b);
        $(".opts", c).append(b);
      });
      qbox.append(c);
      const blankEl = $(".node.blank", box);
      if (blankEl) blankEl.scrollIntoView({ block: "center", behavior: "smooth" });
      let done = false;
      function answer(o, b) {
        if (done) return;
        done = true; n++;
        const ok = o === target.name;
        if (ok) score++;
        App.$$(".opt", c).forEach((x) => { x.disabled = true; if (x.textContent.slice(1) === target.name) x.classList.add("correct"); });
        if (!ok) b.classList.add("wrong");
        $(".fb", c).append(el(`<div class="feedback ${ok ? "good" : "bad"}"><strong>${esc(target.name)}</strong>${target.note ? " — " + esc(target.note) : ""}. Score ${score}/${n}.</div>`));
        const nx = el(`<button class="btn primary" type="button" style="margin-top:10px">Next →</button>`);
        nx.onclick = ask;
        $(".fb", c).append(nx);
        const blank = $(".node.blank", box);
        if (blank) { blank.classList.remove("blank"); blank.classList.add("hl"); blank.textContent = target.name; }
      }
      App.onKey = (e) => {
        const k = e.key.toLowerCase();
        const i = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "abcd".indexOf(k);
        if (k.length === 1 && i >= 0) App.$$(".opt", c)[i].click();
        else if (k === "enter" && done) ask();
      };
    }
  });
})();
