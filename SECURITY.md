# Security

## Reporting a vulnerability

Email loucasiatrou11@gmail.com with a description and reproduction steps. Please don't
open a public issue for security reports.

## Known scope and limitations

This is a local developer tool, not a hosted service, and its security model reflects
that:

- **The preview server has no authentication.** `npm run preview` binds an HTTP server
  (default `localhost:5050`) that serves the compiled PDF and raw compiler log to anyone
  who can reach the port, with no auth of any kind. It's intended for local use only —
  don't port-forward it, bind it to `0.0.0.0`, or expose it on a shared/untrusted network.
- **Only compile `.tex` files you trust.** The preview server invokes a real LaTeX engine
  (Tectonic, pdflatex, or latexmk) as a child process against whatever path you give it.
  LaTeX compilation of untrusted input carries the same general risk as running any
  document-processing tool on a file you didn't author — don't point this at a `.tex` file
  from an untrusted source. This tool does not sandbox the LaTeX engine.
- **The `tailor-cv` Claude Code skill treats job-description and CV text as data, not
  instructions** — it's designed to ignore embedded directives (e.g. a job description
  containing "ignore previous instructions"). This is a prompt-level mitigation enforced
  by the skill's instructions, not a hard technical control.
- **The Docker image's `no-auth` caveat above applies the same way** if you publish its
  port — it's still the same unauthenticated server, just containerized.
- **The `Dockerfile` downloads a pinned Tectonic release from GitHub over HTTPS at build
  time but does not verify a checksum/signature against it.** It trusts TLS + GitHub's
  release hosting. If you need stronger supply-chain guarantees, verify the tarball
  against a published checksum yourself before building.

## Supported versions

This project does not yet have tagged releases; security fixes land on `master`.
