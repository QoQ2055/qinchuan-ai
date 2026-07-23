# Real Production Archive Design

## Goal

Replace the generated visual-concept imagery attached to the AI live-action short-drama project with the user's own publicly approved production assets. The result should read as a concise, credible production archive: it should prove scene, character, and shot-design capability without turning the résumé into an image gallery.

## Scope

- Retain the existing AI live-action short-drama project text and its position in the project grid.
- Remove the four generated short-drama visual-concept images from the rendered page.
- Add one independent archive after the project grid so media cannot disturb the project-card grid or cause line collisions.
- Use only these approved user-owned assets:
  - `Image (32).jpg`: rain-and-wedding interior scene, primary narrative scene.
  - `Image (1).png`: female character design sheet.
  - `Image (4).png`: male character design sheet.
  - `Image (21).png`: storyboard and shot-planning sheet.
- Preserve the site’s dark editorial language, fluorescent-yellow index labels, restrained borders, and existing motion/accessibility behavior.

## Layout

The archive will have the label `实际制作档案 / 03` and the English support label `Production Evidence / Character, Scene & Shot Design`.

1. **Scene record**: a modest portrait scene frame using `Image (32).jpg`, paired with a concise text block that identifies it as an actual scene-and-narrative production asset. The image remains secondary to the short-drama project description.
2. **Character record**: `Image (1).png` and `Image (4).png` sit in equal landscape frames. Captions describe the evidence as character design, material, costume, and detail consistency rather than inventing story facts.
3. **Shot record**: `Image (21).png` is a single wide frame with a caption describing shot breakdown and camera-planning evidence. Its embedded working annotations remain intact because they are part of the production-process proof.

Desktop uses a two-column archive structure with the scene record and its text on the first row, followed by the character and shot records. The archive’s media has fixed maximum widths and short aspect-ratio frames; it may not expand to a page-wide background. On narrow screens, records stack in the same narrative order: scene, character sheets, then storyboard.

## Components and Data Flow

- `app/page.tsx` will render the project grid with project cards only.
- A sibling production-archive section will render below the grid, preventing a grid child from spanning or affecting unrelated cards.
- `app/globals.css` will replace the old `.short-drama-reel`, `.concept-grid`, `.concept-frame`, and `.short-drama-archive` styling with scoped production-archive classes.
- Assets will be copied to stable, ASCII-named files in `public/images/` and referenced by local URLs. No external asset dependency is introduced.

## Interaction and Accessibility

- Existing scroll-reveal and reduced-motion preferences continue to apply automatically through the existing section/figure behavior.
- Fine-pointer hover may slightly brighten or scale image frames, but no animation is required to understand the content.
- Each image uses an accurate Chinese `alt` description that identifies the asset type, not a fictional plot or generated concept.
- Frame captions remain visible, not hover-only.

## Error Handling

- The archive uses ordinary local image elements. If an asset fails to load, its alt text remains available and the surrounding résumé content remains readable.
- No lazy-loaded dependencies, carousels, or script-driven gallery state are added.

## Verification

- Run the existing test suite and production build.
- Inspect desktop and narrow mobile layouts to confirm project cards remain aligned, every archive image stays within its frame, and the archive stacks without horizontal overflow.
- Confirm the old generated image paths are no longer referenced in page source.
