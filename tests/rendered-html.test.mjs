import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function cssBlockAfter(css, start) {
  const open = css.indexOf("{", start);
  assert.notEqual(open, -1, "CSS block must open with a brace");

  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(open + 1, index);
  }

  assert.fail("CSS block must close with a brace");
}

test("server-renders Qin Chuan's resume identity and anchor sections", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /class="editorial-hero"/);
  assert.match(html, /class="dossier-entry"/);
  assert.match(html, /class="[^"]*\bproject-dossier\b[^"]*"/);
  assert.doesNotMatch(html, /\bvisual-dossier\b/);
  assert.doesNotMatch(html, /src="\/images\/ai-storyboard-pipeline\.png"/);
  assert.doesNotMatch(html, /src="\/images\/ai-storyboard-director\.png"/);
  assert.match(html, /<title>秦川｜AI动画制作人\/AI短剧全流程搭建<\/title>/);
  assert.match(html, /秦川/);
  assert.match(html, /AI动画制作人\/AI短剧全流程搭建/);
  assert.match(html, /17326096652/);
  assert.match(html, /408217203@qq\.com/);
  assert.match(html, /北京/);
  assert.match(html, /男/);
  assert.match(html, /年龄：36岁/);
  assert.match(html, /求职意向：动画设计/);
  assert.match(html, /期望城市：北京/);
  assert.match(html, /北京看云控股有限公司（合作）/);
  assert.match(html, /福建泽联数字服务有限公司（顾问AI方向）/);
  assert.match(html, /杭州蔻艺文化发展有限公司/);
  assert.match(html, /金属及树脂 3D 打印配件研发/);
  assert.match(html, /联发集团下属子公司战略规划及设计管理优化/);
  assert.match(html, /达州国际龙郡酒店方案/);
  assert.match(html, /杭政储出商业地块规划设计，街面再规划/);
  assert.match(html, /千叶工业大学/);
  assert.match(html, /全国CAD技能一级证书/);

  for (const id of ["about", "experience", "projects", "contact"]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("uses editorial type rules that cannot collapse title lines", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--display-leading:\s*1\.0[8-9]/);
  assert.match(css, /\.editorial-hero h1\s*\{[^}]*line-height:\s*var\(--display-leading\)/);
  assert.doesNotMatch(css, /line-height:\s*\.7[18]/);
  const mobileRule = /@media\s*\(max-width:\s*720px\)\s*\{/.exec(css);
  assert.ok(mobileRule, "expected a max-width: 720px media block");
  const mobileCss = cssBlockAfter(css, mobileRule.index);
  assert.match(mobileCss, /\.editorial-hero\b/);
  assert.match(
    mobileCss,
    /\.editorial-hero h1\s*\{[^}]*letter-spacing:\s*(?:normal|0(?:[a-z%]+)?);/,
  );
});

test("collapses resume rails before narrow embedded or mobile viewports clip content", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const compactRule = /@media\s*\(max-width:\s*980px\)\s*\{/.exec(css);
  assert.ok(compactRule, "expected a compact-layout media block");
  const compactCss = cssBlockAfter(css, compactRule.index);
  assert.match(compactCss, /\.dossier-entry/);
  assert.match(compactCss, /\.experience-heading/);
  assert.match(compactCss, /grid-template-columns:\s*1fr;/);
});

test("keeps focus visible and disables smooth scrolling for reduced motion", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.contact a:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--ink\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^}]*html\s*\{[^}]*scroll-behavior:\s*auto/);
});

