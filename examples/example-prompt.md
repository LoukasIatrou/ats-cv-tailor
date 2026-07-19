# Example prompt

With the `tailor-cv` skill installed (see main [README](../README.md#tailoring-a-cv-with-claude-code)),
this is the kind of prompt that drives the example in [`BEFORE_AFTER.md`](BEFORE_AFTER.md):

> Tailor my CV at `examples/sample-cv.tex` for this job posting:
>
> [paste the contents of `sample-job-description.txt`, or point at the file/URL]

What happens next (see [`skills/tailor-cv/SKILL.md`](../skills/tailor-cv/SKILL.md) for the
full process):

1. The agent reads the CV and job description in full, then reads `ATS_RULES.md`.
2. It audits the existing `.tex` structure against the ATS rules and flags anything already
   broken (it won't fix layout silently).
3. It extracts the posting's real requirements and terminology.
4. It edits bullet wording, ordering, and emphasis in place — never the preamble, packages,
   or visual structure.
5. It re-checks the result against the full ruleset (page count, date formatting, etc.).
6. It summarizes exactly what changed so you can verify truthfulness before sending the CV
   anywhere.

Run the live preview alongside it to watch the PDF update as edits land:

```bash
npm run preview -- examples/sample-cv.tex
```
