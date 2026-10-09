const { test } = require("node:test");
const assert = require("node:assert/strict");

const { injectParfillskip, parseUnderfull, findSlop } = require("../src/check");

test("parseUnderfull extracts line ranges, dedupes, and marks wrapped tails", () => {
  const log = [
    "Underfull \\hbox (badness 2500) in paragraph at lines 20--21",
    "\\OT1/cmr/m/n/10.95 pha al-pha ",
    "Underfull \\hbox (badness 10000) in paragraph at lines 25--26",
    "[]\\OT1/cmr/m/n/10.95 Mentored two ju-nior ",
    "Underfull \\hbox (badness 2500) in paragraph at lines 20--21",
    "\\OT1/cmr/m/n/10.95 pha al-pha ",
    "Underfull \\hbox (badness 5000) has occurred while \\output is active",
  ].join("\n");
  assert.deepEqual(parseUnderfull(log), [
    { from: 20, to: 21, wrapped: true },
    { from: 25, to: 26, wrapped: false },
  ]);
});

test("injectParfillskip keeps the line count and only touches \\begin{document}", () => {
  const tex = "\\documentclass{article}\n\\begin{document}\nHello\n\\end{document}\n";
  const out = injectParfillskip(tex);
  assert.equal(out.split("\n").length, tex.split("\n").length);
  assert.match(out, /\\begin\{document\}\\parfillskip=0pt plus [\d.]+\\textwidth\\relax\\csname @flushglue/);
});

test("findSlop flags tells, skips the preamble, comments and en-dash date ranges", () => {
  const tex = [
    "\\newcommand{\\x}{robust}",
    "\\begin{document}",
    "% a robust comment",
    "\\item Spearheaded a rollout --- in order to ship.",
    "Jan 2022 -- Present",
    "\\end{document}",
  ].join("\n");
  const hits = findSlop(tex);
  assert.deepEqual(
    hits.map((h) => [h.line, h.category]),
    [
      [4, "vocabulary"],
      [4, "pattern"],
      [4, "punctuation"],
    ]
  );
});
