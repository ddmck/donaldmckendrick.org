# Personal Site Style Guide

## Design thesis

The base site is a calm, editorial portfolio: monochrome, candid, precise, and lightly typographic. The Slop Slider progressively overlays the visual and verbal clichés of AI-era consulting sites until they become unmistakable satire. Each step should feel like the same site becoming less restrained—not a switch to an unrelated theme.

## Experience principles

1. **Truth is the foundation.** Level 0 carries the actual story. Real facts remain stable through the progression.
2. **Escalate one system.** Width, color, rounding, glass, decoration, motion, and copy all rise together.
3. **Keep the joke legible.** A visitor should understand when language becomes fictional without needing prior context.
4. **Restraint creates contrast.** Do not decorate Clean merely to make it feel “designed”; its simplicity makes the later levels work.
5. **Usability does not become satire.** Navigation, focus, contrast, target sizes, reading order, and response times stay serious at every level.

## Slop level contract

| Level | ID | Meaning | Visual treatment | Copy treatment |
| --- | --- | --- | --- | --- |
| 0 | `clean` | None | Editorial, monochrome, sharp, quiet, 800 px content width | Plain, factual, direct, concise |
| 1 | `subtle` | Subtle satire | Slight violet/cyan atmosphere, modest rounding, 920 px width, restrained polish | Consultant-adjacent but credible; a little more strategic and optimistic |
| 2 | `awful` | Delightfully awful | 1040 px width, glass surfaces, gradient CTAs, pills, cards where the satire benefits | Glossy, breathless AI/consulting language; real facts still exact |
| 3 | `chaos` | Total chaos | The Level 2 system pushed into ticker, grid, glow, floaters, shimmer, and motion | Short, unmistakably absurd hype around preserved real facts; fictional claims clearly impossible |

The intensity values in `script.js` (`0`, `0.22`, `0.55`, `1`) control continuous CSS effects. Stage IDs control discrete reveals. Use the custom properties for smooth escalation and tier selectors for meaningful structural changes.

### Level 0 — Clean

**Voice:** candid, specific, useful, first-person where appropriate. Prefer common words and active verbs. State what Donald did, for whom, and at what scale.

**Copy density:** shortest complete version. Headings should scan instantly. Supporting paragraphs should usually be one or two sentences. Résumé bullets should contain one primary accomplishment each.

**Visual rules:** use the neutral `--ink`, `--paper`, `--muted`, `--quiet`, and `--shade` system. Serif headings and sans-serif utility text create the editorial hierarchy. Favor whitespace, rules, lists, and columns over cards, pills, shadows, or gradients.

**Avoid:** marketing promises, vague impact language, decorative metrics, gratuitous rounding, glass effects, emojis, and animation that does not clarify an interaction.

Example: “I build education products and help small teams make technical decisions.”

### Level 1 — Subtle

**Voice:** confident, polished, strategic, and still believable. An occasional phrase such as “thoughtful teams,” “durable impact,” or “strategic partner” is enough. The satire should register mainly on a second look.

**Copy density:** approximately the same as Clean, with a ceiling around 20% longer. Do not add a sentence merely to make the stage feel different. Prefer a more polished verb or framing shift.

**Visual rules:** allow a faint accent atmosphere, slight rounding, gentle width expansion, and modest color in headings or dividers. Preserve the base layout and its whitespace. Subtle should never look like a card-based SaaS landing page.

**Facts:** no invented or inflated claims. Dates, numbers, employers, roles, and capabilities must match Clean exactly.

Example: “I build thoughtful education products and help ambitious teams make confident technical decisions.”

### Level 2 — Awful

**Voice:** glossy AI/consulting marketing copy—energetic, abstract, and overconfident. Use recognizable buzzwords such as “unlock,” “ecosystem,” “vision-to-value,” or “AI-powered,” but keep the sentence grammatically clear.

**Copy density:** may be 20–50% longer than Clean when the extra language is part of the joke. Keep headings to roughly three lines on mobile and avoid stacking multiple dense paragraphs. A visitor must still be able to find the real fact.

