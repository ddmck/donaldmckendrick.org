# Personal Site Working Agreement

This repository is a small static personal site with one unusual product feature: the **Slop Slider** progressively changes the visual treatment, copy tone, assistant response style, and knowledge-map framing. Treat it as one coordinated system, not as four unrelated themes.

Read [STYLE_GUIDE.md](STYLE_GUIDE.md) before changing layout, color, typography, motion, copy, or Slop behavior.

## Product intent

- Level 0 must remain a credible, restrained personal site that works without the joke.
- Levels 1–3 progressively satirize AI/consulting marketing language.
- The joke must never make a real credential, employer, date, metric, privacy claim, or capability ambiguous.
- The same selected Slop level persists across pages and must have a coherent meaning everywhere.
- Accessibility, mobile usability, and reduced-motion support apply at every level, including Chaos.

## Repository map

| File | Responsibility |
| --- | --- |
| `index.html` | Home, services, selected work, and shared Slop dock markup |
| `resume.html` | Canonical human-readable résumé and shared Slop dock markup |
| `ask.html` | On-device assistant UI and its compact response-style control |
| `map.html` | Knowledge-map shell and its compact Slop control |
| `script.js` | Shared theme/Slop state, stage definitions, copy variants, persistence, and mobile navigation |
| `styles.css` | Base design system plus all page and Slop-tier styling |
| `ask.js` | Assistant facts, response-tone instructions, model/session behavior, and Ask interactions |
| `map.js` | Map facts, nodes, edge-label variants, stage-aware rendering, and map interactions |
| `assets/` | Résumé PDF and preview image |

## Non-negotiable implementation rules

### Preserve one four-stage model

The only supported stages are:

0. `clean` — **None**
1. `subtle` — **Subtle**
2. `awful` — **Awful** / “Delightfully awful”
3. `chaos` — **Chaos** / “Total chaos”

Do not add a page-specific fifth level, rename a stage in one surface only, or reinterpret a level for one page. If the stage model changes, update all of these together:

- `SLOP_STAGES` and `COPY_VARIANTS` in `script.js`
- tier selectors and Slop custom-property behavior in `styles.css`
- `TONES` in `ask.js`
- stage-indexed labels, status messages, and visibility rules in `map.js`
- the range input, output label, and early boot script in every HTML page
- the stage contract in `STYLE_GUIDE.md`

Keep the storage key `donald-slop-stage` and the legacy migration from `donald-slop-level` unless a deliberate migration plan replaces both.

### Keep facts synchronized

Professional facts appear in several forms. When a real fact changes, audit every relevant location:

1. Clean source copy in `index.html` and `resume.html`
2. All three matching entries in `COPY_VARIANTS` in `script.js`
3. The `REFERENCE` facts in `ask.js`
4. Relevant `NODES`, details, and edge language in `map.js`
5. `assets/resume-donald-mckendrick.pdf` and `assets/resume-preview.png`, when the résumé artifact changes

Do not silently “improve” dates, numbers, titles, organization names, or claims while rewriting tone. Levels 1 and 2 must preserve the same facts as Level 0. Level 3 may add impossible satire only when it is unmistakably fictional; preserve the real fact in or near the joke when practical.

### Add Slop-aware copy as a complete unit

For visible copy that should transform:

1. Put the factual Level 0 text in HTML.
2. Add a stable, descriptive `data-slop-copy` key.
3. Add exactly three variants to `COPY_VARIANTS`, ordered Subtle, Awful, Chaos.
4. Check the text at mobile width; later stages often run longer.

If copy should never change—legal/privacy explanations, accessibility labels, safety instructions, or essential wayfinding—leave it outside `COPY_VARIANTS` unless there is a strong product reason.

### Use the existing system before adding new styling

- Reuse the variables at the top of `styles.css` and the existing violet/cyan/pink Slop palette.
- Prefer fluid sizing, the existing page measures, and established responsive breakpoints.
- Add progressive treatment to an existing semantic element before inventing a new decorative component.
- Avoid adding cards at Clean or Subtle. Cards/glass treatments are part of the Awful/Chaos satire, not the base visual language.
- Keep stage-specific CSS under explicit `data-slop-tier` selectors. Base selectors must describe Level 0.
- Any new animation needs a purpose, must not block interaction, and must be disabled under `prefers-reduced-motion: reduce`.

### Preserve shared behavior and accessibility

- Each page must be useful at Level 0 when JavaScript fails.
- Keep range inputs keyboard operable and their `aria-valuetext` synchronized with the visible label.
- Keep focus states visible in both themes and every Slop level.
- Never use color, animation, or fictional styling as the only disclosure that a claim is invented.
- Decorative Slop elements must remain `aria-hidden="true"` and non-interactive.
- Do not let the fixed Slop UI cover content or controls at desktop, mobile, zoomed text, or safe-area insets.
- Printing must reset to Clean, as implemented by `beforeprint`/`afterprint` in `script.js`.
- The Ask page must continue to reset the model session when tone changes; otherwise an old system prompt may leak into the new level.

## Required change workflow

Before editing, identify which systems the change touches: base visual language, shared Slop state, copy variants, Ask tone, map framing, or facts. Make the smallest coherent cross-page change.

After editing:

1. Search for the changed copy, fact, stage label, class, or key across the entire repository.
2. Confirm every `data-slop-copy` key used in HTML has a matching `COPY_VARIANTS` entry unless intentionally static.
3. Confirm each copy-variant array has exactly three entries.
4. If `styles.css`, `script.js`, `ask.js`, or `map.js` changed, update the relevant `?v=` cache-busting query strings on **every page that loads that file**.
5. Serve the repository over HTTP; do not rely only on opening `file://` URLs.
6. Test all four levels on Home, Résumé, Ask, and Map in both light and dark themes.
7. Test at approximately 1440 px desktop, 390 px mobile, and 200% browser zoom.
8. Test keyboard navigation, visible focus, slider arrow keys, mobile navigation, and reduced motion.
9. Check the browser console at each page and exercise the primary page interaction, not only initial rendering.

For a simple local server, run:

```sh
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000/`.

## Definition of done

A design or copy change is complete only when:

- Clean remains truthful, restrained, and usable.
- The progression between adjacent levels is noticeable without feeling like a different product.
- Copy, visuals, Ask tone, and Map framing express the same level of escalation.
- Shared facts and repeated controls are synchronized.
- Mobile, keyboard, dark mode, reduced motion, printing, and JavaScript-failure behavior remain sound.
- Relevant cache-busting versions have been updated.

