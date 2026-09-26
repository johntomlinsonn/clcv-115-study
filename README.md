# CLCV 115 Exam 1 — Study Site

A retrieval-practice study site for CLCV 115 Exam 1 (Powell, *Classical Myth* ch. 1–9 + lectures), built from `docs/claude-study-website-design.md`.

**Open it:** double-click `index.html` (works from `file://`), or host the folder anywhere static (e.g. GitHub Pages). No build step.

## What's inside
| Route | Mode |
|---|---|
| `#/home` | Countdown to the end of the CBTF window, "CBTF booked?" checkbox, readiness %, progress, next best action, 1–2 day study protocol |
| `#/learn` | Story Mode — the 9 story clusters, each with a 3-question check |
| `#/lectures` | Lecture Notes from the Aug 27, Sept 1, Sept 3 and Sept 15 slide decks, with the in-class questions and quick checks |
| `#/flash` | Flashcards (term ↔ meaning, images, Roman names, optional fact cards) with Leitner boxes, recall timer, type-the-answer |
| `#/pictures` | Picture Quiz: name it, which clue, label the object (pins), reverse, zoom challenge, study gallery |
| `#/map` | Map Test: what is marked (★/◯), click to locate, place ↔ meaning, explore |
| `#/quiz` | Topic quiz (hand-written + auto-generated), learning or test mode, 40 s pace bar |
| `#/review` | The 40 review-lecture questions |
| `#/mock` | 75 questions / 50:00, flags, navigator, auto-submit, history |
| `#/errors` | Fix-My-Mistakes log + drill |
| `#/tree`, `#/match`, `#/cheatsheet`, `#/resources` | Family tree + quiz, match games, printable cheat sheet, links + Powell-index lookup drill |

Keyboard: `1–4`/`a–d` answer · `Enter` next · `F` flag · `←/→` navigate (test mode) · `Space` flip card · `1–4` rate card.

## Notes
- Progress lives in `localStorage` (`clcv115_v1`); use **Export/Import** in the footer to move it between devices. The site still works if storage is blocked.
- The map uses Leaflet + label-free CARTO tiles when online; offline it falls back to the blank Aegean map from the review slides (Cyprus and Mesopotamia need the online map).
- `data/lectures.js` holds the lecture-slide content: 64 extra terms (own flashcard deck), extra facts merged into study-guide terms, and 98 lecture questions (tag `lecture`, ~40% of the mock's hand-written share). Week 3 and Week 5 decks were not provided.
- `data/terms.js`, `data/stories.js` and `data/questions.js` are generated from the spec: `python3 tools/build_data.py`. `data/images.js` and `data/places.js` are hand-edited.
- Self-test: open `index.html?selftest` and check the console (verifies all 170 questions and option shuffling).

For studying *before* the exam only — don't open this (or anything else) during a CBTF exam.
