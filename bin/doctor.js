#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const net = require("net");
const { CANDIDATE_ENGINES, isAvailable } = require("../src/server");

const ROOT = path.join(__dirname, "..");

const REQUIRED_PATHS = [
  "package.json",
  "bin/preview.js",
  "src/server.js",
  "public/index.html",
  "examples/sample-cv.tex",
  "skills/tailor-cv/SKILL.md",
  "skills/tailor-cv/ATS_RULES.md",
];

function checkPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "127.0.0.1");
  });
}

async function main() {
  let failed = false;
  const ok = (msg) => console.log(`  ✓ ${msg}`);
  const fail = (msg) => {
    console.log(`  ✗ ${msg}`);
    failed = true;
  };
  const warn = (msg) => console.log(`  ! ${msg}`);

  console.log("ats-cv-tailor doctor\n");

  console.log("Runtime");
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  if (nodeMajor >= 18) ok(`Node.js ${process.version} (>=18 required)`);
  else fail(`Node.js ${process.version} — this project requires Node 18+`);

  console.log("\nProject files");
  for (const rel of REQUIRED_PATHS) {
    if (fs.existsSync(path.join(ROOT, rel))) ok(rel);
    else fail(`${rel} — missing`);
  }

  console.log("\nLaTeX engine");
  const forced = process.env.LATEX_ENGINE;
  if (forced) {
    if (isAvailable(forced)) ok(`${forced} (forced via LATEX_ENGINE)`);
    else fail(`${forced} (forced via LATEX_ENGINE) — not found on PATH`);
  } else {
    const found = CANDIDATE_ENGINES.filter(isAvailable);
    if (found.length) {
      found.forEach((engine) => ok(`${engine} found on PATH`));
    } else {
      fail(
        `none of ${CANDIDATE_ENGINES.join(", ")} found on PATH — install Tectonic ` +
          `(https://tectonic-typesetting.github.io/) or a TeX distribution (MiKTeX/TeX Live)`
      );
    }
  }

  console.log("\nPort");
  const port = Number(process.env.PORT) || 5050;
  if (await checkPortFree(port)) ok(`port ${port} is free`);
  else warn(`port ${port} is already in use — set PORT=<other> when running npm run preview`);

  console.log("");
  if (failed) {
    console.log("Doctor found problems that will prevent the preview server from working.");
    process.exitCode = 1;
  } else {
    console.log("All checks passed.");
  }
}

main();
