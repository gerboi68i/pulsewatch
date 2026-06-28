import puppeteer from "puppeteer-core";

const TOKEN = process.env.PW_TOKEN || "";
const BASE = process.env.PW_BASE || "http://localhost:3000";
const OUT = process.env.PW_OUT || ".shots";
const CHROME = process.env.CHROME || "/usr/bin/google-chrome";
const url = new URL(BASE);
const secure = url.protocol === "https:";

const pages = process.env.PW_PAGES
  ? JSON.parse(process.env.PW_PAGES)
  : [["/", "landing", 1500], ["/login", "login", 860], ["/signup", "signup", 940], ["/dashboard", "dashboard", 1400]];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars", "--disable-gpu", "--force-color-profile=srgb"],
});

for (const [path, name, height] of pages) {
  const page = await browser.newPage();
  await page.setViewport({ width: Number(process.env.PW_WIDTH) || 1440, height, deviceScaleFactor: 1 });
  if (TOKEN) {
    await page.setCookie({ name: "pw_session", value: TOKEN, domain: url.hostname, path: "/", httpOnly: true, secure });
  }
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle0", timeout: 60000 });
  } catch (e) {
    console.log("goto warn", name, e.message);
  }
  // scroll through to trigger IntersectionObserver reveal animations, then return to top
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 350);
        y += 350;
        if (y < document.body.scrollHeight) setTimeout(step, 55);
        else { window.scrollTo(0, 0); res(); }
      };
      step();
    });
  });
  await new Promise((r) => setTimeout(r, 600));
  // freeze animations and force reveal/fade-in elements to final visible state for a deterministic capture
  await page.addStyleTag({
    content:
      "*{animation:none!important;transition:none!important}" +
      ".reveal,.fade-in{opacity:1!important;transform:none!important}" +
      ".draw-line{stroke-dashoffset:0!important}" +
      ".bar-grow,.animate-float,.aurora{transform:none!important}",
  });
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot({ path: `${OUT}/pw_${name}.png`, fullPage: true });
  console.log("shot:", name, "->", `${OUT}/pw_${name}.png`);
  await page.close();
}
await browser.close();
console.log("done");
