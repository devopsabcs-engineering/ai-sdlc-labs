---
title: Troubleshooting
description: Common problems with the AI-SDLC labs on Windows and PowerShell, with quick fixes for installation, agent runs, consoles and costs.
---

# Troubleshooting

Start here when something does not work. Lab 0 has the detailed installation fixes; this page collects the problems you can meet across all labs.

## Installation and sign-in

* **A tool is "not recognized" right after installing it.** Open a new terminal; the old window keeps the old `PATH`.
* **`copilot plugin list` does not show `ai-team-sdlc`.** Re-run the marketplace and install commands from [Lab 0](labs/lab-00-setup.md#step-4-add-the-marketplace-and-install-the-plugin), then check `copilot --version`.
* **npm fails with SSL or 401 errors.** The labs need `https://registry.npmjs.org/`. See [Lab 0 troubleshooting](labs/lab-00-setup.md#npm-or-the-corporate-registry-fails).

## Running the agents

* **The agent works in the wrong folder.** Its shell tool can ignore `cd`. Start `copilot` from the repository root.
* **`/product-run` does nothing in the CLI.** Those are VS Code prompts. Use `Use the ait-sdlc-orchestrate skill ...` instead.
* **A task says `blocked`.** Read the reason before acting. Often a gate threshold in your brief already decides what to do, or a human waiver is needed.
* **A run is too slow or too costly.** Stop it with `Ctrl+C`, keep the scope small and resume later from `state.json`.
* **A helper agent says it cannot read files.** Sub-agents sometimes lack read tools. The orchestrator should do the work itself; ask it to continue.

## Consoles and files

* **Garbled characters such as `ΓÇö`.** Set UTF-8 in the session, see [Lab 0, step 1](labs/lab-00-setup.md#step-1-use-a-utf-8-console).
* **Huge log folders.** Git-ignore run logs and browser profiles before the first run.
* **`EPERM` warnings during `npm install`.** A file is locked by antivirus or another process. Do not run two installs at once, and keep the repository outside synced folders.

## Still stuck?

Open an issue in the [ai-sdlc-labs repository](https://github.com/devopsabcs-engineering/ai-sdlc-labs/issues) with the lab and step, your Copilot CLI version and the exact error text.
