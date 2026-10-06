import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const root = fileURLToPath(new URL("../../docs/assets/img", import.meta.url));
const live = "https://devopsabcs-engineering.github.io/ai-sdlc-labs-pinch/";
const gh = "https://github.com/devopsabcs-engineering/ai-sdlc-labs-pinch";
for (const n of ["01", "02", "03", "04", "05", "06", "07", "08"]) mkdirSync(`${root}/lab-${n}`, { recursive: true });

const browser = await chromium.launch();

async function app(lang, theme) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 860 },
    locale: lang === "fr" ? "fr-CA" : "en-CA",
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(live, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  return { ctx, page };
}

const sfx = (l) => (l === "fr" ? ".fr" : "");
for (const lang of ["en", "fr"]) {
  const { ctx, page } = await app(lang, "light");
  if (lang === "fr") {
    const html = await page.getAttribute("html", "lang");
    if (html !== "fr") await page.locator("#locale-toggle").click();
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${root}/lab-04/04-01-recipe${sfx(lang)}.png` });
  await page.locator("[data-increase]").click();
  await page.locator("[data-increase]").click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${root}/lab-04/04-02-scaled${sfx(lang)}.png` });
  await page.locator('[data-unit="imperial"]').click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${root}/lab-04/04-03-imperial${sfx(lang)}.png` });
  await page.locator("[data-add-shopping]").click();
  await page.waitForTimeout(300);
  await page.locator("[data-shopping-list] input").first().check();
  await page.screenshot({ path: `${root}/lab-04/04-04-shopping${sfx(lang)}.png`, fullPage: true });
  await page.locator("[data-start-cook]").click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${root}/lab-04/04-05-cook${sfx(lang)}.png` });
  await ctx.close();
}

// dark theme and mobile (lab 2/4 variety)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, colorScheme: "dark", locale: "fr-CA" });
  const page = await ctx.newPage();
  await page.goto(live, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${root}/lab-04/04-06-mobile-dark.fr.png` });
  await ctx.close();
}

// GitHub evidence pages
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "light" });
const page = await ctx.newPage();
const shots = [
  ["lab-01/01-01-idea-md", `${gh}/blob/main/specs/idea.md`],
  ["lab-01/01-02-repo-root", `${gh}`],
  ["lab-02/02-01-design-doc", `${gh}/blob/main/docs/design/pinch-experience.md`],
  ["lab-02/02-02-prototype-evidence", `${gh}/tree/main/prototype`],
  ["lab-03/03-01-prd", `${gh}/blob/main/docs/product/prd.md`],
  ["lab-03/03-02-adr-i18n", `${gh}/blob/main/docs/architecture/adr-001-i18n.md`],
  ["lab-03/03-03-architecture-folder", `${gh}/tree/main/docs/architecture`],
  ["lab-04/04-07-commits", `${gh}/commits/main`],
  ["lab-05/05-01-qa-evidence", `${gh}/blob/main/evidence/qa/T-011-qa.md`],
  ["lab-05/05-02-critic-evidence", `${gh}/blob/main/evidence/qa/T-012-critic.md`],
  ["lab-05/05-03-security-evidence", `${gh}/blob/main/evidence/qa/T-013-security.md`],
  ["lab-06/06-01-decisions", `${gh}/blob/main/docs/run/2026-10-05-pinch/decisions.md`],
  ["lab-06/06-02-state-json", `${gh}/blob/main/docs/run/2026-10-05-pinch/state.json`],
  ["lab-07/07-01-pull-request", `${gh}/pull/1`],
  ["lab-07/07-02-pages-workflow", `${gh}/blob/main/.github/workflows/pages.yml`],
  ["lab-07/07-03-actions-run", `${gh}/actions/runs/37465190164`],
  ["lab-07/07-04-deployment-doc", `${gh}/blob/main/docs/deployment.md`],
  ["lab-08/08-01-run-record", `${gh}/tree/main/docs/run/2026-10-05-pinch`],
  ["lab-08/08-02-tags", `${gh}/tags`],
];
for (const [name, url] of shots) {
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${root}/${name}.png` });
    console.log("ok", name);
  } catch (e) {
    console.log("FAIL", name, String(e).slice(0, 100));
  }
}
await browser.close();

