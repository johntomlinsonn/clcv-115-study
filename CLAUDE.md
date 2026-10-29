# CLCV 115 study site

Static, no-build study site (vanilla JS, `index.html` + `app.js` + `modes/` + `data/`). Exam 1 spec: `docs/claude-study-website-design.md`.

Two exams share one codebase: `index.html` loads `data/*` (Exam 1) or `data/exam2/*` (Exam 2) depending on `?exam=`, and `window.DATA_CONFIG` (`data/exam2/config.js`) overrides Exam 1 defaults in `app.js`/`modes/`. Exam 1 must render identically — compare before/after when touching shared code. Exam 2 knowledge base: `docs/exam2/` (or the `clcv115-exam2` skill). `main` deploys to GitHub Pages via `.github/workflows/pages.yml`.
