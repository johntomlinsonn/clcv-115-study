# Exam 2 — Source inventory (what was uploaded, what's missing, where it lives)

Uploads are **not** kept between sessions (the cloud container is reset), so everything needed for the build has been copied into this repo as text or images. The original zips have to be re-uploaded only if something below says "not in repo".

## Uploaded zips (Oct 29, 2026)
| # | Zip | Contents | In repo as |
|---|---|---|---|
| 1 | `1_Exam2_Review_TermsImages_Questions_WhatToDo.zip` | `Oct27Review Slides With Answers.pptx` (93 slides) · `Second Exam Terms Images FA 2026.docx` (checklist + 13 images) · 8 × `Week{6–9}{Tue,Thu}CourseReadingQuestions.docx` · 5 × `WhatToDoInWeek{6–10}.docx` | `sources/oct27-review-slides.md`, `sources/study-guide-raw.md`, `01-study-guide-checklist.md`, `02-course-reading-questions.md`, `sources/weekly-instructions-raw.md`, `assets/exam2/exam-images/*` (13), `assets/exam2/slide-images/*` |
| 2 | `2_Slides_Wk6_Powell10_Demeter.zip` | `Sept29Powell10 Slides.pptx` (46 slides) | `sources/sept29-powell10-slides.md` |
| 3 | `3_Slides_Wk7-8_Powell12_Powell14.zip` | `Oct6Powell12 Slide Deck.pptx` (34) · `Oct13Powell14 Slides.pptx` (36) | `sources/oct6-powell12-slides.md`, `sources/oct13-powell14-slides.md` |
| 4 | `4_Slides_Wk9_Powell16_Theseus.zip` | `Oct20Powell16 Slides.pptx` (43) | `sources/oct20-powell16-slides.md` |
| 5 | `5_Slides_Powell17_Crete_and_Powell18_Thebes.zip` | `Oct22Powell17 SLIDES (images compressed).pptx` (40) · `Oct15Powell18 Slides.pptx` (42) | `sources/oct22-powell17-slides.md`, `sources/oct15-powell18-slides.md` |
| 6 | `6_Textbook_Ch10-14_and_16-18.zip` | `Powell_Classical_Myth_Ch10-14_and_16-18.pdf` (206 pages) | **not in repo** (copyrighted textbook). It *did* upload in this session (an earlier upload batch); text extracted only to the session scratchpad. Re-upload it in the build session. |

Each zip was uploaded twice (two identical copies of zips 2–5); contents are identical.

## Powell PDF page map (PDF page → book page → chapter)
| Chapter | Title | PDF pages | Book pages (approx.) |
|---|---|---|---|
| 10 | Myths of Fertility I: Demeter and Related Myths | 1–30 | 231–260 |
| 11 | Myths of Fertility II: Dionysus | 31–60 | 261–290 |
| 12 | Myths of Death: Encounters with the Underworld | 61–92 | 291–322 |
| 13 | Introduction to Heroic Myth: The Mesopotamian Legend of Gilgamesh | 93–106 | 323–336 |
| 14 | Perseus and Myths of the Argive Plain | 107–126 | 337–356 |
| 16 | Theseus and the Myths of Athens | 127–157 | ~393–423 |
| 17 | The Myths of Crete | 158–179 | ~424–445 |
| 18 | Oedipus and the Myths of Thebes | 180–206 | ~446–472 |

Useful passages already located: ch. 16 "Observations: Myth and Propaganda" (Pisistratus, Miltiades, Cimon → Theseus); ch. 13 "The Hero Caught Between Nature and Culture" + "Folktale Motifs in Heroic Myths" (hero-pattern list); ch. 17 opening (Minos "has become a folktale figure").

## Gaps (no slides for these — content comes from Powell + review slides)
- **Oct 1 — Powell 11, Dionysus** (no deck). Covered by review slides 23–31, image captions 01–04, CRQ W6 Thu, Powell ch. 11.
- **Oct 8 — Powell 13, Gilgamesh** (no deck). Covered by review slides 44–55, image 07, CRQ W7 Thu, Powell ch. 13.
- Exam 1 also used the student's **own lecture notes**; none were provided for Exam 2 (yet).
- Canvas in-class quiz questions are only what appears on the slides (no separate Canvas export).
- Section readings (*Bacchae*, *Odyssey* 11, *Aeneid* 6, *Oedipus the King*, *Hippolytus*) are not in the zips — Powell has excerpts; the site uses Powell + slides.

## Lecture / reading schedule (from the weekly "What To Do" docs)
| Week | Tue lecture | Thu lecture | Section reading |
|---|---|---|---|
| 6 | Sept 29 — Powell 10 | Oct 1 — Powell 11 | in-class essay (115) |
| 7 | Oct 6 — Powell 12 | Oct 8 — Powell 13 | *Odyssey* 11, *Aeneid* 6 |
| 8 | Oct 13 — Powell 14 | Oct 15 — Powell 18 (out of order) | Sophocles, *Oedipus the King* |
| 9 | Oct 20 — Powell 16 (out of order) | Oct 22 — Powell 17 | Euripides, *Hippolytus* |
| 10 | Oct 27 — review | Oct 29 — optional extra review | Euripides, *Medea* (**not** on Exam 2) |

**Exam 2 window: Thu Oct 29 – Sun Nov 1, 2026 (CBTF).** Final exam: Dec 11, 8–11 am, Foellinger (not CBTF).

## Regenerating the extracts (if a file has to be rebuilt)
```bash
# text (python-pptx / python-docx), run with python3 -I from outside the extracted folder
python3 -I extract.py <extracted-zip-dir> <out-dir>     # writes <file>.txt per pptx/docx, incl. speaker notes
pdftotext -layout Powell_Classical_Myth_Ch10-14_and_16-18.pdf powell.txt
pdftotext -f 93 -l 106 Powell_….pdf ch13.txt            # one chapter (see page map)
# study-guide images, in document order = caption order 01…13
python3 -I docx_imgs.py "Second Exam Terms Images FA 2026.docx" out/   # iterate a:blip in body order
```
Image order check: guide images g01…g13 were viewed on a contact sheet and match captions 1–13 (Dionysus cup … Philomela/Procne/Itys).
