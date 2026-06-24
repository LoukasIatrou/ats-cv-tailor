# ATS & AI-Parsability Rules

Fixed ruleset for LaTeX CVs. The `tailor-cv` skill must enforce these on every edit —
treat them as hard constraints, not suggestions. If the user's existing `.tex` already
violates a rule, flag it and ask before "fixing" layout (layout changes are out of scope
for tailoring — see Scope below).

## Structure

1. **Single column.** No `multicol`, `paracol`, `tabularx`-as-layout, or two-column
   `\documentclass` options. ATS parsers read left-to-right, top-to-bottom; multi-column
   layouts interleave text in the wrong order when extracted.
2. **No tables, text boxes, or graphics for content.** Anything conveying information
   (skills, dates, contact info) must be real text in the normal text flow — not inside a
   `tabular`, `tikzpicture`, `minipage` used as a layout box, or an image.
3. **Standard section headers only.** Use conventional names: `Experience`,
   `Education`, `Skills`, `Projects`, `Certifications`, `Summary`. Don't rename to
   creative headers ("My Journey", "Toolbox") — parsers and recruiters pattern-match on
   the standard terms.
4. **Section order:** Contact → Summary (optional) → Experience → Education → Skills →
   Projects/Certifications (order the last two by relevance to the target role).
5. **One page** for ≤10 years experience, **two pages max** otherwise. Never let tailoring
   edits push the document past its current page count without flagging it.

## Text & encoding

6. **No non-standard glyphs.** Use plain hyphens (`-`) or standard `\item` bullets, not
   decorative unicode bullets, icons (✓, ★), or symbol fonts (FontAwesome glyphs as
   content rather than decoration).
7. **Text must stay selectable/extractable.** Never rasterize text into an image. Don't
   use `\textcolor` or shading on text that conveys meaning — color is not a substitute
   for structure.
8. **Standard fonts only.** Latin Modern, Computer Modern, or other common LaTeX text
   fonts. Avoid exotic/symbol fonts that re-encode glyphs, since text extraction can
   garble them.
9. **Consistent date format** throughout, e.g. `Jan 2023 – Present`. Don't mix
   `01/2023`, `2023-01`, and `January 2023` in the same document.
10. **Contact info as real text**, never embedded only in a header/footer image or a
    `tikzpicture`. If a header/footer is used for contact info, also restate it in the
    body's first lines as plain text, since some parsers strip headers/footers entirely.
11. **Spell out key terms on first use**, then use the abbreviation: e.g.
    `Continuous Integration/Continuous Deployment (CI/CD)`. Keep matching the job
    description's exact terminology afterward.

## Tailoring content (keyword alignment)

12. **Mirror the job description's exact terminology** for skills/tools/methodologies
    where it is truthfully applicable to the candidate's experience — don't invent
    experience that isn't there.
13. **Reorder and re-weight existing bullets/sections** to surface what's most relevant
    to the target role first; don't fabricate new accomplishments.
14. **Trim, don't delete wholesale.** Prefer shortening less-relevant bullets over
    removing whole roles, unless the user explicitly asks to cut something.

## Scope boundary

15. The skill edits **content within the existing LaTeX structure only** — preserve the
    user's preamble, packages, custom commands, and overall visual design. If the
    existing template already violates a structural rule (multi-column, tables, etc.),
    surface it as a warning rather than silently restructuring the document.
