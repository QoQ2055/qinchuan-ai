# Short Drama Visual Reel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive visual-concept reel for the AI live-action short-drama project, with restrained entrance and hover motion.

**Architecture:** `app/page.tsx` adds semantic concept-frame markup after the live-action short-drama card. `app/globals.css` owns contact-sheet layout and motion. Four generated PNGs live in `public/images`; rendered tests guard labels, asset paths and motion constraints.

**Tech Stack:** Next.js, React, CSS, Node test runner, built-in image generation, GitHub Pages export.

## Global Constraints

- Label generated imagery `Visual Concept Stills / 仿真人短剧视觉概念帧`; never call it actual footage, a poster, or official material.
- Generate three text-free 4:5 photoreal concept frames and one text-free 16:9 production-archive image.
- Add no dependencies; desktop uses three columns and narrow screens use one.
- Motion reveals once within 12px and 80ms stagger; hover scale is at most `1.02`; reduced-motion disables new movement.

---

### Task 1: Test and implement the semantic reel

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: existing project-card grid and reduced-motion CSS.
- Produces: `.short-drama-reel`, `.concept-frame`, and `.short-drama-archive` markup referencing four public images.

- [ ] **Step 1: Write the failing test**

Add a Node test asserting `.short-drama-reel`, `Visual Concept Stills`, all four `short-drama-*.png` paths, `.concept-frame img` aspect ratio `4 / 5`, hover scale `1.02`, and the `prefers-reduced-motion` override.

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm run build; node --test --test-name-pattern="short-drama concept reel" tests/rendered-html.test.mjs`

Expected: FAIL because the reel does not exist.

- [ ] **Step 3: Implement minimal markup and CSS**

Render the reel after `AI仿真人短剧开发`: a `制作档案 / 03` caption, `Visual Concept Stills / 仿真人短剧视觉概念帧`, three figures for wedding reversal, second chance, and urban choice, plus a wide production archive. Use a three-column grid, a 760px single-column rule, one-time 520ms reveal with 80ms stagger, hover scale `1.02`, and an immediate reduced-motion override.

- [ ] **Step 4: Run focused test to verify it passes**

Run: `npm run build; node --test --test-name-pattern="short-drama concept reel" tests/rendered-html.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the integration**

Run: `git add tests/rendered-html.test.mjs app/page.tsx app/globals.css; git commit -m "feat: add short drama concept reel"`

### Task 2: Generate, publish and verify assets

**Files:**
- Create: `public/images/short-drama-wedding-reversal.png`
- Create: `public/images/short-drama-second-chance.png`
- Create: `public/images/short-drama-urban-choice.png`
- Create: `public/images/short-drama-production-archive.png`

**Interfaces:**
- Consumes: exact source paths from Task 1.
- Produces: four inspected assets loaded by static export and public GitHub Pages.

- [ ] **Step 1: Generate the four assets**

Generate four no-text/no-logo/no-watermark images: adult bride making a private wedding decision; adult professional at a dawn crossroads; two adults in a restrained urban-night conversation; a wide production desk with clapper, monitor, script pages, and non-readable edit timeline. All are photoreal cinematic Chinese short-drama concepts, without named people or claims about actual releases.

- [ ] **Step 2: Copy and verify assets**

Copy selected PNGs to the exact destinations, then run: `Get-Item public/images/short-drama-*.png | Select-Object Name, Length`.

Expected: exactly four non-zero files.

- [ ] **Step 3: Run complete verification and export**

Run: `npm test; npm run export:github-pages; rg -n "short-drama-(wedding-reversal|second-chance|urban-choice|production-archive)" github-pages/index.html`.

Expected: all tests pass and all four output paths use `/qinchuan-ai/images/`.

- [ ] **Step 4: Commit and publish**

Run: `git add public/images/short-drama-*.png; git commit -m "feat: add short drama concept imagery"; git push origin HEAD:main`.

Reload the public page and verify all four images load, card copy stays readable, and the narrow-screen CSS remains single-column without document-level horizontal overflow.
