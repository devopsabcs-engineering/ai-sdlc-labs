# Screenshot scripts

Playwright scripts that regenerate the lab screenshots in `docs/assets/img/`.

```powershell
npm install --no-save playwright-core
npx playwright-core install chromium
node scripts/screenshots/capture-labs.mjs     # live Pinch app (EN/FR) and GitHub evidence pages
node scripts/screenshots/render-terminal.mjs  # Lab 0 terminal images from recorded command output
```

`capture-labs.mjs` loads the published Pinch site and the pages of `devopsabcs-engineering/ai-sdlc-labs-pinch` at 1280x860, so re-run it after that repository changes. `render-terminal.mjs` renders fixed text, so edit the text in the script if the commands change.
