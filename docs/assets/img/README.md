# Screenshot slots

This folder holds the lab screenshots. All screenshots are real captures from the recorded Pinch run (live app, GitHub pages, rendered terminal output).

## Naming

* `docs/assets/img/lab-NN/NN-NN-<kebab-name>.png` for language-neutral captures (terminal output, GitHub UI).
* `docs/assets/img/lab-NN/NN-NN-<kebab-name>.fr.png` for captures that show a localized UI (the Pinch app in French).
* The first `NN` is the lab number, the second is the order inside the lab.

## Alt text

Every image has non-empty alt text in the English page **and** the French page. `scripts/check_images.py` enforces it.

## Current slots

| Lab | Files | Source |
|-----|-------|--------|
| 0 | `lab-00/00-01..00-03` | Rendered terminal output (real command results, other local plugins omitted) |
| 1 to 3, 5 to 8 | `lab-NN/NN-NN-*.png` | GitHub pages of the reference repository `ai-sdlc-labs-pinch` |
| 4 | `lab-04/04-01..04-05` (+ `.fr.png`), `04-06-mobile-dark.fr.png`, `04-07-commits.png` | The live Pinch app in English and French, and the GitHub commit list |

Regenerate: the capture scripts are Playwright scripts that load the live site and the GitHub pages at 1280x860 (light theme); re-run them after the reference repository changes.