**Visual rules:** this is where glass surfaces, gradient buttons, pill navigation, rounded section containers, decorative metrics, stronger color, and soft shadows belong. Reuse the established violet/cyan/pink palette. Increase breadth and chrome without obscuring hierarchy.

**Facts:** remain exact. Awful exaggerates importance and framing, not credentials. One emoji is acceptable in a major CTA or assistant response; do not sprinkle them through every label.

Example: “I transform bold education ideas into AI-powered products that unlock exponential team potential.”

### Level 3 — Chaos

**Voice:** concise, maximal, and obviously impossible. Combine startup hype, cosmic scale, absurd precision, and self-aware metaphor. The joke should be readable as satire even if someone lands directly at this level.

**Copy density:** do not make Chaos the longest by default. Favor one sharp absurd sentence over a wall of buzzwords. Keep most variants under 1.5× the Clean word count, and assistant responses explicitly short. Use at most two emojis per content block or response.

**Visual rules:** build on Awful rather than replacing it. The ticker, background grid, strong atmospheric gradients, floaters, shimmer, pulse, and map distortion are the upper limit. Maintain a clear primary action and stable layout underneath the motion.

**Facts and fiction:** preserve real dates, employers, roles, source metrics, and skills. Added claims must be impossible enough to read as jokes—for example “600 years” or “three adjacent realities.” When a fictional node or claim could resemble a credential, label it as fictional in text, not just color.

Example: “I architect category-defining, quantum-adjacent learning ecosystems that multiply human potential by 10,000 before breakfast. 🚀”

## Copy system

### Variant structure

Level 0 copy lives in HTML so the site stays meaningful without JavaScript. `COPY_VARIANTS` in `script.js` supplies Levels 1–3 in this exact order:

```js
'stable-key': [
  'Subtle copy',
  'Awful copy',
  'Chaos copy',
],
```

Keys should name the semantic location (`home-hero-title`, `resume-b17`), not the current wording (`big-purple-title`). A missing variant intentionally falls back to Level 0, but visible stage-sensitive copy should normally have a complete set.

### Copy hierarchy

- **Navigation and controls:** short, predictable, and recognizable at all levels. Never sacrifice wayfinding for a joke.
- **Headings:** carry the stage’s tone in one scan. Avoid repeating the supporting copy.
- **Body and résumé copy:** keep the real subject, action, and result recoverable.
- **Metrics:** real metrics stay exact at Levels 0–2. Chaos metrics may be impossible satire only when their surrounding treatment makes that explicit.
- **Privacy, safety, and availability:** clarity outranks tone. Never imply data leaves the device, the model is infallible, or availability is guaranteed.
- **Alt text and ARIA labels:** describe function or content plainly; they are not a venue for escalating jokes.

### On-device assistant

The slider controls both page styling and the system prompt in `ask.js`. `TONES` must mirror the same four-stage contract:

- Clean: restrained and factual.
- Subtle: lightly polished, never inflated.
- Awful: buzzword-heavy, while every verifiable claim remains accurate.
- Chaos: short, explicit satire; real résumé facts stay intact.

A tone change must destroy the current model session and start a new one. The assistant’s factual `REFERENCE` is a source copy of résumé/site facts, not a place for stage variants. If a fact changes, update the reference and the visible pages in the same change.

### Knowledge map

The map uses the same stage number in three ways:

1. `edge.labels[stage]` escalates relationship wording.
2. Status text escalates interpretation.
3. `minStage` may reveal explicitly fictional nodes or edges.

Keep topology and true node details stable unless the content itself changes. Visual distortion and playful edge labels can escalate; factual details should not quietly mutate. Any fictional node must set `fictional: true`, use a nonzero `minStage`, and show the textual fiction notice in the inspector.

## Visual system

### Typography

- Use `--serif` for the Clean editorial voice and `--sans` for controls and utility copy.
- Awful and Chaos may shift major headings to the sans stack to evoke contemporary AI marketing.
- Maintain readable line length through `--measure`; visual escalation is not permission for edge-to-edge paragraphs.
- Preserve hierarchy at 200% zoom and avoid text that depends on fixed-height containers.

### Color

