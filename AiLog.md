# 🤖 AI Conversion Guide

## ⚙️ Standardized Conversion Process (single repeatable flow)

Follow this exact procedure for every export to guarantee consistency and maintainability.

Pre-flight checks
- Verify the target folder in `exports/` exists and contains the original `index.html`/`.html`, `style.css`/`.css`, and `script.js`/`.js` files.
- Do not edit anything inside `exports/` — treat it as the canonical source.
- Make sure the next item in the checklist is `Pending` and not already being worked on by someone else.

Conversion contract (what you must produce)
- A React component file: `app/components/<export-name>/<ExportName>.js` (JavaScript-only React component; no JSX extension required).
- A scoped CSS Module in the same folder: `ComponentName.module.css` (use CSS Modules; no global selectors except deliberate, documented exceptions).
- Optional: a data file in `app/data/<export>-data.js` used only for local testing (never ship static data inside the component itself).
- No runtime scripts loaded from `exports/` — port behavior into the React component (useEffect + refs).

Step-by-step conversion

1) Read and understand the original files
- Open the original HTML, CSS and JS. Trace selectors used in JS and CSS. Note any external libraries (GSAP, Anime.js, etc.).
- Identify the root container (the top-level element wrapper) and all interactive elements (nav, dots, arrows, images).

2) Create component folder & files
- Create `app/components/<export-name>/` (kebab-case folder name matches `exports/<export-name>`).
- Create the React file: `app/components/<export-name>/<ExportName>.js`.
  - The component must be data-free: accept a `slides` prop (or appropriate props) and render only from props/state.
  - Do NOT hardcode images, text arrays, or demo data inside the component.
  - Keep markup identical to original (class names can be converted to CSS Module keys).

3) Convert HTML → JSX/React (HTML-only pass)
- Render the original DOM structure using React elements and the `slides` prop.
- DO NOT add behavior or data in this pass — this file is purely structural.
- Use plain `<img>` tags if you must match the original markup (suppress lint rule if needed). We can optimize with `next/image` later if desired.

4) Convert CSS → CSS Module (scoped)
- Create `ComponentName.module.css` in the same folder.
- Convert selectors to local class names (remove :global wrappers). Example: `.slide` remains `.slide` in the module, and JS references it as `styles.slide`.
- Avoid universal selectors (`*`) and global resets inside modules — put global resets only in `app/globals.css` if necessary.
- Respect Turbopack/Next.js rules: CSS Modules require at least one local class per selector (no pure `*`, no ambiguous selectors).

5) Wire CSS Module into component
- Import styles: `import styles from './ComponentName.module.css'`.
- Replace class strings with module mappings: `className={styles.slide}` or `className={
  

}` (use template or classnames helper).

6) Port JavaScript behavior (if required)
- Move original JS logic into the component using `useEffect`, `useRef`, and `useState` as appropriate.
- Scope DOM queries to the component: use a `containerRef` and `containerRef.current.querySelectorAll(...)` instead of document-level selectors.
- Prefer state-driven class application (`setState` → render `className`) rather than manual `classList` toggles when possible. When imperative DOM mutation is necessary (performance/complex animation), use refs and guard accesses with defensive checks.
- Keep timing logic (intervals/timeouts) in refs so you can clear them on unmount.

7) Data & testing harness
- For local testing only, add a small test data file in `app/data/<export>-data.js` and import it into `app/page.js` to render the component during development. Do NOT keep that test data inside the component file.

8) Accessibility & performance checks
- Ensure images have alt text, interactive elements are keyboard-accessible, and focus styles are preserved.
- Avoid blocking the main thread on mount; prefer CSS transitions or requestAnimationFrame for paint-sensitive updates.

9) Validation (quality gates)
- Build: `npm run dev` — must compile without errors.
- Lint/typecheck: run `npm run lint` (or your project's linter); fix reported issues unless false positives.
- Quick visual test: open page, inspect `.slide-content` computed styles (verify owner file is the component module file).

10) Cleanup & commit
- Remove console.logs, debug CSS overrides, or temporary inline style hacks.
- Ensure the CSS Module contains only rules used by the component.
- Update `AiLog.md` conversion checklist: mark item `Done`, add notes (what changed, any deviations, libraries used).

