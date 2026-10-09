const path = require("path");
const fs = require("fs");
const os = require("os");
const { detectEngine, compile } = require("./server");

// Minimum fraction of the line width the last line of a paragraph must fill.
const MIN_FILL = 0.75;

// Vocabulary / sentence-pattern / punctuation tells, adapted from SlopMonster's categories.
// ponytail: flat regex list, no scoring or word-form stemming; add entries as new tells show up.
const SLOP = [
  [
    "vocabulary",
    /\b(spearhead\w*|leverag(?:e|ed|es|ing)|utili[sz](?:e|ed|es|ing)|synerg\w+|results-driven|detail-oriented|passionate|dynamic|robust|seamless(?:ly)?|cutting-edge|innovative|proven track record|team player|fast-paced|world-class|best-in-class|holistic|delve\w*|empower(?:ed|ing)?|transformative|thought leader)\b/gi,
  ],
  ["pattern", /\bnot (?:just|only)\b[^.]*?,? but\b|\bin order to\b|\bresponsible for\b/gi],
  ["punctuation", /---|—/g],
];

// Append a finite-stretch \parfillskip on the \begin{document} line (keeps line numbers).
// With it, TeX warns "Underfull \hbox" when a paragraph's last line is under MIN_FILL full.
// \@flushglue is set too: list items reset \parfillskip to it.
// ponytail: \raggedright/\centering also use \@flushglue, so they flag every line; use a LuaTeX filter if that matters.
function injectParfillskip(tex) {
  const skip = `0pt plus ${((1 - MIN_FILL) / Math.cbrt(10)).toFixed(4)}\\textwidth\\relax`;
  return tex.replace(
    /\\begin\{document\}/,
    (m) => `${m}\\parfillskip=${skip}\\csname @flushglue\\endcsname=${skip}`
  );
}

// A paragraph's first line starts with the "[]" indent/label box in TeX's dump of the short
// line, so a dump without it is the tail of a wrapped paragraph.
function parseUnderfull(log) {
  const re = /Underfull \\hbox \(badness \d+\) in paragraph at lines (\d+)--(\d+)\r?\n(.*)/g;
  const hits = new Map();
  for (const m of log.matchAll(re)) {
    hits.set(`${m[1]}-${m[2]}`, { from: +m[1], to: +m[2], wrapped: !m[3].startsWith("[]") });
  }
  return [...hits.values()];
}

function findSlop(tex) {
  const lines = tex.split("\n");
  const start = lines.findIndex((l) => l.includes("\\begin{document}"));
  const hits = [];
  lines.forEach((text, i) => {
    if (i <= start || text.trimStart().startsWith("%")) return;
    for (const [category, re] of SLOP) {
      for (const m of text.matchAll(re)) hits.push({ line: i + 1, category, match: m[0] });
    }
  });
  return hits;
}

// Compiles a scratch copy of the CV next to the original (so relative \input/.cls resolve).
function findShortLines(absTex, onDone) {
  const dir = path.dirname(absTex);
  const tmpTex = path.join(dir, `linecheck-${path.basename(absTex, ".tex")}.tex`);
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "cv-linecheck-"));
  const cleanup = () => {
    fs.rmSync(tmpTex, { force: true });
    fs.rmSync(outDir, { recursive: true, force: true });
  };
  fs.writeFileSync(tmpTex, injectParfillskip(fs.readFileSync(absTex, "utf8")));
  compile(detectEngine(), tmpTex, outDir, (result) => {
    cleanup();
    if (!result.ok) return onDone(new Error(`Compile failed:\n${result.log.slice(-1500)}`));
    onDone(null, parseUnderfull(result.log));
  });
}

module.exports = { MIN_FILL, injectParfillskip, parseUnderfull, findSlop, findShortLines };
