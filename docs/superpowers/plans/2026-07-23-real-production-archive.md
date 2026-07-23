# Real Production Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the AI short-drama concept visuals with four user-owned production assets arranged as a responsive editorial production archive.

**Architecture:** Keep `projects` as card-only data in `app/page.tsx`; render a sibling archive after the project grid so media cannot affect card placement. Copy approved assets to ASCII filenames under `public/images/` and use dedicated CSS that stacks in document order on narrow screens.

**Tech Stack:** React/TSX, CSS, Vinext, Node test runner, local static assets.

## Global Constraints

- Use only the four publicly approved user-owned source assets from the design.
- Preserve résumé text, dark editorial styling, fluorescent-yellow indices, and reduced-motion support.
- Remove rendered references to all four generated `short-drama-*` concept images.
- Do not add external hosting, a carousel, or JavaScript gallery state.
- Keep Chinese alt text accurate and captions always visible.

---

### Task 1: Import approved production assets

**Files:**
- Create: `public/images/production-scene-rain-wedding.jpg`
- Create: `public/images/production-character-female-sheet.png`
- Create: `public/images/production-character-male-sheet.png`
- Create: `public/images/production-storyboard-shot-sheet.png`

**Interfaces:**
- Consumes: `F:\下载文件\Image (32).jpg`, `Image (1).png`, `Image (4).png`, and `Image (21).png`.
- Produces: four local `/images/production-*` URLs for page markup.

- [ ] **Step 1: Copy the four approved assets**

Run:

```powershell
Copy-Item -LiteralPath 'F:\下载文件\Image (32).jpg' -Destination 'public\images\production-scene-rain-wedding.jpg'
Copy-Item -LiteralPath 'F:\下载文件\Image (1).png' -Destination 'public\images\production-character-female-sheet.png'
Copy-Item -LiteralPath 'F:\下载文件\Image (4).png' -Destination 'public\images\production-character-male-sheet.png'
Copy-Item -LiteralPath 'F:\下载文件\Image (21).png' -Destination 'public\images\production-storyboard-shot-sheet.png'
```

- [ ] **Step 2: Verify the files are present**

Run: `Get-Item public\images\production-*.jpg, public\images\production-*.png | Select-Object Name, Length`

Expected: four non-empty files matching the URLs in Step 1.

- [ ] **Step 3: Commit the asset import**

```bash
git add public/images/production-*.jpg public/images/production-*.png
git commit -m "assets: add real production archive media"
```

### Task 2: Render the independent archive after project cards

**Files:**
- Modify: `app/page.tsx:219-230`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: four `production-*` paths from Task 1.
- Produces: a sibling `<section className="production-archive" aria-labelledby="production-archive-title">` after `.project-grid`.

- [ ] **Step 1: Extend the failing test with semantic assertions**

Append:

```js
for (const asset of [
  "/images/production-scene-rain-wedding.jpg",
  "/images/production-character-female-sheet.png",
  "/images/production-character-male-sheet.png",
  "/images/production-storyboard-shot-sheet.png",
]) assert.match(html, new RegExp(asset.replaceAll(".", "\\.")));
assert.match(html, /实际制作档案\s*\/\s*03/);
assert.match(html, /Production Evidence \/ Character, Scene &amp; Shot Design/);
assert.doesNotMatch(html, /short-drama-wedding-reversal|short-drama-second-chance|short-drama-urban-choice|short-drama-production-archive/);
```

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because generated concept-frame markup is still rendered.

- [ ] **Step 3: Replace generated concept markup in `app/page.tsx`**

Keep `.project-grid` limited to `<article className="project-dossier">` items. Immediately after its closing `</div>`, add:

```tsx
<section className="production-archive" aria-labelledby="production-archive-title">
  <div className="production-archive-heading"><p className="section-index">实际制作档案 / 03</p><p>Production Evidence / Character, Scene &amp; Shot Design</p></div>
  <div className="production-scene-record">
    <figure className="production-scene-frame"><img src="/images/production-scene-rain-wedding.jpg" alt="雨夜婚房场景的实际短剧制作素材" /></figure>
    <div><h3 id="production-archive-title">场景、角色与<br /><em>镜头证据。</em></h3><p>从戏剧场景气氛、角色造型到镜头节奏，形成可持续迭代的短剧视觉资产与制作依据。</p></div>
  </div>
  <div className="production-character-records">
    <figure className="production-evidence-frame"><img src="/images/production-character-female-sheet.png" alt="女性角色的实际制作角色设定表，含正侧背视图与材质细节" /><figcaption>角色设定 / 造型、材质与细节统一</figcaption></figure>
    <figure className="production-evidence-frame"><img src="/images/production-character-male-sheet.png" alt="男性角色的实际制作角色设定表，含正侧背视图与服装细节" /><figcaption>角色设定 / 视觉规范与资产一致性</figcaption></figure>
  </div>
  <figure className="production-shot-record"><img src="/images/production-storyboard-shot-sheet.png" alt="实际制作的黑白分镜与镜头运动拆解表" /><figcaption>镜头拆解 / 景别、运动与节奏设计</figcaption></figure>
</section>
```

Delete the old conditional `title === "AI仿真人短剧开发"` section and every `short-drama-*.png` reference.

- [ ] **Step 4: Run the focused test**

Run: `node --test tests/rendered-html.test.mjs`

Expected: PASS with new labels and production URLs, and no generated short-drama path.

