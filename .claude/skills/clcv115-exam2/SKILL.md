---
name: clcv115-exam2
description: Knowledge base and build plan for the CLCV 115 Exam 2 section of this study site (Powell ch. 10–14, 16–18; exam Oct 29 – Nov 1, 2026). Use whenever working on Exam 2 content, the Exam 1/Exam 2 split, Exam-2 questions, images, maps, flashcards, or the course reading questions.
---

# CLCV 115 Exam 2

All Exam-2 knowledge lives in `docs/exam2/` — read `docs/exam2/README.md` first, then `docs/exam2/00-website-plan.md`.

## Status
- **Built.** Exam 2 data: `data/exam2/` (terms, crq, stories, images, places, questions, questions-crq, lectures, config). Rebuild stories with `python3 tools/exam2/build_stories.py` after editing `docs/exam2/06-story-clusters.md`.
- Test both exams after changes: `index.html?exam=1&selftest` and `?exam=2&selftest` (console), and keep Exam 1 output identical.
- The Powell textbook PDF is **not** in the repo (copyright). Ask for `6_Textbook_Ch10-14_and_16-18.zip` again if a build needs it; the page map is in `docs/exam2/07-source-inventory.md`.

## Where things are
| Need | File |
|---|---|
| The plan (switcher, architecture, pages, mock mix, build order, acceptance list) | `docs/exam2/00-website-plan.md` |
| Official checklist (138 terms, 13 images) + guide typos | `docs/exam2/01-study-guide-checklist.md` |
| Course reading questions (main exam source) | `docs/exam2/02-course-reading-questions.md` |
| Lecture & review questions with answers | `docs/exam2/03-lecture-questions-answer-key.md` |
| Picture-quiz data for the 13 images | `docs/exam2/04-images.md` + `assets/exam2/exam-images/` |
| Map places & coordinates | `docs/exam2/05-maps.md` |
| Story clusters / key facts | `docs/exam2/06-story-clusters.md` |
| Raw slide text (verbatim, with speaker notes) | `docs/exam2/sources/` |
| Re-extraction scripts | `tools/exam2/` |

## Rules
1. **The study guide wording wins** over Powell, slides, or our notes. Never make a guide typo (e.g. Persephone "daughter of Persephone") a correct answer; show a heads-up instead.
2. Use **exactly the Exam-1 learning techniques** (retrieval first, Leitner boxes, both-direction cards, type-the-answer, story clusters, interleaving, dual coding, 40 s pace bar, 75 Q / 50:00 mock, error log, picture & map formats). Exam-1 spec: `docs/claude-study-website-design.md`.
3. Exam 1 must keep working unchanged (routes redirect, `localStorage` key `clcv115_v1` untouched; Exam 2 uses `clcv115_e2_v1`).
4. Items marked "? check" in the answer key, and film/TV poll questions, stay out of the mock exam.
5. Facts marked *(Powell)* in the story clusters must be verified against the PDF before they become questions.
6. Picture Quiz alt text never reveals the answer.
