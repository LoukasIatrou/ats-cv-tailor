# ats-cv-tailor

Tailor a LaTeX CV to a specific job role, with a fixed ATS-parsability ruleset and a
live LaTeX → PDF preview while you (or Claude Code) edit.

Two pieces:

1. **`skills/tailor-cv/`** — a Claude Code skill that tailors your `.tex` CV's content
   to a job description, enforcing the rules in [`skills/tailor-cv/ATS_RULES.md`](skills/tailor-cv/ATS_RULES.md)
   (single-column, no tables/images for content, standard section headers, consistent
   dates, truthful keyword alignment, etc.).
2. **Live preview server** (`src/server.js` + `bin/preview.js`) — watches your `.tex`
   file, recompiles it on every save, and serves a browser page with an auto-refreshing
   PDF and a compile-error overlay.

## Setup

Requires Node.js 18+ and a LaTeX engine. The preview server auto-detects one on startup —
[Tectonic](https://tectonic-typesetting.github.io/), `pdflatex`, or `latexmk`, in that order —
so if you already have any of them installed (e.g. via TeX Live or MiKTeX), you're set:

```bash
npm install
```

If none are found, install Tectonic (self-contained, no separate TeX distribution needed):

```bash
# install tectonic, e.g.:
#   winget install tectonic-typesetting.tectonic   (Windows)
#   brew install tectonic                           (macOS)
#   cargo install tectonic                          (any platform with Rust)
```

To force a specific engine regardless of what's detected, set `LATEX_ENGINE=pdflatex`
(or `tectonic`/`latexmk`) as an environment variable before running the preview server.

## Live preview

```bash
npm run preview -- path/to/your-cv.tex
```

Then open `http://localhost:5050`. Edit the `.tex` file in your own editor — the page
recompiles and refreshes automatically on save. Compile errors show as an overlay
instead of a blank/stale PDF.

Override the port with `PORT=5151 npm run preview -- path/to/your-cv.tex`.

## Tailoring a CV with Claude Code

Install the skill into Claude Code, either globally or per-project:

```bash
# global
cp -r skills/tailor-cv ~/.claude/skills/tailor-cv

# or per-project
cp -r skills/tailor-cv <your-project>/.claude/skills/tailor-cv
```

Then, in Claude Code, point it at your CV and the job description, e.g.:

> Tailor my CV at `~/cv/my-cv.tex` for this job posting: <paste or path>

The skill reads `ATS_RULES.md`, audits your existing document for structural ATS
issues, edits the content (not the layout) to align with the role, and tells you what
it changed so you can verify truthfulness before sending it anywhere. Run the live
preview alongside it to watch the PDF update as edits land.

## Example

[`examples/sample-cv.tex`](examples/sample-cv.tex) is a minimal ATS-compliant template
you can use to try the preview server end-to-end:

```bash
npm run preview -- examples/sample-cv.tex
```

## License

MIT — see [LICENSE](LICENSE).
