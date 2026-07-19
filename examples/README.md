# Examples

Everything in this directory uses a fictional candidate ("Jane Doe"), fictional employers
("Acme Payments", "Globex Inc"), and a fictional job posting ("Northwind Cloud"). None of
it is real.

| File | What it is |
|---|---|
| [`sample-cv.tex`](sample-cv.tex) | A minimal, ATS-compliant LaTeX CV. Also the file used in the Quick Start (`npm run preview -- examples/sample-cv.tex`). |
| [`sample-job-description.txt`](sample-job-description.txt) | A fictional job posting used to demonstrate tailoring. |
| [`sample-cv-tailored.tex`](sample-cv-tailored.tex) | `sample-cv.tex` after being tailored for that posting — content-only edits, same structure. |
| [`BEFORE_AFTER.md`](BEFORE_AFTER.md) | Side-by-side diff of what changed and why, mapped to the rules in `ATS_RULES.md`. |
| [`example-prompt.md`](example-prompt.md) | The actual prompt used to drive the `tailor-cv` skill for this example. |

Try it yourself:

```bash
npm run preview -- examples/sample-cv.tex          # see the "before" state
npm run preview -- examples/sample-cv-tailored.tex  # see the "after" state
```
