# Screenshot slots

This folder holds the lab screenshots. The screenshot pipeline (Phase 4) fills it; until then each lab references a placeholder.

## Naming

* `docs/assets/img/lab-NN/NN-NN-<kebab-name>.png` for language-neutral captures (terminal output, GitHub UI).
* `docs/assets/img/lab-NN/NN-NN-<kebab-name>.fr.png` for captures that show a localized UI (the Pinch app in French).
* Placeholders use `.svg` and are replaced by the real `.png` capture, then the page reference is updated.
* The first `NN` is the lab number, the second is the order inside the lab.

## Alt text

Every image has non-empty alt text in the English page **and** the French page. `scripts/check_images.py` enforces it.

## Current slots

| Lab | File | Shows |
|-----|------|-------|
| 0 | `lab-00/00-01-tool-versions.svg` | Tool versions check in PowerShell (placeholder) |
| 0 | `lab-00/00-02-plugin-list.svg` | `copilot plugin list` output (placeholder) |
| 0 | `lab-00/00-03-ait-init.svg` | `ait-init` run in the practice repository (placeholder) |