test("keeps dossier imagery visible and reserves space for entry hover rails", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  const heroRule = /\.editorial-hero::before\s*\{/.exec(css);
  assert.ok(heroRule, "expected a decorative hero pseudo-element");
  const heroCss = cssBlockAfter(css, heroRule.index);
  assert.match(heroCss, /image-set\([^)]*editorial-dossier-bg\.webp/s);

  const assetUrls = [
    ...heroCss.matchAll(/url\(["']?(\/images\/[^"')]+)["']?\)/g),
  ].map((match) => match[1]);
  assert.ok(assetUrls.includes("/images/editorial-dossier-bg.webp"));
  for (const assetUrl of new Set(assetUrls)) {
    const asset = await stat(new URL(`../public${assetUrl}`, import.meta.url));
    assert.ok(asset.size > 0, `${assetUrl} must exist and contain data`);
  }

  const opacity = /opacity:\s*(0?\.\d+)/.exec(heroCss);
  assert.ok(opacity, "hero decoration must declare explicit opacity");
  assert.ok(
    Number(opacity[1]) >= 0.4 && Number(opacity[1]) <= 0.5,
    "hero decoration must remain visible without overpowering the copy",
  );
  assert.match(heroCss, /z-index:\s*0/);
  assert.doesNotMatch(heroCss, /background-blend-mode:\s*multiply/);

  const entryRule = /\.dossier-entry\s*\{/.exec(css);
  assert.ok(entryRule, "expected a dossier entry rule");
  const entryCss = cssBlockAfter(css, entryRule.index);
  assert.match(entryCss, /border-left:\s*2px solid transparent/);
  assert.match(entryCss, /padding-inline-start:\s*0\.75rem/);

  const entryHoverRule = /\.dossier-entry:hover\s*\{/.exec(css);
  assert.ok(entryHoverRule, "expected a dossier entry hover rule");
  const entryHoverCss = cssBlockAfter(css, entryHoverRule.index);
  assert.match(entryHoverCss, /border-left-color:\s*var\(--signal\)/);
  assert.doesNotMatch(entryHoverCss, /box-shadow:/);

  assert.match(css, /\.project-dossier\s*\{[^}]*transition:/);
  assert.doesNotMatch(css, /\.project-dossier:hover\s*\{[^}]*transform:/);
  assert.doesNotMatch(css, /\.capabilities span:hover\s*\{[^}]*transform:/);
  assert.match(css, /\.project-dossier:hover\s*\{[^}]*border-color:\s*var\(--rule-strong\)/);
  assert.match(css, /\.contact-grid a:hover[^}]*\{[^}]*transform:\s*translateX\(/);
  assert.doesNotMatch(css, /\.contact-grid a:hover[^}]*\{[^}]*padding-left:/);

  const reducedMotionRule = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/.exec(css);
  assert.ok(reducedMotionRule, "expected a prefers-reduced-motion media block");
  const reducedMotionCss = cssBlockAfter(css, reducedMotionRule.index);
  assert.match(reducedMotionCss, /transition-duration:\s*0\.01ms/);
});

test("keeps storyboard imagery behind project copy and removes standalone panels", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  for (const assetName of ["ai-storyboard-pipeline.png", "ai-storyboard-director.png"]) {
    const asset = await stat(new URL(`../public/images/${assetName}`, import.meta.url));
    assert.ok(asset.size > 0, `${assetName} must exist and contain data`);
  }

  assert.doesNotMatch(css, /\.visual-dossier\b/);
  const projectGridRule = /\.project-grid\s*,\s*\.project-list\s*\{/.exec(css);
  assert.ok(projectGridRule, "expected a project grid rule");
  const projectGridCss = cssBlockAfter(css, projectGridRule.index);
  assert.match(projectGridCss, /gap:\s*1rem/);
  assert.doesNotMatch(projectGridCss, /border-left:/);
  assert.match(css, /\.dossier-meta\s*\{[^}]*font-size:\s*clamp\(0\.9rem/s);
  assert.match(
    css,
    /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*\.dossier-meta\s*\{[^}]*font-size:\s*0\.88rem/s,
  );
});

test("prioritizes current AI production dossiers with readable image treatments", async () => {
  const response = await render();
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  for (const text of [
    "AI课本动画化",
    "AI仿真人短剧开发",
    "撕掉婚纱后",
    "重生十八岁我拿下了进修名额",
    "垫付两万八，我拒了亿级大单",
  ]) {
    assert.match(html, new RegExp(text));
  }

  assert.match(html, /全流程制作 · 2026\.03 - 至今/);
  assert.match(html, /全流程制作 · 2025\.05 - 至今/);
  assert.match(html, /全流程制作 · 2025\.01 - 至今/);
  assert.match(html, /project-dossier--science/);
  assert.match(html, /project-dossier--textbook/);
  assert.match(css, /\.project-dossier--science::before[\s\S]*opacity:\s*0\.18/);
  assert.match(css, /\.project-dossier--textbook::before[\s\S]*opacity:\s*0\.18/);
  assert.match(css, /\.project-dossier--science::after[\s\S]*linear-gradient/);
});

test("renders semantic storyboard interludes with restrained visual rules", async () => {
  const response = await render();
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(html, /storyboard-interlude--script/);
  assert.match(html, /storyboard-interlude--rhythm/);
  assert.match(html, /纸本分镜、角色设定与监看屏组成的动画制作档案/);
  assert.match(html, /动画分镜、色彩脚本与剪辑时间轴组成的制作档案/);
  assert.match(html, /src="\/images\/storyboard-script-to-shot\.png"/);
  assert.match(html, /src="\/images\/storyboard-rhythm-archive\.png"/);
  assert.match(css, /\.project-dossier--science::before,[\s\S]*?opacity:\s*0\.18;/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.storyboard-interlude\s*\{[\s\S]*?grid-template-columns:/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)\s*\{[\s\S]*?\.storyboard-interlude\s*\{[\s\S]*?grid-template-columns:\s*1fr/s);
  assert.doesNotMatch(css, /body[^{]*\{[^}]*background-image:[^}]*storyboard-/);
});

test("renders the real production archive after project cards", async () => {
  const response = await render();
  const html = await response.text();

  for (const asset of [
    "/images/production-scene-rain-wedding.jpg",
    "/images/production-character-female-sheet.png",
    "/images/production-character-male-sheet.png",
    "/images/production-storyboard-shot-sheet.png",
  ]) assert.match(html, new RegExp(asset.replaceAll(".", "\\.")));
  assert.match(html, /瀹為檯鍒朵綔妗ｆ\s*\/\s*03/);
  assert.match(html, /Production Evidence \/ Character, Scene &amp; Shot Design/);
  assert.doesNotMatch(html, /short-drama-wedding-reversal|short-drama-second-chance|short-drama-urban-choice|short-drama-production-archive/);
});

test("renders cinematic interaction hooks without changing the document grid", async () => {
  const response = await render();
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(html, /id="reading-progress"/);
  assert.match(html, /data-reveal=""/);
  assert.match(css, /\.is-revealed/);
  assert.match(css, /\.nav-links a\[aria-current="true"\]/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.reveal-item/s);
  assert.match(css, /\.short-drama-reel\s*\{[\s\S]*?grid-column:\s*1\s*\/\s*-1[\s\S]*?min-width:\s*0/s);
});

test("ships a project-scoped GitHub Pages export and deployment workflow", async () => {
  const exporter = await readFile(new URL("../scripts/export-github-pages.mjs", import.meta.url), "utf8");
  const workflow = await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");

  assert.match(exporter, /const basePath = "\/qinchuan-ai"/);
  assert.match(exporter, /https:\/\/qoq2055\.github\.io\$\{basePath\}\//);
  assert.match(exporter, /replaceAll\('href="\/'/);
  assert.match(workflow, /actions\/upload-pages-artifact@v3/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});

test("exports dossier imagery beneath the GitHub Pages project path", async () => {
  const projectRoot = new URL("..", import.meta.url);
  await execFileAsync(process.execPath, ["scripts/export-github-pages.mjs"], {
    cwd: projectRoot,
  });

  const assetDirectory = new URL("../github-pages/assets/", import.meta.url);
  const cssFile = (await readdir(assetDirectory)).find((file) => file.endsWith(".css"));
  assert.ok(cssFile, "expected the exported bundle to include a CSS asset");

  const css = await readFile(new URL(`../github-pages/assets/${cssFile}`, import.meta.url), "utf8");
  assert.match(css, /\/qinchuan-ai\/images\/editorial-dossier-bg\.webp/);
  assert.doesNotMatch(css, /(?:url\(|["'])\/images\/editorial-dossier-bg\.(?:webp|png)/);
});

test("prepares a root-scoped static bundle for Tencent CloudBase", async () => {
  const scriptDirectory = new URL("../scripts/", import.meta.url);
  assert.ok(
    (await readdir(scriptDirectory)).includes("export-cloudbase.mjs"),
    "expected a dedicated CloudBase static export script",
  );

  const projectRoot = new URL("..", import.meta.url);
  await execFileAsync(process.execPath, ["scripts/export-cloudbase.mjs"], {
    cwd: projectRoot,
  });

  const html = await readFile(new URL("../cloudbase-static/index.html", import.meta.url), "utf8");
  assert.match(html, /href="\/assets\//);
  assert.doesNotMatch(html, /\/qinchuan-ai\//);
  assert.ok((await stat(new URL("../cloudbase-static/images/editorial-dossier-bg.webp", import.meta.url))).size > 0);
});

test("keeps the source resume's detailed responsibilities and achievements", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  for (const detail of [
    "将AI智能体矩阵全面嵌入创作制片全流程",
    "极少出现后期大幅返工情况",
    "紧扣教学大纲编写故事脚本与视觉方案",
    "中少社，旗下刊物《我爱科学》的AI动画化制作",
    "对接甲方，进行高效沟通，深度理解甲方需求",
    "完成有关图纸方面的绘图及文本制作工作",
    "设置合适的打印参数",
    "全国CAD技能一级证书",
  ]) {
    assert.match(source, new RegExp(detail));
  }
});
