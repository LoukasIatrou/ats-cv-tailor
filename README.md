# ats-cv-tailor

Tailor a LaTeX CV to a job posting with a coding agent, against a fixed ATS ruleset, with a
live PDF preview. The agent edits wording, order and emphasis only. It never changes your
layout and never adds facts that aren't already in your CV.

![Live preview: compiled state](docs/assets/live-preview-compiled.jpg)

## What's in it

- **`tailor-cv` skill** ([`SKILL.md`](skills/tailor-cv/SKILL.md)): reads your `.tex` CV and the job
  description, then reorders and rewords existing content. Pasted CV and job text is treated
  as data, never as instructions.
- **ATS ruleset** ([`ATS_RULES.md`](skills/tailor-cv/ATS_RULES.md)): 20 rules covering structure,
  text extraction, dates, line fill and plain, non-AI-sounding wording.
- **Live preview** (`npm run preview`): recompiles on every save and shows the compiler log
  instead of a stale PDF when a save breaks.
- **Checker** (`npm run check`): flags wrapped bullets whose last line is under 75% full, plus
  AI-writing tells (buzzwords, filler phrases, em dashes).
- **Doctor** (`npm run doctor`): checks Node, LaTeX engine, files and port.

## Quick start

Needs Node 18+ and one LaTeX engine: [Tectonic](https://tectonic-typesetting.github.io/),
or `pdflatex`/`latexmk` from MiKTeX or TeX Live.

```bash
npm install
npm run doctor
npm run preview -- examples/sample-cv.tex   # http://localhost:5050
npm run check -- examples/sample-cv.tex
```

No LaTeX installed? Use Docker (local convenience only, not a hosting setup):

```bash
docker build -t ats-cv-tailor .
docker run --rm -p 5050:5050 -v "$(pwd)/examples:/cv" ats-cv-tailor /cv/sample-cv.tex
```

The image pre-warms Tectonic for the bundled examples only. A CV with other packages
fetches them on first compile, so mount a volume at `/opt/tectonic-cache` to keep them.

## Use the skill

```bash
cp -r skills/tailor-cv ~/.claude/skills/tailor-cv   # or <project>/.claude/skills/
```

Then in Claude Code: `Tailor my CV at ~/cv/my-cv.tex for this job posting: <paste or path>`.
See [`examples/example-prompt.md`](examples/example-prompt.md) and
[`examples/BEFORE_AFTER.md`](examples/BEFORE_AFTER.md). Other agents are untested; the skill is
plain markdown, so it may work.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5050` | Preview server port |
| `LATEX_ENGINE` | auto-detected | Force `tectonic`, `pdflatex` or `latexmk` |
| `TECTONIC_CACHE_DIR` | Tectonic default | Docker only: package cache location |

## Limits

- The truthfulness rules are instructions to the agent, not code. Read the diff before you
  send the CV anywhere.
- It only edits `.tex` CVs, and ATS behaviour varies by vendor, so the rules are conventions,
  not guarantees.
- The preview server has no authentication. Run it locally only (see [`SECURITY.md`](SECURITY.md)).
- The checker's line-fill test is TeX-based: it flags every line in `\raggedright`/`\centering`
  text, and a last line just under 75% can slip through.

## Layout

```
bin/        preview, doctor and check CLIs
src/        server.js (preview server), check.js (checker logic)
public/     preview UI
skills/tailor-cv/   SKILL.md and ATS_RULES.md
examples/   fictional sample CV, job description, before/after
test/       node:test suites
```

Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md). License: MIT.