Failure policy
- If the build or visual checks fail, iterate up to 3 quick fixes (CSS scoping, index of affected selectors, or timing adjustments). If unresolved after 3 attempts, create a short issue in the repo and move to the next item.

Commands (dev/test)
```powershell
npm run dev
# open http://localhost:3000
```

     * Same colors
     * Same fonts
     * Same animations
     * Same structure and layout
     * Same or improved **responsiveness**

9. After completing the conversion:

   * Go to the **Home** page and `import` the new component for testing.
   * Make sure the component looks and behaves the same across different screen sizes (mobile, tablet, desktop).
   * Once confirmed, open **`AiLog.md`** again and change the status from `Pending` → `Done`.

---

## 🎞️ Animation & UI Rules

* Follow the **exact same animation method** used in the original files.
* If animations are done with **CSS**, keep them as CSS keyframes or transitions.
* If animations are done with **JavaScript**, move that logic into a `useEffect` in React with the same timing and easing.
* If the original uses libraries like **GSAP**, **Anime.js**, or **Three.js**, use the **same ones** in React.



## 📦 Data & Props Rules

* 🧱 All data must be **dynamic via props**, not hardcoded.
* 🚫 Never include static text, arrays, or images directly inside the component (unless they are part of the layout itself).
* ✅ Test data should be stored inside **`/app/data/`** folder.
* ✅ Everything displayed on the UI should be controlled via props or state.
* ✅ No fetch calls, APIs, or local storage logic allowed.


---

## 📊 Progress Tracker

### Total Folders: 132
### Completed: 22
### In Progress: 3
### Pending: 107

---

## 📋 Conversion Checklist

| # | Folder Name | Status | Notes |
|---|-------------|--------|-------|
| 1 | 2-in-2021-welcome-css-stylus-pug | ✅ | Done |
| 2 | 3d-card-slidergsap | ✅ | Done |
| 3 | a-dribble-design-implementation | ✅ | Done |
| 4 | a-simple-food-card | ✅ | Done |
| 5 | add-to-cart-animation | ✅ | Done |
| 6 | anchor-navigation-to-scrolltriggered-section | ✅ | Done |
| 7 | animated-continuous-sections-with-gsap-observer | ✅ | Done |
| 8 | animated-image-slider-html-css-javascript | ✅ | Done |
| 9 | animated-slider-webpage | ✅ | Done |
| 10 | anime-js-v3-logo-animation | ✅ | Done |
| 11 | asian-food-website | ✅ | Done |
| 12 | autoplay-slider-pause-control-swiper-js | ✅ | Done | issue !!❌
| 13 | blob-carousel-for-the-planet | ✅ | Done | ms7tha !!
| 14 | card-carousel | ✅ | Done |
| 15 | cards-with-inverted-border-radius-scss | ✅ | Done - converted and scoped; responsive fixes applied |
| 16 | carousel-with-hover-effect | ✅ | Done 
| 17 | center-mode-productivity-slider-pro-v5 | ✅ | Done 
| 18 | circle-square-triangle-dolphin | ✅ | Done  | ms7tha !!
| 19 | clean-slider-with-curved-background | ✅ | issue !!❌
| 20 | clip-path-hover-effect | ✅ | Done |
| 21 | clip-path-revealing-slider | ✅ | Done |
| 22 | codepen-challenge-reflection | ✅ | Done |
| 23 | codepen-home-logo-to-header-galleryscrollsmoother-by-louis-hoebregts | ✅ | Done | ms7tha !!
| 24 | codepenchallenge-card-carousel | ✅ | Done | ms7tha !!
| 25 | contrast-text-color-on-image | ✅ | Done | ms7tha !!
| 26 | cpchallenge-slideshow-modern-1 | ✅ | Done | 
| 27 | cpchallenge-slideshow-modern-2 | ✅ | Done | Converted and JS ported into component |
| 28 | creative-food-carousel | ✅ | Done | Converted to React component with Swiper.js, parallax effects, and CSS Module; pagination fixes applied and pushed (commit cc43439) |
| 29 | css-3d-carousel-room | ✅ | Done


