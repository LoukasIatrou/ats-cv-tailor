const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");

const {
  startServer,
  detectEngine,
  compile,
  isAvailable,
  CANDIDATE_ENGINES,
} = require("../src/server");

test("isAvailable returns true for a binary that is really on PATH", () => {
  assert.equal(isAvailable("node"), true);
});

test("isAvailable returns false for a binary that does not exist", () => {
  assert.equal(isAvailable("definitely-not-a-real-binary-xyz"), false);
});

test("detectEngine honors LATEX_ENGINE override without checking availability", () => {
  const prev = process.env.LATEX_ENGINE;
  process.env.LATEX_ENGINE = "some-forced-engine";
  try {
    assert.equal(detectEngine(), "some-forced-engine");
  } finally {
    if (prev === undefined) delete process.env.LATEX_ENGINE;
    else process.env.LATEX_ENGINE = prev;
  }
});

test("detectEngine either finds a real candidate engine or throws a helpful error", () => {
  const prev = process.env.LATEX_ENGINE;
  delete process.env.LATEX_ENGINE;
  try {
    let result;
    try {
      result = detectEngine();
    } catch (err) {
      assert.match(err.message, /No LaTeX engine found/);
      CANDIDATE_ENGINES.forEach((engine) => assert.match(err.message, new RegExp(engine)));
      return;
    }
    assert.ok(CANDIDATE_ENGINES.includes(result));
  } finally {
    if (prev === undefined) delete process.env.LATEX_ENGINE;
    else process.env.LATEX_ENGINE = prev;
  }
});

test("compile() reports a clear error when the engine binary is missing", (t, done) => {
  compile("definitely-not-a-real-binary-xyz", "unused.tex", os.tmpdir(), (result) => {
    assert.equal(result.ok, false);
    assert.match(result.log, /Could not run "definitely-not-a-real-binary-xyz"/);
    done();
  });
});

test("compile() successfully produces a PDF when a real LaTeX engine is available", (t, done) => {
  const engine = CANDIDATE_ENGINES.find(isAvailable);
  if (!engine) {
    t.skip("no LaTeX engine (tectonic/pdflatex/latexmk) available in this environment");
    return done();
  }
  const texPath = path.join(__dirname, "..", "examples", "sample-cv.tex");
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ats-cv-tailor-test-"));
  compile(engine, texPath, outDir, (result) => {
    assert.equal(result.ok, true, result.log);
    assert.ok(fs.existsSync(path.join(outDir, "sample-cv.pdf")));
    done();
  });
});

test("startServer throws immediately when the .tex file does not exist", () => {
  assert.throws(
    () => startServer(path.join(os.tmpdir(), "does-not-exist-xyz.tex"), 0),
    /No such file/
  );
});

test("preview server serves 404 for the PDF before the first compile finishes, and a valid SSE stream", async () => {
  const prev = process.env.LATEX_ENGINE;
  // Force a non-existent engine so this test never depends on LaTeX being installed —
  // it only exercises the HTTP routes, not real compilation.
  process.env.LATEX_ENGINE = "definitely-not-a-real-binary-xyz";

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ats-cv-tailor-test-"));
  const texPath = path.join(dir, "cv.tex");
  fs.writeFileSync(texPath, "\\documentclass{article}\\begin{document}x\\end{document}");

  let server;
  try {
    server = startServer(texPath, 0);
    const port = server.address().port;

    const pdfRes = await fetch(`http://127.0.0.1:${port}/preview.pdf`);
    assert.equal(pdfRes.status, 404);
    await pdfRes.text();

    const eventsRes = await fetch(`http://127.0.0.1:${port}/events`);
    assert.match(eventsRes.headers.get("content-type") || "", /text\/event-stream/);
    await eventsRes.body.cancel();
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    if (prev === undefined) delete process.env.LATEX_ENGINE;
    else process.env.LATEX_ENGINE = prev;
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
