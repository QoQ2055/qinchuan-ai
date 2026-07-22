# Director Storyboard Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two restrained AI-animation storyboard interludes that give the résumé a director-portfolio rhythm without reducing readability.

**Architecture:** `app/page.tsx` owns semantic interlude markup and alternatives. `app/globals.css` owns layout, low-contrast page texture, responsive stacking, and motion preferences. Generated raster assets reside in `public/images`, while rendered-HTML tests enforce content and CSS safeguards.

**Tech Stack:** Next.js, React, CSS, Node test runner, built-in image generation, GitHub Pages static export.

## Global Constraints

- Keep the black cinematic archive base; do not use figurative storyboard art as a repeated full-page background.
- Generate exactly two horizontal 16:9, text-free, watermark-free AI animation storyboard images.
- Existing project-card imagery stays contextual only; its CSS opacity must not exceed `0.18`.
- HTML copy remains the source of all factual résumé information.
- Narrow screens use a single readable column and reduced-motion disables transitions.
- Add no runtime dependencies.

---

### Task 1: Define rendered-content expectations

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: current rendered home-page HTML and CSS strings in `tests/rendered-html.test.mjs`.
- Produces: `storyboard-interlude--script` and `storyboard-interlude--rhythm` contracts, alternatives, responsive styles, and motion-preference styles.

- [ ] **Step 1: Write the failing test**

Add this Node assertion block to `tests/rendered-html.test.mjs`:

```js
test("renders semantic storyboard interludes with restrained visual rules", () => {
  assert.match(html, /storyboard-interlude--script/);
  assert.match(html, /storyboard-interlude--rhythm/);
  assert.match(html, /纸本分镜、角色设定与监看屏组成的动画制作档案/);
  assert.match(html, /动画分镜、色彩脚本与剪辑时间轴组成的制作档案/);
  assert.match(css, /\.project-dossier--science::before,[\s\S]*?opacity:\s*0\.18;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /\.storyboard-interlude\s*\{[\s\S]*?grid-template-columns:/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `node --test --test-name-pattern="renders semantic storyboard interludes" tests/rendered-html.test.mjs`

Expected: FAIL because neither interlude exists.

- [ ] **Step 3: Implement semantic interlude markup and visual rules**

After the work-experience section, insert this figure and its image path:

```tsx
<figure className="storyboard-interlude storyboard-interlude--script">
  <figcaption>
    <p className="section-index">制作档案 / 01</p>
    <h3>从脚本，到<br /><em>镜头语言。</em></h3>
    <p>以角色、场景与镜头规划，让 AI 制作进入可控的叙事流程。</p>
  </figcaption>
  <img src="/images/storyboard-script-to-shot.png" alt="纸本分镜、角色设定与监看屏组成的动画制作档案" />
</figure>
```

Add a second, mirrored `storyboard-interlude--rhythm` figure after the project cards and before credentials. Its image must be `/images/storyboard-rhythm-archive.png` and its `alt` must be `动画分镜、色彩脚本与剪辑时间轴组成的制作档案`. In CSS, use a desktop two-column grid, a single-column `max-width: 760px` rule, `overflow: hidden` on the image frame, and a reduced-motion media query that disables transitions. Change project-image pseudo-element opacity from `.25` to `.18`.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `node --test --test-name-pattern="renders semantic storyboard interludes" tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the test-first contract**

```powershell
git add tests/rendered-html.test.mjs app/page.tsx app/globals.css
git commit -m "test: cover director storyboard interludes"
```

### Task 2: Generate and stage the two storyboard assets

**Files:**
- Create: `public/images/storyboard-script-to-shot.png`
- Create: `public/images/storyboard-rhythm-archive.png`

**Interfaces:**
- Consumes: the exact source paths introduced by Task 1.
- Produces: two locally versioned wide PNGs with no text, logos, or watermarks.

- [ ] **Step 1: Generate the script-to-shot asset**

Use the built-in image generator with this prompt:

```text
Wide 16:9 editorial cinematic production archive for an AI animation director: a dark worktable with paper storyboard panels, character turnaround sketches, a small monitor showing a non-identifiable animated action silhouette, timecode strips and a few pencil tools; monochrome charcoal, warm ivory paper, faint olive-lime signal accents, restrained museum editorial composition, generous negative space, no readable words, no letters, no logos, no watermark, no border.
```

- [ ] **Step 2: Generate the rhythm-archive asset**

Use the built-in image generator with this prompt:

```text
Wide 16:9 editorial cinematic production archive for an AI animation director: an overhead contact sheet of multiple hand-drawn animation frames, color-script swatches, a simple non-readable editing timeline, small monitor glow and film-strip fragments; black, graphite and warm ivory palette with one subtle olive-lime accent, quiet premium magazine art direction, non-identifiable characters only, no readable words, no letters, no logos, no watermark, no border.
```

- [ ] **Step 3: Inspect and copy selected outputs**

Visually inspect both images, then copy the chosen source PNGs to their exact `public/images` destinations without touching unrelated assets.

- [ ] **Step 4: Verify assets exist**

Run: `Get-Item public/images/storyboard-script-to-shot.png, public/images/storyboard-rhythm-archive.png | Select-Object Name, Length`

Expected: both files exist and have non-zero lengths.

- [ ] **Step 5: Commit generated assets**

```powershell
git add public/images/storyboard-script-to-shot.png public/images/storyboard-rhythm-archive.png
git commit -m "feat: add director storyboard archive imagery"
```

### Task 3: Complete source integration and export verification

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: the assets from Task 2 and CSS class names from Task 1.
- Produces: an accessible responsive layout whose static export resolves both images below `/qinchuan-ai/`.

- [ ] **Step 1: Write the export-path assertion**

Add these assertions to the test introduced in Task 1:

```js
assert.match(html, /src="\/images\/storyboard-script-to-shot\.png"/);
assert.match(html, /src="\/images\/storyboard-rhythm-archive\.png"/);
assert.doesNotMatch(css, /body[^{]*\{[^}]*background-image:[^}]*storyboard-/);
```

- [ ] **Step 2: Run all tests before export**

Run: `npm test`

Expected: PASS with no failed Node tests.

- [ ] **Step 3: Build the static GitHub Pages export**

Run: `npm run export-github-pages`

Expected: exported markup rewrites both image paths to `/qinchuan-ai/images/...`.

- [ ] **Step 4: Inspect the exported page**

Run: `rg -n "storyboard-(script-to-shot|rhythm-archive)" out/index.html`

Expected: both paths use the `/qinchuan-ai/images/` base path.

- [ ] **Step 5: Commit production integration**

```powershell
git add app/page.tsx app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: compose director storyboard archive"
```

### Task 4: Publish and verify the public site

**Files:**
- Modify: generated deployment state only through the existing GitHub Pages workflow.

**Interfaces:**
- Consumes: passing export from Task 3.
- Produces: updated remote `main` and an accessible public website.

- [ ] **Step 1: Push the completed branch to the deployment branch**

Run: `git push origin HEAD:main`

Expected: remote `main` advances successfully.

- [ ] **Step 2: Verify desktop rendering**

Reload `https://qoq2055.github.io/qinchuan-ai/` without cache. Confirm both interludes load and project copy remains readable.

- [ ] **Step 3: Verify narrow-screen rendering**

At a `390px` viewport, confirm each interlude is one column with no horizontal page overflow.

- [ ] **Step 4: Record the handoff**

Report the public URL, both saved workspace image paths, final generator prompts, and completed verification commands.
