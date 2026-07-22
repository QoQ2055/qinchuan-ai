# AI 动画制作档案视觉密度 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为简历增加两张原创 AI 漫剧制作分镜，并使工作经历的日期与岗位文字在桌面和移动端清晰可读。

**Architecture:** 图片作为独立的横向“制作档案页”模块插入到既有语义章节之间，不覆盖文字、也不改变履历数据。页面组件只负责模块标记和图片语义，CSS 负责黑色编辑风网格与响应式排版，测试锁定图片路径、模块数量和字号下限。

**Tech Stack:** Next/React、CSS、Node test、Vinext、GitHub Pages 静态导出、built-in image generation。

## Global Constraints

- 不改动既有工作、项目、联系方式或主色调。
- 生成两张无文字、无水印、横向原创 AI 漫剧分镜图，保存至 `public/images/`。
- 桌面端使用档案页插入式双栏关系；移动端改为单栏。
- 经历日期与岗位使用至少 `0.9rem` 的桌面字号和至少 `0.88rem` 的移动字号。
- 图片必须有明确的 `alt`、`loading="lazy"`，且 GitHub Pages 子路径导出保持可用。

---

### Task 1: 生成并校验两张 AI 漫剧分镜资产

**Files:**
- Create: `public/images/ai-storyboard-pipeline.png`
- Create: `public/images/ai-storyboard-director.png`

**Interfaces:**
- Produces: `"/images/ai-storyboard-pipeline.png"` 与 `"/images/ai-storyboard-director.png"`，供两个档案模块的 `<img>` 使用。

- [ ] **Step 1: 生成制作管线分镜图**

使用 built-in image generation：

```text
Use case: illustration-story
Asset type: horizontal editorial resume insert
Primary request: original AI animation production storyboard, script pages transitioning into shot thumbnails, character silhouette turnarounds, animation timeline and compositing monitor
Scene/backdrop: a dark animation studio archive table, no readable interface text
Style/medium: cinematic hand-drawn Chinese animation concept art, mixed graphite storyboard lines and restrained painted color
Composition/framing: 16:9 horizontal, central production artefacts, quiet negative space at both edges
Lighting/mood: low-key film studio light, atmospheric, precise and professional
Color palette: charcoal black, warm paper-white, muted olive grey, a tiny fluorescent yellow accent
Materials/textures: paper grain, film-strip edge, pencil marks, subtle screen glow
Constraints: no people faces, no logos, no text, no watermark, no typography
Avoid: neon cyberpunk, saturated rainbow, collage clutter, UI screenshots
```

- [ ] **Step 2: 生成导演监看分镜图**

使用 built-in image generation：

```text
Use case: illustration-story
Asset type: horizontal editorial resume insert
Primary request: original AI animated short-drama directing scene, over-the-shoulder silhouette at a monitoring desk, floating storyboard frames, camera lens diagram, character and environment asset sheets arranged as a production dossier
Scene/backdrop: dark post-production room with a single monitor glow, no readable screen text
Style/medium: cinematic hand-drawn Chinese animation concept art, editorial production archive aesthetic
Composition/framing: 16:9 horizontal, subject and monitor in the right third, restrained open space in the left third
Lighting/mood: quiet dramatic screening-room light, sophisticated and restrained
Color palette: deep black, warm ivory, desaturated brown-grey, one small fluorescent yellow registration mark
Materials/textures: film grain, ink linework, storyboard paper and transparent animation cel texture
Constraints: no identifiable face, no logos, no text, no watermark, no typography
Avoid: neon cyberpunk, photorealistic portrait, busy collage, legible interface copy
```

- [ ] **Step 3: 保存并检查资产**

将选定的图片保存到两个目标路径，然后运行：

```powershell
Get-Item public\images\ai-storyboard-pipeline.png, public\images\ai-storyboard-director.png |
  Select-Object Name, Length
```

Expected: 两个文件存在，`Length` 均大于 `0`。

- [ ] **Step 4: Commit**

```bash
git add public/images/ai-storyboard-pipeline.png public/images/ai-storyboard-director.png
git commit -m "feat: add AI animation storyboard artwork"
```

### Task 2: 锁定视觉档案模块与字号的失败测试

**Files:**
- Modify: `tests/rendered-html.test.mjs:44-145`
- Test: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: 两个静态图片文件。
- Produces: 关于 `.visual-dossier`、图片路径、懒加载和 `.dossier-meta` 字号的回归保证。

- [ ] **Step 1: 写入失败测试**

在服务端渲染测试中加入：

```js
assert.equal((html.match(/class="visual-dossier"/g) ?? []).length, 2);
assert.match(html, /src="\/images\/ai-storyboard-pipeline\.png"/);
assert.match(html, /src="\/images\/ai-storyboard-director\.png"/);
assert.match(html, /loading="lazy"/);
```

在 CSS 测试中加入：

```js
assert.match(css, /\.visual-dossier\s*\{[^}]*display:\s*grid/s);
assert.match(css, /\.dossier-meta\s*\{[^}]*font-size:\s*clamp\(0\.9rem/s);
assert.match(css, /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*\.dossier-meta\s*\{[^}]*font-size:\s*0\.88rem/s);
```

- [ ] **Step 2: 运行测试验证失败**

