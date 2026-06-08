// Self-verification: screenshot the running dev app so the look can be judged.
// Usage: node tools/shot.mjs [url] [waitMs] [outPath]
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:5173";
const waitMs = Number(process.argv[3] || 4000);
const out = process.argv[4] || "/tmp/shot.png";

const browser = await chromium.launch({
  args: ["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1680, height: 1050 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(waitMs);
await page.screenshot({ path: out });
console.log("saved", out);
if (errors.length) console.log("CONSOLE ERRORS:\n" + errors.join("\n"));
await browser.close();
