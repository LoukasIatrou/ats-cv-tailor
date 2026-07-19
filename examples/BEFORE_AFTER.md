# Before / after: tailoring `sample-cv.tex` for `sample-job-description.txt`

Illustrative example using fictional names and a fictional job posting
(`sample-job-description.txt`) — not a real candidate or a real employer. It shows the
kind of edit `skills/tailor-cv` is allowed to make: reordering, rewording, and re-weighting
existing, truthful content. Nothing below adds a skill, tool, metric, or accomplishment
that wasn't already in the original CV.

## Summary

| Before | After |
|---|---|
| Backend engineer with 6 years of experience building reliable distributed systems in Python and Go, focused on payments infrastructure. | Backend engineer with 6 years of experience designing and operating distributed systems in Go, with hands-on on-call and incident-response experience in payments infrastructure. |

**Why:** the job posting is specifically about production ownership and incident
response. The original CV already states "led the team's on-call rotation" later in the
Experience section — the summary now surfaces that existing fact up front instead of
introducing a new one. Python is de-emphasized in the summary (not removed — it's still
listed in Skills and in the Globex bullet).

## Experience bullet order (Acme Payments)

| Before | After |
|---|---|
| 1. Designed and shipped a reconciliation service processing 2M transactions/day in Go.<br>2. Reduced p99 API latency by 40% through query optimization and caching.<br>3. Mentored two junior engineers and led the team's on-call rotation. | 1. Designed and shipped a reconciliation service processing 2M transactions/day in Go.<br>2. Mentored two junior engineers and led the team's on-call rotation.<br>3. Reduced p99 API latency by 40% through query optimization and caching. |

**Why:** same three bullets, reordered so the on-call/mentoring bullet — the strongest
match for "lead incident response" and "mentor other engineers" in the posting — appears
second instead of last. No wording changed.

## Skills line

| Before | After |
|---|---|
| Python, Go, PostgreSQL, Kafka, Docker, Kubernetes, AWS, REST APIs, CI/CD | Go, Kubernetes, Docker, AWS, PostgreSQL, Kafka, REST APIs, CI/CD, Python |

**Why:** the posting names Go, Kubernetes, Docker, and AWS explicitly as requirements —
those move to the front. Same nine skills, same exact terminology, just reordered.

## Exact job-description keywords now surfaced earlier

`Go`, `Kubernetes`, `Docker`, `AWS`, `on-call`, `incident-response`, `p99` — all present
in the original CV already (either verbatim or as an equivalent fact); the edit only
changes where they appear, not what's claimed.

## What stayed exactly the same

- Every metric (`2M transactions/day`, `40%`, `500+ enterprise customers`, `two junior
  engineers`) — unchanged, not exaggerated.
- Both job titles, both companies, both date ranges.
- Education entry, contact info.
- The open-source Projects bullet — one word added ("infrastructure tooling") that
  restates what a "Go HTTP framework" already is, to match the posting's "open-source
  infrastructure or tooling" phrase without inventing a new project.

See the full files: [`sample-cv.tex`](sample-cv.tex) (before) and
[`sample-cv-tailored.tex`](sample-cv-tailored.tex) (after).
