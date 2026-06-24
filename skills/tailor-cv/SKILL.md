---
name: tailor-cv
description: Tailors a user's LaTeX CV to a specific job description while enforcing a fixed ATS-parsability ruleset (single-column, plain-text-extractable, standard section headers, consistent formatting, truthful keyword alignment). Use when the user asks to tailor, customize, or optimize their CV/resume/LaTeX CV for a job posting or role.
---

# Tailor CV

Tailor a user's existing LaTeX CV for a specific job, enforcing the fixed rules in
`ATS_RULES.md` (same directory as this file). Read that file in full before editing —
it is the rule source; do not improvise additional rules or skip any of its items.

## Inputs needed

1. The user's `.tex` CV file (path).
2. The target job description (pasted text, or a path to a file/URL the user gives you).

If either is missing, ask for it before editing anything.

## Process

1. **Read** the `.tex` file and the job description in full.
2. **Read `ATS_RULES.md`** in this directory.
3. **Audit first.** Check the existing document against the structural rules (1–11). If
   it already violates one (e.g. uses a table or multi-column layout), tell the user and
   ask whether to fix it or leave the layout alone — don't restructure silently.
4. **Extract the job's key requirements**: required skills/tools, seniority signals, and
   terminology/phrasing it uses.
5. **Edit the `.tex` content in place** using the Edit tool — change only content
   (bullet wording, ordering, emphasis, included/excluded items), never the preamble,
   packages, custom commands, or visual structure, unless the user asked for a structural
   fix in step 3. Apply rules 12–14: mirror the job's real terminology truthfully, reorder
   for relevance, trim rather than delete wholesale.
6. **Re-check against the full ruleset** after editing, including page count (rule 5) and
   date-format consistency (rule 9).
7. **Summarize the diff** for the user: what was reordered, reworded, trimmed, and which
   keywords were aligned — so they can sanity-check truthfulness before sending it anywhere.
8. Point the user at the live preview tool (`npm run preview -- <path-to-cv.tex>` from the
   repo root) to see the compiled PDF as you iterate.

## Constraints

- Never invent experience, skills, or accomplishments not already in the source CV.
- Never touch LaTeX structure/layout without explicit confirmation (see step 3).
- Keep edits scoped to what the job description actually warrants — don't rewrite
  sections that are already a good match.
