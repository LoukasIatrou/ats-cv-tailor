#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { MIN_FILL, findSlop, findShortLines } = require("../src/check");

const texPath = process.argv[2];
if (!texPath) {
  console.error("Usage: npm run check -- <path-to-cv.tex>");
  process.exit(1);
}
const absTex = path.resolve(texPath);
if (!fs.existsSync(absTex)) {
  console.error(`No such file: ${absTex}`);
  process.exit(1);
}

const src = fs.readFileSync(absTex, "utf8").split("\n");
const show = (n) => `line ${n}: ${(src[n - 1] || "").trim()}`;

const slop = findSlop(src.join("\n"));
slop.forEach((h) => console.log(`[slop/${h.category}] "${h.match}" - ${show(h.line)}`));

try {
  findShortLines(absTex, (err, short) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    // Only wrapped bullets: headings, title lines and one-line bullets are fine.
    const spill = short.filter((h) => h.wrapped && /^\s*\\item\b/.test(src[h.from - 1]));
    spill.forEach((h) =>
      console.log(`[spillage] last line under ${MIN_FILL * 100}% full - ${show(h.from)}`)
    );
    const total = slop.length + spill.length;
    console.log(total ? `\n${total} finding(s).` : "Clean.");
    process.exit(total ? 1 : 0);
  });
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
