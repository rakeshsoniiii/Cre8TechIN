# Cre8TechIN — For the ones who build

A complete 14-chapter, scroll-driven experience made for the **Cre8TechIN 3D Immersive Web Experience Challenge**. The story moves from curiosity to creation, belonging, proof, and a first step into a real program.

## Run locally

Requires Node.js 20 or newer. No install or build step is needed: runtime libraries are pinned and bundled locally.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Run `npm run check` for the release checks.

## Concept and visual direction

**From spark to something real.** A machined, three-dimensional “8” borrows its angular geometry and gold from the original crest. Its layered construction separates as you scroll into the story. The world then becomes a laptop, a mentor network, and a doorway into your next chapter. Charcoal, warm ivory, one gold accent, and large Bricolage Grotesque typography give the experience an editorial identity. Projects use a staggered gallery rather than three identical cards.

The original gold Cre8TechIN crest is extracted intact from the supplied PDF and used in navigation, the brand reveal, the sample student identity, and the footer. It has not been replaced by an invented logo.

## Story

1. **Entrance:** a real WebGL orbital sculpture, cursor response, and invitation to enter.
2. **Enter the world:** a layered idea studio with Web, AI, and Security directions that change the project prompt.
3. **The problem:** a tutorial-to-project workbench toggles between consuming a tutorial and planning one useful feature.
4. **The reveal:** BUILD. LEARN. LAUNCH. alongside keyboard-accessible process tabs and a scroll-driven visual.
5. **Build:** a modeled laptop, instanced keyboard, and original code-screen texture.
6. **Learn:** a mentor hub and connected knowledge network.
7. **Community:** an original workshop illustration makes the story about people, not only objects.
8. **Possibilities:** keyboard-accessible program tabs and a real program destination.
9. **Projects:** three interactive CSS 3D project concepts with accessible detail dialogs.
10. **Identity:** a personalized, tilting, reversible sample student ID.
11. **Proof:** projects, code review, and earned evidence of work.
12. **Growth:** animated figures grounded in the current Cre8TechIN homepage.
13. **Your turn:** an energetic transition followed by a direct invitation.
14. **The portal:** a single extruded architectural doorway and a link to the real programs page.

## Implementation

- **HTML, CSS, JavaScript:** semantic content stays in the document, separate from the decorative canvas. No frontend framework, backend, or build pipeline is needed.
- **Three.js 0.184.0:** one fixed WebGL renderer, one camera, and four chapter-exclusive scene groups. Procedural geometry avoids model downloads and keeps assets small.
- **GSAP 3.15.0 + ScrollTrigger:** bundled locally from npm. Official GSAP skills are installed in `.agents/skills/gsap-*`. The idea layers, workbench files, and process art use independent, scrubbed timelines. `gsap.matchMedia()` reverts those animations for the pause control, reduced-motion preference, and viewport changes. Interactive content refreshes trigger positions after layout changes.
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

`npm run check` verifies JavaScript syntax, all 14 chapters, unique IDs, internal anchor destinations, required local assets, and the real join destination.

Browser checks also cover idea selection, the workbench toggle, keyboard process navigation, and independent program tabs. Browser checks cover the desktop hero, WebGL initialization, program selection, project details, ID personalization and flipping, motion controls, mobile navigation, and horizontal overflow at 390px and 320px viewports. These are emulated viewport checks, not a physical low-end Android benchmark.

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
