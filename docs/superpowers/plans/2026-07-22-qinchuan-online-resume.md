# 秦川线上简历 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately publish a responsive single-page dark cinematic online resume for AI animation director/producer 秦川.

**Architecture:** Keep resume data static in `app/page.tsx`; use `app/globals.css` for the responsive visual system; use `app/layout.tsx` for Chinese-language and social metadata.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind import layer, Vinext/Cloudflare Sites.

## Global Constraints

- Retain the resume's contact details, role, work history, projects, education and certifications.
- Use `#090909`, `#f2eee6`, and `#d7ff43` as the core palette.
- Do not add authentication, storage, a contact form, external assets, or user uploads.
- Provide accessible anchor navigation and phone/email links.
- Keep the deployment private.

---

### Task 1: Replace starter UI with the resume page

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

**Interfaces:**
- Consumes: static resume source from `F:/下载文件/秦川-动画设计.pdf`.
- Produces: `Home()` rendering sections with IDs `about`, `experience`, `projects`, and `contact`.

- [ ] **Step 1: Write the failing test**

Append identity and anchor assertions to `tests/rendered-html.test.mjs`: `assert.match(html, /秦川/)`; `assert.match(html, /AI动画导演/)`; and a loop requiring each of `about`, `experience`, `projects`, `contact` as an `id` attribute.

- [ ] **Step 2: Verify the test fails**

Run `npm test`. Expected result: FAIL because the starter skeleton has no resume identity or anchor sections.

- [ ] **Step 3: Implement the semantic resume page**

Replace the skeleton import with a `<main>` containing a labelled `<nav>`, a hero `<header>`, and sections `about`, `experience`, `projects`, and `contact`. Add typed `experience` objects with `company`, `role`, `period`, `summary`, and `highlights`, and render every PDF role. Include `秦川`, `AI动画导演 / 制片人`, `11年工作经验`, `北京`, `17326096652`, and `408217203@qq.com`. Set `lang="zh-CN"`, title `秦川｜AI动画导演 / 制片人`, and a matching description.

- [ ] **Step 4: Implement the visual system**

Set CSS tokens `--ink:#090909`, `--paper:#f2eee6`, `--muted:#a7a39c`, and `--signal:#d7ff43`. Implement editorial grid rules, large responsive typography, role-detail cards, focus styles, and a `max-width:720px` breakpoint that collapses hero, experience header, and contact grid to one column.

- [ ] **Step 5: Verify the page test passes**

Run `npm test`. Expected result: PASS with production HTML containing the identity and all four anchors.

- [ ] **Step 6: Commit**

Run `git add app/page.tsx app/layout.tsx app/globals.css tests/rendered-html.test.mjs` followed by `git commit -m "feat: build cinematic online resume"`.

### Task 2: Create and wire the social preview

**Files:**
- Create: `public/og.png`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: final title, palette, role and name from Task 1.
- Produces: a 1200×630 image referenced by `openGraph.images` and `twitter.images`.

- [ ] **Step 1: Generate and verify one preview image**

Generate one landscape image containing `秦川`, `AI动画导演 / 制片人`, and `11年创作与设计经验` in the site palette. Inspect text for legibility and spelling. Retry once only if unusable, then save the accepted image to `public/og.png`.

- [ ] **Step 2: Add social metadata**

Add Open Graph and X metadata in `app/layout.tsx`, use `/og.png` as the image pathname, and derive its absolute URL from the request host.

- [ ] **Step 3: Build and commit**

Run `npm run build`, expecting `dist/server/index.js` and the social image asset. Then run `git add app/layout.tsx public/og.png` and `git commit -m "feat: add resume social preview"`.

### Task 3: Validate and privately publish

**Files:**
- Modify: `.openai/hosting.json`

**Interfaces:**
- Consumes: Tasks 1 and 2, plus a successful production build.
- Produces: a private deployed Sites URL.

- [ ] **Step 1: Run final build**

Run `npm run build`. Expected result: PASS and `dist/server/index.js` exists.

- [ ] **Step 2: Package and save a site version**

Create the Site once, write its returned `project_id` to `.openai/hosting.json`, package the exact committed build, and save one version.

- [ ] **Step 3: Deploy privately and inspect status**

Deploy the saved version with the private deployment operation; poll until status is `succeeded`; open the returned URL for handoff.

## Plan self-review

- Spec coverage: dark visual direction, complete resume data, navigation, responsive layout, metadata, and private publishing are covered by Tasks 1–3.
- Placeholder scan: there is no deferred scope or unnamed interface.
- Type consistency: Task 1 defines `Home()` and the section IDs used by later tasks.
