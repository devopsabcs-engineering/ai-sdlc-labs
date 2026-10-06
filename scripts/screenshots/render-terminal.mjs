import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const out = fileURLToPath(new URL("../../docs/assets/img/lab-00", import.meta.url));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const shots = {
  "00-01-tool-versions": [
    ["cmd", "node --version; git --version; gh --version | Select-Object -First 1; copilot --version | Select-Object -First 1"],
    ["out", "v26.7.0"],
    ["out", "git version 2.55.0.windows.5"],
    ["out", "gh version 2.102.0 (2026-09-30)"],
    ["out", "GitHub Copilot CLI 1.0.92."],
  ],
  "00-02-plugin-list": [
    ["cmd", "copilot plugin list"],
    ["out", "Installed plugins:"],
    ["out", "  • ai-team-sdlc@ai-team-sdlc (v1.0.2)"],
    ["dim", "  (other plugins on this machine are not shown)"],
  ],
  "00-03-ait-init": [
    ["cmd", 'copilot -p "Use the ait-init skill to prepare this repository for the ai-team-sdlc plugin." --allow-all-tools --no-ask-user'],
    ["dim", "… the agent reads the skill, writes the files and commits …"],
    ["cmd", "git show --stat --format=\"%h %s\" HEAD"],
    ["out", "724237c chore: bootstrap ai-team-sdlc plugin"],
    ["out", ""],
    ["out", " .github/copilot/settings.json | 13 +++++++++++++"],
    ["out", " .gitignore                    |  4 ++++"],
    ["out", " AGENTS.md                     | 13 +++++++++++++"],
    ["out", " 3 files changed, 30 insertions(+)"],
  ],
};

const browser = await chromium.launch();
for (const [name, lines] of Object.entries(shots)) {
  const body = lines
    .map(([k, t]) =>
      k === "cmd"
        ? `<div><span class="ps">PS C:\\src\\my-practice-repo&gt;</span> <span class="cmd">${esc(t)}</span></div>`
        : `<div class="${k}">${esc(t) || "&nbsp;"}</div>`,
    )
    .join("");
  const html = `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;background:#0b1020;font:15px/1.55 "Cascadia Mono",Consolas,monospace;color:#e6e9f2}
  .win{margin:24px;border:1px solid #2a3350;border-radius:10px;overflow:hidden;background:#101830;width:1040px}
  .bar{background:#131a2e;padding:8px 14px;color:#9aa4c7;font:13px system-ui,sans-serif;display:flex;gap:8px;align-items:center}
  .dot{width:11px;height:11px;border-radius:50%;display:inline-block}
  .pad{padding:16px 18px;white-space:pre-wrap;word-break:break-all}
  .ps{color:#0ea5e9}.cmd{color:#fbbf24}.out{color:#e6e9f2}.dim{color:#7d87aa}
  </style><div class="win"><div class="bar"><span class="dot" style="background:#ef4444"></span><span class="dot" style="background:#f59e0b"></span><span class="dot" style="background:#16a34a"></span><span style="margin-left:8px">PowerShell</span></div><div class="pad">${body}</div></div>`;
  const page = await browser.newPage({ viewport: { width: 1100, height: 400 }, deviceScaleFactor: 1 });
  await page.setContent(html);
  const win = page.locator(".win");
  await win.screenshot({ path: `${out}/${name}.png` });
  await page.close();
  console.log("ok", name);
}
await browser.close();