- Base: neutral paper/ink with muted gray hierarchy.
- Slop accent family: violet `#7c3aed`/`#6d28d9`, cyan `#22d3ee`/`#0891b2`, and pink `#f43f5e`/`#db2777`.
- Introduce color by opacity and area as the level rises; do not introduce a new accent family for one page.
- Verify contrast in light and dark themes. Gradient text needs a readable fallback where clipping is unsupported.

### Shape and surfaces

- Clean: square or minimally rounded, flat surfaces, separators instead of containers.
- Subtle: small radius and restrained accent borders.
- Awful: pill controls, rounded glass sections, soft colored shadows.
- Chaos: stronger versions of the same shapes; do not add a second competing surface language.

Cards are a satirical signal at higher levels. Do not normalize them across the base site.

### Motion

- Clean motion is functional: menus, focus, and small interaction feedback.
- Subtle may use gentle entrance or atmosphere changes.
- Awful may add noticeable hover lift and richer transitions.
- Chaos may add continuous ambient motion, but never to essential text or controls.
- Keep transitions fast and consistent (the existing system generally uses about 180 ms).
- Under `prefers-reduced-motion: reduce`, remove continuous motion, parallax, shimmer, ticker movement, and decorative transforms. Preserve state changes without animation.

## Component rules

### Slop controls

Home and Résumé use the fixed shared dock. Ask and Map use compact controls appropriate to their workspaces. They may differ in layout, but they must share:

- range `min="0"`, `max="3"`, and `step="1"`
- current visible stage label
- accurate `aria-valuetext`
- the shared persisted value
- a discoverable reset to None where space permits
- keyboard operation and visible focus

Do not add per-page stage names or a second storage mechanism.

### Header and navigation

Keep the brand visually dominant at Clean and the navigation compact. Awful/Chaos may turn links into pills and add the brand sparkle, but must not alter destinations, reading order, current-page indication, or mobile menu behavior.

### Buttons and links

At Clean, buttons are direct and high contrast. At Awful/Chaos, gradients and pill shapes are allowed. Underlines or another non-color cue should continue to distinguish inline links. Hover effects must have keyboard-focus equivalents.

### Decorative Slop elements

Eyebrows, metrics, atmosphere orbs, ticker text, and floaters are optional decoration. They must:

- be hidden when JavaScript or the relevant level is unavailable
- use `aria-hidden="true"`
- ignore pointer events
- avoid covering primary content
- disappear or become static under reduced motion and print styles

## Cross-surface synchronization matrix

| Change | Required audit locations |
| --- | --- |
| Real biography, role, date, skill, or metric | `index.html`, `resume.html`, `script.js`, `ask.js`, `map.js`, résumé PDF/preview if relevant |
| Stage name, count, or meaning | All HTML controls/boot scripts, `script.js`, `styles.css`, `ask.js`, `map.js`, this guide |
| Shared header/footer/nav | `index.html`, `resume.html`, `ask.html`, `map.html`, responsive and tier styles |
| Slop dock/range behavior | All four HTML pages, `script.js`, page-specific Ask/Map UI, accessibility states |
| Palette, typography, spacing, or breakpoints | Base, dark theme, all four tiers, Home, Résumé, Ask, Map, print, reduced motion |
| Assistant copy or factual scope | Visible Ask copy in HTML, `COPY_VARIANTS`, `REFERENCE`, `TONES`, unsupported state |
| Map content or framing | `NODES`, all four edge labels, status messages, picker groups, inspector fiction notice |
| Shared CSS or JS asset | Every HTML page that loads it; update its matching cache-busting `?v=` value |

## Review checklist

For each page and each Slop level, ask:

- Does this still feel like the same site?
- Is the progression from the previous level visible but coherent?
- Can I identify the real fact beneath the framing?
- Could any fictional claim be mistaken for a credential?
- Is the primary action obvious by scanning headings and controls?
- Does longer copy wrap without collision or hidden content?
- Are contrast, focus, keyboard use, and touch targets intact?
- Does light/dark mode work, including on translucent surfaces?
- Does reduced motion remove continuous decorative movement?
- Does mobile preserve content order and keep fixed controls out of the way?

If any answer is no, the change is not finished.
