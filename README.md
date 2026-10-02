# Cre8TechIN — For the ones who build

A complete 12-chapter, scroll-driven experience made for the **Cre8TechIN 3D Immersive Web Experience Challenge**. The story moves from curiosity to creation, belonging, proof, and a first step into a real program.

## Run locally

Requires Node.js 20 or newer. No install or build step is needed: runtime libraries are pinned and bundled locally.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Run `npm run check` for the release checks.

## Concept and visual direction

**From spark to something real.** A machined, three-dimensional “8” borrows its angular geometry and gold from the original crest. Its layered construction separates as you scroll into the story. The world then becomes a laptop, a mentor network, and a doorway into your next chapter. Charcoal, warm ivory, one gold accent, and large Bricolage Grotesque typography give the experience an editorial identity. Projects use a compact three-column desktop gallery that stacks on mobile.

The original gold Cre8TechIN crest is extracted intact from the supplied PDF and used in navigation, the brand reveal, the sample student identity, and the footer. It has not been replaced by an invented logo.

## Story

1. **Entrance:** clear offer, a refined WebGL sculpture, and a direct program CTA.
2. **Programs:** track tabs, published plan prices, format, outcomes, and enrollment guidance.
3. **Idea studio:** choose a starting question across Web, AI, and Security.
4. **Process:** keyboard-accessible Build, Learn, Launch tabs.
5. **Build:** a single scroll-controlled laptop.
6. **Mentors:** feedback flow and attributed official mentor information.
7. **Community:** a clearly labeled workshop illustration.
8. **Projects:** three explicitly illustrative project briefs.
9. **Identity:** a personalized sample ID, stored only in page memory.
10. **Proof:** portfolio and credential outcomes.
11. **Community figures:** source-attributed counts.
12. **Next step:** official enrollment destination, FAQs, and useful footer navigation.

## Implementation

- **HTML, CSS, JavaScript:** semantic content stays in the document, separate from the decorative canvas. No frontend framework, backend, or build pipeline is needed.
- **Three.js 0.184.0:** one fixed WebGL renderer, one camera, and four chapter-exclusive scene groups. Procedural geometry avoids model downloads and keeps assets small.
- **GSAP 3.15.0 + ScrollTrigger:** bundled locally from npm. Official GSAP skills are installed in `.agents/skills/gsap-*`. The idea layers and process art use independent, scrubbed timelines. `gsap.matchMedia()` reverts those animations for the pause control, reduced-motion preference, and viewport changes. Interactive content refreshes trigger positions after layout changes.
- **Anime.js 4.5.0:** bundled from the supplied `anime/` reference, used for staggered hero copy, chapter indicators, dialog content, and program tab transitions.
- **Scroll choreography:** native Web Animations are paused and scrubbed from cached layout positions. Text, manifesto lines, project cards, photo parallax, identity card, and proof art move with scroll in both directions. Reduced motion shows the complete content immediately. Each WebGL object appears in exactly one chapter: sculpture → entrance, laptop → build, network → mentors, doorway → join.
- **Native scrolling:** no scroll hijacking. Cached section bounds determine the chapter, object placement, scale, and rotation. Frame-rate-independent interpolation softens group transitions. Pointer movement adds a small secondary tilt.
- **Tactile controls:** bounded magnetic motion on mouse-only desktop controls, arrow movement, a restrained gold sheen, and press feedback. Touch targets stay stationary and are at least 44 px for primary mobile controls. Remaining copy and controls have scroll reveals; published numeric totals count up with scrolling.
- **CSS 3D:** project artifacts and the two-sided ID use perspective, transforms, and backface culling.
- **Native dialog:** Escape, modal focus containment, accessible labels, backdrop dismissal, and focus restoration.

The main code is in `dist/app.js`, structure in `dist/index.html`, and styling in `dist/style.css`. Edit those files directly. `server.mjs` is a small local static server; production hosting serves `dist/` directly.

## Content integrity

- Program descriptions draw from https://cre8techin.in/programs/ and the supplied challenge.
- The homepage https://cre8techin.in/ publishes **50+ projects** and **20+ mentors**. These are source-attributed figures, not a claim of independently audited or continuously updated counts. Checked September 30, 2026.
- MediChain, SHIELD, and StudyAI are **illustrative concepts named in the brief**, not claimed completed student products. Details describe possible builds. There are no fabricated GitHub or demo links.
- The ID is explicitly a **sample**, not an issued credential. The entered name is held only in the page's memory; it is not stored or sent anywhere. The page has no analytics or submission endpoint.
- Enrollment links open the existing Cre8TechIN programs page. This project does not process applications, payments, or award credentials.

## Performance and responsive strategy

- One renderer and canvas for the whole experience; inactive 3D groups become invisible.
- Geometry and materials are created once. The keyboard uses instancing. Networks have 48 nodes on desktop and 28 on mobile.
- Pixel ratio is capped at 1.75 on desktop and 1.25 on mobile; no bloom pipeline, expensive shadow maps, video, or large 3D assets.
- The renderer requests the low-power GPU profile. Rendering work pauses in hidden tabs.
- Mobile stacks content and reserves space below the opening text for a smaller sculpture. Program/project grids become a single column; navigation becomes an accessible menu.
- `prefers-reduced-motion` is respected on first load and when changed. A persistent page control pauses decorative animation and smooth scrolling. Paused 3D only renders on layout/scroll changes.
- A lightweight CSS sculpture silhouette and readable HTML survive WebGL failure. The content and external navigation remain available without JavaScript; enhanced interactions require JavaScript.
- Fonts are self-hosted WOFF2 files with `font-display: swap`, preload hints, and system fallbacks. The original workshop image is encoded as a roughly 109 KB WebP and lazy-loaded. All runtime assets are local.

