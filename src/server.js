const path = require("path");
const fs = require("fs");
const { spawn, spawnSync } = require("child_process");
const express = require("express");
const chokidar = require("chokidar");

const CANDIDATE_ENGINES = ["tectonic", "pdflatex", "latexmk"];

function isAvailable(engine) {
  const result = spawnSync(engine, ["--version"], { stdio: "ignore" });
  return !result.error;
}

function detectEngine() {
  if (process.env.LATEX_ENGINE) return process.env.LATEX_ENGINE;
  const found = CANDIDATE_ENGINES.find(isAvailable);
  if (!found) {
    throw new Error(
      `No LaTeX engine found (checked: ${CANDIDATE_ENGINES.join(", ")}). ` +
        `Install Tectonic (https://tectonic-typesetting.github.io/) or a TeX ` +
        `distribution (MiKTeX/TeX Live), or set LATEX_ENGINE to point at one.`
    );
  }
  return found;
}

function compile(engine, texPath, outDir, onDone) {
  const args =
    engine === "tectonic"
      ? [texPath, "--outdir", outDir, "--keep-logs"]
      : [texPath, `-output-directory=${outDir}`, "-interaction=nonstopmode", "-halt-on-error"];

  const proc = spawn(engine, args, { cwd: path.dirname(texPath) });
  let log = "";
  let done = false;
  const finish = (result) => {
    if (done) return;
    done = true;
    onDone(result);
  };
  proc.stdout.on("data", (d) => (log += d));
  proc.stderr.on("data", (d) => (log += d));
  proc.on("error", (err) => {
    finish({ ok: false, log: `Could not run "${engine}": ${err.message}` });
  });
  proc.on("close", (code) => {
    finish({ ok: code === 0, log });
  });
}

function startServer(texPath, port) {
  const absTex = path.resolve(texPath);
  if (!fs.existsSync(absTex)) {
    throw new Error(`No such file: ${absTex}`);
  }

  const ENGINE = detectEngine();

  const outDir = path.join(path.dirname(absTex), ".build");
  fs.mkdirSync(outDir, { recursive: true });

  const base = path.basename(absTex, ".tex");
  const pdfPath = path.join(outDir, `${base}.pdf`);

  const app = express();
  app.use(express.static(path.join(__dirname, "..", "public")));

  const clients = new Set();
  let lastStatus = { ok: null, log: "", version: 0 };

  function broadcast() {
    const payload = `data: ${JSON.stringify(lastStatus)}\n\n`;
    for (const res of clients) res.write(payload);
  }

  function runCompile() {
    compile(ENGINE, absTex, outDir, (result) => {
      lastStatus = { ...result, version: lastStatus.version + 1 };
      broadcast();
    });
  }

  app.get("/events", (req, res) => {
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.flushHeaders();
    clients.add(res);
    res.write(`data: ${JSON.stringify(lastStatus)}\n\n`);
    req.on("close", () => clients.delete(res));
  });

  app.get("/preview.pdf", (req, res) => {
    if (!fs.existsSync(pdfPath)) {
      res.status(404).send("Not compiled yet");
      return;
    }
    res.set("Cache-Control", "no-store");
    res.sendFile(pdfPath);
  });

  const watchDir = path.dirname(absTex);
  chokidar
    .watch(watchDir, {
      depth: 1,
      ignored: /\.build|node_modules|\.git/,
      awaitWriteFinish: { stabilityThreshold: 200 },
    })
    .on("change", (changed) => {
      if (/\.(tex|bib|cls|sty)$/.test(changed)) runCompile();
    });

  runCompile();

  const server = app.listen(port, () => {
    console.log(`CV preview running at http://localhost:${port}`);
    console.log(`Watching: ${absTex}`);
    console.log(`Engine: ${ENGINE} (set LATEX_ENGINE=pdflatex to switch)`);
  });

  return server;
}

module.exports = { startServer };
