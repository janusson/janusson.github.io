// Responsive QA harness — drives headless Chromium over CDP and asserts
// layout behavior at mobile (390px) and desktop (1280px) widths.
//
// Requires: a Chromium instance with --remote-debugging-port=9226 and the
// site served on http://127.0.0.1:4321 (see scripts/responsive-check.sh).
const CDP_PORT = 9226;
const SITE = "http://127.0.0.1:4321";
const WIDTHS = [390, 1280];
const PAGES = ["/", "/about/", "/publications/", "/cv/"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
const checks = [];

function check(label, ok, extra = "") {
  checks.push({ label, ok, extra });
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗ FAIL"}  ${label}${extra ? `  — ${extra}` : ""}`);
}

async function main() {
  const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mid = ++id;
      pending.set(mid, resolve);
      ws.send(JSON.stringify({ id: mid, method, params }));
    });

  const evaluate = async (expression) => {
    const res = await send("Runtime.evaluate", { expression, returnByValue: true });
    if (!res.result?.result?.value && res.result?.exceptionDetails) {
      console.error(
        "EVAL EXCEPTION:",
        res.result.exceptionDetails.exception?.description ?? res.result.exceptionDetails.text,
      );
    }
    return res.result?.result?.value;
  };

  for (const width of WIDTHS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 844,
      deviceScaleFactor: 1,
      mobile: false,
    });
    console.log(`\n═══ viewport ${width}px ═══`);

    for (const path of PAGES) {
      await evaluate(`location.href = ${JSON.stringify(SITE + path)}; true`);
      await sleep(2200);

      const m = await evaluate(`(() => {
        const out = { path: location.pathname };
        const doc = document.documentElement;
        out.innerWidth = innerWidth;
        out.scrollWidth = doc.scrollWidth;
        out.horizontalOverflow = doc.scrollWidth > innerWidth + 1;
        if (out.horizontalOverflow) {
          out.overflowers = [...document.querySelectorAll('body *')]
            .map((el) => ({ el, r: el.getBoundingClientRect() }))
            .filter(({ r }) => r.right > innerWidth + 1)
            .slice(0, 8)
            .map(({ el, r }) => el.tagName + '.' + String(el.className).split(' ').slice(0, 3).join('.') + ' →' + Math.round(r.right));
        }

        const grid = document.querySelector('[class*="grid gap-5"]');
        if (grid) out.gridCols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;

        const spine = document.querySelector('ol[aria-label="Career trajectory"]');
        if (spine) {
          out.spineEntries = spine.querySelectorAll(':scope > li').length;
          const rails = spine.querySelectorAll(':scope > div[aria-hidden]');
          out.spineRails = [...rails].map((r) => ({ hidden: r.offsetWidth === 0 && r.offsetHeight === 0 }));
          const dot = spine.querySelector('li span.absolute');
          out.spineDotStatic = dot ? getComputedStyle(dot).position : null;
        }

        const rail = document.querySelector('[aria-label="Career timeline"] .absolute');
        if (rail) out.timelineRailLeft = Math.round(rail.getBoundingClientRect().left);
        const cards = document.querySelectorAll('[aria-label="Career timeline"] ol > li');
        if (cards.length) out.timelineEntries = cards.length;

        const tabs = document.querySelector('[aria-label="Research themes"] ul');
        if (tabs) {
          out.themeTabs = {
            flexDirection: getComputedStyle(tabs).flexDirection,
            overflowX: getComputedStyle(tabs).overflowX,
          };
        }
        const pubsGrid = [...document.querySelectorAll('[class]')].find(
          (el) => typeof el.className === 'string' && el.className.includes('md:grid-cols-['),
        );
        if (pubsGrid) out.pubsGridCols = getComputedStyle(pubsGrid).gridTemplateColumns.split(' ').length;

        const cvCard = document.querySelector('.cv-download-card');
        if (cvCard) out.cvCardDirection = getComputedStyle(cvCard).flexDirection;
        return out;
      })()`);

      console.log(`\n  ${path}`);
      check(
        "no horizontal overflow",
        m.horizontalOverflow === false,
        `scrollWidth ${m.scrollWidth} / ${m.innerWidth}`,
      );
      if (m.overflowers) m.overflowers.forEach((o) => console.log(`    overflows: ${o}`));

      if (path === "/") {
        check(
          "SelectedWork grid columns",
          m.gridCols === (width < 768 ? 1 : 2),
          `${m.gridCols} col(s)`,
        );
        check("spine has 5 nodes", m.spineEntries === 5, `${m.spineEntries} entries`);
        const [vRail, hRail] = m.spineRails ?? [];
        check("spine vertical rail", width < 768 ? vRail && !vRail.hidden : !vRail || vRail.hidden);
        check(
          "spine horizontal rail",
          width >= 768 ? hRail && !hRail.hidden : !hRail || hRail.hidden,
        );
        check(
          "spine dot in-flow on desktop",
          width < 768 ? m.spineDotStatic === "absolute" : m.spineDotStatic === "static",
          m.spineDotStatic,
        );
      }

      if (path === "/about/") {
        check("timeline entries", m.timelineEntries === 5, `${m.timelineEntries}`);
        if (width < 768) {
          check("timeline rail on left", m.timelineRailLeft < 100, `${m.timelineRailLeft}px`);
        } else {
          check("timeline rail centered", m.timelineRailLeft > 300, `${m.timelineRailLeft}px`);
        }
      }

      if (path === "/publications/") {
        check(
          "theme tabs direction",
          width < 768
            ? m.themeTabs.flexDirection === "row"
            : m.themeTabs.flexDirection === "column",
          m.themeTabs.flexDirection,
        );
        check(
          "pubs wrapper grid columns",
          width < 768 ? m.pubsGridCols === 1 : m.pubsGridCols === 2,
          `${m.pubsGridCols} col(s)`,
        );
      }

      if (path === "/cv/") {
        check(
          "cv card direction",
          width < 768 ? m.cvCardDirection === "column" : m.cvCardDirection === "row",
          m.cvCardDirection,
        );
      }
    }
  }

  console.log(
    `\n${"=".repeat(44)}\nRESULT: ${failures === 0 ? "ALL PASS ✓" : failures + " FAILURE(S) ✗"}`,
  );
  ws.close();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
