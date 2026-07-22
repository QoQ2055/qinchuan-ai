# AI 项目档案卡补充与背景图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在公开简历的项目区置顶三项 AI 全流程制作项目，并以低透明制作分镜图增强卡片氛围而不影响文字可读性。

**Architecture:** `app/page.tsx` 将项目数据从无名元组改为具名对象，新增 `backgroundClass` 只负责决定卡片视觉。`app/globals.css` 为两张带图卡创建深色渐变遮罩和不超过 25% 的背景图层；现有响应式单列规则继续承接移动端。测试继续采用服务端渲染 HTML 与 CSS 源码断言。

**Tech Stack:** React 19、TypeScript、Vinext、Node test runner、CSS。

## Global Constraints

- 新项目按《我爱科学》、AI 课本动画化、AI 仿真人短剧开发的顺序置顶；所有日期均为 `2026.03 - 至今`。
- 不删改用户提供的事实；可压缩语句并突出全流程制作、产能、上线平台和代表作。
- 仅《我爱科学》和 AI 课本动画化使用已有两张分镜图；图像透明度上限为 25%，且必须使用深色渐变遮罩。
- 保持桌面双列、移动端单列；不新增位移、缩放或复杂悬停动画。

---

### Task 1: 建立项目内容与视觉回归测试

**Files:**
- Modify: `tests/rendered-html.test.mjs:49-79`

**Interfaces:**
- Consumes: 服务端响应 HTML 与 `app/globals.css` 源码。
- Produces: 对三项项目内容、三条全流程元信息、短剧代表作和带图卡遮罩规则的回归保护。

- [ ] **Step 1: 写入失败测试**

```js
test("prioritizes current AI production dossiers with readable image treatments", async () => {
  const response = await fetch(`http://127.0.0.1:${port}/`);
  const html = await response.text();
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  for (const text of [
    "我爱科学",
    "AI课本动画化",
    "AI仿真人短剧开发",
    "撕掉婚纱后",
    "重生十八岁我拿下了进修名额",
    "垫付两万八，我拒了亿级大单",
  ]) assert.match(html, new RegExp(text));

  assert.equal((html.match(/全流程制作 · 2026\.03 - 至今/g) ?? []).length, 3);
  assert.match(html, /project-dossier--science/);
  assert.match(html, /project-dossier--textbook/);
  assert.match(css, /\.project-dossier--science::before[\s\S]*opacity:\s*0\.25/);
  assert.match(css, /\.project-dossier--textbook::before[\s\S]*opacity:\s*0\.25/);
  assert.match(css, /\.project-dossier--science::after[\s\S]*linear-gradient/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test`

Expected: FAIL，错误应指出 `我爱科学` 或 `project-dossier--science` 尚未出现在项目区。

- [ ] **Step 3: 提交测试红灯**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: cover highlighted AI project dossiers"
```

### Task 2: 补充项目数据与可读背景图

**Files:**
- Modify: `app/page.tsx:112-120,204-206`
- Modify: `app/globals.css:492-527`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `Project` 对象的 `title`、`meta`、`detail`、`backgroundClass` 字段。
- Produces: 置顶 AI 制作项目卡和两个低透明度背景图卡。

- [ ] **Step 1: 将项目数据定义为具名对象并置顶新增内容**

```tsx
type Project = {
  title: string;
  meta: string;
  detail: string;
  backgroundClass?: "project-dossier--science" | "project-dossier--textbook";
};

const projects: Project[] = [
  { title: "我爱科学", meta: "全流程制作 · 2026.03 - 至今", backgroundClass: "project-dossier--science", detail: "参与中少社旗下刊物《我爱科学》的 AI 动画化制作，负责内容创意与动画流程优化……" },
  { title: "AI课本动画化", meta: "全流程制作 · 2026.03 - 至今", backgroundClass: "project-dossier--textbook", detail: "负责双版本（人教/沪教）儿童英语 AI 动画全流程制作……" },
  { title: "AI仿真人短剧开发", meta: "全流程制作 · 2026.03 - 至今", detail: "主导仿真人短剧从选题策划、剧本、AI 生成到上线发行的全流程制作……" },
];
```

- [ ] **Step 2: 将卡片渲染改为使用具名字段**

```tsx
{projects.map((project) => (
  <article className={`project-dossier ${project.backgroundClass ?? ""}`} key={project.title}>
    <p className="project-meta">{project.meta}</p>
    <h3>{project.title}</h3>
    <p>{project.detail}</p>
  </article>
))}
```

- [ ] **Step 3: 加入图像层与深色遮罩**

```css
.project-dossier--science::before,
.project-dossier--textbook::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: 0.25;
  background: center / cover no-repeat;
  filter: grayscale(1) contrast(1.12);
}

.project-dossier--science::after,
.project-dossier--textbook::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(120deg, rgba(8, 8, 8, 0.93), rgba(8, 8, 8, 0.76));
}
```

- [ ] **Step 4: 运行完整测试确认转绿**

Run: `npm test`

Expected: PASS，全部测试通过，新增测试确认三项项目、短剧代表作和遮罩规则。

- [ ] **Step 5: 提交功能实现**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add highlighted AI production projects"
```

### Task 3: 导出、线上核验与发布

**Files:**
- Generated: `github-pages/`

**Interfaces:**
- Consumes: 已构建的 React 页面与 `public/images` 中的制作分镜图。
- Produces: 适配 `/qinchuan-ai/` 基路径的 GitHub Pages 静态包。

- [ ] **Step 1: 导出并校验静态资源**

Run: `npm run export:github-pages; Test-Path github-pages/images/ai-storyboard-pipeline.png; Test-Path github-pages/images/ai-storyboard-director.png; git diff --check`

Expected: 两个 `Test-Path` 均为 `True`，且 `git diff --check` 无输出。

- [ ] **Step 2: 发布当前提交至 GitHub Pages 源分支**

Run: `git push origin HEAD:main`

Expected: 推送成功，远端 `main` 指向新增项目提交。

- [ ] **Step 3: 实际加载公开网址并确认内容**

Run: 在 `https://qoq2055.github.io/qinchuan-ai/` 检查三项置顶项目、两个背景图、桌面双列与移动端单列。

Expected: 所有文字在深色遮罩上清晰可读，且无图片遮挡文字。
