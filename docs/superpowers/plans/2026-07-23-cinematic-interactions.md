# Cinematic Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stabilize the project visual grid and add accessible archival-style scroll, navigation and hover feedback.

**Architecture:** A client-only `CinematicInteractions` component observes existing semantic sections and applies state classes. CSS owns every visual transition and reduced-motion override; the existing server-rendered résumé stays the source of content.

**Tech Stack:** React, Next.js, CSS, IntersectionObserver, Node tests.

## Global Constraints

- Animation alters only opacity, color, border and at most 12px transform; it does not alter layout metrics.
- Short-drama reel spans the project grid and has its own nested grid.
- Reduced-motion disables all new animation.

---

### Task 1: Add a failing interaction contract and source integration

**Files:**
- Create: `app/components/cinematic-interactions.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/rendered-html.test.mjs`

- [ ] **Step 1: Write a failing test**

Assert rendered markup includes `reading-progress`, `data-reveal`, and `short-drama-reel`; assert CSS contains `.is-revealed`, `.nav-links a[aria-current="true"]`, and a reduced-motion rule for reveal transitions.

- [ ] **Step 2: Run focused test**

Run: `npm run build; node --test --test-name-pattern="cinematic interaction" tests/rendered-html.test.mjs`

Expected: FAIL because the progress element and reveal classes do not exist.

- [ ] **Step 3: Implement minimal component and styles**

Create a client component using `IntersectionObserver` to toggle `.is-revealed`, update `[aria-current]` on nav links, and set a CSS variable for `#reading-progress`. Add `data-reveal` to semantic sections; set short-drama reel `min-width: 0` and preserve `grid-column: 1 / -1`.

- [ ] **Step 4: Verify and publish**

Run: `npm test; git add app tests; git commit -m "feat: add cinematic interactions"; git push origin HEAD:main`.

Expected: all tests pass and public main advances.
