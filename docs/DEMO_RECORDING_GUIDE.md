# Demo recording guide

A precise script for recording a 30–45s demo of the tailoring workflow + live preview.
Follow it exactly so the recording matches what's documented in the README — don't
improvise steps, since viewers will try the same commands afterward.

## Setup (before recording)

- Screen/window size: **1280×800**, no browser chrome extensions bar, no bookmarks bar.
- Terminal: 100×30 columns, font size large enough to read at 720p.
- Have two windows visible: terminal (left half) + browser at `http://localhost:5050`
  (right half), or switch between them with a clean cut.
- Use `examples/sample-cv.tex` and `examples/sample-job-description.txt` (both fictional
  — "Jane Doe" / "Acme Payments" / "Globex Inc") so no real personal data is ever on
  screen.
- Reset `examples/sample-cv.tex` to its committed state (`git checkout examples/sample-cv.tex`)
  right before recording, so the "before" state is the real repo default.

## Recording script (~35s)

1. **[0:00–0:05] Terminal**: run
   ```bash
   npm run preview -- examples/sample-cv.tex
   ```
   Let the "CV preview running at http://localhost:5050" line print.

2. **[0:05–0:10] Browser**: switch to `http://localhost:5050`. The status bar reads
   "Compiled OK" and the rendered CV is visible (single column, standard headers).

3. **[0:10–0:25] Editor** (VS Code or terminal `$EDITOR`, whichever you'll actually use):
   open `examples/sample-cv.tex` side-by-side with the browser. Edit one bullet, e.g.
   change:
   ```
   Reduced p99 API latency by 40\% through query optimization and caching.
   ```
   to:
   ```
   Reduced p99 API latency by 40\% through query optimization and Redis caching.
   ```
   Save the file.

4. **[0:25–0:30] Browser**: within ~1s the status bar flashes "Compiling…" then back to
   "Compiled OK", and the PDF iframe refreshes with the edited bullet visible. This is
   the core "live preview" claim — the cut should linger here so it's clearly the file
   save causing the refresh, not a manual browser reload.

5. **[0:30–0:35] (optional)** Show a broken save (delete a closing `}`) to demonstrate the
   red "Compile failed — see log below" overlay, then undo and show it recover. Skip this
   beat if you're targeting the 30s minimum instead of 45s.

6. End on the clean "Compiled OK" state with the final PDF on screen.

## What NOT to show

- Don't show the `tailor-cv` skill running inside a real Claude Code session unless you
  re-record with a fresh, fictional CV/JD pair each time — never reuse a real candidate's
  data for a public demo asset.
- Don't fabricate a faster-than-real recompile by speeding up the footage in a way that
  misrepresents actual latency; light dead-air trimming between beats 1→2 is fine.

## Converting to GIF/MP4

Record with any screen recorder (OS-native: macOS Screenshot.app, Windows Xbox Game Bar /
`Win+Alt+R`, Linux `wf-recorder`/`SimpleScreenRecorder`) to `.mp4`, then compress:

```bash
# MP4 -> optimized GIF (requires ffmpeg)
ffmpeg -i demo.mp4 -vf "fps=12,scale=960:-1:flags=lanczos" -c:v gif docs/assets/demo.gif

# or keep it as a compressed MP4 (smaller than GIF, embeds fine on GitHub via a linked file)
ffmpeg -i demo.mp4 -vcodec libx264 -crf 28 -preset veryslow docs/assets/demo.mp4
```

Target output size: under 8 MB so it renders inline on GitHub without a "view raw" click.

Drop the result at `docs/assets/demo.gif` (or `.mp4`) and reference it near the top of
the README, replacing the two static screenshots currently there
(`docs/assets/live-preview-compiled.jpg`, `docs/assets/live-preview-error.jpg`).