- [ ] **Step 5: Commit markup and test assertions**

```bash
git add app/page.tsx tests/rendered-html.test.mjs
git commit -m "feat: render real production archive"
```

### Task 3: Add constrained responsive archive styles

**Files:**
- Modify: `app/globals.css:578-614, 721-744, 875-876`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: archive class names from Task 2.
- Produces: a constrained two-column archive on desktop that stacks scene, character, then storyboard on narrow screens.

- [ ] **Step 1: Add failing CSS assertions**

Append:

```js
const css = readFileSync("app/globals.css", "utf8");
assert.match(css, /\.production-archive\s*\{/);
assert.match(css, /\.production-character-records\s*\{/);
assert.match(css, /\.production-shot-record\s*\{/);
assert.doesNotMatch(css, /\.concept-grid\s*\{/);
```

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because archive styles are not defined and `.concept-grid` remains.

- [ ] **Step 3: Replace the old concept styles**

Remove `.short-drama-reel`, `.short-drama-reel-heading`, `.concept-grid`, `.concept-frame`, `.short-drama-archive`, and `@keyframes short-drama-reveal`. Add:

```css
.production-archive { margin-top: clamp(2.5rem, 5vw, 4.5rem); padding-top: clamp(2rem, 4vw, 3.5rem); border-top: 1px solid var(--rule); }
.production-archive-heading { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: clamp(1.5rem, 3vw, 2.5rem); color: var(--muted); font-size: 0.72rem; }
.production-archive-heading p { margin: 0; }
.production-scene-record { display: grid; grid-template-columns: minmax(12rem, 0.72fr) minmax(0, 1fr); align-items: center; gap: clamp(1.25rem, 4vw, 4rem); max-width: 56rem; margin-left: auto; }
.production-scene-frame, .production-evidence-frame, .production-shot-record { margin: 0; overflow: hidden; border: 1px solid var(--rule); background: #050505; }
.production-scene-frame { width: min(100%, 16rem); }
.production-scene-frame img { display: block; width: 100%; aspect-ratio: 4 / 5; object-fit: cover; filter: saturate(0.82) contrast(1.05); }
.production-scene-record h3 { margin: 0 0 0.8rem; font-size: clamp(1.7rem, 3.3vw, 3rem); line-height: 1.04; letter-spacing: -0.055em; }
.production-scene-record h3 em { color: var(--signal); font-style: normal; }
.production-scene-record p { max-width: 28rem; margin: 0; color: var(--muted); line-height: 1.8; }
.production-character-records { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; max-width: 56rem; margin: clamp(1.25rem, 3vw, 2rem) 0 0 auto; }
.production-evidence-frame img, .production-shot-record img { display: block; width: 100%; object-fit: cover; filter: saturate(0.72) contrast(1.05); transition: transform 560ms ease, filter 180ms ease; }
.production-evidence-frame img { aspect-ratio: 16 / 9; }
.production-shot-record { width: min(100%, 42rem); margin: 0.75rem 0 0 auto; }
.production-shot-record img { aspect-ratio: 16 / 9; }
.production-evidence-frame figcaption, .production-shot-record figcaption { padding: 0.65rem 0.75rem; color: var(--muted); font-size: 0.68rem; line-height: 1.5; }
@media (hover: hover) and (pointer: fine) { .production-scene-frame:hover, .production-evidence-frame:hover, .production-shot-record:hover { border-color: var(--rule-strong); } .production-evidence-frame:hover img, .production-shot-record:hover img { transform: scale(1.012); filter: saturate(0.88) contrast(1.08); } }
```

At `@media (max-width: 760px)`, add:

```css
.production-archive-heading, .production-scene-record { display: grid; }
.production-scene-record { grid-template-columns: 1fr; }
.production-scene-frame { width: min(100%, 14rem); }
.production-character-records { grid-template-columns: 1fr; }
.production-shot-record { width: 100%; }
```

Delete the old archive selectors from the reduced-motion block; global figure rules already handle reduced motion.

- [ ] **Step 4: Run test and build**

Run: `npm test`

Expected: PASS, including `vinext build` and `tests/rendered-html.test.mjs`.

- [ ] **Step 5: Check that old generated concepts are gone**

Run: `rg -n "short-drama-wedding-reversal|short-drama-second-chance|short-drama-urban-choice|short-drama-production-archive|concept-grid|short-drama-reel" app tests`

Expected: no matches.

- [ ] **Step 6: Commit styles and test checks**

```bash
git add app/globals.css tests/rendered-html.test.mjs
git commit -m "style: lay out real production archive"
```

### Task 4: Validate visuals and publish

**Files:**
- Modify: none unless a focused verification failure requires a source correction.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: GitHub Pages-ready output and a pushed `main` branch.

- [ ] **Step 1: Inspect desktop and narrow responsive layouts**

Run `npm run dev` and inspect the projects section. Confirm card alignment, a scene image narrower than the adjacent text, two contained character sheets, a final wide storyboard, and no horizontal overflow on a narrow viewport.

- [ ] **Step 2: Create the Pages export**

Run: `npm run export:github-pages`

Expected: success with all four `production-*` assets copied into the export output.

- [ ] **Step 3: Commit a focused correction only if verification required one**

Stage only source files changed by the correction; never stage `.superpowers/`.

- [ ] **Step 4: Publish the validated branch**

Run: `git push origin HEAD:main`

Expected: successful push and GitHub Pages deployment trigger.