| 30 | css-block-revealing-effect | ✅ | Done
| 31 | css-carousel | ✅ | Done | ms7tha !!
| 32 | css-carousel-with-keyboard-controls | ❌ | Pending |
| 33 | css-filtersadabtive-cards | ❌ | Pending |
| 34 | css-infinite-autoplay-carousel | ❌ | Pending |
| 35 | css-infinite-scroll-gallery | ❌ | Pending |
| 36 | css-only-image-carousel-no-really | ❌ | Pending |
| 37 | css-only-ink-splash-video-manipulation-css-effect | ❌ | Pending |
| 38 | css-only-marquee-with-slow-on-hover | ❌ | Pending |
| 39 | css-sliderpure-css10 | ❌ | Pending |


| 40 | cyber-scrollgsap | ❌ | Pending |
| 41 | draggable-masthead-reveal | ❌ | Pending |
| 42 | dynamic-carousel-slider-with-infinite-scoll | ❌ | Pending |
| 43 | dynamic-content-lockups-v2open-props | ❌ | Pending |
| 44 | expandable-animated-card-slider | ❌ | Pending |
| 45 | expanding-flex-cards | ❌ | Pending |
| 46 | eyes-mousemove | ❌ | Pending |
| 47 | fancy-slider | ❌ | Pending |
| 48 | food-card-grid-layout | ❌ | Pending |
| 49 | full-screen-slider-gsap-timeline-1 | ❌ | Pending |


| 50 | full-slider-prototype | ❌ | Pending |
| 51 | gallery-3dcssinfinitehover | ❌ | Pending |
| 52 | getting-familiar-with-anime-js-line-drawing | ❌ | Pending |
| 53 | greensock-animated-slideshow-wip | ❌ | Pending |
| 54 | gsap-infinite-draggable-image-gallery | ❌ | Pending |
| 55 | gsap-landing-page | ❌ | Pending |
| 56 | gsap-slideshow-vertical-warp-slideshow-n-1 | ❌ | Pending |
| 57 | gsap-slideshow-vertical-zoom-slideshow-n-2 | ❌ | Pending |
| 58 | gsap-slideshow-vertical-zoom-slideshow-n-3 | ❌ | Pending |
| 59 | gsap-starter-template | ❌ | Pending |


| 60 | hexa-team | ❌ | Pending |
| 61 | horizontal-parallax-sliding-slider-with-swiper-js | ❌ | Pending |
| 62 | horizontal-scroll-effect | ❌ | Pending |
| 63 | how-to-animate-a-coffee-drinking-sprite-with-scrolltrigger | ❌ | Pending |
| 64 | image-overlay-slider | ❌ | Pending |
| 65 | image-parallax | ❌ | Pending |
| 66 | image-slider-ripple-effect | ❌ | Pending |
| 67 | image-zoom-in-with-scrolltrigger | ❌ | Pending |
| 68 | interactive-project-showcase-slider-with-vertical-navigation-rtl-ltr-support | ❌ | Pending |
| 69 | interior-design | ❌ | Pending |


| 70 | intro-grid-section | ❌ | Pending |
| 71 | jumping-between-sectionsscrolltrigger | ❌ | Pending |
| 72 | linear-slider-with-splittext-effect-greensock | ❌ | Pending |
| 73 | liquid-gallerylightbox | ❌ | Pending |
| 74 | marketing-hero-sectionopen-props-v2 | ❌ | Pending |
| 75 | marquee-like-content-scrolling | ❌ | Pending |
| 76 | mother-s-day-svg-animation-responsive | ❌ | Pending |
| 77 | motion-blur-effect-using-svg-filters | ❌ | Pending |
| 78 | neuro-noise-glsl-shader | ❌ | Pending |
| 79 | no-script-accordion-animation | ❌ | Pending |