## Verification

`npm run check` verifies JavaScript syntax, all 12 chapters, unique IDs, internal anchor destinations, required local assets, and the real join destination.

Browser checks also cover idea selection, expandable FAQs, keyboard process navigation, and independent program tabs. Browser checks cover the desktop hero, WebGL initialization, program selection, project details, ID personalization and flipping, motion controls, mobile navigation, and horizontal overflow at 390px and 320px viewports. These are emulated viewport checks, not a physical low-end Android benchmark.

## Assets and reference use

- `dist/assets/brand-original.jpg`: original logo embedded in the user-supplied challenge PDF. Brand rights remain with the owner.
- `dist/vendor/three*.js`: Three.js 0.184.0, MIT; license included.
- `dist/vendor/gsap.min.js` and `ScrollTrigger.min.js`: GSAP 3.15.0; original notices preserved. See `GSAP-NOTICE.txt` and https://gsap.com/standard-license.
- `dist/vendor/anime.esm.min.js`: Anime.js 4.5.0 from the supplied folder, MIT; license included.
- Bricolage Grotesque and Manrope: self-hosted Latin variable WOFF2 files, downloaded from Google Fonts; SIL Open Font License texts included.
- `dist/assets/workshop.webp`: original AI-generated editorial illustration, made with the built-in image-generation tool. It is not a photograph of an actual Cre8TechIN event or evidence of student participation.
- All scene geometry, project artifact styling, and code-screen artwork are authored for this project.
- Local `ui-ux-pro-max-skill` informed accessibility and responsive interaction; `awesome-design-md` informed restrained dark surfaces and type hierarchy; `saeed-kolivand-portfolio` informed the one-canvas narrative and fallback strategy. No portfolio code or art is copied. Ponytail guided the minimal dependency approach.
- The requested `Leonxlnx/taste-skill` package is installed in `.agents/skills/`, with provenance in `skills-lock.json`. Its redesign and frontend design guidance informed the revised palette, typography, section rhythm, and gallery. Existing functionality and the vanilla stack are preserved.

## Challenges and next improvements

The main challenge is keeping a cinematic canvas synchronized with readable content across very different viewport proportions. The implementation keeps chapter selection separate from rendering and puts content first on mobile. Time-based idle movement intentionally complements the scroll-controlled transitions; it is not a frame-identical scrubbed film.

Before a broad public launch: profile on physical low-end Android hardware, replace concept projects with approved real student case studies, and confirm up-to-date program and community data. A real application form or credential verification system would require an authorized backend.

### Workshop image prompt

Created with the built-in image-generation tool, then encoded as WebP for delivery:

> Create one wide 3:2 cinematic editorial photograph-style illustration for an Indian student builder collective's website, NO TEXT, NO LOGOS. A candid over-the-shoulder crop of three young adult Indian university students collaboratively developing a physical electronics prototype at a late-night creative studio table. Focus on hands, open laptops at angles with abstract non-legible code, a small circuit board, notebooks and desk lamp, faces only partially visible, authentic concentration not posing or looking at camera. Warm amber tungsten practical light from left and soft neutral laptop illumination, charcoal shadows, almost monochrome with restrained gold highlights, tactile film grain, slightly imperfect documentary photography composition. Dark architectural interior, generous shadow negative space on right. High-end independent design publication aesthetic, 35mm lens, no neon, no purple, no sci-fi holograms, no stock-corporate smiles. This is an illustrative scene not evidence of an actual event.

## Deploy

Upload `dist/` to any static host. `.openai/hosting.json` records the private Sites deployment identity. The repository does not contain deployment tokens or secrets.

The GitHub repository is https://github.com/rakeshsoniiii/Cre8TechIN.

### Hover and touch feedback

Feedback is limited to actual controls: buttons, links, inputs, and disclosure summaries. Body copy remains stable and selectable. Scroll animation never reduces reading opacity. Dragging more than 10px or native scrolling cancels press feedback. Keyboard focus and reduced-motion preferences remain supported.

### Design audit revision — 1 October 2026

Programs moved immediately after the hero; the repeated question and hype chapters were removed. Typography, section spacing, mobile labels, gallery layout, FAQ and footer were revised. The sculpture has wider, smoother bevels. Real content links and the 12-chapter sequence are checked by `node check.mjs`; interaction cleanup is checked by `node check-feedback.mjs`.

Published Standard ₹1,499 / Premium ₹4,999 plans, four-week format, and Carel Simon's listed mentor role are attributed to https://cre8techin.in/ (checked 1 October 2026). These are publisher claims, not independent verification. Cohort dates, weekly hours, approved student demo URLs, working mentor profile links, contact details, social profiles and policy URLs remain unavailable in the verified sources. No such details or testimonials have been invented; the UI explains what to confirm before enrollment.

### Course showcase — 2 October 2026

At the user's request, the course section now presents three illustrative beginner courses: AI & Machine Learning Basics, Web Development Fundamentals, and Python Essentials. Course names, 4–6 week durations, and curricula are demo content rather than verified offerings. Real pricing has been removed from this showcase. The section labels this clearly and links separately to the official programs site.

Subtle brightness and gold text glow respond to mouse hover and touch on copy, numbers, and images, alongside existing button feedback. Cards gain a restrained border/background response. Text remains selectable and readable; transforms owned by scrolling are preserved. Reduced-motion and pause settings suppress the added transitions.
