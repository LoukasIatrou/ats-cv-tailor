# Contributing

This is a small project: a Node live-preview server plus a Claude Code skill. Keep
changes proportional to that.

## Dev setup

```bash
git clone https://github.com/<your-fork>/ats-cv-tailor.git
cd ats-cv-tailor
npm install
npm run doctor   # confirms Node version, LaTeX engine, required files, and port 5050 are all OK
```

## Before opening a PR

```bash
npm run lint
npm test
npm run preview -- examples/sample-cv.tex   # manually confirm the server still works
```

All three must pass. `npm test` will skip the real-compile test if no LaTeX engine
(tectonic/pdflatex/latexmk) is installed locally — that's expected and not a failure.

If you touched `Dockerfile`/`.dockerignore`, also run `docker build -t ats-cv-tailor .`
locally — CI builds it too, but it's slow to iterate on there.

## Where things live

- `src/server.js`, `bin/preview.js`, `bin/doctor.js` — the live preview server and CLI
  entry points.
- `skills/tailor-cv/SKILL.md` — the Claude Code skill's process/constraints.
- `skills/tailor-cv/ATS_RULES.md` — the fixed ATS ruleset the skill enforces. This is the
  rule *source of truth*; if you change it, also update the rule-number cross-references
  inside `SKILL.md` (e.g. "rules 15–17").
- `examples/` — fictional sample CV/job-description pair used in docs and manual testing.
  Never replace these with real candidate data.
- `test/` — `node:test` suite for `src/server.js`. No test framework dependency is added;
  keep using the built-in runner.
- `Dockerfile` / `.dockerignore` — optional local-install shortcut (bundles Tectonic), not
  a hosting/deployment config. See the README's "Deployment" section before changing it.

## Scope guidelines

- Don't add a build step, bundler, or frontend framework for `public/index.html` — it's
  intentionally a single static file.
- Don't add new runtime dependencies without a clear reason; this project has exactly two
  (`express`, `chokidar`) on purpose.
- If you're changing `ATS_RULES.md`, back claims about ATS/parser behavior with something
  verifiable, and avoid absolute claims ("guarantees," "beats every ATS") — see the
  "Truthfulness and safety constraints" section of the README for the tone to match.

## Reporting bugs / requesting features

Use the issue templates. For security issues, see [SECURITY.md](SECURITY.md) instead of
opening a public issue.