```powershell
$runtimeNode = 'C:\Users\QvQ\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $runtimeNode --test tests\rendered-html.test.mjs
```

Expected: FAIL，缺少视觉档案模块、新图片引用和放大字号。

### Task 3: 实现档案页插图模块和经历元信息放大

**Files:**
- Modify: `app/page.tsx:160-190`
- Modify: `app/globals.css:320-390, 540-640`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: `"/images/ai-storyboard-pipeline.png"` 与 `"/images/ai-storyboard-director.png"`。
- Produces: 两个 `<section className="visual-dossier">` 模块和响应式 CSS。

- [ ] **Step 1: 在个人优势后加入第一张档案页**

```tsx
<section className="visual-dossier" aria-labelledby="pipeline-dossier-title">
  <div className="visual-dossier-copy">
    <p className="section-index">制作分镜 / 01</p>
    <h2 id="pipeline-dossier-title">从脚本，到<br /><em>交付成片。</em></h2>
    <p>以分镜、资产、镜头与合成为同一条可控的制作管线。</p>
  </div>
  <figure><img src="/images/ai-storyboard-pipeline.png" loading="lazy" alt="AI 动画制作管线的手绘分镜档案" /></figure>
</section>
```

- [ ] **Step 2: 在项目与资历前加入第二张档案页**

```tsx
<section className="visual-dossier visual-dossier-reverse" aria-labelledby="director-dossier-title">
  <div className="visual-dossier-copy">
    <p className="section-index">制作分镜 / 02</p>
    <h2 id="director-dossier-title">镜头、资产与<br /><em>节奏同频。</em></h2>
    <p>把 AI 漫剧的叙事判断落实到每一帧可交付的画面里。</p>
  </div>
  <figure><img src="/images/ai-storyboard-director.png" loading="lazy" alt="AI 短剧导演监看动画资产的手绘分镜档案" /></figure>
</section>
```

- [ ] **Step 3: 添加对应 CSS**

```css
.visual-dossier {
  display: grid;
  grid-template-columns: minmax(12rem, 0.8fr) minmax(0, 1.55fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: end;
  max-width: min(100% - 3rem, 86rem);
  margin: clamp(4rem, 9vw, 8rem) auto;
  padding-block: clamp(1.25rem, 3vw, 2rem);
  border-block: 1px solid var(--rule);
}
.visual-dossier-reverse { grid-template-columns: minmax(0, 1.55fr) minmax(12rem, 0.8fr); }
.visual-dossier-reverse .visual-dossier-copy { order: 2; }
.visual-dossier figure { margin: 0; overflow: hidden; border: 1px solid var(--rule-strong); background: #111; }
.visual-dossier img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; filter: saturate(0.78) contrast(1.08); }
.visual-dossier-copy h2 { margin: 0.65rem 0 1rem; font-size: clamp(2rem, 4vw, 4.75rem); line-height: 0.95; letter-spacing: -0.06em; }
.visual-dossier-copy p:last-child { max-width: 24rem; margin: 0; color: var(--muted); line-height: 1.75; }
.dossier-meta { color: #c7c4bc; font-size: clamp(0.9rem, 1vw, 1rem); line-height: 1.65; }
@media (max-width: 640px) {
  .visual-dossier, .visual-dossier-reverse { grid-template-columns: 1fr; gap: 1.25rem; max-width: min(100% - 2rem, 40rem); margin-block: 3.5rem; }
  .visual-dossier-reverse .visual-dossier-copy { order: 0; }
  .visual-dossier-copy h2 { font-size: clamp(2.15rem, 11vw, 3.6rem); }
  .dossier-meta { font-size: 0.88rem; }
}
```

- [ ] **Step 4: 运行构建与测试**

```powershell
$runtimeNode = 'C:\Users\QvQ\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $runtimeNode .\node_modules\vinext\dist\cli.js build
& $runtimeNode --test tests\rendered-html.test.mjs
```

Expected: 构建成功，测试全部通过。

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add editorial storyboard modules"
```

### Task 4: 导出、视觉检查并发布

**Files:**
- Verify: `github-pages/`
- Verify: `https://qoq2055.github.io/qinchuan-ai/`

**Interfaces:**
- Consumes: 已构建页面和 `scripts/export-github-pages.mjs`。
- Produces: GitHub Pages 主分支上的可访问页面。

- [ ] **Step 1: 导出并检查子路径图片引用**

```powershell
$runtimeNode = 'C:\Users\QvQ\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
& $runtimeNode scripts\export-github-pages.mjs
$css = Get-Content -Raw (Get-ChildItem github-pages\assets\*.css | Select-Object -First 1).FullName
$css -match '/qinchuan-ai/images/ai-storyboard-pipeline.png'
```

Expected: 导出成功，匹配结果为 `True`。

- [ ] **Step 2: 检查桌面与移动端**

确认两张图均在对应章节间、正文无压字；窄屏时插图为单栏，经历日期和岗位可清晰阅读。

- [ ] **Step 3: 推送并验证线上页面**

```bash
git push origin HEAD:main
```

```powershell
$page = Invoke-WebRequest -UseBasicParsing 'https://qoq2055.github.io/qinchuan-ai/'
$page.Content.Contains('/images/ai-storyboard-pipeline.png')
$page.Content.Contains('/images/ai-storyboard-director.png')
```

Expected: 两个结果均为 `True`。
