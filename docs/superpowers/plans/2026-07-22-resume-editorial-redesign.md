# Resume Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the online resume into a readable cinematic production dossier with a restrained editorial layout and a public shareable URL.

**Architecture:** Keep the existing Vinext single-page structure and the complete PDF-derived data in `app/page.tsx`. Replace the poster-like hero and heading layout with semantic editorial sections, then rebuild `app/globals.css` around responsive grid, type, and card primitives. The current Sites project and URL remain unchanged; only the access policy becomes public after validation.

**Tech Stack:** React/Vinext, CSS, Node test runner, Sites hosting.

## Global Constraints

- Preserve every experience, project, education, certificate, contact, and factual achievement from the source PDF.
- Keep the near-black, warm-white, and fluorescent-yellow palette; use yellow only as an accent.
- Do not use giant single-character hero text, negative title line-height, or fixed-height mobile sections.
- At 320px, 375px, 768px, 1024px, and desktop widths, text must wrap naturally without overlap or horizontal clipping.
- Publish the existing site with public access after successful validation.

---

### Task 1: Add layout regression coverage

**Files:**
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: SSR bundle at `dist/server/index.js` and source CSS at `app/globals.css`.
- Produces: assertions that fail if the visual system restores poster-sized text or overlap-prone CSS.

- [ ] **Step 1: Write the failing test**

```js
test("uses editorial type rules that cannot collapse title lines", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /--display-leading:\s*1\.0[8-9]/);
  assert.doesNotMatch(css, /line-height:\s*\.7[18]/);
  assert.match(css, /@media \(max-width:\s*720px\)[\s\S]*\.editorial-hero/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because `--display-leading` and `.editorial-hero` do not exist.

- [ ] **Step 3: Add rendering assertions for the new semantic structure**

```js
assert.match(html, /class="editorial-hero"/);
assert.match(html, /class="dossier-entry"/);
assert.match(html, /class="project-dossier"/);
```

- [ ] **Step 4: Run test to verify the structural assertions fail before markup changes**

Run: `node --test tests/rendered-html.test.mjs`

Expected: FAIL because the current rendered page has no dossier classes.

- [ ] **Step 5: Commit the red test**

```bash
git add tests/rendered-html.test.mjs
git commit -m "test: define editorial layout contract"
```

### Task 2: Recompose the resume markup as a production dossier

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: existing `experience` and `projects` arrays without changing their text values.
- Produces: `.editorial-hero`, `.dossier-entry`, and `.project-dossier` elements required by Task 1 and styled by Task 3.

- [ ] **Step 1: Replace the hero shell while retaining exact identity data**

```tsx
<header className="editorial-hero" id="top">
  <p className="kicker">制作档案 / 2026</p>
  <div className="hero-masthead">
    <p className="hero-role">AI 动画导演 / 制片人</p>
    <h1>秦川</h1>
  </div>
  <div className="hero-brief">
    <p>北京 · 11年工作经验</p>
    <p>以导演的镜头判断和制片人的管线意识，把 AI 创意稳定地交付为成片。</p>
    <a href="#contact">合作联系 <span aria-hidden="true">↘</span></a>
  </div>
</header>
```

- [ ] **Step 2: Wrap each experience item in a readable dossier entry**

```tsx
<article className="dossier-entry" key={`${item.company}-${item.role}`}>
  <div className="dossier-meta"><p>{item.period}</p><p>{item.role}</p></div>
  <div className="dossier-body">
    <h3>{item.company}</h3><p className="entry-summary">{item.summary}</p>
    <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
    <div className="entry-details">{item.details.map((detail) => <p key={detail}>{detail}</p>)}</div>
  </div>
</article>
```

- [ ] **Step 3: Use project dossier cards without removing details**

```tsx
<article className="project-dossier" key={title}>
  <p className="project-meta">{meta}</p><h3>{title}</h3><p>{detail}</p>
</article>
```

- [ ] **Step 4: Run the test suite**

Run: `node --test tests/rendered-html.test.mjs`

Expected: title and dossier class assertions remain red until Task 3 provides the CSS contract.

- [ ] **Step 5: Commit markup**

```bash
git add app/page.tsx
git commit -m "feat: compose resume as editorial dossier"
```

### Task 3: Implement responsive editorial layout and typography

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: the class names emitted by Task 2.
- Produces: no-overlap desktop and mobile layout rules covered by Task 1.

- [ ] **Step 1: Define type and spacing tokens**

```css
:root { --display-leading: 1.08; --reading-width: 68rem; --rail-width: 10rem; --ink: #080808; --paper: #f5f1e9; --signal: #c8ff00; }
```

- [ ] **Step 2: Add the editorial hero layout**

```css
.editorial-hero { min-height: auto; padding-block: clamp(4rem, 10vw, 9rem); display: grid; gap: clamp(2rem, 5vw, 5rem); }
.hero-masthead { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 2rem; border-bottom: 1px solid #363636; padding-bottom: 1.25rem; }
.editorial-hero h1 { margin: 0; font-size: clamp(3.5rem, 10vw, 9rem); line-height: var(--display-leading); letter-spacing: -.06em; }
```

- [ ] **Step 3: Add dossier and project reading layouts**

```css
.dossier-entry { display: grid; grid-template-columns: var(--rail-width) minmax(0, 1fr); gap: clamp(1.25rem, 4vw, 4rem); padding-block: 2.5rem; border-top: 1px solid #363636; }
.dossier-body,.entry-details { max-width: var(--reading-width); }.entry-details p { line-height: 1.8; }
.project-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }.project-dossier { min-width: 0; padding: 2rem; border-top: 1px solid #363636; }
```

- [ ] **Step 4: Add mobile rules that remove all compression risks**

```css
@media (max-width: 720px) {
  .editorial-hero { padding-block: 3.5rem; }
  .hero-masthead,.hero-brief,.dossier-entry { grid-template-columns: 1fr; gap: 1rem; }
  .editorial-hero h1 { font-size: clamp(3.25rem, 18vw, 5.5rem); line-height: 1.08; }
  .project-list { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Run build and tests**

Run: `node --test tests/rendered-html.test.mjs && node node_modules/vinext/dist/cli.js build`

Expected: all tests pass and build exits with code 0.

- [ ] **Step 6: Commit style system**

```bash
git add app/globals.css tests/rendered-html.test.mjs
git commit -m "feat: add responsive editorial resume layout"
```

### Task 4: Publish the verified public resume

**Files:**
- Modify: `.openai/hosting.json` only if a hosting binding requires it; otherwise leave it unchanged.

**Interfaces:**
- Consumes: the validated source commit and `dist/` output.
- Produces: the existing URL with public external access.

- [ ] **Step 1: Confirm local source status and build output**

Run: `git status --short && Test-Path dist/server/index.js`

Expected: a clean worktree and `True`.

- [ ] **Step 2: Save and deploy the existing Sites project**

Use the current project ID, push the exact commit with a short-lived write credential, package the verified `dist/` output, save one version, and deploy it.

- [ ] **Step 3: Change access policy to public**

Use the Sites access-policy connector with `access_mode: "public"` for the existing project. Do not create another site or change the URL.

- [ ] **Step 4: Verify deployment and public access**

Use Sites deployment status until `succeeded`, then inspect the returned public access policy.

- [ ] **Step 5: Commit hosting metadata only if it changed**

```bash
git status --short
git add .openai/hosting.json
git commit -m "chore: publish public editorial resume"
```

