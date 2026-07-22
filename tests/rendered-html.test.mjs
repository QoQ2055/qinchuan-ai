import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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

test("server-renders Qin Chuan's resume identity and anchor sections", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /class="editorial-hero"/);
  assert.match(html, /class="dossier-entry"/);
  assert.match(html, /class="project-dossier"/);
  assert.match(html, /<title>秦川｜AI动画导演 \/ 制片人<\/title>/);
  assert.match(html, /秦川/);
  assert.match(html, /AI动画导演/);
  assert.match(html, /17326096652/);
  assert.match(html, /408217203@qq\.com/);
  assert.match(html, /北京/);
  assert.match(html, /北京看云控股有限公司/);
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
  assert.doesNotMatch(css, /line-height:\s*\.7[18]/);
  assert.match(css, /@media \(max-width:\s*720px\)[\s\S]*\.editorial-hero/);
});

test("keeps focus visible and disables smooth scrolling for reduced motion", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.contact a:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--ink\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[^}]*html\s*\{[^}]*scroll-behavior:\s*auto/);
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
