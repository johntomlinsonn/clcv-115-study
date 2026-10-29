---
name: clcv115-design
description: Design system and UI/UX rules for the CLCV 115 study site ("lapis & marble"). Use whenever changing styles.css, page layout, navigation, or any screen's look or interaction, on either exam.
---

# CLCV 115 design system

The site's look and the rules it was checked against. Read with the `frontend-design` skill (aesthetic process) — this file holds the decisions already made, so new screens match.

## Brief
One student cramming for a CBTF multiple-choice exam (75 Q / 50 min), on a phone between classes and a laptop at a desk. The primary job is **fast retrieval practice**; everything else gets out of the way.

## Tokens (`styles.css` `:root`, with dark-mode overrides)
| Token | Light | Role |
|---|---|---|
| `--ink` | `#15233f` lapis | text, chrome background |
| `--bg` / `--surface` | `#eef1f4` marble / `#fff` | page / cards |
| `--accent` | `#1c5d99` Aegean | primary buttons, links, selected answer |
| `--ochre` | `#c4952b` | Greek-key band, exam switch, flags, pace warning |
| `--good` | `#2f6f43` laurel | correct, progress |
| `--bad` | `#b23a2a` cinnabar | wrong |

- Type: **Fraunces** (headings, 650, sentence case) + **Lexend** (body; picked for reading fluency). Numbers use `tabular-nums`.
- Radii by hierarchy: cards 16px, controls 10px, small chips 6px. Shadows are faint; borders carry structure.
- The one decorative motif is the **Greek-key (meander) band**: under the top bar and along the top of each flashcard. Don't add more decoration.
- Motion: only in answer to an action (card flip, sheet open). `prefers-reduced-motion` turns it all off.

## Layout
- **< 1100px:** sticky top bar (brand + Exam 1/2 switch), fixed **bottom tab bar** (Home · Cards · Practice · Mock · More), and "More" opens the grouped nav as a bottom sheet (`#menu`, `body.menu-open`). Body has bottom padding for the tab bar + `env(safe-area-inset-bottom)`.
- **≥ 1100px:** fixed left sidebar (brand, switch, grouped nav: Learn / Practice / Test / Reference); content column max 860px.
- Mode switchers (`.modes`, `.story-nav`) wrap on desktop and become one horizontal scroll strip on phones.
- **Focus mode:** `runQuiz` sets `body.in-session` → page intros collapse; on phones the mock hides its page head and keeps counter + clock sticky.
- A running mock sets `App.leaveGuard` → leaving asks first (router + `beforeunload`).

## Quality floor (from UI/UX Pro Max's priority list — check before shipping)
1. Text contrast ≥ 4.5:1 in **both** themes; never colour alone for right/wrong (✓/✗ text + letter badge colour).
2. Touch targets ≥ 44px (tab bar 48px+, answer options 54px); visible `:focus-visible` ring; skip link.
3. No horizontal page scroll at 375px; images `max-width:100%`; tables scroll or drop columns.
4. Keyboard hints (`.kbd-hint`, `.kbd-hint-inline`, `.key`) are hidden on touch-only devices.
5. SVG icons only (no emoji as icons) in chrome.
6. Test after changes: both exams × phone (375–390px) and desktop, light and dark, plus the scripted flows (every quiz/deck/mock completes, no console errors).

Exam 1 content must stay the same; the redesign changed chrome and styling only, plus small copy (✓/✗ feedback, rating labels).

## Source skills
- `frontend-design` (Anthropic, in `.claude/skills/frontend-design/`) — the design process.
- UI/UX Pro Max (github.com/nextlevelbuilder/ui-ux-pro-max-skill) — the rule list above was taken from its priority table and pre-delivery checklist. It ships Python search scripts, so it isn't vendored here; install it yourself if you want its searchable palettes and fonts.
