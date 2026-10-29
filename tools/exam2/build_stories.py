#!/usr/bin/env python3
"""Build data/exam2/stories.js (Story Mode) from docs/exam2/06-story-clusters.md.

Each "## e2cN — Title" section becomes a story; markdown bullets/tables become HTML.
The 3-question check per story is picked by question-text prefix from data/exam2/questions*.js.
Usage: python3 tools/exam2/build_stories.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CHECKS = {  # story → question-text prefixes (first match wins)
    "e2c1": ["What famous religious cult is founded", "What prevents Hermes", "Demeter tries to make the baby"],
    "e2c2": ["Isis and Osiris are", "Who is Attis?", "What do the stories of Persephone, Osiris"],
    "e2c3": ["Why does Dionysus come to Thebes", "His female followers", "In his second encounter with Dionysus"],
    "e2c4": ["How does Odysseus summon", "What crime did Tantalus", "Why does Aeneas go to the underworld?"],
    "e2c5": ["How is Enkidu introduced", "How does Ishtar respond", "After their deaths, Greek heroes"],
    "e2c6": ["How did Danaë conceive", "What does the cap of Hades", "Why is Andromeda in danger?"],
    "e2c7": ["What does the Delphic oracle tell Cadmus", "How does Laius try to escape", "Why did Eriphyle become"],
    "e2c8": ["Which is NOT one of the three Athenian claims", "Theseus' three parents are", "What did Euripides change"],
    "e2c9": ["In the wrath story of the Cretan bull", "Why does Theseus abandon Ariadne?", "What is Daedalus' last accomplishment?"],
    "e2c10": ["Which is the correct sequence of a wrath", "The legendary weddings of Peleus", "Hippolytus, Bellerophon, and Peleus"],
}
HEADSUP = {
    "e2c1": ["Powell: Persephone spends a third of the year below; the Mysteries were held in the fall (the slides say late summer, near harvest)."],
    "e2c4": ["Homer has no Charon and no river to cross — those come from Vergil. Homer's Elysium is at the ends of the earth; Vergil's is inside the underworld."],
    "e2c6": ["The Danaids' punishment in the underworld is a late (Hellenistic) invention; in early versions they were not punished."],
    "e2c8": ["The study guide spells it Pirithous; the Amazon queen Theseus takes is Antiope (sometimes called Hippolyta)."],
}


def inline(s):
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"(?<!\w)\*(.+?)\*(?!\w)", r"<i>\1</i>", s)
    s = re.sub(r"`(.+?)`", r"\1", s)
    return s


def to_html(lines):
    html, depth, table = [], 0, []

    def close_to(d):
        nonlocal depth
        while depth > d:
            html.append("</li></ul>" if depth > 1 else "</ul>")
            depth -= 1

    for line in lines:
        if line.startswith("|"):
            table.append([c.strip() for c in line.strip().strip("|").split("|")])
            continue
        if table:
            close_to(0)
            head, *body = [r for r in table if not set("".join(r)) <= set("-: ")]
            html.append("<table><thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>"
                        + "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in body) + "</tbody></table>")
            table = []
        m = re.match(r"^(\s*)- (.*)", line)
        if m:
            d = len(m.group(1)) // 2 + 1
            if d > depth:
                html[-1:] = [html[-1].removesuffix("</li>")] if d > 1 and html and html[-1].endswith("</li>") else html[-1:]
                html.append("<ul>")
                depth = d
            else:
                close_to(d)
            html.append(f"<li>{inline(m.group(2))}</li>")
        elif line.strip():
            close_to(0)
            html.append(f"<p>{inline(line.strip())}</p>")
    close_to(0)
    return "\n".join(html)


def question_ids():
    pairs = []
    for f in sorted((ROOT / "data" / "exam2").glob("questions*.js")):
        src = f.read_text()
        if "crq" in f.name:
            pairs += [(f"c{i:03d}", q) for i, q in enumerate(re.findall(r'^\s*C\("[\w-]+", "((?:[^"\\]|\\.)*)"', src, re.M), 1)]
        else:
            for kind, prefix in (("I", "i"), ("R", "r")):
                pairs += [(f"{prefix}{int(num):02d}", q) for num, q in re.findall(rf'^\s*{kind}\((\d+), (?:"\w+", )?"[\w-]+", "((?:[^"\\]|\\.)*)"', src, re.M)]
    return pairs


def main():
    text = (ROOT / "docs" / "exam2" / "06-story-clusters.md").read_text()
    qs = question_ids()
    stories = []
    for sec in re.split(r"^## ", text, flags=re.M)[1:]:
        title_line, *body = sec.split("\n")
        m = re.match(r"(e2c\d+) — (.*)", title_line)
        if not m:
            continue
        sid, title = m.groups()
        body = [l for l in body if l.strip() != "---"]
        check = []
        for pre in CHECKS[sid]:
            hit = next((i for i, q in qs if q.startswith(pre)), None)
            assert hit, (sid, pre)
            check.append(hit)
        stories.append({"id": sid, "label": sid[3:], "title": title, "html": to_html(body), "check": check, "headsup": HEADSUP.get(sid, [])})
    js = ("// Generated by tools/exam2/build_stories.py from docs/exam2/06-story-clusters.md — edit the markdown, then rerun.\n"
          "window.DATA_STORIES = " + json.dumps(stories, indent=1, ensure_ascii=False) + ";\n")
    (ROOT / "data" / "exam2" / "stories.js").write_text(js)
    print(f"wrote {len(stories)} stories")


if __name__ == "__main__":
    main()