| 80 | only-css-animation-01 | ❌ | Pending |
| 81 | onscroll-animation-dynamic-content-scroll-with-scrollmagic | ❌ | Pending |
| 82 | orbital-photo-gallery | ❌ | Pending |
| 83 | page-intro-animation | ❌ | Pending |
| 84 | pair-with-css-scroll-snappingscrolltrigger | ❌ | Pending |
| 85 | parallax-bake-shop-card | ❌ | Pending |
| 86 | parallax-carousel-no-libraries | ❌ | Pending |
| 87 | parallax-headerscrolltrigger | ❌ | Pending |
| 88 | parallax-photo-carousel | ❌ | Pending |
| 89 | parallax-scene-on-scrollscrolltrigger | ❌ | Pending |

| 90 | parallax-scroll-animation | ❌ | Pending |
| 91 | perspective-zoom-effect-on-scroll | ❌ | Pending |
| 92 | pixel-per-character-scroll-words-with-css-gsap | ❌ | Pending |
| 93 | pixel-scan-effect-with-vfx-js | ❌ | Pending |
| 94 | premium-portfolio-archivepro-v2-0 | ❌ | Pending |
| 95 | pricingpure-css16 | ❌ | Pending |
| 96 | product-swiper | ❌ | Pending |
| 97 | projects-carousel | ❌ | Pending |
| 98 | pure-css-carousel | ❌ | Pending |
| 99 | pure-css-slider-with-custom-effects | ❌ | Pending |

| 100 | react-slider-w-hover-effect | ❌ | Pending |
| 101 | responsive-gsap-slider-with-button-wave-effect | ❌ | Pending |
| 102 | responsive-image-carousel-animation | ❌ | Pending |
| 103 | responsive-image-slider | ❌ | Pending |
| 104 | responsive-parallax-drag-slider-with-transparent-letters | ❌ | Pending |
| 105 | rotating-3d-gallery-image-filters | ❌ | Pending |
| 106 | scroll-to-view-galleryscrolltrigger | ❌ | Pending |
| 107 | scrollsmoother-explorationcassie-evans | ❌ | Pending |
| 108 | scrollsmoother-scrolltriggerclamp | ❌ | Pending |
| 109 | scrolltrigger-downhill-ski | ❌ | Pending |


| 110 | scrolltrigger-image-zoom | ❌ | Pending |
| 111 | shader-image-transition | ❌ | Pending |
| 112 | skewed-flexbox-panels | ❌ | Pending |
| 113 | slider-gsap-virsion-02 | ❌ | Pending |
| 114 | slider-transition-wip | ❌ | Pending |
| 115 | slider-transitions | ❌ | Pending |
| 116 | slider-with-complex-animation-and-half-collored-angled-text | ❌ | Pending |
| 117 | slider-with-progress-bar-using-setinterval | ❌ | Pending |
| 118 | slides | ❌ | Pending |
| 119 | smooth-3d-perspective-slider | ❌ | Pending |


| 120 | split-headercassie-evans | ❌ | Pending |
| 121 | splittext-words-dancing-in-3d | ❌ | Pending |
| 122 | svg-filter-text-marquees | ❌ | Pending |
| 123 | svg-text-mask-w-video-fill | ❌ | Pending |
| 124 | three-js-3d-model-animation-with-gsap-scrolltriggeruntitled | ❌ | Pending |
| 125 | timed-cards-opening | ❌ | Pending |
| 126 | velo-sliderwith-borders | ❌ | Pending |
| 127 | vertical-image-loop-with-scroll-acceleration-with-gsap | ❌ | Pending |
| 128 | voyage-slider | ❌ | Pending |
| 129 | vue-js-responsive-shuffle-image-gallery | ❌ | Pending |


| 130 | wave-rgb-image-distortion-with-shader | ❌ | Pending |
| 131 | weekly-coding-challenge-1double-slider-sign-in-up-formdesktop-only | ❌ | Pending |
| 132 | yarden-design-by-olya-marchak | ❌ | Pending |

